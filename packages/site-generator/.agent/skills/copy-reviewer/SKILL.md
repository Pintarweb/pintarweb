# Copy Reviewer

## Metadata
- Skill ID: copy-reviewer
- Trigger contexts: "review copy", "check copy", "is this copy okay",
  "review this text", "does this sound right", any copy review request

## Purpose
Review any generated copy against Pintarweb's copy standards.
Flag violations. Suggest rewrites. Never approve generic output.

## Always read first
- docs/copy-rules.md — the master reference

## Review process
For every piece of copy submitted, check against:

### Forbidden words check
Scan for: empower, innovative, cutting-edge, world-class,
industry-leading, leverage, synergy, seamless, transform,
passionate, mission, ecosystem, solution(s)
→ Flag every instance. Suggest specific replacement.

### Tone check
- Does it sound like a real Malaysian local business?
- Or does it sound like a marketing agency wrote it?
- Are sentences under 20 words?
- Is it conversational but professional?

### Specificity check
- Are local area names used?
- Are real services named (not "our services")?
- Are claims backed by something concrete?

### Testimonial check (if reviewing testimonials)
- Does it sound like a real Malaysian person talking?
- Is it in natural language (BM mix acceptable)?
- Does it reference something specific about the service?

## Output format
Return a structured review:
- PASS / FAIL overall
- List of specific issues found (line by line)
- Rewritten version of any failing lines
- Do not rewrite what doesn't need rewriting