# Panduan Upload Foto ke Google Drive (Tim Media ASIB)

> **Arsitektur:** Setiap event = 1 folder Google Drive terpisah
> **Naming foto:** Bebas (direkomendasikan pakai timestamp otomatis kamera)

---

## Arsitektur Folder (Penting!)

```
Google Drive Tim Media ASIB/
├── Galeri Website/                    ← (opsional, root organizer)
│   ├── Idul Adha 1447 H/             ← Event 1 = Folder 1
│   │   ├── IMG_20260527_080045.jpg
│   │   ├── IMG_20260527_080312.jpg
│   │   └── IMG_20260527_081530.jpg
│   ├──
│   ├── Santunan Ramadhan 1447 H/     ← Event 2 = Folder 2
│   │   ├── DSC_0312.jpg
│   │   ├── DSC_0315.jpg
│   │   └── 20260315_143022.png
│   └── Wisuda Tahfiz Angkatan 3/     ← Event 3 = Folder 3
│       ├── photo_1.jpg
│       └── IMG_9876.jpeg
```

**Prinsip:**
- ✅ **Tiap event = folder terpisah** (bukan subfolder)
- ✅ **Tiap folder = 1 galeri di website**
- ✅ **Nama foto bebas** — timestamp kamera sangat direkomendasikan
- ❌ Tidak perlu rename manual ribuan foto
- ❌ Tidak perlu struktur folder kompleks

---

## Workflow Upload (Untuk Tiap Event Baru)

### Langkah 1: Buat Folder Baru untuk Event

1. Buka Google Drive di browser
2. Klik kanan di area kosong → **New folder**
3. Nama folder deskriptif dengan tanggal:
   ```
   Idul Adha 1447 H — 27 Mei 2026
   Santunan Ramadhan 1447 H — 15 Maret 2026
   Wisuda Tahfiz Angkatan 3 — 10 Februari 2026
   ```
4. Klik kanan folder baru → **Share**
5. Paste email Service Account:
   ```
   asib-gallery-reader@gen-lang-client-0412959743.iam.gserviceaccount.com
   ```
6. Set permission ke **Viewer** → klik **Share**

### Langkah 2: Upload Foto ke Folder

**Cara A: Drag & Drop (Paling Cepat)**
1. Buka folder event yang baru dibuat
2. Buka folder foto di komputer/laptop
3. Select SEMUA foto (Ctrl+A atau Cmd+A)
4. Drag → drop ke jendela Google Drive
5. Tunggu upload selesai (lihat progress di kanan bawah)

**Cara B: Dari Kamera/HP Langsung**
1. Install Google Drive app di HP
2. Login dengan timitasib@gmail.com
3. Buka folder event
4. Tap **+** → **Upload** → pilih foto dari galeri

### Langkah 3: Verifikasi

1. Refresh halaman Google Drive (F5)
2. Pastikan semua foto muncul dengan thumbnail
3. Klik 2x beberapa foto → pastikan tidak corrupt/blur
4. Cek jumlah file di pojok kanan bawah (misal: "45 items")

### Langkah 4: Informasikan ke Tim Engineering

Kirim info via WhatsApp/Email:

```
📸 GALERI BARU

Folder: Idul Adha 1447 H — 27 Mei 2026
URL: https://drive.google.com/drive/folders/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV
Jumlah foto: 45
Tanggal event: 27 Mei 2026
Kategori: Keagamaan
Judul galeri: Idul Adha 1447 H — Penyembelihan Hewan Kurban
Deskripsi: Dokumentasi kegiatan penyembelihan hewan kurban di lingkungan ASIB
```

---

## Format File yang Didukung

| Format | Ekstensi | Keterangan |
|--------|----------|------------|
| **JPEG/JPG** | `.jpg`, `.jpeg` | ✅ Rekomendasi — kompresi baik, ukuran kecil |
| **PNG** | `.png` | ✅ Jika perlu transparansi atau grafis |
| **WebP** | `.webp` | ✅ Format modern, ukuran lebih kecil |
| **HEIC** | `.heic` | ⚠️ Dari iPhone — mungkin perlu konversi ke JPG |
| **Video** | `.mp4`, `.mov` | ❌ Tidak didukung — hanya foto yang ditampilkan |

