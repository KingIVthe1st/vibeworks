/* ============================================
   VIBEWORKS AI STUDIO — MAIN JS
   ============================================ */

'use strict';

// ── Easing functions ────────────────────────

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// ── Page Loader ──────────────────────────────

(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    // Minimum display so the draw animation completes
    setTimeout(() => {
      loader.classList.add('loader--done');
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 750);
    }, 600);
  });
})();

// ── Custom Cursor ────────────────────────────

(function initCursor() {
  // Skip on touch-only devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let animId = null;
  let isVisible = false;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
      isVisible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
    isVisible = false;
  });

  // Hover state
  document.addEventListener('mouseover', e => {
    const target = e.target;
    if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.classList.contains('bento-item') ||
      target.classList.contains('faq__item') ||
      target.classList.contains('pain__card')
    ) {
      document.body.classList.add('cursor-hover');
    } else {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Click burst
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  function animateCursor() {
    // Lerp ring toward mouse
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;

    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
    ring.style.left = ringX  + 'px';
    ring.style.top  = ringY  + 'px';

    animId = requestAnimationFrame(animateCursor);
  }

  animateCursor();
})();

// ── Scroll Progress ─────────────────────────

const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
}

// ── Navigation ──────────────────────────────

const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

function updateNav() {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 80);
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href   = a.getAttribute('href');
    const target = href && href !== '#' ? document.querySelector(href) : null;
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

window.addEventListener('scroll', () => {
  updateScrollProgress();
  updateNav();
}, { passive: true });

updateNav();
updateScrollProgress();

// ── Particle Field (Hero Canvas) ───────────

(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  let mouseX = -1000, mouseY = -1000;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 1.5,
        alpha: 0.5
      });
    }
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 1,
        alpha: 0.25
      });
    }
  }

  // Mouse interaction
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }, { passive: true });

  canvas.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(139,92,246,' + ((1 - dist / 150) * 0.35) + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // Particles
    particles.forEach(p => {
      // Mouse repulsion
      const dmx = p.x - mouseX;
      const dmy = p.y - mouseY;
      const dm  = Math.sqrt(dmx * dmx + dmy * dmy);
      if (dm < 120) {
        const force = (120 - dm) / 120 * 0.8;
        p.x += (dmx / dm) * force;
        p.y += (dmy / dm) * force;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,92,246,' + p.alpha + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(drawFrame);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  drawFrame();
})();

// ── Wireframe Sphere (Shift Section) ───────

(function initSphere() {
  const canvas = document.getElementById('sphereCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COUNT   = 120;
  const RADIUS  = canvas.offsetWidth < 300 ? 120 : 180;
  const THRESH  = 60;

  let rotY          = 0;
  let scale         = 1;
  let assembled     = false;
  let assembleStart = null;
  let lastPulseTime = 0;
  let isPulsing     = false;
  let pulseProgress = 0;

  const target = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = golden * i;
    target.push({ x: Math.cos(t) * r * RADIUS, y: y * RADIUS, z: Math.sin(t) * r * RADIUS });
  }

  const start   = target.map(() => ({
    x: (Math.random() - 0.5) * 600,
    y: (Math.random() - 0.5) * 600,
    z: (Math.random() - 0.5) * 600
  }));
  const current = start.map(p => ({ ...p }));

  function rotateY(x, z, a) {
    return { x: x * Math.cos(a) - z * Math.sin(a), z: x * Math.sin(a) + z * Math.cos(a) };
  }

  function project(x, y, z) {
    const fov = 600, cx = canvas.width / 2, cy = canvas.height / 2;
    const d = fov / (fov + z);
    return { sx: cx + x * d * scale, sy: cy + y * d * scale, d };
  }

  function draw(ts) {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let prog = 1;
    if (!assembled) {
      if (!assembleStart) assembleStart = ts;
      prog = Math.min((ts - assembleStart) / 1200, 1);
      const t = easeOutCubic(prog);
      for (let i = 0; i < COUNT; i++) {
        current[i].x = start[i].x + (target[i].x - start[i].x) * t;
        current[i].y = start[i].y + (target[i].y - start[i].y) * t;
        current[i].z = start[i].z + (target[i].z - start[i].z) * t;
      }
      if (prog >= 1) assembled = true;
    }

    if (assembled) {
      if (!lastPulseTime) lastPulseTime = ts;
      if (ts - lastPulseTime > 3000 && !isPulsing) { isPulsing = true; pulseProgress = 0; }
      if (isPulsing) {
        pulseProgress = Math.min(pulseProgress + 0.016, 1);
        scale = 1 + 0.05 * Math.sin(pulseProgress * Math.PI);
        if (pulseProgress >= 1) { isPulsing = false; scale = 1; lastPulseTime = ts; }
      }
      rotY += 0.003;
    }

    const pts = current.map(p => {
      const r = rotateY(p.x, p.z, rotY);
      return { ...project(r.x, p.y, r.z) };
    });

    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = current[i].x - current[j].x;
        const dy = current[i].y - current[j].y;
        const dz = current[i].z - current[j].z;
        const d3 = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d3 < THRESH) {
          ctx.beginPath();
          ctx.moveTo(pts[i].sx, pts[i].sy);
          ctx.lineTo(pts[j].sx, pts[j].sy);
          ctx.strokeStyle = 'rgba(232,184,75,' + ((1 - d3 / THRESH) * 0.4 * prog) + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, 2 * p.d, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(167,139,250,' + (0.7 * prog * p.d) + ')';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  const section = document.getElementById('how-it-works');
  const trigger = section || canvas;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      requestAnimationFrame(draw);
      obs.disconnect();
    }
  }, { threshold: 0.2 });
  obs.observe(trigger);
})();

