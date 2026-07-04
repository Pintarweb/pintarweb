# Pintarweb Agent Rules

## Project context
Malaysian SME website factory. All output is for local Malaysian
businesses — contractors, aircond, trades, services.
First niche: aircond & contractor, Selangor / KL.
Quality target: each site should look like it's worth RM800+.

## CRITICAL: Language Rules

**ALWAYS use Malaysian Bahasa Melayu in all customer-facing text.**

- BM tone: conversational, local, natural Malay — not formal or stiff
- NEVER use Indonesian words: "emitkan" (use "hantar"), "tersebut", "para", "diantara"
- NEVER mix Chinese characters into Malay text
- NEVER use "RM447" — always RM446
- Common Malaysian vs Indonesian: "saya akan hantar" (NOT "emitkan"), "untuk" vs "bagi", "selepas" vs "setelah", "awak" vs "kamu", "sini" vs "situ", "macam mana" vs "bagaimana"

This applies to all text in generated sites: headings, body copy, CTAs, FAQ answers, testimonials.

## Always read before generating
- docs/design-rules.md
- docs/copy-rules.md
- docs/quality-checklist.md
- design-system/moods/{mood}/tokens.json (the active mood's design tokens)

## Generation rules
- Mobile-first always (390px baseline)
- WhatsApp CTA visible without scrolling
- No placeholder content in final output — use real images from the image pipeline
- No SaaS aesthetics
- Use active mood's tokens.json for ALL visual styling (colors, fonts, radius, shadows)
- Client data from clients/{id}/config.json
- Every site must be visually unique — vary layouts, not just colors
- Production CSS: link to `style.css` (NOT Tailwind CDN). Run `scripts/build-client.sh {id}` to build CSS.

## Image Pipeline (mandatory — no gradient placeholders)
1. **PRIORITY 1 (Client Specific):** Check `clients/{id}/images/` first. Use relative paths (e.g., `images/hero.webp`, `images/service-1.webp`, `images/gallery-1.webp`).
2. **PRIORITY 2 (System Fallback):** If client images are missing, use `design-system/references/image-collections/{category}/` — select matching filenames (hero.webp, service-1.webp, gallery-1.webp, etc.).
3. **FORBIDDEN:** No external URLs (Unsplash, etc.). No gradient div placeholders. No colored boxes with icons. Every image slot must use a real `<img>` tag with a real photo.
4. Image categories available: aircond-service, aircond-install, aircond-repair, plumbing, electrical, renovation.

## Language toggle (mandatory on every site)
Every site must support BM/EN toggle.
Rules:
- Every visible text element must have BOTH data-bm and data-en attributes
- data-bm is the default/displayed language (Malaysian Bahasa Melayu)
- data-en is the English translation
- BM tone: conversational, local, natural Malay — not formal or stiff
- EN tone: professional but approachable — not corporate
- Never translate literally — rewrite for natural tone in each language
- WhatsApp pre-filled message must also switch language (see toggle script)
- The toggle pill lives in the navbar — always visible
- The setLang() script goes at the bottom of every index.html
- Preference saved to localStorage key: pw_lang
- Reference: components/language-toggle/language-toggle.html
- IMPORTANT: Malaysian BM only — never Indonesian, never mixed languages

## CSS Build (production — no CDN)
- Do NOT include `<script src="https://cdn.tailwindcss.com">` in generated HTML
- Instead, include `<link rel="stylesheet" href="style.css">` in the `<head>`
- After generating HTML, run `bash scripts/build-client.sh {client-id}` to compile purged, minified CSS
- The build script scans the HTML for used Tailwind classes and generates only those
- Shared animations and component styles are in `src/input.css` (compiled into each client's style.css)
- Google Fonts link stays in the `<head>` (loaded from CDN)

## Scroll Animations (mandatory)
- Add class `reveal` to elements that should animate on scroll into view
- Use `reveal-delay-1`, `reveal-delay-2`, `reveal-delay-3` for staggered effects
- Include the IntersectionObserver script from `components/animations/scroll-reveal.js` at the bottom of every page
- Apply `reveal` to: section headings, cards, images, trust badges, testimonials, gallery items
- Animations: fade-in + slide-up (opacity 0 → 1, translateY 20px → 0)

## Hover Effects (mandatory)
- Cards: subtle lift on hover (translateY -2px to -4px) + shadow change
- Images: scale 1.05 on hover with overflow hidden
- Buttons: brightness/scale change, NOT dramatic transforms
- Links: color transition
- Keep hover effects subtle and refined — no dramatic animations

## Required Sections (flexible order — vary per site)
Each site must include these sections, but the ORDER and LAYOUT should vary between sites:
1. Navigation (sticky, hamburger for mobile)
2. Hero (split or full-width — vary by mood)
3. Trust signals (badges, stats, or inline — vary the format)
4. Services (grid, list, or cards — vary the layout)
5. Gallery with lightbox (real images, click to enlarge — see components/galleries/gallery-lightbox.html)
6. Testimonials/Reviews (star ratings, Google link — see components/reviews/review-cards.html)
7. Contact form (submits to WhatsApp — see components/forms/contact-form.html)
8. CTA banner
9. FAQ accordion (exclusive — one open at a time)
10. Footer (with WhatsApp, legal links, service area)

### Layout Variation Rules
- Do NOT use the same layout pattern for every section across every site
- Vary: split layouts, full-width banners, asymmetric grids, card lists, inline sections
- Each mood should feel different not just in color but in layout rhythm:
  - `trustworthy-local`: split hero, badge strip trust, 4-col service grid, 3-col testimonials
  - `bold-urgent`: full-width hero with banner, stats bar, 2x2 service grid, stacked testimonials
  - `premium-modern`: centered hero with image overlay, inline trust stats, asymmetric service layout, card testimonials with hover

### Navigation Requirements
- Sticky header with z-50
- Desktop: horizontal nav links
- Mobile: hamburger button with dropdown menu
- Dropdown closes on scroll AND on link click
- Anchor links need scroll-padding-top: 100px

### Contact Form
- Fields: Name, Phone, Service (dropdown), Message
- On submit: opens WhatsApp with pre-filled message containing form data
- Form styling uses mood tokens (border, radius, focus ring color)
- Reference: components/forms/contact-form.html

### Gallery
- Use real images from `clients/{id}/images/gallery-*.webp`
- Grid layout (2 cols mobile, 3 cols desktop)
- Click opens lightbox (full-screen overlay)
- Hover: subtle scale effect on images
- Reference: components/galleries/gallery-lightbox.html

### Review Cards
- Show Google rating with stars (mix of 4 and 5 star reviews)
- Reviewer name + area + Google logo
- Link to Google Maps for verification
- Reference: components/reviews/review-cards.html

## Mood-Driven Design System
- The client's `config.json` → `mood` field determines the visual design
- Read `design-system/moods/{mood}/tokens.json` for all colors, fonts, radius, and shadows
- Apply tokens consistently: every color, font-family, corner radius, and shadow must come from the active mood
- Three moods:
  - `trustworthy-local` — forest green #1B4332, Plus Jakarta Sans, rounded-none, hard offset shadows
  - `bold-urgent` — black #111111 + red #DC2626, Manrope, rounded-none, black offset shadows
  - `premium-modern` — slate #111827 + bronze #C08457, rounded-xl, soft shadows, thin borders
- Each site MUST look visually distinct from others using a different mood
- WhatsApp button color is always #25D366 (universal WhatsApp green) regardless of mood

## Quality Standards
- The site must look professional enough to justify an RM800 price tag
- Real photos everywhere — no placeholders, no gradients, no colored boxes
- Smooth scroll animations on key sections
- Hover effects on all interactive elements
- Consistent spacing and visual hierarchy
- Mobile experience must be as polished as desktop
- Load performance: purged CSS (~20KB), lazy-loaded images, no render-blocking scripts
- The site should feel like it was custom-built for THIS specific business, not generated from a template
