"""Mirror the pages, text and media of the client's live site into reference/.

    python -I tools/mirror.py reference/original-site example.com

Writes, under the output folder:
  pages/<slug>.html     raw HTML of every page
  content/<slug>.md     readable text of every page (the source of truth for copy)
  media/ theme-assets/  images, video, fonts used by the pages
  css/                  stylesheets
  manifest.json         what was saved, where each asset is used, embeds, failures

Pages come from the site's sitemaps (WordPress: wp-sitemap.xml, Yoast:
sitemap_index.xml, or plain sitemap.xml). If none exist it crawls same-host links
from the home page. Built for the Blackfin Fuels mirror; asset discovery is tuned
for WordPress (/wp-content/), but the page and text part works on any site.
"""
import base64, hashlib, html, json, os, re, sys, time, urllib.request, urllib.parse
from html.parser import HTMLParser

if len(sys.argv) < 3:
    sys.exit("usage: python -I tools/mirror.py <out-dir> <host>")
OUT = sys.argv[1]
HOST = sys.argv[2].replace("https://", "").replace("http://", "").strip("/")
BASE = f"https://{HOST}"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"


def fetch(url, tries=4):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read(), r.headers.get("Content-Type", "")
        except Exception as e:  # noqa
            last = e
            time.sleep(1.5 * (i + 1))
    raise last


def save(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)


def sitemap_locs(url, depth=0):
    try:
        raw, _ = fetch(url, tries=2)
    except Exception:
        return []
    text = raw.decode("utf-8", "replace")
    name = urllib.parse.urlparse(url).path.strip("/").replace("/", "__") or "sitemap"
    save(os.path.join(OUT, "api", name), raw)
    locs = [html.unescape(u.strip()) for u in re.findall(r"<loc>([^<]+)</loc>", text)]
    if "<sitemapindex" in text and depth < 2:
        out = []
        for sm in locs:
            out += sitemap_locs(sm, depth + 1)
        return out
    return locs


SKIP_PATH = re.compile(r"\.(?:png|jpe?g|webp|gif|svg|pdf|css|js|xml|mp4|zip)$|/wp-|/feed/|/tag/|/author/", re.I)
HREF_RE = re.compile(r"""href=["']([^"'#]+)""")


def crawl(limit=150):
    seen, queue = [], [BASE + "/"]
    while queue and len(seen) < limit:
        url = queue.pop(0)
        if url in seen:
            continue
        seen.append(url)
        try:
            raw, ctype = fetch(url, tries=2)
        except Exception:
            continue
        if "html" not in ctype:
            continue
        for href in HREF_RE.findall(raw.decode("utf-8", "replace")):
            full = urllib.parse.urljoin(url, href).split("?")[0]
            p = urllib.parse.urlparse(full)
            same = p.netloc.replace("www.", "") == HOST.replace("www.", "")
            if same and not SKIP_PATH.search(p.path) and full not in seen and full not in queue:
                queue.append(full)
    return seen


def page_urls():
    urls = []
    for sm in ("wp-sitemap.xml", "sitemap_index.xml", "sitemap.xml"):
        urls = [u for u in sitemap_locs(f"{BASE}/{sm}") if not re.search(r"\.(?:jpe?g|png|webp|gif|pdf)$", u, re.I)]
        if urls:
            break
    if not urls:
        print("no sitemap found, crawling links from the home page", flush=True)
        urls = crawl()
    return list(dict.fromkeys(urls))


