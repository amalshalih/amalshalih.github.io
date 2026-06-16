# BARKAS - Quick Start Guide

> **Created:** 16 Juni 2026  
> **Status:** ✅ Implementation Complete  
> **Time to Launch:** 1-2 jam

---

## 🎯 Apa yang Sudah Dibuat

### **Files Created:**

```
src/
├── pages/
│   └── barkas/
│       ├── index.astro      # Katalog utama dengan filter kategori
│       └── [id].astro       # Detail produk dengan schema.org
└── data/
    └── barkas-products.json # Database produk (6 sample products)

.openkb/10-arsitektur/
└── BARKAS-GOOGLE-MERCHANT-SETUP.md  # Panduan lengkap Google Merchant
```

### **Features:**

✅ **Katalog BARKAS** - https://amalshalih.or.id/barkas
- Filter by kategori (Furniture, Elektronik, Buku, dll)
- Product cards dengan harga, diskon, kondisi
- WhatsApp CTA untuk pembelian
- Impact metrics tracking

✅ **Product Detail Pages** - https://amalshalih.or.id/barkas/{id}
- Image gallery dengan thumbnails
- Schema.org Product markup (Google Merchant ready)
- Breadcrumb navigation
- WhatsApp direct purchase link
- Impact info (dana untuk program sosial)

✅ **SEO & Google Merchant**
- Schema.org Product, ItemList, Breadcrumb, Organization
- Rich snippets ready
- Mobile responsive
- Fast loading (static Astro)

✅ **Sample Products** (6 items)
- Meja Belajar Kayu Jati - Rp 350.000
- Laptop Lenovo ThinkPad T450 - Rp 2.500.000
- Paket Buku Anak (50 ekor) - Rp 500.000
- Sepeda Gunung Polygon - Rp 1.200.000
- Kursi Kantor Ergonomis - Rp 450.000
- Al-Qur'an Mushaf Utsmani - Rp 150.000

---

## 🚀 Cara Deploy

### **Step 1: Upload Product Images**

```bash
# Buat folder images
mkdir -p public/images/barkas

# Upload gambar produk (min 800x800px)
# Format: {product-id}-{angle}.jpg
# Example: barkas-001-front.jpg, barkas-001-side.jpg
```

**Required Images:**
- `/images/barkas/meja-jati-01.jpg`
- `/images/barkas/thinkpad-t450-01.jpg`
- `/images/barkas/paket-buku-anak-01.jpg`
- dst...

### **Step 2: Update Contact Info**

Edit `src/data/barkas-products.json`:

```json
{
  "programInfo": {
    "contact": {
      "whatsapp": "0812-3456-7890",  // Update dengan nomor asli
      "email": "barkas@amalshalih.or.id",
      "address": "Jl. xxx No. xxx, Bantul, Yogyakarta"
    }
  }
}
```

### **Step 3: Build & Deploy**

```bash
# Build
bun run build

# Deploy to Cloudflare Workers
npx wrangler deploy

# Verify
curl -I https://amalshalih.or.id/barkas
```

### **Step 4: Test Schema.org**

```
https://search.google.com/test/rich-results
URL: https://amalshalih.or.id/barkas
```

**Expected:** ✅ Product, Breadcrumb, Organization detected

---

## 📋 Google Merchant Setup (30 Menit)

### **1. Buat Merchant Center Account**
- https://merchants.google.com
- Login: timitasib@gmail.com
- Country: Indonesia

### **2. Claim Website**
- Settings → Business Information → Website
- Add: `https://amalshalih.or.id`
- Verification: HTML tag
- Paste meta tag ke `src/components/BaseHead.astro`

```astro
<meta name="google-site-verification" content="YOUR_CODE" />
```

### **3. Setup Shipping**
- Settings → Shipping → Add rate
- JNE Regular:
  - Jogja & Jateng: Rp 15.000
  - Jawa & Bali: Rp 20.000
  - Luar Jawa: Rp 30.000

### **4. Setup Tax**
- Settings → Tax → Add rate
- Indonesia: **0%** (yayasan sosial)

### **5. Submit Product Feed**
- Products → Feeds → Add Feed
- Name: BARKAS Products
- Input: **Website crawl**
- URL: `https://amalshalih.or.id/barkas`
- Schedule: Daily

### **6. Wait for Review**
- Review time: 3-5 hari kerja
- Check: Products → Diagnostics

---

## 🔄 Cara Update Produk

### **Tambah Produk Baru**

Edit `src/data/barkas-products.json`:

