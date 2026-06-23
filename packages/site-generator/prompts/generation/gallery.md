# Gallery Section Generation Prompt

## Context
Generate a project gallery/portfolio section for a local Malaysian SME website.
Shows real work, builds visual trust, and demonstrates true operational capability.
All elements must strictly enforce our **Brutalist-Elite Design Constitution**: utilize zero rounded corners (`rounded-none`), use thick high-contrast linework, and maintain hard left-alignment across all responsive viewports.

## Read First
- `docs/design-rules.md` — visual boundaries
- `docs/copy-rules.md` — local vocabulary rules
- `clients/{id}/config.json` — database configuration metadata

## Structure
1. Section header & layout block (Hard left-aligned typography stack)
2. Gallery grid (Option A or Option B layout architecture)

## Section Typography Layout (Hard Left Alignment)
- Container block utilities: `max-w-5xl mx-auto px-4 md:px-6 py-12`.
- **H2 Header:** `text-2xl md:text-3xl font-bold text-[#1B4332] tracking-tight mb-2 text-left`.
  - BM: "Projek Kami" | EN: "Our Projects"
- **Subheadline:** `text-stone-500 text-sm mb-8 text-left`.
  - BM: "Lihat hasil kerja kami di {area} dan sekitarnya"
  - EN: "See our completed work in {area} and surrounding areas"
- Both strings must feature explicit `data-bm` and `data-en` attributes.

## Gallery Layout Options

### Option A: Standard Grid (Default Mode)
```css
grid grid-cols-2 lg:grid-cols-3 gap-6
```
- Equal height frames using strict aspect metrics (aspect-[4/3]).

- Engineered for tight mobile scannability.

### Option B: Masonry Grid (If config.gallery_images contains 6+ items)

```css
columns-2 lg:columns-3 gap-6 space-y-6
```
- Staggered mechanical row heights to accommodate organic portrait/landscape varieties.

Use Option A by default unless the client's gallery_images array contains 6 or more items.

## Image Card Structure (Exposed Mechanical Frame)
Each item is rendered as an industrial container featuring sharp borders and heavy, permanent block shadows:

```html
<div class="w-full bg-white border-2 border-[#1B4332] rounded-none overflow-hidden flex flex-col items-stretch shadow-[4px_4px_0px_0px_#1B4332] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1B4332] group">
  <div class="w-full aspect-[4/3] bg-stone-200 border-b-2 border-[#1B4332] overflow-hidden relative shrink-0">
    <img src="{image.url}" alt="{image.alt}" loading="lazy"
         class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
  </div>
  
  <div class="p-3 bg-[#F8F4F0] flex-1 flex flex-col justify-center text-left">
    <p class="text-[#1B4332] text-[11px] font-extrabold uppercase tracking-tight leading-tight text-left m-0 p-0" 
       data-bm="{image.caption_bm}" 
       data-en="{image.caption_en}">{image.caption_bm}</p>
  </div>
</div>
```


## Data Source
`config.gallery_images` array with structure:
```json
{
  "url": "images/gallery/gallery-001.webp",
  "alt": "Aircond installation Cheras",
  "caption_bm": "Pemasangan aircond rumah teres 2 tingkat",
  "caption_en": "Aircond installation at double-storey terrace house"
}
```

## If Gallery Images Empty
If config.gallery_images is empty, generate a static placeholder grid.

- Layout rule: Force exactly 6 placeholder blocks using Option A.
- Each placeholder block container must be styled identically to the image card structure above, but show a clean wireframe vector crosshair or structural cross icon inside the image area.
- Placeholder text node inside card:

```html
<span class="text-stone-400 font-bold uppercase tracking-wider text-xs text-left" data-bm="Foto Projek"
data-en="Project Photo">Foto Projek</span>
```

Include comment: `<!-- PLACEHOLDER: Replace with real project photos -->`
Generate 4–6 placeholder cards.

## Image Alt Text Rules
Alt text should be descriptive and specific:
- GOOD: "Aircond installation completed at double-storey terrace house in Cheras"
- BAD: "Image 1" or "Project photo"

Pattern: "{Service} {location_type} in {area}"

## Caption Translations
If captions exist in config, they must have BM and EN versions.
Keep captions under 10 words.

Examples:
- BM: "Pemasangan aircond rumah teres 2 tingkat"
- EN: "Aircond installation at double-storey terrace house"

## Mobile Behavior
- 2 columns on mobile (<768px)
- 3 columns on desktop
- Images maintain aspect ratio
- Hover effects disabled on touch devices (use media query)

## Performance
- Use aspect-ratio to prevent layout shift
- object-cover to maintain consistent sizing
- Lazy loading implied (browser native)

## Placement
Typically placed:
- After services section
- Before or after testimonials
- Shows visual proof of capability

## Output Format
- Complete HTML section with Tailwind classes.
- Completely strip any surrounding conversational chatter, wrap text, or markdown code blocks.
- Include comment: `<!-- Gallery section | images: {count} | layout: {grid/masonry} -->`

## Self-Check
- [ ] Section header has data-bm and data-en
- [ ] Subheadline has data-bm and data-en (if present)
- [ ] Image alt text is descriptive
- [ ] Captions have data-bm and data-en (if present)
- [ ] Captions are fully exposed below the image inside an industrial panel
- [ ] Rounded corners are 100% eliminated (rounded-none)
- [ ] Permanent block shadows are embedded onto the row grid cards
- [ ] Grid responsive
- [ ] Aspect ratios consistent
- [ ] Hover effects smooth
- [ ] Placeholders clearly marked if gallery empty