# Demo Site Build SOP — PintarWeb

Standard operating procedure for building a client demo site from lead to deployment.

**Target time:** 60-90 minutes (improves to <30 min with Phase 2 automation)

---

## Overview

```
GATHER INFO → CREATE CONFIG → GENERATE SITE → BUILD → DEPLOY → VERIFY
     15 min           5 min        30-45 min      5 min     1 min       5 min
```

---

## Step 1: Gather Prospect Info

**Time:** 15 minutes

Collect these from scraper/lead list:
- [ ] Business name
- [ ] Owner/contact name
- [ ] WhatsApp number
- [ ] Service areas (cities/neighborhoods)
- [ ] Services offered (4-6 items)
- [ ] Google rating + review count
- [ ] Existing website (if any)
- [ ] Instagram handle (if available)

**Photos strategy:**
1. Check their Facebook page for real work photos
2. Check their Instagram
3. If no photos available → use AI-generated from `packages/site-generator/assets/image-collections/`
4. Mark photo sources in notes for client onboarding later

---

## Step 2: Create Config

**Time:** 5 minutes

Copy template from existing client:
```bash
cp packages/site-generator/clients/demo-ah-seng-plumbing/config.json \
   packages/site-generator/clients/{new-id}/config.json
```

Or create from scratch:
```json
{
  "id": "{new-id}",
  "name": "Business Name",
  "tagline": "Tagline here",
  "phone": "60123456789",
  "whatsapp": "60123456789",
  "address": "Area, State",
  "services": [
    { "name": "Service 1", "description": "..." },
    { "name": "Service 2", "description": "..." }
  ],
  "areas": ["Kuala Lumpur", "Selangor"],
  "rating": 4.5,
  "reviews": 127,
  "mood": "bold-urgent",
  "accent": "#DC2626"
}
```

**Assign mood by trade:**
| Trade | Mood | Colors |
|-------|------|--------|
| Aircond/Renovation | `trustworthy-local` | Forest green |
| Plumbing/24hr | `bold-urgent` | Black/red |
| Electrical/Premium | `premium-modern` | Slate/bronze |
| Cleaning | `trustworthy-local` | Forest green |
| Moving | `bold-urgent` | Black/red |
| Other | rotate | Avoid same as recent |

---

## Step 3: Generate Site

**Time:** 30-45 minutes

### Option A: Use existing demo as template (faster)
1. Copy existing demo `index.html`:
   ```bash
   cp packages/site-generator/clients/demo-ah-seng-plumbing/index.html \
      packages/site-generator/clients/{new-id}/index.html
   ```
2. Edit in place — replace business name, services, colors
3. Update mood class in `<html>` tag:
   - `trustworthy-local` → `data-mood="trustworthy-local"`
   - `bold-urgent` → `data-mood="bold-urgent"`
   - `premium-modern` → `data-mood="premium-modern"`

### Option B: LLM generation (better quality)
1. Give Claude/GPT the prompt template (see `AGENTS.md`)
2. Include: business info, services, mood, existing photo links
3. Request complete `index.html` with all sections
4. Copy output to `packages/site-generator/clients/{new-id}/index.html`

### Required sections:
- [ ] Hero with business name, tagline, CTA
- [ ] Services grid (4-6 services)
- [ ] Service areas list
- [ ] Gallery (4-8 images)
- [ ] Google review card
- [ ] Contact form
- [ ] WhatsApp sticky bar
- [ ] Footer with address + hours
- [ ] BM/EN language toggle on all text

### Required technical:
- [ ] `<html data-lang="bm" data-mood="{mood}">`
- [ ] All text has `data-bm` and `data-en` attributes
- [ ] WhatsApp CTA links to `{whatsapp}?text=Hi%2C%20saya%20berminat`
- [ ] Google Maps embed for service area
- [ ] `og:image` meta points to preview

---

## Step 4: Build CSS

**Time:** 5 minutes

```bash
cd /home/yusmarin/projects/pintarweb
bash scripts/build-client.sh {new-id}
```

This compiles Tailwind + custom styles from `input.css` into `clients/{new-id}/style.css`.

**Verify output:**
```
✅ Built: packages/site-generator/clients/{new-id}/style.css
```

---

## Step 5: Deploy

**Time:** 1 minute

```bash
bash scripts/deploy-preview.sh
```

This deploys the entire `clients/` directory. All client demos are under `preview.pintarweb.com/{id}/`.

**Verify deployment:**
```
✅ Deployed: https://preview.pintarweb.com/{new-id}/
```

---

## Step 6: Verify

**Time:** 5 minutes

Test on both mobile and desktop:

### Visual checks:
- [ ] Hero section displays correctly
- [ ] Business name, tagline, phone visible
- [ ] Services section shows all 4-6 services
- [ ] Service areas Google Maps embed works
- [ ] Gallery images load (check 2-3)
- [ ] WhatsApp sticky bar visible at bottom
- [ ] Footer shows correct address

### Functional checks:
- [ ] BM/EN toggle switches all text
- [ ] WhatsApp CTA opens WhatsApp with pre-filled message
- [ ] Contact form opens WhatsApp (not email)
- [ ] Gallery lightbox works
- [ ] Scroll animations trigger (sections fade in)
- [ ] Mobile hamburger menu works

### Tracking checks:
- [ ] Open Umami dashboard → verify pageview appears
- [ ] Test WhatsApp click → verify `whatsapp_click` event fires

---

## Step 7: Generate Audit Report (Optional)

**Time:** 15 minutes

If scraper data available:
1. Use audit template: `packages/site-generator/clients/test-razif/audit.html`
2. Fill in:
   - Current Google Maps ranking score
   - Online presence gaps
   - Competitor info
   - Recommendations
3. Deploy alongside demo:
   ```
   https://preview.pintarweb.com/{new-id}/audit.html
   ```

---

## Step 8: Prepare Outreach

**Add UTM params to demo URL:**
```
https://preview.pintarweb.com/{new-id}/?ref=outreach&prospect={lead-id}
```

**Add to prospect spreadsheet:**
- Lead name
- Business name  
- Demo URL (with UTM)
- Audit URL (if available)
- Message sent date
- Follow-up dates

---

## Quick Commands Reference

```bash
# Build single client CSS
bash scripts/build-client.sh {id}

# Deploy all client previews
bash scripts/deploy-preview.sh

# Both together
bash scripts/build-client.sh {id} && bash scripts/deploy-preview.sh
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CSS not updating | Run `build-client.sh` again, hard refresh browser |
| WhatsApp link not working | Check `wa.me` number format (no + or spaces) |
| Images broken | Check image URLs are absolute (https://) not relative |
| BM/EN toggle not working | Ensure `data-bm` and `data-en` attributes on all text elements |
| Gallery lightbox broken | Ensure `.lightbox` and `.lightbox.active` CSS classes present |

---

## Target Metrics

| Metric | Target | Ideal |
|--------|--------|-------|
| Build time | 60 min | 30 min |
| Deploy time | 5 min | 2 min |
| QA time | 10 min | 5 min |
| **Total** | **75 min** | **37 min** |

---

**Last Updated:** 2026-06-28
