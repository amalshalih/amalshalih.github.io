# 📋 STRATEGI COMMIT - Astro v6 + Cloudflare Workers Cleanup

**Tanggal:** 1 Juni 2026  
**Total Perubahan:** 16 modified, 2 deleted, 7 untracked  
**Tujuan:** Organisasi commit yang bersih dan atomic

---

## 🎯 Prinsip Commit

1. **Atomic commits** - Satu logical change per commit
2. **Conventional commits** - Format: `type(scope): description`
3. **Terurut** - Dependencies dulu, features kemudian
4. **Dokumentasi terpisah** - Docs di commit terakhir

---

## 📦 Urutan Commit (Rekomendasi)

### Commit 1: `chore(gitignore): add sensitive files and artifacts`

**Files:** `.gitignore` (modified)

```bash
git add .gitignore
git commit -m "chore(gitignore): add sensitive files and build artifacts

- Firebase service account JSON
- Google Drive service account JSON  
- Wrangler build artifacts
- Cache directories"
```

---

### Commit 2: `chore(config): streamline astro and wrangler configuration`

**Files:** `astro.config.mjs`, `wrangler.jsonc`, `package.json`

```bash
git add astro.config.mjs wrangler.jsonc package.json
git commit -m "chore(config): streamline astro and wrangler configuration

Astro config:
- Remove prerenderEnvironment: 'node'
- Remove unnecessary ssr.external array
- Remove optimizeDeps.exclude
- Keep minimal, clean configuration

Wrangler config:
- Change main to direct entry path
- Add assets binding with ASSETS
- Add KV bindings (SESSION, LIKES)
- Add observability config

Package scripts:
- Simplify wrangler:dev and wrangler:deploy
- Remove cd dist/server workaround"
```

---

### Commit 3: `refactor(workerd): migrate to Web Crypto API and clean env access`

**Files:** Firebase, Google Drive, Gallery API, Env types

```bash
git add src/lib/firebase/admin.ts src/lib/google-drive.ts \
  src/data/galleries.ts src/pages/api/drive-image/[id].ts \
  src/env.d.ts
git commit -m "refactor(workerd): migrate to Web Crypto API and clean env access

Firebase admin:
- Replace node:crypto with Web Crypto API
- Replace node:fs with env access
- Remove node:path dependency
- Use crypto.subtle.importKey and crypto.subtle.sign

Google Drive API:
- Remove process.env fallback
- Use Web Crypto API for JWT

Gallery data:
- Remove process.env fallbacks
- Use cloudflare:workers env"
```

---

### Commit 4: `fix(api): add galleries endpoint and clean like APIs`

**Files:** galleries.ts (new), like.ts, gallery-like.ts, like/[slug].ts (deleted)

```bash
git add src/pages/api/galleries.ts
git add src/pages/api/like.ts src/pages/api/gallery-like.ts
git rm src/pages/api/like/[slug].ts
git commit -m "fix(api): add galleries endpoint and clean like APIs

New endpoint:
- Add /api/galleries - fetch from Google Drive
- Returns transformed gallery data

Like APIs cleanup:
- Consolidate like endpoints
- Remove duplicate /api/like/[slug].ts
- Use env.LIKES KV binding"
```

---

### Commit 5: `fix(routing): fix SSR mode for dynamic detail pages`

**Files:** kegiatan/[slug].astro, blog/[slug].astro, galeri.astro

```bash
git add src/pages/kegiatan/[slug].astro src/pages/blog/[slug].astro \
  src/pages/galeri.astro
git commit -m "fix(routing): fix SSR mode for dynamic detail pages

CRITICAL FIX - 404 errors resolved:
- Change prerender = true to false
- Remove getStaticPaths
- Fetch data at request time
- Fix kegiatan and blog detail pages"
```

---

### Commit 6: `chore(sentry): update configuration for Cloudflare Workers`

**Files:** sentry.client.config.js, sentry.server.config.js

```bash
git add sentry.client.config.js sentry.server.config.js
git commit -m "chore(sentry): update configuration for Cloudflare Workers"
```

