# Monitoring & Analytics — Overview Komprehensif

> **Dibuat:** 19 Juni 2026  
> **Status:** ✅ Production Live  
> **Related:**  
> - `.openkb/10-arsitektur/GA4-IMPLEMENTATION-STRATEGY.md` — Deep dive GA4 vs Partytown  
> - `.openkb/10-arsitektur/SENTRY_SOURCE_MAP_UPLOAD.md` — Dual bundle source map behavior  
> - `.openkb/30-deploy/spotlight-integration.md` — Debug overlay usage  
> - `.openkb/10-arsitektur/CLEAN_CONFIGURATION_SUMMARY.md` — Cleanup history & CSP consolidation  

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Arsitektur Monitoring](#2-arsitektur-monitoring)
3. [Tool #1: Sentry (Error Tracking)](#3-tool-1-sentry-error-tracking)
4. [Tool #2: Google Analytics 4 (GA4)](#4-tool-2-google-analytics-4-ga4)
5. [Tool #3: OpenPanel (Privacy-First Analytics)](#5-tool-3-openpanel-privacy-first-analytics)
6. [Tool #4: DebugBear (Real User Monitoring)](#6-tool-4-debugbear-real-user-monitoring)
7. [Tool #5: Ahrefs (SEO Analytics)](#7-tool-5-ahrefs-seo-analytics)
8. [Tool #6: Web Vitals (Performance Monitoring)](#8-tool-6-web-vitals-performance-monitoring)
9. [Tool #7: Global Error Handler (Client-Side)](#9-tool-7-global-error-handler-client-side)
10. [Tool #8: Service Worker (Offline/Caching)](#10-tool-8-service-worker-offlinecaching)
11. [Tool #9: Spotlight (Development Debugger)](#11-tool-9-spotlight-development-debugger)
12. [Content Security Policy (CSP)](#12-content-security-policy-csp)
13. [Dev vs Prod — Strategi Spesifik per Tool](#13-dev-vs-prod--strategi-spesifik-per-tool)
14. [Troubleshooting & FAQ](#14-troubleshooting--faq)
15. [Referensi Cepat](#15-referensi-cepat)

---

## 1. Ringkasan Eksekutif

Website Yayasan ASIB menggunakan **9 tool monitoring/analytics** yang saling melengkapi:

| # | Tool | Fungsi | Load di Dev? | Load di Prod? | Inisialisasi |
|---|------|--------|:---:|:---:|---|
| 1 | **Sentry** | Error tracking (client + server) | ❌ | ✅ | `astro.config.mjs` + `sentry.client/server.config.js` |
| 2 | **GA4** | Page views, user behavior | ❌ | ✅ | `BaseHead.astro` — guarded `import.meta.env.PROD` |
| 3 | **OpenPanel** | Privacy-first analytics | ❌ | ✅ | `BaseHead.astro` — guarded `import.meta.env.PROD` |
| 4 | **DebugBear** | RUM — Core Web Vitals | ❌ | ✅ | `BaseHead.astro` — guarded `import.meta.env.PROD` |
| 5 | **Ahrefs** | SEO analytics | ✅ | ✅ | `BaseLayout.astro` — **tidak** diguard |
| 6 | **Web Vitals** | Performance metrics (console) | ✅ | ✅ (console) | `BaseLayout.astro` — client script |
| 7 | **Error Handler** | Global error catching | ✅ | ✅ | `BaseLayout.astro` — client script |
| 8 | **Service Worker** | Offline support, caching | ✅ | ✅ | `BaseHead.astro` |
| 9 | **Spotlight** | Debug overlay (Sentry sidecar) | ✅ | ❌ | `astro.config.mjs` — dev only |

**Poin penting:**
- Setiap tool punya strategi dev/prod **berbeda** — tidak ada pendekatan seragam
- Sentry, GA4, OpenPanel, DebugBear: **hanya di production** (diguard `import.meta.env.PROD`)
- Ahrefs: **dimuat di semua environment** (inherent ignore localhost)
- Web Vitals & Error Handler: **dimuat di semua environment** (logic internal yang bedakan)
- Semua domain tool terdaftar di **CSP** (2 tempat: `middleware.ts` + `BaseHead.astro meta tag`)

---

## 2. Arsitektur Monitoring

### 2.1 Diagram Alur Data

```
Browser (Client)
│
├── Sentry (client)
│   └── Error → sentry.io (via @sentry/astro)
│
├── GA4
│   └── Page view → google-analytics.com (via gtag.js)
│
├── OpenPanel
│   └── Screen view, clicks → api.openpanel.dev (via OpenPanelComponent)
│
├── DebugBear
│   └── RUM metrics → cdn.debugbear.com (via sampling script)
│
├── Ahrefs
│   └── SEO data → analytics.ahrefs.com (via analytics.js)
│
├── Web Vitals
│   └── LCP, INP, CLS, FCP, TTFB → console.log (via web-vitals library)
│
├── Error Handler
│   ├── window.onerror → Sentry (prod) / console (dev)
│   └── unhandledrejection → Sentry (prod) / console (dev)
│
└── Service Worker
    └── Cache strategies → Workbox (via sw.ts)

Cloudflare Workers (Server)
│
└── Sentry (server)
    └── SSR errors → sentry.io (via @sentry/cloudflare)
```

### 2.2 Dimana Tool-Tool Ini Dikonfigurasi

```yaml
File                              Tools
───                               ─────
astro.config.mjs:                Sentry integration, Spotlight integration
sentry.client.config.js:         Sentry client DSN, environment, tracesSampleRate
sentry.server.config.js:         Sentry server DSN, environment, tracesSampleRate
src/components/BaseHead.astro:   CSP meta tag, GA4, OpenPanel, DebugBear, Service Worker
src/layouts/BaseLayout.astro:    Ahrefs, JSON-LD, Web Vitals init, Error Handler init
src/lib/web-vitals.ts:           Core Web Vitals monitoring (LCP, INP, CLS, FCP, TTFB)
src/lib/error-handler.ts:        Global error catching, window.onerror, unhandledrejection
src/lib/toast-utils.ts:          Toast UI untuk user-facing error messages
src/middleware.ts:               HTTP headers CSP (Enforcement + Report-Only)
public/sw.ts:                    Service Worker logic (Workbox)
```

---

## 3. Tool #1: Sentry (Error Tracking)

### 3.1 Deskripsi

Sentry adalah **error tracking** yang menangkap exception di client (browser) dan server (Cloudflare Workers SSR). Memberikan stack trace, breadcrumbs, dan context untuk debugging.

### 3.2 Lokasi File

| File | Fungsi |
|------|--------|
| `astro.config.mjs` | Integrasi Sentry Astro plugin |
| `sentry.client.config.js` | Inisialisasi Sentry untuk browser |
| `sentry.server.config.js` | Inisialisasi Sentry untuk Cloudflare Workers |
| `.env.example` | `SENTRY_AUTH_TOKEN` untuk source maps |

### 3.3 Dev vs Prod

| Environment | Load? | Perilaku |
|-------------|:-----:|----------|
| **Dev** (`astro dev`) | ❌ | Tidak di-inisialisasi sama sekali. Spotlight sebagai gantinya. |
| **Prod** (`astro build`) | ✅ | Full init + source map upload. |

### 3.4 Dual Bundle Source Maps

> **Detail lengkap:** `.openkb/10-arsitektur/SENTRY_SOURCE_MAP_UPLOAD.md`

Sentry meng-upload source maps **2 kali** saat build production:
1. **Client Bundle** (~108 files) — browser JavaScript (islands, client scripts)
2. **Server Bundle** (~112 files) — Workers SSR runtime

**Ini BUKAN bug.** Ini perilaku yang benar karena Astro SSR menghasilkan 2 bundle terpisah dengan runtime context berbeda.

### 3.5 Kode Inisialisasi

**sentry.client.config.js:**
```js
Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.PROD ? 'production' : 'development',
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
})
```

**sentry.server.config.js:**
```js
Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.PROD ? 'production' : 'development',
  tracesSampleRate: 1.0,
})
```

### 3.6 Integration di astro.config.mjs

```js
sentry({
  project: 'amalshalih',
  org: 'yayasan-amal-shalih-insan-bant',
  authToken: process.env.SENTRY_AUTH_TOKEN,
})
```

### 3.7 CSP Requirements

```
script-src:  https://*.sentry.io
connect-src: https://*.ingest.us.sentry.io
```

---

## 4. Tool #2: Google Analytics 4 (GA4)

### 4.1 Deskripsi

GA4 adalah **analytics utama** untuk melacak page views, user behavior, dan konversi. Implementasi menggunakan **Traditional script** (bukan Partytown) untuk kompatibilitas dengan Google Tag Assistant.

### 4.2 Dev vs Prod

| Environment | Load? | Alasan |
|-------------|:-----:|--------|
| **Dev** | ❌ | Menghindari kontaminasi data analytics dengan traffic development |
| **Prod** | ✅ | Data akurat hanya dari pengguna nyata |

### 4.3 Kode

**Lokasi:** `src/components/BaseHead.astro` (line 268-282)

```astro
{import.meta.env.PROD && (
  <>
    <script is:inline async src="https://www.googletagmanager.com/gtag/js?id=G-L3WQTPSJGN"></script>
    <script is:inline>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-L3WQTPSJGN', {
        anonymize_ip: true,
        send_page_view: true
      });
    </script>
  </>
)}
```

### 4.4 Konfigurasi

| Parameter | Nilai |
|-----------|-------|
| Measurement ID | `G-L3WQTPSJGN` |
| IP Anonymization | ✅ `anonymize_ip: true` |
| Page View Auto-tracking | ✅ `send_page_view: true` |

### 4.5 Keputusan Arsitektur: Traditional vs Partytown

> **Detail lengkap:** `.openkb/10-arsitektur/GA4-IMPLEMENTATION-STRATEGY.md`

| Aspek | Traditional ✅ (Dipilih) | Partytown ❌ |
|-------|:-----:|:-----:|
| Google Tag Assistant detect | 100% | Tidak terdeteksi |
| TBT impact | +100ms | Minimal |
| FID impact | +20ms | Minimal |
| Complexity | Rendah | Tinggi (Web Worker) |

**Keputusan:** Traditional — prioritaskan **detectability** dibanding optimasi performa minor.

### 4.6 CSP Requirements

```
script-src:  https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com
img-src:     https://www.google-analytics.com https://www.google.com
connect-src: https://www.google-analytics.com https://stats.g.doubleclick.net
```

---

## 5. Tool #3: OpenPanel (Privacy-First Analytics)

### 5.1 Deskripsi

OpenPanel adalah **analytics alternatif** yang privacy-first (tanpa cookie, tanpa fingerprinting). Digunakan sebagai **complimentary** ke GA4 — memberikan data yang tidak bergantung pada cookie consent.

### 5.2 Dev vs Prod

| Environment | Load? | Alasan |
|-------------|:-----:|--------|
| **Dev** | ❌ | Sama seperti GA4 — hindari kontaminasi data |
| **Prod** | ✅ | Hanya data pengguna nyata |

### 5.3 Kode

**Lokasi:** `src/components/BaseHead.astro` (line 284-295)

```astro
{import.meta.env.PROD && (
  <>
    <OpenPanelComponent
      clientId="fb2fde50-e95a-4707-b6c7-3938c8b12b5f"
      trackScreenViews={true}
      trackOutgoingLinks={true}
      trackAttributes={true}
      globalProperties={{
        environment: 'production',
        domain: 'amalshalih.or.id'
      }}
    />
  </>
)}
```

### 5.4 Fitur yang Diaktifkan

| Fitur | Status |
|-------|:------:|
| Screen Views | ✅ `trackScreenViews: true` |
| Outgoing Links | ✅ `trackOutgoingLinks: true` |
| Button Clicks | ✅ `trackAttributes: true` |

### 5.5 CSP Requirements

```
script-src:  https://openpanel.dev
connect-src: https://api.openpanel.dev
```

---

## 6. Tool #4: DebugBear (Real User Monitoring)

### 6.1 Deskripsi

DebugBear adalah **RUM (Real User Monitoring)** yang mengukur Core Web Vitals dan performa dari perspektif pengguna nyata. Menggunakan **sampling** — tidak semua pengguna di-track.

### 6.2 Dev vs Prod

| Environment | Load? | Alasan |
|-------------|:-----:|--------|
| **Dev** | ❌ | Sampling hanya berguna untuk data produksi |
| **Prod** | ✅ | 1% sampling (100% - 99% presampling) |

### 6.3 Kode

**Lokasi:** `src/components/BaseHead.astro` (line 299-304)

```astro
{import.meta.env.PROD && (
  <script is:inline>
    (function(){var dbpr=100;if(Math.random()*100>100-dbpr){var d="dbbRum",w=window,o=document,a=addEventListener,scr=o.createElement("script");scr.async=!0;w[d]=w[d]||[];w[d].push(["presampling",dbpr]);["error","unhandledrejection"].forEach(function(t){a(t,function(e){w[d].push([t,e])});});scr.src="https://cdn.debugbear.com/oSrCRQQlFdYm.js";o.head.appendChild(scr);}})()
  </script>
)}
```

### 6.4 Sampling

| Parameter | Nilai |
|-----------|-------|
| `dbpr` (presampling rate) | 100 = 1% traffic |
| Logika | Hanya 1 dari 100 pengguna yang di-track |

### 6.5 Error Tracking

DebugBear juga menangkap `window.onerror` dan `unhandledrejection` sebagai data RUM.

### 6.6 CSP Requirements

```
script-src:  https://cdn.debugbear.com
connect-src: https://cdn.debugbear.com
```

---

## 7. Tool #5: Ahrefs (SEO Analytics)

### 7.1 Deskripsi

Ahrefs adalah **SEO analytics** yang melacak performa website di search engine, backlink profile, dan organic traffic.

### 7.2 Dev vs Prod — **KENAPA BEDA**

| Environment | Load? | Alasan |
|-------------|:-----:|--------|
| **Dev** | ✅ | Ahrefs **built-in ignore localhost**. Tidak ada resiko kontaminasi data. |
| **Prod** | ✅ | Data SEO dari pengguna nyata |

**Poin penting:** Ahrefs secara otomatis mengabaikan traffic dari `localhost` dan `127.0.0.1`. Jadi tidak perlu guard `import.meta.env.PROD` seperti GA4/OpenPanel/DebugBear.

Ini adalah contoh konkret **"setiap tool punya konteks berbeda"** — keputusan dev/prod tidak bisa diseragamkan.

### 7.3 Kode

**Lokasi:** `src/layouts/BaseLayout.astro` (line 47-48)

```astro
<!-- Ahrefs Analytics - https://ahrefs.com/analytics -->
<script is:inline src="https://analytics.ahrefs.com/analytics.js" data-key="O55vlcbdnFEiVlqz/tcJ6A" async></script>
```

**Tidak ada guard `import.meta.env.PROD`** — sengaja, karena Ahrefs ignore localhost.

### 7.4 CSP Requirements

```
script-src:  https://analytics.ahrefs.com
img-src:     https://analytics.ahrefs.com
connect-src: https://analytics.ahrefs.com
```

---

## 8. Tool #6: Web Vitals (Performance Monitoring)

### 8.1 Deskripsi

Web Vitals adalah **library** (`web-vitals` npm) yang mengukur metrik performa nyata: LCP, INP, CLS, FCP, TTFB. Di project ini, hasilnya di-`console.log` untuk observability.

### 8.2 Dev vs Prod

| Environment | Load? | Perilaku |
|-------------|:-----:|----------|
| **Dev** | ✅ | Console log — untuk developer debugging |
| **Prod** | ✅ | Console log tetap aktif — data bisa dicek via browser DevTools |

**Tidak ada guard environment.** Web Vitals selalu dimuat karena:
- Library sangat kecil (< 5KB minified)
- Tidak mengirim data ke server eksternal (hanya console.log)
- Berguna di semua environment

### 8.3 Kode

**Lokasi:** `src/lib/web-vitals.ts` — function `initWebVitalsMonitoring()`

```ts
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

export function initWebVitalsMonitoring() {
  onLCP((metric) => onCoreMetric({ name: 'LCP', value: metric.value, rating: metric.rating }))
  onINP((metric) => onCoreMetric({ name: 'INP', value: metric.value, rating: metric.rating }))
  onCLS((metric) => onCoreMetric({ name: 'CLS', value: metric.value, rating: metric.rating }))
  onFCP((metric) => onCoreMetric({ name: 'FCP', value: metric.value, rating: metric.rating }))
  onTTFB((metric) => onCoreMetric({ name: 'TTFB', value: metric.value, rating: metric.rating }))
}
```

**Dipanggil di:** `src/layouts/BaseLayout.astro` (line 130-136)

```astro
<script>
  import { initWebVitalsMonitoring } from '@lib/web-vitals'
  import { initGlobalErrorHandling } from '@lib/error-handler'
  initWebVitalsMonitoring()
  initGlobalErrorHandling()
</script>
```

### 8.4 Output Format

```js
[Web Vitals] {
  name: "LCP",
  value: 1234.56,
  rating: "good",      // "good" | "needs-improvement" | "poor"
  timestamp: 1718723456789,
  url: "https://amalshalih.or.id/",
  userAgent: "Mozilla/5.0 ..."
}
```

---

## 9. Tool #7: Global Error Handler (Client-Side)

### 9.1 Deskripsi

Custom error handler yang menangkap **uncaught exceptions** dan **unhandled promise rejections** di browser, lalu mengirimnya ke Sentry (production) atau console (development).

### 9.2 Dev vs Prod

| Environment | Load? | Perilaku |
|-------------|:-----:|----------|
| **Dev** | ✅ | Error di-log ke console. **Tidak** dikirim ke Sentry. |
| **Prod** | ✅ | Error dikirim ke Sentry + user melihat toast "Tim kami telah diberitahu." |

Perbedaan perilaku diatur oleh **default options** di `error-handler.ts`:

```ts
const defaultOptions: ErrorHandlerOptions = {
  showUserMessage: true,
  logToConsole: import.meta.env.DEV,        // true di dev, false di prod
  sendToSentry: !import.meta.env.DEV,        // false di dev, true di prod
  context: {},
}
```

### 9.3 Kode

**Lokasi:** `src/lib/error-handler.ts`

**Event listener:**
```ts
window.addEventListener('error', (event) => { ... })
window.addEventListener('unhandledrejection', (event) => { ... })
```

**Sentry integration (lazy load):**
```ts
if (opts.sendToSentry && typeof window !== 'undefined') {
  import('@sentry/astro').then((Sentry) => {
    Sentry.captureException(error, {
      extra: opts.context,
      tags: { source: 'client', type: error.name },
    })
  })
}
```

**User-facing message:**
```ts
const safeMessage = import.meta.env.PROD
  ? 'Terjadi kesalahan. Tim kami telah diberitahu.'
  : userMessage
showErrorToast(safeMessage)
```

### 9.4 Helper: `withErrorHandling`

Wrapper untuk async operations (API calls, dll):

```ts
const result = await withErrorHandling(
  () => fetch('/api/data').then(r => r.json()),
  'Gagal memuat data'
)
// Returns T | null — error sudah di-handle otomatis
```

---

## 10. Tool #8: Service Worker (Offline/Caching)

### 10.1 Deskripsi

Service Worker memberikan **offline support** dan caching strategy menggunakan Workbox. Terdaftar di `BaseHead.astro` dan logic-nya di `public/sw.ts`.

### 10.2 Dev vs Prod

| Environment | Load? | Perilaku |
|-------------|:-----:|----------|
| **Dev** | ✅ | Service Worker terdaftar tapi mungkin tidak aktif (protocol mismatch, localhost quirks) |
| **Prod** | ✅ | Service Worker aktif penuh dengan caching strategi |

### 10.3 Kode Register

**Lokasi:** `src/components/BaseHead.astro` (line 236-265)

```astro
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.ts')
      .then((registration) => { ... })
      .catch((error) => { console.error('❌ Service Worker registration failed:', error) })
  })
}
</script>
```

---

## 11. Tool #9: Spotlight (Development Debugger)

### 11.1 Deskripsi

Spotlight adalah **debug overlay** dari Sentry yang menampilkan console logs, network requests, errors, dan Astro islands info secara real-time di browser.

### 11.2 Dev vs Prod

| Environment | Load? | Perilaku |
|-------------|:-----:|----------|
| **Dev** | ✅ | Sidebar debug aktif di `localhost:4321` |
| **Prod** | ❌ | **Zero impact** — tidak ada kode Spotlight di production |

> **Detail lengkap:** `.openkb/30-deploy/spotlight-integration.md`

### 11.3 Cara Aktivasi

```bash
bunx spotlight
```

Lalu akses `http://localhost:4321` — panel Spotlight muncul di pojok kanan bawah.

### 11.4 Konfigurasi

**Di `astro.config.mjs`:** Urutan penting → Sentry dulu, baru Spotlight.

```js
integrations: [
  sentry(),
  spotlightjs(),
]
```

---

## 12. Content Security Policy (CSP)

### 12.1 Dua Lapis CSP

Website ini menggunakan **2 lapis CSP**:

1. **HTTP Headers** (via `middleware.ts`) — Enforcement + Report-Only
2. **Meta Tag** (via `BaseHead.astro`) — Fallback untuk halaman statis

### 12.2 Sumber Domain per Tool

| Tool | Domain | Digunakan Untuk |
|------|--------|-----------------|
| **Sentry** | `*.sentry.io`, `*.ingest.us.sentry.io` | Script, error ingestion |
| **GA4** | `www.googletagmanager.com`, `www.google-analytics.com`, `*.google-analytics.com`, `stats.g.doubleclick.net`, `www.google.com`, `analytics.google.com` | Script, tracking, connect |
| **OpenPanel** | `openpanel.dev`, `api.openpanel.dev` | Script component, API events |
| **DebugBear** | `cdn.debugbear.com` | Script, connect |
| **Ahrefs** | `analytics.ahrefs.com` | Script, image beacon, connect |
| **Google Fonts** | `fonts.googleapis.com`, `fonts.gstatic.com` | Style, font |
| **Sanity CMS** | `cdn.sanity.io` | Content images, API |
| **Social Embeds** | `facebook.com`, `instagram.com`, `youtube.com`, `tiktok.com`, `wa.me` | Social media previews |

### 12.3 Konsolidasi CSP

> **Detail lengkap:** `.openkb/10-arsitektur/CLEAN_CONFIGURATION_SUMMARY.md`

CSP dikonsolidasi menjadi **satu source of truth** di `middleware.ts`. Meta tag di `BaseHead.astro` adalah **copy** yang harus sinkron.

**Saat menambah tool baru:**
1. Tambah domain ke `middleware.ts` (Enforcement + Report-Only di `src`)
2. Tambah domain ke `BaseHead.astro` meta tag
3. Pastikan keduanya sinkron

---

## 13. Dev vs Prod — Strategi Spesifik per Tool

### 13.1 Mengapa Tidak Seragam?

Setiap tool punya **konteks dan behaviour** yang berbeda:

| Tool | Guard? | Alasan |
|------|:------:|--------|
| **GA4** | `import.meta.env.PROD` | Data dev akan mengotori production analytics |
| **OpenPanel** | `import.meta.env.PROD` | Sama seperti GA4 — privacy analytics |
| **DebugBear** | `import.meta.env.PROD` | Sampling hanya berguna di production |
| **Sentry** | `import.meta.env.PROD` | Error dev tidak relevan untuk production monitoring |
| **Ahrefs** | **Tidak** | Built-in ignore localhost — aman dimuat di mana saja |
| **Web Vitals** | **Tidak** | Library kecil, hanya console.log, tidak kirim data |
| **Error Handler** | **Tidak** (logic internal) | Kirim ke Sentry hanya di prod, console di dev |
| **Service Worker** | **Tidak** | Browser handle sendiri (localhost vs https) |
| **Spotlight** | Dev only (built-in) | Package dev — tidak termasuk production bundle |

### 13.2 Prinsip yang Dapat Dipetik

1. **Jangan seragamkan secara paksa** — setiap tool punya konteks sendiri
2. **Pahami behaviour masing-masing tool** — beberapa punya built-in filtering (Ahrefs ignore localhost)
3. **Gunakan guard minimal** — guard hanya jika benar-benar diperlukan
4. **Lazy loading untuk Sentry** di error-handler — hanya import saat error terjadi, bukan di page load

---

## 14. Troubleshooting & FAQ

### 14.1 "Ignoring Event: localhost" dari Ahrefs

**Status:** ✅ Normal. Bukan error.

Ahrefs analytics.js secara otomatis mengabaikan event dari `localhost` dan `127.0.0.1`. Ini adalah **built-in behaviour**, bukan masalah konfigurasi.

### 14.2 "VMxxx removeChild" Error

**Status:** ✅ Bukan dari code kita.

Error ini berasal dari **ekstensi browser MozBar** (atau ekstensi serupa). Bukan dari kode website.

### 14.3 "Sentry source map upload terjadi 2 kali"

**Status:** ✅ Normal. Bukan bug.

Astro SSR menghasilkan **2 bundle** (client + server), masing-masing butuh source map. Detail: `.openkb/10-arsitektur/SENTRY_SOURCE_MAP_UPLOAD.md`.

### 14.4 FCP turun dari 18.6s ke 5.8s

**Yang dilakukan:** Google Fonts loading diubah dari blocking (`<link rel="stylesheet">`) ke non-blocking (`media="print" onload="this.media='all'"`).

**Teknik:**
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/..." 
      media="print" onload="this.media='all'" />
<noscript><link rel="stylesheet" href="..." /></noscript>
```

### 14.5 CSP Report-Only vs Enforcement

| Jenis | Middleware | Tujuan |
|-------|:----------:|--------|
| **Enforcement** (`Content-Security-Policy`) | `middleware.ts` `src` | Block actual violations |
| **Report-Only** (`Content-Security-Policy-Report-Only`) | `middleware.ts` `report-only` | Monitor tanpa block |

**Keduanya harus sinkron** — beda hanya pada `Content-Security-Policy` vs `Content-Security-Policy-Report-Only` header.

### 14.6 Tool Baru? Checklist Integrasi

```markdown
- [ ] Tambah script/komponen tool di tempat yang sesuai
- [ ] Guard `import.meta.env.PROD` jika perlu
- [ ] Tambah domain ke CSP middleware.ts (enforcement + report-only)
- [ ] Tambah domain ke BaseHead.astro meta tag CSP
- [ ] Test di dev (pastikan tidak error)
- [ ] Deploy ke staging/production
- [ ] Verifikasi tool menerima data
```

---

## 15. Referensi Cepat

### 15.1 Tabel Tools

| Tool | Tipe | Prod Only? | Guard Method | File Lokasi |
|------|------|:-----------:|--------------|-------------|
| Sentry | Error Tracking | ✅ | `@sentry/astro` plugin config | `astro.config.mjs`, `sentry.client/server.config.js` |
| GA4 | Analytics | ✅ | `import.meta.env.PROD` | `BaseHead.astro:268` |
| OpenPanel | Analytics | ✅ | `import.meta.env.PROD` | `BaseHead.astro:284` |
| DebugBear | RUM | ✅ | `import.meta.env.PROD` | `BaseHead.astro:300` |
| Ahrefs | SEO Analytics | ❌ | None (built-in ignore) | `BaseLayout.astro:47` |
| Web Vitals | Performance | ❌ | None | `lib/web-vitals.ts` + `BaseLayout.astro:130` |
| Error Handler | Error | ❌ | Internal logic | `lib/error-handler.ts` + `BaseLayout.astro:130` |
| Service Worker | Caching | ❌ | None | `BaseHead.astro:236` + `public/sw.ts` |
| Spotlight | Debug | ❌ (dev only) | Built-in dev | `astro.config.mjs` |

### 15.2 File Mapping

```
astro.config.mjs
├── @sentry/astro                    # Sentry integration
└── @spotlightjs/astro               # Spotlight integration (dev only)

src/components/BaseHead.astro
├── <meta http-equiv=...>            # CSP meta tag (fallback)
├── Service Worker register          # Offline support
├── GA4 (import.meta.env.PROD)       # Google Analytics
├── OpenPanel (import.meta.env.PROD) # Privacy analytics
└── DebugBear (import.meta.env.PROD) # RUM monitoring

src/layouts/BaseLayout.astro
├── Ahrefs Analytics                 # SEO analytics (no guard)
├── Web Vitals init                  # Performance monitoring
└── Error Handler init               # Global error catching

src/middleware.ts
├── Content-Security-Policy          # CSP Enforcement (src)
└── Content-Security-Policy-Report-Only  # CSP Report-Only (report-only)
```

### 15.3 Key Domains CSP (Lengkap)

```
script-src:
  'self' 'unsafe-inline'
  https://cdn.sanity.io
  https://www.googletagmanager.com
  https://www.google-analytics.com
  https://*.google-analytics.com
  https://www.google.com
  https://*.google.com
  https://openpanel.dev
  https://*.sentry.io
  https://cdn.debugbear.com
  https://analytics.ahrefs.com
  https://static.cloudflareinsights.com

img-src:
  'self' data: blob:
  https://cdn.sanity.io
  https://images.unsplash.com
  https://unsplash.com
  https://amalshalih.or.id
  https://www.google-analytics.com
  https://*.google-analytics.com
  https://www.google.com
  https://*.google.com
  https://openpanel.dev
  https://analytics.ahrefs.com
  https://facebook.com
  https://instagram.com
  https://youtube.com
  https://tiktok.com
  https://wa.me
  https://www.google.com/maps
  https://linktr.ee
  https://www.googleapis.com
  https://stats.g.doubleclick.net

connect-src:
  'self'
  https://*.ingest.us.sentry.io
  https://api.resend.com
  https://www.googleapis.com
  https://fonts.googleapis.com
  https://fonts.gstatic.com
  https://openpanel.dev
  https://api.openpanel.dev
  https://www.google-analytics.com
  https://*.google-analytics.com
  https://analytics.google.com
  https://*.analytics.google.com
  https://www.googletagmanager.com
  https://*.googletagmanager.com
  https://stats.g.doubleclick.net
  https://www.google.com
  https://*.google.com
  https://pagead2.googlesyndication.com
  https://cdn.debugbear.com
  https://analytics.ahrefs.com
  https://cdn.sanity.io

font-src:
  'self'
  https://fonts.gstatic.com

style-src:
  'self' 'unsafe-inline'
  https://fonts.googleapis.com
```
