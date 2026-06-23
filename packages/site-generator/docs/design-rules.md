# Pintarweb Design Rules

## Anti-patterns (NEVER do these)
- No giant hero sections above 100vh
- No SaaS or startup aesthetics (no floating blobs, no purple gradients)
- No excessive animations — max fade/slide only
- No stock photos of people in suits or generic Western businesses
- No oversized centered headlines that feel "template-like"
- No card grids that look like Notion or Webflow demos
- No excessive whitespace that makes the page feel empty
- No dark mode defaults for Malaysian SME sites

## Layout rules
- Mobile-first, always. Design for 390px width first.
- WhatsApp CTA must be visible within 3 seconds of page load
- Max 2 fonts per site (heading + body)
- Trust signals must appear above the fold
- Service area (location) must be visible in hero or immediately below
- Phone number must be a clickable tel: link
- Sections must feel grounded and local, not corporate
- Max section padding: 80px top/bottom on desktop, 48px on mobile
- Language toggle button for english and BM
- Anchor link scroll offset: add `html { scroll-padding-top: 100px; }` CSS to prevent sticky header from covering section titles when navigating via nav links

## Typography rules
- Heading: use weight 600–700 only for main headline
- Body: weight 400 only, min 16px, line-height 1.7
- Never use more than 3 font sizes in one section
- No font size below 14px for any visible text

## Image rules
- Use realistic business photos, not stylised illustrations
- Before/after project photos perform better than stock
- Testimonial photos should look like real people (initials avatar acceptable)
- Hero images: local context preferred (Malaysian settings, familiar environments)

## Strict Local Realism Image Rules (Anti-Western Bias)
- CRITICAL ERROR: Never use stock photos featuring foreign/Western individuals, clean corporate offices, or idealized Western domestic environments. This instantly breaks local believability.
- MALAYSIAN SMES ARE HANDS-ON: If showing people, they must look like local Malaysian or Southeast Asian tradespeople, wearing realistic, slightly worn work clothes—not pristine corporate uniforms.
- FOCUS ON CLOSE-UPS: To easily bypass stock photo bias, prioritize high-fidelity close-ups of the trade action itself (e.g., hands working on copper pipes, a manifold gauge connected to an outdoor compressor unit, a trowel smoothing down cement). Close-ups of tools and machinery carry no ethnic or geographic mismatch and feel intensely authentic.

## Color rules
- Max 3 colors per site (primary, accent, neutral)
- Trust-focused sites: avoid red as primary (feels alarming)
- Use warm neutrals for backgrounds (not cold white #FFFFFF)
- CTA buttons: high contrast, not subtle