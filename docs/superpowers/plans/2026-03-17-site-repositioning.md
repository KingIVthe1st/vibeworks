# VibeWorks AI Studio — Site Repositioning Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform vibeworksstudio.ai from a single-page "custom AI agents" site into a five-page AI venture studio site with three engagement tracks.

**Architecture:** Pure HTML/CSS/JS static site on GitHub Pages. All five pages share `styles.css` and `script.js`. New CSS components are appended to the existing stylesheet. New JS is appended to the existing script, all functions gated by element existence. No build tools, no frameworks.

**Tech Stack:** HTML5, CSS3, Vanilla JS (ES6), Formspree (contact forms), Google Fonts (Bricolage Grotesque + Plus Jakarta Sans), GitHub Pages

---

## File Map

| Action | File | What changes |
|---|---|---|
| Modify | `index.html` | Full rewrite — new nav, hero copy, 5 new sections, new footer |
| Create | `ventures.html` | New page — 5 sections |
| Create | `services.html` | New page — 5 sections |
| Create | `about.html` | New page — 5 sections |
| Create | `contact.html` | New page — forms, track selector |
| Modify | `styles.css` | Append ~350 lines of new component CSS |
| Modify | `script.js` | Append ~80 lines of new JS |
| Modify | `manifest.json` | Add `scope: "/"` |

**Reference paths:**
- Portfolio images: `images/Portfoliosites/` (ratemylooks.png, sketchmysoulmate.png, songgram.png, aibookpublisher.png, mddiagnose.png, aicharttraders.png, richpplstocks.png, corecreatorsai.png, optimizeaitoolsuite.png, ivan.jpg, natasha.jpeg)
- Spec: `docs/superpowers/specs/2026-03-17-vibeworks-repositioning-design.md`

---

## Task 1: New CSS Components

**Files:**
- Modify: `styles.css` (append to end)

- [ ] **Step 1: Start local server to test visuals**

```bash
cd /Users/ivanjackson/Desktop/vibeworkscursor
python3 -m http.server 8080
```

Leave running. Open http://localhost:8080 in browser to verify existing site still works.

- [ ] **Step 2: Append new CSS to styles.css**

Open `styles.css` and append the following block at the very end:

```css
/* ============================================
   NEW COMPONENTS — REPOSITIONING
   ============================================ */

/* ── Active Nav State ────────────────────── */
.nav__link.active {
  color: var(--text-primary);
  border-bottom: 1px solid var(--gold);
}
.nav__cta.active {
  background: var(--gold);
  color: var(--base);
}

/* ── Page Hero (inner pages) ─────────────── */
.page-hero {
  padding: calc(var(--space-4xl) * 0.6) 0 var(--space-2xl);
  position: relative;
  overflow: hidden;
}
.page-hero .container {
  position: relative;
  z-index: 1;
}
.page-hero__label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: var(--space-sm);
}
.page-hero__headline {
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
  max-width: 800px;
  margin-bottom: var(--space-md);
}
.page-hero__subline {
  font-family: var(--font-body);
  font-size: var(--text-subhead);
  color: var(--text-muted);
  max-width: 640px;
  line-height: 1.6;
}

/* ── Venture Preview (home featured cards) ── */
.venture-preview {
  padding: var(--space-2xl) 0;
}
.venture-preview__header {
  text-align: center;
  margin-bottom: var(--space-xl);
}
.venture-preview__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}
.venture-preview-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
.venture-preview-card__img-wrap {
  aspect-ratio: 16/10;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 4px;
}
.venture-preview-card__img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.venture-preview-card:hover .venture-preview-card__img-wrap img {
  transform: scale(1.03);
}
.venture-preview-card:hover .venture-preview-card__img-wrap {
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.venture-preview-card__category {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
}
.venture-preview-card__name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}
.venture-preview-card__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.5;
}
.venture-preview__footer {
  text-align: center;
  margin-top: var(--space-xl);
}
.venture-preview__footer a {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--violet-bright);
  transition: color var(--ease-fast);
}
.venture-preview__footer a:hover { color: var(--gold); }

/* ── How Panels (home track intro) ──────── */
.how-panels {
  padding: var(--space-2xl) 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.how-panels__header {
  text-align: center;
  margin-bottom: var(--space-xl);
}
.how-panels__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}
.how-panel {
  padding: var(--space-lg) var(--space-xl);
  border-right: 1px solid var(--border);
}
.how-panel:last-child { border-right: none; }
.how-panel__icon {
  width: 32px;
  height: 32px;
  margin-bottom: var(--space-md);
}
.how-panel__label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}
.how-panel__title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}
.how-panel__body {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}
.how-panel__link {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--violet-bright);
  transition: color var(--ease-fast);
}
.how-panel__link:hover { color: var(--gold); }

/* ── Team Teaser (home) ──────────────────── */
.team-teaser {
  padding: var(--space-2xl) 0;
  text-align: center;
}
.team-teaser__header { margin-bottom: var(--space-xl); }
.team-teaser__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xl);
  max-width: 760px;
  margin: 0 auto;
}
.team-teaser__person { display: flex; flex-direction: column; align-items: center; gap: var(--space-sm); }
.team-teaser__photo {
  width: 100%;
  max-width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
}
.team-teaser__name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}
.team-teaser__role {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.5;
}
.team-teaser__footer { margin-top: var(--space-lg); }

/* ── Footer CTA Band ─────────────────────── */
.footer-cta {
  padding: var(--space-2xl) 0;
  text-align: center;
  border-top: 1px solid var(--border);
}
.footer-cta__headline {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  color: var(--text-primary);
  max-width: 640px;
  margin: 0 auto var(--space-lg);
  line-height: 1.2;
}

/* ── Simplified Footer ───────────────────── */
.site-footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: var(--space-2xl) 0 var(--space-lg);
}
.site-footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
}
.site-footer__brand-name {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.site-footer__tagline {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}
.site-footer__email {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--violet-bright);
  transition: color var(--ease-fast);
}
.site-footer__email:hover { color: var(--gold); }
.site-footer__col-title {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-subtle);
  margin-bottom: var(--space-md);
}
.site-footer__links { display: flex; flex-direction: column; gap: 10px; }
.site-footer__links a {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
  transition: color var(--ease-fast);
}
.site-footer__links a:hover { color: var(--text-primary); }
.site-footer__bar {
  border-top: 1px solid var(--border);
  padding-top: var(--space-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-subtle);
}

/* ── Venture Featured (ventures page) ───── */
.venture-featured {
  margin-bottom: var(--space-2xl);
}
.venture-featured__img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 21/9;
  border-radius: 16px;
  overflow: hidden;
}
.venture-featured__img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.venture-featured__overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: var(--space-xl);
  background: linear-gradient(to top, rgba(7,7,14,0.97) 0%, rgba(7,7,14,0.6) 60%, transparent 100%);
}
.venture-featured__live-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--green-pulse);
  margin-bottom: var(--space-sm);
}
.venture-featured__live-badge::before {
  content: '';
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--green-pulse);
  animation: pulse 2s ease infinite;
}
.venture-featured__category {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: var(--space-xs);
}
.venture-featured__name {
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 52px);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  line-height: 1.1;
}
.venture-featured__tagline {
  font-family: var(--font-body);
  font-size: var(--text-subhead);
  color: var(--text-muted);
  margin-bottom: var(--space-md);
}
.venture-featured__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
  max-width: 640px;
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

/* ── Venture Row (ventures grid) ────────── */
.venture-rows { padding: var(--space-xl) 0; }
.venture-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4xl);
  max-width: 1200px;
  margin: 0 auto var(--space-4xl);
  align-items: center;
}
.venture-row:nth-child(even) { direction: rtl; }
.venture-row:nth-child(even) > * { direction: ltr; }
.venture-row__image {
  position: relative;
  aspect-ratio: 16/10;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.venture-row__image:hover {
  transform: scale(1.02);
  box-shadow: 0 32px 80px rgba(139,92,246,0.2);
}
.venture-row__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.venture-row__live-badge {
  position: absolute;
  top: 12px; left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(7,7,14,0.85);
  border: 1px solid rgba(16,185,129,0.3);
  border-radius: 20px;
  padding: 4px 10px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  color: var(--green-pulse);
}
.venture-row__live-badge::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--green-pulse);
  animation: pulse 2s ease infinite;
}
.venture-row__info { padding: var(--space-md) 0; }
.venture-row__category {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: var(--space-sm);
}
.venture__name {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: var(--space-xs);
  display: inline-block;
  border-bottom: 2px solid transparent;
  transition: border-color 0.3s ease;
}
.venture-row:hover .venture__name { border-color: var(--gold); }
.venture-row__tagline {
  font-family: var(--font-body);
  font-style: italic;
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-md);
}
.venture-row__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-lg);
}

/* ── The Pattern (ventures interstitial) ─ */
.venture-pattern {
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-4xl) 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.venture-pattern__headline {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}
.venture-pattern__copy {
  font-family: var(--font-body);
  font-size: var(--text-subhead);
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
}
.venture-pattern__stats {
  display: flex;
  justify-content: center;
  gap: var(--space-xl);
}
.venture-pattern__stat {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.venture-pattern__stat strong {
  display: block;
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 4px;
}

/* ── Track Nav (services page) ──────────── */
.track-nav {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-top: var(--space-lg);
}
.track-nav__pill {
  display: inline-block;
  padding: 10px 20px;
  border: 1px solid var(--border);
  border-radius: 24px;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-muted);
  transition: all var(--ease-fast);
}
.track-nav__pill:hover {
  border-color: var(--violet);
  color: var(--text-primary);
  background: var(--violet-glow);
}

/* ── Track Section (services page) ──────── */
.track-section {
  padding: var(--space-2xl) 0;
  border-top: 1px solid var(--border);
}
.track-section__label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}
.track-section__headline {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 56px);
  font-weight: 800;
  color: var(--text-primary);
  max-width: 700px;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}
.track-section__copy {
  font-family: var(--font-body);
  font-size: var(--text-subhead);
  color: var(--text-muted);
  max-width: 580px;
  line-height: 1.65;
  margin-bottom: var(--space-xl);
}
.track-section__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  align-items: start;
  margin-bottom: var(--space-xl);
}
.track-section__list-title {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-subtle);
  margin-bottom: var(--space-md);
}
.track-section__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.track-section__list li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.5;
}
.track-section__list li::before {
  content: '—';
  color: var(--gold);
  flex-shrink: 0;
  margin-top: 1px;
}
.track-section__pricing {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}
.track-section__price-row {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: var(--space-md);
}
.track-section__price-row strong {
  display: block;
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.track-section__price-row span {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-muted);
}
.track-section__note {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-subtle);
  font-style: italic;
  margin-bottom: var(--space-xl);
}

/* ── Proof Strip (services) ─────────────── */
.proof-strip {
  padding: var(--space-2xl) 0;
  border-top: 1px solid var(--border);
  background: var(--surface);
}
.proof-strip__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
}
.proof-strip__item { text-align: center; }
.proof-strip__stat {
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  color: var(--gold);
  line-height: 1;
  margin-bottom: var(--space-sm);
}
.proof-strip__copy {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 280px;
  margin: 0 auto;
}

/* ── About Thesis ────────────────────────── */
.about-thesis {
  padding: var(--space-2xl) 0;
  max-width: 720px;
  margin: 0 auto;
}
.about-thesis p {
  font-family: var(--font-body);
  font-size: var(--text-subhead);
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-lg);
}
.about-thesis p:first-child {
  font-family: var(--font-display);
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 600;
  color: var(--text-primary);
}

/* ── Track Selector (contact) ───────────── */
.track-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}
.track-card {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: var(--space-lg);
  text-align: center;
  cursor: pointer;
  transition: all var(--ease-base);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}
.track-card:hover {
  border-color: var(--violet);
  background: var(--violet-glow);
}
.track-card.selected {
  border-color: var(--gold);
  background: var(--gold-glow);
}
.track-card__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.track-card__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}
.track-card__sub {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.4;
}

/* ── Contact Form ────────────────────────── */
.contact-form { display: none; }
.contact-form.visible {
  display: block;
  animation: fadeInUp 0.4s ease;
}
.contact-form form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: var(--space-xl);
  max-width: 640px;
  margin: 0 auto;
}
.form-group {
  margin-bottom: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}
.form-group input,
.form-group textarea,
.form-group select {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  width: 100%;
  transition: border-color var(--ease-fast);
  appearance: none;
}
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--violet);
}
.form-group textarea { resize: vertical; min-height: 120px; }
.form-group select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239CA3AF' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
.form-radio-group {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}
.form-radio-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.form-radio-group input[type="radio"] { width: 16px; height: 16px; accent-color: var(--violet); }
.form-submit { width: 100%; margin-top: var(--space-sm); }

/* ── Success Banner (contact) ────────────── */
.contact-success {
  display: none;
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(16,185,129,0.3);
  border-radius: 10px;
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-xl);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--green-pulse);
  text-align: center;
}
.contact-success.visible { display: block; animation: fadeInUp 0.4s ease; }

/* ── Direct Contact block ────────────────── */
.contact-direct {
  text-align: center;
  padding: var(--space-xl) 0 var(--space-2xl);
  border-top: 1px solid var(--border);
}
.contact-direct p {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: 6px;
}
.contact-direct a {
  color: var(--violet-bright);
  transition: color var(--ease-fast);
}
.contact-direct a:hover { color: var(--gold); }

/* ── Mobile Responsive ───────────────────── */
@media (max-width: 768px) {
  .venture-preview__grid,
  .how-panels__grid,
  .team-teaser__grid,
  .site-footer__grid,
  .proof-strip__grid,
  .track-selector,
  .track-section__body,
  .track-section__pricing,
  .venture-row {
    grid-template-columns: 1fr;
  }
  .venture-row { gap: var(--space-lg); direction: ltr; }
  .venture-row:nth-child(even) { direction: ltr; }
  .how-panel { border-right: none; border-bottom: 1px solid var(--border); padding: var(--space-lg) var(--space-md); }
  .how-panel:last-child { border-bottom: none; }
  .venture-featured__img-wrap { aspect-ratio: 16/9; }
  .venture-featured__name { font-size: 32px; }
  .venture-pattern__stats { flex-direction: column; gap: var(--space-md); }
  .site-footer__bar { flex-direction: column; gap: var(--space-sm); text-align: center; }
}
@media (max-width: 600px) {
  .track-nav { gap: 8px; }
  .track-nav__pill { font-size: 13px; padding: 8px 14px; }
}

/* ── Section Headline (shared utility) ──── */
/* NOTE: does not exist in styles.css — must add here */
.section-headline {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-top: var(--space-sm);
}

/* ── Violet Button (missing from styles.css) ─ */
.btn--violet {
  background: var(--violet);
  color: var(--text-primary);
  border: 2px solid var(--violet);
}
.btn--violet:hover {
  background: var(--violet-bright);
  border-color: var(--violet-bright);
}

/* ── Founder Reverse (missing from styles.css) ─ */
.founder--reverse { direction: rtl; }
.founder--reverse > * { direction: ltr; }
@media (max-width: 768px) {
  .founder--reverse { direction: ltr; }
}

/* ── Founder Title (new, for role line) ─── */
.founder__title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--violet-bright);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-sm);
}
```

