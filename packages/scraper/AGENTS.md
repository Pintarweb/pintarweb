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
| GET | `/api/hunts` | List hunt history |
| POST | `/api/hunts` | Record a new hunt |
| GET | `/dashboard` | Serve dashboard UI |
| GET | `/clients/intake-form.html` | Serve intake form |

## Scoring logic (from `src/db/upsertLead.ts`)

- New lead with website: base score 1. No website: base score 4 (+3 "digitally invisible" bonus)
- Duplicate from new source: +2
- SSL missing: +3. Slow mobile response: +2 (from `src/workers/technicalAudit.ts`)
- AI pain point detected: +2 (from `src/workers/aiQualification.ts`)

## Intake Form (src/ui/intake-form.html)

Standalone form served at `/clients/intake-form.html`. Opened from dashboard modal via "Open Full Intake Form" button.

**URL params pre-fill** (from dashboard): `id`, `name`, `phone`, `area`, `category`, `niche`, `tagline`, `website`, `maps`, `fb`, `ig`, `tt`, `email`

**Features:**
- Service Area: multi-select checkbox grid (18 Malaysian areas)
- Tagline: client-side generation via `✨ Generate` button (template-based, no API call)
- Images: uploads to R2 bucket `pintarweb-client-images` on submit
- On submit: generates `config.json` with `logo_image`, `hero_image`, `gallery_images` pointing to R2 URLs

**R2 bucket**: `pintarweb-client-images` — public URL: `https://pub-{ACCOUNT_ID}.r2.dev/pintarweb-client-images`

## Testing

- Only one test file exists: `src/utils/__tests__/normalizePhone.test.ts` (Vitest)
- No lint/format scripts configured despite `eslint` and `prettier` being in devDependencies
