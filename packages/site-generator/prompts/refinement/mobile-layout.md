# Mobile Layout Refinement Prompt

## Purpose
Review and fix mobile layout issues in generated HTML.
This is a refinement pass specifically for mobile responsiveness.

## When to Use
- After initial section generation
- Before final quality check
- When desktop layout looks good but mobile needs adjustment

## Mobile Testing Width
Default test width: **390px** (iPhone 12/13/14 standard width)
Also verify: 360px (small Android) and 414px (iPhone Pro Max)

## Critical Mobile Checks

### 1. Text Readability
- [ ] No text under 14px font size on mobile
- [ ] Line height at least 1.5 for body text
- [ ] Max 65 characters per line (use max-w-prose or similar)
- [ ] Headings don't break awkwardly mid-word

Fix: Add text-sm (14px) minimum, adjust line-height, constrain width.

### 2. Touch Targets
- [ ] All buttons/links minimum 44px height (48px preferred)
- [ ] Sufficient spacing between clickable elements (min 8px gap)
- [ ] No tiny icons or buttons

Fix: Add py-3 (12px padding) minimum, gap-3 or more between elements.

### 3. WhatsApp CTA Visibility
- [ ] Primary WhatsApp CTA visible without scrolling in hero
- [ ] Sticky WhatsApp bar present at bottom on mobile
- [ ] Sticky bar doesn't cover content (pb-20 on body or last section)

Fix: Ensure hero CTA is above fold, add sticky bar if missing, add bottom padding.

### 4. Images
- [ ] Images scale correctly (w-full, object-cover)
- [ ] Aspect ratios maintained (aspect-[4/3] or similar)
- [ ] No horizontal scroll from oversized images
- [ ] Images don't cause layout shift (set height/aspect-ratio)

Fix: Add w-full, aspect-ratio, object-cover classes.

### 5. Grid/Flex Layouts
- [ ] Multi-column grids collapse to 1-2 columns on mobile
- [ ] No overflow-x on grid containers
- [ ] Flex items wrap appropriately (flex-wrap)
- [ ] Cards/sections have adequate mobile padding (px-4 minimum)

Fix: Add grid-cols-1 sm:grid-cols-2, flex-wrap, responsive padding.

### 6. Navigation
- [ ] Nav links readable and tappable on mobile
- [ ] Language toggle visible and functional
- [ ] No cramped header layout

Fix: Adjust nav spacing, ensure toggle has room, consider stacking on small screens.

### 7. Forms (if present)
- [ ] Input fields full width on mobile (w-full)
- [ ] Labels above fields, not inside
- [ ] Submit button full width and tall enough (min 48px)
- [ ] Adequate spacing between fields (space-y-4)

Fix: Add w-full, adjust field height, increase spacing.

### 8. Spacing
- [ ] Section padding appropriate for mobile (py-12 is good, py-8 minimum)
- [ ] No 0px margins causing content to touch edges
- [ ] Consistent horizontal padding (px-4 standard)
- [ ] Gap between elements not too tight (gap-4 minimum for grids)

Fix: Add py-12 to sections, px-4 to containers, increase gaps.

### 9. Typography Hierarchy
- [ ] Headings scale down on mobile but remain clear
  - H1: text-3xl on mobile (48px desktop)
  - H2: text-2xl on mobile (36px desktop)
- [ ] No giant text causing awkward breaks
- [ ] Font weights appropriate for small screens

Fix: Add responsive text classes (text-3xl md:text-4xl).

### 10. Hidden Overflow
- [ ] No content cut off on mobile
- [ ] Cards/sections fit within viewport
- [ ] No surprise horizontal scroll

Fix: Check all containers have max-w constraints, remove fixed widths.

## Mobile-Specific Refinement Patterns

### Hero Section
```html
<!-- Desktop: side-by-side. Mobile: stacked -->
<div class="grid md:grid-cols-2 gap-10">
  <!-- Text column -->
  <div>
    <!-- CTA buttons: full width mobile, inline desktop -->
    <div class="flex flex-col sm:flex-row gap-3">
      <a class="w-full sm:w-auto">...</a>
    </div>
  </div>
  <!-- Image: full width mobile, half desktop -->
  <div class="w-full">...</div>
</div>
```

### Service Cards
```html
<!-- 1 col mobile, 2 col tablet, 4 col desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
```

### Testimonials
```html
<!-- 1 col mobile, 3 col desktop -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
```

### CTA Buttons
```html
<!-- Full width mobile, auto width desktop -->
<div class="flex flex-col sm:flex-row gap-3">
  <a class="w-full sm:w-auto">...</a>
</div>
```

## Testing Commands (Mental Checklist)

Imagine the page at 390px width:
1. Can I read all text without zooming?
2. Can I tap all buttons with my thumb?
3. Is the WhatsApp CTA visible immediately?
4. Do images fit without horizontal scroll?
5. Is there enough padding around content?
6. Do grids collapse appropriately?
7. Does navigation work?
8. Is there a sticky WhatsApp bar at bottom?

## Common Mobile Issues & Fixes

### Issue: Buttons too small
```html
<!-- Before -->
<a class="px-3 py-1">...</a>

<!-- After -->
<a class="px-6 py-3">...</a>
```

### Issue: Grid doesn't collapse
```html
<!-- Before -->
<div class="grid grid-cols-4">

<!-- After -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
```

### Issue: Text too small
```html
<!-- Before -->
<p class="text-xs">...</p>

<!-- After -->
<p class="text-sm">...</p>  <!-- 14px minimum -->
```

### Issue: Content touches edges
```html
<!-- Before -->
<section class="py-12">

<!-- After -->
<section class="py-12 px-4">
```

### Issue: WhatsApp not visible
```html
<!-- Add sticky bar at bottom -->
<div class="fixed bottom-0 left-0 right-0 z-50 bg-[#25D366] 
            px-4 py-3 md:hidden flex items-center justify-center gap-2">
  <!-- WhatsApp CTA -->
</div>

<!-- Add padding to body -->
<body class="pb-20 md:pb-0">
```

## Output Format
Return the refined HTML with mobile layout fixes applied.
Mark significant changes with comments:
```html
<!-- MOBILE FIX: Added grid-cols-1 for mobile collapse -->
<!-- MOBILE FIX: Increased button height for touch targets -->
```

## Self-Check Before Returning
- [ ] All text readable at 390px width
- [ ] All buttons tappable (min 44px height)
- [ ] WhatsApp CTA visible without scrolling
- [ ] No horizontal scroll
- [ ] Grids collapse appropriately
- [ ] Images scale correctly
- [ ] Adequate padding throughout
- [ ] Sticky WhatsApp bar present (mobile only)
- [ ] Body has bottom padding to clear sticky bar