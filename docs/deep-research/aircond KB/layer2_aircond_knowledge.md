# Layer 2 Knowledge Base — Aircond Servicing (Malaysia)

**Purpose:** General niche knowledge for the aircond vertical, to sit under Layer 1 (bot behaviour/persona) and above Layer 3 (per-client config: actual pricing, service area, booking slots, technician name).

**Status:** Draft v1, compiled from public Malaysian aircond-service industry sources (KL/Selangor-focused). Prices are **market reference ranges only** — must be validated/overridden by each client's actual rate card in Layer 3 before the bot quotes anything. Do not let the bot state a firm price from this file; use it to sanity-check what the client tells you and to answer general questions when no client-specific price exists yet.

---

## 1. Symptom → Cause → Fix Matrix

Use this to let the bot triage before deciding: (a) answer directly with a simple DIY tip, (b) flag as needing a technician visit, or (c) flag as urgent/safety issue.

| Symptom | Likely Cause(s) | DIY Check (customer can try) | When to Escalate to Technician |
|---|---|---|---|
| Not cold / weak cooling | Dirty filter, low refrigerant, dirty coil, faulty compressor, wrong mode/thermostat | Clean filter, confirm mode is COOL, check remote batteries | If cleaning filter doesn't help within a day, or unit is old/never serviced |
| Water leaking from indoor unit | Clogged drain pipe (algae/dust buildup), dirty filter causing coil to freeze then drip | Pour warm water down external drain outlet to clear minor clog | Leak persists after DIY attempt, stains on wall/ceiling appearing |
| Bad/musty/mouldy smell ("bau busuk," "bau apak," "bau lampin") | Mould, bacteria, trapped dirt inside unit (very common in MY humidity) | Run Fan mode occasionally, wash filter | Strong/persistent smell → needs deep/chemical clean |
| Burning/scorched smell ("bau hangit," "bau terbakar") | Electrical fault, overheating component, wiring issue — **not the same as musty smell, do not treat as routine** | None — do not attempt any fix | **Urgent, same tier as power tripping below: switch off unit at the socket immediately, do not turn back on, call technician/electrician right away** |
| Unusual noise (rattling, buzzing, grinding, clanking) | Loose screws, damaged fan blades, failing motor, debris, compressor mounting issue | Basic visual check, tighten visible loose parts only | Any grinding/banging — stop use, call technician, do not DIY |
| Power tripping when aircond runs | Electrical overload, faulty wiring, capacitor failure, compressor issue | None — do not repeatedly reset the fuse | Immediate — turn off unit, call technician/electrician |
| Ice/frost forming on unit or pipes | Restricted airflow, very dirty coil, low refrigerant, temp set too low continuously | Turn off, let ice melt fully before restarting | If frost recurs after melting — professional diagnosis needed |
| Outdoor unit overheating / fan not spinning | Clogged condenser fins, blocked airflow, faulty fan motor | Power off, gently clear debris/wash fins | If fan still doesn't spin after clearing debris |
| Sudden spike in electricity bill, no usage change | Ageing unit, low refrigerant (compressor overworking), dirty coils/filters | Clean filters, check outdoor unit has airflow clearance | Unit >10 years old — may just be inefficient; consider replace vs repair |
| Not cold even right after a paid service | Service ≠ automatic gas top-up; could be low gas, dirty coil, capacitor, compressor issue that a normal clean doesn't fix; wrong-size unit for the room; poor room insulation/heat load | Check doors/windows closed, confirm HP matches room size | Always — this needs a technician to diagnose scope (normal service ≠ repair) |
| Remote unresponsive | Dead batteries, wrong mode set | Replace batteries, try manual buttons on the unit itself | If manual buttons also fail |

**Bot behaviour note:** For anything involving electrical tripping, burning/scorched smell, or wiring, the bot should never suggest a DIY electrical fix — flag as urgent and push to booking a technician immediately. Do not let "bau hangit" (burning) get matched to the same response path as "bau busuk/apak" (musty) — they require opposite urgency levels.

