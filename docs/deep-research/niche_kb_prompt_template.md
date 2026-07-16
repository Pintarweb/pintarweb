# Reusable Prompt Template — Niche Layer 2 Knowledge Base Builder

Distilled from building and stress-testing five KBs (aircond, plumbing, renovation, electrical, Pintarweb itself). Electrical was built with every lesson front-loaded and needed only one minor patch on stress test — this template is that same front-loading, made reusable.

**How to use this:** Copy the prompt block below, fill in the bracketed placeholders, and send it as a fresh message. It's written to be self-contained — it doesn't assume Claude remembers the other KBs, though if used in a conversation that already has this context, it'll build on it naturally.

---

## The Prompt

```
Build a Layer 2 knowledge base for the [NICHE] vertical, for a WhatsApp bot
serving Malaysian SME tradespeople (Klang Valley/Selangor focus unless
otherwise specified). This sits under Layer 1 (bot persona/behaviour) and
above Layer 3 (per-client config: actual pricing, service area, license
details, booking slots) — Layer 2 is general niche knowledge, not
client-specific facts.

Research first via web search:
1. Common customer problems/symptoms in this niche + how they're normally
   diagnosed and fixed, Malaysia-specific if possible
2. Malaysia market pricing ranges for common jobs in this niche
3. Any licensing/certification body relevant to this trade (e.g. CIDB for
   renovation, Suruhanjaya Tenaga for electrical) and what a legitimate
   provider is expected to have
4. Common scam/trust patterns specific to this niche, if the niche has
   above-average trust risk (e.g. high-value projects, upfront deposits)
5. DIY-safe vs professional-required boundary for this niche specifically
   — don't assume it's the same boundary as other niches

Then build the KB with this structure, adapting section names to fit the
niche but keeping the underlying logic:

1. Symptom/Request → Cause → Fix matrix — BUILT URGENCY-TIERED FROM THE
   START. Don't lump routine and dangerous versions of a similar-sounding
   symptom into one row (e.g. musty smell vs burning smell are NOT the same
   urgency, even though both are "a bad smell"). For each row, decide: is
   this DIY-safe, routine-book-a-visit, or emergency/no-DIY? If the niche
   has any safety-critical failure modes (fire, shock, gas, structural),
   those rows get emergency tier and explicit "don't let the customer's own
   minimization soften this" language — customers downplaying real danger
   is common and the bot shouldn't defer to their self-assessment.

2. Multi-symptom/multi-request rule — if 2+ issues are reported together,
   default to booking a visit rather than resolving each in chat. If any
   one of the combined issues is emergency-tier, the WHOLE message inherits
   that urgency, not just that one symptom.

3. Price reference ranges — ALWAYS framed as a sanity-check floor/ceiling,
   never a quote the bot can state as final. Explicitly instruct: real
   client pricing lives in Layer 3 and always overrides this table.

4. Licensing/trust section, if relevant — name the actual certifying body,
   and explicitly instruct the bot to provide real verification details
   (license number etc.) if asked, not just assert "yes we're licensed."
   Independent verifiability is the point, not reassurance theater.

5. DIY boundary — figure out fresh for this niche, don't assume it matches
   another niche's boundary. Some niches (electrical) should default much
   more cautious than others (aircond has more genuine DIY-safe steps).

6. Timeline/job duration reference, if relevant to the niche.

7. Emergency/after-hours handling, if the niche has genuine emergencies —
   explicitly flag "does this specific client offer 24/7 service" as a
   LAYER 3 fact, not something to assume either way.

8. Common upsell/related-job patterns worth surfacing as genuine diagnosis
   rather than a hard sell (e.g. "why does X keep happening" often traces
   to an underlying fixable cause worth mentioning).

9. Off-scope handling — distinguish TRUE off-scope (a fully different
   trade/service) from EXPECTED cross-trade overlap (work that's a normal
   part of this niche's typical job, like electrical points during a
   kitchen renovation). Also check: is there a scenario where the issue
   isn't even the client's job at all (e.g. a utility-side outage vs. an
   electrician's scope)?

10. Objection handling / FAQ — anticipate the specific pushback this niche
    gets (price comparison, "can I just DIY it," trust/legitimacy
    questions, "why does this cost so much"). If the niche has genuine
    fraud/trust risk (renovation-style), include a specific tone-guidance
    note for a prospect disclosing a PAST bad experience — that's a
    sequencing problem (acknowledge first, THEN reassure), not a knowledge
    problem, and generic trust content lands badly if it skips the
    acknowledgment.

11. Known gaps — end with an honest list of what desk research can't
    supply: the Manglish/BM jargon glossary (always flag this — it has to
    come from real client WhatsApp logs / Phase 0 role-play, never desk
    research), actual client-specific facts that block launch (pricing,
    license numbers, after-hours availability), and anything else
    genuinely undetermined rather than just unresearched.

Throughout: prices/facts are Malaysia market-level reference only. Every
"DO NOT quote directly" instruction should say WHY (Layer 3 owns real
numbers) not just assert the rule.
```

---

## Stress-Test Follow-Up Prompt (run after the KB is built)

```
Stress-test the [NICHE] KB with 10-13 realistic customer messages —
mix of BM/English/Manglish, the kind of messy phrasing real customers
actually use (not clean textbook phrasing). For each message:
- Map it to which part of the KB handles it
- Mark it ✅ (works), ⚠️ (partial gap — KB has the concept but something's
  missing, e.g. an elicitation question, a tone note, a scope boundary),
  or ❌ (real gap — genuinely not covered)
- Include at least one case testing whether urgency-tier rows correctly
  override customer self-minimization ("I got shocked but I think I'm
  fine" should still trigger emergency handling)
- Include at least one multi-symptom/combined-issue message
- Include at least one message that's ambiguous between this niche and
  an adjacent one (tests the off-scope/expected-overlap distinction)
- Include at least one edge case specific to whatever makes this niche
  different from the others already built (safety-critical niches need an
  urgency-override test; high-trust-risk niches need a scam-disclosure
  test; etc.)

End with a summary table (issue / severity / fix location) and ask before
patching — don't auto-patch without confirmation.
```

---

## Why This Template Looks the Way It Does (context, not part of the prompt itself)

A few decisions here came from real misses across the first four KBs, worth knowing if you ever want to adapt this template further:

- **Urgency-tiering from row one** — the aircond KB's first version lumped "musty smell" and "burning smell" into one row, which could have told someone to run fan mode when they should've been told to cut power immediately. Electrical (built with this lesson already applied) had zero urgency-related misses on stress test.
- **Customer self-minimization** — found during the electrical stress test: customers describing a genuine emergency (shock, sparking) often downplay it themselves ("takpe kot," "boleh guna sementara"). The KB has to be explicit that the bot shouldn't take the customer's own risk assessment at face value.
- **Elicitation questions, not just knowledge** — the plumbing KB's ceiling-leak row had all the right facts (landed vs. strata leads to completely different next steps) but no instruction to actually *ask* which one applies. The riskiest failure mode across every KB built so far hasn't been missing knowledge — it's missing the question that routes to the right branch of knowledge that's already there.
- **Past-bad-experience tone note** — found in renovation: a prospect disclosing they've already been scammed needs acknowledgment before reassurance, not instead of it. Same facts, different sequencing, completely different result.
- **Layer 3 dependencies flagged, not guessed** — pricing, license numbers, after-hours availability: the template should always flag these as blockers rather than inventing plausible-sounding placeholders.
