# PINTARWEB — Digital Subscription Services

## Business Plan
### Website-as-a-Service for Malaysian SMEs

**Trades & Contractor Niche** — Aircond, Renovation & Beyond

Prepared by: Yus | Selangor, Malaysia | 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem & Market Opportunity](#2-problem--market-opportunity)
3. [Business Model & Pricing](#3-business-model--pricing)
4. [Go-to-Market Strategy](#4-go-to-market-strategy)
5. [Value Proposition](#5-value-proposition)
6. [Operations & Tech Stack](#6-operations--tech-stack)
7. [Competitive Analysis](#7-competitive-analysis)
8. [Risk Analysis & Mitigation](#8-risk-analysis--mitigation)
9. [Financial Projections](#9-financial-projections)
10. [Growth Roadmap](#10-growth-roadmap)
11. [Immediate Action Plan (First 30 Days)](#11-immediate-action-plan-first-30-days)
12. [Conclusion](#12-conclusion)

---

## 1. Executive Summary

Pintarweb is a Website-as-a-Service (WaaS) company targeting Malaysian small and medium enterprises — specifically tradespeople and contractors in sectors such as aircond servicing, renovation, plumbing, and electrical. The business converts the traditional one-time website sale into a recurring subscription model, bundling a professionally built website with ongoing digital services including SEO/AIO optimisation, a content management system (CMS), booking management, and AI-powered web and voice chat.

The go-to-market strategy is built on a **build-first, pitch-second** approach: a customised demo website and audit report are prepared for each prospect before any sales conversation takes place. This lowers prospect resistance, demonstrates value immediately, and anchors the RM 800 website price — which is then used as a foil to present the subscription alternative as the financially sensible choice.

The target market is largely underserved. Most Malaysian SME tradespeople have no website, are dependent on word-of-mouth or social media, and lack the technical capacity to manage digital infrastructure independently. Pintarweb solves this with a hands-off, evergreen digital presence at a predictable monthly cost.

---

## 2. Problem & Market Opportunity

### 2.1 The Problem

The majority of Malaysian tradespeople and SME contractors operate without a proper web presence. Their digital footprint — if any — is limited to a Facebook page or a WhatsApp contact shared informally. This creates a compounding set of problems:

- No way for new customers to discover them through Google Search or Maps
- No professional credibility signal when potential clients research them
- Fully reliant on referrals — a fragile and unscalable growth channel
- No mechanism for capturing leads, managing bookings, or following up automatically
- Competitors with even a basic website capture the "Googled it" customer segment entirely

### 2.2 Why They Don't Already Have a Website

Most tradespeople understand they need a website. The barriers are not awareness — they are practical:

- One-time cost of RM 500–RM 2,000+ feels like a gamble with uncertain return
- Post-delivery, there is no support — they cannot update content or fix problems
- Agencies target larger businesses; freelancers are unreliable and hard to evaluate
- They don't have time to manage a website even if they had one

### 2.3 The Market

Malaysia has over 1.2 million registered SMEs. The trades and home services segment represents hundreds of thousands of micro and small operators — aircond technicians, renovation contractors, plumbers, electricians, pest control operators, and cleaning services. In the Klang Valley alone, Google Maps returns thousands of such businesses, the majority of which lack a dedicated website.

The addressable market for Pintarweb in Year 1 is conservatively scoped to Selangor and KL, targeting businesses with 1–15 employees who are active on WhatsApp but absent from Google Search.

### 2.4 Niche Priority Ranking

| Priority | Niche | Why First | Monthly Search Volume (Klang Valley) |
|----------|-------|-----------|--------------------------------------|
| **1** | Aircond & Contractor | High urgency, repeat jobs, Google intent is strong, existing pipeline ready | High (3,000–5,000 "aircond service near me") |
| **2** | Plumbing & Electrical | Similar urgency to aircond, service-area dependent | Medium-High |
| **3** | Renovation & Contractor | High-ticket, trust-driven, portfolio needed | Medium |
| **4** | Clinic / Dental / Aesthetic | Appointment-driven, lower churn, higher willingness to pay | Medium |
| **5** | Tuition & Enrichment | Parent-driven search, seasonal, lower urgency | Low-Medium |

**Recommendation**: Start with aircond only (pipeline exists), expand to plumbing/electrical by Month 4, renovation by Month 6, clinic by Month 9.

---

## 3. Business Model & Pricing

### 3.1 The Core Mechanism: Anchor & Pivot

The sales architecture is built around a deliberate pricing anchor. When approaching a prospect, Pintarweb presents the standalone website at RM 800 — a real, buildable price, not inflated. This sets the reference point. The subscription is then introduced as an alternative that costs less upfront, delivers more value, and includes the website at no charge.

This is not a bait-and-switch. The RM 800 option is a genuine offer. But the subscription is constructed to be obviously superior for any business owner who thinks beyond the immediate transaction.

### 3.2 Subscription Tiers (Phased Rollout)

| Tier | Monthly | Commitment | Includes | Auto-Replies/mo | Launch Phase |
|------|---------|------------|----------|-----------------|--------------|
| **Asas** | **RM 149** | 3 months advance (RM 447) | Website + Basic SEO + WhatsApp auto-reply bot + GMB optimisation | 30 | **Month 1 — Launch** |
| **Bisnes** | RM 299 | 3 months advance (RM 897) | Asas + Booking calendar + Review automation + Monthly analytics + Missed-call auto-reply | 100 | **Month 6 — Add** |
| **Pro** | RM 499 | 3 months advance (RM 1,497) | Bisnes + WhatsApp chatbot (quoting) + Voice AI agent + CRM sync + Priority support | Unlimited | **Month 12 — Add** |

**Asas is the only tier offered at launch.** Bisnes and Pro are added once the model is proven and revenue justifies building those features.

**Overage pricing:** RM 1 per auto-reply beyond tier cap. Voice agent (Pro only): 60 minutes included, RM 1.50/min beyond.

### 3.3 Pricing Rationale

| Decision | Reasoning |
|----------|-----------|
| RM 149/mo start | Covers one chemical wash job (RM180-350). "Satu job dah cover sebulan." Instant ROI proof. |
| 3 months advance | Reduces churn risk in early months, improves cash flow, filters unserious leads |
| Usage caps per tier | Protects margins on AI/voice costs. Clients self-select based on volume. |
| Price increases later | Once brand is established and case studies exist, raise to RM 179/349/599 |
| RM 800 anchor | High enough to make subscription look good, low enough to be believable |

### 3.4 AI Cost Protection & Margin Architecture

Variable AI costs per client must be contained within fixed subscription pricing. The following unit economics govern tier design:

**Variable cost per client per month:**

| Component | Asas | Bisnes | Pro |
|-----------|------|--------|-----|
| Cloudflare Pages hosting | ~RM 0 | ~RM 0 | ~RM 0 |
| WhatsApp auto-reply (template messages) | ~RM 3-8 | ~RM 8-20 | ~RM 15-30 |
| LLM API (chatbot / quoting) | ~RM 2-5 | ~RM 5-15 | ~RM 10-25 |
| Voice agent (Twilio/Vapi) | — | — | ~RM 30-80 |
| **Total variable cost** | **~RM 5-13** | **~RM 13-35** | **~RM 55-135** |
| **Gross margin** | **~91%** | **~88%** | **~73%** |

**Margin protection mechanisms:**

1. **Hard usage caps per tier.** Asas: 30 auto-replies/month. Bisnes: 100/month. Pro: unlimited. Overage billed at RM 1/reply.
2. **Voice agent as Pro-only add-on.** 60 minutes included, RM 1.50/min beyond. Self-selects usage.
3. **Model hierarchy — cheap first.** Basic quoting ("1.5HP wall unit chemical wash = RM180, nak book?") uses Llama 3.1 8B on Cloudflare Workers AI — near-zero cost. Reserve GPT-4o-mini / Claude for complex queries only.
4. **WhatsApp bot first, voice agent second.** WhatsApp messages cost fractions of a sen. Voice calls cost 30-80 sen/minute. Deploy WhatsApp auto-reply at Asas tier; voice agent only at Pro tier where margin supports it.

### 3.5 Revenue Architecture

The model generates two revenue streams:

| Stream | Source | Notes |
|--------|--------|-------|
| **Subscription MRR** | Monthly recurring fees | Primary revenue |
| **Add-on services** | Extra content updates, custom features, photography | Billed per-project, RM 50–500 |

### 3.6 Client Payment Flow

```
1. Demo & pitch → client chooses subscription
2. Send Billplz payment link — 3 months advance (RM 447 for Asas)
3. Payment confirmed → build begins
4. Site live within 5 working days
5. Monthly billing kicks in after advance period
6. Auto-renew via Billplz/Stripe with 3-day grace period
```

---

## 4. Go-to-Market Strategy

### 4.1 Build-First, Pitch-Second

The defining characteristic of Pintarweb's outreach approach is that the sales material — the demo website and audit report — is completed before the first contact is made with the prospect. This is the opposite of how most web agencies operate.

This approach has three strategic advantages:
- The prospect sees a real, personalised output — not a generic pitch deck or portfolio
- It demonstrates Pintarweb's capability in seconds, before the prospect has a reason to object
- It creates a psychological dynamic: "this was built for you, and you can have it today"

### 4.2 The Outreach Sequence

```
Prospect identified (Google Maps / lead list)
    ↓
Audit report prepared (online presence gaps + missed opportunities)
    ↓
Basic demo website built (intake form → config.json → generated site)
    ↓
Initial WhatsApp contact: "Hi [name], I prepared a quick audit of your
online presence. Got a demo site too. Free — just wanted to show you."
    ↓
Demo share (PDF / link / screenshot) — 5-min review
    ↓
Pitch: "Two options — RM 800 for the website, or RM 149/mo with everything."
    ↓
Close: "Try 3 months at RM 149, if you don't see results, cancel."
    ↓
Onboard: domain, GMB, billing, 20-min training call
```

### 4.3 Marketing Scripts

**Initial WhatsApp outreach (after audit + demo built):**
> "Hi [Name], saya sempat buatkan audit online presence untuk bisnes awak. Saya nampak ada peluang untuk dapat lebih pelanggan dari Google. Siap buatkan demo website sekali. Free je — nak saya tunjuk? Ambil 2 minit je."

**Pitch (after client sees the demo):**
> "Dua pilihan:
> - **RM 800** — website ni jadi milik awak, sekali bayar
> - **RM 149/sebulan** — bayar 3 bulan dulu (RM 447), website free, saya uruskan SEO, auto-reply WhatsApp, booking. Batal lepas 3 bulan kalau tak puas hati.
>
> Paling ramai pilih RM 149 sebab auto-reply WhatsApp je dah boleh cover balik modal — bila awak tengah atas bumbung fix compressor, bot reply customer terus."

**Objection: "Mahal juga RM 149 sebuah"**
> "Faham. Tapi cuba tengok — satu job chemical wash RM 180-350. Website ni kalau dapat 1 customer baru sebulan pun dah cover. Average contractor tanpa website hilang 3-5 call sehari sebab tengah kerja. Auto-reply bot tangkap lead tu sebelum dia call competitor."

**Objection: "Nak fikir dulu"**
> "Okay, take your time. Demo still live. Tapi saya nak share satu benda — tahun lepas Facebook tukar algorithm, post bisnes kecil drop 40-60%. Customer yang awak ada dalam Facebook sekarang, bukan customer awak. Customer awak = orang yang search 'aircond service Cheras' kat Google. Website = awak control, bukan Zuckerberg."

**Follow-up (Day 7 if no response):**
> "Send je demo website ni — https://preview.pintarweb.com/clients/[id]/ — tengok dulu. Saya follow-up minggu depan. Takpe kalau belum berminat lagi."

### 4.4 Channels

| Channel | Strategy | Cost |
|---------|----------|------|
| **WhatsApp direct outreach** | Primary channel — familiar to all target SMEs | Free |
| **Google Maps prospecting** | Identify businesses without websites, no rating filter | Free |
| **Facebook Groups** | Local contractor and trader community groups | Free |
| **Referral programme** | Existing clients refer → 1 month free for referrer | RM 149/client |
| **Demonstration effect** | Live client websites as passive marketing | Free |

### 4.5 Retention Mechanics

| Time | Action | Goal |
|------|--------|------|
| **Week 1** | Onboarding call + GMB verification | Strong start, reduce confusion |
| **Month 1** | Site live confirmation + first lead check | Show early value |
| **Month 3** | First quarterly review — leads, calls, bookings data | Prove ROI, justify renewal |
| **Month 4** | Renewal conversation (next 3 months) | Lock in |
| **Month 6** | Upsell to Bisnes tier based on usage data | Increase ARPU |
| **Month 12** | Annual review + reference request | Case study, referral |

---

## 5. Value Proposition

### 5.1 For the Client: Why Subscription Beats Paying RM 800

| Factor | RM 800 One-Time | RM 149/mo (3-mo advance) |
|--------|-----------------|--------------------------|
| Upfront cost | RM 800 | RM 447 |
| Website included | Yes | Yes (free) |
| SEO / Google visibility | No | Yes |
| WhatsApp auto-reply bot | No | Yes |
| Booking system | No | Yes |
| Content updates | No | Included |
| Support | No (handover only) | Ongoing |
| Future upgrades | Rebuild from scratch | Automatic |
| Total Year 1 | RM 800 (no ongoing value) | RM 1,788 (full digital presence) |

### 5.2 The 5 Pillars of Subscription Value

1. **No large upfront investment** — RM 447 vs RM 800 = cash flow-friendly for micro businesses
2. **Immediate ROI** — the website + auto-reply bot starts generating leads from Day 1
3. **Hands-off management** — client focuses on their trade, not their website
4. **Ongoing growth engine** — SEO, AIO, and content compound over time
5. **Scalability** — services expand as the business grows, no need to re-engage an agency

---

## 6. Operations & Tech Stack

### 6.1 Website Production Stack

Each client website is built on a standardised but personalised stack designed for fast production and low maintenance overhead:

| Component | Approach | Rationale |
|-----------|----------|-----------|
| **Website** | HTML + Tailwind CSS (CDN) | Build in-house — pipeline already exists, zero dependency cost |
| **Hosting** | Cloudflare Pages | Free tier, fast CDN, built-in SSL |
| **Database / Storage** | Cloudflare D1 + R2 | Pay-as-you-go, minimal cost at scale |
| **AI copy** | Kimi + Claude | Low-cost AI-assisted content generation |
| **Booking** | Build in-house (lightweight) | Custom, WhatsApp-integrated, zero monthly cost |
| **Chat widget** | Build in-house | Simple branded widget, no recurring fees |
| **Voice AI** | Twilio + OpenAI (Pro only) | Third-party, only for highest tier |
| **CRM** | Airtable / Notion (start) | Free or low-cost, flexible for solo operation |
| **Billing** | Billplz (+ Stripe later) | Local FPX support, minimal transaction fees |
| **Analytics** | Umami (self-hosted) | Free, privacy-friendly, no recurring cost |

### 6.2 Client Onboarding Process

```
1. Agreement signed + 3-month advance payment received
2. Client provides photos, logo, key information (via intake form or WhatsApp)
3. Demo site generated and reviewed with client — minor adjustments
4. Domain connected (or subdomain), site published to Cloudflare Pages
5. Google Business Profile optimised
6. Onboarding call (20 min) — show client how website works
7. Day 14 check-in — confirm everything is live
```

### 6.3 Ongoing Service Delivery

The operational model is designed for scale at minimal marginal cost per client:

- **SEO/AIO updates** are batched monthly — typically 1–2 hours across 10 clients
- **Booking system** requires minimal intervention once configured
- **AI chat** is pre-trained on the business's services and FAQ — self-managing after setup
- **Content updates** are handled on request; included up to 2 per month
- **Monthly performance reports** — automated with simple dashboard template

### 6.4 Build vs Buy Decision Framework

| Build In-House | Buy (Existing Tool) | Defer |
|----------------|---------------------|-------|
| Website generation pipeline | Domain registration (Cloudflare) | Voice AI (Pro tier only) |
| Booking system (lightweight + WhatsApp) | Payment processing (Billplz) | CRM automation |
| Chat widget | Analytics (Umami self-hosted) | Advanced AIO features |
| Intake form → config.json tool | AI copy (Anthropic/OpenAI APIs) | White-label mobile app |
| Audit report generator | Cloudflare infrastructure | Multi-language content |

---

## 7. Competitive Analysis

### 7.1 Competitive Landscape

| Competitor | Model | Pricing | Weakness Pintarweb Exploits |
|------------|-------|---------|----------------------------|
| **Freelance web designers** | One-time build | RM 500–RM 2,000 | No ongoing support, no SEO, no booking |
| **Template agencies (Wix/WordPress shops)** | One-time + hosting | RM 1,000–RM 3,000 | Template feels generic, slow, no AI features |
| **DIY platforms (Wix, Shopify, Carrd)** | Self-service | RM 30–RM 100/mo | Zero support, tradespeople don't have time or skill |
| **Social media only (no website)** | Informal | Free | No Google presence, no booking, looks unprofessional |
| **SEO/Ads agencies** | Monthly retainer | RM 500–RM 2,500/mo | Overkill for micro-SMEs, too expensive |

### 7.2 Key Differentiators

| Differentiator | Why It Wins |
|----------------|-------------|
| **Niche focus** | Built specifically for trades and contractors, not generic SMEs |
| **Pre-built demo** | Prospect sees their own website before agreeing to anything |
| **Subscription model with 3-mo advance** | No large upfront cost, cash flow friendly, filters serious clients |
| **AI-powered services** | Web chat, AIO optimisation — features agencies charge RM 500+/mo for |
| **Build-first approach** | Demonstrates value before asking for commitment |
| **Solo efficiency** | Low overhead means competitive pricing without compromising quality |

---

## 8. Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Client churn after 3 months** | High | High | Lock in with advance payment + show ROI data before renewal |
| **Subscription fatigue (SMEs)** | High | Medium | Keep RM 149 tier positioned as "less than one chemical wash job"; upsell only when value is proven |
| **Support burden grows with clients** | Medium | Medium | Automate tier-1 (FAQs, chat); batch monthly maintenance |
| **Competition drops prices** | Medium | Medium | Compete on quality + outcomes, not price; niche focus |
| **Difficulty acquiring first 10 clients** | High | High | Run free pilots for first 5, use case studies to sell next 10 |
| **Tech build takes longer than expected** | Medium | Medium | Ship with minimum viable booking/chat first, iterate later |
| **Cash flow strain from slow sales** | Medium | High | 3-month advance mitigates; keep personal costs lean |

### Go/No-Go Criteria (Month 4 Review)

| Metric | Threshold | Action if Missed |
|--------|-----------|------------------|
| Active subscribers | ≥ 3 | Re-assess pricing or niche focus |
| Demo-to-close rate | ≥ 30% | Fix pitch, audit quality, or target segment |
| Monthly churn | < 10% | Improve onboarding and support |
| Build time per site | < 6 hours | Further systematise generation pipeline |
| Client satisfaction | NPS ≥ 40 | Address common complaints |

**If 3 out of 5 miss**: Pivot — change pricing, niche, or approach.

---

## 9. Financial Projections

### 9.1 Cost Structure (Solo Founder)

| Category | Monthly Cost | Notes |
|----------|-------------|-------|
| Cloudflare Pages / R2 / D1 | RM 0–10 | Free tier covers first 50+ sites |
| Domain registration | RM 0 (passed to client) | Client pays or included in subscription |
| Billplz transaction fees | ~1.5% | ~RM 2.24 per RM 149 transaction |
| AI API costs (copy, chat, auto-reply) | RM 20–80 | Per-client cost: Asas ~RM 5-13, Bisnes ~RM 13-35, Pro ~RM 55-135 |
| Umami analytics (self-hosted) | RM 0 | Free on existing VPS or Cloudflare |
| Google Workspace / email | RM 12 | Professional email for Pintarweb |
| Marketing / ads | RM 0–100 | Organic first, small ad budget later |
| **Total monthly overhead** | **~RM 50–170** | Extremely lean |

### 9.2 Revenue Projections (Conservative)

**Assumptions**:
- Solo operation by Yus with AI-assisted website production
- Asas tier only (RM 149/mo, 3-month advance = RM 447 upfront per client)
- 5% monthly churn after the initial 3-month commitment
- No Bisnes or Pro tiers in Year 1
- Higher price = slightly slower acquisition (1-2 new clients/month vs 3-4 at RM 99)

| Month | New Clients | Total Active | MRR (RM) | Upfront Cash (RM) | Cumul. Revenue (RM) |
|-------|-------------|--------------|----------|--------------------|-----------------------|
| 1 | 1 | 1 | 149 | 447 | 447 |
| 2 | 2 | 3 | 447 | 894 | 1,341 |
| 3 | 2 | 5 | 745 | 894 | 2,235 |
| 4 | 2 | 7 | 1,043 | 894 | 3,129 |
| 5 | 2 | 9 | 1,341 | 894 | 4,023 |
| 6 | 2 | 11 | 1,639 | 894 | 4,917 |
| 7 | 2 | 13 | 1,937 | 894 | 5,811 |
| 8 | 2 | 14 | 2,086 | 894 | 6,705 |
| 9 | 2 | 16 | 2,384 | 894 | 7,599 |
| 10 | 2 | 18 | 2,682 | 894 | 8,493 |
| 11 | 2 | 19 | 2,831 | 894 | 9,387 |
| 12 | 2 | 21 | 3,129 | 894 | 10,281 |

**MRR by Month 12: ~RM 3,129**
**Total first-year revenue: ~RM 10,281 (including upfront advances)**
**Break-even: Month 2–3 (at ~3 active subscribers = RM 447 MRR)**

**Key insight:** 21 clients at RM 149/mo generates more revenue than 33 clients at RM 99/mo (RM 3,129 vs RM 3,267) — with 36% fewer clients to support, lower churn, and room to upsell into Bisnes/Pro tiers.

### 9.3 Upside Scenario (If Bisnes tier added Month 6)

| Month | Asas | Bisnes | MRR |
|-------|------|--------|-----|
| 6 | 9 @ RM 149 | 2 @ RM 299 | RM 1,937 |
| 12 | 15 @ RM 149 | 6 @ RM 299 | RM 4,029 |

### 9.4 Key Metrics Dashboard

| Metric | Month 6 Target | Month 12 Target |
|--------|---------------|-----------------|
| Monthly Recurring Revenue (MRR) | RM 1,600 | RM 3,000+ |
| Active subscribers | 11 | 21 |
| Client churn rate | < 8% | < 5% |
| Demo-to-close rate | ≥ 30% | ≥ 35% |
| Average Revenue Per User (ARPU) | RM 149 | RM 149 (Asas) |
| Build time per site | < 4 hours | < 3 hours |

---

## 10. Growth Roadmap

### 10.1 Phase 1: Foundation (Month 1–2)

- [ ] Finalise intake form → config.json → site pipeline
- [ ] Build Asas tier with minimum viable features (website + SEO basics + WhatsApp auto-reply bot)
- [ ] Create audit report template (auto-generated from config)
- [ ] Set up Billplz for recurring billing
- [ ] Legal: subscription agreement, PDPA compliance, SLA
- [ ] Run 2–3 free pilots with known leads
- [ ] Document build process and measure time per site

### 10.2 Phase 2: Launch & Validate (Month 3–4)

- [ ] Launch publicly — WhatsApp outreach to 20–30 prospects
- [ ] Target: 3 paid subscribers by end of Month 4 (go/no-go threshold)
- [ ] Build first 2 case studies (before/after leads)
- [ ] Measure and optimise: build time, pitch scripts, churn
- [ ] Deploy WhatsApp auto-reply bot as Day 1 feature (not just static site)
- [ ] Review go/no-go criteria

### 10.3 Phase 3: Refine & Grow (Month 5–8)

- [ ] Launch Bisnes tier (RM 299/mo) with booking calendar + review automation + missed-call auto-reply
- [ ] Target: 11–15 subscribers
- [ ] Introduce referral programme (1 month free for referrer)
- [ ] Build in-house chat widget
- [ ] Automate monthly performance reports
- [ ] Expand niche — test plumbing/electrical

### 10.4 Phase 4: Scale (Month 9–12)

- [ ] Target: 21 subscribers
- [ ] Launch Pro tier (RM 499/mo) with voice AI + priority support
- [ ] Hire first support/onboarding specialist (part-time)
- [ ] Build partnership pipeline (referral from hardware suppliers, property agents)
- [ ] Evaluate: build CRM feature vs import existing tools

---

## 11. Immediate Action Plan (First 30 Days)

| Week | Tasks | Deliverable |
|------|-------|-------------|
| **Week 1** | 1. Finalise intake form (done) | Working intake form → config.json |
| | 2. Build 1 template site with Starter features | Template site (.html) |
| | 3. Set up Billplz merchant account | Payment link ready |
| | 4. Draft subscription agreement (lawyer-reviewed if possible) | Contract template |
| **Week 2** | 1. Run 2 free pilots with existing leads | 2 pilot sites live |
| | 2. Refine build process based on pilot feedback | Documented SOP |
| | 3. Create audit report template | Reusable report format |
| | 4. Set up Umami analytics | Analytics dashboard |
| **Week 3** | 1. Prepare outreach list (10–15 prospects) | Lead list |
| | 2. Build demo sites for all prospects | 10–15 demo sites |
| | 3. First WhatsApp outreach batch | 10 messages sent |
| **Week 4** | 1. Follow up on outreach | Conversations active |
| | 2. Close first paid subscriber | 1 subscriber @ RM 447 |
| | 3. Review and iterate everything | Lessons documented |

---

## 12. Conclusion

Pintarweb sits at the intersection of two powerful trends: the increasing digital expectation of Malaysian consumers and the chronic underinvestment in digital infrastructure by SME tradespeople. The gap between "needs a website" and "has a working, maintained digital presence" is enormous — and largely uncontested.

The subscription model is the right vehicle. It removes the primary barrier (upfront cost), creates predictable recurring revenue, and builds a long-term relationship that compounds in value as the client's business grows. The anchor-and-pivot sales approach is psychologically sound and practically executable at solo scale.

The pricing strategy — RM 149/mo with 3-month advance — is deliberately positioned to capture value while remaining accessible. At less than the cost of one chemical wash job, the subscription pays for itself with a single converted lead. The tiered structure (Asas/Bisnes/Pro) allows clients to start simple and grow into advanced automation features as their business scales.

The build-first model, powered by AI-assisted website production, means Pintarweb's cost of acquisition is primarily time — and with each iteration, that time decreases. By Month 6, a skilled founder can move from prospect identification to a live demo site in under 3 hours.

The tech stack is lean by design. Build what matters (website pipeline, auto-reply bot, booking). Buy what's complex (payment processing, voice AI). Defer what's unnecessary (mobile app, CRM automation). This keeps costs near zero until revenue justifies investment.

This is a business with structural advantages: low overhead, high recurring margins, a defensible niche, and a product that delivers clear, measurable value to clients who have never experienced professional digital services. The path to RM 3,000+ MRR in Year 1 is a matter of execution, not validation.

---

*Pintarweb | Selangor, Malaysia | 2026*
