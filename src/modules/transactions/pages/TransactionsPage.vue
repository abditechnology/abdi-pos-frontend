<template>
  <div class="transactions-page space-y-6">
    <!-- Header Section -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Riwayat Transaksi & Struk</h1>
        <p class="page-subtitle">
          Daftar seluruh transaksi penjualan, cetak ulang struk kasir, dan audit pembatalan transaksi.
        </p>
      </div>
      <div class="header-actions">
        <BaseButton variant="secondary" size="md" @click="exportToCSV">
          <AppIcon name="download" :size="16" />
          Export CSV Transaksi
        </BaseButton>
      </div>
    </div>

    <!-- Metric Stat Cards (Consistent Modern Cards with Colored Halo Icons) -->
    <div class="metrics-grid-4">
      <div class="stat-card">
        <div class="stat-icon-halo halo-blue">
          <AppIcon name="dollar" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Total Omset Penjualan</span>
          <span class="stat-value font-mono">{{ formatRp(totalRevenue) }}</span>
          <span class="stat-sub">Akumulasi transaksi hari ini</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-emerald">
          <AppIcon name="receipt" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Transaksi Berhasil</span>
          <span class="stat-value">{{ paidCount }} Transaksi</span>
          <span class="stat-sub">Struk pembayaran lunas</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-indigo">
          <AppIcon name="chart" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Rata-rata Basket Size</span>
          <span class="stat-value font-mono">{{ formatRp(averageBasket) }}</span>
          <span class="stat-sub">Rata-rata belanja per invoice</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-rose">
          <AppIcon name="alert-circle" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Transaksi Void</span>
          <span class="stat-value">{{ voidCount }} Struk</span>
          <span class="stat-sub">Pembatalan struk kasir</span>
        </div>
      </div>
    </div>

    <!-- Filters & Table Section -->
    <BaseCard>
      <div class="table-toolbar">
        <div class="search-box">
          <AppIcon name="search" :size="18" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari no. struk atau nama pelanggan..."
            class="search-input"
          />
        </div>

        <div class="filters-wrap">
          <select v-model="selectedStatus" class="filter-select">
            <option value="ALL">Semua Status</option>
            <option value="PAID">Lunas (PAID)</option>
            <option value="VOID">Dibatalkan (VOID)</option>
          </select>

          <select v-model="selectedMethod" class="filter-select">
            <option value="ALL">Semua Pembayaran</option>
            <option value="TUNAI">Tunai</option>
            <option value="QRIS">QRIS</option>
            <option value="DEBIT">Kartu Debit</option>
          </select>
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>No. Struk</th>
              <th>Waktu Transaksi</th>
              <th>Cabang Outlet</th>
              <th>Pelanggan</th>
              <th>Kasir</th>
              <th>Metode</th>
              <th class="text-right">Total Transaksi</th>
              <th class="text-center">Status</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredTransactions.length === 0">
              <td colspan="9" class="empty-state">
                <AppIcon name="receipt" :size="36" class="text-slate-300 mx-auto mb-2" />
                <p class="font-medium text-slate-600">Tidak ada transaksi yang cocok.</p>
                <p class="text-xs text-slate-400">Coba ubah kata kunci pencarian atau filter Anda.</p>
              </td>
            </tr>

            <tr
              v-for="tx in filteredTransactions"
              :key="tx.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td>
                <span class="font-mono font-bold text-blue-600">{{ tx.invoiceNumber }}</span>
              </td>
              <td class="text-xs text-slate-500 whitespace-nowrap">
                {{ tx.date }}
              </td>
              <td>
                <span class="text-xs font-medium text-slate-700">{{ tx.outletName }}</span>
              </td>
              <td>
                <div class="customer-info">
                  <span class="font-medium text-slate-800">{{ tx.customerName }}</span>
                  <span class="text-xs text-slate-400">{{ tx.customerPhone }}</span>
                </div>
              </td>
              <td class="text-xs text-slate-600">
                {{ tx.cashierName }}
              </td>
              <td>
                <BaseBadge
                  :variant="
                    tx.paymentMethod === 'QRIS'
                      ? 'primary'
                      : tx.paymentMethod === 'TUNAI'
                      ? 'success'
                      : 'neutral'
                  "
                >
                  {{ tx.paymentMethod }}
                </BaseBadge>
              </td>
              <td class="text-right font-bold text-slate-900 font-mono">
                {{ formatRp(tx.total) }}
              </td>
              <td class="text-center">
                <BaseBadge :variant="tx.status === 'PAID' ? 'success' : 'danger'">
                  {{ tx.status === 'PAID' ? 'Lunas' : 'Void' }}
                </BaseBadge>
              </td>
              <td class="text-center">
                <BaseButton
                  variant="secondary"
                  size="sm"
                  @click="openReceiptDetail(tx)"
                >
                  <AppIcon name="receipt" :size="14" />
                  Lihat Struk
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Receipt Detail Modal -->
    <ReceiptDetailModal
      v-model="showReceiptModal"
      :transaction="selectedTransaction"
      @transaction-updated="handleTransactionUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import ReceiptDetailModal from '../components/ReceiptDetailModal.vue'
