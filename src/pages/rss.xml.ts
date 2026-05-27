import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';

export async function GET() {
	const kegiatan = await getCollection('kegiatan');

	const items = kegiatan.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

	return rss({
		title: `${SITE.name} — Kegiatan & Berita`,
		description: `${SITE.tagline} — Update kegiatan dan berita terbaru dari ${SITE.name}.`,
		site: SITE.url,
		items: items.map((item) => ({
			title: item.data.title,
			pubDate: item.data.date,
			description: item.data.description,
			link: `/kegiatan/${item.id}/`,
			categories: [item.data.kategori],
		})),
		customData: `<language>id</language>`,
	});
}
