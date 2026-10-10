const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

/* ---------- Live clocks ---------- */
(function () {
  const times = document.querySelectorAll('[data-clock="time"]');
  const dates = document.querySelectorAll('[data-clock="date"]');
  const hours = document.querySelectorAll('[data-clock="hour"]');
  const minutes = document.querySelectorAll('[data-clock="minute"]');
  const seconds = document.querySelectorAll('[data-clock="second"]');
  if (!times.length && !hours.length) return;

  function render() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    times.forEach((el) => {
      const opts = { hour: '2-digit', minute: '2-digit' };
      if (el.dataset.seconds !== undefined) opts.second = '2-digit';
      el.textContent = now.toLocaleTimeString([], opts);
    });
    dates.forEach((el) => {
      const style = el.dataset.style === 'short'
        ? { weekday: 'short', day: 'numeric', month: 'short' }
        : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      el.textContent = now.toLocaleDateString([], style);
    });
    hours.forEach((el) => { el.style.transform = `rotate(${(h % 12) * 30 + m * 0.5}deg)`; });
    minutes.forEach((el) => { el.style.transform = `rotate(${m * 6 + s * 0.1}deg)`; });
    seconds.forEach((el) => { el.style.transform = `rotate(${s * 6}deg)`; });
  }

  render();
  setInterval(() => { if (!document.hidden) render(); }, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
})();

/* ---------- Pause off-screen animations (saves CPU and battery) ---------- */
(function () {
  const areas = document.querySelectorAll('.hero, .ticker, .card-visual, .showcase-visual');
  if (!areas.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('anim-paused', !e.isIntersecting));
  }, { rootMargin: '100px 0px' });
  areas.forEach((el) => io.observe(el));
})();

/* ---------- Scroll reveal ---------- */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  els.forEach((el) => io.observe(el));
})();

/* ---------- Count-up numbers ---------- */
(function () {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  function run(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target.toFixed(dec) + suffix; return; }
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / 900, 1);
      el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  nums.forEach((el) => io.observe(el));
})();

/* ---------- Right-edge section rail ---------- */
(function () {
  const sections = document.querySelectorAll('[data-rail]');
  if (sections.length < 2 || !('IntersectionObserver' in window)) return;

  const rail = document.createElement('nav');
  rail.className = 'rail';
  rail.setAttribute('aria-label', 'On this page');
  const links = new Map();

  sections.forEach((sec, i) => {
    if (!sec.id) sec.id = 'section-' + (i + 1);
    const a = document.createElement('a');
    a.href = '#' + sec.id;
    a.textContent = sec.dataset.rail;
    rail.appendChild(a);
    links.set(sec, a);
  });
  document.body.appendChild(rail);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.remove('on'));
        links.get(e.target).classList.add('on');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => io.observe(s));
})();
