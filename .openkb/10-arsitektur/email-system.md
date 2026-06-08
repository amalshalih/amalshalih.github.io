# Email System — Yayasan Amal Shalih Insan Bantul

> **Status:** ✅ **FULLY OPERATIONAL** — All Verified & Active (7 Juni 2026)  
> **Teknologi:** Cloudflare Email Routing → Gmail Existing (IT / Admin / Media)  
> **Domain:** amalshalih.or.id (aktif) + amalshalih.id (legacy → redirect for brand protection)  
> 
> **Dokumen ini bagian dari workspace management — baca docs/10-organisasi/ untuk konteks penuh.**

---

## 📧 Daftar Email & Routing Structure

### **Konteks Historis & Filosofis**

> **PENTING:** Sistem email saat ini adalah hasil evolusi dari kondisi desentralisasi (masing-masing pengurus buat Gmail sendiri) menuju sentralisasi terkontrol. Kita TIDAK memutus sistem yang sudah berjalan, tapi **mengelola realita yang ada** dengan prinsip:
> 
> 1. **Jangan ganggu operasional** — email existing tetap dipakai
> 2. **Sentralisasi routing** — Cloudflare Email Routing untuk custom domain
> 3. **Single Owner per Email** — setiap email kritis dipegang 1 orang terpercaya
> 4. **Recovery Chain** — timitasib@gmail.com recovery untuk semua akun kritis

### **Struktur Email Saat Ini (Production)**

#### **A. Email Kritis (Single Owner - Trusted Person)**

| Email | Owner | Role | Responsibility | Status |
|-------|-------|------|----------------|--------|
| **amalshalih.insanbantul@gmail.com** | 1 orang (Admin) | Email Utama | - Administratif & Akuntabilitas<br>- Login SOSMED (IG, FB, TikTok, YT, Linktree, Google Business)<br>- Public-facing (pengaduan, kerjasama)<br>- Folder `Kantor ASIB` di Drive | ✅ Verified |
| **timitasib@gmail.com** | 1 orang (IT) | IT/Teknis | - Recovery SEMUA akun<br>- IT/Teknis kritis (domain, hosting, SEO)<br>- Folder `IT/Teknis` di Drive<br>- Approve relawan AMMA<br>- Inspeksi `Workspace ASIB` | ✅ Verified |
| **media.amalshalih@gmail.com** | 1 orang (Pengurus Media) | Media & Publikasi | - Pengelolaan konten<br>- Folder `Media & Publikasi` di Drive<br>- Supervisi relawan media<br>- Login Google Photos | ✅ Verified |

**Catatan Penting:**
- ✅ Setiap email dipegang **1 orang terpercaya** (bukan "tim")
- ✅ **timitasib@gmail.com** recovery untuk email utama & media
- ✅ 2FA mandatory dengan QR di owner + IT backup

#### **B. Email Routing (@amalshalih.or.id via Cloudflare)**

| Email @amalshalih.or.id | Routing To | Owner | Purpose | Status |
|-------------------------|------------|-------|---------|--------|
| **info@** | timitasib@gmail.com | IT | Informasi umum, technical inquiries | ✅ Verified & Active |
| **donasi@** | amalshalih.insanbantul@gmail.com | Admin | Konfirmasi donasi, laporan donasi | ✅ Verified & Active |
| **admin@** | amalshalih.insanbantul@gmail.com | Admin | Administrasi, surat-menyurat | ✅ Verified & Active |
| **humas@** | amalshalih.insanbantul@gmail.com | Admin | Public inquiries, media relations | ✅ Verified & Active |
| **Catch-all** | timitasib@gmail.com | IT | Email ke alamat tidak terdaftar | ✅ Verified & Active |

**Key Decision (7 Juni 2026):**
- ✅ **humas@ → Admin** (bukan Media) untuk efisiensi administratif
- ✅ Media fokus ke content creation, tidak handle correspondence
- ✅ See: `docs/10-organisasi/humas-decision-analysis.md` untuk trade-off lengkap

