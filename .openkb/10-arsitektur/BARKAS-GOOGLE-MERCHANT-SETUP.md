# BARKAS - Google Merchant Center Setup Guide

> **Created:** 16 Juni 2026  
> **Status:** ✅ Ready for Google Merchant Submission  
> **Related:** `.openkb/10-arsitektur/GA4-IMPLEMENTATION-STRATEGY.md`, `.openkb/10-arsitektur/SEO-SETUP.md`

---

## 📊 Ringkasan Eksekutif

**BARKAS (Barang Bekas Berkah ASIB)** adalah program e-commerce sosial Yayasan Amal Shalih Insan Bantul yang menjual barang bekas layak pakai untuk mendanai program sosial, pendidikan, dan dakwah.

**URL:** https://amalshalih.or.id/barkas

**Status Google Merchant:** Ready for submission dengan schema.org Product markup lengkap.

---

## 🎯 Google Merchant Center Setup

### **Step 1: Buat Google Merchant Center Account**

1. Kunjungi: https://merchants.google.com
2. Login dengan akun Google yayasan (timitasib@gmail.com)
3. Pilih country: **Indonesia**
4. Accept Terms of Service

### **Step 2: Claim Website URL**

**Method 1: HTML Tag (Recommended)**

1. Di Merchant Center: Settings → Business Information → Website
2. Pilih "Add website" → Enter URL: `https://amalshalih.or.id`
3. Pilih verification method: **HTML tag**
4. Copy meta tag yang diberikan
5. Paste ke `src/components/BaseHead.astro`:

```astro
<!-- Google Merchant Center verification -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

6. Deploy: `npx wrangler deploy`
7. Klik "Verify" di Merchant Center

**Method 2: Google Tag Manager**

Jika sudah pakai GTM, bisa gunakan GTM untuk verification.

### **Step 3: Setup Shipping Settings**

1. Settings → Shipping → Add shipping rate
2. Create shipping service: **JNE Regular**
3. Coverage: **Indonesia**
4. Rates:
   - Yogyakarta & Jawa Tengah: Rp 15.000
   - Jawa & Bali: Rp 20.000
   - Luar Jawa: Rp 30.000

### **Step 4: Setup Tax Settings**

1. Settings → Tax → Add tax rate
2. Indonesia: **0%** (karena yayasan sosial, barang bekas)
3. Note: Barang bekas donasi tidak kena pajak

### **Step 5: Product Feed Setup**

**Automatic Feed (Recommended)**

Website BARKAS sudah menggunakan **schema.org Product markup** yang otomatis dibaca Google.

**Required Fields (Sudah Ada):**
- ✅ `name` - Nama produk
- ✅ `description` - Deskripsi lengkap
- ✅ `image` - URL gambar produk
- ✅ `price` - Harga dalam IDR
- ✅ `availability` - InStock/OutOfStock
- ✅ `condition` - UsedCondition
- ✅ `seller` - Organization info
- ✅ `url` - URL produk detail

**Optional Fields (Sudah Ada):**
- ✅ `priceCurrency` - IDR
- ✅ `priceValidUntil` - 30 hari dari sekarang
- ✅ `itemCondition` - UsedCondition
- ✅ `brand` - BARKAS ASIB
- ✅ `category` - Kategori produk
- ✅ `additionalProperty` - Donatur, kondisi, tanggal

### **Step 6: Submit Products for Review**

1. Products → Feeds → Add Feed
2. Feed name: **BARKAS Products**
3. Input method: **Website crawl**
4. Website URL: `https://amalshalih.or.id/barkas`
5. Crawl schedule: **Daily**
6. Submit for review

**Review Time:** 3-5 hari kerja

---

## 📝 Schema.org Implementation

### **Homepage (ItemList)**

