import { sanityClient } from 'sanity:client'
import { cachedFetch, sanityCacheKey } from '@lib/kv-cache'
import {
	bankDonasiQuery,
	blogPostItemQuery,
	blogPostListQuery,
	faqListQuery,
	kegiatanItemQuery,
	kegiatanListQuery,
	pengurusQuery,
	programListQuery,
	siteSettingsQuery,
} from './queries'
import type {
	SanityBankDonasi,
	SanityBlogPost,
	SanityFaq,
	SanityKegiatan,
	SanityPengurus,
	SanityProgram,
	SanitySiteSettings,
} from './types'

export async function getKegiatanList(): Promise<SanityKegiatan[]> {
	try {
		return await cachedFetch({
			key: sanityCacheKey(kegiatanListQuery),
			fetcher: () => sanityClient.fetch(kegiatanListQuery),
		})
	} catch (error) {
		console.error('[Sanity] Failed to fetch kegiatan list:', error)
		return []
	}
}

export async function getKegiatanItem(slug: string): Promise<SanityKegiatan | null> {
	try {
		return await cachedFetch({
			key: sanityCacheKey(kegiatanItemQuery, { slug }),
			fetcher: () => sanityClient.fetch(kegiatanItemQuery, { slug }),
		})
	} catch (error) {
		console.error('[Sanity] Failed to fetch kegiatan item:', error)
		return null
	}
}

export async function getProgramList(): Promise<SanityProgram[]> {
	try {
		return await cachedFetch({
			key: sanityCacheKey(programListQuery),
			fetcher: () => sanityClient.fetch(programListQuery),
		})
	} catch (error) {
		console.error('[Sanity] Failed to fetch program list:', error)
		return []
	}
}

export async function getBankDonasi(): Promise<SanityBankDonasi[]> {
	try {
		return await cachedFetch({
			key: sanityCacheKey(bankDonasiQuery),
			fetcher: () => sanityClient.fetch(bankDonasiQuery),
		})
	} catch (error) {
		console.error('[Sanity] Failed to fetch bank donasi:', error)
		return []
	}
}

export async function getPengurus(): Promise<SanityPengurus[]> {
	try {
		return await cachedFetch({
			key: sanityCacheKey(pengurusQuery),
			fetcher: () => sanityClient.fetch(pengurusQuery),
		})
	} catch (error) {
		console.error('[Sanity] Failed to fetch pengurus:', error)
		return []
	}
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
	try {
		return await cachedFetch({
			key: sanityCacheKey(siteSettingsQuery),
			fetcher: () => sanityClient.fetch(siteSettingsQuery),
		})
	} catch (error) {
		console.error('[Sanity] Failed to fetch site settings:', error)
		return null
	}
}

export async function getFaqList(): Promise<SanityFaq[] | null> {
	try {
		const faqs = await sanityClient.fetch<SanityFaq[]>(faqListQuery)
		return faqs || []
	} catch (error) {
		console.error('Failed to fetch FAQ from Sanity:', error)
		return []
	}
}

export async function getBlogPostList(): Promise<SanityBlogPost[]> {
	try {
		return await cachedFetch({
			key: sanityCacheKey(blogPostListQuery),
			fetcher: () => sanityClient.fetch(blogPostListQuery),
		})
	} catch (error) {
		console.error('[Sanity] Failed to fetch blog post list:', error)
		return []
	}
}

export async function getBlogPost(slug: string): Promise<SanityBlogPost | null> {
	try {
		return await cachedFetch({
			key: sanityCacheKey(blogPostItemQuery, { slug }),
			fetcher: () => sanityClient.fetch(blogPostItemQuery, { slug }),
		})
	} catch (error) {
		console.error('[Sanity] Failed to fetch blog post:', error)
		return null
	}
}
