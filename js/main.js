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
      a.innerHTML = 'OPEN PROJECT <span>→</span>';
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
    // close after choosing a channel
    $$('.cmodal-opt', cModal).forEach(a => a.addEventListener('click', () => setTimeout(closeM, 120)));
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        // skill bars
        $$('.bar', e.target).forEach(b => {
          b.style.setProperty('--w', (b.dataset.lv || 80) + '%');
          b.classList.add('on');
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(el => io.observe(el));
  // also observe skill panels directly for bars
  $$('.skill-cat').forEach(el => io.observe(el));

  /* ---------- COUNTER STATS ---------- */
  const counters = $$('[data-count]');
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      let n = 0;
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
        c.classList.toggl