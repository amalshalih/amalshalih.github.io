# Commit Sesi 2 — Gallery, Blog, Deploy, Perbaikan

> **Dibuat:** 30 Mei 2026
> **Tujuan:** Work plan untuk commit semua perubahan yang belum di-commit setelah 40+ commit sebelumnya.
> **Status:** ⏳ Belum dieksekusi

---

## Prasyarat: Update .gitignore Dulu!

### 🔴 RAHASIA — JANGAN PERNAH COMMIT

| File | Isi | Risiko |
|------|-----|--------|
| `amalshalih-fd1bd-firebase-adminsdk-fbsvc-624be20267.json` | Firebase Admin SDK key | Akses Realtime Database |
| `gen-lang-client-0412959743-42ff01c2a818.json` | Google Drive Service Account key | Akses Google Drive API |

Tambahkan ke `.gitignore`:
```gitignore
amalshalih-fd1bd-firebase-adminsdk-fbsvc-624be20267.json
gen-lang-client-0412959743-42ff01c2a818.json
.wrangler/
*.snapshot.yml
Screenshot *.png
src/data/cache/
src/data/generated-galleries.json
```

---

## Struktur Commit

### Commit 1: `.gitignore` cleanup

Proteksi file rahasia sebelum commit apapun.

```bash
# Edit .gitignore — tambah baris di atas
git add .gitignore
git commit -m "chore: add sensitive files and build artifacts to .gitignore"
git status  # verifikasi JSON keys tidak muncul
```

---

### Commit 2: `feat: add Google Drive gallery system`

| Action | File | Keterangan |
|--------|------|------------|
| **Add** | `src/lib/google-drive.ts` | Google Drive API wrapper |
| **Add** | `src/data/galleries.ts` | Gallery data module |
| **Add** | `src/components/gallery/MasonryGrid.astro` | Masonry layout |
| **Add** | `src/components/gallery/Lightbox.astro` | Foto lightbox |
| **Add** | `src/components/gallery/LikeButton.astro` | Tombol like |
| **Add** | `src/pages/galeri/[slug].astro` | Halaman galeri |
| **Add** | `src/pages/galeri-preview.astro` | Preview galeri |
| **Add** | `src/pages/api/like/[slug].ts` | API like/unlike |

```bash
git add src/lib/google-drive.ts src/data/galleries.ts
git add src/components/gallery/
git add src/pages/galeri/ src/pages/galeri-preview.astro src/pages/api/
git commit -m "feat: add Google Drive gallery system"
```

---

### Commit 3: `feat: add gallery cache scripts`

| Action | File |
|--------|------|
| **Add** | `scripts/discover-and-cache-galleries.ts` |
| **Add** | `scripts/cache-gallery-photos.ts` |

⚠️ `discover-and-cache-galleries.ts` di-referensi di `package.json` script `"build"`. Wajib di-commit.

```bash
git add scripts/
git commit -m "feat: add gallery cache scripts"
```

---

### Commit 4: `chore: migrate deployment from Pages to Workers`

| Action | File |
|--------|------|
| **Modified** | `astro.config.mjs` |
| **Modified** | `wrangler.jsonc` |
| **Add** | `wrangler.build.jsonc` |
| **Add** | `scripts/generate-wrangler-config.mjs` |
| **Add** | `.github/workflows/deploy.yml` |
| **Modified** | `sentry.server.config.js` |
| **Modified** | `.env.example` |
| **Modified** | `README.md` |
| **Deleted** | `wrangler.toml` |

```bash
git add astro.config.mjs wrangler.jsonc wrangler.build.jsonc
git add scripts/generate-wrangler-config.mjs
git add .github/workflows/deploy.yml
git add sentry.server.config.js .env.example README.md
git rm wrangler.toml
git commit -m "chore: migrate deployment from Pages to Workers"
```

---

### Commit 5: `feat: add blog content (8 articles)`

| File |
|------|
| `src/content/blog/amalan-sunnah-idul-adha.md` |
| `src/content/blog/cara-bijak-berdonasi.md` |
| `src/content/blog/keutamaan-10-hari-dzulhijjah.md` |
| `src/content/blog/metode-belajar-islam-interaktif.md` |
| `src/content/blog/panduan-zakat-fitrah.md` |
| `src/content/blog/pentingnya-tahfiz-alquran.md` |
| `src/content/blog/program-santunan-anak-yatim.md` |
| `src/content/blog/transparansi-donasi-asib.md` |

```bash
git add src/content/blog/*.md
git commit -m "feat: add 8 blog articles for SEO"
```

---

### Commit 6: `feat: add kegiatan articles (2 articles)`

| File |
|------|
| `src/content/kegiatan/kajian-pekanan-tafsir-juz30.md` |
| `src/content/kegiatan/laporan-beasiswa-anak-dhuafa.md` |

```bash
git add src/content/kegiatan/kajian-pekanan-tafsir-juz30.md \
  src/content/kegiatan/laporan-beasiswa-anak-dhuafa.md
git commit -m "feat: add kegiatan articles"
```

