import { expect, test } from '@playwright/test'

test.describe('Contact Form', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/kontak')
	})

	test('should load contact page', async ({ page }) => {
		await expect(page).toHaveTitle(/Kontak/)
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('should display contact form', async ({ page }) => {
		await expect(page.getByLabel(/Nama/i)).toBeVisible()
		await expect(page.getByLabel(/Email/i)).toBeVisible()
		await expect(page.getByLabel(/Pesan/i)).toBeVisible()
		await expect(page.getByRole('button', { name: /Kirim/i })).toBeVisible()
	})

	test('should show validation error when submitting empty form', async ({ page }) => {
		await page.getByRole('button', { name: /Kirim/i }).click()
		await expect(page.getByText(/Nama harus diisi/i)).toBeVisible()
	})

	test('should show validation error for invalid email', async ({ page }) => {
		await page.getByLabel(/Nama/i).fill('Test User')
		await page.getByLabel(/Email/i).fill('invalid-email')
		await page.getByLabel(/Pesan/i).fill('Test message')
		await page.getByRole('button', { name: /Kirim/i }).click()
		await expect(page.getByText(/Format email tidak valid/i)).toBeVisible()
	})

	test('should submit form successfully with valid data', async ({ page }) => {
		await page.getByLabel(/Nama/i).fill('Test User')
		await page.getByLabel(/Telepon/i).fill('081234567890')
		await page.getByLabel(/Email/i).fill('test@example.com')
		await page.getByLabel(/Subjek/i).selectOption('lainnya')
		await page.getByLabel(/Pesan/i).fill('This is a test message')

		await page.getByRole('button', { name: /Kirim/i }).click()

		await expect(page.getByText(/Terima kasih/i)).toBeVisible({ timeout: 5000 })
	})

	test('should have honeypot field (spam protection)', async ({ page }) => {
		const honeypot = page.locator('input[name="_website"]')
		await expect(honeypot).toBeHidden()
	})

	test('should display contact information', async ({ page }) => {
		await expect(page.getByText(/info@amalshalih.or.id/i)).toBeVisible()
		await expect(page.getByText(/0821-3800-7102/i)).toBeVisible()
	})
})
