// Per-control functional sweep (session 23, turn 11). Companion to scripts/smoke.mjs.
//
// For EVERY control on every page it answers one question: does this control DO something?
//   - buttons / [role=button] / [data-act] / checkboxes / radios -> clicked from a CLEAN page load
//     (so an overlay opened by the previous control cannot swallow the click), then classified by the
//     effect it had: navigation, a DOM change (modal/overlay/re-render), a download, a print call, a
//     toast. A click with NO effect is reported so a human can judge it (a dead button is a bug; a
//     tab that is already active is not).
//   - links (a[href]) -> never clicked; the resolved URL is fetched and must answer 200. `href="#"`,
//     empty and javascript: links are reported as DEAD-LINK.
//   - selects -> the next option is selected and the change must be observable.
//
// Side-effect safety: `window.print` is spoofed before any script runs, downloads are cancelled as
// soon as they start, dialogs are dismissed, navigation is detected rather than followed, and
// localStorage is restored to its exact pre-sweep contents after every page.
//
// Usage (from the repo root, with playwright-core resolvable):
//   node scripts/buttons.mjs
//   FRESH=1 BASE=https://leequor.github.io/mediheal-his node scripts/buttons.mjs
import http from 'node:http';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.env.BASE || 'http://127.0.0.1:8788').replace(/\/$/, '');
const CDP = process.env.CDP || 'http://127.0.0.1:9333';
const PW = process.env.PW || 'playwright-core';
const FRESH = !!process.env.FRESH;
const ONLY = process.env.ONLY || '';
const SEL = 'button, [role="button"], [data-act], input[type="checkbox"], input[type="radio"]';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };

let chromium;
try { ({ chromium } = await import(PW)); } catch {
  console.error(`Cannot import playwright-core (tried "${PW}"). Set PW to its index.js.`);
  process.exit(2);
}

let server = null;
if (/127\.0\.0\.1|localhost/.test(BASE)) {
  const port = Number(new URL(BASE).port || 8788);
  server = http.createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    try {
      const body = await readFile(path.join(ROOT, p));
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404).end('404'); }
  });
  await new Promise(r => server.listen(port, r));
}

const pages = (await readdir(ROOT)).filter(f => f.endsWith('.html') && (!ONLY || f.indexOf(ONLY) > -1)).sort();
const browser = await chromium.connectOverCDP(CDP);
let ctx;
try { ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true }); }
catch { ctx = browser.contexts()[0]; }
await ctx.addInitScript(() => { window.__printed = 0; window.print = function () { window.__printed++; }; });

const report = { base: BASE, pages: [], anomalies: [] };
const note = (page, kind, label, extra) => {
  report.anomalies.push({ page, kind, label, ...(extra ? { extra } : {}) });
  console.log(`   ! ${kind} ${label}${extra ? ' :: ' + extra : ''}`);
};

