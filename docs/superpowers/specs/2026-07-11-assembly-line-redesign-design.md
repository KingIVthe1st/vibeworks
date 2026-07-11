# VibeWorks Studio — "The Assembly Line" Redesign Spec

**Date:** 2026-07-11
**Codename:** The Assembly Line
**Repo:** `~/Documents/💻 Dev Projects/vibeworkscursor` → GitHub `KingIVthe1st/vibeworks` → GitHub Pages (Cloudflare CDN in front)
**Status:** Design approved by Ivan 2026-07-11 (with mobile-parity amendment). Pending spec review → implementation plan.

---

## 1. Goal

Rebuild vibeworksstudio.ai as a **single-page, scroll-driven cinematic experience** — the most scroll-stopping, interactive site we can build — so that any prospect who scrolls it concludes, without being told, that VibeWorks operates at an elite level of technical and design mastery. The site is the studio's sales proof: the medium is the evidence.

**Success means:** a buyer lands, scrolls, feels "these people build real products, fast and beautifully," and books a build call. On ANY device.

## 2. The one idea

**Scrolling the page IS watching the studio work.** One persistent WebGL scene, one camera, scroll-scrubbed like a single-take film: an idea enters as a particle of light, is designed, built, deployed, and shipped — ending with *"Yours is next."*

## 3. Locked decisions

