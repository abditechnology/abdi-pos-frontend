<template>
  <div class="promotions-page space-y-6">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Diskon, Voucher & Bundling Promosi</h1>
        <p class="page-subtitle">
          Atur strategi promosi penjualan: diskon persentase, voucher flat, paket bundling hemat, dan tebus murah.
        </p>
      </div>

      <div class="header-actions">
        <BaseButton variant="primary" size="md" @click="openAddModal">
          <AppIcon name="plus" :size="16" />
          Buat Promo Baru
        </BaseButton>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card bg-emerald-50/60 border-emerald-100">
        <div class="metric-icon-box bg-emerald-600 text-white">
          <AppIcon name="percent" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Promo Aktif Berjalan</span>
          <span class="metric-value text-emerald-900">{{ promoStore.activePromotions.length }} Program</span>
        </div>
      </div>

      <div class="metric-card bg-blue-50/60 border-blue-100">
        <div class="metric-icon-box bg-blue-600 text-white">
          <AppIcon name="gift" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Total Klaim Voucher</span>
          <span class="metric-value text-blue-900">{{ promoStore.totalUsages }} Kali</span>
        </div>
      </div>

      <div class="metric-card bg-amber-50/60 border-amber-100">
        <div class="metric-icon-box bg-amber-500 text-white">
          <AppIcon name="sparkles" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Paket Bundling & Tebus</span>
          <span class="metric-value text-amber-900">{{ specialPromoCount }} Paket</span>
        </div>
      </div>

      <div class="metric-card bg-purple-50/60 border-purple-100">
        <div class="metric-icon-box bg-purple-600 text-white">
          <AppIcon name="clock" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Segera Berakhir (30 Hari)</span>
          <span class="metric-value text-purple-900">{{ expiringCount }} Promo</span>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <BaseCard>
      <div class="table-toolbar">
        <div class="search-box">
          <AppIcon name="search" :size="18" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari kode kupon atau nama promo..."
            class="search-input"
          />
        </div>

        <div class="filters-wrap">
          <select v-model="selectedType" class="filter-select">
            <option value="ALL">Semua Tipe Promosi</option>
            <option value="PERCENTAGE">Persentase (%)</option>
            <option value="FIXED">Potongan Flat (Rp)</option>
            <option value="BUNDLE">Paket Bundling</option>
            <option value="TEBUS_MURAH">Tebus Murah</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Kode & Nama Promo</th>
              <th>Tipe</th>
              <th class="text-right">Besar Diskon</th>
              <th class="text-right">Min. Belanja</th>
              <th>Masa Berlaku</th>
              <th class="text-center">Klaim Kasir</th>
              <th class="text-center">Status</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredPromotions.length === 0">
              <td colspan="8" class="empty-state">
                <AppIcon name="percent" :size="36" class="text-slate-300 mx-auto mb-2" />
                <p class="font-medium text-slate-600">Tidak ada promosi ditemukan.</p>
              </td>
            </tr>

            <tr
              v-for="p in filteredPromotions"
              :key="p.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td>
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-200">
                      {{ p.code }}
                    </span>
                    <span class="font-semibold text-slate-800 text-sm">{{ p.title }}</span>
                  </div>
                  <span class="text-xs text-slate-400 mt-1 max-w-sm line-clamp-1">
                    {{ p.description }}
                  </span>
                </div>
              </td>
              <td>
                <BaseBadge
                  :variant="
                    p.type === 'PERCENTAGE'
                      ? 'primary'
                      : p.type === 'FIXED'
                      ? 'success'
                      : p.type === 'BUNDLE'
                      ? 'warning'
                      : 'neutral'
                  "
                >
                  {{
                    p.type === 'PERCENTAGE'
                      ? 'Persen (%)'
                      : p.type === 'FIXED'
                      ? 'Flat (Rp)'
                      : p.type === 'BUNDLE'
                      ? 'Bundling'
                      : 'Tebus Murah'
                  }}
                </BaseBadge>
              </td>
              <td class="text-right font-mono font-bold text-slate-800">
                {{ p.type === 'PERCENTAGE' ? `${p.discountValue}%` : formatRp(p.discountValue) }}
              </td>
              <td class="text-right font-mono text-xs text-slate-600">
                {{ p.minPurchase > 0 ? formatRp(p.minPurchase) : 'Tanpa Syarat' }}
              </td>
              <td class="text-xs text-slate-500 whitespace-nowrap">
                s/d {{ p.validUntil }}
              </td>
              <td class="text-center font-bold text-xs text-slate-700 font-mono">
                {{ p.usageCount }}x
              </td>
              <td class="text-center">
                <button
                  class="toggle-switch-btn"
                  :class="{ active: p.isActive }"
                  :title="p.isActive ? 'Nonaktifkan Promo' : 'Aktifkan Promo'"
                  @click="toggleStatus(p)"
                >
                  <span class="toggle-knob"></span>
                </button>
              </td>
              <td class="text-center">
                <div class="flex items-center justify-center gap-1">
                  <BaseButton variant="secondary" size="sm" @click="openEditModal(p)">
                    <AppIcon name="edit" :size="14" />
                  </BaseButton>
                  <BaseButton variant="danger" size="sm" @click="confirmDelete(p)">
                    <AppIcon name="trash" :size="14" />
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Promotion Modal -->
    <PromotionModal
      v-model="showPromoModal"
      :promotion="selectedPromo"
      @promotion-saved="handlePromoSaved"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Hapus Program Promosi?"
      confirm-text="Ya, Hapus Promo"
      variant="danger"
      @confirm="executeDelete"
    >
      <p class="text-sm text-slate-600">
        Apakah Anda yakin ingin menghapus promo <strong>{{ promoToDelete?.title }}</strong> ({{ promoToDelete?.code }})?
      </p>
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import ConfirmModal from '@/shared/components/ui/ConfirmModal.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import PromotionModal from '../components/PromotionModal.vue'
import { usePromotionStore } from '../stores/promotionStore'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()
const promoStore = usePromotionStore()

