# Layer 2 Knowledge Base — Plumbing Services (Malaysia)

**Purpose:** General niche knowledge for the plumbing vertical, to sit under Layer 1 (bot behaviour/persona) and above Layer 3 (per-client config: actual pricing, service area, booking slots, technician name).

**Status:** Draft v1, compiled from public Malaysian plumbing-service and legal sources (KL/Selangor-focused), plus lessons carried over from the aircond KB stress test. Prices are **market reference ranges only** — must be validated/overridden by each client's actual rate card in Layer 3 before the bot quotes anything.

---

## 1. Symptom → Cause → Fix Matrix

Rows are split by urgency tier from the start (a lesson from the aircond stress test — smell/leak type matters, don't lump "routine" and "urgent" versions of the same symptom together).

| Symptom | Likely Cause(s) | DIY Check (customer can try) | Urgency / Escalation |
|---|---|---|---|
| Dripping tap ("paip menitis," "tap bocor sikit") | Worn washer/seal, loose fitting | None recommended beyond noting frequency | Routine — book a visit, not urgent |
| Clogged/slow drain — sink, floor trap ("choke," "air x turun") | Hair, grease, food particles, debris buildup | Pour hot water; baking soda + vinegar as a gentler alternative to chemical cleaner | Routine, unless recurring — recurring clogs may mean a deeper blockage |
| Clogged toilet | Excess paper/foreign object, blockage further down the line | Plunger only — do not force repeated flushing | Routine unless water is rising toward overflowing — then urgent |
| Low/weak water pressure (all taps) | Main supply issue, water heater problem, leak in supply line, pressure regulator fault | Check if only one tap affected (aerator issue) vs whole house | Routine, but whole-house pressure drop should be diagnosed rather than guessed at |
| Low pressure at one tap only | Clogged aerator/showerhead | Unscrew and clean aerator/showerhead | DIY-fixable, no technician needed usually |
| Bad/rotten smell from drain ("bau busuk dari sink/lantai") | Grease/food clog rotting, dry floor-trap (P-trap) losing its water seal, possible sewer line crack | Run water into floor trap regularly if room is rarely used, to keep trap sealed | Routine unless smell is very strong or persistent — may indicate sewer line issue |
| Water stains / bubbling paint on ceiling or wall | Leak from pipe, floor trap, or unit above (if in strata/condo) | Take photos, note when it appears (e.g. after neighbour's laundry/shower) | **Escalate — but first ask: landed house or strata/condo unit?** This determines which path applies. Landed → standard repair booking. Strata/condo → see §5 Strata/Inter-Floor Leakage below; the correct next step is different (management-body process, not just a repair job) and giving the wrong one wastes the customer's time. Do not attempt DIY fix on a ceiling leak either way. |
| Water heater not heating / lukewarm only | Faulty thermostat/heating element (storage type), power issue or low water pressure (instant type) | Check circuit breaker, confirm power switch is on | If breaker/power check doesn't resolve it, needs technician — do not open the unit |
| Water heater leaking from bottom/drain valve | Loose or worn drain valve, sediment buildup | Do not attempt if unfamiliar — this involves hot water, pressure, and electrical/gas components | **Turn off water supply and power/gas to the unit first, then call technician.** Simple valve leaks are sometimes DIY-fixable by experienced people, but default advice via chat should be professional assessment given the safety mix (heat + electrical/gas) |
| Water heater leaking from tank body (not valve) | Internal corrosion, cracked tank | None — this is not repairable, only replaceable | Escalate — likely needs replacement, not repair |
| Gas smell near water heater or gas pipe | Gas leak | **None. Do not operate switches, do not light anything.** | **Emergency — evacuate area, turn off gas supply at the source if safely accessible, call technician/gas company immediately. Treat with the same urgency tier as an aircond electrical trip/burning smell.** |
| Burst pipe / sudden major flooding | Pipe failure, often age/pressure related | Turn off main water supply immediately | **Emergency — same tier as gas smell. Immediate technician dispatch, not a scheduled booking.** |
| Sewer line blockage / wastewater backup, foul smell throughout | Deep blockage, tree root intrusion, aging sewer line | None — do not attempt | Escalate — needs specialized equipment, not a standard visit |

**Bot behaviour note — urgent tier:** Gas smell and burst pipe are always treated as emergencies requiring immediate dispatch, never a scheduled slot. This mirrors the aircond KB's rule for electrical tripping/burning smell — any utility-safety issue (electrical, gas, major water damage) gets the same urgent-escalation treatment regardless of which trade it's in.

**Multi-symptom rule (carried over from aircond KB):** If a customer reports two or more plumbing issues together (e.g. "clogged drain AND bad smell," "low pressure AND water heater not working"), default to booking a technician visit rather than trying to resolve each individually in chat — combined symptoms often share a root cause the bot can't diagnose over text.

---

## 2. Common DIY Mistakes Worth Warning Customers About

Useful for the bot to proactively mention when a customer signals they're about to try a DIY fix — positions the client as helpful rather than just trying to get a paid visit:

- **Over-tightening fittings** (especially galvanized pipe/elbows) — doesn't leak immediately, but can crack within weeks from the torque, causing a bigger leak later.
- **Overusing chemical drain cleaner** — damages metal pipes over repeated use and produces fumes that can cause breathing difficulty. Hot water + baking soda/vinegar is the safer default suggestion for a first attempt.
- **Forgetting to turn off water supply before starting any DIY work** — the single most common beginner mistake, worth a gentle reminder if a customer says they're about to try something themselves.
- **Wrong plumber's tape direction** — tape must wrap clockwise around the thread; wrapped the wrong way, it unwinds when the fitting is tightened.

---

## 3. Signs of a Deeper Plumbing Problem (Useful for Bot to Ask About Proactively)

When a customer describes one symptom, these are good follow-up questions to size the actual problem before booking:

- Unexplained rise in water bill → often a hidden leak or a running toilet, not visible drips
- Bad smell with no visible source → could be a dried-out floor trap, grease clog, or (less commonly) a cracked sewer line
- Slow drainage at multiple fixtures at once (not just one) → points to a shared line issue, not a single-fixture fix
- Pipe/fitting discoloration → early sign of corrosion, worth flagging even if not yet leaking

---

## 4. Price Reference Ranges (Market-Level — DO NOT quote directly, cross-check against client's Layer 3 rate card)

| Service | Typical Range (RM) | Notes |
|---|---|---|
| Minor repairs (leaking tap, small fitting, aerator/washer replace) | 80–200 | Handyman-level jobs |
| Clogged drain / floor trap clearing | 80–250 | Higher if snaking/rodding required |
| Water heater repair (valve, thermostat, element) | 150–400 | Varies by storage vs instant type |
| Water heater replacement (unit + install) | 400–1,500+ | Depends heavily on brand/capacity |
| Concealed pipe leak detection + repair | 500–2,500+ | Wall-hacking/access work drives this up significantly |
| Emergency/after-hours callout | Often a premium on top of standard rate | Varies by provider |

This is aggregated from multiple MY/regional providers as of mid-2026 — treat as a **sanity-check floor/ceiling**, not a quote. Actual client pricing always takes precedence, and any concealed-pipe or major job should be scoped in person before a firm number is given, not estimated in chat.

---

## 5. Strata / Inter-Floor Leakage (Malaysia-Specific — Important for Condo/Apartment Customers)

**Ask property type first.** Before applying anything in this section, the bot should have already confirmed (per §1's ceiling-leak row) whether the customer lives in a landed house or a strata/condo unit — this section only applies to the latter. For landed property, a ceiling/wall leak is just a standard plumbing repair booking with no legal-process angle.

This is a distinctly Malaysian legal wrinkle worth having in the KB since a meaningful share of Klang Valley customers live in strata property.

- **Section 142 of the Strata Management Act 2013** creates a legal presumption: if there's dampness/leakage on a ceiling, it's presumed to originate from the unit directly above — *unless proven otherwise*. This is a starting-point presumption for the building management's investigation, not an automatic verdict.
- Practical process (per Strata Management Regulations 2015): a written complaint is made to the JMB/MC (building management) → inspection typically within 5–7 days → a **Certificate of Inspection (Form 28)** identifies the cause and the responsible party.
- If the leak's source is a pipe/fitting serving **only one unit**, that unit owner is responsible — even if it's physically embedded in a shared wall/ceiling void. If it serves **multiple units**, it's treated as a common property defect (management body's responsibility).
- If parties disagree, the matter can go to the **Commissioner of Buildings (COB)**, and beyond that, the **Strata Management Tribunal** — non-compliance with a Tribunal order is a criminal offence.
- **Bot behaviour:** The bot should not attempt to adjudicate fault or quote this law as a definitive answer to "whose fault is it" — that's a management-body/COB process, not something a plumber's WhatsApp bot resolves. What the bot *can* usefully do: explain that a ceiling leak in a condo likely needs to go through the JMB/MC complaint process, and offer the client's plumber for an independent diagnosis/report that the customer can bring to that process (many owners need a plumber's assessment as supporting evidence anyway).

---

## 6. Repair vs Replace Guidance — Water Heaters

Mirrors the aircond KB's repair-vs-replace framework, applied to the plumbing vertical's main "big ticket" item.

General signals favouring **replace over repair**:
- Unit is 8–10+ years old (typical storage water heater lifespan in MY conditions)
- Leak is from the tank body itself (internal corrosion/crack) rather than a valve — this is not repairable, only replaceable (see §1)
- Recurring breakdowns despite previous repairs
- Repair cost approaches a large share of replacement cost (same rough rule as aircond: if repair nears ~40–50% of a new unit's price, lean replace)

Signals favouring **repair**:
- Unit is young (under ~5 years), issue is isolated to a specific part (valve, thermostat, heating element), and repair cost is a small fraction of replacement

The bot should relay these as general considerations only and always recommend an in-person technician assessment for a firm decision — never state a repair/replace verdict on its own, consistent with the aircond KB's approach.

---

## 7. Consumer Trust / Objection-Handling Signals

- "Confirm no hidden/extra charges?" → Same pattern as aircond — reassure that any extra scope found on-site (e.g. a leak turns out to be a bigger pipe job) is confirmed with the customer before proceeding, not silently added to the bill.
- "How do I know the clog/leak won't come right back?" → Reasonable to mention that root-cause fixes (vs. just clearing a symptom) are what prevent repeat visits, without overpromising a permanent fix for issues that depend on usage habits (e.g. grease disposal).
- "Can you just tell me what's wrong over WhatsApp before I book?" → The bot can give general possibilities (per §1) but should be upfront that concealed/behind-wall issues genuinely need an in-person look — this isn't stalling, it's accurate for anything beyond a visible tap/drain issue.

---

## 8. Off-Scope Handling (Cross-Trade Enquiries)

Same policy as the aircond KB: if a plumbing customer mentions an unrelated issue (aircond, electrical, renovation), the bot should acknowledge without diagnosing, confirm what this client's service covers, and log the off-scope item for manual follow-up rather than promising or refusing on the bot's own authority. Whether cross-sell is enabled depends on the specific client's Layer 3 config.

---

## 9. Known Gaps — Needs Manual Fill (not covered by desk research)

- **Manglish/BM jargon glossary** — same caveat as aircond: this file gives the concepts, not the actual words customers use ("choke," "bocor," "paip pecah," etc.) — needs to come from real WhatsApp logs / Phase 0 role-play.
- **Room-specific plumbing quirks for older vs newer landed/strata property** — not covered here; Malaysian housing stock varies a lot in pipe material/age, which affects how seriously to treat a "just started" leak.
- **Actual client pricing** — intentionally left as sanity-check ranges only; Layer 3 owns real numbers and is a hard blocker before the bot quotes anyone directly.
- **After-hours/emergency service availability** — the bot will get "do you have 24/7 service" regularly given how many rows in this file are emergency-tier. This isn't a Layer 2 knowledge gap — it needs an explicit yes/no field in each client's Layer 3 config, or the bot will either overpromise or stall on this question every time it comes up.
- **Emergency-row distinction is fragile if summarized later:** gas smell (do nothing, evacuate, don't touch switches) and burst pipe (shut the main valve immediately) are both "emergency" tier but need opposite first-action guidance. If this file gets condensed or the emergency rows get merged into one generic "emergency = call now" instruction during future edits, that distinction will be lost — flagging so whoever edits this next preserves it.
- **Low-intent/browsing message handling and room-dimension-style vague-answer follow-ups** — not really applicable to plumbing the way it was to aircond sizing, but worth checking once Phase 0 role-play data exists for this vertical specifically.
