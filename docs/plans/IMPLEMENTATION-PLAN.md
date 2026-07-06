# Pintarweb Kick-off Implementation Plan

## Overview

This document outlines the complete implementation plan to launch Pintarweb's WaaS business. The plan is organized into 4 phases over 4 weeks, with clear deliverables and checklists.

**Target:** First paying customer by end of Week 4  
**Budget:** RM 50-100/month  
**Time Commitment:** 5-10 hours/week

---

## Phase 1: Foundation (Week 1)

### Goals
- Legal and payment infrastructure ready
- Cloud hosting pipeline operational
- Can accept first customer payment

### Deliverables

#### 1.1 Payment Processing Setup
- [x] Razorpay merchant account created
- [x] Bank account linked and verified
- [x] Payment link template for RM 446 (4-month bundle, split payment)
- [x] API keys configured in .env
- [x] Payment confirmation workflow documented
- [ ] Test payment completed

**Estimated Time:** 2-3 hours  
**Cost:** Free (Razorpay takes 1.5% transaction fee)

#### 1.2 Legal Documents
- [x] Subscription agreement template drafted
- [x] Terms of service created
- [x] Privacy policy (PDPA compliance) created
- [x] Documents reviewed
- [x] Document storage system (in repo)

**Estimated Time:** 3-4 hours  
**Cost:** RM 0-300 (lawyer review optional)

#### 1.3 Cloud Hosting Pipeline
- [x] Cloudflare Pages project created (pintarweb-preview)
- [x] Custom domain configured (preview.pintarweb.com)
- [x] DNS records set up
- [x] R2 bucket created (pintarweb-assets)
- [x] GitHub repository connected for auto-deploy
- [x] Test deployment successful

**Estimated Time:** 2-3 hours  
**Cost:** Free (Cloudflare free tier)

#### 1.4 Landing Page ✅
- [x] Landing page designed and built (dark glassmorphic, from legacy pintar-landing design)
- [x] Deployed to pintarweb-main Pages project (main.pintarweb-main.pages.dev)
- [x] BM/EN/CN toggle, RM800 anchor vs RM446 subscription pricing, FAQ, founder section
- [x] Showcase marquee with 3 tradesperson demo sites
- [x] schema.org LocalBusiness structured data, favicons, OG image
- **Status:** ✅ Complete. Domain migrated to pintarweb.com.

**Total Phase 1 Time:** 9-13 hours  
**Total Phase 1 Cost:** RM 0-310

**Phase 1 Status:** ✅ ALL COMPLETE (2026-06-28)

---

## Phase 1.5: Website Integration & Sales Funnel (Week 1.5)

### Goals
- Landing page live at pintarweb.com
- Analytics tracking visitors and conversions
- Sales funnel documented end-to-end
- Outreach message templates ready with landing page links
- Demo site build SOP documented

### Deliverables

#### 1.5.1 Domain Migration (Manual — 30 min)
- [x] Add `pintarweb.com` custom domain to `pintarweb-main` in Cloudflare Dashboard
- [x] Remove from old `pintarweb2` project
- [x] Verify DNS propagation and test all URLs
- **Status:** ✅ Complete (2026-06-28)

#### 1.5.2 Analytics — Self-hosted Umami on Cloudflare (1-2 hours)
- [x] Deploy Umami (Cloudflare Worker or fallback to cloud.umami.is) — Umami Cloud free tier chosen
- [x] Add tracking to landing page + all demo client sites (website ID: 1e8f3b8d-2b18-44c7-98bb-0bfb691e712c)
- [x] Create custom events: whatsapp_click, showcase_click, pricing_view, faq_open
- [x] Verify tracking works
- [x] Create shared analytics dashboard URL
- **Cost:** Free (Umami Cloud free tier)
- **Share URL:** https://cloud.umami.is/share/IOzb83tMmKyzcWj9

#### 1.5.3 Sales Funnel Documentation (1 hour)
- [x] Document complete prospect journey in `docs/plans/sales-funnel.md`
- [x] Stages: Lead → Demo Build → Outreach → Engagement → Close → Onboard
- **Status:** ✅ Complete (2026-06-28)

#### 1.5.4 Outreach Message Templates (1-2 hours)
- [x] Create WhatsApp templates: first touch (BM/EN), follow-up D3, D7, closing
- [x] Each template includes: demo site link, pintarweb.com link, terms link
- [x] Create `docs/outreach/message-templates.md`
- **Status:** ✅ Complete (2026-06-28)

#### 1.5.5 Demo Site Build SOP (2-3 hours)
- [x] Document: gather info → config → generate → build CSS → deploy → verify
- [x] Mood assignment guide per trade (aircond=trustworthy-local, plumbing=bold-urgent, electrical=premium-modern)
- [x] Create `docs/sop/demo-site-build.md`
- **Status:** ✅ Complete (2026-06-28)

