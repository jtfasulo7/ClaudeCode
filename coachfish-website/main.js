/* Coach Fish Services — minimal client JS */

(() => {
  const doc = document;

  // ---- year in footer ----
  const year = doc.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---- sticky nav scroll state ----
  const nav = doc.querySelector('[data-nav]');
  if (nav) {
    const onScroll = () => {
      nav.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- mobile menu ----
  const toggle = doc.querySelector('.nav__toggle');
  const mobile = doc.getElementById('mobile-menu');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      if (open) {
        mobile.hidden = true;
      } else {
        mobile.hidden = false;
      }
    });
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        mobile.hidden = true;
      });
    });
  }

  // ---- reveal on scroll ----
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = doc.querySelectorAll('[data-reveal]');

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => io.observe(el));

    // reveal hero immediately on load (first paint)
    requestAnimationFrame(() => {
      doc.querySelectorAll('.hero [data-reveal]').forEach(el => {
        el.classList.add('is-in');
        io.unobserve(el);
      });
    });
  }
})();
