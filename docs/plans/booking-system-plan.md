# PintarWeb Booking System — Implementation Plan

**Updated:** 2026-08-03 | **Gatekeeper-reviewed**

## Architecture Overview

```
WhatsApp → BOOKING_REQUEST intent → bot sends booking link (wa.me style)
         → Customer opens link → standalone booking form (WhatsApp webview compatible)
         → Form submits → POST /api/booking
         → D1 insert → R2 image upload → Google Calendar (if OAuth connected) → WhatsApp notification to owner
         → Owner gets manage link (HMAC-signed) → reschedule/cancel via PATCH endpoints
```

**Rule:** No auto-confirm. The original spec says "does not auto-confirm bookings without the owner's sign-off." We follow that. Bot does NOT confirm bookings — it sends a booking link. Owner confirms manually after getting notification.

---

## Schema (Migration 002)

```sql
-- migrations/002_booking_system.sql

CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    booking_date TEXT NOT NULL,         -- YYYY-MM-DD
    booking_slot TEXT NOT NULL,         -- e.g. "9:00 AM"
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    note TEXT,
    status TEXT DEFAULT 'pending',       -- 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'no_show'
    image_urls TEXT,                     -- JSON array of R2 URLs
    emergency_surcharge INTEGER DEFAULT 0,
    emergency_surcharge_accepted_at TEXT,
    google_event_id TEXT,               -- Google Calendar event ID (NULL if OAuth not connected)
    manage_token TEXT,                  -- HMAC token for self-service manage links
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE UNIQUE INDEX idx_bookings_slot_unique ON bookings(client_id, booking_date, booking_slot)
    WHERE status NOT IN ('cancelled', 'no_show');

CREATE TABLE google_tokens (
    client_id TEXT PRIMARY KEY REFERENCES clients(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_expiry TEXT NOT NULL,          -- ISO datetime
    google_calendar_id TEXT,            -- 'primary' or specific calendar ID
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
```

**Key constraints:**
- `idx_bookings_slot_unique` is a partial index — only enforces uniqueness on active bookings (not cancelled/no_show). This prevents double-booking without blocking reschedule history.
- `google_tokens.client_id` has FK to `clients(id)` per gatekeeper requirement.

### Feature Toggle

Insert into existing `client_features` table:
```sql
INSERT INTO client_features (id, client_id, feature, enabled, value, created_at, updated_at)
VALUES (
    '00000000-0000-4000-a000-000000000010',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- PintarWeb client
    'booking',
    1,
    NULL,
    datetime('now'),
    datetime('now')
);
```

---

## Endpoints

### `GET /booking`
Standalone booking form page. WhatsApp webview compatible. BM only (BM/EN toggle added in Phase 2 template work).

**Query params:** `token` (base64), `company`

**Token format:** `{customerPhone}|{timestamp}|{hmacSig}` (URL-safe base64)

**Token validation:**
- Decode base64 → split by `|`
- Verify HMAC signature against `BOOKING_SECRET` env var
- Check expiry: `Date.now() - timestamp < 60 * 60 * 1000` (60 min)
- If expired: show friendly "Link expired" page with option to go back to WhatsApp

**Form fields:**
- Date (min: today, up to 30 days out)
- Slot (dropdown: 9am, 10am, 11am, 2pm, 3pm, 4pm)
- Name (pre-filled from WhatsApp profile if available)
- Note (optional)
- Photo upload (optional, up to 3 images)
- Emergency/urgent checkbox → triggers modal with surcharge disclosure

**Emergency flow:**
1. Checkbox: "Saya nak urgent (kurang 24 jam) — ada surcharge RM30"
2. On check: modal appears with surcharge terms, scroll-to-bottom required
3. Confirm button only activates after scroll
4. On submit: `emergency_surcharge = 1`, `emergency_surcharge_accepted_at` stored as audit trail

**Submit:**
- POST to `/api/booking` as multipart/form-data (images + JSON fields)

### `POST /api/booking`
**Content-Type:** `multipart/form-data`