class TextExtract(HTMLParser):
    SKIP = {"script", "style", "noscript", "svg", "template"}
    BLOCK = {"p", "div", "section", "li", "br", "tr", "h1", "h2", "h3", "h4", "h5", "h6",
             "header", "footer", "nav", "main", "article", "ul", "ol", "form", "label",
             "button", "option", "details", "summary", "figcaption", "blockquote", "td"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.skip, self.href = [], 0, None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in self.SKIP:
            self.skip += 1
            return
        if self.skip:
            return
        if tag in self.BLOCK:
            self.out.append("\n")
        if re.fullmatch(r"h[1-6]", tag):
            self.out.append("#" * int(tag[1]) + " ")
        if tag == "li":
            self.out.append("- ")
        if tag == "a":
            self.href = a.get("href")
            self.out.append("[")
        if tag == "img":
            src = a.get("src", "")
            if src.startswith("data:"):
                src = "(inline data image)"
            self.out.append(f"\n![{a.get('alt', '')}]({src})\n")
        if tag in ("input", "textarea", "select"):
            self.out.append(f"\n[field: {a.get('type', tag)} name={a.get('name', '')} "
                            f"placeholder={a.get('placeholder', '')}]\n")
        if tag == "iframe":
            self.out.append(f"\n[iframe: {a.get('src') or a.get('data-src', '')}]\n")
        if tag in ("video", "source"):
            if a.get("src"):
                self.out.append(f"\n[video: {a.get('src')}]\n")

    def handle_endtag(self, tag):
        if tag in self.SKIP:
            self.skip = max(0, self.skip - 1)
            return
        if self.skip:
            return
        if tag == "a":
            self.out.append(f"]({self.href})" if self.href else "]")
            self.href = None
        if tag in self.BLOCK:
            self.out.append("\n")

    def handle_data(self, data):
        if not self.skip:
            self.out.append(re.sub(r"\s+", " ", data))

    def text(self):
        t = "".join(self.out)
        t = re.sub(r"\[\s*\]\([^)]*\)", "", t)
        t = re.sub(r"[ \t]+\n", "\n", t)
        t = re.sub(r"\n[ \t]+", "\n", t)
        return re.sub(r"\n{3,}", "\n\n", t).strip() + "\n"


ASSET_EXT = r"(?:png|jpe?g|webp|gif|svg|avif|ico|mp4|webm|mov|m4v|mp3|pdf|woff2?|ttf|otf|eot|json|lottie)"
URL_RE = re.compile(r"(?:https?:)?//" + re.escape(HOST) + r"/wp-content/[^\s\"'()<>\\,]+?\." + ASSET_EXT +
                    r"(?=[\s\"'()<>\\,?#]|$)", re.I)
CSS_RE = re.compile(r"(?:https?:)?//" + re.escape(HOST) + r"/wp-content/[^\s\"'()<>\\,]+?\.css", re.I)
EXT_RE = re.compile(r"https?://[^\s\"'()<>\\]+", re.I)


def norm(u):
    if u.startswith("//"):
        u = "https:" + u
    return u


def main():
    assets, css_urls, external, inline_count = {}, set(), {}, 0
    manifest = {"pages": [], "media": [], "inline_images": [], "css": [], "failed": []}

    def note(urls, where):
        for u in urls:
            assets.setdefault(norm(u), set()).add(where)

    for url in page_urls():
        slug = urllib.parse.urlparse(url).path.strip("/") or "home"
        try:
            raw, _ = fetch(url)
        except Exception as e:
            manifest["failed"].append({"url": url, "error": str(e)})
            continue
        save(os.path.join(OUT, "pages", slug + ".html"), raw)
        doc = raw.decode("utf-8", "replace")
        flat = html.unescape(doc).replace("\\/", "/")
        note(URL_RE.findall(flat), slug)
        css_urls.update(norm(u) for u in CSS_RE.findall(flat))

        # inline base64 images
        seen = set()
        for m in re.finditer(r"data:image/([a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)", doc):
            ext = {"svg+xml": "svg", "jpeg": "jpg"}.get(m.group(1), m.group(1))
            try:
                blob = base64.b64decode(m.group(2))
            except Exception:
                continue
            if len(blob) < 400:
                continue
            h = hashlib.sha1(blob).hexdigest()[:10]
            if h in seen:
                continue
            seen.add(h)
            rel = f"media/inline/{h}.{ext}"
            if not os.path.exists(os.path.join(OUT, rel)):
                save(os.path.join(OUT, rel), blob)
                inline_count += 1
            manifest["inline_images"].append({"file": rel, "page": slug, "bytes": len(blob)})

        # external embeds worth recording
        for u in EXT_RE.findall(flat):
            if re.search(r"youtube|youtu\.be|vimeo|google\.com/maps|apps\.apple|play\.google|facebook\.com/|"
                         r"instagram\.com/|tiktok|linkedin\.com/|stripe|square|paypal|calendly|jotform|"
                         r"typeform|fonts\.googleapis", u):
                external.setdefault(u.rstrip(".,;"), set()).add(slug)

        title = re.search(r"<title>(.*?)</title>", doc, re.S)
        desc = re.search(r'<meta name="description" content="([^"]*)"', doc)
        body = re.search(r"<body.*</body>", doc, re.S)
        p = TextExtract()
        p.feed(body.group(0) if body else doc)
        md = (f"# Source: {url}\n\n- Title: {html.unescape(title.group(1).strip()) if title else ''}\n"
              f"- Meta description: {html.unescape(desc.group(1)) if desc else ''}\n\n---\n\n" + p.text())
        save(os.path.join(OUT, "content", slug + ".md"), md.encode("utf-8"))
        manifest["pages"].append({"url": url, "slug": slug, "html_bytes": len(raw)})
        print("page", slug, len(raw), flush=True)

    # media library originals (largest available)
    lib = []
    for page in range(1, 11):  # WordPress media library, if its REST API is public
        try:
            raw, _ = fetch(f"{BASE}/wp-json/wp/v2/media?per_page=100&page={page}", tries=1)
            batch = json.loads(raw)
        except Exception:
            break
        if not isinstance(batch, list) or not batch:
            break
        lib += batch
    save(os.path.join(OUT, "api", "media.json"), json.dumps(lib).encode("utf-8"))
    lib_meta = {}
    for m in lib:
        src = m.get("source_url")
        if not src:
            continue
        note([src], "media-library")
        d = m.get("media_details") or {}
        lib_meta[src] = {"alt": m.get("alt_text", ""), "title": (m.get("title") or {}).get("rendered", ""),
                         "width": d.get("width"), "height": d.get("height"), "mime": m.get("mime_type")}
        orig = d.get("original_image")
        if orig:
            note([src.rsplit("/", 1)[0] + "/" + orig], "media-library-original")

    for u in sorted(css_urls):
        try:
            raw, _ = fetch(u)
        except Exception as e:
            manifest["failed"].append({"url": u, "error": str(e)})
            continue
        rel = "css/" + urllib.parse.urlparse(u).path.split("/wp-content/")[1].replace("/", "__")
        save(os.path.join(OUT, rel), raw)
        manifest["css"].append({"url": u, "file": rel})
        text = raw.decode("utf-8", "replace")
        note(URL_RE.findall(text), "css")
        for rel_u in re.findall(r"url\(\s*['\"]?([^'\")]+)", text):
            if rel_u.startswith("data:"):
                continue
            full = urllib.parse.urljoin(u, rel_u.split("#")[0].split("?")[0])
            if HOST in full and "/wp-content/" in full and re.search(r"\." + ASSET_EXT + "$", full, re.I):
                note([full], "css")

    for u in sorted(assets):
        path = urllib.parse.unquote(urllib.parse.urlparse(u).path)
        kind = "media" if "/wp-content/uploads/" in path else "theme-assets"
        rel = kind + "/" + path.split("/wp-content/")[1]
        if kind == "media":
            rel = "media/" + path.split("/wp-content/uploads/")[1]
        dest = os.path.join(OUT, rel)
        entry = {"url": u, "file": rel, "used_on": sorted(assets[u]), **lib_meta.get(u, {})}
        try:
            if not os.path.exists(dest):
                raw, _ = fetch(u)
                save(dest, raw)
            entry["bytes"] = os.path.getsize(dest)
            manifest["media"].append(entry)
        except Exception as e:
            manifest["failed"].append({"url": u, "error": str(e)})
        print("asset", rel, entry.get("bytes", "FAILED"), flush=True)

    manifest["external"] = [{"url": u, "pages": sorted(p)} for u, p in sorted(external.items())]
    save(os.path.join(OUT, "manifest.json"), json.dumps(manifest, indent=1).encode("utf-8"))
    print(f"DONE pages={len(manifest['pages'])} media={len(manifest['media'])} "
          f"inline={inline_count} css={len(manifest['css'])} failed={len(manifest['failed'])}")


main()
