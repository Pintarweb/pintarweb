#
 Phase 3: Pilot — Revenue Validation

## Overview

Phase 3 validates the entire pipeline with **real paying prospects**. By the end, you'll have run 5-10 pilots, collected setup fees, and established a repeatable billing workflow for month 4+ subscriptions.

**Duration:** Weeks 1-4 (execution) + Months 1-4 (billing cycle)
**Cost:** RM 0 (free pilots)
**Success Criteria:** 5-10 pilots launched, 3-5 subscription conversions, SOPs documented

---

## Pilot Pricing

### Payment Breakdown

| Tier | Setup Fee | Month 1 | Total Initial | Months 2-3 | Month 4+ |
|------|-----------|---------|---------------|-------------|----------|
| **Pilot** (first 5-10) | RM297 | RM149 | **RM446** | 1 month FREE | RM149/mo |

> **Setup fee = RM297敬业费** — shows client's serious commitment. Setup (RM297) paid upfront to start build. Month 1 (RM149) paid on delivery day to activate.
> **Pilot discount is private** — told to selected clients. Not publicly advertised.
> **Regular pricing** (after pilot): RM297 setup + RM149/month standard.

### Payment Flow

```
Month 0: Customer pays RM297 (setup fee) → Maybank transfer → build starts
Week 4 (Delivery Day): Customer pays RM149 (activation) → bot transferred, 1 month FREE bonus unlocked
Month 4+: Razorpay subscription auto-charges RM149/mo (consent obtained at activation)
```

### Cancellation Policy

- If cancelled before month 4: **PintarWeb retains full setup fee + month 1 payment**
- No refund of setup fee
- Subscription can be cancelled with 14 days notice (handled by Razorpay)

### Renewal Options (Month 4+)

| Plan | Price | Savings |
|------|-------|---------|
| Monthly | RM149/mo | — |
| Quarterly | RM417/3mo | Save RM30 |
| Bi-annual | RM774/6mo | Save RM120 |
| Annual | RM1,308/yr | Save RM480 |

Default: Monthly if no choice made.

---

## Invoice Numbering

Format: `PWT2026-001`, `PWT2026-002`, etc. (year embedded)

---

## Pilot Success Metrics

| Metric | Target |
|--------|--------|
| Pilots launched | 5-10 |
| Response rate | 20-30% |
| Close rate (of responses) | 50-70% |
| Pilots reaching month 4 | 3-5 |
| Subscription conversions | 3-5 |
| Re-engaged cancellations | 0.5 each (2 = 1 success) |

**Success formula:**
- 1 converted pilot = 1.0 success
- 2 cancelled-then-reengaged = 1.0 success (0.5 + 0.5)
- **Target: 3-5 total success clients by month 4**

---

## Pre-Pilot Setup (Week 1)

### 1.1 D1 Schema Update

Run the migration script to add Phase 3 billing fields:

```bash
bash scripts/migrate-outreach-db.sh
```

This adds: `setup_paid`, `setup_paid_date`, `setup_amount`, `invoice_number`, `plan_type`, `subscription_id`, `subscription_start`, `subscription_status`, `billing_reminder_sent`, `billing_reminder_date`, `customer_email`.

---

### 1.2 Razorpay Subscription Plans

Run the plan creation script to create 4 Razorpay plans:

```bash
bash scripts/create-razorpay-plans.sh
```

Then add the returned plan IDs to `.env`:

```
RAZORPAY_PLAN_MONTHLY=plan_xxxxxxxxxxxxx
RAZORPAY_PLAN_QUARTERLY=plan_yyyyyyyyyyyyy
RAZORPAY_PLAN_BIANNUAL=plan_zzzzzzzzzzzzz
RAZORPAY_PLAN_ANNUAL=plan_wwwwwwwwwwwww
```

### 1.3 Invoice System

**Invoice format:** PWT2026-001, PWT2026-002...

**Invoice contents:**
- PintarWeb logo + business details
- Invoice number, date
- Customer name, business name
- Line items: "Setup Fee + Month 1" or "Pilot Setup Fee"
- Amount paid
- PintarWeb bank details (for DuitNow reference)
- Terms: "14-day cancellation policy"

**Delivery:**
- PDF invoice via email (Resend API)
- Formatted receipt via WhatsApp

---

### 1.4 Resend Email Setup

**API Key:** `re_Bdr4pYp6_NLyTcU2939WUy6WsnMwHjFC9`
**Domain:** `mail.pintarweb.com`

Test by sending a simple email to verify delivery.

