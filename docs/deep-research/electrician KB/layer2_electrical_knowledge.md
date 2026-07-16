# Layer 2 Knowledge Base — Electrical Services (Malaysia)

**Purpose:** General niche knowledge for the electrical vertical, to sit under Layer 1 (bot behaviour/persona) and above Layer 3 (per-client config: actual pricing, service area, Suruhanjaya Tenaga/ST license details, booking slots).

**Status:** Draft v1, compiled from Malaysian electrical-service cost and safety sources, with urgency-tiering, multi-symptom rules, and licensing-trust content built in from the start — these were all things earlier KBs (aircond, plumbing, renovation) discovered as gaps *during* stress testing rather than before. Prices are **market reference ranges only** — must be validated/overridden by each client's actual rate card in Layer 3 before the bot quotes anything.

**Critical framing for this vertical specifically:** Electrical work is the most inherently safety-sensitive of the four niches — nearly every job here carries some fire/shock risk if done wrong, which is different from aircond/plumbing where only specific symptoms (burning smell, gas leak) hit that tier. This KB should default toward caution more broadly than the others, not just in a couple of flagged rows.

---

## 1. Symptom → Cause → Fix Matrix (Urgency-Tiered)

| Symptom | Likely Cause(s) | DIY Check (customer can try) | Urgency / Escalation |
|---|---|---|---|
| Circuit breaker trips occasionally, specific appliance | Appliance overload (kettle, aircon, hairdryer running simultaneously with others) | Unplug the appliance in question, reset breaker once, see if it holds | Routine — if it happens repeatedly with normal usage, main board capacity may need upgrading, but not urgent |
| Circuit breaker trips instantly, every time, no clear appliance cause | Wiring fault, short circuit | Do not keep resetting repeatedly | Escalate — needs professional diagnosis, don't keep forcing it back on |
| Switch/socket not working at all | Wiring fault, dead circuit, or (in resale/older homes) incorrectly done wiring from a previous owner | None beyond checking it's not simply off at the DB | Routine unless multiple switches/sockets affected — then escalate as possible wiring issue |
| Switch plate cracked/damaged, exposing wiring | Physical damage, wear | Avoid touching exposed area, don't use the switch | **Escalate — exposed wiring is a shock risk, don't wait** |
| Frayed or visibly damaged wiring (anywhere) | Pest damage (rodents chewing), wear, faulty original install | Do not touch or attempt to tape/cover it yourself | **Urgent — stop using the affected circuit, call a professional immediately** |
| Burning smell near an outlet, switch, or DB board | Overheating connection, wiring fault — serious | **None. Do not operate anything on that circuit.** | **Emergency — same tier as gas smell in the plumbing KB. Switch off power at the main if safely accessible, do not touch the area, call immediately.** |
| Sparking from an outlet or switch | Wiring fault, moisture ingress, loose connection | **None.** | **Emergency — same tier as burning smell. Do not use, switch off main power if safe, call immediately.** |
| Electrical shock felt (even mild) when touching an appliance/switch | Earth fault, damaged insulation, missing/faulty earthing | **None — do not touch the item again.** | **Emergency, highest tier — this means someone was already exposed to live current. Advise unplugging via the switch (not touching the appliance body), and call immediately. If shock was significant, this is a safety situation, not just a repair one.** |
| Lights flickering (whole house or one area) | Loose connection, voltage fluctuation, sometimes a utility-side (TNB) issue rather than internal wiring | Check if it's isolated to one device/bulb first | Routine to escalate, unless accompanied by burning smell/sparking (then treat as emergency per above) |
| Power outage, only this house (neighbours have power) | Tripped main switch, DB fault, or TNB supply issue to this unit specifically | Check main switch/DB first | Routine — if DB check doesn't resolve it, needs a professional; if it's confirmed a TNB supply-side issue, that's outside a private electrician's scope (see §7) |
| GFCI/ELCB (earth leakage breaker) keeps tripping in kitchen/bathroom | Moisture reaching a connection, appliance fault, or the breaker itself failing | Unplug appliances in that area one at a time to isolate | Routine unless it won't reset at all or trips instantly — then escalate |

**Bot behaviour note:** Burning smell, sparking, and electrical shock are always emergency-tier, no DIY, immediate escalation — this mirrors the aircond KB's burning-smell row and the plumbing KB's gas-smell row, just applied to the majority of this niche's symptom space rather than one or two rows. Electrical shock specifically should be treated as the single most urgent entry across all four KBs so far, since it implies someone has already been exposed to injury risk, not just property risk.

