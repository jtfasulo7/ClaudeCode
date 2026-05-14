// J.B. Landscape — services carousel, lead/chat forms, areas map, chat toggle
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

  /* ─── Lead-form helper (used by both #leadForm and #chatForm) ─── */
  function bindForm({ formId, statusId, btnId, source, requireConsent }) {
    const form = document.getElementById(formId);
    if (!form) return;
    const status = document.getElementById(statusId);
    const submit = document.getElementById(btnId);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (status) { status.className = 'form-status'; status.textContent = 'Sending…'; }
      if (submit) submit.disabled = true;

      const data = Object.fromEntries(new FormData(form));
      // The /api/lead endpoint requires full_name. Synthesize it from
      // first_name + last_name when the form uses split name fields.
      if (!data.full_name && (data.first_name || data.last_name)) {
        data.full_name = [data.first_name, data.last_name].filter(Boolean).join(' ').trim();
      }
      data.sms_consent = data.sms_consent === 'true' || data.sms_consent === 'on' || data.sms_consent === true;
      if (requireConsent && !data.sms_consent) {
        if (status) { status.className = 'form-status err'; status.textContent = 'Please agree to receive a reply by text.'; }
        if (submit) submit.disabled = false;
        return;
      }
      data.source = source;
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
        if (status) { status.className = 'form-status ok'; status.textContent = "Thanks — we'll text you back within one business day."; }
        form.reset();
      } catch (err) {
        if (status) { status.className = 'form-status err'; status.textContent = `Couldn't send — call us at (401) 230-4820.`; }
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }

  bindForm({ formId: 'leadForm', statusId: 'lfStatus',   btnId: 'lfSubmit',   source: 'website',     requireConsent: false });
  bindForm({ formId: 'chatForm', statusId: 'chatStatus', btnId: 'chatSubmit', source: 'chat-widget', requireConsent: true  });

  /* ─── Chat widget toggle ─── */
  const toggle = document.getElementById('chatToggle');
  const panel  = document.getElementById('chatPanel');
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
    toggle.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) setOpen(false);
    });
  }

  /* ─── Areas map (Leaflet) ─── */
  (function initAreasMap() {
    const el = document.getElementById('areasMap');
    if (!el || typeof L === 'undefined') return;

    // 9 cities spread across the whole state of Rhode Island
    const cities = [
      { n: 1, name: 'Providence',       sub: 'HQ',                 lat: 41.8240, lon: -71.4128, hub: true },
      { n: 2, name: 'Woonsocket',       sub: '~15 mi N',           lat: 42.0029, lon: -71.5145 },
      { n: 3, name: 'Pawtucket',        sub: '~5 mi NE',           lat: 41.8787, lon: -71.3826 },
      { n: 4, name: 'Warwick',          sub: '~10 mi S',           lat: 41.7001, lon: -71.4162 },
      { n: 5, name: 'Coventry',         sub: '~15 mi SW',          lat: 41.6900, lon: -71.6645 },
      { n: 6, name: 'Tiverton',         sub: '~25 mi SE',          lat: 41.6262, lon: -71.2104 },
      { n: 7, name: 'South Kingstown',  sub: '~30 mi S',           lat: 41.4762, lon: -71.5103 },
      { n: 8, name: 'Newport',          sub: '~30 mi SE',          lat: 41.4901, lon: -71.3128 },
      { n: 9, name: 'Westerly',         sub: '~40 mi SW',          lat: 41.3776, lon: -71.8273 },
    ];

    // Polygon approximating the outline of Rhode Island (clockwise from NW)
    const serviceArea = [
      [42.018, -71.799], // NW corner — Burrillville
      [42.018, -71.330], // NE corner along MA border
      [41.880, -71.330], // Cumberland / Pawtucket east edge
      [41.430, -71.220], // Sakonnet Point — East Bay SE
      [41.360, -71.580], // South coast — Point Judith
      [41.320, -71.860], // SW corner — Watch Hill
      [41.620, -71.800], // Hopkinton west edge
    ];

    const map = L.map(el, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    }).setView([41.68, -71.55], 9);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18,
      }
    ).addTo(map);

    L.polygon(serviceArea, {
      color: '#2d6a3a',
      weight: 2,
      opacity: 0.85,
      fillColor: '#2d6a3a',
      fillOpacity: 0.10,
      dashArray: '6, 5',
      interactive: false,
    }).addTo(map);

    cities.forEach((c) => {
      const icon = L.divIcon({
        className: 'jb-marker-wrap',
        html: `<div class="jb-marker${c.hub ? ' jb-marker-hub' : ''}">${c.n}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      const tip = c.sub
        ? `<strong>${c.name}</strong><span class="jb-tip-sub">${c.sub}</span>`
        : `<strong>${c.name}</strong>`;
      L.marker([c.lat, c.lon], { icon, title: c.name })
        .addTo(map)
        .bindTooltip(tip, {
          permanent: true,
          direction: 'right',
          offset: [12, 0],
          className: 'jb-tooltip',
        });
    });

    const bounds = L.latLngBounds(cities.map((c) => [c.lat, c.lon]));
    map.fitBounds(bounds, { padding: [60, 60] });

    function applyMobileLock() {
      const mobile = window.innerWidth <= 768;
      const handlers = ['dragging', 'touchZoom', 'doubleClickZoom',
                        'scrollWheelZoom', 'boxZoom', 'keyboard'];
      handlers.forEach((h) => {
        if (map[h]) mobile ? map[h].disable() : map[h].enable();
      });
      if (map.tap) mobile ? map.tap.disable() : map.tap.enable();
      const zc = map.zoomControl;
      if (zc) mobile ? zc.remove() : zc.addTo(map);
    }
    applyMobileLock();
    let lockRaf = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(lockRaf);
      lockRaf = requestAnimationFrame(applyMobileLock);
    });

    map.on('click', () => {
      if (window.innerWidth > 768 && !map.scrollWheelZoom.enabled()) {
        map.scrollWheelZoom.enable();
      }
    });
  })();
})();
