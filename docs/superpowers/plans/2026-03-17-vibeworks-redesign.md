# VibeWorks Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely rewrite vibeworksstudio.ai as a cinematic, scroll-driven landing page that sells AI agent consulting and the VibeWorks product studio with billion-dollar agency aesthetics.

**Architecture:** Single-page static site — one `index.html`, one `styles.css`, one `script.js`. No frameworks, no build tools, no dependencies. All animations via vanilla JS IntersectionObserver + CSS transitions. Two canvas-based visuals (particle field, wireframe sphere) implemented in pure JS. Deployed via GitHub Pages.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox, transforms), Vanilla JS (ES6+), Canvas API, Google Fonts (Syne + Inter)

**Spec:** `docs/superpowers/specs/2026-03-17-vibeworks-redesign.md`

> **Note on testing:** This is a static HTML/CSS/JS site with no test runner. Each task uses browser verification steps in place of unit tests. Open `index.html` directly in Chrome after each task to verify. Use DevTools to check mobile at 375px width.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `index.html` | Full rewrite | All HTML structure, content, copy |
| `styles.css` | Full rewrite | Design tokens, layout, animations, responsive |
| `script.js` | Full rewrite | Canvas visuals, IntersectionObserver, interactions |
| `manifest.json` | Modify | Update theme color and description |

---

## Task 1: Design Tokens, CSS Reset & Base Styles

**Files:**
- Rewrite: `styles.css` (start fresh — delete all content)

- [ ] **Step 1: Delete old styles.css content and write design tokens**

Replace entire `styles.css` with:

```css
/* ============================================
   VIBEWORKS AI STUDIO — DESIGN SYSTEM
   ============================================ */

:root {
  /* Colors */
  --base:           #07070E;
  --surface:        #0F0F1A;
  --surface-2:      #161625;
  --violet:         #8B5CF6;
  --violet-bright:  #A78BFA;
  --violet-glow:    rgba(139,92,246,0.18);
  --gold:           #E8B84B;
  --gold-muted:     #D4A017;
  --gold-glow:      rgba(232,184,75,0.15);
  --crimson:        #7B1A2E;
  --green-pulse:    #10B981;
  --text-primary:   #F8F9FB;
  --text-muted:     #9CA3AF;
  --text-subtle:    #4B5563;
  --border:         rgba(255,255,255,0.06);

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-body:    'Inter', sans-serif;

  /* Type scale */
  --text-hero:    clamp(56px, 10vw, 120px);
  --text-display: clamp(40px, 6vw, 80px);
  --text-subhead: clamp(18px, 2.5vw, 24px);
  --text-body:    18px;
  --text-sm:      15px;
  --text-label:   12px;

  /* Spacing */
  --space-xs:   8px;
  --space-sm:   16px;
  --space-md:   24px;
  --space-lg:   40px;
  --space-xl:   64px;
  --space-2xl:  96px;
  --space-3xl:  128px;
  --space-4xl:  192px;

  /* Transitions */
  --ease-fast:   200ms cubic-bezier(0.4,0,0.2,1);
  --ease-base:   300ms cubic-bezier(0.4,0,0.2,1);
  --ease-slow:   600ms cubic-bezier(0.4,0,0.2,1);
  --ease-out:    600ms ease-out;
}

/* Reset */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
img { display: block; max-width: 100%; }
a { text-decoration: none; color: inherit; }
ul { list-style: none; }
button { border: none; background: none; cursor: pointer; }

body {
  background: var(--base);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

body.menu-open { overflow: hidden; }

/* Utility */
.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-lg); }
.container-wide { max-width: 1400px; margin: 0 auto; padding: 0 var(--space-lg); }

.label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: var(--space-md);
}
.label--violet { color: var(--violet); }
.label--gold   { color: var(--gold); }

/* Scroll progress bar */
.scroll-progress {
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, var(--violet), var(--gold));
  z-index: 1000;
  transition: width 100ms linear;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify in browser**

Open `index.html` in Chrome. Body should be near-black (`#07070E`). No errors in console.

- [ ] **Step 3: Commit**

```bash
cd /Users/ivanjackson/Desktop/vibeworkscursor
git add styles.css
git commit -m "feat: add design tokens and CSS reset"
```

---

## Task 2: Google Fonts + HTML Shell

**Files:**
- Rewrite: `index.html` (start fresh)

- [ ] **Step 1: Write the HTML shell with fonts, meta, and scroll progress bar**

Replace entire `index.html` with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VibeWorks AI Studio — AI Agents & Products Built for Your Business</title>
  <meta name="description" content="VibeWorks architects custom AI agents for entrepreneurs and small teams, and builds AI products in 2 weeks or less. Claude-powered. Real results.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://vibeworksstudio.ai/">
  <meta property="og:title" content="VibeWorks AI Studio — AI Agents & Products Built for Your Business">
  <meta property="og:description" content="Custom AI agents for entrepreneurs and small teams. Full AI products in 2 weeks. Claude & OpenClaw powered.">
  <meta property="og:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="VibeWorks AI Studio — AI Agents & Products Built for Your Business">
  <meta name="twitter:description" content="Custom AI agents for entrepreneurs and small teams. Full AI products in 2 weeks.">
  <meta name="twitter:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="theme-color" content="#8B5CF6">
  <link rel="canonical" href="https://vibeworksstudio.ai/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="scroll-progress" id="scrollProgress"></div>

  <!-- NAV placeholder -->
  <!-- HERO placeholder -->
  <!-- PAIN placeholder -->
  <!-- SHIFT placeholder -->
  <!-- SERVICES placeholder -->
  <!-- PORTFOLIO placeholder -->
  <!-- TEAM placeholder -->
  <!-- PROCESS placeholder -->
  <!-- FAQ placeholder -->
  <!-- CTA placeholder -->
  <!-- FOOTER placeholder -->

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open in Chrome. Page loads, near-black background, no console errors. Fonts load (check Network tab).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: HTML shell with meta tags and Google Fonts"
```

---

## Task 3: Navigation

**Files:**
- Modify: `index.html` (replace NAV placeholder)
- Modify: `styles.css` (append nav styles)

- [ ] **Step 1: Add nav HTML** (replace `<!-- NAV placeholder -->`)

```html
<nav class="nav" id="nav">
  <div class="nav__inner">
    <a href="#" class="nav__logo">VibeWorks</a>
    <div class="nav__links" id="navLinks">
      <a href="#how-it-works" class="nav__link">How It Works</a>
      <a href="#portfolio" class="nav__link">Portfolio</a>
      <a href="#services" class="nav__link">Services</a>
      <a href="#team" class="nav__link">Team</a>
      <a href="#contact" class="nav__link">Contact</a>
      <a href="mailto:info@vibeworksstudio.ai" class="nav__cta">Build My Agent</a>
    </div>
    <button class="nav__hamburger" id="hamburger" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
```

- [ ] **Step 2: Add nav CSS** (append to `styles.css`)

```css
/* ============================================
   NAVIGATION
   ============================================ */

.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 900;
  padding: var(--space-md) 0;
  transition: background var(--ease-base), backdrop-filter var(--ease-base);
}

.nav.scrolled {
  background: rgba(7,7,14,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(139,92,246,0.15);
}

.nav__inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav__logo {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.nav__link {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-muted);
  transition: color var(--ease-fast);
}
.nav__link:hover { color: var(--text-primary); }

.nav__cta {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  background: var(--violet);
  padding: 10px 20px;
  border-radius: 6px;
  transition: background var(--ease-fast), transform var(--ease-fast);
}
.nav__cta:hover {
  background: var(--violet-bright);
  transform: translateY(-1px);
}

/* Hamburger */
.nav__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
}
.nav__hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  transition: transform var(--ease-base), opacity var(--ease-base);
  transform-origin: center;
}
.nav__hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav__hamburger.open span:nth-child(2) { opacity: 0; }
.nav__hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile overlay */
@media (max-width: 768px) {
  .nav__hamburger { display: flex; }

  .nav__links {
    position: fixed;
    top: 0; right: 0;
    width: 100%;
    height: 100vh;
    background: var(--base);
    flex-direction: column;
    justify-content: center;
    gap: var(--space-xl);
    transform: translateX(100%);
    transition: transform 300ms cubic-bezier(0.4,0,0.2,1);
    z-index: 800;
  }
  .nav__links.open { transform: translateX(0); }

  .nav__link { font-size: 24px; }
  .nav__cta { font-size: 20px; padding: 14px 32px; }
}
```

- [ ] **Step 3: Verify in browser**

Nav appears at top. On desktop: logo left, links right. On mobile (DevTools 375px): hamburger visible, links hidden. No layout shift.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: navigation with mobile hamburger overlay"
```