- [ ] **Step 3: Verify no CSS syntax errors**

In browser at http://localhost:8080, reload the page. Open DevTools console. Confirm: no CSS errors. The existing site should look unchanged at this point (new classes aren't used yet).

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "style: add new component CSS for site repositioning"
```

---

## Task 2: New Shared JavaScript

**Files:**
- Modify: `script.js` (append to end)

- [ ] **Step 1: Append new JS to script.js**

Open `script.js` and append the following block at the very end:

```js
// ── Active Nav State ─────────────────────────

(function initActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
    const href = link.getAttribute('href') || '';
    // Home: exact match on / or index.html
    if (href === '/' || href === '/index.html') {
      if (path === '/' || path === '/index.html' || path === '') {
        link.classList.add('active');
      }
    } else if (href !== '#' && href.length > 1) {
      const clean = href.replace('.html', '');
      if (path.includes(clean)) {
        link.classList.add('active');
      }
    }
  });
})();

// ── Contact Page: Track Selector + Form Reveal ──

(function initContactPage() {
  const cards = document.querySelectorAll('.track-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      document.querySelectorAll('.contact-form').forEach(f => f.classList.remove('visible'));
      card.classList.add('selected');
      const form = document.querySelector('[data-form="' + card.dataset.track + '"]');
      if (form) form.classList.add('visible');
    });
  });

  // Auto-select track from URL param (?track=partner|build|portfolio)
  const params = new URLSearchParams(window.location.search);
  const track = params.get('track');
  if (track) {
    const btn = document.querySelector('[data-track="' + track + '"]');
    if (btn) btn.click();
  }

  // Success banner (?sent=true after Formspree redirect)
  if (params.get('sent') === 'true') {
    const banner = document.querySelector('.contact-success');
    if (banner) {
      banner.classList.add('visible');
      // Clean URL without reloading
      const cleanUrl = window.location.pathname;
      history.replaceState(null, '', cleanUrl);
    }
  }
})();
```

- [ ] **Step 2: Verify JS loads cleanly**

Reload http://localhost:8080. Open DevTools console. Confirm: no JS errors.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: add active nav + contact page JS"
```

---

## Task 3: Rewrite index.html (Home Page)

**Files:**
- Modify: `index.html` (full replacement)

**Reference:** Spec §Home Page, §Navigation, §Footer

- [ ] **Step 1: Replace index.html with the new home page**