---

### 1.5 WhatsApp Auto-Reply Bot

**What it does:** Acts as a 24/7 receptionist for pilot clients — instantly acknowledges incoming WhatsApp messages, answers FAQ (pricing, service areas, availability) using AI, and forwards warm leads to the owner via WhatsApp or Telegram.

**Core problems it solves for contractors:**
- Lead loss: Customer messages while owner is on a job, bot replies instantly, no lost lead
- Admin fatigue: Bot answers "How much?" and "Do you cover area X?" — owner only handles qualified leads
- Professionalism: Responds in seconds, not hours
- No time for admin: Bot handles first response, owner manages when free

**Architecture:**
- Meta WhatsApp Cloud API (webhook) → Cloudflare Workers → Kimi AI (for contextual replies)
- Per-client config stored in D1 (business name, services, pricing, areas, owner number)
- Owner notification: WhatsApp (default) or Telegram (if client prefers)

**Bot behavior:**
1. Customer sends WhatsApp message → Meta Cloud API receives it
2. If within 24-hour conversation window → Kimi AI generates contextual reply
3. If outside window → Send approved utility template to re-engage
4. Lead captured (name + phone + service) → notify owner via WhatsApp or Telegram

**Meta 24-hour window constraint:** Meta allows free-form conversational replies only within 24 hours of customer's last message. Design around this: maximize lead capture during active window, use utility templates for re-engagement.

**Steps:**
1. Create Meta WhatsApp Business app at developers.facebook.com
2. Add WhatsApp Business phone number
3. Generate permanent access token
4. Submit utility message template for Meta approval (1-2 days review)
5. Build Cloudflare Worker webhook handler
6. Integrate Kimi AI for contextual responses
7. Add per-client D1 config (services, pricing, areas, owner number)
8. Add owner notification (WhatsApp default, Telegram optional)
9. Test on PintarWeb's own WhatsApp Business number first

**Files to create:**
- `workers/whatsapp-bot/index.ts` — Cloudflare Worker
- `scripts/configure-bot.sh` — Client bot setup helper

**Costs:**
- Meta WhatsApp Cloud API: ~RM0.10/outbound message (inbound free)
- Kimi AI: ~RM5-10/month per active client
- Cloudflare Workers: Free tier sufficient for pilot

**Client onboarding (after payment):**
1. Collect WhatsApp Business number from client
2. Set up bot config in D1 (business name, services, pricing, areas)
3. Ask client: WhatsApp or Telegram for notifications
4. Test with client, verify responses

---

### 1.7 Automation Scripts to Build

| Script | Purpose |
|--------|---------|
| `scripts/confirm-payment.sh` | Payment received → update D1 + send WhatsApp receipt + email PDF invoice |
| `scripts/billing-reminder.sh` | Send month 3 reminder to all active pilots |
| `scripts/create-subscription.sh` | Create Razorpay subscription via API |
| `scripts/check-subscription.sh` | Check subscription status, update D1 |

---

## Pilot Selection (Weeks 1-2)

### Criteria
- Score ≥ 60 (from `process-leads.sh`)
- Aircond/plumbing/electrical niche
- Selangor/KL area
- No website or weak website (data opportunity insight)
- Active on WhatsApp (required for bot delivery)
- **Deliverable:** Website + WhatsApp auto-reply bot + Local SEO

### Where to Find Leads
1. **D1 database** — `view-outreach.sh` → sort by score descending
2. **Google Maps** — Search "aircond service [area]" for businesses without websites
3. **Facebook Groups** — Contractor groups, identify active members without websites
4. **Personal network** — Friends/family who know contractors

### Selection Process
1. Pull top 10 highest-scoring leads from D1
2. Filter by: aircond/plumbing/electrical, Selangor/KL, score ≥ 60
3. Manually verify: active WhatsApp number, business still operating
4. Select top 5-10 for pilot

---

## Outreach Process

### Message Timing
| Time | Why |
|------|-----|
| 7:00-8:30am | Before jobs start, checking phone |
| 12:30-2:00pm | Lunch break, relaxed |
| 9:00-10:30pm | Day done, scrolling phone |

**Avoid:** 9am-12pm and 2pm-6pm (busy work hours)

---

### Touch 1 — First Outreach

**Standard (no website, no social):**
```
Hi [Name], kami check online presence [Business Name] —
ada buat report + demo website untuk awak.
Boleh tengok: [demo_url]

Ada soalan boleh tanya sini.
```

