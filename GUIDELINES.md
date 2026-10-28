# 📘 Panduan Pengguna Abdi POS (User Guidelines)

Selamat datang di **Abdi POS**! 👋  
Panduan ini disusun khusus untuk membantu Anda—baik sebagai **Pemilik Usaha (Owner)**, **Manajer Cabang**, maupun **Kasir Operasional**—dalam menggunakan aplikasi kasir dan manajemen bisnis Abdi POS sehari-hari.

Bahasa yang digunakan di sini santai, ringan, dan langsung ke intinya agar Anda bisa langsung mahir tanpa perlu bingung dengan istilah teknis!

---

## 🧭 Daftar Isi
1. [Mengenal Antarmuka & Navigasi Utama](#1-mengenal-antarmuka--navigasi-utama)
2. [Alur Harian Kasir & Layar POS (F2)](#2-alur-harian-kasir--layar-pos-f2)
3. [Riwayat Transaksi & Cetak Ulang Struk Kasir](#3-riwayat-transaksi--cetak-ulang-struk-kasir)
4. [Buka-Tutup Shift & Rekonsiliasi Kas Laci](#4-buka-tutup-shift--rekonsiliasi-kas-laci)
5. [Kitchen Display System (KDS Live) & Self-Order QR Meja](#5-kitchen-display-system-kds-live--self-order-qr-meja)
6. [Mengelola Menu Produk, Kategori & Resep HPP](#6-mengelola-menu-produk-kategori--resep-hpp)
7. [Stok & Inventaris Bahan Baku (Stock Opname)](#7-stok--inventaris-bahan-baku-stock-opname)
8. [Program Member & Poin Loyalitas Pelanggan](#8-program-member--poin-loyalitas-pelanggan)
9. [Diskon, Voucher, Bundling & Tebus Murah](#9-diskon-voucher-bundling--tebus-murah)
10. [Membaca Laporan Keuangan & Analitik Bisnis](#10-membaca-laporan-keuangan--analitik-bisnis)
11. [Mengelola Cabang & Staf Karyawan (Hak Akses RBAC)](#11-mengelola-cabang--staf-karyawan-hak-akses-rbac)
12. [Pengaturan Toko, Custom Domain & Paket Langganan SaaS](#12-pengaturan-toko-custom-domain--paket-langganan-saas)
13. [Marketplace Plugin & Ekstensi Modular (Add-on Bisnis)](#13-marketplace-plugin--ekstensi-modular-add-on-bisnis)
14. [Konsol Eksklusif Superadmin (SaaS Owner)](#14-konsol-eksklusif-superadmin-saas-owner)
15. [Tanya Jawab Singkat (FAQ)](#15-tanya-jawab-singkat-faq)

---

## 1. Mengenal Antarmuka & Navigasi Utama

Layar Abdi POS terbagi menjadi 3 area intuitif:
- **Header Atas**: Nama bisnis, tombol ganti cabang (*Outlet Selector*), tombol cepat **"Buka POS (F2)"**, bel notifikasi bahan menipis, dan menu profil pengguna.
- **Sidebar Kiri**: Navigasi lengkap yang dikelompokkan berdasarkan tugas harian (Operasional, Master Data, Promosi, Bisnis, Pengaturan).
- **Area Konten Utama**: Tempat data ditampilkan dalam bentuk kartu metrik (*Stat Cards* berbingkai rapi dengan ikon berwarna seperti pada Kategori & Shift), tabel interaktif, filter cerdas, dan formulir pop-up (*modal*).

---

## 2. Alur Harian Kasir & Layar POS (F2)

Tekan tombol **`F2`** di keyboard kapan saja untuk membuka layar transaksi kasir:
1. **Pilih Menu**: Cari menu lewat bar pencarian atau filter kategori (misal: *Terang Bulan*, *Martabak Telur*, *Minuman*).
2. **Atur Porsi & Catatan**: Klik kartu menu untuk memasukkan ke keranjang sebelah kanan. Tambahkan catatan pesanan (misal: *"Kurang manis"*, *"Es batu sedikit"*).
3. **Pilih Cara Bayar**: Pilih **QRIS** (GoPay/ShopeePay/BCA), **Tunai**, atau **Debit**.
4. **Selesaikan & Cetak**: Klik **"Bayar & Cetak Struk"**. Struk tercetak otomatis dan stok bahan langsung terpotong.

---

## 3. Riwayat Transaksi & Cetak Ulang Struk Kasir

Buka menu **"Riwayat Transaksi"** (`/app/transactions`):
- **Cari Invoice**: Cari berdasarkan nomor invoice (misal `INV-20261025-001`) atau nama pelanggan.
- **Lihat Struk Digital**: Klik tombol **"Lihat Struk"** pada baris transaksi. Anda akan melihat simulator kertas struk termal yang realistis lengkap dengan logo toko, rincian menu, PPN 11%, dan barcode.
- **Cetak Ulang**: Klik **"Cetak Struk Thermal"** jika pelanggan meminta struk fisik baru.
- **Batalkan Transaksi (Void)**: Jika kasir salah input menu, klik tombol merah **"Void / Batalkan Struk"**, masukkan alasan pembatalan, lalu konfirmasi. Transaksi akan ditandai *VOID* dengan audit yang aman.
- **Download Laporan Transaksi**: Klik tombol **"Export CSV Transaksi"** di pojok kanan atas untuk mengunduh rekap dalam format Excel/CSV.

---

## 4. Buka-Tutup Shift & Rekonsiliasi Kas Laci

Buka menu **"Shift Kasir"** (`/app/shifts`):
- **Hero Card Shift Aktif yang Bersih & Rapi (Clean White)**:
  - Saat kasir sedang bertugas, bagian atas menampilkan kartu hero putih bersih (*clean white*) dengan border halus dan bayangan lembut yang senada dengan antarmuka aplikasi.
  - Menampilkan badge hijau berkedip **"● SHIFT SEDANG BERJALAN"**, avatar inisial kasir, nama kasir aktif, jam buka laci, dan jenis shift (misal *Shift Pagi - Kasir Utama*).
  - Terdapat **3 Kartu Metrik Warna Lembut yang Terpisah**:
    1. 💰 **Modal Awal Laci** (Kartu Kuning/Amber): Uang kas kecil yang diinput saat pertama kali membuka shift (misal `Rp 200.000`).
    2. 📈 **Penjualan Kas Masuk** (Kartu Cyan/Teal): Akumulasi uang tunai yang diterima dari pelanggan selama shift berjalan (misal `+ Rp 70.000`).
    3. ⚖️ **Total Kas Sistem (Seharusnya)** (Kartu Hijau/Emerald): Jumlah kas akhir yang seharusnya ada di laci kasir (Modal + Penjualan tunai = `Rp 270.000`).
- **Buka Shift Baru**: Jika belum ada shift berjalan, muncul kartu peringatan kuning lembut berikon jam. Masukkan modal uang receh awal di laci kasir lalu klik **"Buka Shift Sekarang"**.
- **Tutup Shift & Rekonsiliasi Kas**:
  1. Klik tombol merah kontras **"Tutup Shift & Rekonsiliasi Kas"** yang terletak jelas di pojok kanan kartu hero shift.
  2. Hitung uang kertas dan koin di laci kasir secara fisik.
  3. Masukkan total uang fisik yang dihitung ke dalam kolom formulir.
  4. Sistem akan otomatis menghitung selisih:
     - 🟢 **Kas Pas / Seimbang**: Tidak ada selisih (Rp 0).
     - 🔴 **Kas Kurang (Minus)**: Laci kekurangan uang dibanding catatan sistem.
     - 🔵 **Kas Lebih (Surplus)**: Laci kelebihan uang.
  5. Masukkan catatan serah terima shift lalu klik **"Konfirmasi Tutup Shift"**.

---

## 5. Kitchen Display System (KDS Live) & Self-Order QR Meja

Buka menu **"Pesanan Self-Order"** (`/app/orders`):

> [!TIP]
> **Navigasi Tab Selalu Stabil di Kanan Atas:**  
> Tombol pengalih antara **Kitchen Display (Live KDS)** dan **Daftar Meja & QR** kini selalu terkunci rapi di pojok kanan atas sejajar dengan judul halaman. Anda dapat berpindah antar-tampilan dengan cepat tanpa perubahan posisi tombol!

### A. Kitchen Display (KDS Kanban Live Dapur)
Papan kanban interaktif untuk koki dapur memproses pesanan:
1. **Pesanan Baru Masuk**: Kartu pesanan berwarna kuning dengan nomor meja dan rincian menu pesanan. Klik **"Mulai Masak →"** saat koki mulai memanggang.
2. **Sedang Dimasak**: Kartu berpindah ke kolom biru. Klik **"Siap Saji ✓"** ketika martabak sudah matang dan dipotong rapi.
3. **Siap Diantar**: Pelayan (*waiter*) melihat pesanan di kolom hijau siap diantar ke meja pelanggan. Klik **"Selesaikan"** setelah pesanan disajikan.
4. **Selesai**: Rekap pesanan yang telah tuntas disajikan hari ini.

### B. Daftar Meja & Standee QR Meja
Pindah ke tab **"Daftar Meja & QR"**:
- **Bilah Aksi & Tambah Meja**: Di bagian atas daftar meja terdapat toolbar khusus. Klik tombol **"Tambah Meja Baru"** untuk mendaftarkan meja baru, kapasitas kursi, dan area (Indoor AC / Outdoor).
- **Lihat & Cetak QR Meja**: Klik **"Lihat QR"** pada kartu meja. Akan muncul pratinjau standee akrilik meja siap cetak yang memuat QR code dan URL pemesanan langsung (`https://order.abdipos.com/m/meja-01`). Pelanggan cukup scan untuk pesan dan bayar dari meja tanpa antre di kasir!

---

## 6. Mengelola Menu Produk, Kategori & Resep HPP

Buka menu **"Produk Menu"** (`/app/products`) & **"Kategori Produk"** (`/app/categories`):
- **Tambah Menu Baru**: Klik **"Tambah Produk Baru"**.
  - Masukkan nama menu, pilih kategori, dan kode SKU.
  - Masukkan **Harga Jual** dan **HPP (Harga Pokok Penjualan)**. Sistem akan otomatis menghitung estimasi margin keuntungan bisnis Anda.
  - Pilih foto menu dari preset yang menggugah selera atau tempel tautan gambar menu.
  - Tentukan stok fisik atau aktifkan fitur resep bahan baku otomatis.
- **Kategori Menu**: Kelompokkan menu seperti *Terang Bulan Manis*, *Martabak Telur Gurih*, atau *Minuman Segar* lengkap dengan ikon dan label warna penanda.

---

## 7. Stok & Inventaris Bahan Baku (Stock Opname)

Buka menu **"Stok & Inventaris"** (`/app/inventory`):
- **Pantau Stok Kritis**: Bahan baku yang stoknya di bawah batas aman akan ditandai dengan badge merah berkedip **"Stok Menipis!"**.
- **Tambah Bahan Baku**: Daftarkan bahan seperti *Tepung Terigu Segitiga*, *Keju Cheddar*, atau *Telur Bebek* dengan satuan unit (kg, butir, kaleng).
- **Penyesuaian Stok (Stock Opname)**:
  1. Klik tombol **"Penyesuaian Stok (Opname)"** pada bahan yang ingin dihitung.
  2. Masukkan jumlah fisik aktual yang ada di rak gudang/dapur.
  3. Sistem akan menghitung selisih dan mencatat alasan penyesuaian (misal: *Bahan tumpah / rusak / koreksi hitung*).
  4. Saldo persediaan gudang langsung sinkron dan akurat!

---

## 8. Program Member & Poin Loyalitas Pelanggan

Buka menu **"Pelanggan & Member"** (`/app/customers`):
- **Daftarkan Pelanggan**: Masukkan nama lengkap, nomor WhatsApp, email, dan tier membership.
- **Kode Referral Unik**: Setiap pelanggan otomatis mendapatkan kode referral (misal: `BUDI88`) untuk mengajak teman.
- **Tingkatan Membership Tier**:
  - 🥉 **Bronze**: Member dasar, mengumpulkan poin belanja standar.
  - 🥈 **Silver**: Mendapatkan potongan harga ekstra 5%.
  - 🥇 **Gold**: Diskon belanja 10% dan poin ganda.
  - 💎 **Platinum (VIP)**: Prioritas antrean, diskon 15%, dan bonus ulang tahun.

---

## 9. Diskon, Voucher, Bundling & Tebus Murah

Buka menu **"Diskon & Bundling"** (`/app/promotions`):
- **Buat Promo Baru**:
  - **Persentase (%)**: Contoh diskon 20% weekend dengan minimal belanja Rp 50.000.
  - **Potongan Flat (Rp)**: Contoh voucher potongan langsung Rp 10.000.
  - **Paket Bundling**: Contoh beli 1 Terang Bulan Spesial gratis 2 Es Teh Jumbo.
  - **Tebus Murah**: Contoh belanja Rp 75.000 berhak menebus Kopi Susu seharga Rp 5.000.
- **Sakelar Cepat On/Off**: Cukup klik sakelar geser (*toggle switch*) pada baris promo untuk mengaktifkan atau menonaktifkannya seketika tanpa perlu menghapus promo.

---

## 10. Membaca Laporan Keuangan & Analitik Bisnis

Buka menu **"Laporan Penjualan"** (`/app/reports`):
- **Pilih Periode**: Klik tombol cepat *Hari Ini*, *7 Hari Terakhir*, *Bulan Ini*, atau *Tahun Ini*.
- **Metrik Utama**: Pantau total Omset Kotor, Estimasi Laba Kotor (setelah dipotong modal bahan HPP), Total Diskon yang diklaim pelanggan, dan Pajak PPN 11% yang terkumpul.
- **Kontribusi Cara Bayar**: Diagram batang persentase pembayaran (QRIS vs Tunai vs Kartu Debit).
- **Ranking Menu Terlaris**: Tabel urutan menu terfavorit pelanggan beserta volume porsi terjual dan keuntungan bersih yang disumbangkan.
- **Unduh Laporan**: Klik tombol **"Download Excel (CSV)"** untuk mengunduh rekap keuangan yang rapi.

---

## 11. Mengelola Cabang & Staf Karyawan (Hak Akses RBAC)

### A. Kelola Cabang (`/app/outlets`)
- **Banner Cabang Aktif**: Menampilkan nama cabang yang sedang dipilih, kode cabang, alamat gerai, dan status koneksi ke kasir POS secara live.
- **Kartu Cabang Modern**: Setiap outlet disajikan dalam kartu modern berbingkai halus dengan ikon gerai berwarna, badge *Pusat Utama* (jika merupakan pusat), alamat, kontak telepon, serta tombol cepat **"Pilih Cabang Ini"**, ubah data, atau hapus.
- Ganti cabang aktif operasional hanya dengan mengklik **"Pilih Cabang Ini"**.

### B. Kelola Staf & Akun Kasir (`/app/users`)
- **Kartu Penjelasan Hak Akses (Role)**: Di bagian atas daftar staf, terdapat 4 kartu penjelasan peran dengan ikon halo dan badge warna:
  - 🛡️ **Owner / Pemilik** (Ungu): Hak akses absolut, kelola cabang, paket SaaS & analitik keuangan.
  - 👥 **Supervisor** (Biru): Audit kas laci, rekonsiliasi shift & persetujuan void transaksi struk.
  - 💻 **Kasir (Cashier)** (Hijau): Layanan POS kasir, input pesanan, buka-tutup shift & cetak struk.
  - 🍳 **Dapur (Kitchen)** (Amber): Pantau antrean masak pesanan secara live di Kitchen Display System (KDS).
- Klik **"Undang Staf Baru"** untuk membuatkan akun login karyawan baru.

---

## 12. Pengaturan Toko, Custom Domain & Paket Langganan SaaS

Buka kelompok menu *PENGATURAN* di sidebar:
1. **Pengaturan Bisnis (`/app/settings`)**:
   - Layout formulir didesain lapang dan terstruktur per bagian: **Profil Bisnis & Brand**, **Operasional & Pajak Penjualan (PPN)**, dan **Format Struk Kasir**.
   - Input nama brand toko, tagline, nomor kontak WhatsApp, tarif pajak persentase, dan ucapan terima kasih pada struk tertata dengan jarak vertikal yang nyaman dibaca dan mudah diedit.
2. **Domain & Subdomain (`/app/domains`)**:
   - Subdomain gratis bawaan (misal `abdimartabak.abdipos.com`) selalu aktif dengan sertifikat HTTPS aman.
   - Ingin pakai domain toko sendiri? Klik **"Hubungkan Custom Domain"**, ketik domain Anda (misal `order.tokoanda.com`), lalu ikuti panduan mengarahkan DNS CNAME ke `cname.abdipos.com`.
3. **Paket Langganan (`/app/subscription`)**:
   - Menampilkan paket aktif saat ini (**Business Pro — Rp 129.000 / bulan**), pemakaian kuota (cabang, staf kasir, katalog produk, struk transaksi), serta daftar faktur tagihan resmi (PDF).
   - Klik **"Pilihan Paket"** untuk membuka modal komparasi 4 paket resmi Abdi POS:
     - 🆓 **Free Plan (Rp 0)**: Trial 30 hari penuh, 1 cabang, 1 kasir, maks. 20 menu, shift kasir & laporan harian dasar.
     - 💡 **Ekonomis UMKM (Rp 49.000 / bln)**: 2 cabang, 3 staf, maks. 50 menu, transaksi tanpa batas, manajemen stok, serta **Program Member & Poin** dan **Diskon & Bundling Promo**.
     - ⭐ **Business Pro (Rp 129.000 / bln - Best Seller)**: Hingga 5 cabang, 10 staf kasir/supervisor, maks. 100 menu, Kitchen Display System (KDS Kanban), Standee QR Meja Self-Order, Resep & HPP Bahan Baku otomatis, dan laporan laba rugi lengkap.
     - 🏢 **Enterprise (Rp 299.000 / bln)**: Hingga 10 cabang, 50 akun staf, maks. 250 menu, custom domain toko (.com / .id), transfer stok antar-cabang, dan konsolidasi multi-cabang.
   - Di halaman ini juga terdapat seksi **"Plugin & Ekstensi Aktif"** yang merangkum add-on tambahan yang sedang terpasang di toko Anda.

---

## 13. Marketplace Plugin & Ekstensi Modular (Add-on Bisnis)

Buka menu **"Plugin & Ekstensi"** (`/app/plugins`):

Abdi POS mengusung konsep **Modular Plugin Architecture**. Pemilik toko salon, barbershop, laundry, bengkel, spa, ekspedisi, maupun ritel tidak perlu membayar biaya paket mahal untuk fitur yang tidak dipakai. Cukup pasang plugin yang dibutuhkan dengan biaya mikro bulanan terjangkau:

### Daftar 7 Plugin Modular Resmi:
1. 📸 **Absensi Selfie & Geofencing GPS (Rp 20.000 / bln)**:
   - Jam masuk & pulang (clock in/out) wajib foto selfie wajah dari layar kasir/tablet.
   - Deteksi radius GPS toko otomatis (maksimal 50 meter) untuk mencegah titip absen.
2. ✂️ **Kalkulator Komisi Staf & Terapis (Rp 25.000 / bln)**:
   - Hitung komisi otomatis per pengerjaan jasa treatment (misal 20% potong rambut) atau barang ritel.
   - Pilih nama kapster/terapis langsung dari layar kasir POS.
3. 🤖 **WhatsApp Bot & Notifikasi Status Otomatis (Rp 29.000 / bln)**:
   - Mengirimkan pesan WhatsApp otomatis ke pelanggan saat cucian laundry selesai, servis barang tuntas, atau pesanan siap diambil.
4. 🎁 **WhatsApp Broadcast & Pengingat Ultah (Rp 25.000 / bln)**:
   - Otomatis kirim ucapan selamat ulang tahun berhadiah voucher diskon ke pelanggan terdaftar.
   - Kirim broadcast promo akhir pekan ke seluruh pelanggan dengan 1 kali klik.
5. 📅 **Reservasi & Booking Jadwal Mandiri Online (Rp 35.000 / bln)**:
   - Menyediakan link booking mandiri untuk pelanggan dari rumah.
   - Pelanggan bebas memilih jam kosong, jenis perawatan, dan staf favorit.
6. 📝 **Kas Bon / Pembukuan Piutang Pelanggan (Rp 15.000 / bln)**:
   - Tombol bayar *"Kas Bon"* di kasir POS untuk pelanggan langganan.
   - Batas limit kredit per orang, riwayat pelunasan bertahap, dan pengingat tagihan ramah via WA.
7. 📊 **Catat Biaya Operasional & Laba Bersih / Net Profit (Rp 29.000 / bln)**:
   - Catat pengeluaran non-bahan baku seperti listrik PLN, sewa tempat, gaji karyawan, dan kantong kresek.
   - Menghasilkan laporan Laba Bersih riil (*Net Profit*) dan arus kas (*Cash Flow*).

> [!TIP]
> **Coba Langsung via Simulator Demo Interaktif:**  
> Sebelum memutuskan mengaktifkan plugin, klik tombol **"Simulasi Demo"** pada setiap kartu plugin. Anda dapat mencoba langsung jepretan kamera selfie GPS, kalkulator hitung komisi terapis, simulasi obrolan bubble WhatsApp bot, kalender reservasi, hingga kalkulator laba bersih!

---

## 14. Konsol Eksklusif Superadmin (SaaS Owner) & Animasi Loading Transisi Mode

Fitur khusus bagi **Pemilik Platform Abdi POS** untuk mengontrol ekosistem multi-tenant:
- Buka URL **`http://localhost:5173/platform/dashboard`** atau klik tombol perisai **"Konsol Superadmin (Owner)"** di bagian bawah sidebar.
- Pantau total MRR (pendapatan bulanan SaaS), daftar semua pemilik toko yang terdaftar, buat paket harga langganan baru, verifikasi DNS custom domain klien, dan pantau rekaman audit keamanan.

### 🧩 Kelola Katalog Plugin & Ekstensi Modular (`/platform/plugins`)
- Halaman konfigurasi khusus Superadmin untuk mengatur seluruh ekosistem add-on modular yang ditawarkan kepada tenant (mirip dengan halaman Paket Langganan).
- **Fitur Utama**:
  - **Statistik Add-on**: Total plugin tersedia, total tenant yang memasang, estimasi MRR add-on, dan rata-rata harga plugin.
  - **Grid Konfigurasi Plugin**: Mengubah harga bulanan plugin, target sektor industri, kategori, ikon, daftar fitur (checklist), dan tipe simulasi demo.
  - **Tambah & Hapus Plugin**: Tombol *"+ Tambah Plugin Baru"* untuk meluncurkan modul add-on baru ke marketplace tenant.
  - **Tabel Breakdown Tenant**: Memeriksa bisnis/tenant mana saja yang sedang aktif memasang setiap plugin tertentu.

### 👤 Profil & Pengaturan Akun Superadmin (`/platform/profile`)
- **Popup Menu Profil di Kanan Atas**: Mengklik widget avatar/profil superadmin di pojok kanan atas konsol akan memunculkan menu popup dropdown (seperti pada mode tenant) dengan opsi cepat: *Lihat Profil & Pengaturan*, *Kelola Plugin*, *Kelola Paket*, dan *Beralih ke Mode Tenant*.
- **Halaman Profil & Pengaturan yang Rapi**:
  - Tombol aksi *"Ubah Data Profil"* dan *"Ganti Password"* kini diletakkan di dalam hero kartu dengan jarak ikon yang proporsional dan teks tidak lagi menimpa pola banner.
  - **Identitas Pemilik SaaS**: Ubah nama lengkap, email resmi superadmin, nomor WhatsApp, jabatan, dan lokasi operasional.
  - **Keamanan Akun Root**: Sakelar Autentikasi Dua Faktor (2FA), pergantian kata sandi root berkala, monitoring daftar sesi perangkat aktif, dan pemutusan sesi perangkat lain.
  - **Preferensi Platform SaaS**: Pengaktifan *Maintenance Mode* global jika platform sedang melakukan pemeliharaan server, pengaturan notifikasi email sistem, dan pemicu backup basis data harian (02:00 WIB).

### 🌟 Animasi Loading Perpindahan Mode (Tenant ⇄ Superadmin)
Ketika Anda berpindah dari dashboard toko biasa menuju konsol superadmin (atau sebaliknya):
1. **Layar Loading Animatif Otomatis Muncul**:
   - Menampilkan emblem orbital berputar ganda (*dual spinning rings*) dengan aksen warna yang disesuaikan secara dinamis:
     - 🛡️ **Menuju Superadmin**: Tema *Deep Midnight Indigo & Purple*, ikon perisai bersinar, dan status sinkronisasi MRR & multi-tenant.
     - 🏪 **Menuju Dashboard Toko**: Tema *Ocean Royal Blue & Emerald*, ikon gerai toko bersinar, dan status penyiapan sesi kasir/outlet.
2. **Indikator Progres & Pesan Bertahap**:
   - Progress bar bergerak halus dari 0% hingga 100% dengan efek kilau cahaya (*light shimmer*).
   - Teks panduan menginformasikan tahapan validasi akses, pemuatan data analitik, hingga antarmuka siap digunakan.
3. **Peralihan Mulus Tanpa Kedip**:
   - Halaman tujuan selesai dimuat di latar belakang sebelum layar loading memudar (*smooth fade & scale out*), sehingga pengalaman navigasi terasa sangat mewah dan profesional.
4. **Uji Coba Animasi**:
   - Anda juga dapat menguji kedua animasi transisi ini kapan saja melalui menu **"Komponen UI Showcase"** di bagian section 8.

---

## 15. Tanya Jawab Singkat (FAQ)

**T: Bagaimana jika ada pesanan yang salah ketik saat transaksi sudah selesai dibayar?**  
*J: Buka menu "Riwayat Transaksi", klik tombol "Lihat Struk" pada transaksi tersebut, lalu klik tombol merah "Void / Batalkan Struk". Masukkan alasan pembatalan dan struk akan dibatalkan secara aman.*

**T: Apakah koki di dapur bisa melihat catatan khusus pelanggan (misal: "tidak pedas")?**  
*J: Ya! Di layar Kitchen Display (KDS), setiap catatan pesanan yang diinput kasir otomatis ditampilkan dengan teks penanda warna merah di bawah nama menu.*

**T: Apakah stok bahan baku akan langsung berkurang saat ada transaksi?**  
*J: Ya, jika produk menggunakan fitur resep otomatis, bahan baku terkait di menu Inventaris akan langsung terpotong secara real-time saat transaksi berhasil disimpan.*

---

> [!NOTE]  
> Seluruh panduan ini diperbarui secara berkala agar selaras dengan setiap pembaruan fitur di Abdi POS. Selamat menggunakan aplikasi dan semoga usaha Anda semakin berkembang pesat! 🚀
