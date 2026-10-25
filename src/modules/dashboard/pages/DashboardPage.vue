<template>
  <div class="dashboard-page animate-fade-in">
    <!-- Top Greeting & Header Bar -->
    <section class="dashboard-header-bar">
      <div class="greeting-meta">
        <h1 class="greeting-title">
          Dashboard Operasional
          <span class="live-dot" title="Data realtime terhubung" />
        </h1>
        <p class="greeting-subtitle">
          Ringkasan aktivitas penjualan & inventaris untuk <strong>{{ currentOutlet.name }}</strong>
        </p>
      </div>

      <!-- Quick Date & Refresh Actions -->
      <div class="header-actions">
        <div class="date-badge">
          <AppIcon name="clock" :size="16" />
          <span>{{ currentFormattedDate }}</span>
        </div>

        <BaseButton
          variant="secondary"
          size="md"
          :loading="isRefreshing"
          @click="refreshDashboard"
        >
          <template #icon>
            <AppIcon name="refresh" :size="16" :spin="isRefreshing" />
          </template>
          Segarkan Data
        </BaseButton>
      </div>
    </section>

    <!-- Quick Action Shortcuts -->
    <QuickActionGrid @action-click="handleQuickAction" />

    <!-- Stat Cards Grid (4 Key Business Indicators) -->
    <section class="stats-grid">
      <StatCard
        title="Total Omset Hari Ini"
        :value="18420000"
        :is-currency="true"
        :trend="14.8"
        caption="vs kemarin"
        icon="dollar"
        theme="blue"
      />

      <StatCard
        title="Jumlah Transaksi"
        :value="142"
        :trend="8.2"
        caption="12 transaksi/jam"
        icon="receipt"
        theme="emerald"
      />

      <StatCard
        title="Rata-rata Keranjang"
        :value="129718"
        :is-currency="true"
        :trend="5.4"
        caption="Basket Size"
        icon="cart"
        theme="purple"
      />

      <StatCard
        title="Kas Shift Berjalan"
        :value="4250000"
        :is-currency="true"
        caption="Kasir: Ahmad Najib"
        icon="clock"
        theme="amber"
      />
    </section>

    <!-- Main Content Dual-Column Grid -->
    <div class="dashboard-main-grid">
      <!-- Left Column: Sales Graph & Recent Transactions -->
      <div class="grid-left-col">
        <SalesChartWidget />
        <RecentTransactionsWidget />
      </div>

      <!-- Right Column: Low Stock Alerts & Top Products -->
      <div class="grid-right-col">
        <LowStockAlertWidget />
        <TopProductsWidget />
      </div>
    </div>

    <!-- Quick Add Product Modal (BaseModal Demo) -->
    <BaseModal
      v-model="isAddProductModalOpen"
      title="Tambah Menu / Produk Baru"
      subtitle="Daftarkan item ke katalog tenant"
      size="md"
    >
      <form @submit.prevent="saveProduct" class="product-form">
        <BaseInput
          v-model="newProduct.name"
          label="Nama Menu / Produk"
          placeholder="Contoh: Terang Bulan Pandan Keju"
          :required="true"
          :error="productErrors.name"
        >
          <template #prefix>
            <AppIcon name="package" :size="16" />
          </template>
        </BaseInput>

        <div class="form-row">
          <BaseInput
            v-model="newProduct.category"
            label="Kategori"
            placeholder="Terang Bulan / Martabak"
            :required="true"
          >
            <template #prefix>
              <AppIcon name="tag" :size="16" />
            </template>
          </BaseInput>

          <BaseInput
            v-model="newProduct.sku"
            label="Kode SKU"
            placeholder="TRG-PDN-01"
            :required="true"
          />
        </div>

        <div class="form-row">
          <BaseInput
            v-model="newProduct.price"
            label="Harga Jual (Rp)"
            type="number"
            placeholder="35000"
            :required="true"
          >
            <template #prefix>
              <AppIcon name="dollar" :size="16" />
            </template>
          </BaseInput>

          <BaseInput
            v-model="newProduct.cost"
            label="HPP / Modal (Rp)"
            type="number"
            placeholder="18000"
            help-text="Hanya terlihat oleh peran berwenang"
          />
        </div>
      </form>

      <template #footer="{ close }">
        <BaseButton variant="ghost" @click="close">
          Batal
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="isSavingProduct"
          @click="saveProduct"
        >
          Simpan Produk
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Confirm Close Shift Modal (ConfirmModal Demo) -->
    <ConfirmModal
      v-model="isCloseShiftModalOpen"
      title="Konfirmasi Tutup Shift Kasir"
      message="Apakah Anda yakin ingin menutup shift kasir saat ini? Pastikan uang fisik di kas laci telah dihitung dengan benar."
      variant="warning"
      confirm-text="Ya, Tutup Shift"
      cancel-text="Kembali"
      :loading="isClosingShift"
      @confirm="executeCloseShift"
    >
      <template #details>
        <div class="shift-summary-box">
          <div class="shift-item">
            <span>Kas Awal:</span>
            <strong>Rp 250.000</strong>
          </div>
          <div class="shift-item">
            <span>Total Tunai Terkumpul:</span>
            <strong>Rp 4.000.000</strong>
          </div>
          <div class="shift-item highlight">
            <span>Total Akhir Kas:</span>
            <strong>Rp 4.250.000</strong>
          </div>
        </div>
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOutletStore } from '../../../shared/stores/outletStore'
import { useToast } from '../../../shared/composables/useToast'

