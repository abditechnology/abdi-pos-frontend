<template>
  <header class="app-header">
    <div class="header-left">
      <!-- Mobile Sidebar Toggle -->
      <button
        type="button"
        class="mobile-menu-btn"
        aria-label="Buka Menu Navigasi"
        @click="uiStore.toggleMobileSidebar"
      >
        <AppIcon name="dashboard" :size="20" />
      </button>

      <!-- Tenant & Breadcrumb Context -->
      <div class="breadcrumb-container">
        <div class="tenant-tag">
          <span class="tenant-dot" />
          <span class="tenant-name">{{ authStore.tenant.name }}</span>
        </div>
        <span class="breadcrumb-separator">/</span>
        <span class="current-page">{{ currentPageTitle }}</span>
      </div>
    </div>

    <div class="header-right">
      <!-- Outlet Switcher Component (PRD Section 7) -->
      <OutletSelector />

      <!-- Quick POS / Cashier Launch Button with Glowing Animation -->
      <router-link to="/pos" class="pos-quick-btn">
        <div class="pos-btn-content">
          <AppIcon name="pos" :size="18" />
          <span class="pos-btn-label">Buka POS</span>
        </div>
        <span class="pos-shortcut-key">F2</span>
      </router-link>

      <!-- Notification Center Trigger -->
      <div class="notification-wrapper" ref="notificationRef">
        <button
          type="button"
          class="icon-action-btn"
          aria-label="Pusat Notifikasi"
          :class="{ 'has-unread': unreadCount > 0 }"
          @click="isNotificationOpen = !isNotificationOpen"
        >
          <AppIcon name="bell" :size="20" />
          <span v-if="unreadCount > 0" class="unread-badge">
            {{ unreadCount }}
            <span class="unread-ping" />
          </span>
        </button>

        <!-- Notification Dropdown Panel -->
        <Transition name="dropdown-spring">
          <div v-if="isNotificationOpen" class="notification-dropdown">
            <div class="notification-header">
              <div class="notif-title-row">
                <h4 class="notif-title">Notifikasi</h4>
                <span v-if="unreadCount > 0" class="unread-pill">{{ unreadCount }} Baru</span>
              </div>
              <button
                type="button"
                class="mark-read-btn"
                @click="uiStore.markAllNotificationsAsRead"
              >
                Tandai Dibaca
              </button>
            </div>

            <div class="notification-list">
              <div
                v-for="item in uiStore.notifications"
                :key="item.id"
                :class="['notif-item', { 'notif-unread': item.unread }]"
              >
                <div :class="['notif-icon-box', `icon-${item.type}`]">
                  <AppIcon :name="getNotifIcon(item.type)" :size="16" />
                </div>
                <div class="notif-details">
                  <div class="notif-item-title">{{ item.title }}</div>
                  <div class="notif-item-msg">{{ item.message }}</div>
                  <span class="notif-item-time">{{ item.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- User Profile Dropdown / Card -->
      <div class="user-profile-btn">
        <img
          :src="authStore.user.avatar"
          alt="Avatar Staf"
          class="user-avatar"
        />
        <div class="user-meta">
          <span class="user-name">{{ authStore.user.name }}</span>
          <span class="user-role">{{ authStore.user.role }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useUiStore } from '../../stores/uiStore'
import OutletSelector from './OutletSelector.vue'
import AppIcon from '../icons/AppIcon.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()
const route = useRoute()

const isNotificationOpen = ref(false)
const notificationRef = ref(null)

const unreadCount = computed(() => {
  return uiStore.notifications.filter(n => n.unread).length
})

const currentPageTitle = computed(() => {
  if (route.name === 'dashboard') return 'Dashboard Utama'
  if (route.name === 'components-demo') return 'Showcase Komponen UI'
  if (route.name === 'pos') return 'Point of Sale (POS)'
  if (route.name === 'products') return 'Master Produk'
  if (route.name === 'categories') return 'Kategori Produk'
  if (route.name === 'inventory') return 'Stok & Inventaris'
  if (route.name === 'transactions') return 'Riwayat Transaksi'
  if (route.name === 'shifts') return 'Shift Kasir'
  if (route.name === 'reports') return 'Laporan Penjualan'
  if (route.name === 'outlets') return 'Kelola Outlet'
  if (route.name === 'settings') return 'Pengaturan Bisnis'
  return route.meta?.title || 'POS SaaS'
})

const getNotifIcon = (type) => {
  if (type === 'warning') return 'alert-triangle'
  if (type === 'success') return 'check-circle'
  return 'info'
}

// Close notification on click outside
const handleClickOutside = (e) => {
  if (notificationRef.value && !notificationRef.value.contains(e.target)) {
    isNotificationOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-app);
  box-shadow: var(--shadow-xs);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  color: var(--slate-700);
  background-color: var(--slate-100);
}

.breadcrumb-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tenant-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: var(--slate-100);
  border-radius: var(--radius-full);
}

.tenant-dot {
  width: 8px;
  height: 8px;
  background-color: var(--primary-600);
  border-radius: var(--radius-full);
}

.tenant-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--slate-700);
}

