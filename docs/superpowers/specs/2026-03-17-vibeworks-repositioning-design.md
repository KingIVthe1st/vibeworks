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

---

## Navigation (all pages — identical)

```html
<nav class="nav" id="nav">
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
</nav>
```

**Active nav state (JS — runs on all pages):**
```js
document.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
  if (link.getAttribute('href') === window.location.pathname ||
      window.location.pathname.includes(link.getAttribute('href').replace('.html',''))) {
    link.classList.add('active');
  }
});
```
**CSS:** `.nav__link.active { color: var(--text-primary); border-bottom: 1px solid var(--gold); }` The `.nav__cta` (Contact) when active: `background: var(--gold); color: var(--base);` instead of violet.

---

## Footer (all pages — identical, replaces existing footer)

**Simplified three-column layout:**
- Col 1: Logo wordmark `VibeWorks AI Studio` + tagline `AI Venture Studio` + email `info@vibeworksstudio.ai`
- Col 2: Navigation — Ventures / Services / About / Contact
- Col 3: Portfolio quick links — RateMyLooksAI / SketchMySoulmate / SongGram / AI Chart Traders / Rich People Stocks (top 5 only)
- Bottom bar: `© 2026 VibeWorks AI Studio · vibeworksstudio.ai` | `Built with AI. Delivered by humans.`

The existing four-column footer with sub-links and full 7-product listing is **replaced entirely** with this simplified structure.

---

## Page Loader

The animated VW monogram loader (`#loader`) runs **only on the home page** (`index.html`). On all other pages, the loader element is not present in the HTML. The loader JS in `script.js` is already gated by element existence (`if (!loader) return;`) so no change needed to JS — just don't include the loader HTML on inner pages.

---

## SEO — Page Meta Tags

Each page has unique `<title>`, `<meta name="description">`, and OG tags:

**index.html:**
- Title: `VibeWorks AI Studio — AI Venture Studio`
- Description: `VibeWorks is an AI venture studio. We build and launch our own AI products, partner with founders, and build custom AI for businesses. Nine live products.`
- OG title: `VibeWorks AI Studio — AI Venture Studio`

**ventures.html:**
- Title: `Our Ventures — VibeWorks AI Studio`
- Description: `Nine live AI products across consumer tech, fintech, health, music, and publishing. Built by VibeWorks in 2 weeks each.`
- OG title: `Nine Live AI Products — VibeWorks AI Studio`

**services.html:**
- Title: `Work With Us — VibeWorks AI Studio`
- Description: `Three ways to work with VibeWorks: Studio Partner (co-build, revenue share), Custom Build (AI for your business), or explore The Portfolio.`
- OG title: `Work With VibeWorks AI Studio`

**about.html:**
- Title: `About — VibeWorks AI Studio`
- Description: `VibeWorks AI Studio is a two-person AI venture studio led by Ivanlee Jackson and Natasha Burton. Learn our story and thesis.`
- OG title: `About VibeWorks AI Studio`

**contact.html:**
- Title: `Contact — VibeWorks AI Studio`
- Description: `Start a conversation with VibeWorks. Apply to partner, start a custom build, or discuss portfolio opportunities.`
- OG title: `Contact VibeWorks AI Studio`

All pages share: `canonical` URL (absolute), `og:image` (reuse existing social card), `twitter:card: summary_large_image`, `theme-color: #8B5CF6`.

---

## Design System

**Retain all existing design tokens** from `styles.css`:
- Colors: `--base: #07070E`, `--violet: #8B5CF6`, `--gold: #E8B84B`, `--crimson: #7B1A2E`, all others
- Fonts: Bricolage Grotesque (display) + Plus Jakarta Sans (body)
- All animation systems: aurora orbs, particle canvas, custom cursor, grain overlay, reveal animations, magnetic buttons, 3D tilt
- All existing component classes unchanged