---

## Task 4: Hero Section — HTML & CSS

**Files:**
- Modify: `index.html` (replace HERO placeholder)
- Modify: `styles.css` (append hero styles)

- [ ] **Step 1: Add hero HTML**

```html
<section class="hero" id="hero">
  <canvas class="hero__canvas" id="heroCanvas"></canvas>
  <div class="hero__content container">
    <span class="label label--gold">AI Agents · Built Products · Studio</span>
    <h1 class="hero__title">
      Your Business.<br>
      Running On<br>
      <span class="hero__title--accent">Autopilot.</span>
    </h1>
    <p class="hero__subtitle">
      We architect custom AI agents for entrepreneurs and small teams —<br>
      then build the products that put them to work.
    </p>
    <div class="hero__ctas">
      <a href="mailto:info@vibeworksstudio.ai" class="btn btn--primary">Get Your Agent Built</a>
      <a href="#portfolio" class="btn btn--ghost">See Our Work</a>
    </div>
    <div class="hero__stats">
      <div class="stat">
        <div class="stat__number" data-count="7">0</div>
        <div class="stat__label">Products Launched</div>
      </div>
      <div class="stat">
        <div class="stat__number stat__number--static">$1K–$5K</div>
        <div class="stat__label">Agent Builds</div>
      </div>
      <div class="stat">
        <div class="stat__number stat__number--static">2 Weeks</div>
        <div class="stat__label">Delivery</div>
      </div>
      <div class="stat">
        <div class="stat__number" data-count="500" data-suffix="K+">0</div>
        <div class="stat__label">Creator Reach</div>
      </div>
    </div>
  </div>
  <div class="hero__scroll-indicator">
    <span>Scroll</span>
    <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
      <path d="M8 4v16M8 20l-5-5M8 20l5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </div>
</section>
```

- [ ] **Step 2: Add hero CSS**

```css
/* ============================================
   HERO
   ============================================ */

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  overflow: hidden;
}

.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero__content {
  position: relative;
  z-index: 1;
}

.hero__title {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 800;
  line-height: 1.0;
  letter-spacing: -0.03em;
  margin-bottom: var(--space-lg);
}

.hero__title--accent {
  background: linear-gradient(135deg, var(--violet), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__subtitle {
  font-size: var(--text-subhead);
  color: var(--text-muted);
  max-width: 600px;
  margin-bottom: var(--space-xl);
  line-height: 1.6;
}

.hero__ctas {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-4xl);
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 6px;
  transition: transform var(--ease-fast), box-shadow var(--ease-fast), background var(--ease-fast);
  cursor: pointer;
}
.btn--primary {
  background: var(--violet);
  color: #fff;
}
.btn--primary:hover {
  background: var(--violet-bright);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px var(--violet-glow);
}
.btn--gold {
  background: var(--gold);
  color: var(--base);
  font-weight: 700;
}
.btn--gold:hover {
  background: #f0c75a;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px var(--gold-glow);
}
.btn--ghost {
  border: 1px solid var(--border);
  color: var(--text-primary);
  background: transparent;
}
.btn--ghost:hover {
  border-color: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}
.btn--large { padding: 18px 36px; font-size: var(--text-body); }

/* Stats */
.hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-xl);
  max-width: 680px;
}

.stat__number {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 6px;
}

.stat__label {
  font-size: var(--text-label);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Scroll indicator */
.hero__scroll-indicator {
  position: absolute;
  bottom: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: var(--text-label);
  letter-spacing: 0.1em;
  color: var(--gold);
  opacity: 0.7;
  animation: scrollBounce 2s ease-in-out infinite;
  z-index: 1;
}

@keyframes scrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

/* Hero responsive */
@media (max-width: 768px) {
  .hero__title { font-size: clamp(44px, 13vw, 72px); }
  .hero__subtitle { font-size: 16px; }
  .hero__subtitle br { display: none; }
  .hero__ctas { flex-direction: column; }
  .hero__ctas .btn { text-align: center; justify-content: center; }
  .hero__stats {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-lg);
  }
}
```

- [ ] **Step 3: Verify in browser**

Hero section fills viewport. Headline gradient on "Autopilot." visible. Stat grid shows. CTAs side by side (desktop) / stacked (mobile). Canvas element present but empty (JS comes later).

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: hero section HTML and CSS"
```

---

## Task 5: Pain Section — HTML & CSS

**Files:**
- Modify: `index.html` (replace PAIN placeholder)
- Modify: `styles.css` (append)

- [ ] **Step 1: Add pain HTML**

```html
<section class="pain" id="pain">
  <div class="pain__gradient"></div>
  <div class="container">
    <span class="label label--violet">Sound Familiar?</span>
    <h2 class="pain__headline js-word-reveal">
      You're talented. You're busy. And you're doing everything manually.
    </h2>
    <p class="pain__body">
      Answering emails at midnight. Chasing leads by hand.<br>
      Scheduling, following up, onboarding, repeating.<br>
      Every hour you spend on tasks a machine could do<br>
      is an hour stolen from the work only you can do.
    </p>
    <p class="pain__callout">
      Your competitors aren't working harder than you.<br>
      They just stopped working on the wrong things.
    </p>
  </div>
</section>
```

- [ ] **Step 2: Add pain CSS**

```css
/* ============================================
   PAIN SECTION
   ============================================ */

.pain {
  position: relative;
  padding: var(--space-4xl) 0;
  text-align: center;
  overflow: hidden;
}

.pain__gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 50%,
    var(--crimson) 0%,
    var(--violet) 30%,
    var(--base) 70%);
  opacity: 0;
  filter: blur(80px);
  animation: painGradientDrift 12s ease-in-out infinite alternate;
}

@keyframes painGradientDrift {
  0%   { opacity: 0.35; transform: translate(-10%, -10%); }
  100% { opacity: 0.55; transform: translate(10%, 10%); }
}

.pain__headline {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  max-width: 900px;
  margin: 0 auto var(--space-xl);
  position: relative;
}

/* Word reveal spans — injected by JS */
.pain__headline .word {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 500ms ease-out, transform 500ms ease-out;
}
.pain__headline .word.visible {
  opacity: 1;
  transform: translateY(0);
}

.pain__body {
  font-size: var(--text-subhead);
  color: var(--text-muted);
  max-width: 560px;
  margin: 0 auto var(--space-xl);
  position: relative;
  line-height: 1.8;
}

.pain__callout {
  font-family: var(--font-display);
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 700;
  color: var(--gold);
  position: relative;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .pain__body br { display: none; }
  .pain__body { font-size: 16px; }
  .pain__callout { font-size: 20px; }
}
```

- [ ] **Step 3: Verify in browser**

Pain section appears. Gradient animation runs. Headline text present (not animated yet). Gold callout visible.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: pain section with gradient animation"
```

---

## Task 6: The Shift Section — HTML & CSS

**Files:**
- Modify: `index.html` (replace SHIFT placeholder)
- Modify: `styles.css` (append)

- [ ] **Step 1: Add shift HTML**

