# Pintarweb Copy Rules

## The voice
Write like a trusted local business, not a marketing agency.
Sound like: a reliable contractor your neighbour recommended.
Not like: a Silicon Valley startup or a corporate press release.

## Absolute forbidden words and phrases
- "Empower" / "empowering your business"
- "Innovative solutions" / "cutting-edge"
- "World-class" / "industry-leading"
- "Leverage" / "synergy" / "ecosystem"
- "Transform your business"
- "We are passionate about..."
- "Your success is our mission"
- "Seamless experience"
- Any phrase that sounds like it was written by ChatGPT on autopilot

## Tone rules
- Short sentences. Max 20 words per sentence.
- One idea per sentence.
- Conversational but professional — the way a good contractor talks to a client
- Be specific — mention real areas, real services, real numbers
- Avoid fake authority claims ("Malaysia's #1..." without proof)
- Never over-promise — SME owners are skeptical of marketing language
- Avoid excessive exclamation marks

## Structure rules
- Headlines: benefit-first, location-specific where possible
  - GOOD: "Aircond Service & Repair — Cheras & Surrounding Areas"
  - BAD: "Your Trusted HVAC Solutions Partner"
- CTAs: action-specific, not generic
  - GOOD: "Hubungi Kami via WhatsApp"
  - BAD: "Get Started Today"
- Service descriptions: what you do + where + how fast, not why you're great
- Testimonials: must sound like a real Malaysian person talking
  - GOOD: "Aircond rosak malam-malam, call Razif terus datang. Memang recommended."
  - BAD: "Exceptional service with professional technicians. Highly satisfied."

## Language mixing
- English-dominant is fine for professionalism
- Light BM phrases in CTAs and testimonials feel authentic
- Never mix languages awkwardly mid-sentence in formal copy
- WhatsApp CTA in BM: "Hubungi Kami" or "Tanya Kami Sekarang"

## Local specificity rules
- Always mention the area served (e.g. "Cheras, Ampang, Pandan Jaya")
- Reference local context when possible ("Cuaca panas Malaysia...")
- Use RM not $ for pricing references
- Phone numbers in Malaysian format: 012-345 6789


## Language Toggle Rules

Every site has a BM/EN toggle. Both languages must feel natural —
not like one is a translation of the other.

### BM Voice (data-bm) — default language
- Conversational, warm, familiar
- Natural Malay as spoken in KL/Selangor — not textbook Malay
- Light informal phrasing is fine: "Kami datang hari ini", "Tanya kami dulu"
- Mix of BM and light EN technical terms is acceptable:
  "Servis & cuci aircond", "Top-up gas", "Warranty workmanship"
- Sentence endings: active, direct — "Hubungi kami", "Dapatkan sebut harga"
- Never use overly formal BM: "Kami menyediakan perkhidmatan yang..."

### EN Voice (data-en) — secondary language
- Professional but approachable — like a reliable local business, not a corporate
- Short sentences — same rule as BM
- No filler phrases: "We are pleased to offer...", "Our team of professionals..."
- Action-oriented CTAs: "Contact Us", "Ask Us Now", "Get a Free Quote"
- Mention local areas naturally: "Covering Cheras, Ampang & surrounding areas"
- No overclaiming: not "Malaysia's best" — just "your trusted local expert"

### Translation approach — do NOT translate literally
BAD (literal):
  BM: "Aircond rosak? Kami datang hari ini."
  EN: "Aircond broken? We come today."  ← sounds wrong in English

GOOD (natural in each language):
  BM: "Aircond rosak? Kami datang hari ini."
  EN: "Aircond broken down? We'll be there today."

BAD (literal):
  BM: "Tanya kami dulu — percuma, tanpa komitmen."
  EN: "Ask us first — free, without commitment."  ← stiff

GOOD:
  BM: "Tanya kami dulu — percuma, tanpa komitmen."
  EN: "Ask us first — free quote, no obligation."

## The "Local Realism" Baseline Check
- NEVER initiate service text or headlines with robotic agency introductions such as "Kami menyediakan servis penuh..." or "Our complete solutions include...".
- ALWAYS lead with an immediate, real-world customer pain point or localized question.

### Real-World Phrase Transformations
- Robocode: "Kami menyediakan perkhidmatan mencuci aircond yang berkualiti tinggi di area Cheras."
- Human Reality: "Aircond rumah atau kedai tak sejuk atau tetiba rosak? Kami bantu hantar technician bertauliah terus ke tempat awak..."

### Attribute format on every element
```html
<!-- Single-line text -->
<span data-bm="Hubungi Kami" data-en="Contact Us">Hubungi Kami</span>

<!-- Multi-line / paragraph -->
<span data-bm="Aircond rosak? Kami datang hari ini."
      data-en="Aircond broken down? We'll be there today.">
  Aircond rosak? Kami datang hari ini.
</span>

<!-- Button / CTA -->
<span data-bm="Tanya Kami Sekarang" data-en="Ask Us Now">
  Tanya Kami Sekarang
</span>

<!-- Nav link -->
<a href="#services" data-bm="Servis" data-en="Services">Servis</a>
```

### Elements that must always have both attributes
- All headings (h1, h2, h3)
- All paragraph text
- All CTA button labels
- All nav links
- All trust badge text
- All service card titles and descriptions
- All testimonial quotes and reviewer areas
- All FAQ questions and answers
- All footer text
- WhatsApp sticky bar label
- Page <title> tag (data-bm and data-en on the title element)

### Elements that do NOT need translation
- Phone numbers (012-345 6789 — same in both languages)
- Star ratings (★★★★★)
- Business name (Razif Aircond & Renovation — same)
- Domain/URL references
- Social media handles
- Pure icons with no label