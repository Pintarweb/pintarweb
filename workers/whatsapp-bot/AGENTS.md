# PintarWeb WhatsApp Bot — Agent Rules

## Project context
WhatsApp bot for PintarWeb — Malaysian SME website factory. Bot acts as 24/7 receptionist for Malaysian tradespeople (aircond, contractors, plumbers, electricians).

Target audience: Malaysian business owners in Selangor/KL. All bot communication must be in Malaysian Bahasa Melayu.

## CRITICAL: Language Rules

**ALWAYS use Malaysian Bahasa Melayu. NEVER use:**

- **Indonesian words:** "emitkan" (use "hantar"), "tersebut", "para", "diantara", "dibawah", "diawali", "rincian" (use "butiran"), "tergantung" (use "bergantung" or "terpulang")
- **Indonesian grammar patterns:** "untuk" used differently than Malaysian Malay
- **Chinese characters** mixed into Malay text (e.g., "kos的一次过", "Ini确保")
- **Broken grammar:** "saya akan told you team", "forwarded mensaje", "Revisionadalah", "andapuas"
- **Tagalog/other languages:** "mensaje", "telled"
- **"sama"** meaning "with" — use "dengan" instead
- **"bantu"** in requests like "apa boleh tolong" — use "tolong" not "bantu"

**CORRECT Malaysian Malay examples:**
- "Saya akan hantar invoice" (NOT "emitkan invoice")
- "Kos sekali je" (NOT "kos的一次过")
- "Ini memastikan" (NOT "Ini确保")
- "Revision adalah" (NOT "Revisionadalah")
- "Anda puas hati" (NOT "andapuas hati")
- "Saya akan forward ini ke team kami" (NOT "forwarded mensaje")
- "Ada yang boleh saya tolong?" (NOT "bantu")
- "Butiran harga" (NOT "rincian")
- "Bergantung pada bisnes anda" (NOT "tergantung")

## Architecture

- Worker: `workers/whatsapp-bot/src/index.ts`
- Deployed: https://pintarweb-whatsapp-bot.yusmarin.workers.dev
- D1 DB: pintarweb-claude-db (1ca959be-b1bc-4b03-87df-8e4610659993)
- **Multi-tenant (2026-07-12):** `resolveTenantContext()` resolves `phone_number_id` → `TenantContext`
  - Tenant key: `client_id` UUID (`a1b2c3d4-e5f6-7890-abcd-ef1234567890` for PintarWeb)
  - WABA config: `waba_accounts` table (maps phone_number_id → client_id)
  - Features: `client_features` table (per-feature booleans, replaces tier logic)
  - KB: `kb_knowledge` table (per-client, shared or per-department scope)

## LLM Architecture

### Primary: Claude Haiku 4.5 (Direct API)
- Model: `claude-haiku-4-5-20251001`
- Uses direct `fetch()` to Anthropic API — bypasses Workers AI binding issues
- API key: `ANTHROPIC_API_KEY` secret in Cloudflare Workers
- Fast (~500ms), cheap, excellent Malaysian Malay, no hallucination on business info
- `callClaude()` function at line ~702 in `src/index.ts`

### Fallback: Workers AI Llama 3.2
- Model: `@cf/meta/llama-3.2-3b-instruct`
- Via `env.AI.run()` — only used if Claude fails
- ~330ms response time

### NOT Available (hang indefinitely via Workers AI binding)
- GLM-4.7-Flash (`@cf/zhipu/`)
- SEA-LION (`@cf/aisingapore/`)
- DeepSeek R1 (includes thinking tags in output)

### LLM Invocation Rules
- UNCLEAR intent → LLM (Claude primary, Llama fallback)
- GREETING intent (complex) → LLM
- Simple greetings ("apa khabar", "selamat pagi") → hardcoded reply, no LLM
- All other intents → `handleIntent()` with hardcoded answers
- **No conversation history fed to LLM** — prevents hallucination carryover
- System prompt is config-based (business_name from D1 config), not D1 stored prompt

## Intent Classification (28 intents, keyword-based)

GREETING, FAQ_PACKAGES, FAQ_SETUP_FEE, FAQ_SUBSCRIBE, FAQ_CONTRACT, FAQ_TIMELINE,
FAQ_REQUIREMENTS, FAQ_SUPPORT, FAQ_OWNERSHIP, FAQ_UPDATE, FAQ_RENEWAL, FAQ_DOMAIN,
FAQ_WHATSAPP_NUMBER, FAQ_LOCAL_SEO, FAQ_SATISFACTION, FAQ_SEE_BEFORE_LIVE,
FAQ_PDPA, FAQ_PAYMENT_METHODS, FAQ_MAINTENANCE, FAQ_TECH_SAVVY, FAQ_ADD_SERVICES,
PRICE_ENQUIRY, SUBSCRIBE, CLOSING_READY, HOW_IT_WORKS, SUPPORT, ESCALATE, UNCLEAR

## Menu Flows

### Greeting Menu (3 options)
When user replies with 1, 2, or 3 after greeting:
- **1** → PRICE_ENQUIRY (pricing info)
- **2** → SUBSCRIBE (how to subscribe)
- **3** → UNCLEAR → LLM (free text question)

