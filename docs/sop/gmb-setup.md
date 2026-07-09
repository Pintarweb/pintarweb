# GMB Setup & Optimization SOP

## Overview

This SOP covers the process for setting up and optimizing Google Business Profile (GBP) for PintarWeb clients during the pilot onboarding phase.

**Included in package:** GMB creation, verification, and basic optimization (up to 1 hour of work).

**Separate service:** Ongoing GMB maintenance, review collection campaigns, and advanced optimization.

---

## GMB Statuses

| Status | Description | Action |
|--------|-------------|--------|
| **TIADA GMB** | No listing exists | Create new listing |
| **BELUM SAH** | Unverified or pending | Complete verification |
| **TIDAK LENGKAP** | Verified but missing fields | Complete optimization |
| **TERVERIFIKASI** | Verified and complete | Offer optimization upgrade |

---

## Scenario 1: No GMB Exists

**Client has no Google Business Profile listing.**

### Step 1: Create New Listing

1. Navigate to [business.google.com/business/setup](https://business.google.com/business/setup)
2. Click **"Manage Now"**
3. Enter business name exactly as client wants it displayed
4. Select primary category (e.g., "Air Conditioning Contractor", "Plumber")
5. Enter business location OR service area:
   - For home-based businesses: Use service area
   - For physical shops: Enter exact address
6. Add contact information:
   - Phone number (use client's Malaysian mobile)
   - Website URL (can be added later)
7. Click **"Finish"** to save initial setup

### Step 2: Verify Listing

**Postcard verification** (most common):
1. Google will send a postcard to the business address
2. Takes 7-14 days to arrive
3. Client must pin the postcard and enter code in Google Search/Search Assistant app
4. Remind client to watch for mail

**Phone/Email verification** (if available):
1. Some businesses qualify for instant verification via phone or email
2. Check if option appears after listing creation
3. Guide client through verification process

### Step 3: First-Time Optimization (Post-Verification)

After verification, complete these within 48 hours:

1. **Add Photos** (minimum 10, recommend 15-20):
   - Exterior: Shop sign, building facade
   - Interior: Reception, workspace
   - Team: Owner/workers in action
   - Work samples: Completed jobs

2. **Set Business Hours**:
   - Regular hours for all days open
   - Mark closed days
   - Add special hours for holidays

3. **Write Business Description**:
   - Max 750 characters
   - Include primary services + service area
   - Malaysian BM language for local clients
   - Example: "Ah Seng Aircond Services menyediakan perkhidmatan servis, pemasangan dan pembaikan aircond di seluruh Klang Valley. Pengalaman lebih 10 tahun. Hubungi kami untuk sebut harga FREE!"

4. **Add Services**:
   - List all services offered
   - Use client's actual service names

5. **Set Attributes**:
   - Wheelchair access
   - Parking availability
   - Payment methods accepted
   - Any other relevant attributes

**Estimated time:** 15-20 minutes for creation, 1-2 hours for optimization post-verification.

---

## Scenario 2: Unverified / Incomplete GMB

**Client has a GMB listing but it's not verified or missing information.**

### Step 1: Check Listing Status

1. Search for client on Google Maps to see current state
2. Check for verification badge (green checkmark)
3. Note what's missing (photos, hours, description, etc.)

### Step 2: Complete Verification

If listing is unverified:
1. Go to Google Business Profile → Get Verified
2. Request new verification postcard if needed
3. Guide client to watch for mail and complete verification

### Step 3: Audit Completeness

Check these fields:
- [ ] Business name correct
- [ ] Category selected correctly
- [ ] Address/service area accurate
- [ ] Phone number correct (WhatsApp enabled)
- [ ] Website URL added
- [ ] Hours complete for all days
- [ ] Business description written
- [ ] At least 10 photos uploaded
- [ ] Services listed
- [ ] Attributes set

### Step 4: Fill Missing Fields

Update any missing fields following the optimization checklist above.

---

## Scenario 3: Verified + Complete GMB

**Client has a well-maintained GMB listing.**

Offer as **paid upgrade** (separate from RM149/month package):
- Advanced photo strategy
- Weekly post updates
- Review response management
- Q&A optimization
- Attribute expansion

Message: "GMB anda dah mantap! Kami boleh bantu optimize lagi untuk dapat lebih pelanggan — servisu tambahan RM49/bulan."

---

## Audit Report Integration

When generating an audit for a prospect:

```bash
# Without GMB data
bash scripts/generate-audit.sh "Business Name" "Area" "niche" "output-dir"

# With GMB data (from scraper/DB)
bash scripts/generate-audit.sh "Business Name" "Area" "niche" "output-dir" \
  --gmb "found,verified,12,1,1,23,4.5"
```

**GMB data format:** `listing_status,verification,photo_count,has_hours,has_description,review_count,rating`

| Field | Values |
|-------|--------|
| listing_status | `found` or `not-found` |
| verification | `verified`, `pending`, `unverified`, or `none` |
| photo_count | Number |
| has_hours | `1` or `0` |
| has_description | `1` or `0` |
| review_count | Number |
| rating | Number (e.g., `4.5`) |

---

## WhatsApp Message Templates

### Option A: No GMB Found
```
Hi! Saya nampak bisnes anda belum ada dalam Google Business Profile.

GMB ni penting — customer boleh jumpa anda di Google Maps dan terus hubungi anda.

Kami boleh bantu buka dan optimize GMB untuk anda — FREE dalam pakej PintarWeb.

Nak saya bantu?
```

### Option B: Unverified/Incomplete
```
Hi! Saya check GMB anda — ada tapi belum lengkap/verified.

GMB yang tak verified tak akan muncul dengan baik di Google Maps.

Kami boleh bantu lengkapkan dan sahkan GMB anda — FREE dalam pakej PintarWeb.

Nak saya bantu?
```

### Option C: Already Complete (Upgrade)
```
Hi! GMB anda dah bagus! ✓

Tahniah — bisnes anda dah ada kehadiran online yang kukuh.

Untuk lagi better, kami boleh bantu:
- Update foto dan post setiap minggu
- Respons kepada ulasan pelanggan
- Optimize untuk ranked lebih tinggi

Servis tambahan ni RM49/bulan. Nak tahu lebih lanjut?
```

---

## Quick Reference Checklist

### New GMB Creation
- [ ] Navigate to business.google.com/business/setup
- [ ] Enter correct business name
- [ ] Select accurate category
- [ ] Add location/service area
- [ ] Enter contact info
- [ ] Submit for verification

### Post-Verification Optimization
- [ ] Upload 10+ photos
- [ ] Set business hours
- [ ] Write business description (750 chars)
- [ ] List all services
- [ ] Set relevant attributes

### Verification Check
- [ ] Green checkmark visible on listing
- [ ] Listing appears in Google Search
- [ ] Phone/website links working

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Postcard not arrived after 14 days | Request new postcard in GBP dashboard |
| Phone verification not available | Use postcard only — most reliable |
| Business name already taken | Search existing listing and claim ownership |
| Multiple locations showing | Suggest client use service area instead of address |
| Verification code expired | Request new postcard — codes expire after 30 days |

---

**Last Updated:** 2026-07-09
**Package:** Included in RM149/month (creation + optimization)
**Excluded:** Ongoing maintenance, review campaigns (RM49/month separate)
