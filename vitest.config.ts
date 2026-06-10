import { cloudflareTest } from '@cloudflare/vitest-pool-workers'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [
		cloudflareTest({
			wrangler: { configPath: './wrangler.jsonc' },
		}),
	],
	test: {
		exclude: [
			'test/integration/**',
			'test/e2e/**',
			'test/lighthouse/**',
			'node_modules/**',
			'.opencode/**',
			'studio-amalshalih/**',
		],
	},
})
