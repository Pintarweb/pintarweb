# Testimonials Section Generation Prompt

## Context
Generate testimonials section for Malaysian SME website.
Testimonials build trust through social proof from real customers.
All generated elements must strictly enforce our **Brutalist-Elite Design Constitution**: utilize zero rounded corners (`rounded-none`), use thick high-contrast line logic, and guarantee NO centered elements, centered text nodes, or centered layout configurations exist across any active viewport.

## Read First
- `docs/design-rules.md`
- `docs/copy-rules.md`
- `clients/{id}/config.json`

## Structure
1. Section header (H2 - Hard left-aligned typography stack)
2. Testimonial cards grid (3 cards recommended)

## Section Typography Layout (Hard Left Alignment)
- Container block utilities: `max-w-5xl mx-auto px-4 md:px-6 py-12`.
- **H2 Header:** `text-2xl md:text-3xl font-bold text-[#1B4332] tracking-tight mb-8 text-left`.
  - BM: "Apa Kata Pelanggan Kami" | EN: "What Our Customers Say"
  - Must have data-bm and data-en

## Grid Layout & Spacing
- Layout class: `grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 text-left`.

### Testimonial Card Style (The Heavy Industrial Block)
Each item must be a rigid row layout featuring sharp borders and a permanent, heavy block shadow:

```css
w-full bg-white border-2 border-[#1B4332] rounded-none p-6 flex flex-col justify-between text-left shadow-[4px_4px_0px_0px_#1B4332] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1B4332]
```
### Card Internal Layout Sections (Strict Stacked Sequence)
1. **Star Rating Block**
- Container Classes: flex gap-0.5 mb-3 justify-start items-center
- Stars Element: Use SVG star icons, NOT text characters (text characters get corrupted):
  ```html
  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  ```
- For 4-star rating, use gray star for the 5th: `text-stone-300`

2. **Quote Body Text**
- Container Classes: text-stone-700 text-sm leading-relaxed mb-6 text-left p-0 m-0 flex-1.
- Format: Must be enclosed in raw quotation marks: "[Testimonial Text]".
- Every string must have explicit data-bm and data-en attributes.
- Keep under 50 words.

3. **Reviewer Mechanical Info Row**
- Container Wrapper: flex flex-row items-center gap-3 border-t-2 border-stone-100 pt-4 text-left shrink-0.
- Square Box Avatar: w-9 h-9 border-2 border-[#1B4332] bg-[#F8F4F0] text-[#1B4332] text-xs font-extrabold flex items-center justify-center rounded-none shrink-0. (Compute text content using reviewer's name initials).
- Text Meta Stack: flex flex-col justify-center text-left.
  - Name node: text-xs font-extrabold text-stone-900 leading-none text-left mb-1.
  - Area node: text-[10px] font-bold text-stone-400 tracking-wider uppercase leading-none text-left.
- Verification Link: After area text, add small link:
  - href="https://maps.google.com" target="_blank"
  - Text: "Lihat Ulasan Asal" (BM) / "View Original Review" (EN)
  - Style: text-[10px] text-stone-400 underline hover:text-[#1B4332]

### Star Rating Authenticity
- At least one testimonial should have 4 stars (★★★★☆) instead of 5 to represent real, un-edited customer authenticity
- Remaining can be 5 stars

## Data Source
`config.testimonials` array with structure:
```json
{
  "name": "Puan Siti",
  "area": "Taman Connaught",
  "text_bm": "Aircond rosak malam-malam, call terus datang. Kerja kemas, harga okay.",
  "text_en": "Aircond broke down at night, called and they came right away. Clean work, fair price.",
  "rating": 5
}
```

If testimonials array is empty — use the default placeholder mode with exactly 3 mock cards but mark clearly with comment:    
`<!-- PLACEHOLDER: Replace with real testimonials -->`

## Quote Translation Rules
Testimonials must sound like REAL Malaysian people talking.

BM examples (good):
- "Aircond rosak malam-malam, call terus datang. Kerja kemas, harga okay."
- "Service aircond office kami. Cepat siap, tak banyak songeh."
- "Pasang aircond baru, kemas kerja dia. Explain elok pasal warranty."

EN examples (good):
- "Aircond broke down at night, called and they came right away. Clean work, fair price."
- "Serviced our office aircond units. Fast, no fuss."
- "Installed new aircond unit. Tidy work. Explained the warranty clearly."

BAD (sounds fake/corporate):
- "Exceptional service with professional technicians. Highly satisfied with their innovative approach."
- "World-class expertise and seamless communication throughout the project."

## Card Styling
```css
bg-white border border-stone-200 rounded-xl p-5
```

Avoid:
- Shadows too heavy
- Gradients
- Over-designed cards

Keep simple and clean.

## Mobile Behavior
- Stack vertically on mobile (<640px)
- 3 columns on desktop

## Output Format
Complete HTML section with Tailwind classes.
Completely strip any surrounding conversational chatter, summaries, introduction text, or markdown code boxes.
Include comment: `<!-- Testimonials section | count: {number} -->`

## Self-Check
- [ ] All quotes have data-bm and data-en
- [ ] Quotes sound like real people, not marketing copy
- [ ] Names and areas are realistic
- [ ] Avatar initials match names
- [ ] Star ratings display correctly
- [ ] Grid responsive
- [ ] Under 50 words per quote
- [ ] All rounded corners are 100% eliminated (rounded-none)
- [ ] Permanent thick offset black shadows are embedded onto the cards
- [ ] Avatars are styled as hard square blocks