**Process flow (to avoid race conditions):**

```
1. Validate token (same as GET /booking)
2. Validate slot availability:
   SELECT 1 FROM bookings
   WHERE client_id = ? AND booking_date = ? AND booking_slot = ?
   AND status NOT IN ('cancelled', 'no_show')
   → If exists: return 409 "Slot taken"
3. Insert booking with status = 'uploading':
   INSERT INTO bookings (...) VALUES (...)
   → Get booking.id back
4. Upload images to R2: bookings/{clientId}/{bookingId}/img-0.webp, etc.
   → Store URLs in image_urls JSON array
5. Update booking:
   UPDATE bookings SET image_urls = ?, status = 'pending' WHERE id = ?
6. If Google OAuth connected:
   - Create calendar event
   - Update google_event_id
   (Fail gracefully if Google push fails — log, don't rollback)
7. Send WhatsApp notification to owner
8. Return { success: true, bookingId, manageUrl }
```

**Why this order:** Generate booking ID first (step 3) so R2 paths can use it. No chicken-and-egg problem.

### `GET /booking/manage`
Self-service page for customer to view/reschedule/cancel their booking.

**Query params:** `id`, `token` (HMAC)

**Token validation:** Same HMAC verify against `BOOKING_SECRET`

**Shows:** Booking details, Reschedule button, Cancel button

### `PATCH /api/booking/:id/reschedule`
**Body:** `{ booking_date, booking_slot }`

**Validations:**
- Slot availability check (same UNIQUE constraint)
- Only `pending` bookings can be rescheduled
- Can only reschedule to future dates

**Updates:** booking_date, booking_slot, status = 'rescheduled', updated_at. Updates Google Calendar event if connected.

### `PATCH /api/booking/:id/cancel`
**Body:** `{ reason }` (optional)

**Validations:**
- Only `pending` bookings can be cancelled

**Updates:** status = 'cancelled', updated_at. Deletes Google Calendar event if connected. Notifies owner via WhatsApp.

---

## Booking Link Generation (Bug Fix)

### Problem (Gatekeeper Finding)
`generateBookingLink(customerPhone, companyName)` is called from `handleIntent()` but `handleIntent()` only has `customerName` and `businessName` — NOT `customerPhone`. Currently passes `customerName` (a human name) where a phone number is expected.

### Fix
Move booking link generation OUT of `handleIntent()` and INTO `handleIncomingMessage()`. The caller has direct access to `customerPhone`.

**In `handleIntent()`:**
```ts
case 'BOOKING_REQUEST':
  return '__BOOKING_LINK_PLACEHOLDER__'; // Will be replaced by caller
```

**In `handleIncomingMessage()`:**
```ts
let reply = handleIntent(intent, customerName, companyName);
if (intent === 'BOOKING_REQUEST') {
  const bookingLink = generateBookingLink(customerPhone, companyName);
  reply = reply.replace('__BOOKING_LINK_PLACEHOLDER__', bookingLink);
}
```

### HMAC Token Generation
Replace simple `btoa()` with HMAC:
```ts
async function generateBookingToken(customerPhone: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const payload = `${customerPhone}|${Date.now()}`;
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return btoa(`${payload}|${sigB64}`);
}
```

### Manage Token
Same HMAC approach: `{bookingId}|{timestamp}|{hmacSig}`. Verify in `/booking/manage` and PATCH endpoints. Add 24h expiry for manage tokens (these are shareable URLs, unlike booking links which are one-time use).

---

## R2 Storage

**Bucket:** `pintarweb-client-images` (existing — same as scraper intake form)

**Prefix:** `bookings/{clientId}/{bookingId}/`

**No collision risk:** Existing scraper paths use `{leadId}/` prefix. Booking paths use `bookings/{clientId}/{bookingId}/` prefix. Completely separate namespaces.

**Image limits:** Max 3 images, max 5MB each, JPEG/PNG/WebP only. Validate MIME type server-side on upload.

---

## WhatsApp Notification to Owner

