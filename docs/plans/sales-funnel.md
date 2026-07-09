# Sales Funnel — PintarWeb

Documenting the complete prospect journey from first contact to signed customer.

---

## Overview

```
LEAD → DEMO BUILD → OUTREACH → ENGAGEMENT → CLOSE → ONBOARD
```

---

## Stage 1: Lead Generation

**Goal:** Find Malaysian SME owners who need websites

**Sources:**
- Google Maps scraper (aircon, plumbing, electrical businesses)
- Facebook page/business scraper
- Referrals

**Output:** `leads-raw.json` → `leads-processed.json`

**Lead data needed:**
- Business name
- Owner/contact name
- Phone/WhatsApp number
- Service areas
- Google rating + review count
- Existing website (if any)

---

## Stage 2: Demo Build

**Goal:** Create a personalized preview website before outreach

**Timeline:** 60-90 minutes per demo

**Process:**
1. Gather prospect info (config.json)
2. Assign design mood based on trade
3. Generate/paste index.html
4. Build CSS: `bash scripts/build-client.sh {id}`
5. Deploy: `bash scripts/deploy-preview.sh`
6. Verify on mobile + desktop

**Output:** Live demo site at `https://preview.pintarweb.com/{id}/`

**Design moods by trade:**
| Trade | Mood | Colors |
|-------|------|--------|
| Aircond/Renovation | trustworthy-local | Forest green, warm white |
| Plumbing/Emergency | bold-urgent | Black/red, urgent |
| Electrical/Premium | premium-modern | Slate/bronze, refined |
| Other | rotate | Avoid duplicates |

---

## Stage 3: Outreach (WhatsApp)

**Goal:** Send personalized message with demo link

**3 links to include:**
1. Demo site: `https://preview.pintarweb.com/{id}/`
2. Landing page: `https://pintarweb.com`
3. Audit report: `https://preview.pintarweb.com/{id}/audit.html` (if available)

**Tracking:** Add UTM params to links
```
?ref=outreach&prospect={id}
```

**Message sequence:**
1. First Touch — Send demo link
2. Day 3 Follow-up — Nudge
3. Day 7 Final — Last call with urgency

See: `docs/outreach/message-templates.md`

---

## Stage 4: Prospect Engagement

**Goal:** Prospect visits demo → lands on landing page → clicks WhatsApp

**Tracking events (Umami):**
| Event | Trigger | Meaning |
|-------|---------|---------|
| `demo_visit` | Demo site pageview with `?ref=outreach` | Prospect opened demo link |
| `showcase_click` | Clicked demo card on landing | Prospect returned to see other demos |
| `pricing_view` | Scrolled to #harga section | Prospect considering pricing |
| `faq_open` | Expanded any FAQ item | Prospect has questions |
| `whatsapp_click` | Clicked WhatsApp CTA | **INTENT TO BUY** |

**Ideal path:**
```
1. Prospect receives WhatsApp with demo link
2. Opens demo → Umami tracks demo_visit
3. Browses demo site
4. Clicks link to landing page
5. Reads pricing → pricing_view fires
6. Has questions → opens FAQ → faq_open fires
7. Convinced → clicks WhatsApp → whatsapp_click fires
8. Yus receives WhatsApp → closes deal
```

---

## Stage 5: Closing

**Trigger:** Prospect replies "interested" on WhatsApp

**Process:**
1. Yus sends Maybank details (562021737846, PintarWeb Enterprise)
2. Prospect pays RM297 (setup fee) → build starts
3. Week 4: Prospect pays RM149 (activation) → bot transferred, site goes live

**Payment:** RM446 total (RM297 setup + RM149 activation), includes 1 month FREE bonus

---

## Stage 6: Onboarding

**Trigger:** Payment confirmed

**Process (4 weeks):**
1. Collect real assets:
   - Logo (file or FB page)
   - Real photos of work
   - Business info verification
   - Service area confirmation
2. Update demo → real site
3. Deploy to `pintarweb.com/{id}/` or custom domain
4. Set up Google Business Profile (see `docs/sop/gmb-setup.md`)
5. Configure WhatsApp auto-reply bot (business name, services, pricing, areas, owner WhatsApp)
6. Send welcome message

**Client deliverables:**
- Website on their domain (or subdomain)
- WhatsApp auto-reply bot (Meta Cloud API + Cloudflare Workers) — instant acknowledgment, FAQ answering, lead capture
- Google Business Profile claimed (see `docs/sop/gmb-setup.md`)
- SSL + hosting for months 1-3 (pilot period)
- Month 4+: RM149/mo via Razorpay subscription

---

## Key Metrics

| Metric | Target |
|--------|--------|
| Demo build time | < 60 min |
| Response rate (first touch) | 10-20% |
| Close rate (after WhatsApp) | 20-30% |
| Time from demo to close | 4 weeks (demo to live) |

---

## Tools Used

| Tool | Purpose |
|------|---------|
| Google Maps scraper | Lead discovery |
| Facebook scraper | Lead enrichment |
| Claude/GPT | Content generation |
| Cloudflare Pages | Hosting (preview + main) |
| Umami Analytics | Tracking (cloud.umami.is) |
| Meta WhatsApp Cloud API | Auto-reply bot webhook |
| Cloudflare Workers | Bot logic + AI integration |
| DeepSeek v4 Flash | Contextual reply generation (WhatsApp bot) |
| Razorpay | Subscription payment collection (month 4+) |
| WhatsApp | Customer communication |

---

## Status

**Umami Dashboard:** https://cloud.umami.is/share/IOzb83tMmKyzcWj9

---

**Last Updated:** 2026-07-04
