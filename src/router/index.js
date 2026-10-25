import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../app/layouts/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/app/dashboard'
    },
    {
      path: '/app',
      component: AppLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../modules/dashboard/pages/DashboardPage.vue'),
          meta: { title: 'Dashboard Utama' }
        },
        {
          path: 'components-demo',
          name: 'components-demo',
          component: () => import('../modules/showcase/pages/ComponentShowcasePage.vue'),
          meta: { title: 'Showcase Komponen UI' }
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Riwayat Transaksi',
            description: 'Daftar seluruh transaksi struk kasir dan pembayaran digital.',
            icon: 'receipt',
            actionLabel: 'Export Transaksi (CSV)',
            outletScoped: true
          }
        },
        {
          path: 'shifts',
          name: 'shifts',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Shift Kasir',
            description: 'Kelola jam kerja, uang kas masuk, dan rekonsiliasi kas kasir.',
            icon: 'clock',
            actionLabel: 'Buka Shift Baru',
            outletScoped: true
          }
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Pesanan Self-Order',
            description: 'Pantau pesanan yang masuk dari QR meja dan website storefront.',
            icon: 'cart',
            actionLabel: 'Atur Meja & QR'
          }
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Master Produk & Menu',
            description: 'Kelola item menu, SKU, harga jual, dan konfigurasi bahan.',
            icon: 'package',
            actionLabel: 'Tambah Produk Baru'
          }
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Kategori Produk',
            description: 'Pengelompokan menu seperti Terang Bulan, Martabak, Minuman.',
            icon: 'tag',
            actionLabel: 'Tambah Kategori'
          }
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Stok & Inventaris Cabang',
            description: 'Pantau mutasi bahan baku dan sisa persediaan di outlet terpilih.',
            icon: 'boxes',
            actionLabel: 'Penyesuaian Stok (Opname)',
            outletScoped: true
          }
        },
        {
          path: 'customers',
          name: 'customers',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Pelanggan & Referral',
            description: 'Database pelanggan loyal, poin membership, dan kode referral.',
            icon: 'users',
            actionLabel: 'Daftarkan Pelanggan'
          }
        },
        {
          path: 'promotions',
          name: 'promotions',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Diskon & Bundling Promosi',
            description: 'Atur paket bundling hemat, tebus murah, dan voucher potongan harga.',
            icon: 'gift',
            actionLabel: 'Buat Promo Baru'
          }
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Laporan Penjualan & Analitik',
            description: 'Laporan laba kotor, item terlaris, metode bayar, dan performa cabang.',
            icon: 'chart',
            actionLabel: 'Download Laporan (Excel)',
            outletScoped: true
          }
        },
        {
          path: 'outlets',
          name: 'outlets',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Kelola Cabang / Outlet',
            description: 'Daftar cabang operasional bisnis di bawah naungan tenant Anda.',
            icon: 'store',
            actionLabel: 'Tambah Cabang Baru'
          }
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Staf & Hak Akses',
            description: 'Kelola akun kasir, supervisor cabang, dan izin akses fitur.',
            icon: 'shield',
            actionLabel: 'Undang Staf Baru'
          }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Pengaturan Bisnis Tenant',
            description: 'Profil bisnis, logo toko, format struk, dan opsi pajak default.',
            icon: 'settings',
            actionLabel: 'Simpan Perubahan'
          }
        },
        {
          path: 'domains',
          name: 'domains',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Domain & Subdomain SaaS',
            description: 'Kelola subdomain bawaan (.abdipos.com) atau pasang custom domain (.com/.id).',
            icon: 'globe',
            actionLabel: 'Pasang Custom Domain'
          }
        },
        {
          path: 'subscription',
          name: 'subscription',
          component: () => import('../modules/generic/pages/ModulePlaceholderPage.vue'),
          meta: {
            title: 'Paket Langganan SaaS',
            description: 'Informasi paket Pro Plan, batasan cabang aktif, dan tagihan.',
            icon: 'credit-card',
            actionLabel: 'Kelola Langganan'
          }
        }
      ]
    },
    // Standalone Fullscreen POS Interface (Wrapped in AppLayout for consistent header & navigation)
    {
      path: '/pos',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'pos',
          component: () => import('../modules/pos/pages/PosCashierPage.vue'),
          meta: { title: 'Point of Sale (Kasir)' }
        }
      ]
    },
    // Fallback redirect
    {
      path: '/:pathMatch(.*)*',
      redirect: '/app/dashboard'
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