**Resolusi Rekomendasi:**
- Minimum: 1920×1080 pixels (Full HD)
- Ideal: 4032×3024 pixels (12MP smartphone)
- Maksimum upload: 5TB per file

**Ukuran File Ideal:**
- 1–5 MB per foto
- Jika > 10MB → kompresi atau resize dulu

---

## Penamaan File (Rekomendasi, Bukan Wajib)

**Sangat direkomendasikan:** Biarkan nama file dari kamera/smartphone!

### Nama File Otomatis Kamera (✅ Ideal)

**Format timestamp kamera = profesional & otentik:**

| Device | Contoh Nama File | Kelebihan |
|--------|------------------|-----------|
| **iPhone** | `IMG_20260527_080045.jpg` | Timestamp otomatis, tidak bisa dipalsukan |
| **Android** | `20260527_080045.jpg` | Timestamp otomatis, kronologis |
| **DSLR Canon** | `DSC_0312.jpg` | Sequence number, urutkan berdasarkan waktu |
| **DSLR Nikon** | `DSC_0312.jpg` | Sequence number, urutkan berdasarkan waktu |
| **Sony** | `DSC0312.jpg` | Sequence number |

**Kenapa timestamp otomatis lebih baik?**
- ✅ **Ototentik** — timestamp dari kamera, tidak bisa diedit manual
- ✅ **Kronologis** — foto otomatis terurut berdasarkan waktu pengambilan
- ✅ **Profesional** — standar dokumentasi jurnalistik
- ✅ **Efisien** — tidak perlu rename ribuan foto manual

### Jika Perlu Rename Manual

Hanya rename jika:
- Nama file tidak informatif (semua foto bernama `IMG_0001.jpg`)
- Perlu identifikasi spesifik (misal: `sambutan-ketua.jpg`, `penyerahan-hewan.jpg`)

**Format manual yang baik:**
```
01-sambutan-ketua.jpg
02-prosesi-pemotongan.jpg
03-distribusi-daging.jpg
04- dokumentasi-panitia.jpg
```

Atau dengan timestamp manual:
```
2026-05-27_080045-sambutan.jpg
2026-05-27_081200-pemotongan.jpg
```

### Contoh yang Tidak Direkomendasikan

```
IMG_0001.jpg              ❌ Generik, tidak informatif
photo (1).jpg             ❌ Ada spasi dan karakter khusus
Copy of IMG_1234.jpg      ❌ Duplikat
WhatsApp Image 2026...    ❌ Dari WhatsApp, bukan kamera asli
```

---

## Struktur Folder per Event

### Simple Structure (Rekomendasi untuk 10–100 foto)

```
Idul Adha 1447 H — 27 Mei 2026/
├── IMG_20260527_080045.jpg
├── IMG_20260527_080312.jpg
├── IMG_20260527_081530.jpg
├── IMG_20260527_082145.jpg
└── ... (semua foto langsung di root folder)
```

### With Subfolders (Jika > 100 foto atau multi-sesi)

```
Idul Adha 1447 H — 27 Mei 2026/
├── 01-Persiapan/
│   ├── IMG_20260527_070000.jpg
│   └── IMG_20260527_070500.jpg
├── 02-Penyembelihan/
│   ├── IMG_20260527_080000.jpg
│   └── IMG_20260527_081500.jpg
└── 03-Distribusi/
    ├── IMG_20260527_090000.jpg
    └── IMG_20260527_093000.jpg
```

**Tips penamaan subfolder:**
- Awali dengan nomor urut: `01-`, `02-`, `03-` → agar tersortir otomatis
- Atau awali dengan waktu: `0800-Pagi/`, `1200-Siang/`, `1600-Sore/`

---

## Checklist Kualitas Foto

### Sebelum Upload — Cek di Kamera/HP:

- [ ] **Fokus** — foto tajam, tidak blur
- [ ] **Pencahayaan** — cukup terang, tidak gelap
- [ ] **Komposisi** — subjek utama terlihat jelas
- [ ] **Orientasi** — tegak/horizontal sesuai
- [ ] **Timestamp** — pastikan tanggal/waktu kamera benar

### Setelah Upload — Cek di Google Drive:

- [ ] Thumbnail muncul (tidak icon generic)
- [ ] Preview bisa dibuka (tidak error/corrupt)
- [ ] Jumlah file sesuai dengan yang diupload
- [ ] Tidak ada file duplikat

