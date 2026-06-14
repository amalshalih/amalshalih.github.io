# Design System Audit Report - Landing Page Yayasan

## 1. Complete Color Inventory

### CSS Custom Properties (src/styles/global.css)
- `--color-primary-50` through `--color-primary-950` (lines 6-16)
- `--color-gold-50` through `--color-gold-900` (lines 19-28)
- `--color-warm-50` through `--color-warm-950` (lines 31-41)

### Tailwind Classes in index.astro
**Background colors (bg-*):**
- `bg-primary-900` (line 54) - Hero background
- `bg-white`/`dark:bg-warm-900` (line 136) - Stats cards
- `bg-primary-50/50`/`dark:bg-warm-950` (line 145) - Dampak section
- `bg-primary-200/30`/`dark:bg-primary-900/30` (line 151) - Image frame
- `bg-white`/`dark:bg-warm-900` (line 290) - Wakaf card
- `bg-primary-900`/`dark:bg-warm-950` (line 292) - Mobile frieze

**Text colors (text-*):**
- `text-white` (line 52) - Hero text
- `text-gold-300`/`dark:text-gold-400` (line 68) - Tagline
- `text-white`/`dark:text-warm-50` (line 73) - Hero title
- `text-primary-100`/`dark:text-warm-200` (line 79) - Description
- `text-primary-700`/`dark:text-primary-300` (line 137) - Stat numbers
- `text-warm-700`/`dark:text-warm-300` (line 138) - Stat labels
- `text-warm-900`/`dark:text-warm-50` (line 178) - Section headers
- `text-primary-700`/`dark:text-primary-400` (line 179) - Highlight
- `text-warm-700`/`dark:text-warm-300` (line 181) - Section text
- `text-gold-500` (line 328) - Badge dot

**Border colors (border-*):**
- `border-primary-100/50`/`dark:border-warm-800/50` (line 290) - Wakaf card

**Hardcoded colors:**
- Hex `#166534` in hero background (line 56)
- Hex `#fcd34d` in frieze gradient (line 300)
- Hex `#fbbf24` in frieze gradient (line 300)

## 2. Pattern Analysis

### Color Scheme Consistency
- **Light theme:** Primary green (`primary-900` background) + Gold accents + White cards + Warm text
- **Dark theme:** `dark:` variants consistently applied across all sections
- **Hero section:** Uses full spectrum - primary-900→primary-950 gradient + gold accents
- **Stats section:** White cards with primary text (light) / warm-900 cards with warm text (dark)
- **Dampak section:** Primary-50 background (light) / warm-950 (dark)
- **Program section:** Cards use primary/gold accent dots + warm text
- **Wakaf section:** Radial gradient using CSS variables `--color-gold-50`/`--color-primary-50`

### Inconsistencies Found
- Line 56: Hardcoded hex `#166534` instead of CSS variable
- Line 300: Hardcoded gold hex values in SVG gradient instead of CSS variables
- Some sections use `bg-white` vs `bg-primary-50/50` for similar purposes
- Button variants have different dark mode handling (some use `dark:`, some not)

## 3. Semantic Token Proposal

```css
/* src/styles/design-tokens.css */
:root {
  /* Surface colors */
  --color-surface-light: var(--color-warm-50);
  --color-surface-dark: var(--color-warm-950);
  --color-surface-primary: var(--color-primary-50);
  --color-surface-primary-dark: var(--color-primary-950);
  
  /* Text colors */
  --color-text-primary: var(--color-warm-900);
  --color-text-primary-dark: var(--color-warm-50);
  --color-text-secondary: var(--color-warm-700);
  --color-text-secondary-dark: var(--color-warm-300);
  
  /* Accent colors */
  --color-accent-gold: var(--color-gold-500);
  --color-accent-gold-light: var(--color-gold-300);
  
  /* Border colors */
  --color-border-primary: var(--color-primary-200);
  --color-border-primary-dark: var(--color-warm-800);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-surface-light: var(--color-warm-950);
    --color-surface-dark: var(--color-warm-50);
    --color-text-primary: var(--color-warm-50);
    --color-text-primary-dark: var(--color-warm-900);
  }
}
```