import { useTransactionStore } from '../stores/transactionStore'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()
const transactionStore = useTransactionStore()

const searchQuery = ref('')
const selectedStatus = ref('ALL')
const selectedMethod = ref('ALL')

const showReceiptModal = ref(false)
const selectedTransaction = ref(null)

const filteredTransactions = computed(() => {
  return transactionStore.transactions.filter(tx => {
    // Search
    const q = searchQuery.value.toLowerCase().trim()
    const matchesSearch =
      !q ||
      tx.invoiceNumber.toLowerCase().includes(q) ||
      tx.customerName.toLowerCase().includes(q) ||
      tx.cashierName.toLowerCase().includes(q)

    // Status
    const matchesStatus =
      selectedStatus.value === 'ALL' || tx.status === selectedStatus.value

    // Payment method
    const matchesMethod =
      selectedMethod.value === 'ALL' || tx.paymentMethod === selectedMethod.value

    return matchesSearch && matchesStatus && matchesMethod
  })
})

const totalRevenue = computed(() => {
  return transactionStore.transactions
    .filter(t => t.status === 'PAID')
    .reduce((sum, t) => sum + t.total, 0)
})

const paidCount = computed(() => {
  return transactionStore.transactions.filter(t => t.status === 'PAID').length
})

const voidCount = computed(() => {
  return transactionStore.transactions.filter(t => t.status === 'VOID').length
})

const averageBasket = computed(() => {
  if (paidCount.value === 0) return 0
  return Math.round(totalRevenue.value / paidCount.value)
})

function formatRp(val) {
  if (typeof val !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

function openReceiptDetail(tx) {
  selectedTransaction.value = tx
  showReceiptModal.value = true
}

function handleTransactionUpdated() {
  // refresh selected tx reference
  if (selectedTransaction.value) {
    selectedTransaction.value = transactionStore.transactions.find(
      t => t.id === selectedTransaction.value.id
    )
  }
}

function exportToCSV() {
  const headers = ['No Invoice', 'Tanggal', 'Cabang', 'Kasir', 'Pelanggan', 'Metode Bayar', 'Subtotal', 'Pajak', 'Diskon', 'Total', 'Status']
  const rows = transactionStore.transactions.map(t => [
    t.invoiceNumber,
    t.date,
    `"${t.outletName}"`,
    `"${t.cashierName}"`,
    `"${t.customerName}"`,
    t.paymentMethod,
    t.subtotal,
    t.tax,
    t.discount,
    t.total,
    t.status
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `transaksi_abdi_pos_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  toast.success('File CSV Transaksi berhasil di-export!')
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.625rem;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.025em;
  color: #0f172a;
  margin: 0;
}

.page-subtitle {
  font-size: 0.925rem;
  line-height: 1.6;
  color: #64748b;
  margin-top: 0.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border-width: 1px;
}

.metric-icon-box {
  width: 48px;
  height: 48px;
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
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.35rem;
  font-weight: 800;
  font-family: monospace;
  line-height: 1.3;
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

.customer-info {
  display: flex;
  flex-direction: column;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}
</style>
