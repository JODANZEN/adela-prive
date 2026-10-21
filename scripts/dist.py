#!/usr/bin/env python3
"""Build the site into dist/ for hosting (Cloudflare Pages).

    python scripts/dist.py

Runs build.py (products list + small photos), then copies only the files
visitors need into dist/. Cloudflare Pages settings:
    Build command:     pip install pillow && python scripts/dist.py
    Output directory:  dist
"""
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
KEEP = ["index.html", "collection.html", "product.html", "atelier.html", "contact.html",
        "404.html", "assets", "admin", "_headers"]

subprocess.run([sys.executable, str(ROOT / "scripts" / "build.py")], check=True)
shutil.rmtree(DIST, ignore_errors=True)
DIST.mkdir()
for name in KEEP:
    src = ROOT / name
    if src.is_dir():
        shutil.copytree(src, DIST / name)
    elif src.is_file():
        shutil.copy2(src, DIST / name)
print(f"dist/: {sum(1 for _ in DIST.rglob('*') if _.is_file())} files")
