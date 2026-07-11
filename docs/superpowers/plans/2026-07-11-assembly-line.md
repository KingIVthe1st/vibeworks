# The Assembly Line — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild vibeworksstudio.ai as a one-page, scroll-scrubbed cinematic WebGL experience ("The Assembly Line") per the approved spec at `docs/superpowers/specs/2026-07-11-assembly-line-redesign-design.md`.

**Architecture:** DOM-first semantic one-pager (complete without JS) with a single persistent three.js canvas behind it. GSAP ScrollTrigger + Lenis scrub one master timeline; a camera rides a keyframed path through 9 "acts," each act a self-contained scene module implementing a shared `Act` interface. Quality tiers adapt fidelity (never narrative) per device.

**Tech Stack:** Vite 6 + vanilla TypeScript, three.js, GSAP (ScrollTrigger + SplitText, free since 3.13), Lenis, Fontsource (self-hosted fonts), Vitest (logic units), sharp (image pipeline), GitHub Actions → GitHub Pages.

## Global Constraints

- Repo: `~/Documents/💻 Dev Projects/vibeworkscursor`, branch `redesign/assembly-line`. **NEVER push to `main` until final ship task** — pushes to `main` auto-deploy the live site.
- Host stays **GitHub Pages** (Cloudflare is CDN only). No underscore-prefixed files in output; ship `.nojekyll`. `_redirects` at root is dead weight — delete it.
- Stripe Payment Links **verbatim, live-mode only**: Essentials $250/mo `https://buy.stripe.com/5kQ8wQ8D38t0197cif8EM02` · Growth $500/mo `https://buy.stripe.com/14A9AU9H74cKg412HF8EM03`. No other money copy changes. `thank-you.html` must remain reachable at exactly `/thank-you.html` (Stripe checkout return) with `?plan=` personalization intact.
- Contact is **mailto-primary** (`info@vibeworksstudio.ai`). No forms without a real endpoint (honest-degrade).
- Honest proof only: `8 live products · 500K+ reach · 2-wk avg delivery · 5 verticals`. Never invent MRR/DAU/testimonials.
- Positioning/copy: keep "AI platforms, shipped like products."; adapt existing page copy to the acts; anti-hype, no income claims.
- **Mobile parity is a hard requirement:** all 9 acts on mobile, portrait-recomposed camera, touch-tuned; fidelity adapts, narrative never does.
- Accessibility: real DOM text for all content, heading order, contrast ≥ AA, `prefers-reduced-motion` → fully static complete page, tap targets ≥ 44px.
- Type: Bricolage Grotesque (display) / Plus Jakarta Sans (body) / IBM Plex Mono (mono) — self-hosted via Fontsource, no Google Fonts requests.
- Palette tokens: base `#070512` family · violet structure `#7C5CFF` · gold rare accent `#E8B34B` (≤2 uses per viewport) · live green `#3DDC84` · text `#F4F2FF` / muted `#AEB4C2`.
- Performance: JS ≤ ~300KB gz total, LCP is DOM text < 2.5s, textures WebP lazy-loaded per act, DPR clamped ≤ 2.
- Two **Ivan mockup gates**: after Task 6 (hero) and Task 8 (BUILD station). Do not proceed past a gate without explicit approval.

---

### Task 1: Scaffold Vite + TypeScript on the branch

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `.gitignore` (update), `src/main.ts`, `index.html` (replaces old)
- Delete: `_redirects`, `nanobanana-output/` (empty dir), old root pages `about.html ai-agents.html contact.html platforms.html services.html support.html ventures.html` (their content is ported in Task 3; git history preserves them)
- Move: `styles.css script.js` → deleted (superseded); `images/` stays for now (Task 5 converts); `CNAME`, `manifest.json`, `thank-you.html` → `public/`

**Interfaces:**
- Produces: `npm run dev` (serves), `npm run build` (outputs `dist/` with `CNAME` + `.nojekyll`), `npm test` (Vitest)

- [ ] **Step 1: Init package + deps**

