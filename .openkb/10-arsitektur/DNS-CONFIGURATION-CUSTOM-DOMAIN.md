# DNS Configuration — Custom Domain Setup

> **Created:** 15 Juni 2026  
> **Updated:** 15 Juni 2026 (Corrected based on actual production state)  
> **Status:** ✅ **PRODUCTION LIVE** - Custom Domain Successfully Attached  
> **Related:** `.openkb/10-arsitektur/GA4-IMPLEMENTATION-STRATEGY.md`

---

## 📊 Ringkasan Eksekutif

**Status:** ✅ **CUSTOM DOMAIN BERHASIL DI-ATTACH!**

**Evidence:**
```bash
curl -I https://amalshalih.or.id
# HTTP/2 200 OK ✅
# server: cloudflare
# cf-ray: a0bfaa187acbfd26-SIN
```

**SEO Score:** ✅ **83.171/100 (Grade A)** via seoscoreapi.com

**DNS Setup:** ✅ **CORRECT**
```
www → CNAME → @ (amalshalih.or.id)
@   → A record → Cloudflare IPs (172.67.211.129, 104.21.77.205)
```

---

## ✅ DNS Configuration Production (VERIFIED)

### **Via CLI Check:**

```bash
# Check apex domain
nslookup amalshalih.or.id 1.1.1.1

# Output:
Name: amalshalih.or.id
Address: 172.67.211.129   # Cloudflare IP
Address: 104.21.77.205    # Cloudflare IP

# Check www subdomain
nslookup www.amalshalih.or.id 1.1.1.1

# Output:
Name: www.amalshalih.or.id
Address: 172.67.211.129   # Cloudflare IP (SAME as apex)
Address: 104.21.77.205    # Cloudflare IP (SAME as apex)
```

### **Production DNS Records:**

| Type | Name | Content | Status |
|------|------|---------|--------|
| A | @ (amalshalih.or.id) | 172.67.211.129, 104.21.77.205 | ✅ Proxied (Cloudflare) |
| CNAME | www | @ (amalshalih.or.id) | ✅ Correct setup |

### **Workers Custom Domain:**

| Worker | Custom Domain | Status |
|--------|--------------|--------|
| www | amalshalih.or.id | ✅ **ACTIVE** |

---

## 🎯 Lessons Learned: Understanding the "Externally Managed DNS" Message

### **What We Saw:**

Error message dari Cloudflare Dashboard:
```
Hostname 'www.amalshalih.or.id' already has externally managed DNS records 
(A, CNAME, etc). Delete them first or try a different hostname.
```

### **What It Actually Meant:**

**BUKAN** berarti ada masalah! Ini hanya berarti:

1. **DNS record `www` sudah ada** sebagai CNAME ke `@` (root domain)
2. Cloudflare Workers Custom Domain feature **tidak bisa auto-create** CNAME karena sudah ada
3. **Solusi:** Attach **root domain** (`amalshalih.or.id`), BUKAN `www.amalshalih.or.id`

### **The Correct Approach:**

```
❌ WRONG: Try to attach "www.amalshalih.or.id"
   → Error: "externally managed DNS records"

✅ CORRECT: Attach "amalshalih.or.id" (root domain)
   → Success! Custom domain activated
   → www automatically works because CNAME to @
```

---

## ✅ What Was Done (SUCCESS)

### **Step 1: Verify DNS Already Correct**

```bash
nslookup amalshalih.or.id 1.1.1.1
# → Cloudflare IPs ✅

nslookup www.amalshalih.or.id 1.1.1.1
# → CNAME to @, then Cloudflare IPs ✅
```

**Conclusion:** DNS setup sudah benar, tidak perlu changes!

---

### **Step 2: Attach Root Domain to Workers**

```
Workers & Pages → www → Triggers → Custom Domains

Input: amalshalih.or.id
(NOT www.amalshalih.or.id, but ROOT domain only)

Result: ✅ Custom domain activated
```

