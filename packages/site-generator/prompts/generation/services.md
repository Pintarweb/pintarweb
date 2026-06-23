# Services Section Generation Prompt

## Context
Generate a services grid section for a Malaysian SME website.
This section explains WHAT the business does clearly, realistically, and quickly.
All designs must strictly adhere to the Brutalist-Elite constitution: maintain high-contrast color logic and ensure NO centered text alignment across any viewport.

## Read First
- `docs/design-rules.md` — visual constraints
- `docs/copy-rules.md` — copy voice
- `design-system/moods/{mood}.md` — active DESIGN.md
- `clients/{id}/config.json` — all client data

## Structure
1. Section header (H2) — **Strictly left-aligned**
2. Subheadline (optional, 1 line about coverage area) — **Strictly left-aligned**
3. Service cards grid (2–4 cards maximum)

## Section Header & Subheadline
- H2: `text-2xl md:text-3xl font-bold text-[#1B4332] tracking-tight mb-2 text-left`
- Subheadline: `text-stone-500 text-sm mb-8 text-left`
- Pattern BM: "Meliputi {area}, {area} dan kawasan sekitar"
- Pattern EN: "Covering {area}, {area} and surrounding areas"
- Must have data-bm and data-en attributes

## Service Cards Layout (Horizontal Split Framework)
Layout:
- `grid grid-cols-1 lg:grid-cols-2 gap-6`
- Each card: `border-2 border-[#1B4332] rounded-none bg-white flex flex-col sm:flex-row items-stretch overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#1B4332]`

Internal Structural Sections (Strict Order per Card):

### 1. Left Visual Asset Block
- Classes: `w-full sm:w-1/3 min-h-[140px] shrink-0 border-b-2 sm:border-b-0 sm:border-r-2 border-[#1B4332] relative`
- Requirements: Render an `<img>` tag following our prioritized asset fallback logic.
- **Image Lookup Sequence:**
  1. Priority 1 (Client Folder Verification): Check the physical directory on disk at `clients/{id}/images/` for files named `install.webp`, `service.webp`, `repair.webp`, or `reno.webp`. If these files exist in that directory, you MUST use them, but write the output HTML path relative to index.html as `images/install.webp`, `images/service.webp`, `images/repair.webp`, and `images/reno.webp`.
  2. Priority 2 (System Fallback): Only if `clients/{id}/images/` is empty or missing those files on disk, fall back to outputting the system reference collection path: `../../design-system/references/image-collections/{category}/{file}.webp`.
- **Strict Visual Constraint:** Every file chosen must depict realistic, hands-on trade action close-ups or tools. Never use foreign/Western faces, high-tech offices, or laptop/smartphone displays.

### 2. Right Content Block
- Classes: `p-5 flex-1 flex flex-col justify-center text-left`
- **Header Row Layout (Icon + Title Side-by-Side):**
  - Inside a wrapper class: `flex items-center gap-3 mb-3 text-left`
  - **Icon Box:** `w-10 h-10 border-2 border-[#1B4332] bg-[#F8F4F0] flex items-center justify-center shrink-0 rounded-none`
    - Icon Style: Render clean, thin-line vector raw SVGs (Lucide style) with classes: `w-5 h-5 text-[#1B4332]`. Use properties: `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`.
    - Selected Vectors: Aircond Installation = `air-vent` SVG, Aircond Service = `sparkles` SVG, Aircond Repair = `wrench` SVG, Renovation = `hammer` SVG.
  - **Service Title:** H3, `text-base font-bold text-[#1B4332] text-left p-0 m-0`.
- **Description Paragraph:**
  - Classes: `text-stone-600 text-xs leading-relaxed text-left`

## Data Source
`config.services` array — map each service item to an individual card block up to a maximum of 4 distinct panels.

## Service Descriptions (The Human Noticing Rule)
Keep under 20 words per description. Explicitly match what the technician executes with a realistic, upfront local customer benefit.
- *Forbidden Jargon:* "comprehensive solutions", "cutting-edge", "world-class", "industry leading", "innovative".
- *Local Terms Check:* Use terms like "luas & kemas" or "segar & sejuk". Never use generic or non-contextual expressions like "lawa".
- Every single title and description text node must have explicit `data-bm` and `data-en` attributes. Default raw inner HTML text must render the BM value.

## Output Format
- Complete HTML section snippet with native Tailwind CSS classes only.
- No surrounding conversational text, explanations, or markdown boxes before or after the code.
- Include an initial identifying header comment: ``