#### 1.5.6 Cross-linking & Conversion Tracking (30 min)
- [x] Add UTM parameters to demo URLs in outreach messages
- [x] Add Umami event tracking on landing page (whatsapp_click, showcase_click)
- [x] Add Umami event tracking on demo sites (demo_visit, demo_contact_submit)
- **Status:** ✅ Complete (2026-06-28)

#### 1.5.7 Plan Updates ✅
- [x] Create `docs/plans/phase-1.5-website-integration.md`
- [x] Update MASTER-CHECKLIST.md and IMPLEMENTATION-PLAN.md
- [x] Update phase-1-foundation.md

**Total Phase 1.5 Time:** 6-10 hours  
**Total Phase 1.5 Cost:** RM 0

**Phase 1.5 Completion:** Website live at pintarweb.com, analytics tracking, sales funnel documented, message templates ready, demo build SOP documented ✅

---

## Phase 2: Automation (Week 2)

### Goals
- Site generation fully automated
- Lead pipeline operational
- Can generate demo sites in < 30 minutes

### Deliverables

#### 2.1 Site Generation Script
- [x] Script to generate index.html from config.json (scripts/generate-demo.sh)
- [x] Script to generate audit.html from config.json (scripts/generate-audit.sh)
- [x] Script to generate report.html from config.json
- [x] Image optimization pipeline (resize, convert to WebP)
- [x] Template system for different niches (aircond, plumbing, electrical, trades)
- [x] Test with 3 different client configs (test-razif, test-azri, test-haris)
- **Status:** ✅ Complete (2026-06-29)

**Estimated Time:** 8-12 hours  
**Cost:** RM 0 (development time)

#### 2.2 Lead Pipeline
- [x] Scraper output → lead selection criteria documented
- [x] Google Places API integration for audit data
- [x] Lead prioritization algorithm (score based on: no website, low rating, search volume)
- [x] Lead export to outreach list format (scripts/process-leads.sh)
- [x] Test with 20 leads from scraper
- **Status:** ✅ Complete (2026-06-29)

**Estimated Time:** 6-8 hours  
**Cost:** RM 0 (Google Places API free tier: 100 requests/day)

#### 2.3 Outreach Tracking
- [x] Outreach event tracking in D1 database (scripts/track-event.sh)
- [x] Open/click tracking on report URLs (Umami + D1)
- [x] Follow-up reminder system (manual)
- [x] Lead status workflow: New → Contacted → Demo Sent → Follow-up → Closed (D1)
- [x] Integrate with Umami analytics from Phase 1.5.2 (track demo visits, landing page visits)
- [x] Use message templates from Phase 1.5.4
- **Status:** ✅ Complete (2026-06-29)

**Estimated Time:** 4-6 hours  
**Cost:** Free (Airtable/Notion free tier)

#### 2.4 WhatsApp Integration (Manual for Phase 1)
- [x] WhatsApp pre-fill generator built (scripts/generate-whatsapp.sh)
- [x] Outreach message templates created (docs/outreach/message-templates.md)
- [x] Follow-up message templates created (2-path closing flow)
- [x] Response tracking system (via D1 outreach_leads table)
- **Status:** ✅ Complete (2026-06-29)

**Estimated Time:** 2-3 hours  
**Cost:** Free

**Total Phase 2 Time:** 20-29 hours  
**Total Phase 2 Cost:** RM 0

---

## Phase 3: Pilot (Week 3)

### Goals
- Validate entire pipeline with real prospects
- Refine process based on feedback
- Document SOP for scaling

### Deliverables

#### 3.0 Demo Stage Infrastructure (2026-07-06)
- [x] Screenshot script: `scripts/generate-screenshot.sh` — Playwright mobile capture (390px PNG)
- [x] Demo site banners: all 3 demo client sites (test-razif, demo-ah-seng-plumbing, demo-kl-electrical)
- [x] Audit page banners: `templates/audit-template.html` and `clients/{id}/audit.html`
- [x] Bot demo widget placeholder: `<!-- {{BOT_DEMO_WIDGET}} -->` in `landing/index.html` at line 413
- [x] Bot demo component: `components/bot-demo-widget/bot-demo-widget.html` (NOT yet injected)
- [x] WhatsApp message: `generate-whatsapp.sh` with `--business-name` + 3-link format
- [x] Demo script: `generate-demo.sh` passes `--business-name` to WhatsApp script
- [ ] Deploy script: needs `{{BOT_DEMO_WIDGET}}` injection logic
- [ ] Landing page bot demo: pending pricing/review
- **Spec:** `docs/superpowers/specs/2026-07-06-demo-stage-outputs-design.md`

