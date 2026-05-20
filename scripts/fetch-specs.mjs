/**
 * fetch-specs.mjs
 * Downloads OpenAPI spec files from the upstream GoHighLevel public repo at build time.
 * Runs automatically via: npm run build
 * Source: GoHighLevel/highlevel-api-docs (CC0 1.0 public domain)
 */
import { mkdir, writeFile, access, stat } from 'fs/promises';
import { join } from 'path';

const BASE_URL = 'https://raw.githubusercontent.com/GoHighLevel/highlevel-api-docs/main/apps';
const OUTPUT_DIR = 'public/specs';

// These specs are fetched from upstream at build time (too large to commit)
const SPECS = [
  'contacts.json',
  'conversations.json',
  'calendars.json',
  'opportunities.json',
  'invoices.json',
  'payments.json',
  'users.json',
  'locations.json',
  'forms.json',
  'medias.json',
  'funnels.json',
  'blogs.json',
  'social-media-posting.json',
];

async function fileExists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function fetchSpec(name) {
  const outPath = join(OUTPUT_DIR, name);
  if (await fileExists(outPath)) {
    const s = await stat(outPath);
    if (s.size > 5000) {
      console.log(`  \u2713 ${name} (cached, ${Math.round(s.size / 1024)}KB)`);
      return;
    }
  }
  const url = `${BASE_URL}/${name}`;
  console.log(`  \u2193 ${name} (fetching from upstream...)`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const text = await res.text();
  await writeFile(outPath, text, 'utf-8');
  console.log(`  \u2713 ${name} (${Math.round(text.length / 1024)}KB)`);
}

async function main() {
  console.log('\uD83D\uDCE5 Fetching OpenAPI specs from upstream...');
  await mkdir(OUTPUT_DIR, { recursive: true });
  const results = await Promise.allSettled(SPECS.map(fetchSpec));
  const failed = results.filter(r => r.status === 'rejected');
  if (failed.length) {
    console.error('Failed:', failed.map(f => f.reason.message).join(', '));
    process.exit(1);
  }
  console.log(`\u2705 ${SPECS.length} specs ready in ${OUTPUT_DIR}/`);
}

main().catch(e => { console.error(e); process.exit(1); });
