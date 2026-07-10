# Layer 2 Knowledge Base — Pintarweb (Prospect-Facing)

**v2 — rebuilt from actual implementation docs (MASTER-CHECKLIST, phase-1 through phase-3), replacing the earlier placeholder-heavy draft.** This equips Pintarweb's own prospect-facing bot — the one talking to SME tradespeople who are potential Pintarweb clients — not a client's customer-facing bot. Sits under Layer 1 (persona/behaviour) and above Layer 3 (live availability, real-time lead-specific data).

**Correction from v1:** Pintarweb has **not** dropped websites. The live, current offer is a **bundle: Website + WhatsApp auto-reply bot + Local SEO**, sold as one package. "Broader business-solutions WaaS" is a positioning direction, not a description of what's actually being sold today — the bot should not tell a prospect "we don't do websites."

---

## 1. What Pintarweb Is (Elevator Pitch)

Pintarweb helps local Malaysian SME tradespeople (aircond, plumbing, electrical, renovation) get found online and stop losing customers to slow response times. The current package bundles three things together:
1. A **website** (built for their business specifically, not a generic template feel)
2. A **WhatsApp auto-reply bot** (24/7 receptionist — answers common questions, captures leads, notifies the owner)
3. **Local SEO / Google Business Profile optimization**

**Framing note:** The lead-in problem framing used on the landing page is "Ada Facebook tapi tak ada website?" (you have Facebook but no website?) — i.e. the hook is *findability*, not just "you need a website." The WhatsApp bot is the newer, higher-novelty part of the pitch and can be led with in conversation, but it is not sold standalone — it's part of the bundle.

---

## 2. The Problem Pintarweb Solves

- Prospects search for services (e.g. "aircond service [area]") and the tradesperson doesn't show up — Google can't find them because there's no website/weak online presence
- Missed WhatsApp messages while on a job → lost lead to a competitor who replies faster
- No consistent capture of what a customer actually needs before the owner calls back
- Repetitive manual answering of the same questions ("how much," "do you cover my area") all day

---

## 3. Pricing & Payment (Real, Confirmed)

| Option | Price | Notes |
|---|---|---|
| **One-time website** | RM 800 | Website only, no bot/SEO ongoing service — positioned as the "old way" alternative |
| **Subscription bundle** (website + bot + SEO) | RM 149/month | The main offer |
| — Initial payment (pilot/current) | RM 297 setup + RM 149 month-1 activation = **RM 446 total**, split into two payments | Setup fee paid Day 0 to start build; activation fee paid on delivery day (~week 4) when bot goes live. Includes 1 month FREE bonus. |
| — Quarterly renewal | RM 417 / 3 months | Saves RM 30 vs monthly |
| — Bi-annual renewal | RM 774 / 6 months | Saves RM 120 vs monthly |
| — Annual renewal | RM 1,308 / 12 months | Saves RM 480 vs monthly |

**Payment methods:** Razorpay payment link (cards, FPX/Netbanking, DuitNow, e-wallets) or direct Maybank transfer (562021737846, PintarWeb Enterprise) — Maybank transfer is the currently preferred/primary method per outreach templates.

**Billing mechanism (month 4+):** Recurring payments run through Razorpay's auto-charge/subscription feature — the customer's explicit consent is obtained before auto-charging is enabled, so it's not a silent surprise-charge setup. Worth stating plainly if a prospect asks "will I get charged automatically without knowing" — the honest answer is auto-charge exists but only activates with their consent.

**ROI framing (bot can use this):** For an aircond client specifically, one paid chemical wash job (RM 180–350) already covers a full month's subscription — useful as a concrete, relatable comparison rather than an abstract "affordable" claim. Adapt the specific comparison to whichever trade the prospect is in.

