# PintarWeb WhatsApp Bot — Agent Rules

## Project context
WhatsApp bot for PintarWeb — Malaysian SME website factory. Bot acts as 24/7 receptionist for Malaysian tradespeople (aircond, contractors, plumbers, electricians).

Target audience: Malaysian business owners in Selangor/KL. All bot communication must be in Malaysian Bahasa Melayu.

## CRITICAL: Language Rules

**ALWAYS use Malaysian Bahasa Melayu. NEVER use:**

- **Indonesian words:** "emitkan" (use "hantar"), "tersebut", "para", "diantara", "dibawah", "diawali"
- **Indonesian grammar patterns:** "untuk" used differently than Malaysian Malay
- **Chinese characters** mixed into Malay text (e.g., "kos的一次过", "Ini确保")
- **Broken grammar:** "saya akan told you team", "forwarded mensaje", "Revisionadalah", "andapuas"
- **Tagalog/other languages:** "mensaje", "telled"

**CORRECT Malaysian Malay examples:**
- "Saya akan hantar invoice" (NOT "emitkan invoice")
- "Kos sekali je" (NOT "kos的一次过")
- "Ini memastikan" (NOT "Ini确保")
- "Revision adalah" (NOT "Revisionadalah")
- "Anda puas hati" (NOT "andapuas hati")
- "Saya akan forward ini ke team kami" (NOT "forwarded mensaje")

## Architecture

- Worker: `workers/whatsapp-bot/src/index.ts`
- Deployed: https://pintarweb-whatsapp-bot.yusmarin.workers.dev
- WABA ID: 727271803683109 / Phone Number ID: 872026605987484
- D1 DB: pintarweb-claude-db (1ca959be-b1bc-4b03-87df-8e4610659993)

## Intent Classification (22 intents, keyword-based)

GREETING, FAQ_PACKAGES, FAQ_SETUP_FEE, FAQ_SUBSCRIBE, FAQ_CONTRACT, FAQ_TIMELINE,
FAQ_REQUIREMENTS, FAQ_SUPPORT, FAQ_OWNERSHIP, FAQ_UPDATE, FAQ_RENEWAL, FAQ_DOMAIN,
FAQ_WHATSAPP_NUMBER, FAQ_LOCAL_SEO, FAQ_SATISFACTION, FAQ_SEE_BEFORE_LIVE,
FAQ_PDPA, FAQ_PAYMENT_METHODS, FAQ_MAINTENANCE, FAQ_TECH_SAVVY, FAQ_ADD_SERVICES,
PRICE_ENQUIRY, SUBSCRIBE, CLOSING_READY, HOW_IT_WORKS, SUPPORT, ESCALATE, UNCLEAR

LLM (DeepSeek v4 Flash) called ONLY for UNCLEAR or GREETING when conversation history > 2 messages.

## Pricing (RM446 everywhere)

- Setup fee: RM297 (Day 0)
- Activation: RM149 (delivery day) — includes 1 month FREE bonus
- Total: RM446
- Renewal: RM149/month (month 5+), quarterly RM417, 6-month RM774, annual RM1,308
- Maybank: 562021737846 (PintarWeb Enterprise)

## Closing Flow (Two-Path)

- Path A (Ready to Start): Bot sends Maybank details, owner notified
- Path B (Need to Know More): Bot sends FAQ, owner follows up personally

## Bot Number Transfer

- Bot stays on PintarWeb test number until activation paid
- On delivery: customer pays RM149 → owner transfers phone in Meta Developer Console

## System Prompt Rules

When editing the LLM system prompt (DeepSeek fallback):
1. Always Malaysian Bahasa Melayu
2. Reply 1-2 short sentences MAX
3. Answer the specific question only
4. No "terima kasih" as main reply
5. No first person ("I"/"we") unless necessary
6. No AI/bot mention
7. Short and conversational

## FAQ Answers

All 20 FAQ answers are hardcoded in `src/index.ts`. When adding/editing:
- Keep answers short (1-3 sentences)
- Use Malaysian Malay only
- No Indonesian words
- Match the intent taxonomy
