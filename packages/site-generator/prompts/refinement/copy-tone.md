# Copy Tone Refinement Prompt

## Purpose
Review and refine generated copy to ensure it matches Malaysian SME voice.
This is a review pass AFTER initial generation, not primary generation.

## When to Use
- After Kimi generates bulk HTML
- When copy feels too generic or corporate
- When translations sound literal rather than natural
- Before quality checklist final pass

## Read First
- `docs/copy-rules.md` — the master copy reference
- The HTML content to be refined

## Review Checklist

### Forbidden Words Scan
Check for and remove these words/phrases:
- "Empower" / "empowering"
- "Innovative solutions" / "cutting-edge"
- "World-class" / "industry-leading"
- "Leverage" / "synergy" / "ecosystem"
- "Transform your business"
- "We are passionate about"
- "Your success is our mission"
- "Seamless experience"
- "Comprehensive solutions"

If found → rewrite the entire sentence in simpler language.

### Sentence Length Check
- Count words per sentence
- If any sentence exceeds 20 words → split into two sentences
- If any paragraph exceeds 60 words → break into two paragraphs

### BM Voice Check (data-bm attributes)
Does the BM copy sound like a real Malaysian business owner talking?

BAD indicators:
- Overly formal Malay ("kami menyediakan perkhidmatan...")
- Stiff corporate tone
- Word-for-word translation from English
- No personality

GOOD indicators:
- Natural conversational flow
- Light informal phrasing where appropriate
- Mix of BM and technical EN terms is acceptable
- Sounds like someone you'd meet at a kopitiam

### EN Voice Check (data-en attributes)
Does the EN copy sound professional but approachable?

BAD indicators:
- Corporate jargon
- Marketing fluff
- Overly formal business language
- Literal translation from BM that sounds awkward

GOOD indicators:
- Clear, direct sentences
- Professional but human
- Would make sense in a face-to-face conversation
- Practical benefits over features

### CTA Language Check
Every CTA button or link should be:
- Action-oriented (starts with verb)
- Specific (not generic)
- Low-pressure (no "Buy Now", "Sign Up Today")

Examples:
- GOOD BM: "Hubungi Kami", "Tanya Kami Sekarang", "Dapatkan Sebut Harga"
- GOOD EN: "Contact Us", "Ask Us Now", "Get a Free Quote"
- BAD: "Learn More", "Get Started", "Discover Solutions"

## Refinement Instructions

For each piece of copy that fails a check above:

1. **Identify the issue** (forbidden word / too long / wrong tone / literal translation)
2. **Rewrite from scratch** — don't just fix the word, rewrite the whole sentence
3. **Keep the meaning** but change the expression
4. **Verify data-bm and data-en both sound natural** in their respective languages

## Example Refinements

### Before (generic corporate)
```html
<span data-bm="Kami menyediakan perkhidmatan aircond yang komprehensif untuk memenuhi keperluan anda."
      data-en="We provide comprehensive air conditioning services to meet your needs.">
  Kami menyediakan perkhidmatan aircond yang komprehensif untuk memenuhi keperluan anda.
</span>
```

### After (natural SME voice)
```html
<span data-bm="Servis aircond, pemasangan baru, dan pembaikan. Kami cover kawasan Cheras."
      data-en="Aircond servicing, new installation, and repairs. We cover the Cheras area.">
  Servis aircond, pemasangan baru, dan pembaikan. Kami cover kawasan Cheras.
</span>
```

### Before (literal translation, awkward EN)
```html
<span data-bm="Tanya kami dulu — percuma, tanpa komitmen."
      data-en="Ask us first — free, without commitment.">
  Tanya kami dulu — percuma, tanpa komitmen.
</span>
```

### After (natural in both languages)
```html
<span data-bm="Tanya kami dulu — percuma, tanpa komitmen."
      data-en="Ask us first — free quote, no obligation.">
  Tanya kami dulu — percuma, tanpa komitmen.
</span>
```

## Output Format
Return the refined HTML with all copy improvements applied.
Mark changes with comments if helpful:
```html
<!-- REFINED: Removed "comprehensive", split long sentence -->
```

## Self-Check Before Returning
- [ ] No forbidden words remain
- [ ] All sentences under 20 words
- [ ] BM copy sounds conversational
- [ ] EN copy sounds professional but approachable
- [ ] Both languages are natural, not literal translations
- [ ] CTAs are action-oriented and specific
- [ ] All data-bm and data-en attributes preserved