Replace the entire contents of `index.html` with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VibeWorks AI Studio — AI Venture Studio</title>
  <meta name="description" content="VibeWorks is an AI venture studio. We build and launch our own AI products, partner with founders, and build custom AI for businesses. Nine live products.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://vibeworksstudio.ai/">
  <meta property="og:title" content="VibeWorks AI Studio — AI Venture Studio">
  <meta property="og:description" content="VibeWorks is an AI venture studio. We build and launch our own AI products, partner with founders, and build custom AI for businesses. Nine live products.">
  <meta property="og:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="VibeWorks AI Studio — AI Venture Studio">
  <meta name="twitter:description" content="VibeWorks is an AI venture studio. Nine live products and counting.">
  <meta name="twitter:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="theme-color" content="#8B5CF6">
  <link rel="canonical" href="https://vibeworksstudio.ai/">
  <link rel="manifest" href="manifest.json">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- ── Page Loader (home only) ──────────── -->
  <div class="loader" id="loader" aria-hidden="true">
    <div class="loader__inner">
      <svg class="loader__monogram" viewBox="0 0 104 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline class="loader__path loader__path--v" points="2,4 16,56 30,4" stroke="#8B5CF6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline class="loader__path loader__path--w" points="42,4 54,48 63,22 72,48 84,4" stroke="#E8B84B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="loader__tagline">VibeWorks AI Studio</p>
    </div>
  </div>

  <!-- ── Custom Cursor ────────────────────── -->
  <div class="cursor-dot" id="cursorDot" aria-hidden="true"></div>
  <div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>

  <!-- ── Scroll Progress ──────────────────── -->
  <div class="scroll-progress" id="scrollProgress"></div>

  <!-- ── Navigation ───────────────────────── -->
  <nav class="nav" id="nav">
    <div class="nav__inner">
      <a href="/" class="nav__logo">VibeWorks</a>
      <div class="nav__links" id="navLinks">
        <a href="/ventures.html" class="nav__link">Ventures</a>
        <a href="/services.html" class="nav__link">Services</a>
        <a href="/about.html"    class="nav__link">About</a>
        <a href="/contact.html"  class="nav__cta">Contact</a>
      </div>
      <button class="nav__hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- ── Hero ─────────────────────────────── -->
  <section class="hero" id="hero">
    <div class="hero__aurora" aria-hidden="true">
      <div class="aurora-orb aurora-orb--1"></div>
      <div class="aurora-orb aurora-orb--2"></div>
      <div class="aurora-orb aurora-orb--3"></div>
    </div>
    <canvas class="hero__canvas" id="heroCanvas"></canvas>

    <div class="hero__content container">
      <div class="hero__availability">
        <span class="hero__avail-dot" aria-hidden="true"></span>
        <span>2 client spots open &middot; Q2 2026</span>
      </div>

      <h1 class="hero__title">
        We Build<br>
        <span class="hero__title--accent">AI Products.</span>
      </h1>

      <p class="hero__subtitle">
        VibeWorks is an AI venture studio. We launch our own products, partner with founders,
        and build custom AI for businesses. Nine live products and counting.
      </p>

      <div class="hero__ctas">
        <a href="/ventures.html" class="btn btn--ghost btn--large">See Our Ventures →</a>
        <a href="/services.html#partner" class="btn btn--gold btn--large btn--magnetic">Partner With Us →</a>
        <a href="/services.html#build"   class="btn btn--violet btn--large btn--magnetic">Build Something →</a>
      </div>

      <div class="hero__stats">
        <div class="stat">
          <div class="stat__number" data-count="9">0</div>
          <div class="stat__label">Products Launched</div>
        </div>
        <div class="stat">
          <div class="stat__number stat__number--static">2 Wks</div>
          <div class="stat__label">Avg Delivery</div>
        </div>
        <div class="stat">
          <div class="stat__number stat__number--static">500K+</div>
          <div class="stat__label">Distribution Reach</div>
        </div>
        <div class="stat">
          <div class="stat__number" data-count="5">0</div>
          <div class="stat__label">Verticals</div>
        </div>
      </div>

      <!-- Marquee ticker -->
      <div class="marquee" aria-hidden="true">
        <div class="marquee__track">
          <span>AI Venture Studio</span><span class="marquee__sep">&#10022;</span>
          <span>9 Live Products</span><span class="marquee__sep">&#10022;</span>
          <span>2-Week Delivery</span><span class="marquee__sep">&#10022;</span>
          <span>500K+ Reach</span><span class="marquee__sep">&#10022;</span>
          <span>Claude-Powered</span><span class="marquee__sep">&#10022;</span>
          <span>Zero Fluff. Real Results.</span><span class="marquee__sep">&#10022;</span>
          <!-- Duplicate for seamless loop -->
          <span>AI Venture Studio</span><span class="marquee__sep">&#10022;</span>
          <span>9 Live Products</span><span class="marquee__sep">&#10022;</span>
          <span>2-Week Delivery</span><span class="marquee__sep">&#10022;</span>
          <span>500K+ Reach</span><span class="marquee__sep">&#10022;</span>
          <span>Claude-Powered</span><span class="marquee__sep">&#10022;</span>
          <span>Zero Fluff. Real Results.</span><span class="marquee__sep">&#10022;</span>
        </div>
      </div>
    </div>

    <div class="hero__scroll-indicator">
      <span>Scroll</span>
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
        <path d="M8 4v16M8 20l-5-5M8 20l5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
  </section>

  <!-- ── Featured Ventures ─────────────────── -->
  <section class="venture-preview container" id="ventures-preview">
    <div class="venture-preview__header reveal-up">
      <span class="label label--gold">From The Portfolio</span>
      <h2 class="section-headline">What We've Built</h2>
    </div>

    <div class="venture-preview__grid">
      <a href="https://ratemylooks.pages.dev/" target="_blank" rel="noopener" class="venture-preview-card reveal-up">
        <div class="venture-preview-card__img-wrap">
          <img src="images/Portfoliosites/ratemylooks.png" alt="RateMyLooksAI screenshot" loading="lazy">
        </div>
        <span class="venture-preview-card__category">Consumer AI</span>
        <span class="venture-preview-card__name">RateMyLooksAI</span>
        <span class="venture-preview-card__desc">Your Beauty Score, Decided by AI</span>
        <span class="btn btn--ghost" style="width:fit-content;margin-top:4px;font-size:13px;padding:8px 16px;">Live →</span>
      </a>

      <a href="https://songgram.com" target="_blank" rel="noopener" class="venture-preview-card reveal-up" style="transition-delay:80ms">
        <div class="venture-preview-card__img-wrap">
          <img src="images/Portfoliosites/songgram.png" alt="SongGram screenshot" loading="lazy">
        </div>
        <span class="venture-preview-card__category">Music AI</span>
        <span class="venture-preview-card__name">SongGram</span>
        <span class="venture-preview-card__desc">Who Are You Through Music?</span>
        <span class="btn btn--ghost" style="width:fit-content;margin-top:4px;font-size:13px;padding:8px 16px;">Live →</span>
      </a>

      <a href="https://aicharttraders.com" target="_blank" rel="noopener" class="venture-preview-card reveal-up" style="transition-delay:160ms">
        <div class="venture-preview-card__img-wrap">
          <img src="images/Portfoliosites/aicharttraders.png" alt="AI Chart Traders screenshot" loading="lazy">
        </div>
        <span class="venture-preview-card__category">Fintech AI</span>
        <span class="venture-preview-card__name">AI Chart Traders</span>
        <span class="venture-preview-card__desc">Trade Smarter. React Faster.</span>
        <span class="btn btn--ghost" style="width:fit-content;margin-top:4px;font-size:13px;padding:8px 16px;">Live →</span>
      </a>
    </div>

    <div class="venture-preview__footer reveal-up">
      <a href="/ventures.html">See all 9 ventures →</a>
    </div>
  </section>

  <!-- ── Three Ways To Work With Us ────────── -->
  <section class="how-panels" id="how-it-works">
    <div class="container">
      <div class="how-panels__header reveal-up">
        <span class="label label--violet">How We Work</span>
        <h2 class="section-headline">Three Ways To Work With VibeWorks</h2>
      </div>

      <div class="how-panels__grid">
        <div class="how-panel reveal-up">
          <div class="how-panel__icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="16" r="8" stroke="#E8B84B" stroke-width="2"/>
              <circle cx="21" cy="16" r="8" stroke="#E8B84B" stroke-width="2"/>
            </svg>
          </div>
          <p class="how-panel__label">For Founders &amp; Creators</p>
          <h3 class="how-panel__title">Studio Partner</h3>
          <p class="how-panel__body">You bring the vision. We build the product. Revenue share — no upfront cost.</p>
          <a href="/services.html#partner" class="how-panel__link">Learn more →</a>
        </div>

        <div class="how-panel reveal-up" style="transition-delay:80ms">
          <div class="how-panel__icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="7" width="26" height="18" rx="3" stroke="#A78BFA" stroke-width="2"/>
              <path d="M9 13l4 4-4 4" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="15" y1="21" x2="23" y2="21" stroke="#A78BFA" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <p class="how-panel__label">For Entrepreneurs &amp; SMBs</p>
          <h3 class="how-panel__title">Custom Build</h3>
          <p class="how-panel__body">We build your AI product or tool from scratch. Fixed scope. 2-week delivery.</p>
          <a href="/services.html#build" class="how-panel__link">Learn more →</a>
        </div>

        <div class="how-panel reveal-up" style="transition-delay:160ms">
          <div class="how-panel__icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="2.5" stroke="#9CA3AF" stroke-width="2"/>
              <circle cx="16" cy="8" r="2.5" stroke="#9CA3AF" stroke-width="2"/>
              <circle cx="24" cy="8" r="2.5" stroke="#9CA3AF" stroke-width="2"/>
              <circle cx="8" cy="16" r="2.5" stroke="#9CA3AF" stroke-width="2"/>
              <circle cx="16" cy="16" r="2.5" stroke="#9CA3AF" stroke-width="2"/>
              <circle cx="24" cy="16" r="2.5" stroke="#9CA3AF" stroke-width="2"/>
              <circle cx="8" cy="24" r="2.5" stroke="#9CA3AF" stroke-width="2"/>
              <circle cx="16" cy="24" r="2.5" stroke="#9CA3AF" stroke-width="2"/>
              <circle cx="24" cy="24" r="2.5" stroke="#9CA3AF" stroke-width="2"/>
            </svg>
          </div>
          <p class="how-panel__label">For Investors &amp; Operators</p>
          <h3 class="how-panel__title">The Portfolio</h3>
          <p class="how-panel__body">Nine live ventures. Open to investment, licensing, and strategic partnership.</p>
          <a href="/ventures.html" class="how-panel__link">Explore →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Team Teaser ───────────────────────── -->
  <section class="team-teaser container" id="team">
    <div class="team-teaser__header reveal-up">
      <span class="label label--violet">The Studio</span>
      <h2 class="section-headline">Two Builders. One Machine.</h2>
    </div>

    <div class="team-teaser__grid">
      <div class="team-teaser__person reveal-up">
        <img src="images/Portfoliosites/ivan.jpg" alt="Ivanlee Jackson" class="team-teaser__photo" loading="lazy">
        <p class="team-teaser__name">Ivanlee Jackson</p>
        <p class="team-teaser__role">Co-Founder &amp; CTO — The technical engine behind every product we've shipped.</p>
      </div>
      <div class="team-teaser__person reveal-up" style="transition-delay:80ms">
        <img src="images/Portfoliosites/natasha.jpeg" alt="Natasha Burton" class="team-teaser__photo" loading="lazy">
        <p class="team-teaser__name">Natasha Burton</p>
        <p class="team-teaser__role">Co-Founder &amp; CEO — The distribution engine that makes every launch land.</p>
      </div>
    </div>

    <div class="team-teaser__footer reveal-up">
      <a href="/about.html" class="btn btn--ghost">Meet the team →</a>
    </div>
  </section>

  <!-- ── Footer CTA ────────────────────────── -->
  <section class="footer-cta container reveal-up">
    <h2 class="footer-cta__headline">Every product we've built started with one conversation.</h2>
    <a href="/contact.html" class="btn btn--gold btn--large btn--magnetic">Start The Conversation →</a>
  </section>

  <!-- ── Site Footer ───────────────────────── -->
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <p class="site-footer__brand-name">VibeWorks AI Studio</p>
          <p class="site-footer__tagline">AI Venture Studio</p>
          <a href="mailto:info@vibeworksstudio.ai" class="site-footer__email">info@vibeworksstudio.ai</a>
        </div>
        <div>
          <p class="site-footer__col-title">Navigation</p>
          <div class="site-footer__links">
            <a href="/ventures.html">Ventures</a>
            <a href="/services.html">Services</a>
            <a href="/about.html">About</a>
            <a href="/contact.html">Contact</a>
          </div>
        </div>
        <div>
          <p class="site-footer__col-title">Portfolio</p>
          <div class="site-footer__links">
            <a href="https://ratemylooks.pages.dev/" target="_blank" rel="noopener">RateMyLooksAI</a>
            <a href="https://sketchmysoulmate.com" target="_blank" rel="noopener">SketchMySoulmate</a>
            <a href="https://songgram.com" target="_blank" rel="noopener">SongGram</a>
            <a href="https://aicharttraders.com" target="_blank" rel="noopener">AI Chart Traders</a>
            <a href="https://richpeoplestocks.com/" target="_blank" rel="noopener">Rich People Stocks</a>
          </div>
        </div>
      </div>
      <div class="site-footer__bar">
        <span>© 2026 VibeWorks AI Studio · vibeworksstudio.ai</span>
        <span>Built with AI. Delivered by humans.</span>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify home page in browser**

