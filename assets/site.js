(function () {
  var root = document.documentElement;

  // ---- Theme toggle (remembers the viewer's choice) ----
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var saved = store('theme');
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  document.getElementById('themeBtn').addEventListener('click', function () {
    var cur = root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store('theme', next);
  });

  // ---- Mobile menu ----
  var links = document.querySelector('.nav-links');
  document.getElementById('menuBtn').addEventListener('click', function () { links.classList.toggle('open'); });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') links.classList.remove('open'); });

  // ---- Nav border + active section ----
  var nav = document.querySelector('.nav');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 8);
    var y = window.scrollY + 120, idx = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) idx = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle('active', i === idx); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Reveal on scroll ----
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // ---- News: show more ----
  var moreBtn = document.getElementById('newsMore');
  if (moreBtn) moreBtn.addEventListener('click', function () {
    var hidden = document.querySelectorAll('.news li.extra');
    var showing = moreBtn.getAttribute('aria-expanded') === 'true';
    hidden.forEach(function (li) { li.classList.toggle('hidden', showing); });
    moreBtn.setAttribute('aria-expanded', String(!showing));
    moreBtn.textContent = showing ? 'Show earlier news ↓' : 'Show less ↑';
  });

  // ---- Publication filters ----
  var pubs = Array.prototype.slice.call(document.querySelectorAll('.pub'));
  var years = Array.prototype.slice.call(document.querySelectorAll('.year'));
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var firstOnly = document.getElementById('firstOnly');
  var empty = document.querySelector('.pub-empty');
  var state = { t: 'all' };

  function apply() {
    var shown = 0;
    pubs.forEach(function (p) {
      var tags = (p.getAttribute('data-t') || '').split(' ');
      var ok = (state.t === 'all' || tags.indexOf(state.t) !== -1) &&
        (!firstOnly.checked || p.hasAttribute('data-first'));
      p.classList.toggle('hidden', !ok);
      if (ok) shown++;
    });
    years.forEach(function (y) {
      var any = pubs.some(function (p) { return p.getAttribute('data-y') === y.getAttribute('data-y') && !p.classList.contains('hidden'); });
      y.classList.toggle('hidden', !any);
    });
    empty.style.display = shown ? 'none' : 'block';
    filters.forEach(function (f) { f.classList.toggle('on', f.getAttribute('data-f') === state.t); f.setAttribute('aria-pressed', String(f.getAttribute('data-f') === state.t)); });
  }
  filters.forEach(function (f) { f.addEventListener('click', function () { state.t = f.getAttribute('data-f'); apply(); }); });
  firstOnly.addEventListener('change', apply);

  // Count papers per thrust and wire the research-focus buttons
  document.querySelectorAll('.thrust .go').forEach(function (btn) {
    var t = btn.getAttribute('data-f');
    var n = pubs.filter(function (p) { return (p.getAttribute('data-t') || '').split(' ').indexOf(t) !== -1; }).length;
    var span = btn.querySelector('.n');
    if (span) span.textContent = n;
    btn.addEventListener('click', function () {
      state.t = t; firstOnly.checked = false; apply();
      document.getElementById('publications').scrollIntoView({ behavior: 'smooth' });
    });
  });
  filters.forEach(function (f) {
    var t = f.getAttribute('data-f'), c = f.querySelector('.c');
    if (!c) return;
    c.textContent = t === 'all' ? pubs.length : pubs.filter(function (p) { return (p.getAttribute('data-t') || '').split(' ').indexOf(t) !== -1; }).length;
  });
  apply();

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
