/**
 * Application constants
 *
 * Navigation items, category labels/mappings,
 * breadcrumb labels, gallery UI configuration.
 */
export const NAV_ITEMS: {
	label: string
	href: string
	children?: { label: string; href: string }[]
}[] = [
	{ label: 'Beranda', href: '/' },
	{ label: 'Tentang', href: '/tentang' },
	{ label: 'Program', href: '/program' },
	{ label: 'Galeri', href: '/galeri' },
	{ label: 'Blog', href: '/blog' },
	{
		label: 'BARKAS',
		href: '/barkas',
		children: [
			{ label: 'Katalog', href: '/barkas' },
			{ label: 'Donasi', href: '/barkas/donasi' },
			{ label: 'Dampak', href: '/barkas/dampak' },
			{ label: 'Tentang', href: '/barkas/tentang' },
		],
	},
	{ label: 'Kegiatan', href: '/kegiatan' },
	{ label: 'Kontak', href: '/kontak' },
]

export const KATEGORI_LABELS: Record<string, string> = {
	pendidikan: 'Pendidikan',
	keagamaan: 'Keagamaan',
	sosial: 'Sosial Kemanusiaan',
	umum: 'Umum',
}