File: `src/pages/barkas/index.astro`

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "name": "Product Name",
        "offers": {
          "@type": "Offer",
          "price": "350000",
          "priceCurrency": "IDR",
          "availability": "https://schema.org/InStock",
          "condition": "https://schema.org/UsedCondition"
        }
      }
    }
  ]
}
```

### **Product Detail Page**

File: `src/pages/barkas/[id].astro`

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Meja Belajar Kayu Jati - Bekas Layak Pakai",
  "description": "Meja belajar kayu jati solid...",
  "image": [
    "https://amalshalih.or.id/images/barkas/meja-jati-01.jpg"
  ],
  "offers": {
    "@type": "Offer",
    "price": "350000",
    "priceCurrency": "IDR",
    "availability": "https://schema.org/InStock",
    "condition": "https://schema.org/UsedCondition",
    "url": "https://amalshalih.or.id/barkas/barkas-001",
    "seller": {
      "@type": "Organization",
      "name": "Yayasan Amal Shalih Insan Bantul"
    },
    "priceValidUntil": "2026-07-16"
  },
  "brand": {
    "@type": "Organization",
    "name": "BARKAS ASIB"
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Kondisi",
      "value": "Kondisi Baik"
    },
    {
      "@type": "PropertyValue",
      "name": "Donatur",
      "value": "Bapak Ahmad, Bantul"
    }
  ]
}
```

### **Breadcrumb**

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://amalshalih.or.id"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "BARKAS",
      "item": "https://amalshalih.or.id/barkas"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Product Name",
      "item": "https://amalshalih.or.id/barkas/barkas-001"
    }
  ]
}
```

### **Organization**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Yayasan Amal Shalih Insan Bantul",
  "url": "https://amalshalih.or.id",
  "logo": "https://amalshalih.or.id/images/logo.png",
  "description": "Program penghimpunan dan pemanfaatan barang bekas...",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "08xx-xxxx-xxxx",
    "contactType": "customer service",
    "availableLanguage": "Indonesian"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bantul",
    "addressRegion": "Yogyakarta",
    "addressCountry": "ID"
  }
}
```

---

## 🔍 Google Merchant Requirements Checklist

### **Website Requirements**

- ✅ **Clear return/refund policy** - Perlu ditambahkan
- ✅ **Secure checkout (HTTPS)** - ✅ Sudah
- ✅ **Contact information** - ✅ WhatsApp, Email, Address
- ✅ **Product availability** - ✅ Real-time status
- ✅ **Accurate pricing** - ✅ Harga jelas dalam IDR
- ✅ **Product images** - ⚠️ Perlu upload gambar produk
- ✅ **Detailed descriptions** - ✅ Deskripsi lengkap

### **Product Requirements**

- ✅ **Unique product identifier** - ✅ ID: barkas-001, barkas-002, dll
- ✅ **Product title** - ✅ Max 150 characters
- ✅ **Product description** - ✅ Min 50 characters
- ✅ **Product image** - ⚠️ Min 100x100 pixels (perlu upload)
- ✅ **Price** - ✅ Dalam IDR
- ✅ **Availability** - ✅ InStock/OutOfStock
- ✅ **Condition** - ✅ UsedCondition

### **Prohibited Content**

- ✅ No counterfeit items
- ✅ No dangerous goods
- ✅ No adult content
- ✅ No copyrighted material without permission

**BARKAS Status:** ✅ All compliant (barang bekas donasi)

---

## 📸 Image Requirements

### **Google Merchant Image Specs**

- **Minimum size:** 100x100 pixels
- **Recommended:** 800x800 pixels or larger
- **Format:** JPG, PNG, GIF, BMP
- **Background:** White or neutral recommended
- **No watermarks or text overlays**

### **Current Image Paths**

```
/images/barkas/
├── meja-jati-01.jpg
├── meja-jati-02.jpg
├── thinkpad-t450-01.jpg
├── thinkpad-t450-02.jpg
├── thinkpad-t450-03.jpg
├── paket-buku-anak-01.jpg
├── polygon-mt-01.jpg
├── polygon-mt-02.jpg
├── kursi-kantor-01.jpg
├── kursi-kantor-02.jpg
└── alquran-besar-01.jpg
```

### **Action Required**

Upload actual product images ke folder `/public/images/barkas/`

