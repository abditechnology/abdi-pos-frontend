<template>
  <div class="platform-profile-page space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Profil & Pengaturan Superadmin</h1>
        <p class="page-subtitle">
          Kelola identitas pemilik platform SaaS, keamanan sistem akun root, dan preferensi operasional ekosistem Abdi POS.
        </p>
      </div>
    </div>

    <!-- Hero Card Profile Superadmin -->
    <section class="profile-hero-card base-card">
      <div class="hero-cover-pattern" />

      <div class="hero-body">
        <div class="profile-avatar-container">
          <img
            :src="platformStore.superadmin.avatar"
            :alt="platformStore.superadmin.name"
            class="hero-avatar-img"
          />
          <button
            type="button"
            class="avatar-camera-btn"
            title="Ubah Foto Profil"
            @click="openEditModal"
          >
            <AppIcon name="camera" :size="16" />
          </button>
        </div>

        <div class="hero-user-details">
          <div class="user-name-row">
            <h2 class="user-display-name">{{ platformStore.superadmin.name }}</h2>
            <BaseBadge variant="purple" size="md">
              <AppIcon name="shield" :size="12" class="mr-1" />
              {{ platformStore.superadmin.role }}
            </BaseBadge>
          </div>

          <p class="user-title-line">
            <AppIcon name="sparkles" :size="15" />
            <span>{{ platformStore.superadmin.title }}</span>
            <span class="dot-separator">•</span>
            <span class="user-location-tag">{{ platformStore.superadmin.location }}</span>
          </p>

          <div class="user-chips-row">
            <span class="chip-item">
              <AppIcon name="mail" :size="13" />
              {{ platformStore.superadmin.email }}
            </span>
            <span class="chip-item">
              <AppIcon name="phone" :size="13" />
              {{ platformStore.superadmin.phone }}
            </span>
            <span class="chip-item">
              <AppIcon name="clock" :size="13" />
              Bergabung sejak {{ platformStore.superadmin.joinDate }}
            </span>
          </div>
        </div>

        <!-- Quick Top Actions (Referenced from Tenant Profile Page) -->
        <div class="hero-actions">
          <BaseButton variant="primary" size="md" @click="openEditModal">
            <template #icon><AppIcon name="settings" :size="16" /></template>
            Ubah Data Profil
          </BaseButton>

          <BaseButton variant="outline" size="md" @click="openPasswordModal">
            <template #icon><AppIcon name="lock" :size="16" /></template>
            Ganti Password
          </BaseButton>

          <router-link to="/app/dashboard" class="header-link-btn">
            <AppIcon name="store" :size="16" />
            <span>Mode Tenant</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 4 Overview Metric Cards -->
    <div class="metrics-grid-4">
      <div class="stat-card">
        <div class="stat-icon-halo halo-purple">
          <AppIcon name="shield" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Hak Akses Superadmin</span>
          <span class="stat-value text-purple-700">Root Access</span>
          <span class="stat-sub">Level 0 (Tanpa Batasan)</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-blue">
          <AppIcon name="store" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Tenant Terdaftar</span>
          <span class="stat-value">{{ platformStore.totalTenants }} Bisnis</span>
          <span class="stat-sub">{{ platformStore.activeTenants }} tenant aktif berlangganan</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-emerald">
          <AppIcon name="chart" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Pendapatan MRR SaaS</span>
          <span class="stat-value font-mono text-emerald-700">Rp {{ formatNumber(platformStore.totalMRR) }}</span>
          <span class="stat-sub">Total tagihan bulanan berulang</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-cyan">
          <AppIcon name="lock" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Status Keamanan 2FA</span>
          <span class="stat-value text-cyan-700">
            {{ platformStore.superadmin.twoFactorEnabled ? 'Aktif & Aman' : 'Nonaktif' }}
          </span>
          <span class="stat-sub">Autentikasi dua faktor aktif</span>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation Bar -->
    <div class="tabs-nav-bar base-card">
      <button
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === 'profile' }"
        @click="activeTab = 'profile'"
      >
        <AppIcon name="user" :size="16" />
        <span>Data Pribadi & Kontak</span>
      </button>

      <button
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === 'security' }"
        @click="activeTab = 'security'"
      >
        <AppIcon name="lock" :size="16" />
        <span>Keamanan & Sesi Root</span>
      </button>

      <button
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === 'preferences' }"
        @click="activeTab = 'preferences'"
      >
        <AppIcon name="settings" :size="16" />
        <span>Preferensi Platform SaaS</span>
      </button>
    </div>

    <!-- TAB 1: DATA PRIBADI & KONTAK -->
    <div v-if="activeTab === 'profile'" class="tab-pane base-card">
      <div class="pane-header">
        <h3 class="pane-title">Informasi Profil Pemilik Platform</h3>
        <p class="pane-subtitle">Data ini digunakan untuk identifikasi akun Superadmin SaaS dan tanda tangan digital faktur.</p>
      </div>

      <form @submit.prevent="saveProfileForm" class="space-y-4 max-w-3xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput
            v-model="profileForm.name"
            label="Nama Lengkap"
            placeholder="Abdulloh Najib"
            :required="true"
          />

          <BaseInput
            v-model="profileForm.email"
            label="Email Superadmin"
            type="email"
            placeholder="admin@abdipos.com"
            :required="true"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput
            v-model="profileForm.phone"
            label="Nomor WhatsApp / HP"
            placeholder="0812-3456-7890"
            :required="true"
          />

          <BaseInput
            v-model="profileForm.title"
            label="Jabatan / Title"
            placeholder="Platform Architect & CEO"
            :required="true"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput
            v-model="profileForm.location"
            label="Kota / Wilayah"
            placeholder="Tulungagung, Jawa Timur, ID"
            :required="true"
          />

          <BaseInput
            v-model="profileForm.address"
            label="Alamat Operasional Kantor"
            placeholder="Jl. Pahlawan No. 88, Kedungwaru, Tulungagung"
          />
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end">
          <BaseButton variant="primary" size="md" type="submit" :loading="isSavingProfile">
            <template #icon><AppIcon name="check" :size="16" /></template>
            Simpan Perubahan Profil
          </BaseButton>
        </div>
      </form>
    </div>

    <!-- TAB 2: KEAMANAN & SESI ROOT -->
    <div v-if="activeTab === 'security'" class="tab-pane space-y-6">
      <!-- 2FA & Password Status Card -->
      <BaseCard>
        <div class="pane-header mb-4">
          <h3 class="pane-title">Keamanan Autentikasi Root</h3>
          <p class="pane-subtitle">Proteksi lapis ganda untuk mencegah akses yang tidak sah ke konsol manajemen SaaS.</p>
        </div>

        <div class="space-y-4 divide-y divide-slate-100">
          <!-- 2FA Toggle -->
          <div class="flex items-center justify-between pt-2">
            <div>
              <h4 class="text-sm font-bold text-slate-800">Autentikasi Dua Faktor (2FA)</h4>
              <p class="text-xs text-slate-500">Wajibkan kode OTP dari Google Authenticator saat login Superadmin.</p>
            </div>
            <label class="switch-toggle">
              <input
                type="checkbox"
                v-model="platformStore.superadmin.twoFactorEnabled"
                @change="handle2faToggle"
              />
              <span class="slider round"></span>
            </label>
          </div>

          <!-- Password change quick button -->
          <div class="flex items-center justify-between pt-4">
            <div>
              <h4 class="text-sm font-bold text-slate-800">Kata Sandi Akun Superadmin</h4>
              <p class="text-xs text-slate-500">Terakhir diperbarui: 11 Oktober 2026 (Disarankan ganti berkala setiap 90 hari).</p>
            </div>
            <BaseButton variant="outline" size="sm" @click="openPasswordModal">
              Ganti Kata Sandi
            </BaseButton>
          </div>

          <!-- Session Timeout -->
          <div class="flex items-center justify-between pt-4">
            <div>
              <h4 class="text-sm font-bold text-slate-800">Batas Waktu Sesi Login (Session Timeout)</h4>
              <p class="text-xs text-slate-500">Sesi akan otomatis berakhir jika tidak ada aktivitas dalam rentang waktu ini.</p>
            </div>
            <select
              v-model="platformStore.superadmin.sessionTimeout"
              class="form-select text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300"
              @change="handleTimeoutChange"
            >
              <option value="8 Jam">8 Jam Operasional</option>
              <option value="24 Jam">24 Jam (Rekomendasi)</option>
              <option value="7 Hari">7 Hari</option>
              <option value="30 Hari">30 Hari</option>
            </select>
          </div>
        </div>
      </BaseCard>

      <!-- Active Sessions List -->
      <BaseCard>
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="pane-title">Sesi Login Aktif Superadmin</h3>
            <p class="pane-subtitle">Perangkat yang saat ini terautentikasi ke konsol Superadmin SaaS.</p>
          </div>
          <BaseButton variant="danger" size="sm" @click="revokeOtherSessions">
            Putuskan Sesi Lain
          </BaseButton>
        </div>

        <div class="space-y-3">
          <div
            v-for="session in platformStore.superadmin.activeSessions"
            :key="session.id"
            class="session-item p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="session-icon-box">
                <AppIcon :name="session.device.includes('iPhone') ? 'phone' : 'shield'" :size="20" class="text-slate-600" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-bold text-slate-900">{{ session.device }}</h4>
                  <BaseBadge v-if="session.current" variant="success" size="sm">Device Ini</BaseBadge>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">
                  IP: {{ session.ip }} • Lokasi: {{ session.location }} • Status: {{ session.time }}
                </p>
              </div>
            </div>

            <div v-if="!session.current">
              <button
                type="button"
                class="text-xs font-semibold text-rose-600 hover:text-rose-800"
                @click="terminateSession(session.id)"
              >
                Putuskan
              </button>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- TAB 3: PREFERENSI PLATFORM SAAS -->
    <div v-if="activeTab === 'preferences'" class="tab-pane base-card space-y-6">
      <div class="pane-header">
        <h3 class="pane-title">Preferensi & Operasional Platform</h3>
        <p class="pane-subtitle">Konfigurasi global ekosistem SaaS Abdi POS yang berdampak pada seluruh tenant.</p>
      </div>

      <div class="space-y-4 divide-y divide-slate-100">
        <!-- Maintenance Mode -->
        <div class="flex items-center justify-between pt-2">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-slate-800">Mode Pemeliharaan (Maintenance Mode)</h4>
              <BaseBadge :variant="platformStore.superadmin.maintenanceMode ? 'danger' : 'neutral'" size="sm">
                {{ platformStore.superadmin.maintenanceMode ? 'SISTEM DITUTUP' : 'NORMAL' }}
              </BaseBadge>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Jika diaktifkan, seluruh tenant toko akan melihat layar pemeliharaan sementara kecuali akun Superadmin.
            </p>
          </div>
          <label class="switch-toggle">
            <input
              type="checkbox"
              v-model="platformStore.superadmin.maintenanceMode"
              @change="handleMaintenanceToggle"
            />
            <span class="slider round"></span>
          </label>
        </div>

        <!-- Email Notifications -->
        <div class="pt-4">
          <h4 class="text-sm font-bold text-slate-800 mb-2">Notifikasi Email Masuk ke Superadmin</h4>
          <div class="space-y-2.5">
            <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                v-model="platformStore.superadmin.emailNotifications.newTenant"
                class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Kirim email saat ada tenant bisnis baru mendaftar akun SaaS</span>
            </label>

            <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                v-model="platformStore.superadmin.emailNotifications.subscriptionPaid"
                class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Kirim email saat pembayaran tagihan langganan berhasil diverifikasi</span>
            </label>

            <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                v-model="platformStore.superadmin.emailNotifications.serverAlerts"
                class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Kirim alert instan saat terdeteksi error fatal pada infrastruktur server</span>
            </label>
          </div>
        </div>

        <!-- Automated Database Backup -->
        <div class="flex items-center justify-between pt-4">
          <div>
            <h4 class="text-sm font-bold text-slate-800">Cadangan Basis Data Otomatis (Auto-Backup)</h4>
            <p class="text-xs text-slate-500">Snapshot harian seluruh tenant dienkripsi dan disimpan di Cloud Storage.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Setiap 02:00 WIB
            </span>
            <BaseButton variant="secondary" size="sm" @click="triggerManualBackup">
              Backup Sekarang
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 1: UBAH DATA PROFIL CEPAT -->
    <BaseModal
      v-model="showEditModal"
      title="Ubah Data Profil Superadmin"
      size="md"
    >
      <form @submit.prevent="submitEditModal" class="space-y-4">
        <BaseInput
          v-model="editModalForm.name"
          label="Nama Lengkap"
          placeholder="Abdulloh Najib"
          :required="true"
        />

        <BaseInput
          v-model="editModalForm.email"
          label="Email Superadmin"
          type="email"
          placeholder="admin@abdipos.com"
          :required="true"
        />

        <BaseInput
          v-model="editModalForm.phone"
          label="Nomor WhatsApp"
          placeholder="0812-3456-7890"
          :required="true"
        />

        <BaseInput
          v-model="editModalForm.title"
          label="Jabatan / Peran"
          placeholder="Platform Architect & CEO"
          :required="true"
        />

        <BaseInput
          v-model="editModalForm.location"
          label="Lokasi / Kota"
          placeholder="Tulungagung, Jawa Timur, ID"
          :required="true"
        />

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <BaseButton variant="secondary" size="sm" @click="showEditModal = false">
            Batal
          </BaseButton>
          <BaseButton variant="primary" size="sm" type="submit">
            Simpan Perubahan
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- MODAL 2: GANTI PASSWORD SUPERADMIN -->
    <BaseModal
      v-model="showPasswordModal"
      title="Ganti Kata Sandi Superadmin"
      size="md"
    >
      <form @submit.prevent="submitPasswordModal" class="space-y-4">
        <BaseInput
          v-model="passwordForm.oldPassword"
          label="Kata Sandi Lama"
          type="password"
          placeholder="Masukkan password saat ini"
          :required="true"
        />

        <BaseInput
          v-model="passwordForm.newPassword"
          label="Kata Sandi Baru"
          type="password"
          placeholder="Minimal 8 karakter kombinasi huruf & angka"
          :required="true"
        />

        <BaseInput
          v-model="passwordForm.confirmPassword"
          label="Konfirmasi Kata Sandi Baru"
          type="password"
          placeholder="Ulangi kata sandi baru"
          :required="true"
        />

        <div class="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
          <AppIcon name="alert-triangle" :size="14" class="inline mr-1" />
          Mengganti kata sandi superadmin akan mencatat entri keamanan baru pada Audit Log platform.
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <BaseButton variant="secondary" size="sm" @click="showPasswordModal = false">
            Batal
          </BaseButton>
          <BaseButton variant="primary" size="sm" type="submit" :loading="isSavingPassword">
            Perbarui Kata Sandi
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import BaseInput from '@/shared/components/ui/BaseInput.vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import { usePlatformStore } from '../stores/platformStore'
import { useToast } from '@/shared/composables/useToast'

