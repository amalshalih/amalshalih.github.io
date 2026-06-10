# 🚀 Deployment Guide — Yayasan ASIB

**Last Updated:** 10 Juni 2026  
**Status:** ✅ Production Ready

---

## 📋 Deployment Environments

| Environment | Worker Name | Domain | Preview URL | Config File |
|-------------|-------------|--------|-------------|-------------|
| **Production** | `www` | `amalshalih.or.id` | `www.asib.workers.dev` | `wrangler.jsonc` |
| **Staging** | `www-staging` | `staging.amalshalih.or.id`* | `www-staging.asib.workers.dev` | `wrangler.staging.jsonc` |

\* *Perlu setup custom domain di Cloudflare Dashboard untuk staging*

---

## 🎯 Quick Deploy Commands

### **Production Deployment** (Live Site)

```bash
# Build + Deploy to production
bun run deploy

# Or manually
bun run build
npx wrangler deploy
```

**Deploys to:**
- Worker: `www`
- Domain: `amalshalih.or.id`
- Preview: `www.asib.workers.dev`

---

### **Staging Deployment** (Testing)

```bash
# Build + Deploy to staging
bun run deploy:staging

# Or manually
bun run build
npx wrangler deploy --config wrangler.staging.jsonc
```

**Deploys to:**
- Worker: `www-staging`
- Domain: `staging.amalshalih.or.id` (if configured)
- Preview: `www-staging.asib.workers.dev`

---

### **Local Development**

```bash
# Start local dev server
bun run dev

# Or with Workers emulator
bun run wrangler:dev
```

**Access at:** `http://localhost:4321`

---

## 📦 What Gets Deployed

### **Production (`wrangler.jsonc`)**

```jsonc
{
  "name": "www",
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "2026-06-01",
  "compatibility_flags": ["nodejs_compat"],
  "vars": {
    "NODE_ENV": "production"
  },
  "kv_namespaces": [
    { "binding": "SESSION", "id": "1fcf5a834af8489790a5e55793205d2a" },
    { "binding": "LIKES", "id": "0525d17bcb8b43098ec8415b976e2dca" }
  ],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist"
  },
  "observability": {
    "enabled": true
  }
}
```

**Features:**
- ✅ Sentry error tracking enabled
- ✅ Production environment variables
- ✅ Cloudflare Assets binding
- ✅ KV namespaces (SESSION, LIKES)
- ✅ Observability enabled

---

### **Staging (`wrangler.staging.jsonc`)**

```jsonc
{
  "name": "www-staging",
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "2026-06-01",
  "compatibility_flags": ["nodejs_compat"],
  "vars": {
    "NODE_ENV": "staging"
  },
  "kv_namespaces": [
    { "binding": "SESSION", "id": "1fcf5a834af8489790a5e55793205d2a" },
    { "binding": "LIKES", "id": "0525d17bcb8b43098ec8415b976e2dca" }
  ],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist"
  },
  "observability": {
    "enabled": true
  }
}
```

**Differences from Production:**
- Worker name: `www-staging` instead of `www`
- Environment: `staging` instead of `production`
- Uses same KV namespaces (shared for testing)

---

## 🔐 Environment Variables

### **Required for Deployment**

| Variable | Scope | Description |
|----------|-------|-------------|
| `CLOUDFLARE_API_TOKEN` | Deploy | Cloudflare API token with Workers permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Deploy | Your Cloudflare account ID |
| `SENTRY_AUTH_TOKEN` | Build | Sentry auth token for source maps |