```html
<section class="shift" id="how-it-works">
  <div class="shift__inner container-wide">
    <div class="shift__visual">
      <canvas class="shift__sphere" id="sphereCanvas"></canvas>
    </div>
    <div class="shift__content">
      <span class="label label--gold">The Shift</span>
      <h2 class="shift__title">
        What if the most<br>
        productive person<br>
        on your team<br>
        never slept?
      </h2>
      <p class="shift__body">
        AI agents don't take vacations. They don't miss follow-ups.
        They don't forget. They don't get overwhelmed.
      </p>
      <p class="shift__body">
        They handle your inbox, qualify your leads, onboard your
        clients, manage your calendar — and they get better
        every single day.
      </p>
      <p class="shift__highlight">This isn't the future. This is Tuesday.</p>
      <p class="shift__body">
        VibeWorks architects, installs, and customizes AI agents
        built specifically for how your business works —
        not some generic template that half-fits.
        Using platforms like OpenClaw and cutting-edge
        Claude-powered infrastructure, we wire AI into
        the tools you already use.
      </p>
      <a href="#services" class="shift__link">See how it works &#8594;</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add shift CSS**

```css
/* ============================================
   SHIFT SECTION
   ============================================ */

.shift {
  padding: var(--space-4xl) 0;
  background: linear-gradient(180deg, var(--base) 0%, var(--surface) 50%, var(--base) 100%);
}

.shift__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4xl);
  align-items: center;
}

.shift__visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.shift__sphere {
  width: 400px;
  height: 400px;
  max-width: 100%;
}

.shift__title {
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-lg);
}

.shift__body {
  font-size: var(--text-body);
  color: var(--text-muted);
  margin-bottom: var(--space-md);
  line-height: 1.8;
}

.shift__highlight {
  font-family: var(--font-display);
  font-size: clamp(20px, 2.5vw, 26px);
  font-weight: 700;
  color: var(--gold);
  margin: var(--space-lg) 0;
}

.shift__link {
  display: inline-block;
  margin-top: var(--space-md);
  color: var(--violet-bright);
  font-weight: 600;
  font-size: var(--text-body);
  border-bottom: 1px solid transparent;
  transition: border-color var(--ease-fast), color var(--ease-fast);
}
.shift__link:hover {
  color: var(--violet-bright);
  border-color: var(--violet-bright);
}

@media (max-width: 768px) {
  .shift__inner {
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
  }
  .shift__sphere {
    width: 280px;
    height: 280px;
  }
  .shift__title { font-size: clamp(30px, 9vw, 48px); }
}
```

- [ ] **Step 3: Verify in browser**

Two-column layout. Sphere canvas present (empty until JS). Gold highlight text visible. Stacks on mobile.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: shift section layout and styles"
```

---

## Task 7: Services Section — HTML & CSS

**Files:**
- Modify: `index.html` (replace SERVICES placeholder)
- Modify: `styles.css` (append)

- [ ] **Step 1: Add services HTML**

```html
<section class="services" id="services">
  <div class="services__grid-bg"></div>
  <div class="container">
    <div class="services__header">
      <span class="label label--violet">How We Work With You</span>
      <h2 class="services__title">Two Ways to Transform<br>Your Business</h2>
      <p class="services__subtitle">
        Whether you need an AI agent working inside your business
        or a full product built and launched — we do both.
      </p>
    </div>
    <div class="services__cards">

      <div class="service-card service-card--gold reveal-up">
        <div class="service-card__top">
          <span class="service-card__badge">New</span>
          <h3 class="service-card__title">Custom AI Agents</h3>
          <p class="service-card__sub">For entrepreneurs &amp; small teams</p>
          <div class="service-card__price">$1K &ndash; $5K</div>
        </div>
        <p class="service-card__body">
          We architect and install AI agents custom-built
          for your specific workflows. Your email. Your CRM.
          Your calendar. Your voice.
        </p>
        <p class="service-card__body service-card__body--strong">
          Not a chatbot. Not a template.<br>
          A tireless digital team member wired directly into how you work.
        </p>
        <ul class="service-card__features">
          <li>&#10022; Powered by Claude &amp; OpenClaw</li>
          <li>&#10022; Connects to your existing tools</li>
          <li>&#10022; Custom memory &amp; personality</li>
          <li>&#10022; WhatsApp, Slack, email integration</li>
          <li>&#10022; Ongoing support &amp; refinement</li>
        </ul>
        <a href="mailto:info@vibeworksstudio.ai" class="btn btn--gold btn--large service-card__cta">Build My Agent</a>
      </div>

      <div class="service-card service-card--violet reveal-up" style="transition-delay: 120ms;">
        <div class="service-card__top">
          <h3 class="service-card__title">AI Product Studio</h3>
          <p class="service-card__sub">For founders, creators &amp; companies</p>
          <div class="service-card__price service-card__price--violet">2 Weeks</div>
        </div>
        <p class="service-card__body">
          We build full AI products from idea to launch.
          Partner with us on revenue share, or hire
          us for fixed-price development.
        </p>
        <p class="service-card__body service-card__body--strong">
          Seven live products and counting — we know what it takes to ship fast and ship right.
        </p>
        <ul class="service-card__features">
          <li>&#10022; Full-stack AI development</li>
          <li>&#10022; Partnership track (revenue share)</li>
          <li>&#10022; Fixed-price project builds</li>
          <li>&#10022; Launch strategy included</li>
          <li>&#10022; Production-ready from day one</li>
        </ul>
        <a href="mailto:info@vibeworksstudio.ai" class="btn btn--primary btn--large service-card__cta">Start a Project</a>
      </div>

    </div>
    <p class="services__footer">
      Not sure which fits?
      <a href="mailto:info@vibeworksstudio.ai" class="services__footer-link">Book a free 20-minute call and we'll tell you honestly.</a>
    </p>
  </div>
</section>
```

- [ ] **Step 2: Add services CSS**

```css
/* ============================================
   SERVICES
   ============================================ */

.services {
  position: relative;
  padding: var(--space-4xl) 0;
  overflow: hidden;
}

.services__grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.services__header {
  text-align: center;
  margin-bottom: var(--space-3xl);
  position: relative;
}

.services__title {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}

.services__subtitle {
  font-size: var(--text-subhead);
  color: var(--text-muted);
  max-width: 520px;
  margin: 0 auto;
}

.services__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

.service-card {
  background: var(--surface);
  border-radius: 16px;
  padding: var(--space-xl);
  border-top: 3px solid transparent;
  transition: transform var(--ease-base), box-shadow var(--ease-base), border-color var(--ease-base), background var(--ease-base);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.service-card--gold { border-top-color: var(--gold-muted); }
.service-card--violet { border-top-color: var(--violet); }

.service-card:hover {
  transform: translateY(-8px);
  background: rgba(255,255,255,0.02);
}
.service-card--gold:hover {
  border-top-color: var(--gold);
  box-shadow: 0 0 60px 0 var(--gold-glow);
}
.service-card--violet:hover {
  border-top-color: var(--violet-bright);
  box-shadow: 0 0 60px 0 var(--violet-glow);
}

.service-card__badge {
  display: inline-block;
  background: var(--gold);
  color: var(--base);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 4px;
  margin-bottom: var(--space-sm);
}

.service-card__title {
  font-family: var(--font-display);
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.service-card__sub {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}

.service-card__price {
  font-family: var(--font-display);
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 800;
  color: var(--gold);
  letter-spacing: -0.02em;
  margin: var(--space-sm) 0 var(--space-md);
}
.service-card__price--violet { color: var(--violet-bright); }

.service-card__body {
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.7;
}
.service-card__body--strong {
  color: var(--text-primary);
  font-weight: 500;
}

.service-card__features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: var(--space-sm) 0;
}
.service-card__features li {
  font-size: var(--text-sm);
  color: var(--text-muted);
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity 400ms ease-out, transform 400ms ease-out;
}
.service-card.visible .service-card__features li {
  opacity: 1;
  transform: translateX(0);
}
.service-card.visible .service-card__features li:nth-child(1) { transition-delay: 100ms; }
.service-card.visible .service-card__features li:nth-child(2) { transition-delay: 180ms; }
.service-card.visible .service-card__features li:nth-child(3) { transition-delay: 260ms; }
.service-card.visible .service-card__features li:nth-child(4) { transition-delay: 340ms; }
.service-card.visible .service-card__features li:nth-child(5) { transition-delay: 420ms; }

.service-card__cta { margin-top: auto; text-align: center; justify-content: center; }

.services__footer {
  text-align: center;
  margin-top: var(--space-xl);
  color: var(--text-muted);
  font-size: var(--text-sm);
  position: relative;
}
.services__footer-link {
  color: var(--violet-bright);
  border-bottom: 1px solid transparent;
  transition: border-color var(--ease-fast);
}
.services__footer-link:hover { border-color: var(--violet-bright); }

@media (max-width: 768px) {
  .services__cards { grid-template-columns: 1fr; }
  .service-card { padding: var(--space-lg); }
}
```

