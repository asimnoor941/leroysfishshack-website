// Headless Chrome screenshots for visual QA.
//
//   node shot.mjs <url> <out.png> [--w=1440] [--h=900] [--full] [--mobile] [--scroll=0.5|1200px]
//                 [--wait=800] [--reduced] [--click=selector] [--js="expr"] [--clip=x,y,w,h] [--scale=1]
//
// --full    scrolls through the page first (so scroll reveals fire) and captures the whole page
// --mobile  390x844, touch, DPR 2, iPhone user agent
// --scroll  fraction of the scrollable height, or a pixel offset
import puppeteer from 'puppeteer-core';

const args = process.argv.slice(2);
const [url, out] = args;
const opt = Object.fromEntries(
  args.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/s);
    return m ? [m[1], m[2] ?? true] : [a, true];
  }),
);

const mobile = Boolean(opt.mobile);
const width = Number(opt.w ?? (mobile ? 390 : 1440));
const height = Number(opt.h ?? (mobile ? 844 : 900));
const scale = Number(opt.scale ?? (mobile ? 2 : 1));

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars', '--force-color-profile=srgb', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: scale, isMobile: mobile, hasTouch: mobile });
if (mobile)
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  );
if (opt.reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

const logs = [];
page.on('console', (m) => {
  if (['error', 'warning'].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) => logs.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`));
page.on('response', (r) => {
  if (r.status() >= 400) logs.push(`[http ${r.status()}] ${r.url()}`);
});

await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await page.evaluate(() => document.fonts.ready);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (opt.full) {
  // Walk the page so IntersectionObserver reveals and lazy media fire.
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Math.round(height * 0.6)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(140);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
}

if (opt.scroll) {
  const target = await page.evaluate((v) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = String(v).endsWith('px') ? parseFloat(v) : parseFloat(v) * max;
    window.scrollTo(0, y);
    return y;
  }, opt.scroll);
  await sleep(900);
  logs.push(`[info] scrolled to ${Math.round(target)}`);
}

if (opt.click) {
  await page.click(opt.click);
  await sleep(700);
}
if (opt.js) {
  const result = await page.evaluate(opt.js);
  if (result !== undefined) logs.push(`[js] ${JSON.stringify(result)}`);
  await sleep(500);
}
await sleep(Number(opt.wait ?? 600));

const shot = { path: out, type: out.endsWith('.jpg') ? 'jpeg' : 'png' };
if (shot.type === 'jpeg') shot.quality = 80;
if (opt.full) shot.fullPage = true;
if (opt.clip) {
  const [x, y, w, h] = String(opt.clip).split(',').map(Number);
  shot.clip = { x, y, width: w, height: h };
}
await page.screenshot(shot);

const info = await page.evaluate(() => ({
  title: document.title,
  height: document.documentElement.scrollHeight,
  overflowX: document.documentElement.scrollWidth > window.innerWidth,
}));
console.log(JSON.stringify(info));
for (const l of [...new Set(logs)].slice(0, 25)) console.log(l);
await browser.close();
