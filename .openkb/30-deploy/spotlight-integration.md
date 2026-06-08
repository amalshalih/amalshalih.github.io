# Spotlight Debug Overlay — Integrasi & Panduan

> **Dibuat:** 28 Mei 2026
> **Updated:** 7 Juni 2026
> **Package:** `@spotlightjs/astro` v3.2.6
> **Tujuan:** Dokumen ini menjelaskan integrasi Spotlight debug overlay ke dalam project website Yayasan ASIB, untuk memudahkan debugging dan development oleh tim IT ASIB maupun tim teknis PT Koneksi Jaringan Indonesia.
> **Status:** ✅ **ACTIVE** — Development tooling

---

## Daftar Isi

1. [Apa Itu Spotlight?](#1-apa-itu-spotlight)
2. [Cara Kerja](#2-cara-kerja)
3. [Instalasi](#3-instalasi)
4. [Konfigurasi](#4-konfigurasi)
5. [Cara Menggunakan](#5-cara-menggunakan)
6. [Fitur & Tampilan](#6-fitur--tampilan)
7. [Integrasi dengan Sentry (Opsional)](#7-integrasi-dengan-sentry-opsional)
8. [Troubleshooting](#8-troubleshooting)
9. [Referensi](#9-referensi)

---

## 1. Apa Itu Spotlight?

**Spotlight** adalah debug overlay untuk Astro yang dikembangkan oleh tim Sentry. Ia menambahkan lapisan debug di sisi kiri browser saat menjalankan `astro dev`, menampilkan informasi _real-time_ tentang:

- **Console logs** — Semua log `console.log()`, `console.warn()`, `console.error()` dari server maupun client
- **Network requests** — Semua request HTTP beserta durasi, status, dan payload
- **Errors** — Error yang terjadi di server-side (SSR) maupun client-side
- **Astro Islands** — Informasi tentang komponen interaktif (islands) di halaman
- **Performance** — Tracing data, breadcrumbs, dan timing informasi

> **Spotlight HANYA aktif di mode development (`astro dev`).** Tidak ada kode Spotlight yang masuk ke production build. Zero impact pada performa production.

---

## 2. Cara Kerja

```
Browser Anda (localhost:4321)
│
├── Halaman Astro (static HTML)
│
└── Spotlight Overlay (dev only)
    ├── Console Panel   ← Menangkap log dari server & client
    ├── Network Panel   ← Memonitor semua HTTP request
    ├── Errors Panel    ← Menangkap exceptions
    └── Info Panel      ← Metadata halaman, islands, dll
```

Spotlight bekerja sebagai **Astro integration** yang inject sebuah debug panel ke halaman saat `astro dev` berjalan. Panel ini tidak di-inject saat `astro build` — benar-benar development-only.

### Perbedaan dengan Browser DevTools

| Aspek | Browser DevTools | Spotlight |
|-------|------------------|-----------|
| Console | ✅ Client-side only | ✅ Client + Server-side |
| Network | ✅ Client-side only | ✅ Client + Server-side |
| Errors | ✅ Client-side only | ✅ Client + Server + Build |
| Astro Islands | ❌ | ✅ |
| Server Response | ❌ | ✅ |
| Production | ✅ | ❌ (dev only) |

**Keunggulan utama Spotlight:** Ia bisa menangkap log dan error dari **server-side Astro** (SSR/static generation) yang tidak terlihat di browser DevTools biasa.

---

## 3. Instalasi

### 3.1. Package Manager

Project ini menggunakan **Bun** sebagai package manager.

```bash
bun add @spotlightjs/astro
```

Output yang diharapkan:
```
bun add v1.3.2
installed @spotlightjs/astro@3.2.6
```

### 3.2. Verifikasi Instalasi

Cek di `package.json`:

```bash
bun pm ls @spotlightjs/astro
```

Hasil:
```
@spotlightjs/astro@3.2.6
```

---

## 4. Konfigurasi

### 4.1. Tambahkan Integration ke `astro.config.mjs`

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import spotlightjs from '@spotlightjs/astro';

export default defineConfig({
	site: 'https://amalshalih.or.id',
	integrations: [
		mdx(),
		sitemap(),
		spotlightjs(),       // ← Cukup dipanggil tanpa options
		sanity({
			projectId: '9yj0dq9v',
			dataset: 'production',
			useCdn: false,
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
```

**Catatan:** Urutan integration tidak terlalu penting untuk Spotlight, tapi jika digunakan bersama Sentry, `sentry()` harus dipanggil **sebelum** `spotlightjs()`.

### 4.2. Verifikasi Konfigurasi

```bash
bun run build
```

Pastikan tidak ada error. Spotlight tidak mempengaruhi build — ia akan otomatis aktif saat development.

---

## 5. Cara Menggunakan

### 5.1. Menjalankan Development Server

```bash
bun run dev
```

### 5.2. Membuka Spotlight

Spotlight akan muncul secara otomatis sebagai overlay di sisi kiri browser saat halaman dimuat:

1. Buka `http://localhost:4321` di browser
2. Spotlight overlay akan muncul di sisi kiri layar
3. Jika tidak muncul, klik ikon Spotlight di sudut kanan bawah halaman (atau tekan `Ctrl+Shift+S`)

### 5.3. Navigasi Panel

| Panel | Shortcut | Fungsi |
|-------|----------|--------|
| **Console** | `C` | Melihat semua log, warn, error dari server & client |
| **Network** | `N` | Melihat HTTP requests, response time, status code |
| **Errors** | `E` | Melihat exceptions yang terjadi |
| **Info** | `I` | Informasi halaman, Astro islands, metadata |

### 5.4. Contoh Skenario Debugging

#### Debug Server-side Log
```astro
---
// Di halaman Astro (.astro frontmatter)
console.log('Server-side data:', { stats, programs });
console.warn('Sanity unavailable, using fallback data');
---
```

Di Spotlight, log ini akan muncul di panel **Console** — sesuatu yang tidak bisa ditangkap oleh browser DevTools biasa.

#### Debug Network Request
```astro
---
const sanityData = await getProgramList();
---
```

Spotlight akan menampilkan request ke Sanity di panel **Network** dengan durasi, status, dan response body.

#### Debug Error
```astro
---
try {
  const data = await fetchSomething();
} catch (error) {
  console.error('Failed to fetch:', error);
  // Error akan muncul di Console + Errors panel Spotlight
}
---
```

---

## 6. Fitur & Tampilan

### 6.1. Console Panel

- Menampilkan semua `console.log`, `console.warn`, `console.error`, `console.info` dari:
  - Server-side (frontmatter Astro)
  - Client-side (scripts, event handlers)
- Setiap entry menunjukkan:
  - **Timestamp** — Kapan log terjadi
  - **Level** — log, warn, error, info
  - **Source** — Server atau Client
  - **Message** — Isi log
- Bisa di-filter berdasarkan level

### 6.2. Network Panel

- Menampilkan semua HTTP requests:
  - Sanity CMS API calls
  - Image requests
  - Form submissions
  - External API calls
- Setiap request menunjukkan:
  - **Method** — GET, POST, dll
  - **URL** — Endpoint yang dipanggil
  - **Status** — 200, 404, 500, dll
  - **Duration** — Waktu response dalam ms
  - **Timeline** — Kapan request terjadi

### 6.3. Errors Panel

- Menampilkan exceptions:
  - Runtime errors
  - Promise rejections
  - Build-time warnings
- Setiap error menunjukkan:
  - **Message** — Deskripsi error
  - **Stack trace** — Lokasi error di kode
  - **Environment** — Server atau Client

### 6.4. Tampilan Visual

```
┌─────────────────────────────────────────────┐
│  Spotlight (collapsed) ← toggle dengan icon │
│                                              │
│  [Console] [Network] [Errors] [Info]         │
│                                              │
│  ┌─ Console ──────────────────────────────┐  │
│  │ ✓ [Server] Page data loaded            │  │
│  │ ⚠ [Server] Sanity unavailable          │  │
│  │ ℹ [Client] Button clicked              │  │
│  │ ✗ [Server] Error fetching programs     │  │
│  └──────────────────────────────────────────┘  │
│                                              │
│  Minimize │ Close                            │
└─────────────────────────────────────────────┘
```

---

## 7. Integrasi dengan Sentry (Opsional)

Spotlight dapat dikombinasikan dengan **Sentry** untuk error tracking production. Namun untuk project ini, Sentry **tidak wajib** — Spotlight sudah bisa digunakan standalone.

### Jika Ingin Menambahkan Sentry

```bash
bun add @sentry/astro
```

Konfigurasi di `astro.config.mjs`:

```js
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';

export default defineConfig({
  integrations: [
    sentry({
      dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
      // environment: 'development', // opsional
    }),
    spotlightjs(),  // Harus SETELAH sentry()
  ],
});
```

**Keuntungan dengan Sentry:**
- Error tracking production
- Source maps upload
- Performance monitoring
- Integration dengan Sentry dashboard

**Kapan perlu Sentry:**
- Jika website sudah live di production
- Jika ingin melacak error dari pengguna nyata
- Jika ada budget/logistic untuk setup akun Sentry

**Saat ini**: Project menggunakan Spotlight **standalone** tanpa Sentry, karena:
- Website statis (output: static)
- Error di static site relatif minim
- Tim bisa memanfaatkan Spotlight untuk development debugging

---

## 8. Troubleshooting

### 8.1. Spotlight Tidak Muncul

| Penyebab | Solusi |
|----------|--------|
| Lupa `bun run dev` (production mode) | Pastikan menjalankan `bun run dev`, bukan `bun run preview` |
| Cache browser | Clear cache atau buka tab incognito |
| Extension blocker | Nonaktifkan extension yang mungkin memblock overlay |
| Port berbeda | Pastikan akses via port yang benar (default: 4321) |

### 8.2. Console Panel Kosong

Spotlight hanya menangkap log yang terjadi **setelah halaman dimuat**. Jika ada log di frontmatter yang terjadi sebelum render selesai, pastikan:
- Halaman di-refresh setelah Spotlight muncul
- Log menggunakan `console.log()` standar (bukan custom logger)

### 8.3. Network Panel Tidak Menampilkan Request

Pastikan request terjadi setelah halaman dimuat. Untuk request server-side (di frontmatter):
- Request akan muncul saat halaman di-render
- Refresh halaman jika perlu

### 8.4. Error Saat Build

Spotlight tidak akan mempengaruhi build. Jika ada error build setelah instalasi:
```bash
# Cek versi
bun pm ls @spotlightjs/astro

# Cek config di astro.config.mjs — pastikan sintaks benar
```

### 8.5. Performa Development Melambat

Spotlight menambah overhead minimal saat development. Jika terasa lambat:
- Tutup panel Spotlight (klik icon toggle)
- Atau disable sementara dengan mengkomentari `spotlightjs()` di config

---

## 9. Referensi

| Resource | URL |
|----------|-----|
| NPM Package | [npmjs.com/package/@spotlightjs/astro](https://www.npmjs.com/package/@spotlightjs/astro) |
| GitHub Repo | [github.com/getsentry/spotlight](https://github.com/getsentry/spotlight) |
| Dokumentasi Resmi | [spotlightjs.com/docs](https://spotlightjs.com/docs/) |
| Sentry for Astro | [docs.sentry.io/platforms/javascript/guides/astro](https://docs.sentry.io/platforms/javascript/guides/astro/) |
| Astro Spotlight Guide | [docs.astro.build/en/guides/backend/sentry](https://docs.astro.build/en/guides/backend/sentry/) |

---

## Appendix A: File yang Terkena Dampak

| File | Perubahan |
|------|-----------|
| `package.json` | Dependency `@spotlightjs/astro@3.2.6` ditambahkan |
| `bun.lock` | Lockfile updated |
| `astro.config.mjs` | Import + integration `spotlightjs()` ditambahkan |
| `.openkb/30-deploy/spotlight-integration.md` | Dokumen ini (baru) |

## Appendix B: Quick Start (untuk Developer Baru)

```bash
# 1. Clone repo
git clone <repo-url>
cd yayasan-amal-shalih-insan-bantul

# 2. Install dependencies
bun install

# 3. Jalankan dev server
bun run dev

# 4. Buka browser → Spotlight otomatis muncul di kiri layar
#    Tekan Ctrl+Shift+S untuk toggle overlay
```

---

*Dokumen ini diperuntukkan bagi tim IT Yayasan ASIB dan tim teknis PT Koneksi Jaringan Indonesia.*
*Terakhir diperbarui: 7 Juni 2026*
