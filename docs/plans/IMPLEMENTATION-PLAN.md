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
- [ ] Razorpay merchant account created
- [ ] Bank account linked and verified
- [ ] Payment link template for RM 447 (3-month advance)
- [ ] Test payment completed
- [ ] Payment confirmation workflow documented

**Estimated Time:** 2-3 hours  
**Cost:** Free (Razorpay takes 1.5% transaction fee)

#### 1.2 Legal Documents
- [ ] Subscription agreement template drafted
- [ ] Terms of service created
- [ ] Privacy policy (PDPA compliance) created
- [ ] Documents reviewed (lawyer optional but recommended)
- [ ] Document storage system (Google Drive or similar)

**Estimated Time:** 3-4 hours  
**Cost:** RM 0-300 (lawyer review optional)

#### 1.3 Cloud Hosting Pipeline
- [ ] Cloudflare Pages project created (pintarweb-preview)
- [ ] Custom domain configured (preview.pintarweb.com)
- [ ] DNS records set up
- [ ] R2 bucket created (pintarweb-assets)
- [ ] GitHub repository connected for auto-deploy
- [ ] Test deployment successful

**Estimated Time:** 2-3 hours  
**Cost:** Free (Cloudflare free tier)

#### 1.4 Analytics Setup
- [ ] Umami analytics deployed (self-hosted on Cloudflare Workers or VPS)
- [ ] Tracking script created
- [ ] Dashboard access configured
- [ ] Test tracking verified

**Estimated Time:** 2-3 hours  
**Cost:** Free (self-hosted) or RM 5-10/month (VPS)

**Total Phase 1 Time:** 9-13 hours  
**Total Phase 1 Cost:** RM 0-310

---

## Phase 2: Automation (Week 2)

### Goals
- Site generation fully automated
- Lead pipeline operational
- Can generate demo sites in < 30 minutes

### Deliverables

#### 2.1 Site Generation Script
- [ ] Script to generate index.html from config.json
- [ ] Script to generate audit.html from config.json
- [ ] Script to generate report.html from config.json
- [ ] Image optimization pipeline (resize, convert to WebP)
- [ ] Template system for different niches (aircond, plumbing, etc.)
- [ ] Test with 3 different client configs

**Estimated Time:** 8-12 hours  
**Cost:** RM 0 (development time)

#### 2.2 Lead Pipeline
- [ ] Scraper output → lead selection criteria documented
- [ ] Google Places API integration for audit data
- [ ] Lead prioritization algorithm (score based on: no website, low rating, search volume)
- [ ] Lead export to outreach list format
- [ ] Test with 20 leads from scraper

**Estimated Time:** 6-8 hours  
**Cost:** RM 0 (Google Places API free tier: 100 requests/day)

#### 2.3 Outreach Tracking
- [ ] Outreach event tracking in D1 database
- [ ] Open/click tracking on report URLs
- [ ] Follow-up reminder system (manual or automated)
- [ ] CRM setup (Airtable or Notion free tier)
- [ ] Lead status workflow: New → Contacted → Demo Sent → Follow-up → Closed

**Estimated Time:** 4-6 hours  
**Cost:** Free (Airtable/Notion free tier)

#### 2.4 WhatsApp Integration (Manual for Phase 1)
- [ ] WhatsApp Business app installed (or use personal WhatsApp)
- [ ] Outreach message templates created
- [ ] Follow-up message templates created
- [ ] Response tracking system
- [ ] Test outreach to 5 contacts

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

#### 3.1 Pilot Execution
- [ ] Select 2-3 pilot prospects (from existing leads or personal network)
- [ ] Generate demo sites for all pilots
- [ ] Send outreach messages
- [ ] Conduct follow-up conversations
- [ ] Collect feedback on demo quality and pitch
- [ ] Iterate on process based on feedback

**Estimated Time:** 8-12 hours  
**Cost:** RM 0 (free pilots)

#### 3.2 Process Documentation
- [ ] SOP for lead generation (scraper → selection → outreach)
- [ ] SOP for site generation (config → demo → report)
- [ ] SOP for outreach (message templates, timing, follow-up)
- [ ] SOP for closing (payment, onboarding, site handover)
- [ ] Time tracking per pilot (target: < 2 hours per deliverable)

**Estimated Time:** 4-6 hours  
**Cost:** RM 0

#### 3.3 Quality Refinement
- [ ] Design system refined based on pilot feedback
- [ ] Copy rules updated
- [ ] Audit scoring calibrated
- [ ] Report template improved
- [ ] Mobile responsiveness verified

**Estimated Time:** 4-6 hours  
**Cost:** RM 0

**Total Phase 3 Time:** 16-24 hours  
**Total Phase 3 Cost:** RM 0

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
- [ ] Send first batch of outreach messages (5-7)
- [ ] Track responses and opens
- [ ] Send follow-ups to non-responders
- [ ] Conduct conversations with interested prospects
- [ ] Pitch subscription model (RM 149/month, 3-month advance)
- [ ] Close first customer

**Estimated Time:** 8-12 hours  
**Cost:** RM 0

#### 4.3 Customer Onboarding (First Customer)
- [ ] Send Razorpay payment link
- [ ] Receive payment confirmation
- [ ] Collect client assets (logo, photos, business info)
- [ ] Generate final production site
- [ ] Set up domain (client's domain or subdomain)
- [ ] Configure Google Business Profile
- [ ] Conduct 20-minute onboarding call
- [ ] Send welcome package (login details, support contact)

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
- Razorpay transaction fees: ~RM 7 per RM 447 (1.5%)
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
- [Phase 2: Automation - Detailed Plan](./phase-2-automation.md)
- [Phase 3: Pilot - Detailed Plan](./phase-3-pilot.md)
- [Phase 4: Launch - Detailed Plan](./phase-4-launch.md)

---

**Last Updated:** 2026-06-23  
**Owner:** Yusmarin  
**Status:** Ready to execute