#### 3.1 Pre-Pilot Setup (Automation)
- [x] Update D1 schema (add: setup_paid, setup_amount, invoice_number, plan_type, subscription_id, subscription_status, billing_reminder_sent) — via scripts/migrate-outreach-db.sh
- [x] Build confirm-payment.sh (payment → D1 + WhatsApp receipt + email invoice via Resend)
- [x] Build billing-reminder.sh (month 3 end reminder to all active pilots)
- [x] Build create-subscription.sh (Razorpay API → subscription creation)
- [x] Build check-subscription.sh (status check + D1 update)
- [x] Create 4 Razorpay subscription plans (monthly/quarterly/bi-annual/annual)
- [x] Invoice numbering: PWT2026-001, PWT2026-002... (auto-generated by confirm-payment.sh)
- **Status:** ✅ Complete (2026-07-04)

**Estimated Time:** 1-2 days  
**Cost:** RM 0

#### 3.2 Pilot Execution (Weeks 1-4)
- [ ] Select 5-10 pilot prospects (score ≥ 60, aircond/plumbing/electrical, KL/Selangor)
- [ ] Demo sites built for all pilots (generate-demo.sh)
- [ ] Audit reports generated
- [ ] First outreach sent (Touch 1 — observation style, < 4 lines)
- [ ] Follow-ups sent (Day 3, Day 7)
- [ ] Engagement tracked (interested → closing)
- [ ] Payment collected via Maybank transfer (RM297 setup + RM149 activation)
- [ ] Invoice sent via confirm-payment.sh
- [ ] Welcome message sent

**Estimated Time:** 8-12 hours  
**Cost:** RM 0 (free pilots)

#### 3.3 Pilot Monitoring (Months 1-3)
- [ ] Track engagement (demo visits via Umami)
- [ ] Light check-in messages (Month 1, Month 2)
- [ ] Collect informal feedback

#### 3.4 Billing (Month 3 End)
- [ ] Run billing-reminder.sh → WhatsApp to all pilots
- [ ] Collect plan choices
- [ ] Create subscriptions via create-subscription.sh
- [ ] Confirmations sent via WhatsApp + email

#### 3.5 Re-engagement SOP
- [ ] Cancelled pilots: Week 2 follow-up, Month 2 special offer, Month 3 final
- [ ] No setup fee for re-engaged pilots (just RM149/month)
- [ ] Success counting: 2 re-engaged = 1 success

**Estimated Time:** 4-6 hours  
**Cost:** RM 0

**Total Phase 3 Time:** 16-24 hours  
**Total Phase 3 Cost:** RM 0  
**Revenue Target:** RM 446×5 = RM 2,230 minimum (5 pilots, RM297 + RM149 each)

---

## Phase 4: Launch (Week 4)

### Goals
- Launch outreach to 10-15 prospects
- Close first paying customer
- Establish rhythm for ongoing operations

### Deliverables

#### 4.1 Outreach Preparation
- [ ] Generate 10-15 high-quality leads (scraper + manual filtering)
- [ ] Build demo sites for all leads
- [ ] Prepare personalized outreach messages
- [ ] Schedule outreach times (7-8:30am, 12:30-2pm, 9-10:30pm)
- [ ] Prepare follow-up schedule (Day 3, Day 7, Day 14)

**Estimated Time:** 10-15 hours  
**Cost:** RM 0

#### 4.2 Outreach Execution
- [ ] Send first batch of outreach messages (5-7) using templates from Phase 1.5.4
- [ ] Track responses and opens (Umami + D1 tracking)
- [ ] Send follow-ups to non-responders (Day 3, Day 7 templates)
- [ ] Conduct conversations with interested prospects
- [ ] Pitch subscription model (RM297 setup + RM149 activation = RM446 total, 1 month FREE bonus, RM149/month renewal)
- [ ] Close first customer

**Estimated Time:** 8-12 hours  
**Cost:** RM 0

