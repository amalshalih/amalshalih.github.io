# Sentry Source Map Upload — Dual Bundle Architecture

> **Created:** 15 Juni 2026  
> **Status:** ✅ Production Behavior (Expected & Normal)  
> **Related:** `.openkb/10-arsitektur/ARCHITECTURE.md`, `.openkb/30-deploy/deployment.md`

---

## 📊 Ringkasan Eksekutif

**Fenomena:** Saat build production, Sentry source map upload terjadi **2 kali**.

**Apakah ini bug?** ❌ **BUKAN** — ini adalah **perilaku yang BENAR dan DIHARAPKAN** ✅

**Kenapa?** Astro SSR dengan Cloudflare Workers menghasilkan **2 bundle terpisah**:
1. **Client Bundle** (browser JavaScript) — 108 files
2. **Server Bundle** (Worker runtime) — 112 files

Sentry meng-upload keduanya secara terpisah karena berbeda runtime context.

---

## 🔍 Bukti dari Build Log

### Upload #1 — Client Bundle
```
> Found 108 files
> Analyzing 108 sources
> Analyzing completed in 0.003s
> Adding source map references
> Bundling completed in 0.16s
> Bundled 108 files for upload
> Bundle ID: f5a8363f-8c5c-5bb9-9ad0-08641ce1cdcb
> Uploaded files to Sentry
> Organization: yayasan-amal-shalih-insan-bant
> Projects: amalshalih
> Release: 6bcbfbf79ada21fd91ca8417460d1f09ca48b1e4
```

**Files yang di-upload:**
```
~/d2d2186d-ab84-40fc-91ca-4077428d691e-0.js
  (sourcemap at Navbar.astro_astro_type_script_index_0_lang.DDH3_qTu.js.map)
~/3bf81e29-2817-4923-bdf0-f7a7e37b37ac-1.js
  (sourcemap at page.Wf5ADChW.js.map)
```

**Ini adalah:** Client-side island components (browser JavaScript)

---

### Upload #2 — Server Bundle
```
> Found 112 files
> Analyzing 112 sources
> Analyzing completed in 0.004s
> Adding source map references
> Bundling completed in 0.218s
> Bundled 112 files for upload
> Bundle ID: 397a7d30-b78f-53fe-9656-f1adf9a0cd06
> Uploaded files to Sentry
> Organization: yayasan-amal-shalih-insan-bant
> Projects: amalshalih
> Release: 6bcbfbf79ada21fd91ca8417460d1f09ca48b1e4
```

**Files yang di-upload:**
```
~/411037a8-2075-405d-986d-a4b46a4bdab6-52.js
  (sourcemap at entry.mjs.map)
~/6c01bff0-f3ce-48a0-aec7-9c1a35e74a53-51.js
  (sourcemap at worker-entry_-nQh9WDm.mjs.map)
~/f40efc4f-7a64-49ce-96e3-ff9f08aa5b3b-40.js
  (sourcemap at page-ssr_0PR4D7t5.mjs.map)
```

**Ini adalah:** Server-side Worker runtime (Cloudflare Workers)

---

## 🏗️ Arsitektur Astro SSR

### Build Flow Diagram

```
astro build
    │
    ├─→ Phase 1: Client Bundle (Browser)
    │   ├─ Island components (Navbar, Button, etc.)
    │   ├─ Hydration scripts
    │   ├─ Interactive UI components
    │   └─ Output: dist/client/
    │       └─ Upload to Sentry (client context)
    │
    └─→ Phase 2: Server Bundle (Worker)
        ├─ Worker entry point (entry.mjs)
        ├─ SSR rendering engine
        ├─ API routes (/api/*)
        ├─ Middleware
        └─ Output: dist/server/
            └─ Upload to Sentry (server context)
```

### File Distribution

| Bundle Type | File Count | Total Size | Example Files |
|-------------|-----------|------------|---------------|
| **Client** | 108 files | ~500 KB | `Navbar.*.js`, `Card.*.js`, `page.*.js` |
| **Server** | 112 files | ~2.1 MB | `entry.mjs`, `worker-entry.*.mjs`, `page-ssr.*.mjs` |

---

## 🎯 Kenapa Dipisah?

### 1. **Berbeda Runtime Context**

