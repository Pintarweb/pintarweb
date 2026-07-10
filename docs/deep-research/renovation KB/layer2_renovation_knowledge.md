# Layer 2 Knowledge Base — Renovation Services (Malaysia)

**Purpose:** General niche knowledge for the renovation vertical, to sit under Layer 1 (bot behaviour/persona) and above Layer 3 (per-client config: actual pricing, service area, portfolio, CIDB/SSM registration details, booking slots).

**Status:** Draft v1, compiled from Malaysian renovation-cost sources and CIDB/consumer-protection guidance, plus lessons carried over from the aircond/plumbing KBs (urgency-tier splitting, multi-symptom/multi-request triage, off-scope handling). Prices are **market reference ranges only** — must be validated/overridden by each client's actual rate card in Layer 3 before the bot quotes anything.

**Critical framing for this vertical specifically:** Renovation is the highest-value, highest-trust-risk niche of the four (aircond, plumbing, electrical, renovation). Project values run into tens of thousands of ringgit, and Malaysia has a well-documented, ongoing renovation scam problem — CIDB reports roughly 150 fraud complaints a year, with typical individual losses between RM30,000–RM300,000. This changes the bot's job here: it's not just answering questions, it's actively reassuring a wary prospect that *this* contractor is legitimate. Trust-signaling should be woven through the whole conversation, not confined to one FAQ answer.

---

## 1. Request Type → Typical Scope & Price Range

As with the plumbing KB, **never quote a firm number** — this table is a sanity-check range only, and renovation pricing varies far more than aircond/plumbing due to material choice, property condition, and scope creep. Always push toward an in-person assessment and written quotation for anything beyond a very small job.

| Request Type | Typical Range (RM) | Notes |
|---|---|---|
| Painting only (per room/unit-wide) | ~10/sq ft (unit-wide) | Cheapest, lowest-risk entry job |
| Bathroom renovation (basic) | 5,000–15,000 | Waterproofing, tiling, sanitary ware are the main cost drivers |
| Bathroom renovation (mid-range) | 22,000–67,000 | Better fixtures/tiling |
| Kitchen renovation (basic) | 15,000–25,000 | Cabinets are the biggest line item (RM8k–35k alone) |
| Kitchen renovation (mid-range) | 25,000–45,000 | |
| Kitchen renovation (premium/luxury) | 50,000–100,000+ | Custom cabinetry, high-end appliances |
| Full home renovation (condo/apartment) | 30–120/sq ft interior redo | Wide range depending on quality tier |
| Full home renovation (terrace house) | ~10/sq ft (paint only) up to 30-120/sq ft (full redo) | Larger footprint can mean lower cost-per-sqft for basic work |
| House extension (single-storey kitchen extension) | 20,000–50,000 | Structural work is the major cost driver |
| New built-up area (general) | 150–300/sq ft | For actual extensions, not interior redo |
| Bungalow major renovation | From 100,000+ | Scales heavily with complexity |
| Office/commercial fit-out (KL CBD) | 120–220/sq ft | M&E works (aircond, wiring, fire protection) is usually the single biggest cost category (30-40% of budget) |
| Electrical wiring (per point) | 100–280 depending on amp rating | 13A RM100-150, 15A RM200-250, 20A RM250-280 |

**Standard inclusions in a "general contractor fee":** typically 10-15% of total project cost on top of materials/labour — worth mentioning if a prospect asks "why is there a contractor fee on top of everything else."

**Always recommend:** 10-20% contingency buffer on top of any quoted budget, and getting 3+ quotes before deciding — this is standard homeowner advice across every source, not unique to any one contractor, so it's safe (and trust-building) for the bot to proactively mention it.

---

## 2. Multi-Request / Scope Ambiguity Rule

Renovation enquiries are frequently vague at first contact ("nak renovate rumah," "tukar dapur") — this is normal for the niche, not a sign of a confused customer, and the bot's job is to narrow scope through questions rather than assume. Carrying over the multi-symptom triage principle from aircond/plumbing: if a customer mentions multiple areas (kitchen + bathroom + painting) in one message, do not attempt to estimate a combined number in chat — this is exactly the kind of request that needs an in-person assessment given how much scope and material choice affects renovation cost specifically.

**Useful narrowing questions for the bot to ask:**
- Which area(s) specifically (kitchen, bathroom, whole unit, extension)?
- Property type (condo, terrace, semi-D, bungalow, office)?
- Roughly what size (sq ft), if known?
- Is this a fresh subsale unit (older wiring/plumbing likely needs replacing) or a newer unit (mostly cosmetic)?
- Any structural changes involved (hacking walls, extensions) vs cosmetic-only (painting, cabinets, fixtures)?

---

## 3. Trust & Anti-Scam Positioning (Critical for This Niche)

This is the section that matters most for renovation specifically — a prospect asking about contractor trustworthiness isn't being paranoid, it's a rational response to a well-documented problem in this exact market.

