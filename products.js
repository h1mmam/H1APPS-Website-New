let lang = localStorage.getItem('h1apps-language') || 'en';
document.body.classList.add('data-pending');
document.querySelector('main')?.classList.add('site-data-empty');

const firebaseConfig = {
  apiKey: 'AIzaSyDOlDg14fbH8kXfSbr6YCj6NECtEPJIdiU',
  authDomain: 'h1words.firebaseapp.com',
  projectId: 'h1words',
  storageBucket: 'h1words.firebasestorage.app',
  messagingSenderId: '594662600507',
  appId: '1:594662600507:web:h1appswebsite',
};

const labels = {
  ar: { about: 'من نحن', products: 'منتجاتنا', contact: 'تواصل معنا', direction: 'rtl', explore: 'استكشف المشروع' },
  en: { about: 'About us', products: 'Our work', contact: 'Contact', direction: 'ltr', explore: 'Explore project' },
};

const artProfiles = {
  bayn: { project: 'bayn', style: '--art-width:72%;--art-scale:1;--art-x:0px;--art-y:8px;--project-bg-start:#27162d;--project-bg-end:#0b0d1f;--project-glow:rgba(239,139,214,.24)' },
  stay: { project: 'h1stay', style: '--art-width:68%;--art-scale:.92;--art-x:-10px;--art-y:0px;--project-bg-start:#162033;--project-bg-end:#0b101d;--project-glow:rgba(229,189,105,.22)' },
  checkbook: { project: 'checkbook', style: '--art-width:58%;--art-scale:.88;--art-x:0px;--art-y:12px;--project-bg-start:#092b46;--project-bg-end:#071221;--project-glow:rgba(90,215,255,.25)' },
  check: { project: 'checkbook', style: '--art-width:58%;--art-scale:.88;--art-x:0px;--art-y:12px;--project-bg-start:#092b46;--project-bg-end:#071221;--project-glow:rgba(90,215,255,.25)' },
  kholasa: { project: 'kholasa', style: '--art-width:58%;--art-scale:.82;--art-x:0px;--art-y:0px;--project-bg-start:#17253a;--project-bg-end:#07101e;--project-glow:rgba(129,178,230,.22)' },
  alameer: { project: 'alameer', style: '--art-width:88%;--art-scale:.96;--art-x:0px;--art-y:0px;--project-bg-start:#182832;--project-bg-end:#081219;--project-glow:rgba(142,201,216,.2)' },
  taxi: { project: 'taxi', style: '--art-width:76%;--art-scale:.9;--art-x:0px;--art-y:0px;--project-bg-start:#1d2332;--project-bg-end:#0a101c;--project-glow:rgba(151,177,219,.2)' },
};

function accentClass(app) {
  const key = `${app.slug || ''} ${app.title || ''} ${app.titleEn || ''}`.toLowerCase();
  if (key.includes('bayn')) return 'accent-bayn';
  if (key.includes('stay')) return 'accent-stay';
  if (key.includes('checkbook') || key.includes('check')) return 'accent-checkbook';
  return 'accent-default';
}

function artStyle(app) {
  const key = `${app.slug || ''} ${app.title || ''} ${app.titleEn || ''}`.toLowerCase();
  const profile = Object.entries(artProfiles).find(([name]) => key.includes(name));
  return profile ? profile[1].style : '--art-width:72%;--art-scale:.88;--art-x:0px;--art-y:0px;--project-bg-start:#15263a;--project-bg-end:#07101d;--project-glow:rgba(104,171,213,.2)';
}

function projectKey(app) {
  const key = `${app.slug || ''} ${app.title || ''} ${app.titleEn || ''}`.toLowerCase();
  const profile = Object.entries(artProfiles).find(([name]) => key.includes(name));
  return profile ? profile[1].project : 'default';
}

function tagsFor(app) {
  const values = Array.isArray(app.tags) ? app.tags : [app.category || app.type];
  return [...new Set(values.filter(Boolean).map(String).filter((tag) => !['app', 'application', 'تطبيق'].includes(tag.toLowerCase())))].slice(0, 3);
}

function shorten(value) {
  const text = String(value || '').trim();
  return text.length > 120 ? `${text.slice(0, 117).trim()}…` : text;
}

