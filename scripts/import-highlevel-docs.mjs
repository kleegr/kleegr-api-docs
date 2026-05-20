// import-highlevel-docs.mjs
// Imports the full GoHighLevel API docs into Kleegr Starlight format.
// Auto-clones the upstream repo if not present.
// Usage: node scripts/import-highlevel-docs.mjs
// Then:  npm run build && git add -A && git commit -m 'docs: import' && git push

import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const UPSTREAM_URL = 'https://github.com/GoHighLevel/highlevel-api-docs.git';
const UPSTREAM = process.env.HL_UPSTREAM || '/tmp/hl-docs';
const PROJECT = process.cwd();
const DOCS_OUT = join(PROJECT, 'src/content/docs');
const SPECS_OUT = join(PROJECT, 'public/specs');

// Auto-clone upstream if not present
if (!existsSync(UPSTREAM)) {
  console.log(`\n\uD83D\uDCE5 Cloning upstream docs to ${UPSTREAM}...`);
  execSync(`git clone --depth=1 ${UPSTREAM_URL} ${UPSTREAM}`, { stdio: 'inherit' });
} else {
  console.log(`\n\u2713 Using upstream docs at ${UPSTREAM}`);
}

function slug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ensureDir(p) { mkdirSync(p, { recursive: true }); }

// ── MDX post-processing — fixes all upstream Markdown quirks that break MDX ──

