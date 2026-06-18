/**
 * Helper functions for generating JSON-LD structured data.
 * Each function returns a plain object — caller stringifies with JSON.stringify.
 */

interface ArticleInput {
	title: string
	description: string
	date: Date
	category?: string
	canonicalUrl: string
	siteName: string
	siteUrl: string
	image?: string
}

export function articleSchema(input: ArticleInput) {
	const { title, description, date, category, canonicalUrl, siteName, siteUrl, image } = input
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: title,
		description,
		datePublished: date.toISOString(),
		dateModified: date.toISOString(),
		...(image && { image: { '@type': 'ImageObject', url: image } }),
		author: { '@type': 'Organization', name: siteName, url: siteUrl },
		publisher: {
			'@type': 'Organization',
			name: siteName,
			url: siteUrl,
			logo: { '@type': 'ImageObject', url: `${siteUrl}/logo-yayasan.webp` },
		},
		mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
		...(category && {
			articleSection: category,
			keywords: ['yayasan', 'amal shalih', 'insan bantul', category],
		}),
	}
}

interface BreadcrumbItem {
	name: string
	url?: string
}

export function breadcrumbSchema(items: BreadcrumbItem[], siteUrl: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			...(item.url && { item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}` }),
		})),
	}
}

// ponytail: only extracted patterns that actually repeat.
// BaseLayout's Organization+WebSite stays inline — it's one-time, static, never varies per page.
