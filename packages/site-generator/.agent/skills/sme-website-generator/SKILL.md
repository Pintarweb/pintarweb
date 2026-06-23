# SME Website Generator

## Metadata
- **Skill ID:** sme-website-generator
- **Version:** 1.0.0
- **Trigger contexts:** "generate section", "build hero", "create website", "build demo", "generate site", "build page", any request involving HTML output for a client site
- **Works with:** antigravity, opencode, claude-code

---

## Purpose
Generate HTML/Tailwind CSS sections and full pages for Malaysian SME websites.
This skill governs all visual and structural output for client demo sites.
Apply this skill automatically whenever generating any part of a client website.

---

## Core Mandate
You are building trust-generation tools for Malaysian small business owners —
not portfolio pieces, not SaaS dashboards, not startup landing pages.

Every output must feel like it belongs to a real, local Malaysian business.
If a business owner looked at this and thought "this looks like a template" —
the output has failed.

---

## Before Generating Anything

Always load and read:
- `docs/design-rules.md` — visual constraints (non-negotiable)
- `docs/copy-rules.md` — copy voice and tone (non-negotiable)
- `docs/quality-checklist.md` — output must pass before delivery
- `design-system/moods/{active-mood}.md` — current DESIGN.md for this client
- `clients/{id}/config.json` — all client data lives here, never hardcode

If config.json is not provided, ask for it before generating. Never invent client data.

---

## Generation Rules

### Structure
- Mobile-first always — design for 390px width, then scale up
- Every section must be a self-contained HTML block with its own styles
- Use Tailwind utility classes only — no custom CSS unless unavoidable
- Single `index.html` output — no frameworks, no build steps, no dependencies
- All external resources via CDN only (Tailwind CDN, Google Fonts)

### Data Handling
- All content comes from `config.json` — never hardcode business names, phones, services
- Use template variables clearly: `{business_name}`, `{phone}`, `{whatsapp}`
- If a config field is empty (e.g. no testimonials yet), render a sensible placeholder
  section that can be populated later — never leave visible empty blocks

### Section Assembly Order (default)
1. Hero
2. Trust signals / badges
3. Services grid
4. Testimonials
5. Gallery / project photos
6. FAQ
7. CTA banner
8. Footer

This order can be adjusted based on `config.json → hero_variant` and niche logic.
Urgency-first niches (emergency plumbing, locksmith): move CTA to position 2.
Trust-first niches (renovation, legal): keep trust signals at position 2.

---

## Hero Variants

### split (default)
- Left: headline, subheadline, WhatsApp CTA, service area badge
- Right: business photo or project image
- Mobile: image collapses below text

### fullwidth
- Full-width background image with overlay
- Centered text, high contrast
- Use when client has strong project photos

### minimal
- No image
- Strong typography-led layout
- Use for urgency/price-sensitive niches

---

## WhatsApp CTA Rules
- ALWAYS include a sticky bottom WhatsApp bar on mobile
- Format: `https://wa.me/{whatsapp}?text=Hi%2C%20saya%20nak%20tanya%20pasal%20servis%20awak`
- Pre-filled message must be in BM — feels more natural to Malaysian users
- Button label: "Hubungi via WhatsApp" or "Tanya Kami Sekarang"
- Color: WhatsApp green (#25D366) — do not substitute

---

## Trust Signal Rules
- License/registration number if available in config
- Years in business: "Berpengalaman sejak {established}"
- Service area: always visible — "Meliputi {service_areas}"
- Google rating display if rating > 4.0
- Guarantee badge if niche supports it (aircond: workmanship guarantee / Jaminan Mutu Kerja)

---

## Typography Rules
Load from active DESIGN.md. Fallback if not specified:
- Heading: Plus Jakarta Sans, 700 weight
- Body: Inter, 400 weight, 16px min, line-height 1.7
- Never use more than 2 font families
- Never use font-size below 14px for visible text

---

## Color Rules
Load palette from active DESIGN.md. Fallback defaults:
- Trustworthy Local: primary #1B4332, accent #52B788, background #F8F4F0
- Premium Modern: primary #0F172A, accent #6366F1, background #FFFFFF
- Bold Urgent: primary #7F1D1D, accent #EF4444, background #FAFAFA

Never use pure #FFFFFF as background — too cold for SME trust context.
Never use red as primary for non-urgency niches.

---

## Performance Rules
- No images above 200kb — reference config paths, do not embed base64
- No JavaScript animations heavier than CSS transitions
- No external scripts except Tailwind CDN and Google Fonts
- Target: page renders in under 3 seconds on slow 4G

---

## Output Format
- Output the complete HTML block for the requested section only
- If generating a full page, output complete `index.html`
- No explanation text before or after the HTML unless asked
- No markdown code fences — raw HTML only
- Add a comment at the top of each section block:
  `<!-- Section: {section-name} | Variant: {variant} | Mood: {mood} -->`

---

## Language Toggle (Mandatory)

Every site you generate must support BM/EN language toggle.
This is non-negotiable — it is part of the base template.

### Rules

- Every visible text element must have data-bm AND data-en attributes
- The inner text content defaults to the data-bm value
- Never output text-only elements without both attributes
- Translate naturally — not literally. See docs/copy-rules.md language toggle section.
- The toggle pill goes in the navbar — copy from components/language-toggle/language-toggle.html
- The setLang() script goes at the bottom of every index.html — copy verbatim
- WhatsApp pre-filled message switches language inside setLang()

### Attribute pattern — apply to every text element

html

`<span data-bm="[BM text]" data-en="[EN text]">[BM text]</span>`

### setLang() script

Always copy the full script verbatim from:
components/language-toggle/language-toggle.html
Do not rewrite or shorten it.

### Elements that must always have both attributes

- All headings (h1, h2, h3)
- All paragraph text
- All CTA button labels
- All nav links
- All trust badge text
- All service card titles and descriptions
- All testimonial quotes and reviewer areas
- All FAQ questions and answers
- All footer text
- WhatsApp sticky bar label
- Page <title> tag (data-bm and data-en on the title element)

### Elements that do NOT need translation

- Phone numbers (012-345 6789 — same in both languages)
- Star ratings (★★★★★)
- Business name (Razif Aircond & Renovation — same)
- Domain/URL references
- Social media handles
- Pure icons with no label

## Self-Check Before Outputting
Run through these mentally before every output:

- [ ] Loaded config.json — no hardcoded client data
- [ ] Read design-rules.md — no anti-patterns present
- [ ] Read copy-rules.md — no forbidden words in copy
- [ ] WhatsApp CTA visible on mobile without scrolling
- [ ] Phone number is a clickable `tel:` link
- [ ] Service area mentioned in hero or immediately below
- [ ] No placeholder text visible (Lorem ipsum, [INSERT], etc.)
- [ ] No SaaS/startup aesthetic elements
- [ ] Passes mobile 390px layout mentally
- [ ] Would a Malaysian SME owner believe this is their business?
- [ ]  Would a Malaysian SME owner believe this is their business?
- [ ]  Every text element has data-bm AND data-en attributes
- [ ]  BM and EN translations both sound natural (not literal)
- [ ]  setLang() script is present at bottom of page
- [ ]  Toggle pill is in navbar
- [ ]  WhatsApp pre-filled message switches in both languages

If any check fails — fix before outputting.