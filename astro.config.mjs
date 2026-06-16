// @ts-check

import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import partytown from '@astrojs/partytown'
import sitemap from '@astrojs/sitemap'
import sanity from '@sanity/astro'
import sentry from '@sentry/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

// Load .env for build-time only (Sentry auth, etc.)
const env = loadEnv('production', process.cwd(), '')
Object.assign(process.env, env)

export default defineConfig({
	site: 'https://amalshalih.or.id',
	output: 'server',
	adapter: cloudflare(),
	integrations: [
		mdx(),
		sitemap({
			serialize(item) {
				if (/404/.test(item.url)) {
					return undefined
				}
				if (item.url === 'https://amalshalih.or.id/') {
					return /** @type {import('@astrojs/sitemap').SitemapItem} */ ({
						...item,
						changefreq: 'daily',
						priority: 1.0,
					})
				}
				if (/kegiatan/.test(item.url) || /blog/.test(item.url)) {
					return /** @type {import('@astrojs/sitemap').SitemapItem} */ ({
						...item,
						changefreq: 'weekly',
						priority: 0.8,
					})
				}
				return /** @type {import('@astrojs/sitemap').SitemapItem} */ ({
					...item,
					changefreq: 'monthly',
					priority: 0.5,
				})
			},
		}),
		sanity({
			projectId: '9yj0dq9v',
			dataset: 'production',
			useCdn: false,
		}),
		// Partytown - offload third-party scripts to Web Worker for better performance
		// Docs: https://docs.astro.build/en/guides/integrations-guide/partytown/
		partytown({
			config: {
				// Forward dataLayer.push from Web Worker to main thread (required for GA4)
				forward: ['dataLayer.push'],
				// Enable debug mode in development
				debug: process.env.NODE_ENV === 'development',
			},
		}),
		// Sentry integration - must be LAST in the array
		// Docs: https://docs.sentry.io/platforms/javascript/guides/astro/
		process.env.NODE_ENV !== 'development' &&
			sentry({
				org: 'yayasan-amal-shalih-insan-bant',
				project: 'amalshalih',
				authToken: process.env.SENTRY_AUTH_TOKEN,
			}),
	].filter(Boolean),
	vite: {
		resolve: {
			alias: {
				'@components': './src/components',
				'@data': './src/data',
				'@layouts': './src/layouts',
				'@lib': './src/lib',
				'@content': './src/content',
				'@pages': './src/pages',
				'@styles': './src/styles',
				'@assets': './src/assets',
			},
		},
		build: {
			sourcemap: true,
		},
		// @ts-expect-error — Vite version mismatch between Astro bundled & project dep
		plugins: [tailwindcss()],
		// Exclude Sanity client and PortableText from Vite optimization - incompatible with SSR dep optimizer
		optimizeDeps: {
			exclude: ['@sanity/client', '@portabletext/to-html'],
		},
	},
})
