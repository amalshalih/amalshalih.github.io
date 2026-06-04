import { bankDonasiType } from './bankDonasi'
import { blockContentType } from './blockContent'
import { faqType } from './faq'
import { kegiatanType } from './kegiatan'
import { pengurusType } from './pengurus'
import { programType } from './program'
import { siteSettingsType } from './siteSettings'

export const schemaTypes = [
	// Existing schemas
	kegiatanType,
	programType,
	bankDonasiType,
	pengurusType,
	siteSettingsType,
	blockContentType,
	// Add FAQ schema
	faqType,
]
