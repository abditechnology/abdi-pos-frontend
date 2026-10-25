<template>
  <div class="platform-layout">
    <!-- Superadmin Dedicated Sidebar -->
    <aside :class="['platform-sidebar', { 'is-collapsed': isCollapsed }]">
      <!-- Header -->
      <div class="sidebar-header">
        <div class="brand-box">
          <div class="brand-badge-halo">
            <AppIcon name="shield" :size="20" />
          </div>
          <div v-if="!isCollapsed" class="brand-info">
            <span class="brand-name">ABDI POS</span>
            <span class="brand-role">Superadmin SaaS</span>
          </div>
        </div>

        <button
          type="button"
          class="collapse-btn"
          aria-label="Kecilkan sidebar"
          @click="isCollapsed = !isCollapsed"
        >
          <AppIcon
            name="chevron-left"
            :size="16"
            :style="{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }"
          />
        </button>
      </div>

      <!-- Superadmin Navigation Menu -->
      <nav class="sidebar-nav">
        <div v-if="!isCollapsed" class="nav-section-title">KONSOL SAAS OWNER</div>
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.path">
            <router-link
              :to="item.path"
              :class="['nav-link', { 'is-active': isActive(item.path) }]"
              :title="isCollapsed ? item.label : undefined"
            >
              <div class="icon-wrap">
                <AppIcon :name="item.icon" :size="18" />
              </div>
              <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
              <span
                v-if="!isCollapsed && item.badge"
                :class="['nav-badge', `badge-${item.badgeType || 'primary'}`]"
              >
                {{ item.badge }}
              </span>
            </router-link>
          </li>
        </ul>

        <!-- Switcher to Tenant Store -->
        <div class="store-switch-box" v-if="!isCollapsed">
          <div class="switch-title">SIMULASI TOKO</div>
          <p class="switch-desc">Lihat bagaimana aplikasi terlihat dari kacamata pemilik toko/kasir.</p>
          <router-link to="/app/dashboard" class="switch-btn">
            <AppIcon name="store" :size="16" />
            <span>Masuk ke Mode Tenant</span>
          </router-link>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div v-if="!isCollapsed" class="sidebar-footer">
        <div class="platform-version">
          <span class="pulse-dot" />
          <span>SaaS Engine v1.0 • Laravel 13</span>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div :class="['platform-main', { 'sidebar-collapsed': isCollapsed }]">
      <!-- Superadmin Header -->
      <header class="platform-header">
        <div class="header-left">
          <div class="superadmin-pill">
            <AppIcon name="shield" :size="16" />
            <span>KONSOL PEMILIK SAAS</span>
          </div>
          <span class="mrr-pill">
            MRR: <strong>Rp {{ formatNumber(platformStore.totalMRR) }}</strong>/bln
          </span>
        </div>

        <div class="header-right">
          <!-- Switch back to Tenant POS button -->
          <router-link to="/pos" class="quick-pos-link">
            <AppIcon name="pos" :size="16" />
            <span>Tes Kasir POS</span>
          </router-link>

          <router-link to="/app/dashboard" class="tenant-portal-link">
            <AppIcon name="store" :size="16" />
            <span>Buka Portal Tenant</span>
          </router-link>

          <!-- Superadmin Avatar / Profile Link -->
          <router-link to="/app/profile" class="superadmin-profile" title="Lihat Profil Saya">
            <div class="admin-avatar">SA</div>
            <div class="admin-meta">
              <span class="admin-name">Superadmin (Owner POS)</span>
              <span class="admin-tag">Full Platform Access</span>
            </div>
          </router-link>
        </div>
      </header>

      <!-- Page Content View -->
      <main class="page-container">
        <RouterView v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" v-if="Component" :key="$route.fullPath" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <!-- Global Toast Viewport -->
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, RouterView, RouterLink } from 'vue-router'
import { usePlatformStore } from '../../modules/platform/stores/platformStore'
import AppIcon from '../../shared/components/icons/AppIcon.vue'
import ToastContainer from '../../shared/components/ui/ToastContainer.vue'

const platformStore = usePlatformStore()
const route = useRoute()
const isCollapsed = ref(false)

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(Number(num) || 0)

const isActive = (path) => {
  if (path === '/platform/dashboard' && route.path === '/platform/dashboard') return true
  if (path !== '/platform/dashboard' && route.path.startsWith(path)) return true
  return false
}

