(() => {
  const root = document.documentElement;
  const nav = document.querySelector('.site-nav');
  document.querySelectorAll('#year').forEach(el => { el.textContent = String(new Date().getFullYear()); });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.querySelector('.premium-progress')) { const bar = document.createElement('div'); bar.className = 'premium-progress'; document.body.prepend(bar); }
  if (nav && !nav.querySelector('.nav-action')) { const link = document.createElement('a'); link.className = 'nav-action'; link.href = 'project-request.html'; link.innerHTML = `${root.dir === 'rtl' ? 'ابدأ مشروعك' : 'Start your project'} <span>↗</span>`; nav.append(link); }
  if (nav && nav.querySelector('.nav-links') && !nav.querySelector('.nav-menu-toggle')) {
    const toggle = document.createElement('button');
    toggle.className = 'nav-menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', root.dir === 'rtl' ? 'فتح القائمة' : 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.append(toggle);
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }
  const update = () => { const y = window.scrollY || 0; nav?.classList.toggle('is-scrolled', y > 28); const height = document.documentElement.scrollHeight - window.innerHeight; document.querySelector('.premium-progress').style.transform = `scaleX(${height > 0 ? y / height : 0})`; };
  update(); window.addEventListener('scroll', update, { passive: true });
  if (!reduced) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); } }), { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    let motionIndex = 0;
    const decorate = (scope = document) => {
      scope.querySelectorAll('main section, .feature-card, .product-card, .about-duo article, .values-grid article, .request-card, .deletion-form').forEach(el => {
        if (el.classList.contains('motion-reveal')) return;
        el.classList.add('motion-reveal'); el.dataset.motion = motionIndex++ % 3 === 1 ? 'scale' : motionIndex % 3 === 2 ? 'right' : 'left'; el.style.setProperty('--stagger-delay', `${Math.min(motionIndex * 55, 300)}ms`); reveal.observe(el);
      });
      scope.querySelectorAll('.feature-card,.product-card,.about-duo article,.values-grid article').forEach(card => { if (card.dataset.motionPointer) return; card.dataset.motionPointer = 'true'; card.addEventListener('pointermove', event => { const box = card.getBoundingClientRect(); card.style.setProperty('--card-x', `${event.clientX - box.left}px`); card.style.setProperty('--card-y', `${event.clientY - box.top}px`); }); });
    };
    decorate();
    new MutationObserver(() => decorate()).observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
  }
})();
