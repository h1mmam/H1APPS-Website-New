let lang = localStorage.getItem('h1apps-language') || 'en'; document.querySelector('.products-loading')?.remove();
const params = new URLSearchParams(location.search), id = params.get('id'), slug = params.get('slug');
const ui = { ar: { back: 'كل المنتجات', details: 'تفاصيل المنتج', pages: 'صفحات المنتج', stores: 'روابط التحميل', features: 'المميزات', gallery: 'صور المنتج', notFound: 'المنتج غير موجود' }, en: { back: 'All products', details: 'Product details', pages: 'Product pages', stores: 'Download links', features: 'Features', gallery: 'Product gallery', notFound: 'Product not found' } };
function text(app, key) { return lang === 'en' ? (app[`${key}En`] || '') : (app[key] || ''); }
function storeLinks(app) { const links = [['appleStoreUrl', '  App Store'], ['googlePlayUrl', '▶  Google Play'], ['huaweiStoreUrl', '▣  AppGallery'], ['directDownloadUrl', lang === 'en' ? '↓  Direct download' : '↓  تحميل مباشر']].filter(([key]) => app[key]); if (!links.length) return ''; return `<div class="store-links"><h2>${ui[lang].stores}</h2><div>${links.map(([key, label]) => `<a class="store-link" href="${app[key]}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join('')}</div></div>`; }
function listValue(value) { return Array.isArray(value) ? value : value && typeof value === 'object' ? Object.values(value) : []; }
function localizedValue(value) { if (typeof value === 'string') return value; if (!value || typeof value !== 'object') return ''; return value[lang] || value[lang === 'en' ? 'en' : 'ar'] || value.title || value.name || value.text || value.description || ''; }
function featureSection(app) {
  const items = listValue(app.features || app.featureList).map(localizedValue).map((item) => item.trim()).filter(Boolean);
  if (!items.length) return '';
  return `<section class="product-section product-section--features"><div class="product-section__label"><span class="section-kicker">${ui[lang].features}</span><h2>${ui[lang].features}</h2></div><div class="features-grid">${items.map((item) => `<article class="feature-card"><span class="feature-card__marker" aria-hidden="true"></span><p>${item}</p></article>`).join('')}</div></section>`;
}
function gallerySection(app, title) {
  const source = app.gallery || app.images || app.screenshots;
  const items = listValue(source).map((item) => typeof item === 'string' ? { url: item } : item).filter((item) => item?.url || item?.imageUrl || item?.src);
  if (!items.length) return '';
  return `<section class="product-section product-section--gallery"><div class="product-section__label"><span class="section-kicker">${ui[lang].gallery}</span><h2>${ui[lang].gallery}</h2></div><div class="product-gallery">${items.map((item) => { const url = item.url || item.imageUrl || item.src; const alt = localizedValue(item.alt || item.title) || title; const contain = item.fit === 'contain' || item.type === 'screenshot' || item.type === 'mockup'; return `<figure class="product-gallery__item"><img src="${url}" alt="${alt}" loading="lazy" decoding="async" width="720" height="480" class="${contain ? 'is-contain' : ''}">${localizedValue(item.caption) ? `<figcaption>${localizedValue(item.caption)}</figcaption>` : ''}</figure>`; }).join('')}</div></section>`;
}
function render(app) {
  if (!app) { document.getElementById('productRoot').innerHTML = `<div class="products-empty">${ui[lang].notFound}</div>`; return; }
  document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const title = text(app, 'title');
  const shortDescription = text(app, 'shortDescription');
  const fullDescription = text(app, 'fullDescription');
  const details = fullDescription.trim() ? `<section class="product-section product-section--details"><div class="product-section__label"><span class="section-kicker">${ui[lang].details}</span><h2>${ui[lang].details}</h2></div><div class="product-section__content"><p>${fullDescription}</p></div></section>` : '';
  const features = featureSection(app);
  const gallery = gallerySection(app, title);
  const image = app.imageUrl ? `<img class="product-visual__image" src="${app.imageUrl}" alt="${title || ''}" decoding="async" fetchpriority="high" width="720" height="480">` : '';
  document.getElementById('productRoot').innerHTML = `<section class="product-detail product-detail-page container">
    <a class="back-link product-back-link" href="products.html"><span aria-hidden="true">←</span>${ui[lang].back}</a>
    <section class="product-hero" aria-labelledby="productTitle">
      <div class="product-hero__content">
        <span class="product-hero__kicker section-kicker">${app.type || app.category || ''}</span>
        <h1 id="productTitle">${title}</h1>
        <p class="product-lead">${shortDescription}</p>
        ${storeLinks(app)}
      </div>
      <div class="product-visual${image ? '' : ' product-visual--empty'}">
        <div class="product-visual__glow" aria-hidden="true"></div>
        <div class="product-visual__frame">${image}</div>
      </div>
    </section>
    ${details}
    ${features}
    ${gallery}
    <div id="customPages" class="custom-pages"></div>
  </section>`;
  const heroImage = document.querySelector('.product-visual__image');
  heroImage?.addEventListener('load', () => document.querySelector('.product-visual')?.classList.add('is-ready'), { once: true });
  const revealItems = document.querySelectorAll('.product-section, .feature-card, .product-gallery__item, .custom-pages');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); current.unobserve(entry.target); } }), { threshold: .12 });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add('is-visible'));
  loadPages(app.id); if (title) document.title = title; if (shortDescription) document.querySelector('meta[name="description"]').content = shortDescription; document.querySelector('meta[property="og:image"]').content = app.imageUrl || ''; history.replaceState(null, '', `product.html?slug=${encodeURIComponent(app.slug)}`);
}
function loadPages(productId) { firebase.firestore().collection('site_products').doc(productId).collection('pages').get().then((s) => { const pages = s.docs.filter((d) => d.data().published === true).sort((a, b) => (a.data().order || 0) - (b.data().order || 0)); if (!pages.length) return; document.getElementById('customPages').innerHTML = `<h2>${ui[lang].pages}</h2><div class="custom-page-list">${pages.map((d) => { const p = d.data(); return `<a href="product-page.html?product=${productId}&page=${d.id}">${lang === 'en' ? (p.titleEn || p.title) : p.title}<span>↗</span></a>`; }).join('')}</div>`; }); }
function loadProduct() { if (id) return firebase.firestore().collection('site_products').doc(id).get().then((s) => { window.product = s.exists ? { id: s.id, ...s.data() } : null; render(window.product); window.h1appsDataReady?.(); }).catch(() => {}); if (slug) return firebase.firestore().collection('site_products').where('slug', '==', slug).limit(1).get().then((s) => { const d = s.docs[0]; window.product = d ? { id: d.id, ...d.data() } : null; render(window.product); window.h1appsDataReady?.(); }).catch(() => {}); }
document.getElementById('arButton').addEventListener('click', () => { localStorage.setItem('h1apps-language','ar'); window.location.reload(); }); document.getElementById('enButton').addEventListener('click', () => { localStorage.setItem('h1apps-language','en'); window.location.reload(); });
try { firebase.initializeApp({ apiKey: 'AIzaSyDOlDg14fbH8kXfSbr6YCj6NECtEPJIdiU', authDomain: 'h1words.firebaseapp.com', projectId: 'h1words', storageBucket: 'h1words.firebasestorage.app', messagingSenderId: '594662600507', appId: '1:594662600507:web:h1appswebsite' }); loadProduct(); } catch (e) {}
if (!document.querySelector('script[data-premium-motion]')) { const s = document.createElement('script'); s.src = 'motion.js'; s.dataset.premiumMotion = 'true'; document.body.appendChild(s); }