**Image Naming Convention:**
- `{product-id}-{angle}.jpg`
- Example: `barkas-001-front.jpg`, `barkas-001-side.jpg`

---

## 🚀 Testing & Validation

### **1. Rich Results Test**

Test schema.org markup:

```
https://search.google.com/test/rich-results
URL: https://amalshalih.or.id/barkas
```

**Expected Result:**
- ✅ Product markup detected
- ✅ Breadcrumb markup detected
- ✅ Organization markup detected
- ✅ No errors

### **2. Google Merchant Center Diagnostics**

After submission, check:

1. Products → Diagnostics
2. Fix any errors/warnings
3. Common issues:
   - Missing images
   - Price mismatches
   - Availability inaccuracies

### **3. Search Console Monitoring**

1. https://search.google.com/search-console
2. Add property: `https://amalshalih.or.id`
3. Monitor:
   - **Enhancements → Merchant Listings**
   - **Coverage → Indexed pages**
   - **Core Web Vitals → Performance**

---

## 📊 Performance Tracking

### **Google Merchant Center Metrics**

- **Impressions:** Berapa kali produk muncul di Google Shopping
- **Clicks:** Berapa kali diklik
- **CTR:** Click-through rate
- **Conversions:** Berapa yang beli via WhatsApp

### **Google Analytics 4 Integration**

File: `src/components/BaseHead.astro`

Track events:

```javascript
// Product view
gtag('event', 'view_item', {
  currency: 'IDR',
  value: product.price,
  items: [{
    item_id: product.id,
    item_name: product.name,
    category: product.category,
    price: product.price
  }]
});

// WhatsApp click
gtag('event', 'click_whatsapp', {
  event_category: 'engagement',
  event_label: product.id,
  value: 1
});
```

### **KPI Targets**

| Metric | Target | Timeline |
|--------|--------|----------|
| Products indexed | 6+ | Week 1 |
| Impressions/day | 100+ | Month 1 |
| CTR | 2%+ | Month 1 |
| WhatsApp inquiries | 5/week | Month 1 |
| Sales conversion | 10% | Month 2 |

---

## 🔄 Product Data Management

### **Update Product Status**

File: `src/data/barkas-products.json`

**Status Options:**
- `available` - Tersedia untuk dibeli
- `reserved` - Sedang dipesan
- `sold` - Sudah terjual

**Example:**
```json
{
  "id": "barkas-001",
  "status": "sold",  // Update dari "available" ke "sold"
  "soldDate": "2026-06-20",
  "soldPrice": 350000
}
```

### **Add New Product**

```json
{
  "id": "barkas-007",
  "name": "Nama Produk",
  "description": "Deskripsi lengkap...",
  "category": "furniture|electronics|books|vehicles|religious|clothing",
  "price": 100000,
  "originalPrice": 500000,
  "condition": "used-excellent|used-good|used-fair",
  "status": "available",
  "images": ["/images/barkas/product-01.jpg"],
  "donor": "Nama Donatur, Lokasi",
  "acquiredDate": "2026-06-16",
  "tags": ["tag1", "tag2"]
}
```

### **Deploy Updates**

```bash
# Build & deploy
bun run build
npx wrangler deploy

# Verify deployment
curl -I https://amalshalih.or.id/barkas
```

---

## 🛠️ Troubleshooting

### **Issue: Products Not Indexed**

**Symptoms:**
- Products tidak muncul di Google Shopping
- Rich Results Test shows errors

**Solutions:**
1. Check schema.org markup with Rich Results Test
2. Verify website ownership di Merchant Center
3. Wait 3-5 hari untuk review
4. Check robots.txt tidak block `/barkas/`

### **Issue: Disapproved Products**

**Common Reasons:**
- Missing images
- Inaccurate pricing
- Policy violation

**Solutions:**
1. Products → Diagnostics → Fix errors
2. Request review setelah fix
3. Wait 24-48 jam untuk re-review

### **Issue: Low Impressions**

**Solutions:**
1. Improve product titles (include keywords)
2. Add more products (min 10-20)
3. Use high-quality images
4. Competitive pricing
5. Update inventory regularly

