# Pintarweb WhatsApp Receptionist Bot — Specification v1

**Role:** Receptionist-cum-secretary for Malaysian SME tradespeople clients (aircond, renovation, plumbing, contractors).
**Architecture:** Meta WhatsApp Cloud API (unverified foundational tier) → Cloudflare Worker → D1 (per-client config) → LLM.
**Principle:** One bot codebase, duplicated per client via config only — never fork the logic.

---

## 1. Purpose

The bot's job is to do what a human receptionist would do for a one-person or small-crew trades business: answer the phone (WhatsApp, in this case) when the boss is on a job site, capture enough information to qualify the enquiry, and make sure nothing falls through the cracks. It is not a sales AI, not a general assistant, and not a substitute for the boss's judgment on anything that touches money, safety, or scheduling commitments.

---

## 2. What the bot DOES do

| Function | Description |
|---|---|
| **Greet & triage** | Responds instantly to any inbound message, identifies what the customer needs (quote, booking, general question, complaint, follow-up). |
| **Answer FAQs** | Business hours, service areas, service list, general pricing ranges (not final quotes), payment methods, warranty basics — all pulled from the client's RAG/config, never invented. |
| **Capture lead details** | Name, phone (auto-captured from WhatsApp), location/area, nature of the problem, urgency, preferred contact time. Structured into a lead record. |
| **Accept photos** | Customer sends a photo of the aircon unit / leaking pipe / damaged wall — bot acknowledges receipt, forwards to the owner, and can do basic categorization ("looks like a compressor unit, noted") but does NOT diagnose or quote from the photo. |
| **Schedule-adjacent** | Can propose available time slots if the client maintains a simple availability config, and log the customer's preferred slot — but does not auto-confirm bookings without the owner's sign-off, unless the client explicitly opts into auto-confirm for straightforward jobs. |
| **Send confirmations** | Post-enquiry acknowledgement ("Got your request, [owner name] will call you by [time]") — a utility-style message, ideally sent within the free customer-service window. |
| **Escalate to human** | Hands off immediately on defined triggers (see §4) by notifying the owner directly and telling the customer a human will take over. |
| **Log everything** | Every conversation saved and searchable, so the owner can review what was promised to whom. |
| **Multi-language** | Responds in Bahasa Malaysia, English, or Manglish depending on how the customer writes in — matches, doesn't force a switch. |
| **Respect quiet hours** | Can auto-reply outside business hours with an honest "we're closed, will respond by X" instead of pretending to be available 24/7. |

---

## 3. What the bot DOES NOT do

This section is arguably more important than §2 — it's what keeps the bot safe, compliant, and trustworthy.

| Boundary | Why |
|---|---|
| **No final price quotes.** It can give a *range* if the client has pre-approved one (e.g. "aircon servicing typically RM80–150 depending on unit type"), but never commits to an exact binding price — that stays a human decision. | Prevents the bot from underquoting a job the owner then has to honor, or overquoting and losing the lead. |
| **No payment collection or processing.** No bank details, no payment links, no "please transfer now." | Fraud risk, PDPA/financial compliance, and scope creep into something a receptionist wouldn't do either. |
| **No technical diagnosis or safety advice.** Won't tell a customer "it's probably just a gas top-up" or "that's safe to leave for now." | The bot isn't qualified, and Malaysian consumer/liability exposure means a wrong guess is the client's legal problem, not just a bad chat. |
| **No general-purpose chat.** Won't discuss the weather, do the customer's homework, write poems, or answer unrelated questions — it stays scoped to the business's services. | This is also a WhatsApp platform requirement now: general-purpose "answer anything" chatbots are barred under Meta's updated WhatsApp Business terms (effective Jan 2026). Scope discipline isn't optional. |
| **No auto-booking without guardrails.** Doesn't commit the owner's calendar without either owner approval or an explicit opt-in "simple jobs only" auto-confirm rule the client set up themselves. | An overbooked or double-booked tradesperson is a worse outcome than a slow reply. |
| **No storing of sensitive personal data beyond what's needed.** No IC numbers, no financial details, no health information — even if a customer volunteers it. | PDPA (Personal Data Protection Act) exposure — the bot should politely decline to record data it doesn't need for the job. |
| **No impersonating a human.** It should be discoverable as automated if directly asked ("are you a real person?") — doesn't pretend to be the business owner. | Trust and (increasingly) regulatory expectation; also just good practice for a small business's reputation. |
| **No marketing blasts or cold outreach via this bot number.** It replies to inbound and does light re-engagement follow-ups on existing leads only — it does not broadcast promotions to a purchased or scraped contact list. | Keeps the number's quality rating healthy (Meta throttles/bans numbers that trigger spam reports) and avoids PDPA consent issues. |
| **No handling of complaints/disputes autonomously.** Any message with complaint/anger signals routes straight to the owner. | An automated non-apology to an upset customer does more damage than a delayed human reply. |