.breadcrumb-separator {
  color: var(--slate-300);
  font-size: 14px;
}

.current-page {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* Quick POS Button */
.pos-quick-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 12px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
  color: #ffffff;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 13.5px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transition: all var(--duration-fast) var(--ease-spring);
}

.pos-quick-btn:hover {
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.pos-btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pos-shortcut-key {
  font-size: 10.5px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.22);
  padding: 2px 5px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.05em;
}

/* Action Icons */
.notification-wrapper {
  position: relative;
}

.icon-action-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background-color: var(--slate-100);
  color: var(--slate-600);
  transition: all var(--duration-fast) ease;
}

.icon-action-btn:hover {
  background-color: var(--primary-50);
  color: var(--primary-600);
}

.unread-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background-color: var(--danger-500);
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 700;
  border-radius: var(--radius-full);
  border: 2px solid #ffffff;
}

.unread-ping {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-full);
  background-color: var(--danger-500);
  animation: pulseGlow 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
  opacity: 0.75;
}

/* Notification Dropdown */
.notification-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 250;
  width: 340px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-app);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background-color: var(--slate-50);
  border-bottom: 1px solid var(--slate-100);
}

.notif-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notif-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.unread-pill {
  font-size: 11px;
  font-weight: 600;
  background-color: var(--primary-100);
  color: var(--primary-700);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.mark-read-btn {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--primary-600);
  transition: color var(--duration-fast) ease;
}

.mark-read-btn:hover {
  color: var(--primary-800);
  text-decoration: underline;
}

.notification-list {
  max-height: 320px;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--slate-100);
  transition: background-color var(--duration-fast) ease;
}

.notif-item:hover {
  background-color: var(--slate-50);
}

.notif-unread {
  background-color: #f8fbff;
}

.notif-icon-box {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-warning { background-color: var(--warning-100); color: var(--warning-600); }
.icon-success { background-color: var(--success-100); color: var(--success-600); }
.icon-info { background-color: var(--primary-100); color: var(--primary-600); }

.notif-details {
  flex: 1;
}

.notif-item-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.notif-item-msg {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-top: 2px;
}

.notif-item-time {
  font-size: 11px;
  color: var(--text-muted);
  display: block;
  margin-top: 4px;
}

/* User Profile Badge */
.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 4px 4px;
  border-radius: var(--radius-full);
  background-color: var(--slate-100);
  border: 1px solid var(--slate-200);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.user-profile-btn:hover {
  background-color: var(--slate-200);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 2px solid #ffffff;
}

.user-meta {
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-right: 6px;
}

.user-name {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.user-role {
  font-size: 10.5px;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .mobile-menu-btn { display: flex; }
  .user-meta { display: none; }
  .pos-shortcut-key { display: none; }
  .breadcrumb-container { display: none; }
}
</style>
