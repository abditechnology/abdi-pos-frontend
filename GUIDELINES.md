# 📘 Panduan Pengguna Abdi POS (User Guidelines)

Selamat datang di **Abdi POS**! 👋  
Panduan ini disusun khusus untuk membantu Anda—baik sebagai **Pemilik Usaha (Owner)**, **Manajer Cabang**, maupun **Kasir Operasional**—dalam menggunakan aplikasi kasir dan manajemen bisnis Abdi POS sehari-hari.

Bahasa yang digunakan di sini santai, ringan, dan langsung ke intinya agar Anda bisa langsung mahir tanpa perlu bingung dengan istilah teknis!

---

## 🧭 Daftar Isi
1. [Mengenal Antarmuka & Layar Utama](#1-mengenal-antarmuka--layar-utama)
2. [Alur Harian Kasir (Buka Shift hingga Tutup Toko)](#2-alur-harian-kasir-buka-shift-hingga-tutup-toko)
3. [Cara Melayani Transaksi di Layar Kasir (POS)](#3-cara-melayani-transaksi-di-layar-kasir-pos)
4. [Mengganti Cabang / Outlet (Multi-Cabang)](#4-mengganti-cabang--outlet-multi-cabang)
5. [Membaca & Memantau Data di Dashboard](#5-membaca--memantau-data-di-dashboard)
6. [Mengenal Notifikasi & Dialog Konfirmasi](#6-mengenal-notifikasi--dialog-konfirmasi)
7. [Tips Pintasan Keyboard (Biar Kerjanya Sat-Set!)](#7-tips-pintasan-keyboard-biar-kerjanya-sat-set)
8. [Tanya Jawab Singkat (FAQ)](#8-tanya-jawab-singkat-faq)

---

## 1. Mengenal Antarmuka & Layar Utama

Saat Anda membuka aplikasi Abdi POS, layar terbagi menjadi 3 area utama yang sangat mudah dipahami:

```
+-----------------------------------------------------------------------------------+
|  [Logo Abdi POS]     [Martabak Nusantara / Dashboard]    [Outlet: Pusat v] [Buka POS F2] [🔔] [Profil v] |
+------------------+----------------------------------------------------------------+
|  MENU UTAMA      |                                                                |
|  - Dashboard     |   AREA KONTEN UTAMA                                            |
|  - Kasir (POS)   |   (Statistik Omset, Grafik Penjualan, Tabel Struk Kasir,      |
|  OPERASIONAL     |    Peringatan Bahan Menipis, dan Menu Terlaris)                |
|  - Transaksi     |                                                                |
|  - Shift Kasir   |                                                                |
|  MASTER DATA     |                                                                |
|  - Produk        |                                                                |
|  - Stok          |                                                                |
|  ...             |                                                                |
+------------------+----------------------------------------------------------------+
```

### A. Bagian Atas (Header Bar)
- **Nama Bisnis & Breadcrumb**: Menunjukkan nama tenant bisnis Anda (misal: *Martabak & Terang Bulan Nusantara*) serta posisi halaman yang sedang Anda buka.
- **Pemilih Cabang (Outlet Selector)**: Kotak biru yang menampilkan cabang yang sedang aktif. Anda bisa berpindah cabang kapan saja dengan mengkliknya.
- **Tombol Pintas "Buka POS" (F2)**: Tombol warna biru menyala di kanan atas untuk melompat langsung ke layar transaksi kasir.
- **Lonceng Notifikasi (🔔)**: Menampilkan pemberitahuan terkini, misalnya jika stok bahan baku hampir habis atau ada pembayaran QRIS yang baru masuk.
- **Profil Pengguna**: Menampilkan nama dan peran (*role*) Anda saat ini (misal: *Ahmad Najib - Owner & Admin*).

### B. Bagian Kiri (Sidebar Navigasi)
Berisi seluruh menu yang tersusun rapi:
- **Menu Utama**: Dashboard ringkasan, Kasir (POS), dan Demo Komponen.
- **Operasional**: Riwayat struk transaksi, pencatatan shift kasir, dan pesanan self-order meja.
- **Master Data**: Katalog produk makanan/minuman, kategori menu, persediaan bahan, dan data member.
- **Promosi**: Pengaturan diskon, promo bundling, dan tebus murah.
- **Laporan & Outlet**: Laporan omset keuangan dan daftar cabang Anda.
- **Pengaturan**: Domain bisnis dan paket langganan SaaS.

> 💡 **Tips Nyaman**: Jika Anda ingin layar terlihat lebih lega (terutama di layar tablet kasir), klik tanda panah kecil di samping logo Abdi POS untuk **menciutkan sidebar**.

---

## 2. Alur Harian Kasir (Buka Shift hingga Tutup Toko)

Agar pencatatan uang kas di laci tidak ada selisih, ikuti alur rutin berikut setiap hari:

```mermaid
flowchart LR
    A["1. Datang & Login"] --> B["2. Pilih Cabang"]
    B --> C["3. Buka Shift Kasir<br>(Input Uang Modal)"]
    C --> D["4. Layani Penjualan (POS)"]
    D --> E["5. Tutup Shift<br>(Hitung Uang Fisik)"]
    E --> F["6. Rekap & Cetak Laporan"]
```

### Langkah demi Langkah:
1. **Pilih Cabang Anda**: Pastikan di pojok kanan atas nama cabang sudah sesuai dengan tempat Anda bertugas hari ini (misalnya: *Outlet Pusat - Sudirman*).
2. **Buka Shift Kasir**: Masukkan jumlah uang modal awal (uang receh/kembalian di laci kas).
3. **Mulai Berjualan**: Gunakan menu **Point of Sale (POS)** sepanjang jam kerja.
4. **Tutup Shift di Akhir Hari**:
   - Di dashboard atau menu *Shift Kasir*, pilih **"Tutup Shift Kasir"**.
   - Akan muncul jendela konfirmasi peringatan berwarna kuning.
   - Masukkan hasil hitungan fisik uang tunai di laci kasir.
   - Sistem akan mencocokkan otomatis uang fisik dengan catatan transaksi. Jika ada selisih, sistem akan memberitahukan secara transparan.

---

## 3. Cara Melayani Transaksi di Layar Kasir (POS)

Untuk masuk ke layar kasir, klik tombol biru **"Buka POS"** di header atas atau cukup tekan tombol **`F2`** di keyboard Anda.

Layar kasir dirancang dengan dua kolom utama:
- **Sebelah Kiri**: Katalog Menu & Pencarian Produk.
- **Sebelah Kanan**: Keranjang Pesanan Aktif & Pembayaran.

### Alur Melayani Pelanggan:

#### 1. Menemukan Menu Pesanan
- **Gunakan Bar Pencarian**: Ketik sebagian nama produk (contoh: `"keju"` atau `"coklat"`), atau scan barcode produk menggunakan alat barcode scanner.
- **Gunakan Filter Kategori**: Klik tombol kategori di bawah kotak pencarian, misalnya tombol **"Terang Bulan"**, **"Martabak Telur"**, atau **"Minuman"** untuk menyaring menu dengan cepat.

#### 2. Memasukkan Menu ke Keranjang
- Cukup **klik kartu menu** yang diinginkan.
- Produk otomatis masuk ke keranjang di sebelah kanan, dan notifikasi hijau kecil akan muncul mengonfirmasi item berhasil ditambahkan.
- Ingin menambah jumlah? Klik tanda tambah `(+)` atau klik menu tersebut lagi. Ingin mengurangi? Klik tanda kurang `(-)`.

#### 3. Memeriksa Rincian Biaya
Sistem akan langsung menghitung secara otomatis:
- **Subtotal**: Total harga barang yang dipilih.
- **Pajak (PB1 10%)**: Pajak restoran yang berlaku (dihitung otomatis).
- **Total Tagihan**: Jumlah bersih yang harus dibayar pelanggan.

#### 4. Memilih Metode Pembayaran
Pilih salah satu dari 3 tombol metode bayar di bawah keranjang:
- **QRIS**: Untuk pembayaran non-tunai via aplikasi dompet digital (GoPay, OVO, Dana, BCA, dll.).
- **Tunai (Cash)**: Untuk pembayaran dengan uang tunai fisik.
- **Debit**: Untuk pembayaran kartu gesek / mesin EDC bank.

#### 5. Selesaikan Transaksi
- Klik tombol biru besar **"Bayar & Cetak Struk"**.
- Transaksi langsung tersimpan aman di sistem cloud, struk otomatis tercetak, dan keranjang siap melayani antrean pelanggan berikutnya! 🚀

---

## 4. Mengganti Cabang / Outlet (Multi-Cabang)

Jika bisnis Anda memiliki lebih dari 1 cabang (misalnya Cabang Sudirman, Cabang Tebet, dan Cabang Kelapa Gading), Anda tidak perlu login ulang untuk melihat data cabang lain:

1. Di header bagian atas, klik tombol **"Cabang Aktif"** (yang berikon toko).
2. Daftar seluruh cabang yang Anda miliki akan terbuka dalam menu tarik-turun (*dropdown*).
3. Klik nama cabang yang ingin Anda lihat.
4. Selesai! Seluruh data di layar (stok bahan, transaksi terakhir, grafik penjualan) akan langsung berganti mengikuti cabang yang baru Anda pilih.

---

## 5. Membaca & Memantau Data di Dashboard

Dashboard adalah ruang kendali bisnis Anda. Begitu Anda membuka aplikasi, 4 kartu utama langsung memberikan gambaran performa hari ini:

1. **Total Omset Hari Ini**: Jumlah seluruh uang masuk hari ini dari semua transaksi yang telah lunas.
2. **Jumlah Transaksi**: Berapa banyak struk atau pelanggan yang sudah berbelanja hari ini.
3. **Rata-rata Keranjang (Basket Size)**: Rata-rata nominal belanja per pelanggan (sangat berguna untuk mengukur efektivitas program *upselling* Anda).
4. **Kas Shift Berjalan**: Berapa banyak uang tunai fisik yang seharusnya ada di kasir saat ini.

### Widget Pendukung Lainnya di Dashboard:
- **Grafik Tren Penjualan**: Menunjukkan jam-jam tersibuk (*peak hours*) di toko Anda, sehingga Anda tahu kapan harus menambah staf dapur.
- **Peringatan Stok Menipis**: Memberitahu Anda bahan apa saja yang sisa stoknya sudah berada di bawah batas aman (misal: sisa tepung terigu atau keju). Segera lakukan belanja bahan jika item muncul di sini!
- **Menu Terlaris (Top Selling)**: Menampilkan ranking 1, 2, dan 3 menu favorit pelanggan Anda minggu ini.

---

## 6. Mengenal Notifikasi & Dialog Konfirmasi

Aplikasi Abdi POS sangat animatif dan komunikatif agar Anda tidak salah langkah saat mengoperasikannya:

### Jenis Notifikasi Toast (Pojok Kanan Atas)
- 🟢 **Hijau (Sukses)**: Berarti aksi Anda berhasil disimpan dengan sempurna (contoh: *"Transaksi #TRX-8921 berhasil dibayar"*).
- 🔴 **Merah (Error / Gagal)**: Ada masalah yang perlu diperiksa (contoh: *"Koneksi printer terputus"*).
- 🟡 **Kuning (Peringatan)**: Pengingat penting (contoh: *"Stok bahan tersisa sedikit"*).
- 🔵 **Biru (Informasi)**: Kabar sistem (contoh: *"Cabang berhasil dialihkan"*).

### Dialog Konfirmasi (Pop-up Keamanan)
Untuk tindakan yang tidak bisa dibatalkan—seperti **Membatalkan Struk yang Salah (Void)** atau **Menutup Shift Kasir**—sistem akan menampilkan jendela khusus dengan ikon berdenyut. Anda akan selalu diminta memastikan kembali pilihan Anda sebelum data resmi diubah.

---

## 7. Tips Pintasan Keyboard (Biar Kerjanya Sat-Set!)

Kasir yang handal bekerja dengan cepat! Gunakan tombol keyboard berikut:

| Tombol | Fungsi Cepat |
|---|---|
| **`F2`** | Langsung lompat ke Layar Kasir / POS dari halaman mana saja |
| **`ESC`** | Menutup jendela pop-up atau modal konfirmasi seketika |
| **`Tab`** | Berpindah ke kotak input berikutnya tanpa perlu menyentuh mouse |
| **`Enter`** | Menjalankan tombol konfirmasi utama |

---

## 8. Tanya Jawab Singkat (FAQ)

**T: Apakah kasir bisa salah melihat data cabang lain?**  
*J: Tidak. Sistem Abdi POS secara ketat membatasi hak akses kasir hanya pada cabang tempat ia ditugaskan oleh pemilik toko.*

**T: Bagaimana jika pelanggan ingin membatalkan satu pesanan di keranjang?**  
*J: Cukup klik tanda minus `(-)` pada menu tersebut sampai jumlahnya menjadi 0, maka menu akan hilang dari daftar pesanan.*

**T: Jika koneksi internet sempat lambat, apakah kasir harus klik berkali-kali?**  
*J: Jangan klik berulang kali. Tombol "Bayar" di Abdi POS dilengkapi pelindung transaksi ganda (spinner loading) sehingga mencegah terjadinya tagihan dobel ke pelanggan.*

**T: Di mana saya bisa mencoba semua tombol dan modal tanpa merusak data penjualan?**  
*J: Buka menu **"Komponen UI Showcase"** di sidebar. Di sana Anda bisa bebas menguji coba semua tombol, membuka popup modal, dan mencoba tombol notifikasi sepuasnya.*

---

> [!NOTE]  
> Dokumen panduan ini dirawat dan diperbarui secara berkala bersamaan dengan setiap pembaruan fitur aplikasi Abdi POS. Selamat melayani pelanggan dan semoga bisnis Anda semakin laris dan sukses! 🎉