---

## 4. Escalation triggers (hand off to human immediately)

- Customer expresses anger, frustration, or dissatisfaction
- Customer asks for a firm price and won't accept a range
- Customer asks something outside the bot's configured knowledge (FAQ/RAG has no answer)
- Customer requests urgent/emergency service (e.g. burst pipe, no cooling in a server room)
- Any mention of injury, safety hazard, or property damage
- Customer explicitly asks to speak to a human
- Conversation loops 3+ times without resolution

On trigger: bot tells the customer a human is joining shortly, notifies the owner via WhatsApp with a summary of the conversation so far, and pauses automated replies on that thread until the owner responds or manually resumes the bot.

---

## 5. Conversation states (simplified flow)

```
Inbound message
   │
   ▼
[New or returning contact?] ──new──▶ Greeting + ask what they need
   │returning
   ▼
[Classify intent] ── FAQ / Quote enquiry / Booking / Complaint / Unclear
   │
   ├─ FAQ → answer from RAG/config → offer further help
   ├─ Quote enquiry → capture details → give range if configured → log lead → notify owner
   ├─ Booking → check availability config → propose slots → log preference → notify owner
   ├─ Complaint → escalate immediately (no auto-reply beyond "connecting you now")
   └─ Unclear → ask one clarifying question → re-classify (max 2 tries) → escalate if still unclear
```

---

## 6. Per-client configuration (what makes it duplicable)

Every client gets one config record, not new code. Mirrors your existing `config.json` + token-replacement pattern:

```
{
  "client_id": "razif-aircond",
  "business_name": "...",
  "owner_whatsapp": "+60...",
  "services": [...],
  "service_area": [...],
  "business_hours": {...},
  "price_ranges": {...},           // optional, only if client approves
  "faq": [...],                     // RAG source
  "auto_confirm_simple_bookings": false,
  "escalation_keywords": [...],     // extends default list
  "language_default": "ms"          // or "en"
}
```

The Worker logic reads this once per conversation and never hardcodes anything client-specific.

---

## 7. Data & compliance notes

- All chat logs and lead data live in D1, scoped per client — no cross-client data mixing.
- Customer's WhatsApp number is personal data under PDPA — store only what's operationally necessary, and be prepared to delete on request.
- Photos/documents forwarded to the owner should not be retained longer than needed for the job record.
- Since this isn't going through a licensed BSP, you (Pintarweb) are the de facto data processor for each client — worth a one-line clause in your client agreement about data handling responsibility.

---

## 8. Layer Architecture (v2 — effective 2026-07-04)

The bot uses a three-layer prompt/config system instead of fine-tuning. This is cheaper, instantly updateable, and matches the config-driven architecture.

### Layer 1 — Base System Prompt (shared across ALL bots)

Core identity and guardrails. Written once, reused everywhere. This is your actual product IP.

- **Core identity:** Acts as the business owner's direct representative — never says "I" or "we" freely. The bot IS the business.
- **Tone:** Friendly Malay/English/Manglish. Short replies (1-2 sentences max). Conversational, not corporate.
- **Guardrails:** No final price quotes (only ranges if pre-approved). No diagnosis. No payment processing by bot. No impersonation of human.
- **Escalation triggers:** Anger/frustration, safety/injury, firm price request, 3x unresolved loop, explicit human request.
- **Multi-language:** Matches customer's language — don't force a switch.
- **No-first-person rule:** Never say "I" or "we" unless necessary. Prefer: "[Business name]Bot" framing.
- **Fallback:** "Saya akan tanya team dan-balik pada anda." — never make up information.

### Layer 2 — Niche Knowledge (shared across clients in same trade)

