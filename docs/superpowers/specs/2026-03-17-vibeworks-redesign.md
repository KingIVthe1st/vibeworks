# VibeWorks AI Studio — Landing Page Redesign Spec
**Date:** 2026-03-17
**Author:** Claude (with Ivanlee Jackson)
**Status:** Approved for implementation

---

## Overview

Complete redesign of vibeworksstudio.ai — a cinematic, scroll-driven landing page for VibeWorks AI Studio. The site serves two primary purposes:

1. **AI Agent Consulting & Installation** — custom AI agents (powered by Claude/OpenClaw) for solopreneurs and SMBs (5–50 people), priced $1K–$5K
2. **AI Product Studio** — full-stack AI product development in 2 weeks or less, via partnership (revenue share) or fixed-price development

**Goal:** Every visitor should feel: "These people are the smartest in the room" + "I'm behind and need to act now" + "This is exactly what I need — where do I sign?"

---

## Target Audience

- **Primary:** Solopreneurs, entrepreneurs, coaches, consultants drowning in manual work
- **Secondary:** SMBs (5–50 people) wanting to automate operations
- **Tertiary:** Creators with 50K+ audiences seeking AI product revenue share

---

## Visual Language

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--base` | `#07070E` | Page background |
| `--surface` | `#0F0F1A` | Card backgrounds |
| `--violet` | `#8B5CF6` | Primary brand accent |
| `--violet-bright` | `#A78BFA` | Hover states, highlights |
| `--violet-glow` | `rgba(139,92,246,0.18)` | Card hover radial glow (violet) |
| `--gold` | `#E8B84B` | Premium accent, new service |
| `--gold-muted` | `#D4A017` | Secondary gold uses |
| `--gold-glow` | `rgba(232,184,75,0.15)` | Card hover radial glow (gold) |
| `--crimson` | `#7B1A2E` | Pain section gradient mid-stop |
| `--text-primary` | `#F8F9FB` | Headlines, primary text |
| `--text-muted` | `#9CA3AF` | Body text (≥4.6:1 contrast on #07070E — WCAG AA compliant) |
| `--text-subtle` | `#4B5563` | Placeholders, dividers |

### Typography
- **Display/Headlines:** Syne (Google Fonts) — geometric, distinctive, premium
- **Body:** Inter — clean, readable
- **Scale:**
  - Hero display: `clamp(56px, 10vw, 120px)`
  - Section display: `clamp(40px, 6vw, 80px)`
  - Section subhead: `clamp(18px, 2.5vw, 24px)`
  - Body: `18px`
  - Small/label: `12px` letter-spaced 0.15em

### Animation Principles
- All scroll-triggered via `IntersectionObserver`
- Entry: `opacity: 0 → 1` + `translateY(40px → 0)`, `600ms ease-out`
- Stagger delay: `80ms` between child elements
- Hover transitions: `200ms cubic-bezier(0.4, 0, 0.2, 1)`
- Card lift on hover: `translateY(-8px)`
- No animation for users who prefer reduced motion (`prefers-reduced-motion`)

---

## Page Architecture

### Navigation
- Fixed top, transparent → frosted glass on scroll past 80px
- Frosted glass style: `background: rgba(7,7,14,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(139,92,246,0.15)`
- Logo: "VibeWorks" in Syne
- Links: How It Works · Portfolio · Services · Team · Contact
- CTA button: "Build My Agent" — links to `mailto:info@vibeworksstudio.ai`
- Mobile: hamburger (3 lines) → transforms to X (300ms rotation) → full-screen overlay slides in from right, `300ms cubic-bezier(0.4,0,0.2,1)`, background `#07070E`, full opacity

### Section 1 — Hero
**Layout:** Full viewport height. Animated ambient particle/neural-network field (canvas, vanilla JS — no libs). Two depth layers.

**Copy:**
```
[gold label]  AI AGENTS · BUILT PRODUCTS · STUDIO

[Syne display, 3 lines]
Your Business.
Running On
Autopilot.

[body, muted]
We architect custom AI agents for entrepreneurs and small teams —
then build the products that put them to work.

[CTAs]
  [violet filled]  Get Your Agent Built
  [ghost]          See Our Work
```

**Stat counters (animate on load):**
- 7 — Products Launched
- $1K–$5K — Agent Builds (static text — not a numeric counter; fades in with opacity 0→1 over 600ms)
- 2 Weeks — Delivery (static text — same treatment)
- 500K+ — Creator Reach

Numeric counters (7, 500000): count up from 0 to final value over `1800ms`, `easeOutExpo` curve, triggered by IntersectionObserver on first viewport entry. Display as integer. `500K+` formatted with `K+` suffix appended after count completes.

**Mobile:** Stacked, headline at 48px, stats 2×2 grid, CTAs full-width stacked.

---

### Section 2 — Pain
**Layout:** Full-bleed dark. Centered single column. Word-by-word scroll reveal (50ms stagger per word).

**Copy:**
```
[violet label]  SOUND FAMILIAR?

[Syne display, word-by-word reveal]
You're talented.
You're busy.
And you're doing
everything manually.

[body]
Answering emails at midnight. Chasing leads by hand.
Scheduling, following up, onboarding, repeating.
Every hour you spend on tasks a machine could do
is an hour stolen from the work only you can do.

[gold bold callout]
Your competitors aren't working harder than you.
They just stopped working on the wrong things.
```

**Visual:** Slow-moving animated gradient behind text. Three stops: `#8B5CF6` (violet) → `#7B1A2E` (crimson) → `#07070E` (base black). Implemented as a large radial gradient on a pseudo-element, animating `background-position` in a 12s infinite loop. Blurred with `filter: blur(80px)`. Opacity 0.6. Movement direction: slow drift from bottom-left to top-right, reversing.

**Word-by-word reveal trigger:** IntersectionObserver fires once when section reaches `threshold: 0.2`. At that point, each `<span>` word receives `animation-delay: index * 50ms`, animating from `opacity: 0; transform: translateY(20px)` to visible over `500ms ease-out`. This is a time-based stagger from a single IntersectionObserver trigger — not scroll-scrubbed.

---

### Section 3 — The Shift
**Layout:** Full viewport. Left: rotating 3D wireframe sphere (CSS 3D transform + JS, assembles from scattered particles on enter). Right: copy. Mobile: sphere above copy.

**Copy:**
```
[gold label]  THE SHIFT

[Syne display]
What if the most
productive person
on your team
never slept?

[body]
AI agents don't take vacations. They don't miss follow-ups.
They don't forget. They don't get overwhelmed.

They handle your inbox, qualify your leads, onboard your
clients, manage your calendar — and they get better
every single day.

[gold bold]
This isn't the future. This is Tuesday.

[body]
VibeWorks architects, installs, and customizes AI agents
built specifically for how your business works —
not some generic template that half-fits.

Using platforms like OpenClaw and cutting-edge
Claude-powered infrastructure, we wire AI into
the tools you already use.

[violet link]  See how it works →
```

**Sphere implementation detail:**
- Rendered on a `<canvas>` element, vanilla JS, `requestAnimationFrame`
- 120 points distributed evenly on a sphere surface (Fibonacci lattice algorithm)
- Sphere radius: 180px (desktop), 120px (mobile)
- Wireframe lines: drawn between points within 60px of each other; color `#E8B84B` (gold) at 40% opacity
- On scroll-enter: points start at random positions within ±300px of center, animate to sphere surface over 1200ms `easeOutCubic`
- After assembly: sphere rotates continuously on Y-axis at 0.003 radians/frame (~10s per revolution)
- Pulse: every 3s, sphere scales from 1.0 → 1.05 → 1.0 over 800ms `easeInOutSine` via canvas transform scale
- Point color: `#A78BFA` (violet-bright), radius 2px

---

### Section 4 — Services
**Layout:** Full-bleed, subtle 1px grid texture background. Two oversized cards side by side (45% each). Mobile: stacked, agent card first.

**Header:**
```
[violet label]  HOW WE WORK WITH YOU

[Syne display, centered]
Two Ways to Transform
Your Business

[body, muted]
Whether you need an AI agent working inside your business
or a full product built and launched — we do both.
```

**Card 1 — AI Agent Consulting** (gold top border):
```
[gold badge]  NEW
[heading]  Custom AI Agents
[subhead]  For entrepreneurs & small teams
[price]  $1K – $5K

[body]
We architect and install AI agents custom-built
for your specific workflows. Your email. Your CRM.
Your calendar. Your voice.

Not a chatbot. Not a template.
A tireless digital team member wired
directly into how you work.

[features — staggered fade-in]
✦  Powered by Claude & OpenClaw
✦  Connects to your existing tools
✦  Custom memory & personality
✦  WhatsApp, Slack, email integration
✦  Ongoing support & refinement

[CTA]  Build My Agent  [gold filled, dark text]
```

**Card 2 — AI Product Studio** (violet top border):
```
[heading]  AI Product Studio
[subhead]  For founders, creators & companies
[price/time]  2 Weeks

[body]
We build full AI products from idea to launch.
Partner with us on revenue share, or hire
us for fixed-price development.

Seven live products and counting — we
know what it takes to ship fast and ship right.

[features]
✦  Full-stack AI development
✦  Partnership track (revenue share)
✦  Fixed-price project builds
✦  Launch strategy included
✦  Production-ready from day one

[CTA]  Start a Project  [violet filled]
```

**Below cards:**
```
Not sure which fits? [violet link] Book a free 20-minute call and we'll tell you honestly.
```

**Hover:** `transform: translateY(-8px)`, `transition: 300ms ease`. Border top brightens: agent card `border-color: #E8B84B`, studio card `border-color: #A78BFA`. Radial glow: `box-shadow: 0 0 60px 0 var(--gold-glow)` (agent) or `0 0 60px 0 var(--violet-glow)` (studio). Background shifts to `rgba(255,255,255,0.02)`.

**CTA link targets:**
- "Build My Agent" → `mailto:info@vibeworksstudio.ai`
- "Start a Project" → `mailto:info@vibeworksstudio.ai`
- "Book a free 20-minute call" → `mailto:info@vibeworksstudio.ai`

---

### Section 5 — Portfolio
**Layout:** Alternating left/right image + text. Each venture reveals cinematically on scroll (image from one side, text from the other, 600ms ease-out).

**Header:**
```
[gold label]  PROOF OF WORK

[Syne display, centered]
7 AI Products.
All Live. All Real.

[body, muted]
We don't prototype. We don't demo. We ship.
```

**Products:**
| Product | Headline | Tag |
|---|---|---|
| RateMyLooksAI | Your Beauty Score, Decided by AI | Consumer AI · Established User Base |
| SketchMySoulmate | See Your Perfect Match, Visualized | Creator AI · Viral Distribution |
| SongGram | Who Are You Through Music? | Music AI · Multi-Platform |
| AI Book Publisher | From Blank Page to Published Author | Publishing AI · Content Creation |
| MD Diagnose | Medical Answers, No Appointment Needed | Health AI · Triage Automation |
| AI Chart Traders | Trade Smarter. React Faster. | Fintech AI · Technical Analysis |
| Rich People Stocks | Track What Insiders Actually Buy | Fintech AI · Insider Intelligence |

**Image assets** (all in `images/Portfoliosites/`, existing files):
| Product | File | Aspect ratio |
|---|---|---|
| RateMyLooksAI | `ratemylooks.png` | 16:10, display at 560×350px desktop |
| SketchMySoulmate | `sketchmysoulmate.png` | 16:10 |
| SongGram | `songgram.png` | 16:10 |
| AI Book Publisher | `aibookpublisher.png` | 16:10 |
| MD Diagnose | `mddiagnose.png` | 16:10 |
| AI Chart Traders | `aicharttraders.png` | 16:10 |
| Rich People Stocks | `richpplstocks.png` | 16:10 |

Images displayed in `object-fit: cover` containers with `border-radius: 12px` and `box-shadow: 0 24px 60px rgba(0,0,0,0.5)`.

**Scroll reveal direction:** Odd rows (1,3,5,7): image enters from left (`translateX(-60px) opacity:0 → 0 opacity:1`), text from right (`translateX(60px)`). Even rows (2,4,6): image from right, text from left. `600ms ease-out`, triggered by IntersectionObserver `threshold: 0.15`.

Each: animated green pulse status dot (`#10B981`, 8px circle with `box-shadow: 0 0 8px #10B981`, `animation: pulse 2s infinite`), gold underline on name scroll-enter (width animates 0→100% over 600ms), image hover scale `transform: scale(1.02)` + `box-shadow: 0 0 40px rgba(139,92,246,0.3)`.

**Section close:**
```
[Syne display, centered]
Every one of these started
as a conversation.

[muted]  Yours could be next.
```

---

### Section 6 — Team
**Layout:** Two columns. Large editorial photos with radial glow (violet for Ivan, gold for Natasha). Mobile: stacked.

**Header:**
```
[violet label]  THE TEAM

[Syne display]
Built by People Who
Actually Ship.

[body, muted]
No suits. No middlemen. You work directly with the founders —
the same people who've built 7 live AI products from scratch.
```

**Ivan:**
```
[gold label]  CO-FOUNDER & CTO
[heading]  Ivanlee Jackson

10+ years building full-stack products from zero to production.
Ivan has shipped AI-powered apps across healthcare, fintech,
music, and consumer tech — fast, clean, and built to scale.

He architects the agents. He writes the code.
He's the reason 2 weeks isn't a promise, it's a track record.

· 10+ years full-stack engineering
· Expert in 0→1 AI product builds
· Claude, OpenClaw & modern AI infrastructure
· Every line of code is production-grade
```

**Natasha:**
```
[gold label]  CO-FOUNDER & CEO
[heading]  Natasha Burton

500K+ followers and a track record of turning audiences
into revenue. Natasha understands distribution at a level
most agencies never see — because she lives it.

She's the reason our products don't just launch.
They land.

· 500K+ engaged audience
· Serial viral product launcher
· Creator economy & growth strategy
· The bridge between AI capability and real people
```

**Below:**
```
[Syne display, centered]
When you work with VibeWorks,
you're not handed off to a team.
You work with us.

[muted small]  Every project. Every call. Every decision.
```

**Team photo assets:**
- Ivan: `images/Portfoliosites/ivan.jpg` — display at 400×480px, `object-fit: cover`, `border-radius: 12px`
- Natasha: `images/Portfoliosites/natasha.jpeg` — same dimensions

**Animation:** Ivan card: `translateX(-60px) opacity:0 → 0 opacity:1`, `600ms ease-out`. Natasha card: `translateX(60px) opacity:0 → 0 opacity:1`, `600ms ease-out`. Both triggered simultaneously by one IntersectionObserver on the founders grid, `threshold: 0.2`. Radial glow behind photo pulses once on entry: `box-shadow` animates from `0 0 0px rgba(...)` → `0 0 80px 20px var(--violet-glow)` (Ivan) or `var(--gold-glow)` (Natasha) over 800ms `ease-out`, then settles to `0 0 40px 8px` at rest.

---

### Section 7 — Process
**Layout:** Horizontal timeline on desktop (gold animated line draws left-to-right on scroll-enter, 1.5s). Vertical on mobile with gold left-border.

**Header:**
```
[gold label]  THE PROCESS

[Syne display]
From Conversation
to Deployed in Days.

[body, muted]
No lengthy discovery phases. No scope creep surprises.
```

**5 Steps:**
```
01  Discovery Call
    20 minutes. We listen more than we talk.
    You leave knowing exactly what's possible.

02  Proposal & Scope
    Within 48 hours. Clear pricing, clear timeline,
    clear deliverables. No surprises.

03  Build Sprint
    We move fast. You get progress updates
    every 2 days — not at the end.

04  Review & Refine
    Your feedback shapes the final product.
    We iterate until it's exactly right.

05  Launch & Handoff
    Deployed, documented, and running.
    Support available from day one.
```

Step numbers: Large Syne display at 8% opacity as ghost watermark behind each card (`font-size: clamp(80px,12vw,140px)`, `color: #F8F9FB`, `opacity: 0.08`, positioned absolutely behind card content).

**Timeline line (desktop):** A `<div>` with `height: 2px; background: --gold` stretches across all 5 steps. On scroll-enter (IntersectionObserver `threshold: 0.3`), `width` animates from `0%` → `100%` over `1500ms cubic-bezier(0.4,0,0.2,1)`. Uses CSS `clip-path` or `scaleX` transform for performance.

**Mobile timeline:** Vertical `border-left: 2px solid var(--gold)` on a wrapper div. Static — no draw animation on mobile. Steps stack vertically with `padding-left: 24px`.

---

### Section 8 — FAQ
**Layout:** Two-column grid desktop, single column mobile. Accordion expand, 300ms height transition. Active item: thin violet left-accent line.

**Header:**
```
[violet label]  QUESTIONS

[Syne display]
Everything You're
Wondering About.
```

**Accordion behavior:** Only one item open at a time. All items closed by default. Toggle icon: `+` → `×` (300ms rotation). Active item has `border-left: 3px solid var(--violet)` and background `rgba(139,92,246,0.06)`. Height transition: `max-height: 0 → max-height: 400px`, `300ms ease`, `overflow: hidden`.

**7 FAQs with full answers:**

**1. What exactly is an AI agent and why do I need one?**
An AI agent is software that takes actions on your behalf — answering emails, qualifying leads, scheduling meetings, pulling data — autonomously, 24/7. You need one because every hour you spend on repeatable tasks is an hour you can't spend growing. Agents don't sleep, forget, or get overwhelmed. They just work.

**2. How is this different from ChatGPT?**
ChatGPT answers questions. AI agents take action. We build agents wired into your actual tools — your inbox, your CRM, your calendar — so they work inside your business, not just respond in a chat window. The difference is passive vs. active. ChatGPT waits for you. Your agent doesn't.

**3. What does a $1K–$5K engagement actually include?**
Discovery, architecture, full installation, integration with your existing tools, custom configuration, testing, and onboarding. You're not buying a chatbot. You're buying a custom-built team member — scoped, installed, and running inside your business before the engagement ends.

**4. How fast can you actually deliver?**
Agent installations: 5–10 business days depending on complexity. Full product builds: 2 weeks. Both timelines are real — we've proven them across 7 live products in the wild. We don't pad timelines. We move.

**5. Do I need to be technical to work with you?**
No. You need to know your business. We handle everything technical. Our job is to translate what you need into something that works — you shouldn't have to understand how it works under the hood. If you can describe your pain, we can build the solution.

**6. What if I want a full AI product built, not just an agent?**
That's our Studio track. We build full AI products — web apps, consumer tools, B2B platforms — for fixed price or revenue share. Same team, same speed, bigger scope. Seven live products in the portfolio are proof of what that looks like.

**7. How do I know this will actually work for my business?**
You have 7 live products in the wild as proof of execution. Every one started as an idea on a call. We don't pitch concepts — we build things that work in the real world, across healthcare, fintech, music, and consumer tech. If we don't think we can deliver for your specific situation, we'll tell you on the discovery call.

---

### Section 9 — CTA
**Layout:** Full viewport height. Centered. Slow-moving gradient background (deep violet ↔ near-black). Noise texture overlay.

**Copy:**
```
[gold label]  READY?

[Syne display, massive]
Your Business
Shouldn't Wait
For You.

[body, large, muted]
Every day without an AI agent is a day your
competitors are pulling further ahead.
This isn't hype. This is the new baseline.

[CTAs, centered stacked]
  [gold filled]    Build My AI Agent  →
  [ghost border]   Start a Product Project  →

[small muted]  Or email us directly: info@vibeworksstudio.ai
[small muted]  Free 20-minute discovery call. Zero obligation.

[gold italic]
"The best time to automate your business was last year.
 The second best time is today."
```

**Animation:** Headline words drop in one at a time. Each word: `translateY(-30px) opacity:0 → 0 opacity:1`, `500ms ease-out`, `animation-delay: index * 120ms`. Triggered by IntersectionObserver on section entry `threshold: 0.3`.

**CTA link targets:**
- "Build My AI Agent" → `mailto:info@vibeworksstudio.ai`
- "Start a Product Project" → `mailto:info@vibeworksstudio.ai`

---

### Section 10 — Footer
```
[logo]  VibeWorks AI Studio
[tagline]  Agents · Products · Studio

[4 columns]
  Services              Portfolio               Company         Connect
  AI Agent Builds       RateMyLooksAI           Team            info@vibeworksstudio.ai
  Product Studio        SketchMySoulmate        Partner         Book a Call
  Partnership Track     SongGram
  Dev Services          AI Book Publisher
                        MD Diagnose
                        AI Chart Traders
                        Rich People Stocks

[bottom bar]
  © 2026 VibeWorks Studio · vibeworksstudio.ai
  Built with AI. Delivered by humans.
```

---

## Technical Implementation Notes

- **Stack:** Pure HTML/CSS/JS — no frameworks, no build tools. Deployed via GitHub Pages.
- **Fonts:** Google Fonts — Syne (400, 600, 700, 800) + Inter (400, 500, 600, 700)
- **Icons:** Unicode symbols (✦ · →) — no icon library needed
- **Animations:** Vanilla JS IntersectionObserver + CSS transitions. No GSAP, no ScrollTrigger.
- **Particle field:** Vanilla canvas API. 80 particles. Each particle: radius 1.5px, color `rgba(139,92,246,0.6)`. Movement: random direction at 0.2–0.5px/frame, bounces off canvas edges. Line drawn between any two particles within 150px: `rgba(139,92,246, 1 - distance/150)` opacity falloff. Two depth layers: 50 particles at full speed/opacity (foreground), 30 at 40% speed and 50% opacity (background, radius 1px). Canvas fills full hero section. Resizes on window resize.
- **Wireframe sphere:** CSS 3D transforms + requestAnimationFrame. No Three.js.
- **Mobile breakpoint:** 768px. Full mobile-first responsive grid.
- **Performance:** Lazy load all portfolio images. No external JS dependencies.
- **SEO:** Update meta tags to reflect new AI agent consulting positioning.
- **Accessibility:** `prefers-reduced-motion` respected. All images have alt text. Nav keyboard navigable.

---

## Files to Modify
- `index.html` — full rewrite
- `styles.css` — full rewrite
- `script.js` — full rewrite
- `manifest.json` — update theme color and description
- No new files required beyond these three.

---

## Success Criteria
1. Visitor understands within 5 seconds what VibeWorks does and who it's for
2. AI agent consulting is prominently featured as a primary service
3. Portfolio demonstrates credibility without feeling like a generic agency site
4. Mobile experience is indistinguishable in quality from desktop
5. Page load < 3s on mobile (no heavy dependencies)
6. Every section has a clear next action / scroll motivation