```bash
cd "$HOME/Documents/💻 Dev Projects/vibeworkscursor"
npm init -y
npm i three gsap lenis
npm i -D typescript vite vitest @types/three sharp
npm i @fontsource-variable/bricolage-grotesque @fontsource/plus-jakarta-sans @fontsource/ibm-plex-mono
```

- [ ] **Step 2: Write configs**

`vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        thankyou: resolve(__dirname, 'thank-you.html'),
      },
    },
  },
})
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020", "module": "ESNext", "moduleResolution": "bundler",
    "strict": true, "noEmit": true, "types": ["vite/client"]
  },
  "include": ["src"]
}
```

`package.json` scripts:
```json
"scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview", "test": "vitest run" }
```

Append to `.gitignore`: `node_modules/`, `dist/`.

- [ ] **Step 3: Restructure files**

```bash
git rm _redirects about.html ai-agents.html contact.html platforms.html services.html support.html ventures.html styles.css script.js
mkdir -p public src
git mv CNAME manifest.json public/
# thank-you.html stays at repo root untouched (second Vite entry)
rmdir nanobanana-output   # untracked empty dir
printf '' > public/.nojekyll
```
Write a minimal placeholder `index.html` (`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>VibeWorks</title></head><body><h1>scaffold</h1><script type="module" src="/src/main.ts"></script></body></html>`) and `src/main.ts` (`console.log('assembly line scaffold')`).

- [ ] **Step 4: Verify build output contains CNAME + .nojekyll + both pages**

```bash
npm run build && ls dist/ && cat dist/CNAME
```
Expected: `index.html`, `thank-you.html`, `.nojekyll`, `CNAME` containing `vibeworksstudio.ai`.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "chore: scaffold Vite+TS, restructure for one-page build"`

---

### Task 2: Design tokens, base styles, self-hosted fonts

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`
- Modify: `src/main.ts` (import fonts + css)

**Interfaces:**
- Produces: CSS custom props consumed by every later task: `--bg --bg-2 --violet --gold --green --txt --txt-mute --font-display --font-body --font-mono --space-1..8 --dur-1..3 --ease-out-expo --radius-1..2 --z-nav --z-canvas --z-content`

- [ ] **Step 1: Write tokens.css** (complete scales, exact palette from Global Constraints; fluid type via `clamp()`: `--fs-hero: clamp(2.6rem, 8.5vw, 7rem)`, `--fs-h2: clamp(1.9rem, 4.5vw, 3.4rem)`, `--fs-body: clamp(1rem, 1.1vw, 1.125rem)`, `--fs-mono: clamp(.72rem, .9vw, .82rem)`).
- [ ] **Step 2: Write base.css** — reset, `body{background:var(--bg);color:var(--txt);font-family:var(--font-body)}`, canvas fixed full-viewport at `z-index:var(--z-canvas)`, `.act` content sections at `--z-content`, focus-visible ring in violet, selection style, `@media (prefers-reduced-motion: reduce){ .reveal{opacity:1 !important; transform:none !important} }`.
- [ ] **Step 3: Import in main.ts**

```ts
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import './styles/tokens.css'
import './styles/base.css'
```

- [ ] **Step 4: Verify** — `npm run build && grep -rl 'woff2' dist/assets | head -3` → font files bundled locally; `grep -c 'fonts.googleapis' dist/index.html` → `0`.
- [ ] **Step 5: Commit** — `git commit -am "feat: design tokens, base styles, self-hosted fonts"`

---

### Task 3: The complete DOM content layer (the no-JS page IS the site)

**Files:**
- Create: `src/styles/sections.css`
- Modify: `index.html` (full semantic page)

**Interfaces:**
- Produces: section ids consumed by nav, stubs, and scroll system: `#hero #design #platforms #agents #process #studio #support #start`. Data hooks for scroll/scene tasks: every animated text node gets `data-reveal`; each section `<section class="act" data-act="hero" id="hero">`.