**Social-aware (Instagram/TikTok active):**
```
Hi [Name], nampak [Business Name] ada Instagram yang active —
project photos nampak bagus. Kami buat quick report pasal
online presence awak + demo website. Boleh tengok:
[demo_url]
```

**Rules:**
- Under 4 lines total
- Audit link in every first message — always
- No price mention
- No "pakej" or "promosi" language
- End with soft open

---

### Touch 2 — Day 3 Follow-Up

Only if no reply.
```
Just nak check — awak dah tengok report tu? 290 orang 
search aircond service [area] sebulan. Bayangkan kalau 
5% dari tu jadi customer awak — 15 customer baru sebulan.
```

---

### Touch 3 — Day 7 Final

Only if still no reply.
```
Tadi update sikit demo website awak — dah tambah section 
servis area. Link sama: [demo_url]

Boleh tengok bila free.
```

---

### Engagement (When They Reply)

**If they ask about pricing:**
```
Kalau berminat, ada 2 pilihan:
1. RM 800 one-time untuk website
2. RM 149/bulan — website FREE, auto-reply + GMB + SEO included.
   Tapi kami punya split payment: RM297 setup + RM149 masa launch (jumpa kat bawah).
   Total RM 446 — satu job chemical wash (RM 180-350) dah cover sebulan.
```

**If they're interested:**
1. Send DuitNow QR / bank account details
2. Mention invoice will be sent after payment
3. Wait for payment confirmation

**If they're reluctant:**
- Apply pilot discount (50% off setup) privately: "Untuk awak, sebab saya regard awak sebagai potential client — saya boleh bagi special rate. Setup RM150 je."
- Or offer extended free months

---

## Closing (Payment Collection)

### Step 1: Send Payment Details

WhatsApp:
```
Bagus! Untuk mula, boleh transfer ke:

PintarWeb Enterprise
Bank: [BANK NAME]
Account: [ACCOUNT NUMBER]

Amount: RM [297/149]

Sila hantar bukti transfer kat sini, dan saya akan hantar invoice.
```

### Step 2: Verify Payment

Check bank statement / DuitNow notification.

### Step 3: Confirm Payment + Send Invoice

```bash
bash scripts/confirm-payment.sh "[business-id]" "[amount]" "[payment-reference]"
```

This script will:
1. Update D1: `setup_paid=1`, `setup_paid_date`, `setup_amount`, `invoice_number`
2. Generate invoice PDF
3. Send WhatsApp receipt to customer
4. Send email with PDF invoice attached
5. Log `payment_received` event in D1

### Step 4: Send Welcome Message

WhatsApp:
```
Terima kasih! Payment dah terima.

Invoice: [PWT2026-XXX]
Website awak: [demo_url]

Untuk 4 bulan pertama (3 bulan free + bulan 1 yang awak bayar), 
tiada apa-apa bayaran lagi. Saya akan contact awak kat hujung bulan 3 
untuk renewal options.

Ada apa-apa boleh WhatsApp saya bila-bila masa.
```

---

## Months 1-3: Free Pilot Period

### What to Monitor
- Demo site visits (via Umami `demo_visit` event)
- WhatsApp clicks (via Umami `whatsapp_click` event)
- Any replies or questions

### Check-In Messages (Light Touch)

**Month 1 end:**
```
Hi [Name], dah duas kan website awak? Jangan segan untuk 
message saya kalau ada apa-apa nak diupdate atau diubah.
```

**Month 2 end:**
```
Hi [Name],ade apa-apa soalan tentang website awak? 
Saya boleh tolong adjust mana-mana part bila-bila masa.
```

### Collect Feedback

Informal feedback is fine. Track key points in D1 `notes` field:
- What they liked
- What was confusing
- What they'd change
- Pricing reaction

---

## Month 3 End: Billing Reminder

### Automated Reminder Script

```bash
bash scripts/billing-reminder.sh
```

Sends WhatsApp to all pilots with `setup_paid=1` AND `billing_reminder_sent=0`:

```
Hi [Name], ni reminder — billing PintarWeb bermula bulan depan.

Pilihan renewal:
📅 Bulanan: RM149/bulan
📅 Suku Tahun: RM417 (jimat RM30)
📅 6 Bulan: RM774 (jimat RM120)
📅 Tahunan: RM1,308 (jimat RM480)

Nak pilih yang mana? Boleh reply kat sini.

- PintarWeb
```

Update D1: `billing_reminder_sent=1`, `billing_reminder_date=[today]`

---

## Month 4: Subscription Setup

