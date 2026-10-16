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

- **Status, price, size, material, descriptions** → the Google Sheet "Adela Privé — Pieces"
  (id in `sheetId` in `assets/js/config.js`). Read live on every visit; empty cells fall back
  to the product files. Keep the `id` column and the header names as they are.
- **New pieces, photos, names** → the product files in `content/products/` (or, later, the admin page at `/admin`
  (see `admin/README.md`). Each piece is a file in `content/products/`;
  `assets/js/products.js` is generated from them — don't edit it by hand).
- **Contact details** → `assets/js/config.js`
- **Visit counter** → put your GoatCounter code in `goatcounter` in `assets/js/config.js`.
- **All other text, both languages** → `assets/js/i18n.js`. Bulgarian should be proofread by a native speaker.
- **Colours / fonts / layout** → `assets/css/style.css` (tokens at the top).

Publishing runs through GitHub Actions (`.github/workflows/pages.yml`): every push,
including admin saves, rebuilds the site. Run `python scripts/build.py` to preview locally.

## Putting it online (free)

**GitHub Pages** (easiest, since the code is on GitHub):

1. Push this folder as a repo, e.g. `adela-prive`.
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. The site is live at `https://<your-username>.github.io/adela-prive/`.

**To look professional, use a custom domain** (about $10–15/year, e.g. `adelaprive.com`
or `adelaprive.bg`). Buy it at Cloudflare Registrar, Porkbun or Namecheap, then in
Settings → Pages → Custom domain enter it and add the DNS records GitHub shows. HTTPS
is free and automatic. Visitors then never see "github.io" — the same applies to
Vercel/Netlify/Cloudflare Pages, all of which are also free for a site like this.

## Later

- Online payments: when Stripe is set up, the simplest step is a Stripe **Payment Link**
  per product — add a `stripe` URL to each product and a "Buy now" button next to "Enquire".
