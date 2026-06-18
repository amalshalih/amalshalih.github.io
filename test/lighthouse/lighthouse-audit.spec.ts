import { expect, test } from '@playwright/test'

test.describe('Performance & SEO Audit', () => {
	test('homepage should have good performance metrics', async ({ page }, testInfo) => {
		await page.goto('/')
		await page.waitForLoadState('networkidle')

		const metrics = await page.evaluate(() => {
			const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
			return {
				loadTime: perf.loadEventEnd - perf.fetchStart,
				domContentLoaded: perf.domContentLoadedEventEnd - perf.fetchStart,
				firstByte: perf.responseStart - perf.fetchStart,
			}
		})

		console.log('Performance Metrics:', metrics)
		expect(metrics.loadTime).toBeLessThan(3000)
		expect(metrics.domContentLoaded).toBeLessThan(2000)
		expect(metrics.firstByte).toBeLessThan(600)

		testInfo.attachments.push({
			name: 'performance-metrics',
			contentType: 'application/json',
			body: Buffer.from(JSON.stringify(metrics, null, 2)),
		})
	})

	test('homepage should have no accessibility violations', async ({ page }) => {
		await page.goto('/')

		const hasSkipLink = (await page.locator('a[href="#main-content"]').count()) > 0
		const hasMainLandmark = (await page.locator('main[id="main-content"]').count()) > 0
		const hasNav = (await page.locator('nav').count()) > 0
		const hasFooter = (await page.locator('footer').count()) > 0

		expect(hasSkipLink).toBe(true)
		expect(hasMainLandmark).toBe(true)
		expect(hasNav).toBe(true)
		expect(hasFooter).toBe(true)

		const imagesWithoutAlt = await page.evaluate(() => {
			const images = Array.from(document.querySelectorAll('img'))
			return images.filter((img) => !img.alt && !img.getAttribute('aria-hidden')).length
		})

		expect(imagesWithoutAlt).toBe(0)
	})

	test('homepage should have valid SEO metadata', async ({ page }) => {
		await page.goto('/')

		const title = await page.title()
		const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
		const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
		const ogDescription = await page
			.locator('meta[property="og:description"]')
			.getAttribute('content')

		expect(title).toBeTruthy()
		expect(title.length).toBeGreaterThan(10)
		expect(title.length).toBeLessThan(60)
		expect(metaDescription).toBeTruthy()
		expect(metaDescription?.length).toBeGreaterThan(50)
		expect(metaDescription?.length).toBeLessThan(160)
		expect(canonical).toBeTruthy()
		expect(ogTitle).toBeTruthy()
		expect(ogDescription).toBeTruthy()

		const hasStructuredData = (await page.locator('script[type="application/ld+json"]').count()) > 0
		expect(hasStructuredData).toBe(true)
	})
})
