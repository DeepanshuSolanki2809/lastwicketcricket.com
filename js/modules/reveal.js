// Subtle scroll-reveal for section entrances. Any element with the
// `.lw-reveal` class (see css/base.css) is faded/raised into view once.
// Fully skipped for people who prefer reduced motion — content simply
// appears in place.

export function initReveal(){
  const targets = document.querySelectorAll('.lw-reveal');
  if(!targets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReducedMotion || !('IntersectionObserver' in window)){
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => observer.observe(el));
}
