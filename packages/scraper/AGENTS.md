# PintarWeb Scraper — Agent Guide

## Two-process architecture

You must run **both** processes (separate terminals):

1. **Worker** (Cloudflare dev server + D1 + API + Dashboard):
   ```
   npx wrangler dev
   ```
2. **Scraper engine** (Playwright scrapers → pipes leads to worker):
   ```
   npx tsx src/index.ts --category "Plumber" --location "KL" --limit 10 --sources "Maps,FB"
   ```

The scraper sends leads to `http://localhost:8787/api/leads`. Worker must be running first.

## Commands

| Action | Command |
|--------|---------|
| Run tests | `npx vitest run` (no npm script exists) |
| Run single test file | `npx vitest run src/utils/__tests__/normalizePhone.test.ts` |
| Quick scraper test | `npx tsx src/test_scrape.ts` |
| Query local D1 DB | `npx wrangler d1 execute pintarweb-scraper-db --local --command="SQL"` |
| List all leads | `npx wrangler d1 execute pintarweb-scraper-db --local --command="SELECT * FROM leads;"` |

## Env & setup

- Required vars (put in `.dev.vars`, gitignored): `OPENAI_API_KEY`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`
- Without AI keys, the worker skips AI qualification (lead scoring still works for audits)
- Local D1 state lives in `.wrangler/state/` (gitignored)

## Key constraints

- **TypeScript v6** with `NodeNext` module resolution — imports need `.js` extensions (e.g. `from "./foo.js"`)
- **Wrangler Text rules** load UI assets: `*.html`, `*.css.txt`, `*.js.txt` are imported as strings. Type declarations in `src/types/static.d.ts`
- **Yellow Pages** scraper is disabled by default in `src/index.ts` (sources default `"Maps,FB"`) to avoid ban risk
- Facebook scraper sets a custom user agent to evade headless detection
- AI qualification runs as `ctx.waitUntil()` background task in the worker

## Source layout

| Path | Purpose |
|------|---------|
| `src/api/worker.ts` | Cloudflare Worker: API endpoints + Dashboard serving |
| `src/index.ts` | Scraper engine CLI entrypoint |
| `src/scrapers/` | Playwright scrapers (googleMaps, facebook, yellowPages) |
| `src/workers/` | Background intelligence (technicalAudit, aiQualification) |
| `src/db/upsertLead.ts` | D1 dedup + upsert logic with scoring rules |
| `src/ui/` | Dashboard HTML + Tailwind CSS components (loaded as static text) |
| `src/ui/intake-form.html` | Standalone intake form served at `/clients/intake-form.html` |
| `src/utils/normalizePhone.ts` | Malaysian phone number normalizer |
| `schema.sql` | D1 schema reference (leads + hunt_logs tables) |
| `query_live_db.js` | Legacy utility with hardcoded Windows path to local SQLite |

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/leads` | Receive scraped leads |
| GET | `/api/leads` | List all leads |
| PATCH | `/api/leads` | Update lead status (archive) |
| DELETE | `/api/leads` | Delete a lead |
| PATCH | `/api/leads/:phone/stage` | Update pipeline stage |
| PATCH | `/api/leads/:phone/intake` | Save intake data (tagline, niche, services, testimonials) |
| PATCH | `/api/leads/:phone/demo` | Save demo URL |
| PATCH | `/api/leads/:phone/outreach` | Mark outreach sent |
| POST | `/api/generate-tagline` | Generate tagline from niche + area (template-based, instant) |
| POST | `/api/upload/:leadId` | Upload images to R2 (logo, hero, gallery) |
| GET | `/api/areas` | Return dynamic list of 44 Malaysian areas |
| GET | `/api/hunts` | List hunt history |
| POST | `/api/hunts` | Record a new hunt |
| GET | `/dashboard` | Serve dashboard UI |
| GET | `/clients/intake-form.html` | Serve intake form |

## Google Maps Scraper — Web Results Social Scraper

