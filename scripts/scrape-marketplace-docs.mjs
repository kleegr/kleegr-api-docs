/**
 * scrape-marketplace-docs.mjs v3
 * Uses "largest text block" strategy instead of brittle CSS selectors.
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import TurndownService from 'turndown';

const BASE_URL = 'https://marketplace.gohighlevel.com';
const DOCS_BASE = `${BASE_URL}/docs`;
const PROJECT = process.cwd();
const DOCS_OUT = join(PROJECT, 'src/content/docs');
const PAGE_DELAY_MS = 600;
const TIMEOUT_MS = 20000;
const MAX_PAGES = 400;

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
td.addRule('pre', {
  filter: ['pre'],
  replacement(_, node) {
    const code = node.querySelector('code');
    const lang = code?.className?.match(/language-([\w+-]+)/)?.[1] || '';
    const text = (code?.textContent || node.textContent || '').replace(/\r/g, '').trim();
    return `\n\`\`\`${lang}\n${text}\n\`\`\`\n`;
  },
});
td.remove(['script', 'style', 'noscript', 'svg', 'button', 'input', 'select']);

function urlToSlug(url) {
  return url.replace(DOCS_BASE, '').replace(/^\//, '').replace(/\/$/, '')
    .toLowerCase().replace(/[^a-z0-9/]/g, '-').replace(/-+/g, '-');
}

function isValidDocUrl(url) {
  if (!url.startsWith(DOCS_BASE)) return false;
  if (/\/\d{4}-\d{2}-\d{2}\//.test(url)) return false;
  const path = url.replace(DOCS_BASE, '');
  if (!path || path === '/') return false;
  // skip pure tag/category listing pages
  if (/^\/tags(\/|$)/.test(path) && path.split('/').length < 3) return false;
  return true;
}

function rewriteLinks(md) {
  return md
    .replace(/\[([^\]]+)\]\(https?:\/\/marketplace\.gohighlevel\.com\/docs\/([^)#\s]+)(#[^)]*)?\)/g,
      (_, t, p, h = '') => `[${t}](/scraped/${p.toLowerCase().replace(/[^a-z0-9/]/g, '-')}${h})`)
    .replace(/\[([^\]]+)\]\(\/docs\/([^)#\s]+)(#[^)]*)?\)/g,
      (_, t, p, h = '') => `[${t}](/scraped/${p.toLowerCase().replace(/[^a-z0-9/]/g, '-')}${h})`);
}

function rebrand(text) {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
  return parts.map((p, i) => i % 2 === 1 ? p :
    p.replace(/\bGoHighLevel\b(?![./\w-])/g, 'Kleegr').replace(/\bHighLevel\b(?![./\w-])/g, 'Kleegr')
  ).join('');
}

async function extractContent(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS });
    // Wait for React to render
    await page.waitForTimeout(2500);

    const rawTitle = await page.title().catch(() => '');
    const title = rawTitle.replace(/\s*[-|].*$/, '').trim()
      .replace(/GoHighLevel/g, 'Kleegr').replace(/HighLevel/g, 'Kleegr');

    // Strategy: find the element with the most text that isn't nav/sidebar
    const result = await page.evaluate(() => {
      // Remove noise elements first
      const noiseSelectors = [
        'nav', 'header', 'footer', 'aside',
        '[class*="navbar"]', '[class*="Navbar"]',
        '[class*="sidebar"]', '[class*="Sidebar"]',
        '[class*="header"]', '[class*="Header"]',
        '[class*="footer"]', '[class*="Footer"]',
        '[class*="breadcrumb"]', '[class*="Breadcrumb"]',
        '[class*="toc"]', '[class*="TableOfContents"]',
        '[class*="pagination"]', '[class*="Pagination"]',
        '[class*="feedback"]', '[class*="Feedback"]',
        '[class*="toolbar"]', '[class*="Toolbar"]',
        '[class*="banner"]', '[class*="Banner"]',
        'button', 'script', 'style', '[aria-hidden="true"]',
      ];
      noiseSelectors.forEach(s => {
        try { document.querySelectorAll(s).forEach(el => el.remove()); } catch {}
      });

      // Try common doc content selectors first
      const preferredSelectors = [
        'article',
        '[class*="docContent"]', '[class*="DocContent"]',
        '[class*="doc-content"]', '[class*="docs-content"]',
        '[class*="content"][class*="main"]',
        '[class*="Content"][class*="Main"]',
        '[class*="markdownContent"]', '[class*="MarkdownContent"]',
        '[class*="markdown-body"]', '[class*="markdown_body"]',
        'main',
        '[role="main"]',
        '[class*="page-content"]', '[class*="pageContent"]',
        '[class*="PageContent"]',
        '[class*="container"] [class*="content"]',
        '.container',
        '#main-content', '#content',
      ];

      for (const sel of preferredSelectors) {
        try {
          const el = document.querySelector(sel);
          if (el && el.innerText && el.innerText.trim().length > 200) {
            return { html: el.innerHTML, selector: sel };
          }
        } catch {}
      }

      // Fallback: find the div/section with the most text content
      const candidates = Array.from(document.querySelectorAll('div, section, article, main'));
      let best = null;
      let bestLen = 0;
      for (const el of candidates) {
        // Skip tiny, skip if it's a wrapper for the whole page (body-level)
        if (el === document.body) continue;
        const text = el.innerText?.trim() || '';
        if (text.length > bestLen && text.length > 100) {
          // Make sure this isn't a giant wrapper containing everything
          // Prefer elements that are "leaf-ish" (their content is mostly text)
          const childBlocks = el.querySelectorAll('div, section').length;
          const textRatio = text.length / Math.max(el.innerHTML.length, 1);
          if (textRatio > 0.1 || childBlocks < 20) {
            best = el;
            bestLen = text.length;
          }
        }
      }

      if (best) return { html: best.innerHTML, selector: 'largest-block' };

      // Last resort: whole body
      const body = document.body;
      if (body && body.innerText.trim().length > 50) {
        return { html: body.innerHTML, selector: 'body' };
      }

      return { html: '', selector: 'none' };
    });

    if (!result.html || result.html.length < 50) {
      // Take a screenshot for debugging
      await page.screenshot({ path: '/tmp/scrape-fail.png', fullPage: false }).catch(() => {});
      return { ok: false, error: `No content (selector tried: ${result?.selector || 'none'})` };
    }

    let md = td.turndown(result.html);
    md = md.replace(/\n{3,}/g, '\n\n').trim();
    md = rebrand(md);
    md = rewriteLinks(md);

    if (md.length < 30) return { ok: false, error: 'Content too short after conversion' };

    return { ok: true, title, md, selector: result.selector };
  } catch (err) {
    return { ok: false, error: err.message.split('\n')[0].slice(0, 120) };
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
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS });
      await page.waitForTimeout(1200);
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
  console.log('Kleegr Marketplace Docs Scraper v3');
  console.log('====================================');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(TIMEOUT_MS);

  const allUrls = await discoverLinks(page);
  console.log(`\nFound ${allUrls.length} doc pages\n`);

  if (allUrls.length === 0) {
    await page.goto(`${DOCS_BASE}/oauth/GettingStarted`, { timeout: TIMEOUT_MS }).catch(() => {});
    await page.screenshot({ path: '/tmp/scrape-debug.png', fullPage: true }).catch(() => {});
    console.log('No pages found. Screenshot saved to /tmp/scrape-debug.png');
    await browser.close();
    process.exit(1);
  }

  // Test first page and show what we get
  console.log('Testing content extraction on first page...');
  const testResult = await extractContent(page, allUrls[0]);
  console.log(`  URL: ${allUrls[0].replace(DOCS_BASE, '')}`);
  console.log(`  Title: ${testResult.title || '(none)'}`);
  console.log(`  Selector used: ${testResult.selector || 'N/A'}`);
  console.log(`  Content length: ${testResult.md?.length || 0} chars`);
  console.log(`  Status: ${testResult.ok ? 'OK' : 'FAIL: ' + testResult.error}`);
  if (testResult.ok) {
    console.log(`  Preview: ${testResult.md.slice(0, 200).replace(/\n/g, ' ')}...`);
  } else {
    console.log('  Screenshot saved to /tmp/scrape-fail.png for debugging');
  }
  console.log('');

  const results = [];
  const sidebar = {};
  let ok = 0, fail = 0;

  for (const url of allUrls) {
    const slug = urlToSlug(url);
    const parts = slug.split('/');
    const section = parts[0] || 'general';
    process.stdout.write(`  ${url.replace(DOCS_BASE, '')} ... `);

    const r = await extractContent(page, url);

    if (r.ok && r.md.length > 30) {
      mkdirSync(join(DOCS_OUT, 'scraped', ...parts.slice(0, -1)), { recursive: true });
      const safeTitle = (r.title || parts[parts.length - 1]).replace(/"/g, '\\"');
      writeFileSync(
        join(DOCS_OUT, 'scraped', slug + '.mdx'),
        `---\ntitle: "${safeTitle}"\ndescription: "${safeTitle} \u2014 Kleegr documentation"\n---\n\n${r.md}\n`,
        'utf-8'
      );
      (sidebar[section] = sidebar[section] || []).push({ label: r.title || parts[parts.length-1], slug: `scraped/${slug}` });
      results.push({ url, slug, title: r.title, status: 'ok', chars: r.md.length, selector: r.selector });
      ok++;
      console.log(`ok (${r.md.length}c, ${r.selector})`);
    } else {
      results.push({ url, slug, status: 'fail', error: r.error });
      fail++;
      console.log(`FAIL: ${r.error}`);
    }
    await page.waitForTimeout(PAGE_DELAY_MS);
  }

  await browser.close();

  writeFileSync(join(PROJECT, 'scraped-sidebar.json'), JSON.stringify({
    label: 'Marketplace Docs',
    collapsed: false,
    items: Object.entries(sidebar).map(([sec, items]) => ({
      label: sec.charAt(0).toUpperCase() + sec.slice(1), collapsed: sec !== 'oauth', items,
    })),
  }, null, 2));

  writeFileSync(join(PROJECT, 'scrape-log.json'), JSON.stringify(
    { timestamp: new Date().toISOString(), total: allUrls.length, ok, fail, pages: results }, null, 2
  ));

  console.log(`\n${'='.repeat(40)}`);
  console.log(`Done: ${ok} scraped, ${fail} failed`);
  if (fail > 0) {
    const failedList = results.filter(r => r.status === 'fail').slice(0, 15);
    console.log('\nFailed (first 15):');
    failedList.forEach(r => console.log(`  x ${r.url.replace(DOCS_BASE, '')} - ${r.error}`));
  }
  console.log(`\nNext: npm run build && git add -A && git commit -m "docs: scraped ${ok} pages" && git push`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
