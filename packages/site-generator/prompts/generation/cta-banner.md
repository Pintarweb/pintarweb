# CTA Banner Generation Prompt

## Context
Generate a mid-page Call-to-Action banner for Malaysian SME website.
Re-engages visitors who scrolled past the hero or services grid without converting.
All generated elements must strictly enforce our **Brutalist-Elite Design Constitution**: utilize zero rounded corners (`rounded-none`), use thick high-contrast line logic, and guarantee NO centered elements, centered text nodes, or centered flex layout rows exist across any active viewport.

## Read First
- `docs/design-rules.md`
- `docs/copy-rules.md`
- `clients/{id}/config.json`

## Purpose
Catch visitors who:
- Read services but haven't contacted yet
- Scrolled through testimonials
- Need a reminder before leaving

Placed typically after services or testimonials, before FAQ.

## Structure(Asymmetric Industrial Block Framework)
Single full-width structural block spanning the grid:
- **Container Block Styles:** `w-full bg-[#1B4332] border-y-4 border-stone-900 py-12 px-6 text-left my-12`.
- Inside Wrapper: `max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 text-left`.

### 1. Left Typography Column
- **Wrapper:** `flex flex-col items-start justify-center max-w-2xl text-left`.
- **Headline (H3):** `text-2xl md:text-3xl font-bold text-[#F8F4F0] tracking-tight mb-2 text-left`.
  - Pattern BM: "Ada Soalan? Tanya Kami Dulu"
  - Pattern EN: "Have Questions? Ask Us First"
  - Must have data-bm and data-en
- **Subtext:** `text-[#F8F4F0]/80 text-sm mb-0 text-left`.
  - Pattern BM: "Sebut harga percuma, tanpa komitmen. Hubungi kami sekarang."
  - Pattern EN: "Free quote, no obligation. Contact us now."
  - Must have data-bm and data-en, keep under 15 words.

### 2. Right Interactive Button Column
- **Wrapper:** `flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 shrink-0 text-left`.
- **Primary CTA Button (WhatsApp):**
  ```html
  <a href="[https://wa.me/](https://wa.me/){whatsapp}?text=Hi%2C%20saya%20nak%20tanya%20pasal%20servis%20aircond"
     class="inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-stone-900 font-extrabold px-6 py-3.5 rounded-none border-2 border-stone-900 transition-all duration-150 shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000] text-sm uppercase tracking-wider">
    <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
    <span data-bm="Tanya Kami Sekarang" data-en="Ask Us Now">Tanya Kami Sekarang</span>
  </a>


**Secondary CTA (Phone)**
```html
  <a href="tel:+{phone}"
   class="inline-flex items-center justify-center gap-2 bg-white text-stone-900 font-extrabold px-6 py-3.5 rounded-none border-2 border-stone-900 transition-all duration-150 shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000] text-sm uppercase tracking-wider">
  <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
  <span data-bm="Hubungi: {formatted_phone}" data-en="Call: {formatted_phone}">Hubungi: {formatted_phone}</span>
  </a>
```

## Variants

  ### Urgent Variant (for emergency services)
- More direct headline: "Aircond Rosak? Kami Datang Hari Ini"
- Bright red/orange accent instead of emerald
- bg-red-50 border-red-200
- Emphasize response time

### Trust Variant (for higher-value services)
- Softer headline: "Nak Tahu Lebih Lanjut? Kami Sedia Membantu"
- Include trust badge: "{X}+ Tahun Pengalaman"
- Maintain default Forest Green layout configuration.

Use default variant unless niche logic suggests otherwise.

## Mobile Behavior
- Buttons stack vertically on mobile (<640px)
- Full-width buttons on mobile
- Inline buttons on desktop

## Placement Strategy
Ideal placement:
- After services section (catch people who know what you do)
- After testimonials (catch people who trust you but need a nudge)
- Before FAQ (one more chance before they read details)

Never place:
- Immediately after hero (too soon)
- At the very end (footer handles that)

## Copy Tone
- BM: Direct, friendly, low-pressure — "Tanya dulu", "Percuma"
- EN: Clear, approachable — "Ask us", "Free quote"
- Avoid: fake urgency, pressure tactics, corporate language

## Data Sources
From `config.json`:
- whatsapp
- phone
- services (for pre-filled WhatsApp message context)
- niche (to determine variant)

## Output Format
Complete HTML section with Tailwind classes.
Completely strip any surrounding conversational introductions, summaries, markdown wrappers, or explanations.
Include comment: `<!-- CTA banner | variant: {default/urgent/trust} -->`

## Self-Check
- [ ] Headline has data-bm and data-en
- [ ] Subtext has data-bm and data-en (if present)
- [ ] Button labels have data-bm and data-en
- [ ] WhatsApp link correct format with pre-filled message
- [ ] Phone link clickable
- [ ] Background color appropriate for variant
- [ ] Buttons responsive
- [ ] No forbidden words
- [ ] Copy feels natural, not pushy