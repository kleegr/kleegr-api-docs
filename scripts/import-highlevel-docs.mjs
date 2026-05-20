// import-highlevel-docs.mjs
// Imports the full GoHighLevel API docs into Kleegr Starlight format.
// Auto-clones the upstream repo if not present.
// Usage: node scripts/import-highlevel-docs.mjs
// Then:  git add -A && git commit -m 'docs: import' && git push

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
  console.log(`\n📥 Cloning upstream docs to ${UPSTREAM}...`);
  execSync(`git clone --depth=1 ${UPSTREAM_URL} ${UPSTREAM}`, { stdio: 'inherit' });
} else {
  console.log(`\n✓ Using upstream docs at ${UPSTREAM}`);
}

function slug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ensureDir(p) { mkdirSync(p, { recursive: true }); }

function rebrand(md) {
  const segments = [];
  let pos = 0;
  const codeRe = /(```[\s\S]*?```|`[^`]+`)/g;
  let m;
  while ((m = codeRe.exec(md)) !== null) {
    if (m.index > pos) segments.push({ type: 'prose', text: md.slice(pos, m.index) });
    segments.push({ type: 'code', text: m[0] });
    pos = m.index + m[0].length;
  }
  if (pos < md.length) segments.push({ type: 'prose', text: md.slice(pos) });
  return segments.map(seg => {
    if (seg.type === 'code') return seg.text;
    let t = seg.text;
    t = t.replace(/\bGoHighLevel\b(?![./\w-])/g, 'Kleegr');
    t = t.replace(/\bHighLevel\b(?![./\w-])/g, 'Kleegr');
    return t;
  }).join('');
}

function extractTitle(md, fallback) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

function convertMd(srcPath, title) {
  let content = readFileSync(srcPath, 'utf-8');
  const detectedTitle = extractTitle(content, title);
  // Strip upstream YAML frontmatter if present
  content = content.replace(/^---[\s\S]*?---\n/, '');
  content = rebrand(content);
  // Strip first h1
  content = content.replace(/^#\s+.+\n/, '');
  const safeTitle = detectedTitle.replace(/"/g, '\\"').replace(/\bGoHighLevel\b/g, 'Kleegr').replace(/\bHighLevel\b/g, 'Kleegr');
  const fm = `---\ntitle: "${safeTitle}"\ndescription: "${safeTitle} — Kleegr developer documentation"\n---\n\n`;
  return fm + content.trimStart();
}

console.log('\n📄 Importing docs/ markdown files...');
const docsMap = {};

function processDocsDir(srcDir, destDir, prefix) {
  ensureDir(destDir);
  const entries = readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = join(srcDir, e.name);
    if (e.isDirectory()) {
      const newPrefix = prefix ? `${prefix}/${slug(e.name)}` : slug(e.name);
      processDocsDir(srcPath, join(destDir, slug(e.name)), newPrefix);
    } else if (e.name.endsWith('.md')) {
      const name = e.name.replace(/\.md$/, '');
      const destSlug = prefix ? `${prefix}/${slug(name)}` : slug(name);
      const destPath = join(destDir, `${slug(name)}.mdx`);
      const converted = convertMd(srcPath, name);
      writeFileSync(destPath, converted);
      const relSrc = srcPath.replace(UPSTREAM + '/', '');
      docsMap[relSrc] = destSlug;
      console.log(`  ok ${relSrc}`);
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

console.log('\n📦 Copying all 41 OpenAPI specs...');
ensureDir(SPECS_OUT);
const appsDir = join(UPSTREAM, 'apps');
const specFiles = readdirSync(appsDir).filter(f => f.endsWith('.json'));
for (const f of specFiles) {
  copyFileSync(join(appsDir, f), join(SPECS_OUT, f));
  console.log(`  ok ${f} (${Math.round(statSync(join(SPECS_OUT, f)).size / 1024)}KB)`);
}
console.log(`  Total: ${specFiles.length} specs`);

console.log('\n🔌 Generating API reference pages...');
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
    `---\ntitle: "${name}"\ndescription: "Kleegr ${name} — full interactive OpenAPI reference."\ntableOfContents: false\n---\n\nimport ScalarApiRef from '../../../components/ScalarApiRef.astro';\n\n<ScalarApiRef spec="/specs/${f}" title="${name}" />\n`);
  console.log(`  ok api-reference/${s}.mdx`);
}

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

const config = `import { defineConfig } from 'astro/config';
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
`;
writeFileSync(join(PROJECT, 'astro.config.mjs'), config);
console.log('\n✓ astro.config.mjs updated');

console.log(`\n✅ Import complete! ${Object.keys(docsMap).length} docs, ${specFiles.length} specs, ${specFiles.length + 1} API pages`);
console.log('\nNext steps:');
console.log('  npm run build   # verify 116 pages');
console.log('  git add -A && git commit -m "docs: full import" && git push');