---

### Commit 7: `feat: add static images`

| File |
|------|
| `public/images/charity-contact.webp` |
| `public/logo-final.png` |
| `public/logo-yayasan.png` |

```bash
git add public/images/ public/logo-final.png public/logo-yayasan.png
git commit -m "feat: add static images"
```

---

### Commit 8: `refactor: update components, layouts, pages, and styles`

Domain: `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, `src/content/`, `tsconfig.json`, `package.json`, `bun.lock`

```bash
git add src/components/ src/layouts/ src/pages/ src/styles/
git add src/content.config.ts src/content/blog/*.md src/content/kegiatan/*.md
git add tsconfig.json package.json bun.lock
git commit -m "refactor: update components, layouts, pages, and styles"
```

⚠️ **Commit paling besar** — paling mungkin mengandung issue. Berisi:
- Perbaikan BaseHead, Container, Icon, BaseLayout
- Perbaikan blog pages (index + detail)
- Perbaikan kegiatan detail, donasi, kontak, tentang
- Edit konten blog (3 posts) dan kegiatan (3 posts)
- CSS refinements
- TypeScript config & dependency updates

---

### Commit 9: `docs: add gallery documentation`

| File |
|------|
| `GALERI_GOOGLE_DRIVE.md` |
| `KONVENSI_NAMA_FOLDER.md` |
| `PANDUAN_UPLOAD_FOTO_TIM_MEDIA.md` |

```bash
git add GALERI_GOOGLE_DRIVE.md KONVENSI_NAMA_FOLDER.md PANDUAN_UPLOAD_FOTO_TIM_MEDIA.md
git commit -m "docs: add gallery setup and usage guides"
```

---

## Urutan Eksekusi Lengkap

```bash
# ═══ 1. .gitignore ═══
# Edit .gitignore tambah entry rahasia + artifacts
git add .gitignore
git commit -m "chore: add sensitive files and build artifacts to .gitignore"

# ═══ 2. Gallery system ═══
git add src/lib/google-drive.ts src/data/galleries.ts
git add src/components/gallery/
git add src/pages/galeri/ src/pages/galeri-preview.astro src/pages/api/
git commit -m "feat: add Google Drive gallery system"

# ═══ 3. Gallery cache scripts ═══
git add scripts/
git commit -m "feat: add gallery cache scripts"

# ═══ 4. Deployment migration ═══
git add astro.config.mjs wrangler.jsonc wrangler.build.jsonc
git add scripts/generate-wrangler-config.mjs
git add .github/workflows/deploy.yml
git add sentry.server.config.js .env.example README.md
git rm wrangler.toml
git commit -m "chore: migrate deployment from Pages to Workers"

# ═══ 5. Blog content ═══
git add src/content/blog/*.md
git commit -m "feat: add 8 blog articles for SEO"

# ═══ 6. Kegiatan content ═══
git add src/content/kegiatan/kajian-pekanan-tafsir-juz30.md \
  src/content/kegiatan/laporan-beasiswa-anak-dhuafa.md
git commit -m "feat: add kegiatan articles"

# ═══ 7. Static assets ═══
git add public/images/ public/logo-final.png public/logo-yayasan.png
git commit -m "feat: add static images"

# ═══ 8. Source code fixes ═══
git add src/components/ src/layouts/ src/pages/ src/styles/
git add src/content.config.ts src/content/blog/*.md src/content/kegiatan/*.md
git add tsconfig.json package.json bun.lock
git commit -m "refactor: update components, layouts, pages, and styles"

# ═══ 9. Documentation ═══
git add GALERI_GOOGLE_DRIVE.md KONVENSI_NAMA_FOLDER.md PANDUAN_UPLOAD_FOTO_TIM_MEDIA.md
git commit -m "docs: add gallery setup and usage guides"
```

## Verifikasi

```bash
git log --oneline -15
git status  # nothing to commit, working tree clean
```

## Mapping Issue → Commit Sesi 2

| Issue | Cek Commit | File |
|-------|-----------|------|
| Galeri foto tidak muncul | Commit 2 | `google-drive.ts`, `galleries.ts` |
| Lightbox error | Commit 2 | `Lightbox.astro` |
| API like error | Commit 2 | `api/like/[slug].ts` |
| Gallery cache gagal | Commit 3 | `discover-and-cache-galleries.ts` |
| Build/deploy gagal | Commit 4 | `astro.config.mjs`, `deploy.yml` |
| Sentry error | Commit 4 | `sentry.server.config.js` |
| Blog content salah | Commit 5 | `src/content/blog/<file>.md` |
| Kegiatan content salah | Commit 6 | `src/content/kegiatan/<file>.md` |
| Gambar tidak muncul | Commit 7 | `public/images/` |
| CSS/style broken | Commit 8 | `global.css` |
| Layout broken | Commit 8 | `BaseLayout.astro` |
| Component error | Commit 8 | `ui/*.astro` |
| Dependencies issue | Commit 8 | `package.json`, `bun.lock` |
