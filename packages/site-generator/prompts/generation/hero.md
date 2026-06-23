# Hero Section Generation Prompt

## Context
You are generating a hero section for a Malaysian SME website.
This is the first thing visitors see — it must convert immediately.

## Read First
- `docs/design-rules.md` — visual constraints
- `docs/copy-rules.md` — copy voice
- `design-system/moods/{mood}.md` — active DESIGN.md
- `clients/{id}/config.json` — all client data

## Requirements

### Structure
The final generated code must strictly strictly adhere to this layout tree structure to prevent viewport wrapping bugs:
1. Container Layout Shell: `<section class="bg-[#F8F4F0] py-12 md:py-20">`
   2. Parent Responsive Grid: `grid md:grid-cols-2 gap-8 md:gap-12 items-center`
      3. Column 1 (Left Content Block - ordered dynamically `order-2 md:order-1`):
         - Trust badge pill component (above headline)
         - Headline (H1) with explicit geo-targeting wrapped in color spans
         - Mini trust signals row (rating, response time, guarantee) - **MUST sit here between H1 and paragraph description**
         - Subheadline description paragraph
         - CTA buttons row (primary flex-col sm:flex-row stack)
4. Column 2 (Right Visual Asset Block - ordered dynamically `order-1 md:order-2`):
          - Context-driven structural trade worker asset image box
          - **Image Format:** Use .webp files following the asset pipeline rules in AGENTS.md

### Variants
Choose based on `config.hero_variant`:

**split** (default):
- Two columns: text left, image right
- Image: aspect-[4/3], rounded-none (brutalist style)
- Mobile: image below text, full width

**fullwidth**:
- Full-width background image with overlay
- Centered text
- High contrast text on image

**minimal**:
- No image
- Typography-led
- Strong hierarchy
- Use when client has no good photos

### Trust Badge (above headline)
- Inline-flex pill shape
- Emerald background (bg-emerald-50 border border-emerald-200)
- Icon + text
- Text from: "Berpengalaman Sejak {established}" or "Meliputi {service_areas}"
- Must have data-bm and data-en

### Headline (H1)
- text-3xl md:text-4xl
- font-bold
- Business name + service + area
- Pattern: "[Service] [Area]" or "[Business Type] [Location]"
- Example BM: "Pakar Aircond & Renovation Cheras"
- Example EN: "Your Trusted Aircond & Renovation Expert in Cheras"
- Must have data-bm and data-en

### Subheadline
- text-stone-600
- 2–3 sentences max
- Services offered + areas covered + urgency/benefit
- Must have data-bm and data-en
- Keep under 100 words total

### Primary CTA
- WhatsApp link: `https://wa.me/{whatsapp}?text=Hi%2C%20saya%20nak%20tanya%20pasal%20servis%20{service}`
- bg-[#25D366] hover:bg-[#1ebe5d]
- White text, bold
- rounded-none (brutalist style - NO rounded corners)
- WhatsApp icon (include SVG)
- Label BM: "WhatsApp Kami"
- Label EN: "WhatsApp Us"
- Must have data-bm and data-en on label

### Secondary CTA
- Phone link: `tel:+{phone}`
- border border-stone-300 bg-white hover:bg-stone-50
- Stone-800 text, bold
- rounded-none (brutalist style - NO rounded corners)
- Phone icon (include SVG)
- Display formatted phone: {phone}

### Mini Trust Row
Below CTAs, text-xs, flex wrap gap-4:
- Google rating + review count (if rating > 4.0)
- Response time badge ("Balas dalam 1 jam" / "Reply within 1 hour")
- Guarantee badge ("Jaminan Mutu Kerja" / "Workmanship Guaranteed")
- Each item: icon + text with data-bm and data-en

## Data Sources
All from `config.json`:
- business_name
- tagline
- phone
- whatsapp
- area
- service_areas (array)
- services (array)
- established
- google_rating
- google_review_count

## Output Format
- Complete HTML block with Tailwind classes
- No explanations before or after
- Include comment: `<!-- Hero Section | Variant: {variant} | Mood: {mood} -->`
- All text elements must have data-bm and data-en attributes
- Default display text is data-bm value

## Mobile Rules
- Stack vertically on mobile
- CTA buttons: full width on mobile, inline on desktop
- Image: full width on mobile, half width on desktop
- Trust badge and mini trust row: wrap on mobile

## Copy Tone
- BM: Conversational, warm, direct — "Kami datang hari ini"
- EN: Professional but approachable — "We'll be there today"
- Avoid: corporate jargon, marketing fluff, fake urgency
- Reference: `docs/copy-rules.md` for forbidden words

## Self-Check Before Output
- [ ] All text has data-bm and data-en
- [ ] WhatsApp link uses correct format
- [ ] Phone number is clickable tel: link
- [ ] Service area mentioned
- [ ] Trust badge present
- [ ] No forbidden words in copy
- [ ] Mobile layout tested mentally at 390px