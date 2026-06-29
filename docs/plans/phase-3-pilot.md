# Phase 3: Pilot - Detailed Implementation Plan

## Overview

Phase 3 validates the entire pipeline with real prospects. By the end of this phase, you'll have run 2-3 free pilots, collected feedback, refined your process, and documented SOPs for scaling.

**Duration:** Week 3 (8-12 hours)  
**Cost:** RM 0 (free pilots)  
**Success Criteria:** 2-3 pilot demos sent, at least 1 conversation started, SOP documented

---

## 3.1 Pilot Execution

### Goals
- Validate entire pipeline with real prospects
- Test messaging and positioning
- Identify bottlenecks and issues
- Build confidence before paid launch

### Step-by-Step Implementation

#### Step 1: Select Pilot Prospects (Day 1)

**Criteria for pilot prospects:**
- Real businesses (not friends/family)
- No website or poor online presence
- Active on WhatsApp
- Located in Selangor/KL
- Aircond contractors (primary niche)

**Where to find pilots:**
1. **Existing leads:** Use your processed lead list from Phase 2
2. **Google Maps:** Search "aircond service cheras" and find businesses without websites
3. **Facebook Groups:** Join contractor groups and identify active members without websites
4. **Personal network:** Ask friends/family if they know contractors who need help

**Selection process:**
1. Review processed leads (score >= 60)
2. Filter by: aircond niche, Selangor/KL, no website
3. Select top 5 candidates
4. Narrow down to 2-3 based on:
   - Business size (1-10 employees ideal)
   - Online activity (active on social = more engaged)
   - Accessibility (easy to contact via WhatsApp)

**Time:** 1 hour

#### Step 2: Build Demo Sites (Day 1-2)

For each pilot prospect:

1. **Gather information:**
   - Business name
   - Phone number
   - Service area
   - Services offered
   - Google Maps URL (if exists)
   - Instagram handle (if exists)
   - Any photos you can find online

2. **Create config.json:**
   ```bash
   cd packages/site-generator/clients
   mkdir [business-id]
   # Use intake form or manually create config.json
   ```

3. **Generate site:**
   ```bash
   cd packages/site-generator
   node scripts/generate-all.js [business-id]
   ```

4. **Deploy to preview:**
   ```bash
   git add .
   git commit -m "feat: add demo for [business-name]"
   git push origin master
   ```

5. **Verify deployment:**
   - Visit: https://preview.pintarweb.com/[business-id]/
   - Check mobile responsiveness
   - Verify all sections render correctly
   - Test WhatsApp button

**Time:** 2-3 hours (for 2-3 pilots)

#### Step 3: Send Outreach Messages (Day 2-3)

**Message timing:**
- Send between 7:00-8:30am, 12:30-2:00pm, or 9:00-10:30pm
- Avoid 9am-12pm and 2pm-6pm (busy work hours)

**Touch 1 - First Outreach:**

For each pilot, send personalized message:

```
Hi [Name], saya sempat check — every bulan roughly 290 orang 
search aircond service kat area [Area]. Tapi [Business Name] 
tak nampak langsung dalam result.

Saya dah sediakan report + demo untuk tunjuk macam mana 
customer boleh jumpa awak: https://preview.pintarweb.com/[business-id]/report

Ada apa-apa boleh tanya sini.
```

**Personalization tips:**
- Use their actual business name
- Mention specific area (Cheras, Ampang, etc.)
- If they have Instagram, mention it: "Nampak IG awak aktif..."
- Keep it under 4 lines
- No price mention in first message

**Track outreach:**
```bash
cd packages/site-generator
node scripts/track-outreach.js [business-id] first_outreach "Sent via WhatsApp"
```

**Time:** 30 minutes

#### Step 4: Monitor and Follow Up (Day 3-7)

**Day 3 - Touch 2 (if no reply):**
```
Just nak check — awak dah tengok report tu? 290 orang 
search aircond service [area] sebulan. Bayangkan kalau 
5% dari tu jadi customer awak — 15 customer baru sebulan.
```