Open http://localhost:8080/index.html. Confirm:
- Loader animates (VW monogram draws in, fades out after ~1.3s)
- New hero headline reads "We Build AI Products."
- Stats row shows: 9 (animated), 2 Wks, 500K+, 5 (animated)
- Three CTA buttons visible: "See Our Ventures →", "Partner With Us →", "Build Something →"
- Marquee ticker scrolls with new content
- Three venture preview cards show (RateMyLooksAI, SongGram, AI Chart Traders) with images visible
- Three "How We Work" panels render
- Two team photos render
- Footer CTA and new simplified footer render correctly
- DevTools console: no errors

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite home page for AI venture studio positioning"
```

---

## Task 4: Create ventures.html

**Files:**
- Create: `ventures.html`

- [ ] **Step 1: Create ventures.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Ventures — VibeWorks AI Studio</title>
  <meta name="description" content="Nine live AI products across consumer tech, fintech, health, music, and publishing. Built by VibeWorks in 2 weeks each.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://vibeworksstudio.ai/ventures.html">
  <meta property="og:title" content="Nine Live AI Products — VibeWorks AI Studio">
  <meta property="og:description" content="Nine live AI products across consumer tech, fintech, health, music, and publishing. Built by VibeWorks in 2 weeks each.">
  <meta property="og:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Nine Live AI Products — VibeWorks AI Studio">
  <meta name="twitter:description" content="Nine live AI products across consumer tech, fintech, health, music, and publishing. Built by VibeWorks in 2 weeks each.">
  <meta name="twitter:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="theme-color" content="#8B5CF6">
  <link rel="canonical" href="https://vibeworksstudio.ai/ventures.html">
  <link rel="manifest" href="manifest.json">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- ── Custom Cursor ────────────────────── -->
  <div class="cursor-dot" id="cursorDot" aria-hidden="true"></div>
  <div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>
  <div class="scroll-progress" id="scrollProgress"></div>

  <!-- ── Navigation ───────────────────────── -->
  <nav class="nav" id="nav">
    <div class="nav__inner">
      <a href="/" class="nav__logo">VibeWorks</a>
      <div class="nav__links" id="navLinks">
        <a href="/ventures.html" class="nav__link">Ventures</a>
        <a href="/services.html" class="nav__link">Services</a>
        <a href="/about.html"    class="nav__link">About</a>
        <a href="/contact.html"  class="nav__cta">Contact</a>
      </div>
      <button class="nav__hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- ── Page Hero ────────────────────────── -->
  <section class="page-hero services__grid-bg">
    <div class="container">
      <p class="page-hero__label">The Portfolio</p>
      <h1 class="page-hero__headline reveal-up">Nine Products. All Live. All Real.</h1>
      <p class="page-hero__subline reveal-up">We don't prototype. We don't concept. We ship — across healthcare, fintech, music, beauty, publishing, and creator tech.</p>
    </div>
  </section>

  <!-- ── Featured Venture ──────────────────── -->
  <section class="container">
    <div class="venture-featured reveal-up">
      <div class="venture-featured__img-wrap">
        <img src="images/Portfoliosites/ratemylooks.png" alt="RateMyLooksAI" loading="eager">
        <div class="venture-featured__overlay">
          <p class="venture-featured__live-badge">Live</p>
          <p class="venture-featured__category">Consumer AI · Established User Base</p>
          <h2 class="venture-featured__name">RateMyLooksAI</h2>
          <p class="venture-featured__tagline">Your Beauty Score, Decided by AI</p>
          <p class="venture-featured__desc">AI-powered appearance analysis with an established daily user base and strong social engagement across platforms.</p>
          <a href="https://ratemylooks.pages.dev/" target="_blank" rel="noopener" class="btn btn--ghost" style="font-size:14px;padding:10px 20px;">Visit Live →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Venture Grid ──────────────────────── -->
  <section class="venture-rows container">

    <div class="venture-row reveal-up">
      <div class="venture-row__image">
        <img src="images/Portfoliosites/sketchmysoulmate.png" alt="SketchMySoulmate" loading="lazy">
        <span class="venture-row__live-badge">Live</span>
      </div>
      <div class="venture-row__info">
        <p class="venture-row__category">Creator AI · Viral Distribution</p>
        <h2 class="venture__name">SketchMySoulmate</h2>
        <p class="venture-row__tagline">See Your Perfect Match, Visualized</p>
        <p class="venture-row__desc">AI visualization of your ideal partner, distributed virally through creator partnerships with massive organic reach.</p>
        <a href="https://sketchmysoulmate.com" target="_blank" rel="noopener" class="btn btn--ghost" style="font-size:14px;padding:10px 20px;">Visit →</a>
      </div>
    </div>

    <div class="venture-row reveal-up">
      <div class="venture-row__image">
        <img src="images/Portfoliosites/songgram.png" alt="SongGram" loading="lazy">
        <span class="venture-row__live-badge">Live</span>
      </div>
      <div class="venture-row__info">
        <p class="venture-row__category">Music AI · Multi-Platform</p>
        <h2 class="venture__name">SongGram</h2>
        <p class="venture-row__tagline">Who Are You Through Music?</p>
        <p class="venture-row__desc">AI-powered music personality analysis with integrations across major streaming platforms.</p>
        <a href="https://songgram.com" target="_blank" rel="noopener" class="btn btn--ghost" style="font-size:14px;padding:10px 20px;">Visit →</a>
      </div>
    </div>

    <div class="venture-row reveal-up">
      <div class="venture-row__image">
        <img src="images/Portfoliosites/corecreatorsai.png" alt="CoreCreatorsAI" loading="lazy">
        <span class="venture-row__live-badge">Live</span>
      </div>
      <div class="venture-row__info">
        <p class="venture-row__category">Creator AI · Content Tools</p>
        <h2 class="venture__name">CoreCreatorsAI</h2>
        <p class="venture-row__tagline">Built for Creators Who Mean Business</p>
        <p class="venture-row__desc">AI-powered tools for content creators and online businesses.</p>
        <!-- URL to be confirmed — href="#" until updated -->
        <a href="#" data-needs-url="true" class="btn btn--ghost" style="font-size:14px;padding:10px 20px;">Visit →</a>
      </div>
    </div>

    <div class="venture-row reveal-up">
      <div class="venture-row__image">
        <img src="images/Portfoliosites/aibookpublisher.png" alt="AI Book Publisher" loading="lazy">
        <span class="venture-row__live-badge">Live</span>
      </div>
      <div class="venture-row__info">
        <p class="venture-row__category">Publishing AI · Content Creation</p>
        <h2 class="venture__name">AI Book Publisher</h2>
        <p class="venture-row__tagline">Blank Page to Published Author</p>
        <p class="venture-row__desc">AI-powered book creation tool enabling rapid content workflows from concept to published in minutes.</p>
        <a href="https://aibookpublisher.com" target="_blank" rel="noopener" class="btn btn--ghost" style="font-size:14px;padding:10px 20px;">Visit →</a>
      </div>
    </div>

    <div class="venture-row reveal-up">
      <div class="venture-row__image">
        <img src="images/Portfoliosites/optimizeaitoolsuite.png" alt="OptimizeAI Tool Suite" loading="lazy">
        <span class="venture-row__live-badge">Live</span>
      </div>
      <div class="venture-row__info">
        <p class="venture-row__category">AI Tools · Productivity</p>
        <h2 class="venture__name">OptimizeAI Tool Suite</h2>
        <p class="venture-row__tagline">Your AI Stack, Optimized</p>
        <p class="venture-row__desc">A suite of AI-powered optimization tools for productivity and workflow automation.</p>
        <!-- URL to be confirmed — href="#" until updated -->
        <a href="#" data-needs-url="true" class="btn btn--ghost" style="font-size:14px;padding:10px 20px;">Visit →</a>
      </div>
    </div>

    <div class="venture-row reveal-up">
      <div class="venture-row__image">
        <img src="images/Portfoliosites/mddiagnose.png" alt="MD Diagnose" loading="lazy">
        <span class="venture-row__live-badge">Live</span>
      </div>
      <div class="venture-row__info">
        <p class="venture-row__category">Health AI · Triage Automation</p>
        <h2 class="venture__name">MD Diagnose</h2>
        <p class="venture-row__tagline">Medical Answers, No Appointment</p>
        <p class="venture-row__desc">AI-powered preliminary health assessment providing accessible medical guidance.</p>
        <a href="https://md-diagnose-app.ivanleejackson.workers.dev/" target="_blank" rel="noopener" class="btn btn--ghost" style="font-size:14px;padding:10px 20px;">Visit →</a>
      </div>
    </div>

    <div class="venture-row reveal-up">
      <div class="venture-row__image">
        <img src="images/Portfoliosites/aicharttraders.png" alt="AI Chart Traders" loading="lazy">
        <span class="venture-row__live-badge">Live</span>
      </div>
      <div class="venture-row__info">
        <p class="venture-row__category">Fintech AI · Technical Analysis</p>
        <h2 class="venture__name">AI Chart Traders</h2>
        <p class="venture-row__tagline">Trade Smarter. React Faster.</p>
        <p class="venture-row__desc">Automated technical analysis for traders with AI-driven chart pattern recognition in real time.</p>
        <a href="https://aicharttraders.com" target="_blank" rel="noopener" class="btn btn--ghost" style="font-size:14px;padding:10px 20px;">Visit →</a>
      </div>
    </div>

    <div class="venture-row reveal-up">
      <div class="venture-row__image">
        <img src="images/Portfoliosites/richpplstocks.png" alt="Rich People Stocks" loading="lazy">
        <span class="venture-row__live-badge">Live</span>
      </div>
      <div class="venture-row__info">
        <p class="venture-row__category">Fintech AI · Insider Intelligence</p>
        <h2 class="venture__name">Rich People Stocks</h2>
        <p class="venture-row__tagline">Track What Insiders Actually Buy</p>
        <p class="venture-row__desc">Real-time tracking of congressional and institutional trades.</p>
        <a href="https://richpeoplestocks.com/" target="_blank" rel="noopener" class="btn btn--ghost" style="font-size:14px;padding:10px 20px;">Visit →</a>
      </div>
    </div>

  </section>

  <!-- ── The Pattern ───────────────────────── -->
  <section class="container">
    <div class="venture-pattern reveal-up">
      <span class="label label--violet">The System</span>
      <h2 class="venture-pattern__headline">One Formula. Nine Proofs.</h2>
      <p class="venture-pattern__copy">Every one of these started the same way: an idea, a conversation, and 2 weeks. Different verticals. Same system. That system is available to you.</p>
      <div class="venture-pattern__stats">
        <div class="venture-pattern__stat"><strong>9</strong> verticals tested</div>
        <div class="venture-pattern__stat"><strong>100%</strong> shipped on time</div>
        <div class="venture-pattern__stat"><strong>All</strong> live today</div>
      </div>
    </div>
  </section>

  <!-- ── Dual CTA ──────────────────────────── -->
  <section class="footer-cta container reveal-up">
    <h2 class="footer-cta__headline">See something that sparks an idea?</h2>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="/services.html#partner" class="btn btn--gold btn--large btn--magnetic">Partner With Us →</a>
      <a href="/services.html#build"   class="btn btn--ghost btn--large">Build Something Similar →</a>
    </div>
  </section>

  <!-- ── Site Footer ───────────────────────── -->
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <p class="site-footer__brand-name">VibeWorks AI Studio</p>
          <p class="site-footer__tagline">AI Venture Studio</p>
          <a href="mailto:info@vibeworksstudio.ai" class="site-footer__email">info@vibeworksstudio.ai</a>
        </div>
        <div>
          <p class="site-footer__col-title">Navigation</p>
          <div class="site-footer__links">
            <a href="/ventures.html">Ventures</a>
            <a href="/services.html">Services</a>
            <a href="/about.html">About</a>
            <a href="/contact.html">Contact</a>
          </div>
        </div>
        <div>
          <p class="site-footer__col-title">Portfolio</p>
          <div class="site-footer__links">
            <a href="https://ratemylooks.pages.dev/" target="_blank" rel="noopener">RateMyLooksAI</a>
            <a href="https://sketchmysoulmate.com" target="_blank" rel="noopener">SketchMySoulmate</a>
            <a href="https://songgram.com" target="_blank" rel="noopener">SongGram</a>
            <a href="https://aicharttraders.com" target="_blank" rel="noopener">AI Chart Traders</a>
            <a href="https://richpeoplestocks.com/" target="_blank" rel="noopener">Rich People Stocks</a>
          </div>
        </div>
      </div>
      <div class="site-footer__bar">
        <span>© 2026 VibeWorks AI Studio · vibeworksstudio.ai</span>
        <span>Built with AI. Delivered by humans.</span>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify ventures.html**

Open http://localhost:8080/ventures.html. Confirm:
- Nav shows "Ventures" with active gold underline
- Page hero renders with grid background
- RateMyLooksAI featured card (full width, overlay text visible)
- 8 venture rows render (alternating image-left / image-right on desktop)
- All product screenshots load
- "The Pattern" interstitial renders
- Dual CTA renders at bottom
- No console errors

- [ ] **Step 3: Commit**

```bash
git add ventures.html
git commit -m "feat: add ventures page with all 9 products"
```

---

## Task 5: Create services.html

**Files:**
- Create: `services.html`

- [ ] **Step 1: Create services.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Work With Us — VibeWorks AI Studio</title>
  <meta name="description" content="Three ways to work with VibeWorks: Studio Partner (co-build, revenue share), Custom Build (AI for your business), or explore The Portfolio.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://vibeworksstudio.ai/services.html">
  <meta property="og:title" content="Work With VibeWorks AI Studio">
  <meta property="og:description" content="Three ways to work with VibeWorks: Studio Partner, Custom Build, or The Portfolio.">
  <meta property="og:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Work With VibeWorks AI Studio">
  <meta name="twitter:description" content="Three ways to work with VibeWorks: Studio Partner, Custom Build, or The Portfolio.">
  <meta name="twitter:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="theme-color" content="#8B5CF6">
  <link rel="canonical" href="https://vibeworksstudio.ai/services.html">
  <link rel="manifest" href="manifest.json">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <div class="cursor-dot" id="cursorDot" aria-hidden="true"></div>
  <div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>
  <div class="scroll-progress" id="scrollProgress"></div>

  <nav class="nav" id="nav">
    <div class="nav__inner">
      <a href="/" class="nav__logo">VibeWorks</a>
      <div class="nav__links" id="navLinks">
        <a href="/ventures.html" class="nav__link">Ventures</a>
        <a href="/services.html" class="nav__link">Services</a>
        <a href="/about.html"    class="nav__link">About</a>
        <a href="/contact.html"  class="nav__cta">Contact</a>
      </div>
      <button class="nav__hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- ── Page Hero ────────────────────────── -->
  <section class="page-hero services__grid-bg">
    <div class="container">
      <p class="page-hero__label">How We Work</p>
      <h1 class="page-hero__headline reveal-up">Three Ways To Work With VibeWorks</h1>
      <p class="page-hero__subline reveal-up">Whether you have an idea, a business problem, or want to build together — there's a track for you.</p>
      <nav class="track-nav" aria-label="Track navigation">
        <a href="#partner"   class="track-nav__pill">Studio Partner</a>
        <a href="#build"     class="track-nav__pill">Custom Build</a>
        <a href="#portfolio" class="track-nav__pill">The Portfolio</a>
      </nav>
    </div>
  </section>

  <!-- ── Track 1: Studio Partner ───────────── -->
  <section class="track-section container" id="partner">
    <p class="track-section__label">For Founders &amp; Creators</p>
    <h2 class="track-section__headline reveal-up">You Have The Vision. We Have The Machine.</h2>
    <p class="track-section__copy">You bring an idea — a product concept, an audience, a problem worth solving. We bring 9 launches of experience, full-stack AI build capability, and 500K+ distribution reach. We build it together. We split the upside.</p>
    <div class="track-section__body">
      <div>
        <p class="track-section__list-title">What You Get</p>
        <ul class="track-section__list">
          <li>Full product build — design, development, AI infrastructure</li>
          <li>Launch strategy and distribution through our network</li>
          <li>Ongoing development and iteration post-launch</li>
          <li>A partner who has done this 9 times before</li>
        </ul>
      </div>
      <div>
        <p class="track-section__list-title">What We Need From You</p>
        <ul class="track-section__list">
          <li>A strong idea with a clear target user</li>
          <li>Domain expertise, audience, or unique insight</li>
          <li>Commitment to the partnership beyond launch</li>
        </ul>
      </div>
    </div>
    <p class="track-section__note">Revenue share — no upfront cost to qualified partners</p>
    <a href="/contact.html?track=partner" class="btn btn--gold btn--large btn--magnetic">Apply For Partnership →</a>
  </section>

  <!-- ── Track 2: Custom Build ─────────────── -->
  <section class="track-section container" id="build">
    <p class="track-section__label">For Entrepreneurs &amp; Small Businesses</p>
    <h2 class="track-section__headline reveal-up">Tell Us What You Need Built. We'll Build It.</h2>
    <p class="track-section__copy">AI agents, internal automation tools, customer-facing products — if your business needs it and AI can power it, we build it. Fixed scope, fast delivery, you own it when we're done.</p>
    <div class="track-section__body">
      <div>
        <p class="track-section__list-title">What We Build</p>
        <ul class="track-section__list">
          <li>AI agents and automation workflows</li>
          <li>Customer-facing AI products and tools</li>
          <li>Internal business intelligence and workflow tools</li>
          <li>Full-stack AI web applications</li>
        </ul>
      </div>
      <div>
        <p class="track-section__list-title">Timeline &amp; Investment</p>
        <div class="track-section__pricing">
          <div class="track-section__price-row">
            <strong>Agents &amp; Automation</strong>
            <span>5–10 business days &middot; $1K–$5K</span>
          </div>
          <div class="track-section__price-row">
            <strong>Full Product Builds</strong>
            <span>2 weeks &middot; Custom scope</span>
          </div>
        </div>
      </div>
    </div>
    <a href="/contact.html?track=build" class="btn btn--violet btn--large btn--magnetic">Start A Project →</a>
  </section>

  <!-- ── Track 3: The Portfolio ─────────────── -->
  <section class="track-section container" id="portfolio">
    <p class="track-section__label">For Investors &amp; Operators</p>
    <h2 class="track-section__headline reveal-up">Nine Live Products. Multiple Opportunities.</h2>
    <p class="track-section__copy">Our ventures aren't side projects — they're operating products with real users across multiple categories. If you're interested in investing, licensing, acquiring, or building on top of what we've launched, we're open to the conversation.</p>
    <div class="track-section__body">
      <div>
        <p class="track-section__list-title">Opportunities</p>
        <ul class="track-section__list">
          <li>Equity investment in individual ventures</li>
          <li>Licensing and white-label arrangements</li>
          <li>Acquisition of specific products</li>
          <li>Strategic partnership and integration</li>
        </ul>
      </div>
      <div>
        <p class="track-section__list-title">See The Work</p>
        <ul class="track-section__list">
          <li>Nine live products across five verticals</li>
          <li>Hundreds of thousands of real users</li>
          <li>All products actively maintained and growing</li>
        </ul>
      </div>
    </div>
    <a href="/contact.html?track=portfolio" class="btn btn--ghost btn--large btn--magnetic">Discuss Opportunities →</a>
  </section>

  <!-- ── Proof Strip ───────────────────────── -->
  <section class="proof-strip">
    <div class="container">
      <div class="proof-strip__grid">
        <div class="proof-strip__item reveal-up">
          <p class="proof-strip__stat">9</p>
          <p class="proof-strip__copy">We've shipped more in a year than most agencies do in five.</p>
        </div>
        <div class="proof-strip__item reveal-up" style="transition-delay:80ms">
          <p class="proof-strip__stat">2 Wks</p>
          <p class="proof-strip__copy">A proven timeline with 9 completions behind it. Not a pitch — a track record.</p>
        </div>
        <div class="proof-strip__item reveal-up" style="transition-delay:160ms">
          <p class="proof-strip__stat">500K+</p>
          <p class="proof-strip__copy">Every product we launch has distribution built in from day one.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Site Footer ───────────────────────── -->
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <p class="site-footer__brand-name">VibeWorks AI Studio</p>
          <p class="site-footer__tagline">AI Venture Studio</p>
          <a href="mailto:info@vibeworksstudio.ai" class="site-footer__email">info@vibeworksstudio.ai</a>
        </div>
        <div>
          <p class="site-footer__col-title">Navigation</p>
          <div class="site-footer__links">
            <a href="/ventures.html">Ventures</a>
            <a href="/services.html">Services</a>
            <a href="/about.html">About</a>
            <a href="/contact.html">Contact</a>
          </div>
        </div>
        <div>
          <p class="site-footer__col-title">Portfolio</p>
          <div class="site-footer__links">
            <a href="https://ratemylooks.pages.dev/" target="_blank" rel="noopener">RateMyLooksAI</a>
            <a href="https://sketchmysoulmate.com" target="_blank" rel="noopener">SketchMySoulmate</a>
            <a href="https://songgram.com" target="_blank" rel="noopener">SongGram</a>
            <a href="https://aicharttraders.com" target="_blank" rel="noopener">AI Chart Traders</a>
            <a href="https://richpeoplestocks.com/" target="_blank" rel="noopener">Rich People Stocks</a>
          </div>
        </div>
      </div>
      <div class="site-footer__bar">
        <span>© 2026 VibeWorks AI Studio · vibeworksstudio.ai</span>
        <span>Built with AI. Delivered by humans.</span>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify services.html**

Open http://localhost:8080/services.html. Confirm:
- Nav "Services" link has active gold underline
- Three track nav pills visible below hero
- Clicking "Studio Partner" pill scrolls to `#partner` section
- All three track sections render with their lists
- Proof strip (9 / 2 Wks / 500K+) renders
- No console errors

