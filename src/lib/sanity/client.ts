import { sanityClient } from 'sanity:client'
import {
	bankDonasiQuery,
	faqListQuery,
	kegiatanItemQuery,
	kegiatanListQuery,
	pengurusQuery,
	programListQuery,
	siteSettingsQuery,
} from './queries'
import type {
	SanityBankDonasi,
	SanityFaq,
	SanityKegiatan,
	SanityPengurus,
	SanityProgram,
	SanitySiteSettings,
} from './types'

export async function getKegiatanList(): Promise<SanityKegiatan[]> {
	return sanityClient.fetch(kegiatanListQuery)
}

export async function getKegiatanItem(slug: string): Promise<SanityKegiatan | null> {
	return sanityClient.fetch(kegiatanItemQuery, { slug })
}

export async function getProgramList(): Promise<SanityProgram[]> {
	return sanityClient.fetch(programListQuery)
}

export async function getBankDonasi(): Promise<SanityBankDonasi[]> {
	return sanityClient.fetch(bankDonasiQuery)
}

export async function getPengurus(): Promise<SanityPengurus[]> {
	return sanityClient.fetch(pengurusQuery)
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
	return sanityClient.fetch(siteSettingsQuery)
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
