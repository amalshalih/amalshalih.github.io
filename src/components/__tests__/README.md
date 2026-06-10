# Component Tests — Yayasan ASIB

**Status:** ⚠️ **PLACEHOLDER** - Tests need Astro Testing Library setup

---

## Current Status

Component tests are currently **placeholder tests** that need proper Astro Testing Library configuration.

**Why?**
- Astro components are compiled differently than React/Vue
- Need `@astrojs/testing-library` or similar tooling
- Current Vitest setup is configured for Cloudflare Workers testing

---

## Test Files Created

### 1. `Button.test.ts`
**Test Cases Planned:**
- ✅ Render with default variant
- ⏳ Render with primary variant
- ⏳ Render with secondary variant
- ⏳ Render with outline variant
- ⏳ Render with ghost variant
- ⏳ Handle click events
- ⏳ Display loading state
- ⏳ Respect disabled state
- ⏳ Include proper ARIA attributes
- ⏳ Support custom className

### 2. `Card.test.ts`
**Test Cases Planned:**
- ✅ Render with default variant
- ⏳ Render with elevated variant
- ⏳ Render with outlined variant
- ⏳ Render with interactive variant
- ⏳ Display title correctly
- ⏳ Display description correctly
- ⏳ Support custom actions
- ⏳ Handle click events (interactive)
- ⏳ Include proper semantic HTML
- ⏳ Support custom className

### 3. `Icon.test.ts`
**Test Cases Planned:**
- ✅ Render common icons
- ⏳ Handle invalid icon name
- ⏳ Support custom size
- ⏳ Support custom color
- ⏳ Support custom className
- ⏳ Include proper ARIA labels
- ⏳ Support decorative mode (aria-hidden)
- ⏳ Render inline SVG correctly
- ⏳ Maintain aspect ratio
- ⏳ Support all 18+ icons in library

---

## Next Steps

### Option 1: Use Astro Testing Library (Recommended)

```bash
# Install Astro Testing Library
bun add -d @astrojs/testing-library

# Configure vitest.config.ts for component testing
```

**Example Test:**
```typescript
import { render, screen } from '@astrojs/testing-library'
import { describe, it, expect } from 'vitest'
import Button from '../ui/Button.astro'

describe('Button', () => {
	it('renders with text', async () => {
		const { container } = await render(Button, {
			props: { children: 'Click me' }
		})
		expect(container.textContent).toBe('Click me')
	})
})
```

### Option 2: Use Playwright Component Tests

```bash
# Already have Playwright installed
# Can use Playwright's component testing
```

**Example Test:**
```typescript
import { test, expect } from '@playwright/experimental-ct-astro'
import Button from '../ui/Button.astro'

test('renders button', async ({ mount }) => {
	const component = await mount(<Button>Click me</Button>)
	await expect(component).toContainText('Click me')
})
```

### Option 3: Keep E2E Tests Only (Current Approach)

**Rationale:**
- E2E tests already cover component behavior indirectly
- Component tests require additional setup
- Focus on user-facing tests (E2E) instead of unit tests

**Coverage:**
- ✅ Button: Tested via contact form, navigation
- ✅ Card: Tested via blog listing, kegiatan cards
- ✅ Icon: Tested via navbar, footer, social links

---

## Recommendation

**For now:** Keep placeholder tests and focus on E2E tests

**Why:**
1. E2E tests provide better ROI (test actual user flows)
2. Component tests add complexity without much value for static Astro components
3. Current E2E suite already covers component behavior

**Future:** If component test coverage becomes critical:
1. Install `@astrojs/testing-library`
2. Configure Vitest for component testing
3. Implement tests for critical components only (Button, Icon)

---

## Running Tests

```bash
# Current placeholder tests (will pass)
bun run test

# Future component tests
bun run test:components  # (needs setup)

# E2E tests (comprehensive)
bunx playwright test
```

---

**Last Updated:** 10 Juni 2026  
**Maintained by:** PT Koneksi Jaringan Indonesia