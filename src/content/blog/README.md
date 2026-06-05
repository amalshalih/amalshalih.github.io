# Konten Blog — Catatan

> File ini di-skip oleh content collection (via glob `!**/README.md`).

## Status Saat Ini

Blog masih **100% markdown**. Berbeda dengan halaman Kegiatan yang sudah terintegrasi ke Sanity CMS.

## Ke Depan

Rencananya blog akan menyusul pola yang sama seperti kegiatan:

```
Sanity CMS ──→ SSR API ──→ Render halaman
                      ↓ (fallback)
                 File markdown statis
```

Dengan migrasi ke Sanity, tim Media & Publikasi bisa mengelola artikel blog langsung dari Sanity Studio tanpa perlu sentuh file markdown.

## Sementara

Edit langsung file `.md` di folder ini. Setiap file perlu frontmatter:

```yaml
---
title: "Judul Artikel"
description: "Ringkasan singkat"
date: 2026-05-30
image: "https://images.unsplash.com/..."  # opsional
category: "edukasi"  # opsional
author: "Admin Yayasan ASIB"  # default
---
```

## Referensi

Arsitektur konten kegiatan (yang sudah Sanity-first): `.openkb/kegiatan-content-architecture.md`
