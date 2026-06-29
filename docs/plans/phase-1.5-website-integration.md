# Phase 1.5: Website Integration & Sales Funnel

**Time:** 6-10 hours | **Cost:** RM 0 | **Goal:** The website becomes a working sales tool, not just a static page

This phase bridges Foundation (Phase 1) and Automation (Phase 2). It covers everything needed to actually USE the landing page and demo sites in the sales process.

---

## 1.5.1 Domain Migration (Manual — 30 min)

- [ ] Go to Cloudflare Dashboard → Pages → `pintarweb-main` → Custom domains
- [ ] Add `pintarweb.com` as custom domain
- [ ] Remove `pintarweb.com` from old `pintarweb2` project (if still linked)
- [ ] Verify DNS propagation (may take up to 24h, usually 5-15 min)
- [ ] Test: `curl -I https://pintarweb.com` → should return HTTP 200 from new landing
- [ ] Test: `https://pintarweb.com/terms.html` and `/privacy-policy.html` → 200
- [ ] Verify og:image loads: `https://pintarweb.com/images/og-image.png`

**Dependencies:** pintarweb-main Pages project exists (✅), landing page deployed (✅)

---

## 1.5.2 Landing Page Analytics — Self-hosted Umami on Cloudflare (1-2 hours)

- [x] Deploy Umami as a Cloudflare Worker (or small VPS if Workers doesn't support it natively)
  - Fallback: Use Umami Cloud free tier (cloud.umami.is) if self-hosting is too complex
- [x] Create a website in Umami dashboard: `pintarweb.com`
- [x] Get tracking snippet (Umami script tag with website ID)
- [x] Add tracking script to `landing/index.html` (in `<head>`, before closing)
- [x] Add tracking script to all demo client sites (`clients/*/index.html`)
- [x] Create custom events in Umami:
  - `whatsapp_click` — when any WhatsApp CTA is clicked
  - `showcase_click` — when a showcase marquee card is clicked
  - `pricing_view` — when pricing section scrolls into view
  - `faq_open` — when a FAQ item is expanded
- [x] Add event tracking JS to landing page
- [x] Verify tracking works: Visit landing page → check Umami dashboard for pageview
- [x] Create a shared analytics dashboard URL for quick referenceye

**Dependencies:** 1.5.1 domain migration (so we know the final URLs)

**Umami Cloud Setup:**
- Website ID: `1e8f3b8d-2b18-44c7-98bb-0bfb691e712c`
- Tracking script: `<script defer src="https://cloud.umami.is/script.js" data-website-id="1e8f3b8d-2b18-44c7-98bb-0bfb691e712c"></script>`
- Sites tracked: `pintarweb.com` + 3 demo sites (all using same website ID)
- **Share URL:** https://cloud.umami.is/share/IOzb83tMmKyzcWj9

---

## 1.5.3 Sales Funnel Definition (1 hour)

Document the complete prospect journey in `docs/plans/sales-funnel.md`:

```
STAGE 1: LEAD GENERATION
  Scraper → Google Maps/FB → leads-raw.json → leads-processed.json
  ↓
STAGE 2: DEMO BUILD
  Lead data → config.json → generate index.html → build CSS → deploy to preview.pintarweb.com/{id}/
  ↓
STAGE 3: OUTREACH (WhatsApp)
  Yus sends message with 3 links:
    1. Demo site: https://preview.pintarweb.com/{id}/
    2. Landing page: https://pintarweb.com (pricing, FAQ, how it works)
    3. Audit report: https://preview.pintarweb.com/{id}/audit.html (if available)
  ↓
STAGE 4: PROSPECT ENGAGEMENT
  Prospect visits demo site → sees their business online (Umami tracks visit)
  Prospect visits pintarweb.com → reads pricing/FAQ (Umami tracks visit)
  Prospect clicks WhatsApp CTA → chats with Yus (Umami tracks event)
  ↓
STAGE 5: CLOSING
  Yus sends Razorpay payment link (RM447)
  Prospect pays → payment confirmed
  ↓
STAGE 6: ONBOARDING
  Collect real assets (logo, photos, info)
  Replace demo images with real photos
  Deploy to client domain or pintarweb.com/{id}/ subdomain
  Set up Google Business Profile
  Configure WhatsApp auto-reply bot
  Welcome message + support contact
```

---

## 1.5.4 Outreach Message Templates (1-2 hours)

Create `docs/outreach/message-templates.md` with WhatsApp templates:

### First Touch (BM)
```
Hi {name}, saya Yus dari PintarWeb.

Saya dah buat demo website untuk {business_name}. Boleh tengok kat sini:
👉 {demo_url}

Untuk harga dan info lanjut, visit:
👉 https://pintarweb.com

Kalau berminat, WhatsApp saya balik. Terima kasih!
```

### First Touch (EN)
```
Hi {name}, I'm Yus from PintarWeb.

I've built a demo website for {business_name}. You can see it here:
👉 {demo_url}

For pricing and more info, visit:
👉 https://pintarweb.com

If interested, WhatsApp me back. Thanks!
```

### Follow-up Day 3
```
Hi {name}, ini follow-up dari saya. 

Ada tengok demo website {business_name}? Link: {demo_url}

FAQ dan harga di https://pintarweb.com/#faq

Boleh WhatsApp saya kalau ada soalan.
```

### Follow-up Day 7
```
Hi {name}, terakhir kali saya follow up.

Demo: {demo_url}
Harga: https://pintarweb.com/#harga

Bonus: Bayar 3 bulan, dapat 4 bulan. Terma di https://pintarweb.com/terms.html

Kalau tak berminat, tak apa — semua good. Kalau berminat, WhatsApp saya.
```

### Closing (when prospect agrees)
```
Bagus! Untuk mula, bayar di link ini:
👉 {razorpay_link}

RM447 untuk 4 bulan (3+1 bonus). 

Selepas bayar, saya akan WhatsApp untuk collect info bisnes anda (logo, gambar, servis). Website live dalam 5-7 hari.

Terma: https://pintarweb.com/terms.html
Privasi: https://pintarweb.com/privacy-policy.html
```

**Variables:**
- `{name}` — prospect's name (from scraper or FB profile)
- `{business_name}` — business name (from config.json)
- `{demo_url}` — `https://preview.pintarweb.com/{client-id}/`
- `{razorpay_link}` — generated Razorpay payment link (RM447)

---

## 1.5.5 Demo Site Build Workflow (2-3 hours)

Document in `docs/sop/demo-site-build.md`:

### Step 1: Gather Prospect Info (15 min)
- Business name, tagline, phone, WhatsApp number
- Service areas (cities/neighborhoods)
- Services offered (list 4-6)
- Google rating + review count (from scraper/audit)
- Testimonials (from Google reviews or craft realistic ones)
- Instagram handle (if available)
- Photos: Check their FB/IG for real work photos. If none, use AI-generated from image-collections.

### Step 2: Create Config (5 min)
- Copy `config.json` template from an existing client
- Fill in prospect data
- Assign mood based on trade:
  - Aircond/renovation → `trustworthy-local` (green, brutalist)
  - Plumbing/emergency → `bold-urgent` (black/red, operational)
  - Electrical/premium → `premium-modern` (slate/bronze, refined)
  - Other trades → rotate through moods to avoid duplicates

### Step 3: Generate Site (30-60 min)
- Use LLM (Claude/GPT) to generate `index.html` following AGENTS.md rules
- OR manually adapt from existing demo template
- Include: real images, scroll animations, contact form, gallery, review cards
- Ensure BM/EN toggle on all text elements

### Step 4: Build & Deploy (5 min)
```bash
bash scripts/build-client.sh {id}     # Compile CSS
bash scripts/deploy-preview.sh        # Deploy to preview.pintarweb.com
```

### Step 5: Verify (5 min)
- Visit `https://preview.pintarweb.com/{id}/` on mobile + desktop
- Test BM/EN toggle
- Test WhatsApp CTA links
- Test contact form → WhatsApp submission
- Test gallery lightbox
- Check Umami tracking fires

### Step 6: Generate Audit Report (optional, 15 min)
- If scraper data available, generate audit.html showing:
  - Current online presence score
  - Google Maps visibility
  - Website issues (if they have one)
  - Recommendations
- Deploy alongside demo site

**Target time per demo:** 60-90 minutes (improves to <30 min with automation in Phase 2)

---

## 1.5.6 Cross-linking & Conversion Tracking (30 min)

- [ ] Add UTM-style parameters to demo site URLs in outreach messages: `?ref=outreach&prospect={id}`
- [ ] Add Umami event tracking on landing page:
  ```js
  // Track WhatsApp CTA clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
    a.addEventListener('click', () => umami.track('whatsapp_click'));
  });
  // Track showcase clicks
  document.querySelectorAll('#showcase a').forEach(a => {
    a.addEventListener('click', () => umami.track('showcase_click', { demo: a.href }));
  });
  ```
- [ ] Add Umami event tracking on demo sites:
  ```js
  // Track when prospect visits their demo
  umami.track('demo_visit', { client_id: '{id}' });
  // Track contact form submissions
  document.getElementById('contact-form')?.addEventListener('submit', () => umami.track('demo_contact_submit'));
  ```

**Dependencies:** 1.5.2 Umami deployed

---

## 1.5.7 Update Master Checklist & Implementation Plan

- [x] Create `docs/plans/phase-1.5-website-integration.md` (this file)
- [x] Update `MASTER-CHECKLIST.md`: Add Phase 1.5 section
- [x] Update `IMPLEMENTATION-PLAN.md`: Add Phase 1.5 section
- [x] Update `phase-1-foundation.md`: Mark 1.4 Landing Page as complete, note analytics moved to 1.5.2

---

## Summary

| Item | Time | Output |
|------|------|--------|
| 1.5.1 Domain Migration | 30 min | pintarweb.com live |
| 1.5.2 Umami Analytics | 1-2 hrs | Tracking on landing + demos |
| 1.5.3 Sales Funnel Doc | 1 hr | `docs/plans/sales-funnel.md` |
| 1.5.4 Message Templates | 1-2 hrs | `docs/outreach/message-templates.md` |
| 1.5.5 Demo Build SOP | 2-3 hrs | `docs/sop/demo-site-build.md` |
| 1.5.6 Cross-linking | 30 min | Event tracking on all pages |
| 1.5.7 Plan Updates | 30 min | Updated MASTER-CHECKLIST + IMPLEMENTATION-PLAN |
| **Total** | **6-10 hrs** | |

**Phase 1.5 Completion:** Website live at pintarweb.com, analytics tracking, sales funnel documented, message templates ready, demo build SOP documented ✅

---

**Last Updated:** 2026-06-28  
**Owner:** Yusmarin  
**Status:** ✅ Phase 1.5 nearly complete — all items done except final verification
