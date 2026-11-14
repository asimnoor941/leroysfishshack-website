// Page weight and speed, old site vs new (desktop, then mobile).
//   node tools/qa/weigh.mjs https://live-site.com/ https://<user>.github.io/<repo>/
import puppeteer from 'puppeteer-core';

const urls = process.argv.slice(2);
if (!urls.length) throw new Error('usage: node tools/qa/weigh.mjs <url> [url...]');
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });

async function weigh(url, mobile) {
  const p = await b.newPage();
  await p.setViewport(mobile ? { width: 390, height: 844, isMobile: true, hasTouch: true } : { width: 1400, height: 900 });
  const c = await p.createCDPSession();
  await c.send('Network.enable');
  await c.send('Network.setCacheDisabled', { cacheDisabled: true });
  let bytes = 0, reqs = 0, scripts = 0;
  const hosts = new Set();
  c.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; });
  c.on('Network.requestWillBeSent', (e) => {
    reqs++;
    try { hosts.add(new URL(e.request.url).host); } catch {}
    if (e.type === 'Script') scripts++;
  });
  const t0 = Date.now();
  await p.goto(url, { waitUntil: 'load', timeout: 120000 });
  const load = Date.now() - t0;
  const m = await p.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return { dcl: Math.round(n.domContentLoadedEventEnd), fcp: fcp ? Math.round(fcp.startTime) : null, h1: document.querySelectorAll('h1').length, domNodes: document.querySelectorAll('*').length };
  });
  await new Promise((r) => setTimeout(r, 1500));
  await p.close();
  return { url, mobile, MB: +(bytes / 1048576).toFixed(2), requests: reqs, scriptRequests: scripts, hosts: hosts.size, loadMs: load, ...m };
}

for (const mobile of [false, true]) for (const url of urls) console.log(JSON.stringify(await weigh(url, mobile)));
await b.close();
