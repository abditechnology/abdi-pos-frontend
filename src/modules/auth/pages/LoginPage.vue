<template>
  <div class="login-wrapper">
    <!-- Ambient Background Lighting -->
    <div class="ambient-glow glow-1" />
    <div class="ambient-glow glow-2" />

    <div class="login-container animate-fade-in">
      <!-- Left Hero Brand Column -->
      <div class="brand-hero-panel">
        <div class="brand-header">
          <div class="brand-logo-glow">
            <AppIcon name="pos" :size="24" />
          </div>
          <div class="brand-text">
            <span class="brand-title">ABDI POS</span>
            <span class="brand-subtitle">Smart Retail & F&B SaaS</span>
          </div>
        </div>

        <div class="hero-quote">
          <h2 class="hero-heading">
            Kelola Transaksi Kasir, Stok Multi-Cabang, dan Omset Bisnis dalam Satu Layar.
          </h2>
          <p class="hero-desc">
            Sistem Point of Sale modern berbasis cloud dengan performa kilat, antarmuka taktil, dan dukungan multi-tenant untuk bisnis UMKM hingga franchise.
          </p>
        </div>

        <div class="feature-bullets">
          <div class="f-bullet">
            <div class="bullet-icon"><AppIcon name="check-circle" :size="16" /></div>
            <span>Transaksi kasir offline & sinkronisasi otomatis</span>
          </div>
          <div class="f-bullet">
            <div class="bullet-icon"><AppIcon name="check-circle" :size="16" /></div>
            <span>Dukungan multi-cabang (Multi-Outlet) tanpa batas</span>
          </div>
          <div class="f-bullet">
            <div class="bullet-icon"><AppIcon name="check-circle" :size="16" /></div>
            <span>Laporan laba/rugi realtime & QRIS dinamis</span>
          </div>
        </div>

        <div class="hero-footer">
          <span class="version-tag">SaaS Core v1.0 • Powered by Laravel 13 API</span>
        </div>
      </div>

      <!-- Right Login Card Panel -->
      <div class="login-card-panel">
        <div class="login-card-header">
          <h3 class="login-title">Selamat Datang 👋</h3>
          <p class="login-subtitle">Pilih akun demo di bawah untuk masuk cepat, atau ketikkan email & kata sandi Anda.</p>
        </div>

        <!-- Quick 1-Click Demo Account Switcher -->
        <div class="demo-accounts-section">
          <div class="demo-section-label">PILIH AKUN DEMO (KLIK 1X UNTUK MENGISI):</div>
          <div class="demo-pills-grid">
            <button
              v-for="acc in authStore.demoAccounts"
              :key="acc.roleCode"
              type="button"
              :class="['demo-pill-btn', { 'is-active': selectedRoleCode === acc.roleCode }]"
              @click="selectDemoAccount(acc)"
            >
              <div class="pill-avatar-wrap">
                <img :src="acc.avatar" :alt="acc.name" class="pill-avatar" />
              </div>
              <div class="pill-meta">
                <span class="pill-role">{{ acc.role }}</span>
                <span class="pill-email">{{ acc.email }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <BaseInput
            v-model="form.email"
            type="email"
            label="Alamat Email"
            placeholder="nama@bisnis.com"
            :required="true"
            :error="errors.email"
          >
            <template #prefix><AppIcon name="mail" :size="16" /></template>
          </BaseInput>

          <BaseInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            label="Kata Sandi"
            placeholder="Masukkan kata sandi"
            :required="true"
            :error="errors.password"
          >
            <template #prefix><AppIcon name="lock" :size="16" /></template>
            <template #suffix>
              <button
                type="button"
                class="eye-btn"
                tabindex="-1"
                @click="showPassword = !showPassword"
                aria-label="Tampilkan sandi"
              >
                <AppIcon :name="showPassword ? 'eye-off' : 'eye'" :size="16" />
              </button>
            </template>
          </BaseInput>

          <div class="form-options-row">
            <label class="remember-checkbox-label">
              <input type="checkbox" v-model="form.remember" class="custom-checkbox" />
              <span>Ingat saya di perangkat ini</span>
            </label>

            <button
              type="button"
              class="forgot-link"
              @click="isForgotModalOpen = true"
            >
              Lupa Kata Sandi?
            </button>
          </div>

          <BaseButton
            variant="primary"
            size="lg"
            :block="true"
            type="submit"
            :loading="isLoading"
          >
            <template #icon><AppIcon name="check-circle" :size="18" /></template>
            Masuk ke Aplikasi
          </BaseButton>

          <!-- Alternative links -->
          <div class="form-footer-divider">
            <span>atau masuk langsung</span>
          </div>

          <div class="quick-nav-links">
            <router-link to="/app/dashboard" class="quick-nav-btn">
              <AppIcon name="store" :size="16" />
              <span>Dashboard Toko</span>
            </router-link>

            <router-link to="/pos" class="quick-nav-btn">
              <AppIcon name="pos" :size="16" />
              <span>Kasir POS (F2)</span>
            </router-link>

            <router-link to="/platform/dashboard" class="quick-nav-btn">
              <AppIcon name="shield" :size="16" />
              <span>Superadmin SaaS</span>
            </router-link>
          </div>
        </form>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <BaseModal
      v-model="isForgotModalOpen"
      title="Atur Ulang Kata Sandi"
      subtitle="Masukkan email terdaftar untuk menerima tautan pemulihan"
      size="sm"
    >
      <form @submit.prevent="handleForgotPassword" class="forgot-modal-form">
        <BaseInput
          v-model="forgotEmail"
          type="email"
          label="Email Akun"
          placeholder="najib@martabaknusantara.com"
          :required="true"
        >
          <template #prefix><AppIcon name="mail" :size="16" /></template>
        </BaseInput>

        <div class="forgot-modal-actions">
          <BaseButton variant="secondary" @click="isForgotModalOpen = false">Batal</BaseButton>
          <BaseButton variant="primary" type="submit">Kirim Tautan Reset</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../shared/stores/authStore'
import { useToast } from '../../../shared/composables/useToast'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import BaseModal from '../../../shared/components/ui/BaseModal.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const isLoading = ref(false)
const showPassword = ref(false)
const isForgotModalOpen = ref(false)
const forgotEmail = ref('')
const selectedRoleCode = ref('owner')

const form = ref({
  email: 'najib@martabaknusantara.com',
  password: 'password123',
  remember: true
})

const errors = ref({})

const selectDemoAccount = (acc) => {
  selectedRoleCode.value = acc.roleCode
  form.value.email = acc.email
  form.value.password = acc.password
  toast.info(`Akun demo ${acc.role} dipilih otomatis.`, 'Demo Terisi')
}

const handleLogin = async () => {
  errors.value = {}

  if (!form.value.email.trim()) errors.value.email = 'Email wajib diisi'
  if (!form.value.password) errors.value.password = 'Kata sandi wajib diisi'

  if (Object.keys(errors.value).length > 0) return

  isLoading.value = true
  setTimeout(async () => {
    isLoading.value = false
    await authStore.login(form.value.email, form.value.password, form.value.remember)

    // Redirect based on role
    if (selectedRoleCode.value === 'superadmin') {
      router.push('/platform/dashboard')
    } else if (selectedRoleCode.value === 'cashier') {
      router.push('/pos')
    } else {
      router.push('/app/dashboard')
    }
  }, 600)
}

const handleForgotPassword = () => {
  if (!forgotEmail.value.trim()) return
  toast.success(`Tautan pemulihan demo telah dikirim ke ${forgotEmail.value}!`, 'Email Terkirim')
  isForgotModalOpen.value = false
  forgotEmail.value = ''
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #070d18;
  position: relative;
  overflow: hidden;
  padding: 24px;
}

/* Ambient glow orbs */
.ambient-glow {
  position: absolute;
  border-radius: var(--radius-full);
  filter: blur(120px);
  pointer-events: none;
  opacity: 0.35;
}

.glow-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #2563eb 0%, transparent 70%);
  top: -100px;
  left: -100px;
}

