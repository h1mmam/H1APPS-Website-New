(function () {
  const measurementId = 'G-M6YHB889YC';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
    page_location: window.location.href,
    page_title: document.title,
  });

  const firebaseConfig = { apiKey: 'AIzaSyDOlDg14fbH8kXfSbr6YCj6NECtEPJIdiU', authDomain: 'h1words.firebaseapp.com', projectId: 'h1words', storageBucket: 'h1words.firebasestorage.app', messagingSenderId: '594662600507', appId: '1:594662600507:web:2fcbf66623066c7bc8d11e' };
  const sessionKey = 'h1apps-analytics-session';
  const sessionId = window.localStorage.getItem(sessionKey) || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  window.localStorage.setItem(sessionKey, sessionId);
  const day = new Date().toISOString().slice(0, 10);
  const seenKey = `h1apps-page-seen:${day}:${window.location.pathname}${window.location.search}`;
  let firestoreReady = false;
  try {
    if (window.firebase && !firebase.apps.length) firebase.initializeApp(firebaseConfig);
    firestoreReady = Boolean(window.firebase?.firestore);
  } catch (_) { firestoreReady = false; }
  function count(metric, extra) {
    if (!firestoreReady) return;
    const db = firebase.firestore();
    const dayRef = db.collection('site_analytics_daily').doc(day);
    dayRef.set({ date: day, updatedAt: firebase.firestore.FieldValue.serverTimestamp(), [metric]: firebase.firestore.FieldValue.increment(1) }, { merge: true }).catch(() => {});
    if (metric === 'pageViews') db.collection('site_analytics_sessions').doc(`${day}_${sessionId}`).set({ date: day, sessionId, lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(), ...extra }, { merge: true }).catch(() => {});
  }
  function countProduct(slug, title, metric) {
    if (!firestoreReady || !slug) return;
    firebase.firestore().collection('site_analytics_products').doc(slug).set({
      slug,
      title: title || slug,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      [metric]: firebase.firestore.FieldValue.increment(1),
    }, { merge: true }).catch(() => {});
  }
  if (!window.localStorage.getItem(seenKey)) {
    window.localStorage.setItem(seenKey, '1');
    count('pageViews', { page: window.location.pathname });
  }

  function event(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }

  document.addEventListener('click', (click) => {
    const link = click.target.closest?.('a');
    if (!link) return;
    const href = link.href || '';
    const productCard = link.closest('.project-card');
    if (productCard) {
      event('select_item', { item_list_name: 'H1APPS products', item_name: productCard.querySelector('.project-card__title')?.textContent?.trim() || '' });
      const productUrl = new URL(href, window.location.href);
      countProduct(productUrl.searchParams.get('slug'), productCard.querySelector('.project-card__title')?.textContent?.trim(), 'clicks');
    }
    if (link.matches('.store-link, .context-store')) {
      event('select_content', { content_type: 'download_link', item_id: href, link_url: href });
      count('downloadClicks', { link: href });
    }
    if (link.matches('[href*="project-request"], [href*="contact"]')) {
      event('generate_lead', { method: link.textContent.trim() || 'website_cta' });
      count('leadClicks', { link: href });
    }
    if (productCard) count('productClicks', { product: productCard.querySelector('.project-card__title')?.textContent?.trim() || '' });
  }, { passive: true });

  const productSlug = new URLSearchParams(window.location.search).get('slug');
  if (productSlug && window.location.pathname.endsWith('/product.html')) {
    countProduct(productSlug, document.title, 'views');
  }

  document.addEventListener('submit', (submit) => {
    const form = submit.target;
    event('form_submit', { form_id: form.id || form.className || 'website_form' });
    count('formSubmits', { form: form.id || form.className || 'website_form' });
  }, { passive: true });
}());
