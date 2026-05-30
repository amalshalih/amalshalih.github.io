# Dokumentasi Galeri Google Drive — Yayasan ASIB

> Panduan lengkap untuk Tim Engineering (PT Koneksi) dan Tim Media (Yayasan ASIB)
> dalam mengelola galeri foto dokumentasi kegiatan via Google Drive API.

---

## Daftar Isi

1. [Arsitektur Sistem](#arsitektur-sistem)
2. [Struktur File](#struktur-file)
3. [Setup Google Cloud (Tim Engineering)](#setup-google-cloud-tim-engineering)
4. [Setup Environment Variables (Tim Engineering)](#setup-environment-variables-tim-engineering)
5. [Mendaftarkan Galeri Baru (Tim Engineering)](#mendaftarkan-galeri-baru-tim-engineering)
6. [Upload Foto ke Google Drive (Tim Media)](#upload-foto-ke-google-drive-tim-media)
7. [Naming Convention Folder & File (Tim Media)](#naming-convention-folder--file-tim-media)
8. [Build & Deploy](#build--deploy)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                     Google Drive API                        │
│  (Service Account → Read-Only Access → Folder Images)       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              scripts/cache-gallery-photos.ts                │
│  (Build-time script: fetch image metadata from Drive)       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              src/data/cache/{slug}.json                     │
│  (Cached image data: IDs, URLs, dimensions, dates)          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              src/pages/galeri/[slug].astro                  │
│  (Static page: reads cache, renders masonry + lightbox)     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Pages (CDN)                         │
│  (Deployed static site: zero runtime API calls)             │
└─────────────────────────────────────────────────────────────┘
```

### Alur Kerja

1. **Tim Media** upload foto ke folder Google Drive yang sudah di-share
2. **Tim Engineering** daftarkan folder ID di `src/data/galleries.ts`
3. **Build process** menjalankan `cache-gallery-photos.ts` → fetch metadata dari Drive API
4. **Astro** generate halaman statis `/galeri/{slug}` dari cache JSON
5. **Deploy** ke Cloudflare Pages → halaman siap diakses publik

### Keamanan

- **Service Account** hanya punya akses `readonly` ke folder yang di-share
- **Credentials** disimpan di `.env` (tidak pernah di-commit ke git)
- **Build-time only** — tidak ada API call saat runtime, sehingga tidak ada latency atau rate limit di production
- **Cache JSON** berisi metadata (ID, URL, nama) — bukan file gambar itu sendiri

---

## Struktur File

```
src/
├── data/
│   ├── galleries.ts              # Registry: mapping slug → Drive folder ID
│   └── cache/                    # Auto-generated saat build
│       ├── keagamaan-idul-adha-2026.json
│       ├── sosial-santunan-ramadhan-2026.json
│       └── ...
├── lib/
│   └── google-drive.ts           # API client: list images, generate URLs
├── components/
│   └── gallery/
│       ├── Lightbox.astro        # Fullscreen viewer (zoom, swipe, keyboard)
│       └── MasonryGrid.astro     # Grid layout (Google Photos style)
├── pages/
│   ├── galeri.astro              # Halaman galeri utama (existing, tidak diubah)
│   └── galeri/
│       └── [slug].astro          # Dynamic route: halaman detail galeri
scripts/
└── cache-gallery-photos.ts       # Build script: fetch Drive → cache JSON
```

---

## Setup Google Cloud (Tim Engineering)

### Step 1: Buat Google Cloud Project

1. Buka https://console.cloud.google.com/
2. Login dengan akun Google yang akan digunakan
3. Klik dropdown project di header → **New Project**
4. Isi:
   - **Project name**: `ASIB Gallery` (atau nama lain yang deskriptif)
   - **Organization**: (pilih organisasi jika ada, atau "No organization")
   - **Location**: (biarkan default)
5. Klik **Create**
6. Tunggu project selesai dibuat (notifikasi akan muncul)

### Step 2: Aktifkan Google Drive API

1. Buka https://console.cloud.google.com/apis/library
2. Pastikan project yang aktif adalah project yang baru dibuat (cek di header)
3. Di search bar, ketik **"Google Drive API"**
4. Klik hasil **"Google Drive API"**
5. Klik tombol **Enable** (biru, di atas)
6. Tunggu hingga status berubah menjadi "API enabled"

### Step 3: Buat Service Account

1. Buka https://console.cloud.google.com/iam-admin/serviceaccounts
2. Pastikan project yang benar aktif di dropdown header
3. Klik **+ Create Service Account** (di atas)
4. **Step 1 — Service account details:**
   - **Service account name**: `asib-gallery-reader`
   - **Service account ID**: akan terisi otomatis (`asib-gallery-reader@...`)
   - **Description**: `Read-only access to ASIB Google Drive folders for gallery build`
5. Klik **Create and Continue**
6. **Step 2 — Grant this service account access to project:**
   - Klik dropdown **Select a role**
   - Cari **"Viewer"** → pilih **Basic → Viewer**
   - (Ini hanya untuk project-level access, bukan Drive folder access)
7. Klik **Continue**
8. **Step 3 — Grant users access to this service account:**
   - **Skip** (tidak perlu tambahkan user di sini)
9. Klik **Done**

### Step 4: Generate JSON Key

1. Buka https://console.cloud.google.com/iam-admin/serviceaccounts
2. Klik nama service account yang baru dibuat (`asib-gallery-reader@...`)
3. Pindah ke tab **Keys**
4. Klik **Add Key** → **Create new key**
5. Pilih **JSON** → klik **Create**
6. File JSON akan otomatis terdownload ke komputer
7. **Simpan file ini dengan aman** — file ini berisi private key yang tidak bisa di-download ulang

### Step 5: Dapatkan Client Email

1. Buka file JSON yang terdownload
2. Cari field `"client_email"`
3. Copy nilainya, contoh:
   ```
   asib-gallery-reader@asib-gallery-123456.iam.gserviceaccount.com
   ```
4. Email ini yang akan di-share ke folder Google Drive

---

## Setup Environment Variables (Tim Engineering)

### Step 1: Copy .env.example ke .env

```bash
cp .env.example .env
```

### Step 2: Isi GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY

1. Buka file JSON key yang terdownload dari Google Cloud
2. Copy **seluruh isi file** (dari `{` sampai `}`)
3. Paste ke `.env` sebagai value dari `GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY`:

```env
GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"asib-gallery-123456","private_key_id":"abc123...","private_key":"-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----\n","client_email":"asib-gallery-reader@asib-gallery-123456.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token"}'
```

> **Penting:**
> - Gunakan **single quotes** (`'...'`) untuk membungkus JSON
> - Pastikan tidak ada line break yang rusak — `\n` harus tetap sebagai karakter escape
> - Jangan commit file `.env` ke git (sudah ada di `.gitignore`)

### Step 3: Verifikasi JSON Valid

```bash
echo $GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY | jq .
```

Jika output-nya JSON yang terformat rapi, berarti valid. Jika error, cek lagi formatnya.

### Step 4: Test Koneksi

```bash
bun run gallery:cache
```

Jika berhasil, akan muncul output seperti:
```
📸 Fetching photos for "keagamaan-idul-adha-2026"...
✅ Cached 45 images for "keagamaan-idul-adha-2026"
```

Jika error, cek [Troubleshooting](#troubleshooting).

---

## Mendaftarkan Galeri Baru (Tim Engineering)

### Step 1: Dapatkan Folder ID dari Tim Media

Tim Media akan memberikan:
- Nama folder Google Drive
- URL folder (atau langsung Folder ID)

Contoh URL: `https://drive.google.com/drive/folders/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV`
Folder ID: `1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV`

### Step 2: Tambahkan Entry di `src/data/galleries.ts`

Buka file `src/data/galleries.ts`, tambahkan object baru ke array `GALLERIES`:

```typescript
{
  slug: 'keagamaan-idul-adha-2026',
  title: 'Idul Adha 1447 H — Penyembelihan Hewan Kurban',
  description: 'Dokumentasi kegiatan penyembelihan hewan kurban Idul Adha 1447 H di lingkungan Yayasan ASIB Bantul.',
  folderId: '1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV',
  category: 'keagamaan',
  eventDate: '2026-05-27',
  published: true,
}
```

### Step 3: Tentukan Slug

**Format slug**: `{kategori}-{event}-{tahun}`

| Kategori | Contoh Event | Slug |
|----------|--------------|------|
| `pendidikan` | Wisuda Tahfiz | `pendidikan-wisuda-tahfiz-2026` |
| `keagamaan` | Idul Adha | `keagamaan-idul-adha-2026` |
| `sosial` | Santunan Ramadhan | `sosial-santunan-ramadhan-2026` |
| `umum` | Peringatan Hari Gizi | `umum-peringatan-hari-gizi-2026` |

**Aturan slug:**
- Lowercase semua
- Gunakan `-` sebagai pemisah (bukan `_` atau spasi)
- Hindari karakter khusus (`&`, `#`, `!`, dll)
- Maksimal 3-4 segmen agar URL tetap readable

### Step 4: Build & Deploy

```bash
bun run build
```

Halaman baru akan tersedia di `/galeri/{slug}`.

---

## Upload Foto ke Google Drive (Tim Media)

### Step 1: Share Folder ke Service Account

1. Buka Google Drive → klik kanan folder → **Share**
2. Paste email service account (dari Tim Engineering):
   ```
   asib-gallery-reader@asib-gallery-123456.iam.gserviceaccount.com
   ```
3. Set permission ke **Viewer** (bukan Editor)
4. Klik **Share**

### Step 2: Upload Foto

1. Buka folder yang sudah di-share
2. Upload foto dokumentasi (drag & drop atau **New → File upload**)
3. Tunggu upload selesai

### Step 3: Verifikasi

1. Pastikan foto bisa dibuka (klik → preview)
2. Pastikan tidak ada foto yang corrupt atau blur
3. Pastikan nama file deskriptif (lihat [Naming Convention](#naming-convention-folder--file-tim-media))

### Step 4: Informasikan ke Tim Engineering

Beritahu Tim Engineering:
- **Nama folder** Google Drive
- **URL folder** (atau Folder ID)
- **Tanggal event** (untuk grouping di galeri)
- **Kategori** (pendidikan / keagamaan / sosial / umum)
- **Judul galeri** (untuk ditampilkan di website)

Contoh pesan:
```
Folder: Idul Adha 1447 H
URL: https://drive.google.com/drive/folders/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV
Tanggal: 27 Mei 2026
Kategori: Keagamaan
Judul: Idul Adha 1447 H — Penyembelihan Hewan Kurban
Deskripsi: Dokumentasi kegiatan penyembelihan hewan kurban...
```

---

## Naming Convention Folder & File (Tim Media)

### Folder Google Drive

**Format**: `{Kategori} - {Nama Event} - {Tanggal}`

Contoh:
```
Keagamaan - Idul Adha 1447 H - 27 Mei 2026
Sosial - Santunan Ramadhan 1447 H - 15 Maret 2026
Pendidikan - Wisuda Tahfiz Angkatan 3 - 10 Februari 2026
```

### File Foto

**Format**: `{Event}_{YYYYMMDD}_{Sequence}.{ext}`

Contoh:
```
idul-adha_20260527_001.jpg
idul-adha_20260527_002.jpg
santunan-ramadhan_20260315_001.jpg
wisuda-tahfiz_20260210_001.jpg
```

**Aturan:**
- Gunakan `_` sebagai pemisah dalam nama file
- Sequence 3 digit (`001`, `002`, ..., `999`)
- Format tanggal: `YYYYMMDD` (tahun-bulan-tanggal)
- Ekstensi: `.jpg`, `.jpeg`, `.png`, `.webp`
- Hindari: spasi, karakter khusus (`&`, `#`, `!`, `@`), huruf kapital di tengah nama

**Contoh yang BENAR:**
```
idul-adha_20260527_001.jpg
santunan-ramadhan_20260315_015.png
```

**Contoh yang SALAH:**
```
Idul Adha #1.jpg
santunan ramadhan (1).jpeg
IMG_20260527_123456.jpg
```

### Subfolder dalam Folder Utama (Opsional)

Jika foto banyak, bisa dibagi per sesi:
```
Keagamaan - Idul Adha 1447 H - 27 Mei 2026/
├── 01-Penyembelihan/
│   ├── idul-adha_20260527_001.jpg
│   └── idul-adha_20260527_002.jpg
├── 02-Distribusi/
│   ├── idul-adha_20260527_003.jpg
│   └── idul-adha_20260527_004.jpg
└── 03-Kebersamaan/
    ├── idul-adha_20260527_005.jpg
    └── idul-adha_20260527_006.jpg
```

Sistem akan membaca **semua foto** dari folder utama dan subfolder-nya secara otomatis.

---

## Build & Deploy

### Development

```bash
bun run dev
```

Server berjalan di `http://localhost:4321` (atau port lain jika 4321 sedang dipakai).

### Build Production

```bash
bun run build
```

Ini akan:
1. Menjalankan `cache-gallery-photos.ts` → fetch foto dari Drive API
2. Generate halaman statis di folder `dist/`

### Build Tanpa Gallery Cache

```bash
bun run build:skip-gallery
```

Gunakan ini jika:
- Credentials belum diset
- Hanya ingin test halaman tanpa foto
- Build di CI/CD yang tidak punya akses Drive

### Preview Build

```bash
bun run preview
```

Menjalankan server lokal untuk melihat hasil build.

### Deploy ke Cloudflare Pages

```bash
bunx wrangler pages deploy dist/ --project-name=amalshalih
```

Atau via GitHub Actions (auto-deploy saat push ke `main`).

---

## Troubleshooting

### Error: `GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY env var is not set`

**Penyebab:** File `.env` belum dibuat atau variable belum diisi.

**Solusi:**
```bash
cp .env.example .env
# Edit .env, isi GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY dengan JSON key
```

### Error: `invalid_grant` atau `unauthorized_client`

**Penyebab:** Service Account belum diaktifkan atau Drive API belum enabled.

**Solusi:**
1. Buka https://console.cloud.google.com/apis/library
2. Pastikan **Google Drive API** statusnya "Enabled"
3. Cek service account di https://console.cloud.google.com/iam-admin/serviceaccounts
4. Pastikan statusnya "Enabled"

### Error: `File not found` atau `404` saat fetch folder

**Penyebab:** Folder Google Drive belum di-share ke email Service Account.

**Solusi:**
1. Buka folder di Google Drive
2. Klik **Share**
3. Paste email service account (`client_email` dari JSON key)
4. Set permission ke **Viewer**
5. Klik **Share**

### Error: `JSON parse error` atau `Unexpected token`

**Penyebab:** Format JSON di `.env` tidak valid (biasanya karena line break yang rusak).

**Solusi:**
```bash
# Minify JSON key
cat service-account.json | jq -c .
# Copy output, paste ke .env dengan single quotes
```

### Foto tidak muncul di galeri

**Kemungkinan penyebab:**
1. Folder belum di-share ke Service Account
2. Folder ID salah di `galleries.ts`
3. Tidak ada foto di folder (atau semua foto bukan format gambar)
4. Cache belum di-generate

**Solusi:**
```bash
# Test fetch manual
bun run gallery:cache
# Cek output — apakah ada error?
# Cek folder src/data/cache/ — apakah file JSON sudah terbuat?
```

### Build gagal di Cloudflare Pages

**Kemungkinan penyebab:** Environment variables tidak ter-set di Cloudflare Dashboard.

**Solusi:**
1. Buka https://dash.cloudflare.com/ → Pages → project → Settings → Environment variables
2. Tambahkan variable:
   - **Variable name**: `GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY`
   - **Value**: (isi dengan JSON key, pastikan valid)
   - **Environment**: Production (dan Preview jika perlu)
3. Re-deploy

### Gambar lambat loading

**Penyebab:** Google Drive thumbnail/full URL bisa lambat jika tidak di-cache oleh CDN.

**Solusi:**
- Gunakan `loading="lazy"` di `<img>` (sudah default di MasonryGrid)
- Pertimbangkan untuk copy foto ke `public/` folder jika performa kritis
- Gunakan Cloudflare CDN (sudah default jika deploy ke Pages)

---

## FAQ

### Q: Apakah foto disimpan di server kita?

**A:** Tidak. Foto tetap di Google Drive. Website hanya menyimpan **metadata** (ID, URL, nama) di file JSON cache. Saat user membuka galeri, foto di-load langsung dari Google Drive CDN.

### Q: Berapa lama foto bisa diakses?

**A:** Selama folder Google Drive tidak dihapus dan Service Account masih punya akses. Foto tidak akan expired otomatis.

### Q: Bisa upload foto setelah galeri sudah publish?

**A:** Bisa. Upload foto baru ke folder Google Drive, lalu jalankan `bun run build` lagi. Foto baru akan otomatis muncul di galeri.

### Q: Apakah ada batasan jumlah foto?

**A:** Google Drive API punya rate limit (sekitar 1000 requests/100 detik untuk Service Account). Untuk galeri dengan ratusan foto, build time mungkin lebih lama. Tidak ada batasan hard limit dari sisi website.

### Q: Bisa hapus foto dari galeri tanpa hapus dari Drive?

**A:** Bisa. Hapus entry galeri dari `src/data/galleries.ts` atau set `published: false`. Foto tetap ada di Drive tapi tidak muncul di website.

### Q: Apakah foto bisa di-download oleh pengunjung?

**A:** Ya, karena foto di-load dari Google Drive CDN. Jika ingin membatasi, pertimbangkan untuk menggunakan signed URLs atau menyimpan foto di server sendiri.

### Q: Bagaimana jika Google Drive API down?

**A:** Karena kita menggunakan cache JSON di build time, website tetap bisa menampilkan foto selama cache masih valid. Hanya proses build baru yang akan gagal jika API down.

### Q: Bisa gunakan Google Photos (bukan Drive)?

**A:** Tidak langsung. Google Photos API berbeda dengan Drive API. Jika tim media menggunakan Google Photos, perlu export foto ke folder Google Drive terlebih dahulu.

---

## Kontak

| Tim | Kontak | Role |
|-----|--------|------|
| **Engineering (PT Koneksi)** | Tim developer | Setup credentials, build, deploy |
| **Media (Yayasan ASIB)** | Tim media | Upload foto, naming, informasikan ke engineering |

Untuk pertanyaan teknis, hubungi Tim Engineering.
Untuk pertanyaan konten/foto, hubungi Tim Media.