.glow-2 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #6366f1 0%, transparent 70%);
  bottom: -100px;
  right: -100px;
}

/* Container */
.login-container {
  position: relative;
  z-index: 10;
  display: flex;
  width: 100%;
  max-width: 1040px;
  background-color: #0e172a;
  border: 1px solid #1e293b;
  border-radius: var(--radius-2xl);
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

/* Brand Hero Left Panel */
.brand-hero-panel {
  flex: 1.1;
  padding: 44px;
  background: linear-gradient(145deg, #0b1325 0%, #101c38 100%);
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-logo-glow {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.05em;
}

.brand-subtitle {
  font-size: 12px;
  color: #93c5fd;
  font-weight: 600;
}

.hero-quote {
  margin: 36px 0;
}

.hero-heading {
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.35;
  letter-spacing: -0.02em;
}

.hero-desc {
  font-size: 13.5px;
  color: #94a3b8;
  margin-top: 12px;
  line-height: 1.6;
}

.feature-bullets {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.f-bullet {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #cbd5e1;
}

.bullet-icon {
  color: #3b82f6;
  display: flex;
  align-items: center;
}

.hero-footer {
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.version-tag {
  font-size: 11.5px;
  color: #64748b;
  font-weight: 600;
}

/* Right Login Card Panel */
.login-card-panel {
  flex: 1.2;
  padding: 44px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-card-header {
  margin-bottom: 24px;
}

.login-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

.login-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
  line-height: 1.5;
}

/* Demo Pills */
.demo-accounts-section {
  margin-bottom: 20px;
  padding: 12px;
  background-color: var(--slate-50);
  border: 1px solid var(--border-app);
  border-radius: var(--radius-lg);
}

.demo-section-label {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.demo-pills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.demo-pill-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  background-color: #ffffff;
  cursor: pointer;
  text-align: left;
  transition: all var(--duration-fast) ease;
}

.demo-pill-btn:hover {
  border-color: var(--primary-500);
  background-color: var(--primary-50);
}

.demo-pill-btn.is-active {
  border-color: var(--primary-600);
  background-color: var(--primary-50);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.pill-avatar-wrap {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-full);
  overflow: hidden;
  flex-shrink: 0;
}

.pill-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pill-meta {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pill-role {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pill-email {
  font-size: 9.5px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.eye-btn {
  background: none;
  border: none;
  padding: 4px;
  color: var(--text-muted);
  cursor: pointer;
}

.eye-btn:hover {
  color: var(--primary-600);
}

.form-options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
}

.remember-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  cursor: pointer;
}

.custom-checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-600);
  cursor: pointer;
}

.forgot-link {
  background: none;
  border: none;
  color: var(--primary-600);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.forgot-link:hover {
  text-decoration: underline;
}

.form-footer-divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-muted);
  font-size: 11px;
  margin: 6px 0;
}

.form-footer-divider::before,
.form-footer-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-app);
}

.form-footer-divider span {
  padding: 0 10px;
}

.quick-nav-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.quick-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background-color: var(--slate-100);
  color: var(--slate-700);
  border-radius: var(--radius-md);
  font-size: 11.5px;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--duration-fast) ease;
}

.quick-nav-btn:hover {
  background-color: var(--primary-50);
  color: var(--primary-700);
}

.forgot-modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.forgot-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

@media (max-width: 860px) {
  .login-container {
    flex-direction: column;
  }
  .brand-hero-panel {
    display: none;
  }
  .demo-pills-grid {
    grid-template-columns: 1fr;
  }
  .login-card-panel {
    padding: 28px;
  }
}
</style>