**Day 7 - Touch 3 (if still no reply):**
```
Tadi update sikit demo website awak — dah tambah section 
servis area. Link sama: https://preview.pintarweb.com/[business-id]/report

Boleh tengok bila free.
```

**If they reply:**
- Answer questions honestly
- Don't push for sale immediately
- Ask about their business challenges
- Build rapport

**Track all interactions:**
```bash
node scripts/track-outreach.js [business-id] follow_up "Day 3 follow-up"
node scripts/track-outreach.js [business-id] reply "Asked about pricing"
```

**Time:** 1-2 hours (over 5 days)

#### Step 5: Conduct Conversations (Day 5-10)

**If prospect shows interest:**

1. **Understand their needs:**
   - How long in business?
   - How many customers per month?
   - Current marketing channels?
   - Biggest challenges?

2. **Explain your solution:**
   - "We build websites for contractors like you"
   - "Focus on getting customers from Google"
   - "Include SEO, WhatsApp auto-reply, GMB optimization"

3. **Present pricing (anchor & pivot):**
   ```
   Kalau nak website sahaja, RM 800 one-time.
   
   Atau RM 149/bulan — website FREE, auto-reply + GMB + SEO included. 
   3 bulan advance (RM 447).
   
   Satu job chemical wash (RM 180-350) dah cover sebulan.
   ```

4. **Handle objections:**
   - "Mahal" → "Satu job dah cover sebulan"
   - "Nak fikir dulu" → "Boleh, demo still live. Saya follow-up minggu depan"
   - "Tak sure jadi ke tak" → "Boleh try 3 bulan, kalau tak puas hati boleh batal"

5. **Close:**
   - If interested: Send Razorpay payment link
   - If not ready: Schedule follow-up for next week
   - If not interested: Thank them, move on

**Track conversations:**
```bash
node scripts/track-outreach.js [business-id] demo_sent "Sent pricing info"
node scripts/track-outreach.js [business-id] closed "Not interested"
```

**Time:** 2-3 hours (over 5 days)

#### Step 6: Collect Feedback (Day 7-10)

**For pilots who responded (interested or not):**

Send feedback request:
```
Terima kasih sebab luangkan masa tengok demo tu. 

Boleh saya tahu:
1. Apa yang awak suka tentang demo website tu?
2. Apa yang boleh kami improve?
3. Ada apa-apa yang missing?

Feedback awak sangat berharga untuk kami improve.
```

**Feedback questions to ask:**
1. Was the demo relevant to your business?
2. Was the pricing clear?
3. What would make you sign up?
4. What concerns do you have?
5. Would you recommend this to other contractors?

**Document feedback:**
Create `docs/pilot-feedback.md`:
```markdown
# Pilot Feedback

## Pilot 1: [Business Name]
**Date:** 2026-06-23
**Status:** Interested / Not Interested / No Response

### What worked:
- [Specific feedback]

### What didn't work:
- [Specific feedback]

### Improvements needed:
- [Specific feedback]

### Pricing feedback:
- [Their reaction to pricing]

### Next steps:
- [Follow-up actions]
```

**Time:** 1 hour

### Checklist
- [ ] 2-3 pilot prospects selected
- [ ] Demo sites built for all pilots
- [ ] First outreach sent to all pilots
- [ ] Follow-ups sent (Day 3, Day 7)
- [ ] Conversations conducted with interested pilots
- [ ] Feedback collected from all pilots
- [ ] All interactions tracked in database

---

## 3.2 Process Documentation

### Goals
- Document what worked and what didn't
- Create SOPs for scaling
- Identify bottlenecks and inefficiencies

### Step-by-Step Implementation

#### Step 1: Document Lead Generation SOP

