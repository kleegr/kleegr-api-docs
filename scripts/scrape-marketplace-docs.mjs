/**
 * scrape-marketplace-docs.mjs
 * Crawls https://marketplace.gohighlevel.com/docs/ using Playwright.
 * Fixed: strict URL filtering, robust content extraction, debug mode.
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import TurndownService from 'turndown';

const BASE_URL = 'https://marketplace.gohighlevel.com';
const DOCS_BASE = `${BASE_URL}/docs`;
const PROJECT = process.cwd();
const DOCS_OUT = join(PROJECT, 'src/content/docs');
const DEBUG = process.env.DEBUG === '1';

// Only scrape URLs that match these patterns
const VALID_DOC_PATTERNS = [
  /\/docs\/oauth\//i,
  /\/docs\/webhook\//i,
  /\/docs\/api\//i,
  /\/docs\/getting/i,
  /\/docs\/introduction/i,
  /\/docs\/overview/i,
  /\/docs\/marketplace/i,
  /\/docs\/custom/i,
  /\/docs\/saas/i,
  /\/docs\/white/i,
  /\/docs\/app/i,
  /\/docs\/billing/i,
];

// Content selectors to try in order
const CONTENT_SELECTORS = [
  '[class*="DocContent"]',
  '[class*="doc-content"]',
  '[class*="docs-content"]',
  '[class*="Content"][class*="main"]',
  '.markdown-body',
  'article',
  '[class*="article"]',
  '[class*="markdown"]',
  '[class*="Markdown"]',
  'main [class*="content"]',
  'main',
];

// Strip these from the page before extracting
const STRIP_SELECTORS = [
  'nav', 'header', 'footer',
  '[class*="Sidebar"]', '[class*="sidebar"]',
  '[class*="Navigation"]', '[class*="navigation"]',
  '[class*="Header"]', '[class*="header"]',
  '[class*="Footer"]', '[class*="footer"]',
  '[class*="Breadcrumb"]', '[class*="breadcrumb"]',
  '[class*="TableOfContents"]', '[class*="toc"]',
  '[class*="Toolbar"]', '[class*="toolbar"]',
  'button', 'script', 'style',
  '[aria-hidden="true"]',
  '[class*="feedback"]', '[class*="Feedback"]',
  '[class*="pagination"]', '[class*="Pagination"]',
];

const PAGE_DELAY_MS = 800;
const TIMEOUT_MS = 25000;
const MAX_PAGES = 300;

// Turndown setup
const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

td.addRule('pre', {
  filter: ['pre'],
  replacement(content, node) {
    const code = node.querySelector('code');
    const lang = code?.className?.match(/language-([\w+-]+)/)?.[1] || '';
    const text = (code?.textContent || node.textContent || '').replace(/\r/g, '');
    return `\n\`\`\`${lang}\n${text.trim()}\n\`\`\`\n`;
  },
});

function urlToSlug(url) {
  return url
    .replace(DOCS_BASE, '')
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9/]/g, '-')
    .replace(/-+/g, '-');
}

function isValidDocUrl(url) {
  if (!url.startsWith(DOCS_BASE)) return false;
  const path = url.replace(BASE_URL, '');
  // Must be under /docs/ and not an API version path like /2021-07-28/
  if (/\/\d{4}-\d{2}-\d{2}\//.test(path)) return false;
  if (path === '/docs' || path === '/docs/') return false;
  // Must have at least one path segment after /docs/
  const afterDocs = path.replace('/docs/', '');
  if (!afterDocs || afterDocs.length < 2) return false;
  return true;
}

function rewriteLinks(md) {
  return md
    .replace(/\[([^\]]+)\]\(https?:\/\/marketplace\.gohighlevel\.com\/docs\/([^)#\s]+)(#[^)]*)?\)/g,
      (_, text, path, hash = '') => `[${text}](/scraped/${path.toLowerCase().replace(/[^a-z0-9/]/g, '-')}${hash})`)
    .replace(/\[([^\]]+)\]\(\/docs\/([^)#\s]+)(#[^)]*)?\)/g,
      (_, text, path, hash = '') => `[${text}](/scraped/${path.toLowerCase().replace(/[^a-z0-9/]/g, '-')}${hash})`);
}

function rebrand(text) {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (i % 2 === 1) return p;
    return p
      .replace(/\bGoHighLevel\b(?![./\w-])/g, 'Kleegr')
      .replace(/\bHighLevel\b(?![./\w-])/g, 'Kleegr');
  }).join('');
}

async function extractContent(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT_MS });
    // Wait for content to render
    await page.waitForTimeout(2000);

    const title = (await page.title())
      .replace(/\s*[-|].*$/, '').trim()
      .replace(/GoHighLevel/g, 'Kleegr').replace(/HighLevel/g, 'Kleegr');

    if (DEBUG) {
      const html = await page.content();
      writeFileSync('/tmp/debug-page.html', html);
      console.log(`\nDEBUG: Saved ${url} to /tmp/debug-page.html (${html.length} bytes)`);
    }

    // Strip nav/header/footer
    await page.evaluate((sels) => {
      sels.forEach(s => {
        try { document.querySelectorAll(s).forEach(el => el.remove()); } catch {}
      });
    }, STRIP_SELECTORS).catch(() => {});

    // Try content selectors
    let html = '';
    for (const sel of CONTENT_SELECTORS) {
      try {
        const el = page.locator(sel).first();
        const count = await el.count();
        if (count > 0) {
          const h = await el.innerHTML({ timeout: 3000 });
          if (h && h.length > 200) { html = h; break; }
        }
      } catch {}
    }

    // Fallback: get everything in body
    if (!html || html.length < 100) {
      html = await page.evaluate(() => {
        const body = document.body;
        return body ? body.innerHTML : '';
      }).catch(() => '');
    }

    if (!html || html.length < 50) {
      return { ok: false, error: 'No content found' };
    }

    let md = td.turndown(html);
    md = md.replace(/\n{3,}/g, '\n\n').trim();
    md = rebrand(md);
    md = rewriteLinks(md);

    return { ok: true, title, md };
  } catch (err) {
    return { ok: false, error: err.message.split('\n')[0] };
  }
}

async function discoverLinks(page) {
  const found = new Set();
  const toVisit = [
    `${DOCS_BASE}/oauth/GettingStarted`,
    `${DOCS_BASE}/oauth/Overview`,
    `${DOCS_BASE}/`,
  ];
  const visited = new Set();

  console.log('\nDiscovering docs pages...');

  while (toVisit.length && found.size < MAX_PAGES) {
    const url = toVisit.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT_MS });
      await page.waitForTimeout(1000);

      const links = await page.evaluate((base) =>
        Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.href.split('#')[0].replace(/\/$/, ''))
          .filter(h => h && h.startsWith(base) && h !== base),
        DOCS_BASE
      ).catch(() => []);

      for (const link of links) {
        if (!found.has(link) && !visited.has(link) && isValidDocUrl(link)) {
          found.add(link);
          toVisit.push(link);
          console.log(`  + ${link.replace(DOCS_BASE, '')}`);
        }
      }
    } catch (err) {
      console.log(`  ! ${url.replace(DOCS_BASE, '')}: ${err.message.split('\n')[0]}`);
    }
  }

  return Array.from(found);
}

async function main() {
  console.log('Kleegr Marketplace Docs Scraper v2');
  console.log('====================================');
  if (DEBUG) console.log('DEBUG MODE ON - saving HTML to /tmp/debug-page.html');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(TIMEOUT_MS);

  // Discover
  const allUrls = await discoverLinks(page);
  console.log(`\nFound ${allUrls.length} doc pages to scrape\n`);

  if (allUrls.length === 0) {
    // Debug: take a screenshot to see what the page looks like
    await page.goto(`${DOCS_BASE}/oauth/GettingStarted`, { timeout: TIMEOUT_MS }).catch(() => {});
    await page.screenshot({ path: '/tmp/debug-screenshot.png', fullPage: true }).catch(() => {});
    console.log('Saved screenshot to /tmp/debug-screenshot.png');
    console.log('Run: DEBUG=1 npm run scrape  to save HTML');
    await browser.close();
    process.exit(1);
  }

  // Scrape each page
  const results = [];
  const sidebar = {};
  let ok = 0, fail = 0;

  for (const url of allUrls) {
    const slug = urlToSlug(url);
    const parts = slug.split('/');
    const section = parts[0] || 'general';
    const name = parts.slice(1).join('-') || parts[0];

    process.stdout.write(`  ${url.replace(DOCS_BASE, '')} ... `);

    const result = await extractContent(page, url);

    if (result.ok && result.md.length > 50) {
      const dir = join(DOCS_OUT, 'scraped', ...parts.slice(0, -1));
      mkdirSync(dir, { recursive: true });

      const safeTitle = (result.title || name).replace(/"/g, '\\"');
      const mdx = `---\ntitle: "${safeTitle}"\ndescription: "${safeTitle} \u2014 Kleegr documentation"\n---\n\n${result.md}\n`;
      writeFileSync(join(DOCS_OUT, 'scraped', slug + '.mdx'), mdx, 'utf-8');

      if (!sidebar[section]) sidebar[section] = [];
      sidebar[section].push({
        label: result.title || name,
        slug: `scraped/${slug}`,
      });

      results.push({ url, slug, title: result.title, status: 'ok', chars: result.md.length });
      ok++;
      console.log(`ok (${result.md.length}c)`);
    } else {
      results.push({ url, slug, status: 'fail', error: result.error });
      fail++;
      console.log(`FAIL: ${result.error}`);
    }

    await page.waitForTimeout(PAGE_DELAY_MS);
  }

  await browser.close();

  // Write sidebar
  const sidebarConfig = {
    label: 'Marketplace Docs',
    collapsed: false,
    items: Object.entries(sidebar).map(([sec, items]) => ({
      label: sec.charAt(0).toUpperCase() + sec.slice(1),
      collapsed: sec !== 'oauth',
      items,
    })),
  };
  writeFileSync(join(PROJECT, 'scraped-sidebar.json'), JSON.stringify(sidebarConfig, null, 2));

  // Write log
  writeFileSync(join(PROJECT, 'scrape-log.json'), JSON.stringify({
    timestamp: new Date().toISOString(),
    total: allUrls.length,
    ok, fail,
    pages: results,
  }, null, 2));

  console.log(`\n${'='.repeat(40)}`);
  console.log(`Scraped: ${ok} ok, ${fail} failed`);
  if (fail > 0) {
    console.log('\nFailed pages:');
    results.filter(r => r.status === 'fail').slice(0, 10).forEach(r =>
      console.log(`  ✗ ${r.url.replace(DOCS_BASE, '')} — ${r.error}`));
  }
  console.log(`\nNext: npm run build && git add -A && git commit -m "docs: scraped" && git push`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
