# Trust Section Generation Prompt

## Context
Generate trust signals section for Malaysian SME website.
This section reduces friction by showing credibility indicators early.
All designs must strictly adhere to the Brutalist-Elite constitution: maintain high-contrast color logic, ensure sharp corners, and ensure NO centered text alignment or centered flex properties across any viewport.

## Read First
- `docs/design-rules.md` — visual constraints
- `docs/copy-rules.md` — copy voice
- `clients/{id}/config.json` — all client data

## Variants
Choose based on what data is available:

### Variant A: Trust Badges (has license/established/coverage)
Grid of 3–4 badge cards using the **Asymmetric Industrial Strip Framework** detailed below.
- Years in business ("Sejak {year}" / "Since {year}")
- License/registration (if available)
- Coverage area ("{X} kawasan diliputi" / "Serving {X} areas")
- Response time ("Balas dalam 1 jam" / "Reply within 1 hour")

### Variant B: Testimonials Preview (has testimonials)
Alternative to full testimonials section — use when testimonials section
is placed lower on page. Shows 3 brief testimonials with ratings.
Must adhere strictly to Brutalist-Elite layout configurations: cards must use `text-left`, `rounded-none`, `border-2 border-[#1B4332]`, left-aligned star layouts, and include the kinetic hover shadow offset engine (`hover:shadow-[4px_4px_0px_0px_#1B4332]`).

Choose Variant A by default unless specifically requested otherwise.

# Trust Badges Layout (Variant A - Split Structural Grid)

### Structure
- No narrative headings or subheaders allowed.
- Container block utilities: `max-w-7xl mx-auto px-4 my-12 text-left`.
- Grid wrapper layout: `grid grid-cols-2 lg:grid-cols-4 gap-6`.

### Card Structural Blueprint (Left-Wielded Accent Sidebar)
Each metric item must be structured as a sharp, horizontal row block with a permanent, hard industrial drop shadow:
```css
w-full bg-white border-2 border-[#1B4332] rounded-none flex flex-row items-stretch overflow-hidden shadow-[4px_4px_0px_0px_#1B4332] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1B4332]
```
### Internal Card Structural Sections (Strict Split Configuration)
1. Left Wielded Icon Block (Dynamic Gimmick Sidebar)
- Container Classes: w-14 bg-[#1B4332] flex items-center justify-center shrink-0 rounded-none relative border-r-2 border-[#1B4332] group
- Icon Interactive Engine (Lucide Gimmicks): Render raw, thin-line vector SVGs utilizing absolute contrast classes: w-6 h-6 text-[#F8F4F0] transition-transform duration-300.
    - Use explicit attributes: viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round".
    - Animation Triggers: Every SVG must utilize precise Tailwind structural triggers on parent hover (group-hover:)` to invoke mechanical kinetic feedback.

2. Right Data-Content Panel
    - Container Classes: p-4 flex-1 flex flex-col justify-center bg-white text-left

    - Stat Label node: H3 node block, text-2xl md:text-3xl font-bold text-[#1B4332] tracking-tighter leading-none mb-1 text-left p-0 m-0.

    - Description text node: Paragraph block, text-stone-500 text-[11px] font-bold tracking-tight uppercase leading-none text-left p-0 m-0.

### Metric Data Pipelines (Computed via 2026 Baseline Year)
Extract specific parameters from config.json to construct exactly 4 high-contrast panels with custom kinetic animations:

1. Years Badge:
    - Icon: shield SVG.
    - Gimmick Animation: On card hover, rotate smoothly (group-hover:rotate-12 transition-transform).
    - Stat: 2026 - established + "+ Tahun".
    - Label BM: "Pengalaman Kerja". Label EN: "Years Active".

2. Coverage Badge:
    - Icon: map-pin SVG.
    - Gimmick Animation: On card hover, bounce vertically up and down (group-hover:-translate-y-1 ease-in-out).
    - Stat: service_areas.length + "+ Kawasan".
    - Label BM: "Zon Liputan Semasa". Label EN: "SME Area Scope".

3. Response Badge:
    - Icon: clock SVG.
    - Gimmick Animation: On card hover, the clock hands spin smoothly (group-hover:rotate-180 duration-500).
    - Stat: "< 1 Jam".
    - Label BM: "Respons Pantas WhatsApp". Label EN: "Avg Reply Window".

4. Rating Badge: (Render only if google_rating metric exists).
    - Icon: star SVG icon (NOT text character - use: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`).
    - Gimmick Animation: On card hover, scale up and slightly pivot (group-hover:scale-110 group-hover:rotate-6).
    - Stat: "{rating}" (displayed beside star icon).
    - Label BM: "{review_count} Ulasan Sah". Label EN: "{review_count} Verified Reviews".

## Data Sources
From `config.json`:
- established (year)
- service_areas (array)
- google_rating
- google_review_count

## Copy & Translation Rules
- Every single text node wrapper must feature explicit data-bm and data-en selector attributes.
- Default raw inner HTML values must render the Bahasa Malaysia text directly.
- Language tone must align with our master agent rules: conversational local contractor jargon for BM, and confident professional prose for EN.

## Mobile Behavior
- 2 columns on mobile (<768px)
- 4 columns on desktop

## Placement
Typically placed:
- Immediately after hero section, OR
- Between services and testimonials

## Output Format
Complete HTML section with Tailwind classes.
No surrounding conversational text, explanations, or markdown boxes before or after the code.
Include comment: `<!-- Trust Badges Section | Variant: A -->`

## Self-Check
- [ ] All labels have data-bm and data-en
- [ ] Stats are accurate based on config data
- [ ] Icons present and appropriate
- [ ] Grid responsive
- [ ] Cards not too tall on mobile
- [ ] No marketing fluff in labels