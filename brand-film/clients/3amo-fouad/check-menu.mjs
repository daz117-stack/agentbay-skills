// Compare menu.json with the ordering site's source: the menu in app.js and server/catalog.json.
// Usage: node check-menu.mjs <ordering-source-dir>
// Exits 1 if any product id, size or price differs. Name differences are listed but don't fail.
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('usage: node check-menu.mjs <ordering-source-dir>'); process.exit(2); }

const menu = JSON.parse(fs.readFileSync(new URL('./menu.json', import.meta.url), 'utf8'));
const server = JSON.parse(fs.readFileSync(path.join(dir, 'server/catalog.json'), 'utf8'));

// app.js builds its menu as `var MENU = [...]` using the sz()/bs() helpers defined just above it.
const app = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');
const block = app.match(/function sz[\s\S]*?var MENU = (\[[\s\S]*?\n  \]);/);
if (!block) { console.error('could not find MENU in app.js'); process.exit(2); }
const MENU = new Function(block[0].replace('var MENU = ', 'return '))();

const rows = {};
const add = (src, id, name, label, price) => ((rows[id] ??= {})[src] = { name, label, price });
for (const s of menu.sections)
  for (const it of s.items)
    (it.prices ?? [it.price]).forEach((p, v) => add('menu', `${it.id}.${v}`, it.name, it.prices ? s.variants[v] : null, p));
for (const c of MENU)
  c.items.forEach((it, i) => (it.v ?? [[null, it.p]]).forEach(([label, p], v) => add('app', `${c.id}.${i}.${v}`, it.n, label, p)));
for (const r of server) if (r.active) add('server', r.id, r.name, r.label, r.price);

let failed = 0, renamed = 0;
for (const [id, r] of Object.entries(rows).sort()) {
  const srcs = ['menu', 'app', 'server'];
  const missing = srcs.filter(s => !r[s]);
  if (missing.length) { failed++; console.log(`MISSING ${id} in ${missing.join(', ')}`); continue; }
  if (new Set(srcs.map(s => r[s].price)).size > 1 || new Set(srcs.map(s => r[s].label)).size > 1) {
    failed++; console.log(`PRICE   ${id} ${srcs.map(s => `${s}=${r[s].label ?? ''} ${r[s].price}`).join(' | ')}`);
  }
  if (new Set(srcs.map(s => r[s].name)).size > 1) {
    renamed++; console.log(`NAME    ${id} ${srcs.map(s => `${s}=«${r[s].name}»`).join(' | ')}`);
  }
}
console.log(`${Object.keys(rows).length} product ids, ${failed} id/size/price differences, ${renamed} name differences`);
process.exit(failed ? 1 : 0);