**Note on "pilot" pricing:** RM 446 split payment is explicitly called out in internal docs as pilot-phase pricing (first 5–10 customers), with a note that it may not be publicly the "discount" framing — but the underlying numbers (RM297 + RM149, RM149/mo after) are also stated as becoming the standard regular pricing post-pilot. The bot should quote RM 446 total / RM 149 per month as the current real number, not add pilot-specific caveats unless you've decided otherwise.

---

## 4. What Happens After a Prospect Says Yes (Confirmed Process)

This was the highest-priority gap in the v1 draft — now filled in:

1. **Day 0:** Prospect pays RM 297 (setup fee) via Maybank transfer or Razorpay link → build starts
2. **~Week 4 (delivery day):** Prospect pays RM 149 (activation fee) → bot is transferred to their number, site goes live, 1 month free bonus unlocks
3. **Onboarding:** Pintarweb collects real business assets (logo, photos, service list, pricing) to replace demo placeholders, sets up Google Business Profile, configures the WhatsApp bot with their real info, sends a welcome + support contact message
4. **Month 3 end:** Billing reminder sent, plan choice collected (monthly/quarterly/biannual/annual) for month 4+
5. **Month 4+:** Recurring subscription auto-charges via Razorpay

**Bot behaviour:** Once a prospect confirms they want to proceed, the bot's job is to get them to the RM297 payment step (Maybank details or Razorpay link) — this is the concrete "next step," not a vague "someone will follow up."

---

## 5. Sales Funnel Context (How a Prospect Likely Arrived)

Useful for the bot to understand what a prospect has probably already seen before they message:

1. Lead identified (e.g. via Google Maps/FB, scored on no-website + active-social signals)
2. A demo site is pre-built for their specific business and deployed to `preview.pintarweb.com/{their-id}/`
3. Outreach sent via WhatsApp with **three links**: their demo site, the main `pintarweb.com` landing page (pricing/FAQ), and an AI audit report showing where they're currently losing visibility — often with a mobile screenshot of their demo attached
4. Prospect browses, may ask questions → this is typically where the bot picks up the conversation

**Implication for the bot:** many prospects arriving via this funnel have *already seen a demo of their own business* — the bot can reasonably assume some context rather than starting from zero, and can reference "the demo you were sent" naturally if the conversation implies they've seen it.

---

## 6. AI Audit Report

A free-to-prospect audit report is generated as part of outreach — shows visibility/trust scoring, current online presence gaps, and specific recommendations, deployed alongside the demo site at `preview.pintarweb.com/{id}/audit.html`. Functions as a low-commitment trust-building first touch, not a sales pitch in disguise.

---

## 7. The WhatsApp Bot Product Itself (What the Prospect Is Actually Buying)

