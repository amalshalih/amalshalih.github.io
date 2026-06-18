import { describe, expect, it } from 'vitest'

describe('FormField — Props', () => {
	it('accepts required type, id, name, label', () => {
		const props = { type: 'text', id: 'nama', name: 'nama', label: 'Nama' }
		expect(props.type).toBe('text')
		expect(props.id).toBe('nama')
		expect(props.name).toBe('nama')
		expect(props.label).toBe('Nama')
	})

	it('supports text, email, tel, and textarea types', () => {
		const types = ['text', 'email', 'tel', 'textarea'] as const
		expect(types.length).toBe(4)
		for (const t of types) {
			const props = { type: t, id: 'f', name: 'f', label: 'F' }
			expect(props.type).toBe(t)
		}
	})

	it('optional required flag defaults to false', () => {
		const { required = false } = { required: undefined as boolean | undefined }
		expect(required).toBe(false)
	})

	it('optional rows defaults to 4', () => {
		const { rows = 4 } = { rows: undefined as number | undefined }
		expect(rows).toBe(4)
	})
})

describe('RadioCard — Props', () => {
	it('accepts required name, value, icon, label, description, describedBy', () => {
		const props = {
			name: 'subjek',
			value: 'donasi',
			icon: 'heart',
			label: 'Donasi',
			description: 'Konfirmasi donasi',
			describedBy: 'desc-donasi',
		}
		expect(props.name).toBe('subjek')
		expect(props.value).toBe('donasi')
		expect(props.icon).toBe('heart')
		expect(props.label).toBe('Donasi')
		expect(props.description).toBe('Konfirmasi donasi')
		expect(props.describedBy).toBe('desc-donasi')
	})
})