Common terminology, problem categories, pricing benchmarks, and customer question patterns for a specific trade. Written once per niche, reused across every client in that trade.

**Niche: PintarWeb (private)** — website + WhatsApp bot + SEO for Malaysian SME tradespeople.

- Common SME objections: "social media enough", "taktahu maintain", "Facebook ads worked before"
- What "local SEO" means to a tradesperson: Google Maps presence, "near me" searches
- Typical timeline: 4 weeks from doc handover to live site
- Standard FAQ vocabulary (see Layer 3 FAQ)

**Niche: Aircond (template)** — installation, servicing, repair for Malaysian aircond businesses.

- Services: chemical wash, gas top-up, installation, repair, central aircond
- Problems: tidak sejuk, bocor air, berbunyi, frozen coil, compressor issues
- Vocabulary: "gas top-up" vs "chemical wash" vs "overhaul", R32 vs R410A
- Pricing benchmarks: chemical wash RM80-180, gas top-up RM80-250, installation RM300-800+
- Customer fears: overcharged, unnecessary work added, parts replaced when not needed

**Niche: Trades/Reno (template)** — renovation, plumbing, electrical for Malaysian contractors.

- Renovation phases: design → permits → demo → structural → rough-in → finishing → handover
- Common: plumbing leaks, blocked drains, electrical tripping, DB upgrades
- Permit requirements in Malaysia: APDL/DBKL for structural changes
- Timeline benchmarks: kitchen makeover ~3-4 weeks, full renovation 2-3 months
- Customer fears: contractor ghosting, quote ballooning, quality不一致

### Layer 3 — Client-Specific Config (unique per client)

Thin, fast-to-fill layer. Onboarding a new client = filling in Layer 3, not writing new logic.

```json
{
  "client_id": "razif-aircond",
  "business_name": "Razif Aircond & Electrical",
  "owner_whatsapp": "+60123456789",
  "services": "Aircond installation, chemical wash, repair, gas top-up",
  "service_area": "Klang Valley, Shah Alam, Klang",
  "business_hours": "Mon-Sat 8am-6pm",
  "price_ranges": "Chemical wash: RM80-150, Gas top-up: RM80-200",
  "niche": "aircond",
  "closing_flow_enabled": true,
  "bank_name": "Maybank",
  "bank_account_name": "Razif Aircond Enterprise",
  "bank_account_number": "562021737846",
  "subscription_price": 149,
  "demo_expiry_days": 3
}
```

---

## 9. Closing Flow (v2 — split payment model)

Commercial structure: **RM297 setup fee (Day 0) → 4-week build → RM149 activation (delivery day) + 1 month FREE bonus.**

### Payment Flow

```
Day 0 (Onboarding):
  Customer pays RM297 (setup fee) → Maybank transfer
  → Notify: "Payment received, we start building tomorrow. 🔥"
  → Track: paid_setup = true, build starts

Week 4 (Delivery Day):
  Demo site + bot to customer personally
  Customer sees everything working
  48-hour countdown starts

  At 48 hrs: reminder message (if not paid)
  At 72 hrs (48 + 24hr extension): demo expires
    → Bot message: "Demo kami akan ditutup tidak lama lagi.
       Kalau nak aktifkan, hubungi saya dalam 1 bulan."
    → Track: demo_expired = true, demo_expiry_date = +1 month

  [If customer pays RM149]:
    → Transfer bot to customer's WABA number
    → "Payment received! Bot dah aktif atas nombor anda! 🔥"
    → Ask consent for Razorpay auto-subscription
    → Setup Razorpay recurring for RM149/month

  [If customer returns after expiry but within 1 month]:
    → Offer reactivation at RM149 + 1 month FREE
    → Internally: no additional bonus beyond that

  [If customer returns after 1 month]:
    → Full reassessment, no sympathy pricing
```

### Bot Closing Path (Two Options)

When intent = SUBSCRIBE or customer says they're ready to close:

