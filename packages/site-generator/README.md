# Pintarweb
**AI-assisted web presence platform for Malaysian SMEs.**

Pintarweb builds trust-generation engines for local Malaysian businesses — not just websites. Each deliverable combines an online presence audit with a conversion-focused demo site, presented as a single report URL sent via WhatsApp.

---

## What This Is

An AI-assisted website factory built for Malaysian trades and services (aircond, contractor, renovation, plumbing). The system generates personalised audit reports and demo websites for leads who have no web presence or a weak one, then offers annual ownership.

**Not a template shop. Not a freelance agency. A managed digital presence platform.**

---

## How It Works

```
Lead identified (Google Maps scraper)
        ↓
Manual research + audit data collected
        ↓
Scores calculated (visibility, trust, first impression, competitor gap)
        ↓
AI generates audit copy (human-noticing style, local context)
        ↓
Demo site generated (Antigravity + OpenCode + Kimi + Claude)
        ↓
Audit micropage assembled with demo embed
        ↓
Single report URL deployed to Cloudflare Pages
        ↓
WhatsApp outreach with personalised message
        ↓
Client claims ownership → annual subscription
```

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Vibe coding | Antigravity + OpenCode |
| Bulk generation | Kimi API |
| Refinement | Claude API (Haiku for review, Sonnet for polish) |
| Hosting | Cloudflare Pages |
| Backend/API | Cloudflare Workers |
| Database | Cloudflare D1 |
| Storage | Cloudflare R2 |
| Version control | GitHub |
| Lead scraping | pintarweb-scraper |

---

## Repo Structure

```
pintarweb-claude/
├── clients/              one folder per client — config, site, audit
├── components/           reusable HTML/Tailwind sections
│   ├── heroes/
│   ├── cta-blocks/
│   ├── trust-sections/
│   ├── service-grids/
│   ├── galleries/
│   ├── faqs/
│   └── footers/
├── design-system/
│   ├── moods/            DESIGN.md files per visual mood
│   └── references/       screenshots and visual inspiration
├── prompts/              prompt library for generation and refinement
│   ├── generation/
│   ├── refinement/
│   ├── copy/
│   └── audit/
├── audit/                audit micropage templates and components
├── leads/                scraper output and outreach tracking
├── resources/            repos, videos, docs collected over time
├── docs/                 agency brain documents
├── .agent/               OpenCode skills and agent rules
├── AGENTS.md             project rules OpenCode reads on every session
├── ARCHITECTURE.md       system design decisions
├── CHANGELOG.md          what changed and when
└── schema.sql            Cloudflare D1 database schema
```

---

## Development Stages

| Stage | Goal | Status |
|-------|------|--------|
| Stage 1 — Manual | 3–5 paying clients, validate the product | 🟡 In progress |
| Stage 2 — Semi-Auto | Remove pipeline bottlenecks, 10–20 clients | ⬜ Planned |
| Stage 3 — Auto | Full pipeline, 50+ clients | ⬜ Planned |

---

## First Niche

**Aircond & Contractor — Selangor / KL**
One niche until first paying client. No exceptions.

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `docs/design-rules.md` | Visual constraints — governs all AI generation |
| `docs/copy-rules.md` | Copy voice — forbidden words, tone, Malaysian context |
| `docs/quality-checklist.md` | Pass/fail gate before any demo is sent |
| `docs/audit-language.md` | How to write audit copy that sounds human |
| `docs/no-website-playbook.md` | Handling leads with no website |
| `docs/social-media-playbook.md` | Handling Instagram/TikTok-active leads |
| `docs/niche-logic.md` | Layout and copy logic per niche |
| `docs/outreach-playbook.md` | WhatsApp message templates and follow-up sequence |
| `docs/field-notes.md` | Real-world conversion intelligence — updated after every outreach |
| `AGENTS.md` | OpenCode project rules — always read before generating |
| `ARCHITECTURE.md` | System design and technical decisions |

---

## Environment Setup

```bash
# Install dependencies
npm install

# Authenticate Cloudflare
wrangler login

# Apply database schema
wrangler d1 execute pintarweb-db --local --file=./schema.sql

# Install OpenCode + Antigravity
# Follow vudovn/antigravity-kit instructions

# Copy environment variables
cp .env.example .env
# Fill in your API keys
```

---

## Environment Variables

```bash
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_D1_DATABASE_ID=

KIMI_API_KEY=
ANTHROPIC_API_KEY=

GOOGLE_PLACES_API_KEY=
```

Never commit `.env`. It is in `.gitignore`.

---

## Pricing Model

Monthly subscription. 3-month advance to start. Everything managed.

| Tier | Price | Includes |
|------|-------|----------|
| **Asas** | RM 149/mo (RM 447 advance) | Website + SEO + WhatsApp auto-reply bot + GMB |
| **Bisnes** | RM 299/mo (RM 897 advance) | Asas + Booking calendar + Review automation + Analytics |
| **Pro** | RM 499/mo (RM 1,497 advance) | Bisnes + Voice AI + WhatsApp chatbot + CRM + Priority |

---

## License

Private. All rights reserved.