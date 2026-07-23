# Changelog

  All notable changes to Pintarweb are documented here.
  Format: Date | What changed | Why

  ---

  ## [Unreleased]

  ## 2026-07-23 — Demo Image Pipeline & Social Scoring

  - `scripts/prepare-demo-images.sh`: downloads R2 images, fills missing from niche stock, generates initials logo SVG with mood color
  - Dashboard build pipeline: 3-step (Prepare Images → Build CSS → Deploy)
  - Gallery auto-index: server lists existing R2 `gallery-*` before upload, indexes from `existingCount + 1`
  - `GET /api/gallery/:leadId` endpoint: returns `{ images: [{ key, url }] }` filtered to `gallery-*`
  - PATCH `/intake` upserts lead row (INSERT if `phone_normalized` missing), auto-advances to `images_collected` stage
  - Stage validation: PATCH `/stage` returns 400 for `images_collected` target when `images_collected < 1`
  - Social + no-website → +3 lead_score bonus on PATCH `/intake` social URL save
  - Gallery upload appends (doesn't clear): server deduplicates, returns `total_images` = all R2 objects
  - `loadGalleryThumbs(leadId)` loads existing gallery from R2 on intake form init
  - Dashboard `updatePipelineStage` returns promise, shows toast on 400 errors
  - Logo rules in AGENTS.md: `<img>` in nav/footer, fallback to text if file missing
  - Stock images: `aircond-service/`, `electrical/`, `plumbing/` (hero + service-1/2/3 + gallery-1/2/3)

  ## 2026-05-12 — System Foundation

  - Core repo created with complete documentation structure
  - `AGENTS.md` — OpenCode project rules (vibe coding protocol)
  - `ARCHITECTURE.md` — technical decisions and system design
  - `CHANGELOG.md` — change tracking begins
  - `README.md` — project overview and getting started guide
  - `schema.sql` — D1 database schema for clients, leads, outreach
  - Environment setup guide and template
  - Basicgitignore configuration

  ## 2026-05-13 — Infrastructure

  - Cloudflare D1 database created: `pintarweb-db`
  - `schema.sql` applied to create `clients`, `leads`, `outreach_events` tables
  - Preview URL structure defined: `/` → demo, `/audit` → audit, `/report` → combined
  - Open/click tracking flow established with inline scripts

  ## 2026-05-14 — Core Components

  - `clients/{id}` folder structure finalized
  - Client config schema designed (full schema in `clients/_schema.json`)
  - `config.json` includes: basic info, services, location, audit config, social config
  - `generate-site.js` — generation script using Kimi + Claude + Tailwind
  - Demo site template created — `index.html` with conditional section rendering