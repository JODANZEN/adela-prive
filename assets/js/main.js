/* ==================================================================
   Adela Privé — shared header/footer, language switching, pages.
   No build step: plain JS so the site runs anywhere (GitHub Pages,
   Cloudflare Pages, or just double-clicking index.html).
   ================================================================== */
(function () {
  "use strict";

  const S = window.SITE;
  const T = window.I18N;
  const P = window.PRODUCTS || [];
  const page = document.body.dataset.page;
  const IMG = "assets/img/";

  /* ---------- language ------------------------------------------ */
  function storedLang() {
    try { return localStorage.getItem("ap-lang"); } catch (e) { return null; }
  }
  function saveLang(l) {
    try { localStorage.setItem("ap-lang", l); } catch (e) { /* private mode */ }
  }
  const urlLang = new URLSearchParams(location.search).get("lang");
  let lang = (urlLang === "bg" || urlLang === "en") ? urlLang
    : storedLang() || ((navigator.language || "").toLowerCase().startsWith("bg") ? "bg" : S.defaultLang);

  function t(key, vars) {
    let s = (T[lang] && T[lang][key]) || T.en[key] || key;
    if (vars) Object.keys(vars).forEach(k => { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }
  const L = obj => (obj && (obj[lang] || obj.en)) || "";

  /* ---------- small helpers ------------------------------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const igProfile = () => "https://instagram.com/" + S.instagram;
  const igDM = () => "https://ig.me/m/" + S.instagram;
  const tel = () => "tel:" + S.phoneDial;
  const sms = body => "sms:" + S.phoneDial + (body ? "?&body=" + encodeURIComponent(body) : "");

  const ICON = {
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r=".9" fill="currentColor" stroke="none"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11 11 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.8 1.8 0 0 1-1.9 1.8C10.4 20.3 3.7 13.6 3.2 5.4A1.8 1.8 0 0 1 5 3.5Z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="8" y="8" width="12" height="12"/><path d="M16 8V4H4v12h4"/></svg>',
    sms: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>'
  };

  // product photos come in two sizes: 1000px (x.webp) and 500px (x-sm.webp)
  // photos uploaded on the admin page live in assets/uploads; the build makes a 500px "-sm" copy
  const isProduct = src => /assets\/uploads\/[^/]+\.(webp|jpe?g|png)$/i.test(src) && !/-sm\.webp$/.test(src);
  const small = src => isProduct(src) ? src.replace(/\.(webp|jpe?g|png)$/i, "-sm.webp") : src;
  // if a small copy is missing (e.g. a brand-new upload before the build ran), use the full photo
  const fallback = src => ' onerror="this.onerror=null;this.removeAttribute(\'srcset\');this.src=\'' + esc(src) + '\'"';
  const priceText = p => statusOf(p) === "sold" ? t("status.sold") : (p.price || t("product.price"));
  const refOf = p => p.ref || "";
  const withRef = (key, p, name) => t(key, { name: name, ref: refOf(p) }).replace(" ()", "");
  function imgTag(src, alt, opts) {
    const load = ' loading="' + (opts.eager ? "eager" : "lazy") + '" decoding="async"';
    if (opts.mode === "thumb") return '<img src="' + esc(small(src)) + '" alt="' + esc(alt) + '"' + load + fallback(src) + ">";
    if (opts.mode === "card" && isProduct(src))
      return '<img src="' + esc(small(src)) + '" srcset="' + esc(small(src)) + " 500w, " + esc(src) + ' 1000w"' +
        ' sizes="(max-width: 560px) 50vw, (max-width: 1080px) 34vw, 25vw" alt="' + esc(alt) + '"' + load + fallback(src) + ">";
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '"' + load + ">";
  }

  function photoHTML(images, alt, opts) {
    opts = opts || {};
    if (images && images.length) {
      const first = imgTag(images[0], alt, opts);
      const second = opts.hover && images[1] ? imgTag(images[1], "", { mode: opts.mode }) : "";
      return '<div class="photo">' + first + second + "</div>";
    }
    return '<div class="photo"><div class="placeholder" role="img" aria-label="' + esc(alt) + '">' +
      '<img src="' + IMG + 'monogram.svg" alt="">' +
      (opts.caption === false ? "" : "<span>" + esc(t("photo.soon")) + "</span>") + "</div></div>";
  }

  const statusOf = p => p.status || "available";
  function statusPill(p) {
    const st = statusOf(p);
    if (st === "available") return "";
    return '<span class="pill pill--' + esc(st) + '">' + esc(t("status." + st)) + "</span>";
  }

  function cardHTML(p) {
    return '<a class="card' + (statusOf(p) === "sold" ? " card--sold" : "") + '" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="card__media">' + photoHTML(p.images, L(p.name), { hover: true, caption: false, mode: "card" }) + statusPill(p) + "</div>" +
      '<div class="card__meta"><span class="card__name">' + esc(L(p.name)) + "</span>" +
      '<span class="card__cat">' + esc(t("cat." + p.category)) + "</span>" +
      '<span class="card__price">' + esc(priceText(p)) + "</span></div></a>";
  }

  /* ---------- header, drawer, footer ---------------------------- */
  function langSwitch() {
    return '<div class="lang" role="group" aria-label="' + esc(t("lang.label")) + '">' +
      '<button type="button" data-lang="en" aria-pressed="' + (lang === "en") + '" lang="en">EN</button><span aria-hidden="true">/</span>' +
      '<button type="button" data-lang="bg" aria-pressed="' + (lang === "bg") + '" lang="bg">БГ</button></div>';
  }
  function navLinks() {
    const cur = k => (page === k ? ' aria-current="page"' : "");
    return '<a href="collection.html"' + cur("collection") + ">" + esc(t("nav.collection")) + "</a>" +
      '<a href="atelier.html"' + cur("atelier") + ">" + esc(t("nav.atelier")) + "</a>" +
      '<a href="contact.html"' + cur("contact") + ">" + esc(t("nav.contact")) + "</a>";
  }

  function renderChrome() {
    const header = $("#site-header");
    if (header) {
      header.innerHTML =
        '<a class="skip" href="#main">' + esc(t("skip")) + "</a>" +
        '<div class="announce">' + esc(t("announce")) + "</div>" +
        '<div class="site-header"><div class="wrap header-inner">' +
          '<nav class="nav" aria-label="Main">' + navLinks() + "</nav>" +
          '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="drawer">' + esc(t("nav.menu")) + "</button>" +
          '<a class="brand" href="index.html" aria-label="' + esc(t("nav.home")) + '">' +
            '<img class="brand__mono" src="' + IMG + 'monogram.svg" alt="" width="46" height="36">' +
            '<img class="brand__word" src="' + IMG + 'wordmark.svg" alt="Adela Privé" width="150" height="24">' +
          "</a>" +
          '<div class="header-end">' + langSwitch() +
            '<a class="btn header-enquire" href="contact.html">' + esc(t("nav.enquire")) + "</a></div>" +
        "</div></div>" +
        '<div class="drawer on-wine" id="drawer" aria-hidden="true">' +
          '<div class="drawer__top"><img src="' + IMG + 'monogram-ivory.svg" alt="" width="44">' +
          '<button type="button" class="drawer-close">' + esc(t("nav.close")) + "</button></div>" +
          '<nav aria-label="Mobile">' + navLinks() + "</nav>" +
          '<div class="drawer__foot">' + langSwitch() +
            '<a href="' + igProfile() + '" target="_blank" rel="noopener">@' + esc(S.instagram) + "</a>" +
            '<a href="' + tel() + '">' + esc(S.phone) + "</a></div>" +
        "</div>";
    }

    const footer = $("#site-footer");
    if (footer) {
      footer.innerHTML =
        '<footer class="site-footer on-wine"><div class="wrap">' +
          '<div class="footer-top">' +
            '<div class="footer-brand"><img class="mono" src="' + IMG + 'monogram-ivory.svg" alt="">' +
              '<img class="word" src="' + IMG + 'wordmark-ivory.svg" alt="Adela Privé">' +
              '<div class="tagline">Couture Handknits</div></div>' +
            "<div><h2>" + esc(t("footer.pages")) + "</h2><ul>" +
              '<li><a href="collection.html">' + esc(t("nav.collection")) + "</a></li>" +
              '<li><a href="atelier.html">' + esc(t("nav.atelier")) + "</a></li>" +
              '<li><a href="contact.html">' + esc(t("nav.contact")) + "</a></li></ul></div>" +
            "<div><h2>" + esc(t("footer.reach")) + "</h2><ul>" +
              '<li><a href="' + igProfile() + '" target="_blank" rel="noopener">@' + esc(S.instagram) + "</a></li>" +
              '<li><a href="' + tel() + '">' + esc(S.phone) + "</a></li></ul></div>" +
          "</div>" +
          '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + " Adela Privé. " + esc(t("footer.made")) + "</span>" + langSwitch() + "</div>" +
        "</div></footer>";
    }

    // drawer behaviour
    const drawer = $("#drawer"), toggle = $(".menu-toggle");
    if (drawer && toggle) {
      const close = () => { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); toggle.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; toggle.focus(); };
      toggle.addEventListener("click", () => {
        drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
        toggle.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden";
        $(".drawer-close", drawer).focus();
      });
      $(".drawer-close", drawer).addEventListener("click", close);
      drawer.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    }

    $$("[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
  }

  /* ---------- static text --------------------------------------- */
  function applyText() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    // two-part titles in the style of her flyer: a script word + a serif word
    $$("[data-duo]").forEach(el => {
      const k = "duo." + el.dataset.duo;
      el.innerHTML = '<span class="duo__script">' + esc(t(k + ".a")) + '</span> <span class="duo__serif">' + esc(t(k + ".b")) + "</span>";
      el.setAttribute("aria-label", t(k + ".a") + " " + t(k + ".b"));
    });
    $$("[data-i18n-attr]").forEach(el => {
      el.dataset.i18nAttr.split(";").forEach(pair => {
        const [attr, key] = pair.split(":");
        el.setAttribute(attr, t(key));
      });
    });
    const titleKey = document.body.dataset.title;
    if (titleKey) document.title = t(titleKey);
    const md = $('meta[name="description"]');
    if (md) md.setAttribute("content", t("meta.description"));
    $$("[data-href='ig']").forEach(a => a.href = igProfile());
    $$("[data-href='tel']").forEach(a => a.href = tel());
    $$("[data-text='ig']").forEach(el => el.textContent = "@" + S.instagram);
    $$("[data-text='phone']").forEach(el => el.textContent = S.phone);
  }

  function setLang(l) {
    if (l === lang) return;
    lang = l; saveLang(l);
    render();
  }

  /* ---------- copy helper --------------------------------------- */
  function copyText(text, toastEl) {
    const done = ok => { if (toastEl) toastEl.textContent = t(ok ? "copied" : "copyFailed"); };
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => { done(true); return true; }, () => { done(false); return false; });
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy"); document.body.removeChild(ta);
      done(ok); return Promise.resolve(ok);
    } catch (e) { done(false); return Promise.resolve(false); }
  }

  /* ---------- pages --------------------------------------------- */
  function initHome() {
    const grid = $("#featured");
    if (grid) {
      const list = P.filter(p => p.featured).slice(0, 4);
      grid.innerHTML = (list.length ? list : P.slice(0, 4)).map(cardHTML).join("");
    }
    const frame = $("#hero-photo");
    if (frame) {
      const hero = P.find(p => p.hero && p.images.length) || P.find(p => p.featured && p.images.length) || P.find(p => p.images.length);
      frame.innerHTML = hero
        ? '<a href="product.html?id=' + encodeURIComponent(hero.id) + '">' + photoHTML(hero.images, L(hero.name), { eager: true }) + "</a>"
        : photoHTML([], "Adela Privé", { eager: true });
    }
    const ap = $("#atelier-photo");
    if (ap) ap.innerHTML = photoHTML(["assets/img/about-portrait.webp"], t("atelier.teaser.title"));
  }

  let currentFilter = "all";
  function initCollection() {
    const grid = $("#collection-grid");
    if (!grid) return;
    const draw = () => {
      const list = currentFilter === "all" ? P : P.filter(p => p.category === currentFilter);
      grid.innerHTML = list.map(cardHTML).join("");
      $("#count").textContent = t(list.length === 1 ? "count.one" : "count.many", { n: list.length });
      $$(".filters button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.filter === currentFilter)));
    };
    $$(".filters button").forEach(b => {
      b.onclick = () => { currentFilter = b.dataset.filter; draw(); };
    });
    const q = new URLSearchParams(location.search).get("c");
    if (q && !initCollection.done) currentFilter = q;
    initCollection.done = true;
    draw();
  }

  const CHEV = d => '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3"><path d="' + d + '"/></svg>';
  const PREV = CHEV("M15 4 7 12l8 8"), NEXT = CHEV("M9 4l8 8-8 8");

  function initProduct() {
    const root = $("#product");
    if (!root) return;
    const id = new URLSearchParams(location.search).get("id");
    const p = P.find(x => x.id === id);
    if (!p) {
      root.innerHTML = '<div class="notfound"><h1>' + esc(t("product.notFound")) + '</h1><a class="btn" href="collection.html">' + esc(t("product.back")) + "</a></div>";
      return;
    }
    const name = L(p.name);
    const ref = refOf(p);
    const st = statusOf(p);
    document.title = name + " — Adela Privé";
    const msg = withRef(st === "sold" ? "msg.sold" : (p.price ? "msg.piecePriced" : "msg.piece"), p, name);
    const imgs = p.images || [];
    const many = imgs.length > 1;

    // gallery: a swipeable strip of photos; thumbnails on desktop, dots on phones
    const slides = imgs.length
      ? imgs.map((src, i) => '<button type="button" class="gallery__slide" data-i="' + i + '" aria-label="' + esc(t("gallery.open", { n: i + 1 })) + '">' +
          imgTag(src, i === 0 ? name : "", { eager: i === 0 }) + "</button>").join("")
      : photoHTML([], name);
    const thumbs = many ? '<div class="gallery__thumbs">' + imgs.map((src, i) =>
        '<button type="button" data-i="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="' + esc(t("product.photo", { n: i + 1 })) + '">' +
        '<div class="photo">' + imgTag(src, "", { mode: "thumb" }) + "</div></button>").join("") + "</div>" : "";
    const dots = many ? '<div class="gallery__dots" aria-hidden="true">' + imgs.map((_, i) => '<span' + (i === 0 ? ' class="on"' : "") + "></span>").join("") + "</div>" : "";

    const detail = (key, val) => '<div><dt>' + esc(t("product." + key)) + "</dt><dd>" + esc(val || t("product.tbd")) + "</dd></div>";
    const d = p.details || {};

    root.innerHTML =
      '<div class="crumb"><a class="link" href="collection.html">' + esc(t("product.back")) + "</a></div>" +
      '<div class="product">' +
        '<div class="gallery' + (many ? "" : " gallery--single") + '">' + thumbs +
          '<div class="gallery__main"><div class="gallery__track" id="g-track">' + slides + "</div>" + statusPill(p) + dots + "</div></div>" +
        '<div class="info">' +
          (ref ? '<div class="ref">' + esc(t("product.ref")) + " " + esc(ref) + "</div>" : "") +
          "<h1>" + esc(name) + "</h1>" +
          '<div class="price">' + esc(priceText(p)) + "</div>" +
          '<p class="desc">' + esc(L(p.description)) + "</p>" +
          '<p class="handmade">' + esc(t("product.handmade")) + "</p>" +
          '<dl class="details">' +
            '<div><dt>' + esc(t("product.status")) + '</dt><dd class="status status--' + esc(st) + '">' + esc(t("status." + st)) + "</dd></div>" +
            detail("material", L(d.material)) + detail("dimensions", L(d.dimensions)) +
            detail("colour", L(d.colour)) +
          "</dl>" +
          '<section class="enquire" aria-labelledby="enq-h"><h2 id="enq-h">' + esc(t(st === "sold" ? "product.enquireSoldTitle" : "product.enquireTitle")) + "</h2>" +
            "<p>" + esc(t(st === "sold" ? "product.enquireSoldText" : "product.enquireText")) + "</p>" +
            '<div class="enquire__msg" id="enq-msg">' + esc(msg) + "</div>" +
            '<div class="enquire__actions">' +
              '<a class="btn" id="enq-ig" href="' + igDM() + '" target="_blank" rel="noopener">' + ICON.ig + esc(t("btn.instagram")) + "</a>" +
              '<a class="btn btn--ghost" href="' + tel() + '">' + ICON.phone + esc(t("btn.call", { phone: S.phone })) + "</a>" +
              '<button class="btn btn--ghost" type="button" id="enq-copy">' + ICON.copy + esc(t("btn.copy")) + "</button>" +
            "</div><div class=\"toast\" role=\"status\" id=\"enq-toast\"></div>" +
          "</section>" +
        "</div>" +
      "</div>" +
      (imgs.length ? lightboxHTML(imgs, name) : "");

    // the viewer must sit directly in <body> so it covers the sticky header
    const lbEl = $("#lightbox");
    $$(".lightbox").forEach(x => { if (x !== lbEl) x.remove(); });
    if (lbEl) document.body.appendChild(lbEl);

    // copy the message first so it can be pasted straight into the DM
    $("#enq-ig").addEventListener("click", () => { copyText(msg, $("#enq-toast")); });
    $("#enq-copy").addEventListener("click", () => copyText(msg, $("#enq-toast")));

    const track = $("#g-track");
    const go = (i, smooth) => track.scrollTo({ left: i * track.clientWidth, behavior: smooth ? "smooth" : "auto" });
    let cur = 0;
    track.addEventListener("scroll", () => {
      const i = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      if (i === cur) return;
      cur = i;
      $$(".gallery__thumbs button").forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
      $$(".gallery__dots span").forEach((s, j) => s.classList.toggle("on", j === i));
    }, { passive: true });
    $$(".gallery__thumbs button").forEach(b => b.addEventListener("click", () => go(+b.dataset.i, true)));
    $$(".gallery__slide").forEach(b => b.addEventListener("click", () => openLightbox(+b.dataset.i)));

    const rel = $("#related");
    if (rel) {
      const others = P.filter(x => x.id !== p.id).sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 4);
      rel.innerHTML = others.map(cardHTML).join("");
      $("#related-wrap").hidden = !others.length;
    }
  }

  /* ---------- full-screen photo viewer --------------------------- */
  function lightboxHTML(imgs, name) {
    return '<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="' + esc(name) + '" hidden>' +
      '<div class="lightbox__track" id="lb-track">' +
        imgs.map((src, i) => '<div class="lightbox__slide"><img src="' + esc(src) + '" alt="' + esc(t("product.photo", { n: i + 1 })) + '" loading="lazy"></div>').join("") +
      "</div>" +
      '<button type="button" class="lightbox__close">' + esc(t("nav.close")) + "</button>" +
      (imgs.length > 1
        ? '<button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="' + esc(t("gallery.prev")) + '">' + PREV + "</button>" +
          '<button type="button" class="lightbox__nav lightbox__nav--next" aria-label="' + esc(t("gallery.next")) + '">' + NEXT + "</button>" +
          '<div class="lightbox__count" aria-live="polite"></div>'
        : "") +
      "</div>";
  }
  let lbReturn = null;
  function openLightbox(i) {
    const lb = $("#lightbox"); if (!lb) return;
    const track = $("#lb-track"), n = track.children.length, count = $(".lightbox__count", lb);
    const at = () => Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
    const show = (k, smooth) => track.scrollTo({ left: Math.max(0, Math.min(n - 1, k)) * track.clientWidth, behavior: smooth ? "smooth" : "auto" });
    const label = () => { if (count) count.textContent = (at() + 1) + " / " + n; };
    const close = () => {
      lb.hidden = true; document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      if (lbReturn) lbReturn.focus();
    };
    const onKey = e => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(at() + 1, true);
      else if (e.key === "ArrowLeft") show(at() - 1, true);
    };
    lbReturn = document.activeElement;
    lb.hidden = false; document.body.style.overflow = "hidden";
    show(i, false); label();
    track.onscroll = label;
    $(".lightbox__close", lb).onclick = close;
    const pv = $(".lightbox__nav--prev", lb), nx = $(".lightbox__nav--next", lb);
    if (pv) pv.onclick = () => show(at() - 1, true);
    if (nx) nx.onclick = () => show(at() + 1, true);
    track.onclick = e => { if (e.target === track || e.target.classList.contains("lightbox__slide")) close(); };
    document.addEventListener("keydown", onKey);
    $(".lightbox__close", lb).focus();
  }

  let pickedPiece = null;
  function initContact() {
    const row = $("#c-piece");
    if (!row) return;
    if (pickedPiece === null) pickedPiece = new URLSearchParams(location.search).get("id") || "";
    const thumb = p => p.images && p.images[0]
      ? imgTag(p.images[0], "", { mode: "thumb" })
      : '<img class="mono" src="' + IMG + 'monogram.svg" alt="">';
    const opt = (id, label, img) =>
      '<label class="pick"><input type="radio" name="piece" value="' + esc(id) + '"' + (id === pickedPiece ? " checked" : "") + '>' +
      '<span class="pick__img">' + img + '</span><span class="pick__name">' + esc(label) + "</span></label>";
    row.innerHTML = opt("", t("contact.field.pieceNone"), '<img class="mono" src="' + IMG + 'monogram.svg" alt="">') +
      P.map(p => opt(p.id, L(p.name), thumb(p))).join("");
    const ta = $("#c-msg"), nameEl = $("#c-name");

    function compose() {
      const p = P.find(x => x.id === pickedPiece);
      return p ? withRef(p.price ? "msg.piecePriced" : "msg.piece", p, L(p.name)) : t("msg.general");
    }
    function finalText() {
      const n = nameEl.value.trim();
      return ta.value.trim() + (n ? "\n— " + n : "");
    }
    if (!ta.dataset.touched) ta.value = compose();
    ta.oninput = () => { ta.dataset.touched = "1"; };
    row.onchange = e => {
      pickedPiece = e.target.value; ta.value = compose(); ta.dataset.touched = "";
    };
    const sel = row.querySelector("input:checked");
    if (sel && pickedPiece) sel.closest(".pick").scrollIntoView({ block: "nearest", inline: "center" });
    // a real link opens Instagram; the click copies the message first
    $("#c-ig").href = igDM();
    $("#c-ig").onclick = () => { copyText(finalText(), $("#c-toast")); };
    $("#c-sms").onclick = () => { $("#c-sms").href = sms(finalText()); };
  }

  function render() {
    renderChrome();
    applyText();
    if (page === "home") initHome();
    if (page === "collection") initCollection();
    if (page === "product") initProduct();
    if (page === "contact") initContact();
  }

  render();

  /* ---------- visit counter (GoatCounter, no cookies) ------------- */
  if (S.goatcounter && /^https?:$/.test(location.protocol) && !/claude\.ai|claudeusercontent/.test(location.hostname)) {
    const pid = new URLSearchParams(location.search).get("id");
    window.goatcounter = { path: location.pathname + (pid ? "?id=" + pid : "") };
    const gc = document.createElement("script");
    gc.async = true; gc.src = "https://gc.zgo.at/count.js";
    gc.dataset.goatcounter = "https://" + S.goatcounter + ".goatcounter.com/count";
    document.body.appendChild(gc);
  }
})();