**Future (Optional):**
- Jika Google for Nonprofit ACC → bisa migrate ke `@amalshalih.or.id` direct
- For now: Cloudflare Email Routing sudah efektif & gratis

---

## 🛠️ Cara Kerja Email Routing

### **Arsitektur Teknis**

```
Pengirim → info@amalshalih.or.id
                ↓
        Cloudflare Email Routing
                ↓
        MX: route1/2/3.mx.cloudflare.net
        SPF: v=spf1 include:_spf.mx.cloudflare.net ~all
        DKIM: cf2024-1._domainkey.amalshalih.or.id
                ↓
        timitasib@gmail.com (inbox)
```

**Penjelasan:**
1. Cloudflare menerima email di `@amalshalih.or.id`
2. Otomatis forward ke Gmail destination yang sudah verified
3. Gmail terima email dengan label sesuai filter
4. Bisa reply dari alamat custom via SMTP Gmail

### **DNS Configuration (Auto-managed by Cloudflare)**

Setelah Email Routing diaktifkan, Cloudflare otomatis menambahkan:

| Type | Name | Content | Priority | Note |
|------|------|---------|----------|------|
| MX | amalshalih.or.id | route1.mx.cloudflare.net | 37 | Auto-added |
| MX | amalshalih.or.id | route2.mx.cloudflare.net | 68 | Auto-added |
| MX | amalshalih.or.id | route3.mx.cloudflare.net | 22 | Auto-added |
| TXT | amalshalih.or.id | v=spf1 include:_spf.mx.cloudflare.net ~all | - | SPF record |
| TXT | cf2024-1._domainkey | DKIM key (RSA 2048) | - | Auto-generated |

> **⚠️ JANGAN dihapus atau diedit manual** — Cloudflare mengelola ini otomatis. Jika ada issue, contact IT.

---

## 📥 Untuk Pemegang Email — Cara Pakai

### **Untuk Admin (amalshalih.insanbantul@gmail.com)**

**Anda menerima:**
- Email ke `donasi@amalshalih.or.id`
- Email ke `admin@amalshalih.or.id`
- Email ke `humas@amalshalih.or.id`
- Email ke `amalshalih.insanbantul@gmail.com` (direct)

**Setup Gmail Filters:**
1. Buka Gmail → ⚙️ Settings → **See all settings**
2. Tab **Filters and Blocked Addresses** → **Create a new filter**
3. Buat filter untuk masing-masing:

**Filter 1 (Donasi):**
```
To: donasi@amalshalih.or.id
Create filter → Apply label: "Donasi" (color: green)
```

**Filter 2 (Admin):**
```
To: admin@amalshalih.or.id
Create filter → Apply label: "Admin" (color: yellow)
```

**Filter 3 (Humas):**
```
To: humas@amalshalih.or.id
Create filter → Apply label: "Humas" (color: blue)
```

**Setup "Send Mail As" (Reply dari alamat custom):**
1. Gmail → ⚙️ Settings → **Accounts and Import** → **Send mail as**
2. **Add another email address:**
   - Name: `Yayasan Amal Shalih Insan Bantul`
   - Email: `donasi@amalshalih.or.id`
   - **Uncheck** "Treat as an alias"
3. SMTP Settings:
   - SMTP Server: `smtp.gmail.com`
   - Port: `587`
   - Username: `amalshalih.insanbantul@gmail.com`
   - Password: **App Password** (lihat cara di bawah)
   - Secured connection: TLS
4. Ulangi untuk `admin@amalshalih.or.id` dan `humas@amalshalih.or.id`

**App Password (jika 2FA aktif):**
1. https://myaccount.google.com/security
2. **2-Step Verification** → **App passwords**
3. Pilih app: **Mail**, device: **Other** → "Cloudflare Email"
4. Copy password 16 digit → gunakan di SMTP setting

---

### **Untuk IT (timitasib@gmail.com)**

**Anda menerima:**
- Email ke `info@amalshalih.or.id`
- Email ke `catch-all` (alamat tidak terdaftar)
- Email ke `timitasib@gmail.com` (direct)

