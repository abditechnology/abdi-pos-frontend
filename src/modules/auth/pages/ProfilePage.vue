<template>
  <div class="profile-page animate-fade-in">
    <!-- Header Banner Profile -->
    <section class="profile-hero-card base-card card-bordered">
      <div class="hero-cover-pattern" />

      <div class="hero-body">
        <div class="profile-avatar-container">
          <img
            :src="authStore.user?.avatar"
            :alt="authStore.user?.name"
            class="hero-avatar-img"
          />
          <button
            type="button"
            class="avatar-camera-btn"
            title="Ubah Foto Profil"
            @click="isEditModalOpen = true"
          >
            <AppIcon name="camera" :size="16" />
          </button>
        </div>

        <div class="hero-user-details">
          <div class="user-name-row">
            <h1 class="user-display-name">{{ authStore.user?.name || 'Pengguna Abdi POS' }}</h1>
            <BaseBadge variant="primary" size="md">
              {{ authStore.user?.role || 'Staf Toko' }}
            </BaseBadge>
          </div>

          <p class="user-tenant-line">
            <AppIcon name="store" :size="15" />
            <span>{{ authStore.tenant?.name }}</span>
            <span class="dot-separator">•</span>
            <span class="user-outlet-tag">{{ authStore.user?.assignedOutletName }}</span>
          </p>

          <div class="user-chips-row">
            <span class="chip-item">
              <AppIcon name="mail" :size="13" />
              {{ authStore.user?.email }}
            </span>
            <span class="chip-item">
              <AppIcon name="phone" :size="13" />
              {{ authStore.user?.phone }}
            </span>
            <span class="chip-item">
              <AppIcon name="clock" :size="13" />
              Bergabung sejak {{ authStore.user?.joinDate }}
            </span>
          </div>
        </div>

        <!-- Quick Top Actions -->
        <div class="hero-actions">
          <BaseButton variant="primary" @click="isEditModalOpen = true">
            <template #icon><AppIcon name="settings" :size="16" /></template>
            Ubah Profil
          </BaseButton>

          <BaseButton variant="outline" @click="isPasswordModalOpen = true">
            <template #icon><AppIcon name="lock" :size="16" /></template>
            Ganti Password
          </BaseButton>

          <BaseButton variant="danger" @click="isLogoutModalOpen = true">
            <template #icon><AppIcon name="log-out" :size="16" /></template>
            Keluar Akun
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- 3 Overview Metric Cards -->
    <section class="profile-stats-grid">
      <!-- 1. Cabang & Penugasan -->
      <div class="stat-card base-card card-bordered card-hover-lift">
        <div class="stat-icon-halo theme-blue">
          <AppIcon name="store" :size="20" />
        </div>
        <div class="stat-info">
          <span class="stat-caption">Cabang Penugasan Saat Ini</span>
          <strong class="stat-value-text">{{ authStore.user?.assignedOutletName }}</strong>
          <span class="stat-hint text-success">
            <AppIcon name="check-circle" :size="12" />
            Shift Kasir Terhubung
          </span>
        </div>
      </div>

      <!-- 2. Status Shift Kasir Berjalan -->
      <div class="stat-card base-card card-bordered card-hover-lift">
        <div class="stat-icon-halo theme-indigo">
          <AppIcon name="clock" :size="20" />
        </div>
        <div class="stat-info">
          <span class="stat-caption">Status Shift Kasir Aktif</span>
          <strong class="stat-value-text">Shift #{{ authStore.activeShift?.id || '402' }}</strong>
          <span class="stat-hint">
            Buka sejak {{ authStore.activeShift?.openedAt?.split(' ')[1] || '08:00' }} WIB • Modal Rp {{ formatNumber(authStore.activeShift?.startingCash || 250000) }}
          </span>
        </div>
      </div>

      <!-- 3. Status Keamanan Akun -->
      <div class="stat-card base-card card-bordered card-hover-lift">
        <div class="stat-icon-halo theme-emerald">
          <AppIcon name="shield" :size="20" />
        </div>
        <div class="stat-info">
          <span class="stat-caption">Kekuatan Keamanan Akun</span>
          <strong class="stat-value-text text-success">Aman (85%)</strong>
          <span class="stat-hint">
            Sandi diubah: {{ authStore.user?.lastPasswordChange }}
          </span>
        </div>
      </div>
    </section>

    <!-- Main Content Tabs -->
    <div class="profile-tabs-card base-card card-bordered">
      <!-- Tab Navigation -->
      <div class="tabs-header-bar">
        <button
          type="button"
          :class="['tab-btn', { 'is-active': activeTab === 'info' }]"
          @click="activeTab = 'info'"
        >
          <AppIcon name="user" :size="16" />
          <span>Informasi Kontak & Domisili</span>
        </button>

        <button
          type="button"
          :class="['tab-btn', { 'is-active': activeTab === 'permissions' }]"
          @click="activeTab = 'permissions'"
        >
          <AppIcon name="shield" :size="16" />
          <span>Hak Akses & Otoritas (RBAC)</span>
        </button>

        <button
          type="button"
          :class="['tab-btn', { 'is-active': activeTab === 'sessions' }]"
          @click="activeTab = 'sessions'"
        >
          <AppIcon name="globe" :size="16" />
          <span>Sesi Perangkat Aktif</span>
        </button>
      </div>

      <!-- Tab 1: Info Kontak & Pribadi -->
      <div v-if="activeTab === 'info'" class="tab-pane animate-fade-in">
        <div class="info-grid">
          <div class="info-item">
            <span class="item-label">Nama Lengkap</span>
            <strong class="item-val">{{ authStore.user?.name }}</strong>
          </div>

          <div class="info-item">
            <span class="item-label">Alamat Email</span>
            <div class="email-val-row">
              <strong class="item-val">{{ authStore.user?.email }}</strong>
              <span class="verified-tag">Terverifikasi</span>
            </div>
          </div>

          <div class="info-item">
            <span class="item-label">Nomor WhatsApp / HP</span>
            <strong class="item-val">{{ authStore.user?.phone }}</strong>
          </div>

          <div class="info-item">
            <span class="item-label">Peran Sistem (Role)</span>
            <strong class="item-val">{{ authStore.user?.role }}</strong>
          </div>

          <div class="info-item full-width">
            <span class="item-label">Alamat Tempat Tinggal (Domisili)</span>
            <strong class="item-val">{{ authStore.user?.address || 'Belum diisi' }}</strong>
          </div>

          <div class="info-item full-width">
            <span class="item-label">Tenant Bisnis Terdaftar</span>
            <div class="tenant-meta-box">
              <div class="tenant-icon-box"><AppIcon name="store" :size="20" /></div>
              <div>
                <strong>{{ authStore.tenant?.name }}</strong>
                <p class="tenant-subtext">Domain: https://{{ authStore.tenant?.customDomain || authStore.tenant?.subdomain }} • Paket: {{ authStore.tenant?.plan }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Hak Akses & Perizinan (RBAC) -->
      <div v-else-if="activeTab === 'permissions'" class="tab-pane animate-fade-in">
        <div class="permissions-intro">
          <h4 class="section-title">Otoritas Pengguna pada Sistem POS</h4>
          <p class="section-subtitle">Daftar izin hak akses yang aktif berdasarkan peran {{ authStore.user?.role }}:</p>
        </div>

        <div class="permissions-grid">
          <div class="perm-card">
            <div class="perm-header">
              <AppIcon name="pos" :size="18" custom-class="text-primary-600" />
              <strong>Point of Sale (POS Kasir)</strong>
            </div>
            <p class="perm-desc">Menginput transaksi pesanan, memilih varian menu, dan menerima berbagai metode pembayaran (Tunai, QRIS, Kartu).</p>
            <BaseBadge variant="success" size="sm">Diizinkan</BaseBadge>
          </div>

          <div class="perm-card">
            <div class="perm-header">
              <AppIcon name="clock" :size="18" custom-class="text-primary-600" />
              <strong>Buka / Tutup Shift Kasir</strong>
            </div>
            <p class="perm-desc">Mencatat uang modal awal, rekonsiliasi kas kasir, menghitung uang fisik laci, dan mencetak laporan akhir shift.</p>
            <BaseBadge variant="success" size="sm">Diizinkan</BaseBadge>
          </div>

          <div class="perm-card">
            <div class="perm-header">
              <AppIcon name="package" :size="18" custom-class="text-primary-600" />
              <strong>Manajemen Produk & Harga</strong>
            </div>
            <p class="perm-desc">Menambah produk baru, mengubah harga jual makanan/minuman, dan mengatur komposisi resep bahan baku.</p>
            <BaseBadge :variant="authStore.user?.roleCode === 'cashier' ? 'neutral' : 'success'" size="sm">
              {{ authStore.user?.roleCode === 'cashier' ? 'Terbatas' : 'Diizinkan' }}
            </BaseBadge>
          </div>

          <div class="perm-card">
            <div class="perm-header">
              <AppIcon name="chart" :size="18" custom-class="text-primary-600" />
              <strong>Laporan Omset & Keuangan</strong>
            </div>
            <p class="perm-desc">Melihat grafik omset penjualan realtime, laporan laba kotor, dan riwayat mutasi persediaan multi-cabang.</p>
            <BaseBadge :variant="authStore.user?.roleCode === 'cashier' ? 'neutral' : 'success'" size="sm">
              {{ authStore.user?.roleCode === 'cashier' ? 'Hanya Shift Pribadi' : 'Seluruh Cabang' }}
            </BaseBadge>
          </div>
        </div>
      </div>

      <!-- Tab 3: Sesi Perangkat -->
      <div v-else-if="activeTab === 'sessions'" class="tab-pane animate-fade-in">
        <div class="sessions-header-row">
          <div>
            <h4 class="section-title">Perangkat yang Sedang Masuk</h4>
            <p class="section-subtitle">Pantau seluruh perangkat komputer, tablet POS, atau smartphone yang memiliki sesi aktif ke akun Anda.</p>
          </div>
        </div>

        <div class="sessions-list">
          <div
            v-for="s in authStore.user?.activeSessions"
            :key="s.id"
            class="session-item"
          >
            <div class="session-icon">
              <AppIcon name="globe" :size="20" />
            </div>

            <div class="session-details">
              <div class="session-device-row">
                <strong>{{ s.device }}</strong>
                <span v-if="s.current" class="current-session-badge">Perangkat Ini</span>
              </div>
              <p class="session-ip-line">IP: {{ s.ip }} • Lokasi: {{ s.location }}</p>
              <span class="session-time-text">{{ s.time }}</span>
            </div>

            <BaseButton
              v-if="!s.current"
              variant="outline"
              size="sm"
              @click="authStore.terminateSession(s.id)"
            >
              Putus Sesi
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EditProfileModal
      v-model="isEditModalOpen"
      @success="isEditModalOpen = false"
    />

    <ChangePasswordModal
      v-model="isPasswordModalOpen"
      @success="isPasswordModalOpen = false"
    />

    <!-- Confirm Logout Modal -->
    <ConfirmModal
      v-model="isLogoutModalOpen"
      title="Keluar dari Akun?"
      message="Apakah Anda yakin ingin keluar dari sesi aplikasi? Anda perlu memasukkan email dan kata sandi kembali untuk masuk."
      variant="warning"
      confirm-text="Ya, Keluar"
      cancel-text="Batal"
      @confirm="handleConfirmLogout"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../shared/stores/authStore'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseBadge from '../../../shared/components/ui/BaseBadge.vue'