const searchQuery = ref('')
const selectedType = ref('ALL')

const showPromoModal = ref(false)
const showDeleteConfirm = ref(false)

const selectedPromo = ref(null)
const promoToDelete = ref(null)

const filteredPromotions = computed(() => {
  return promoStore.promotions.filter(p => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q)

    const matchesType =
      selectedType.value === 'ALL' || p.type === selectedType.value

    return matchesSearch && matchesType
  })
})

const specialPromoCount = computed(() => {
  return promoStore.promotions.filter(p => p.type === 'BUNDLE' || p.type === 'TEBUS_MURAH').length
})

const expiringCount = computed(() => {
  return promoStore.promotions.filter(p => p.isActive).length
})

function formatRp(val) {
  if (typeof val !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

function toggleStatus(p) {
  const newStatus = promoStore.toggleStatus(p.id)
  toast.success(`Promo ${p.code} ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}.`)
}

function openAddModal() {
  selectedPromo.value = null
  showPromoModal.value = true
}

function openEditModal(p) {
  selectedPromo.value = p
  showPromoModal.value = true
}

function confirmDelete(p) {
  promoToDelete.value = p
  showDeleteConfirm.value = true
}

function executeDelete() {
  if (promoToDelete.value) {
    promoStore.deletePromotion(promoToDelete.value.id)
    toast.success(`Promo ${promoToDelete.value.code} berhasil dihapus.`)
    showDeleteConfirm.value = false
  }
}

function handlePromoSaved() {
  selectedPromo.value = null
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border-width: 1px;
}

.metric-icon-box {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.775rem;
  font-weight: 600;
  color: #64748b;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: monospace;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.search-box {
  position: relative;
  min-width: 280px;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 0.55rem 0.75rem 0.55rem 2.25rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.filters-wrap {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.55rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  background-color: #ffffff;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  white-space: nowrap;
}

.data-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.toggle-switch-btn {
  width: 40px;
  height: 22px;
  background-color: #cbd5e1;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  border: none;
  transition: background-color var(--duration-fast);
}

.toggle-switch-btn.active {
  background-color: #0284c7;
}

.toggle-knob {
  width: 18px;
  height: 18px;
  background-color: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform var(--duration-fast);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.toggle-switch-btn.active .toggle-knob {
  transform: translateX(18px);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}
</style>
