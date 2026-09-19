document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Scroll reveal ---------- */
(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => io.observe(el));
})();

/* ---------- Animated stat counters ---------- */
(function () {
  const stats = document.querySelectorAll('.stat-num[data-target]');
  if (!stats.length) return;

  function animate(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    const suffix = el.dataset.suffix || '';
    const duration = 900;

    if (prefersReducedMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    stats.forEach(animate);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  stats.forEach((el) => io.observe(el));
})();

/* ---------- Live clock demo (digital + analog) ---------- */
(function () {
  const digitalTime = document.getElementById('demoTime');
  const digitalDate = document.getElementById('demoDate');
  const hourHand = document.getElementById('handHour');
  const minuteHand = document.getElementById('handMinute');
  const secondHand = document.getElementById('handSecond');

  if (!digitalTime && !hourHand) return;

  function render() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    if (digitalTime) {
      digitalTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    if (digitalDate) {
      digitalDate.textContent = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    if (hourHand) hourHand.style.transform = `rotate(${(h % 12) * 30 + m * 0.5}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${m * 6 + s * 0.1}deg)`;
    if (secondHand) secondHand.style.transform = `rotate(${s * 6}deg)`;
  }

  render();
  setInterval(render, 1000);
})();

/* ---------- Subtle hero parallax on scroll ---------- */
(function () {
  if (prefersReducedMotion) return;
  const heroes = document.querySelectorAll('.hero-glow');
  if (!heroes.length) return;

  let ticking = false;
  function update() {
    const y = window.scrollY;
    const shift = Math.min(y * 0.25, 70);
    heroes.forEach((hero) => {
      hero.style.setProperty('--parallax-y', `${shift}px`);
    });
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
})();