**What legitimate contractors in Malaysia are expected to have, and the bot should be ready to confirm for its client (pull actual details from Layer 3):**
- **CIDB registration** (Construction Industry Development Board) — mandatory under Section 25 of Act 520 for any contractor doing construction work; required for projects above RM50,000-500,000 depending on source, but a very strong trust signal regardless of project size. Gradings: Class F/G1 for small residential jobs, up to Class A for unlimited-value projects.
- **SSM registration** (Companies Commission of Malaysia) — confirms the business is a legally registered entity, checkable at ssm-einfo.my.
- A **written contract** with clear scope, timeline, and payment schedule tied to milestones — CIDB actively promotes standard agreement templates specifically because verbal-only or WhatsApp-screenshot-only agreements are a recurring feature in fraud cases.

**Standard, safe deposit/payment structure to describe if asked "how much deposit do you need":**
- 10-25% deposit on signing is the widely-cited safe range; anything above 25% (and especially 30-50%+) is a documented red flag pattern used by scam contractors.
- Remaining payments tied to inspected milestones — a common structure example: 10% deposit → 20% after hacking/tiling → 25% after carpentry → 25% after electrical/painting → 20% on final handover/inspection. (Illustrative structure, not necessarily the client's actual schedule — confirm against Layer 3.)
- A 5-10% retention held back until final inspection is a reasonable ask a homeowner might make — fine for the bot to acknowledge as standard practice if raised.

**Bot behaviour:** If a prospect asks about deposit or payment structure, this is an opportunity to proactively differentiate — confirming CIDB/SSM registration exists and that payment is milestone-based (not a large upfront lump sum) directly answers the fear this market has been trained to have. This should be treated similarly to the aircond KB's "price-integrity reassurance" pattern, just with materially higher stakes given typical project size.

---

## 3a. If a Prospect Discloses a Past Bad Experience or Scam

Given how documented this problem is in the Malaysian market, the bot will genuinely encounter prospects who mention they've been burned before ("contractor lain lari bawa deposit," "pernah kena tipu"). This needs different handling from a standard trust question — it's not a knowledge gap, it's a tone gap, and getting it wrong risks losing an otherwise-recoverable, high-intent lead at the most vulnerable point in the conversation.

**What not to do:** Jump straight into reciting CIDB numbers, deposit structure, and portfolio links as if this were a routine "do you have registration" question. That sequence, applied right after someone discloses a bad experience, reads as tone-deaf — answering the question they didn't quite ask instead of the concern underneath it.

**What to do instead:**
1. Briefly acknowledge what they said, human first — a short, genuine line, not a scripted-sounding sympathy statement
2. *Then* move into the trust content from §3/§8 — but frame it as directly responding to their specific concern rather than a generic recitation ("that's exactly why we..." rather than starting cold with a registration number)
3. Don't probe for details of what happened — that's not the bot's place, and isn't necessary to move the conversation forward constructively

This is the one place in this file where sequencing matters as much as content — the same facts (CIDB number, deposit structure) land completely differently depending on whether they follow an acknowledgment or replace one.

---

## 4. Common Renovation Scam Patterns (For Bot Awareness — Not to Explain the Mechanics, Just to Recognize the Shape of the Concern)

Useful for the bot to recognize *why* a prospect might sound hesitant or ask pointed questions, without needing to lecture them on scam tactics:

- Large upfront deposit (30-50%+) followed by minimal/no work, then the contractor disappears — the single most common pattern
- Unrealistically low quotes used to win the job, followed by later "hidden charges" or material swaps
- Fabricated portfolios (stock photos, other companies' project photos passed off as their own)
- False urgency ("sign today for this discount," "must start immediately") to prevent the homeowner from doing normal due diligence (checking CIDB/SSM, getting other quotes)

**Bot behaviour:** The bot should never need to explain these patterns to a prospect proactively — that could come across as strange or even slightly threatening. The relevant use is recognizing that a hesitant or careful prospect is being reasonable, not difficult, and responding with the reassurance in §3 rather than pressure tactics (no false urgency, no pushing for a decision "today").

**Customer-initiated urgency ("start tomorrow, discount if I sign today?"):** This can come from the customer's own side too, not just a scam contractor's. The bot shouldn't refuse a genuinely time-pressed customer or lecture them — but it also shouldn't match "sign today for a discount" framing even at the customer's own request, since that's the exact shape scam-adjacent selling takes in this market. A reasonable response: still offer to move quickly on a visit/consultation, without creating same-day-signing pressure or inventing a limited-time discount.

---

## 5. Timeline Expectations

- Simple painting/cosmetic jobs: days to ~1-2 weeks
- Bathroom/kitchen renovation: typically several weeks depending on scope and whether custom carpentry is involved (cabinets often have the longest lead time)
- Full home renovation: commonly 1-3 months depending on size and structural scope
- House extension/structural work: longest timeline category, and most exposed to delays from permit/approval requirements (see §6)

**Bot behaviour:** Avoid giving a firm timeline in chat beyond these rough bands — actual timeline depends heavily on scope and should come from the client's own assessment, same principle as pricing.

---

## 6. Permits & Approvals (When Relevant)

- Structural changes (extensions, wall hacking that affects load-bearing structure) typically require local council (PBT) approval — a legitimate contractor should be able to speak to whether a specific job needs this.
- Strata/condo properties often have their own renovation approval process through the JMB/MC (separate from council approval), plus renovation deposit requirements (commonly RM5,000-20,000 range for commercial/office contexts, smaller for residential) and restricted working hours.
- **Bot behaviour:** If a prospect's project sounds structural (extension, wall hacking, anything load-bearing) or is in a strata property, flag that permits/approvals may apply and that this is exactly the kind of thing worth confirming with the contractor directly rather than the bot guessing — avoid stating a specific approval requirement with confidence unless it's a known, simple case (e.g. cosmetic-only work in a landed house generally doesn't need council approval).

---

## 7. Common Cost-Overrun Causes (Useful for Setting Expectations Proactively)

- Hidden damage discovered once work starts (especially in older/subsale properties) — old wiring, pipes, structural issues not visible until walls are opened
- Scope creep — homeowner adds requests mid-project
- Design changes after work has started
- For commercial/office jobs specifically: M&E (mechanical/electrical) requirements not fully validated before the layout is finalized, causing rework once ceilings are opened

**Bot behaviour:** This is useful content for proactively setting expectations with a prospect (e.g. "why the 10-20% contingency matters") rather than something to raise defensively after a cost overrun complaint — better used early in a conversation about budgeting than as a post-hoc excuse.

---

## 8. Objection Handling / Likely FAQ

- **"Deposit berapa? Boleh bayar penuh dulu senang cerita?"** → Explain the standard 10-25% deposit + milestone-based structure (§3) — this is a moment to build trust, not just answer logistically. A contractor pushing for full payment upfront is itself the #1 documented red flag in this market, so confirming the *opposite* practice is meaningful reassurance.
- **"Ada CIDB/SSM tak?"** → Confirm registration details from Layer 3 directly and plainly — this is a completely reasonable, expected question in this market, not a sign of distrust to be defensive about. **Give the actual registration number if asked, not just a "yes we're registered" assertion** — the whole point of this trust category is independent verifiability (a careful prospect may want to check it themselves via the CIDB portal or ssm-einfo.my), and a bot that's vague about the actual number undercuts the reassurance it's trying to give.
- **"Berapa lama siap?"** → Give the rough timeline band from §5, and note that a firm date comes after an in-person scope assessment.
- **"Kenapa quote awak lagi tinggi dari contractor lain?"** → Don't get defensive or badmouth competitors. Reasonable framing: significantly-lower quotes are one of the most common lead-ins to a scam pattern in this market (§4), and a fair comparison should be of like-for-like scope, materials, and whether the other quote is itemized — encourage the prospect to ask for an itemized breakdown from any contractor they're comparing, including this one.
- **"Boleh tengok portfolio/project sebelum ni?"** → Absolutely should be answerable — real project photos/references are one of the clearest legitimacy signals in this market. Pull actual portfolio links/references from Layer 3.

---

## 9. Off-Scope Handling (Cross-Trade Enquiries)

Same policy as aircond/plumbing KBs: if a renovation customer also mentions an unrelated issue (e.g. "lepas renovate boleh tolong servis aircond sekali?"), acknowledge without diagnosing, confirm what this client's service covers, and log the off-scope item for manual follow-up. Whether cross-sell is enabled depends on the specific client's Layer 3 config. Renovation and electrical/aircond/plumbing work often genuinely overlap on a single project (e.g. a kitchen reno involves plumbing and electrical points) — this is different from a pure cross-trade referral, and worth distinguishing: work that's a *normal part of* a renovation scope (electrical points, plumbing relocation within a reno) isn't off-scope, it's expected; a fully separate service request (e.g. "also servis my aircond while you're here") is the off-scope case.

---

## 10. Known Gaps — Needs Manual Fill (not covered by desk research)

- **Manglish/BM jargon glossary** — same caveat as the other KBs: needs to come from real WhatsApp logs / Phase 0 role-play, not desk research.
- **Actual client pricing, CIDB/SSM registration numbers, and portfolio** — intentionally left as sanity-check ranges and placeholders; Layer 3 owns these and they're a hard blocker before the bot can answer the trust-critical questions in §8 with real confidence rather than generic reassurance.
- **Specific permit/approval requirements per local council** — varies by municipality (MBPJ, DBKL, MPS, etc.) and wasn't covered in enough depth here to state definitively; flag rather than guess if a prospect asks about a specific council's process.
- **Low-intent/browsing message handling** — same as the other KBs, not every enquiry needs the full scope-narrowing flow; a "just checking prices roughly" message should get a lighter response.
