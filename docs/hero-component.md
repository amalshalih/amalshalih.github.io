# Hero Component

Reusable hero section component for kegiatan/blog pages with enhanced visual effects.

## Features

- **Mask-image fade effect** - Dual gradient overlay for better text readability
- **Text shadow** - Enhanced contrast with drop-shadow effects
- **Scroll indicator** - Mobile UX guidance with auto-hide on scroll
- **WebP optimization** - Support for WebP image format with fallback
- **Micro-interactions** - Hover scale effects on badge and title
- **Responsive design** - Mobile-first with breakpoints at sm (640px) and lg (1024px)
- **Accessibility** - WCAG AA compliant with proper ARIA labels

## Usage

### Basic Usage

```astro
---
import Hero from '../../components/Hero.astro'
---

<Hero 
  title="Judul Kegiatan"
  category="Kategori"
  date="2026-06-14"
  image="/path/to/image.webp"
  showScrollIndicator={true}
  variant="article"
/>
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ Yes | - | Main hero title |
| `subtitle` | `string` | No | - | Optional subtitle below title |
| `image` | `string` | No | - | Hero background image URL (WebP recommended) |
| `category` | `string` | No | - | Category badge text |
| `date` | `string` | No | - | Date string (ISO format recommended) |
| `variant` | `'article' \| 'event' \| 'donation'` | No | `'article'` | Visual variant |
| `showScrollIndicator` | `boolean` | No | `false` | Show scroll indicator at bottom |

### Variants

#### Article Variant (Default)
```astro
<Hero title="Article Title" variant="article" />
```
- Background: `bg-primary-950` (dark green)

#### Event Variant
```astro
<Hero title="Event Title" variant="event" />
```
- Same as article variant

#### Donation Variant
```astro
<Hero title="Donation CTA" variant="donation" />
```
- Background: `bg-gradient-to-br from-primary-700 to-primary-900`

### Advanced Usage with All Props

```astro
---
import Hero from '../../components/Hero.astro'
import { formattedDate } from './utils'
---

<Hero 
  title={title}
  subtitle={description}
  image={imageWebp || image}
  category={kategoriLabel}
  date={formattedDate}
  showScrollIndicator={true}
  variant="article"
/>
```

## Visual Effects

### Mask-Image Fade
The component uses CSS mask-image for smooth gradient transitions:
```css
-webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
```

### Text Shadow
- **Title**: `drop-shadow-2xl text-shadow-xl`
- **Badge**: `drop-shadow-md text-shadow-sm`
- **Date**: `drop-shadow-lg text-shadow-sm`

### Micro-Interactions
- **Badge hover**: Scale 1.05 with smooth transition
- **Title hover**: Enhanced text shadow glow effect
- **Image hover**: Scale 1.02 zoom effect

### Scroll Indicator
Auto-hides when user scrolls past 10% of hero height:
```javascript
window.addEventListener('scroll', () => {
  const scrollPercent = window.scrollY / heroHeight;
  if (scrollPercent > 0.1) {
    scrollIndicator?.classList.add('opacity-0');
  } else {
    scrollIndicator?.classList.remove('opacity-0');
  }
});
```

## Accessibility

- Semantic HTML structure
- Proper `alt` text for images
- ARIA labels for interactive elements
- Keyboard navigation support
- Reduced motion support via `prefers-reduced-motion`

## Performance

- **WebP format**: Use WebP images with PNG fallback
- **Lazy loading**: Images use `loading="eager"` for hero priority
- **Async decoding**: `decoding="async"` for non-blocking render
- **Service Worker**: Cache-first strategy for offline support

## Example Implementation

See `/src/pages/kegiatan/[slug].astro` for a complete implementation example.

## Related Components

- `Card.astro` - Content cards for related items
- `Icon.astro` - Icon system
- `BaseLayout.astro` - Page layout wrapper

---

**Last updated**: 2026-06-14  
**Version**: 1.0.0  
**Location**: `/src/components/Hero.astro`