function fixMdx(body) {
  // 1. Remove HTML comments
  body = body.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Fix invalid code block language hints (e.g. ```json json_schema -> ```json)
  body = body.replace(/```(json|javascript|js|bash|python|yaml|xml|html|css|typescript|ts)\s+\S+/g, '```$1');
  body = body.replace(/```json\{/g, '```json');

  // 3. Split on fenced code blocks so we only modify prose
  const parts = body.split(/(```[\s\S]*?```)/g);

  const fixedParts = parts.map((part, i) => {
    if (i % 2 === 1) return part; // inside code block — leave alone

    // 4. <b>text</b> -> **text**
    part = part.replace(/<b>([\s\S]*?)<\/b>/g, '**$1**');

    // 5. <hr> -> ---
    part = part.replace(/<hr\s*\/?>/g, '\n---\n');

    // 6. <br> -> newline
    part = part.replace(/<\/?br\s*\/?>/g, '\n');

    // 7. Remove </hr>, </br>, </img> (invalid closing tags)
    part = part.replace(/<\/(br|hr|img)\s*>/g, '');

    // 8. Remove raw <ol>, <ul>, <li> tags (convert to markdown)
    part = part.replace(/<ol[^>]*>/g, '').replace(/<\/ol>/g, '');
    part = part.replace(/<ul[^>]*>/g, '').replace(/<\/ul>/g, '');
    part = part.replace(/<li[^>]*>/g, '- ').replace(/<\/li>/g, '');

    // 9. {{...}} Handlebars expressions -> backtick wrapped
    part = part.replace(/\{\{([^}]+)\}\}/g, (_, inner) => '`{{' + inner + '}}`');

    // 10. Bare {identifier} JSX expressions in prose -> backtick wrapped
    part = part.replace(/\{([a-zA-Z_][a-zA-Z0-9_.]*(?:\s*\|\s*[a-zA-Z_][a-zA-Z0-9_.]*)*)\}/g, (m, inner) => {
      // Skip things that look like real JSX (starts with uppercase, has ..., etc.)
      if (inner[0] === inner[0].toUpperCase() && inner[0] !== inner[0].toLowerCase()) return m;
      if (inner.includes('...') || inner.includes('import')) return m;
      return '`{' + inner + '}`';
    });

    // 11. Wrap <placeholder-name> in backticks (angle-bracket vars in tables/prose)
    const htmlTags = new Set(['div','span','a','p','ul','ol','li','img','br','hr','strong',
      'em','b','i','h1','h2','h3','h4','h5','h6','table','tr','td','th','thead','tbody',
      'blockquote','pre','code','details','summary','section','article','nav','header','footer']);
    part = part.replace(/<([^>\n]+)>/g, (m, inner) => {
      const tagName = inner.trim().split(/[\s/]/)[0].toLowerCase();
      if (htmlTags.has(tagName)) return m;
      if (inner[0] && inner[0] === inner[0].toUpperCase()) return m; // component
      if (inner.startsWith('/')) return m; // closing tag
      if (inner.startsWith('http')) return '`<' + inner + '>`';
      if (inner.includes('=') || inner.includes(' ')) return m; // has attributes
      return '`<' + inner + '>`';
    });

    return part;
  });

  body = fixedParts.join('');

  // 12. Convert 4-space indented blocks to fenced code blocks
  //     (only outside fenced blocks, only in body not frontmatter)
  body = convertIndented(body);

  // 13. Merge split code blocks (artifact of indented conversion)
  for (let i = 0; i < 5; i++) {
    const before = body;
    body = body.replace(/(```)(\n(?:[^\n]+\n){1,15})(```)/g, (m, open, middle, close) => {
      // Only merge if the middle doesn't contain a language hint opening
      if (/```[a-z]/.test(middle)) return m;
      return middle.trimEnd();
    });
    if (body === before) break;
  }

  return body;
}

function convertIndented(body) {
  const lines = body.split('\n');
  const result = [];
  let inFence = false;
  let fenceStr = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const fm = line.match(/^(`{3,}|~{3,})/);
    if (fm) {
      if (!inFence) { inFence = true; fenceStr = fm[1]; }
      else if (line.startsWith(fenceStr)) { inFence = false; fenceStr = ''; }
      result.push(line);
      i++;
      continue;
    }
    if (inFence) { result.push(line); i++; continue; }

    // Collect 4-space indented block
    if (line.startsWith('    ') && line.trim()) {
      const block = [];
      while (i < lines.length && (lines[i].startsWith('    ') || (lines[i].trim() === '' && i + 1 < lines.length && lines[i+1]?.startsWith('    ')))) {
        block.push(lines[i]);
        i++;
      }
      while (block.length && !block[block.length-1].trim()) block.pop();
      const dedented = block.map(l => l.startsWith('    ') ? l.slice(4) : l);
      result.push('```');
      result.push(...dedented);
      result.push('```');
      result.push('');
      continue;
    }

    result.push(line);
    i++;
  }
  return result.join('\n');
}

// ── Rebranding ────────────────────────────────────────────────────────────────

function rebrand(md) {
  const parts = md.split(/(```[\s\S]*?```|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (i % 2 === 1) return p;
    return p
      .replace(/\bGoHighLevel\b(?![./\w-])/g, 'Kleegr')
      .replace(/\bHighLevel\b(?![./\w-])/g, 'Kleegr');
  }).join('');
}

function extractTitle(md, fallback) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

function convertMd(srcPath, titleFallback) {
  let content = readFileSync(srcPath, 'utf-8');
  // Strip upstream YAML frontmatter
  content = content.replace(/^---[\s\S]*?---\n/, '');
  const detectedTitle = extractTitle(content, titleFallback);
  // Strip first h1
  content = content.replace(/^#\s+.+\n/, '');
  content = rebrand(content);
  // Apply MDX fixes to the body
  content = fixMdx(content);
  const safeTitle = detectedTitle
    .replace(/\bGoHighLevel\b/g, 'Kleegr')
    .replace(/\bHighLevel\b/g, 'Kleegr')
    .replace(/"/g, '\\"');
  const fm = `---\ntitle: "${safeTitle}"\ndescription: "${safeTitle} \u2014 Kleegr developer documentation"\n---\n\n`;
  return fm + content.trimStart();
}

// ── Step 1: Import docs markdown files ───────────────────────────────────────

console.log('\n\uD83D\uDCC4 Importing docs/ markdown files...');
const docsMap = {};

function processDocsDir(srcDir, destDir, prefix) {
  ensureDir(destDir);
  for (const e of readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = join(srcDir, e.name);
    if (e.isDirectory()) {
      const p = prefix ? `${prefix}/${slug(e.name)}` : slug(e.name);
      processDocsDir(srcPath, join(destDir, slug(e.name)), p);
    } else if (e.name.endsWith('.md')) {
      const name = e.name.replace(/\.md$/, '');
      const destSlug = prefix ? `${prefix}/${slug(name)}` : slug(name);
      const destPath = join(destDir, `${slug(name)}.mdx`);
      writeFileSync(destPath, convertMd(srcPath, name));
      docsMap[srcPath.replace(UPSTREAM + '/', '')] = destSlug;
      console.log(`  ok ${e.name}`);
    }
  }
}

for (const d of ['oauth', 'webhooks', 'marketplace-modules', 'country-reference']) {
  ensureDir(join(DOCS_OUT, d));
}
processDocsDir(join(UPSTREAM, 'docs/oauth'), join(DOCS_OUT, 'oauth'), 'oauth');
processDocsDir(join(UPSTREAM, 'docs/webhook events'), join(DOCS_OUT, 'webhooks'), 'webhooks');
processDocsDir(join(UPSTREAM, 'docs/marketplace modules'), join(DOCS_OUT, 'marketplace-modules'), 'marketplace-modules');
processDocsDir(join(UPSTREAM, 'docs/country list'), join(DOCS_OUT, 'country-reference'), 'country-reference');

// ── Step 2: Copy all 41 OpenAPI specs ────────────────────────────────────────

console.log('\n\uD83D\uDCE6 Copying all 41 OpenAPI specs...');
ensureDir(SPECS_OUT);
const appsDir = join(UPSTREAM, 'apps');
const specFiles = readdirSync(appsDir).filter(f => f.endsWith('.json'));
for (const f of specFiles) {
  copyFileSync(join(appsDir, f), join(SPECS_OUT, f));
  console.log(`  ok ${f} (${Math.round(statSync(join(SPECS_OUT, f)).size / 1024)}KB)`);
}
console.log(`  Total: ${specFiles.length} specs`);

// ── Step 3: Generate API reference pages ─────────────────────────────────────

console.log('\n\uD83D\uDD0C Generating API reference pages...');
const API_NAMES = {
  'ad-manager':'Ad Manager API','affiliate-manager':'Affiliate Manager API',
  'agent-studio':'Agent Studio API','associations':'Associations API',
  'blogs':'Blogs API','brand-boards':'Brand Boards API','businesses':'Businesses API',
  'calendars':'Calendars API','campaigns':'Campaigns API','companies':'Companies API',
  'contacts':'Contacts API','conversation-ai':'Conversation AI API',
  'conversations':'Conversations API','courses':'Courses API',
  'custom-fields':'Custom Fields API','custom-menus':'Custom Menus API',
  'email-isv':'LC Email API','emails':'Emails API','forms':'Forms API',
  'funnels':'Funnels API','invoices':'Invoices API','knowledge-base':'Knowledge Base API',
  'links':'Trigger Links API','locations':'Sub-Accounts API','marketplace':'Marketplace API',
  'medias':'Media Library API','oauth':'OAuth API','objects':'Custom Objects API',
  'opportunities':'Opportunities API','payments':'Payments API',
  'phone-system':'Phone System API','products':'Products API',
  'proposals':'Proposals & Estimates API','saas-api':'SaaS API',
  'snapshots':'Snapshots API','social-media-posting':'Social Planner API',
  'store':'Store API','surveys':'Surveys API','users':'Users API',
  'voice-ai':'Voice AI API','workflows':'Workflows API',
};

ensureDir(join(DOCS_OUT, 'api-reference'));
for (const f of specFiles) {
  const s = f.replace('.json', '');
  const name = API_NAMES[s] || `${s} API`;
  writeFileSync(join(DOCS_OUT, `api-reference/${s}.mdx`),
    `---\ntitle: "${name}"\ndescription: "Kleegr ${name} \u2014 full interactive OpenAPI reference."\ntableOfContents: false\n---\n\nimport ScalarApiRef from '../../../components/ScalarApiRef.astro';\n\n<ScalarApiRef spec="/specs/${f}" title="${name}" />\n`);
  console.log(`  ok api-reference/${s}.mdx`);
}

// ── Step 4: Generate astro.config.mjs sidebar ────────────────────────────────

const toc = JSON.parse(readFileSync(join(UPSTREAM, 'toc.json'), 'utf-8'));
const webhookItems = toc.items
  .filter(i => i.type === 'item' && i.uri?.startsWith('docs/webhook events/'))
  .map(i => ({ label: i.title, slug: `webhooks/${slug(i.uri.replace('docs/webhook events/', '').replace('.md', ''))}` }));
const apiItems = specFiles.map(f => { const s = f.replace('.json',''); return { label: API_NAMES[s]||`${s} API`, slug: `api-reference/${s}` }; });

const sidebar = [
  { label: 'Getting Started', items: [{ label: 'Introduction', slug: 'getting-started' }] },
  { label: 'OAuth 2.0', collapsed: false, items: [
    { label: 'Overview', slug: 'oauth/overview' },
    { label: 'Scopes', slug: 'oauth/scopes' },
    { label: 'Authorization', slug: 'oauth/authorization' },
    { label: 'External Billing', slug: 'oauth/billing' },
    { label: 'External Authentication', slug: 'oauth/externalauthentication' },
    { label: 'Webhook Authentication', slug: 'oauth/webhookauthentication' },
    { label: 'FAQs', slug: 'oauth/faqs' },
  ]},
  { label: 'API Reference', collapsed: false, items: [{ label: 'All APIs', slug: 'api-reference/overview' }, ...apiItems] },
  { label: 'Webhook Events', collapsed: true, items: [{ label: 'Overview', slug: 'webhooks/overview' }, ...webhookItems] },
  { label: 'Marketplace Modules', collapsed: true, items: [
    { label: 'User Context (SSO)', slug: 'marketplace-modules/shared-secret-customjs-custompages' },
    { label: 'Custom JavaScript', slug: 'marketplace-modules/customjs' },
    { label: 'Conversation Providers', slug: 'marketplace-modules/conversationproviders' },
  ]},
  { label: 'Reference', collapsed: true, items: [
    { label: 'Country List', slug: 'country-reference/country' },
    { label: 'API Attribution', slug: 'legal/api-attribution' },
  ]},
];

writeFileSync(join(PROJECT, 'astro.config.mjs'),
`import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const sidebar = ${JSON.stringify(sidebar, null, 2)};

export default defineConfig({
  output: 'static',
  integrations: [
    starlight({
      title: 'Kleegr Developers',
      description: 'Developer documentation for building integrations and connected workflows with Kleegr CRM.',
      favicon: '/favicon.svg',
      logo: { src: './src/assets/logo.svg', replacesTitle: false },
      customCss: ['./src/styles/custom.css'],
      lastUpdated: false,
      pagination: true,
      social: {},
      sidebar,
      components: { Footer: './src/components/Footer.astro' },
    }),
  ],
});
`);
console.log('\n\u2713 astro.config.mjs updated');

console.log(`\n\u2705 Import complete! ${Object.keys(docsMap).length} docs, ${specFiles.length} specs, ${specFiles.length + 1} API pages`);
console.log('\nNext: npm run build   (should say Indexed 116 pages)');
console.log('Then: git add -A && git commit -m "docs: full import" && git push');