### Pricing Menu (2 options)
After user asks "Harga?" or sees pricing:
- **1** → CLOSING_READY (sends Maybank payment details)
- **2** → HOW_IT_WORKS (4-week process)

Detection: System checks last assistant message for "Jawab dengan nombor" (pricing) or "Soalan lain"/"tolong dengan" (greeting).

### Suggestion Flow (after every reply)
After every bot reply (except suppressed intents), 2 numbered suggestions are appended:

```
1️⃣ [question 1]
2️⃣ [question 2]
(Taip apa-apa soalan sendiri)
```

No header line (e.g. "Ada apa-apa lagi yang nak tanya?" removed 2026-07-11 — was too repetitive).

The suggestion block ends with `(Taip apa-apa soalan sendiri)` — **do not change** this exact text as it's used for suggestion-click detection regex.

**Suppression rules:** No suggestions shown when:
- Intents: CLOSING_READY, ESCALATE (sensitive flow)
- Menus active: GREETING, PRICE_ENQUIRY, SUBSCRIBE (have own numbered menus)
- Customer sends simple acknowledgement: "okay", "terima kasih", "thanks", "bye", etc.

**Suggestion click routing:** If user taps "1" or "2" and last bot reply had suggestions:
- Looks up the last assistant message to infer the previous intent
- Maps via `SUGGESTION_MAP[inferredIntent].onSelect` to the next intent
- Fallback: "1" → PRICE_ENQUIRY, "2" → FAQ_TIMELINE

**Order of precedence for numeric "1"/"2" replies:**
1. Pricing menu (if `Jawab dengan nombor` in last message)
2. Greeting menu (if `Soalan lain`/`tolong dengan` in last message)
3. Suggestion click (if suggestion block detected in last message)
4. Normal classifyIntent flow

**All suggestions are pre-defined (no LLM generation).** Zero hallucination risk. Defined in `SUGGESTION_MAP` in `src/index.ts`.

**CRITICAL BUG FIX (2026-07-11):** `getConversationHistory()` used `ORDER BY ASC LIMIT N` — returned N oldest messages, not N most recent. Changed to `ORDER BY DESC + .reverse()` so limit=N returns N most recent in chronological order. Without this, suggestion click detection always looked at old messages, never found the suggestion block, and fell through to LLM.

## System Prompt Rules

When editing the LLM system prompt:
1. Always Malaysian Bahasa Melayu
2. Reply 1-2 short sentences MAX
3. Answer the specific question only
4. No "terima kasih" as main reply
5. No first person ("I"/"we") unless necessary
6. No AI/bot mention
7. Short and conversational
8. NEVER mention AC, plumbing, electrical, or physical services
9. NEVER invent business names, websites, or services not listed
10. Use "tolong" not "bantu", "dengan" not "sama", "butiran" not "rincian"

## FAQ Answers

All 20 FAQ answers are hardcoded in `src/index.ts`. When adding/editing:
- Keep answers to 1-2 short sentences max — WhatsApp is conversational, not brochure
- No trailing questions that compete with suggestion block
- Use Malaysian Malay only
- No Indonesian words
- Match the intent taxonomy

## Contract (UPDATED 2026-07-11)

- **NO contract binding** — customers can opt-out anytime
- Only need 14 days notice
- No penalties

## Pricing (RM446 everywhere)

- Setup fee: RM297 (Day 0)
- Activation: RM149 (delivery day) — includes 1 month FREE bonus
- Total: RM446
- Renewal: RM149/month (month 5+), quarterly RM417, 6-month RM774, annual RM1,308
- Maybank: 562021737846 (PintarWeb Enterprise)

## Closing Flow (Two-Path)

- Path A (Ready to Start): Bot sends Maybank details, owner notified
- Path B (Need to Know More): Bot sends FAQ, owner follows up personally

## Bot Number Transfer (Legacy)

- **DEPRECATED as of 2026-07-12.** Bot number transfer process is being replaced.
- New process: Client procures their own WhatsApp Business number → PintarWeb configures bot on that number via `waba_accounts` table. See ADR-001.
- Old process (kept for reference until fully deprecated): Bot stays on PintarWeb test number until activation paid. On delivery: customer pays RM149 → owner transfers phone in Meta Developer Console.

## Managing LLM Requests

```bash
# Check pending LLM requests
npx wrangler d1 execute pintarweb-claude-db --remote --command="SELECT * FROM whatsapp_bot_pending_llm_requests WHERE status='pending' ORDER BY created_at DESC LIMIT 10;"

# Check failed requests
npx wrangler d1 execute pintarweb-claude-db --remote --command="SELECT * FROM whatsapp_bot_pending_llm_requests WHERE status='failed' ORDER BY created_at DESC LIMIT 10;"

# Clean up old pending requests (>1 hour)
npx wrangler d1 execute pintarweb-claude-db --remote --command="DELETE FROM whatsapp_bot_pending_llm_requests WHERE status='pending' AND created_at < datetime('now', '-1 hour');"

# Clear conversation history (for fresh testing)
npx wrangler d1 execute pintarweb-claude-db --remote --command="DELETE FROM whatsapp_bot_conversations; DELETE FROM whatsapp_bot_greetings;"
```
