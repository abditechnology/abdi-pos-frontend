<template>
  <div class="showcase-page animate-fade-in">
    <!-- Page Header -->
    <section class="showcase-header">
      <div class="header-badge">
        <AppIcon name="sparkles" :size="16" />
        <span>Design System & Reusable Components</span>
      </div>
      <h1 class="page-title">Koleksi Komponen UI POS</h1>
      <p class="page-desc">
        Katalog interaktif komponen frontend Abdi POS sesuai panduan PRD. Desain modern, perpaduan warna biru, animatif, dan UX-first.
      </p>
    </section>

    <!-- SECTION 1: BUTTONS -->
    <section class="component-section base-card card-bordered">
      <div class="section-header">
        <div class="section-title-wrap">
          <h3 class="section-title">1. BaseButton Component</h3>
          <p class="section-subtitle">Tombol interaktif dengan efek active scale, loading spinner, dan ragam varian.</p>
        </div>
        <div class="section-ctrl">
          <label class="toggle-label">
            <input type="checkbox" v-model="btnLoading" />
            <span>Simulasikan Loading</span>
          </label>
        </div>
      </div>

      <div class="showcase-group">
        <h4 class="group-title">Varian Warna (Blue Palette & Semantics)</h4>
        <div class="flex flex-wrap gap-3 items-center">
          <BaseButton variant="primary" :loading="btnLoading" @click="handleBtnClick('Primary')">
            <template #icon><AppIcon name="pos" :size="16" /></template>
            Primary (Royal Blue)
          </BaseButton>

          <BaseButton variant="secondary" :loading="btnLoading" @click="handleBtnClick('Secondary')">
            Secondary (Soft Blue)
          </BaseButton>

          <BaseButton variant="outline" :loading="btnLoading" @click="handleBtnClick('Outline')">
            Outline
          </BaseButton>

          <BaseButton variant="ghost" :loading="btnLoading" @click="handleBtnClick('Ghost')">
            Ghost
          </BaseButton>

          <BaseButton variant="success" :loading="btnLoading" @click="handleBtnClick('Success')">
            <template #icon><AppIcon name="check-circle" :size="16" /></template>
            Success
          </BaseButton>

          <BaseButton variant="danger" :loading="btnLoading" @click="handleBtnClick('Danger')">
            <template #icon><AppIcon name="alert-circle" :size="16" /></template>
            Danger
          </BaseButton>
        </div>
      </div>

      <div class="showcase-group">
        <h4 class="group-title">Ukuran (Sizes)</h4>
        <div class="flex flex-wrap gap-3 items-center">
          <BaseButton variant="primary" size="sm">Small (32px)</BaseButton>
          <BaseButton variant="primary" size="md">Medium Default (40px)</BaseButton>
          <BaseButton variant="primary" size="lg">Large Touch-Friendly (48px)</BaseButton>
          <BaseButton variant="secondary" size="md" :icon-only="true" title="Icon Only">
            <AppIcon name="refresh" :size="18" />
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- SECTION 2: MODAL & CONFIRM DIALOG -->
    <section class="component-section base-card card-bordered">
      <div class="section-header">
        <div class="section-title-wrap">
          <h3 class="section-title">2. BaseModal & ConfirmModal</h3>
          <p class="section-subtitle">Modal modern dengan backdrop blur, escape listener, focus trap, dan animasi zoom-in.</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-4">
        <BaseButton variant="primary" @click="isStandardModalOpen = true">
          <template #icon><AppIcon name="boxes" :size="16" /></template>
          Buka BaseModal Standar
        </BaseButton>

        <BaseButton variant="danger" @click="openConfirmDanger">
          <template #icon><AppIcon name="alert-circle" :size="16" /></template>
          Buka ConfirmModal (Danger / Void)
        </BaseButton>

        <BaseButton variant="secondary" @click="openConfirmWarning">
          <template #icon><AppIcon name="alert-triangle" :size="16" /></template>
          Buka ConfirmModal (Warning / Shift)
        </BaseButton>
      </div>

      <!-- Standard BaseModal Instance -->
      <BaseModal
        v-model="isStandardModalOpen"
        title="Detail Informasi Produk & Resep"
        subtitle="ID Produk: #PRD-9901 - Terang Bulan Red Velvet"
        size="md"
      >
        <div class="demo-modal-body">
          <p>
            Modal ini menggunakan <code>BaseModal.vue</code> dengan transisi spring, backdrop blur, dan slot fleksibel (header, body, footer).
          </p>
          <div class="info-callout">
            <strong>Catatan Pengembang:</strong>
            <p>Dapat ditutup dengan tombol close (X), menekan tombol ESC di keyboard, atau klik di luar area modal.</p>
          </div>
        </div>

        <template #footer="{ close }">
          <BaseButton variant="ghost" @click="close">Tutup</BaseButton>
          <BaseButton variant="primary" @click="saveDemoModal">Simpan Perubahan</BaseButton>
        </template>
      </BaseModal>

      <!-- Danger ConfirmModal Instance -->
      <ConfirmModal
        v-model="isConfirmDangerOpen"
        title="Batalkan Transaksi #TRX-8901?"
        message="Tindakan ini akan membatalkan struk penjualan dan mengembalikan stok barang ke cabang. Apakah Anda yakin?"
        variant="danger"
        confirm-text="Ya, Batalkan Transaksi"
        cancel-text="Jangan Batalkan"
        :loading="isConfirmLoading"
        @confirm="handleConfirmDangerAction"
      />

      <!-- Warning ConfirmModal Instance -->
      <ConfirmModal
        v-model="isConfirmWarningOpen"
        title="Tutup Kasir Sekarang?"
        message="Shift kasir Anda saat ini akan diakhiri dan laporan omset akan dicetak ke printer struk."
        variant="warning"
        confirm-text="Tutup Shift Sekarang"
        cancel-text="Batal"
        :loading="isConfirmLoading"
        @confirm="handleConfirmWarningAction"
      />
    </section>

    <!-- SECTION 3: TOAST NOTIFICATIONS -->
    <section class="component-section base-card card-bordered">
      <div class="section-header">
        <div class="section-title-wrap">
          <h3 class="section-title">3. Toast Notifications (useToast)</h3>
          <p class="section-subtitle">Sistem notifikasi mengambang dengan timer otomatis, auto-dismiss, dan animasi slide-in.</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <BaseButton variant="success" @click="toast.success('Transaksi #TRX-8921 berhasil dibayar dengan QRIS!', 'Pembayaran Sukses')">
          Trigger Success Toast
        </BaseButton>

        <BaseButton variant="danger" @click="toast.error('Gagal menyambung ke printer struk Bluetooth.', 'Koneksi Terputus')">
          Trigger Error Toast
        </BaseButton>

        <BaseButton variant="secondary" @click="toast.warning('Stok Keju Cheddar tersisa 3 blok.', 'Peringatan Stok')">
          Trigger Warning Toast
        </BaseButton>

        <BaseButton variant="primary" @click="toast.info('Cabang dialihkan ke Outlet Tebet.', 'Outlet Berganti')">
          Trigger Info Toast
        </BaseButton>
      </div>
    </section>

    <!-- SECTION 4: ALERTS -->
    <section class="component-section base-card card-bordered">
      <div class="section-header">
        <div class="section-title-wrap">
          <h3 class="section-title">4. BaseAlert Component</h3>
          <p class="section-subtitle">Banner status kontekstual untuk pesan sistem, validasi, atau pengumuman.</p>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <BaseAlert
          variant="info"
          title="Sinkronisasi Cloud Aktif"
          message="Seluruh transaksi kasir otomatis tersimpan ke server Laravel 13 setiap kali struk tercetak."
          :dismissible="true"
        />

        <BaseAlert
          variant="success"
          title="Shift Pagi Terverifikasi"
          message="Total uang fisik cocok 100% dengan rekapitulasi sistem kasir (Selisih: Rp 0)."
          :dismissible="true"
        />

        <BaseAlert
          variant="warning"
          title="Promo Tebus Murah Tersedia"
          message="Pelanggan dengan belanja minimal Rp 75.000 berhak tebus murah Es Teh Manis seharga Rp 2.000."
          :dismissible="true"
        />

        <BaseAlert
          variant="danger"
          title="Koneksi Printer Struk Gagal"
          message="Pastikan printer thermal USB/Bluetooth telah menyala dan terpasang kertas kasir."
          :dismissible="true"
        />
      </div>
    </section>

    <!-- SECTION 5: BADGES & MONEY DISPLAY -->
    <section class="component-section base-card card-bordered">
      <div class="section-header">
        <div class="section-title-wrap">
          <h3 class="section-title">5. BaseBadge & MoneyDisplay</h3>
          <p class="section-subtitle">Status visual yang tidak hanya bergantung pada warna serta format mata uang Rupiah konsisten.</p>
        </div>
      </div>

      <div class="showcase-group">
        <h4 class="group-title">Status Badges (Dengan Animasi Pulse Dot)</h4>
        <div class="flex flex-wrap gap-3 items-center">
          <BaseBadge variant="primary" :dot="true" :pulse="true">Primary / Sedang Diproses</BaseBadge>
          <BaseBadge variant="success" :dot="true">Aktif / Lunas</BaseBadge>
          <BaseBadge variant="warning" :dot="true" :pulse="true">Menunggu Pembayaran</BaseBadge>
          <BaseBadge variant="danger" :dot="true">Batal / Ditolak</BaseBadge>
          <BaseBadge variant="purple">Promo Bundling</BaseBadge>
          <BaseBadge variant="neutral">Draft</BaseBadge>
        </div>
      </div>

      <div class="showcase-group">
        <h4 class="group-title">MoneyDisplay (Format Rupiah)</h4>
        <div class="flex flex-wrap gap-6 items-baseline">
          <div>
            <span class="demo-label">Small:</span>
            <MoneyDisplay :amount="25000" size="sm" />
          </div>
          <div>
            <span class="demo-label">Medium:</span>
            <MoneyDisplay :amount="185000" size="md" variant="primary" />
          </div>
          <div>
            <span class="demo-label">Large:</span>
            <MoneyDisplay :amount="4250000" size="lg" variant="success" />
          </div>
          <div>
            <span class="demo-label">Extra Large:</span>
            <MoneyDisplay :amount="18420000" size="xl" variant="primary" />
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 6: FORM FIELDS & SKELETON LOADERS -->
    <section class="component-section base-card card-bordered">
      <div class="section-header">
        <div class="section-title-wrap">
          <h3 class="section-title">6. BaseInput & SkeletonLoader</h3>
          <p class="section-subtitle">Input form dengan fokus ring modern dan placeholder skeleton beranimasi shimmer.</p>
        </div>
        <div class="section-ctrl">
          <label class="toggle-label">
            <input type="checkbox" v-model="showSkeleton" />
            <span>Tampilkan Skeleton</span>
          </label>
        </div>
      </div>

      <div v-if="showSkeleton" class="flex flex-col gap-4">
        <SkeletonLoader type="rect" height="40px" />
        <div class="flex gap-4">
          <SkeletonLoader type="avatar" />
          <div class="flex-1 flex flex-col gap-2">
            <SkeletonLoader type="text" width="60%" />
            <SkeletonLoader type="text" width="40%" />
          </div>
        </div>
        <SkeletonLoader type="card" height="100px" />
      </div>

      <div v-else class="grid form-grid">
        <BaseInput
          v-model="demoInputs.text"
          label="Cari Produk atau Barcode"
          placeholder="Scan barcode atau ketik nama menu..."
          :clearable="true"
        >
          <template #prefix><AppIcon name="search" :size="16" /></template>
        </BaseInput>

        <BaseInput
          v-model="demoInputs.errorInput"
          label="Harga Jual"
          placeholder="Rp 0"
          error="Harga jual tidak boleh kurang dari HPP (Rp 15.000)"
        >
          <template #prefix><AppIcon name="dollar" :size="16" /></template>
        </BaseInput>

        <BaseInput
          v-model="demoInputs.disabledInput"
          label="Kode Tenant Otomatis"
          :disabled="true"
        >
          <template #prefix><AppIcon name="shield" :size="16" /></template>
        </BaseInput>
      </div>
    </section>

    <!-- SECTION 8: ANIMASI LOADING PERPINDAHAN MODE -->
    <section class="component-section base-card card-bordered">
      <div class="section-header">
        <div class="section-title-wrap">
          <h3 class="section-title">8. Animasi Loading Transisi Antar Dashboard (Tenant ⇄ Superadmin)</h3>
          <p class="section-subtitle">
            Transisi animatif dengan orbital ring, ambient glow, status step progress, dan tema warna dinamis ketika beralih konteks.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 items-center">
        <BaseButton
          variant="primary"
          @click="testTransitionToSuperadmin"
        >
          <template #icon><AppIcon name="shield" :size="16" /></template>
          Uji Animasi: Menuju Superadmin (SaaS Owner)
        </BaseButton>

        <BaseButton
          variant="secondary"
          @click="testTransitionToTenant"
        >
          <template #icon><AppIcon name="store" :size="16" /></template>
          Uji Animasi: Menuju Dashboard Toko (Tenant)
        </BaseButton>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '../../../shared/composables/useToast'
