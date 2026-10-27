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
# sitemap with every piece, so new pieces get found by search engines
ids = [f.stem for f in sorted((ROOT / "content" / "products").glob("*.json"))]
urls = ["", "collection.html", "atelier.html", "contact.html"] + [f"product.html?id={i}" for i in ids]
(DIST / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(f"  <url><loc>{SITE}{u}</loc></url>\n" for u in urls) + "</urlset>\n", encoding="utf-8")
print(f"dist/: {sum(1 for _ in DIST.rglob('*') if _.is_file())} files")
