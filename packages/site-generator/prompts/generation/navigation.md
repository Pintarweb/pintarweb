# Navigation Section Generation Prompt

## Context
Generate navigation section for Malaysian SME website with mobile hamburger menu.

## Read First
- `docs/design-rules.md`
- `docs/copy-rules.md`
- `clients/{id}/config.json`

## Structure
1. Main sticky nav bar (visible all viewports)
2. Mobile hamburger button (visible only on mobile)
3. Mobile dropdown menu (toggles on hamburger click)

## Main Navigation Bar
- Container: `sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm`
- Inner: `max-w-5xl mx-auto px-4 py-3 flex items-center justify-between`
- Business name (left side)
- Desktop nav links (hidden on mobile): `#services`, `#testimonials`, `#contact`
- Right side: hamburger (mobile) + language toggle

### Desktop Nav Links
- Class: `hidden md:flex items-center gap-6 text-sm font-medium text-stone-600`
- Links: Servis, Testimoni, Hubungi Kami

## Mobile Hamburger Button
- Class: `md:hidden flex items-center justify-center w-8 h-8 text-stone-600 hover:text-[#1B4332]`
- Icon: SVG hamburger (3-line menu)
- OnClick: toggle mobile menu

## Mobile Dropdown Menu
- ID: `mobile-menu`
- Class: `hidden fixed top-14 left-0 right-0 z-40 bg-stone-100 border-b-2 border-[#1B4332]`
- Links: Servis, Testimoni, Soalan Lazim
- Each link: `text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-[#1B4332] hover:bg-stone-200 transition-colors py-3 border-b border-stone-200`

## JavaScript Requirements
1. Toggle function to show/hide mobile menu
2. Close menu on scroll (if user scrolls without selecting)

```javascript
// Close mobile menu when scrolling
let lastScrollY = window.scrollY;
window.addEventListener('scroll', function() {
    const menu = document.getElementById('mobile-menu');
    if (!menu.classList.contains('hidden')) {
        if (Math.abs(window.scrollY - lastScrollY) > 10) {
            menu.classList.add('hidden');
        }
    }
    lastScrollY = window.scrollY;
});
```

## CSS for Anchor Links
Add scroll offset to account for sticky header:
```css
html {
    scroll-padding-top: 100px;
}
```

## Section IDs for Anchor Links
- Services: `id="services"`
- Testimonials: `id="testimonials"` 
- FAQ: `id="faq-accordion"`

## Output Format
Complete HTML with Tailwind classes.
Include comment: `<!-- Navigation Section -->`