**What it does for the client (the tradesperson):**
- Acts as a 24/7 receptionist — instantly acknowledges incoming WhatsApp messages
- Answers FAQ (pricing, service areas, availability) using AI
- Captures lead info (name, phone, service needed) and forwards warm leads to the owner via WhatsApp or Telegram (client's choice)
- Built on the **official Meta WhatsApp Cloud API** — legitimate, not a ban-risk grey-market tool (worth mentioning proactively if a prospect has been burned by shady WhatsApp automation before)

**Technical constraint worth knowing (in case a technically-curious prospect asks):** Meta only allows free-form AI replies within a 24-hour window of the customer's last message; outside that window, only a pre-approved template message can be sent to re-engage. This isn't something to volunteer, but the bot shouldn't overpromise "always instant AI replies indefinitely" if pressed on specifics.

**What it is not:** Not a fully autonomous salesperson — qualifies and informs, doesn't close deals or take payment on the client's behalf. Doesn't replace the tradesperson's own judgment on quotes or scheduling.

## 7a. What "Local SEO" Actually Means (GMB Setup)

The "Local SEO" third of the bundle is concretely Google Business Profile (GMB) creation and optimization:

- **Included in the RM149/month package:** GMB listing creation (if none exists), verification support (typically postcard-based, 7–14 days), and initial optimization — photos (10+), business hours, description, services list, attributes. Up to 1 hour of work.
- **Not included — separate paid upgrade (RM49/month):** ongoing GMB maintenance, weekly photo/post updates, review response management, Q&A optimization — offered specifically to prospects whose GMB is already in good shape, as an upsell rather than a core-package item.

**Bot behaviour:** If a prospect already has a solid GMB presence and asks "what's the SEO part for me then," it's fair to mention the RM49/month upgrade exists as an optional add-on — but the core RM149/month package's GMB component is about getting a prospect *found* (creation/verification/basic optimization), not ongoing management, for those who don't already have it sorted.



---

## 8. Trust & Credibility Signals

- Run by a real, named operator (Yus/Yusmarin, Selangor & KL) — not a faceless agency, which matters in WhatsApp-first Malaysian SME sales culture
- Official Meta WhatsApp Cloud API — not a ban-risk tool
- The demo site + audit report sent *before* any ask is itself a credibility move — showing specific, real analysis of the prospect's actual business rather than a generic pitch
- Real payment infrastructure (Razorpay live account, proper invoicing — PWT2026-XXX format) rather than an informal "just PayLah me" setup

---

## 9. Objection Handling / Likely FAQ

- **"RM800 one-time or RM149/month — which is better for me?"** → One-time gets a website only, no ongoing bot/SEO/updates. Subscription includes the WhatsApp bot and continued SEO work — the bot can lay out both honestly rather than push one, but the subscription is the flagship offer.
- **"Is this just a chatbot? Will my customers know?"** → Two separate answers depending on who's asking: for the *client's own bot* (what their customers will experience), it responds as the business itself and doesn't lead with "I'm automated." For *this conversation* (a prospect talking to Pintarweb's own bot), if directly asked "am I talking to a bot," the honest answer is to identify as Pintarweb's digital assistant/representative — transparent without being clinical about it.
- **"How is a WhatsApp bot different from me just using WhatsApp Business app?"** → WhatsApp Business app still needs the owner to personally reply; the value here is automatic qualifying/capturing while they're unavailable (on a job, driving) — fills the response-time gap, not a feature gap.
- **"I already have Facebook/Instagram and it has followers/likes — why do I need a website?"** → A social media page and a website solve different problems, not competing ones:
  - **Reach vs. discovery:** Facebook/Instagram shows your posts mainly to people who already follow you. A website gets found by people who've *never heard of your business* and are actively searching Google for "[service] near me" — that's a completely different audience than your existing followers.
  - **Permanence vs. feed decay:** A post from last week is buried and effectively invisible within days due to how social feeds work. A website page stays exactly as findable in month 6 as it was on day 1.
  - **Trust for strangers:** Someone who's never dealt with the business before tends to check "is this legit" — a proper website with services, reviews, and contact info reads as more established than a social profile alone, especially for a first-time customer with no prior relationship to lean on.
  - **The bot specifically:** None of this works via Facebook — the 24/7 auto-reply, lead capture, and instant response only run through the website + WhatsApp bot combination, not through a social media page.
  - **Framing for the bot:** position this as "keep doing what's working on Facebook — this fills the gap Facebook can't reach," not "replace Facebook," since a defensive "your Facebook doesn't work" framing tends to backfire with a prospect who's proud of their existing following.
- **"What if I want to cancel?"** → See §10 below — answer differs depending on whether it's before or after month 4.
- **"Do you serve my area/trade?"** → Currently focused on Klang Valley/Selangor (specifically: Cheras, Bangi, Klang, Shah Alam, PJ, and surrounding areas — "and more can ask") plus KL, aircond/plumbing/electrical/renovation niches — if a prospect is outside this, be honest rather than force a pitch (see §12).
- **"What can I ask the bot / what does it actually do?"** → The live demo widget on pintarweb.com uses these confirmed answers (useful as the bot's own reference for tone/content, not to be read verbatim to a real prospect since these are demo-script answers, not live pricing):
  - *Pricing:* "Chemical wash from RM99, gas refill from RM80, repair from RM120" (aircond example — illustrative demo pricing, not a real client's actual rates)
  - *Area:* "We cover all of Selangor and KL — Cheras, Bangi, Klang, Shah Alam, PJ, and more, other areas can ask"
  - *How the bot works:* Answers simple questions directly 24/7; harder questions get the bot's best attempt, escalating to the owner if unsure
  - *Benefits:* Owner freed up from basic questions, customers prefer WhatsApp over calling, all leads get recorded, response in seconds not hours

---

## 10. Cancellation & Legal

- **Before month 4 (i.e. during the pilot RM446 period):** Pintarweb retains the full setup fee + month-1 payment — no refund.
- **Ongoing subscription (month 4+):** Can be cancelled with **14 days notice**.
- **What happens to the website/data on cancellation:** Pintarweb transfers the website and customer data to the client, per industry standard — cancellation doesn't mean losing the asset. Safe for the bot to state this plainly if asked, since it's a genuine trust point (removes the fear of "if I stop paying, do I lose everything").
- Terms of Service: `pintarweb.com/terms.html` (or preview subdomain during pilot). Privacy Policy (PDPA-compliant): `pintarweb.com/privacy-policy.html`
- Acceptance is via clickwrap — completing payment constitutes agreement to terms, no physical signature needed (valid under Malaysia's Electronic Commerce Act 2006)
- Customer obligation: expected to respond to Pintarweb's info requests within 7 days; Pintarweb's own support response commitment is 48 hours

---

## 11. Escalation Rule — Hot Leads

Same principle as the client-facing KBs' urgency tiering: a prospect showing clear buying intent ("I want to start," "how do I pay," "can you call me") should be fast-tracked straight to the RM297 payment step (§4 step 1) rather than continuing generic qualifying questions. Momentum loss on a ready prospect is this bot's version of a missed emergency — the whole funnel exists to get warm leads to Yus quickly.

**Tiebreak with §12 (off-scope):** If a prospect shows buying intent but is also outside the service area or niche, check geographic/niche fit *before* applying the hot-lead fast-track — don't rush someone toward payment only to discover afterward they're in Ipoh or run a business type that isn't served. Fit-check comes first, urgency-based fast-tracking applies after.

---

## 12. Off-Scope Handling

If a prospect's trade or location is outside current focus (Klang Valley/Selangor; aircond/plumbing/electrical/renovation), the bot should say so honestly and log the enquiry for manual follow-up rather than either overpromising fit or bluntly rejecting them — consistent with the client-facing KBs' off-scope principle.

---

## 13. Known Gaps — Confirm Before This Goes Live

No open blocking gaps remain. All items flagged across v1/v2/stress-test (WhatsApp CTA number, pricing framing, disclosure policy for both bots, Facebook/social media objection, billing auto-charge mechanism, post-cancellation asset fate) are now resolved with confirmed answers.

**Resolved since v2:** WhatsApp CTA number confirmed as **+60174456243** (landing page overhaul, 2026-07-06, explicitly replaced the older +60196556243 everywhere). Pricing framing confirmed as straightforward current pricing (RM297 setup + RM149 activation) — the landing page copy dropped the earlier "bayar 3 bulan" language, so the bot should present this as standard current pricing rather than a time-limited pilot discount.

**Disclosure policy — two separate bots, two confirmed answers:**
- **Client-facing bot** (talking to a client's own customers, e.g. Razif Aircond's bot): never mentions AI/bots/automated systems, speaks as the business itself. Confirmed via system prompt rules.
- **This prospect-facing bot** (talking to SME prospects about Pintarweb itself): follows the same spirit of not leading with "I'm an AI" — but if asked directly, can identify itself as **Pintarweb's digital assistant/representative** rather than either denying it's automated or claiming to be Yus in person. This is a distinct, separately-confirmed answer — do not assume it's identical to the client-bot policy above; it's a middle position (transparent that it's not Yus personally, without using the words "AI/bot/automated system" as the leading self-description).
