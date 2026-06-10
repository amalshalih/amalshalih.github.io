import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
	test('should load homepage successfully', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveTitle(/Yayasan Amal Shalih Insan Bantul/)
	})

	test('should display main navigation', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('nav')).toBeVisible()
		await expect(page.getByRole('link', { name: /Beranda/i })).toBeVisible()
		await expect(page.getByRole('link', { name: /Program/i })).toBeVisible()
		await expect(page.getByRole('link', { name: /Kegiatan/i })).toBeVisible()
		await expect(page.getByRole('link', { name: /Galeri/i })).toBeVisible()
		await expect(page.getByRole('link', { name: /Kontak/i })).toBeVisible()
	})

	test('should display hero section', async ({ page }) => {
		await page.goto('/')
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('should have valid SEO metadata', async ({ page }) => {
		await page.goto('/')
		const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
		expect(metaDescription).toBeTruthy()
		expect(metaDescription?.length).toBeGreaterThan(50)
	})

	test('should display footer with contact info', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('footer')).toBeVisible()
		await expect(page.getByText(/Juron, Pendowoharjo/i)).toBeVisible()
	})
})
