/* ===== KESHAV MITTAL · PORTFOLIO · HUD SYSTEM ===== */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let CYAN = (getComputedStyle(document.documentElement).getPropertyValue('--cyan-rgb') || '56,225,255').trim();

  document.getElementById('yr').textContent = new Date().getFullYear();

  /* ---------- BOOT SEQUENCE ---------- */
  const bootLines = [
    '> INIT bio-interface core ......... [ok]',
    '> CALIBRATE emg / pressure array .. [ok]',
    '> LOAD comsol field models ........ [ok]',
    '> MOUNT opensim biomech engine .... [ok]',
    '> SYNC project archive [10] ....... [ok]',
    '> OPERATOR: KESHAV MITTAL',
    '> STATUS: ONLINE'
  ];
  const bootLog = $('#bootLog');
  const boot = $('#boot');
  if (boot && bootLog) {
    if (reduce) {
      boot.classList.add('done');
    } else {
      let i = 0;
      (function step() {
        if (i < bootLines.length) {
          const d = document.createElement('div');
          const line = bootLines[i];
          d.innerHTML = line.replace('[ok]', '<span class="ok">[ok]</span>');
          bootLog.appendChild(d);
          i++;
          setTimeout(step, 210);
        } else {
          setTimeout(() => boot.classList.add('done'), 500);
        }
      })();
    }
    setTimeout(() => boot.classList.add('done'), 3200);
  }

  /* ---------- CLICKABLE PROJECT CARDS ---------- */
  const projMap = {
    'P-01': 'unisense', 'P-02': 'optical-myography', 'P-03': 'unmute',
    'P-04': 'tremoflex', 'P-05': 'clutch', 'P-06': 'retina',
    'P-07': 'biocompatibility', 'P-08': 'ventilation', 'P-09': 'spatial',
    'P-10': 'gait-biomechanics'
  };
  $$('.proj').forEach(card => {
    const idEl = $('.proj-id', card);
    if (!idEl) return;
    const slug = projMap[idEl.textContent.trim()];
    if (!slug) return;
    const href = 'projects/' + slug + '.html';
    card.classList.add('clickable');
    const body = $('.proj-body', card);
    if (body && !$('.proj-open', body)) {
      const a = document.createElement('a');
      a.className = 'proj-open';
      a.href = href;
      a.innerHTML = 'OPEN PROJECT <span>&rarr;</span>';
      body.appendChild(a);
    }
    card.addEventListener('click', e => {
      if (e.target.closest('a, video, button')) return;
      window.location.href = href;
    });
  });

  /* ---------- NAV: hide on scroll down, mobile menu ---------- */
  const nav = $('#nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 400) nav.classList.add('hide');
    else nav.classList.remove('hide');
    lastY = y;
  }, { passive: true });

  const burger = $('#burger');
  const links = $('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => links.classList.toggle('open'));
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  /* ---------- ROBUST SMOOTH ANCHOR SCROLL (nav) ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if (links) links.classList.remove('open');
      try { history.replaceState(null, '', id); } catch (_) {}
    });
  });

  /* ---------- CONTACT MODAL ---------- */
  const cModal = $('#contactModal');
  const cBtn = $('#contactBtn');
  const cClose = $('#contactClose');
  if (cModal && cBtn) {
    const openM = () => { cModal.classList.add('open'); cModal.setAttribute('aria-hidden', 'false'); };
    const closeM = () => { cModal.classList.remove('open'); cModal.setAttribute('aria-hidden', 'true'); };
    cBtn.addEventListener('click', openM);
    if (cClose) cClose.addEventListener('click', closeM);
    cModal.addEventListener('click', e => { if (e.target === cModal) closeM(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeM(); });
    $$('.cmodal-opt', cModal).forEach(a => a.addEventListener('click', () => setTimeout(closeM, 120)));
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        $$('.bar', e.target).forEach(b => {
          b.style.setProperty('--w', (b.dataset.lv || 80) + '%');
          b.classList.add('on');
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(el => io.observe(el));
  $$('.skill-cat').forEach(el => io.observe(el));

  /* ---------- COUNTER STATS ---------- */
  const counters = $$('[data-count]');
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1100, t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(target * (0.5 - Math.cos(Math.PI * p) / 2));
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      })(t0);
      cObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => cObs.observe(c));

  /* ---------- OPTICAL MYOGRAPHY MESH ---------- */
  const mesh = $('.omg-mesh');
  if (mesh) {
    let m = '';
    for (let x = 20; x <= 380; x += 30) {
      for (let y = 30; y <= 190; y += 30) {
        m += `<circle cx="${x}" cy="${y}" r="1.4" fill="rgba(56,225,255,.35)"/>`;
      }
    }
    mesh.innerHTML = m;
  }
  const fl = $('.viz-retina .field-lines');
  if (fl) {
    let s = '';
    for (let r = 55; r <= 78; r += 8) {
      s += `<circle cx="200" cy="110" r="${r}" fill="none" stroke="rgba(255,209,102,.25)" stroke-dasharray="2 6"/>`;
    }
    fl.innerHTML = s;
  }

  /* ---------- PROJECT EXPLORER (filter + search) ---------- */
  (function () {
    const grid = $('.projects');
    if (!grid) return;
    const cards = $$('.proj', grid);
    const chips = $$('.chip-btn');
    const search = $('#projSearch');
    const countEl = $('#projCount');
    const empty = $('#projEmpty');
    let activeFilter = 'all';
    function apply(force) {
      const q = search ? search.value.trim().toLowerCase() : '';
      let shown = 0;
      cards.forEach(c => {
        const tags = (c.dataset.tags || '').split(' ');
        const okTag = activeFilter === 'all' || tags.includes(activeFilter);
        const okText = !q || c.textContent.toLowerCase().includes(q);
        const vis = okTag && okText;
        c.classList.toggle('hide', !vis);
        if (vis) { shown++; if (force) c.classList.add('in'); }
      });
      if (countEl) countEl.textContent = shown + ' / ' + cards.length + ' projects shown';
      if (empty) empty.classList.toggle('show', shown === 0);
    }
    chips.forEach(ch => ch.addEventListener('click', () => {
      chips.forEach(x => x.classList.remove('active'));
      ch.classList.add('active');
      activeFilter = ch.dataset.filter;
      apply(true);
    }));
    if (search) search.addEventListener('input', () => apply(true));
    apply(false);
  })();

  /* ---------- ACCENT THEME SWITCHER ---------- */
  (function () {
    const root = document.documentElement;
    const dots = $$('.theme-dot');
    const refresh = () => { CYAN = (getComputedStyle(root).getPropertyValue('--cyan-rgb') || CYAN).trim(); };
    function setTheme(t) {
      if (t === 'cyan') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t);
      dots.forEach(d => d.classList.toggle('active', d.dataset.theme === t));
      try { localStorage.setItem('km-theme', t); } catch (_) {}
      refresh();
    }
    let saved = 'cyan';
    try { saved = localStorage.getItem('km-theme') || 'cyan'; } catch (_) {}
    setTheme(saved);
    dots.forEach(d => d.addEventListener('click', () => setTheme(d.dataset.theme)));
  })();

  /* ---------- CUSTOM VOICE BRIEFING ---------- */
  (function () {
    const btn = $('#voiceBtn');
    if (!btn) return;
    const label = $('.v-label', btn);
    const audio = document.getElementById('briefingAudio');
    const hasTTS = 'speechSynthesis' in window;
    if (!hasTTS && !(audio && audio.getAttribute('src'))) { btn.style.display = 'none'; return; }

    const script =
      "System online. I am the interface for Keshav Mittal, a biomedical engineer working in " +
      "prosthetic control, wearable sensing, and rehabilitation technology. This archive holds ten " +
      "projects, from UniSense, a dual-mode prosthetic socket, to markerless optical myography and a " +
      "motion-capture gait study. Scroll to explore each build, or use the accent control at the " +
      "bottom right to reconfigure the interface. Welcome.";

    let speaking = false, actx = null, drone = null, dGain = null;
    function ui(on) { speaking = on; btn.classList.toggle('speaking', on); if (label) label.textContent = on ? '◼ STOP' : 'VOICE BRIEFING'; }
    function ambientStart() {
      try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === 'suspended') actx.resume();
        drone = actx.createOscillator(); dGain = actx.createGain();
        drone.type = 'sine'; drone.frequency.value = 66;
        dGain.gain.value = 0; drone.connect(dGain).connect(actx.destination); drone.start();
        dGain.gain.linearRampToValueAtTime(0.035, actx.currentTime + 0.5);
      } catch (_) {}
    }
    function blip() {
      if (!actx) return;
      try {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = 'square'; o.frequency.value = 760 + Math.random() * 520;
        g.gain.value = 0; o.connect(g).connect(actx.destination); o.start();
        g.gain.linearRampToValueAtTime(0.02, actx.currentTime + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.08);
        o.stop(actx.currentTime + 0.09);
      } catch (_) {}
    }
    function ambientStop() {
      try { if (dGain && actx) dGain.gain.linearRampToValueAtTime(0, actx.currentTime + 0.3); if (drone && actx) drone.stop(actx.currentTime + 0.35); } catch (_) {}
      drone = null;
    }
    function stop() {
      if (hasTTS) window.speechSynthesis.cancel();
      if (audio) { audio.pause(); try { audio.currentTime = 0; } catch (_) {} }
      ambientStop(); ui(false);
    }
    function synth() {
      if (!hasTTS) { stop(); return; }
      const s = window.speechSynthesis; s.cancel();
      const u = new SpeechSynthesisUtterance(script);
      const vs = s.getVoices();
      const v = vs.find(x => /Daniel|Google UK English|Arthur|Oliver|en-GB/i.test(x.name + x.lang)) || vs.find(x => /en[-_]/i.test(x.lang)) || vs[0];
      if (v) u.voice = v;
      u.pitch = 0.7; u.rate = 0.96; u.volume = 1;
      u.onstart = ambientStart;
      u.onboundary = blip;
      u.onend = stop; u.onerror = stop;
      s.speak(u);
    }
    btn.addEventListener('click', () => {
      if (speaking) { stop(); return; }
      ui(true);
      if (audio && audio.getAttribute('src')) {
        audio.onended = stop;
        const p = audio.play();
        if (p && p.then) p.then(() => ambientStart()).catch(() => synth());
        else synth();
      } else {
        synth();
      }
    });
    if (hasTTS && window.speechSynthesis.getVoices().length === 0 && 'onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }
    window.addEventListener('beforeunload', stop);
  })();

  /* ---------- TILT PROJECT CARDS ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    $$('.proj').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add('tilting');
        card.style.transform = `perspective(950px) rotateX(${(-py * 4.5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('tilting');
        card.style.transform = '';
      });
    });
  }

  /* ---------- HERO CLICK RIPPLE ---------- */
  const heroEl = $('#hero');
  if (heroEl && !reduce) {
    heroEl.addEventListener('click', e => {
      if (e.target.closest('a, button, input, label, video')) return;
      const r = heroEl.getBoundingClientRect();
      const rip = document.createElement('span');
      rip.className = 'hero-ripple';
      rip.style.left = (e.clientX - r.left) + 'px';
      rip.style.top = (e.clientY - r.top) + 'px';
      heroEl.appendChild(rip);
      setTimeout(() => rip.remove(), 780);
    });
  }

  /* ---------- BACKGROUND PARTICLE FIELD ---------- */
  const cv = $('#fx');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    let w, h, pts, DPR = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      w = cv.width = innerWidth * DPR;
      h = cv.height = innerHeight * DPR;
      cv.style.width = innerWidth + 'px';
      cv.style.height = innerHeight + 'px';
      const count = Math.min(90, Math.floor(innerWidth / 16));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * DPR,
        vy: (Math.random() - 0.5) * 0.25 * DPR,
        r: (Math.random() * 1.6 + 0.4) * DPR
      }));
    }
    resize();
    addEventListener('resize', resize);
    const mouse = { x: -999, y: -999 };
    addEventListener('mousemove', e => { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; });
    const LINK = 130 * DPR;
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = `rgba(${CYAN},.7)`;
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * 0.4;
            ctx.strokeStyle = `rgba(${CYAN},.5)`;
            ctx.lineWidth = 0.6 * DPR;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const dmx = pts[i].x - mouse.x, dmy = pts[i].y - mouse.y, dm = Math.hypot(dmx, dmy);
        if (dm < LINK * 1.5) {
          ctx.globalAlpha = (1 - dm / (LINK * 1.5)) * 0.5;
          ctx.strokeStyle = 'rgba(255,209,102,.6)';
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    frame();
  }
})();
