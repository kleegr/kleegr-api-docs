/**
 * scrape-marketplace-docs.mjs
 *
 * Crawls https://marketplace.gohighlevel.com/docs/ using Playwright.
 * Extracts doc content, converts to MDX, saves into Kleegr Starlight site.
 *
 * Usage:
 *   npm run scrape:install   (once, installs Chromium)
 *   npm run scrape
 *
 * Output:
 *   src/content/docs/scraped/  - MDX pages
 *   scraped-sidebar.json       - sidebar config to merge into astro.config.mjs
 *   scrape-log.json            - full log of every URL
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import TurndownService from 'turndown';

const BASE_URL = 'https://marketplace.gohighlevel.com';
const DOCS_BASE = `${BASE_URL}/docs`;
const PROJECT = process.cwd();
const DOCS_OUT = join(PROJECT, 'src/content/docs');
const LOG_FILE = join(PROJECT, 'scrape-log.json');

// Content selectors in priority order
const CONTENT_SELECTORS = [
  '.docs-content',
  'article.markdown-body',
  '[class*="DocContent"]',
  '[class*="doc-content"]',
  '[class*="content"] article',
  'main article',
  '.markdown',
  '[class*="markdown"]',
  'main > div > div',
  'main',
];

// Elements to strip before extracting content
const STRIP_SELECTORS = [
  'nav', 'header', 'footer',
  '.sidebar', '.navigation', '.breadcrumbs', '.breadcrumb',
  '[class*="sidebar"]', '[class*="nav"]', '[class*="header"]',
  '[class*="footer"]', '[class*="toc"]', '[class*="TableOfContents"]',
  'button', 'script', 'style', '[aria-hidden="true"]',
  '[class*="Toolbar"]', '[class*="toolbar"]',
];

const PAGE_DELAY_MS = 1200;
const MAX_PAGES = 200;
const TIMEOUT_MS = 30000;

// Turndown: HTML -> Markdown
const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
});

td.addRule('codeBlock', {
  filter: ['pre'],
  replacement(content, node) {
    const code = node.querySelector('code');
    const lang = code?.className?.match(/language-(\w+)/)?.[1] || '';
    const text = (code?.textContent || content).replace(/\r/g, '');
    return `\n\`\`\`${lang}\n${text}\n\`\`\`\n`;
  },
});

function urlToSlug(url) {
  const path = url.replace(DOCS_BASE, '').replace(/^\//, '').replace(/\/$/, '');
  return path.toLowerCase().replace(/[^a-z0-9/]/g, '-').replace(/-+/g, '-');
}

function slugToOutPath(slug) {
  return join(DOCS_OUT, 'scraped', slug + '.mdx');
}

function rewriteDocLinks(md) {
  return md
    .replace(/\[([^\]]+)\]\(https?:\/\/marketplace\.gohighlevel\.com\/docs\/([^)#]+)(#[^)]*)?\)/g,
      (_, text, path, hash = '') => {
        const s = path.toLowerCase().replace(/[^a-z0-9/]/g, '-');
        return `[${text}](/scraped/${s}${hash})`;
      })
    .replace(/\[([^\]]+)\]\(\/docs\/([^)#]+)(#[^)]*)?\)/g,
      (_, text, path, hash = '') => {
        const s = path.toLowerCase().replace(/[^a-z0-9/]/g, '-');
        return `[${text}](/scraped/${s}${hash})`;
      });
}

function rebrandProse(text) {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (i % 2 === 1) return p;
    return p
      .replace(/\bGoHighLevel\b(?![./\w-])/g, 'Kleegr')
      .replace(/\bHighLevel\b(?![./\w-])/g, 'Kleegr');
  }).join('');
}

async function scrapePage(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT_MS });
    await page.waitForTimeout(1500);

    const rawTitle = await page.title().catch(() => '');
    const title = rawTitle
      .replace(/\s*[-|].*$/, '').trim()
      .replace(/GoHighLevel/g, 'Kleegr').replace(/HighLevel/g, 'Kleegr');

    // Strip nav/header/footer before extracting
    await page.evaluate((sels) => {
      sels.forEach(s => document.querySelectorAll(s).forEach(el => el.remove()));
    }, STRIP_SELECTORS);

    let contentHtml = '';
    for (const sel of CONTENT_SELECTORS) {
      try {
        const el = await page.$(sel);
        if (el) {
          contentHtml = await el.innerHTML();
          if (contentHtml.length > 200) break;
        }
      } catch {}
    }

    if (!contentHtml || contentHtml.length < 100) {
      contentHtml = await page.evaluate(() =>
        (document.querySelector('main') || document.body).innerHTML
      );
    }

    let markdown = td.turndown(contentHtml);
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();
    markdown = rebrandProse(markdown);

    return { title, markdown, success: true };
  } catch (err) {
    return { title: '', markdown: '', success: false, error: err.message };
  }
}

async function discoverLinks(page, startUrl) {
  const found = new Set();
  const toVisit = [startUrl];
  const visited = new Set();

  console.log('\n Discovering docs pages...');

  while (toVisit.length > 0 && found.size < MAX_PAGES) {
    const url = toVisit.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT_MS });
      await page.waitForTimeout(800);

      const links = await page.evaluate((base) =>
        Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.href)
          .filter(h => h && h.startsWith(base)),
        DOCS_BASE
      );

      for (const link of links) {
        const clean = link.split('#')[0].replace(/\/$/, '');
        if (clean.length > DOCS_BASE.length && !found.has(clean)) {
          found.add(clean);
          toVisit.push(clean);
          console.log(`  + ${clean.replace(DOCS_BASE, '')}`);
        }
      }
    } catch (err) {
      console.log(`  ! Discovery error: ${err.message}`);
    }
  }

  return Array.from(found);
}

async function main() {
  console.log('Kleegr Marketplace Docs Scraper');
  console.log('================================');
  console.log(`Source: ${DOCS_BASE}`);
  console.log(`Output: src/content/docs/scraped/`);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();

  // Discover all docs pages
  const START_URLS = [
    `${DOCS_BASE}/oauth/GettingStarted`,
    `${DOCS_BASE}/oauth/Overview`,
    DOCS_BASE + '/',
  ];

  let allUrls = [];
  for (const start of START_URLS) {
    try {
      const links = await discoverLinks(page, start);
      links.forEach(l => { if (!allUrls.includes(l)) allUrls.push(l); });
      if (allUrls.length >= 3) break;
    } catch (err) {
      console.log(`Cannot start from ${start}: ${err.message}`);
    }
  }

  if (allUrls.length === 0) {
    console.error('No pages found. Check: npx playwright install chromium');
    await browser.close();
    process.exit(1);
  }

  console.log(`\nScraping ${allUrls.length} pages...\n`);

  const results = [];
  const sidebarItems = [];
  let ok = 0, fail = 0;

  for (const url of allUrls) {
    const slug = urlToSlug(url);
    process.stdout.write(`  ${url.replace(DOCS_BASE, '')} ... `);

    const { title, markdown, success, error } = await scrapePage(page, url);

    if (success && markdown.length > 50) {
      const dir = join(DOCS_OUT, 'scraped', ...slug.split('/').slice(0, -1));
      mkdirSync(dir, { recursive: true });

      const safeTitle = (title || slug.split('/').pop()).replace(/"/g, '\\"');
      const mdx = `---\ntitle: "${safeTitle}"\ndescription: "${safeTitle} \u2014 Kleegr developer documentation"\n---\n\n${rewriteDocLinks(markdown)}\n`;
      writeFileSync(slugToOutPath(slug), mdx, 'utf-8');

      sidebarItems.push({ slug: `scraped/${slug}`, label: title || slug.split('/').pop() });
      results.push({ url, slug, title, status: 'ok', chars: markdown.length });
      ok++;
      console.log(`ok (${markdown.length}c)`);
    } else {
      results.push({ url, slug, status: 'failed', error });
      fail++;
      console.log(`FAIL: ${error || 'empty'}`);
    }

    await page.waitForTimeout(PAGE_DELAY_MS);
  }

  await browser.close();

  // Generate sidebar grouped by section
  const sections = {};
  for (const item of sidebarItems) {
    const parts = item.slug.replace('scraped/', '').split('/');
    const sec = parts.length > 1 ? parts[0] : 'general';
    (sections[sec] = sections[sec] || []).push({ label: item.label, slug: item.slug });
  }

  const sidebar = {
    label: 'Marketplace Docs (Scraped)',
    collapsed: false,
    items: Object.entries(sections).map(([sec, items]) => ({
      label: sec.charAt(0).toUpperCase() + sec.slice(1),
      collapsed: true,
      items,
    })),
  };

  writeFileSync(join(PROJECT, 'scraped-sidebar.json'), JSON.stringify(sidebar, null, 2));
  writeFileSync(LOG_FILE, JSON.stringify({ timestamp: new Date().toISOString(), total: allUrls.length, ok, fail, pages: results }, null, 2));

  console.log(`\nDone: ${ok} scraped, ${fail} failed`);
  console.log(`Sidebar: scraped-sidebar.json`);
  console.log(`Log:     scrape-log.json`);
  console.log(`\nNext:`);
  console.log(`  npm run build`);
  console.log(`  git add -A && git commit -m "docs: scraped" && git push`);
}

main().catch(e => { console.error(e); process.exit(1); });
