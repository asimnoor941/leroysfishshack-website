// Moves a finished build under a sub-path, e.g. for GitHub Pages project sites
// (https://<user>.github.io/<repo>/). The site's own links are root-relative
// ("/about-us/"), which is right on the real domain but would point outside
// the repo folder on Pages, so this prefixes every root-relative URL.
//
//   node scripts/rebase.mjs dist <repo-name>
//
// Only for preview hosting. The real site is built without it.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const [dir = 'dist', rawBase = ''] = process.argv.slice(2);
const base = '/' + rawBase.replace(/^\/+|\/+$/g, '');
if (base === '/') {
  console.log('rebase: no base given, nothing to do');
  process.exit(0);
}

// A root-relative URL: starts with one "/", not "//", not already under base.
const rooted = (url) => url.startsWith('/') && !url.startsWith('//') && !url.startsWith(base + '/') && url !== base;
const fix = (url) => (rooted(url) ? base + url : url);

function html(text) {
  return text
    .replace(/\b(href|src|action|poster|data-src)=("|')(\/[^"']*)\2/g, (m, attr, q, url) => `${attr}=${q}${fix(url)}${q}`)
    .replace(/\b(srcset|imagesrcset)=("|')([^"']*)\2/g, (m, attr, q, list) =>
      `${attr}=${q}${list.replace(/(^|,\s*)(\/[^\s,]+)/g, (mm, sep, url) => sep + fix(url))}${q}`,
    )
    .replace(/url\((['"]?)(\/[^)'"]+)\1\)/g, (m, q, url) => `url(${q}${fix(url)}${q})`);
}

function css(text) {
  return text.replace(/url\((['"]?)(\/[^)'"]+)\1\)/g, (m, q, url) => `url(${q}${fix(url)}${q})`);
}

function js(text) {
  // Bundled asset paths and the few absolute site paths used in scripts.
  return text.replace(/(["'`])(\/(?:_astro|video|api|get-app|free-estimate|app)\/[^"'`]*)\1/g, (m, q, url) => q + fix(url) + q);
}

function manifest(text) {
  return text.replace(/"(src|start_url|scope|url)":\s*"(\/[^"]*)"/g, (m, key, url) => `"${key}": "${fix(url)}"`);
}

const handlers = { '.html': html, '.css': css, '.js': js, '.mjs': js, '.webmanifest': manifest };

let changed = 0;
async function walk(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const full = join(path, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (handlers[extname(entry.name)]) {
      const before = await readFile(full, 'utf8');
      const after = handlers[extname(entry.name)](before);
      if (after !== before) {
        await writeFile(full, after);
        changed++;
      }
    }
  }
}

await walk(dir);
console.log(`rebase: prefixed root-relative URLs with ${base} in ${changed} files`);
