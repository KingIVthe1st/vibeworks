/* ============================================================
   VIBEWORKS STUDIO — CINEMATIC PRODUCT MOTION
   Scroll reveal, nav state + progress, hamburger, magnetic
   CTAs, custom cursor, hero parallax. Motion-heavy behavior is
   gated behind prefers-reduced-motion.
   ============================================================ */
'use strict';

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var hoverPointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ── Scroll reveal ─────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // No IO or reduced motion → show everything immediately
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Nav scroll state + scroll progress ────────────────── */
  var nav = document.getElementById('nav');
  var scrollProgress = document.getElementById('scrollProgress');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    if (scrollProgress) {
      var max = document.body.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Hamburger toggle ──────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Smooth scroll for in-page anchors ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      var target = href && href.length > 1 ? document.querySelector(href) : null;
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── Active nav state ──────────────────────────────────── */
  (function () {
    var path = window.location.pathname;
    document.querySelectorAll('nav .links a').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.indexOf('#') === 0 || href === '') return;
      var clean = href.replace(/^\//, '').replace('.html', '');
      if (clean && path.indexOf(clean) !== -1) link.classList.add('active');
    });
  })();

  /* ============================================================
     Motion-heavy behavior — gated on prefers-reduced-motion
     ============================================================ */
  if (reduce) return;

  /* ── Custom cursor (hover/fine pointers only) ──────────── */
  if (hoverPointer) {
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (dot && ring) {
      var mx = -100, my = -100, rx = -100, ry = -100, visible = false;
      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        if (!visible) { dot.style.opacity = '1'; ring.style.opacity = '1'; visible = true; }
      });
      document.addEventListener('mouseleave', function () {
        dot.style.opacity = '0'; ring.style.opacity = '0'; visible = false;
      });
      document.addEventListener('mouseover', function (e) {
        var t = e.target;
        var hot = t.closest && (t.closest('a') || t.closest('button') || t.closest('.cchip') || t.closest('.way'));
        document.body.classList.toggle('cursor-hover', !!hot);
      });
      (function loop() {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(loop);
      })();
    }
  }

  /* ── Magnetic buttons ──────────────────────────────────── */
  if (hoverPointer) {
    document.querySelectorAll('.btn--magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.35) + 'px)';
        btn.style.transition = 'transform .1s ease';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0,0)';
        btn.style.transition = 'transform .55s cubic-bezier(.23,1,.32,1)';
      });
    });
  }

  /* ── Hero parallax (glass stack) ───────────────────────── */
  var stack = document.querySelector('.stack');
  if (stack && hoverPointer) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          stack.style.transform = 'translateY(' + (y * 0.06) + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  }
})();