**New CSS components to append to `styles.css`:**
- `.page-hero` — tight page hero (not full-screen), used on all inner pages
- `.track-nav` — three anchor pills for Services page
- `.track-section` — full-width track block on Services page
- `.venture-featured` — full-width featured venture hero card (Ventures page top)
- `.venture-row` — two-column editorial row (Ventures page grid)
- `.venture__name` — product name heading inside `.venture-row__info`; gold underline animation on hover: `border-bottom: 2px solid transparent; transition: border-color 0.3s ease;` with hover state `border-color: var(--gold);`
- `.venture-preview` — three-column home page venture preview cards
- `.how-panel` — three-column track intro panels (Home page)
- `.team-teaser` — two-column founder teaser (Home page)
- `.proof-strip` — horizontal stat blocks (Services page bottom)
- `.track-selector` — three selector cards (Contact page)
- `.contact-form` — form styles

**Mobile breakpoints for all new components:** Stack to single column at `max-width: 768px`. Track nav pills wrap at `max-width: 600px`. All grids use `grid-template-columns: 1fr` on mobile.

---

## All Nine Portfolio Products (copy)

**Products with confirmed images and existing copy:**

| # | Name | Image | Category | Tagline | External URL |
|---|---|---|---|---|---|
| 1 | RateMyLooksAI | `ratemylooks.png` | Consumer AI | Your Beauty Score, Decided by AI | https://ratemylooks.pages.dev/ |
| 2 | SketchMySoulmate | `sketchmysoulmate.png` | Creator AI | See Your Perfect Match, Visualized | https://sketchmysoulmate.com |
| 3 | SongGram | `songgram.png` | Music AI | Who Are You Through Music? | https://songgram.com |
| 4 | AI Book Publisher | `aibookpublisher.png` | Publishing AI | Blank Page to Published Author | https://aibookpublisher.com |
| 5 | MD Diagnose | `mddiagnose.png` | Health AI | Medical Answers, No Appointment | https://md-diagnose-app.ivanleejackson.workers.dev/ |
| 6 | AI Chart Traders | `aicharttraders.png` | Fintech AI | Trade Smarter. React Faster. | https://aicharttraders.com |
| 7 | Rich People Stocks | `richpplstocks.png` | Fintech AI | Track What Insiders Actually Buy | https://richpeoplestocks.com/ |

**Products with images present — URLs need confirmation before implementation:**

| # | Name | Image | Category | Placeholder Tagline | Description |
|---|---|---|---|---|---|
| 8 | CoreCreatorsAI | `corecreatorsai.png` | Creator AI | Built for Creators Who Mean Business | AI-powered tools for content creators and online businesses. *(Confirm URL and description with team before publishing.)* |
| 9 | OptimizeAI Tool Suite | `optimizeaitoolsuite.png` | AI Tools | Your AI Stack, Optimized | A suite of AI-powered optimization tools for productivity and workflow automation. *(Confirm URL and description with team before publishing.)* |

**Implementation note:** Use placeholder copy above for #8 and #9. Add `data-needs-url="true"` attribute on their `<a>` elements so they can be found easily and updated once URLs are confirmed. Set `href="#"` and `target="_self"` until real URLs are added. The stat counter on the home page must read `data-count="9"` (not 7).

---

## Home Page (`index.html`) — Full Spec

### Shared with existing: cursor, grain overlay, scroll progress, nav, footer

### Section 1: Hero
- **Canvas + aurora orbs:** Keep existing `#heroCanvas` + `.hero__aurora` — these stay on home page only
- **Availability eyebrow:** Green pulsing dot + "2 client spots open · Q2 2026"
- **Headline:** `We Build AI Products.`
- **Subheadline:** `VibeWorks is an AI venture studio. We launch our own products, partner with founders, and build custom AI for businesses. Nine live products and counting.`
- **Three CTAs (horizontal row, flex-wrap on mobile):**
  - `See Our Ventures →` — ghost button — `href="/ventures.html"`
  - `Partner With Us →` — gold button + magnetic — `href="/services.html#partner"`
  - `Build Something →` — violet button + magnetic — `href="/services.html#build"`
