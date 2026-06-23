# FAQ Section Generation Prompt

## Context
Generate FAQ (Frequently Asked Questions) section for Malaysian SME website.
Answers common objections and reduces friction before contact.
All elements must strictly enforce our **Brutalist-Elite Design Constitution**: utilize zero rounded corners (`rounded-none`), apply thick high-contrast line logic, and guarantee NO centered elements, centered text nodes, or centered layout configurations exist across any active viewport.

## Read First
- `docs/design-rules.md`
- `docs/copy-rules.md`
- `docs/niche-logic.md` (for niche-specific questions)
- `clients/{id}/config.json`

## Structure
1. Section header (H2 - Hard left-aligned typography stack)
2. Accordion items (5 questions default utilizing details elements)

## Section Typography Layout (Hard Left Alignment)
- Container block utilities: `max-w-5xl mx-auto px-4 md:px-6 py-12`.
- **H2 Header:** `text-2xl md:text-3xl font-bold text-[#1B4332] tracking-tight mb-8 text-left`.
  - BM: "Soalan Lazim" | EN: "Frequently Asked Questions"
  - Must have data-bm and data-en

## Accordion Layout & Spacing
- Layout class: `space-y-4 max-w-7xl mx-auto px-4 text-left`.
- Each item must be built using a `<details>` element wrapper with a permanent industrial drop shadow block:
```css
w-full bg-white border-2 border-[#1B4332] rounded-none overflow-hidden shadow-[4px_4px_0px_0px_#1B4332] transition-all duration-150 open:shadow-[2px_2px_0px_0px_#1B4332] open:translate-x-[2px] open:translate-y-[2px] group
```

## Accordion Item Structure
1. Interactive Summary Trigger
```html
<details class="faq-item w-full bg-white border-2 border-[#1B4332] rounded-none overflow-hidden shadow-[4px_4px_0px_0px_#1B4332] transition-all duration-150 group">
  <summary class="flex items-center justify-between px-5 py-4 cursor-pointer text-base font-bold text-stone-900 bg-white hover:bg-[#F8F4F0] border-b-2 border-transparent group-open:border-[#1B4332] group-open:bg-[#F8F4F0] transition-all list-none min-h-[48px]">
    <span data-bm="[Question BM]" data-en="[Question EN]">[Question BM]</span>
    <svg class="w-5 h-5 text-[#1B4332] transform transition-transform duration-200 group-open:rotate-180 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
    </svg>
  </summary>
  <div class="px-5 py-4 bg-white text-left border-t-0">
    <p class="text-stone-600 text-sm leading-relaxed m-0 p-0 text-left">
      <span data-bm="[Answer BM]" data-en="[Answer EN]">[Answer BM]</span>
    </p>
  </div>
</details>
```

2. Wrapper must include id="faq-accordion" and script for exclusive behavior:
```html
<div class="space-y-4 text-left" id="faq-accordion">
  <!-- FAQ items here -->
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
  const faqContainer = document.getElementById('faq-accordion');
  if (!faqContainer) return;
  const details = faqContainer.querySelectorAll('details');
  details.forEach(detail => {
    detail.addEventListener('toggle', function() {
      if (this.open) {
        details.forEach(other => { if (other !== this) other.open = false; });
      }
    });
  });
});
</script>
```

## Default Questions for Aircond/Contractor Niche

### Q1: Coverage Area
- BM: "Kawasan mana yang diliputi?"
- EN: "Which areas do you cover?"
- Answer Pipeline: Dynamically parse service_areas array data from config.json + append string "dan kawasan sekitar." / "and surrounding areas."

### Q2: Same Day Service
- BM: "Boleh datang pada hari yang sama?"
- EN: "Can you come on the same day?"
- Answer BM: "Boleh, bergantung kepada jadual slot slot kosong semasa. Hubungi kami awal pagi untuk set appointment secepat mungkin."
- Answer EN: "Yes, subject to available daily booking slots. Contact us early in the morning to lock your appointment on the spot."

### Q3: Warranty
- BM: "Ada warranty untuk hasil kerja?"
- EN: "Is there a warranty for the work?"
- Answer BM: "Ya. Semua kerja pemasangan dan pembaikan datang dengan warranty workmanship bertulis. Kami jamin kerja kemas."
- Answer EN: "Yes. All installation and repair work comes with a documented workmanship warranty. We guarantee clean performance."

### Q4: Pricing
- BM: "Berapa kos anggaran servis?"
- EN: "How much does servicing cost?"
- Answer BM: "Harga bergantung kepada jenis dan saiz unit aircond. Hubungi kami via WhatsApp untuk dapatkan sebut harga percuma terus."
- Answer EN: "Pricing depends entirely on the aircond unit type and size. Contact us directly via WhatsApp for an immediate free quote."

### Q5: Booking Process
- BM: "Bagaimana cara nak buat tempahan?"
- EN: "How do I make a booking?"
- Answer BM: "Senang je — klik butang WhatsApp atau telefon kami terus untuk lock tarikh dan masa technician datang."
- Answer EN: "Simple — click our WhatsApp trigger button or call us directly to lock the date and slot for our technician's visit."

## Answer Guidelines
- Keep answers under 60 words
- Be specific and honest — avoid fake marketing
- Mention WhatsApp or phone as contact method
- Include real details from config when relevant (areas, response time, etc.)
- All questions and answers must have data-bm and data-en

## Copy Tone
- BM: Conversational, helpful, direct — "Senang je", "Boleh", "Bergantung"
- EN: Professional but approachable — avoid corporate speak
- Pattern: acknowledge question → give practical answer → point to action

## Chevron Icon SVG
```html
<svg class="w-4 h-4 text-stone-400 transition-transform group-open:rotate-180"
     fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
</svg>
```

## Mobile Behavior
- Full width on all screen sizes
- Touch-friendly tap targets (min 48px height)
- Smooth accordion animation via CSS

## Placement
Typically near the end of the page, before final CTA section.

## Output Format
Complete HTML section with Tailwind classes.
Include comment: `<!-- FAQ section | questions: 5 | niche: {niche} -->`

## Self-Check
- [ ] All questions have data-bm and data-en
- [ ] All answers have data-bm and data-en
- [ ] Answers under 60 words
- [ ] Questions relevant to niche
- [ ] No forbidden words
- [ ] Chevron icon rotates on open
- [ ] Accordion items styled consistently