Create `docs/sop-lead-generation.md`:
```markdown
# SOP: Lead Generation

## Overview
Process for finding and qualifying leads for Pintarweb outreach.

## Time Required
- 1 hour to generate 20 qualified leads

## Steps

### 1. Run Scraper
```bash
cd packages/scraper
npx tsx src/index.ts --category "Aircond" --location "Cheras" --limit 50
```

### 2. Process Leads
```bash
cd data/leads
node ../../packages/site-generator/scripts/process-leads.js leads-cheras.json leads-processed.json
```

### 3. Review Processed Leads
- Open `leads-processed.json`
- Filter by score >= 60
- Check each lead manually:
  - Verify phone number is valid
  - Check if business is still operating
  - Confirm no website (or poor website)

### 4. Export Outreach List
```bash
node ../../packages/site-generator/scripts/export-outreach-list.js leads-processed.json outreach-list.csv
```

### 5. Select Top Prospects
- Sort by score (highest first)
- Select 10-15 for outreach
- Prioritize: no website, active on social, good reviews

## Quality Checks
- [ ] All phone numbers are valid Malaysian numbers
- [ ] All businesses are in target area (Selangor/KL)
- [ ] All businesses are in target niche (aircond first)
- [ ] Score >= 60 for all selected leads

## Common Issues
- **Scraper returns duplicates:** Check phone_normalized field
- **Invalid phone numbers:** Manually verify before outreach
- **Businesses closed:** Check Google Maps for "Permanently closed"

## Output
- `outreach-list.csv` with 10-15 qualified leads
- Ready for demo site generation
```

**Time:** 1 hour

#### Step 2: Document Site Generation SOP

Create `docs/sop-site-generation.md`:
```markdown
# SOP: Site Generation

## Overview
Process for generating demo sites, audits, and reports for prospects.

## Time Required
- 30 minutes per complete deliverable (demo + audit + report)

## Steps

### 1. Gather Client Information
Required fields:
- Business name
- Phone number (Malaysian format: 01X-XXX XXXX)
- Service area (e.g., "Cheras, Selangor")
- Niche (aircond-contractor, plumbing, etc.)
- Services offered (list 3-5 services)

Optional fields:
- Google Maps URL
- Instagram handle
- Google rating and review count
- Logo and photos

### 2. Create Config File
```bash
cd packages/site-generator/clients
mkdir [business-id]
```

Use intake form (clients/intake-form.html) or manually create config.json:
```json
{
  "id": "business-id",
  "business_name": "Business Name",
  "phone": "012-345 6789",
  "area": "Cheras, Selangor",
  "niche": "aircond-contractor",
  "services": ["Servis Aircond", "Pemasangan Aircond", "Pembaikan Aircond"],
  "social": {
    "instagram_handle": "businessname",
    "instagram_active": true
  },
  "audit": {
    "has_website": false,
    "google_maps_url": "https://maps.google.com/..."
  }
}
```

### 3. Add Images (Optional)
If client has logo or photos:
```bash
cd clients/[business-id]/images
# Add logo.webp, hero.webp, gallery images
```

### 4. Generate Site
```bash
cd packages/site-generator
node scripts/generate-all.js [business-id]
```

This generates:
- `index.html` - Demo website
- `audit.html` - Audit report
- `report.html` - Combined report (send this)

### 5. Deploy to Preview
```bash
git add .
git commit -m "feat: add demo for [business-name]"
git push origin master
```

Wait 2-3 minutes for Cloudflare Pages to deploy.

### 6. Verify Deployment
Visit:
- https://preview.pintarweb.com/[business-id]/
- https://preview.pintarweb.com/[business-id]/audit
- https://preview.pintarweb.com/[business-id]/report

Check:
- [ ] Mobile responsive (test on phone)
- [ ] All sections render correctly
- [ ] WhatsApp button works
- [ ] Images load
- [ ] Language toggle works

## Quality Checks
- [ ] Business name matches Google listing
- [ ] Phone number is correct and clickable
- [ ] Service area is accurate
- [ ] No placeholder text
- [ ] Looks professional on mobile

## Common Issues
- **Images not loading:** Check file paths in config.json
- **WhatsApp button broken:** Verify phone format (60XXXXXXXXXX)
- **Deployment failed:** Check GitHub Actions logs

## Output
- Live demo site at preview.pintarweb.com/[business-id]/
- Report ready to send to prospect
```

**Time:** 1 hour

#### Step 3: Document Outreach SOP