- **Stats row (4 stats):**
  - `9` (animated counter, `data-count="9"`) + label `Products Launched`
  - `2 Wks` (static) + label `Avg Delivery`
  - `500K+` (static) + label `Distribution Reach`
  - `5` (animated counter, `data-count="5"`) + label `Verticals`
- **Marquee ticker:** `AI Venture Studio` · `9 Live Products` · `2-Week Delivery` · `500K+ Reach` · `Claude-Powered` · `Zero Fluff. Real Results.`

### Section 2: Featured Ventures (3 preview cards)

**Component class:** `.venture-preview` — new component (NOT `.bento-item`). Text always visible below image (not hover overlay). Suitable for visitors who haven't seen any of the products yet.

**Layout:** Three equal columns desktop, single column mobile.

**Each `.venture-preview-card`:**
```
[screenshot image — aspect-ratio: 16/10, object-fit: cover, border-radius: 12px]
[category tag — gold, uppercase, small]
[product name — display font, 24px]
[one-line description — muted, 15px]
[Live → link — small ghost button, opens in new tab]
```
Hover: image scales to 1.03, box-shadow deepens. No overlay.

**Featured products:** RateMyLooksAI · SongGram · AI Chart Traders

**Section header:**
- Label: `From The Portfolio`
- Headline: `What We've Built`
- Footer link: `See all 9 ventures →` to `/ventures.html` (centered, below cards)

### Section 3: Three Ways To Work With Us

**Component class:** `.how-panel` — three equal columns, each with icon SVG + label + headline + body + text link. Separated by subtle `1px solid var(--border)` vertical dividers on desktop. Stacks to single column on mobile.

**Panel 1 — Studio Partner:**
- SVG icon: two overlapping circles (partnership/merge concept) — inline, 32px, `var(--gold)`
- Label: `For Founders & Creators`
- Headline: `Studio Partner`
- Body: `You bring the vision. We build the product. Revenue share — no upfront cost.`
- Link: `Learn more →` href `/services.html#partner`

**Panel 2 — Custom Build:**
- SVG icon: code brackets / terminal prompt — inline, 32px, `var(--violet-bright)`
- Label: `For Entrepreneurs & SMBs`
- Headline: `Custom Build`
- Body: `We build your AI product or tool from scratch. Fixed scope. 2-week delivery.`
- Link: `Learn more →` href `/services.html#build`

**Panel 3 — The Portfolio:**
- SVG icon: 3×3 dot grid — inline, 32px, `var(--text-muted)`
- Label: `For Investors & Operators`
- Headline: `The Portfolio`
- Body: `Nine live ventures. Open to investment, licensing, and strategic partnership.`
- Link: `Explore →` href `/ventures.html`

**Section header:** Label `How We Work` · Headline `Three Ways To Work With VibeWorks`

### Section 4: Team Teaser

**Layout:** Two columns (one per founder), each: photo (200px height, border-radius 12px, object-fit: cover) + name (display, 24px) + one-sentence role. Centered. Link `Meet the team →` centered below, href `/about.html`.

**Ivan:** `Co-Founder & CTO — The technical engine behind every product we've shipped.`
**Natasha:** `Co-Founder & CEO — The distribution engine that makes every launch land.`

### Section 5: Footer CTA (above site footer)
- Headline: `Every product we've built started with one conversation.`
- CTA: single gold magnetic button `Start The Conversation →` href `/contact.html`

---

## Ventures Page (`ventures.html`)

### Head/Nav/Footer: standard (no loader, no heroCanvas, no aurora orbs)

### Section 1: Page Hero (`.page-hero`)
- Background: `.services__grid-bg` CSS class reused (subtle grid lines, existing class)
- Label: `The Portfolio`
- Headline: `Nine Products. All Live. All Real.`
- Subline: `We don't prototype. We don't concept. We ship — across healthcare, fintech, music, beauty, publishing, and creator tech.`

