// Navigation: sticky bar state, mobile menu open/close, and scrollspy
// highlighting for the active section. No hover-only interactions —
// everything here also works on touch.

export function initNav(){
  const nav = document.querySelector('.lw-nav');
  const toggle = document.querySelector('.lw-nav-toggle');
  const mobileMenu = document.querySelector('.lw-mobile-menu');
  if(!nav) return;

  initScrollState(nav);
  if(toggle && mobileMenu) initMobileMenu(toggle, mobileMenu);
  initScrollspy();
}

function initScrollState(nav){
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMobileMenu(toggle, mobileMenu){
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const firstLink = mobileMenu.querySelector('a');
    if(firstLink) firstLink.focus();
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if(isOpen) closeMenu(); else openMenu();
  });

  mobileMenu.addEventListener('click', (event) => {
    if(event.target.tagName === 'A') closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if(event.key === 'Escape' && isOpen){
      closeMenu();
      toggle.focus();
    }
  });

  // Collapse the mobile menu automatically if the viewport grows past
  // the desktop breakpoint while it's open.
  const desktopQuery = window.matchMedia('(min-width: 860px)');
  desktopQuery.addEventListener('change', (event) => {
    if(event.matches) closeMenu();
  });
}

function initScrollspy(){
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.lw-nav-links a, .lw-mobile-menu a');
  if(!('IntersectionObserver' in window) || !sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}