```json
{
  "id": "barkas-007",
  "name": "Nama Produk",
  "description": "Deskripsi lengkap...",
  "category": "furniture",
  "price": 100000,
  "originalPrice": 500000,
  "condition": "used-good",
  "status": "available",
  "images": ["/images/barkas/barkas-007-01.jpg"],
  "donor": "Nama Donatur",
  "acquiredDate": "2026-06-16"
}
```

### **Update Status (Sold/Reserved)**

```json
{
  "id": "barkas-001",
  "status": "sold",  // Change dari "available"
  "soldDate": "2026-06-20",
  "soldPrice": 350000
}
```

### **Deploy Changes**

```bash
bun run build
npx wrangler deploy
```

---

## 📊 Multi-Platform Listing

### **Platform Priority**

**Done:**
- ✅ Website (amalshalih.or.id/barkas)
- ✅ Google Merchant (ready to submit)

**Next (Tier 2):**
- Facebook Marketplace (manual listing)
- WhatsApp Business Catalog
- Google Business Profile Products

**Later (Tier 3):**
- Tokopedia
- Shopee
- Instagram Shop

### **Synchronization**

**When Product Sold:**
1. Update JSON → `"status": "sold"`
2. Deploy website
3. Update Facebook → Mark sold
4. Update WhatsApp → Remove
5. Update Google Business → Out of stock

---

## 📈 Tracking & Analytics

### **GA4 Events** (Optional - Add Later)

```javascript
// Product view
gtag('event', 'view_item', {
  currency: 'IDR',
  value: product.price,
  items: [{
    item_id: product.id,
    item_name: product.name,
    category: product.category
  }]
});

// WhatsApp click
gtag('event', 'click_whatsapp', {
  event_category: 'engagement',
  event_label: product.id
});
```

### **KPI Targets**

| Metric | Target | Timeline |
|--------|--------|----------|
| Products indexed | 6+ | Week 1 |
| Impressions/day | 100+ | Month 1 |
| CTR | 2%+ | Month 1 |
| WhatsApp inquiries | 5/week | Month 1 |
| Sales | 10% conversion | Month 2 |

---

## 🎨 Customization

### **Change Colors**

Edit CSS di `src/pages/barkas/index.astro`:

```css
/* Current: Green theme */
background: linear-gradient(135deg, #059669 0%, #10b981 100%);

/* Change to: Blue theme */
background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
```

### **Add Categories**

Edit `src/data/barkas-products.json`:

```json
{
  "categories": [
    {
      "id": "toys",
      "name": "Mainan Anak",
      "description": "Mainan edukatif dan hiburan"
    }
  ]
}
```

### **Add Impact Metrics**

Update impact section dengan data real:

```html
<div class="impact-number">150 kg</div>  <!-- Update manually -->
```

---

## 🛠️ Troubleshooting

### **Issue: 404 on /barkas**

**Solution:**
```bash
# Rebuild
bun run build

# Redeploy
npx wrangler deploy

# Check
curl https://amalshalih.or.id/barkas
```

### **Issue: Images Not Loading**

**Solution:**
1. Check image exists in `/public/images/barkas/`
2. Check filename matches JSON
3. Check file permissions (readable)

### **Issue: Schema.org Not Detected**

**Solution:**
1. Test: https://search.google.com/test/rich-results
2. Check JSON-LD syntax (JSONLint)
3. Deploy ulang setelah fix

---

## 📞 Support & Contact

### **Technical (IT/Teknis)**
- Email: timitasib@gmail.com
- Documentation: `.openkb/10-arsitektur/BARKAS-GOOGLE-MERCHANT-SETUP.md`

### **Program (BARKAS)**
- Email: barkas@amalshalih.or.id
- WhatsApp: 08xx-xxxx-xxxx

### **Useful Links**
- Website: https://amalshalih.or.id/barkas
- Google Merchant: https://merchants.google.com
- Rich Results Test: https://search.google.com/test/rich-results
- Search Console: https://search.google.com/search-console

---

## ✅ Launch Checklist

**Pre-Launch:**
- [ ] Upload product images
- [ ] Update contact info (WhatsApp, email)
- [ ] Test build locally
- [ ] Deploy to production

**Launch Day:**
- [ ] Submit to Google Merchant
- [ ] Post Facebook Marketplace
- [ ] Setup WhatsApp Catalog
- [ ] Announce on social media

**Post-Launch:**
- [ ] Monitor Merchant Center Diagnostics
- [ ] Track WhatsApp inquiries
- [ ] Update sold products
- [ ] Generate monthly report

---

**Status:** ✅ **READY TO LAUNCH**  
**Estimated Launch Time:** 1-2 jam (upload images + deploy)  
**Google Merchant Review:** 3-5 hari kerja

---

*"Belanja Sekaligus Beramal - Barang Bekas Menjadi Berkah"*