import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
	test('should navigate to program page', async ({ page }) => {
		await page.goto('/')
		await page.getByRole('link', { name: /Program/i }).click()
		await expect(page).toHaveURL(/\/program/)
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('should navigate to kegiatan page', async ({ page }) => {
		await page.goto('/')
		await page.getByRole('link', { name: /Kegiatan/i }).click()
		await expect(page).toHaveURL(/\/kegiatan/)
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('should navigate to galeri page', async ({ page }) => {
		await page.goto('/')
		await page.getByRole('link', { name: /Galeri/i }).click()
		await expect(page).toHaveURL(/\/galeri/)
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('should navigate to blog page', async ({ page }) => {
		await page.goto('/')
		await page.getByRole('link', { name: /Blog/i }).click()
		await expect(page).toHaveURL(/\/blog/)
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('should navigate to tentang page', async ({ page }) => {
		await page.goto('/')
		await page.getByRole('link', { name: /Tentang/i }).click()
		await expect(page).toHaveURL(/\/tentang/)
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('should navigate to donasi page', async ({ page }) => {
		await page.goto('/')
		await page.getByRole('link', { name: /Donasi/i }).click()
		await expect(page).toHaveURL(/\/donasi/)
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('should navigate to FAQ page', async ({ page }) => {
		await page.goto('/')
		await page.getByRole('link', { name: /FAQ/i }).click()
		await expect(page).toHaveURL(/\/faq/)
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})
})
