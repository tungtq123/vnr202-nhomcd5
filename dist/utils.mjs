export const $ = (selector, scope = document) => scope.querySelector(selector);

export const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);

export function sourceLink(sources, key, text = 'Đọc nguồn') {
  const source = sources[key];
  if (!source) return '';
  return `<a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)} <span aria-hidden="true">↗</span></a>`;
}

export function initMobileNav() {
  const toggle = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  if (!toggle || !mobileNav) return;

  const closeMenu = (restoreFocus = false) => {
    mobileNav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Mở điều hướng');
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute('aria-label', expanded ? 'Mở điều hướng' : 'Đóng điều hướng');
    mobileNav.hidden = expanded;
  });

  mobileNav.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) closeMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
  });
}