### If Customer Responds with Plan Choice

```bash
bash scripts/create-subscription.sh "[business-id]" "[monthly|quarterly|biannual|annual]"
```

Script will:
1. Create Razorpay subscription for customer
2. Send authorization request to customer (via WhatsApp with link)
3. Once authorized → subscription is active
4. Update D1: `subscription_id`, `plan_type`, `subscription_status='active'`
5. Send confirmation via WhatsApp + email

### If No Response (Default to Monthly)

```bash
bash scripts/create-subscription.sh "[business-id]" "monthly"
```

Send WhatsApp:
```
Hi [Name], sebab tak dapat reply, saya activatekan subscription 
bulanan (RM149/bulan) untuk awak. Boleh tukar ke plan lain 
 bila-bila masa dengan message saya.

Current subscription: https://razorpay.com/subscriptions/[id]
```

---

## Re-engagement SOP (Cancelled Pilots)

### Trigger: Pilot cancels at month 4 (or anytime before)

### Step 1: Cancel Confirmation (Day 0)

WhatsApp:
```
Sedar. Terima kasih bagi peluang tu. Kalau berubah fikiran, 
saya boleh bantu lagi untuk masa depan.
```

Update D1: `subscription_status='cancelled'`

### Step 2: Week 2 Follow-Up

WhatsApp:
```
Hi [Name], saya update sikit website awak dengan feedback 
yang awak bagi dulu. Nak tengok?
```

### Step 3: Month 2 (If No Response)

WhatsApp:
```
Hi [Name], special offer untuk awak — kalau nak activate balik, 
setup fee saya waived. Cuma RM149/bulan je. Interested?
```

### Step 4: Month 3 (Final Check-In)

WhatsApp:
```
Hi [Name], nak check in satu kali je lagi. Selepas ni saya 
akan archive number awak. Kalau nak continue, saya boleh tolong. 
Kalau tak, tak apa — semua yang terbaik!
```

### Success Counting

- Cancelled pilot who returns = **0.5 pilot success**
- 2 re-engaged = 1 full success client

---

## D1 Tracking Fields Summary

### outreach_leads table

| Field | Type | Purpose |
|-------|------|---------|
| `id` | TEXT | Unique ID (e.g., "ahsengplumbing-20260629") |
| `business_name` | TEXT | Business name |
| `contact_name` | TEXT | Contact person name |
| `phone` | TEXT | WhatsApp number |
| `area` | TEXT | Service area |
| `niche` | TEXT | Trade niche |
| `demo_url` | TEXT | Demo site URL |
| `audit_url` | TEXT | Audit report URL |
| `status` | TEXT | new/contacted/interested/closing/paid/pilot_active/subscription_active/cancelled |
| `score` | INTEGER | Lead score (0-100) |
| `setup_paid` | INTEGER | 0 or 1 |
| `setup_paid_date` | TEXT | ISO date |
| `setup_amount` | INTEGER | Amount received |
| `invoice_number` | TEXT | PWT2026-XXX |
| `plan_type` | TEXT | monthly/quarterly/biannual/annual |
| `subscription_id` | TEXT | Razorpay subscription ID |
| `subscription_start` | TEXT | ISO date |
| `subscription_status` | TEXT | pending/active/cancelled |
| `billing_reminder_sent` | INTEGER | 0 or 1 |
| `billing_reminder_date` | TEXT | ISO date |
| `created_at` | TEXT | ISO timestamp |
| `updated_at` | TEXT | ISO timestamp |

### outreach_events table

| Field | Type | Purpose |
|-------|------|---------|
| `id` | INTEGER | Auto-increment |
| `lead_id` | TEXT | FK to outreach_leads |
| `event_type` | TEXT | outreach_sent/follow_up/reply/interested/closing/payment_received/subscription_created/cancelled/etc |
| `metadata` | TEXT | JSON notes |
| `created_at` | TEXT | ISO timestamp |

---

## Scripts Reference

