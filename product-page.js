const params = new URLSearchParams(location.search);
const productId = params.get('product');
const pageId = params.get('page');
const lang = localStorage.getItem('h1apps-language') || 'en'; document.querySelector('.products-loading')?.remove();

const ui = {
  ar: {
    back: 'المنتج', notFound: 'الصفحة غير موجودة', legal: 'وثيقة قانونية',
    terms: 'الشروط والأحكام', privacy: 'سياسة الخصوصية', download: 'تحميل التطبيق',
    quick: 'معلومات سريعة', stores: 'روابط التحميل الرسمية', about: 'عن التطبيق',
    contact: 'بيانات التواصل', owner: 'تابع لـ', updated: 'آخر تحديث',
    jurisdiction: 'القانون المعتمد', phone: 'رقم التواصل', website: 'الموقع الرسمي',
    openStore: 'فتح المتجر', direct: 'تحميل مباشر', version: 'الإصدار',
  },
  en: {
    back: 'Product', notFound: 'Page not found', legal: 'LEGAL DOCUMENT',
    terms: 'Terms & Conditions', privacy: 'Privacy Policy', download: 'Download the app',
    quick: 'Quick information', stores: 'Official download links', about: 'About the app',
    contact: 'Contact information', owner: 'Owned by', updated: 'Last updated',
    jurisdiction: 'Jurisdiction', phone: 'Phone', website: 'Official website',
    openStore: 'Open store', direct: 'Direct download', version: 'Version',
  },
};

function setupLanguageNavigation() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const productLink = nav.querySelector('a[href="products.html"]');
  if (productLink) productLink.textContent = lang === 'en' ? 'Products' : 'منتجاتنا';
  const switcher = document.createElement('div');
  switcher.className = 'language-switch';
  switcher.innerHTML = `<button type="button" class="${lang === 'ar' ? 'active' : ''}">عربي</button><button type="button" class="${lang === 'en' ? 'active' : ''}">EN</button>`;
  const buttons = switcher.querySelectorAll('button');
  buttons[0].onclick = () => { localStorage.setItem('h1apps-language', 'ar'); location.reload(); };
  buttons[1].onclick = () => { localStorage.setItem('h1apps-language', 'en'); location.reload(); };
  nav.append(switcher);
}

function esc(value) {
  return String(value || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[c]));
}

function field(data, key) {
  return data?.[key]?.[lang] || data?.[key]?.en || data?.[key]?.ar || '';
}

function productField(product, key) {
  return product?.[key]?.[lang] || product?.[key] || '';
}