**Multi-symptom rule (carried over from aircond/plumbing/renovation):** If a customer reports two or more electrical symptoms together, default to booking a professional visit rather than attempting to resolve each individually in chat — and if *any* of the reported symptoms is emergency-tier (burning smell, sparking, shock), the whole message should be treated at that higher urgency regardless of what else was mentioned alongside it.

---

## 2. Legal/Licensing — Suruhanjaya Tenaga (Energy Commission Malaysia)

This is this niche's equivalent of the renovation KB's CIDB/SSM section — the trust-critical credential to know about.

- Electricians and wiremen doing wiring/installation work in Malaysia are expected to be licensed and certified by **Suruhanjaya Tenaga (ST)** — the Energy Commission of Malaysia.
- This matters for the same reason CIDB matters in renovation: it's both a legal requirement and a reasonable, expected question from a safety-conscious customer.
- **Bot behaviour:** If asked "awak ada lesen ST?", confirm from Layer 3 and be ready to state it plainly — same principle as the renovation KB's CIDB instruction: don't just assert "yes we're licensed," be ready to provide the actual detail if asked, since independent verifiability is the point.
- Licensed electricians/wiremen are also typically the ones authorized to liaise directly with **TNB (Tenaga Nasional Berhad)** for things like meter relocation, power restoration coordination, or main board upgrades — worth knowing if a prospect's issue turns out to be utility-side rather than internal wiring (see §7).

---

## 3. DIY Boundary — Stricter Than Other Niches

Unlike aircond (filter cleaning) or plumbing (aerator cleaning, plunger use), there's very little in electrical work that's genuinely safe for a customer to do themselves:

- **Legally**, only licensed electricians can handle major wiring work in Malaysia.
- Basic tasks like replacing a blown fuse (if the customer knows how) or resetting a tripped breaker **once** are reasonable — repeatedly forcing a breaker back on when it keeps tripping is not.
- Full DIY wiring is explicitly flagged as risky and can void home insurance — worth mentioning if a customer signals they're considering doing something themselves beyond a basic reset.

**Bot behaviour:** Default to "this needs a professional" more readily here than in the aircond/plumbing KBs, where a meaningful chunk of symptoms had a reasonable first-try DIY step. Electrical is the niche where over-cautioning is the safer error to make, not under-cautioning.

---

## 4. Price Reference Ranges (Market-Level — DO NOT quote directly, cross-check against client's Layer 3 rate card)