const platformStore = usePlatformStore()
const toast = useToast()

const activeTab = ref('profile')
const isSavingProfile = ref(false)
const isSavingPassword = ref(false)
const showEditModal = ref(false)
const showPasswordModal = ref(false)

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(Number(num) || 0)

const profileForm = reactive({
  name: platformStore.superadmin.name,
  email: platformStore.superadmin.email,
  phone: platformStore.superadmin.phone,
  title: platformStore.superadmin.title,
  location: platformStore.superadmin.location,
  address: platformStore.superadmin.address
})

const editModalForm = reactive({ ...profileForm })

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

function saveProfileForm() {
  isSavingProfile.value = true
  setTimeout(() => {
    platformStore.updateSuperadminProfile({ ...profileForm })
    isSavingProfile.value = false
  }, 600)
}

function openEditModal() {
  Object.assign(editModalForm, {
    name: platformStore.superadmin.name,
    email: platformStore.superadmin.email,
    phone: platformStore.superadmin.phone,
    title: platformStore.superadmin.title,
    location: platformStore.superadmin.location,
    address: platformStore.superadmin.address
  })
  showEditModal.value = true
}

function submitEditModal() {
  platformStore.updateSuperadminProfile({ ...editModalForm })
  Object.assign(profileForm, editModalForm)
  showEditModal.value = false
}

