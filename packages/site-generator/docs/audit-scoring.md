# Audit Scoring System

## Purpose
Translate raw business data into 4 scores that tell a clear, honest story
about a lead's online presence. Scores must feel diagnostic — not punishing.
The goal is to show the gap, not shame the business.

---

## The 4 Scores

### 1. Visibility Score (0–100)
*Can people find this business online?*

| Signal | Points | Notes |
|--------|--------|-------|
| Has a working website | +40 | Verified via HTTP check — must load successfully |
| Google Business listing complete | +20 | Has photo, category, hours, phone all filled |
| Instagram active | +15 | Posted within last 30 days |
| TikTok active | +15 | Posted within last 30 days |
| Facebook business page exists | +10 | Page exists and not abandoned |
| Listed in local directory (Mudah, etc.) | +5 each | Max +10 (2 directories) |

**Max possible: 110 — capped at 100**
**Typical no-website SME: 20–50**
**Typical SME with website: 55–85**

---

### 2. Trust Score (0–100)
*Does this business look credible to a stranger?*

| Signal | Points | Notes |
|--------|--------|-------|
| Google reviews > 50 | +40 | Fewer: scale down proportionally (e.g. 25 reviews = +20) |
| Google rating ≥ 4.0 | +30 | 3.5–3.9 = +15, below 3.5 = +0 |
| Google listing has photos > 10 | +20 | Fewer: scale down (5 photos = +10) |
| Responds to Google reviews | +10 | Check manually — at least some replies visible |

**Max possible: 100**
**Typical active SME: 40–70**
**Strong SME: 70–90**

**Note:** Trust Score is often the highest score for leads with no website.
A contractor with 31 reviews at 4.3 stars scores 70+ on Trust even with
zero web presence. Use this in audit narrative — they are doing something right.

---

### 3. First Impression Score (0–100)
*What does a stranger see in the first 5 seconds?*

**ONLY calculated if `has_website: true`.**
If `has_website: false` — set to `null`. Do not show this score.
Replace with "What Customers See Right Now" section instead.
See `docs/no-website-playbook.md`.

| Signal | Points | Notes |
|--------|--------|-------|
| Website loads in under 3 seconds on mobile | +25 | Test with PageSpeed Insights |
| Service clearly stated above the fold | +20 | Can you tell what they do in 5 seconds? |
| Phone or WhatsApp visible above the fold | +20 | Must be clickable |
| Site works correctly on mobile | +20 | No broken layout, no horizontal scroll |
| Professional visual quality | +15 | Not obviously a cheap template |

**Max possible: 100**
**Typical cheap RM199 website: 20–45**
**Decent SME website: 50–75**

---

### 4. Competitor Gap Score
*How does this business compare to competitors in their area?*

Not a 0–100 score. Expressed as a gap statement.

**Calculation:**
1. Find top 3 competitors via Google Maps search for `{service} {area}`
2. Calculate their average Visibility + Trust score
3. Calculate lead's Visibility + Trust score
4. Gap = competitor average minus lead score

**Display options:**

If lead scores BELOW competitor average:
```
[X] points below area average
```

If lead scores ABOVE competitor average (rare but possible):
```
[X] points above area average — but 2 of 3 competitors have websites you don't
```

If competitors have websites and lead doesn't:
```
All 3 top competitors in your area have websites.
You don't appear when customers search online.
```

---

## How to Calculate Manually (Stage 1)

Use a spreadsheet. Create one row per lead. Columns:

```
business_name
has_website (Y/N)
google_rating
review_count
google_listing_complete (Y/N)
photos_count
responds_to_reviews (Y/N)
instagram_active (Y/N)
tiktok_active (Y/N)
facebook_exists (Y/N)
directory_listings (number)
website_loads_fast (Y/N) — only if has_website
service_clear_above_fold (Y/N) — only if has_website
phone_visible (Y/N) — only if has_website
mobile_works (Y/N) — only if has_website
visual_quality (1-3) — only if has_website

visibility_score (formula)
trust_score (formula)
first_impression_score (formula or null)
competitor_1_name
competitor_1_has_website
competitor_1_rating
competitor_1_reviews
competitor_2_name
competitor_2_has_website
competitor_2_rating
competitor_2_reviews
competitor_gap_statement
```

**Visibility Score formula (spreadsheet):**
```
=MIN(100,
  IF(has_website,40,0) +
  IF(listing_complete,20,0) +
  IF(instagram_active,15,0) +
  IF(tiktok_active,15,0) +
  IF(facebook_exists,10,0) +
  (MIN(2,directory_listings)*5)
)
```

**Trust Score formula:**
```
=MIN(100,
  MIN(40, (review_count/50)*40) +
  IF(rating>=4.0, 30, IF(rating>=3.5, 15, 0)) +
  MIN(20, (photos_count/10)*20) +
  IF(responds_to_reviews, 10, 0)
)
```

---

## Score Interpretation Guide

Use this to frame scores in audit narrative and score card summaries.

### Visibility
| Score | Summary line |
|-------|-------------|
| 0–25 | "Hampir tidak kelihatan online" |
| 26–50 | "Ada kehadiran asas — tapi mudah terlepas pandang" |
| 51–75 | "Kelihatan di beberapa tempat — ada ruang untuk tambah baik" |
| 76–100 | "Kehadiran online yang kukuh" |

### Trust
| Score | Summary line |
|-------|-------------|
| 0–25 | "Sukar untuk pelanggan baru mempercayai bisnes ini online" |
| 26–50 | "Ada asas kepercayaan — ulasan Google membantu" |
| 51–75 | "Dipercayai — ulasan dan rating anda buat kerja" |
| 76–100 | "Kredibiliti yang kuat — pelanggan nampak bisnes yang boleh dipercayai" |

### First Impression (website only)
| Score | Summary line |
|-------|-------------|
| 0–25 | "Website ada — tapi pelanggan mungkin terus keluar" |
| 26–50 | "Website berfungsi tapi tidak mengoptimumkan kepercayaan atau penukaran" |
| 51–75 | "Impression pertama yang solid — ada beberapa peluang untuk tambah baik" |
| 76–100 | "Website memberikan impression pertama yang kuat" |

---

## What NOT to Do With Scores

- Never show a score of 0 — floor at 10 to avoid feeling like an attack
- Never say "your score is terrible" — say "there's significant room to improve"
- Never fake scores to make the gap look bigger — leads will notice if numbers don't add up
- Never show First Impression Score as 0 just because they have no website — omit it entirely
- Scores are a conversation starter, not a verdict

---

## Data Sources (Stage 1 — Manual)

| Data point | Where to get it |
|-----------|----------------|
| Google rating + review count | Google Maps listing |
| Listing completeness | Check manually — hours, photos, category, phone filled? |
| Photos count | Click "See photos" on Google Maps listing |
| Responds to reviews | Scroll through reviews — any owner replies? |
| Website status | Click website link from Maps, check if it loads |
| Instagram | Search business name on Instagram |
| TikTok | Search business name on TikTok |
| Facebook | Search business name on Facebook |
| Competitors | Google Maps search: `{service} {area}` — top 3 results |
| Monthly search volume | Google Keyword Planner — `{service} {area}` |

All of this is publicly visible. Takes 15–20 minutes per lead at Stage 1.
In Stage 2, most of this gets automated via Google Places API.