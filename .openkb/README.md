# Technical Knowledge Base — Website Yayasan ASIB

> **Terakhir diperbarui:** 19 Juni 2026  
> **Repo:** `amalshalih/amalshalih.github.io` — **hanya berisi dokumentasi teknis website**  
> **Dokumentasi organisasi yayasan:** [`amalshalih/amalshalih/.openkb/`](https://github.com/amalshalih/amalshalih/tree/main/.openkb)

---

## 📂 Struktur

```
.openkb/
├── README.md                         # ← Indeks ini
├── 10-arsitektur/                    # Arsitektur teknis & konfigurasi
│   ├── ARCHITECTURE.md               # Arsitektur keseluruhan website
│   ├── ASTRO_V6_CLOUDFLARE_CONFIG_AUDIT.md  # Audit konfigurasi Astro v6 + CF
│   ├── audit-komprehensif.md         # Audit komprehensif project
│   ├── brainstorming.md              # Design system & UI/UX planning
│   ├── CLEAN_CONFIGURATION_SUMMARY.md     # Ringkasan konfigurasi bersih
│   ├── email-system.md               # Setup perutean email Cloudflare
│   ├── GA4-IMPLEMENTATION-STRATEGY.md     # Strategi GA4 (Traditional vs Partytown)
│   ├── MONITORING-DAN-ANALYTICS-OVERVIEW.md  # Overview semua monitoring & analytics
│   ├── ROOT_LEVEL_WRANGLER_CONFIG.md # Catatan konfigurasi wrangler
│   ├── SENTRY_SOURCE_MAP_UPLOAD.md   # Dual bundle source map Sentry
│   ├── WORKERD_COMPATIBILITY_AUDIT.md     # Audit kompatibilitas Workerd
│   └── WRANGLER_PREVIEW_ERROR_10015.md    # Troubleshooting error preview
├── 20-cms-dan-konten/                # CMS, konten
│   ├── cms-integration.md            # Integrasi Sanity CMS
│   ├── DATA_SOURCES.md               # Inventaris sumber data
│   ├── kegiatan-content-architecture.md   # Arsitektur konten kegiatan
│   └── sanity-strategi.md            # Strategi Sanity CMS
└── 30-deploy/                        # Deployment & workflow
    ├── commit-strategy.md            # Konvensi commit git
    ├── deployment.md                 # Panduan deployment
    └── spotlight-integration.md      # Integrasi Spotlight debug overlay
```

---

## 📖 Ringkasan per Subdirektori

### 🔧 10-arsitektur/
Dokumen teknis tentang fondasi website — arsitektur sistem, konfigurasi Astro + Cloudflare, audit kompatibilitas, design system, dan troubleshooting error. Target: **IT engineers & maintainers.**

**📋 Audit & Planning:**
- **`00-COMPREHENSIVE-AUDIT-BRIEF.md`** — Audit UI/UX, Accessibility, Performance, SEO, Security lengkap (14 kategori, 64+ jam)
- **`audit-komprehensif.md`** — Audit komprehensif project (dokumen sebelumnya)

### 📝 20-cms-dan-konten/
Panduan integrasi Sanity CMS, strategi konten, dan arsitektur data kegiatan. Target: **IT engineers.**

### 🚀 30-deploy/
Workflow deployment, konvensi commit, dan tool debugging (Spotlight). Target: **IT engineers.**

---

> **Catatan:** OpenKB organisasi yayasan (SOP, template, legal, AI agents, panduan media, dll.) tersedia di [`amalshalih/amalshalih/.openkb/`](https://github.com/amalshalih/amalshalih/tree/main/.openkb).  
> **Integrasi masa depan:** `.openkb/` website dapat me-submodule `amalshalih/amalshalih/.openkb/` ke subdirektori `amalshalih/` untuk akses silang.
