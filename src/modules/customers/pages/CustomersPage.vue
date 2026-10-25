<template>
  <div class="customers-page space-y-6">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Pelanggan & Program Loyalitas</h1>
        <p class="page-subtitle">
          Database pelanggan setia, tier membership, riwayat belanja, dan akumulasi poin loyalty reward.
        </p>
      </div>

      <div class="header-actions">
        <BaseButton variant="primary" size="md" @click="openAddModal">
          <AppIcon name="plus" :size="16" />
          Daftarkan Pelanggan Baru
        </BaseButton>
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="metrics-grid">
      <div class="metric-card bg-blue-50/60 border-blue-100">
        <div class="metric-icon-box bg-blue-600 text-white">
          <AppIcon name="users" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Total Pelanggan</span>
          <span class="metric-value text-blue-900">{{ customers.length }} Orang</span>
        </div>
      </div>

      <div class="metric-card bg-amber-50/60 border-amber-100">
        <div class="metric-icon-box bg-amber-500 text-white">
          <AppIcon name="gift" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Total Poin Beredar</span>
          <span class="metric-value text-amber-900">{{ customerStore.totalPointsCirculating }} Pts</span>
        </div>
      </div>

      <div class="metric-card bg-emerald-50/60 border-emerald-100">
        <div class="metric-icon-box bg-emerald-600 text-white">
          <AppIcon name="dollar" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Total Belanja Member</span>
          <span class="metric-value text-emerald-900">{{ formatRp(totalMemberSpent) }}</span>
        </div>
      </div>

      <div class="metric-card bg-purple-50/60 border-purple-100">
        <div class="metric-icon-box bg-purple-600 text-white">
          <AppIcon name="shield" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Member VIP (Platinum)</span>
          <span class="metric-value text-purple-900">{{ platinumCount }} Member</span>
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
            placeholder="Cari nama, no. HP, atau kode referral..."
            class="search-input"
          />
        </div>

        <div class="filters-wrap">
          <select v-model="selectedTier" class="filter-select">
            <option value="ALL">Semua Tier</option>
            <option value="PLATINUM">Platinum</option>
            <option value="GOLD">Gold</option>
            <option value="SILVER">Silver</option>
            <option value="BRONZE">Bronze</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Pelanggan</th>
              <th>Kontak</th>
              <th class="text-center">Tier</th>
              <th class="text-right">Poin</th>
              <th class="text-right">Total Belanja</th>
              <th class="text-center">Kunjungan</th>
              <th>Terakhir Datang</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="8" class="empty-state">
                <AppIcon name="users" :size="36" class="text-slate-300 mx-auto mb-2" />
                <p class="font-medium text-slate-600">Tidak ada pelanggan ditemukan.</p>
              </td>
            </tr>

            <tr
              v-for="c in filteredCustomers"
              :key="c.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar-circle">
                    {{ c.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <span class="font-bold text-slate-800 block">{{ c.name }}</span>
                    <span class="text-xs font-mono text-blue-600">Ref: {{ c.referralCode }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex flex-col text-xs">
                  <span class="font-medium text-slate-700">{{ c.phone }}</span>
                  <span class="text-slate-400">{{ c.email || '-' }}</span>
                </div>
              </td>
              <td class="text-center">
                <span
                  class="tier-badge"
                  :class="`tier-${c.tier.toLowerCase()}`"
                >
                  {{ c.tier }}
                </span>
              </td>
              <td class="text-right font-mono font-bold text-amber-600">
                {{ c.points }} pts
              </td>
              <td class="text-right font-mono font-bold text-slate-800">
                {{ formatRp(c.totalSpent) }}
              </td>
              <td class="text-center font-medium text-xs">
                {{ c.totalVisits }}x
              </td>
              <td class="text-xs text-slate-500 whitespace-nowrap">
                {{ c.lastVisit }}
              </td>
              <td class="text-center">
                <div class="flex items-center justify-center gap-1">
                  <BaseButton variant="secondary" size="sm" @click="openEditModal(c)">
                    <AppIcon name="edit" :size="14" />
                  </BaseButton>
                  <BaseButton variant="danger" size="sm" @click="confirmDelete(c)">
                    <AppIcon name="trash" :size="14" />
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Customer Modal -->
    <CustomerModal
      v-model="showCustomerModal"
      :customer="selectedCustomer"
      @customer-saved="handleCustomerSaved"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Hapus Pelanggan?"
      confirm-text="Ya, Hapus Pelanggan"
      variant="danger"
      @confirm="executeDelete"
    >
      <p class="text-sm text-slate-600">
        Apakah Anda yakin ingin menghapus data member <strong>{{ customerToDelete?.name }}</strong>? Riwayat poin loyalty akan terhapus.
      </p>
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import ConfirmModal from '@/shared/components/ui/ConfirmModal.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import CustomerModal from '../components/CustomerModal.vue'
import { useCustomerStore } from '../stores/customerStore'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()
const customerStore = useCustomerStore()

const searchQuery = ref('')
const selectedTier = ref('ALL')

const showCustomerModal = ref(false)
const showDeleteConfirm = ref(false)

const selectedCustomer = ref(null)
const customerToDelete = ref(null)

const customers = computed(() => customerStore.customers)

const filteredCustomers = computed(() => {
  return customers.value.filter(c => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.referralCode.toLowerCase().includes(q)

    const matchesTier =
      selectedTier.value === 'ALL' || c.tier === selectedTier.value

    return matchesSearch && matchesTier
  })
})

const totalMemberSpent = computed(() => {
  return customers.value.reduce((sum, c) => sum + c.totalSpent, 0)
})

const platinumCount = computed(() => {
  return customers.value.filter(c => c.tier === 'PLATINUM').length
})

function formatRp(val) {
  if (typeof val !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

function openAddModal() {
  selectedCustomer.value = null
  showCustomerModal.value = true
}

function openEditModal(c) {
  selectedCustomer.value = c
  showCustomerModal.value = true
}

function confirmDelete(c) {
  customerToDelete.value = c
  showDeleteConfirm.value = true
}

function executeDelete() {
  if (customerToDelete.value) {
    customerStore.deleteCustomer(customerToDelete.value.id)
    toast.success(`Data pelanggan ${customerToDelete.value.name} berhasil dihapus.`)
    showDeleteConfirm.value = false
  }
}

function handleCustomerSaved() {
  selectedCustomer.value = null
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

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0284c7;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.tier-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.tier-platinum {
  background: #f3e8ff;
  color: #7e22ce;
  border: 1px solid #d8b4fe;
}

.tier-gold {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

.tier-silver {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.tier-bronze {
  background: #ffedd5;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}
</style>