## 4. Component Extraction Recommendations

### Priority 1: Hero Section (lines 51-94)
- **Should become component:** `src/components/sections/Hero.astro`
- **Reason:** Complex layout with slideshow, gradient overlays, animations
- **Extraction benefits:** Reusable across pages, easier theme management

### Priority 2: Stats Section (lines 132-142)
- **Should become component:** `src/components/sections/Stats.astro`
- **Reason:** Grid pattern reused on other pages

### Priority 3: Dampak Section (lines 144-169)
- **Should become component:** `src/components/sections/Dampak.astro`
- **Reason:** Image + content split pattern

### Priority 4: Program Cards (lines 204-239)
- **Already partially reusable:** Card component
- **Enhancement:** Add `variant="program"` with automatic accent color based on index

### Priority 5: Wakaf Section (lines 278-371)
- **Should become component:** `src/components/sections/Wakaf.astro`
- **Reason:** Complex animations + gradient background

## 5. Additional UI Components Needed

### Section Wrapper Component
- **Purpose:** Consistent padding, max-width, responsive behavior
- **Current pattern:** Manual `max-w-6xl px-4 py-8 sm:py-16`
- **Proposed:** `src/components/Section.astro` with props for size/variant

### Badge Component
- **Purpose:** Status indicators like "Mendesak" (line 324)
- **Current pattern:** Manual span with dot animation
- **Features:** Variants (primary, gold, outline), sizes, icon support

### Heading Component
- **Purpose:** Consistent typography hierarchy
- **Current pattern:** Various `text-3xl`, `text-2xl` classes
- **Features:** H1-H4 variants, responsive sizes, accent mode

### Link/Button Wrapper
- **Purpose:** Handle both `<a>` and `<button>` with shared styling
- **Current pattern:** Duplicate logic in Button.astro

## 6. Tailwind Config Recommendations

### Extend existing theme
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          900: 'var(--color-primary-900)',
        },
        gold: {
          300: 'var(--color-gold-300)',
          500: 'var(--color-accent-gold)',
        },
        warm: {
          50: 'var(--color-surface-light)',
          950: 'var(--color-surface-dark)',
        }
      }
    }
  }
}
```

### Add utilities for design tokens
```css
@utility surface {
  background-color: var(--color-surface-light);
}

@utility surface-dark {
  background-color: var(--color-surface-dark);
}

@utility text-primary {
  color: var(--color-text-primary);
}

@utility border-primary {
  border-color: var(--color-border-primary);
}
```

## 7. Migration Strategy

### Phase 1: Token Creation (Week 1)
- Create `design-tokens.css` with proposed variables
- Update `global.css` to import tokens first
- Add `@layer base` utilities for token usage
- **Verification:** All colors now use CSS variables

### Phase 2: Component Updates (Week 2-3)
- Update Button.astro to use token colors
- Update Card.astro background variants
- Create Section.astro component
- **Verification:** `grep -r "bg-"` shows only utility classes

### Phase 3: Landing Page Refactor (Week 4)
- Replace hardcoded hex values (lines 56, 300) with tokens
- Convert all `bg-*`, `text-*`, `border-*` to token utilities
- Extract sections to components
- **Verification:** `lsp_diagnostics` clean, build passes

### Phase 4: Site-wide Rollout (Week 5-6)
- Update all pages to use new token system
- Add dark mode testing scripts
- Remove deprecated color classes
- **Verification:** All pages build, no broken references

## 8. Implementation Checklist

- [ ] Create `src/styles/design-tokens.css`
- [ ] Update `global.css` import order
- [ ] Add token-based utilities
- [ ] Fix hardcoded hex values (lines 56, 300)
- [ ] Update Button component variants
- [ ] Create Section component
- [ ] Extract Hero, Stats, Dampak, Wakaf sections
- [ ] Add Badge component
- [ ] Update all pages to use tokens
- [ ] Test dark mode toggle (`prefers-color-scheme`)
- [ ] Run accessibility audit (WCAG AA compliance)
- [ ] Verify build passes

**Total files to modify:** 12
**Estimated effort:** 2-3 developer weeks
**Risk:** Low - incremental migration with backward compatibility