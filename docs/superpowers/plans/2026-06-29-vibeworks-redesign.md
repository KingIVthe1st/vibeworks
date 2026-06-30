# VibeWorks Studio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild vibeworksstudio.ai as a "Cinematic Product" site that repositions VibeWorks as AI platform engineers, features live flagship platforms (Atomicity, GrowthOS, Robin Trade) with real-looking dashboard imagery, kills all dead links, and hits top-agency visual quality.

**Architecture:** Static HTML/CSS/JS, no build step. One token-driven `styles.css` + one `script.js`, shared nav/footer markup per page. AI imagery generated via gemini+nanobanana (synthetic data) and Claude-in-Chrome screenshots. All work on branch `redesign/cinematic-2026-06`; production deploys only when `main` is updated.

**Tech Stack:** HTML5, CSS (custom properties), vanilla JS, Cloudflare Pages, gemini-cli + nanobanana (image gen), Claude-in-Chrome (screenshots + live QA).

**Spec:** `docs/superpowers/specs/2026-06-29-vibeworks-redesign-design.md`
**Validated visual reference (source of truth for the look):** `.superpowers/brainstorm/63451-1782777976/content/refined-c.html`

## Global Constraints

- Work on branch `redesign/cinematic-2026-06`. **`main` = production** (Cloudflare Pages auto-deploys on push to main) — do NOT push to main until ship-time.
- Do NOT modify `CNAME` (= `vibeworksstudio.ai`).
- **PCI/confidentiality guardrail:** NO real client PII in any imagery. Atomicity dashboards use synthetic data only; never name Atomicity's clients.
- **Preserve `support.html` LIVE Stripe payment links verbatim:** Essentials `buy.stripe.com/5kQ8wQ8D38t0197cif8EM02`, Growth `buy.stripe.com/14A9AU9H74cKg412HF8EM03`.
- Every external link in the shipped site must return HTTP 200 (re-run audit before ship).
- Copy: specific, anti-hype, human. NO income/earnings claims. No false "all live" totals.
- Design tokens: base `#070512`, violet `#8B5CF6`, violet-bright `#A78BFA`, indigo `#6366F1`, cyan `#38BDF8`, green (live) `#34D399`.
- Fonts: Bricolage Grotesque (display), Plus Jakarta Sans (body), IBM Plex Mono (micro-labels). Google Fonts.
- Image engine: `gemini -y -m gemini-2.5-flash` + nanobanana. **MUST pin `-m gemini-2.5-flash`** (default model is dead).
- Accessibility: alt text on all imagery, visible keyboard focus, `prefers-reduced-motion` honored, AA contrast.
- Honest stats: 3 flagship platforms · 8 live products (3 platforms + 5 consumer) · 5 verticals · 2-wk avg delivery · 500K+ reach.

### Per-page verification checklist (referenced by page tasks)
For every page task, "verify" means ALL of:
1. Serve locally (`python3 -m http.server 8080` from repo root) and open the page via Claude-in-Chrome.
2. Screenshot at desktop (1440px) AND mobile (390px) widths — layout intact, no overflow.
3. `read_console_messages` — zero errors.
4. All nav links and CTAs resolve (no `#` placeholders, no 404s).
5. All `<img>` have non-empty `alt`.
6. Commit only after 1–5 pass.

---

## Task 1: Pre-flight — branch, sync, baseline audit

**Files:** none (verification only)

- [ ] **Step 1: Confirm on feature branch, synced**

Run:
```bash
cd "$HOME/Documents/💻 Dev Projects/vibeworkscursor"
git branch --show-current   # expect: redesign/cinematic-2026-06
git fetch origin main -q && git rev-list --count redesign/cinematic-2026-06..origin/main  # expect: 0 new on origin since branch
```
Expected: branch is `redesign/cinematic-2026-06`.

- [ ] **Step 2: Baseline link audit (record current dead links)**

