# Pintarweb Kick-off Master Checklist

## Overview

This master checklist consolidates all tasks across the 4-week kick-off plan. Use this to track overall progress and ensure nothing is missed.

**Target:** First paying customer by end of Week 4  
**Total Time:** 40-60 hours  
**Total Cost:** RM 0-310

---

## Phase 1: Foundation (Week 1) - 9-13 hours

### 1.1 Payment Processing (2-3 hours)
- [x] Razorpay merchant account created
- [x] KYC completed (live mode)
- [x] Bank account linked and verified
- [x] Payment link template created (RM 447)
- [x] API keys configured in .env (live + test)
- [x] Payment workflow documented
- [ ] Test payment completed
- **Status:** ✅ Live account, ready for payments

### 1.2 Legal Documents (3-4 hours)
- [x] Subscription agreement drafted
- [x] Terms of service created (https://preview.pintarweb.com/terms.html)
- [x] Privacy policy (PDPA compliant) created (https://preview.pintarweb.com/privacy-policy.html)
- [x] Documents reviewed
- [x] Documents stored in `packages/site-generator/clients/`

### 1.3 Cloud Hosting (2-3 hours)
- [x] Cloudflare Pages project created (`pintarweb-preview`)
- [x] Custom domain configured (preview.pintarweb.com)
- [x] DNS records set up and propagated
- [x] R2 bucket created (pintarweb-assets)
- [x] GitHub auto-deploy configured (watches `main` branch)
- [x] Test deployment successful (test-razif site live)
- [x] Deployment script: `scripts/deploy-preview.sh`

#### Deployment Workflow
```bash
# Quick deploy: publish clients/ directory to Pages
./scripts/deploy-preview.sh

# Manual deploy (from project root):
npx wrangler pages deploy packages/site-generator/clients \
  --project-name=pintarweb-preview \
  --branch=main \
  --commit-dirty=true

# Check deployment status
npx wrangler pages deployment list --project-name=pintarweb-preview

# Kill a running project env
#  npx wrangler pages project delete pintarweb-preview
```

#### Deployment URLs
- **Production:** https://preview.pintarweb.com
- **Live preview:** https://main.pintarweb-preview.pages.dev
- **Direct deploy:** https://<deploy-id>.pintarweb-preview.pages.dev

#### Rollback (Manual via Dashboard)
- Go to https://dash.cloudflare.com/ > Pages > pintarweb-preview
- Navigate to a previous deployment and click "Rollback to this deployment"

#### Client URL Convention
- Landing: `https://preview.pintarweb.com/clients/{id}/`
- Audit:   `https://preview.pintarweb.com/clients/{id}/audit.html`
- Report:  `https://preview.pintarweb.com/clients/{id}/report.html`
- Legal:   `https://preview.pintarweb.com/terms.html`

### 1.4 Landing Page ✅
- [x] Landing page designed and built (dark glassmorphic, legacy design)
- [x] Deployed to pintarweb-main Pages project
- [x] BM/EN/CN toggle, pricing (RM800 anchor vs RM447), FAQ, founder section
- [x] Showcase marquee with 3 tradesperson demos
- [x] schema.org structured data, favicons, OG image
- **Status:** Complete. Domain migration pending (manual step in 1.5.1)

**Phase 1 Completion:** Can accept payment, deploy sites ✅

**Phase 1.5 Completion:** All items complete ✅

---

## Phase 1.5: Website Integration & Sales Funnel (Week 1.5) - 6-10 hours

### 1.5.1 Domain Migration (30 min)
- [x] Add `pintarweb.com` custom domain to `pintarweb-main` in Cloudflare Dashboard
- [x] Remove from old `pintarweb2` project
- [x] Verify DNS propagation and test all URLs
- **Status:** ✅ Complete

### 1.5.2 Analytics — Self-hosted Umami (1-2 hours)
- [x] Deploy Umami on Cloudflare Worker (or fallback to cloud.umami.is)
- [x] Add tracking to landing page + all demo sites
- [x] Create custom events: whatsapp_click, showcase_click, pricing_view, faq_open
- [x] Verify tracking works
- [x] Create shared analytics dashboard URL
- **Status:** ✅ Complete (2026-06-28)
- **Share URL:** https://cloud.umami.is/share/IOzb83tMmKyzcWj9

### 1.5.3 Sales Funnel Documentation (1 hour)
- [x] Document complete prospect journey (lead → demo → outreach → engagement → close → onboard)
- [x] Create `docs/plans/sales-funnel.md`
- **Status:** ✅ Complete (2026-06-28)

### 1.5.4 Outreach Message Templates (1-2 hours)
- [x] Create WhatsApp templates: first touch, follow-up D3, follow-up D7, closing
- [x] Templates include links to demo site + pintarweb.com + terms
- [x] Create `docs/outreach/message-templates.md`
- **Status:** ✅ Complete (2026-06-28)

### 1.5.5 Demo Site Build SOP (2-3 hours)
- [x] Document step-by-step: gather info → config → generate → build → deploy → verify
- [x] Mood assignment guide per trade
- [x] Create `docs/sop/demo-site-build.md`
- **Status:** ✅ Complete (2026-06-28)

### 1.5.6 Cross-linking & Conversion Tracking (30 min)
- [x] Add UTM parameters to demo URLs in outreach (use `?ref=outreach&prospect={id}`)
- [x] Add Umami event tracking on landing page (whatsapp_click, showcase_click, pricing_view, faq_open)
- [x] Add Umami event tracking on demo sites (demo_visit with ?ref=outreach, demo_contact_submit)
- **Status:** ✅ Complete (2026-06-28)

### 1.5.7 Plan Updates
- [x] Create `docs/plans/phase-1.5-website-integration.md`
- [x] Update MASTER-CHECKLIST.md
- [x] Update IMPLEMENTATION-PLAN.md
- [x] Update phase-1-foundation.md
- **Status:** Complete

**Phase 1.5 Completion:** Website live at pintarweb.com, analytics tracking, sales funnel documented, message templates ready, demo build SOP documented ✅

---

## Phase 2: Automation (Week 2) - 20-29 hours

### 2.1 Site Generation ✅ (12-16 hours)
- [x] Template system created (base + niche-specific)
- [x] Template loader built
- [x] Config validator built
- [x] Image optimizer built
- [x] Site generator script built
- [x] Audit generator script built (scripts/generate-audit.sh + audit-template.html)
- [x] Report generator script built
- [x] Master generator script built (scripts/generate-demo.sh)
- [x] Tested with existing client (test-razif)
- [x] Generation time < 30 minutes per site

### 2.2 Lead Pipeline ✅ (6-8 hours)
- [x] Lead scoring criteria defined (+50 no website + active social)
- [x] Lead processor script built (scripts/process-leads.sh)
- [x] Outreach list exporter built
- [x] Tested with existing leads
- [x] Can process 100 leads in < 1 minute

### 2.3 Outreach Tracking ✅ (4-6 hours)
- [x] Outreach database created (D1 tables: outreach_leads, outreach_events)
- [x] Outreach tracker script built (scripts/track-event.sh)
- [x] Report view tracking integrated
- [x] Dashboard script built (scripts/view-outreach.sh)
- [x] Tested with sample data

### 2.4 WhatsApp Integration ✅ (2-3 hours)
- [x] Message templates created (docs/outreach/message-templates.md + outreach-playbook.md)
- [x] WhatsApp pre-fill generator built (scripts/generate-whatsapp.sh)
- [x] Templates refined based on feedback (P.A.S.T. framework)

**Phase 2 Completion:** Can generate 20 leads and 5 demo sites in < 2 hours ✅

---

## Phase 3: Pilot (Week 3) - 16-24 hours

### 3.1 Pilot Execution (8-12 hours)
- [ ] 2-3 pilot prospects selected
- [ ] Demo sites built for all pilots
- [ ] First outreach sent to all pilots
- [ ] Follow-ups sent (Day 3, Day 7)
- [ ] Conversations conducted with interested pilots
- [ ] Feedback collected from all pilots
- [ ] All interactions tracked in database

### 3.2 Process Documentation (4-6 hours)
- [ ] Lead generation SOP documented
- [ ] Site generation SOP documented
- [ ] Outreach SOP documented
- [ ] Closing & onboarding SOP documented
- [ ] All SOPs tested and verified

### 3.3 Quality Refinement (4-6 hours)
- [ ] Pilot feedback analyzed
- [ ] Design system refined
- [ ] Copy rules updated
- [ ] Audit scoring calibrated
- [ ] Report template improved

**Phase 3 Completion:** 2-3 pilots sent, feedback collected, SOPs documented ✅

---

## Phase 4: Launch (Week 4) - 24-36 hours

### 4.1 Outreach Preparation (10-15 hours)
- [ ] 15-20 leads generated and processed
- [ ] Top 10-15 leads selected
- [ ] Demo sites built for all selected leads
- [ ] All sites deployed and verified
- [ ] Personalized messages prepared
- [ ] Follow-up schedule set up

### 4.2 Outreach Execution (8-12 hours)
- [ ] All first-touch messages sent (Day 3)
- [ ] Responses monitored and handled
- [ ] Day 3 follow-ups sent (Day 6)
- [ ] Day 7 follow-ups sent (Day 10)
- [ ] Closing conversations conducted
- [ ] Payment link sent to interested prospects

### 4.3 Customer Onboarding (4-6 hours)
- [ ] Payment received and verified
- [ ] Business assets collected
- [ ] Production site generated and deployed
- [ ] Onboarding call completed
- [ ] Welcome package sent

### 4.4 Review and Planning (2-3 hours)
- [ ] Metrics calculated and documented
- [ ] Retrospective completed
- [ ] Month 2 plan created
- [ ] Go/No-Go decision made

**Phase 4 Completion:** 1 paying customer closed, onboarded, and live ✅

---

## Success Metrics

### Week 1 (Foundation)
- [ ] Payment link ready
- [ ] Legal documents complete
- [ ] Hosting pipeline operational
- [ ] Analytics tracking

### Week 2 (Automation)
- [ ] Can generate demo site in < 30 minutes
- [ ] Can generate 20 leads in < 1 hour
- [ ] Outreach tracking system working
- [ ] Full pipeline tested end-to-end

### Week 3 (Pilot)
- [ ] 2-3 pilot demos sent
- [ ] At least 1 pilot conversation started
- [ ] Feedback collected
- [ ] SOP documented

### Week 4 (Launch)
- [ ] 10-15 outreach messages sent
- [ ] At least 3 conversations started
- [ ] 1 paying customer closed (RM 447 revenue)
- [ ] Customer onboarded and live

---

## Financial Summary

### One-time Costs
- Legal documents (optional lawyer review): RM 0-300
- **Total:** RM 0-310

### Monthly Recurring Costs (after first customer)
- Cloudflare (Pages + Workers + D1 + R2): RM 0 (free tier)
- Umami analytics (self-hosted): RM 0
- Google Places API: RM 0 (free tier)
- Razorpay transaction fees: ~RM 7 per RM 447 (1.5%)
- **Total:** RM 7/month

### Revenue Targets
- **Month 1:** RM 447-894 (1-2 customers)
- **Month 2:** RM 894-1,341 (2-3 customers)
- **Month 3:** RM 1,341-2,235 (3-5 customers)
- **Month 6:** RM 2,980-4,470 (10-15 customers)
- **Month 12:** RM 5,960-8,940 (20-25 customers)

---

## Risk Mitigation

### Risk 1: No responses to outreach
**Mitigation:**
- [ ] Refine message templates based on pilot feedback
- [ ] Test different times/days
- [ ] Expand lead criteria
- [ ] Consider Facebook group outreach as backup

### Risk 2: Can't close first customer
**Mitigation:**
- [ ] Offer extended trial (4 months for price of 3)
- [ ] Reduce price to RM 99/month for first 5 customers
- [ ] Offer one-time website option (RM 800) as alternative
- [ ] Get feedback on objections and address them

### Risk 3: Site generation takes too long
**Mitigation:**
- [ ] Simplify template system
- [ ] Use more AI assistance (Kimi for bulk generation)
- [ ] Reduce customization level
- [ ] Target < 2 hours per site by Month 2

### Risk 4: Technical issues with hosting/deployment
**Mitigation:**
- [ ] Test deployment pipeline thoroughly in Week 1
- [ ] Have backup hosting plan (Netlify free tier)
- [ ] Keep manual deployment option as fallback

---

## Decision Points

### End of Week 2
**Decision:** Continue to pilot or refine automation?
- [ ] If site generation takes > 1 hour → spend more time on automation
- [ ] If lead quality is poor → refine scraper criteria
- [ ] If everything works → proceed to pilot

### End of Week 3
**Decision:** Continue to launch or pivot?
- [ ] If pilot feedback is positive → proceed to launch
- [ ] If pilot feedback is negative → refine based on feedback, extend pilot
- [ ] If no pilot responses → reconsider target market or messaging

### End of Week 4
**Decision:** Continue current approach or pivot?
- [ ] If 1+ customer closed → continue, scale outreach
- [ ] If 0 customers but 3+ conversations → refine pitch, extend outreach
- [ ] If 0 conversations → major pivot needed (target market, pricing, or messaging)

---

## Quick Reference

### Key Files
- Master plan: `docs/plans/IMPLEMENTATION-PLAN.md`
- Phase 1: `docs/plans/phase-1-foundation.md`
- Phase 2: `docs/plans/phase-2-automation.md`
- Phase 3: `docs/plans/phase-3-pilot.md`
- Phase 4: `docs/plans/phase-4-launch.md`

### Key Commands
```bash
# Deploy client sites to preview
./scripts/deploy-preview.sh

# Generate lead batch
cd data/leads
node ../../packages/site-generator/scripts/process-leads.js leads-raw.json leads-processed.json

# Export outreach list
node ../../packages/site-generator/scripts/export-outreach-list.js leads-processed.json outreach.csv

# Generate demo site
cd packages/site-generator
node scripts/generate-all.js [business-id]

# Deploy via wrangler directly
npx wrangler pages deploy packages/site-generator/clients \
  --project-name=pintarweb-preview \
  --branch=main \
  --commit-dirty=true

# Check deployments
npx wrangler pages deployment list --project-name=pintarweb-preview

# Track outreach
node scripts/track-outreach.js [business-id] first_outreach
```

### Key URLs
- Razorpay: https://razorpay.com
- Cloudflare: https://dash.cloudflare.com/
- Preview site: https://preview.pintarweb.com/
- Analytics: https://analytics.pintarweb.com/

---

## Progress Tracking

### Week 1 Progress
- **Start date:** ___________
- **End date:** ___________
- **Hours spent:** _____
- **Cost:** RM _____
- **Status:** [ ] Not started [ ] In progress [ ] Complete

### Week 2 Progress
- **Start date:** ___________
- **End date:** ___________
- **Hours spent:** _____
- **Cost:** RM _____
- **Status:** [ ] Not started [ ] In progress [ ] Complete

### Week 3 Progress
- **Start date:** ___________
- **End date:** ___________
- **Hours spent:** _____
- **Cost:** RM _____
- **Status:** [ ] Not started [ ] In progress [ ] Complete

### Week 4 Progress
- **Start date:** ___________
- **End date:** ___________
- **Hours spent:** _____
- **Cost:** RM _____
- **Status:** [ ] Not started [ ] In progress [ ] Complete

---

## Final Checklist

### Before Starting
- [ ] Read all 5 plan documents (master + 4 phases)
- [ ] Set aside 5-10 hours/week for 4 weeks
- [ ] Prepare budget of RM 0-310
- [ ] Set up dedicated workspace
- [ ] Block time in calendar

### After Completion
- [ ] First customer closed and onboarded
- [ ] All systems operational
- [ ] SOPs documented
- [ ] Month 2 plan ready
- [ ] Ready to scale

---

**Last Updated:** 2026-06-29  
**Owner:** Yusmarin  
**Status:** Phase 1 COMPLETE ✅ — Phase 2 COMPLETE ✅ — Razorpay live, domain migrated, Umami tracking, sales funnel docs, message templates, demo SOP ready, outreach automation fully built with D1 tracking.

---

## Notes

Use this space to track important notes, learnings, and adjustments:

```
[Add your notes here as you progress through the plan]
```