| Service | Typical Range (RM) | Notes |
|---|---|---|
| Fault diagnosis / troubleshooting (tripping, circuit issues) | From 120 | Often the entry point before a repair quote |
| New socket/power point installation | 60–80 | Beside existing wiring; concealed/extended wiring costs more |
| Switch installation | 80 | |
| Doorbell installation | 100 | |
| Smoke/CO detector installation | 100–150 | |
| Light fixture installation (downlight/pendant/track, min 6 units) | ~30/unit | |
| Ceiling fan installation | Part of standard job durations (1–1.5 hrs) — confirm rate from Layer 3 | |
| Exterior light fixture (to existing wiring) | 80–150 | |
| DB box installation/upgrade/replacement (MCB + RCD/ELCB) | From 350 | Common upsell when a customer wants more aircon units or higher capacity — see §7 |
| Water heater electrical connection | From 150 | Often bundled into a plumbing water-heater install — see plumbing KB §1 |
| Full house rewiring | 4,000–12,000 | Depends heavily on house size and number of points |
| General hourly rate (if not job-based) | ~200/hr, 2-hour minimum common | Varies by provider |
| Site-visit/inspection-only fee (if customer doesn't proceed after quote) | Sometimes charged (e.g. ~80) | Confirm whether this client's policy waives it if the customer proceeds |

This is aggregated from multiple KL/Selangor providers as of mid-2026 — treat as a **sanity-check floor/ceiling**, not a quote. Actual client pricing always takes precedence, and anything involving concealed wiring, full rewiring, or DB upgrades should be scoped in person before a firm number is given.

---

## 5. Job Duration Reference (Useful for Setting Expectations)

- New socket/outlet installation: 1–2 hours
- Ceiling fan or light fitting: 1–1.5 hours
- Full room rewiring (5–7 outlets): 6–8 hours
- Electrical safety inspection & testing: 2–3 hours
- Full house rewiring: multi-day (2–5 days depending on complexity, per general contractor timelines)

---

## 6. Emergency / After-Hours Service

Electrical work has a naturally higher share of genuinely urgent requests than aircond/plumbing (see §1's emergency-tier rows) — a meaningful number of providers in this space explicitly offer 24/7 emergency response with fast callout targets (30–60 minutes in urban Klang Valley areas is a commonly advertised benchmark, though this is a market pattern, not a promise this specific client necessarily matches).

**Bot behaviour:** Same as the plumbing KB's lesson — "do you have 24/7 service" is a Layer 3 fact (does *this* client actually offer after-hours service), not something the bot should assume or invent. If Layer 3 doesn't have this field populated, flag it before this KB goes live, since electrical's emergency-tier rows will trigger this question more often than the other niches.

---

## 7. Common Upsell / Related Job: DB Board Capacity Upgrade

A specific, recurring scenario worth having pre-built into the KB: a customer wants to add appliances (more aircon units, an EV charger, etc.) and their circuit breaker keeps tripping — the underlying cause is often that an older home's main distribution board wasn't built for that many high-draw appliances. Older homes may only support 2 aircon units on original capacity; a DB upgrade can raise that to 6 or more.

**Bot behaviour:** If a customer's symptom is "keeps tripping" and they mention wanting to add appliances (new aircon, EV charger, etc.), this is a good moment to surface the DB upgrade as a likely underlying fix rather than just quoting a one-off troubleshooting visit — genuinely useful information, not an upsell dressed as diagnosis, since it directly explains the recurring symptom.

---

## 8. When It's a TNB (Utility) Issue, Not This Client's Scope

If a power issue is confirmed to be on the utility supply side (e.g. an outage affecting the whole street, not just one unit) rather than internal wiring, that's outside a private electrician's scope — the customer needs to contact TNB directly, not the client's business. A licensed electrician can sometimes help liaise with TNB for specific matters (meter relocation, restoration coordination) but can't fix a supply-side outage themselves.

**Bot behaviour:** If a customer describes a broader outage (neighbours also affected), it's worth gently flagging this may be a TNB matter rather than immediately booking a paid visit for something outside the client's control — this is a trust-building moment (being honest about scope) more than a lost booking, similar in spirit to the off-scope handling principle in the other KBs.

---

## 9. Objection Handling / Likely FAQ

- **"Awak ada lesen ST?"** → Confirm from Layer 3, provide actual detail if asked — same principle as CIDB in the renovation KB (see §2).
- **"Selamat ke buat sendiri, saya just nak tukar switch je?"** → Per §3, be more cautious here than in other niches — even a "simple" switch swap involves live wiring, and the honest answer leans toward recommending a professional rather than validating a DIY attempt, especially compared to how the aircond/plumbing KBs allow more DIY latitude.
- **"Kenapa asyik trip breaker bila saya pasang aircon baru?"** → Good opportunity to surface the DB capacity explanation from §7 rather than just quoting a repair.
- **"Emergency ni, ada shock tadi"** → This should immediately trigger the highest urgency tier from §1 — advise switching off via the main/breaker (not touching the affected item), and prioritize this over any other queued conversation.

---

## 10. Off-Scope Handling (Cross-Trade Enquiries)

Same policy as the other three KBs: if an electrical customer mentions an unrelated issue (aircond, plumbing, renovation), acknowledge without diagnosing, confirm what this client's service covers, and log the off-scope item for manual follow-up. As with renovation's kitchen-electrical overlap, some jobs are naturally cross-trade (e.g. water heater electrical connection is often bundled with plumbing work) — this is expected scope, not a referral case; distinguish that from a fully separate service request.

**Water heater ambiguity specifically:** A customer asking to "check my water heater" is genuinely ambiguous between two different scopes — the **electrical connection/power supply to the unit** (in scope for this KB) versus the **heater's own heating performance/thermostat/tank** (plumbing-KB territory, see plumbing KB §1). Don't assume either — a quick clarifying question (is it not getting power at all, vs. getting power but not heating) determines which scope applies, and if it's the latter, log it as cross-trade rather than treating it as automatically in scope.

---

## 11. Known Gaps — Needs Manual Fill (not covered by desk research)

- **Manglish/BM jargon glossary** — same caveat as the other three KBs: needs real WhatsApp logs / Phase 0 role-play, not desk research.
- **Actual client ST license number, pricing, and after-hours availability** — intentionally left as placeholders/ranges; Layer 3 owns these, and after-hours availability specifically is a hard blocker given how often this niche's emergency-tier rows will surface that question.
- **Specific TNB liaison process details** — mentioned in §8 at a high level only; if this comes up often in practice, worth fleshing out with the client's actual process.
- **Low-intent/browsing message handling** — same as the other KBs, not every enquiry needs the full emergency-triage flow; worth confirming once real conversation data exists for this vertical.
