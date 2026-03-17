# VibeWorks AI Studio — Repositioning & Multi-Page Site Design

> **For agentic workers:** This spec describes a complete repositioning and multi-page site build for vibeworksstudio.ai. Pure HTML/CSS/JS, deployed to GitHub Pages. No frameworks, no build tools.

**Goal:** Transform vibeworksstudio.ai from a single landing page pitching "custom AI agents" into a five-page AI venture studio site that serves three distinct audiences: founders/partners, entrepreneurs/clients, and investors/press.

**Core Repositioning:** VibeWorks is not an agency. It is an AI venture studio — a two-person team with a repeatable system for taking AI ideas from concept to live product in 2 weeks. Nine live products across five verticals prove the system works. The site must communicate studio identity first, then route each audience to the right track.

**Three Engagement Tracks:**
1. **Studio Partner** — co-build with revenue share (founders/creators)
2. **Custom Build** — fixed-scope AI product/tool for hire (entrepreneurs/SMBs)
3. **The Portfolio** — investment, licensing, acquisition opportunities (investors/operators)

---

## Architecture

| Page | File | Primary Audience | Primary Job |
|---|---|---|---|
| Home | `index.html` | All three | Establish identity, route audiences |
| Ventures | `ventures.html` | All three (credibility) | Prove the system works |
| Services | `services.html` | Partners + Clients | Convert each track |
| About | `about.html` | Investors + Press | Build institutional trust |
| Contact | `contact.html` | All (bottom of funnel) | Remove friction to start |

**Navigation (all pages):**
`VibeWorks` logo/wordmark (links to `/`) · `Ventures` · `Services` · `About` · `Contact` (CTA-styled, violet)

**Footer (all pages):**
Logo · tagline `AI Venture Studio` · links: Ventures / Services / About / Contact · email: `info@vibeworksstudio.ai` · copyright `© 2026 VibeWorks AI Studio`

---

## Design System

**Retain all existing design tokens** from `styles.css`:
- Colors: `--base: #07070E`, `--violet: #8B5CF6`, `--gold: #E8B84B`, `--crimson: #7B1A2E`
- Fonts: Bricolage Grotesque (display) + Plus Jakarta Sans (body)
- All animation systems: aurora orbs, particle canvas, custom cursor, grain overlay, reveal animations, magnetic buttons, 3D tilt
- All component classes: `.btn`, `.label`, `.reveal-up/left/right`, `.service-card`, `.bento-item`, etc.

**New shared CSS needed:**
- `.page-hero` — tight non-fullscreen hero for inner pages
- `.track-nav` — three anchor pills for Services page
- `.track-section` — full-width track block on Services page
- `.venture-row` — two-column editorial layout for Ventures page
- `.venture-featured` — full-width hero treatment for top venture
- `.track-selector` — three card selectors on Contact page
- `.contact-form` — form styles with track-based reveal

**Shared `styles.css`** — one file used by all pages. New component styles appended.
**Shared `script.js`** — one file used by all pages. Page-specific logic gated by element existence checks (already the pattern used throughout).

---

## Page 1: Home (`index.html`)

### Section 1: Hero
- **Layout:** Full viewport height, centered content, particle canvas + aurora orbs behind
- **Availability eyebrow:** Green pulsing dot + "2 client spots open · Q2 2026"
- **Headline:** `We Build AI Products.` (display font, hero scale: clamp 56px → 120px)
- **Subheadline:** `VibeWorks is an AI venture studio. We launch our own products, partner with founders, and build custom AI for businesses. Nine live products and counting.`
- **Three CTAs (horizontal row):**
  - `See Our Ventures →` (ghost button → `/ventures`)
  - `Partner With Us →` (gold button → `/services#partner`)
  - `Build Something →` (violet button → `/services#build`)
- **Stats row:** `9 Products Launched` · `2-Week Avg Delivery` · `500K+ Distribution Reach` · `5 Verticals`
- **Marquee ticker:** `Claude-Powered` · `9 Live Products` · `2-Week Delivery` · `500K+ Reach` · `AI Venture Studio` · `Zero Fluff. Real Results.`

