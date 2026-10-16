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

- **Contact details** → `assets/js/config.js`
- **Products** → `assets/js/products.js` (names, descriptions, details, photos, and
  `status`: `"available"`, `"made-to-order"` or `"sold"`).
- **Visit counter** → put your GoatCounter code in `goatcounter` in `assets/js/config.js`.
- **All text, both languages** → `assets/js/i18n.js`. Bulgarian should be proofread by a native speaker.
- **Colours / fonts / layout** → `assets/css/style.css` (tokens at the top).

### Adding product photos

1. Put photos in `assets/products/<id>/`, e.g. `assets/products/ap-01/1.jpg`, `2.jpg`.
2. List them in that product's `images` array in `products.js`, and make a 500px copy
   named `1-sm.webp`, `2-sm.webp`… (used in the grid so phones load faster).
3. First photo = main image; second = shown on hover in the grid. The home hero uses the
   first featured product that has a photo.

Portrait photos (4:5, e.g. 1600×2000) on a plain light background look best. Export as JPG
around 300–500 KB.

## Putting it online (free)

**GitHub Pages** (easiest, since the code is on GitHub):

1. Push this folder as a repo, e.g. `adela-prive`.
2. Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / root → Save.
3. The site is live at `https://<your-username>.github.io/adela-prive/`.

**To look professional, use a custom domain** (about $10–15/year, e.g. `adelaprive.com`
or `adelaprive.bg`). Buy it at Cloudflare Registrar, Porkbun or Namecheap, then in
Settings → Pages → Custom domain enter it and add the DNS records GitHub shows. HTTPS
is free and automatic. Visitors then never see "github.io" — the same applies to
Vercel/Netlify/Cloudflare Pages, all of which are also free for a site like this.

## Later

- Online payments: when Stripe is set up, the simplest step is a Stripe **Payment Link**
  per product — add a `stripe` URL to each product and a "Buy now" button next to "Enquire".