Create `docs/sop-outreach.md`:
```markdown
# SOP: Outreach

## Overview
Process for contacting prospects and converting them to customers.

## Time Required
- 10 minutes per prospect (initial outreach)
- 5 minutes per follow-up
- 15-30 minutes per conversation

## Steps

### 1. Prepare Outreach List
- Use `outreach-list.csv` from lead generation
- Select 10-15 high-priority leads
- Personalize message for each lead

### 2. Send Touch 1 (Day 0)
**Timing:** 7:00-8:30am, 12:30-2:00pm, or 9:00-10:30pm

**Message template:**
```
Hi [Name], saya sempat check — every bulan roughly 290 orang 
search aircond service kat area [Area]. Tapi [Business Name] 
tak nampak langsung dalam result.

Saya dah sediakan report + demo untuk tunjuk macam mana 
customer boleh jumpa awak: [report URL]

Ada apa-apa boleh tanya sini.
```

**Personalization:**
- Use actual business name
- Mention specific area
- If they have Instagram, mention it
- Keep under 4 lines
- No price mention

**Track:**
```bash
node scripts/track-outreach.js [business-id] first_outreach
```

### 3. Send Touch 2 (Day 3)
Only if no reply.

**Message:**
```
Just nak check — awak dah tengok report tu? 290 orang 
search aircond service [area] sebulan. Bayangkan kalau 
5% dari tu jadi customer awak — 15 customer baru sebulan.
```

**Track:**
```bash
node scripts/track-outreach.js [business-id] follow_up "Day 3"
```

### 4. Send Touch 3 (Day 7)
Only if still no reply.

**Message:**
```
Tadi update sikit demo website awak — dah tambah section 
servis area. Link sama: [report URL]

Boleh tengok bila free.
```

**Track:**
```bash
node scripts/track-outreach.js [business-id] follow_up "Day 7"
```

### 5. Handle Responses
**If they ask about pricing:**
```
Kalau berminat, ada 2 pilihan:
1. RM 800 one-time untuk website
2. RM 149/bulan — website FREE, auto-reply + GMB + SEO included. 
   3 bulan advance (RM 447)

Satu job chemical wash (RM 180-350) dah cover sebulan.
```

**If they're interested:**
- Send Razorpay payment link
- Schedule onboarding call
- Collect business assets (logo, photos)

**If they're not interested:**
- Thank them for their time
- Ask for feedback
- Move on to next prospect

**Track all interactions:**
```bash
node scripts/track-outreach.js [business-id] reply "Asked about pricing"
node scripts/track-outreach.js [business-id] demo_sent "Sent payment link"
node scripts/track-outreach.js [business-id] closed "Not interested"
```

## Quality Checks
- [ ] Message is personalized (not generic)
- [ ] Report link is working
- [ ] Timing is appropriate (not during busy hours)
- [ ] All interactions tracked

## Common Issues
- **No replies:** Try different times, refine message
- **Negative responses:** Learn from feedback, adjust approach
- **Technical issues:** Test report link before sending

## Metrics to Track
- Response rate (target: 20-30%)
- Conversation rate (target: 10-15%)
- Close rate (target: 5-10%)

## Output
- 10-15 outreach messages sent
- 2-3 conversations started
- 1 customer closed (target for Week 4)
```

**Time:** 1 hour

#### Step 4: Document Closing SOP

