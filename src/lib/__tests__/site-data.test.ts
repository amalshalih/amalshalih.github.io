import { describe, expect, it } from 'vitest'
import { CONTACT, SITE, SOCIAL } from '../../data/site'

describe('SITE data integrity', () => {
	it('has required metadata', () => {
		expect(SITE.name).toBeTruthy()
		expect(SITE.shortName).toBeTruthy()
		expect(SITE.description).toBeTruthy()
		expect(SITE.url).toMatch(/^https?:\/\//)
	})

	it('has legal info', () => {
		expect(SITE.legal.sk).toBeTruthy()
		expect(SITE.legal.nib).toBeTruthy()
		expect(SITE.legal.npwp).toBeTruthy()
		expect(SITE.legal.kbli).toBeTruthy()
	})
})

describe('CONTACT data integrity', () => {
	it('has phone and email', () => {
		expect(CONTACT.phone).toBeTruthy()
		expect(CONTACT.email).toBeTruthy()
	})

	it('has full address', () => {
		expect(CONTACT.address.full).toBeTruthy()
		expect(CONTACT.address.city).toBe('Bantul')
	})
})

describe('SOCIAL media', () => {
	it('has all platforms with valid URLs', () => {
		expect(SOCIAL.facebook.url).toMatch(/^https?:\/\//)
		expect(SOCIAL.instagram.url).toMatch(/^https?:\/\//)
		expect(SOCIAL.youtube.url).toMatch(/^https?:\/\//)
		expect(SOCIAL.tiktok.url).toMatch(/^https?:\/\//)
		expect(SOCIAL.linktree.url).toMatch(/^https?:\/\//)
	})

	it('has labels for all platforms', () => {
		expect(SOCIAL.facebook.label).toBe('Facebook')
		expect(SOCIAL.instagram.label).toBe('Instagram')
		expect(SOCIAL.tiktok.label).toBe('TikTok')
		expect(SOCIAL.youtube.label).toBe('YouTube')
	})
})