import ConfirmModal from '../../../shared/components/ui/ConfirmModal.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'
import EditProfileModal from '../components/EditProfileModal.vue'
import ChangePasswordModal from '../components/ChangePasswordModal.vue'

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref('info')
const isEditModalOpen = ref(false)
const isPasswordModalOpen = ref(false)
const isLogoutModalOpen = ref(false)

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(Number(num) || 0)

const handleConfirmLogout = () => {
  authStore.logout()
  isLogoutModalOpen.value = false
  router.push('/login')
}
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Hero Card */
.profile-hero-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background-color: #ffffff;
  padding: 0;
}

.hero-cover-pattern {
  height: 120px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%);
  background-size: cover;
}

.hero-body {
  position: relative;
  padding: 0 28px 24px 28px;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}

.profile-avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin-top: -50px;
  flex-shrink: 0;
}

.hero-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 4px solid #ffffff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.avatar-camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--primary-600);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform var(--duration-fast) ease, background-color var(--duration-fast) ease;
}

.avatar-camera-btn:hover {
  background-color: var(--primary-700);
  transform: scale(1.08);
}

.hero-user-details {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 10px;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.user-display-name {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

.user-tenant-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  color: var(--text-secondary);
}

.dot-separator {
  color: var(--text-muted);
}

.user-outlet-tag {
  color: var(--primary-600);
  font-weight: 600;
}

.user-chips-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.chip-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 4px;
}