```
Bot asks: "Nak terus mula, atau ada lagi yang nak tahu?"

├── PATH A: "Nak terus mula"
│   → Bot sends:
│   "Sedia! Details payment:
│   Bank: Maybank
│   Akaun: 562021737846 (PintarWeb Enterprise)
│   Jumlah: RM297 (fi persediaan)
│   
│   Selepas payment, hantar resit dan kami akan mula bina esok.
│   
│   Bila site siap (4 minggu), bayar RM149 untuk activate + 1 bulan percuma unlocked!"
│   → Notify owner: "🔥🔥🔥 READY TO PAY — [name] [phone]"
│
└── PATH B: "Nak tahu lagi"
    → Bot sends FAQ list or "Apa yang ragu-ragu?"
    → Capture lead details → notify owner
    → Owner follows up personally via WhatsApp +60196556243
```

### Bot Number Transfer

Bot stays on **PintarWeb test number** until activation payment received.

On Day 0 onboarding, a separate test WABA is configured. On delivery day:
1. Customer pays RM149 activation
2. Owner transfers the phone number ownership in Meta Developer Console (Settings → Test number → Transfer to client's Meta Business Account)
3. Customer takes over the number
4. Transfer takes ~5 minutes, no downtime

---

## 10. Intent Taxonomy

Keyword-based classification (no LLM needed for routing):

| Intent | Trigger Keywords | Handler |
|---|---|---|
| GREETING | hello, hi, hey, selamat, ola | Warm greeting + ask what they need |
| FAQ_PACKAGES | pakej, package, included, yang saya dapat | Direct FAQ answer |
| FAQ_SETUP_FEE | fi persediaan, setup fee, why pay, one-time | Direct FAQ answer |
| FAQ_SUBSCRIBE | subscribe, sign up, nak mula, cara nak | Explain 2-step process |
| FAQ_CONTRACT | kontrak, contract, cancel, batal | Annual contract, 30-day notice |
| FAQ_TIMELINE | berapa lama, how long, siap, live, minggu | 4 weeks |
| FAQ_REQUIREMENTS | apa yang perlu, need from me, dokumen, ssm | SSM + photos |
| FAQ_SUPPORT | support, bantu, tolong, masalah | Included in subscription (answer uses "kami akan tolong") |
| FAQ_OWNERSHIP | milik, own, hak, property, files | 100% owned by client |
| FAQ_UPDATE | update, tukar harga, edit, change, sendiri | Via WhatsApp or dashboard |
| FAQ_RENEWAL | renewal, renew, bulanan, RM149/month | RM149/month from month 5 |
| PRICE_ENQUIRY | harga, price, rm, berapa, cost | Pricing answer + 2-path ask |
| SUBSCRIBE | nak subscribe, sign up, nak langgan | Offer Path A or B |
| CLOSING_READY | okay nak, saya nak, proceed, agree | Path A: bank details |
| HOW_IT_WORKS | how it works, macam mana, process | 4-week timeline |
| SUPPORT | rosak, masalah, issue | Capture + escalate if urgent |
| ESCALATE | marah, speak to human, geram | Immediate owner notification |
| UNCLEAR | no keyword match | Ask clarifying question |

LLM (Claude Haiku 4.5) is only called for UNCLEAR or complex GREETING intents. Simple greetings ("apa khabar", "selamat pagi") use hardcoded replies. **No conversation history is fed to LLM** — this prevents hallucination of business info across conversation turns.

---

## 12. Build phases (matches your "prove manually first" principle)

1. **Phase 0 — Manual script.** Write out the actual FAQ answers, price ranges, and escalation rules for one real client (Razif Aircond) as plain text. Run a few real enquiries through it yourself, replying manually, before any code exists. Confirms the *content* is right before automating it.
2. **Phase 1 — MVP bot.** Text-only, FAQ + lead capture + escalation, one client, unverified Meta tier, no photos/voice/booking.
3. **Phase 2 — Add photo handling + basic scheduling proposal**, still one client, refine based on real usage.
4. **Phase 3 — Templatize config**, onboard a second client to prove duplicability without touching bot logic.
5. **Phase 4 — Add auto-confirm bookings, follow-ups, multi-persona** only once Phase 1–3 are stable and trusted.

---

## 13. Explicit non-goals (things to resist scope-creeping into)

- Not a CRM replacement — it feeds leads to wherever the owner already tracks jobs (even if that's a notebook, initially).
- Not a payment gateway.
- Not a marketing automation platform.
- Not trying to fully replace the owner's judgment on anything client-facing and binding.

The bot's entire value is: **never miss an enquiry, capture it accurately, and know exactly when to get out of the way.**