#### 4.3 Customer Onboarding (First Customer)
- [ ] Collect payment via Maybank transfer (RM297/449)
- [ ] Send invoice via confirm-payment.sh
- [ ] Collect client assets (logo, photos, business info)
- [ ] Generate final production site
- [ ] Set up domain (client's domain or subdomain)
- [ ] Configure Google Business Profile
- [ ] Conduct 20-minute onboarding call
- [ ] Send welcome package (website URL, support contact, billing schedule)

**Estimated Time:** 4-6 hours  
**Cost:** RM 0

#### 4.4 Review and Planning
- [ ] Week 4 retrospective (what worked, what didn't)
- [ ] Calculate time per deliverable
- [ ] Calculate customer acquisition cost
- [ ] Plan Month 2 outreach targets
- [ ] Decide: continue current approach or pivot?

**Estimated Time:** 2-3 hours  
**Cost:** RM 0

**Total Phase 4 Time:** 24-36 hours  
**Total Phase 4 Cost:** RM 0

---

## Success Metrics

### Week 1 (Foundation)
- [x] Payment link ready (Razorpay live, Maybank ready)
- [x] Legal documents complete (terms + privacy policy deployed)
- [x] Hosting pipeline operational (Cloudflare Pages + auto-deploy)
- [x] Analytics tracking (Umami cloud.umami.is)

### Week 2 (Automation)
- [x] Can generate demo site in < 30 minutes (scripts/generate-demo.sh)
- [x] Can generate 20 leads in < 1 hour (scripts/process-leads.sh)
- [x] Outreach tracking system working (D1 + scripts/track-event.sh)
- [x] Full pipeline tested end-to-end (3 demo sites deployed)

### Week 3 (Pilot)
- [ ] 5-10 pilot demos sent
- [ ] At least 3 pilot conversations started
- [ ] At least 2-3 pilots paid (RM297 setup + RM149 activation each)
- [ ] Feedback collected

### Week 4 (Launch)
- [ ] 10-15 outreach messages sent
- [ ] At least 3 conversations started
- [ ] 1 paying customer closed (RM 446 total: RM297 setup + RM149 activation)
- [ ] Customer onboarded and live

---

## Risk Mitigation

### Risk 1: No responses to outreach
**Mitigation:**
- Refine message templates based on pilot feedback
- Test different times/days
- Expand lead criteria
- Consider Facebook group outreach as backup

### Risk 2: Can't close first customer
**Mitigation:**
- Offer extended trial (4 months for price of 3)
- Reduce price to RM 99/month for first 5 customers
- Offer one-time website option (RM 800) as alternative
- Get feedback on objections and address them

### Risk 3: Site generation takes too long
**Mitigation:**
- Simplify template system
- Use more AI assistance (Kimi for bulk generation)
- Reduce customization level
- Target < 2 hours per site by Month 2

### Risk 4: Technical issues with hosting/deployment
**Mitigation:**
- Test deployment pipeline thoroughly in Week 1
- Have backup hosting plan (Netlify free tier)
- Keep manual deployment option as fallback

---

## Budget Summary

### One-time Costs
- Legal documents (optional lawyer review): RM 0-300
- **Total:** RM 0-300

### Monthly Recurring Costs
- Cloudflare (Pages + Workers + D1 + R2): RM 0 (free tier)
- Umami analytics (self-hosted): RM 0
- Google Places API: RM 0 (free tier)
- Razorpay transaction fees: ~RM 2.23 per RM 149 subscription (1.5%)
- **Total:** RM 7/month (after first customer)

### Total Month 1 Budget
- **Minimum:** RM 0 (no lawyer, free pilots)
- **Maximum:** RM 310 (lawyer review, VPS for Umami)
- **Recommended:** RM 50-100 (lawyer review optional)

---

## Decision Points

### End of Week 2
**Decision:** Continue to pilot or refine automation?
- If site generation takes > 1 hour → spend more time on automation
- If lead quality is poor → refine scraper criteria
- If everything works → proceed to pilot

### End of Week 3
**Decision:** Continue to launch or pivot?
- If pilot feedback is positive → proceed to launch
- If pilot feedback is negative → refine based on feedback, extend pilot
- If no pilot responses → reconsider target market or messaging

### End of Week 4
**Decision:** Continue current approach or pivot?
- If 1+ customer closed → continue, scale outreach
- If 0 customers but 3+ conversations → refine pitch, extend outreach
- If 0 conversations → major pivot needed (target market, pricing, or messaging)

---

## Next Steps

1. **Start Phase 1 immediately** - Focus on payment and legal setup
2. **Use detailed plans** - Each phase has a detailed implementation plan with step-by-step instructions
3. **Track progress** - Use checklists to ensure nothing is missed
4. **Iterate quickly** - Don't wait for perfection, launch and refine
5. **Document everything** - Build SOPs as you go for future scaling

---

## Detailed Implementation Plans

See the following documents for detailed step-by-step instructions:

- [Phase 1: Foundation - Detailed Plan](./phase-1-foundation.md)
- [Phase 1.5: Website Integration & Sales Funnel](./phase-1.5-website-integration.md)
- [Phase 2: Automation - Detailed Plan](./phase-2-automation.md)
- [Phase 3: Pilot - Detailed Plan](./phase-3-pilot.md)
- [Phase 4: Launch - Detailed Plan](./phase-4-launch.md)

---

**Last Updated:** 2026-07-06  
**Owner:** Yusmarin  
**Status:** Phase 1 COMPLETE ✅ — Phase 2 COMPLETE ✅ — Phase 3 IN PROGRESS: WhatsApp bot deployed, pricing updated to RM446 (split payment), 2-path closing flow implemented.