// ── Scroll Reveal Animations ────────────────

(function initReveal() {
  const baseOpts = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, baseOpts);

  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const cardObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        cardObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.service-card').forEach(el => cardObs.observe(el));

  const nameObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        nameObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.venture__name').forEach(el => nameObs.observe(el));

  const timelineEl = document.getElementById('processTimeline');
  if (timelineEl) {
    const tlObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const fill = document.getElementById('processLineFill');
        if (fill) fill.style.width = '100%';
        tlObs.disconnect();
      }
    }, { threshold: 0.3 });
    tlObs.observe(timelineEl);
  }

  const teamGrid = document.querySelector('.team__grid');
  const teamEls  = new Set();
  if (teamGrid) {
    teamGrid.querySelectorAll('.reveal-left, .reveal-right').forEach(el => teamEls.add(el));
    const teamObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        teamEls.forEach(el => el.classList.add('visible'));
        teamObs.disconnect();
      }
    }, { threshold: 0.2 });
    teamObs.observe(teamGrid);
  }

  revealEls.forEach(el => {
    if (!teamEls.has(el)) revealObs.observe(el);
  });
})();

// ── Word-by-Word Reveal ─────────────────────

function buildWordSpans(el, delayMs) {
  const text  = el.textContent.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const frag  = document.createDocumentFragment();

  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.style.transitionDelay = (i * delayMs) + 'ms';
    span.textContent = word;
    frag.appendChild(span);
    if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
  });

  el.textContent = '';
  el.appendChild(frag);
}

(function initWordReveal() {
  const painEl = document.querySelector('.js-word-reveal');
  if (painEl) {
    buildWordSpans(painEl, 50);
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        painEl.querySelectorAll('.word').forEach(w => w.classList.add('visible'));
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(painEl);
  }

  const ctaEl = document.querySelector('.js-word-drop');
  if (ctaEl) {
    buildWordSpans(ctaEl, 120);
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        ctaEl.querySelectorAll('.word').forEach(w => w.classList.add('visible'));
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(ctaEl);
  }
})();

// ── Stat Counters ───────────────────────────

(function initCounters() {
  const DURATION = 1800;

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / DURATION, 1);
      el.textContent = Math.floor(easeOutExpo(t) * target).toLocaleString() + (t >= 1 ? suffix : '');
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat__number[data-count]').forEach(el => obs.observe(el));
})();

// ── FAQ Accordion ───────────────────────────

(function initFAQ() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq__question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      items.forEach(i => {
        i.classList.remove('active');
        const q = i.querySelector('.faq__question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// ── 3D Card Tilt ────────────────────────────

(function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = 'rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) scale(1.02)';
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'rotateY(0deg) rotateX(0deg) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    });
  });
})();

// ── Magnetic Buttons ────────────────────────

(function initMagnetic() {
  const btns = document.querySelectorAll('.btn--magnetic');
  if (!btns.length) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform  = 'translate(' + (x * 0.28) + 'px, ' + (y * 0.38) + 'px)';
      btn.style.transition = 'transform 0.1s ease';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = 'translate(0, 0)';
      btn.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';
    });
  });
})();
