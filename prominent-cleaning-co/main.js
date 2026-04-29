/* Prominent Cleaning Co — minimal client JS */
(() => {
  const doc = document;

  // year in footer
  const year = doc.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // sticky-nav scroll state
  const nav = doc.querySelector('[data-nav]');
  if (nav) {
    const onScroll = () => {
      nav.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // mobile menu
  const toggle = doc.querySelector('.nav__toggle');
  const mobile = doc.getElementById('mobile-menu');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobile.hidden = open;
    });
    mobile.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        mobile.hidden = true;
      });
    });
  }

  // option-card visual selection (book page)
  doc.querySelectorAll('.option input[type="radio"]').forEach((input) => {
    input.addEventListener('change', () => {
      const name = input.name;
      doc.querySelectorAll(`.option input[name="${name}"]`).forEach((sib) => {
        sib.closest('.option')?.classList.toggle('option--selected', sib.checked);
      });
    });
  });
})();