### Section 2: Featured Ventures (3 cards)
- **Label:** `From The Portfolio`
- **Headline:** `What We've Built`
- **Layout:** Three equal cards in a row — screenshot, category tag, product name, one-line description, "Live →" external link
- **Featured products:** RateMyLooksAI, SongGram, AI Chart Traders (strongest visual variety)
- **Footer link:** `See all 9 ventures →` to `/ventures`

### Section 3: Three Ways To Work With Us
- **Label:** `How We Work`
- **Headline:** `Three Ways To Work With VibeWorks`
- **Layout:** Three side-by-side panels with subtle border
- **Panel 1 — Studio Partner:**
  - Icon: handshake/merge SVG
  - Label: `For Founders & Creators`
  - Body: `You bring the vision. We build the product. Revenue share — no upfront cost.`
  - Link: `Learn more →` to `/services#partner`
- **Panel 2 — Custom Build:**
  - Icon: code/build SVG
  - Label: `For Entrepreneurs & SMBs`
  - Body: `We build your AI product or tool from scratch. Fixed scope. 2-week delivery.`
  - Link: `Learn more →` to `/services#build`
- **Panel 3 — The Portfolio:**
  - Icon: grid/portfolio SVG
  - Label: `For Investors & Operators`
  - Body: `Nine live ventures. Open to investment, licensing, and strategic partnership.`
  - Link: `Explore →` to `/ventures`

### Section 4: Team Teaser
- **Layout:** Two founder photos side by side, name, one-sentence role description each
- **Ivanlee Jackson:** `Co-Founder & CTO — The technical engine behind every product we've shipped.`
- **Natasha Burton:** `Co-Founder & CEO — The distribution engine that makes every launch land.`
- **Link:** `Meet the team →` to `/about`

### Section 5: Footer CTA
- **Headline:** `Every product we've built started with one conversation.`
- **CTA:** `Start The Conversation →` to `/contact`

---

## Page 2: Ventures (`ventures.html`)

### Section 1: Page Hero (tight)
- **Label:** `The Portfolio`
- **Headline:** `Nine Products. All Live. All Real.`
- **Subline:** `We don't prototype. We don't concept. We ship — across healthcare, fintech, music, beauty, publishing, and creator tech.`
- **No full-screen canvas** — subtle grid background only, aurora orbs disabled on this page

### Section 2: Featured Venture (full-width hero card)
**RateMyLooksAI** — top placement, full-width treatment:
- Large screenshot (16:9, rounded corners, shadow)
- Category: `Consumer AI · Established User Base`
- Name: `RateMyLooksAI` (display, large)
- Tagline: `Your Beauty Score, Decided by AI`
- Description: AI-powered appearance analysis with an established daily user base and strong social engagement across platforms.
- `Visit Live →` external link

### Section 3: Venture Grid (remaining 8 products)
**Layout:** Two-column editorial rows, alternating image left/right
Each venture:
- Screenshot (16:10, shadow)
- Live badge (green pulsing dot)
- Category tag (gold, uppercase)
- Product name (display font, large)
- Tagline (italic, muted)
- 2-sentence description
- `Visit →` external link

**Order:** SketchMySoulmate · SongGram · CoreCreatorsAI · AI Book Publisher · OptimizeAI Tool Suite · MD Diagnose · AI Chart Traders · Rich People Stocks

*(Note: CoreCreatorsAI and OptimizeAI Tool Suite images exist in `/images/Portfoliosites/` and should be included. Confirm live URLs before implementation.)*

### Section 4: The Pattern (editorial interstitial)
- **Headline:** `One System. Nine Proofs.`
- **Copy:** `Every one of these started the same way: an idea, a conversation, and 2 weeks. Different verticals. Same system. That system is available to you.`
- **Three proof stats:** `9 verticals tested` · `100% shipped on time` · `All live today`

### Section 5: Dual CTA
- **Headline:** `See something that sparks an idea?`
- `Partner With Us →` to `/services#partner`
- `Build Something Similar →` to `/services#build`

---

## Page 3: Services (`services.html`)