Create `docs/sop-closing.md`:
```markdown
# SOP: Closing & Onboarding

## Overview
Process for converting interested prospects to paying customers and onboarding them.

## Time Required
- 30 minutes for closing conversation
- 1-2 hours for onboarding

## Steps

### 1. Closing Conversation
**When prospect is ready to commit:**

1. **Confirm details:**
   - Business name
   - Services to include
   - Service area
   - Contact information

2. **Explain what's included:**
   - Custom website
   - SEO optimization
   - WhatsApp auto-reply (30 messages/month)
   - Google Business Profile optimization
   - Monthly content updates (up to 2)

3. **Present pricing:**
   ```
   RM 149/bulan, 3 bulan advance (RM 447).
   
   Termasuk:
   - Website custom
   - SEO optimization
   - WhatsApp auto-reply
   - GMB optimization
   - Monthly updates
   
   Auto-renew setiap 3 bulan. Boleh batal bila-bila dengan 14 hari notice.
   ```

4. **Send payment link:**
   - Create Razorpay payment link (RM 447)
   - Send via WhatsApp
   - Include brief instructions

5. **Set expectations:**
   - Website will be live in 5-7 days
   - Need business assets (logo, photos)
   - Onboarding call (20 minutes)

### 2. Payment Confirmation
**When payment received:**

1. **Verify payment:**
   - Check Razorpay dashboard
   - Confirm amount: RM 447
   - Note transaction ID

2. **Send confirmation:**
   ```
   Terima kasih! Payment dah diterima.
   
   Sekarang saya perlukan:
   1. Logo bisnes (format PNG atau JPG)
   2. Photos projek (5-10 photos)
   3. Maklumat bisnes (alamat, waktu operasi)
   
   Boleh hantar via WhatsApp atau email.
   
   Saya akan setup onboarding call dalam 1-2 hari.
   ```

3. **Track:**
   ```bash
   node scripts/track-outreach.js [business-id] closed "Payment received"
   ```

### 3. Collect Business Assets
**What you need:**
- Logo (PNG, JPG, or SVG)
- Hero image (16:9 landscape)
- Gallery images (5-10 project photos)
- Business information:
  - Full address
  - Operating hours
  - Services list
  - Contact person name

**How to collect:**
- WhatsApp (easiest for photos)
- Email (for high-res files)
- Google Drive folder (organized storage)

### 4. Generate Production Site
**For paying customer (not demo):**

1. **Create production config:**
   - Use demo config as base
   - Add real business assets
   - Update with customer preferences

2. **Generate site:**
   ```bash
   node scripts/generate-all.js [business-id]
   ```

3. **Deploy to production:**
   - Upload to Cloudflare Pages
   - Configure custom domain (if applicable)
   - Test thoroughly

### 5. Onboarding Call (20 minutes)
**Agenda:**

1. **Introduction (2 min):**
   - Welcome them
   - Explain what's included
   - Set expectations

2. **Website walkthrough (10 min):**
   - Show them their live site
   - Explain how to update content
   - Show WhatsApp auto-reply
   - Show Google Business Profile

3. **Next steps (5 min):**
   - Timeline for SEO results (1-3 months)
   - How to request updates
   - Support contact information

4. **Q&A (3 min):**
   - Answer any questions
   - Address concerns

### 6. Send Welcome Package
**After onboarding call:**

Send email/WhatsApp with:
- Website URL
- Login details (if applicable)
- Support contact (your WhatsApp)
- What to expect in first month
- How to request updates

**Template:**
```
Selamat datang ke Pintarweb!

Website awak: https://[business-id].pintarweb.com
Support WhatsApp: 01X-XXX XXXX

Apa yang termasuk:
- Website hosting & maintenance
- SEO optimization (results in 1-3 months)
- WhatsApp auto-reply (30 messages/bulan)
- Google Business Profile optimization
- Monthly content updates (max 2)

Cara minta update:
- WhatsApp saya dengan detail
- Saya akan update dalam 1-2 hari kerja

Ada apa-apa soalan, boleh WhatsApp saya bila-bila masa.
```

## Quality Checks
- [ ] Payment received and verified
- [ ] All business assets collected
- [ ] Production site deployed and tested
- [ ] Onboarding call completed
- [ ] Welcome package sent
- [ ] Customer knows how to contact support

## Common Issues
- **Customer slow to provide assets:** Send gentle reminder after 3 days
- **Technical issues with site:** Fix within 24 hours
- **Customer has many questions:** Be patient, document FAQ

## Metrics to Track
- Time from payment to live site (target: 5-7 days)
- Customer satisfaction (ask after 1 month)
- Support requests per month (target: < 5)

## Output
- Paying customer onboarded
- Live production site
- Happy customer who knows what to expect
```

**Time:** 1 hour

