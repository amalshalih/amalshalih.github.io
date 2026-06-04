import { defineField, defineType } from 'sanity'

export const faqType = defineType({
	name: 'faq',
	title: 'FAQ',
	type: 'document',
	fields: [
		defineField({
			name: 'category',
			title: 'Kategori',
			type: 'string',
			options: {
				list: [
					{ title: 'Tentang Yayasan', value: 'tentang-yayasan' },
					{ title: 'Donasi', value: 'donasi' },
					{ title: 'Program Pendidikan', value: 'program-pendidikan' },
					{ title: 'Sosial & Kemanusiaan', value: 'sosial-kemanusiaan' },
					{ title: 'Website & Teknis', value: 'website-teknis' },
					{ title: 'Umum', value: 'umum' },
				],
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'items',
			title: 'Pertanyaan & Jawaban',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'tanya',
							title: 'Pertanyaan',
							type: 'string',
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: 'jawab',
							title: 'Jawaban',
							type: 'blockContent',
						}),
						defineField({
							name: 'order',
							title: 'Urutan',
							type: 'number',
							initialValue: 0,
						}),
					],
				},
			],
		}),
		defineField({
			name: 'order',
			title: 'Urutan Kategori',
			type: 'number',
			initialValue: 0,
		}),
		defineField({
			name: 'isActive',
			title: 'Aktif',
			type: 'boolean',
			initialValue: true,
		}),
	],
	preview: {
		select: {
			category: 'category',
		},
		prepare(selection) {
			const category = selection.category
			return {
				title: `FAQ - ${category}`,
			}
		},
	},
})
