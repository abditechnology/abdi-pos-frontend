# 🚀 Abdi POS — Frontend Technical & Coding Documentation

Dokumen ini berisi catatan teknis, standar arsitektur, panduan penulisan kode, serta dokumentasi komponen pendukung untuk seluruh pengembang (*engineers / programmers*) yang berkontribusi pada repositori `abdi-pos-frontend`.

Aplikasi ini dibangun mengacu secara ketat pada spesifikasi:
- **Acuan Utama**: `prd_frontend.md` (Frontend Technical PRD POS SaaS)
- **Alat Bacaan / Konteks Backend**: `prd_backend.md` (Laravel 13 Modular Monolith API)

---

## 📑 Daftar Isi
1. [Tech Stack & Prinsip Arsitektur](#-tech-stack--prinsip-arsitektur)
2. [Struktur Folder & Standar Penamaan](#-struktur-folder--standar-penamaan)
3. [Design System & Aturan Styling (Modern Blue)](#-design-system--aturan-styling-modern-blue)
4. [State Management & Data Flow (Pinia & Composables)](#-state-management--data-flow)
5. [Katalog & API Komponen Pendukung](#-katalog--api-komponen-pendukung)
6. [Panduan Menjalankan & Build Aplikasi](#-panduan-menjalankan--build-aplikasi)
7. [Aturan Kontribusi & Pemeliharaan Dokumen](#-aturan-kontribusi--pemeliharaan-dokumen)

---

## 🛠 Tech Stack & Prinsip Arsitektur

| Komponen | Pilihan Teknologi | Keterangan |
|---|---|---|
| **Framework** | Vue 3 (Composition API `<script setup>`) | Typed, modular, performa tinggi |
| **Build Tool** | Vite 8+ | Hot Module Replacement (HMR) instan & build optimal |
| **State Management** | Pinia 4+ | Store terpisah per domain (`auth`, `outlet`, `ui`) |
| **Routing** | Vue Router | Nested routes, layout shells, route meta |
| **Typography** | Plus Jakarta Sans | Modern geometric sans-serif |
| **Icons** | Custom Crisp SVG Component (`AppIcon.vue`) | Zero-dependency, 35+ SVG icons (pos, cart, package, store, trash, shield, dll.) |
| **Styling** | Vanilla CSS Tokens & Utility Architecture | Zero compile overhead, spring easing, glassmorphic |

### Prinsip Utama (Architectural Rules)
1. **Pragmatic Layering (PRD Section 3.1)**:
   - UI murni dan atomik ditaruh di `src/shared/components/ui/`.
   - Logika halaman dan koordinasi data ditaruh di `src/modules/<nama_modul>/pages/`.
   - Jangan membuat *abstraksi berlebih* (Repository/Service class tiruan) jika hanya untuk operasi CRUD sederhana.
2. **Deterministic Route Shells & Layout Chunking**:
   - Layout utama (`AppLayout.vue` dan `PlatformLayout.vue`) beserta seluruh halaman konsol platform diimpor secara statis (*static import*) pada `src/router/index.js` untuk mengeliminasi potensi kegagalan *dynamic chunk loading* / network race condition pada browser.
   - Parent route `/platform` tidak menggunakan redirect langsung di level parent (menghindari redirect loop / aborted navigation), melainkan didelegasikan ke child route `{ path: '', redirect: '/platform/dashboard' }`.
   - Inisialisasi aplikasi pada `src/main.js` menunggu `router.isReady()` sebelum memanggil `app.mount('#app')`, dilengkapi penangkap error visual global (`app.config.errorHandler` & window error logger) sehingga aplikasi tidak pernah mengalami *silent blank screen*.
   - Semua `<RouterView>` dengan `<Transition>` dipagari guard `v-if="Component"` dan dipasangi `:key="$route.fullPath"`.
3. **Defensive Template Formatting**:
   - Seluruh pemformatan angka/mata uang pada template Vue dilarang memanggil method langsung seperti `.toLocaleString()` tanpa nilai fallback. Gunakan helper `formatNumber(val)` berbasis `Intl.NumberFormat('id-ID')` yang aman dari nilai `null`/`undefined`.
4. **Authority Tenancy & Backend First**:
   - Frontend tidak menentukan harga akhir, diskon, atau pajak secara otoritatif. Angka pada checkout disinkronkan dari respon kalkulasi backend.
   - `tenant_id` tidak dikirim sebagai bukti kepemilikan data; backend menurunkannya dari sesi otentikasi domain/token.
5. **Multi-Outlet Awareness (PRD Section 7)**:
   - Modul operasional (POS, Shift, Inventaris, Transaksi) selalu terikat pada cabang aktif (`currentOutletId` di `outletStore`).
   - Mengganti cabang aktif melalui `OutletSelector` otomatis memicu penyegaran konteks data tanpa memuat ulang seluruh halaman.
6. **Immediate Watcher Function Ordering (TDZ Safety)**:
   - Pada blok `<script setup>`, penggunaan `watch(source, callback, { immediate: true })` menyebabkan callback dieksekusi secara sinkron saat inisialisasi komponen. Seluruh fungsi pembantu (seperti `resetForm()`) yang dipanggil di dalam watcher wajib dideklarasikan secara leksikal *sebelum* `watch` untuk mencegah `ReferenceError` akibat Temporal Dead Zone (TDZ).

---

## 📁 Struktur Folder & Standar Penamaan

```
abdi-pos-frontend/src/
├── app/
│   ├── layouts/
│   │   ├── AppLayout.vue          # Layout tenant toko (Sidebar kolapsibel, Header, Toast viewport)
│   │   └── PlatformLayout.vue     # Layout eksklusif Superadmin (SaaS Owner Console)
│   └── router/
│       └── index.js               # Route configuration & lazy imports
├── shared/
│   ├── components/
│   │   ├── icons/
│   │   │   └── AppIcon.vue        # 30+ SVG icons siap pakai (pos, cart, package, store, dll.)
│   │   ├── layout/
│   │   │   ├── AppHeader.vue      # Header atas, breadcrumb, outlet selector, tombol POS
│   │   │   ├── AppSidebar.vue     # Navigasi bertingkat dengan grouping & badge
│   │   │   └── OutletSelector.vue # Switcher cabang interaktif
│   │   └── ui/
│   │       ├── BaseAlert.vue      # Banner peringatan (info, success, warning, danger)
│   │       ├── BaseBadge.vue      # Status badge dengan dot pulse
│   │       ├── BaseButton.vue     # Tombol 6 varian warna, 3 ukuran, loading state
│   │       ├── BaseCard.vue       # Kartu serbaguna dengan hover-lift
│   │       ├── BaseInput.vue      # Input teks dengan prefix/suffix icon & validasi error
│   │       ├── BaseModal.vue      # Modal pop-up (backdrop blur, focus trap, ESC listener)
│   │       ├── ConfirmModal.vue   # Modal konfirmasi tindakan penting / berbahaya
│   │       ├── MoneyDisplay.vue   # Format mata uang Rupiah (IDR) presisi
│   │       ├── SkeletonLoader.vue # Shimmer wave placeholder saat loading
│   │       └── ToastContainer.vue # Viewport mengambang untuk alert toast
│   ├── composables/
│   │   └── useToast.js            # Helper reaktif pemanggilan toast
│   ├── stores/
│   │   ├── authStore.js           # State pengguna, info tenant, & status shift kasir
│   │   ├── outletStore.js         # State daftar cabang & cabang aktif
│   │   └── uiStore.js             # State sidebar terbuka/tertutup & daftar notifikasi
│   └── styles/
│       └── design-system.css      # Variabel tema, palet biru, & animasi keyframe
└── modules/
    ├── dashboard/
    │   ├── components/            # StatCard, SalesChartWidget, RecentTransactions, dll.
    │   └── pages/DashboardPage.vue
    ├── pos/
    │   └── pages/PosCashierPage.vue
    ├── showcase/
    │   └── pages/ComponentShowcasePage.vue
    ├── auth/                      # MODUL OTENTIKASI & PROFIL PENGGUNA
    │   ├── components/
    │   │   ├── EditProfileModal.vue   # Modal CRUD profil (Nama, Email, HP, Domisili, Avatar)
    │   │   └── ChangePasswordModal.vue# Modal ganti sandi + Password Strength Meter
    │   └── pages/
    │       ├── LoginPage.vue          # Halaman masuk dengan 1-click Demo Account Switcher
    │       └── ProfilePage.vue        # Halaman profil lengkap, shift kasir, RBAC, sesi aktif
    ├── platform/                  # MODUL SUPERADMIN SAAS OWNER
    │   ├── components/
    │   │   ├── TenantModal.vue    # Modal pendaftaran & edit tenant baru
    │   │   └── PlanModal.vue      # Modal pembuatan & edit paket langganan
    │   ├── pages/
    │   │   ├── PlatformDashboardPage.vue # Metrik MRR, total tenant, & kesehatan sistem
    │   │   ├── PlatformTenantsPage.vue   # Manajemen tenant, impersonate, suspend
    │   │   ├── PlatformPlansPage.vue     # CRUD paket langganan & breakdown subscriber
    │   │   ├── PlatformDomainsPage.vue   # Monitoring verifikasi DNS & SSL
    │   │   └── PlatformAuditLogsPage.vue # Rekam jejak audit keamanan platform
    │   └── stores/
    │       └── platformStore.js   # State & actions pengelolaan SaaS platform
    └── generic/
        └── pages/ModulePlaceholderPage.vue
```

### Konvensi Penamaan (Naming Conventions)
- **Komponen Vue**: Menggunakan `PascalCase` (contoh: `BaseButton.vue`, `SalesChartWidget.vue`).
- **Composables**: Menggunakan awalan `use` dengan `camelCase` (contoh: `useToast.js`).
- **Pinia Stores**: Menggunakan awalan `use` diakhiri `Store` (contoh: `useOutletStore.js`).
- **Rute URL**: Menggunakan `kebab-case` (contoh: `/app/components-demo`, `/app/transactions`).
- **Kelas CSS**: Menggunakan `kebab-case` BEM-light (contoh: `.base-button`, `.btn-primary`, `.is-active`).

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

### Animasi & Interaksi (*Motion Guidelines*)
- Gunakan kurva pegas: `var(--ease-spring)` atau `cubic-bezier(0.16, 1, 0.3, 1)`.
- Semua tombol wajib memiliki efek tekan `active: scale(0.97)` agar terasa taktil dan responsif.
- Komponen kartu interaktif wajib menyertakan kelas `.card-hover-lift` (`translateY(-4px)` dengan bayangan *blue glow*).
- Loading indikator menggunakan `.skeleton-shimmer` yang bergerak horizontal secara konsisten.

---

## 🧠 State Management & Data Flow

### 1. `authStore` (`src/shared/stores/authStore.js`)
Menyimpan sesi pengguna saat ini, info tenant aktif (nama bisnis, paket langganan, subdomain/custom domain), status shift kasir berjalan (`activeShift`), serta data profil pengguna.
- **Actions**:
  - `login(email, password, remember)`: Otentikasi pengguna, mendukung pencocokan akun demo (Owner, Kasir, Superadmin) atau kredensial kustom.
  - `logout()`: Mengakhiri sesi dan membersihkan kredensial.
  - `updateProfile(data)`: Mengubah nama, kontak telepon/WA, alamat domisili, dan avatar foto pengguna.
  - `changePassword(oldPass, newPass)`: Memperbarui kata sandi dengan validasi keamanan.
  - `terminateSession(sessionId)`: Memutus koneksi dari perangkat lain yang terhubung.
- **Demo Accounts**: Menyediakan 3 kredensial akun instan (*1-click selector*) untuk mempermudah evaluasi antar peran (Owner, Kasir, Superadmin).

### 2. `outletStore` (`src/shared/stores/outletStore.js`)
Mengelola cabang yang diizinkan untuk pengguna:
```javascript
const outletStore = useOutletStore()
// Ambil data cabang aktif
const current = outletStore.currentOutlet
// Ganti cabang (otomatis memicu notifikasi toast)
outletStore.switchOutlet(targetOutletId)
```

### 3. `useToast` (`src/shared/composables/useToast.js`)
Sistem notifikasi mengambang global tanpa perlu me-mount komponen manual di setiap halaman:
```javascript
import { useToast } from '@/shared/composables/useToast'
const toast = useToast()

toast.success('Transaksi #TRX-101 berhasil disimpan', 'Sukses!')
toast.error('Printer kasir tidak merespon', 'Gagal')
toast.warning('Stok terigu tersisa 3 kg', 'Perhatian')
toast.info('Cabang berhasil dialihkan ke Tebet', 'Informasi')
```

### 4. `platformStore` (`src/modules/platform/stores/platformStore.js`)
Store khusus Superadmin (SaaS Owner) untuk memantau metrik ekosistem platform:
- **Metrik Terhitung**: `totalTenants`, `activeTenants`, `trialTenants`, `totalMRR` (pendapatan berulang bulanan), `totalOutletsManaged`.
- **Manajemen Tenant**: `createTenant(data)`, `updateTenantStatus(id, status, reason)`, `deleteTenant(id)`.
- **Manajemen Paket SaaS**: `createPlan(data)`, `updatePlan(id, data)`, `deletePlan(id)` (dengan proteksi blokir jika paket sedang dipakai tenant aktif).
- **Verifikasi Domain**: `verifyDomain(domainId)` (verifikasi DNS & penerbitan SSL wildcard/custom).
- **Audit Logging**: Rekam jejak otomatis setiap aksi superadmin demi keamanan multi-tenant.

---

## 🧩 Katalog & API Komponen Pendukung

### 1. `BaseButton.vue`
| Prop | Tipe | Default | Deskripsi |
|---|---|---|---|
| `variant` | String | `'primary'` | `'primary'`, `'secondary'`, `'outline'`, `'ghost'`, `'danger'`, `'success'` |
| `size` | String | `'md'` | `'sm'` (32px), `'md'` (40px), `'lg'` (48px touch-friendly) |
| `loading` | Boolean | `false` | Menampilkan spinner animasi dan menonaktifkan klik |
| `disabled`| Boolean | `false` | Mematikan tombol |
| `block` | Boolean | `false` | Lebar penuh 100% |
| `iconOnly`| Boolean | `false` | Bentuk proporsional untuk tombol hanya ikon |

**Slots**: `#icon` (ikon kiri), `#trailingIcon` (ikon kanan), *default* (teks tombol).

### 2. `BaseModal.vue`
Modal dialog yang telah memenuhi standar aksesibilitas WAI-ARIA (`role="dialog"`, `aria-modal="true"`, *body scroll lock*, dan penutup via tombol `ESC` atau klik latar luar).

| Prop | Tipe | Default | Deskripsi |
|---|---|---|---|
| `v-model` | Boolean | `false` | State visibilitas modal |
| `title` | String | `''` | Judul modal |
| `subtitle`| String | `''` | Sub-judul modal |
| `size` | String | `'md'` | `'sm'`, `'md'`, `'lg'`, `'xl'`, `'full'` |
| `showClose`| Boolean | `true` | Menampilkan tombol silang (X) di pojok |

**Slots**: `#header`, `#footer`, *default body*.

### 3. `ConfirmModal.vue`
Komponen dialog konfirmasi untuk tindakan krusial (misal: Void transaksi, Tutup shift kasir, Hapus data produk).
- Dilengkapi **halo ikon berdenyut (*pulsing ring*)**.
- Mendukung varian: `'danger'` (merah), `'warning'` (kuning/oranye), `'info'` (biru).
- Memancarkan event `@confirm` dan `@cancel`.

### 4. `BaseAlert.vue`
Banner pesan kontekstual dengan aksen garis kiri tebal dan ikon otomatis sesuai varian (`info`, `success`, `warning`, `danger`). Mendukung prop `dismissible="true"`.

### 5. `BaseInput.vue`
Input teks terstandarisasi dengan label, penanda wajib (`*`), slot `#prefix` & `#suffix`, tombol *clear* cepat, dan pesan error validasi yang beranimasi halus.

### 6. `MoneyDisplay.vue`
Menampilkan angka nominal Rupiah (IDR) dengan pemisah ribuan standar Indonesia (`Intl.NumberFormat('id-ID')`), simbol `Rp`, dan styling ukuran (`sm`, `md`, `lg`, `xl`).

### 7. `SkeletonLoader.vue`
Placeholder pemuatan data beranimasi shimmer untuk teks, avatar bundar, tombol, atau kartu (*card*).

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
Hasil berkas build siap rilis akan terbit di folder `dist/` dalam hitungan milidetik.

---

## 📌 Aturan Kontribusi & Pemeliharaan Dokumen

> [!IMPORTANT]
> **Aturan Pembaruan Berkas Dokumentasi:**
> Setiap kali ada penambahan fitur, perubahan komponen, pembaruan skema data, atau restrukturisasi antarmuka:
> 1. Perbarui **`README.md`** ini dengan rincian teknis, props komponen, atau rute baru.
> 2. Perbarui **`GUIDELINES.md`** dengan alur penggunaan bagi pengguna akhir agar panduan operasional kasir dan pemilik toko selalu mutakhir.