- [ ] **Step 3: Verify in browser**

Two cards side by side (desktop) / stacked (mobile). Gold top border on agent card, violet on studio. Hover lift + glow. "New" badge on agent card.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: services section two-card layout"
```

---

## Task 8: Portfolio Section — HTML & CSS

**Files:**
- Modify: `index.html` (replace PORTFOLIO placeholder)
- Modify: `styles.css` (append)

- [ ] **Step 1: Add portfolio HTML**

```html
<section class="portfolio" id="portfolio">
  <div class="container">
    <div class="portfolio__header">
      <span class="label label--gold">Proof of Work</span>
      <h2 class="portfolio__title">7 AI Products.<br>All Live. All Real.</h2>
      <p class="portfolio__subtitle">We don't prototype. We don't demo. We ship.</p>
    </div>
  </div>

  <div class="venture">
    <div class="venture__image reveal-left">
      <div class="venture__status"><span class="venture__dot"></span>Live</div>
      <img src="images/Portfoliosites/ratemylooks.png" alt="RateMyLooksAI" loading="lazy">
    </div>
    <div class="venture__info reveal-right">
      <span class="venture__tag">Consumer AI &middot; Established User Base</span>
      <h3 class="venture__name">RateMyLooksAI</h3>
      <p class="venture__tagline">Your Beauty Score, Decided by AI</p>
      <p class="venture__desc">AI-powered appearance analysis with an established daily user base and strong social engagement across platforms.</p>
      <a href="https://ratemylooks.pages.dev/" target="_blank" rel="noopener" class="venture__link">Visit &#8594;</a>
    </div>
  </div>

  <div class="venture venture--reverse">
    <div class="venture__image reveal-right">
      <div class="venture__status"><span class="venture__dot"></span>Live</div>
      <img src="images/Portfoliosites/sketchmysoulmate.png" alt="SketchMySoulmate" loading="lazy">
    </div>
    <div class="venture__info reveal-left">
      <span class="venture__tag">Creator AI &middot; Viral Distribution</span>
      <h3 class="venture__name">SketchMySoulmate</h3>
      <p class="venture__tagline">See Your Perfect Match, Visualized</p>
      <p class="venture__desc">AI visualization of your ideal partner, distributed virally through creator partnerships with massive organic reach.</p>
      <a href="https://sketchmysoulmate.com" target="_blank" rel="noopener" class="venture__link">Visit &#8594;</a>
    </div>
  </div>

  <div class="venture">
    <div class="venture__image reveal-left">
      <div class="venture__status"><span class="venture__dot"></span>Live</div>
      <img src="images/Portfoliosites/songgram.png" alt="SongGram" loading="lazy">
    </div>
    <div class="venture__info reveal-right">
      <span class="venture__tag">Music AI &middot; Multi-Platform</span>
      <h3 class="venture__name">SongGram</h3>
      <p class="venture__tagline">Who Are You Through Music?</p>
      <p class="venture__desc">AI-powered music personality analysis with integrations across major streaming platforms and multi-channel distribution.</p>
      <a href="https://songgram.com" target="_blank" rel="noopener" class="venture__link">Visit &#8594;</a>
    </div>
  </div>

  <div class="venture venture--reverse">
    <div class="venture__image reveal-right">
      <div class="venture__status"><span class="venture__dot"></span>Live</div>
      <img src="images/Portfoliosites/aibookpublisher.png" alt="AI Book Publisher" loading="lazy">
    </div>
    <div class="venture__info reveal-left">
      <span class="venture__tag">Publishing AI &middot; Content Creation</span>
      <h3 class="venture__name">AI Book Publisher</h3>
      <p class="venture__tagline">From Blank Page to Published Author</p>
      <p class="venture__desc">AI-powered book creation tool enabling rapid content workflows. From concept to published in minutes, not months.</p>
      <a href="https://aibookpublisher.com" target="_blank" rel="noopener" class="venture__link">Visit &#8594;</a>
    </div>
  </div>

  <div class="venture">
    <div class="venture__image reveal-left">
      <div class="venture__status"><span class="venture__dot"></span>Live</div>
      <img src="images/Portfoliosites/mddiagnose.png" alt="MD Diagnose" loading="lazy">
    </div>
    <div class="venture__info reveal-right">
      <span class="venture__tag">Health AI &middot; Triage Automation</span>
      <h3 class="venture__name">MD Diagnose</h3>
      <p class="venture__tagline">Medical Answers, No Appointment Needed</p>
      <p class="venture__desc">AI-powered preliminary health assessment. Accessible medical guidance when doctors aren't immediately available.</p>
      <a href="https://md-diagnose-app.ivanleejackson.workers.dev/" target="_blank" rel="noopener" class="venture__link">Visit &#8594;</a>
    </div>
  </div>

  <div class="venture venture--reverse">
    <div class="venture__image reveal-right">
      <div class="venture__status"><span class="venture__dot"></span>Live</div>
      <img src="images/Portfoliosites/aicharttraders.png" alt="AI Chart Traders" loading="lazy">
    </div>
    <div class="venture__info reveal-left">
      <span class="venture__tag">Fintech AI &middot; Technical Analysis</span>
      <h3 class="venture__name">AI Chart Traders</h3>
      <p class="venture__tagline">Trade Smarter. React Faster.</p>
      <p class="venture__desc">Automated technical analysis for traders. AI-driven chart pattern recognition and trade signal generation in real time.</p>
      <a href="https://aicharttraders.com" target="_blank" rel="noopener" class="venture__link">Visit &#8594;</a>
    </div>
  </div>

  <div class="venture">
    <div class="venture__image reveal-left">
      <div class="venture__status"><span class="venture__dot"></span>Live</div>
      <img src="images/Portfoliosites/richpplstocks.png" alt="Rich People Stocks" loading="lazy">
    </div>
    <div class="venture__info reveal-right">
      <span class="venture__tag">Fintech AI &middot; Insider Intelligence</span>
      <h3 class="venture__name">Rich People Stocks</h3>
      <p class="venture__tagline">Track What Insiders Actually Buy</p>
      <p class="venture__desc">Real-time tracking of congressional and institutional trades. Know what the wealthy are buying before the market catches on.</p>
      <a href="https://richpeoplestocks.com/" target="_blank" rel="noopener" class="venture__link">Visit &#8594;</a>
    </div>
  </div>

  <div class="portfolio__close container">
    <h3 class="portfolio__close-title">Every one of these started<br>as a conversation.</h3>
    <p class="portfolio__close-sub">Yours could be next.</p>
  </div>
</section>
```

- [ ] **Step 2: Add portfolio CSS**

```css
/* ============================================
   PORTFOLIO
   ============================================ */

.portfolio { padding: var(--space-4xl) 0; }

.portfolio__header {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

.portfolio__title {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}

.portfolio__subtitle {
  font-size: var(--text-subhead);
  color: var(--text-muted);
}

.venture {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4xl);
  align-items: center;
  max-width: 1200px;
  margin: 0 auto var(--space-4xl);
  padding: 0 var(--space-lg);
}
.venture--reverse { direction: rtl; }
.venture--reverse > * { direction: ltr; }

.venture__image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}
.venture__image img {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  transition: transform var(--ease-base), box-shadow var(--ease-base);
}
.venture__image:hover img {
  transform: scale(1.02);
  box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.3);
}

.venture__status {
  position: absolute;
  top: 16px; left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  z-index: 2;
}

.venture__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--green-pulse);
  box-shadow: 0 0 8px var(--green-pulse);
  animation: pulseDot 2s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% { box-shadow: 0 0 4px var(--green-pulse); }
  50%       { box-shadow: 0 0 12px var(--green-pulse); }
}