| Decision | Choice | Consequence |
|---|---|---|
| Positioning & copy | **Keep** "AI platforms, shipped like products" + the 3 flagship platforms narrative (June 29 repositioning stands) | Copy adapted to the film's beats, sharpened where the design demands — no narrative rewrite |
| Page architecture | **One page.** Everything on the homepage | Old pages → meta-refresh stubs to `/#anchor`; `thank-you.html` remains a real page (Stripe checkout return), restyled to match |
| Creative direction | **The Assembly Line** (chosen over Command Center, Foundry) | One signature system; the 2022-AI-kit (aurora, custom cursor, magnetic buttons) is deleted |
| Tech | **Vite + vanilla TypeScript + three.js + GSAP ScrollTrigger + Lenis** | Build step required → GH Pages source flips to GitHub Actions (one-time, reversible) |
| **Mobile parity (Ivan's amendment)** | **Mobile must be just as amazing as desktop** — a first-class tuned experience, NOT a degraded fallback | Same acts, same narrative; portrait-framed camera work, touch-tuned interactions, adaptive quality tiers that preserve the wow |
| Money flows | Stripe Payment Links used **verbatim** (Essentials $250/mo `buy.stripe.com/5kQ8wQ8D38t0197cif8EM02`, Growth $500/mo `buy.stripe.com/14A9AU9H74cKg412HF8EM03`) | Zero customer-facing money changes; `thank-you.html` URL preserved |
| Contact | **Mailto-primary** (`info@vibeworksstudio.ai`) | The current Formspree placeholder form 404s — no decorative forms ship. Real form = future move (Formspree ID from Ivan, or CF Worker) |
| Proof model | Reach-only, honest numbers (8 live, 500K+ reach, 2-wk avg, 5 verticals) | Never invent MRR/DAU/testimonial attribution |
| Host | **GitHub Pages stays** | No DNS/hosting migration risk; CNAME untouched |

## 4. Scroll script — 9 acts (~9 viewport-heights desktop; mobile choreography tuned to same beats)

| # | Act | Scene (WebGL) | DOM content |
|---|---|---|---|
| 0 | **Loader** | Brand mark assembles from particles. Real asset gate, <1.5s, never fake | — |
| 1 | **HERO** | Black void; one luminous idea-particle drifts; camera slowly orbits | H1 "AI platforms, shipped like products." · sub · availability pill · CTAs (Book a build call / see the work) · scroll cue |
| 2 | **DESIGN station** | Particle pulled in; wireframe blueprint forms around it in 3D | Discovery → locked spec in days, not quarters |
| 3 | **BUILD station** (longest) | Three 3D monitor panels boot in sequence with real product UI textures | Atomicity → GrowthOS → Robin Trade: pitch line, chips, live link each (pinned beat per platform) |
| 4 | **AGENTS** | Worker-drones orbit the line, attending it 24/7 | AI agent fleets pitch — works while you sleep |
| 5 | **DEPLOY** | Product streaks along an edge network; nodes flare LIVE on a globe grid | Proof strip (8 live · 500K+ reach · 2 wks · 5 verticals) + "Three ways to plug in" (Build / Partner / Agents) |
| 6 | **THE OPERATORS** | Camera pulls back — the machine is two people | Ivan + Natasha, treated photos, one strong line each |
| 7 | **KEEP IT RUNNING** | The shipped machine hums; maintenance framing | Support plans: Essentials $250/mo · Growth $500/mo (Most Popular) — live Stripe links verbatim |
| 8 | **SHIPPED / CTA** | Finished product settles onto a landing pad | "Yours is next." · Book a build call (mailto) · email · availability pill |

**Nav:** fixed minimal bar, anchor links (Platforms · Agents · Process · Studio · Support · **Start a build**). Every act reachable directly — nobody is hostage to the choreography.

## 5. Mobile-parity requirements (first-class, per Ivan)

- Same 9 acts, same narrative — **no act is cut on mobile.**
- Camera framing recomposed for portrait (subjects fill the tall frame; type scales via `clamp()`).
- Touch-native: scroll scrubbing works with momentum; tap targets ≥44px; no hover-dependent content (hover reveals have tap equivalents).
- Adaptive quality tiers (device-capability detection: DPR clamp, instance counts, shader complexity) — the *fidelity* adapts, the *experience* does not.
- QA loop runs mobile viewport (390×844) with the same rigor as desktop; both must pass the "would a skeptical founder be stunned" bar.

## 6. Tech architecture

```
vibeworkscursor/
  src/
    main.ts               # boot, capability detection, loader gate
    scene/                # three.js: one persistent canvas
      stage.ts            # renderer, camera, scroll-scrub camera path
      acts/               # one module per act (particle, blueprint, monitors,
                          #   drones, network, landing)
    scroll/               # Lenis + GSAP ScrollTrigger master timeline
    ui/                   # DOM layer: nav, sections, reveals (SplitText)
    styles/               # tokens.css, base.css, sections.css
  public/                 # CNAME, images (WebP), fonts (WOFF2), og, manifest,
                          #   redirect stubs, thank-you.html assets
  index.html              # full semantic DOM content (SEO/no-JS complete)
  thank-you.html          # real page, restyled
  .github/workflows/deploy.yml   # Vite build → actions/deploy-pages
```

- **DOM-first:** every word of copy is real, semantic HTML above the canvas. No-JS / no-WebGL / reduced-motion users get a complete, beautiful static page. The film is enhancement, never the content.
- **Scroll-scrub, not hijack:** animation progress = scroll position (user always in control; no forced autoplay waits).
- Textures: platform screenshots as WebP, lazy-loaded per act. Fonts self-hosted WOFF2, preloaded (kills render-blocking Google Fonts).
- `prefers-reduced-motion` → static composed layout, zero scrubbing.
- Performance budget: DOM-text LCP < 2.5s; total JS ≤ ~300KB gz (three.js included); 60fps target desktop, stable 60 on modern phones via quality tiers.
- SEO/a11y: semantic landmarks, heading order, JSON-LD Organization, existing meta/OG carried over, focus-visible styles, contrast ≥ AA.

## 7. Deploy & URL survival

1. GitHub Actions workflow: `vite build` → `actions/deploy-pages`. **One-time settings flip**: Pages source "branch" → "GitHub Actions" (reversible).
2. `CNAME` (`vibeworksstudio.ai`) preserved in build output. DNS untouched.
3. Redirect stubs (meta-refresh + JS, the GH Pages-safe pattern already used by `ventures.html`), explicit mapping: `platforms.html`→`/#platforms` · `ai-agents.html`→`/#agents` · `services.html`→`/#process` · `about.html`→`/#studio` · `support.html`→`/#support` · `contact.html`→`/#start` · `ventures.html`→`/#platforms`.
4. `thank-you.html` ships as a real page at its exact URL (Stripe checkout return), restyled to the new system, `?plan=` personalization preserved.
5. Branch previews: build validated locally + via Actions artifact before the Pages flip; merge to `main` only after Ivan-approved mockup checkpoints.

## 8. Design system

- **Type:** Bricolage Grotesque (display) / Plus Jakarta Sans (body) / IBM Plex Mono (labels, metrics) — self-hosted WOFF2, fluid `clamp()` scale.
- **Color:** deep-space base (`#070512` family) · violet = structure/interactive · gold = rare accent (≤1–2 uses per viewport) · green = live status. Muted text ≥ WCAG AA.
- **Tokens:** spacing (8px), duration, easing, radius, shadow, z-index scales — no ad-hoc values.
- **Motion language:** the Assembly Line is the only large system; DOM reveals are spring-eased, scroll-linked, restrained. Deleted: aurora orbs, custom cursor, magnetic buttons, particle-field backdrops.

## 9. Verification plan

1. **Mockup checkpoints (before full build):** rendered hero + first BUILD station (Atomicity monitor) screenshotted desktop + mobile → Ivan approves direction in pixels, not prose.
2. **Design-critic loop:** screenshot → hard critique → fix → re-shoot, desktop (1440) + mobile (390), until pinnacle — not one pass.
3. **Functional:** all anchors, both Stripe links resolve to live checkout, thank-you renders with `?plan=` both values, redirect stubs land on correct anchors, reduced-motion + no-JS renders complete content.
4. **Performance:** Lighthouse mobile ≥ 90 perf target; real-device scroll smoothness check.
5. **Post-deploy live smoke:** real browser on `https://vibeworksstudio.ai` (not a proxy signal) — hero film plays, mobile viewport verified, Stripe checkout page reachable from the live page.

## 10. Out of scope (YAGNI)

- Positioning/copy rewrites, new pages, blog/CMS.
- Form backend (mailto ships; real form is its own future move).
- Any Stripe/pricing/money changes beyond moving the existing links onto the page.
- Hosting/DNS migration (GH Pages stays).
- The Next.js `vibeworkscc/vibeworks-website` folder (dead end — untouched).

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Scroll-film fatigue / hostage feeling | Scrub-not-hijack; anchor nav to every act; ~9 viewport-heights total |
| Mobile GPU variance | Capability-tiered rendering; real-device check; DOM layer always complete |
| Pages source flip breaks deploy | Flip is reversible; validate Actions build before merging to `main`; old branch-deploy restorable in one setting |
| Heavy textures tank load | WebP, per-act lazy-load, loader gates only critical assets |
| Wow reads as gimmick to fintech buyers | Restraint everywhere but the signature; honest numbers; real product UI as the star |