for (const name of pages) {
  console.log(`\n== ${name}`);
  const url = BASE + '/' + name;
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  const downloads = [], dialogs = [];
  page.on('download', async d => { downloads.push(d.suggestedFilename()); try { await d.cancel(); } catch (e) {} });
  page.on('dialog', async d => { dialogs.push(d.message()); try { await d.dismiss(); } catch (e) {} });

  let freshDone = false;
  const load = async () => {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    if (FRESH && !freshDone) {
      await page.evaluate(async () => {
        const srcs = [...document.querySelectorAll('script[src]')].map(s => s.getAttribute('src')).concat([...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.getAttribute('href')));
        for (const u of srcs) { try { await fetch(u, { cache: 'reload' }); } catch (e) {} }
      });
      await page.reload({ waitUntil: 'load' });
      freshDone = true;
    }
    await page.waitForTimeout(80);
  };

  try { await load(); } catch (e) { note(name, 'LOAD-ERROR', e.message.split('\n')[0]); await page.close(); continue; }
  const snapshot = await page.evaluate(() => Object.assign({}, localStorage));
  const restore = async () => { try { await page.evaluate(s => { localStorage.clear(); Object.keys(s).forEach(k => localStorage.setItem(k, s[k])); }, snapshot); } catch (e) {} };

  // ---------- links ----------
  const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => ({ href: a.getAttribute('href'), text: (a.textContent || '').trim().slice(0, 30) })));
  for (const l of links) {
    if (!l.href || l.href === '#' || l.href.indexOf('javascript:') === 0) { note(name, 'DEAD-LINK', `a[href="${l.href}"] "${l.text}"`); continue; }
    let status = 0;
    try { status = (await page.request.get(new URL(l.href, url).href)).status(); } catch (e) { status = -1; }
    if (status !== 200) note(name, 'BROKEN-LINK', `${l.href} "${l.text}"`, 'HTTP ' + status);
  }

  // ---------- selects (fresh page, one at a time) ----------
  const selectCount = await page.evaluate(() => document.querySelectorAll('select').length);
  let selBad = 0;
  for (let i = 0; i < selectCount; i++) {
    await restore(); await load();
    const res = await page.evaluate(async i => {
      const s = document.querySelectorAll('select')[i];
      if (!s || s.options.length < 2) return { skip: true };
      const before = s.value;
      s.selectedIndex = s.selectedIndex === s.options.length - 1 ? 0 : s.selectedIndex + 1;
      s.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise(r => setTimeout(r, 60));
      return { changed: s.value !== before, id: s.id || s.name || '' };
    }, i);
    if (res.changed === false) { selBad++; note(name, 'SELECT-NO-EFFECT', `select ${res.id}`); }
  }

  // ---------- controls ----------
  await load();
  const inventory = await page.evaluate(SEL => [...document.querySelectorAll(SEL)].map((el, i) => ({
    i,
    disabled: !!el.disabled,
    hidden: el.getClientRects().length === 0,
    on: /(^|\s)(on|active)(\s|$)/.test(String(el.className)),
    label: ((el.id ? '#' + el.id + ' ' : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') + ' ' : '') +
      (el.dataset.act ? 'act=' + el.dataset.act + ' ' : '') + (el.dataset.modal ? 'modal=' + el.dataset.modal + ' ' : '') +
      (el.getAttribute('aria-label') ? 'aria="' + el.getAttribute('aria-label') + '" ' : '') + '"' + (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 34) + '"').trim()
  })), SEL);

  let clicks = 0, noEffect = 0, errCount = 0, hidden = 0;
  for (const c of inventory) {
    if (c.disabled) continue;
    if (c.hidden) { hidden++; continue; }
    await restore(); await load();
    const before = { errs: errors.length, dl: downloads.length, url: page.url() };
    const start = await page.evaluate(([sel, i]) => {
      const el = document.querySelectorAll(sel)[i];
      if (!el) return { missing: true };
      window.__mut = 0;
      if (window.__obs) window.__obs.disconnect();
      window.__obs = new MutationObserver(m => { window.__mut += m.length; });
      window.__obs.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
      window.__p0 = window.__printed;
      const isCheck = el.tagName === 'INPUT' && /checkbox|radio/.test(el.type);
      const beforeChecked = isCheck ? el.checked : null;
      try { el.click(); return { ok: true, p0: window.__p0, toggled: isCheck ? el.checked !== beforeChecked : false }; }
      catch (e) { return { clickError: e.message, p0: window.__p0 }; }
    }, [SEL, c.i]).catch(e => ({ nav: true }));
    await page.waitForTimeout(160);
    let after;
    try {
      after = await page.evaluate(() => ({ mut: window.__mut || 0, url: location.href, printed: window.__printed, toast: (document.getElementById('kit-toast') || {}).textContent || '' }));
    } catch (e) { after = { url: page.url(), nav: true }; }
    clicks++;
    const nav = after.url && after.url !== before.url;
    const dl = downloads.length > before.dl;
    const printed = (after.printed || 0) > (start.p0 || 0);
    const mut = after.mut > 0 || !!start.toggled;
    const err = errors.length > before.errs;
    if (start.missing) note(name, 'MISSING', c.label);
    if (start.clickError) note(name, 'CLICK-ERROR', c.label, start.clickError.slice(0, 100));
    if (err) { errCount++; note(name, 'CONSOLE-ERROR', c.label, String(errors.slice(-1)[0]).split('\n')[0].slice(0, 120)); }
    if (!nav && !dl && !printed && !mut) { noEffect++; note(name, c.on ? 'NO-EFFECT (active)' : 'NO-EFFECT', c.label); }
    try { await page.keyboard.press('Escape'); } catch (e) {}
    if (dl) await page.waitForTimeout(120);
  }

  await restore(); await load();
  const rec = { page: name, controls: inventory.length, clicks, hidden, noEffect, errCount, links: links.length, selects: selectCount, selBad, downloads: downloads.length, dialogs: dialogs.length, consoleErrors: errors.length };
  report.pages.push(rec);
  console.log(`   controls ${inventory.length} (clicked ${clicks}, hidden ${hidden}) | NO-EFFECT ${noEffect} | clickErrors ${errCount} | links ${links.length} | selects ${selectCount} (bad ${selBad}) | downloads ${downloads.length} | consoleErrors ${errors.length}`);
  await page.close();
}

const outFile = process.env.OUT || path.join(tmpdir(), 'button-sweep.json');
await writeFile(outFile, JSON.stringify(report, null, 1));
console.log(`\nTOTAL anomalies: ${report.anomalies.length} (full detail in ${outFile})`);
if (server) server.close();
process.exit(report.anomalies.length ? 1 : 0);