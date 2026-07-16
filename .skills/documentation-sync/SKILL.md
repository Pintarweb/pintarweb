# Documentation Sync Skill

**For:** PintarWeb monorepo — keeping docs consistent with code and business decisions.

**Activated when ANY of these triggers occur:**

| Trigger | Examples |
|---------|----------|
| Bot code changes | New intent, new FAQ answer, new reply flow, D1 schema change |
| Pricing/commercial | New price, new tier, new payment flow, discount changed |
| Outreach script changes | New message template, new objection handling, new CTA |
| Tech stack changes | New integration, new API, new service, new table |
| Client onboarding change | New step in setup, new requirement, new flow |
| Deployment change | New worker, new environment variable, new binding |
| Business decision | New policy, new feature, new offering |

---

## The Core Principle

**Docs are not an afterthought. They are part of the change.**

When code changes, the diff must include doc updates — or the change isn't complete.

> "If you wrote code but didn't update the docs, the work isn't done."

---

## The Documentation Map

Every change touches some combination of these docs:

| Doc | Scope | Source of Truth |
|-----|-------|----------------|
| `AGENTS.md` (root) | Global rules: pricing, language, key URLs, bot overview | **Current state** |
| `workers/whatsapp-bot/AGENTS.md` | Bot-specific: intents, LLM, menu flows, FAQ answers | **Current state** |
| `docs/whatsapp bot/pintarweb-whatsapp-bot-spec.md` | Bot spec: architecture, layers, escalation rules | **Architectural record** |
| `packages/site-generator/docs/business-plan/Pintarweb-Business-Plan-2026.md` | Master business document | **Planned state** |
| `docs/outreach/message-templates.md` | Primary outreach scripts | **Customer-facing** |
| `marketing/phase-2-cermin/outreach-scripts.md` | CERMIN-specific scripts | **Customer-facing** |
| `packages/site-generator/docs/outreach-playbook.md` | Outreach playbook | **Reference** |
| `docs/future-todo.md` | Pending items tracker | **Current work state** |
| `docs/plans/*.md` | Phase plans | **Planning** |
| `docs/adr/*.md` | Architecture Decision Records | **Immutable record** |

---

## Workflow

### Step 1 — Identify affected docs (BEFORE writing code)

Before making any change:

1. **Name the change** in one sentence
2. **List every doc** that mentions the thing you're changing
3. **Classify each doc**:
   - `UPDATE` — doc needs to be modified
   - `VERIFY` — doc mentions the topic but may not need change
   - `NEW` — a new doc needs to be created

Use `grep` to find all references to the thing you're changing.

### Step 2 — Update docs FIRST or ALONGSIDE code

The doc update and the code change are a **single unit of work**.

- If changing pricing → update AGENTS.md first, then code
- If adding a new intent → update bot AGENTS.md and spec first, then code
- If changing outreach → update templates first, then code

**Why first?** Because writing the doc forces you to think clearly about what the code should do.

### Step 3 — Commit together

Code and docs land in the **same commit or PR**.

Never:
- Commit code first, docs "in a follow-up"
- Update docs and leave the code unimplemented

### Step 4 — Verify consistency

After updating docs, check:

- [ ] No doc references the old value (e.g., RM447 instead of RM446)
- [ ] No doc contradicts another doc
- [ ] AGENTS.md and business plan agree on pricing/tiers
- [ ] Outreach templates and bot FAQ answers are aligned
- [ ] `future-todo.md` reflects any new pending items

---

## Doc Update Rules

### Pricing changes
- **Always** update `AGENTS.md` (root) first — this is the operational reference
- Verify `business-plan.md` matches
- Scan ALL outreach templates with `grep -r "RM"` for stale prices
- Update `future-todo.md` if billing system needs building

### Bot architecture changes
- Update `workers/whatsapp-bot/AGENTS.md` — this is the code's operating context
- Update `pintarweb-whatsapp-bot-spec.md` — this is the architectural record
- Create an ADR in `docs/adr/` if the change affects data model or integrations

### Outreach script changes
- Update ALL template files — don't update one and forget the others
- Common places: `docs/outreach/`, `marketing/phase-2-cermin/`, `packages/site-generator/docs/`
- Verify consistency across all three

### New feature / pending item
- Add to `docs/future-todo.md` under the right section
- Don't leave it only in your head or a Slack message

---

## ADR Creation Rule

When making any architectural decision (new table, new integration, new flow), create an ADR:

```
docs/adr/XXX-short-title.md
```

Format:
```markdown
# ADR XXX: Title

## Status
Accepted

## Context
What problem are we solving?

## Decision
What are we doing?

## Consequences
What changes because of this?
```

ADRs are **immutable records** — never delete or overwrite them. Mark superseded ones as `Superseded by ADR XXX`.

---

## Quick Audit Commands

Run these before claiming a change is complete:

```bash
# Check for stale RM references across docs
grep -rn "RM447\|RM299\|RM800 anchor" --include="*.md" .

# Check AGENTS.md and bot spec agree on intent count
grep -n "intent" workers/whatsapp-bot/AGENTS.md
grep -n "intent" docs/whatsapp\ bot/pintarweb-whatsapp-bot-spec.md

# Check all outreach templates have consistent pricing
grep -rn "RM" docs/outreach/message-templates.md
grep -rn "RM" marketing/phase-2-cermin/outreach-scripts.md
grep -rn "RM" packages/site-generator/docs/outreach-playbook.md
```

---

## Single Source of Truth Table

| Category | Source of Truth |
|----------|----------------|
| Pricing (current) | `AGENTS.md` (root) |
| Pricing (planned) | `business-plan.md` |
| Bot spec | `pintarweb-whatsapp-bot-spec.md` |
| Bot code context | `workers/whatsapp-bot/AGENTS.md` |
| Outreach scripts | `docs/outreach/message-templates.md` (primary) |
| Pending work | `docs/future-todo.md` |
| Architecture decisions | `docs/adr/` |

When in doubt, AGENTS.md wins for current state. Business plan wins for planned state.

---

## Activation Checklist

- [ ] Change identified and named
- [ ] All affected docs listed (UPDATE / VERIFY / NEW)
- [ ] Docs updated BEFORE or ALONGSIDE code
- [ ] Code and docs committed together
- [ ] Consistency audit run (grep for stale references)
- [ ] `future-todo.md` updated if needed
- [ ] ADR created if architectural change
