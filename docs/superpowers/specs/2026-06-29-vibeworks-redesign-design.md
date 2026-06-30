# VibeWorks Studio Site Redesign — Design Spec

**Date:** 2026-06-29
**Site:** vibeworksstudio.ai
**Repo:** github.com/KingIVthe1st/vibeworks (branch `main`) · Cloudflare Pages (Git-connected, deploys on push)
**Local:** `~/Documents/💻 Dev Projects/vibeworkscursor`
**Stack:** Static HTML/CSS/JS (no build step). Evolve existing `styles.css` + `script.js`.

---

## 1. Why

The current site mispositions VibeWorks as a studio that ships *viral consumer AI toys* (beauty scores, soulmate sketches, music quizzes). That undersells what the studio has become: an engineering shop that ships **production-grade AI platforms** (Atomicity, GrowthOS, Robin Trade). It also has a credibility hole — **4 of 9 featured ventures are dead or broken**, while the page claims "Nine. All Live. All Real."

This redesign repositions VibeWorks as **AI platform engineers**, fixes the dead-link problem, and lifts visual quality to top-agency / "dripping with technical mastery" level.

## 2. Strategy (locked with Ivan)

- **Positioning:** *AI platform engineers* — "We build the systems others only pitch."
- **Primary audience:** the **high-ticket client** — a serious business/founder who needs a real system built and must believe VibeWorks can ship it.
- **Consumer apps:** kept (live ones only) but **demoted** to a "and consumer scale" strip — range proof, not the headline.
- **Visual direction:** **Cinematic Product** (refined) — chosen over Editorial Luxe and Engineered Console during visual brainstorming.

## 3. Voice & copy

Confident, specific, anti-hype. Lead with proof; name the hard parts (multi-tenant, PCI SAQ-A, telephony, autonomous agents, OAuth/MCP, edge). No income/earnings claims.

- **Retire:** "Zero Fluff. Real Results.", "Built with AI. Delivered by humans.", "Nine. All Live. All Real."
- **Hero headline:** "AI platforms, shipped like products." (or "We build the systems others only pitch.")
- **Sub:** "We design and build production-grade AI systems for serious businesses — multi-tenant SaaS, autonomous agents, compliant payments — then put them live. Two people. Enterprise-grade output."
- **Honest stats:** 3 flagship platforms · **8 live products** (3 platforms + 5 consumer) · 5 verticals · 2-week avg delivery · 500K+ reach. The Trading Floor counts as client work, not a VibeWorks product. No false "all live" totals — re-verify counts at build time.

## 4. Visual design system

- **Aesthetic:** Cinematic Product — aurora gradient depth **+ a faint engineered grid underlay** (the "technical mastery" tell), layered glass product surfaces with real-looking telemetry, soft glow, parallax depth.
- **Type:** Bricolage Grotesque (display) · Plus Jakarta Sans (body) · **IBM Plex Mono** (precise micro-labels — new; the engineer signal). Keep Google Fonts.
- **Color:** keep brand DNA violet `#8B5CF6` → indigo `#6366F1` → cyan `#38BDF8`, sharpened; green `#34D399` for "live" status; deep base `#070512`.
- **Motion:** evolve existing `script.js` — scroll-reveal, magnetic buttons, custom cursor, scroll progress, parallax on the glass product stacks. Respect `prefers-reduced-motion`.
- Reference mockups (validated): `.superpowers/brainstorm/63451-1782777976/content/refined-c.html` and `directions.html`.

## 5. Sitemap & page structure

Nav: **Platforms · AI Agents · How We Work · About · [Start a build]** ("Platforms" replaces "Ventures").

| Page | File | Structure |
|---|---|---|
| **Home** | `index.html` | Hero (glass platform stack) → 3 flagship platforms → How We Work (3 models) → consumer-scale strip → about teaser → closing CTA |
| **Platforms** | `platforms.html` (reborn `ventures.html`; keep `ventures.html` as redirect/alias) | Tier 1 flagships (Atomicity, GrowthOS, Robin Trade) as deep feature blocks · Client builds (The Trading Floor) · Consumer ventures (5 live) |
| **AI Agents** | `ai-agents.html` | Reworked into new skin — OpenClaw agent-fleet capability as a productized offering |
| **How We Work** | `services.html` | 3 engagement models: **Custom Platform Build** · **Studio Partnership** (rev-share) · **AI Agent Fleets**. Preserve `#partner` / `#build` anchors used elsewhere. |
| **About** | `about.html` | Two-builder studio story (Ivan = CTO/engine, Natasha = CEO/distribution), reskinned |
| **Contact** | `contact.html` | Reskinned to new system |
| **Support** | `support.html` | Kept (LIVE Stripe payment links — DO NOT break), reskinned to match |
| **Thank-you** | `thank-you.html` | Kept, reskinned |