### Section 1: Page Hero
- **Label:** `How We Work`
- **Headline:** `Three Ways To Work With VibeWorks`
- **Subline:** `Whether you have an idea, a business problem, or want to build together — there's a track for you.`
- **Track nav pills:** `Studio Partner` · `Custom Build` · `The Portfolio` (anchor links to sections below)

### Section 2: Track 1 — Studio Partner (`#partner`)
- **Label:** `For Founders & Creators`
- **Headline:** `You Have The Vision. We Have The Machine.`
- **Copy:** You bring an idea — a product concept, an audience, a problem worth solving. We bring 9 launches of experience, full-stack AI build capability, and 500K+ distribution reach. We build it together. We split the upside.
- **What you get (list):**
  - Full product build — design, development, AI infrastructure
  - Launch strategy and distribution through our network
  - Ongoing development and iteration post-launch
  - A partner who has done this 9 times before
- **What we need from you (list):**
  - A strong idea with a clear target user
  - Domain expertise, audience, or unique insight
  - Commitment to the partnership beyond launch
- **Structure:** Revenue share — no upfront cost to qualified partners
- **CTA:** `Apply For Partnership →` to `/contact?track=partner`

### Section 3: Track 2 — Custom Build (`#build`)
- **Label:** `For Entrepreneurs & Small Businesses`
- **Headline:** `Tell Us What You Need Built. We'll Build It.`
- **Copy:** AI agents, internal automation tools, customer-facing products — if your business needs it and AI can power it, we build it. Fixed scope, fast delivery, you own it when we're done.
- **What we build (list):**
  - AI agents and automation workflows
  - Customer-facing AI products and tools
  - Internal business intelligence and workflow tools
  - Full-stack AI web applications
- **Timeline & Investment:**
  - Agents & automation: 5–10 business days · $1K–$5K
  - Full product builds: 2 weeks · Custom scope
- **CTA:** `Start A Project →` to `/contact?track=build`

### Section 4: Track 3 — The Portfolio (`#portfolio`)
- **Label:** `For Investors & Operators`
- **Headline:** `Nine Live Products. Multiple Opportunities.`
- **Copy:** Our ventures aren't side projects — they're operating products with real users across multiple categories. If you're interested in investing, licensing, acquiring, or building on top of what we've launched, we're open to the conversation.
- **Opportunities (list):**
  - Equity investment in individual ventures
  - Licensing and white-label arrangements
  - Acquisition of specific products
  - Strategic partnership and integration
- **CTA:** `Discuss Opportunities →` to `/contact?track=portfolio`

### Section 5: Why VibeWorks (proof strip)
Three stat blocks:
- `9 Products` — `We've shipped more in a year than most agencies do in five.`
- `2 Weeks` — `A proven timeline with 9 completions behind it. Not a pitch — a track record.`
- `500K+ Reach` — `Every product we launch has distribution built in from day one.`

---

## Page 4: About (`about.html`)

### Section 1: Page Hero
- **Headline:** `Built By Builders.`
- **Subline:** `VibeWorks AI Studio is a two-person team that ships faster than most companies ten times our size. Here's why — and where we're going.`

### Section 2: The Studio Thesis
Four short paragraphs — the manifesto:
1. `Most AI companies are either research labs or service firms. We're neither.`
2. `We're operators. We build products, put them live, and watch them work in the real world. That feedback loop — across 9 products, 5 verticals, hundreds of thousands of users — is what makes us different.`
3. `The formula we've developed isn't magic. It's a repeatable system: identify a real problem, build a focused AI solution, launch with distribution, iterate fast. Two weeks, start to finish.`
4. `We're building VibeWorks to be the studio that defines what AI product development looks like at speed and scale. Every product teaches us something. Every client build funds the next experiment. The machine keeps compounding.`

### Section 3: The Team (full treatment)
**Ivanlee Jackson — Co-Founder & CTO**
- Photo (existing: `ivan.jpg`)
- Bio: 10+ years building full-stack products from zero to production. Ivan has shipped AI-powered apps across healthcare, fintech, music, and consumer tech — fast, clean, and built to scale. He architects the infrastructure. He writes the code. He is the reason 2 weeks is a track record, not a claim.
- Credentials: 10+ years full-stack · Expert in 0→1 AI product builds · Claude, OpenClaw & modern AI infrastructure · Every line of code is production-grade

