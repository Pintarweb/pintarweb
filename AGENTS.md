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
- RM800 anchor on landing page
- Maybank: 562021737846 (PintarWeb Enterprise)
- **NEVER write RM447 anywhere**

## WhatsApp Bot

- Worker: `workers/whatsapp-bot/src/index.ts`
- Deployed: https://pintarweb-whatsapp-bot.yusmarin.workers.dev
- WABA ID: 727271803683109
- 22-intent keyword classifier (no LLM for routing)
- DeepSeek v4 Flash for conversational fallback only
- System prompt: Malaysian BM only — see workers/whatsapp-bot/AGENTS.md

## Scripts

- All shell scripts use RM297 (setup) and RM149 (activation) — NOT RM299 or RM447
- WhatsApp messages in scripts must be Malaysian BM
- confirm-payment.sh: RM297 = setup, RM149 = activation

## Key URLs

- Landing: https://pintarweb.com
- Analytics: https://cloud.umami.is/share/IOzb83tMmKyzcWj9
- Worker: https://pintarweb-whatsapp-bot.yusmarin.workers.dev
- D1 DB ID: 1ca959be-b1bc-4b03-87df-8e4610659993
