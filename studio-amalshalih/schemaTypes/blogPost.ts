import { defineField, defineType } from 'sanity'

export const blogPostType = defineType({
	name: 'blogPost',
	title: 'Blog',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Judul',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'publishedAt',
			title: 'Tanggal Publikasi',
			type: 'datetime',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'category',
			title: 'Kategori',
			type: 'string',
			options: {
				list: [
					{ title: 'Artikel', value: 'artikel' },
					{ title: 'Pengumuman', value: 'pengumuman' },
					{ title: 'Renungan', value: 'renungan' },
				],
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'excerpt',
			title: 'Ringkasan',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'coverImage',
			title: 'Gambar Sampul',
			type: 'image',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					title: 'Teks Alternatif',
					type: 'string',
				}),
			],
		}),
		defineField({
			name: 'body',
			title: 'Konten',
			type: 'blockContent',
		}),
		defineField({
			name: 'author',
			title: 'Penulis',
			type: 'string',
			initialValue: 'Tim ASIB',
		}),
	],
	preview: {
		select: {
			title: 'title',
			media: 'coverImage',
			subtitle: 'category',
		},
	},
	orderings: [
		{
			title: 'Tanggal Publikasi',
			name: 'publishedAtDesc',
			by: [{ field: 'publishedAt', direction: 'desc' }],
		},
	],
})
