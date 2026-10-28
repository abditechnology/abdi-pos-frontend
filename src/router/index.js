import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../app/layouts/AppLayout.vue'
import PlatformLayout from '../app/layouts/PlatformLayout.vue'

// Platform module pages statically loaded for instant rock-solid rendering
import PlatformDashboardPage from '../modules/platform/pages/PlatformDashboardPage.vue'
import PlatformTenantsPage from '../modules/platform/pages/PlatformTenantsPage.vue'
import PlatformPlansPage from '../modules/platform/pages/PlatformPlansPage.vue'
import PlatformPluginsPage from '../modules/platform/pages/PlatformPluginsPage.vue'
import PlatformDomainsPage from '../modules/platform/pages/PlatformDomainsPage.vue'
import PlatformAuditLogsPage from '../modules/platform/pages/PlatformAuditLogsPage.vue'
import PlatformProfilePage from '../modules/platform/pages/PlatformProfilePage.vue'

// Auth module pages
import LoginPage from '../modules/auth/pages/LoginPage.vue'
import ProfilePage from '../modules/auth/pages/ProfilePage.vue'

// Mode transition store
import { useModeTransitionStore } from '../shared/stores/modeTransitionStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { title: 'Masuk Akun — Abdi POS' }
    },
    {
      path: '/',
      redirect: '/app/dashboard'
    },
    {
      path: '/app',
      component: AppLayout,
      children: [
        {
          path: 'profile',
          name: 'profile',
          component: ProfilePage,
          meta: { title: 'Profil Saya' }
        },
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
          component: () => import('../modules/transactions/pages/TransactionsPage.vue'),
          meta: {
            title: 'Riwayat Transaksi',
            description: 'Daftar seluruh transaksi struk kasir dan pembayaran digital.',
            icon: 'receipt',
            outletScoped: true
          }
        },
        {
          path: 'shifts',
          name: 'shifts',
          component: () => import('../modules/transactions/pages/ShiftsPage.vue'),
          meta: {
            title: 'Shift Kasir',
            description: 'Kelola jam kerja, uang kas masuk, dan rekonsiliasi kas kasir.',
            icon: 'clock',
            outletScoped: true
          }
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('../modules/orders/pages/OrdersPage.vue'),
          meta: {
            title: 'Pesanan Self-Order',
            description: 'Pantau pesanan yang masuk dari QR meja dan website storefront.',
            icon: 'cart'
          }
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('../modules/products/pages/ProductsPage.vue'),
          meta: {
            title: 'Master Produk & Menu',
            description: 'Kelola item menu, SKU, harga jual, dan konfigurasi bahan.',
            icon: 'package'
          }
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('../modules/products/pages/CategoriesPage.vue'),
          meta: {
            title: 'Kategori Produk',
            description: 'Pengelompokan menu seperti Terang Bulan, Martabak, Minuman.',
            icon: 'tag'
          }
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('../modules/inventory/pages/InventoryPage.vue'),
          meta: {
            title: 'Stok & Inventaris Cabang',
            description: 'Pantau mutasi bahan baku dan sisa persediaan di outlet terpilih.',
            icon: 'boxes',
            outletScoped: true
          }
        },
        {
          path: 'customers',
          name: 'customers',
          component: () => import('../modules/customers/pages/CustomersPage.vue'),
          meta: {
            title: 'Pelanggan & Referral',
            description: 'Database pelanggan loyal, poin membership, dan kode referral.',
            icon: 'users'
          }
        },
        {
          path: 'promotions',
          name: 'promotions',
          component: () => import('../modules/promotions/pages/PromotionsPage.vue'),
          meta: {
            title: 'Diskon & Bundling Promosi',
            description: 'Atur paket bundling hemat, tebus murah, dan voucher potongan harga.',
            icon: 'gift'
          }
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('../modules/reports/pages/ReportsPage.vue'),
          meta: {
            title: 'Laporan Penjualan & Analitik',
            description: 'Laporan laba kotor, item terlaris, metode bayar, dan performa cabang.',
            icon: 'chart',
            outletScoped: true
          }
        },
        {
          path: 'outlets',
          name: 'outlets',
          component: () => import('../modules/outlets/pages/OutletsPage.vue'),
          meta: {
            title: 'Kelola Cabang / Outlet',
            description: 'Daftar cabang operasional bisnis di bawah naungan tenant Anda.',
            icon: 'store'
          }
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../modules/outlets/pages/StaffPage.vue'),
          meta: {
            title: 'Staf & Hak Akses',
            description: 'Kelola akun kasir, supervisor cabang, dan izin akses fitur.',
            icon: 'shield'
          }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../modules/settings/pages/BusinessSettingsPage.vue'),
          meta: {
            title: 'Pengaturan Bisnis Tenant',
            description: 'Profil bisnis, logo toko, format struk, dan opsi pajak default.',
            icon: 'settings'
          }
        },
        {
          path: 'domains',
          name: 'domains',
          component: () => import('../modules/settings/pages/TenantDomainsPage.vue'),
          meta: {
            title: 'Domain & Subdomain SaaS',
            description: 'Kelola subdomain bawaan (.abdipos.com) atau pasang custom domain (.com/.id).',
            icon: 'globe'
          }
        },
        {
          path: 'plugins',
          name: 'plugins',
          component: () => import('../modules/settings/pages/PluginMarketplacePage.vue'),
          meta: {
            title: 'Plugin & Ekstensi Modular',
            description: 'Koleksi plugin modular tambahan (add-on) untuk operasional salon, spa, laundry, dan retail.',
            icon: 'sparkles'
          }
        },
        {
          path: 'subscription',
          name: 'subscription',
          component: () => import('../modules/settings/pages/SubscriptionPage.vue'),
          meta: {
            title: 'Paket Langganan SaaS',
            description: 'Informasi paket Pro Plan, batasan cabang aktif, dan tagihan.',
            icon: 'credit-card'
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
    // Superadmin SaaS Owner Console
    {
      path: '/platform',
      component: PlatformLayout,
      children: [
        {
          path: '',
          redirect: '/platform/dashboard'
        },
        {
          path: 'dashboard',
          name: 'platform-dashboard',
          component: PlatformDashboardPage,
          meta: { title: 'Ringkasan Platform SaaS' }
        },
        {
          path: 'tenants',
          name: 'platform-tenants',
          component: PlatformTenantsPage,
          meta: { title: 'Kelola Tenant SaaS' }
        },
        {
          path: 'plans',
          name: 'platform-plans',
          component: PlatformPlansPage,
          meta: { title: 'Paket Langganan SaaS' }
        },
        {
          path: 'plugins',
          name: 'platform-plugins',
          component: PlatformPluginsPage,
          meta: { title: 'Kelola Plugin & Ekstensi Modular' }
        },
        {
          path: 'domains',
          name: 'platform-domains',
          component: PlatformDomainsPage,
          meta: { title: 'Pemetaan Domain SaaS' }
        },
        {
          path: 'audit-logs',
          name: 'platform-audit-logs',
          component: PlatformAuditLogsPage,
          meta: { title: 'Audit Trail Superadmin' }
        },
        {
          path: 'profile',
          name: 'platform-profile',
          component: PlatformProfilePage,
          meta: { title: 'Profil & Pengaturan Superadmin' }
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

// Navigation Guard for Smooth Animated Loading between Tenant and Superadmin Modes
router.beforeEach((to, from) => {
  const isFromTenant = from.matched.length > 0 && (from.path.startsWith('/app') || from.path.startsWith('/pos'))
  const isToSuperadmin = to.path.startsWith('/platform')

  const isFromSuperadmin = from.matched.length > 0 && from.path.startsWith('/platform')
  const isToTenant = to.path.startsWith('/app') || to.path.startsWith('/pos')

  if (isFromTenant && isToSuperadmin) {
    try {
      const modeStore = useModeTransitionStore()
      modeStore.startTransition('superadmin')
    } catch (e) {
      console.warn('Mode transition warning:', e)
    }
  } else if (isFromSuperadmin && isToTenant) {
    try {
      const modeStore = useModeTransitionStore()
      modeStore.startTransition('tenant')
    } catch (e) {
      console.warn('Mode transition warning:', e)
    }
  }

  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — Abdi POS`
  }
})

export default router
