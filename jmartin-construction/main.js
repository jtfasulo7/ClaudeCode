(function () {
  'use strict';

  // ── Footer year ──
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ── Validation helpers ──
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[\d().+\-\s]{10,20}$/;

  function validateField(input) {
    const v = (input.value || '').trim();
    let ok = true;
    if (input.required && !v) ok = false;
    if (ok && input.type === 'email' && v && !EMAIL_RE.test(v)) ok = false;
    if (ok && input.type === 'tel' && v && !PHONE_RE.test(v)) ok = false;
    input.classList.toggle('invalid', !ok);
    return ok;
  }

  function readPayload(form) {
    const data = new FormData(form);
    const payload = {
      full_name: (data.get('full_name') || '').toString().trim(),
      phone: (data.get('phone') || '').toString().trim(),
      email: (data.get('email') || '').toString().trim(),
      message: (data.get('message') || '').toString().trim(),
      sms_consent: data.get('sms_consent') === 'on' || data.get('sms_consent') === 'true',
    };
    const parts = payload.full_name.split(/\s+/);
    payload.first_name = parts[0] || '';
    payload.last_name = parts.slice(1).join(' ') || '';
    return payload;
  }

  function setStatus(el, text, kind) {
    if (!el) return;
    el.textContent = text;
    el.classList.remove('ok', 'err');
    if (kind) el.classList.add(kind);
  }

  async function postLead(payload) {
    const r = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      let detail = '';
      try {
        const j = await r.json();
        detail = j.error || '';
      } catch {}
      throw new Error(detail || 'Submission failed');
    }
    return r.json().catch(() => ({}));
  }

  function bindForm(opts) {
    const { formId, statusId, btnId, source, requireConsent } = opts;
    const form = document.getElementById(formId);
    if (!form) return;
    const status = document.getElementById(statusId);
    const btn = document.getElementById(btnId);
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach((el) => {
      el.addEventListener('blur', () => validateField(el));
      el.addEventListener('input', () => {
        if (el.classList.contains('invalid')) validateField(el);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus(status, '', null);

      // Validate all fields
      let allOk = true;
      inputs.forEach((el) => {
        if (el.type === 'checkbox') return;
        if (!validateField(el)) allOk = false;
      });

      // Consent (chat widget only)
      if (requireConsent) {
        const consentEl = form.querySelector('input[name="sms_consent"]');
        const consentWrap = consentEl && consentEl.closest('.consent');
        const consentOk = consentEl && consentEl.checked;
        if (consentWrap) consentWrap.classList.toggle('invalid', !consentOk);
        if (!consentOk) allOk = false;
      }

      if (!allOk) {
        setStatus(status, 'Please fill in all required fields.', 'err');
        return;
      }

      const payload = readPayload(form);
      payload.source = source;
      payload.submitted_at = new Date().toISOString();
      payload.page_url = window.location.href;

      btn.disabled = true;
      const lbl = btn.querySelector('.btn-label');
      const original = lbl ? lbl.textContent : '';
      if (lbl) lbl.textContent = 'Sending...';

      try {
        await postLead(payload);
        setStatus(
          status,
          "Thanks — we'll text you back within one business day.",
          'ok'
        );
        form.reset();
        inputs.forEach((el) => el.classList.remove('invalid'));
        const consentWrap = form.querySelector('.consent');
        if (consentWrap) consentWrap.classList.remove('invalid');
      } catch (err) {
        setStatus(
          status,
          err && err.message
            ? err.message
            : "Something went wrong. Please call (406) 544-4492.",
          'err'
        );
      } finally {
        btn.disabled = false;
        if (lbl) lbl.textContent = original;
      }
    });
  }

  bindForm({
    formId: 'leadForm',
    statusId: 'leadStatus',
    btnId: 'leadSubmit',
    source: 'website-contact',
    requireConsent: false,
  });

  bindForm({
    formId: 'chatForm',
    statusId: 'chatStatus',
    btnId: 'chatSubmit',
    source: 'chat-widget',
    requireConsent: true,
  });

  // ── Services carousel ──
  (function initServicesCarousel() {
    const track = document.getElementById('svcTrack');
    const prev = document.getElementById('svcPrev');
    const next = document.getElementById('svcNext');
    const dotsWrap = document.getElementById('svcDots');
    if (!track || !dotsWrap) return;

    const tiles = Array.from(track.querySelectorAll('.svc-tile'));
    if (tiles.length === 0) return;

    tiles.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'svc-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to service ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => scrollToTile(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.querySelectorAll('.svc-dot'));

    function getStep() {
      if (tiles.length < 2) return tiles[0].offsetWidth;
      return tiles[1].offsetLeft - tiles[0].offsetLeft;
    }

    function scrollToTile(i) {
      const step = getStep();
      const target = tiles[0].offsetLeft + i * step - track.offsetLeft;
      track.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }

    function update() {
      const step = getStep();
      if (!step) return;
      const rel = track.scrollLeft - (tiles[0].offsetLeft - track.offsetLeft);
      const i = Math.max(0, Math.min(tiles.length - 1, Math.round(rel / step)));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
      if (prev) prev.disabled = track.scrollLeft <= 8;
      if (next) next.disabled =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    }

    if (prev) prev.addEventListener('click', () => {
      track.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });
    if (next) next.addEventListener('click', () => {
      track.scrollBy({ left: getStep(), behavior: 'smooth' });
    });

    let raf = 0;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    });
    update();
  })();

  // ── Chat widget toggle ──
  const toggle = document.getElementById('chatToggle');
  const panel = document.getElementById('chatPanel');
  if (toggle && panel) {
    function setOpen(open) {
      panel.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.setAttribute('aria-label', open ? 'Close chat' : 'Open chat');
      if (open) {
        const first = panel.querySelector('input, textarea');
        if (first) setTimeout(() => first.focus(), 220);
      }
    }
    toggle.addEventListener('click', () => {
      setOpen(!panel.classList.contains('open'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) setOpen(false);
    });
  }
})();