### Checklist
- [ ] Lead generation SOP documented
- [ ] Site generation SOP documented
- [ ] Outreach SOP documented
- [ ] Closing & onboarding SOP documented
- [ ] All SOPs tested and verified
- [ ] SOPs stored in docs/ folder

---

## 3.3 Quality Refinement

### Goals
- Improve design based on pilot feedback
- Refine messaging and positioning
- Calibrate audit scoring
- Optimize report template

### Step-by-Step Implementation

#### Step 1: Analyze Pilot Feedback
1. Review all feedback collected in Step 3.1
2. Identify common themes:
   - What did pilots like?
   - What confused them?
   - What was missing?
   - What objections came up?

3. Categorize feedback:
   - **Design issues:** Layout, colors, fonts
   - **Content issues:** Copy, testimonials, services
   - **Technical issues:** Mobile, speed, bugs
   - **Pricing issues:** Too expensive, unclear value
   - **Messaging issues:** Confusing, not relevant

**Time:** 30 minutes

#### Step 2: Refine Design System
Based on feedback, update:
- `packages/site-generator/design-system/moods/` - Update mood files
- `packages/site-generator/templates/` - Update templates
- `packages/site-generator/docs/design-rules.md` - Update rules

**Common refinements:**
- Simplify navigation (fewer items)
- Increase font sizes (better mobile readability)
- Add more whitespace (less cluttered)
- Improve contrast (better accessibility)

**Time:** 2 hours

#### Step 3: Update Copy Rules
Based on feedback, update:
- `packages/site-generator/docs/copy-rules.md`
- `packages/site-generator/prompts/copy/` - Update prompts

**Common refinements:**
- Remove jargon (use simpler language)
- Add more local references (Malaysian context)
- Improve testimonials (make them sound real)
- Clarify value proposition (focus on customers, not features)

**Time:** 1 hour

#### Step 4: Calibrate Audit Scoring
Based on pilot feedback, adjust:
- `packages/site-generator/scripts/generate-audit.js` - Update scoring logic

**Common refinements:**
- Adjust weight of different factors
- Add new scoring criteria
- Remove irrelevant criteria
- Improve narrative generation

**Time:** 1 hour

#### Step 5: Improve Report Template
Based on feedback, update:
- `packages/site-generator/scripts/generate-report.js`

**Common refinements:**
- Simplify layout (less overwhelming)
- Add more visuals (charts, graphs)
- Improve call-to-action (clearer next steps)
- Add social proof (testimonials, case studies)

**Time:** 1 hour

### Checklist
- [ ] Pilot feedback analyzed
- [ ] Design system refined
- [ ] Copy rules updated
- [ ] Audit scoring calibrated
- [ ] Report template improved
- [ ] Changes tested with new demo

---

## Phase 3 Completion Checklist

### Pilot Execution
- [ ] 2-3 pilot prospects selected
- [ ] Demo sites built for all pilots
- [ ] Outreach sent to all pilots
- [ ] Follow-ups completed
- [ ] Conversations conducted
- [ ] Feedback collected

### Process Documentation
- [ ] Lead generation SOP documented
- [ ] Site generation SOP documented
- [ ] Outreach SOP documented
- [ ] Closing & onboarding SOP documented
- [ ] All SOPs tested

### Quality Refinement
- [ ] Pilot feedback analyzed
- [ ] Design system refined
- [ ] Copy rules updated
- [ ] Audit scoring calibrated
- [ ] Report template improved

### Final Verification
- [ ] Can generate demo site in < 30 minutes
- [ ] Can send outreach in < 10 minutes
- [ ] Can handle conversation confidently
- [ ] SOPs are clear and actionable
- [ ] Ready to scale to 10-15 prospects

---

## Next Steps

After completing Phase 3, proceed to **Phase 4: Launch** where you'll:
- Launch outreach to 10-15 prospects
- Close first paying customer
- Establish rhythm for ongoing operations

**Estimated time to complete Phase 3:** 8-12 hours  
**Estimated cost:** RM 0

---

**Last Updated:** 2026-06-23  
**Status:** Ready to execute