- [ ] **Step 1: Write the full page.** Structure (copy ported and tightened from the deleted pages — git show `main:index.html`, `main:services.html`, `main:support.html`, `main:about.html`, `main:ai-agents.html` for source copy):
  - `<nav>`: logo, anchor links `Platforms(#platforms) Agents(#agents) Process(#process) Studio(#studio) Support(#support)`, CTA `Start a build(#start)`, hamburger for mobile.
  - `#hero`: pill `2 client spots open · Q3 2026`; `<h1>AI platforms,<br><span class="grad">shipped like products.</span></h1>`; sub (verbatim from old hero); CTAs `Book a build call → mailto:info@vibeworksstudio.ai?subject=Build%20call` + `See the work → #platforms`; scroll cue.
  - `#design` (DESIGN station): mono kicker `01 — DESIGN`, h2 `From napkin to locked spec in days.`, 2 short paras from services.html discovery copy.
  - `#platforms` (BUILD station): kicker `02 — BUILD`, h2 `The work that proves the studio.`; three `<article class="platform" data-platform="atomicity|growthos|robin">` blocks, each: name, tag, desc, chips, `Visit →` external link (atomicitypro.com, growthos link n/a → omit, robinaiagent.com), and `<img>` of real UI (from Task 5 WebP set, `loading="lazy"`).
  - `#agents`: kicker `03 — AGENTS`, h2 `Fleets that work while you sleep.`, condensed ai-agents.html pitch (3 capability cards max).
  - `#process` (DEPLOY act DOM): kicker `04 — DEPLOY`, proof strip `8 live products · 500K+ reach · 2-wk avg · 5 verticals` as `<dl>`; then `Three ways to plug in` — Build / Partner / Agents cards (from services.html, 2 lines each).
  - `#studio`: kicker `05 — THE OPERATORS`, Ivan (build) + Natasha (distribution) with `images/ivan.webp natasha.webp`, one strong line each (port from about.html).
  - `#support`: kicker `06 — KEEP IT RUNNING`, h2 `A shipped machine needs an operator.`; two plan cards **with the exact Stripe hrefs from Global Constraints**; Growth marked `Most Popular`; bullet lists ported from support.html; small print `Cancel anytime.`
  - `#start`: h2 `Yours is next.`; big mailto CTA; `info@vibeworksstudio.ai` text link; availability pill repeated.
  - `<footer>`: logo, anchors, email, `© 2026 VibeWorks`.
  - Head: canonical, full meta/OG/twitter ported from old index (og:image `images/social-card.png`), `theme-color #070512`, JSON-LD `Organization` (name, url, email, founders Ivan Jackson & Natasha Burton).
- [ ] **Step 2: Write sections.css** — editorial layout for every section, mobile-first: single column w/ generous `--space` rhythm, desktop grid (`minmax(0,1fr) minmax(0,1fr)` for feature rows), platform images in device-frame cards, plan cards, footer. This must look **finished** with JS disabled — it is the fallback experience.
- [ ] **Step 3: Verify no-JS completeness** — `npm run build && npm run preview`; open in browser with JS disabled; every section readable, images load, both Stripe links present:
```bash
grep -c 'buy.stripe.com/5kQ8wQ8D38t0197cif8EM02\|buy.stripe.com/14A9AU9H74cKg412HF8EM03' dist/index.html
```
Expected: `2`.
- [ ] **Step 4: Commit** — `git commit -am "feat: complete semantic one-page DOM layer (no-JS complete)"`

---

### Task 4: Scroll system — Lenis + ScrollTrigger master timeline + logic units

**Files:**
- Create: `src/scroll/scroll.ts`, `src/scroll/progress.ts`, `src/scroll/reveals.ts`, `tests/progress.test.ts`

**Interfaces:**
- Produces: `initScroll(onProgress: (p: number) => void): void` (Lenis + one ScrollTrigger scrubbing 0..1 over full document); `localProgress(global: number, range: [number, number]): number` (clamped 0..1); `initReveals(): void` (SplitText line reveals on `[data-reveal]`, scroll-linked, skipped under reduced motion).
- Consumes: `data-reveal` hooks from Task 3.

- [ ] **Step 1: Write failing tests**

