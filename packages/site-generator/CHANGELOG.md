# Changelog

  All notable changes to Pintarweb are documented here.
  Format: Date | What changed | Why

  ---

  ## [Unreleased]

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