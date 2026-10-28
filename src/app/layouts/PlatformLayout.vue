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

          <!-- Superadmin Avatar / Profile Popup Dropdown -->
          <div class="user-profile-wrapper" ref="profileDropdownRef">
            <button
              type="button"
              class="user-profile-btn superadmin-profile-btn"
              :class="{ 'is-active': isProfileOpen }"
              aria-label="Menu Superadmin"
              @click="isProfileOpen = !isProfileOpen"
            >
              <img
                :src="platformStore.superadmin?.avatar"
                :alt="platformStore.superadmin?.name"
                class="user-avatar admin-avatar-img"
              />
              <div class="user-meta">
                <span class="user-name">{{ platformStore.superadmin?.name || 'Abdulloh Najib' }}</span>
                <span class="user-role">{{ platformStore.superadmin?.role || 'Superadmin SaaS' }}</span>
              </div>
              <AppIcon
                name="chevron-down"
                :size="14"
                custom-class="profile-chevron"
                :style="{ transform: isProfileOpen ? 'rotate(180deg)' : 'none' }"
              />
            </button>

            <!-- Dropdown Popup Menu -->
            <Transition name="dropdown-spring">
              <div v-if="isProfileOpen" class="user-dropdown-menu">
                <div class="dropdown-user-header superadmin-dropdown-header">
                  <img
                    :src="platformStore.superadmin?.avatar"
                    :alt="platformStore.superadmin?.name"
                    class="dropdown-avatar"
                  />
                  <div class="dropdown-user-info">
                    <strong>{{ platformStore.superadmin?.name }}</strong>
                    <span class="dropdown-email">{{ platformStore.superadmin?.email }}</span>
                    <span class="dropdown-badge badge-purple">Root Level 0 (Full Access)</span>
                  </div>
                </div>

                <div class="dropdown-menu-list">
                  <router-link
                    to="/platform/profile"
                    class="dropdown-menu-item"
                    @click="isProfileOpen = false"
                  >
                    <AppIcon name="user" :size="16" />
                    <span>Lihat Profil & Pengaturan</span>
                  </router-link>

                  <!-- <router-link
                    to="/platform/plugins"
                    class="dropdown-menu-item"
                    @click="isProfileOpen = false"
                  >
                    <AppIcon name="sparkles" :size="16" />
                    <span>Kelola Katalog Plugin</span>
                  </router-link>

                  <router-link
                    to="/platform/plans"
                    class="dropdown-menu-item"
                    @click="isProfileOpen = false"
                  >
                    <AppIcon name="credit-card" :size="16" />
                    <span>Kelola Paket Langganan</span>
                  </router-link>

                  <router-link
                    to="/platform/tenants"
                    class="dropdown-menu-item"
                    @click="isProfileOpen = false"
                  >
                    <AppIcon name="store" :size="16" />
                    <span>Daftar Klien Tenant</span>
                  </router-link> -->

                  <hr class="dropdown-divider" />

                  <router-link
                    to="/app/dashboard"
                    class="dropdown-menu-item item-tenant"
                    @click="isProfileOpen = false"
                  >
                    <AppIcon name="store" :size="16" />
                    <span>Beralih ke Mode Tenant</span>
                  </router-link>

                  <router-link
                    to="/login"
                    class="dropdown-menu-item item-logout"
                    @click="isProfileOpen = false"
                  >
                    <AppIcon name="log-out" :size="16" />
                    <span>Keluar / Logout</span>
                  </router-link>
                </div>
              </div>
            </Transition>
          </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterView, RouterLink } from 'vue-router'
import { usePlatformStore } from '../../modules/platform/stores/platformStore'
import { usePluginStore } from '../../shared/stores/pluginStore'
import AppIcon from '../../shared/components/icons/AppIcon.vue'
import ToastContainer from '../../shared/components/ui/ToastContainer.vue'

const platformStore = usePlatformStore()
const pluginStore = usePluginStore()
const route = useRoute()
const isCollapsed = ref(false)

const isProfileOpen = ref(false)
const profileDropdownRef = ref(null)

const handleClickOutside = (e) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target)) {
    isProfileOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

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
  { label: 'Katalog Plugin SaaS', path: '/platform/plugins', icon: 'sparkles', badge: String(pluginStore.plugins?.length ?? 0), badgeType: 'purple' },
  { label: 'Domain & DNS SaaS', path: '/platform/domains', icon: 'globe' },
  { label: 'Audit Logs Aktivitas', path: '/platform/audit-logs', icon: 'shield' },
  { label: 'Profil & Pengaturan', path: '/platform/profile', icon: 'settings' }
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

/* Superadmin Profile Popup Dropdown Trigger */
.user-profile-wrapper {
  position: relative;
}

.superadmin-profile-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 5px;
  border-radius: var(--radius-full);
  background-color: var(--slate-100);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.superadmin-profile-btn:hover {
  background-color: #ede9fe;
  border-color: #c7d2fe;
}

.superadmin-profile-btn.is-active {
  background-color: #ede9fe;
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.admin-avatar-img {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 2px solid #818cf8;
}

.user-meta {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.user-name {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.user-role {
  font-size: 10.5px;
  color: #64748b;
}

.profile-chevron {
  color: #64748b;
  transition: transform var(--duration-fast) ease;
}

/* User Dropdown Menu */
.user-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 270px;
  background-color: #ffffff;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-app);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
  z-index: 200;
  overflow: hidden;
}

.superadmin-dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%);
  border-bottom: 1px solid #e2e8f0;
}

.dropdown-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 2px solid #818cf8;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dropdown-user-info strong {
  font-size: 13.5px;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-email {
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-badge.badge-purple {
  font-size: 10px;
  font-weight: 700;
  color: #7e22ce;
  background-color: #f3e8ff;
  padding: 1px 6px;
  border-radius: 4px;
  margin-top: 4px;
  display: inline-block;
  width: fit-content;
}

.dropdown-menu-list {
  display: flex;
  flex-direction: column;
  padding: 6px;
}

.dropdown-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  background: none;
  border: none;
  text-decoration: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.dropdown-menu-item:hover {
  background-color: #f1f5f9;
  color: #4338ca;
}

.dropdown-divider {
  border: 0;
  height: 1px;
  background-color: #f1f5f9;
  margin: 4px 6px;
}

.item-tenant {
  color: #2563eb;
  font-weight: 600;
}

.item-tenant:hover {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.item-logout {
  color: #ef4444;
}

.item-logout:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

/* Dropdown Spring Animation */
.dropdown-spring-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-spring-leave-active {
  transition: all 0.15s ease-in;
}
.dropdown-spring-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
.dropdown-spring-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.page-container {
  flex: 1;
  padding: 24px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}
</style>
