# Trust Signals Refinement Prompt

## Purpose
Strengthen trust signals throughout a generated website.
Trust signals reduce friction and increase conversion for Malaysian SME visitors.

## When to Use
- After initial generation
- When a site feels generic or untrustworthy
- Before sending to a real lead

## Read First
- `docs/design-rules.md`
- The HTML to be refined
- `clients/{id}/config.json` for available trust data

## Trust Signal Audit

### Above The Fold Check (Hero Section)
Must contain at least 3 of these:
- [ ] WhatsApp CTA (with pre-filled message)
- [ ] Clickable phone number (tel: link)
- [ ] Google rating + review count (if rating ≥ 4.0)
- [ ] Years in business ("Sejak {year}" / "Since {year}")
- [ ] Service area mentioned
- [ ] Response time badge ("Balas dalam 1 jam")
- [ ] Guarantee/warranty badge
- [ ] Verification badge (license number if available)

If fewer than 3 → add missing signals to hero.

### Trust Indicators Throughout Page
- [ ] Real business name (not generic)
- [ ] Specific location/areas served (not just "Malaysia")
- [ ] Actual phone number visible (not just contact form)
- [ ] Real testimonials that sound like real people
- [ ] Specific services (not vague "solutions")
- [ ] Real photos indicated (even if placeholder now)
- [ ] Transparent pricing approach ("call for quote" is fine)

### Missing Trust Signals to Add

#### If google_rating exists and ≥ 4.0
Add a rating display:
```html
<span class="flex items-center gap-1.5 text-xs text-stone-500">
  <svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
  </svg>
  {rating} ★ · {review_count}
  <span data-bm="ulasan Google" data-en="Google reviews">ulasan Google</span>
</span>
```

#### If established year exists
Add years badge:
```html
<span class="flex items-center gap-1.5 text-xs text-stone-500">
  <svg class="w-3.5 h-3.5 text-emerald-600"><!-- shield icon --></svg>
  {current_year - established}+
  <span data-bm="Tahun Pengalaman" data-en="Years Experience">Tahun Pengalaman</span>
</span>
```

#### Response time badge
Always add if not present:
```html
<span class="flex items-center gap-1.5 text-xs text-stone-500">
  <svg class="w-3.5 h-3.5 text-emerald-600"><!-- clock icon --></svg>
  <span data-bm="Balas dalam 1 jam" data-en="Reply within 1 hour">Balas dalam 1 jam</span>
</span>
```

#### Guarantee badge
Add for services where warranty makes sense:
```html
<span class="flex items-center gap-1.5 text-xs text-stone-500">
  <svg class="w-3.5 h-3.5 text-emerald-600"><!-- shield-check icon --></svg>
  <span data-bm="Jaminan Mutu Kerja" data-en="Workmanship Guaranteed">Jaminan Mutu Kerja</span>
</span>
```

### Testimonial Trust Check
For each testimonial, verify:
- [ ] Quote sounds like a real person (not corporate)
- [ ] Name + area included (even if initials only)
- [ ] Star rating visible
- [ ] Quote is specific (mentions actual service or detail)

If testimonials feel fake → rewrite to sound more natural.

BAD testimonial (corporate, vague):
```
"Exceptional service with professional technicians. Highly satisfied."
```

GOOD testimonial (real, specific):
```
"Aircond rosak malam-malam, call terus datang. Kerja kemas, harga okay."
```

### Contact Visibility Check
Phone and WhatsApp must be:
- [ ] Visible in hero
- [ ] Clickable (tel: and wa.me links)
- [ ] Repeated in footer
- [ ] Sticky WhatsApp bar on mobile

If missing any → add them.

### Service Area Specificity
Generic:
```
"Serving Selangor"
```

Specific (better):
```
"Meliputi Cheras, Ampang, Pandan Jaya & kawasan sekitar"
```

Check service_areas in config and use specific area names.

### Visual Trust Signals

#### License/Registration (if available)
If config has license number, display it subtly:
```html
<p class="text-xs text-stone-400">
  <span data-bm="Pendaftaran: {license}" 
        data-en="Registration: {license}">Pendaftaran: {license}</span>
</p>
```

#### Social Proof Numbers
If instagram_followers > 1000 or tiktok active:
```html
<p class="text-xs text-stone-500">
  <span data-bm="Ikuti kami di Instagram: {followers} followers"
        data-en="Follow us on Instagram: {followers} followers">
    Ikuti kami di Instagram: {followers} followers
  </span>
</p>
```

## Trust-Killing Patterns to Remove

### Remove These If Found:
- Stock photos of Western people in suits
- "Lorem ipsum" or any placeholder text
- Broken or "#" links
- Generic "Contact Us" with no visible phone/WhatsApp
- Vague service descriptions
- No mention of service area
- No contact info in hero
- Fake testimonials that use corporate language
- Prices like "$999" (should be RM format or "call for quote")

### Fix Generic Copy
BEFORE (low trust):
```
"We provide quality services to meet your needs."
```

AFTER (high trust):
```
"Servis aircond, pemasangan, dan pembaikan. Meliputi Cheras & kawasan sekitar sejak 2015."
```

## Trust Signal Placement Priority

1. **Hero** — minimum 3 trust signals
2. **Mini trust row** (below hero CTAs) — rating, response time, guarantee
3. **Trust badges section** — years, coverage, certifications
4. **Testimonials** — real quotes with names + areas
5. **FAQ** — addresses common objections transparently
6. **Footer** — contact info repeated, service areas listed

## Output Format
Return the refined HTML with trust signals strengthened.
Mark additions with comments:
```html
<!-- TRUST SIGNAL ADDED: Google rating badge -->
<!-- TRUST SIGNAL FIXED: Made testimonial sound more natural -->
```

## Self-Check Before Returning
- [ ] Hero has 3+ trust signals visible above fold
- [ ] Phone + WhatsApp visible and clickable
- [ ] Google rating shown (if ≥ 4.0)
- [ ] Years experience shown (if available)
- [ ] Service areas specific, not generic
- [ ] Testimonials sound real
- [ ] Response time mentioned
- [ ] Guarantee/warranty mentioned
- [ ] No lorem ipsum or placeholders
- [ ] No broken links
- [ ] Footer has contact info