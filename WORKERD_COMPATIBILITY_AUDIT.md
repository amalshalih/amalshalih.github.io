# Astro v6 + Cloudflare Workers Workerd Compatibility Audit

**Date:** 2026-06-01  
**Status:** ✅ ALL ISSUES FIXED  
**Runtime:** Cloudflare Workers (workerd)  

---

## Summary

Complete audit and fixes for workerd (Cloudflare Workers runtime) compatibility. All Node.js-specific code has been migrated to Web APIs that work in workerd.

---

## Issues Found & Fixed

### 🔴 CRITICAL: Firebase Admin (`src/lib/firebase/admin.ts`)

**Problem:** Used Node.js-only modules:
```typescript
import { createPrivateKey, createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
// Plus: process.cwd(), Buffer usage
```

**Solution:** Rewrote with Web Crypto API:
```typescript
// Web Crypto API - works in workerd
const key = await crypto.subtle.importKey(
  'pkcs8',
  binaryDer,
  { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
  false,
  ['sign'],
);

const signatureBuffer = await crypto.subtle.sign(
  { name: 'RSASSA-PKCS1-v1_5' },
  key,
  new TextEncoder().encode(signingInput),
);
```

---

### 🟡 MEDIUM: process.env Fallbacks

**Files affected:**
- `src/data/galleries.ts` (line 13, 127)
- `src/lib/google-drive.ts` (line 43)
- `src/pages/api/drive-image/[id].ts` (line 7)

**Problem:**
```typescript
// Old code - fallback to process.env
const creds = (env as any).GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY;
```

**Solution:**
```typescript
// New code - only use Cloudflare Workers env
const creds = (env as any).GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY;
```

**Why:** `process.env` is a Node.js global, not available in workerd. Use `env` from `cloudflare:workers` instead.

---

### 🟢 INFO: Already Workerd-Compatible Code

These files were already using workerd-compatible patterns:
- `src/lib/google-drive.ts` - Uses Web Crypto API ✅
- `src/pages/api/like.ts` - Uses `env.LIKES` ✅
- `src/pages/api/gallery-like.ts` - Uses `env.LIKES` ✅
- API endpoints - Use `crypto.subtle` ✅

---

## Test Results

All tests passed in production workerd environment:

| Test | Status |
|------|--------|
| Gallery API (Google Drive) | ✅ 2 galleries returned |
| Gallery list page | ✅ HTTP 200 |
| Gallery detail pages (×2) | ✅ HTTP 200 |
| Image proxy (Google Drive) | ✅ HTTP 200 |
| Like functionality (KV) | ✅ Working |

**Production URL:** https://www.asib.workers.dev/galeri

---

## Key Principles for Workerd Compatibility

### ❌ DO NOT USE in Workers:
- `node:*` modules (node:crypto, node:fs, node:path, etc.)
- `process.env` → use `env` from `cloudflare:workers`
- `process.cwd()` → not available
- `__dirname`, `__filename` → not available
- `fs.readFileSync()` → use import or fetch
- `Buffer` → use `Uint8Array`, `TextEncoder`, `btoa`/`atob`
- `crypto.createSign()` → use `crypto.subtle` (Web Crypto API)

### ✅ USE in Workers:
- Web Crypto API: `crypto.subtle.sign()`, `crypto.subtle.importKey()`
- Cloudflare Workers env: `import { env } from 'cloudflare:workers'`
- Standard Web APIs: `fetch`, `URL`, `URLSearchParams`, `btoa`, `atob`
- Uint8Array and TextEncoder/TextDecoder for binary data
- `atob()` and `btoa()` for base64 operations

---

## Files Modified

1. `src/lib/firebase/admin.ts` - Rewrote JWT signing with Web Crypto API
2. `src/data/galleries.ts` - Removed process.env fallback
3. `src/lib/google-drive.ts` - Removed process.env fallback
4. `src/pages/api/drive-image/[id].ts` - Removed process.env fallback

---

## Migration Guide: Node.js → Workerd

### JWT Signing (RSA-SHA256)

**Before (Node.js only):**
```typescript
import { createPrivateKey, createSign } from 'node:crypto';

const key = createPrivateKey(privateKey);
const signer = createSign('RSA-SHA256');
signer.update(message);
const signature = signer.sign(key, 'base64');
```

**After (Workd-compatible):**
```typescript
// No imports needed - use Web Crypto API
const pemContents = privateKey
  .replace('-----BEGIN PRIVATE KEY-----', '')
  .replace('-----END PRIVATE KEY-----', '')
  .replace(/\n/g, '');

const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

const key = await crypto.subtle.importKey(
  'pkcs8',
  binaryDer,
  { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
  false,
  ['sign'],
);

const signature = await crypto.subtle.sign(
  { name: 'RSASSA-PKCS1-v1_5' },
  key,
  new TextEncoder().encode(message),
);

const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
```

### Environment Variables

**Before:**
```typescript
const key = process.env.API_KEY;
```

**After:**
```typescript
import { env } from 'cloudflare:workers';
const key = (env as any).API_KEY;
```

### File System Operations

**Before:**
```typescript
import { readFileSync } from 'node:fs';
const content = readFileSync('./file.json', 'utf-8');
```

**After:**
```typescript
// Option 1: Use import (for static files at build time)
import content from './file.json';

// Option 2: Use fetch (for runtime)
const response = await fetch('https://example.com/file.json');
const content = await response.text();

// Option 3: Store in KV or environment
const content = (env as any).FILE_CONTENT;
```

---

## References

- [Cloudflare Workers Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)

---

**Status:** ✅ Website fully compatible with Cloudflare Workers (workerd) runtime
