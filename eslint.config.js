import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'

export default [
	{
		ignores: ['dist/', '.astro/', 'node_modules/', 'studio-amalshalih/'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...astro.configs.recommended,
	{
		files: ['**/*.js', '**/*.mjs', 'scripts/**/*.ts'],
		languageOptions: {
			globals: {
				process: 'readonly',
				console: 'readonly',
				__dirname: 'readonly',
				Buffer: 'readonly',
				setTimeout: 'readonly',
				setInterval: 'readonly',
				clearTimeout: 'readonly',
				clearInterval: 'readonly',
			},
		},
	},
	{
		rules: {
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},
]
