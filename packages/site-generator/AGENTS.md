# Pintarweb Agent Rules

## Project context
Malaysian SME website factory. All output is for local Malaysian
businesses — contractors, aircond, trades, services.
First niche: aircond & contractor, Selangor / KL.

## Always read before generating
- docs/design-rules.md
- docs/copy-rules.md
- docs/quality-checklist.md

## Generation rules
- Mobile-first always (390px baseline)
- WhatsApp CTA visible without scrolling
- No placeholder content in final output
- No SaaS aesthetics
- Use active DESIGN.md in design-system/moods/ for visual context
- Client data from clients/{id}/config.json

## Strict Asset & Image Pipeline Rules
When generating components or selecting image source (`<img> src`) paths, you must strictly follow this two-tier priority fallback sequence:

1. **PRIORITY 1 (Client Specific):** Check `clients/{id}/images/` first. If matching project or trade photos exist here, you MUST use these relative paths (e.g., `clients/{id}/images/hero.webp`).
2. **PRIORITY 2 (System Fallback Collection):** If `clients/{id}/images/` is empty or missing specific trade images, fallback to your proprietary curated library inside `design-system/references/image-collections/`. Select a highly distinct, matching filename from the appropriate category subfolder (e.g., `design-system/references/image-collections/aircond-service/service-1.webp`).
3. **CRITICAL:** Completely forbidden from using global external URLs (like standard Unsplash placeholders) unless explicitly authorized by the user.

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
- Reference component: components/language-toggle/language-toggle.html

## Output
- Site:   clients/{id}/index.html
- Audit:  clients/{id}/audit.html
- Images: clients/{id}/images/
- Reports: clients/{id}/reports/

## Preview URL Convention
- All client preview URLs follow: `https://preview.pintarweb.com/clients/{id}/`
- Report page: `https://preview.pintarweb.com/clients/{id}/report`
- Audit page: `https://preview.pintarweb.com/clients/{id}/audit`
- Always use `/clients/{id}/` prefix (not bare `/{id}/`)
- When generating links to the live demo site in audit/report pages, use the `/clients/{id}/` path

## Standard Component Structure
All landing pages should include these components in order:
1. Navigation (sticky nav with hamburger for mobile)
2. Hero section (split layout, CTA buttons)
3. Trust badges section
4. Services grid
5. Testimonials (with verification links, mix of 4 and 5 stars)
6. CTA banner
7. FAQ accordion (exclusive - one open at a time)
8. Gallery (client images or placeholders)
9. Footer

### Navigation Requirements
- Sticky header with z-50
- Desktop: horizontal nav links
- Mobile: hamburger button with dropdown menu
- Dropdown closes on scroll
- Anchor links need scroll-padding-top: 100px

### Brutalist Design Constraints
- ZERO rounded corners (rounded-none everywhere)
- Thick offset shadows: shadow-[4px_4px_0px_0px_#1B4332]
- Hard left-aligned text (no centered elements)
- Forest green (#1B4332) as primary brand color