function openPasswordModal() {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  showPasswordModal.value = true
}

function submitPasswordModal() {
  if (passwordForm.newPassword.length < 6) {
    toast.error('Kata sandi baru minimal 6 karakter!')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error('Konfirmasi kata sandi baru tidak cocok!')
    return
  }

  isSavingPassword.value = true
  setTimeout(() => {
    platformStore.updateSuperadminPassword(passwordForm.oldPassword, passwordForm.newPassword)
    isSavingPassword.value = false
    showPasswordModal.value = false
  }, 800)
}

function handle2faToggle() {
  toast.info(
    platformStore.superadmin.twoFactorEnabled
      ? 'Autentikasi dua faktor (2FA) diaktifkan.'
      : 'Autentikasi dua faktor dinonaktifkan.',
    'Keamanan 2FA'
  )
}

function handleTimeoutChange() {
  toast.success(`Batas waktu sesi berhasil diatur ke ${platformStore.superadmin.sessionTimeout}`)
}

function handleMaintenanceToggle() {
  if (platformStore.superadmin.maintenanceMode) {
    toast.warning('Mode Pemeliharaan aktif. Portal tenant saat ini ditutup untuk umum!')
  } else {
    toast.success('Mode Pemeliharaan dimatikan. Semua portal tenant kembali normal.')
  }
}