import { useModeTransitionStore } from '../../../shared/stores/modeTransitionStore'

import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseModal from '../../../shared/components/ui/BaseModal.vue'
import ConfirmModal from '../../../shared/components/ui/ConfirmModal.vue'
import BaseAlert from '../../../shared/components/ui/BaseAlert.vue'
import BaseBadge from '../../../shared/components/ui/BaseBadge.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import SkeletonLoader from '../../../shared/components/ui/SkeletonLoader.vue'
import MoneyDisplay from '../../../shared/components/ui/MoneyDisplay.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const toast = useToast()

const btnLoading = ref(false)
const showSkeleton = ref(false)

const isStandardModalOpen = ref(false)
const isConfirmDangerOpen = ref(false)
const isConfirmWarningOpen = ref(false)
const isConfirmLoading = ref(false)

const demoInputs = ref({
  text: 'Terang Bulan Coklat Keju',
  errorInput: '12000',
  disabledInput: 'TNT-ABDI-092'
})

const handleBtnClick = (variant) => {
  toast.info(`Anda menekan tombol varian: ${variant}`, 'Button Triggered')
}

const saveDemoModal = () => {
  isStandardModalOpen.value = false
  toast.success('Data dalam modal berhasil disimpan!', 'Sukses')
}

const openConfirmDanger = () => {
  isConfirmDangerOpen.value = true
}

