# Audit Writer

## Metadata
- Skill ID: audit-writer
- Trigger contexts: "write audit", "generate audit copy",
  "audit narrative", "write report", "audit paragraph"

## Purpose
Write online presence audit copy for Malaysian SME leads.
Every sentence must pass the "human noticing" test.

## Always read first
- docs/audit-language.md
- docs/copy-rules.md
- docs/no-website-playbook.md (if has_website: false)
- docs/social-media-playbook.md (if instagram_active: true)
- clients/{id}/config.json for all business data

## The human noticing test
Before finalising any sentence, ask:
"Could this exact sentence apply to 1,000 other businesses
without changing a word?"
If yes — rewrite it to be specific.

## Output structure
Always 3 paragraphs:
1. What they are genuinely doing well
2. The specific gap (use real numbers, area name, competitors)
3. What the demo website solves directly

## Conditional logic
IF has_website is false:
  - Lead para 2 with search volume as opening hook
  - Use "what's been missing" framing in para 3
  - Reference docs/no-website-playbook.md

IF instagram_active is true:
  - Acknowledge their social following genuinely in para 1
  - Frame para 2 around "locked inside Instagram" narrative
  - Reference docs/social-media-playbook.md

## Hard rules
- Max 60 words per paragraph
- No forbidden words (see docs/copy-rules.md)
- Mention their area by name at least once
- Use real numbers from config — never approximate or invent
- Output only the 3 paragraphs, nothing else