**Multi-symptom rule:** If a customer reports two or more symptoms in the same message (e.g. "not cold AND noisy," "leaking AND smell"), do not attempt to resolve each individually in chat. Default to booking a technician visit — combined symptoms are more likely to indicate a deeper underlying issue than any single symptom alone, and diagnosing multiple issues over chat risks giving conflicting or wrong DIY advice.

---

## 2. Servicing Types — What They Actually Are

- **Standard/Normal Service:** Routine maintenance — filter cleaning, surface coil clean, drain pipe flushing, basic outdoor check, test run. Does **not** include gas top-up by default.
- **Chemical Wash / Deep Clean:** For deeper buildup — mould inside coils, bacteria in drainage, grime normal service can't reach. Recommended when there's persistent smell, weak airflow despite cleaning, recurring drainage issues, or unit hasn't been serviced in a long time. Typically recommended every 12–18 months, or sooner for heavy-use homes.
- **Gas top-up:** Only needed if there's an actual leak or confirmed low refrigerant — not a routine inclusion. A technician should diagnose before quoting this.

**Recommended servicing frequency (general rule of thumb, MY conditions):**
- Daily/nightly use (bedrooms): every 3–4 months
- General household use: every 6 months (2–3x/year)
- Offices, heavy use, dusty/roadside/construction-adjacent areas: every 2–3 months, sometimes monthly
- Trigger-based: musty smell, weak airflow, or dripping earlier than schedule = service sooner regardless of calendar

---

## 3. Sizing (HP) Reference — for bots handling installation/new-unit enquiries

Rule of thumb used by MY contractors: **Room area (sq ft) × 60 BTU = cooling capacity needed**, then divide by 9,000 to get approximate HP. (1.0 HP ≈ 9,000 BTU, 1.5 HP ≈ 12,000–13,500 BTU, 2.0 HP ≈ 18,000 BTU, 2.5 HP ≈ 24,000 BTU — exact BTU varies by brand/model.)

| Room size (sq ft) | Typical HP |
|---|---|
| 100–150 | 1.0 HP |
| 150–200 | 1.5 HP |
| 200–300 | 2.0 HP |
| 300–400 | 2.5 HP |

**Adjustments (go up one HP size if):**
- Room is west-facing / gets strong afternoon sun (single biggest cause of "not cold enough" complaints in MY)
- Ceiling higher than standard 9–10 ft (add ~10% BTU per extra foot)
- Large glass windows/sliding doors, open-plan layout connecting to other rooms
- Top floor under an uninsulated roof

**Inverter vs non-inverter:** Recommend inverter for any room used regularly (bedroom, living room, study) — runs 30–50% more efficient over time despite higher upfront cost. Non-inverter acceptable only for occasional-use spaces (store room, rarely-used guest room).

---

## 4. Price Reference Ranges (Market-Level — DO NOT quote directly, cross-check against client's Layer 3 rate card)

| Service | Typical Range (RM) | Notes |
|---|---|---|
| Basic/normal servicing (residential, per unit) | 70–150 | Varies by HP and condition |
| Chemical wash (residential) | 200–400 | Commercial units may run higher |
| Office/commercial servicing (per unit) | 120–200 | Chemical wash 200–400 |
| Installation labour (1.0–1.5HP wall-mount, standard piping) | 250–350 | Extra piping/distance adds cost |
| New power point (if needed) | 100–150 | Older homes may lack dedicated point |
| Unit + install, 1.5HP inverter (mid brand) | ~2,050–2,650 all-in | Budget brands lower, premium (Daikin/Mitsubishi) higher |

This is aggregated from multiple KL/Selangor providers as of early-mid 2026 — treat as a **sanity-check floor/ceiling**, not a quote. Actual client pricing always takes precedence.

---

## 5. Repair vs Replace Guidance (useful for bot to relay, not decide)

General signals favouring **replace over repair**:
- Unit is 8–10+ years old and needs a major component (e.g. compressor)
- Repair cost approaches a large % of a new unit's price (rough rule some technicians use: if repair > ~40-50% of replacement cost, lean replace)
- Recurring breakdowns despite regular servicing

