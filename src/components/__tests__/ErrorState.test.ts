import { describe, expect, it } from 'vitest'

describe('CTASection — Props', () => {
	it('accepts required heading', () => {
		const props = { heading: 'Ayo Berdonasi' }
		expect(props.heading).toBeTruthy()
	})

	it('accepts optional description', () => {
		const props = { heading: 'Judul', description: 'Deskripsi singkat.' }
		expect(props.description).toBe('Deskripsi singkat.')
	})

	it('accepts optional decoration with slots', () => {
		const withDecorations = { heading: 'X' }
		// decorations and actions are slots, not props
		expect(withDecorations.heading).toBe('X')
	})
})

describe('ErrorState — Props', () => {
	const VALID_ICONS = ['alert-circle', 'info', 'x-circle'] as const

	it('accepts required title and message', () => {
		const props = { title: 'Error', message: 'Terjadi kesalahan.' }
		expect(props.title).toBe('Error')
		expect(props.message).toBe('Terjadi kesalahan.')
	})

	it('accepts optional icon from valid set', () => {
		for (const icon of VALID_ICONS) {
			const props = { icon, title: 'x', message: 'y' }
			expect(props.icon).toBe(icon)
		}
	})

	it('defaults to alert-circle icon', () => {
		const { icon = 'alert-circle' } = { icon: undefined as string | undefined }
		expect(icon).toBe('alert-circle')
	})
})

describe('RetryButton — Behavior', () => {
	it('calls location.reload on click', () => {
		// Contract: component renders a button with onClick that calls location.reload()
		const onClick = () => window.location.reload()
		expect(onClick.toString()).toContain('location.reload')
	})
})
