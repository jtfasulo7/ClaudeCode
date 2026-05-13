// J.B. Landscape — services carousel + lead form
(function () {
  /* ─── Year in footer ─── */
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ─── Services carousel ─── */
  const track = document.getElementById('svcTrack');
  const prev  = document.getElementById('svcPrev');
  const next  = document.getElementById('svcNext');
  if (track && prev && next) {
    const tileWidth = () => {
      const first = track.querySelector('.svc-tile');
      if (!first) return 320;
      const gap = parseFloat(getComputedStyle(track).columnGap || '20');
      return first.getBoundingClientRect().width + gap;
    };
    const updateArrows = () => {
      const max = track.scrollWidth - track.clientWidth - 4;
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= max;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -tileWidth(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left:  tileWidth(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows, { passive: true });
    updateArrows();
  }

  /* ─── Lead form ─── */
  const form = document.getElementById('leadForm');
  if (!form) return;
  const status = document.getElementById('lfStatus');
  const submit = document.getElementById('lfSubmit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    status.className = 'form-status';
    status.textContent = 'Sending…';
    submit.disabled = true;

    const data = Object.fromEntries(new FormData(form));
    data.sms_consent = data.sms_consent === 'true';
    data.source = 'website';
    data.page_url = window.location.href;
    data.submitted_at = new Date().toISOString();

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server returned ${res.status}`);
      }
      status.className = 'form-status ok';
      status.textContent = "Thanks — we'll be in touch within one business day.";
      form.reset();
    } catch (err) {
      status.className = 'form-status err';
      status.textContent = `Couldn't send — call us at (401) 230-4820.`;
    } finally {
      submit.disabled = false;
    }
  });
})();