Run:
```bash
for u in https://atomicitypro.com https://growthos.ivanleejackson.workers.dev https://robinaiagent.com https://the-trading-floor.pages.dev https://ratemylooks.pages.dev https://sketchmysoulmate.com https://aicharttraders.com https://richpeoplestocks.com/ https://aibookpublisher.com; do printf "%-50s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 "$u")"; done
```
Expected: all `200`. These are the ONLY external product links allowed in the new site.

- [ ] **Step 3: Start local server for the session**

Run: `python3 -m http.server 8080` (background). Confirm `http://localhost:8080/` serves the current site.

---

## Task 2: Generate flagship dashboard imagery (nanobanana)

**Files:**
- Create: `images/platforms/atomicity-dashboard.png`
- Create: `images/platforms/growthos-dashboard.png`
- Create: `images/platforms/robintrade-dashboard.png`
- Create: `images/platforms/hero-texture.png`

**Interfaces:**
- Produces: four image files referenced by Tasks 5 & 6. If a gen fails, fall back to Task 2b.

- [ ] **Step 1: Generate Atomicity dashboard (synthetic data)**

Run:
```bash
gemini -y -m gemini-2.5-flash "Generate a photorealistic dark-mode SaaS dashboard screenshot for a debt-collections CRM called 'Atomicity'. Deep navy/violet (#8B5CF6) UI, glass panels, charts. Show SYNTHETIC data only: fake agency names like 'Northgate Recovery', metrics 'Active portfolios 128', 'Recovered MTD +18.4%', a 'PCI SAQ-A ✓' compliance badge, a collections trend chart. Crisp, modern, enterprise. 16:10. Save to images/platforms/atomicity-dashboard.png"
```
Expected: file created. **Verify it contains NO real names/numbers** (it won't — all synthetic).

- [ ] **Step 2: Generate GrowthOS dashboard**

Run:
```bash
gemini -y -m gemini-2.5-flash "Generate a photorealistic dark-mode dashboard screenshot for 'GrowthOS', an autonomous AI ad operator. Violet-to-indigo (#8B5CF6→#6366F1) glass UI. Show: a goal field '+30% qualified leads', a list of 6 auto-generated ad campaigns, channels 'Meta · WhatsApp', a spend-efficiency chart '+31%', a green 'optimizing' status. Synthetic data. 16:10. Save to images/platforms/growthos-dashboard.png"
```
Expected: file created.

- [ ] **Step 3: Generate Robin Trade dashboard**

Run:
```bash
gemini -y -m gemini-2.5-flash "Generate a photorealistic dark-mode dashboard screenshot for 'Robin Trade', a supervised agentic trading app for Robinhood. Dark UI with violet/cyan accents, glass panels. Show: an AI trade-suggestion queue awaiting human approval, a portfolio chart, an 'agent supervised' toggle, fake tickers and amounts. Synthetic data only. 16:10. Save to images/platforms/robintrade-dashboard.png"
```
Expected: file created.

- [ ] **Step 4: Generate abstract engineered hero texture**

Run:
```bash
gemini -y -m gemini-2.5-flash "Generate an abstract hero background: deep space-black (#070512) with soft violet/indigo/cyan aurora gradients and a faint technical blueprint grid + circuit traces. Premium, cinematic, subtle. 21:9, dark, suitable as a website hero backdrop behind text. Save to images/platforms/hero-texture.png"
```
Expected: file created.

- [ ] **Step 5: Visually verify all four**

Open each file via Claude-in-Chrome (`file://` or the local server) and screenshot. Confirm: looks like a real product, synthetic data only, on-brand colors, no artifacts/garbled text in the focal area. If garbled, re-run that prompt once with "ensure all text is legible and correctly spelled."

- [ ] **Step 6: Commit**

```bash
git add images/platforms/
git commit -m "feat(assets): AI-generated flagship dashboard imagery (synthetic data)"
```

---

## Task 2b: Capture consumer + platform marketing screenshots (Claude-in-Chrome) — fallback + thumbnails

**Files:**
- Create: `images/Portfoliosites/robintrade.png`, `images/Portfoliosites/tradingfloor.png` (live marketing-site thumbnails)
- Re-capture (optional refresh): consumer thumbnails already present are fine to keep.

- [ ] **Step 1: Screenshot the live platform marketing sites**

Via Claude-in-Chrome, navigate to and screenshot (desktop 1440px):
- `https://robinaiagent.com` → `images/Portfoliosites/robintrade.png`
- `https://the-trading-floor.pages.dev` → `images/Portfoliosites/tradingfloor.png`

- [ ] **Step 2: If any Task 2 dashboard gen failed**, screenshot a seeded-demo tenant (synthetic data) for that platform instead, save to the same `images/platforms/<name>-dashboard.png` path.

- [ ] **Step 3: Commit**

```bash
git add images/Portfoliosites/
git commit -m "feat(assets): live platform marketing-site thumbnails"
```

---

## Task 3: Design system — `styles.css` foundation

**Files:**
- Modify (rebuild): `styles.css`

**Interfaces:**
- Produces: CSS custom properties + shared component classes (`.nav`, `.site-footer`, `.btn`, `.btn-fill`, `.btn-glass`, `.wrap`, `.mono`, `.grad`, `.aurora`, `.glass`, `.bigframe`, `.feat`, `.pill`, `.sh`, `.cchip`, `.reveal-up`) consumed by every page task. Class names are authoritative — pages must use exactly these.

- [ ] **Step 1: Write the design tokens + base**

Replace the top of `styles.css` with the `:root` token block and base styles. Tokens (verbatim):
```css
:root{
  --bg:#070512; --bg-2:#0b0820; --panel:rgba(22,18,46,.6);
  --txt:#f4f2ff; --txt-dim:#b6b0d8; --txt-mute:#7d77a3;
  --violet:#8b5cf6; --violet-br:#a78bfa; --indigo:#6366f1; --cyan:#38bdf8; --pink:#e84896;
  --line:rgba(255,255,255,.1); --line-soft:rgba(255,255,255,.06); --green:#34d399;
  --disp:'Bricolage Grotesque',sans-serif; --sans:'Plus Jakarta Sans',sans-serif; --mono:'IBM Plex Mono',monospace;
  --wrap:1200px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--txt);font-family:var(--sans);-webkit-font-smoothing:antialiased;line-height:1.5;overflow-x:hidden}
.wrap{max-width:var(--wrap);margin:0 auto;padding:0 6vw}
a{color:inherit;text-decoration:none}
.mono{font-family:var(--mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase}
.grad{background:linear-gradient(120deg,#fff 30%,var(--violet-br) 70%,var(--cyan));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
```

- [ ] **Step 2: Port the validated components from the mockup**

From `.superpowers/brainstorm/63451-1782777976/content/refined-c.html`, lift the CSS for these blocks into `styles.css`, keeping the exact class names: `.aurora` (+ `:before`/`:after`), `nav`/`.logo`/`.links`/`.cta`, `.btn`/`.btn-fill`/`.btn-glass`, `.pill`, hero (`.hero`,`.stack`,`.glass`,`.row`,`.bars`,`.bar`,`.floaty`), `.sh`, `.feat`/`.feat.rev`/`.no`/`.tag`/`.chips`/`.visit`/`.bigframe`, `.consumer`/`.cgrid`/`.cchip`, `.closing`. Add a real `.site-footer` (reuse current footer structure, restyled to tokens).

- [ ] **Step 3: Add reveal + reduced-motion**

```css
.reveal-up{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}
.reveal-up.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal-up{opacity:1;transform:none}}
```

- [ ] **Step 4: Verify**

Temporarily link the mockup classes on `index.html` is not needed yet; instead lint visually in Task 5. For now confirm CSS parses: open `http://localhost:8080/styles.css` in Chrome — no server error.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "feat(design): Cinematic Product design system + tokens"
```

---

## Task 4: Motion — `script.js`

**Files:** Modify: `script.js`

**Interfaces:** Produces: IntersectionObserver that adds `.in` to `.reveal-up`; magnetic-button, custom-cursor, scroll-progress, nav-scroll, hamburger, hero-parallax behaviors. Pages rely on these class hooks: `.reveal-up`, `.btn--magnetic`, `#cursorDot/#cursorRing`, `#scrollProgress`, `#nav`, `#hamburger`/`#navLinks`, `.stack`.

- [ ] **Step 1: Implement reveal observer + nav scroll state**
```js
const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal-up').forEach(el=>io.observe(el));
const nav=document.getElementById('nav');
addEventListener('scroll',()=>{nav&&nav.classList.toggle('scrolled',scrollY>20);const sp=document.getElementById('scrollProgress');if(sp)sp.style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%'},{passive:true});
```

- [ ] **Step 2: Hamburger, magnetic buttons, hero parallax** (guard for reduced-motion; lift cursor logic from existing `script.js` if present). Wrap motion-heavy bits in `if(!matchMedia('(prefers-reduced-motion:reduce)').matches){...}`.

- [ ] **Step 3: Verify** — load home (after Task 5) and confirm reveals fire and console is clean. (Defer actual check to Task 5.)

- [ ] **Step 4: Commit**
```bash
git add script.js
git commit -m "feat(motion): scroll reveal, nav state, parallax, magnetic CTAs"
```

---

## Task 5: Home — `index.html`

**Files:** Modify (rebuild): `index.html`

- [ ] **Step 1: Build the page** using the Task 3 components and the validated structure from `refined-c.html`. Sections in order: `<head>` (fonts + meta/OG using honest copy from spec §3), `.aurora`, `nav` (Platforms · AI Agents · How We Work · About · [Start a build]), hero (glass stack uses `images/platforms/atomicity-dashboard.png` + `growthos-dashboard.png` thumbnails or the CSS glass cards), "Selected Platforms" preview (Atomicity, GrowthOS, Robin Trade — link to `platforms.html` and the live URLs), "Three ways to work" (Custom Platform Build / Studio Partnership / AI Agent Fleets → `services.html#build`, `#partner`, `#agents`), consumer-scale strip (5 live apps), team teaser (Ivan + Natasha), closing CTA → `contact.html`, footer (portfolio column lists ONLY the 8 live products).

- [ ] **Step 2: Wire real dashboard imagery** into the hero/platform cards via `<img src="images/platforms/...">` with descriptive `alt`.

- [ ] **Step 3: Verify** per the Per-page verification checklist (desktop + mobile screenshot, console clean, links resolve, alt text).

- [ ] **Step 4: Commit**
```bash
git add index.html
git commit -m "feat(home): rebuild homepage in Cinematic Product system"
```

---

## Task 6: Platforms — `platforms.html` (+ ventures redirect)

**Files:**
- Create: `platforms.html`
- Create: `_redirects` (Cloudflare Pages) with `/ventures.html /platforms.html 301` and `/ventures /platforms.html 301`
- Delete: `ventures.html`

- [ ] **Step 1: Build `platforms.html`** — page hero ("The work that proves the studio."), then three tiers:
  - **Flagship platforms** (deep `.feat` blocks): Atomicity, GrowthOS, Robin Trade — each with its `images/platforms/*-dashboard.png`, tagline, description, tech chips, and "Visit →" to the live URL.
  - **Client builds:** The Trading Floor — `images/Portfoliosites/tradingfloor.png`, framed as client work, link to live URL.
  - **Consumer ventures:** the 5 live apps as `.cchip` cards with their existing `images/Portfoliosites/*.png` and live links.
  - Closing CTA.

- [ ] **Step 2: Create `_redirects`**
```
/ventures.html  /platforms.html  301
/ventures       /platforms.html  301
```

- [ ] **Step 3: Delete `ventures.html`**
```bash
git rm ventures.html
```

- [ ] **Step 4: Verify** per checklist. Additionally confirm NO killed products appear (grep): 
```bash
! grep -riE 'songgram|corecreators|optimizeai|md-diagnose|sparkmybio|captionthismeme|ratemylooksai\.com' platforms.html index.html
```
Expected: no matches (exit 0 from the `!`).

- [ ] **Step 5: Commit**
```bash
git add platforms.html _redirects && git rm --cached ventures.html 2>/dev/null; git add -A
git commit -m "feat(platforms): platforms page + ventures 301 redirect; drop dead ventures"
```

---

## Task 7: How We Work — `services.html`

**Files:** Modify (rebuild): `services.html`

- [ ] **Step 1: Build** three engagement models with preserved anchor IDs: `#build` **Custom Platform Build** (fixed scope, weeks not months), `#partner` **Studio Partnership** (rev-share, no upfront), `#agents` **AI Agent Fleets** (link to `ai-agents.html`). Each: who it's for, what you get, how it works. CTA → contact.

- [ ] **Step 2: Verify** per checklist; confirm `#build`/`#partner` anchors still resolve (linked from home + old pages).

- [ ] **Step 3: Commit**
```bash
git add services.html
git commit -m "feat(services): How We Work — 3 engagement models in new system"
```

---

## Task 8: AI Agents — `ai-agents.html`

**Files:** Modify (rebuild): `ai-agents.html`

- [ ] **Step 1: Rebuild** the 1508-line page into the new skin as a tight, productized "AI Agent Fleets" offering: what an agent fleet is, real capability framing (24/7 autonomous ops, WhatsApp/Slack/Discord bridges, supervised actions), how VibeWorks deploys them, CTA. Keep it focused — cut bloat, keep substance. Do NOT name confidential client agents.

- [ ] **Step 2: Verify** per checklist.

- [ ] **Step 3: Commit**
```bash
git add ai-agents.html
git commit -m "feat(ai-agents): rebuild as productized Agent Fleets offering"
```

---

## Task 9: About — `about.html`

**Files:** Modify (rebuild): `about.html`

- [ ] **Step 1: Build** the two-builder story in the new skin: thesis (operators, not a lab/agency), Ivan (CTO/engine — the platforms are the proof), Natasha (CEO/distribution — 500K+), the vision (a compounding platform studio). Use `images/Portfoliosites/ivan.jpg` + `natasha.jpeg`.

- [ ] **Step 2: Verify** per checklist.

- [ ] **Step 3: Commit**
```bash
git add about.html
git commit -m "feat(about): rebuild About in new system"
```

---

## Task 10: Contact — `contact.html`

**Files:** Modify (rebuild): `contact.html`

- [ ] **Step 1: Build** contact page in new skin. Preserve the current contact mechanism (email `info@vibeworksstudio.ai` and/or existing form action — inspect current file first and keep its working submission method). "Start a build" framing.

- [ ] **Step 2: Verify** per checklist; if a form exists, confirm it submits / mailto works.

- [ ] **Step 3: Commit**
```bash
git add contact.html
git commit -m "feat(contact): rebuild Contact in new system"
```

---

## Task 11: Reskin Support + Thank-you (preserve Stripe)

**Files:** Modify: `support.html`, `thank-you.html`

- [ ] **Step 1: Reskin `support.html`** to the new system **without touching the Stripe payment-link hrefs**. Before editing, capture them:
```bash
grep -oE 'buy\.stripe\.com/[A-Za-z0-9]+' support.html | sort -u
```
Expected: the two links from Global Constraints. After editing, re-run — must be identical.

- [ ] **Step 2: Reskin `thank-you.html`** (keep `?plan=` personalization logic).

- [ ] **Step 3: Verify** per checklist PLUS: open `support.html`, click each subscribe button via Claude-in-Chrome, confirm it navigates to the correct `buy.stripe.com/...` URL (do not complete a purchase).

- [ ] **Step 4: Commit**
```bash
git add support.html thank-you.html
git commit -m "feat(support): reskin Support + Thank-you; Stripe links unchanged"
```

---

## Task 12: Cleanup + global integrity passes

**Files:** Delete cruft; touch any page needing fixes.

- [ ] **Step 1: Delete cruft**
```bash
git rm index-new.html preview-redesign.html button-test.html COPY_IMPLEMENTATION_SNIPPETS.html index.html.backup script.js.backup 2>/dev/null
```

- [ ] **Step 2: Full external-link audit across all pages**
```bash
grep -rhoE 'href="https?://[^"]+"' *.html | sed -E 's/href="//;s/"$//' | grep -viE 'fonts\.(googleapis|gstatic)|schema\.org|w3\.org|stripe\.com|vibeworksstudio\.ai' | sort -u | while read u; do printf "%-50s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 "$u")"; done
```
Expected: every line ends in `200`. Fix or remove any non-200.

- [ ] **Step 3: Dead-product grep across whole site**
```bash
grep -riE 'songgram|corecreators|optimizeai|md-diagnose|sparkmybio|captionthismeme|nine (products|live)|all live' *.html || echo "clean"
```
Expected: `clean` (or only legitimate matches you confirm).

- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "chore: remove cruft; link + dead-product integrity passes"
```

---

## Task 13: Design-QA loop (top-agency polish)

**Files:** any page needing polish.

- [ ] **Step 1: Run design-critic on each customer-facing page** (home, platforms, services, ai-agents, about, contact) against `http://localhost:8080/<page>`. Dispatch the `design-critic` agent per page (or the `design-qa` skill).

- [ ] **Step 2: Apply prioritized fixes**, re-screenshot, iterate until each page reads top-agency (not one pass). Focus: hierarchy, spacing rhythm, the glass/dashboard treatment, type scale, mobile.

- [ ] **Step 3: Commit** each fix batch
```bash
git add -A && git commit -m "polish: design-QA fixes for <page>"
```

---

## Task 14: Ship gate

**Files:** none (process). Use the `ship-risky-change` skill (support page touches a payment surface).

- [ ] **Step 1: Final pre-ship verification** — re-run Task 12 Steps 2–3 (all 200, clean), confirm Stripe links unchanged (Task 11 Step 1 grep), confirm `CNAME` untouched (`cat CNAME` = `vibeworksstudio.ai`).

- [ ] **Step 2: Show Ivan the finished site** (local) and get explicit ship approval.

- [ ] **Step 3: Merge to main + deploy** (only after approval)
```bash
git checkout main && git merge --no-ff redesign/cinematic-2026-06 && git push origin main
```

- [ ] **Step 4: Live smoke test** — after CF Pages deploys, open `https://vibeworksstudio.ai` via Claude-in-Chrome: home renders, dashboards load, nav works, `/ventures.html` 301s to `/platforms.html`, support page Stripe buttons resolve, console clean. Re-run the external-link audit against the live domain.

---

## Self-Review (completed)

- **Spec coverage:** positioning/voice → T5,7,9; visual system → T3,4; sitemap (8 pages) → T5–T11; portfolio curation + dead-link kill → T6,T12; imagery (synthetic-data dashboards) → T2,T2b; cleanup → T12; PCI guardrail → T2 (synthetic), Global Constraints; Stripe preservation → T11; success criteria (zero dead links, design-QA, live smoke) → T12,T13,T14. All spec sections mapped.
- **Placeholders:** none — exact paths, commands, tokens, and gemini prompts given. Page bodies reference the in-repo validated mockup `refined-c.html` for exact component CSS/markup (concrete existing code, not a placeholder).
- **Type/name consistency:** component class names defined in T3 (`.feat`, `.glass`, `.bigframe`, `.cchip`, `.btn-fill`, `.btn-glass`, `.reveal-up`, `.aurora`, `.mono`, `.grad`) are the same names used in T5–T11. Engagement anchors `#build`/`#partner`/`#agents` consistent between T5, T7, T8.