After booking submitted:
```
🔔 BOOKING BARU — {customerName}

📅 Tarikh: {date}
⏰ Slot: {slot}
📞 Nombor: {customerPhone}
💬 Nota: {note}
⚠️ Urgent: {yes/no + surcharge if applicable}

Urus: {manageUrl}
```

---

## Google OAuth2 Flow (P1 — not blocking MVP)

### Admin Setup
1. Owner visits admin dashboard → "Connect Google Calendar" button
2. Redirect to `https://accounts.google.com/o/oauth2/v2/auth?...`
3. Callback at `GET /oauth/google/callback` — stores tokens in `google_tokens` table
4. Token refresh: before each calendar API call, check `token_expiry`. If expired, refresh via `https://oauth2.googleapis.com/token`

### Calendar Events
- Create: `POST https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events`
- Update: `PATCH` same endpoint with event ID
- Delete: `DELETE` same endpoint

### Env Vars Needed
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` → `https://pintarweb-whatsapp-bot.yusmarin.workers.dev/oauth/google/callback`

---

## Bilingual (BM/EN) — Phase 2

Gatekeeper identified this gap. Worker-hosted booking page (`GET /booking`) stays BM-only initially (WhatsApp flow is primarily Malaysian). When booking form becomes a site-generator template (`booking.html`), it MUST have `data-bm`/`data-en` + language toggle per site-generator rules.

---

## Implementation Checklist

### Phase 0: Bug Fixes (P0)
- [ ] **Fix BOOKING_REQUEST intent** — move link generation to `handleIncomingMessage()`, pass actual `customerPhone`
- [ ] **Upgrade token to HMAC** — replace `btoa()` with `crypto.subtle` HMAC-SHA256
- [ ] **Add `BOOKING_SECRET`** to wrangler.toml + `wrangler secret put BOOKING_SECRET`

### Phase 1: Core Booking (P0)
- [ ] Create `migrations/002_booking_system.sql` — `bookings` + `google_tokens` tables with FK constraints
- [ ] Insert `client_features` toggle for PintarWeb client
- [ ] Build `POST /api/booking` — multipart form-data handler, D1 insert, R2 upload, slot validation
- [ ] Build `GET /booking/manage` — self-service manage page
- [ ] Build `PATCH /api/booking/:id/reschedule` — with slot availability check
- [ ] Build `PATCH /api/booking/:id/cancel` — with owner notification
- [ ] Rebuild `GET /booking` form — emergency modal, photo upload, improved styling
- [ ] Owner WhatsApp notification after booking submit
- [ ] Run migration against D1 (`npx wrangler d1 execute pintarweb-claude-db --remote --file=migrations/002_booking_system.sql`)

### Phase 2: Google Calendar (P1)
- [ ] Build `GET /oauth/google/callback` — token exchange + storage
- [ ] Build admin API endpoints (`/admin/api/google/connect`, `/admin/api/google/status`)
- [ ] Token refresh logic in calendar event helpers
- [ ] Admin dashboard: Connect button + booking list view
- [ ] Calendar event CRUD integrated into booking flow

### Phase 3: Site Generator Integration (P2)
- [ ] Create `components/forms/booking-form.html` with `data-bm`/`data-en`
- [ ] Create `booking.html` site template
- [ ] Add language toggle script (reads `localStorage.pw_lang`)
- [ ] Wire into `scripts/build-client.sh` for CSS purging

### Phase 4: TypeScript Compilation
- [ ] Run `npx tsc --noEmit` in `workers/whatsapp-bot/`
- [ ] Fix any type errors from new code

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| Double-booking race | Partial UNIQUE index on (client_id, date, slot) excluding cancelled |
| Image upload fails mid-booking | Insert booking first (status='uploading'), update after upload success |
| Google Calendar push fails | Log error, don't rollback. Owner gets WhatsApp notification anyway |
| Booking link shared/abused | 60-min expiry on booking links, 24h on manage links |
| Emergency surcharge disputed | Store `emergency_surcharge_accepted_at` timestamp + scroll-to-bottom modal |