### Section 2: Featured Venture (`.venture-featured`)
**RateMyLooksAI** — full-width card treatment:
- Large screenshot (100% width, `aspect-ratio: 21/9`, `object-fit: cover`, `border-radius: 16px`)
- Overlaid bottom panel (gradient from transparent to `rgba(7,7,14,0.95)`):
  - Live badge (green dot)
  - Category: `Consumer AI · Established User Base`
  - Name: `RateMyLooksAI` (display, 52px)
  - Tagline: `Your Beauty Score, Decided by AI`
  - Description: AI-powered appearance analysis with an established daily user base and strong social engagement across platforms.
  - `Visit Live →` external link, ghost small button

### Section 3: Venture Grid (`.venture-row` rows)

**Layout:** Each `.venture-row` is a two-column grid (image + text), `gap: var(--space-4xl)`, `max-width: 1200px`, `margin: 0 auto var(--space-4xl)`. Alternates: odd rows image-left, even rows image-right — apply `direction: rtl` to even-numbered `.venture-row` elements, with `direction: ltr` on their children to restore text direction. On mobile: single column, image always on top (`direction: ltr` reset at `max-width: 768px`).

**Each row contains:**
- Image side: `<div class="venture-row__image">` — screenshot, `aspect-ratio: 16/10`, `object-fit: cover`, `border-radius: 12px`, `box-shadow: 0 24px 60px rgba(0,0,0,0.5)`, Live badge overlay, hover: `scale(1.02)` + violet glow
- Info side: `<div class="venture-row__info">` — category tag (gold, uppercase, 12px) · product name (display, clamp 32px–52px, gold underline animation via `.venture__name`) · tagline (italic, muted) · 2-sentence description · `Visit →` ghost button

**Order and copy:**
1. SketchMySoulmate — `Creator AI · Viral Distribution` — `See Your Perfect Match, Visualized` — AI visualization of your ideal partner, distributed virally through creator partnerships with massive organic reach.
2. SongGram — `Music AI · Multi-Platform` — `Who Are You Through Music?` — AI-powered music personality analysis with integrations across major streaming platforms.
3. CoreCreatorsAI — `Creator AI · Content Tools` — `Built for Creators Who Mean Business` — *(Placeholder — confirm description with team. `href="#" data-needs-url="true"`)*
4. AI Book Publisher — `Publishing AI · Content Creation` — `Blank Page to Published Author` — AI-powered book creation tool enabling rapid content workflows from concept to published in minutes.
5. OptimizeAI Tool Suite — `AI Tools · Productivity` — `Your AI Stack, Optimized` — *(Placeholder — confirm description with team. `href="#" data-needs-url="true"`)*
6. MD Diagnose — `Health AI · Triage Automation` — `Medical Answers, No Appointment` — AI-powered preliminary health assessment providing accessible medical guidance.
7. AI Chart Traders — `Fintech AI · Technical Analysis` — `Trade Smarter. React Faster.` — Automated technical analysis for traders with AI-driven chart pattern recognition in real time.
8. Rich People Stocks — `Fintech AI · Insider Intelligence` — `Track What Insiders Actually Buy` — Real-time tracking of congressional and institutional trades.

### Section 4: The Pattern (editorial interstitial)
- Centered, `max-width: 720px`, `padding: var(--space-4xl) 0`
- Label: `The System`
- Headline: `One Formula. Nine Proofs.`
- Copy: `Every one of these started the same way: an idea, a conversation, and 2 weeks. Different verticals. Same system. That system is available to you.`
- Three inline proof stats: `9 verticals tested` · `100% shipped on time` · `All live today`

### Section 5: Dual CTA
- Headline: `See something that sparks an idea?`
- Two buttons: `Partner With Us →` (gold, magnetic) href `/services.html#partner` · `Build Something Similar →` (ghost) href `/services.html#build`

---

## Services Page (`services.html`)

### Head/Nav/Footer: standard (no loader, no heroCanvas, no aurora)

### Section 1: Page Hero (`.page-hero`)
- Background: `.services__grid-bg` reused
- Label: `How We Work`
- Headline: `Three Ways To Work With VibeWorks`
- Subline: `Whether you have an idea, a business problem, or want to build together — there's a track for you.`
- **Track nav pills (`.track-nav`):** Three `<a>` elements styled as pill buttons, `href="#partner"`, `#build"`, `#portfolio"`. On mobile: pills wrap into two rows. No scroll-spy — standard anchor behavior only. Smooth scroll via existing `scroll-behavior: smooth` on `html`. No sticky positioning (keep it simple).