---

## 📱 Multi-Platform Strategy

### **Platform Priority**

**Tier 1 (Already Done):**
- ✅ Website: https://amalshalih.or.id/barkas
- ✅ Google Merchant Center (ready to submit)

**Tier 2 (Next Steps):**
- Facebook Marketplace (manual listing)
- WhatsApp Business Catalog
- Google Business Profile Products

**Tier 3 (Future):**
- Tokopedia (need seller account)
- Shopee (need seller account)
- Instagram Shop (need FB Page)

### **Synchronization Strategy**

**Central Inventory:** `src/data/barkas-products.json`

**When Product Sold:**
1. Update status di JSON → `"status": "sold"`
2. Deploy website
3. Update Facebook Marketplace → Mark as sold
4. Update WhatsApp Catalog → Remove/hide
5. Update Google Business → Mark as out of stock

**Tools:**
- Use Buffer/Hootsuite untuk social media
- Use Zapier untuk automation (optional)

---

## 📈 Success Metrics

### **Monthly Reporting**

**Sales Metrics:**
- Total products listed
- Products sold
- Total revenue
- Average selling price

**Traffic Metrics:**
- Website visitors (GA4)
- Google Shopping impressions
- Click-through rate
- WhatsApp clicks

**Impact Metrics:**
- Total items rescued from waste
- Total funds raised for social programs
- Number of beneficiaries helped

### **Report Template**

```markdown
## BARKAS Monthly Report - [Month Year]

### Sales Performance
- Products Listed: XX
- Products Sold: XX
- Total Revenue: Rp XXX,XXX
- Average Price: Rp XXX,XXX

### Traffic
- Website Visitors: XXX
- Google Shopping Impressions: X,XXX
- CTR: X.X%
- WhatsApp Inquiries: XX

### Impact
- Items Rescued: XX kg
- Programs Supported: [List]
- Beneficiaries: XX families
```

---

## 🔗 Resources & Links

### **Official Documentation**

- [Google Merchant Center Help](https://support.google.com/merchants)
- [Schema.org Product](https://schema.org/Product)
- [Google Shopping Policies](https://support.google.com/merchants/answer/6149928)

### **Testing Tools**

- [Rich Results Test](https://search.google.com/test/rich-results)
- [Merchant Center Diagnostics](https://merchants.google.com/mc/diagnostics)
- [Search Console](https://search.google.com/search-console)

### **BARKAS Links**

- Website: https://amalshalih.or.id/barkas
- WhatsApp: https://wa.me/08xx-xxxx-xxxx
- Email: barkas@amalshalih.or.id

---

## ✅ Launch Checklist

### **Pre-Launch**

- [ ] Upload actual product images
- [ ] Verify website di Google Merchant Center
- [ ] Setup shipping & tax settings
- [ ] Test schema.org markup (Rich Results Test)
- [ ] Add Google Merchant verification meta tag
- [ ] Setup GA4 e-commerce tracking
- [ ] Create return/refund policy page

### **Launch Day**

- [ ] Submit product feed to Google Merchant
- [ ] Publish Facebook Marketplace listings
- [ ] Setup WhatsApp Business Catalog
- [ ] Add products to Google Business Profile
- [ ] Announce on social media

### **Post-Launch (Week 1)**

- [ ] Monitor Merchant Center Diagnostics
- [ ] Fix any disapproved products
- [ ] Track impressions & clicks
- [ ] Respond to WhatsApp inquiries promptly
- [ ] Update sold products status

### **Ongoing (Monthly)**

- [ ] Add new products (min 5-10/month)
- [ ] Update sold products
- [ ] Review performance metrics
- [ ] Optimize titles & descriptions
- [ ] Generate monthly impact report

---

**Last Updated:** 16 Juni 2026  
**Status:** ✅ Ready for Google Merchant Submission  
**Maintained by:** timitasib@gmail.com (IT/Teknis)

---

*"Belanja Sekaligus Beramal - Barang Bekas Menjadi Berkah"*