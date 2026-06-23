# Architecture

This document records system design decisions and technical rationale for Pintarweb.
Updated whenever a significant decision is made.

---

## Core Philosophy

**One config. Two outputs. One URL.**

Every client starts as a `config.json` file. That single config generates:
1. A demo website (`index.html`)
2. An audit micropage (`audit.html`)
3. A combined report page (`report.html`)

All three deploy to a single Cloudflare Pages project under a preview subdomain.

```
clients/{id}/config.json
        ↓
   generate-site.js
        ↓
clients/{id}/
├── index.html     → preview.pintarweb.my/{id}
├── audit.html     → preview.pintarweb.my/{id}/audit
└── report.html    → preview.pintarweb.my/{id}/report  ← send this
```

---

## Infrastructure — Cloudflare First

**Decision:** Cloudflare Pages + Workers + D1 + R2 over AWS/GCP/Azure.

**Rationale:**
- Zero egress fees — R2 and Pages serve assets with no bandwidth charges
- Edge delivery — static sites served from nearest datacenter globally
- Free tier covers all of Stage 1 and most of Stage 2
- Single platform — DNS, hosting, database, storage, serverless in one place
- `wrangler` CLI integrates cleanly with the local development workflow

**Pages:** Static site hosting. All client sites deployed here. Auto-deploys on GitHub push.

**Workers:** Serverless functions for:
- Preview URL routing (`/preview/{id}`, `/audit/{id}`, `/report/{id}`)
- Open/click tracking (`POST /api/track`)
- Client record management (`POST /api/clients`)

**D1:** SQLite-at-the-edge for:
- Client records and configs
- Lead tracking and outreach status
- Outreach event log (opens, clicks, replies)

**R2:** Object storage for:
- Client assets (logos, photos, gallery images)
- Generated site files (backup copies)

---

## Site Generation — Static HTML Only

**Decision:** Pure HTML + Tailwind CSS. No framework. No build step.

**Rationale:**
- AI (Kimi/Claude) generates clean HTML naturally — frameworks add complexity
- No Node.js required on the client
- Deploys as static files — maximum performance, zero server cost
- Tailwind via CDN — no build pipeline needed
- Easy for AI to reason about and modify

**Generation flow:**
1. OpenCode session opened with `sme-website-generator` skill active
2. `clients/{id}/config.json` loaded as data source
3. Active `design-system/moods/{mood}.md` loaded as visual context
4. Kimi generates section HTML blocks
5. Claude refines copy and layout
6. Sections assembled into `index.html`
7. Quality checklist run before deploy

---

## AI Role Split

| Model | Role | Why |
|-------|------|-----|
| Kimi K2 | Bulk HTML generation, section drafts | Cheapest per token, fast, good at structured output |
| Claude Haiku 4.5 | Copy review, audit narrative draft, quality checks | Low cost, fast, good at following rules |
| Claude Sonnet 4.6 | Final refinement pass, complex design decisions | Higher quality when it matters |

**Rule:** Never use Sonnet for bulk generation. Never use Kimi for final copy polish.
**Cost target:** Under RM 1 per complete client deliverable (demo + audit + report).

---

## Prompt Architecture

Prompts are layered. Every generation session loads:

```
Layer 1 — Project rules      AGENTS.md (always loaded by OpenCode)
Layer 2 — Design contract    design-system/moods/{mood}.md
Layer 3 — Copy rules         docs/copy-rules.md
Layer 4 — Section prompt     prompts/generation/{section}.md
Layer 5 — Client data        clients/{id}/config.json
```

This layering ensures:
- AI never generates without knowing the visual contract
- AI never generates copy without knowing the forbidden words
- AI never generates without knowing the client's real data

Prompt caching (Anthropic) applies to Layers 1–3 — repeated across calls, cached at 75% discount after first use.

---

## Audit System — Conditional Rendering

The audit micropage renders differently based on two config flags:

```
has_website: false   → replaces First Impression Score with
                       "What Customers See Right Now" section +
                       digital journey two-column visualisation

instagram_active: true → adds "Your Social Media is Working Against You"
                         section + "locked inside Instagram" narrative +
                         social proof layer in demo preview
```

Both flags live in `config.json` under the `audit` and `social` objects.
One HTML template handles all scenarios via conditional blocks.

---

## Client Config Schema

The single source of truth for every client. Full schema in `clients/_schema.json`.

Key design decisions:
- `audit.first_impression_score: null` when `has_website: false` — explicit null, not zero
- `social` object always present even if all false — avoids null checks in templates
- `audit.generated_copy` stored in config after AI generation — preserves the output
- `service_areas` array separate from `area` string — allows granular display

---

## Database Schema

Three tables. See `schema.sql` for full definitions.

`clients` — one row per client site. `config_json` stores the full config as TEXT.
`leads` — one row per scraped lead. `outreach_status` tracks pipeline position.
`outreach_events` — event log for opens, clicks, replies. References `leads.id`.

**Decision:** Store `config_json` as TEXT in D1 rather than normalising all fields.
**Rationale:** Config structure evolves frequently in Stage 1. Normalising now creates
migration overhead. Extract specific fields into columns only when query patterns demand it.

---

## Preview URL Structure

```
preview.pintarweb.my/{id}           → demo site
preview.pintarweb.my/{id}/audit     → audit only
preview.pintarweb.my/{id}/report    → combined (this is what gets sent)
```

Cloudflare Worker handles routing. Each URL maps to a static file in R2 or Pages.

Open/click tracking: every report URL hit fires `POST /api/track` via a small
inline script. Stored in `outreach_events` table. Used to time follow-ups.

---

## Deployment Pipeline — Stage 1 (Manual)

```
1. config.json created manually
2. OpenCode session → generate sections → assemble index.html
3. Audit data calculated → audit.html generated
4. report.html assembled (audit + demo embed)
5. git push → Cloudflare Pages auto-deploys
6. Preview URL confirmed live
7. Quality checklist run
8. Outreach sent
```

Target time: under 2 hours per complete client deliverable by site 5.

---

## Deployment Pipeline — Stage 2 (Planned)

```
1. pintarweb-scraper output → auto-filter script
2. Google Places API → auto-populate audit data
3. generate-all.js → config → all three HTML files
4. deploy.js → Wrangler → live URLs returned
5. D1 record created automatically
6. n8n triggers follow-up reminder on Day 3 and Day 7
```

---

## Security

- All API keys in `.env` — never committed
- `.env` in `.gitignore`
- Google Places API key restricted to server IP + daily quota limit (100 req/day)
- Anthropic API monthly spend limit: $20
- Kimi API monthly spend limit: $10
- Cloudflare API token scoped to minimum permissions (D1 + R2 + Pages only)

---

## What Deliberately NOT Built (Stage 1)

- No CMS or admin panel — client configs are JSON files
- No payment processing — handled manually (DuitNow / bank transfer)
- No client login portal — not needed until Stage 2+
- No automated outreach — WhatsApp messages sent manually
- No analytics dashboard — Cloudflare Analytics is sufficient for now
- No multi-tenant architecture — simple file-per-client structure

These will be revisited at the start of Stage 2 based on actual bottlenecks.