.venture__info { padding: var(--space-md) 0; }

.venture__tag {
  font-size: var(--text-label);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 600;
}

.venture__name {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: var(--space-sm) 0 4px;
  display: inline-block;
}

.venture__name::after {
  content: '';
  display: block;
  height: 2px;
  background: var(--gold);
  width: 0;
  transition: width 600ms ease-out;
  margin-top: 4px;
}
.venture__name.animated::after { width: 100%; }

.venture__tagline {
  font-size: var(--text-subhead);
  color: var(--text-muted);
  margin-bottom: var(--space-md);
  font-style: italic;
}

.venture__desc {
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-lg);
  max-width: 440px;
}

.venture__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: var(--text-primary);
  border: 1px solid var(--border);
  padding: 10px 20px;
  border-radius: 6px;
  font-size: var(--text-sm);
  transition: border-color var(--ease-fast), color var(--ease-fast), transform var(--ease-fast);
}
.venture__link:hover {
  border-color: var(--violet);
  color: var(--violet-bright);
  transform: translateX(4px);
}

.portfolio__close {
  text-align: center;
  padding: var(--space-4xl) var(--space-lg);
}
.portfolio__close-title {
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}
.portfolio__close-sub {
  font-size: var(--text-subhead);
  color: var(--text-muted);
}

/* Reveal animation base states */
.reveal-up, .reveal-left, .reveal-right {
  opacity: 0;
  transition: opacity var(--ease-out), transform var(--ease-out);
}
.reveal-up    { transform: translateY(40px); }
.reveal-left  { transform: translateX(-60px); }
.reveal-right { transform: translateX(60px); }

.reveal-up.visible,
.reveal-left.visible,
.reveal-right.visible {
  opacity: 1;
  transform: translate(0);
}

@media (max-width: 768px) {
  .venture {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
    direction: ltr;
  }
  .venture--reverse { direction: ltr; }
  .venture__desc { max-width: 100%; }
  .portfolio__title { font-size: clamp(32px, 10vw, 52px); }
}
```

- [ ] **Step 3: Verify in browser**

All 7 portfolio items visible. Alternating layout. Green pulse dots animate. Images lazy load. Stacked on mobile.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: portfolio section with 7 ventures"
```

---

## Task 9: Team Section — HTML & CSS

**Files:**
- Modify: `index.html` (replace TEAM placeholder)
- Modify: `styles.css` (append)

- [ ] **Step 1: Add team HTML**

```html
<section class="team" id="team">
  <div class="container">
    <div class="team__header">
      <span class="label label--violet">The Team</span>
      <h2 class="team__title">Built by People Who<br>Actually Ship.</h2>
      <p class="team__subtitle">
        No suits. No middlemen. You work directly with the founders —
        the same people who've built 7 live AI products from scratch.
      </p>
    </div>
    <div class="team__grid">

      <div class="founder reveal-left">
        <div class="founder__photo founder__photo--violet">
          <img src="images/Portfoliosites/ivan.jpg" alt="Ivanlee Jackson, Co-Founder and CTO of VibeWorks AI Studio">
        </div>
        <div class="founder__info">
          <span class="label label--gold">Co-Founder &amp; CTO</span>
          <h3 class="founder__name">Ivanlee Jackson</h3>
          <p class="founder__bio">
            10+ years building full-stack products from zero to production.
            Ivan has shipped AI-powered apps across healthcare, fintech,
            music, and consumer tech — fast, clean, and built to scale.
          </p>
          <p class="founder__bio founder__bio--strong">
            He architects the agents. He writes the code.
            He's the reason 2 weeks isn't a promise, it's a track record.
          </p>
          <ul class="founder__creds">
            <li>&#183; 10+ years full-stack engineering</li>
            <li>&#183; Expert in 0&#8594;1 AI product builds</li>
            <li>&#183; Claude, OpenClaw &amp; modern AI infrastructure</li>
            <li>&#183; Every line of code is production-grade</li>
          </ul>
        </div>
      </div>

      <div class="founder reveal-right">
        <div class="founder__photo founder__photo--gold">
          <img src="images/Portfoliosites/natasha.jpeg" alt="Natasha Burton, Co-Founder and CEO of VibeWorks AI Studio">
        </div>
        <div class="founder__info">
          <span class="label label--gold">Co-Founder &amp; CEO</span>
          <h3 class="founder__name">Natasha Burton</h3>
          <p class="founder__bio">
            500K+ followers and a track record of turning audiences
            into revenue. Natasha understands distribution at a level
            most agencies never see — because she lives it.
          </p>
          <p class="founder__bio founder__bio--strong">
            She's the reason our products don't just launch.
            They land.
          </p>
          <ul class="founder__creds">
            <li>&#183; 500K+ engaged audience</li>
            <li>&#183; Serial viral product launcher</li>
            <li>&#183; Creator economy &amp; growth strategy</li>
            <li>&#183; The bridge between AI capability and real people</li>
          </ul>
        </div>
      </div>

    </div>
    <div class="team__statement">
      <h3 class="team__statement-title">
        When you work with VibeWorks,<br>
        you're not handed off to a team.<br>
        You work with us.
      </h3>
      <p class="team__statement-sub">Every project. Every call. Every decision.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add team CSS**

```css
/* ============================================
   TEAM
   ============================================ */

.team {
  padding: var(--space-4xl) 0;
  background: linear-gradient(180deg, var(--base) 0%, var(--surface) 100%);
}

.team__header {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

.team__title {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}

.team__subtitle {
  font-size: var(--text-subhead);
  color: var(--text-muted);
  max-width: 560px;
  margin: 0 auto;
}

.team__grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-4xl);
  max-width: 1000px;
  margin: 0 auto;
}

.founder {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: var(--space-3xl);
  align-items: start;
}

.founder__photo {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}
.founder__photo img {
  width: 100%;
  height: 480px;
  object-fit: cover;
  display: block;
}
.founder__photo::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  transition: box-shadow 800ms ease-out;
  pointer-events: none;
}
.founder__photo--violet::after { box-shadow: 0 0 40px 8px var(--violet-glow); }
.founder__photo--gold::after   { box-shadow: 0 0 40px 8px var(--gold-glow); }

.founder.visible .founder__photo--violet::after { box-shadow: 0 0 80px 20px var(--violet-glow); }
.founder.visible .founder__photo--gold::after   { box-shadow: 0 0 80px 20px var(--gold-glow); }

.founder__name {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: var(--space-sm) 0 var(--space-md);
}

.founder__bio {
  font-size: var(--text-body);
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-md);
}
.founder__bio--strong {
  color: var(--text-primary);
  font-weight: 500;
}

.founder__creds {
  margin-top: var(--space-lg);
}
.founder__creds li {
  font-size: var(--text-sm);
  color: var(--text-muted);
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}
.founder__creds li:last-child { border-bottom: none; }

