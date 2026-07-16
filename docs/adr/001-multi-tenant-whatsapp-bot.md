# ADR 001: Multi-Tenant WhatsApp Bot Architecture

## Status
Accepted

## Date
2026-07-12

## Context

PintarWeb is evolving from a single-client bot (serving PintarWeb's own demo/inbound inquiries) to a multi-tenant platform where each client business gets their own WhatsApp bot. The current architecture uses `waba_id` as the primary tenant key throughout — embedded directly in every table and query. This was fine for a single WABA but creates problems at scale:

- `waba_id` is an **external Meta identifier** — making it the primary business key means our data model is coupled to a third-party ID
- Adding Instagram Messenger, Telegram, or web chat later would require renaming `waba_id` columns everywhere
- A single client with multiple WhatsApp numbers (e.g., separate numbers for aircond vs plumbing divisions) would need multiple client records
- Migrating to a different messaging channel = renaming every table column

The question was: how should we restructure for multi-tenancy without over-engineering a product that isn't launched yet?

---

## Decisions

### 1. `client_id` (UUID) as Primary Tenant Key

Every table that is per-client uses `client_id` as the tenant key.

`waba_id` is treated as an **external integration identifier**, not a business key.

```
clients
    │
    ├── whatsapp_bot_config
    ├── conversations
    ├── faq
    ├── kb
    ├── appointments
    ├── contacts
    └── analytics
```

Every table scoped to a tenant uses `client_id` (UUID).

### 2. `waba_accounts` Mapping Table

```
waba_accounts
    id (PK)
    client_id (FK → clients)
    waba_id (Meta's WABA ID — external)
    phone_number_id (Meta's phone number ID — external)
    phone_number (human-readable, e.g. +60121111111)
    access_token (Meta long-lived token)
    business_account_id (Meta business account ID)
```

This allows:
- One client, many WhatsApp numbers (multiple departments/divisions)
- Phone number changes without touching any other table
- Future channels (Instagram, Messenger) plug into the same `client_id` without schema changes

### 3. Shared Webhook Verify Token

Only one `META_WEBHOOK_VERIFY_TOKEN` is needed globally. HMAC signature validation handles request authenticity per-message. No security benefit to storing per-client verify tokens.

### 4. Knowledge Base with `knowledge_scope`

KB entries support two scopes:

```
knowledge_scope = 'shared'    — shared across all WABAs of a client
knowledge_scope = 'department' — specific to one WABA/phone number
```

This allows:
- Small clients (one number): everything shared
- Large clients (multiple divisions): each division can have tailored KB

### 5. Feature Flags Table

```
client_features
    client_id (FK)
    feature (TEXT)
    enabled (BOOLEAN)
```

Subscription tiers are NOT hardcoded in logic. Features are toggled per-client via this table. New features can be enabled without code changes or deployments.

### 6. Single Multi-Tenant Worker

One Worker handles all clients. `phone_number_id` from incoming webhook payload is used to:
1. Look up `waba_accounts` row
2. Resolve `client_id`
3. Load full tenant context
4. Pass `tenantContext` to all downstream logic

No forks, no per-client deployments.

---

## Consequences

### Positive
- Schema is channel-agnostic — adding Instagram/Messenger/Telegram later doesn't require renaming columns
- One client can have multiple phone numbers under one subscription
- KB can be shared or per-department
- Feature flags make tier management ops-friendly
- External IDs (Meta) are isolated to one mapping table

### Negative
- Every D1 query must be refactored to use `client_id` instead of `waba_id`
- Existing PintarWeb bot data must be migrated into new schema
- `sendWhatsAppMessage()` must look up per-client access tokens at runtime
- Single point of failure — one Worker handles all clients

### Implementation Notes (2026-07-13)

Bot worker refactored from 1 monolithic file (~1747 lines) into 5 modules:

| File | Lines | Responsibility |
|---|---|---|
| `src/index.ts` | ~66 | Entry point, webhook handler, route dispatcher |
| `src/types.ts` | ~172 | All interfaces, Intent type, PINTARWEB_FAQ, SUGGESTION_MAP, answer constants |
| `src/kb.ts` | ~232 | `resolveTenantContext`, `sendWhatsAppMessage`, `notifyOwner`, `storeMessage`, `getConversationHistory` |
| `src/bot-logic.ts` | ~357 | `classifyIntent`, `handleIntent`, `callClaude`, `callWorkersAI`, `handleIncomingMessage` |
| `src/admin-api.ts` | ~336 | All admin REST routes + `handleNiches` endpoint |

Admin dashboard refactored from 1 file (~1235 lines) into 7 files (~1012 lines): index.html, api.js, layout.js, modals.js, dashboard.js, client-detail.js, kb.js, kb-editor.js.

`phone_number_id` from incoming webhook payload is used to resolve `client_id` via `waba_accounts` table → full `TenantContext` loaded → passed to all downstream logic.

### Migration Required
- Existing D1 tables need `client_id` column added as FK
- Existing PintarWeb bot becomes Client #1 (uuid: `pintarweb`)
- All queries refactored to `WHERE client_id = ?`

---

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Keep `waba_id` as primary key | External ID coupling; adding channels requires renaming every table |
| Separate Worker per client | Operational overhead; harder to manage at scale |
| Per-client verify tokens | No security benefit; adds management burden |
| Hardcoded subscription tiers in logic | Feature flags + tiers needed for flexible tier management |