## 6. Portfolio curation

- **Flagship platforms (3):** Atomicity (`atomicitypro.com`) · GrowthOS (`growthos.ivanleejackson.workers.dev`) · Robin Trade (`robinaiagent.com`)
- **Client builds:** The Trading Floor (`the-trading-floor.pages.dev`) — framed as client work, not a VibeWorks-owned platform
- **Consumer ventures (5, all verified live):** RateMyLooksAI (`ratemylooks.pages.dev`) · SketchMySoulmate (`sketchmysoulmate.com`) · AI Chart Traders (`aicharttraders.com`) · Rich People Stocks (`richpeoplestocks.com`) · AI Book Publisher (`aibookpublisher.com`)
- **Killed (dead links, removed everywhere incl. footer):** SongGram (`songgram.com`), CoreCreatorsAI (`corecreatorsai.com`), OptimizeAI Tool Suite (`optimizeai.io`), MD Diagnose (`md-diagnose...workers.dev` 404). Also drop stale `sparkmybio.com`, `captionthismeme.com`, `ratemylooksai.com` references.
- **Link integrity gate:** every external link in the shipped site must return 200 (re-run the curl audit before deploy).

## 7. Image asset strategy

Goal: signature platforms show **real-looking dashboard imagery** — far stronger than abstract CSS frames — while honoring the **PCI/confidentiality guardrail: NO real client PII on a public site**.

- **Engine:** `gemini -y -m gemini-2.5-flash` + **nanobanana** extension (verified installed, API key in keychain). NOTE: default gemini model is dead — must pin `-m gemini-2.5-flash`. `codex` CLI available as an agentic asset/code helper.
- **Generate:**
  1. Photorealistic **dashboard hero renders** for Atomicity, GrowthOS, Robin Trade — populated with **synthetic data** (fake agency names, fake balances/metrics). Looks like a real screenshot; contains no real data.
  2. Abstract **"engineered" hero texture** (aurora + circuitry/grid) for backgrounds.
  3. **OG/social card** + favicon/logo polish.
- **Alternative for a more literal capture:** screenshot a **seeded demo tenant** (synthetic data) via Claude-in-Chrome.
- **Consumer apps:** real screenshots are fine (public products) — capture via Claude-in-Chrome.
- Store under `images/` (e.g. `images/platforms/`, `images/Portfoliosites/`). Optimize for web (reasonable dimensions, lazy-load).

## 8. Cleanup

Delete cruft: `index-new.html`, `preview-redesign.html`, `button-test.html`, `COPY_IMPLEMENTATION_SNIPPETS.html`, `index.html.backup`, `script.js.backup`. Audit the many `*.md` report files at repo root — leave for now (not user-facing), do not delete in this pass.

## 9. Technical approach

- Static site, no framework/build. One `styles.css` (design-tokens-first), one `script.js`. Shared nav/footer markup duplicated per page (current pattern) — keep consistent.
- Deploy = `git push origin main` → Cloudflare Pages auto-builds. `CNAME` = `vibeworksstudio.ai` (do not touch).
- Accessibility: semantic headings, alt text on all imagery, keyboard-focus states, `prefers-reduced-motion`, AA contrast.
- Performance: lazy-load images, preconnect fonts, keep JS lean; target fast LCP on the image-heavy hero.

## 10. Out of scope (non-goals)

- No backend, CMS, or framework migration.
- No new Stripe products (existing support-page payment links stay as-is, just reskinned).
- No content for dead/retired products.
- No changes to DNS, repo, or Cloudflare project settings.

## 11. Success criteria

1. A high-ticket visitor reads the home page and believes VibeWorks builds serious systems (Atomicity/GrowthOS/Robin Trade are the proof).
2. Zero dead links (200 on every external link, verified).
3. Visual quality reads top-agency: cinematic, cohesive, "dripping with technical mastery" — passes a `design-critic` / design-QA review (screenshot → critique → fix loop).
4. Signature platforms show real-looking dashboards with **no real client PII**.
5. Copy is specific, anti-hype, human; no false claims; no income/earnings claims.
6. Live Stripe support flow still works after reskin.
7. Mobile-responsive, accessible, fast.

## 12. Risks / watch-items

- **Confidentiality:** Atomicity has co-owners and confidential clients — show synthetic data only; frame as "platform we architected," never name its clients.
- **Image-gen reliability:** if nanobanana fails at gen-time, honest-degrade (report it; fall back to seeded-demo screenshots) — never ship fabricated/placeholder-looking assets silently.
- **Stripe regression:** verify support-page payment links post-reskin before deploy.
- **Local↔origin sync:** confirm local `main` == `origin/main` before starting (it currently is).