function setLanguage(next) {
  lang = next;
  localStorage.setItem('h1apps-language', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = labels[lang].direction;
  document.getElementById('arButton')?.classList.toggle('active', lang === 'ar');
  document.getElementById('enButton')?.classList.toggle('active', lang === 'en');
  document.querySelector('.nav-links a:nth-child(1)')?.replaceChildren(labels[lang].about);
  document.querySelector('.nav-links a:nth-child(2)')?.replaceChildren(labels[lang].products);
  document.querySelector('.nav-links a:nth-child(3)')?.replaceChildren(labels[lang].contact);
  if (window.homeData) renderHeader(window.homeData);
  if (window.apps) render(window.apps);
}

function renderHeader(data) {
  const title = lang === 'en' ? data.featuresTitleEn : data.featuresTitle;
  const description = lang === 'en' ? data.featuresDescriptionEn : data.featuresDescription;
  document.body.classList.remove('data-pending');
  document.querySelector('main')?.classList.remove('site-data-empty');
  document.getElementById('productsKicker').textContent = lang === 'en' ? data.eyebrowEn : data.eyebrow;
  document.getElementById('productsTitle').textContent = title || '';
  document.getElementById('productsDescription').textContent = description || '';
  document.title = title || '';
}

function render(apps) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  if (!apps.length) { grid.replaceChildren(); return; }

  grid.innerHTML = apps.map((app, index) => {
    const title = lang === 'en' ? app.titleEn : app.title;
    const description = lang === 'en' ? app.shortDescriptionEn : app.shortDescription;
    const slug = encodeURIComponent(app.slug || app.id);
    const tags = tagsFor(app);
    const featured = index === 0;
    return `<a class="project-card ${featured ? 'project-card--featured' : 'project-card--standard'} ${accentClass(app)}" data-project="${projectKey(app)}" style="${artStyle(app)}" href="product.html?slug=${slug}" aria-label="${title || ''}">
      <div class="project-card__visual">
        <div class="project-card__visual-bg" aria-hidden="true"></div>
        <div class="project-card__artwork">${app.imageUrl ? `<img src="${app.imageUrl}" alt="${title || ''}" loading="lazy" decoding="async" width="720" height="480">` : ''}</div>
      </div>
      <div class="project-card__content">
        <div class="project-card__meta"><span class="project-card__category">${app.category || app.type || ''}</span></div>
        <h2 class="project-card__title">${title || ''}</h2>
        <p class="project-card__description">${shorten(description)}</p>
        <div class="project-card__tags">${tags.map((tag) => `<span class="project-card__tag">${tag}</span>`).join('')}</div>
        <div class="project-card__footer"><span class="project-card__explore">${featured ? labels[lang].explore : ''}</span><span class="project-card__arrow" aria-hidden="true">↗</span></div>
      </div>
    </a>`;
  }).join('');

  grid.querySelectorAll('.project-card__artwork').forEach((artwork) => {
    const image = artwork.querySelector('img');
    if (!image) return;
    artwork.classList.add('is-loading');
    const done = () => artwork.classList.remove('is-loading');
    image.addEventListener('load', done, { once: true });
    image.addEventListener('error', done, { once: true });
    if (image.complete) done();
  });
  grid.querySelectorAll('.project-card').forEach((card) => {
    card.dataset.baseArtX = card.style.getPropertyValue('--art-x') || '0px';
    card.dataset.baseArtY = card.style.getPropertyValue('--art-y') || '0px';
  });

  if (!grid.dataset.motionBound) {
    grid.dataset.motionBound = 'true';
    let frame = 0;
    let lastEvent;
    grid.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      lastEvent = event;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const card = lastEvent?.target.closest('.project-card');
        if (card) {
          const box = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${lastEvent.clientX - box.left}px`);
          card.style.setProperty('--mouse-y', `${lastEvent.clientY - box.top}px`);
          card.style.setProperty('--art-x', `${(lastEvent.clientX - box.left - box.width / 2) * -.018}px`);
          card.style.setProperty('--art-y', `${(lastEvent.clientY - box.top - box.height / 2) * -.018}px`);
        }
        frame = 0;
      });
    }, { passive: true });
    grid.addEventListener('pointerleave', () => {
      grid.querySelectorAll('.project-card').forEach((card) => {
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
        card.style.setProperty('--art-x', card.dataset.baseArtX || '0px');
        card.style.setProperty('--art-y', card.dataset.baseArtY || '0px');
      });
    }, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('arButton')?.addEventListener('click', () => { localStorage.setItem('h1apps-language', 'ar'); location.reload(); });
  document.getElementById('enButton')?.addEventListener('click', () => { localStorage.setItem('h1apps-language', 'en'); location.reload(); });
  setLanguage(lang);
});

try {
  firebase.initializeApp(firebaseConfig);
  Promise.all([
    firebase.firestore().doc('site_home/home').get(),
    firebase.firestore().collection('site_products').get(),
  ]).then(([home, products]) => {
    window.homeData = home.exists ? home.data() : null;
    window.apps = products.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((app) => app.published === true).sort((a, b) => (a.order || 0) - (b.order || 0));
    if (window.homeData) renderHeader(window.homeData);
    render(window.apps);
  }).catch(() => document.getElementById('productsGrid')?.replaceChildren());
} catch (error) {
  document.getElementById('productsGrid')?.replaceChildren();
}