### Section 2: Track 1 — Studio Partner (`id="partner"`, `.track-section`)
- **Label:** `For Founders & Creators`
- **Headline:** `You Have The Vision. We Have The Machine.`
- **Copy:** You bring an idea — a product concept, an audience, a problem worth solving. We bring 9 launches of experience, full-stack AI build capability, and 500K+ distribution reach. We build it together. We split the upside.
- **Two-column layout** (desktop): left col = copy + CTA, right col = two `<ul>` lists
- **What you get:**
  - Full product build — design, development, AI infrastructure
  - Launch strategy and distribution through our network
  - Ongoing development and iteration post-launch
  - A partner who has done this 9 times before
- **What we need from you:**
  - A strong idea with a clear target user
  - Domain expertise, audience, or unique insight
  - Commitment to the partnership beyond launch
- **Structure note:** `Revenue share — no upfront cost to qualified partners`
- **CTA:** `Apply For Partnership →` gold magnetic button, href `/contact.html?track=partner`
- **`reveal-up` on section entry**

### Section 3: Track 2 — Custom Build (`id="build"`, `.track-section`)
- **Label:** `For Entrepreneurs & Small Businesses`
- **Headline:** `Tell Us What You Need Built. We'll Build It.`
- **Copy:** AI agents, internal automation tools, customer-facing products — if your business needs it and AI can power it, we build it. Fixed scope, fast delivery, you own it when we're done.
- **What we build:**
  - AI agents and automation workflows
  - Customer-facing AI products and tools
  - Internal business intelligence and workflow tools
  - Full-stack AI web applications
- **Timeline & Investment (two-column sub-grid):**
  - `Agents & Automation` — 5–10 business days — $1K–$5K
  - `Full Product Builds` — 2 weeks — Custom scope
- **CTA:** `Start A Project →` violet magnetic button, href `/contact.html?track=build`

### Section 4: Track 3 — The Portfolio (`id="portfolio"`, `.track-section`)
- **Label:** `For Investors & Operators`
- **Headline:** `Nine Live Products. Multiple Opportunities.`
- **Copy:** Our ventures aren't side projects — they're operating products with real users across multiple categories. If you're interested in investing, licensing, acquiring, or building on top of what we've launched, we're open to the conversation.
- **Opportunities:**
  - Equity investment in individual ventures
  - Licensing and white-label arrangements
  - Acquisition of specific products
  - Strategic partnership and integration
- **CTA:** `Discuss Opportunities →` ghost magnetic button, href `/contact.html?track=portfolio`

### Section 5: Proof Strip (`.proof-strip`)
Three equal columns, centered text:
- `9 Products` — `We've shipped more in a year than most agencies do in five.`
- `2 Weeks` — `A proven timeline with 9 completions behind it. Not a pitch — a track record.`
- `500K+ Reach` — `Every product we launch has distribution built in from day one.`

---

## About Page (`about.html`)

### Head/Nav/Footer: standard

### Section 1: Page Hero (`.page-hero`)
- Headline: `Built By Builders.`
- Subline: `VibeWorks AI Studio is a two-person team that ships faster than most companies ten times our size. Here's why — and where we're going.`
- Background: bare `var(--base)` — no grid, no aurora

### Section 2: The Studio Thesis
- **Label:** `Our Thesis`
- Four paragraphs (no headline needed — let the copy carry it):
  1. `Most AI companies are either research labs or service firms. We're neither.`
  2. `We're operators. We build products, put them live, and watch them work in the real world. That feedback loop — across 9 products, 5 verticals, hundreds of thousands of users — is what makes us different.`
  3. `The formula we've developed isn't magic. It's a repeatable system: identify a real problem, build a focused AI solution, launch with distribution, iterate fast. Two weeks, start to finish.`
  4. `We're building VibeWorks to be the studio that defines what AI product development looks like at speed and scale. Every product teaches us something. Every client build funds the next experiment. The machine keeps compounding.`