function revokeOtherSessions() {
  platformStore.superadmin.activeSessions = platformStore.superadmin.activeSessions.filter(s => s.current)
  toast.success('Seluruh sesi login Superadmin pada perangkat lain telah diputuskan!')
}

function terminateSession(sessionId) {
  platformStore.superadmin.activeSessions = platformStore.superadmin.activeSessions.filter(s => s.id !== sessionId)
  toast.info('Sesi perangkat berhasil diputuskan.')
}

function triggerManualBackup() {
  toast.info('Memulai snapshot database platform SaaS...')
  setTimeout(() => {
    toast.success('Database backup berhasil dibuat dan tersimpan aman di Cloud Storage!')
  }, 1200)
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.header-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: #ffffff;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s ease;
}

.header-link-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

/* Hero Card */
.profile-hero-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: #ffffff;
  border: 1px solid var(--border-app);
}

.hero-cover-pattern {
  height: 120px;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%);
  position: relative;
}

.hero-cover-pattern::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 16px 16px;
  opacity: 0.5;
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
  background: #4338ca;
  color: #ffffff;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.avatar-camera-btn:hover {
  background: #3730a3;
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

.hero-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 4px;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.user-display-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}

.user-title-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  margin-top: 0.25rem;
}

.dot-separator {
  color: #cbd5e1;
}

.user-chips-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.chip-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: #64748b;
  background: #f8fafc;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
}

/* Tabs Bar */
.tabs-nav-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.375rem;
  border-radius: var(--radius-lg);
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tab-btn:hover {
  color: #0f172a;
}

.tab-btn.active {
  background: #ffffff;
  color: #4338ca;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-pane {
  padding: 1.5rem;
  border-radius: var(--radius-xl);
}

.pane-header {
  margin-bottom: 1.25rem;
}

.pane-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.pane-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* Switch toggle */
.switch-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #cbd5e1;
  transition: .3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
}

input:checked + .slider {
  background-color: #4338ca;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.session-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
</style>
