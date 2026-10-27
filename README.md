# Adela Privé — website

Static, bilingual (English / Bulgarian) shop site for Adela Privé couture handknits.
No build step, no framework: open `index.html` in a browser and it works.

## Pages

| File | What it is |
|---|---|
| `index.html` | Home: hero, featured pieces, how to buy, atelier teaser |
| `collection.html` | All pieces, filter by purses / scarves |
| `product.html?id=ap-01` | One piece: photos, details, enquiry buttons |
| `atelier.html` | About page (**placeholder story — replace with hers**) |
| `contact.html` | Instagram, phone, and a message composer |
| `404.html` | Not-found page |

There is no checkout. Every "buy" path ends in an Instagram DM or a phone call/SMS,
with a pre-written message ("Hello! I'm interested in The Ribbon Purse (AP-01)…") copied
to the clipboard so the buyer can paste it.

## Editing

- **Name, status, price, size, material, colour, description (EN + BG columns)** → the Google Sheet "Adela Privé — Pieces"
  (id in `sheetId` in `assets/js/config.js`). Read live on every visit; empty cells fall back
  to the product files. Keep the `id` column and the header names as they are.
- **New pieces, photos, names** → the product files in `content/products/` (or, later, the admin page at `/admin`
  (see `admin/README.md`). Each piece is a file in `content/products/`;
  `assets/js/products.js` is generated from them — don't edit it by hand).
- **Contact details** → `assets/js/config.js`
- **Visit counter** → put your GoatCounter code in `goatcounter` in `assets/js/config.js`.
- **All other text, both languages** → `assets/js/i18n.js`. Bulgarian should be proofread by a native speaker.
- **Colours / fonts / layout** → `assets/css/style.css` (tokens at the top).

Publishing: every push to `main` (including saves from the admin page) makes Cloudflare
run `scripts/dist.py` and publish **www.adelaprive.com** (settings in `wrangler.jsonc`).
Run `python scripts/dist.py` and open `dist/` to preview locally.

## Where it lives

- **Site:** Cloudflare Workers, project `adela-prive`, domain `adelaprive.com` (same account).
- **Editing:** www.adelaprive.com/admin (see `admin/README.md`).
- **Old link:** `jodanzen.github.io/adela-prive` forwards to the new domain.

## Later

- Online payments: when Stripe is set up, the simplest step is a Stripe **Payment Link**
  per product — add a `stripe` URL to each product and a "Buy now" button next to "Enquire".