| Aspect | Client Bundle | Server Bundle |
|--------|--------------|---------------|
| **Runtime** | Browser (Chrome, Firefox, Safari) | Cloudflare Workers (workerd) |
| **Environment** | DOM, window, document | No DOM, service worker API |
| **JavaScript** | ES2020+ with browser APIs | Node.js compat (nodejs_compat flag) |
| **Errors** | UI errors, hydration failures | Server errors, API failures |

### 2. **Berbeda Stack Traces**

**Client Error Example:**
```
Error: Failed to hydrate component
  at Navbar.astro_astro_type_script_index_0_lang.DDH3_qTu.js:15:10
  at page.Wf5ADChW.js:42:5
```

**Server Error Example:**
```
Error: KV namespace not found
  at worker-entry_-nQh9WDm.mjs:125:8
  at page-ssr_0PR4D7t5.mjs:340:12
```

### 3. **Berbeda Debugging Needs**

| Scenario | Client Source Maps | Server Source Maps |
|----------|-------------------|-------------------|
| UI tidak render | ✅ Perlu | ❌ Tidak relevan |
| API endpoint error | ❌ Tidak relevan | ✅ Perlu |
| Hydration mismatch | ✅ Perlu | ❌ Tidak relevan |
| KV storage failure | ❌ Tidak relevan | ✅ Perlu |
| Network request fail | ✅ Perlu (browser) | ✅ Perlu (worker) |

---

## 📦 Sentry Configuration

### Client Config (`sentry.client.config.js`)
```javascript
import * as Sentry from '@sentry/astro'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://e99692c45d83afc7713330e193ea5a9a@o4511465723396096.ingest.us.sentry.io/4511465782509568',
    sendDefaultPii: false,
    environment: 'production',
  })
}
```

**Scope:** Browser-side errors only

---

### Server Config (`sentry.server.config.js`)
```javascript
import * as Sentry from '@sentry/astro'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://e99692c45d83afc7713330e193ea5a9a@o4511465723396096.ingest.us.sentry.io/4511465782509568',
    environment: 'production',
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
  })
}
```

**Scope:** Server-side errors only + performance tracing

---

### Astro Integration (`astro.config.mjs`)
```javascript
import sentry from '@sentry/astro'

export default defineConfig({
  integrations: [
    // ... other integrations
    sentry({
      org: 'yayasan-amal-shalih-insan-bant',
      project: 'amalshalih',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  vite: {
    build: {
      sourcemap: true,  // ← Required for source maps
    },
  },
})
```

**Note:** `@sentry/astro` integration otomatis detect client dan server bundle, lalu upload terpisah.

---

## 🔍 Cara Verifikasi di Sentry Dashboard

### 1. Login Sentry
```
https://sentry.io → yayasan-amal-shalih-insan-bant → amalshalih
```

### 2. Cek Release
```
Releases → 6bcbfbf79ada21fd91ca8417460d1f09ca48b1e4
```

### 3. Cek Artifacts
```
Artifacts → Should see 220 files total:
  ├── Client artifacts (~108 files)
  │   ├── Navbar.astro_astro_type_script_index_0_lang.DDH3_qTu.js.map
  │   ├── page.Wf5ADChW.js.map
  │   └── ...
  │
  └── Server artifacts (~112 files)
      ├── entry.mjs.map
      ├── worker-entry_-nQh9WDm.mjs.map
      └── ...
```

### 4. Test Error Resolution
**Client Error:**
```
1. Trigger error di browser (console.error di component)
2. Check Sentry Issues
3. Stack trace should resolve to .astro source files
```

**Server Error:**
```
1. Trigger error di API route (throw error di /api/*)
2. Check Sentry Issues
3. Stack trace should resolve to .ts/.mjs source files
```

---

## 📊 Perbandingan Bundle Size

### Client Bundle (108 files)
```
Total: ~500 KB (uncompressed)
Largest files:
  ├── page.Wf5ADChW.js           (435 KB)
  ├── params-and-props_wczl_7IJ  (253 KB)
  └── Navbar.*.js                (61 KB)
```

### Server Bundle (112 files)
```
Total: ~2.1 MB (uncompressed)
Largest files:
  ├── page-ssr_0PR4D7t5.mjs      (435 KB)
  ├── worker-entry_-nQh9WDm.mjs  (414 KB)
  ├── params-and-props_wczl_7IJ  (253 KB)
  └── traceData_DOa9JW8-.mjs     (129 KB)
```

**Note:** Server bundle lebih besar karena include:
- SSR rendering engine
- Astro server runtime
- Cloudflare Workers bindings
- API route handlers

---

