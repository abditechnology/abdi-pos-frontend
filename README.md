# 🚀 Abdi POS — Frontend Technical & Coding Documentation

Dokumen ini berisi catatan teknis, standar arsitektur, panduan penulisan kode, serta dokumentasi seluruh modul dan komponen pendukung untuk seluruh pengembang (*engineers / programmers*) yang berkontribusi pada repositori `abdi-pos-frontend`.

Aplikasi ini dibangun mengacu secara ketat pada spesifikasi:
- **Acuan Utama**: `prd_frontend.md` (Frontend Technical PRD POS SaaS)
- **Alat Bacaan / Konteks Backend**: `prd_backend.md` (Laravel 13 Modular Monolith API)

---

## 📑 Daftar Isi
1. [Tech Stack & Prinsip Arsitektur](#-tech-stack--prinsip-arsitektur)
2. [Struktur Folder & Seluruh Modul Frontend](#-struktur-folder--seluruh-modul-frontend)
3. [Design System & Aturan Styling (Modern Blue)](#-design-system--aturan-styling-modern-blue)
4. [State Management & Data Stores (Pinia)](#-state-management--data-stores-pinia)
5. [Katalog & API Komponen Pendukung](#-katalog--api-komponen-pendukung)
6. [Panduan Menjalankan & Build Aplikasi](#-panduan-menjalankan--build-aplikasi)
7. [Aturan Kontribusi & Pemeliharaan Dokumen](#-aturan-kontribusi--pemeliharaan-dokumen)

---

## 🛠 Tech Stack & Prinsip Arsitektur

| Komponen | Pilihan Teknologi | Keterangan |
|---|---|---|
| **Framework** | Vue 3 (Composition API `<script setup>`) | Typed, modular, performa tinggi |
| **Build Tool** | Vite 8+ | Hot Module Replacement (HMR) instan & build optimal |
| **State Management** | Pinia 4+ | Store terpisah per domain (`auth`, `outlet`, `ui`, `product`, `inventory`, `transaction`, `order`, `customer`, `promotion`, `staff`) |
| **Routing** | Vue Router 4 | Nested routes, layout shells, meta, static imports |
| **Typography** | Plus Jakarta Sans | Modern geometric sans-serif |
| **Icons** | Custom Crisp SVG Component (`AppIcon.vue`) | Zero-dependency, 40+ SVG icons (pos, cart, package, store, printer, edit, qr, check, download, shield, dll.) |
| **Styling** | Vanilla CSS Tokens & Utility Architecture | Zero compile overhead, spring easing, glassmorphic |

### Prinsip Utama (Architectural Rules)
1. **Pragmatic Layering (PRD Section 3.1)**:
   - UI murni dan atomik ditaruh di `src/shared/components/ui/`.
   - Logika halaman dan koordinasi data ditaruh di `src/modules/<nama_modul>/pages/`.
   - Modal spesifik domain ditaruh di `src/modules/<nama_modul>/components/`.
2. **Deterministic Route Shells & Layout Chunking**:
   - Layout utama (`AppLayout.vue` dan `PlatformLayout.vue`) beserta halaman inti diimpor secara deterministik pada `src/router/index.js` untuk mengeliminasi potensi kegagalan *dynamic chunk loading* atau network race condition pada browser.
   - Parent route `/platform` tidak menggunakan redirect langsung di level parent, melainkan didelegasikan ke child route `{ path: '', redirect: '/platform/dashboard' }`.
   - Inisialisasi aplikasi pada `src/main.js` menunggu `router.isReady()` sebelum memanggil `app.mount('#app')`, dilengkapi penangkap error visual global (`app.config.errorHandler` & window error logger) sehingga aplikasi tidak pernah mengalami *silent blank screen*.
3. **Defensive Template Formatting**:
   - Seluruh pemformatan angka/mata uang pada template Vue dilarang memanggil method langsung seperti `.toLocaleString()` tanpa nilai fallback. Gunakan helper `formatRp(val)` berbasis `Intl.NumberFormat('id-ID')` yang aman dari nilai `null`/`undefined`.
4. **Multi-Outlet Scoped Data (PRD Section 7)**:
   - Modul operasional (POS, Shift, Inventaris, Transaksi) selalu terikat pada cabang aktif (`currentOutletId` di `outletStore`).
   - Mengganti cabang aktif melalui `OutletSelector` otomatis memicu penyegaran konteks data tanpa memuat ulang seluruh halaman.
5. **Immediate Watcher Function Ordering (TDZ Safety)**:
   - Pada blok `<script setup>`, penggunaan `watch(source, callback, { immediate: true })` menyebabkan callback dieksekusi secara sinkron saat inisialisasi komponen. Seluruh fungsi pembantu (seperti `resetForm()`) yang dipanggil di dalam watcher wajib dideklarasikan secara leksikal *sebelum* `watch` untuk mencegah `ReferenceError` akibat Temporal Dead Zone (TDZ).

---

## 📁 Struktur Folder & Seluruh Modul Frontend

```
abdi-pos-frontend/src/
├── app/
│   ├── layouts/
│   │   ├── AppLayout.vue              # Layout tenant toko (Sidebar kolapsibel, Header, Toast viewport)
│   │   └── PlatformLayout.vue         # Layout eksklusif Superadmin (SaaS Owner Console)
│   └── router/
│       └── index.js                   # Route configuration untuk seluruh 17 modul sistem
├── shared/
│   ├── components/
│   │   ├── icons/AppIcon.vue          # 40+ SVG icons siap pakai (pos, cart, package, printer, qr, dll.)
│   │   ├── layout/
│   │   │   ├── AppHeader.vue          # Header atas, breadcrumb, outlet selector, tombol POS, profil dropdown
│   │   │   ├── AppSidebar.vue         # Navigasi bertingkat dengan grouping & status badge
│   │   │   ├── ModeTransitionOverlay.vue # Overlay animasi orbital perpindahan mode (Tenant ⇄ Superadmin)
│   │   │   └── OutletSelector.vue     # Switcher cabang interaktif
│   │   └── ui/
│   │       ├── BaseAlert.vue          # Banner peringatan (info, success, warning, danger)
│   │       ├── BaseBadge.vue          # Status badge dengan dot pulse
│   │       ├── BaseButton.vue         # Tombol 6 varian warna, 3 ukuran, loading state
│   │       ├── BaseCard.vue           # Kartu serbaguna dengan hover-lift
│   │       ├── BaseInput.vue          # Input teks dengan prefix/suffix icon & validasi error
│   │       ├── BaseModal.vue          # Modal pop-up (backdrop blur, focus trap, ESC listener)
│   │       ├── ConfirmModal.vue       # Modal konfirmasi tindakan penting / berbahaya
│   │       ├── MoneyDisplay.vue       # Format mata uang Rupiah (IDR) presisi
│   │       ├── SkeletonLoader.vue     # Shimmer wave placeholder saat loading
│   │       └── ToastContainer.vue     # Viewport mengambang untuk alert toast
│   ├── composables/useToast.js        # Helper reaktif pemanggilan toast
│   ├── stores/
│   │   ├── authStore.js               # State pengguna, info tenant, demo accounts, & sesi aktif
│   │   ├── outletStore.js             # State cabang, switch outlet, & CRUD outlet
│   │   ├── pluginStore.js             # State marketplace 7 plugin modular & add-on berlangganan
│   │   └── uiStore.js                 # State sidebar terbuka/tertutup & daftar notifikasi
│   └── styles/design-system.css       # Variabel tema, palet biru, & animasi keyframe
└── modules/
    ├── auth/                          # 1. OTENTIKASI & PROFIL
    │   ├── components/
    │   │   ├── EditProfileModal.vue   # Modal edit data diri & avatar
    │   │   └── ChangePasswordModal.vue# Modal ganti sandi + Password Strength Meter
    │   └── pages/
    │       ├── LoginPage.vue          # Login dengan 1-click Demo Account Selector
    │       └── ProfilePage.vue        # Profil lengkap, hak akses RBAC, & sesi aktif
    ├── dashboard/                     # 2. DASHBOARD UTAMA
    │   └── pages/DashboardPage.vue    # Omset harian, tren jam ramai, & menu terlaris
    ├── pos/                           # 3. KASIR POINT OF SALE (POS)
    │   └── pages/PosCashierPage.vue   # Layar kasir layar penuh, keranjang, hitung PB1 & pembayaran
    ├── products/                      # 4. MASTER PRODUK & KATEGORI
    │   ├── components/
    │   │   ├── ProductModal.vue       # CRUD Produk (Nama, SKU, Kategori, Harga Jual, HPP, Resep)
    │   │   └── CategoryModal.vue      # CRUD Kategori (Nama, Slug, Warna, Ikon)
    │   ├── pages/
    │   │   ├── ProductsPage.vue       # Tabel produk, filter kategori, badge stok, aksi CRUD
    │   │   └── CategoriesPage.vue     # Grid kategori dengan counter item menu
    │   └── stores/productStore.js     # State katalog & kategori produk
    ├── inventory/                     # 5. INVENTARIS & STOK CABANG
    │   ├── components/
    │   │   ├── StockOpnameModal.vue   # Rekonsiliasi stok fisik vs sistem & hitung selisih
    │   │   └── MaterialModal.vue      # CRUD Bahan Baku (Satuan, Batas Minimum, Biaya/Unit)
    │   ├── pages/InventoryPage.vue    # Tabel inventaris, peringatan stok kritis, penyesuaian opname
    │   └── stores/inventoryStore.js   # State persediaan bahan baku per outlet
    ├── transactions/                  # 6. TRANSAKSI & SHIFT KASIR
    │   ├── components/
    │   │   ├── ReceiptDetailModal.vue # Preview struk thermal POS, cetak struk, & void transaksi
    │   │   └── ShiftModal.vue         # Buka shift (modal laci) & Tutup shift (rekonsiliasi kas)
    │   ├── pages/
    │   │   ├── TransactionsPage.vue   # Riwayat invoice, filter metode bayar/status, export CSV
    │   │   └── ShiftsPage.vue         # Status shift aktif, riwayat pergantian kasir, audit selisih
    │   └── stores/transactionStore.js # State transaksi penjualan & riwayat shift
    ├── orders/                        # 7. PESANAN SELF-ORDER & MEJA
    │   ├── components/
    │   │   ├── TableModal.vue         # Tambah & edit nomor meja, kapasitas, area ruangan
    │   │   └── TableQrModal.vue       # Simulator standee akrilik QR meja, salin URL, cetak PDF
    │   ├── pages/OrdersPage.vue       # Kitchen Display System (KDS live kanban) & Grid Meja
    │   └── stores/orderStore.js       # Pipeline pesanan dapur (Pending, Cooking, Ready, Completed)
    ├── customers/                     # 8. PELANGGAN & LOYALITAS MEMBER
    │   ├── components/CustomerModal.vue # CRUD Member (Nama, WhatsApp, Tier, Poin, Preferensi)
    │   ├── pages/CustomersPage.vue    # Database member, tier badge, akumulasi poin, total belanja
    │   └── stores/customerStore.js    # State pelanggan & saldo poin loyalti
    ├── promotions/                    # 9. DISKON & BUNDLING
    │   ├── components/PromotionModal.vue # CRUD Promo (Persentase, Nominal, Bundling, Tebus Murah)
    │   ├── pages/PromotionsPage.vue   # Kartu & tabel promosi, sakelar aktif/nonaktif, kuota klaim
    │   └── stores/promotionStore.js   # State program diskon & voucher promo
    ├── reports/                       # 10. LAPORAN & ANALITIK KEUANGAN
    │   └── pages/ReportsPage.vue      # Omset kotor, laba kotor, PPN, breakdown QRIS/Cash, ranking produk
    ├── outlets/                       # 11. CABANG & STAF (RBAC)
    │   ├── components/
    │   │   ├── OutletModal.vue        # CRUD Cabang fisik (Kode, Alamat, Kontak, Jam Buka)
    │   │   └── StaffModal.vue         # CRUD Akun Staf (Peran: Kasir/Supervisor/Manager/Dapur)
    │   ├── pages/
    │   │   ├── OutletsPage.vue        # Grid cabang, ganti cabang aktif, indikator pusat utama
    │   │   └── StaffPage.vue          # Tabel staf, penugasan cabang, role badge, last login
    │   └── stores/staffStore.js       # State pengguna & staf tenant
    ├── settings/                      # 12. PENGATURAN BISNIS, DOMAIN, PLUGIN & LANGGANAN
    │   ├── components/
    │   │   ├── ConnectDomainModal.vue # Form custom domain & panduan CNAME DNS
    │   │   ├── UpgradePlanModal.vue   # Perbandingan 4 paket (Free, Ekonomis, Pro, Enterprise)
    │   │   └── PluginDemoModal.vue    # Simulator interaktif 7 plugin modular (Selfie GPS, Komisi, WA, dll.)
    │   ├── pages/
    │   │   ├── BusinessSettingsPage.vue # Profil brand, tarif PPN 11%, format struk, pesan footer
    │   │   ├── TenantDomainsPage.vue  # Status subdomain .abdipos.com, custom domain, panduan DNS
    │   │   ├── PluginMarketplacePage.vue # Marketplace 7 plugin modular add-on lintas industri
    │   │   └── SubscriptionPage.vue   # Paket aktif, ringkasan plugin add-on, kuota & riwayat tagihan
    ├── platform/                      # 13. KONSOL SUPERADMIN (SAAS OWNER)
    │   ├── components/
    │   │   ├── TenantModal.vue        # Modal pendaftaran & edit tenant baru
    │   │   ├── PlanModal.vue          # Modal paket langganan SaaS
    │   │   └── PluginModal.vue        # Modal pembuatan & edit konfigurasi plugin add-on
    │   ├── pages/
    │   │   ├── PlatformDashboardPage.vue # Metrik MRR, total tenant, & kesehatan sistem
    │   │   ├── PlatformTenantsPage.vue   # Manajemen tenant, impersonate, suspend
    │   │   ├── PlatformPlansPage.vue     # CRUD paket langganan & breakdown subscriber
    │   │   ├── PlatformPluginsPage.vue   # CRUD katalog plugin add-on & breakdown tenant
    │   │   ├── PlatformDomainsPage.vue   # Monitoring verifikasi DNS & SSL
    │   │   ├── PlatformAuditLogsPage.vue # Rekam jejak audit keamanan platform
    │   │   └── PlatformProfilePage.vue   # Profil, keamanan root 2FA, & preferensi platform
    │   └── stores/platformStore.js    # State & actions pengelolaan SaaS platform
    └── showcase/
        └── pages/ComponentShowcasePage.vue # Demonstrasi interaktif seluruh komponen UI
```

---

## 🎨 Design System & Aturan Styling (Modern Blue)

Seluruh token visual dikelola di `src/shared/styles/design-system.css`.

### Palet Warna Utama (Blue & Navy)
```css
/* Brand Primary Blue */
--primary-50:  #eff6ff;   /* Latar hover / badge lembut */
--primary-100: #dbeafe;   /* Border aksen lembut */
--primary-500: #3b82f6;   /* Electric Azure highlight */
--primary-600: #2563eb;   /* Brand Royal Blue (Tombol utama & status) */
--primary-700: #1d4ed8;   /* Hover state tombol */

/* Deep Navy (Sidebar & High Contrast Surfaces) */
--navy-950: #070d18;      /* Latar sidebar gelap pekat */
--navy-900: #0b1528;      /* Latar navigasi & header card */
--navy-800: #10223d;      /* Garis pembatas (divider) navy */

/* Semantics */
--success-500: #10b981;   /* Emerald (Lunas / Shift aktif) */
--warning-500: #f59e0b;   /* Amber (Menunggu bayar / Stok menipis) */
--danger-500:  #ef4444;   /* Rose Red (Void / Pembatalan / Kritis) */
```

### Standar Vertikal Layout & Ritme Spasi (*Vertical Spacing & Layout Rhythm*)
Untuk menjaga konsistensi visual di seluruh halaman tanpa berdesakan (*cramped layouts*), gunakan token dan aturan berikut:
1. **Vertical Rhythm Utilities (`.space-y-*`)**:
   - Diterapkan pada kontainer halaman menggunakan pemilih *lobotomized owl* (`.space-y-6 > * + * { margin-top: 1.75rem; }` dan `.space-y-4 > * + * { margin-top: 1.25rem; }`).
2. **Page Header Standard**:
   - `.page-header`: Memiliki `margin-bottom: 2rem` dengan `display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem;`.
   - `.page-title`: `font-size: 1.625rem; font-weight: 800; line-height: 1.3;`.
   - `.page-subtitle`: `font-size: 0.925rem; line-height: 1.6; margin-top: 0.5rem; color: #64748b;`.
3. **Form & Input Rhythm (`/app/settings` & Modals)**:
   - `.form-group`: Wajib memiliki `margin-bottom: 1.5rem` dengan `gap: 0.5rem` antara label dan input.
   - `.form-grid-2`: Menggunakan `gap: 1.5rem; margin-bottom: 1.5rem;` untuk memisahkan baris form dua kolom.
   - `.form-input` & `.form-textarea`: Memiliki padding lega `0.75rem 1rem` dengan `line-height: 1.5` agar teks tidak terpotong.
4. **Stable Tab Navigation (Pattern `OrdersPage.vue`)**:
   - Navigasi tab tingkat atas diletakkan eksklusif di dalam `.header-actions` tanpa mencampur tombol aksi kondisional agar posisi tab tidak pernah terdorong (*wrapped down*) saat berpindah tab.
   - Tombol aksi spesifik tab (seperti *Tambah Meja Baru*) ditempatkan di dalam toolbar internal view terkait (`.tables-toolbar-bar`).
5. **Hero Status & Contextual Cards (Pattern `ShiftsPage.vue`)**:
   - Hero card shift kasir (`.shift-hero-card`) menggunakan estetika *Clean White Surface* berbingkai halus (`#ffffff`, border `#e2e8f0`) dengan bayangan elevasi lembut agar menyatu bersih dengan latar aplikasi.
   - Dilengkapi avatar ring kasir, live status badge emerald (`#ecfdf5`), tombol aksi tutup shift bertema *High-Contrast Vibrant Red* (`#ef4444`) yang terlihat jelas tanpa tabrakan warna, serta 3 sub-kartu metrik terpisah (`card-amber`, `card-cyan`, `card-emerald`) sehingga angka kas dan label tidak berdesakan (*zero inline cramming*).
6. **Unified Standard Stat Card System (`.stat-card` & `.stat-icon-halo`)**:
   - Seluruh ringkasan metrik di bagian atas halaman (Transaksi, Produk, Inventaris, Pelanggan, Promosi, Laporan Keuangan, serta Peran Staf & Kartu Cabang) kini distandardisasi menggunakan kartu putih bersih (`.stat-card`) dengan efek *hover-lift*, dipadukan dengan *Colored Halo Icons* (`.halo-blue`, `.halo-emerald`, `.halo-amber`, `.halo-purple`, `.halo-rose`, `.halo-cyan`, `.halo-indigo`).
   - Meniadakan teks telanjang tanpa kontainer, mengeliminasi duplikasi tanda tambah `+` pada tombol aksi, dan menyatukan estetika visual antar-modul agar setara dengan keindahan halaman Kategori Produk dan Shift Kasir.

### Animasi & Interaksi (*Motion Guidelines*)
- Gunakan kurva pegas: `var(--ease-spring)` atau `cubic-bezier(0.16, 1, 0.3, 1)`.
- Semua tombol wajib memiliki efek tekan `active: scale(0.97)` agar terasa taktil dan responsif.
- Komponen kartu interaktif wajib menyertakan kelas `.card-hover-lift` (`translateY(-4px)` dengan bayangan *blue glow*).
- Loading indikator menggunakan `.skeleton-shimmer` yang bergerak horizontal secara konsisten.

---

## 🧠 State Management & Data Stores (Pinia)

1. **`authStore`**: Sesi pengguna, akun demo 1-klik, hak akses peran (Owner, Kasir, Superadmin), pembaruan profil & kata sandi.
2. **`outletStore`**: Daftar cabang bisnis, pemilihan cabang aktif (`switchOutlet`), dan aksi CRUD cabang.
3. **`productStore`**: Master katalog item menu, kalkulasi HPP/margin laba, kategori, dan penghitungan stok otomatis.
4. **`inventoryStore`**: Data bahan baku per cabang, peringatan stok kritis, dan penyesuaian fisik (*stock opname*).
5. **`transactionStore`**: Riwayat struk invoice penjualan, pembatalan (*void*), pembukaan shift kasir, dan rekonsiliasi kas laci.
6. **`orderStore`**: Antrean pesanan dapur secara live (*Kitchen Display System*) dan manajemen meja/QR self-order.
7. **`customerStore`**: Database member pelanggan, saldo poin loyalitas, riwayat belanja, dan tingkatan *membership tier*.
8. **`promotionStore`**: Program diskon persentase, nominal flat, paket bundling hemat, dan tebus murah.
9. **`staffStore`**: Akun staf operasional, peran RBAC, dan penugasan cabang.
10. **`platformStore`**: Khusus Superadmin SaaS untuk mengelola tenant, paket langganan, mapping domain, dan audit log.
11. **`modeTransitionStore`**: Mengelola state transisi perpindahan konteks antara dashboard tenant biasa (`/app/*`) dan konsol superadmin (`/platform/*`), mengontrol progress bar 0-100%, pesan status dinamis, dan animasi orbital emblem.
12. **`pluginStore`**: Mengelola katalog 7 plugin modular (Add-on Marketplace), status pemasangan (`isInstalled`), estimasi tagihan add-on bulanan, dan simulasi demo interaktif.

---

## 💎 Paket Langganan SaaS & Ekosistem Plugin Modular

Abdi POS mengimplementasikan arsitektur harga **Core-to-Value + Modular Add-on Marketplace**. Skema ini menjaga harga dasar langganan tetap terjangkau bagi pelaku UMKM di daerah (seperti Tulungagung), sekaligus memberi fleksibilitas ekspansi bagi bisnis jasa, salon, spa, laundry, ekspedisi, maupun ritel:

### 1. Empat Tingkatan Paket Utama (Core Plans):
| Nama Paket | Biaya / Bulan | Kapasitas Cabang & Akun | Fitur Unggulan |
|---|---|---|---|
| **Free Plan** | Rp 0 (Trial 30 Hari) | 1 Cabang, 1 Akun, Maks. 20 Menu | Uji coba operasional dasar kasir, batas 50 transaksi, laporan penjualan harian |
| **Ekonomis UMKM** | Rp 49.000 / bln | 1 Cabang, 2 Akun, Maks. 20 Menu | Maks. 50 transaksi harian, stok inventaris, **Program Member & Poin**, **Diskon & Bundling Promo**, ekspor CSV (tanpa shift kasir) |
| **Business Pro** *(Best Seller)* | Rp 149.000 / bln | Maks. 2 Cabang, 5 Akun, Maks. 50 Menu | Transaksi unlimited, **Buka-Tutup Shift & Rekonsiliasi Kas**, Resep & HPP Otomatis, Laporan Analitik Multi-Cabang |
| **Enterprise** | Rp 299.000 / bln | Hingga 10 Cabang, 20 Akun, Maks. 100 Menu | **Kitchen Display System (KDS Kanban)**, Custom Domain (.com/.id), Centralized Dashboard Multi-Cabang, Konsolidasi Finansial, Hak Akses RBAC |

*Catatan: Dukungan bantuan dan batasan cetak struk/WA tidak dicantumkan sebagai pembeda paket. Program loyalitas poin dan bundling promosi diaktifkan langsung mulai dari paket Ekonomis UMKM.*

### 2. Delapan Plugin Modular Tambahan (Add-on Marketplace):
| Nama Plugin | Biaya / Bulan | Sektor Sasaran | Kemampuan Utama |
|---|---|---|---|
| **Absensi Selfie & Geofencing GPS** | Rp 20.000 | Semua Sektor (F&B, Salon, Ritel) | Foto kamera selfie wajib saat jam masuk/pulang + validasi radius GPS 50m |
| **Kalkulator Komisi Staf & Terapis** | Rp 25.000 | Salon, Barbershop, Spa, Bengkel | Otomasi bagi hasil per jasa/treatment, pilih staf di kasir POS, slip komisi |
| **WhatsApp Bot & Notifikasi Status** | Rp 29.000 | Laundry, Servis, Ekspedisi, F&B | Kirim pesan otomatis saat cucian beres, servis tuntas, atau pesanan siap |
| **WhatsApp Broadcast & Pengingat Ultah** | Rp 25.000 | F&B, Butik Fashion, Klinik | Ucapan ultah otomatis berhadiah voucher promo, 1-click broadcast hemat |
| **Reservasi & Booking Mandiri Online** | Rp 35.000 | Salon, Barbershop, Spa, Cuci Mobil | Link pemesanan jadwal mandiri untuk pelanggan dari rumah + opsi DP QRIS |
| **Kas Bon & Piutang Pelanggan** | Rp 15.000 | Toko Kelontong, Warkop, Bengkel | Tombol "Kas Bon" di kasir, limit plafon kredit, riwayat cicilan & pengingat WA |
| **Catat Biaya Operasional & Laba Bersih** | Rp 29.000 | Semua Sektor Bisnis | Catat arus kas keluar non-HPP (listrik, sewa, gaji) untuk kalkulasi riil Net Profit |
| **Meja & Standee QR Self-Order** | Rp 30.000 | F&B, Cafe, Resto, Foodcourt | Scan barcode meja untuk order & bayar QRIS mandiri, sinkron langsung ke KDS |

Setiap plugin dilengkapi simulator interaktif (`PluginDemoModal.vue`) untuk pratinjau langsung sebelum berlangganan.

---

## 💻 Panduan Menjalankan & Build Aplikasi

### Prasyarat
- Node.js versi 20+ / 22+
- NPM versi 10+

### Menjalankan Server Lokal (Development)
```bash
cd "abdi-pos-frontend"
npm install        # (jika baru pertama kali clone)
npm run dev
```
Akses aplikasi melalui peramban di: **`http://localhost:5173/`**

### Menjalankan Build Produksi (Production Build)
```bash
cd "abdi-pos-frontend"
npm run build
```
Hasil berkas build siap rilis akan terbit di folder `dist/` dengan status exit code 0 tanpa error.

---

## 📌 Aturan Kontribusi & Pemeliharaan Dokumen

> [!IMPORTANT]
> **Aturan Pembaruan Berkas Dokumentasi:**
> Setiap kali ada penambahan fitur, perubahan komponen, pembaruan skema data, atau restrukturisasi antarmuka:
> 1. Perbarui **`README.md`** ini dengan rincian teknis, props komponen, atau rute baru.
> 2. Perbarui **`GUIDELINES.md`** dengan alur penggunaan bagi pengguna akhir agar panduan operasional kasir dan pemilik toko selalu mutakhir.