const openConfirmWarning = () => {
  isConfirmWarningOpen.value = true
}

const handleConfirmDangerAction = () => {
  isConfirmLoading.value = true
  setTimeout(() => {
    isConfirmLoading.value = false
    isConfirmDangerOpen.value = false
    toast.error('Transaksi #TRX-8901 telah dibatalkan (Void).', 'Transaksi Dibatalkan')
  }, 700)
}

const handleConfirmWarningAction = () => {
  isConfirmLoading.value = true
  setTimeout(() => {
    isConfirmLoading.value = false
    isConfirmWarningOpen.value = false
    toast.success('Shift kasir berhasil ditutup. Laporan terkirim ke printer.', 'Shift Ditutup')
  }, 700)
}

const modeTransitionStore = useModeTransitionStore()

const testTransitionToSuperadmin = () => {
  modeTransitionStore.startTransition('superadmin')
}

const testTransitionToTenant = () => {
  modeTransitionStore.startTransition('tenant')
}
</script>

<style scoped>
.showcase-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-bottom: 40px;
}

.showcase-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background-color: var(--primary-50);
  color: var(--primary-700);
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  width: fit-content;
}

.page-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

.page-desc {
  font-size: 14.5px;
  color: var(--text-secondary);
  max-width: 720px;
  line-height: 1.5;
}

.component-section {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid var(--slate-100);
  padding-bottom: 16px;
  gap: 16px;
  flex-wrap: wrap;
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
}

.section-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.section-ctrl {
  display: flex;
  align-items: center;
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--slate-700);
  cursor: pointer;
  background-color: var(--slate-100);
  padding: 6px 12px;
  border-radius: var(--radius-md);
}

.showcase-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--slate-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.demo-modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-callout {
  padding: 12px;
  background-color: var(--primary-50);
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-md);
  color: var(--primary-900);
  font-size: 13px;
}

.demo-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-right: 6px;
  font-weight: 600;
}

.form-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