function link(value) {
  try {
    const url = new URL(String(value || ''), window.location.href);
    if (!['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) return '';
    return esc(url.href);
  } catch (_) { return ''; }
}

function imageLink(value) {
  try {
    const url = new URL(String(value || ''), window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? esc(url.href) : '';
  } catch (_) { return ''; }
}

function metaRows(f) {
  const items = [
    [ui[lang].owner, field(f, 'owner')],
    [ui[lang].updated, field(f, 'lastUpdated')],
    [ui[lang].jurisdiction, field(f, 'jurisdiction')],
    [ui[lang].phone, field(f, 'supportPhone')],
  ].filter(([, value]) => value);
  return items.map(([label, value]) => `<div class="context-meta-row"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('');
}

function contactLinks(f) {
  const email = field(f, 'supportEmail');
  const phone = field(f, 'supportPhone');
  const website = field(f, 'websiteUrl');
  return [
    email && `<a href="mailto:${link(email)}">${esc(email)}</a>`,
    phone && `<a href="tel:${link(phone)}">${esc(phone)}</a>`,
    website && `<a href="${link(website)}" target="_blank" rel="noopener noreferrer">${esc(website)}</a>`,
  ].filter(Boolean).join('');
}

function section(id, title, value) {
  return `<section id="${id}" class="context-section"><h2>${esc(title)}</h2><p>${esc(value).replace(/\n/g, '<br>') || '—'}</p></section>`;
}

function brand(f, product, kicker, fallback) {
  const name = field(f, 'appName') || product?.title || 'H1APPS';
  const image = product?.imageUrl || '';
  const imageUrl = imageLink(image);
  return `<div class="context-brand">${imageUrl ? `<img src="${imageUrl}" alt="${esc(name)}" loading="eager">` : ''}<div><span class="context-kicker">${esc(kicker)}</span><h1>${esc(name)}</h1><p>${esc(field(f, 'subtitle') || fallback)}</p></div></div>`;
}

function renderTerms(page, product) {
  const f = page.termsFields || {};
  const email = field(f, 'supportEmail');
  const privacy = [
    ['privacyIntro', lang === 'en' ? 'Privacy policy introduction' : 'مقدمة سياسة الخصوصية'],
    ['dataCollected', lang === 'en' ? 'Data we collect' : 'البيانات التي يتم جمعها'],
    ['dataUse', lang === 'en' ? 'How we use data' : 'كيفية استخدام البيانات'],
    ['dataStorage', lang === 'en' ? 'Storage and security' : 'التخزين والأمان'],
    ['dataSharing', lang === 'en' ? 'Data sharing' : 'مشاركة البيانات'],
    ['privacyRights', lang === 'en' ? 'User rights' : 'حقوق المستخدم'],
    ['privacy', lang === 'en' ? 'Privacy and data' : 'الخصوصية والبيانات'],
    ['contact', lang === 'en' ? 'Contact us' : 'التواصل معنا'],
  ];
  const terms = [
    ['intro', lang === 'en' ? 'Introduction' : 'المقدمة'],
    ['scope', lang === 'en' ? 'Scope of the app or product' : 'نطاق التطبيق أو المنتج'],
    ['account', lang === 'en' ? 'Accounts and responsibility' : 'الحسابات والمسؤولية'],
    ['acceptableUse', lang === 'en' ? 'Acceptable and prohibited use' : 'الاستخدام المقبول والمحظور'],
    ['intellectualProperty', lang === 'en' ? 'Intellectual property' : 'الملكية الفكرية'],
    ['disclaimer', lang === 'en' ? 'Disclaimer and warranties' : 'إخلاء المسؤولية والضمانات'],
    ['changes', lang === 'en' ? 'Changes to these terms' : 'التعديلات على الشروط'],
    ['effectiveDate', lang === 'en' ? 'Effective date' : 'تاريخ السريان'],
  ];
  const panel = items => items.map(([key, title]) => section(key, title, field(f, key))).join('');
  return `<article class="context-page legal-template">
    <div class="context-hero">${brand(f, product, ui[lang].legal, lang === 'en' ? 'Official legal documents' : 'الصفحة القانونية الرسمية')}
      <div class="context-badges">${metaRows(f)}${email ? `<span>${esc(email)}</span>` : ''}</div>
    </div>
    <div class="legal-tabs"><button class="active" data-panel="privacyPanel">${ui[lang].privacy}</button><button data-panel="termsPanel">${ui[lang].terms}</button></div>
    <div class="context-layout">
      <aside class="context-side"><h2>${ui[lang].quick}</h2><a href="#privacyPanel">${ui[lang].privacy}</a><a href="#termsPanel">${ui[lang].terms}</a>${email ? `<a href="mailto:${link(email)}">${esc(email)}</a>` : ''}<div class="context-contact"><h3>${ui[lang].contact}</h3>${contactLinks(f)}</div></aside>
      <div class="context-content"><div id="privacyPanel" class="legal-panel active">${panel(privacy)}</div><div id="termsPanel" class="legal-panel">${panel(terms)}</div></div>
    </div>
  </article>`;
}

function renderDownload(page, product) {
  const f = page.downloadFields || {};
  const links = [
    ['appleStoreUrl', 'App Store', ''], ['googlePlayUrl', 'Google Play', '▶'],
    ['huaweiStoreUrl', 'AppGallery', '▣'], ['directDownloadUrl', ui[lang].direct, '↓'],
  ].map(([key, title, icon]) => [link(productField(product, key)), title, icon]).filter(([url]) => url);
  const storeCards = links.map(([url, title, icon]) => `<a class="context-store" href="${link(url)}" target="_blank" rel="noopener noreferrer"><b>${icon}</b><span>${title}<small>${ui[lang].openStore} ↗</small></span></a>`).join('');
  const email = field(f, 'supportEmail');
  const description = field(f, 'description') || productField(product, 'fullDescription');
  return `<article class="context-page download-template">
    <div class="context-hero">${brand(f, product, 'H1APPS DOWNLOAD', lang === 'en' ? 'Official download page' : 'صفحة التحميل الرسمية')}
      <div class="context-badges">${metaRows(f)}${field(f, 'version') ? `<span>${ui[lang].version}: ${esc(field(f, 'version'))}</span>` : ''}${email ? `<span>${esc(email)}</span>` : ''}</div>
    </div>
    <div class="context-layout">
      <aside class="context-side"><h2>${ui[lang].quick}</h2><a href="#download-links">${ui[lang].stores}</a><a href="#about-app">${ui[lang].about}</a><div class="context-contact"><h3>${ui[lang].contact}</h3>${contactLinks(f)}</div></aside>
      <div class="download-context-body"><section id="about-app" class="download-about"><h2>${ui[lang].about}</h2><p>${esc(description).replace(/\n/g, '<br>') || '—'}</p></section><section id="download-links" class="download-stores"><h2>${ui[lang].stores}</h2><div class="context-store-grid">${storeCards || `<p class="context-empty">—</p>`}</div></section></div>
    </div>
  </article>`;
}

function render(page, product) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (!page) { document.getElementById('pageRoot').innerHTML = `<div class="products-empty">${ui[lang].notFound}</div>`; return; }
  let content;
  if (page.template === 'terms') content = renderTerms(page, product);
  else if (page.template === 'download') content = renderDownload(page, product);
  else content = `<article class="custom-page container"><a class="back-link" href="product.html?id=${encodeURIComponent(productId)}">← ${ui[lang].back}</a><span class="section-kicker">H1APPS</span><h1>${esc(lang === 'en' ? (page.titleEn || page.title) : page.title)}</h1><div class="custom-page-content">${esc(lang === 'en' ? (page.contentEn || page.content) : page.content).replace(/\n/g, '<br>')}</div></article>`;
  document.getElementById('pageRoot').innerHTML = content;
  window.h1appsDataReady?.();
  document.title = `${lang === 'en' ? (page.titleEn || page.title) : page.title} | H1APPS`;
  document.querySelectorAll('.legal-tabs button').forEach(button => button.onclick = () => {
    document.querySelectorAll('.legal-tabs button,.legal-panel').forEach(el => el.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.panel).classList.add('active');
  });
}

setupLanguageNavigation();

try {
  firebase.initializeApp({ apiKey: 'AIzaSyDOlDg14fbH8kXfSbr6YCj6NECtEPJIdiU', authDomain: 'h1words.firebaseapp.com', projectId: 'h1words', storageBucket: 'h1words.firebasestorage.app', messagingSenderId: '594662600507', appId: '1:594662600507:web:2fcbf66623066c7bc8d11e' });
  Promise.all([
    firebase.firestore().collection('site_products').doc(productId).collection('pages').doc(pageId).get(),
    firebase.firestore().collection('site_products').doc(productId).get(),
  ]).then(([page, product]) => {
    const pageData = page.exists ? page.data() : null;
    const productData = product.exists ? product.data() : null;
    render(pageData && pageData.published !== false ? pageData : null, productData);
  }).catch(() => render(null, null));
} catch (error) {}
if (!document.querySelector('script[data-premium-motion]')) { const s = document.createElement('script'); s.src = 'motion.js'; s.dataset.premiumMotion = 'true'; document.body.appendChild(s); }
