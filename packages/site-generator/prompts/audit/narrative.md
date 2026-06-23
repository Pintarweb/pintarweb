# Audit Narrative Generation Prompt

## Purpose
Generate the 3-paragraph audit narrative for a Malaysian SME lead.
This copy is the core of the audit micropage — it must pass the "human noticing" test.

## Read First
- `docs/audit-language.md` — full audit language guide
- `docs/copy-rules.md` — forbidden words and tone
- `docs/no-website-playbook.md` — if has_website: false
- `docs/social-media-playbook.md` — if instagram_active: true
- `clients/{id}/config.json` — all business and audit data

## The Human Noticing Test
Before finalizing any sentence, ask:
**"Could this exact sentence apply to 1,000 other businesses without changing a word?"**

If YES → it's too generic. Make it specific.

## Input Data Required
From `config.json`:
```
business_name
area
niche
google_rating
review_count
has_website
website_url (if has_website)
instagram_active
instagram_followers (if instagram_active)
competitors[] (name, has_website, rating, reviews)
monthly_search_volume
search_keyword
visibility_score
trust_score
```

## Output Structure
Exactly 3 paragraphs. No more, no less.

### Paragraph 1: What They're Doing Well
Find something genuinely positive to lead with.
Never be condescending or fake.

**If they have good reviews:**
"You have {review_count} Google reviews at {rating} stars — that's solid social proof. Your customers clearly trust your work."

**If they're active on Instagram:**
"You have {followers} followers on Instagram and post regularly. That's real engagement with your audience."

**If they've been around a while:**
"You've been operating since {year} — {years} years of experience speaks to consistency and reliability."

**If they have nothing obvious:**
"Your Google Business listing is complete with photos and hours — you're ahead of many competitors who neglect that."

Max 60 words. Warm, genuine, specific.

### Paragraph 2: The Specific Gap
This is where "human noticing" matters most.
Use real numbers. Mention their area. Reference competitors specifically.

**Pattern if no website + competitors have websites:**
"{Competitor1} and {Competitor2} rank above you in Google Maps searches for '{keyword}'. The main difference? They both have websites that show up when someone searches. Your {review_count} reviews can't be found outside Google Maps."

**Pattern if no website + search volume data:**
"The keyword '{keyword}' gets searched about {volume} times a month. Those are people actively looking to hire someone right now. Without a website, none of those searches lead to your business."

**Pattern if Instagram active but no website:**
"Your {followers} Instagram followers found you at some point — they already know you exist. But the {volume} monthly searches for '{keyword}' are happening outside Instagram. Those searchers can't find you."

**Pattern if weak website:**
"Your current website at {domain} loads, but it's missing the things that make someone trust and contact you immediately — visible WhatsApp button, clear service area, social proof above the fold."

Max 60 words. Concrete. Local. Numbered.

### Paragraph 3: What the Demo Solves
Connect the demo site directly to the gap from paragraph 2.
Not generic — specific to what's missing.

**Pattern for no website:**
"The website we built for you surfaces your {review_count} Google reviews, your service area, and your WhatsApp contact immediately — the exact things someone searching '{keyword}' right now can't find."

**Pattern for Instagram active:**
"The demo pulls your Instagram credibility out of the platform and makes it visible to Google search traffic. Your work and your follower count become trust signals for people who don't use Instagram."

**Pattern for weak website:**
"The demo shows what a conversion-focused site looks like — WhatsApp button above the fold, your rating visible immediately, mobile-first layout that loads fast."

Max 60 words. Solution-oriented. Specific.

## Conditional Logic

### If has_website: false
- Use `docs/no-website-playbook.md` framing
- Lead paragraph 2 with search volume as opening hook
- Frame demo as "what's been missing" in paragraph 3
- Reference the competitor gap prominently

### If instagram_active: true
- Acknowledge their social following genuinely in paragraph 1
- Frame paragraph 2 around "locked inside Instagram" narrative
- Use `docs/social-media-playbook.md` language patterns

### If both no website AND Instagram active
Combine both frameworks:
- Para 1: Acknowledge Instagram success
- Para 2: Explain the gap between Instagram audience and Google search traffic
- Para 3: Demo bridges both worlds

## Forbidden Patterns

### Never write:
- "Your business lacks online visibility." (too generic)
- "You need better trust signals." (vague)
- "You are missing out on potential customers." (everyone knows this)
- "Your website needs improvement." (not specific enough)

### Always write:
- "The 3 contractors ranking above you in '{area}' all have websites." (specific)
- "{Volume} people search '{keyword}' monthly — none find you." (numbered)
- "Your {review_count} reviews at {rating} stars don't show outside Google Maps." (concrete)

## Tone Rules
- **Observational, not judgmental** — "we noticed" not "you failed to"
- **Specific numbers > vague claims** — "290 monthly searches" not "many searches"
- **Frame gaps as opportunities, not failures**
- **Acknowledge what they ARE doing well** (find something genuine)
- **Never make them feel embarrassed or stupid**
- **The audit is a gift, not a verdict**

## Language
Output in **English only** at generation time.
The audit micropage will handle BM translation separately via data-bm/data-en attributes.
Keep sentences simple enough that translation will be clean.

## Example Output (Good)

```
You have 31 Google reviews at 4.3 stars — that's a solid foundation of trust. People who've worked with you clearly recommend you.

The keyword 'aircond service Cheras' gets searched roughly 290 times a month in your area. Right now, none of those searches lead to your business. The two contractors ranking above you both have websites that capture that traffic — that's the only meaningful difference between your listing and theirs.

The website we built surfaces your 31 reviews, your service area coverage, and your WhatsApp contact immediately. It gives those 290 monthly searchers somewhere to land when they're looking for exactly what you offer.
```

**Why this passes:**
- Paragraph 1: genuine acknowledgement of reviews
- Paragraph 2: specific keyword, real number (290), competitor comparison, local context
- Paragraph 3: connects demo directly to the 290 search gap
- Could NOT apply to 1,000 businesses unchanged

## Example Output (Bad)

```
Your business has a good reputation. However, your online presence needs improvement.

Many potential customers are searching for your services online but cannot find you. Your competitors have a stronger web presence which gives them an advantage.

The demo website we created will help you reach more customers and grow your business online.
```

**Why this fails:**
- Could apply to literally any business
- No numbers, no specific area, no competitor names
- Vague everywhere
- No "human noticing" — sounds like a template

## Output Format
Return exactly 3 paragraphs.
No markdown formatting.
No bullet points.
No preamble or explanation.
Just the three paragraphs, separated by double line breaks.

## Self-Check Before Outputting
- [ ] Paragraph 1 finds something genuinely positive
- [ ] Paragraph 2 has real numbers (search volume, review count, competitor data)
- [ ] Paragraph 2 mentions their area by name
- [ ] Paragraph 3 connects demo to specific gap from paragraph 2
- [ ] All three paragraphs under 60 words each
- [ ] No forbidden words (empower, innovative, leverage, seamless, etc.)
- [ ] Passes "human noticing" test — specific enough it can't apply to 1,000 businesses
- [ ] Tone is observational and helpful, not judgmental