### Section 3: The Team (full treatment)
**Layout:** Two stacked rows using the existing `.founder` CSS class (defined in `styles.css` — grid: 400px photo + text content). Reference the `.founder` class definition in `styles.css` for markup structure; do not reference `index.html` (that file will be rewritten).

**Ivanlee Jackson — Co-Founder & CTO**
- Photo: `images/Portfoliosites/ivan.jpg`
- Bio 1: 10+ years building full-stack products from zero to production. Ivan has shipped AI-powered apps across healthcare, fintech, music, and consumer tech — fast, clean, and built to scale.
- Bio 2 (strong): He architects the infrastructure. He writes the code. He is the reason 2 weeks is a track record, not a claim.
- Creds: `10+ years full-stack engineering` · `Expert in 0→1 AI product builds` · `Claude, OpenClaw & modern AI infrastructure` · `Every line of code is production-grade`

**Natasha Burton — Co-Founder & CEO**
- Photo: `images/Portfoliosites/natasha.jpeg`
- Bio 1: 500K+ followers and a track record of turning audiences into revenue. Natasha understands distribution at a level most agencies never reach — because she lives it.
- Bio 2 (strong): She is the reason products don't just launch. They land.
- Creds: `500K+ engaged audience` · `Serial viral product launcher` · `Creator economy & growth strategy` · `The bridge between AI capability and real people`

### Section 4: The Vision
- **Label:** `Where We're Going`
- **Headline:** `The Vision`
- **Copy:** We're building a portfolio of AI products that compounds. Each venture teaches us something the next one benefits from. Each client build funds the next studio experiment. The goal is not one big hit — it's a machine that keeps producing them. We're early. The portfolio is growing. If you want to be part of that, there's a track for you.

### Section 5: CTA
- Headline: `Want to build something with us?`
- Gold magnetic button: `Start A Conversation →` href `/contact.html`

---

## Contact Page (`contact.html`)

### Head/Nav/Footer: standard

### Section 1: Page Hero (`.page-hero`)
- Headline: `Let's Talk.`
- Subline: `Tell us what you're working on. We'll tell you honestly if and how we can help.`
- Below subline (green badge): pulsing dot + `Currently accepting 2 new client engagements for Q2 2026.`

### Section 2: Track Selector (`.track-selector`)
Three large clickable `<button>` cards. On click: card gets `.selected` class (gold border + light gold background tint), corresponding form fades in below.

**JS behavior — auto-select from URL param:**
```js
const params = new URLSearchParams(window.location.search);
const track  = params.get('track'); // 'partner' | 'build' | 'portfolio'
if (track) {
  const btn = document.querySelector('[data-track="' + track + '"]');
  if (btn) btn.click(); // trigger selection + form reveal
}
```

**Card markup pattern:**
```html
<button class="track-card" data-track="partner">
  <span class="track-card__icon"><!-- SVG --></span>
  <span class="track-card__title">Studio Partner</span>
  <span class="track-card__sub">I have an idea and want to build together</span>
</button>
```

**Cards:**
- `data-track="partner"` — `Studio Partner` — `I have an idea and want to build together`
- `data-track="build"` — `Custom Build` — `I need AI built for my business`
- `data-track="portfolio"` — `Portfolio / Investor` — `I'm interested in your ventures`

### Section 3: Forms (`.contact-form`, one per track, hidden by default)

**Form handling:** All three forms use **Formspree** (`https://formspree.io`). Set `action="https://formspree.io/f/FORMSPREE_ID"` and `method="POST"`. Each form gets its own Formspree endpoint (3 total). Add `<input type="hidden" name="_subject" value="Studio Partner Inquiry">` etc. for email subject. **Formspree endpoint IDs are to be created by the developer during setup — add placeholders `FORMSPREE_PARTNER_ID`, `FORMSPREE_BUILD_ID`, `FORMSPREE_PORTFOLIO_ID` as comments in HTML.**