- [ ] **Step 3: Commit**

```bash
git add services.html
git commit -m "feat: add services page with three engagement tracks"
```

---

## Task 6: Create about.html

**Files:**
- Create: `about.html`

- [ ] **Step 1: Create about.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About — VibeWorks AI Studio</title>
  <meta name="description" content="VibeWorks AI Studio is a two-person AI venture studio led by Ivanlee Jackson and Natasha Burton. Learn our story and thesis.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://vibeworksstudio.ai/about.html">
  <meta property="og:title" content="About VibeWorks AI Studio">
  <meta property="og:description" content="VibeWorks AI Studio is a two-person AI venture studio led by Ivanlee Jackson and Natasha Burton.">
  <meta property="og:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="About VibeWorks AI Studio">
  <meta name="twitter:description" content="VibeWorks AI Studio is a two-person AI venture studio led by Ivanlee Jackson and Natasha Burton.">
  <meta name="twitter:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="theme-color" content="#8B5CF6">
  <link rel="canonical" href="https://vibeworksstudio.ai/about.html">
  <link rel="manifest" href="manifest.json">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <div class="cursor-dot" id="cursorDot" aria-hidden="true"></div>
  <div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>
  <div class="scroll-progress" id="scrollProgress"></div>

  <nav class="nav" id="nav">
    <div class="nav__inner">
      <a href="/" class="nav__logo">VibeWorks</a>
      <div class="nav__links" id="navLinks">
        <a href="/ventures.html" class="nav__link">Ventures</a>
        <a href="/services.html" class="nav__link">Services</a>
        <a href="/about.html"    class="nav__link">About</a>
        <a href="/contact.html"  class="nav__cta">Contact</a>
      </div>
      <button class="nav__hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- ── Page Hero ────────────────────────── -->
  <section class="page-hero">
    <div class="container">
      <h1 class="page-hero__headline reveal-up">Built By Builders.</h1>
      <p class="page-hero__subline reveal-up">VibeWorks AI Studio is a two-person team that ships faster than most companies ten times our size. Here's why — and where we're going.</p>
    </div>
  </section>

  <!-- ── Studio Thesis ────────────────────── -->
  <section class="container">
    <div class="about-thesis">
      <span class="label label--violet">Our Thesis</span>
      <p class="reveal-up">Most AI companies are either research labs or service firms. We're neither.</p>
      <p class="reveal-up">We're operators. We build products, put them live, and watch them work in the real world. That feedback loop — across 9 products, 5 verticals, hundreds of thousands of users — is what makes us different.</p>
      <p class="reveal-up">The formula we've developed isn't magic. It's a repeatable system: identify a real problem, build a focused AI solution, launch with distribution, iterate fast. Two weeks, start to finish.</p>
      <p class="reveal-up">We're building VibeWorks to be the studio that defines what AI product development looks like at speed and scale. Every product teaches us something. Every client build funds the next experiment. The machine keeps compounding.</p>
    </div>
  </section>

  <!-- ── Team ──────────────────────────────── -->
  <section class="container" style="padding: var(--space-2xl) 0; border-top: 1px solid var(--border);">
    <div class="section-header reveal-up" style="margin-bottom: var(--space-2xl);">
      <span class="label label--gold">The Team</span>
      <h2 class="section-headline">Two People. Nine Products.</h2>
    </div>

    <div class="founder reveal-up" style="margin-bottom: var(--space-2xl);">
      <div class="founder__photo founder__photo--violet">
        <img src="images/Portfoliosites/ivan.jpg" alt="Ivanlee Jackson — Co-Founder &amp; CTO" loading="lazy">
      </div>
      <div class="founder__content">
        <h3 class="founder__name">Ivanlee Jackson</h3>
        <p class="founder__title">Co-Founder &amp; CTO</p>
        <p class="founder__bio">10+ years building full-stack products from zero to production. Ivan has shipped AI-powered apps across healthcare, fintech, music, and consumer tech — fast, clean, and built to scale.</p>
        <p class="founder__bio founder__bio--strong">He architects the infrastructure. He writes the code. He is the reason 2 weeks is a track record, not a claim.</p>
        <ul class="founder__creds">
          <li>10+ years full-stack engineering</li>
          <li>Expert in 0→1 AI product builds</li>
          <li>Claude, OpenClaw &amp; modern AI infrastructure</li>
          <li>Every line of code is production-grade</li>
        </ul>
      </div>
    </div>

    <div class="founder founder--reverse reveal-up">
      <div class="founder__photo founder__photo--gold">
        <img src="images/Portfoliosites/natasha.jpeg" alt="Natasha Burton — Co-Founder &amp; CEO" loading="lazy">
      </div>
      <div class="founder__content">
        <h3 class="founder__name">Natasha Burton</h3>
        <p class="founder__title">Co-Founder &amp; CEO</p>
        <p class="founder__bio">500K+ followers and a track record of turning audiences into revenue. Natasha understands distribution at a level most agencies never reach — because she lives it.</p>
        <p class="founder__bio founder__bio--strong">She is the reason products don't just launch. They land.</p>
        <ul class="founder__creds">
          <li>500K+ engaged audience</li>
          <li>Serial viral product launcher</li>
          <li>Creator economy &amp; growth strategy</li>
          <li>The bridge between AI capability and real people</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ── The Vision ────────────────────────── -->
  <section class="container" style="padding: var(--space-2xl) 0; border-top: 1px solid var(--border);">
    <div style="max-width: 720px; margin: 0 auto;">
      <span class="label label--violet">Where We're Going</span>
      <h2 class="section-headline reveal-up">The Vision</h2>
      <p class="reveal-up" style="font-family: var(--font-body); font-size: var(--text-subhead); color: var(--text-muted); line-height: 1.7; margin-top: var(--space-md);">We're building a portfolio of AI products that compounds. Each venture teaches us something the next one benefits from. Each client build funds the next studio experiment. The goal is not one big hit — it's a machine that keeps producing them. We're early. The portfolio is growing. If you want to be part of that, there's a track for you.</p>
    </div>
  </section>

  <!-- ── CTA ───────────────────────────────── -->
  <section class="footer-cta container reveal-up">
    <h2 class="footer-cta__headline">Want to build something with us?</h2>
    <a href="/contact.html" class="btn btn--gold btn--large btn--magnetic">Start A Conversation →</a>
  </section>

  <!-- ── Site Footer ───────────────────────── -->
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <p class="site-footer__brand-name">VibeWorks AI Studio</p>
          <p class="site-footer__tagline">AI Venture Studio</p>
          <a href="mailto:info@vibeworksstudio.ai" class="site-footer__email">info@vibeworksstudio.ai</a>
        </div>
        <div>
          <p class="site-footer__col-title">Navigation</p>
          <div class="site-footer__links">
            <a href="/ventures.html">Ventures</a>
            <a href="/services.html">Services</a>
            <a href="/about.html">About</a>
            <a href="/contact.html">Contact</a>
          </div>
        </div>
        <div>
          <p class="site-footer__col-title">Portfolio</p>
          <div class="site-footer__links">
            <a href="https://ratemylooks.pages.dev/" target="_blank" rel="noopener">RateMyLooksAI</a>
            <a href="https://sketchmysoulmate.com" target="_blank" rel="noopener">SketchMySoulmate</a>
            <a href="https://songgram.com" target="_blank" rel="noopener">SongGram</a>
            <a href="https://aicharttraders.com" target="_blank" rel="noopener">AI Chart Traders</a>
            <a href="https://richpeoplestocks.com/" target="_blank" rel="noopener">Rich People Stocks</a>
          </div>
        </div>
      </div>
      <div class="site-footer__bar">
        <span>© 2026 VibeWorks AI Studio · vibeworksstudio.ai</span>
        <span>Built with AI. Delivered by humans.</span>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify about.html**

