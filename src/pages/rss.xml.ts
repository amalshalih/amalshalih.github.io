import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'
import { SITE } from '../data/site'

export async function GET() {
	const [kegiatan, blog] = await Promise.all([getCollection('kegiatan'), getCollection('blog')])

	const rssItems = [
		...kegiatan.map((item) => ({
			title: item.data.title,
			pubDate: item.data.date,
			description: item.data.description,
			link: `/kegiatan/${item.id}/`,
			categories: [item.data.kategori],
		})),
		...blog.map((item) => ({
			title: item.data.title,
			pubDate: item.data.date,
			description: item.data.description,
			link: `/blog/${item.id}/`,
			categories: [item.data.category || 'Blog'],
		})),
	]

	// Sort by date descending
	rssItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

	return rss({
		title: `${SITE.name} — Update Terbaru`,
		description: `${SITE.tagline} — Artikel blog dan kabar kegiatan terbaru dari ${SITE.name}.`,
		site: SITE.url,
		items: rssItems,
		customData: `<language>id</language>`,
	})
}
