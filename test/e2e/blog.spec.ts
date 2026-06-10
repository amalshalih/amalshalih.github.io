import { expect, test } from '@playwright/test'

test.describe('Blog', () => {
	test('should load blog index page', async ({ page }) => {
		await page.goto('/blog')
		await expect(page).toHaveTitle(/Blog/)
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('should display blog post list', async ({ page }) => {
		await page.goto('/blog')
		const articles = page.locator('article')
		await expect(articles).toHaveCount(1, { timeout: 5000 })
		await expect(articles.count()).resolves.toBeGreaterThanOrEqual(1)
	})

	test('should navigate to individual blog post', async ({ page }) => {
		await page.goto('/blog')
		const firstPost = page.locator('article').first()
		await firstPost.getByRole('link').click()
		await expect(page).toHaveURL(/\/blog\/[\w-]+/)
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('should display blog post content', async ({ page }) => {
		await page.goto('/blog')
		const firstPost = page.locator('article').first()
		await firstPost.getByRole('link').click()
		await expect(page.locator('[data-content]')).toBeVisible()
	})

	test('should have valid SEO for blog post', async ({ page }) => {
		await page.goto('/blog')
		const firstPost = page.locator('article').first()
		await firstPost.getByRole('link').click()
		const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
		expect(metaDescription).toBeTruthy()
	})

	test('should display blog post date', async ({ page }) => {
		await page.goto('/blog')
		const firstPost = page.locator('article').first()
		await firstPost.getByRole('link').click()
		await expect(page.locator('time')).toBeVisible()
	})

	test('should display blog post author', async ({ page }) => {
		await page.goto('/blog')
		const firstPost = page.locator('article').first()
		await firstPost.getByRole('link').click()
		await expect(page.getByText(/Admin Yayasan ASIB/i)).toBeVisible()
	})
})
