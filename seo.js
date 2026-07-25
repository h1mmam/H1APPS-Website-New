(function () {
  const origin = 'https://h1apps.dev';
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const pageMap = {
    'index.html': { title: 'H1APPS | Digital Products & Custom Software', description: 'H1APPS builds thoughtful digital products, mobile apps and web platforms with a clear, human-first experience.' },
    'about.html': { title: 'About H1APPS | Digital Product Studio', description: 'Learn about H1APPS, a digital product studio creating useful applications and modern software experiences.' },
    'products.html': { title: 'Our Products | H1APPS', description: 'Explore H1APPS digital products, applications and platforms built to solve real problems.' },
    'contact.html': { title: 'Contact H1APPS | Start a Conversation', description: 'Contact H1APPS about digital products, mobile applications, websites and software projects.' },
    'project-request.html': { title: 'Start Your Project | H1APPS', description: 'Tell H1APPS about your idea and start building a clear, useful digital product.' },
    'account-deletion.html': { title: 'Account Deletion Request | H1APPS', description: 'Submit an account deletion request for an H1APPS application.' },
    'product.html': { title: 'Product Details | H1APPS', description: 'Explore product details, features and official links from H1APPS.' },
    'product-page.html': { title: 'Product Page | H1APPS', description: 'Official product information page from H1APPS.' },
  };
  const fallback = pageMap[path] || pageMap['index.html'];
  const setMeta = (selector, attribute, value) => { const element = document.querySelector(selector); if (element && value) element.setAttribute(attribute, value); };
  const canonical = `${origin}/${path === 'index.html' ? '' : path}${slug ? `?slug=${encodeURIComponent(slug)}` : ''}`;
  if (!document.title || document.title.includes('H1APPS') === false) document.title = fallback.title;
  setMeta('meta[name="description"]', 'content', fallback.description);
  setMeta('meta[name="robots"]', 'content', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
  setMeta('meta[property="og:title"]', 'content', document.title || fallback.title);
  setMeta('meta[property="og:description"]', 'content', fallback.description);
  setMeta('meta[property="og:url"]', 'content', canonical);
  setMeta('meta[property="og:image"]', 'content', `${origin}/brand/h1apps.png`);
  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
  link.href = canonical;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'H1APPS', url: `${origin}/`, logo: `${origin}/brand/h1apps.png` },
      { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'H1APPS', url: `${origin}/`, publisher: { '@id': `${origin}/#organization` } },
      { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: document.title || fallback.title, isPartOf: { '@id': `${origin}/#website` } },
    ],
  };
  const schemaScript = document.createElement('script'); schemaScript.type = 'application/ld+json'; schemaScript.textContent = JSON.stringify(schema); document.head.appendChild(schemaScript);
}());