Open http://localhost:8080/about.html. Confirm:
- "About" nav link has active gold underline
- Both founder photos load (ivan.jpg, natasha.jpeg)
- `.founder` and `.founder--reverse` layouts alternate correctly
- Founder credential lists render
- Vision section renders
- No console errors

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: add about page with team and studio thesis"
```

---

## Task 7: Create contact.html

**Files:**
- Create: `contact.html`

**Important setup step:** Before going live, sign up at https://formspree.io, create three forms (one per track), and replace `FORMSPREE_PARTNER_ID`, `FORMSPREE_BUILD_ID`, `FORMSPREE_PORTFOLIO_ID` in the HTML below with real form IDs. Until then the forms will not submit successfully.

- [ ] **Step 1: Create contact.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact — VibeWorks AI Studio</title>
  <meta name="description" content="Start a conversation with VibeWorks. Apply to partner, start a custom build, or discuss portfolio opportunities.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://vibeworksstudio.ai/contact.html">
  <meta property="og:title" content="Contact VibeWorks AI Studio">
  <meta property="og:description" content="Start a conversation with VibeWorks. Apply to partner, start a custom build, or discuss portfolio opportunities.">
  <meta property="og:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Contact VibeWorks AI Studio">
  <meta name="twitter:description" content="Start a conversation with VibeWorks. Apply to partner, start a custom build, or discuss portfolio opportunities.">
  <meta name="twitter:image" content="https://vibeworksstudio.ai/images/social-card.png">
  <meta name="theme-color" content="#8B5CF6">
  <link rel="canonical" href="https://vibeworksstudio.ai/contact.html">
  <link rel="manifest" href="manifest.json">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <div class="cursor-dot" id="cursorDot" aria-hidden="true"></div>
  <div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>
  <div class="scroll-progress" id="scrollProgress"></div>

  <nav class="nav" id="nav">
    <div class="nav__inner">
      <a href="/" class="nav__logo">VibeWorks</a>
      <div class="nav__links" id="navLinks">
        <a href="/ventures.html" class="nav__link">Ventures</a>
        <a href="/services.html" class="nav__link">Services</a>
        <a href="/about.html"    class="nav__link">About</a>
        <a href="/contact.html"  class="nav__cta">Contact</a>
      </div>
      <button class="nav__hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- ── Page Hero ────────────────────────── -->
  <section class="page-hero">
    <div class="container">
      <h1 class="page-hero__headline reveal-up">Let's Talk.</h1>
      <p class="page-hero__subline reveal-up">Tell us what you're working on. We'll tell you honestly if and how we can help.</p>
      <div class="hero__availability" style="margin-top: var(--space-md);">
        <span class="hero__avail-dot" aria-hidden="true"></span>
        <span>Currently accepting 2 new client engagements for Q2 2026.</span>
      </div>
    </div>
  </section>

  <!-- ── Contact Section ───────────────────── -->
  <section class="container" style="padding: var(--space-xl) 0 var(--space-2xl);">

    <!-- Success Banner (shown after ?sent=true redirect) -->
    <div class="contact-success" role="status">
      Message sent. We'll be in touch within 24 hours.
    </div>

    <!-- Track Selector -->
    <div class="track-selector" role="group" aria-label="Select your inquiry type">
      <button class="track-card" data-track="partner" type="button">
        <span class="track-card__icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="14" cy="20" r="9" stroke="#E8B84B" stroke-width="2"/>
            <circle cx="26" cy="20" r="9" stroke="#E8B84B" stroke-width="2"/>
          </svg>
        </span>
        <span class="track-card__title">Studio Partner</span>
        <span class="track-card__sub">I have an idea and want to build together</span>
      </button>

      <button class="track-card" data-track="build" type="button">
        <span class="track-card__icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="5" y="10" width="30" height="20" rx="3" stroke="#A78BFA" stroke-width="2"/>
            <path d="M12 18l5 4-5 4" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="20" y1="26" x2="28" y2="26" stroke="#A78BFA" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="track-card__title">Custom Build</span>
        <span class="track-card__sub">I need AI built for my business</span>
      </button>

      <button class="track-card" data-track="portfolio" type="button">
        <span class="track-card__icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="10" cy="10" r="3" stroke="#9CA3AF" stroke-width="2"/>
            <circle cx="20" cy="10" r="3" stroke="#9CA3AF" stroke-width="2"/>
            <circle cx="30" cy="10" r="3" stroke="#9CA3AF" stroke-width="2"/>
            <circle cx="10" cy="20" r="3" stroke="#9CA3AF" stroke-width="2"/>
            <circle cx="20" cy="20" r="3" stroke="#9CA3AF" stroke-width="2"/>
            <circle cx="30" cy="20" r="3" stroke="#9CA3AF" stroke-width="2"/>
            <circle cx="10" cy="30" r="3" stroke="#9CA3AF" stroke-width="2"/>
            <circle cx="20" cy="30" r="3" stroke="#9CA3AF" stroke-width="2"/>
            <circle cx="30" cy="30" r="3" stroke="#9CA3AF" stroke-width="2"/>
          </svg>
        </span>
        <span class="track-card__title">Portfolio / Investor</span>
        <span class="track-card__sub">I'm interested in your ventures</span>
      </button>
    </div>

    <!-- Form: Studio Partner -->
    <!-- FORMSPREE SETUP: Replace FORMSPREE_PARTNER_ID with real ID from formspree.io -->
    <div class="contact-form" data-form="partner">
      <form action="https://formspree.io/f/FORMSPREE_PARTNER_ID" method="POST">
        <input type="hidden" name="_subject" value="Studio Partner Application">
        <input type="hidden" name="_next" value="https://vibeworksstudio.ai/contact.html?sent=true">
        <div class="form-group">
          <label for="partner-name">Name *</label>
          <input type="text" id="partner-name" name="name" required placeholder="Your full name">
        </div>
        <div class="form-group">
          <label for="partner-email">Email *</label>
          <input type="email" id="partner-email" name="email" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label for="partner-idea">What's your idea? *</label>
          <textarea id="partner-idea" name="idea" required placeholder="What problem does it solve? Who is it for?"></textarea>
        </div>
        <div class="form-group">
          <label>Do you have an existing audience or user base?</label>
          <div class="form-radio-group">
            <label><input type="radio" name="audience" value="Yes"> Yes</label>
            <label><input type="radio" name="audience" value="No"> No</label>
            <label><input type="radio" name="audience" value="Building one"> Building one</label>
          </div>
        </div>
        <button type="submit" class="btn btn--gold btn--large form-submit">Apply For Partnership →</button>
      </form>
    </div>

    <!-- Form: Custom Build -->
    <!-- FORMSPREE SETUP: Replace FORMSPREE_BUILD_ID with real ID from formspree.io -->
    <div class="contact-form" data-form="build">
      <form action="https://formspree.io/f/FORMSPREE_BUILD_ID" method="POST">
        <input type="hidden" name="_subject" value="Custom Build Inquiry">
        <input type="hidden" name="_next" value="https://vibeworksstudio.ai/contact.html?sent=true">
        <div class="form-group">
          <label for="build-name">Name *</label>
          <input type="text" id="build-name" name="name" required placeholder="Your full name">
        </div>
        <div class="form-group">
          <label for="build-email">Email *</label>
          <input type="email" id="build-email" name="email" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label for="build-company">Company or business name</label>
          <input type="text" id="build-company" name="company" placeholder="Optional">
        </div>
        <div class="form-group">
          <label for="build-desc">What do you need built? *</label>
          <textarea id="build-desc" name="description" required placeholder="Describe the tool or product you have in mind"></textarea>
        </div>
        <div class="form-group">
          <label for="build-timeline">Timeline</label>
          <select id="build-timeline" name="timeline">
            <option value="">Select...</option>
            <option>ASAP</option>
            <option>Within 1 month</option>
            <option>1–3 months</option>
            <option>Flexible</option>
          </select>
        </div>
        <div class="form-group">
          <label for="build-budget">Budget range</label>
          <select id="build-budget" name="budget">
            <option value="">Select...</option>
            <option>Under $1K</option>
            <option>$1K–$5K</option>
            <option>$5K–$15K</option>
            <option>$15K+</option>
          </select>
        </div>
        <button type="submit" class="btn btn--violet btn--large form-submit">Start My Project →</button>
      </form>
    </div>

    <!-- Form: Portfolio / Investor -->
    <!-- FORMSPREE SETUP: Replace FORMSPREE_PORTFOLIO_ID with real ID from formspree.io -->
    <div class="contact-form" data-form="portfolio">
      <form action="https://formspree.io/f/FORMSPREE_PORTFOLIO_ID" method="POST">
        <input type="hidden" name="_subject" value="Portfolio / Investor Inquiry">
        <input type="hidden" name="_next" value="https://vibeworksstudio.ai/contact.html?sent=true">
        <div class="form-group">
          <label for="portfolio-name">Name *</label>
          <input type="text" id="portfolio-name" name="name" required placeholder="Your full name">
        </div>
        <div class="form-group">
          <label for="portfolio-email">Email *</label>
          <input type="email" id="portfolio-email" name="email" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label for="portfolio-org">Organization</label>
          <input type="text" id="portfolio-org" name="organization" placeholder="Optional">
        </div>
        <div class="form-group">
          <label for="portfolio-interest">Area of interest</label>
          <select id="portfolio-interest" name="interest">
            <option value="">Select...</option>
            <option>Equity Investment</option>
            <option>Licensing &amp; White-label</option>
            <option>Acquisition</option>
            <option>Strategic Partnership</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label for="portfolio-msg">Message</label>
          <textarea id="portfolio-msg" name="message" placeholder="Tell us about your interest..."></textarea>
        </div>
        <button type="submit" class="btn btn--ghost btn--large form-submit">Start The Conversation →</button>
      </form>
    </div>

  </section>

  <!-- ── Direct Contact ────────────────────── -->
  <div class="contact-direct container">
    <p>Or email us directly: <a href="mailto:info@vibeworksstudio.ai">info@vibeworksstudio.ai</a></p>
    <p>We respond to every message within 24 hours.</p>
  </div>

  <!-- ── Site Footer ───────────────────────── -->
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <p class="site-footer__brand-name">VibeWorks AI Studio</p>
          <p class="site-footer__tagline">AI Venture Studio</p>
          <a href="mailto:info@vibeworksstudio.ai" class="site-footer__email">info@vibeworksstudio.ai</a>
        </div>
        <div>
          <p class="site-footer__col-title">Navigation</p>
          <div class="site-footer__links">
            <a href="/ventures.html">Ventures</a>
            <a href="/services.html">Services</a>
            <a href="/about.html">About</a>
            <a href="/contact.html">Contact</a>
          </div>
        </div>
        <div>
          <p class="site-footer__col-title">Portfolio</p>
          <div class="site-footer__links">
            <a href="https://ratemylooks.pages.dev/" target="_blank" rel="noopener">RateMyLooksAI</a>
            <a href="https://sketchmysoulmate.com" target="_blank" rel="noopener">SketchMySoulmate</a>
            <a href="https://songgram.com" target="_blank" rel="noopener">SongGram</a>
            <a href="https://aicharttraders.com" target="_blank" rel="noopener">AI Chart Traders</a>
            <a href="https://richpeoplestocks.com/" target="_blank" rel="noopener">Rich People Stocks</a>
          </div>
        </div>
      </div>
      <div class="site-footer__bar">
        <span>© 2026 VibeWorks AI Studio · vibeworksstudio.ai</span>
        <span>Built with AI. Delivered by humans.</span>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify contact.html**

Open http://localhost:8080/contact.html. Confirm:
- "Contact" nav CTA has active gold background
- Three track selector cards visible
- Clicking "Studio Partner" card: card gets gold border, partner form fades in
- Clicking "Custom Build" card: partner form hides, build form fades in
- Clicking "Portfolio / Investor" card: build form hides, portfolio form fades in
- Open http://localhost:8080/contact.html?track=partner — partner card is pre-selected and form is visible on load
- Open http://localhost:8080/contact.html?track=build — build card is pre-selected
- No console errors

- [ ] **Step 3: Commit**

```bash
git add contact.html
git commit -m "feat: add contact page with three-track form selector"
```

---

## Task 8: Update manifest.json

**Files:**
- Modify: `manifest.json`

- [ ] **Step 1: Read and update manifest.json**

```bash
cat manifest.json
```

Add `"scope": "/"` to the JSON object. Also update `start_url` to `"/"` if it isn't already. Keep all other fields unchanged. The file should look like:

```json
{
  "name": "VibeWorks AI Studio",
  "short_name": "VibeWorks",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "theme_color": "#8B5CF6",
  "background_color": "#07070E",
  "icons": [...]
}
```

(Keep existing `icons` array unchanged.)

- [ ] **Step 2: Verify manifest.json is valid JSON**

```bash
python3 -c "import json; json.load(open('manifest.json')); print('Valid JSON')"
```

Expected: `Valid JSON`

- [ ] **Step 3: Commit**

```bash
git add manifest.json
git commit -m "chore: update manifest.json scope and start_url"
```

---

## Task 9: Cross-Page Integration Check

**No files to create** — this is a verification task.

- [ ] **Step 1: Test all nav links**

With http://localhost:8080 running:
- From home: click "Ventures" → lands on ventures.html, "Ventures" nav link active
- From home: click "Services" → lands on services.html, "Services" nav link active
- From home: click "About" → lands on about.html, "About" nav link active
- From home: click "Contact" → lands on contact.html, "Contact" CTA has gold background
- From any page: click "VibeWorks" logo → returns to home

- [ ] **Step 2: Test CTA cross-page anchor links**

- From index.html: click "Partner With Us →" → lands on `/services.html#partner`, page scrolls to partner section
- From index.html: click "Build Something →" → lands on `/services.html#build`, page scrolls to build section
- From ventures.html: click "Partner With Us →" → lands on services.html#partner
- From services.html: click "Apply For Partnership →" → lands on contact.html with partner card pre-selected