/* Stats Grid */
.profile-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: var(--radius-lg);
  background-color: #ffffff;
}

.stat-icon-halo {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.theme-blue { background-color: #eff6ff; color: #2563eb; }
.theme-indigo { background-color: #e0e7ff; color: #4338ca; }
.theme-emerald { background-color: #ecfdf5; color: #059669; }

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-caption {
  font-size: 11.5px;
  color: var(--text-muted);
  font-weight: 600;
}

.stat-value-text {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-main);
}

.stat-hint {
  font-size: 11.5px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Tabs Card */
.profile-tabs-card {
  border-radius: var(--radius-xl);
  background-color: #ffffff;
  overflow: hidden;
}

.tabs-header-bar {
  display: flex;
  border-bottom: 1px solid var(--border-app);
  padding: 0 16px;
  background-color: var(--slate-50);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-secondary);
  border: none;
  background: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--duration-fast) ease;
}

.tab-btn:hover {
  color: var(--primary-600);
}

.tab-btn.is-active {
  color: var(--primary-600);
  border-bottom-color: var(--primary-600);
  background-color: #ffffff;
}

.tab-pane {
  padding: 24px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  background-color: var(--slate-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.item-label {
  font-size: 11.5px;
  color: var(--text-muted);
  font-weight: 600;
}

.item-val {
  font-size: 14.5px;
  color: var(--text-main);
}

.email-val-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.verified-tag {
  font-size: 10.5px;
  font-weight: 700;
  background-color: #ecfdf5;
  color: #059669;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.tenant-meta-box {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 6px;
}

.tenant-icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: #eff6ff;
  color: var(--primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tenant-subtext {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* Permissions Grid */
.permissions-intro {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-main);
}

.section-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.perm-card {
  padding: 18px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-app);
  background-color: var(--slate-50);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.perm-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-main);
}

.perm-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 4px;
}

/* Sessions List */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-app);
  background-color: var(--slate-50);
}

.session-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-full);
  background-color: #eff6ff;
  color: var(--primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.session-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-device-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.current-session-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  background-color: #ecfdf5;
  color: #059669;
  border-radius: var(--radius-full);
}

.session-ip-line {
  font-size: 12px;
  color: var(--text-secondary);
}

.session-time-text {
  font-size: 11px;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .profile-stats-grid {
    grid-template-columns: 1fr;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
  .permissions-grid {
    grid-template-columns: 1fr;
  }
  .hero-body {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