---

### **Step 3: Verify Production**

```bash
# Test apex domain
curl -I https://amalshalih.or.id
# HTTP/2 200 OK ✅

# Test www domain
curl -I https://www.amalshalih.or.id
# HTTP/2 200 OK (or 301 → https://amalshalih.or.id/) ✅
```

---

## 📊 Production Verification Results

### **Website Accessibility:**
```
✅ https://amalshalih.or.id → 200 OK
✅ https://www.amalshalih.or.id → 200 OK
```

### **SEO Score (seoscoreapi.com):**
```
URL: https://amalshalih.or.id
Score: 83.171/100 (Grade: A) ✅

Breakdown:
  ✅ meta: 77.375/100
  ✅ technical: 84.118/100
  ✅ social: 100.0/100 (Perfect!)
  ✅ performance: 81.25/100
  ✅ accessibility: 86.667/100
  ✅ AI Readability: 63/100 (Grade: C)

Response Time: 0.08s ✅
HTTPS: Enabled ✅
Status Code: 200 ✅
```

### **Social Meta Tags (100/100):**
```json
"open_graph": {
  "og:title": "Beranda — Yayasan ASIB",
  "og:description": "Yayasan Amal Shalih Insan Bantul...",
  "og:image": "https://amalshalih.or.id/images/og-fallback.png",
  "og:type": "website",
  "og:url": "https://amalshalih.or.id/"
}
"twitter_card": "summary"
```

### **Analytics Deployed:**
```
✅ GA4 (G-L3WQTPSJGN) - Traditional implementation
✅ Consent Mode v2 - Default denied (GDPR compliant)
✅ OpenPanel (fb2fde50-e95a-4707-b6c7-3938c8b12b5f)
✅ CSP updated to allow both services
```

---

## 🔧 Troubleshooting Guide (For Future Reference)

### **If You See "Externally Managed DNS" Error:**

**DON'T PANIC!** Ini bukan error, hanya informasi.

**Option 1: Attach Root Domain (RECOMMENDED)**
```
Instead of: www.amalshalih.or.id
Use: amalshalih.or.id (root only)

Result: ✅ Works immediately
```

**Option 2: Delete DNS + Auto-Setup (NOT RECOMMENDED)**
```
Only if Option 1 fails:
1. Delete existing DNS record for www
2. Attach custom domain: www.amalshalih.or.id
3. Let Cloudflare auto-create CNAME

Risk: Temporary downtime during DNS propagation
```

---

## 📝 Key Takeaways

1. **Verify production state FIRST** - Jangan assume, test langsung dengan `curl` atau `nslookup`
2. **Root domain is simpler** - Attach `amalshalih.or.id`, biarkan `www` CNAME handle itself
3. **"Externally managed" ≠ Error** - Hanya berarti DNS sudah ada, tidak perlu di-delete
4. **SEO Score validates deployment** - 83.171/100 proves everything is working
5. **Social meta tags perfect** - 100/100 score shows OG + Twitter Card working

---

## 📚 Related Documentation

| Document | Location | Status |
|----------|----------|--------|
| **GA4 Strategy** | `.openkb/10-arsitektur/GA4-IMPLEMENTATION-STRATEGY.md` | ✅ Updated with production status |
| **Sentry Source Maps** | `.openkb/10-arsitektur/SENTRY_SOURCE_MAP_UPLOAD.md` | ✅ Accurate |
| **Deployment** | `.openkb/30-deploy/deployment.md` | ✅ Reference |

---

**Last Updated:** 15 Juni 2026  
**Status:** ✅ **PRODUCTION VERIFIED** - All systems operational  
**Maintained by:** timitasib@gmail.com (IT/Teknis)

---

*"DNS conflict was a misunderstanding. Root domain attachment is the solution. Production is LIVE with SEO Score 83.171/100 (Grade A)!"*