import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'zod'

const kegiatan = defineCollection({
	loader: glob({ pattern: ['**/*.md', '!**/README.md'], base: './src/content/kegiatan' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		image: z.string().optional(),
		kategori: z.enum(['pendidikan', 'keagamaan', 'sosial', 'umum']),
	}),
})

const blog = defineCollection({
	loader: glob({ pattern: ['**/*.md', '!**/README.md'], base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		image: z.string().optional(),
		category: z.string().optional(),
		author: z.string().default('Admin Yayasan ASIB'),
	}),
})

export const collections = { kegiatan, blog }
