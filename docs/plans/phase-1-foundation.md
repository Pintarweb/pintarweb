	# Phase 1: Foundation - Detailed Implementation Plan

## Overview

Phase 1 sets up the legal, payment, and infrastructure foundation for Pintarweb. By the end of this phase, you can accept payments, have legal protection, and deploy client sites.

**Duration:** Week 1 (5-10 hours)  
**Cost:** RM 0-310  
**Success Criteria:** Can accept first customer payment and deploy their site

---

## 1.1 Payment Processing Setup (Razorpay)

### Why Razorpay (formerly Curlec)?
- Malaysian-focused (supports FPX, DuitNow, credit cards, e-wallets)
- Low transaction fees (1.5% FPX, 2.5% cards)
- No monthly fees
- Excellent API for automation
- Recurring billing support for subscriptions
- Direct debit option (lower fees)
- Fast payouts (T+1 day)
- Local Malaysian support

### Step-by-Step Setup

#### Step 1: Create Razorpay Account
1. Go to https://dashboard.razorpay.com/signup
2. Click "Sign Up"
3. Choose account type: **Individual** or **Sole Proprietor**
4. Fill in details:
   - Business name: Pintarweb
   - Business category: Services / IT Services
   - Your name: Yusmarin
   - Email: yusmarin@gmail.com, 
   - Phone number
   - Password
5. Verify email address
6. Complete KYC:
   - Upload IC (front and back)
   - Upload bank statement or cancelled cheque
   - Provide PAN card (if applicable) or business registration
7. Submit application
8. Wait for approval (usually 1-2 business days)

**Time:** 30 minutes  
**Cost:** Free

