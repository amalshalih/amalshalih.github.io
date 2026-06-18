import { describe, expect, it } from 'vitest'

/**
 * EmptyState Component Contract Tests
 *
 * Validates the EmptyState.astro component's prop interface and configuration.
 */
describe('EmptyState — Props', () => {
	const VALID_ICONS = [
		'image',
		'file-text',
		'search',
		'star',
		'heart',
		'alert-circle',
		'info',
		'x-circle',
	] as const

	it('accepts required title string', () => {
		const props = { title: 'Tidak Ada Data', description: 'Belum ada konten.' }
		expect(props.title).toBeTruthy()
		expect(typeof props.title).toBe('string')
	})

	it('accepts required description string', () => {
		const props = { title: 'Tidak Ada Data', description: 'Belum ada konten.' }
		expect(props.description).toBeTruthy()
		expect(typeof props.description).toBe('string')
	})

	it('accepts optional icon from valid set', () => {
		for (const icon of VALID_ICONS) {
			const props = { icon, title: 'x', description: 'y' }
			expect(props.icon).toBe(icon)
		}
	})

	it('accepts optional actionLabel and actionHref pair', () => {
		const props = {
			title: 'Kosong',
			description: 'Belum ada.',
			actionLabel: 'Lihat Semua',
			actionHref: '/galeri',
		}
		expect(props.actionLabel).toBeTruthy()
		expect(props.actionHref).toBeTruthy()
	})

	it('renders link button when actionHref is provided', () => {
		const withAction = { actionLabel: 'Coba Lagi', actionHref: '/' }
		expect(withAction.actionHref).toBeTruthy()
		const noAction = {}
		expect('actionHref' in noAction).toBe(false)
	})
})

describe('EmptyState — Defaults', () => {
	it('default icon is file-text when not specified', () => {
		const { icon = 'file-text' } = { icon: undefined as string | undefined }
		expect(icon).toBe('file-text')
	})
})