**Natasha Burton — Co-Founder & CEO**
- Photo (existing: `natasha.jpeg`)
- Bio: 500K+ followers and a track record of turning audiences into revenue. Natasha understands distribution at a level most agencies never reach — because she lives it. She is the reason products don't just launch. They land.
- Credentials: 500K+ engaged audience · Serial viral product launcher · Creator economy & growth strategy · The bridge between AI capability and real people

### Section 4: What We're Building Toward
- **Headline:** `The Vision`
- **Copy:** `We're building a portfolio of AI products that compounds. Each venture teaches us something the next one benefits from. Each client build funds the next studio experiment. The goal is not one big hit — it's a machine that keeps producing them. We're early. The portfolio is growing. If you want to be part of that, there's a track for you.`

### Section 5: CTA
- **Headline:** `Want to build something with us?`
- `Start A Conversation →` to `/contact`

---

## Page 5: Contact (`contact.html`)

### Section 1: Page Hero
- **Headline:** `Let's Talk.`
- **Subline:** `Tell us what you're working on. We'll tell you honestly if and how we can help.`

### Section 2: Track Selector
Three large clickable cards — visitor picks their track. Selected state: gold border + background tint.
- **Studio Partner** — `I have an idea and want to build together`
- **Custom Build** — `I need AI built for my business`
- **Portfolio / Investor** — `I'm interested in your ventures`

Selecting a card reveals the corresponding form below with smooth transition.

### Section 3: Forms (revealed by track selection)

**Studio Partner form:**
- Name (text)
- Email (email)
- Describe your idea (textarea — "What problem does it solve? Who is it for?")
- Do you have an existing audience or user base? (radio: Yes / No / Building one)
- Submit: `Apply For Partnership →`

**Custom Build form:**
- Name (text)
- Email (email)
- Company or business name (text)
- What do you need built? (textarea — "Describe the problem or tool you have in mind")
- Timeline (select: ASAP / 1 month / 1–3 months / Flexible)
- Budget range (select: Under $1K / $1K–$5K / $5K–$15K / $15K+)
- Submit: `Start My Project →`

**Portfolio / Investor form:**
- Name (text)
- Email (email)
- Organization (text, optional)
- Area of interest (select: Equity Investment / Licensing & White-label / Acquisition / Strategic Partnership / Other)
- Message (textarea)
- Submit: `Start The Conversation →`

**Form behavior:** Pure HTML forms. Action: `mailto:info@vibeworksstudio.ai` with subject line pre-filled by track. No backend required — consistent with static GitHub Pages deployment.

### Section 4: Direct Contact
- `Or email us directly: info@vibeworksstudio.ai`
- `We respond to every message within 24 hours.`
- Scarcity signal: `Currently accepting 2 new client engagements for Q2 2026.`

---

## Technical Notes

**File structure after implementation:**
```
index.html          (home — rewrite)
ventures.html       (new)
services.html       (new)
about.html          (new)
contact.html        (new)
styles.css          (shared — extend with new components)
script.js           (shared — new components gated by element checks)
images/
  Portfoliosites/   (existing — add CoreCreatorsAI + OptimizeAI URLs)
manifest.json       (update start_url, add pages to scope)
```

**All five pages share:**
- Same `<head>` (fonts, meta, styles.css)
- Same nav (with active state on current page via JS `window.location`)
- Same footer
- Same `script.js`
- Same cursor, grain overlay, scroll progress

**Contact form:** Uses `mailto:` href with URL-encoded subject lines per track. No server needed. Alternatively, Formspree (free tier) for proper form submission without backend — include as implementation option.

**CoreCreatorsAI and OptimizeAI Tool Suite:** Images confirmed present in `/images/Portfoliosites/`. Live URLs need to be confirmed by Ivan before implementation. Placeholder links acceptable for initial build.

**Active nav state:** JS checks `window.location.pathname` on load, adds `.active` class to matching nav link. CSS: `.nav__link.active { color: var(--text-primary); }`

**Page transitions:** Optional — CSS `@keyframes` fade-in on `body` for all inner pages. Keeps the premium feel without needing JS page transition libraries.