#### Step 2: Configure Payment Methods
1. Log in to Razorpay Dashboard
2. Go to **Settings** → **Payment Methods**
3. Enable payment methods:
   - ✅ **Cards** (Credit/Debit) - 2.5% fee
   - ✅ **Netbanking** (FPX) - 1.5% fee
   - ✅ **UPI** (DuitNow) - 1.5% fee
   - ✅ **Wallets** (Touch 'n Go, GrabPay, etc.) - 2% fee
4. Configure settlement preferences:
   - Settlement cycle: Daily (T+1)
   - Bank account: Add your Malaysian bank account
5. Save settings

**Time:** 15 minutes  
**Cost:** Free

#### Step 3: Link Bank Account
1. Go to **Settings** → **Settlements** → **Bank Accounts**
2. Click "Add Bank Account"
3. Enter details:
   - Account holder name (must match your IC/registration)
   - Account number
   - Bank name
   - IFSC code (for Malaysian banks)
4. Razorpay will make 2 small test deposits (RM 1.00 - RM 2.00)
5. Check your bank statement (1-2 business days)
6. Verify the amounts in Razorpay dashboard

**Time:** 10 minutes + 1-2 days for verification  
**Cost:** Free

#### Step 4: Create Payment Link Template
1. Go to Razorpay Dashboard → **Payment Links**
2. Click "Create New Link"
3. Fill in details:
   - **Title:** Pintarweb Subscription - 3 Months Advance
   - **Description:** Website-as-a-Service subscription for 3 months. Includes website, SEO, WhatsApp auto-reply, and GMB optimization.
   - **Amount:** RM 447.00
   - **Currency:** MYR
   - **Reference:** PWT-001 (auto-generated or manual)
   - **Customer details:** Optional (can be filled by customer)
4. Enable recurring payment (for future subscriptions)
5. Save the link
6. Test the link by opening it in a new browser tab
7. Verify it shows correct amount and description

**Time:** 15 minutes  
**Cost:** Free

#### Step 5: Test Payment
1. Use the payment link you created
2. Enter test details:
   - Name: Test Customer
   - Email: test@example.com
   - Phone: 0123456789
3. Choose payment method: Netbanking (FPX) or Card
4. Complete the payment (use small amount, then refund)
5. Verify payment appears in Razorpay Dashboard → **Payments**
6. Verify settlement will occur in your bank account

**Time:** 10 minutes  
**Cost:** RM 0 (refund the test payment)

#### Step 6: Set Up Recurring Billing (Optional)
For automatic subscription renewals:
1. Go to **Settings** → **Subscriptions**
2. Create a subscription plan:
   - **Plan name:** Pintarweb 3-Month Plan
   - **Amount:** RM 447.00
   - **Frequency:** Every 3 months
   - **Trial period:** None
3. Save the plan
4. When creating payment links, you can now offer:
   - One-time payment: RM 447
   - Subscription: Auto-renew every 3 months

**Time:** 20 minutes  
**Cost:** Free

#### Step 7: Document Payment Workflow
Create a simple document (Google Doc or Notion) with:
- How to create a new payment link for a customer
- How to customize the reference (e.g., PWT-001, PWT-002)
- How to check payment status
- How to issue refunds (if needed)
- How to view transaction history
- How to set up recurring billing for customers

**Time:** 20 minutes  
**Cost:** Free

### Checklist
- [x] Razorpay account created and approved
- [x] KYC completed
- [x] Bank account linked and verified
- [x] Payment methods configured (FPX, Cards, UPI, Wallets)
- [x] API keys configured in .env
- [x] Payment link creation script ready (`scripts/create-payment-link.sh`)
- [ ] Test payment completed successfully
- [ ] Recurring billing set up (optional, for later)
- [x] Payment workflow documented

### Resources
- Razorpay API docs: https://razorpay.comapi
- Razorpay support: support@razorpay.com

---

## 1.2 Legal Documents (Clickwrap — No Signatures)

### Why Clickwrap?
- No physical signatures needed
- Legally valid under Malaysia's Electronic Commerce Act 2006
- Customer accepts terms by completing payment
- Common practice (Shopee, Grab, all use clickwrap)
- Zero friction for customer

### Step-by-Step Setup

#### Step 1: Create Terms of Service Page

Create `packages/site-generator/terms.html` (hosted at preview.pintarweb.com/terms).

**Key Sections:**
1. **Services:** What's included (website, SEO, auto-reply, GMB)
2. **Pricing Structure:**
   - **Initial:** RM 447 (3-month advance, RM 149/month)
   - **Monthly renewal:** RM 149/month (auto-debit)
   - **Quarterly:** RM 417/3 months (save RM 30)
   - **Bi-Annual:** RM 774/6 months (save RM 120)
   - **Annual:** RM 1,308/12 months (save RM 480)
3. **Payment Terms:** Auto-renewal, cancellation (14 days notice)
4. **Customer Obligations:** Provide info, respond within 7 days
5. **Pintarweb Obligations:** Build/maintain site, 48hr support response
6. **Limitation of Liability:** Cap at 3 months fees (RM 447)
7. **PDPA Privacy Notice:** Data collection, usage, rights
8. **Governing Law:** Malaysia

**Time:** 1-2 hours

#### Step 2: Configure Razorpay Payment Link with Clickwrap

When creating the Razorpay payment link:

1. Go to Razorpay Dashboard → Payment Links → Create New Link
2. In the description, add:
   ```
   Dengan membuat pembayaran ini, anda bersetuju dengan
   Terma Perkhidmatan Pintarweb:
   https://preview.pintarweb.com/terms
   ```
3. Enable "Terms and Conditions" checkbox if available
4. Save the link

**Time:** 5 minutes

#### Step 3: Send WhatsApp Confirmation After Payment

After payment received, send:

```
Terima kasih! Payment RM 447 dah diterima.

Dengan membuat pembayaran ini, anda telah menerima
Terma Perkhidmatan Pintarweb.

Terma penuh: https://preview.pintarweb.com/terms

Ringkasan:
- RM 149/bulan, 3 bulan advance (RM 447)
- Selepas 3 bulan, auto-renew setiap bulan (RM 149/bulan)
- Boleh upgrade ke Quarterly (RM 417/3mo), Bi-Annual (RM 774/6mo), atau Annual (RM 1,308/12mo) untuk jimat
- Boleh batal dengan 14 hari notis
- Website, SEO, WhatsApp auto-reply, GMB optimisation included

Ada soalan? WhatsApp saya.
```

**Time:** 5 minutes per customer

#### Step 4: Store Documents

Create folder structure:
```
Pintarweb/
├── Legal/
│   ├── Terms-of-Service.md
│   └── Privacy-Policy.md
```

Use Google Drive, Dropbox, or Notion for easy access.

**Time:** 10 minutes

### Checklist
- [ ] Subscription agreement drafted
- [ ] Terms of service created
- [ ] Privacy policy (PDPA compliant) created
- [ ] Documents reviewed (lawyer optional)
- [ ] Documents stored in organized folder

### Resources
- PDPA Malaysia: https://www.pdpa.gov.my/
- Free legal templates: https://www.legalzoom.com/
- Lawyer review (optional): RM 200-300

---

## 1.3 Cloud Hosting Pipeline

### Why Cloudflare Pages?
- Free tier includes unlimited bandwidth
- Auto-deploy from GitHub
- Global CDN (fast worldwide)
- Custom domain support
- Integrated with Cloudflare Workers

### Step-by-Step Setup

#### Step 1: Create Cloudflare Pages Project
1. Log in to Cloudflare dashboard: https://dash.cloudflare.com/
2. Go to Workers & Pages → Pages
3. Click "Create a project"
4. Choose "Connect to Git"
5. Select your GitHub account
6. Choose repository: `Pintarweb/pintarweb`
7. Configure build settings:
   - **Framework preset:** None
   - **Build command:** (leave empty for now)
   - **Build output directory:** `packages/site-generator/clients`
8. Click "Save and Deploy"
9. Wait for deployment (2-3 minutes)

**Time:** 15 minutes  
**Cost:** Free

#### Step 2: Configure Custom Domain
1. In Cloudflare Pages project, go to Custom domains
2. Click "Set up a custom domain"
3. Enter domain: `preview.pintarweb.com`
4. Cloudflare will check if domain is already in your account
5. If not, add domain to Cloudflare:
   - Go to Domains → Add a site
   - Enter: `pintarweb.com`
   - Choose free plan
   - Update nameservers at your registrar (Namecheap, GoDaddy, etc.)
6. Wait for DNS propagation (5 minutes to 24 hours)
7. Once domain is active, create CNAME record:
   - Type: CNAME
   - Name: preview
   - Target: `your-project.pages.dev` (from step 1)
   - Proxy status: Proxied (orange cloud)
8. Save and wait for SSL certificate (1-2 minutes)

**Time:** 30 minutes + DNS propagation  
**Cost:** Free (domain registration if needed: RM 50-100/year)

#### Step 3: Create R2 Bucket
1. Go to R2 Object Storage in Cloudflare dashboard
2. Click "Create bucket"
3. Bucket name: `pintarweb-assets`
4. Region: Auto (closest to you)
5. Click "Create bucket"
6. Note the bucket ID for later use

**Time:** 5 minutes  
**Cost:** Free (10 GB/month free, then RM 0.015/GB)

#### Step 4: Test Deployment
1. In your local monorepo, create a test client:
   ```bash
   cd packages/site-generator/clients
   mkdir test-deployment
   echo "<h1>Test Deployment</h1>" > test-deployment/index.html
   ```
2. Commit and push:
   ```bash
   git add .
   git commit -m "test: deployment pipeline"
   git push origin master
   ```
3. Wait for Cloudflare Pages to auto-deploy (2-3 minutes)
4. Visit: https://preview.pintarweb.com/test-deployment/
5. Verify page loads correctly

**Time:** 15 minutes  
**Cost:** Free

#### Step 5: Document Deployment Workflow
Create a document with:
- How to deploy a new client site
- How to update an existing site
- How to check deployment status
- How to roll back if needed
- Troubleshooting common issues

**Time:** 20 minutes  
**Cost:** Free

### Checklist
- [x] Cloudflare Pages project created (`pintarweb-preview`)
- [x] Custom domain configured (preview.pintarweb.com)
- [x] DNS records set up and propagated
- [x] R2 bucket created (pintarweb-assets)
- [x] GitHub auto-deploy configured
- [x] Test deployment successful
- [x] Deployment workflow documented (see `docs/deployment-workflow.md`)

### Resources
- Cloudflare Pages docs: https://developers.cloudflare.com/pages/
- Cloudflare R2 docs: https://developers.cloudflare.com/r2/
- DNS setup guide: https://developers.cloudflare.com/dns/

---

## 1.4 Landing Page ✅

### Status: Complete (June 27, 2026)

The PintarWeb landing page has been built and deployed. It uses a dark glassmorphic design ported from the legacy pintar-landing repo.

**What was built:**
- `packages/site-generator/landing/index.html` — complete landing page
- Dark background (#0a0a0a) with aurora gradients, glassmorphism, Manrope font
- BM/EN/CN language toggle
- RM800 anchor price vs RM447 subscription (3+1 months) shown side-by-side
- Renewal options (monthly, quarterly, bi-annual, annual)
- Problem section: "Ada Facebook Tapi Tak Ada Website?"
- Solution section: 3 glass cards (Website, WhatsApp Bot, Local SEO)
- How It Works: 3-step process
- Showcase: infinite marquee with 3 tradesperson demos
- Founder section (Yus, Selangor & KL)
- FAQ: 6 items with 14-day cancellation notice
- schema.org LocalBusiness structured data
- Logo and favicon assets from legacy repo

**Deployed to:** `pintarweb-main` Pages project at `https://main.pintarweb-main.pages.dev`

**Pending:** Domain migration to `pintarweb.com` (manual step in Phase 1.5.1)

**Note:** Analytics (Umami) has been moved to Phase 1.5.2 — see `docs/plans/phase-1.5-website-integration.md`

---

## 1.4 Analytics (Moved to Phase 1.5.2)

Analytics setup has been moved to **Phase 1.5.2** as part of the Website Integration & Sales Funnel phase. This is because analytics needs to track both the landing page AND demo client sites, and the tracking setup depends on the domain migration (1.5.1) being complete first.

See: `docs/plans/phase-1.5-website-integration.md` → Section 1.5.2

---

## Phase 1 Completion Checklist

### Payment Processing
- [ ] Razorpay account created and verified
- [ ] Bank account linked
- [ ] Payment link template ready (RM 447)
- [ ] Test payment completed
- [ ] Payment workflow documented

### Legal Documents (Clickwrap)
- [ ] Terms of Service page created (preview.pintarweb.com/terms)
- [ ] Privacy policy (PDPA compliant) created
- [ ] Razorpay payment link configured with terms link
- [ ] WhatsApp confirmation message template ready
- [ ] Documents stored and organized

### Cloud Hosting
- [ ] Cloudflare Pages project created
- [ ] Custom domain configured (preview.pintarweb.com)
- [ ] R2 bucket created (pintarweb-assets)
- [ ] Auto-deploy from GitHub working
- [ ] Test deployment successful

### Analytics (Moved to Phase 1.5.2)
- [ ] Umami analytics deployed (see phase-1.5-website-integration.md)
- [ ] Tracking script integrated
- [ ] Dashboard accessible
- [ ] Test tracking verified

### Landing Page ✅
- [x] Landing page designed and built
- [x] Deployed to pintarweb-main Pages project
- [x] Domain migration pending (Phase 1.5.1)

### Final Verification
- [ ] Can create payment link for customer
- [x] Can deploy client site to preview.pintarweb.com
- [ ] Can track site visits in Umami (Phase 1.5.2)
- [x] Terms of Service page live
- [x] Landing page live at main.pintarweb-main.pages.dev

---

## Next Steps

After completing Phase 1, proceed to **Phase 1.5: Website Integration & Sales Funnel** where you'll:
- Migrate pintarweb.com domain to new landing page
- Deploy Umami analytics
- Document the sales funnel
- Create outreach message templates
- Document demo site build SOP

Then proceed to **Phase 2: Automation** where you'll:
- Build site generation scripts
- Set up lead pipeline
- Configure outreach tracking
- Prepare for pilot testing

**Estimated time to complete Phase 1:** 5-10 hours  
**Estimated cost:** RM 0-310

---

**Last Updated:** 2026-06-28  
**Status:** 1.1 ✅ Razorpay, 1.2 ✅ Legal, 1.3 ✅ Hosting, 1.4 ✅ Landing Page. Phase 1.5 ✅ Complete. Phase 1 DONE.
