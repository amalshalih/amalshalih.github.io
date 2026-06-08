# Data Sources Documentation

Dokumen ini menjelaskan semua sumber data yang digunakan website ASIB beserta konfigurasi dan cara aksesnya.

## Overview

Website ASIB menggunakan hybrid content strategy dengan 4 sumber data:

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTENT SOURCES                          │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Markdown   │   Sanity     │ Google Drive │      KV        │
│   (Local)    │    (CMS)     │  (Photos)    │   (Likes)      │
├──────────────┼──────────────┼──────────────┼────────────────┤
│ 5 kegiatan   │ 3 kegiatan   │ 2 galleries  │ Photo likes    │
│ 11 blog      │ 15 programs  │ 17 photos    │ Gallery likes  │
│ (fallback)   │ Site config  │              │                │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

## 1. Local Markdown

**Lokasi:** `src/content/kegiatan/*.md`, `src/content/blog/*.md`

**Use Case:**
- Primary content untuk kegiatan dan blog
- Fallback jika Sanity CMS tidak tersedia
- Static content yang jarang berubah

**Struktur:**
```markdown
---
title: "Judul Kegiatan"
description: "Deskripsi singkat"
date: 2026-05-15
image: "/images/foto.jpg"
kategori: "sosial" # pendidikan | keagamaan | sosial | umum
---

Konten lengkap dalam markdown...
```

**Akses:**
```typescript
import { getCollection } from 'astro:content';
const kegiatan = await getCollection('kegiatan');
```

**Status:** ✅ Active (5 kegiatan files, 11 blog files)

---

## 2. Sanity CMS

**Project ID:** `9yj0dq9v`  
**Dataset:** `production`  
**Studio URL:** (internal, private access)

### Schema Types

| Type | Fields | Count | Use Case |
|------|--------|-------|----------|
| `kegiatan` | title, description, date, image, kategori | 3 | Berita/kegiatan (backup) |
| `program` | title, description, category, icon | 15 | Daftar program yayasan |
| `siteSettings` | siteTitle, description, contact, social | 1 | Konfigurasi global |
| `bankDonasi` | bankName, accountNumber, accountName | 5 | Info rekening donasi |
| `pengurus` | name, role, photo | 0 | Struktur organisasi |

### API Access

**Public Query (read-only):**
```bash
curl 'https://9yj0dq9v.api.sanity.io/v1/data/query/production?query=*[_type == "kegiatan"]'
```

**Client-side:**
```typescript
import { sanityClient } from 'sanity:client';
const data = await sanityClient.fetch(kegiatanListQuery);
```

**Server-side:**
```typescript
import { getKegiatanList } from '../lib/sanity/client';
const kegiatan = await getKegiatanList();
```

### Fallback Pattern

```typescript
try {
  const sanityData = await getKegiatanList();
  return sanityData;
} catch (error) {
  console.error('[Sanity] Fetch failed:', error);
  // Fallback ke local markdown
  const localData = await getCollection('kegiatan');
  return localData;
}
```

**Status:** ✅ Active (API accessible, data tersedia)

---

## 3. Google Drive API

**Use Case:** Gallery photos yang diorganisir dalam folder

### Struktur Folder

```
YAYASAN_AMAL_SHALIH_PHOTOS/
├── KEGIATAN_RUTIN/
│   ├── Jumat_Bersedekah_2025/
│   └── Santunan_Bulanan_2026/
└── MILAD_3_ASIB/
    ├── Milad_Celebration_2026/
    └── Wisuda_Tahfidz_2026/
```

**Total:** 2 galleries, 17 photos

### Authentication

**Service Account Key:** Disimpan di `wrangler.jsonc` sebagai secret

```jsonc
{
  "vars": {
    "GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY": "{...}" // JSON service account key
  }
}
```

**Access Pattern:**
```typescript
import { env } from 'cloudflare:workers';
const key = env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY;
const credentials = JSON.parse(key);
```

### API Implementation

**File:** `src/lib/google-drive.ts`

```typescript
export async function listFolders() {
  // List all folders in parent directory
}

export async function listFiles(folderId: string) {
  // List files dalam specific folder
}

export async function getFile(fileId: string) {
  // Get file metadata & content
}
```

### Proxy Endpoint

**Route:** `/api/drive-image/[id].ts`

Mengambil foto dari Google Drive dan serve via Workers (handling CORS, authentication).

**Status:** ✅ Active (17 photos served successfully)

---

## 4. Cloudflare KV Storage

**Use Case:** Photo likes counter (persistent storage)

### Namespaces

```jsonc
// wrangler.jsonc
{
  "kv_namespaces": [
    {
      "binding": "LIKES",
      "id": "0525d17bcb8b43098ec8415b976e2dca"
    },
    {
      "binding": "SESSION",
      "id": "session-namespace-id"
    }
  ]
}
```

### Key Format

**Photo Likes:**
```
photo:{gallerySlug}:{photoId} = {count}
```

**Gallery Likes:**
```
gallery:{slug} = {count}
```

### API Endpoints

**GET `/api/like?slug={slug}`**
```typescript
// Returns: { "photoId1": 5, "photoId2": 3, ... }
```

**POST `/api/like`**
```typescript
// Body: { "slug": "gallery-name", "photoId": "photo-123" }
// Returns: { "likes": 6 }
```

**GET `/api/gallery-like?slug={slug}`**
```typescript
// Returns: { "likes": 42 }
```

### Implementation

**File:** `src/pages/api/like.ts`

```typescript
import { env } from 'cloudflare:workers';

const likes = env.LIKES;
await likes.put(`photo:${slug}:${photoId}`, newCount.toString());
```

**Status:** ✅ Active (production ready)

---

## Data Flow Diagram

```
User Request
    │
    ▼
┌──────────────┐
│   Worker     │
│   (SSR)      │
└──────────────┘
    │
    ├──────────────┬──────────────┬──────────────┐
    ▼              ▼              ▼              ▼
┌────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Astro  │   │  Sanity  │   │  Google  │   │    KV    │
│Content │   │   CMS    │   │  Drive   │   │ Storage  │
│(Local) │   │(API)     │   │  (API)   │   │ (Native) │
└────────┘   └──────────┘   └──────────┘   └──────────┘
    │              │              │              │
    ▼              ▼              ▼              ▼
┌──────────────────────────────────────────────────────┐
│                   HTML Response                      │
└──────────────────────────────────────────────────────┘
```

## Configuration Summary

| Service | Config File | Access Method | Fallback |
|---------|-------------|---------------|----------|
| Markdown | `src/content/` | `getCollection()` | None |
| Sanity | `astro.config.mjs` | `sanity:client` | Local Markdown |
| Google Drive | `wrangler.jsonc` secrets | `env.GOOGLE_DRIVE_*` | Empty gallery |
| KV | `wrangler.jsonc` | `env.LIKES` | In-memory (lost on recycle) |

## Error Handling

Semua data sources mengimplementasikan error handling dengan logging:

```typescript
try {
  const data = await fetchFromSource();
  return data;
} catch (error) {
  console.error('[DataSource] Failed to fetch:', error);
  return fallbackData;
}
```

## Health Check

Endpoint `/api/health` memeriksa konektivitas ke semua external services.

---

**Version:** Juni 2026  
**Last Updated:** Phase 4.2 (documentation complete)