.team__statement {
  text-align: center;
  padding: var(--space-4xl) 0 0;
}
.team__statement-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.3;
  margin-bottom: var(--space-md);
}
.team__statement-sub {
  font-size: var(--text-subhead);
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .founder {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
  .founder__photo img { height: 360px; }
  .team__title { font-size: clamp(32px, 10vw, 52px); }
}
```

- [ ] **Step 3: Verify in browser**

Two founders displayed. Photos at correct ratio. Violet/gold glows on photos. Grid collapses to single column on mobile.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: team section with founder cards"
```

---

## Task 10: Process Section — HTML & CSS

**Files:**
- Modify: `index.html` (replace PROCESS placeholder)
- Modify: `styles.css` (append)

- [ ] **Step 1: Add process HTML**

```html
<section class="process" id="process">
  <div class="container">
    <div class="process__header">
      <span class="label label--gold">The Process</span>
      <h2 class="process__title">From Conversation<br>to Deployed in Days.</h2>
      <p class="process__subtitle">No lengthy discovery phases. No scope creep surprises.</p>
    </div>
    <div class="process__timeline" id="processTimeline">
      <div class="process__line"><div class="process__line-fill" id="processLineFill"></div></div>
      <div class="process__steps">
        <div class="process__step reveal-up">
          <div class="process__step-num">01</div>
          <div class="process__step-ghost" aria-hidden="true">01</div>
          <h3 class="process__step-title">Discovery Call</h3>
          <p class="process__step-desc">20 minutes. We listen more than we talk. You leave knowing exactly what's possible.</p>
        </div>
        <div class="process__step reveal-up" style="transition-delay:100ms">
          <div class="process__step-num">02</div>
          <div class="process__step-ghost" aria-hidden="true">02</div>
          <h3 class="process__step-title">Proposal &amp; Scope</h3>
          <p class="process__step-desc">Within 48 hours. Clear pricing, clear timeline, clear deliverables. No surprises.</p>
        </div>
        <div class="process__step reveal-up" style="transition-delay:200ms">
          <div class="process__step-num">03</div>
          <div class="process__step-ghost" aria-hidden="true">03</div>
          <h3 class="process__step-title">Build Sprint</h3>
          <p class="process__step-desc">We move fast. You get progress updates every 2 days — not at the end.</p>
        </div>
        <div class="process__step reveal-up" style="transition-delay:300ms">
          <div class="process__step-num">04</div>
          <div class="process__step-ghost" aria-hidden="true">04</div>
          <h3 class="process__step-title">Review &amp; Refine</h3>
          <p class="process__step-desc">Your feedback shapes the final product. We iterate until it's exactly right.</p>
        </div>
        <div class="process__step reveal-up" style="transition-delay:400ms">
          <div class="process__step-num">05</div>
          <div class="process__step-ghost" aria-hidden="true">05</div>
          <h3 class="process__step-title">Launch &amp; Handoff</h3>
          <p class="process__step-desc">Deployed, documented, and running. Support available from day one.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add process CSS**

```css
/* ============================================
   PROCESS
   ============================================ */

.process {
  padding: var(--space-4xl) 0;
  background: var(--surface);
}

.process__header {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

.process__title {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}

.process__subtitle {
  font-size: var(--text-subhead);
  color: var(--text-muted);
}

.process__timeline { position: relative; }

.process__line {
  position: absolute;
  top: 32px;
  left: var(--space-lg);
  right: var(--space-lg);
  height: 2px;
  background: var(--border);
  overflow: hidden;
}

.process__line-fill {
  height: 100%;
  background: var(--gold);
  width: 0%;
  transition: width 1500ms cubic-bezier(0.4,0,0.2,1);
}

.process__steps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-md);
  position: relative;
}

.process__step {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--space-xl) var(--space-md) var(--space-md);
  position: relative;
  overflow: hidden;
  transition: border-color var(--ease-base), transform var(--ease-base);
}
.process__step:hover {
  border-color: rgba(232,184,75,0.3);
  transform: translateY(-4px);
}

.process__step-num {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 0.05em;
  margin-bottom: var(--space-sm);
}

.process__step-ghost {
  position: absolute;
  top: -20px; right: -10px;
  font-family: var(--font-display);
  font-size: clamp(80px, 12vw, 120px);
  font-weight: 800;
  color: var(--text-primary);
  opacity: 0.05;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.process__step-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.process__step-desc {
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .process__steps { grid-template-columns: 1fr; gap: 0; }
  .process__line { display: none; }
  .process__step {
    border-radius: 0;
    border-left: 2px solid var(--gold);
    border-top: none;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding-left: var(--space-lg);
  }
  .process__step:first-child { border-radius: 12px 12px 0 0; }
  .process__step:last-child  { border-radius: 0 0 12px 12px; border-bottom: none; }
}
```

- [ ] **Step 3: Verify in browser**

5-step horizontal timeline. Ghost numbers. Vertical stacked on mobile with gold left border.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: process timeline section"
```

---

## Task 11: FAQ Section — HTML & CSS

**Files:**
- Modify: `index.html` (replace FAQ placeholder)
- Modify: `styles.css` (append)

- [ ] **Step 1: Add FAQ HTML**

```html
<section class="faq" id="faq">
  <div class="container">
    <div class="faq__header">
      <span class="label label--violet">Questions</span>
      <h2 class="faq__title">Everything You're<br>Wondering About.</h2>
    </div>
    <div class="faq__grid">

      <div class="faq__item reveal-up">
        <button class="faq__question" aria-expanded="false">
          What exactly is an AI agent and why do I need one?
          <span class="faq__icon" aria-hidden="true">+</span>
        </button>
        <div class="faq__answer" role="region">
          <p>An AI agent is software that takes actions on your behalf — answering emails, qualifying leads, scheduling meetings, pulling data — autonomously, 24/7. You need one because every hour you spend on repeatable tasks is an hour you can't spend growing. Agents don't sleep, forget, or get overwhelmed. They just work.</p>
        </div>
      </div>

      <div class="faq__item reveal-up" style="transition-delay:80ms">
        <button class="faq__question" aria-expanded="false">
          How is this different from ChatGPT?
          <span class="faq__icon" aria-hidden="true">+</span>
        </button>
        <div class="faq__answer" role="region">
          <p>ChatGPT answers questions. AI agents take action. We build agents wired into your actual tools — your inbox, your CRM, your calendar — so they work inside your business, not just respond in a chat window. The difference is passive vs. active. ChatGPT waits for you. Your agent doesn't.</p>
        </div>
      </div>

      <div class="faq__item reveal-up" style="transition-delay:160ms">
        <button class="faq__question" aria-expanded="false">
          What does a $1K&ndash;$5K engagement actually include?
          <span class="faq__icon" aria-hidden="true">+</span>
        </button>
        <div class="faq__answer" role="region">
          <p>Discovery, architecture, full installation, integration with your existing tools, custom configuration, testing, and onboarding. You're not buying a chatbot. You're buying a custom-built team member — scoped, installed, and running inside your business before the engagement ends.</p>
        </div>
      </div>

      <div class="faq__item reveal-up" style="transition-delay:240ms">
        <button class="faq__question" aria-expanded="false">
          How fast can you actually deliver?
          <span class="faq__icon" aria-hidden="true">+</span>
        </button>
        <div class="faq__answer" role="region">
          <p>Agent installations: 5&ndash;10 business days depending on complexity. Full product builds: 2 weeks. Both timelines are real — we've proven them across 7 live products in the wild. We don't pad timelines. We move.</p>
        </div>
      </div>

      <div class="faq__item reveal-up" style="transition-delay:320ms">
        <button class="faq__question" aria-expanded="false">
          Do I need to be technical to work with you?
          <span class="faq__icon" aria-hidden="true">+</span>
        </button>
        <div class="faq__answer" role="region">
          <p>No. You need to know your business. We handle everything technical. Our job is to translate what you need into something that works — you shouldn't have to understand how it works under the hood. If you can describe your pain, we can build the solution.</p>
        </div>
      </div>

      <div class="faq__item reveal-up" style="transition-delay:400ms">
        <button class="faq__question" aria-expanded="false">
          What if I want a full AI product built, not just an agent?
          <span class="faq__icon" aria-hidden="true">+</span>
        </button>
        <div class="faq__answer" role="region">
          <p>That's our Studio track. We build full AI products — web apps, consumer tools, B2B platforms — for fixed price or revenue share. Same team, same speed, bigger scope. Seven live products in the portfolio are proof of what that looks like.</p>
        </div>
      </div>

      <div class="faq__item reveal-up" style="transition-delay:480ms">
        <button class="faq__question" aria-expanded="false">
          How do I know this will actually work for my business?
          <span class="faq__icon" aria-hidden="true">+</span>
        </button>
        <div class="faq__answer" role="region">
          <p>You have 7 live products in the wild as proof of execution. Every one started as an idea on a call. We don't pitch concepts — we build things that work in the real world, across healthcare, fintech, music, and consumer tech. If we don't think we can deliver for your specific situation, we'll tell you on the discovery call.</p>
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Add FAQ CSS**

```css
/* ============================================
   FAQ
   ============================================ */

.faq { padding: var(--space-4xl) 0; }

.faq__header {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

.faq__title {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.faq__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
  max-width: 1000px;
  margin: 0 auto;
}

.faq__item {
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color var(--ease-base);
}

.faq__item.active {
  border-color: var(--violet);
  border-left: 3px solid var(--violet);
  background: rgba(139,92,246,0.06);
}

.faq__question {
  width: 100%;
  text-align: left;
  padding: var(--space-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: color var(--ease-fast);
}
.faq__question:hover { color: var(--violet-bright); }

.faq__icon {
  flex-shrink: 0;
  font-size: 20px;
  font-weight: 300;
  color: var(--text-muted);
  transition: transform 300ms ease, color var(--ease-fast);
  line-height: 1;
}
.faq__item.active .faq__icon {
  transform: rotate(45deg);
  color: var(--violet-bright);
}

.faq__answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 300ms ease;
}
.faq__answer p {
  padding: 0 var(--space-lg) var(--space-lg);
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.8;
}

.faq__item.active .faq__answer { max-height: 400px; }

@media (max-width: 768px) {
  .faq__grid { grid-template-columns: 1fr; }
  .faq__title { font-size: clamp(32px, 10vw, 52px); }
}
```

- [ ] **Step 3: Verify in browser**

7 FAQ items in 2-column grid. All closed by default. Mobile: single column. No overflow.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: FAQ section with accordion structure"
```

---

## Task 12: CTA Section + Footer — HTML & CSS

**Files:**
- Modify: `index.html` (replace CTA and FOOTER placeholders)
- Modify: `styles.css` (append)

- [ ] **Step 1: Add CTA HTML**

```html
<section class="cta" id="contact">
  <div class="cta__bg"></div>
  <div class="cta__noise"></div>
  <div class="cta__content container">
    <span class="label label--gold">Ready?</span>
    <h2 class="cta__title js-word-drop">
      Your Business Shouldn't Wait For You.
    </h2>
    <p class="cta__body">
      Every day without an AI agent is a day your competitors are pulling further ahead.
      This isn't hype. This is the new baseline.
    </p>
    <div class="cta__buttons">
      <a href="mailto:info@vibeworksstudio.ai" class="btn btn--gold btn--large">Build My AI Agent &#8594;</a>
      <a href="mailto:info@vibeworksstudio.ai" class="btn btn--ghost btn--large">Start a Product Project &#8594;</a>
    </div>
    <p class="cta__footnote">
      Or email us directly:
      <a href="mailto:info@vibeworksstudio.ai">info@vibeworksstudio.ai</a>
      &middot; Free 20-minute discovery call. Zero obligation.
    </p>
    <blockquote class="cta__quote">
      &#8220;The best time to automate your business was last year. The second best time is today.&#8221;
    </blockquote>
  </div>
</section>
```

- [ ] **Step 2: Add footer HTML**

```html
<footer class="footer">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        <div class="footer__logo">VibeWorks AI Studio</div>
        <p class="footer__tagline">Agents &middot; Products &middot; Studio</p>
      </div>
      <div class="footer__cols">
        <div class="footer__col">
          <h4 class="footer__col-title">Services</h4>
          <a href="#services">AI Agent Builds</a>
          <a href="#services">Product Studio</a>
          <a href="#services">Partnership Track</a>
          <a href="#services">Dev Services</a>
        </div>
        <div class="footer__col">
          <h4 class="footer__col-title">Portfolio</h4>
          <a href="https://ratemylooks.pages.dev/" target="_blank" rel="noopener">RateMyLooksAI</a>
          <a href="https://sketchmysoulmate.com" target="_blank" rel="noopener">SketchMySoulmate</a>
          <a href="https://songgram.com" target="_blank" rel="noopener">SongGram</a>
          <a href="https://aibookpublisher.com" target="_blank" rel="noopener">AI Book Publisher</a>
          <a href="https://md-diagnose-app.ivanleejackson.workers.dev/" target="_blank" rel="noopener">MD Diagnose</a>
          <a href="https://aicharttraders.com" target="_blank" rel="noopener">AI Chart Traders</a>
          <a href="https://richpeoplestocks.com/" target="_blank" rel="noopener">Rich People Stocks</a>
        </div>
        <div class="footer__col">
          <h4 class="footer__col-title">Company</h4>
          <a href="#team">Team</a>
          <a href="#services">Partner</a>
        </div>
        <div class="footer__col">
          <h4 class="footer__col-title">Connect</h4>
          <a href="mailto:info@vibeworksstudio.ai">info@vibeworksstudio.ai</a>
          <a href="mailto:info@vibeworksstudio.ai">Book a Call</a>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <p>&#169; 2026 VibeWorks Studio &middot; vibeworksstudio.ai</p>
      <p class="footer__made">Built with AI. Delivered by humans.</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Add CTA + footer CSS**

```css
/* ============================================
   CTA SECTION
   ============================================ */

.cta {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding: var(--space-4xl) 0;
}

.cta__bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 100% 80% at 50% 50%,
    rgba(139,92,246,0.2) 0%,
    var(--base) 70%);
  animation: ctaBgPulse 8s ease-in-out infinite alternate;
}

