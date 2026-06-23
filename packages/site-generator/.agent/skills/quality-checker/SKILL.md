# Quality Checker

## Metadata
- Skill ID: quality-checker
- Trigger contexts: "quality check", "is this ready", "check this site",
  "run checklist", "ready to send?", "final check"

## Purpose
Run the full Pintarweb quality checklist on a generated demo site
before it is sent to any lead. Nothing leaves without passing this.

## Always read first
- docs/quality-checklist.md — the master checklist

## Process
When given an HTML file or URL to review:

1. Mobile check — mentally simulate 390px viewport
2. Content check — scan for placeholder text, wrong data, missing fields
3. Design check — flag SaaS aesthetics, broken layouts, font violations
4. Technical check — verify links, WhatsApp format, tel: links
5. Believability check — would a real SME owner think this is their business?

## Output format
Return a checklist with:
- [ ] PASS or [x] FAIL for each item
- For each FAIL: exact location + specific fix required
- Final verdict: READY TO SEND / NOT READY — fix these first
- Estimated fix time if not ready

## Hard rule
Never return READY TO SEND if any of these are present:
- Placeholder text of any kind
- Wrong or missing phone/WhatsApp
- WhatsApp link not in wa.me/ format
- SaaS aesthetic elements
- Page load issues on mobile
- Missing service area