Fallback if Formspree not set up: forms open mailto link via JS on submit. But Formspree is the primary approach.

**Form success state:** Add `<input type="hidden" name="_next" value="/contact.html?sent=true">` to each form. On page load, detect `?sent=true` in URL and show an inline success banner above the track selector: green border, text `"Message sent. We'll be in touch within 24 hours."`. Use `URLSearchParams` to check, and `history.replaceState` to clean the URL param after showing the banner. No redirect to an external Formspree page.

**Form reveal JS:**
```js
document.querySelectorAll('.track-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.track-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.contact-form').forEach(f => f.classList.remove('visible'));
    card.classList.add('selected');
    const form = document.querySelector('[data-form="' + card.dataset.track + '"]');
    if (form) form.classList.add('visible');
  });
});
```

**Studio Partner form** (`data-form="partner"`):
- Name (required)
- Email (required)
- `What's your idea?` textarea — placeholder: "What problem does it solve? Who is it for?"
- `Do you have an existing audience or user base?` — radio: Yes / No / Building one
- Hidden: `_subject` = `Studio Partner Application`
- Submit: `Apply For Partnership →` (gold button)

**Custom Build form** (`data-form="build"`):
- Name (required)
- Email (required)
- Company or business name
- `What do you need built?` textarea — placeholder: "Describe the tool or product you have in mind"
- Timeline (select): ASAP / Within 1 month / 1–3 months / Flexible
- Budget range (select): Under $1K / $1K–$5K / $5K–$15K / $15K+
- Hidden: `_subject` = `Custom Build Inquiry`
- Submit: `Start My Project →` (violet button)

**Portfolio / Investor form** (`data-form="portfolio"`):
- Name (required)
- Email (required)
- Organization (optional)
- Area of interest (select): Equity Investment / Licensing & White-label / Acquisition / Strategic Partnership / Other
- Message textarea
- Hidden: `_subject` = `Portfolio / Investor Inquiry`
- Submit: `Start The Conversation →` (ghost button)

**Form CSS states:**
- `.contact-form` — `display: none` by default
- `.contact-form.visible` — `display: block`, fade-in via `animation: fadeInUp 0.4s ease`
- Form inputs: `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: 8px`, `padding: 12px 16px`, `color: var(--text-primary)`, `font-family: var(--font-body)`, `width: 100%`
- Input focus: `border-color: var(--violet)`, `outline: none`
- Submit button: full width, uses existing `.btn` classes

### Section 4: Direct Contact
```
Or email us directly: info@vibeworksstudio.ai
We respond to every message within 24 hours.
```

---

## Technical Notes

**File structure after implementation:**
```
index.html          (home — complete rewrite)
ventures.html       (new)
services.html       (new)
about.html          (new)
contact.html        (new)
styles.css          (shared — new components appended)
script.js           (shared — all new components gated by element existence)
images/
  Portfoliosites/   (existing — all 9 product images present)
manifest.json       (update: start_url "/", add scope "/")
```

**`manifest.json` update:** Change `start_url` to `"/"`. Add `"scope": "/"` as a string. Keep existing `name`, `short_name`, `theme_color`, `background_color`, `display`.

**Cross-page anchor links** (e.g. `href="/services.html#partner"` from home page): These work correctly with `scroll-behavior: smooth` already set on `html` in `styles.css`. The browser will navigate to the page and scroll to the target after full page paint — no extra JS needed.

**`logoclear.png`:** Available at `/images/Portfoliosites/logoclear.png`. Use as `<img>` in nav if preferred over text wordmark. Default to text wordmark (`VibeWorks`) — only swap to image if logo renders cleanly at nav height (~28px). Keep as text for now.

**OpenClaw:** Confirmed spelling throughout — `OpenClaw` (one word, capital C). Reference: https://openclaw.ai/

**Stat counters:** Home page stat row changes to `data-count="9"` (products) and `data-count="5"` (verticals). Remove the `$1K–$5K` static stat — intentionally dropped from home hero (pricing detail belongs on Services page). The `500K+` and `2 Wks` stats remain as static text, not counters.