@keyframes ctaBgPulse {
  0%   { opacity: 0.7; transform: scale(1); }
  100% { opacity: 1;   transform: scale(1.05); }
}

.cta__noise {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.cta__content { position: relative; z-index: 1; max-width: 800px; }

.cta__title {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: var(--space-xl);
}

.cta__title .word {
  display: inline-block;
  opacity: 0;
  transform: translateY(-30px);
  transition: opacity 500ms ease-out, transform 500ms ease-out;
}
.cta__title .word.visible {
  opacity: 1;
  transform: translateY(0);
}

.cta__body {
  font-size: var(--text-subhead);
  color: var(--text-muted);
  max-width: 560px;
  margin: 0 auto var(--space-xl);
  line-height: 1.7;
}

.cta__buttons {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-lg);
}

.cta__footnote {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-xl);
}
.cta__footnote a {
  color: var(--violet-bright);
  border-bottom: 1px solid transparent;
  transition: border-color var(--ease-fast);
}
.cta__footnote a:hover { border-color: var(--violet-bright); }

.cta__quote {
  font-style: italic;
  font-size: var(--text-sm);
  color: var(--gold);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .cta__title { font-size: clamp(32px, 10vw, 52px); }
  .cta__buttons { flex-direction: column; align-items: center; }
  .cta__buttons .btn { width: 100%; max-width: 320px; justify-content: center; }
}

/* ============================================
   FOOTER
   ============================================ */

.footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: var(--space-4xl) 0 var(--space-xl);
}

.footer__top {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--space-4xl);
  margin-bottom: var(--space-3xl);
}

.footer__logo {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  margin-bottom: var(--space-xs);
}

.footer__tagline {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.footer__cols {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-xl);
}

.footer__col-title {
  font-size: var(--text-sm);
  font-weight: 700;
  margin-bottom: var(--space-md);
}

.footer__col a {
  display: block;
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: 10px;
  transition: color var(--ease-fast);
}
.footer__col a:hover { color: var(--text-primary); }

.footer__bottom {
  border-top: 1px solid var(--border);
  padding-top: var(--space-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.footer__made { color: var(--text-subtle); }

@media (max-width: 900px) {
  .footer__top { grid-template-columns: 1fr; gap: var(--space-xl); }
  .footer__cols { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .footer__cols { grid-template-columns: 1fr; }
  .footer__bottom { flex-direction: column; gap: var(--space-sm); text-align: center; }
}
```

- [ ] **Step 4: Verify in browser**

CTA full-viewport with gradient. Two CTA buttons. Footer 4-column grid collapses correctly on mobile. Gold quote visible.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "feat: CTA section and footer"
```

---

## Task 13: JavaScript — Navigation + Scroll Effects

**Files:**
- Rewrite: `script.js`

- [ ] **Step 1: Write the JS foundation**

Replace entire `script.js` with:

```js
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

// ── Scroll Progress ─────────────────────────

const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
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
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
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
```

- [ ] **Step 2: Verify in browser**

Scroll progress bar fills. Nav gets frosted glass after 80px. Hamburger toggles menu.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: JS nav scroll, mobile menu, smooth scroll"
```

---

## Task 14: JavaScript — Particle Field Canvas

**Files:**
- Modify: `script.js` (append)

- [ ] **Step 1: Append particle field code to script.js**

```js
// ── Particle Field (Hero Canvas) ───────────

(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    // Foreground: 50 particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 1.5,
        alpha: 0.6
      });
    }
    // Background: 30 particles — slower, dimmer
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 1,
        alpha: 0.3
      });
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / 150) * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
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
```

- [ ] **Step 2: Verify in browser**

Hero canvas shows animated violet particle network. Foreground particles faster/brighter, background slower/dimmer.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: hero particle field canvas"
```