**Setup Gmail Filters:**
```
Filter 1 (Info):
To: info@amalshalih.or.id
Apply label: "Info" (color: red)

Filter 2 (Catch-all):
To: [any other @amalshalih.or.id]
Apply label: "Catch-all" (color: gray)
```

**Setup "Send Mail As":**
```
Email: info@amalshalih.or.id
SMTP: smtp.gmail.com:587
Username: timitasib@gmail.com
Password: App Password
```

**Recovery Responsibility:**
- ✅ Backup QR code untuk email utama & media
- ✅ Monitor semua inbox via forwarding
- ✅ Approve relawan AMMA untuk akses layanan
- ✅ Inspeksi berkala `Workspace ASIB`

---

### **Untuk Media (media.amalshalih@gmail.com)**

**Note Penting:**
- humas@ **TIDAK** forwarded ke Anda (dikelola Admin)
- Fokus Anda: **Content creation & social media management**
- Correspondence administratif handled by Admin

**Anda menerima:**
- Email ke `media.amalshalih@gmail.com` (direct)
- Email dari Google Photos, Canva, social media platforms

**Setup Gmail Filters:**
```
Filter untuk platform:
From: instagram@facebook.com → label "Instagram"
From: notifications@tiktok.com → label "TikTok"
From: youtube-noreply@google.com → label "YouTube"
```

**Google Drive Access:**
- Manage folder: `Media & Publikasi` di `Workspace ASIB`
- Relawan media dapat access ke folder ini (view/comment)
- Draft konten dalam Google Docs di folder ini

---

## 🛠️ Untuk Tim IT — Panduan Teknis

### **Stack & Biaya**

| Komponen | Provider | Cost | Note |
|----------|----------|------|------|
| Email Routing | Cloudflare | $0 (free) | Included with domain |
| DNS | Cloudflare | $0 (free) | Managed automatically |
| Inbox | Gmail | $0 (free) | Existing accounts |
| **Total** | | **$0/year** | Gratis! |

### **Manajemen via CLI (Wrangler)**

```bash
# Cek status routing
wrangler email routing settings amalshalih.or.id

# Lihat semua rules
wrangler email routing rules list amalshalih.or.id

# Lihat destination addresses
wrangler email routing addresses list

# Tambah rule baru
wrangler email routing rules create amalshalih.or.id \
  --name "DonasiRule" \
  --match-type "literal" \
  --match-field "to" \
  --match-value "donasi@amalshalih.or.id" \
  --action-type "forward" \
  --action-value "amalshalih.insanbantul@gmail.com"

# Hapus rule
wrangler email routing rules delete amalshalih.or.id <RULE_ID>

# Disable catch-all sementara
wrangler email routing rules update amalshalih.or.id catch-all \
  --action-type "drop"
```

### **Manajemen via Dashboard Cloudflare**

1. Login: https://dash.cloudflare.com
2. Pilih domain: **amalshalih.or.id**
3. Sidebar → **Email** → **Email Routing**
4. Dari sini bisa:
   - Tambah/hapus rules
   - Lihat logs
   - Manage destination addresses
   - View analytics

### **Log & Monitoring**

- **Email routing logs:** Dashboard Cloudflare → Email → Email Routing → **View logs**
- **Error monitoring:** Sentry (project dashboard) atau `wrangler logs`
- **Delivery issues:** Cek spam folder Gmail dulu, lalu logs Cloudflare

---

## 🔄 Domain Strategy

### **Dual-Domain Protection**

| Domain | Purpose | Status | Note |
|--------|---------|--------|------|
| **amalshalih.or.id** | Active domain untuk semua operasional | ✅ Production | Email, website, semua layanan |
| **amalshalih.id** | Legacy domain - brand protection | ✅ Redirect 301 | Mencegah penyalahgunaan nama yayasan |

**Redirect Configuration:**
```
amalshalih.id (legacy)
       ↓ (301 Permanent Redirect)
amalshalih.or.id (active)
```