| Script | Usage | Purpose |
|--------|-------|---------|
| `add-lead.sh` | `bash scripts/add-lead.sh "Name" "60123456789" "Area" "niche" [--contact "Name"] [--score N]` | Add new lead to D1 |
| `track-event.sh` | `bash scripts/track-event.sh "[lead-id]" "[event_type]" [--status "status"]` | Log event |
| `view-outreach.sh` | `bash scripts/view-outreach.sh` | Dashboard view |
| `process-leads.sh` | `bash scripts/process-leads.sh data/leads/sample-leads.csv` | Score leads |
| `generate-demo.sh` | `bash scripts/generate-demo.sh --name "X" --phone "X" --area "X" --niche "X"` | Demo + audit + WhatsApp |
| `generate-audit.sh` | `bash scripts/generate-audit.sh "Name" "Area" "Niche" "/tmp/audits"` | Generate P.A.S.T. audit |
| `generate-whatsapp.sh` | `bash scripts/generate-whatsapp.sh "Name" "Phone" "lead-id" --audit "url" --demo "url"` | Generate WhatsApp link |
| `confirm-payment.sh` | `bash scripts/confirm-payment.sh "[lead-id]" "[amount]" "[payment-ref]"` | Payment → invoice + D1 update |
| `billing-reminder.sh` | `bash scripts/billing-reminder.sh` | Send reminders to all pilots |
| `create-subscription.sh` | `bash scripts/create-subscription.sh "[lead-id]" "[plan]"` | Create Razorpay subscription |

---

## Razorpay Setup

### API Keys (in .env)
```
RAZORPAY_KEY_ID=rzp_live_T75gpSekzuIxbX
RAZORPAY_KEY_SECRET=MKkqwVNu6l21OpG0c15hdPCq
```

### Subscription Plans (create via script — run once)
```bash
bash scripts/create-razorpay-plans.sh
```
Then add the returned plan IDs to `.env`:
```
RAZORPAY_PLAN_MONTHLY=plan_xxxxxxxxxxxxx
RAZORPAY_PLAN_QUARTERLY=plan_yyyyyyyyyyyyy
RAZORPAY_PLAN_BIANNUAL=plan_zzzzzzzzzzzzz
RAZORPAY_PLAN_ANNUAL=plan_wwwwwwwwwwwww
```

---

## Email (Resend)

```
RESEND_API_KEY=re_Bdr4pYp6_NLyTcU2939WUy6WsnMwHjFC9
RESEND_FROM_EMAIL=hello@mail.pintarweb.com
```

---

## Success Checklist

### Pre-Pilot
- [x] D1 schema updated (migrate-outreach-db.sh — all billing fields added)
- [x] confirm-payment.sh built (D1 update + WhatsApp receipt + email invoice)
- [x] billing-reminder.sh built (month 3 reminder to all active pilots)
- [x] create-subscription.sh built (Razorpay subscription via API)
- [x] check-subscription.sh built (status check + D1 update)
- [x] Razorpay plans created (monthly: plan_T7iCYvWi9YyH9u, quarterly: plan_T7iCZRGEfpUfMA)
- [x] Meta WhatsApp Business app configured and Live (App ID: 672944922211791, WABA: 727271803683109)
- [x] WhatsApp bot built and deployed (DeepSeek v4 Flash + 22-intent classifier, 2-path closing flow)
- [ ] Submit utility template for Meta approval (1-2 days)
- [ ] Test bot on PintarWeb's own WhatsApp number (+60196556243)
- [ ] Test confirm-payment.sh end-to-end (with real bank transfer)
- [ ] Test Resend email integration

### Pilot Launch
- [ ] 5-10 pilot prospects selected (score ≥ 60)
- [ ] Demo sites built for all pilots
- [ ] Audit reports generated
- [ ] WhatsApp bot set up for PintarWeb number (proof of concept)
- [ ] First outreach sent to all pilots
- [ ] Follow-ups sent (Day 3, Day 7)

### Closing
- [ ] At least 3-5 pilots closed (payment received)
- [ ] Invoices sent to all paid pilots
- [ ] Welcome messages sent
- [ ] D1 updated for all pilots
- [ ] WhatsApp bot configured for all paid pilots (services, pricing, areas, owner number)

### Monitoring
- [ ] Engagement tracked (demo visits, WhatsApp clicks)
- [ ] Check-in messages sent (Month 1, Month 2)
- [ ] Feedback collected informally

### Billing (Month 3-4)
- [ ] Billing reminders sent to all active pilots
- [ ] Plan choices collected
- [ ] Razorpay subscriptions created for all pilots
- [ ] Confirmation messages sent

### Documentation
- [ ] Pilot feedback analyzed
- [ ] What worked / didn't work documented
- [ ] SOPs updated

---

## Next Steps

After Phase 3, proceed to **Phase 4: Scale** where you'll:
- Launch outreach to 20-50 prospects
- Close 5-10 paying clients
- Establish routine operations

---

**Last Updated:** 2026-07-04
**Status:** Ready to execute (automation to be built)