---

## Workflow Lengkap: Dari Kamera → Website

### Hari H (Saat Event)

1. **Persiapan Kamera/HP**
   - Pastikan baterai penuh
   - Kosongkan storage jika perlu
   - Set timestamp kamera ke tanggal & waktu yang benar

2. **Ambil Foto**
   - Dokumentasikan setiap momen penting
   - Ambil multiple angle untuk momen kunci
   - Cek hasil foto langsung (zoom in) — blur/pucat? foto ulang

3. **Backup Langsung (Opsional tapi Recommended)**
   - Upload ke Google Photos (auto-backup)
   - Atau transfer ke laptop sore hari

### Hari H+1 (Setelah Event)

1. **Transfer ke Komputer**
   - Dari kamera: pakai kabel USB atau card reader
   - Dari HP: Google Drive app, AirDrop, atau kabel

2. **Review & Filter**
   - Hapus foto blur, gelap, atau duplikat
   - Pilih yang terbaik (kualitas > kuantitas)
   - Ideal: 30–100 foto per event

3. **Buat Folder di Google Drive**
   - Nama: `{Kategori} — {Nama Event} — {Tanggal}`
   - Contoh: `Keagamaan — Idul Adha 1447 H — 27 Mei 2026`
   - Share ke Service Account

4. **Upload**
   - Drag & drop semua foto terpilih
   - Tunggu selesai

5. **Verifikasi**
   - Cek thumbnail & preview
   - Hitung jumlah foto

### Inform ke Tim Engineering

Template pesan:
```
📸 Galeri Baru Siap Publish

Event: Idul Adha 1447 H
Tanggal: 27 Mei 2026
Kategori: Keagamaan
Jumlah foto: 45
Folder URL: [paste dari browser]

Judul yang diinginkan: Idul Adha 1447 H — Penyembelihan Hewan Kurban
Deskripsi: Dokumentasi kegiatan penyembelihan hewan kurban yang diadakan 
di halaman Yayasan ASIB. Dihadiri oleh pengurus, donatur, dan warga sekitar.

Deadline publish: [jika ada]
```

---

## Contoh Skenario Lengkap

### Skenario 1: Event Idul Adha (45 foto)

**Tim Media:**
1. Ambil foto dengan iPhone (auto-timestamp: IMG_20260527_xxxxxx.jpg)
2. Review & filter → 45 foto terbaik
3. Buat folder: `Idul Adha 1447 H — 27 Mei 2026`
4. Share ke: `asib-gallery-reader@gen-lang-client-0412959743.iam.gserviceaccount.com`
5. Upload 45 foto ke folder (drag & drop)
6. Kirim info ke Tim Engineering

**Tim Engineering:**
1. Buka folder → copy URL
2. Daftarkan di `src/data/galleries.ts`:
   ```typescript
   {
     slug: 'keagamaan-idul-adha-1447h',
     title: 'Idul Adha 1447 H — Penyembelihan Hewan Kurban',
     description: 'Dokumentasi kegiatan penyembelihan...',
     folderId: '1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV',
     category: 'keagamaan',
     eventDate: '2026-05-27',
     published: true,
   }
   ```
3. Jalankan: `bun run gallery:cache`
4. Build & deploy
5. Website live di: `/galeri/keagamaan-idul-adha-1447h`

### Skenario 2: Tambah Foto ke Event yang Sudah Ada

**Tim Media:**
1. Buka folder yang sudah ada (`Idul Adha 1447 H...`)
2. Upload foto tambahan (tidak perlu rename)
3. Info ke Tim Engineering: "Tambahan 5 foto di folder Idul Adha"

**Tim Engineering:**
1. Jalankan: `bun run gallery:cache` (fetch ulang dari folder yang sama)
2. Build & deploy
3. Foto baru otomatis muncul di website

---

## Troubleshooting

### Foto tidak muncul di website setelah upload

**Cek:**
1. Folder sudah di-share ke Service Account email?
2. Tim Engineering sudah jalankan `bun run gallery:cache`?
3. Website sudah di-deploy ulang?
4. Format file didukung (JPG/PNG/WebP)?

### Tidak bisa upload ke folder