```ts
// tests/progress.test.ts
import { describe, it, expect } from 'vitest'
import { localProgress } from '../src/scroll/progress'

describe('localProgress', () => {
  it('is 0 before the range', () => expect(localProgress(0.1, [0.2, 0.5])).toBe(0))
  it('is 1 after the range', () => expect(localProgress(0.9, [0.2, 0.5])).toBe(1))
  it('interpolates inside the range', () => expect(localProgress(0.35, [0.2, 0.5])).toBeCloseTo(0.5))
  it('handles zero-width range without NaN', () => expect(localProgress(0.3, [0.3, 0.3])).toBe(1))
})
```

- [ ] **Step 2: Run** `npm test` → FAIL (module not found).
- [ ] **Step 3: Implement**

```ts
// src/scroll/progress.ts
export function localProgress(global: number, [a, b]: [number, number]): number {
  if (b <= a) return global >= a ? 1 : 0
  return Math.min(1, Math.max(0, (global - a) / (b - a)))
}
```

```ts
// src/scroll/scroll.ts
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initScroll(onProgress: (p: number) => void): void {
  gsap.registerPlugin(ScrollTrigger)
  const lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  ScrollTrigger.create({
    trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (self) => onProgress(self.progress),
  })
}
```

`reveals.ts`: SplitText into lines, `gsap.from(lines, {yPercent:110, opacity:0, stagger:0.06, ease:'expo.out', scrollTrigger:{trigger: el, start:'top 80%'}})`; guard: `if (matchMedia('(prefers-reduced-motion: reduce)').matches) return`.

- [ ] **Step 4: Run** `npm test` → PASS. Wire `initScroll(console.log)` + `initReveals()` in `main.ts`, `npm run dev`, confirm smooth scroll + text reveals in browser.
- [ ] **Step 5: Commit** — `git commit -am "feat: Lenis+ScrollTrigger scrub, progress math (tested), text reveals"`

---

### Task 5: Image pipeline — WebP textures & page images

**Files:**
- Create: `scripts/images.mjs`
- Create (output): `public/images/*.webp` (platform UIs, founders, social card passthrough)

- [ ] **Step 1: Write sharp script** converting `images/**/*.{png,jpg}` → `public/images/<name>.webp` (quality 82, max width 1600 for platform shots, 800 for portraits). Keep `social-card.png` as PNG copy (OG scrapers prefer png/jpg).
- [ ] **Step 2: Run** `node scripts/images.mjs && ls -la public/images/` → all WebPs present, total < 2MB.
- [ ] **Step 3: Point DOM `<img>` srcs at the WebPs; remove old `images/` from git** (`git rm -r images/` after confirming all converted; sources recoverable from `main`).
- [ ] **Step 4: Verify** `npm run build` + preview: images render, no 404s in console.
- [ ] **Step 5: Commit** — `git commit -am "feat: WebP image pipeline (18MB→<2MB)"`

---### Task 6: WebGL stage + Act 1 HERO (idea-particle) → **IVAN GATE 1**

**Files:**
- Create: `src/scene/types.ts`, `src/scene/quality.ts`, `src/scene/stage.ts`, `src/scene/camera.ts`, `src/scene/acts/hero.ts`, `tests/quality.test.ts`

**Interfaces:**
- Produces:
```ts
// src/scene/types.ts
import type { Scene, PerspectiveCamera, WebGLRenderer } from 'three'
export interface QualityTier { name: 'high'|'mid'|'low'; dpr: number; instances: number; bloom: boolean }
export interface Stage { scene: Scene; camera: PerspectiveCamera; renderer: WebGLRenderer; tier: QualityTier; portrait: boolean }
export interface Act { id: string; range: [number, number]; init(stage: Stage): void; update(local: number, dt: number): void }
```
`pickTier(opts: {mobile: boolean; dpr: number; lowPower: boolean}): QualityTier`; `createStage(canvas: HTMLCanvasElement): Stage | null` (null when WebGL unavailable → DOM-only mode); `createCameraRig(stage, keyframes)` — CatmullRom position + lookAt curves, **two keyframe sets (landscape/portrait)** chosen by aspect, `rig.scrub(globalProgress)`.
- Consumes: `initScroll` from Task 4, tokens from Task 2.