### **Runtime Variables** (in `.dev.vars` or Cloudflare Dashboard)

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY` | ✅ | Google Drive API credentials (JSON) |
| `RESEND_API_KEY` | ✅ | Resend email API key |
| `SANITY_API_READ_TOKEN` | ✅ | Sanity CMS read token |
| `SENTRY_DSN` | Optional | Sentry DSN for error tracking |

---

## 📝 Deployment Checklist

### **Before Production Deploy**

- [ ] All tests passing (`bun run test`)
- [ ] E2E tests passing (`bunx playwright test`)
- [ ] TypeScript check passes (`bun run typecheck`)
- [ ] Linting passes (`bun run lint`)
- [ ] Build succeeds (`bun run build`)
- [ ] Preview locally (`bun run preview`)
- [ ] Test critical flows (homepage, contact, gallery, blog)
- [ ] Review git diff (`git diff origin/main`)
- [ ] Create git tag (optional): `git tag v1.2.0 && git push origin v1.2.0`

### **After Production Deploy**

- [ ] Check Worker is live: `https://www.asib.workers.dev`
- [ ] Verify custom domain: `https://amalshalih.or.id`
- [ ] Test contact form submission
- [ ] Check Sentry for errors: [sentry.io](https://sentry.io)
- [ ] Monitor Web Vitals (browser console)
- [ ] Clear CDN cache if needed (Cloudflare Dashboard)

---

## 🔄 Deployment Workflows

### **Manual Deploy** (Recommended for now)

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies
bun install

# 3. Run tests
bun run test
bunx playwright test

# 4. Build
bun run build

# 5. Deploy to production
bun run deploy

# Or deploy to staging first
bun run deploy:staging
```

### **CI/CD Deploy** (GitHub Actions)

Configure `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Build
        run: bun run build
      
      - name: Deploy to Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
```

---

## 🎛️ Cloudflare Dashboard Setup

### **1. Custom Domain (Production)**

1. Go to **Workers & Pages** → `www`
2. Click **Triggers** → **Custom Domains**
3. Add domain: `amalshalih.or.id`
4. Follow DNS configuration instructions

### **2. Custom Domain (Staging)**

1. Go to **Workers & Pages** → `www-staging`
2. Click **Triggers** → **Custom Domains**
3. Add domain: `staging.amalshalih.or.id`
4. Follow DNS configuration instructions

### **3. Environment Variables**

1. Go to **Workers & Pages** → `www` (or `www-staging`)
2. Click **Settings** → **Variables**
3. Add variables:
   - `GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY`
   - `RESEND_API_KEY`
   - `SANITY_API_READ_TOKEN`
4. Click **Save**

### **4. KV Namespaces**

Already configured in `wrangler.jsonc`:
- `SESSION` - Session storage
- `LIKES` - Like counter + cache

No manual setup needed.

---

## 🐛 Troubleshooting

### **"Worker not found"**

```bash
# Check worker exists
npx wrangler whoami

# List workers
npx wrangler worker list
```

### **"Domain not configured"**

1. Check DNS records in Cloudflare Dashboard
2. Ensure CNAME points to `www.asib.workers.dev`
3. Wait for DNS propagation (up to 24 hours)

### **"Build failed"**

```bash
# Check for TypeScript errors
bun run typecheck

# Check for linting errors
bun run lint

# Check build output
bun run build --verbose
```

### **"Deployment failed"**

```bash
# Check Cloudflare API token
npx wrangler whoami

# Regenerate token: https://dash.cloudflare.com/profile/api-tokens
# Required scopes: Workers Scripts, KV Storage

# Retry deployment
bun run deploy
```

---

## 📊 Monitoring After Deploy

### **1. Check Worker Logs**

```bash
# Tail logs in real-time
npx wrangler tail
```

### **2. Sentry Errors**

Visit: [https://sentry.io](https://sentry.io) → Project: `amalshalih`

### **3. Web Vitals**

Open browser console on production site:
```javascript
// Look for [Web Vitals] logs
[Web Vitals] { name: 'LCP', value: 1234, rating: 'good', ... }
```

### **4. Cloudflare Analytics**

Visit: Cloudflare Dashboard → **Workers & Pages** → `www` → **Analytics**

---

## 🎯 Best Practices

1. **Always test on staging first** before production
2. **Run full test suite** before every deploy
3. **Deploy during low-traffic hours** (avoid prayer times, events)
4. **Monitor Sentry** for 1 hour after deploy
5. **Keep changelog** in `.sisyphus/IMPROVEMENT_SUMMARY.md`
6. **Tag releases** with semantic versioning (`v1.2.0`)
7. **Backup KV data** before major migrations

---

## 📚 Related Documentation

- **Improvement Summary:** `.sisyphus/IMPROVEMENT_SUMMARY.md`
- **Wrangler Configs:** `docs/wrangler-configs.md`
- **Web Vitals:** `docs/web-vitals.md`
- **E2E Tests:** `test/e2e/README.md` (to be created)

---

## 🆘 Support

For deployment issues:
- **Cloudflare Docs:** [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
- **Wrangler CLI:** [developers.cloudflare.com/workers/wrangler](https://developers.cloudflare.com/workers/wrangler)
- **Sentry Docs:** [docs.sentry.io](https://docs.sentry.io)

**Internal Contact:** PT Koneksi Jaringan Indonesia (Engineering Team)

---

*Last verified: 10 Juni 2026*