**Why Keep amalshalih.id?**
- ✅ Mencegah pihak lain pakai nama yayasan
- ✅ Protect brand & reputation
- ✅ SEO value tetap terjaga
- ✅ Auto-renew (jangan sampai expired!)

**Ownership:**
- Kedua domain atas nama: **Yayasan Amal Shalih Insan Bantul**
- Managed by: **timitasib@gmail.com** (IT)
- Renewal: Auto-renew recommended

---

## 🔒 Security & 2FA

### **Mandatory 2FA untuk Semua Email Kritis**

| Email | 2FA Required | QR Code Stored In | Recovery |
|-------|--------------|-------------------|----------|
| amalshalih.insanbantul@gmail.com | ✅ Yes | - Owner's Google Auth<br>- Copy di timitasib@gmail.com's Auth | timitasib@gmail.com |
| timitasib@gmail.com | ✅ Yes | timitasib@gmail.com's Auth | - |
| media.amalshalih@gmail.com | ✅ Yes | - Owner's Google Auth<br>- Copy di timitasib@gmail.com's Auth | timitasib@gmail.com |

**Policy:**
- QR code HARUS ada di 2 tempat: owner + IT backup
- Backup codes print 3 copies: IT, Pengurus, Bendahara
- Review 2FA status quarterly

### **App Password Setup**

Untuk SMTP "Send Mail As":
1. https://myaccount.google.com/security
2. **2-Step Verification** → **App passwords**
3. Pilih app: **Mail**, device: **Other**
4. Ketik label: "Cloudflare Email Routing"
5. Copy password 16 digit
6. Gunakan di SMTP setting Gmail
7. **Delete** password dari clipboard setelah dipakai

---

## 📊 Troubleshooting

| Masalah | Possible Cause | Solusi |
|---------|----------------|--------|
| **Email tidak masuk** | - Spam filter<br>- Rule salah<br>- Destination tidak verified | 1. Cek spam folder Gmail<br>2. Verify rule di Cloudflare dashboard<br>3. Cek destination address status |
| **SPF error** | TXT record hilang | Verify TXT record `v=spf1 include:_spf.mx.cloudflare.net ~all` masih ada |
| **DKIM error** | DKIM key issue | Cloudflare auto-manage — cek di dashboard Email → DKIM |
| **Verifikasi email gagal** | Email belum verified | Resend verification dari Cloudflare dashboard → Destination addresses |
| **Gmail reject kirim** | Wrong password | Pastikan pakai **App Password**, bukan password biasa |
| **Reply dari alamat salah** | "Send mail as" belum setup | Setup SMTP untuk setiap alamat custom (lihat section di atas) |

---

## 📝 Perubahan di Website

Setelah email aktif, update website:

1. **Footer/kontak:**
   ```
   Email: info@amalshalih.or.id (umum)
          donasi@amalshalih.or.id (donasi)
          admin@amalshalih.or.id (administrasi)
   ```

2. **Halaman kontak:**
   - Update form action atau display email
   - Add email routing explanation

3. **Business Profile:**
   - Google Business Profile → update email
   - Instagram/FB/TikTok → update email di bio
   - Linktree → update contact email

---

## 📚 Referensi & Related Docs

- **Cloudflare Email Routing docs:** https://developers.cloudflare.com/email-routing/
- **Tech guide:** https://altersquare.medium.com/free-custom-domain-emails-with-gmail-and-cloudflare-a-beginners-guide-84d759b373f7
- **Internal docs:**
  - `docs/10-organisasi/struktur-dan-role.md` — Role & responsibility
  - `docs/10-organisasi/humas-decision-analysis.md` — humas@ routing decision
  - `docs/40-it-teknis/security.md` — Security guidelines & 2FA
  - `docs/40-it-teknis/credentials.md` — Password manager setup

---

**Last Updated:** 7 Juni 2026  
**Status:** ✅ All Verified & Active  
**Maintained by:** Tim IT (timitasib@gmail.com)  
**Next Review:** 7 Desember 2026

---

*"Email adalah tulang punggung komunikasi digital. Kelola dengan amanah, jaga dengan ketat, dokumentasikan dengan rapi."*