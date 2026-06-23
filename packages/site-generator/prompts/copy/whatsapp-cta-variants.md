# WhatsApp CTA Variants

## Purpose
10 tested WhatsApp CTA button label variations in both BM and EN.
Use these to avoid repetition across sections and add variety based on context.

## Usage
Pick the variant that best fits the section context:
- Hero: urgent, direct
- Mid-page CTA: lower pressure, question-based
- Footer: simple, clear

All labels must be used with data-bm and data-en attributes.

---

## Variant 1: Direct Contact (Default)
**Context:** Hero section, primary CTA, most common

**BM:** Hubungi via WhatsApp
**EN:** Contact via WhatsApp

**When to use:** Default choice. Clear, direct, universally understood.

---

## Variant 2: Immediate Ask (Urgent)
**Context:** Emergency services, urgent niches, hero section

**BM:** Tanya Kami Sekarang
**EN:** Ask Us Now

**When to use:** When speed matters (emergency plumber, broken aircond). Creates urgency without being pushy.

---

## Variant 3: Question-Based (Low Pressure)
**Context:** Mid-page CTA banner, after services section

**BM:** Ada Soalan? WhatsApp Kami
**EN:** Have Questions? WhatsApp Us

**When to use:** For visitors who've scrolled past hero — acknowledges they're considering but not ready yet.

---

## Variant 4: Free Quote Hook
**Context:** After services section, pricing-sensitive niches

**BM:** Dapatkan Sebut Harga Percuma
**EN:** Get a Free Quote

**When to use:** When price is a common concern. "Percuma" removes barrier. Opens WhatsApp with quote request.

---

## Variant 5: Chat Casual
**Context:** Testimonials section, footer, lower-pressure touchpoints

**BM:** Chat dengan Kami
**EN:** Chat with Us

**When to use:** Feels less formal than "contact". Works well in testimonial or FAQ sections where trust is already building.

---

## Variant 6: Inquiry Direct
**Context:** Service cards, specific service CTAs

**BM:** Tanya Pasal Servis Ini
**EN:** Ask About This Service

**When to use:** When CTA is attached to a specific service card. Pre-fills WhatsApp message with that service name.

---

## Variant 7: Consultation Offer
**Context:** Higher-value services (renovation, large installs)

**BM:** Bincang dengan Kami
**EN:** Discuss Your Needs

**When to use:** For consultative services where there's a conversation before quoting. More professional tone.

---

## Variant 8: Response Time Emphasis
**Context:** When fast response is a competitive advantage

**BM:** Kami Reply Dalam 1 Jam
**EN:** We Reply Within 1 Hour

**When to use:** When response speed is a differentiator. Sets expectation immediately.

---

## Variant 9: Booking Direct
**Context:** Appointment-based services (installations, scheduled maintenance)

**BM:** Buat Booking Sekarang
**EN:** Book an Appointment

**When to use:** For services that require scheduling. Implies commitment but clear next step.

---

## Variant 10: Simple Reach Out
**Context:** Footer, contact section, final touchpoint

**BM:** Hubungi Kami
**EN:** Reach Out

**When to use:** Simplest, shortest option. Works in footer or as secondary CTA. No friction.

---

## Pre-Filled Message Patterns

Each WhatsApp link should include a pre-filled message in BM.
The message should be contextual to where the CTA appears.

### Pattern 1: General Inquiry (Hero)
```
Hi, saya nak tanya pasal servis [niche] awak.
```
Example: `Hi, saya nak tanya pasal servis aircond awak.`

### Pattern 2: Specific Service (Service Card)
```
Hi, saya berminat dengan [service name]. Boleh explain lagi?
```
Example: `Hi, saya berminat dengan pemasangan aircond baru. Boleh explain lagi?`

### Pattern 3: Quote Request (After Pricing Mention)
```
Hi, boleh bagi sebut harga untuk [service] di [area]?
```
Example: `Hi, boleh bagi sebut harga untuk servis aircond di Cheras?`

### Pattern 4: General Contact (Footer)
```
Hi, saya nak tanya pasal servis awak.
```
Simple, generic, works anywhere.

### URL Encoding
All pre-filled messages must be URL encoded:
- Space → `%20`
- Comma → `%2C`
- Question mark → `%3F`

Example:
```
Raw: Hi, saya nak tanya pasal servis aircond awak.
Encoded: Hi%2C%20saya%20nak%20tanya%20pasal%20servis%20aircond%20awak.
```

---

## Implementation Example

```html
<!-- Hero Primary CTA -->
<a href="https://wa.me/60123456789?text=Hi%2C%20saya%20nak%20tanya%20pasal%20servis%20aircond%20awak."
   class="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d]
          text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm shadow-md">
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <!-- WhatsApp icon SVG -->
  </svg>
  <span data-bm="Hubungi via WhatsApp" data-en="Contact via WhatsApp">
    Hubungi via WhatsApp
  </span>
</a>

<!-- Mid-page CTA Banner -->
<a href="https://wa.me/60123456789?text=Hi%2C%20saya%20nak%20tanya%20pasal%20servis%20awak."
   class="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d]
          text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm shadow-md">
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <!-- WhatsApp icon SVG -->
  </svg>
  <span data-bm="Tanya Kami Sekarang" data-en="Ask Us Now">
    Tanya Kami Sekarang
  </span>
</a>

<!-- Service Card CTA -->
<a href="https://wa.me/60123456789?text=Hi%2C%20saya%20berminat%20dengan%20pemasangan%20aircond%20baru.%20Boleh%20explain%20lagi%3F"
   class="text-emerald-700 hover:text-emerald-900 text-sm font-semibold">
  <span data-bm="Tanya Pasal Servis Ini" data-en="Ask About This Service">
    Tanya Pasal Servis Ini →
  </span>
</a>
```

---

## Selection Guide by Section

| Section | Recommended Variant | Alternative |
|---------|-------------------|-------------|
| Hero (above fold) | Variant 1 or 2 | Variant 8 (if response time is key) |
| Hero (secondary CTA) | Variant 10 | Variant 3 |
| Services section | Variant 6 | Variant 4 |
| CTA Banner (mid-page) | Variant 3 | Variant 2 |
| Testimonials section | Variant 5 | Variant 3 |
| FAQ section | Variant 5 or 10 | Variant 1 |
| Footer | Variant 10 | Variant 1 |
| Sticky Mobile Bar | Variant 1 | Variant 2 |

---

## Tone Matching

**Urgent/Emergency Niches** (emergency plumber, broken aircond, urgent repair):
- Prefer: Variant 2, 8
- Avoid: Variant 7, 9 (too slow)

**Consultative Niches** (renovation, large installs, design work):
- Prefer: Variant 7, 4
- Avoid: Variant 2 (too pushy)

**Standard Service Niches** (regular maintenance, standard installs):
- Prefer: Variant 1, 3, 5
- Works everywhere

**Price-Sensitive Niches** (competitive markets, budget concerns):
- Prefer: Variant 4
- Emphasize "percuma" (free)

---

## Copy Rules Reminder
- All labels must have data-bm AND data-en
- BM labels: conversational, natural, not stiff
- EN labels: professional but approachable
- Never: "Sign Up", "Learn More", "Get Started" (too corporate/SaaS)
- Always: action verbs, specific, low-pressure