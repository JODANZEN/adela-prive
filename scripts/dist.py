#!/usr/bin/env python3
"""Build the site into dist/ for hosting (Cloudflare Workers / Pages, GitHub Pages).

    python scripts/dist.py

Runs build.py (products list + small photos), then copies only the files
visitors need into dist/. Cloudflare settings:
    Build command:     pip install pillow && python scripts/dist.py
    Deploy command:    npx wrangler deploy      (reads wrangler.jsonc)
"""
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
KEEP = ["index.html", "collection.html", "product.html", "atelier.html", "contact.html",
        "404.html", "assets", "admin", "_headers", "robots.txt"]
SITE = "https://www.adelaprive.com/"

subprocess.run([sys.executable, str(ROOT / "scripts" / "build.py")], check=True)
shutil.rmtree(DIST, ignore_errors=True)
DIST.mkdir()
for name in KEEP:
    src = ROOT / name
    if src.is_dir():
        shutil.copytree(src, DIST / name)
    elif src.is_file():
        shutil.copy2(src, DIST / name)
# ---- pages search engines can read without running the site's JavaScript ----
import html
import json
import re

products = json.loads(re.search(r"window\.PRODUCTS = (.*);\s*$", (ROOT / "assets/js/products.js").read_text(encoding="utf-8"), re.S).group(1))
config = (ROOT / "assets/js/config.js").read_text(encoding="utf-8")
INSTAGRAM = "https://www.instagram.com/" + re.search(r'instagram:\s*"([^"]+)"', config).group(1) + "/"
PHONE = re.search(r'phone:\s*"([^"]+)"', config).group(1)
esc = lambda v: html.escape(v or "", quote=True)
abs_img = lambda src: SITE + src  # src already carries its ?v= fingerprint
STATUS = {"available": "https://schema.org/InStock", "made-to-order": "https://schema.org/MadeToOrder",
          "sold": "https://schema.org/SoldOut"}

def static_card(p):
    img = p["images"][0] if p["images"] else ""
    return (f'<a class="card" href="piece/{p["slug"]}"><div class="card__media"><div class="photo">'
            + (f'<img src="{esc(img)}" alt="{esc(p["name"]["en"])}" loading="lazy">' if img else "")
            + f'</div></div><div class="card__meta"><span class="card__name">{esc(p["name"]["en"])}</span>'
            + f'<span class="card__price">{esc(p["price"])}</span></div></a>')

def ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False).replace("</", "<\\/") + "</script>"

def set_meta(page, title, desc, url, image=None):
    page = re.sub(r"<title>.*?</title>", f"<title>{esc(title)}</title>", page, flags=re.S)
    page = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{esc(desc)}">', page)
    page = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{esc(title)}">', page)
    page = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{esc(desc)}">', page)
    page = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{esc(url)}">', page)
    if image:
        page = re.sub(r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="{esc(image)}">', page)
        page = re.sub(r'<meta property="og:image:(width|height)" content="[^"]*">\n', "", page)
    return page.replace("</head>", f'<link rel="canonical" href="{esc(url)}">\n</head>', 1)

# one page per piece: /piece/<slug>
template = (ROOT / "product.html").read_text(encoding="utf-8")
(DIST / "piece").mkdir()
for p in products:
    name, desc_en = p["name"]["en"], p["description"]["en"]
    d = p["details"]
    url = f"{SITE}piece/{p['slug']}"
    desc = (desc_en + ". " if desc_en else "") + f"Hand-crocheted by Adela Privé. Order on Instagram or by phone."
    images = [abs_img(i) for i in p["images"]]
    page = template.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="/">', 1)
    page = set_meta(page, f"{name} — Adela Privé", desc.replace("..", "."), url, images[0] if images else None)
    product = {"@context": "https://schema.org", "@type": "Product", "name": name,
               "description": desc_en or name, "image": images, "sku": p["ref"] or p["id"],
               "brand": {"@type": "Brand", "name": "Adela Privé"}, "url": url,
               "material": d["material"]["en"] or None, "color": d["colour"]["en"] or None}
    num = re.search(r"\d+(?:[.,]\d+)?", p["price"] or "")
    if num:
        product["offers"] = {"@type": "Offer", "price": num.group(0).replace(",", "."), "priceCurrency": "EUR",
                             "availability": STATUS.get(p["status"], STATUS["available"]), "url": url}
    product = {k: v for k, v in product.items() if v}
    page = page.replace("</head>", ld(product) + "\n</head>", 1)
    page = page.replace('data-page="product"', f'data-page="product" data-id="{esc(p["id"])}"', 1)
    alt = lambda i: esc(name if i == 0 else f"{name} — photo {i + 1}")
    static = (f'<h1>{esc(name)}</h1><p>{esc(p["price"])}</p><p>{esc(desc_en)}</p>'
              f'<p>{esc(d["material"]["en"])} · {esc(d["dimensions"]["en"])} · {esc(d["colour"]["en"])}</p>'
              + "".join(f'<img src="{esc(src)}" alt="{alt(i)}" width="400" loading="lazy">' for i, src in enumerate(p["images"])))
    page = page.replace('<div class="wrap" id="product"></div>', f'<div class="wrap" id="product">{static}</div>', 1)
    (DIST / "piece" / f"{p['slug']}.html").write_text(page, encoding="utf-8")

# the old ?id= page stays working for old links, but only the /piece/ pages get indexed
pp = DIST / "product.html"
pp.write_text(pp.read_text(encoding="utf-8").replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex, follow">', 1), encoding="utf-8")

# collection + home: real links to every piece (the site's script replaces them with the full cards)
cards = "".join(static_card(p) for p in products)
for f, grid in [("collection.html", "collection-grid"), ("index.html", "featured")]:
    fp = DIST / f; page = fp.read_text(encoding="utf-8")
    page = page.replace(f'id="{grid}"></div>', f'id="{grid}">{cards if grid == "collection-grid" else "".join(static_card(p) for p in products[:4])}</div>', 1)
    canon = SITE if f == "index.html" else SITE + f.replace(".html", "")
    page = page.replace("</head>", f'<link rel="canonical" href="{canon}">\n</head>', 1)
    if f == "index.html":
        page = page.replace("</head>", ld({"@context": "https://schema.org", "@type": "Organization", "name": "Adela Privé",
            "url": SITE, "logo": SITE + "assets/img/favicon.svg", "image": SITE + "assets/img/share.jpg",
            "telephone": PHONE, "sameAs": [INSTAGRAM],
            "description": "Unique hand-crocheted bags and accessories."}) + "\n</head>", 1)
    fp.write_text(page, encoding="utf-8")
for f in ["atelier.html", "contact.html"]:
    fp = DIST / f
    fp.write_text(fp.read_text(encoding="utf-8").replace("</head>", f'<link rel="canonical" href="{SITE}{f.replace(".html", "")}">\n</head>', 1), encoding="utf-8")

# sitemap, with every piece's photos so they can show in Google Images
entries = [f"  <url><loc>{SITE}{u}</loc></url>\n" for u in ["", "collection", "atelier", "contact"]]
for p in products:
    imgs = "".join(f"<image:image><image:loc>{esc(abs_img(i))}</image:loc></image:image>" for i in p["images"])
    entries.append(f"  <url><loc>{SITE}piece/{p['slug']}</loc>{imgs}</url>\n")
(DIST / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
    'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + "".join(entries) + "</urlset>\n", encoding="utf-8")
print(f"dist/: {sum(1 for _ in DIST.rglob('*') if _.is_file())} files")
