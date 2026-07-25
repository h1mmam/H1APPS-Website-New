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
    }
    if (link.matches('.store-link, .context-store')) {
      event('select_content', { content_type: 'download_link', item_id: href, link_url: href });
    }
    if (link.matches('[href*="project-request"], [href*="contact"]')) {
      event('generate_lead', { method: link.textContent.trim() || 'website_cta' });
    }
  }, { passive: true });

  document.addEventListener('submit', (submit) => {
    const form = submit.target;
    event('form_submit', { form_id: form.id || form.className || 'website_form' });
  }, { passive: true });
}());