// Supporting UI Components
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseModal from '../../../shared/components/ui/BaseModal.vue'
import ConfirmModal from '../../../shared/components/ui/ConfirmModal.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

// Dashboard Widgets
import QuickActionGrid from '../components/QuickActionGrid.vue'
import StatCard from '../components/StatCard.vue'
import SalesChartWidget from '../components/SalesChartWidget.vue'
import RecentTransactionsWidget from '../components/RecentTransactionsWidget.vue'
import TopProductsWidget from '../components/TopProductsWidget.vue'
import LowStockAlertWidget from '../components/LowStockAlertWidget.vue'

const router = useRouter()
const outletStore = useOutletStore()
const { currentOutlet } = storeToRefs(outletStore)
const toast = useToast()

const isRefreshing = ref(false)

// Modals State
const isAddProductModalOpen = ref(false)
const isSavingProduct = ref(false)
const isCloseShiftModalOpen = ref(false)
const isClosingShift = ref(false)

const newProduct = ref({
  name: '',
  category: 'Terang Bulan',
  sku: '',
  price: '',
  cost: ''
})

const productErrors = ref({})

const currentFormattedDate = computed(() => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date())
})

// Refresh handler with animation
const refreshDashboard = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
    toast.success('Data metrik dashboard berhasil diperbarui!', 'Sinkronisasi Selesai')
  }, 700)
}

// Quick action click dispatcher
const handleQuickAction = (actionId) => {
  if (actionId === 'open-pos') {
    router.push('/pos')
  } else if (actionId === 'add-product') {
    newProduct.value = { name: '', category: 'Terang Bulan', sku: '', price: '', cost: '' }
    productErrors.value = {}
    isAddProductModalOpen.value = true
  } else if (actionId === 'close-shift') {
    isCloseShiftModalOpen.value = true
  } else if (actionId === 'open-demo') {
    router.push('/app/components-demo')
  }
}

// Save product mock
const saveProduct = () => {
  if (!newProduct.value.name.trim()) {
    productErrors.value.name = 'Nama produk tidak boleh kosong'
    return
  }

  isSavingProduct.value = true
  setTimeout(() => {
    isSavingProduct.value = false
    isAddProductModalOpen.value = false
    toast.success(`Produk "${newProduct.value.name}" berhasil ditambahkan!`, 'Katalog Diperbarui')
  }, 600)
}

// Close shift mock
const executeCloseShift = () => {
  isClosingShift.value = true
  setTimeout(() => {
    isClosingShift.value = false
    isCloseShiftModalOpen.value = false
    toast.warning('Shift kasir pagi telah berhasil ditutup dan direkap.', 'Shift Ditutup')
  }, 800)
}
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header Bar */
.dashboard-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  flex-wrap: wrap;
  gap: 16px;
}

.greeting-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

.live-dot {
  width: 9px;
  height: 9px;
  background-color: var(--success-500);
  border-radius: var(--radius-full);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
  animation: pulseDot 2s infinite ease-in-out;
}

.greeting-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 3px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-app);
  border-radius: var(--radius-lg);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  box-shadow: var(--shadow-xs);
}

/* 4-Column Stat Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* Main 2-Column Section */
.dashboard-main-grid {
  display: grid;
  grid-template-columns: 1fr 390px;
  gap: 24px;
  align-items: start;
}

.grid-left-col,
.grid-right-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Modal Form Styles */
.product-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* Shift Summary Box */
.shift-summary-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}

.shift-item {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
}

.shift-item.highlight {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed var(--slate-300);
  color: var(--text-main);
  font-size: 14px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
