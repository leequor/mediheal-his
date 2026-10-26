// Smoke harness (session 23, Phase 0 of docs/IMPROVEMENT-PLAN.md).
// Sweeps every page of the repo for the three regressions we kept re-finding by hand:
//   1. console errors / page errors,
//   2. horizontal overflow at 1440 / 1200 / 1000 / 800 / 390 px,
//   3. buttons that throw when clicked.
// It NEVER clicks print / download / export / sync / approve / decline / sign-out controls and never
// follows links, because those have side effects (a native print dialog blocks automation).
// Any `mh_*` key a page creates during the sweep is removed again, so the owner's saved records
// (`mh_regs_extra`, `mh_appts_extra`) and the demo baseline are left untouched.
//
// Usage (from the repo root, with playwright-core resolvable):
//   node scripts/smoke.mjs
//   BASE=http://127.0.0.1:8788 CDP=http://127.0.0.1:9333 node scripts/smoke.mjs
//   PW=<abs path to playwright-core/index.js> node scripts/smoke.mjs
// It serves the repo itself on BASE (no GitHub Pages lag) and drives a browser already listening
// on CDP - start one with its OWN --user-data-dir, never the default Chrome profile.
import http from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const CDP = process.env.CDP || 'http://127.0.0.1:9333';
const PW = process.env.PW || 'playwright-core';
const WIDTHS = [1440, 1200, 1000, 800, 390];
const SKIP_CLICK = 'print|download|export|\\bpdf\\b|sync|approve|decline|sign out|reset|remove|delete';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };

let chromium;
try { ({ chromium } = await import(PW)); }
catch {
  console.error(`Cannot import playwright-core (tried "${PW}").\nSet PW to its index.js, e.g.\n  PW="$PWD/node_modules/playwright-core/index.js" node scripts/smoke.mjs`);
  process.exit(2);
}

// --- static server so the sweep never depends on GitHub Pages caching ---
const port = Number(new URL(BASE).port || 8788);
const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  try {
    const body = await readFile(path.join(ROOT, p));
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404).end('404'); }
});
await new Promise(r => server.listen(port, r));

const pages = (await readdir(ROOT)).filter(f => f.endsWith('.html')).sort();
const browser = await chromium.connectOverCDP(CDP);
let ctx;
try { ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); }
catch { ctx = browser.contexts()[0]; } // older CDP builds only expose the default context
console.log(`smoke: ${pages.length} pages via ${BASE} on ${browser.version()}\n`);

let failures = 0;
for (const name of pages) {
  const page = await ctx.newPage();
  const errors = [], warnings = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); else if (m.type() === 'warning') warnings.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  try {
    await page.goto(BASE + '/' + name, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(400);

    const over = [];
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(120);
      if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) over.push(w);
    }
    await page.setViewportSize({ width: 1440, height: 900 });

    const before = errors.length;
    // Tag every safe button, then click them ONE AT A TIME from Node so a navigation in the middle
    // only ends the sweep instead of destroying the evaluate context.
    const tagged = await page.evaluate((skipSrc) => {
      const skip = new RegExp(skipSrc, 'i');
      let n = 0;
      Array.from(document.querySelectorAll('button:not([disabled]),[role="button"]')).forEach(b => {
        const label = (b.id + ' ' + b.className + ' ' + (b.textContent || '') + ' ' + (b.dataset.act || '') + ' ' + (b.dataset.modal || '')).trim();
        if (skip.test(label)) return;
        if (b.closest('form') && b.type === 'submit') return;
        b.setAttribute('data-smoke', n++);
      });
      return { n, pre: Object.keys(localStorage).filter(k => k.indexOf('mh_') === 0) };
    }, SKIP_CLICK);

    let clicks = 0, nav = false;
    for (let i = 0; i < tagged.n; i++) {
      const url = page.url();
      try { await page.evaluate(i => { const el = document.querySelector('[data-smoke="' + i + '"]'); if (el) el.click(); }, i); }
      catch (e) { /* navigation destroyed the context */ }
      clicks++;
      await page.waitForTimeout(50);
      try { await page.keyboard.press('Escape'); } catch (e) { /* page gone */ }
      try {
        await page.evaluate(() => {
          document.querySelectorAll('.modal-bg').forEach(n => n.remove());
          document.querySelectorAll('.dd.open').forEach(n => n.classList.remove('open'));
        });
      } catch (e) { /* page gone */ }
      if (page.url() !== url) { nav = true; break; }
    }
    // leave no test state behind
    try {
      await page.evaluate(pre => Object.keys(localStorage).filter(k => k.indexOf('mh_') === 0 && pre.indexOf(k) < 0).forEach(k => localStorage.removeItem(k)), tagged.pre);
    } catch (e) { /* page gone */ }
    const clicked = clicks + (nav ? ' (nav)' : '');

    const newErr = errors.length - before;
    const bad = errors.length || over.length || newErr;
    if (bad) failures++;
    console.log(`${bad ? 'FAIL' : 'ok  '} ${name.padEnd(26)} errors:${String(errors.length).padStart(2)} warn:${String(warnings.length).padStart(2)} overflow:[${over.join(',')}] clicks:${clicked}${newErr ? ' clickErrors:' + newErr : ''}`);
    errors.slice(0, 3).forEach(e => console.log('      ! ' + String(e).split('\n')[0].slice(0, 160)));
  } catch (e) {
    failures++;
    console.log(`FAIL ${name.padEnd(26)} load error: ${e.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

server.close();
console.log(`\n${failures ? failures + ' page(s) need attention' : 'all pages clean'}`);
process.exit(failures ? 1 : 0);