const navItems = computed(() => [
  { label: 'Ringkasan Platform', path: '/platform/dashboard', icon: 'dashboard' },
  { label: 'Kelola Tenant (Klien)', path: '/platform/tenants', icon: 'store', badge: String(platformStore.totalTenants ?? 0), badgeType: 'primary' },
  { label: 'Paket Langganan', path: '/platform/plans', icon: 'credit-card', badge: String(platformStore.plans?.length ?? 0), badgeType: 'purple' },
  { label: 'Domain & DNS SaaS', path: '/platform/domains', icon: 'globe' },
  { label: 'Audit Logs Aktivitas', path: '/platform/audit-logs', icon: 'shield' }
])
</script>

<style scoped>
.platform-layout {
  min-height: 100vh;
  display: flex;
  background-color: var(--bg-app);
}

.platform-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 150;
  width: var(--sidebar-width);
  background: linear-gradient(180deg, #090e1a 0%, #0d1527 100%);
  border-right: 1px solid #1a253c;
  display: flex;
  flex-direction: column;
  transition: width var(--duration-normal) var(--ease-spring);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
}

.platform-sidebar.is-collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  border-bottom: 1px solid #1a253c;
}

.brand-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-badge-halo {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.4);
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.05em;
}

.brand-role {
  font-size: 11px;
  color: #a5b4fc;
  font-weight: 600;
}

.collapse-btn {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-sm);
  background-color: #1a253c;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  background-color: var(--primary-600);
  color: #ffffff;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-section-title {
  font-size: 10.5px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.08em;
  padding: 10px 10px 4px 10px;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: var(--radius-md);
  color: #cbd5e1;
  font-size: 13.5px;
  font-weight: 500;
  transition: all var(--duration-fast) var(--ease-spring);
  text-decoration: none;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.nav-link.is-active {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.3) 0%, rgba(59, 130, 246, 0.15) 100%);
  color: #ffffff;
  font-weight: 700;
  border: 1px solid rgba(129, 140, 248, 0.4);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

.icon-wrap {
  width: 22px;
  color: #818cf8;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.badge-primary { background: rgba(59, 130, 246, 0.3); color: #93c5fd; }
.badge-purple { background: rgba(139, 92, 246, 0.3); color: #c084fc; }

.store-switch-box {
  margin-top: auto;
  padding: 14px;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid #1e293b;
  border-radius: var(--radius-lg);
}

.switch-title {
  font-size: 10.5px;
  font-weight: 700;
  color: #818cf8;
  letter-spacing: 0.05em;
}

.switch-desc {
  font-size: 11px;
  color: #94a3b8;
  margin: 4px 0 10px 0;
  line-height: 1.4;
}

.switch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  border-radius: var(--radius-md);
  background-color: #1e293b;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  transition: all var(--duration-fast) ease;
}

.switch-btn:hover {
  background-color: var(--primary-600);
}

.sidebar-footer {
  padding: 12px 18px;
  border-top: 1px solid #1a253c;
  background-color: rgba(9, 14, 26, 0.8);
}

.platform-version {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: #10b981;
  box-shadow: 0 0 6px #10b981;
}

/* Main */
.platform-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  transition: margin-left var(--duration-normal) var(--ease-spring);
}

.platform-main.sidebar-collapsed {
  margin-left: var(--sidebar-collapsed-width);
}

.platform-header {
  height: var(--header-height);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-app);
  box-shadow: var(--shadow-xs);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.superadmin-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%);
  color: #4338ca;
  border: 1px solid #c7d2fe;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
}

.mrr-pill {
  font-size: 13px;
  color: var(--text-secondary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quick-pos-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  background-color: var(--slate-100);
  color: var(--slate-700);
  font-size: 12.5px;
  font-weight: 600;
  transition: all var(--duration-fast) ease;
}

.quick-pos-link:hover {
  background-color: var(--primary-50);
  color: var(--primary-700);
}

.tenant-portal-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}

.superadmin-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 6px;
  border-radius: var(--radius-full);
  background-color: var(--slate-100);
}

.admin-avatar {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  background-color: #4338ca;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
}

.admin-meta {
  display: flex;
  flex-direction: column;
}

.admin-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-main);
}

.admin-tag {
  font-size: 10px;
  color: var(--text-muted);
}

.page-container {
  flex: 1;
  padding: 24px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}
</style>
