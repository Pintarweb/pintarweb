# Footer Section Generation Prompt

## Context
Generate footer section for Malaysian SME website.
Final conversion opportunity + essential business information.
All elements must strictly enforce our **Brutalist-Elite Design Constitution**: utilize zero rounded corners (`rounded-none`), use thick high-contrast line logic, and guarantee NO centered elements, centered text nodes, or centered layout configurations exist across any active viewport.

## Read First
- `docs/design-rules.md`
- `docs/copy-rules.md`
- `clients/{id}/config.json`

## Structure
Footer with:
1. Business name + tagline/area
2. Contact links (phone, WhatsApp)
3. Service areas list (optional)
4. Copyright line

## Layout (The Heavy Grounded Anchor)
- **Container Block Styles:** `w-full bg-[#1B4332] text-emerald-100 border-t-4 border-stone-900 py-12 px-6 text-left`.
- Inside Wrapper: `max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left`.

## Left Column: Business Info
- **Business Name Layout:** H4 node block, `font-bold text-white text-lg tracking-tight mb-2 text-left`.
  - Display: `{business_name}`
- **Tagline/Area Layout:** Paragraph node, `text-xs font-bold tracking-wider text-emerald-300 text-left m-0 p-0`.
  - Pattern BM: "{area} & kawasan sekitar"
  - Pattern EN: "{area} & surrounding areas"
  - Must have data-bm and data-en

## Middle Column: Contact Links & Scope
Vertical stack of clickable contact methods and zones:
- **Container:** `flex flex-col items-start justify-start gap-2.5 text-left`.
- **Phone Link:**
  ```html
  <a href="tel:+60{phone}" class="hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 text-left">
    <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
    <span>Call: {formatted_phone}</span>
  </a>

### WhatsApp Link
```html
<a href="[https://wa.me/60](https://wa.me/60){whatsapp}" class="hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 text-left">
  <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
  <span data-bm="WhatsApp Kami" data-en="WhatsApp Us">WhatsApp Kami</span>
</a>
```

## Right Column: Copyright
- text-xs text-emerald-400
- Pattern: "© {current_year} {business_name}."
- Add translated line: 
  - BM: "Hak cipta terpelihara."
  - EN: "All rights reserved."
- Must have data-bm and data-en on translated part

## Optional: Service Areas Row
If `service_areas` array has 4+ items, add a row above copyright:
- text-xs text-emerald-300
- Pattern: "Meliputi: {area}, {area}, {area}..."
- Keep on one line, comma-separated
- No data-bm/data-en needed (area names don't translate)

## Icons
Use simple SVG icons:
- Phone: standard phone icon
- WhatsApp: WhatsApp logo icon
Keep icons small (w-3.5 h-3.5), single color.

## Contact Link Behavior
- Phone: `tel:+60{phone}` format
- WhatsApp: `https://wa.me/60{whatsapp}` (no pre-filled message in footer)
- Both open native apps on mobile

## Mobile Behavior
- Stack vertically on mobile (flex-col)
- Horizontal on desktop (md:flex-row)
- All text left-aligned on mobile
- Distributed on desktop (justify-between)

## Spacing
- py-8: vertical padding
- gap-6: spacing between columns on mobile
- Max width: 1200px (contained like rest of page)

## Color Rationale
- Dark green (#1B4332): matches primary brand color, feels grounded
- Light green text: readable contrast, not pure white (softer)
- Links hover to white: clear interactive state

## Data Sources
From `config.json`:
- business_name
- area (for tagline)
- phone
- whatsapp
- service_areas (optional)

## Output Format
Complete HTML footer with Tailwind classes.
Completely strip any surrounding conversational introductions, summaries, markdown wrappers, or explanations.
Include comment: `<!-- Footer Section -->`

## Self-Check
- [ ] Business name displayed correctly
- [ ] Tagline/area has data-bm and data-en
- [ ] Phone link is clickable tel: format
- [ ] WhatsApp link correct format
- [ ] Copyright line has data-bm and data-en
- [ ] Icons present and sized correctly
- [ ] Responsive layout works on mobile
- [ ] Contrast sufficient (AA compliant)
- [ ] No marketing fluff