- [ ] **Step 1: Failing tests for pickTier**

```ts
import { pickTier } from '../src/scene/quality'
it('desktop high-dpr → high', () => expect(pickTier({mobile:false, dpr:2, lowPower:false}).name).toBe('high'))
it('mobile → mid with dpr clamp ≤2', () => { const t = pickTier({mobile:true, dpr:3, lowPower:false}); expect(t.name).toBe('mid'); expect(t.dpr).toBeLessThanOrEqual(2) })
it('lowPower → low, no bloom', () => expect(pickTier({mobile:true, dpr:2, lowPower:true})).toMatchObject({name:'low', bloom:false}))
```

- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implement quality.ts** (`high: dpr min(dpr,2), instances 1.0×, bloom true` / `mid: dpr min(dpr,2), 0.5×, bloom false` / `low: dpr 1, 0.25×, bloom false`; lowPower = `navigator.getBattery?` unavailable → use `hardwareConcurrency <= 4` heuristic + `mobile`). `npm test` → PASS.
- [ ] **Step 4: Implement stage.ts** — renderer (`antialias: tier !== 'low'`, `powerPreference:'high-performance'`), fixed canvas behind content, resize handler updating `portrait = h > w` and camera aspect, rAF render loop driven by gsap ticker.
- [ ] **Step 5: Implement hero act.** The idea-particle: a `Points`-based luminous core — custom `ShaderMaterial` (additive blending, soft radial falloff `smoothstep(0.5, 0.0, dist)`, violet→white core, gentle noise-driven drift in vertex shader via `uTime`), surrounded by `tier.instances × 400` dust motes (instanced quads, parallax at different depths). Camera keyframes: slow 12° orbit at radius 6 (landscape) / radius 8.5 recentered (portrait). `update(local)`: orbit advances with `local`, particle brightness eases up as hero exits (it's about to enter the machine).
- [ ] **Step 6: Wire main.ts** — capability check, `createStage`, register hero act with range `[0, 0.12]`, route `initScroll` progress → camera rig + `act.update(localProgress(...))`. Reduced-motion or null stage → skip entirely (DOM page already complete).
- [ ] **Step 7: 🔴 IVAN GATE 1** — `npm run dev`; screenshot desktop 1440×900 AND mobile 390×844 (Claude-in-Chrome); self-critique against the bar first (blackness must feel expensive: check banding, particle falloff, type contrast against glow), fix obvious flaws, re-shoot, THEN present both shots to Ivan for approval. **Do not start Task 7 without approval.**
- [ ] **Step 8: Commit** — `git commit -am "feat: WebGL stage, quality tiers (tested), camera rig, hero idea-particle"`

---

### Task 7: Act 2 — DESIGN station (blueprint forms around the particle)

**Files:**
- Create: `src/scene/acts/design.ts`

**Interfaces:**
- Consumes: `Act`, `Stage`, camera rig keyframes at range `[0.12, 0.24]`.
- Produces: registered act `design`.

- [ ] **Step 1: Build the blueprint.** A wireframe product-shape (rounded-box + panel planes) from `EdgesGeometry` + `LineBasicMaterial` (violet, 45% opacity) with vertices revealed progressively: store line segments, scale `drawRange` by eased `local` (`count = floor(total × easeInOutCubic(local))`) so the blueprint *draws itself* around the arriving particle. Add 3 mono-labeled measurement callouts as DOM overlays (`.callout` absolutely positioned via `Vector3.project()` each frame, hidden on `low` tier).
- [ ] **Step 2: Camera** dollies from hero orbit into a 3/4 overhead drafting angle; portrait set frames the blueprint tall.
- [ ] **Step 3: Verify** in dev: scrub 10-25% back and forth — draw-in is smooth both directions (scrub-safe: everything derives from `local`, no one-shot tweens). Check 390×844.
- [ ] **Step 4: Commit** — `git commit -am "feat: DESIGN act — self-drawing blueprint"`

---

### Task 8: Act 3 — BUILD station (three monitors, real UI) → **IVAN GATE 2**

**Files:**
- Create: `src/scene/acts/build.ts`, `src/scene/textures.ts`

**Interfaces:**
- Produces: `loadActTextures(urls: string[]): Promise<Texture[]>` (lazy, `TextureLoader`, SRGB, anisotropy 4) — reused by later acts.
- Consumes: WebP platform shots from Task 5; range `[0.24, 0.52]` (the longest act; sub-ranges per platform: atomicity `[0.24,0.34]`, growthos `[0.33,0.43]`, robin `[0.42,0.52]` — 0.01 overlap for crossfade).

- [ ] **Step 1: Monitor rig.** Three floating "workshop monitors": plane (16:10) with the real UI texture, thin emissive violet frame (`BoxGeometry` shell), subtle screen-glow plane behind (additive). Each boots when its sub-range starts: scanline wipe reveal in the plane's `ShaderMaterial` (mix texture with dark by `step(uv.y, bootProgress)` + 0.02 glow line at the edge) — the UI *turns on*, not fades in.
- [ ] **Step 2: Camera** tracks laterally monitor→monitor (landscape); portrait: monitors stacked in depth, camera pushes forward through them. DOM copy blocks for each platform (already in `#platforms`) pin alongside via ScrollTrigger `pin` on desktop, natural flow on mobile.
- [ ] **Step 3: Texture memory** — dispose act textures when scroll leaves `[0.2, 0.56]` on `low`/`mid` tiers.
- [ ] **Step 4: 🔴 IVAN GATE 2** — dev screenshots of the Atomicity monitor beat, desktop + mobile; self-critique loop first (legibility of real UI, glow discipline, copy/monitor composition), then present to Ivan. **Do not proceed without approval.**
- [ ] **Step 5: Commit** — `git commit -am "feat: BUILD act — booting monitors with real product UI"`

---

### Task 9: Act 4 — AGENTS (worker-drones)

**Files:**
- Create: `src/scene/acts/agents.ts`

**Interfaces:**
- Consumes: range `[0.52, 0.62]`.

- [ ] **Step 1:** `InstancedMesh` of `tier.instances × 24` small octahedron drones with emissive green status dots, each on its own Lissajous orbit (`pos = center + [sin(a·t+φ)·rx, sin(b·t)·ry, cos(a·t+φ)·rz]`, per-instance seeds) attending the assembled product from Act 2/3. Drones ease in from the edges as `local` grows; one drone occasionally "docks" (lerps to the product, pulses gold once — the single gold accent this viewport).
- [ ] **Step 2:** Camera pulls to a wide observing shot; portrait frames vertical swarm.
- [ ] **Step 3: Verify** scrub-safety + 60fps with devtools performance overlay on `mid` tier emulation.
- [ ] **Step 4: Commit** — `git commit -am "feat: AGENTS act — attendant drone swarm"`

---

### Task 10: Act 5 — DEPLOY (edge network + globe grid)

**Files:**
- Create: `src/scene/acts/deploy.ts`

**Interfaces:**
- Consumes: range `[0.62, 0.74]`; `loadActTextures` not needed (procedural).

- [ ] **Step 1:** Sphere of `tier.instances × 900` points (fibonacci-sphere distribution, violet, size-attenuated) as the globe grid; 12 precomputed great-circle arcs (`QuadraticBezierCurve3` via lifted midpoints → `TubeGeometry` radius 0.008). The product (a bright packet) streaks along arc[0..n] sequenced by `local`; each arrival flares a node green (`live`) with a 0.4s ease-out pulse. By `local=1`, 8 nodes burn steady green — matching "8 products live."
- [ ] **Step 2:** DOM proof strip + "Three ways to plug in" cards reveal alongside (already in `#process`).
- [ ] **Step 3: Verify** both orientations; node flares readable at 390px.
- [ ] **Step 4: Commit** — `git commit -am "feat: DEPLOY act — edge network goes live"`

---

### Task 11: Acts 6–8 — OPERATORS, SUPPORT, SHIPPED (DOM-led with scene support)

**Files:**
- Create: `src/scene/acts/finale.ts`
- Modify: `src/styles/sections.css` (polish pass on `#studio #support #start`)

**Interfaces:**
- Consumes: ranges — operators `[0.74, 0.84]`, support `[0.84, 0.92]`, shipped `[0.92, 1.0]`.

- [ ] **Step 1: Operators beat** — scene recedes (camera pull-back, machine miniaturizes into the background — "the machine is two people"); DOM founder cards take focus with treated WebP portraits (duotone violet via CSS `filter` + blend overlay).
- [ ] **Step 2: Support beat** — ambient hum only (dim drones patrol the miniature machine); plan cards front and center, Stripe hrefs verbatim, Growth "Most Popular" tag in gold (the viewport's one gold use).
- [ ] **Step 3: Shipped beat** — the packet from Act 5 returns, descends to a landing pad that draws itself (reuse blueprint line technique from Task 7), settles, and its glow hands off (position-matched) to the `#start` CTA block's box-shadow. `"Yours is next."`
- [ ] **Step 4: Verify** full-page scroll end-to-end, desktop + mobile, no dead zones (every 0.05 of progress shows visible intent).
- [ ] **Step 5: Commit** — `git commit -am "feat: finale acts — operators, support, shipped handoff"`

---

### Task 12: Loader (real asset gate)

**Files:**
- Create: `src/ui/loader.ts`
- Modify: `src/main.ts`, `index.html` (loader markup, inline-critical CSS in head)

- [ ] **Step 1:** Loader overlay: brand mark assembles from ~80 CSS-transformed particles (DOM spans, no WebGL dependency), progress = real `Promise.all` over: hero act ready, fonts (`document.fonts.ready`), first-viewport images. Hard cap 1.5s (`Promise.race` with timeout) — assets still loading stream in after; never block longer.
- [ ] **Step 2:** Reduced-motion: loader is a single fade, ≤300ms.
- [ ] **Step 3: Verify** cold-load with devtools "Slow 4G": page interactive < 3s, loader never exceeds 1.5s, no layout shift when it lifts (hero DOM occupies space beneath).
- [ ] **Step 4: Commit** — `git commit -am "feat: real-gate assembling loader (1.5s cap)"`

---

### Task 13: Fallback matrix verification

**Files:**
- Modify: `src/main.ts` (final guard order), `src/styles/base.css` (`.static` mode)

- [ ] **Step 1:** Guard order in `main.ts`: (1) reduced-motion → static page, reveals visible, no canvas, no Lenis; (2) `createStage` null (no WebGL) → DOM page + reveals + native scroll; (3) tier low/mid/high → full film at adapted fidelity.
- [ ] **Step 2: Verify each row** (Chrome devtools): reduced-motion emulation; WebGL blocked (`--disable-webgl` or override); mobile mid-tier; JS fully disabled (content complete from Task 3). Screenshot each; all four must look intentional, not broken.
- [ ] **Step 3: Commit** — `git commit -am "feat: fallback matrix — static, no-WebGL, tiered"`

---

### Task 14: Redirect stubs + thank-you restyle

**Files:**
- Create: `public/platforms.html`, `public/ai-agents.html`, `public/services.html`, `public/about.html`, `public/contact.html`, `public/support.html`, `public/ventures.html`
- Modify: `thank-you.html`

- [ ] **Step 1: Stub template** (exact mapping from spec §7): each file:
```html
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>VibeWorks</title><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0;url=/#platforms">
<script>location.replace('/#platforms')</script></head>
<body><p>Moved — <a href="/#platforms">continue to VibeWorks</a>.</p></body></html>
```
Anchor per file: platforms→`#platforms` · ai-agents→`#agents` · services→`#process` · about→`#studio` · support→`#support` · contact→`#start` · ventures→`#platforms`.
- [ ] **Step 2: Restyle thank-you.html** with tokens/base css (Vite entry already wired in Task 1); **preserve the `?plan=` personalization script logic verbatim** from the old file (git show `main:thank-you.html`); keep it self-contained and calm (no film).
- [ ] **Step 3: Verify** — `npm run build`; `ls dist/*.html` shows 9 files; open `dist/support.html` via preview → lands on `/#support`; `thank-you.html?plan=growth` personalizes.
- [ ] **Step 4: Commit** — `git commit -am "feat: legacy URL stubs + thank-you restyle (?plan preserved)"`

---

### Task 15: SEO/a11y/perf pass

**Files:**
- Modify: `index.html`, styles as needed

- [ ] **Step 1:** Verify heading order (one h1, sequential h2s), landmarks (`nav main footer`), alt text on every img, `aria-current` on nav anchors via scroll spy, contrast spot-check muted text ≥ AA.
- [ ] **Step 2:** `npm run build` → check bundle: `du -sh dist/assets/*.js` total gz ≤ ~300KB (`gzip -c dist/assets/*.js | wc -c`). If over: verify three.js tree-shaking (import from `three` selectively), drop unused gsap plugins.
- [ ] **Step 3:** Lighthouse (Chrome devtools, mobile emulation) on preview: Performance ≥ 90 target, a11y ≥ 95, SEO ≥ 95. Fix regressions found.
- [ ] **Step 4: Commit** — `git commit -am "chore: SEO/a11y/perf pass — budgets enforced"`

---

### Task 16: Design-critic QA loop (until pinnacle, pre-deploy)

- [ ] **Step 1:** Serve `npm run preview`. Dispatch the `design-critic` agent at `http://localhost:4173` — full scroll, desktop 1440 + mobile 390 screenshots per act.
- [ ] **Step 2:** Fix every critique ranked P0/P1; re-shoot; **loop** (not one pass) until the critic returns no P0/P1 and the "skeptical founder is stunned" gut test passes on BOTH viewports.
- [ ] **Step 3:** Commit each loop iteration — `git commit -am "polish: design-critic loop N"`

---

### Task 17: Deploy — Actions workflow, Pages flip, live smoke

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Workflow**

```yaml
name: Deploy
on: { push: { branches: [main] }, workflow_dispatch: {} }
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci && npm test && npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Push branch, verify CI builds green on the branch** (add temporary `push: branches: [redesign/assembly-line]` trigger, confirm build job passes, then remove the temp trigger).
- [ ] **Step 3: Flip Pages source** — `gh api -X PUT repos/KingIVthe1st/vibeworks/pages -f build_type=workflow` (reversible: `-f build_type=legacy`). Confirm with Ivan immediately before this step + the merge (the one irreversible-ish moment).
- [ ] **Step 4: Merge to main** (`git checkout main && git merge redesign/assembly-line && git push origin main`), watch the run: `gh run watch`.
- [ ] **Step 5: LIVE SMOKE (real customer path, not proxies)** — Claude-in-Chrome on `https://vibeworksstudio.ai`: film scrubs on desktop; mobile viewport all 9 acts; both Stripe links reach live Stripe checkout pages; `/support.html` redirects to `/#support`; `/thank-you.html?plan=essentials` personalizes; hard-refresh with cache disabled (Cloudflare CDN may need cache purge — if stale, purge via CF dashboard or wait TTL).
- [ ] **Step 6: Commit/record** — update memory (`project_vibeworks_studio_site.md`): new architecture, Actions deploy, one-page structure, stub map.

---

## Self-Review (completed)

1. **Spec coverage:** all spec sections map — 9 acts (Tasks 6–12), mobile parity (portrait keyframes in every act task + gates shoot 390×844), DOM-first (T3), tech (T1/T4/T6), deploy+stubs+thank-you (T14/T17), design system (T2), verification (gates in T6/T8, matrix T13, critic T16, live smoke T17), out-of-scope respected (no form backend, no money changes).
2. **Placeholder scan:** none — every step has code, commands, or an exact source pointer (`git show main:<file>`) for ported copy.
3. **Type consistency:** `Act`/`Stage`/`QualityTier`/`localProgress`/`pickTier`/`createStage`/`loadActTextures` used consistently across Tasks 4–11.