---

### Commit 7: `chore(cleanup): remove legacy wrangler config generator`

**Files:** scripts/generate-wrangler-config.mjs (deleted)

```bash
git rm scripts/generate-wrangler-config.mjs
git commit -m "chore(cleanup): remove legacy wrangler config generator

Astro v6 auto-generates wrangler.json - no manual script needed"
```

---

### Commit 8: `docs(audit): add comprehensive technical documentation`

**Files:** All .md audit files

```bash
git add *.md .sisyphus/plans/*.md
git commit -m "docs(audit): add comprehensive technical documentation

- Workerd compatibility audit
- Configuration analysis
- Migration guides and best practices
- Error documentation"
```

---

## 🚀 Eksekusi Cepat

```bash
# COMMIT 1: Gitignore
git add .gitignore
git commit -m "chore(gitignore): add sensitive files and build artifacts"

# COMMIT 2: Core Config
git add astro.config.mjs wrangler.jsonc package.json
git commit -m "chore(config): streamline astro and wrangler configuration"

# COMMIT 3: Workerd Compatibility
git add src/lib/firebase/admin.ts src/lib/google-drive.ts \
  src/data/galleries.ts src/pages/api/drive-image/[id].ts src/env.d.ts
git commit -m "refactor(workerd): migrate to Web Crypto API and clean env access"

# COMMIT 4: API Endpoints
git add src/pages/api/galleries.ts
git add src/pages/api/like.ts src/pages/api/gallery-like.ts
git rm src/pages/api/like/[slug].ts
git commit -m "fix(api): add galleries endpoint and clean like APIs"

# COMMIT 5: Routing Fix (CRITICAL)
git add src/pages/kegiatan/[slug].astro src/pages/blog/[slug].astro src/pages/galeri.astro
git commit -m "fix(routing): fix SSR mode for dynamic detail pages"

# COMMIT 6: Sentry
git add sentry.client.config.js sentry.server.config.js
git commit -m "chore(sentry): update configuration for Cloudflare Workers"

# COMMIT 7: Cleanup
git rm scripts/generate-wrangler-config.mjs
git commit -m "chore(cleanup): remove legacy wrangler config generator"

# COMMIT 8: Documentation
git add *.md .sisyphus/plans/*.md
git commit -m "docs(audit): add comprehensive technical documentation"

# VERIFIKASI
git log --oneline -8
git status
```

---

## 📊 Mapping: File → Commit

| File | Change | Commit # |
|------|--------|----------|
| `.gitignore` | Modified | 1 |
| `astro.config.mjs` | Modified | 2 |
| `wrangler.jsonc` | Modified | 2 |
| `package.json` | Modified | 2 |
| `src/lib/firebase/admin.ts` | Modified | 3 |
| `src/lib/google-drive.ts` | Modified | 3 |
| `src/data/galleries.ts` | Modified | 3 |
| `src/pages/api/drive-image/[id].ts` | Modified | 3 |
| `src/env.d.ts` | Modified | 3 |
| `src/pages/api/galleries.ts` | New | 4 |
| `src/pages/api/like.ts` | Modified | 4 |
| `src/pages/api/gallery-like.ts` | Modified | 4 |
| `src/pages/api/like/[slug].ts` | Deleted | 4 |
| `src/pages/kegiatan/[slug].astro` | Modified | 5 |
| `src/pages/blog/[slug].astro` | Modified | 5 |
| `src/pages/galeri.astro` | Modified | 5 |
| `sentry.client.config.js` | Modified | 6 |
| `sentry.server.config.js` | Modified | 6 |
| `scripts/generate-wrangler-config.mjs` | Deleted | 7 |
| `*.md` (docs) | New | 8 |

---

## ✅ Post-Commit Checklist

```bash
# Verifikasi
git log --oneline -10
git status  # Harus: nothing to commit

# Test production
curl -s https://www.asib.workers.dev/ | head -1
curl -s https://www.asib.workers.dev/api/galleries | jq '. | length'
```
