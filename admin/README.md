# Admin page

`https://jodanzen.github.io/adela-prive/admin/` — add, edit and remove pieces, photos,
prices and availability. Built with [Sveltia CMS](https://sveltiacms.app).

## Before she starts: switch off the Google Sheet

The site still reads prices, names and availability from the Google Sheet, and the
sheet wins over anything saved here. Once Adi can sign in, copy the sheet into
`content/products/` one last time and set `sheetId: ""` in `assets/js/config.js`.
After that, this admin page is the only place to edit pieces.

## How it works

- Each piece is one file in `content/products/`. Photos go to `assets/uploads/`
  (converted to WebP, max 1400×1750, on upload).
- Saving commits to GitHub. The **Build and publish site** action
  (`.github/workflows/pages.yml`) then runs `scripts/build.py`, which writes
  `assets/js/products.js` and the small `-sm` grid photos, and publishes the site.
  Live in about a minute.
- Every change is a commit, so anything deleted can be restored from GitHub history.

## Who can sign in

Anyone with **write access to the repo**. To give Adela access:
repo → Settings → Collaborators → Add people → her GitHub username.

## Sign-in options

**A. Access token (works now, no setup).** On the admin page choose
"Sign In with Token". Create the token at GitHub → Settings → Developer settings →
Personal access tokens → Fine-grained → Repository access: only `adela-prive` →
Permissions: Contents **Read and write**. Each person makes their own.

**B. "Sign in with GitHub" button (nicer for her, ~10 min, free).**
1. Deploy the helper: https://github.com/sveltia/sveltia-cms-auth → "Deploy to Cloudflare Workers"
   (free Cloudflare account). Note its URL, e.g. `https://sveltia-cms-auth.NAME.workers.dev`.
2. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App:
   - Homepage URL: `https://jodanzen.github.io/adela-prive/`
   - Authorization callback URL: `<worker URL>/callback`
3. In the Cloudflare worker settings → Variables, add `GITHUB_CLIENT_ID`,
   `GITHUB_CLIENT_SECRET` (from the OAuth app) and `ALLOWED_DOMAINS` = `jodanzen.github.io`
   (add her own domain later).
4. Uncomment `base_url:` in `admin/config.yml` and set it to the worker URL.

## Local preview

Product data is generated. After pulling changes made on the admin page, run
`python scripts/build.py` (needs `pip install pillow` for thumbnails) before opening
`index.html` locally.

## Custom domain (e.g. adelaprive.com)

1. Buy the domain (Cloudflare Registrar or Porkbun, about $10–11 a year for a .com).
2. DNS records at the registrar:
   - `A` for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` for `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` for `www` → `jodanzen.github.io`
   (On Cloudflare, set these to "DNS only", grey cloud.)
3. Repo → Settings → Pages → Custom domain: `adelaprive.com` → Save. When the check
   passes, tick **Enforce HTTPS** (the certificate can take up to an hour).
4. Update `site_url` / `display_url` / `logo` in `admin/config.yml`, and add the new
   domain to `ALLOWED_DOMAINS` on the sign-in worker.