## ⚠️ Common Misconceptions

### ❌ Myth: "Upload 2 kali = bug / duplikasi"
**✅ Fact:** Upload 2 kali adalah **intentional design** karena berbeda runtime.

### ❌ Myth: "Harusnya bisa digabung jadi 1 bundle"
**✅ Fact:** Tidak bisa — client dan server punya:
- Runtime berbeda (browser vs workerd)
- API berbeda (DOM vs Workers API)
- Error handling berbeda

### ❌ Myth: "Biaya Sentry jadi 2x lipat"
**✅ Fact:** Sentry charge per **organization**, bukan per bundle. Kedua bundle tetap dalam 1 project `amalshalih`.

---

## 🎯 Best Practices

### 1. **Pastikan Sourcemap Enabled**
```javascript
// astro.config.mjs
vite: {
  build: {
    sourcemap: true,  // ← WAJIB
  },
}
```

### 2. **Verify Upload di Sentry**
Setiap build, check:
```bash
# Should see 2 upload reports in build log
> Uploaded files to Sentry  # Upload #1 (client)
> Uploaded files to Sentry  # Upload #2 (server)
```

### 3. **Test Error Resolution**
```javascript
// Client error test
console.error('Test client error')  // Should resolve to .astro file

// Server error test
throw new Error('Test server error')  // Should resolve to .mjs file
```

### 4. **Monitor Release Health**
```
Sentry Dashboard → Releases → Select release → Check:
  - Error count
  - User impact
  - Crash-free sessions
```

---

## 🔧 Troubleshooting

### Issue: Source Maps Tidak Resolve

**Symptoms:**
```
Error di Sentry:
  at unknown
  at unknown
```

**Causes:**
1. Sourcemap tidak di-upload
2. Release version tidak match
3. Path mapping salah

**Solutions:**
```bash
# 1. Verify upload in build log
> Uploaded files to Sentry  # Should appear 2x

# 2. Check release version matches git commit
Release: 6bcbfbf79ada21fd91ca8417460d1f09ca48b1e4

# 3. Verify artifacts in Sentry Dashboard
Releases → Artifacts → Should see 220 files
```

---

### Issue: Hanya 1 Upload Muncul

**Symptoms:**
```
Build log hanya show 1x upload:
> Uploaded files to Sentry  # Only once
```

**Causes:**
1. Client atau server bundle tidak di-build
2. Sentry integration tidak di-load
3. Build error di salah satu phase

**Solutions:**
```bash
# 1. Check build output
ls dist/client/  # Should have files
ls dist/server/  # Should have files

# 2. Verify Sentry integration
cat astro.config.mjs | grep sentry
# Should show: sentry({ org: '...', project: '...', authToken: '...' })

# 3. Re-build with verbose logging
bun run build --verbose
```

---

### Issue: Upload Gagal

**Symptoms:**
```
[sentry-vite-plugin] Error: Failed to upload source maps
```

**Causes:**
1. `SENTRY_AUTH_TOKEN` tidak valid
2. Network timeout
3. Sentry quota exceeded

**Solutions:**
```bash
# 1. Verify token
echo $SENTRY_AUTH_TOKEN  # Should not be empty

# 2. Test token validity
curl -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
  https://sentry.io/api/0/organizations/

# 3. Check Sentry quota
Sentry Dashboard → Settings → Billing → Check quota
```

---

## 📚 Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| **Architecture** | `.openkb/10-arsitektur/ARCHITECTURE.md` | Astro SSR + Cloudflare Workers architecture |
| **Deployment** | `.openkb/30-deploy/deployment.md` | Build & deploy workflow |
| **Sentry Setup** | `sentry.client.config.js`, `sentry.server.config.js` | Sentry initialization |
| **Build Config** | `astro.config.mjs` | Astro + Sentry integration |

---

## 🎓 Learning Resources

- [Sentry Astro Integration Docs](https://docs.sentry.io/platforms/javascript/guides/astro/)
- [Astro SSR Architecture](https://docs.astro.build/en/concepts/ssr/)
- [Cloudflare Workers Runtime](https://developers.cloudflare.com/workers/runtime-apis/)
- [Source Maps Explained](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map)

---

**Last Updated:** 15 Juni 2026  
**Maintained by:** timitasib@gmail.com (IT/Teknis)  
**Status:** ✅ Production behavior documented

---

*"Dual upload adalah fitur, bukan bug. Ini memastikan error tracking akurat di kedua runtime."*