# PintarWeb — Global Agent Rules

**Applies to all work in this monorepo:** `~/projects/pintarweb/`

## CRITICAL: Language Rules

**ALWAYS use Malaysian Bahasa Melayu in all customer-facing text. This is non-negotiable.**

Common Malaysian Malay mistakes to AVOID:
- "emitkan" → "hantar" (emitkan is Indonesian)
- "RM447" → "RM446" (RM446 is the correct current price)
- "tersebut", "para", "diantara" → use Malaysian equivalents
- Chinese characters mixed into Malay → NEVER do this
- "saya akan told you team" → "saya akan forward ini ke team kami"
- "forwarded mensaje" → "forward ini"
- "Revisionadalah" → "Revision adalah"
- "andapuas" → "anda puas"

Words that are DIFFERENT in Malaysian vs Indonesian:
| Malaysian | Indonesian | Notes |
|-----------|-------------|-------|
| hantar | kirim / kirimkan | sending something |
| awak | kamu / Anda | you |
| sini | sini / di sini | here (Malaysian also uses "situ" for "there") |
| lepas | setelah / setelahnya | after |
| untuk | untuk / demi | for (Indonesian also uses "bagi") |
| macam mana | bagaimana | how |
| kenapa | mengapa / kenapa | why (Indonesian rarely uses "kenapa") |
| apa apa | apa-apa | what (Indonesian spacing) |

## Pricing (RM446 everywhere — UPDATED 2026-07-04)

- Setup: RM297 / Activation: RM149 / Total: RM446
- Renewal: monthly RM149, quarterly RM417, 6-month RM774, annual RM1,308
- **NO contract** — opt-out anytime, 14 days notice
- RM800 anchor on landing page
- Maybank: 562021737846 (PintarWeb Enterprise)
- **NEVER write RM447 anywhere**

## WhatsApp Bot

- Worker: `workers/whatsapp-bot/src/index.ts`
- Deployed: https://pintarweb-whatsapp-bot.yusmarin.workers.dev
- Admin Dashboard: https://pintarweb-admin.pages.dev (login: admin123)
- **Multi-tenant architecture** (as of 2026-07-12): `client_id` (UUID) is primary tenant key
  - `waba_accounts` table maps phone_number_id → client_id
  - `clients` table is central tenant record
  - `client_features` table enables per-feature toggles (replaces hardcoded tier logic)
  - Existing PintarWeb bot = client `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- 28-intent keyword classifier (no LLM for routing)
- LLM: Claude Haiku 4.5 for conversational fallback (UNCLEAR/GREETING only)
- System prompt: Malaysian BM only — see workers/whatsapp-bot/AGENTS.md
- Suggestion engine: pre-defined 2-option suggestions after every reply (no LLM gen)
- `getConversationHistory` uses `ORDER BY DESC + reverse()` — critical for suggestion click routing

## Scripts

- All shell scripts use RM297 (setup) and RM149 (activation) — NOT RM299 or RM447
- WhatsApp messages in scripts must be Malaysian BM
- confirm-payment.sh: RM297 = setup, RM149 = activation

## Key URLs

- Landing: https://pintarweb.com
- Analytics: https://cloud.umami.is/share/IOzb83tMmKyzcWj9
- Worker: https://pintarweb-whatsapp-bot.yusmarin.workers.dev
- Admin Dashboard: https://pintarweb-admin.pages.dev (secret: admin123)
- D1 DB ID: 1ca959be-b1bc-4b03-87df-8e4610659993

## Scraper Worker (Lead Pipeline)

- Scraper Worker: `packages/scraper/`
- Dashboard: `http://localhost:8787/dashboard` (dev) or `https://pintarweb-scraper.yusmarin.workers.dev/dashboard`
- D1 DB (scraper): `packages/scraper/schema.sql` — 40-column leads table with pipeline stages
- R2 Bucket: `pintarweb-client-images` — stores uploaded client images (logo, hero, gallery)
- Intake Form: served at `/clients/intake-form.html` from scraper worker

### Pipeline Stages (11 total)
`new → images_collected → demo_ready → demo_built → audit_ready → screenshot → outreach_sent → in_chat → qualified → payment → active`

### Intake Form Flow
1. Dashboard → click lead "Open Intake →" → modal with scraped data
2. "Open Full Intake Form" button opens `/clients/intake-form.html?id={leadId}&...` (pre-filled from scraped data)
3. Form: multi-select service areas, tagline auto-generate (✨ button), image uploads to R2
4. Submit → config.json generated with `logo_image`, `hero_image`, `gallery_images` pointing to R2 URLs
5. Dashboard → "Build Demo" runs `DISABLE_LLM=1 bash scripts/build-client.sh {leadId}` (from project root)