---

## Task 15: JavaScript — Wireframe Sphere Canvas

**Files:**
- Modify: `script.js` (append)

- [ ] **Step 1: Append sphere code**

```js
// ── Wireframe Sphere (Shift Section) ───────

(function initSphere() {
  const canvas = document.getElementById('sphereCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COUNT   = 120;
  const RADIUS  = canvas.offsetWidth < 300 ? 120 : 180;
  const THRESH  = 60; // line draw threshold

  let rotY            = 0;
  let scale           = 1;
  let assembled       = false;
  let assembleStart   = null;
  let lastPulseTime   = 0;
  let isPulsing       = false;
  let pulseProgress   = 0;

  // Fibonacci lattice sphere points
  const target = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = golden * i;
    target.push({ x: Math.cos(t) * r * RADIUS, y: y * RADIUS, z: Math.sin(t) * r * RADIUS });
  }

  // Random scatter start
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

    // Assembly
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

    // Pulse
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

    // Project
    const pts = current.map(p => {
      const r = rotateY(p.x, p.z, rotY);
      return { ...project(r.x, p.y, r.z) };
    });

    // Lines
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx  = current[i].x - current[j].x;
        const dy  = current[i].y - current[j].y;
        const dz  = current[i].z - current[j].z;
        const d3  = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d3 < THRESH) {
          ctx.beginPath();
          ctx.moveTo(pts[i].sx, pts[i].sy);
          ctx.lineTo(pts[j].sx, pts[j].sy);
          ctx.strokeStyle = `rgba(232,184,75,${(1 - d3 / THRESH) * 0.4 * prog})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Points
    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, 2 * p.d, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${0.7 * prog * p.d})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  // Start only when section enters viewport
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
```

- [ ] **Step 2: Verify in browser**

Scroll to Shift section. Sphere assembles over ~1.2s. Rotates slowly. Pulses after 3s. Gold wireframe, violet-bright points.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: wireframe sphere canvas with assembly and pulse"
```

---

## Task 16: JavaScript — IntersectionObserver Reveal Animations

**Files:**
- Modify: `script.js` (append)

- [ ] **Step 1: Append reveal animation observers**

```js
// ── Scroll Reveal Animations ────────────────

(function initReveal() {
  const baseOpts = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

  // Generic reveal
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, baseOpts);

  // Collect all reveal elements
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  // Service cards
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        cardObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.service-card').forEach(el => cardObs.observe(el));

  // Venture name gold underline
  const nameObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        nameObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.venture__name').forEach(el => nameObs.observe(el));

  // Process timeline line draw
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

  // Team grid — bilateral simultaneous reveal
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

  // Observe everything else (excluding team-managed els)
  revealEls.forEach(el => {
    if (!teamEls.has(el)) revealObs.observe(el);
  });
})();
```

- [ ] **Step 2: Verify in browser**

Scroll entire page. Service cards fade up. Portfolio items slide in from alternating sides. Venture names get gold underline. Process gold line draws. Founder cards enter from opposite sides simultaneously.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: IntersectionObserver scroll reveal animations"
```

---

## Task 17: JavaScript — Word Reveals + Stat Counters

**Files:**
- Modify: `script.js` (append)

> **Security note:** Word reveal uses `document.createElement` + `textContent` — not `innerHTML` — to build spans safely from existing DOM text.

- [ ] **Step 1: Append word reveal + counter code**

```js
// ── Word-by-Word Reveal ─────────────────────

function buildWordSpans(el, delayMs) {
  // Read text safely via textContent, build spans via DOM (no innerHTML)
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
  // Pain headline — words rise up
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

  // CTA headline — words drop down
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
```

- [ ] **Step 2: Verify in browser**

1. Pain section: "You're talented..." words rise up one at a time on scroll-enter
2. CTA section: "Your Business Shouldn't Wait For You." words drop down with 120ms stagger
3. Hero stats: `7` and `500` count up; `$1K–$5K` and `2 Weeks` fade in as static text

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: word reveal animations and stat counters"
```

---

## Task 18: JavaScript — FAQ Accordion

**Files:**
- Modify: `script.js` (append)

- [ ] **Step 1: Append FAQ code**

```js
// ── FAQ Accordion ───────────────────────────

(function initFAQ() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq__question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all
      items.forEach(i => {
        i.classList.remove('active');
        const q = i.querySelector('.faq__question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
```

- [ ] **Step 2: Verify in browser**

Click FAQ items. Expand/collapse with max-height transition. Icon rotates to ×. Violet left border. One open at a time.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: FAQ accordion single-open behavior"
```

---

## Task 19: Manifest + Global Polish

**Files:**
- Modify: `manifest.json`
- Modify: `styles.css` (minor polish append)

- [ ] **Step 1: Update manifest.json**

```json
{
  "name": "VibeWorks AI Studio",
  "short_name": "VibeWorks",
  "description": "Custom AI agents and AI products built for entrepreneurs and small teams.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#07070E",
  "theme_color": "#8B5CF6",
  "icons": [
    { "src": "images/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "images/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 2: Append global polish to styles.css**

```css
/* ============================================
   GLOBAL POLISH
   ============================================ */

section + section { border-top: 1px solid var(--border); }

:focus-visible {
  outline: 2px solid var(--violet);
  outline-offset: 3px;
  border-radius: 4px;
}

::selection {
  background: rgba(139,92,246,0.3);
  color: var(--text-primary);
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--base); }
::-webkit-scrollbar-thumb { background: var(--surface-2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--violet); }
```

- [ ] **Step 3: Full QA checklist — verify at 375px, 768px, 1440px**

- [ ] No horizontal scroll on any viewport
- [ ] All 7 portfolio images load
- [ ] All "Visit →" links open correct URLs
- [ ] All "Build My Agent" / "Start a Project" CTAs open mail client
- [ ] Nav frosted glass on scroll
- [ ] Particle field visible on hero canvas
- [ ] Sphere assembles on Shift section scroll-enter
- [ ] Pain section word reveal fires on scroll
- [ ] CTA word drop fires on scroll
- [ ] Stat counters animate on hero scroll-enter
- [ ] FAQ accordion opens/closes correctly
- [ ] Process gold line draws left-to-right (desktop)
- [ ] Process vertical border shows (mobile)
- [ ] Venture gold underlines animate on scroll
- [ ] Founder cards enter bilaterally
- [ ] Footer links work
- [ ] No console errors
- [ ] Page title correct in browser tab
- [ ] Meta description correct

- [ ] **Step 4: Commit**

```bash
git add styles.css manifest.json
git commit -m "feat: manifest update and global CSS polish"
```

---

## Task 20: Deploy to GitHub Pages

- [ ] **Step 1: Push to remote**

```bash
cd /Users/ivanjackson/Desktop/vibeworkscursor
git push origin main
```

- [ ] **Step 2: Verify live at https://vibeworksstudio.ai**

Wait 1–2 minutes for GitHub Pages to deploy. Open live URL in incognito and re-run QA checklist from Task 19 Step 3.

- [ ] **Step 3: Done**

```
vibeworksstudio.ai is live with the new design.
```

---

## Implementation Order

Tasks 1–12 are pure HTML + CSS — the page is in a presentable state at every commit. JS is layered on top in Tasks 13–18.

| Tasks | Focus |
|---|---|
| 1–2 | Foundation — tokens, HTML shell |
| 3–12 | HTML + CSS per section |
| 13–18 | JavaScript interactions |
| 19–20 | Polish + deploy |