Signals favouring **repair**:
- Unit is young (under ~5 years), fault is minor/isolated, repair cost is a small fraction of replacement cost

The bot should relay these as general considerations and always recommend an actual technician assessment for a firm decision — never state a repair/replace verdict on its own.

---

## 6. Consumer Trust / Objection-Handling Signals

Things customers commonly ask or worry about — useful for the bot to proactively address in a qualification conversation:

- "Will you upsell me a chemical wash I don't need?" → Be ready to explain the difference and that chemical wash is condition-based, not automatic.
- "How do I know the job was done properly?" → Reasonable asks: what was cleaned (filter/coil/drain/blower), whether drain was flushed, a quick before/after look or photo, a test run at the end.
- "Is gas top-up going to be forced on me?" → No, only diagnosed leaks/low refrigerant need this.
- "Why did service happen but it's still not cold?" → Normal service ≠ repair; could be a separate issue (gas, capacitor, compressor, or room heat load/wrong sizing).
- "Confirm no hidden/extra charges last minute?" → Reasonable ask, especially common in skeptical/Manglish-toned messages ("jangan main2 charge extra"). Bot should reassure that any extra scope (e.g. gas top-up, extra piping) is diagnosed and confirmed with the customer before being charged — never silently added to the bill. This should tie to whatever actual quote-confirmation process the client uses (Layer 3).

---

## 7. Legal/Compliance Notes (Malaysia-specific)

- Handling refrigerant and electrical wiring without proper licensing/certification is not legal (Electricity Supply Act 1990 / CIDB regulations context) — reinforces why DIY beyond filter cleaning isn't advisable, and is a trust point to mention if asked "can I just fix it myself."
- For strata/condo customers with leak disputes between units, note there's a legal framework (Strata Management Act) around presumption of leak source — outside pure aircond scope but may come up in mixed plumbing/aircond conversations for the same client base.

---

## 8. Off-Scope Handling (Cross-Trade Enquiries)

Customers of a single-trade client (e.g. aircond-only) will sometimes mention an unrelated issue in the same message (e.g. a plumbing leak, electrical work) and ask if the same visit can cover it. This KB does not attempt to answer cross-trade questions. The bot should:
1. Acknowledge the off-scope item without diagnosing it
2. Confirm what is and isn't covered by this client's service
3. Note the off-scope item down for the technician/client to decide on manually, rather than the bot promising or refusing on their behalf

The exact wording/policy here depends on whether a given client (e.g. one also doing plumbing) wants cross-sell enabled — this is a Layer 3 config decision per client, not a fixed rule.

## 9. Known Gaps — Needs Manual Fill (not covered by desk research)

- **Manglish/BM jargon glossary** — must come from actual client WhatsApp logs / Phase 0 role-play, not desk research. This file gives you the *concepts*; the *words customers actually use* (e.g. how they describe "not cold," "bocor," "bunyi pelik") should be captured separately per your existing niche prompt convention. Confirmed by stress test: several real symptom words ("hangit," "menitik," "apak") only work if the matching/NLU layer recognizes them — this file supplies the correct branch logic, not the vocabulary detection itself.
- **Room-dimension elicitation script** — when a customer gives a vague answer like "bilik kecil je" for a sizing/installation question, the bot needs a natural follow-up question flow to extract actual dimensions. This is a conversation-design item for Layer 1/3, not a knowledge gap.
- **Low-intent/browsing message handling** — not every message needs full troubleshooting triage; a "just checking prices" message should get a light-touch response, not the diagnostic matrix. Layer 1/3 conversation flow item.
- **Specific brand service quirks** (e.g. Daikin vs Panasonic error codes) — not included here; add if a client's install base skews toward one brand.
- **Actual client pricing** — this file is intentionally price-agnostic beyond sanity-check ranges; Layer 3 owns real numbers, and is a hard blocker for any direct price-quote conversation going live.