- [ ] **Step 3: Test mobile layout**

Open DevTools → toggle device toolbar → set to 375px width (iPhone SE). Confirm on each page:
- Nav hamburger visible, links hidden
- All grids stack to single column
- How-panel dividers change from vertical (right border) to horizontal (bottom border)
- Track selector cards stack vertically
- Footer stacks correctly

- [ ] **Step 4: Verify clean state**

```bash
git status
# Expected: nothing to commit — all files were committed in prior tasks
git log --oneline -10
# Should show 8 commits from this plan (CSS, JS, index.html, ventures, services, about, contact, manifest)
```

All tasks complete. The site is ready to push to GitHub Pages.

---

## Post-Implementation Notes

**Before going live:**
1. Sign up at https://formspree.io and create 3 forms
2. Replace placeholder IDs in `contact.html`:
   - `FORMSPREE_PARTNER_ID`
   - `FORMSPREE_BUILD_ID`
   - `FORMSPREE_PORTFOLIO_ID`
3. Confirm and update `href="#"` links for CoreCreatorsAI and OptimizeAI Tool Suite (search for `data-needs-url="true"` to find them)

**To deploy:**
```bash
git push origin main
```
GitHub Pages will rebuild automatically. Changes live at https://vibeworksstudio.ai within ~60 seconds.
