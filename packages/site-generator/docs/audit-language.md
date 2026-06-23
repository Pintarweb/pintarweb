# Audit Language Guide

## The core principle
Every audit statement must sound like a human noticed something specific
about this specific business — not a templated observation about websites in general.

## The "human noticing" test
Before finalising any audit statement, ask:
"Could this exact sentence apply to 1,000 other businesses without changing a word?"
If yes — it's too generic. Make it specific.

## Sentence patterns that pass the test

### Visibility statements
GENERIC (fail): "Your business lacks online visibility."
SPECIFIC (pass): "Most people searching 'aircond repair Cheras' are browsing after
work hours on mobile. Without a website, you're invisible during the hours
your customers are actively looking."

GENERIC (fail): "You don't have a website."
SPECIFIC (pass): "Three of the top five contractors appearing when someone searches
your service area already have websites. Two of them rank there specifically
because of their web presence."

### Trust statements
GENERIC (fail): "Your business needs better trust signals."
SPECIFIC (pass): "You have 31 Google reviews — that's actually a solid foundation.
The gap is that customers can't find that credibility anywhere except Google.
A website surfaces it immediately."

### Opportunity statements
GENERIC (fail): "You are missing out on potential customers."
SPECIFIC (pass): "The keyword 'aircond service Shah Alam' gets searched roughly
290 times a month. None of those searches currently lead to your business."

### Competitor gap statements
GENERIC (fail): "Your competitors have a stronger online presence."
SPECIFIC (pass): "The contractor ranking above you in Google Maps has a website
with a visible call and WhatsApp button. That's likely the only meaningful
difference between your profile and theirs."

## Tone rules for audit copy
- Observational, not judgmental ("we noticed" not "you failed to")
- Specific numbers > vague claims ("290 monthly searches" not "many searches")
- Frame gaps as opportunities, not failures
- Acknowledge what they ARE doing well (find something genuine)
- Never write anything that could make them feel embarrassed or stupid
- The audit is a gift, not a verdict

## Structure of a good audit narrative

Paragraph 1 — What they're doing right
Find one genuine strength and lead with it. Even the absence of a website
can be framed: "Your 4.3-star rating across 31 reviews tells us you deliver
good work. That reputation just isn't visible anywhere except Google yet."

Paragraph 2 — The specific gap
Concrete, local, numbered. Reference their actual area, actual competitors,
actual search volume. This is where the "human noticing" matters most.

Paragraph 3 — What the demo solves
Connect the demo site directly to the gap. "The website we built surfaces
your reviews, your service area, and your WhatsApp contact immediately —
the exact things someone searching for you right now can't find."

## AI generation prompt for audit copy

Use this prompt to generate the narrative. Always review and refine the output.

Prompt:
"""
Write an online presence audit summary for a Malaysian SME.
Use the "human noticing" style — specific, observational, local.
Avoid generic marketing language entirely.

Business: {name}
Type: {niche}
Area: {area}
Google rating: {rating} ({review_count} reviews)
Has website: {yes/no}
Top competitor in area: {competitor name}, has website: {yes/no}, rating: {rating}
Monthly searches for "{keyword}": {volume}

Write exactly 3 short paragraphs:
1. What they're doing genuinely well (find something real)
2. The specific opportunity gap (use real numbers and local context)
3. What the demo website we built for them solves

Rules:
- Max 60 words per paragraph
- No forbidden words: empower, innovative, cutting-edge, leverage, seamless
- Must sound like a consultant who actually looked, not an AI report
- Mention their area by name at least once
- Output only the 3 paragraphs, nothing else
"""