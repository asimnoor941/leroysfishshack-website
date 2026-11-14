// Loads each page and reports HTTP errors, JS errors and broken internal links.
//   BASE=http://127.0.0.1:4321 node tools/qa/pagescheck.mjs / /about-us/ /contact-us/
// For a GitHub Pages build served under /<repo>/, put that in BASE; links that
// skip the /<repo>/ prefix are listed under linksNotRebased.
import puppeteer from 'puppeteer-core';

const base = (process.env.BASE ?? 'http://127.0.0.1:4321').replace(/\/$/, '');
const origin = new URL(base).origin;
const prefix = new URL(base).pathname.replace(/\/$/, '');
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];

const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const bad = new Set();
const errs = [];
const links = new Set();
for (const path of pages) {
  const p = await b.newPage();
  await p.setViewport({ width: 1400, height: 900 });
  p.on('response', (r) => { if (r.url().startsWith(origin) && r.status() >= 400) bad.add(r.status() + ' ' + r.url()); });
  p.on('pageerror', (e) => errs.push(path + ': ' + e.message));
  await p.goto(base + path, { waitUntil: 'networkidle0' });
  (await p.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')))).forEach((h) => links.add(h));
  await p.close();
}
const internal = [...links].filter((h) => h.startsWith('/'));
const outside = prefix ? internal.filter((h) => !h.startsWith(prefix + '/')) : [];
for (const h of internal) {
  const r = await fetch(origin + h.split('#')[0].split('?')[0]);
  if (r.status >= 400) bad.add(r.status + ' link ' + h);
}
console.log(JSON.stringify({ failed: [...bad], errors: errs, linksNotRebased: outside, internalLinks: internal.length }, null, 1));
await b.close();
