<template>
  <aside
    :class="[
      'app-sidebar',
      {
        'is-collapsed': uiStore.isSidebarCollapsed,
        'mobile-open': uiStore.isMobileSidebarOpen
      }
    ]"
  >
    <!-- Brand / Logo Header -->
    <div class="sidebar-header">
      <div class="brand-container">
        <div class="brand-logo-glow">
          <div class="brand-logo-icon">
            <AppIcon name="pos" :size="20" />
          </div>
        </div>

        <div v-if="!uiStore.isSidebarCollapsed" class="brand-text">
          <span class="brand-title">ABDI POS</span>
          <span class="brand-subtitle">Smart Retail & F&B</span>
        </div>
      </div>

      <!-- Collapse Toggle Button -->
      <button
        type="button"
        class="collapse-toggle-btn"
        aria-label="Kecilkan/Perlebar Sidebar"
        @click="uiStore.toggleSidebar"
      >
        <AppIcon
          name="chevron-left"
          :size="16"
          :style="{ transform: uiStore.isSidebarCollapsed ? 'rotate(180deg)' : 'none' }"
        />
      </button>
    </div>

    <!-- Navigation Menu Items -->
    <nav class="sidebar-nav">
      <template v-for="(group, gIdx) in menuGroups" :key="gIdx">
        <div v-if="!uiStore.isSidebarCollapsed" class="nav-group-title">
          {{ group.title }}
        </div>
        <div v-else class="nav-group-divider" />

        <ul class="nav-list">
          <li v-for="item in group.items" :key="item.path" class="nav-item">
            <router-link
              :to="item.path"
              :class="['nav-link', { 'is-active': isActive(item.path) }]"
              :title="uiStore.isSidebarCollapsed ? item.label : undefined"
              @click="uiStore.isMobileSidebarOpen = false"
            >
              <div class="nav-icon-container">
                <AppIcon :name="item.icon" :size="18" />
              </div>

              <span v-if="!uiStore.isSidebarCollapsed" class="nav-label">
                {{ item.label }}
              </span>

              <!-- Badge / Tag -->
              <span
                v-if="!uiStore.isSidebarCollapsed && item.badge"
                :class="['nav-badge', `badge-${item.badgeType || 'primary'}`]"
              >
                {{ item.badge }}
              </span>

              <!-- Active Highlight Bar -->
              <span v-if="isActive(item.path)" class="active-indicator" />
            </router-link>
          </li>
        </ul>
      </template>
    </nav>

    <!-- Sidebar Footer / Subscription Status & Superadmin Switcher -->
    <div v-if="!uiStore.isSidebarCollapsed" class="sidebar-footer">
      <router-link to="/platform/dashboard" class="superadmin-switch-btn">
        <AppIcon name="shield" :size="16" />
        <span>Konsol Superadmin (Owner)</span>
      </router-link>

      <div class="subscription-card">
        <div class="sub-icon">
          <AppIcon name="sparkles" :size="16" />
        </div>
        <div class="sub-info">
          <span class="sub-plan">{{ authStore.tenant.plan }}</span>
          <span class="sub-status">Lisensi Aktif</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useUiStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import AppIcon from '../icons/AppIcon.vue'

const uiStore = useUiStore()
const authStore = useAuthStore()
const route = useRoute()

const isActive = (path) => {
  if (path === '/app/dashboard' && route.path === '/app/dashboard') return true
  if (path !== '/app/dashboard' && route.path.startsWith(path)) return true
  return false
}

