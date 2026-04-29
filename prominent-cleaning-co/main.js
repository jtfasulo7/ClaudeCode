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

  // ── chat widget ───────────────────────────────────────────
  const root = doc.getElementById('cwRoot');
  if (!root) return;

  const bubble = doc.getElementById('cwBubble');
  const panel = doc.getElementById('cwPanel');
  const closeBtn = doc.getElementById('cwClose');
  const body = doc.getElementById('cwBody');
  const greeting = doc.getElementById('cwGreeting');
  const form = doc.getElementById('cwForm');
  const input = doc.getElementById('cwInput');
  const sendBtn = doc.getElementById('cwSend');
  const history = [];

  function openPanel() {
    root.classList.add('open');
    setTimeout(() => input.focus(), 220);
  }
  function closePanel() {
    root.classList.remove('open');
  }

  bubble?.addEventListener('click', (e) => {
    e.stopPropagation();
    root.classList.contains('open') ? closePanel() : openPanel();
  });
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closePanel();
  });

  doc.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('open')) closePanel();
  });

  function clearGreeting() {
    if (greeting && greeting.parentNode) greeting.remove();
  }

  function addMsg(role, text) {
    clearGreeting();
    const div = doc.createElement('div');
    div.className = 'cw-msg ' + (role === 'user' ? 'user' : 'bot');
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function addTyping() {
    const t = doc.createElement('div');
    t.className = 'cw-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
    return t;
  }

  async function send(text) {
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    sendBtn.disabled = true;
    const typing = addTyping();
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      typing.remove();
      if (!r.ok) throw new Error('bad response');
      const data = await r.json();
      const reply = data.reply || "Sorry, something went wrong. Please try again.";
      addMsg('bot', reply);
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      typing.remove();
      addMsg(
        'bot',
        "I'm having trouble connecting right now. Please try again in a moment — or call (800) 710-8420."
      );
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    send(text);
  });

  // Suggested-question chips inside the greeting
  doc.querySelectorAll('.cw-chip[data-cw-q]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-cw-q');
      if (!q) return;
      send(q);
    });
  });
})();
