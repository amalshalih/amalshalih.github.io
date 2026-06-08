# Commit Strategy — Handover Tim

> **Dibuat:** 27 Mei 2026  
> **Updated:** 7 Juni 2026  
> **Status:** ✅ **HISTORIS** — Sesi 1 sudah dieksekusi, disimpan untuk referensi  
> **Tujuan:** Dokumen ini berisi strategi dan eksekusi commit untuk memudahkan tracking issue dan handover ke tim pengembang.  
> **Gaya:** Conventional Commits — `feat:`, `fix:`, `style:`, `refactor:`, `chore:`, `docs:`, `perf:`, `build:`

---

## Daftar Isi

1. [Hasil Audit File — Tracked vs Ignored](#1-hasil-audit-file)
2. [Struktur Commit — Sesi 1 (Initial Setup)](#2-struktur-commit--sesi-1-initial-setup)
3. [Cara Eksekusi Sesi 1](#3-cara-eksekusi-sesi-1)
4. [Konvensi Branch](#4-konvensi-branch)
5. [Troubleshooting — Cara Lacak Issue](#5-troubleshooting)
6. [Appendix: File Reference](#6-appendix)

---

## 1. Hasil Audit File — Tracked vs Ignored

### ✅ WAJIB di-track (repo)

| Kategori | File/Folder | Keterangan |
|----------|-------------|------------|
| Source code | `src/pages/*` | Semua halaman (index, tentang, program, kegiatan, donasi, kontak, 404, blog, galeri) |
| Source code | `src/components/*` | UI components (Button, Card, Icon), sections, gallery (Lightbox, MasonryGrid, LikeButton) |
| Source code | `src/layouts/BaseLayout.astro` | Layout utama (header, nav, footer, sosial media) |
| Source code | `src/lib/constants.ts` | Navigasi items, kategori labels |
| Source code | `src/lib/google-drive.ts` | Google Drive API wrapper |
| Source code | `src/data/site.ts` | Semua data konten (SITE, CONTACT, SOCIAL, STATS, DONATION) |
| Source code | `src/data/galleries.ts` | Gallery data module |
| Source code | `src/styles/global.css` | Tailwind theme, color palette, utilities |
| Source code | `src/content.config.ts` | Konfigurasi content collection |
| Source code | `src/content/kegiatan/*.md` | Artikel kegiatan |
| Source code | `src/content/blog/*.md` | Artikel blog |
| Source code | `src/pages/api/like/[slug].ts` | API endpoint like/unlike |
| Config | `astro.config.mjs` | Konfigurasi Astro (site URL, integrations) |
| Config | `package.json` | Dependencies & scripts |
| Config | `bun.lock` | Lockfile (commit WAJIB untuk reproduksi) |
| Config | `tsconfig.json` | TypeScript config |
| Config | `.gitignore` | Rules gitignore |
| Config | `wrangler.jsonc` | Cloudflare deployment config |
| Config | `wrangler.build.jsonc` | Build-time compatibility config |
| Config | `.env.example` | Contoh environment variables |
| CI/CD | `.github/workflows/deploy.yml` | GitHub Actions auto-deploy |
| Scripts | `scripts/*` | Build scripts (gallery cache, generate wrangler config) |
| Assets | `public/` | Logo, favicon, images |
| Docs | `.openkb/**/*.md` | Dokumentasi teknis (subdirektori terstruktur) |
| Docs | Root `*.md` | Project README (sudah ada di .openkb/) |
| Tools | `.sisyphus/` | Work plans dari Sisyphus agent |

### ❌ JANGAN di-track

| Alasan | File/Folder | Keterangan |
|--------|-------------|------------|
| **🔴 RAHASIA** | `amalshalih-fd1bd-firebase-adminsdk-fbsvc-624be20267.json` | Firebase Admin SDK key |
| **🔴 RAHASIA** | `gen-lang-client-0412959743-42ff01c2a818.json` | Google Drive Service Account key |
| **Artifacts sementara** | `.playwright-mcp/` | Page snapshots, screenshot dari Playwright MCP |
| **Artifacts sementara** | `.wrangler/` | Wrangler local state (ephemeral) |
| **Artifacts sementara** | `*.snapshot.yml` | Playwright snapshot files |
| **Artifacts sementara** | `Screenshot *.png` | Screenshot development |
| **Generated cache** | `src/data/cache/` | Gallery cache dari Google Drive |
| **Generated cache** | `src/data/generated-galleries.json` | Generated gallery index |
| **Binary mentah** | `.openkb/**/*.pdf` | Dokumen legal (Akta, NIB, NPWP, Proposal) — sensitif, besar |
| **Binary mentah** | `.openkb/**/*.jpg` | Kop surat, logo mentah |
| **Binary mentah** | `.openkb/**/*.jpeg` | WhatsApp image |
| **Binary mentah** | `.openkb/**/*.png` | Logo mentah, qris mentah |
| **Binary mentah** | `.openkb/**/*.docx` | Proposal, profil (binary format) |
| **Binary mentah** | `.openkb/**/*.ai` | File Illustrator |
| **Binary mentah** | `.openkb/**/*.PNG` | (case-sensitive) |
| **Build output** | `dist/` | ✅ Sudah di .gitignore |
| **Generated types** | `.astro/` | ✅ Sudah di .gitignore |
| **Dependencies** | `node_modules/` | ✅ Sudah di .gitignore |

---

## 2. Struktur Commit — Sesi 1 (Initial Setup)

> **Status:** ✅ SUDAH DIEKSEKUSI. Disimpan di sini untuk referensi historis dan tracing issue.

### Prinsip

Setiap commit bersifat **atomic**:
- Satu domain per commit
- Bisa di-revert tanpa kena domain lain
- `git blame` langsung mengarah ke fitur spesifik
- Cocok untuk `git bisect` jika ada issue

### Urutan Eksekusi

```
Commit S1 ── Gitignore + Hapus template boilerplate
Commit S2 ── Config & assets
Commit S3 ── Data & content layer
Commit S4 ── UI Components
Commit S5 ── Layout & PageHeader
Commit S6 ── Semua pages + dokumentasi
```

---

### Commit S1: `chore: clean up Astro template boilerplate`

**Tujuan:** Membersihkan semua file bawaan template Astro yang tidak dipakai.

| Action | Files |
|--------|-------|
| **Update** | `.gitignore` — tambah ignore rules untuk `.playwright-mcp/` dan binary `.openkb/**/*.pdf`, `.openkb/**/*.jpg`, dll |
| **Delete** | `README.md`, blog posts template, blog pages template, `src/pages/about.astro`, `rss.xml.js` |
| **Delete** | Old components (Footer, Header, HeaderLink, FormattedDate), `src/consts.ts`, `BlogPost.astro` |
| **Delete** | Placeholder images, font files |

---

### Commit S2: `chore: configure project settings and assets`

| Action | Files |
|--------|-------|
| **Modified** | `astro.config.mjs` — site URL, integrations |
| **Modified** | `package.json`, `bun.lock` — dependencies |
| **Add** | `public/logo-yayasan.webp`, `logo-yayasan-sm.webp`, `qris.webp` |

---

### Commit S3: `feat: add data layer and content`

| Action | Files |
|--------|-------|
| **Add** | `src/data/site.ts`, `src/lib/constants.ts` |
| **Modified** | `src/content.config.ts` — kegiatan collection |
| **Add** | `src/content/kegiatan/` — 3 artikel kegiatan |

---

### Commit S4: `feat: add UI components`

| Action | Files |
|--------|-------|
| **Add** | `src/components/ui/Button.astro` — 5 varian |
| **Add** | `src/components/ui/Card.astro` — 4 varian |
| **Add** | `src/components/ui/Icon.astro` — 18 icons, inline SVG |

**Catatan:** Icon.astro berisi fix Tailwind v4 dynamic class issue.

---

### Commit S5: `feat: add layout and navigation`

| Action | Files |
|--------|-------|
| **Add** | `src/layouts/BaseLayout.astro` — navbar sticky, footer, social icons |
| **Add** | `src/components/sections/PageHeader.astro` — gradient header |
| **Modified** | `src/components/BaseHead.astro` — OG image, meta tags |

---

### Commit S6: `feat: add all pages and documentation`

| Action | Files |
|--------|-------|
| **Modified** | `src/pages/index.astro` — Beranda |
| **Add** | `src/pages/tentang.astro`, `program.astro`, `donasi.astro`, `kontak.astro`, `404.astro` |
| **Add** | `src/pages/kegiatan/index.astro`, `kegiatan/[slug].astro` |
| **Modified** | `src/styles/global.css` — Full custom theme |
| **Add** | `.openkb/` docs (structured subdirs), `PROJECT_STATUS.md` (now in OpenKB repo), `.sisyphus/` |

---

## 3. Cara Eksekusi Sesi 1

### Step-by-step (sudah dieksekusi)

```bash
# 1. Update .gitignore dulu
# 2. Commit S1 — Clean template
git rm src/content/blog/*.md src/content/blog/*.mdx
git rm src/pages/blog/[...slug].astro src/pages/blog/index.astro
git rm src/pages/about.astro src/pages/rss.xml.js
git rm src/components/Footer.astro src/components/Header.astro
git rm src/components/HeaderLink.astro src/components/FormattedDate.astro
git rm src/consts.ts src/layouts/BlogPost.astro
git rm src/assets/blog-placeholder-*.jpg
git rm src/assets/fonts/atkinson-*.woff
git rm README.md
git add .gitignore
git commit -m "chore: clean up Astro template boilerplate"

# 3. Commit S2 — Config & assets
git add astro.config.mjs package.json bun.lock tsconfig.json
git add public/logo-yayasan.webp public/logo-yayasan-sm.webp public/qris.webp
git commit -m "chore: configure project settings and assets"

# 4. Commit S3 — Data & content
git add src/data/site.ts src/lib/constants.ts src/content.config.ts
git add src/content/kegiatan/
git commit -m "feat: add data layer and content"

# 5. Commit S4 — Components
git add src/components/ui/
git commit -m "feat: add UI components"

# 6. Commit S5 — Layout & navigation
git add src/layouts/BaseLayout.astro
git add src/components/sections/PageHeader.astro
git add src/components/BaseHead.astro
git commit -m "feat: add layout and navigation"

# 7. Commit S6 — Pages & documentation
git add src/pages/ src/styles/global.css
git add .openkb/**/*.md .sisyphus/
git commit -m "feat: add all pages and documentation"
```

### Verifikasi

```bash
git log --oneline
# Output:
# 6a1b2c3 feat: add all pages and documentation
# 4d5e6f7 feat: add layout and navigation
# 7g8h9i0 feat: add UI components
# 1j2k3l4 feat: add data layer and content
# 5m6n7o8 chore: configure project settings and assets
# 9p0q1r2 chore: clean up Astro template boilerplate

git status
# Output: nothing to commit, working tree clean
```

---

## 4. Konvensi Branch

### Branch Structure

```
main          → Production (auto-deploy ke Workers via GitHub Actions)
└── feat/*    → Fitur baru (branch dari main, PR ke main)
└── fix/*     → Bug fix
└── refactor/*→ Perubahan struktur kode tanpa perubahan fungsi
└── chore/*   → Tugas maintenance (dependencies, config)
└── perf/*    → Performance improvements
└── docs/*    → Dokumentasi
└── build/*   → Build system, CI/CD
```

### Contoh

```bash
git checkout -b feat/gallery-lightbox-animation
git commit -m "feat: add smooth animation to gallery lightbox"
git push origin feat/gallery-lightbox-animation
# Buat PR di GitHub → merge ke main
```

### Branch Protection (Recommended)

| Aturan | Setting | Alasan |
|--------|---------|--------|
| **Require PR** | ✅ On | Jangan push langsung ke main |
| **Require status check** | ✅ On | Build harus lulus dulu |
| **Delete after merge** | ✅ On | Jaga branch tetap bersih |

---

## 5. Troubleshooting — Cara Lacak Issue

### Prinsip: `git blame` + `git log -- <file>`

| Issue Yang Muncul | Cek Commit | File yang di-Blame |
|---|---|---|
| **Kontak/sosial media salah** | S3 | `src/data/site.ts` |
| **Button tidak muncul** | S4 | `src/components/ui/Button.astro` |
| **Icon tidak kelihatan** | S4 | `src/components/ui/Icon.astro` |
| **Header/footer layout rusak** | S5 | `src/layouts/BaseLayout.astro` |
| **Halaman error** | S6 | `src/pages/<nama>.astro` |
| **Warna/tema bermasalah** | S6 | `src/styles/global.css` |
| **Konten kegiatan salah** | S3 | `src/content/kegiatan/<slug>.md` |
| **Build gagal** | S2 | `astro.config.mjs`, `package.json` |

### Git bisect

```bash
git bisect start
git bisect HEAD           # bad
git bisect good e51b209  # good (initial astro commit)
# test → git bisect good / bad → repeat
```

### Revert commit spesifik

```bash
git revert <hash-commit>
git revert --no-commit <hash>  # partial revert
git reset
git add <file-spesifik>
git commit -m "partial revert: fix <file>"
```

---

## 6. Appendix: File Reference

### Status File Awal (sebelum Sesi 1)

```
Tracked (dari template Astro):  36 files
Modified:                       astro.config.mjs, bun.lock, package.json,
                                BaseHead.astro, content.config.ts,
                                index.astro, global.css
Deleted:                        README.md, 5 blog posts, 2 blog pages,
                                about page, RSS page, 3 components,
                                consts.ts, BlogPost layout,
                                5 placeholder images, 2 font files
Untracked (file baru):          19+ files
```

### File Baru — Detail (Sesi 1)

| Folder | Files |
|--------|-------|
| `src/pages/` | `index.astro`, `404.astro`, `tentang.astro`, `program.astro`, `donasi.astro`, `kontak.astro` |
| `src/pages/kegiatan/` | `index.astro`, `[slug].astro` |
| `src/layouts/` | `BaseLayout.astro` |
| `src/components/ui/` | `Button.astro`, `Card.astro`, `Icon.astro` |
| `src/components/sections/` | `PageHeader.astro` |
| `src/data/` | `site.ts` |
| `src/lib/` | `constants.ts` |
| `src/content/kegiatan/` | 3 artikel kegiatan |
| `public/` | `logo-yayasan.webp`, `logo-yayasan-sm.webp`, `qris.webp` |
| `.openkb/` | `10-arsitektur/brainstorming.md`, `10-arsitektur/audit-komprehensif.md`, `30-deploy/commit-strategy.md` |
| Root | `PROJECT_STATUS.md` |
| `.sisyphus/` | Work plan files |

---

## Related Documentation

| Document | Location |
|----------|----------|
| **Workspace Management** | [OpenKB repo: 10-organisasi/workspace-management.md](https://github.com/amalshalih/amalshalih/blob/main/.openkb/10-organisasi/workspace-management.md) |
| **Deployment Guide** | `.openkb/30-deploy/deployment.md` |
| **Brainstorming** | `.openkb/10-arsitektur/brainstorming.md` |

**Last Updated:** 7 Juni 2026  
**Maintained by:** timitasib@gmail.com (IT/Teknis)

---

*Dokumen ini bisa langsung dipakai oleh siapapun di tim untuk mengeksekusi commit atau melacak issue.*
*Terakhir diperbarui: 7 Juni 2026*