// Menu structure compliant with PRD Section 4.1 & User Request
const menuGroups = [
  {
    title: 'MENU UTAMA',
    items: [
      { label: 'Dashboard', path: '/app/dashboard', icon: 'dashboard' },
      { label: 'Point of Sale (POS)', path: '/pos', icon: 'pos', badge: 'Live', badgeType: 'success' },
      { label: 'Komponen UI Showcase', path: '/app/components-demo', icon: 'sparkles', badge: 'Demo', badgeType: 'purple' }
    ]
  },
  {
    title: 'OPERASIONAL',
    items: [
      { label: 'Riwayat Transaksi', path: '/app/transactions', icon: 'receipt' },
      { label: 'Shift Kasir', path: '/app/shifts', icon: 'clock' },
      { label: 'Pesanan Self-Order', path: '/app/orders', icon: 'cart' }
    ]
  },
  {
    title: 'MASTER DATA',
    items: [
      { label: 'Produk Menu', path: '/app/products', icon: 'package' },
      { label: 'Kategori Produk', path: '/app/categories', icon: 'tag' },
      { label: 'Stok & Inventaris', path: '/app/inventory', icon: 'boxes' },
      { label: 'Pelanggan & Member', path: '/app/customers', icon: 'users' }
    ]
  },
  {
    title: 'PROMOSI & HARGA',
    items: [
      { label: 'Diskon & Bundling', path: '/app/promotions', icon: 'gift', badge: 'Promo', badgeType: 'warning' }
    ]
  },
  {
    title: 'BISNIS & ANALITIK',
    items: [
      { label: 'Laporan Penjualan', path: '/app/reports', icon: 'chart' },
      { label: 'Kelola Cabang / Outlet', path: '/app/outlets', icon: 'store' },
      { label: 'Staf & Hak Akses', path: '/app/users', icon: 'shield' }
    ]
  },
  {
    title: 'PENGATURAN',
    items: [
      { label: 'Profil Pengguna', path: '/app/profile', icon: 'user' },
      { label: 'Pengaturan Bisnis', path: '/app/settings', icon: 'settings' },
      { label: 'Domain & Subdomain', path: '/app/domains', icon: 'globe' },
      { label: 'Paket Langganan', path: '/app/subscription', icon: 'credit-card' }
    ]
  }
]
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 150;
  width: var(--sidebar-width);
  background: linear-gradient(180deg, var(--navy-950) 0%, var(--navy-900) 100%);
  border-right: 1px solid var(--navy-800);
  display: flex;
  flex-direction: column;
  transition: width var(--duration-normal) var(--ease-spring);
  overflow: hidden;
  box-shadow: 4px 0 24px rgba(7, 13, 24, 0.4);
}

.app-sidebar.is-collapsed {
  width: var(--sidebar-collapsed-width);
}

/* Header */
.sidebar-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  border-bottom: 1px solid var(--navy-800);
  background: rgba(11, 21, 40, 0.5);
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo-glow {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo-icon {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #ffffff;
  background: linear-gradient(90deg, #ffffff 0%, var(--primary-200) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-subtitle {
  font-size: 11px;
  color: var(--slate-400);
  font-weight: 500;
}

.collapse-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background-color: var(--navy-800);
  color: var(--slate-300);
  transition: all var(--duration-fast) ease;
}

.collapse-toggle-btn:hover {
  background-color: var(--primary-600);
  color: #ffffff;
}

/* Nav Menu */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-group-title {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--slate-400);
  letter-spacing: 0.08em;
  padding: 12px 10px 4px 10px;
}

.nav-group-divider {
  height: 1px;
  background-color: var(--navy-800);
  margin: 10px 4px;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: var(--radius-md);
  color: var(--slate-300);
  font-size: 13.5px;
  font-weight: 500;
  transition: all var(--duration-fast) var(--ease-spring);
  text-decoration: none;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.nav-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  color: var(--slate-400);
  transition: all var(--duration-fast) ease;
}

.nav-link:hover .nav-icon-container {
  color: var(--primary-400);
  transform: scale(1.1);
}

.nav-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Active Nav State */
.nav-link.is-active {
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.1) 100%);
  color: #ffffff;
  font-weight: 700;
  border: 1px solid rgba(59, 130, 246, 0.35);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.2);
}

.nav-link.is-active .nav-icon-container {
  color: var(--primary-400);
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  background-color: var(--primary-500);
  border-radius: var(--radius-full);
  box-shadow: 0 0 8px var(--primary-400);
}

/* Badges */
.nav-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-primary { background: rgba(37, 99, 235, 0.3); color: var(--primary-300); }
.badge-success { background: rgba(16, 185, 129, 0.25); color: #34d399; }
.badge-warning { background: rgba(245, 158, 11, 0.25); color: #fbbf24; }
.badge-purple { background: rgba(139, 92, 246, 0.3); color: #c084fc; }

/* Footer */
.sidebar-footer {
  padding: 14px 16px;
  border-top: 1px solid var(--navy-800);
  background: rgba(11, 21, 40, 0.6);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.superadmin-switch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%);
  border: 1px solid rgba(129, 140, 248, 0.4);
  color: #c7d2fe;
  font-size: 12px;
  font-weight: 700;
  transition: all var(--duration-fast) ease;
}

.superadmin-switch-btn:hover {
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  transform: translateY(-1px);
}

.subscription-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: rgba(37, 99, 235, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.sub-icon {
  color: var(--primary-400);
  display: flex;
  align-items: center;
}

.sub-info {
  display: flex;
  flex-direction: column;
}

.sub-plan {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
}

.sub-status {
  font-size: 10.5px;
  color: #34d399;
  font-weight: 500;
}

/* Mobile responsive styles */
@media (max-width: 900px) {
  .app-sidebar {
    transform: translateX(-100%);
  }
  .app-sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>