**Solusi:**
1. Pastikan login dengan akun yang punya akses edit (timitasib@gmail.com)
2. Cek storage Google Drive — masih cukup?
3. Refresh halaman (F5) → coba lagi
4. Coba cara upload lain (drag-drop vs tombol New)

### Foto corrupt setelah upload

**Cek:**
1. File asli di komputer masih bagus?
2. Jika ya → hapus di Drive → upload ulang
3. Jika tidak → ambil dari backup (Google Photos, SD card backup)

### Folder tidak bisa di-share

**Cek:**
1. Anda punya permission "Editor" di folder tersebut?
2. Jika bukan owner → minta owner untuk share
3. Atau buat folder baru sendiri → upload ulang

---

## FAQ (Pertanyaan Umum)

### Q: Apakah saya harus rename semua foto?

**A:** Tidak! Biarkan nama dari kamera (IMG_2026xxxx_xxxxxx.jpg) — itu justru lebih otentik dan profesional.

### Q: Berapa banyak foto per event?

**A:** Ideal 30–100 foto. Cukup untuk menceritakan event lengkap tanpa overwhelming.

### Q: Bisa upload video?

**A:** Bisa upload ke Drive, tapi video tidak akan muncul di website (sistem hanya mendukung foto). Video bisa di-share via YouTube atau link terpisah.

### Q: Foto dari WhatsApp bisa?

**A:** Bisa, tapi kualitas biasanya turun (compressed). Lebih baik ambil langsung dari kamera atau minta file asli dari fotografer.

### Q: Bagaimana jika satu event punya 200+ foto?

**A:** Bagi menjadi subfolder per sesi (01-Pagi, 02-Siang, 03-Malam) atau filter lebih ketat — pilih yang terbaik saja.

### Q: Apakah saya bisa hapus foto dari website?

**A:** Ya, hapus dari folder Google Drive → info ke Tim Engineering untuk rebuild.

### Q: Bisa ganti nama folder setelah upload?

**A:** Bisa rename folder di Drive — tidak akan merusak website. Tapi jangan ganti Folder ID (itu tetap sama).

---

## Link Penting

| Tujuan | URL |
|--------|-----|
| **Folder Galeri** | https://drive.google.com/drive/folders/1g2ISaHQI3lRU1fh8N5U2coFVYt4sktDm |
| **Google Drive** | https://drive.google.com |
| **Cek Storage** | https://one.google.com/storage |
| **Download Backup & Sync** | https://www.google.com/drive/download/ |
| **Dokumentasi Teknis (Engineering)** | `GALERI_GOOGLE_DRIVE.md` |

---

## Kontak & Bantuan

| Masalah | Hubungi |
|---------|---------|
| Tidak bisa upload / Folder error | Tim Media — cek akun & koneksi |
| Foto tidak muncul di website | Tim Engineering — cek cache & deploy |
| Butuh bantuan teknis upload | Tim IT — training & troubleshooting |
| Request fitur baru website | Tim Engineering — evaluasi & development |

---

## Ringkasan Cepat (Print & Simpan)

```
┌─────────────────────────────────────────────┐
│  UPLOAD FOTO EVENT KE WEBSITE ASIB          │
├─────────────────────────────────────────────┤
│                                             │
│  1. BUAT FOLDER BARU di Google Drive        │
│     Nama: "Idul Adha 1447 H — 27 Mei 2026"  │
│                                             │
│  2. SHARE FOLDER ke:                        │
│     asib-gallery-reader@...                 │
│     (set permission: Viewer)                │
│                                             │
│  3. UPLOAD FOTO                             │
│     • Drag & drop semua foto                │
│     • Tidak perlu rename!                   │
│     • Biarkan nama dari kamera              │
│                                             │
│  4. INFO KE ENGINEERING                     │
│     • URL folder                            │
│     • Jumlah foto                           │
│     • Judul & deskripsi galeri              │
│                                             │
│  ✅ SELESAI — tunggu website update          │
│                                             │
└─────────────────────────────────────────────┘

Format foto yang diterima:
• JPG / JPEG (recommended)
• PNG
• WebP

Direkomendasikan:
• Timestamp otomatis kamera: IMG_20260527_080045.jpg
• Resolusi minimal 1920×1080
• Ukuran 1–5 MB per foto

Hubungi jika ada masalah:
📱 [WhatsApp Tim Engineering]
📧 [Email Tim Engineering]
```