After extracting core business data from the side panel, `scrapeGoogleMaps` scrolls to the bottom to trigger the lazy-loaded "Web results" section. It then parses those results for actual Facebook, Instagram, and TikTok URLs — which are more accurate than the page-level fallback (which picks up Google's own Facebook share link).

**First pass** (page-level): uses `a[data-item-id^="social"]` for dedicated social link. Falls back to scanning all `a[href*="facebook.com"]` with path filters.

**Second pass** (web results): scrolls `div[role="main"]` to bottom, waits 3s, finds the "Web results" heading, then extracts Facebook/Instagram/TikTok from that section. Prefers web results URLs over first-pass.

## Scoring logic (from `src/db/upsertLead.ts`)

- New lead with website: base score 1. No website: base score 4 (+3 "digitally invisible" bonus)
- Duplicate from new source: +2
- SSL missing: +3. Slow mobile response: +2 (from `src/workers/technicalAudit.ts`)
- AI pain point detected: +2 (from `src/workers/aiQualification.ts`)

## Intake Form (src/ui/intake-form.html)

Standalone form served at `/clients/intake-form.html`. Opened from dashboard modal via "Open Full Intake Form" button.

**URL params pre-fill** (from dashboard): `id`, `name`, `phone`, `area`, `category`, `niche`, `tagline`, `website`, `maps`, `fb`, `ig`, `tt`, `email`

**Features:**
- Service Area: **Dynamic dropdowns** (Area 1/2/3 + "+ Add Area" button) loaded from `GET /api/areas` (44 areas). Selected areas are disabled in other dropdowns to prevent duplicates. Area list can be updated by editing the array in worker.ts.
- Facebook URL pre-fill: now handles both full URLs and handles (detects `http` prefix).
- Gallery upload: sends each file as `gallery_0`, `gallery_1`, ... (numbered keys). Server reads them individually and properly awaits each R2 put.
- **Draft auto-save/resume**: all text inputs, selects, and area dropdowns auto-save to `localStorage` 600ms after last change. Draft keyed by lead ID. Restores on page load (overlays URL prefill). Orange indicator bar shows "Draf disimpan" with timestamp + "Padam Draf" button. Draft cleared on successful submit.
- Tagline: client-side generation via `✨ Generate` button (template-based, no API call)
- Images: uploads to R2 bucket `pintarweb-client-images` on submit
- On submit: generates `config.json` with `logo_image`, `hero_image`, `gallery_images` pointing to R2 URLs

**R2 bucket**: `pintarweb-client-images` — public URL: `https://pub-{ACCOUNT_ID}.r2.dev/pintarweb-client-images`

## Testing

- Only one test file exists: `src/utils/__tests__/normalizePhone.test.ts` (Vitest)
- No lint/format scripts configured despite `eslint` and `prettier` being in devDependencies

## Auto-Hunt (Daily Automation)

**One-command automation:**
```
bash scripts/auto-hunt.sh             # Interactive menu
bash scripts/auto-hunt.sh aircond-kl  # Run specific profile
bash scripts/auto-hunt.sh --all       # Run ALL profiles
```

**Cron setup (one-time):**
```
bash scripts/auto-hunt.sh --install-cron
```
After this, auto-hunt runs weekdays at 6am. Leads land in D1 automatically. Open dashboard when ready.

**Profiles:** Edit `hunt-profiles.json` to add/remove search criteria.

**--remote flag:** Scraper POSTs directly to production worker URL (no `npx wrangler dev` needed). Used automatically by auto-hunt.sh. Manual: `npx tsx src/index.ts --category "Aircond" --location "KL" --limit 10 --sources "Maps,FB" --remote`

## Lead Selection System

New column: `selected_for_pipeline` (INTEGER DEFAULT 0) — manually tag leads you want to process:
- Dashboard: ⭐ checkbox on each lead card → toggles via `PATCH /api/leads/:phone/select`
- Filter: "⭐ Selected" shows only tagged leads
- This creates a stockpile: scrape big batch → tag promising leads → process daily from your selected pool
