<template>
  <div class="shifts-page space-y-6">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Shift Kasir & Rekonsiliasi Kas</h1>
        <p class="page-subtitle">
          Kelola pembukaan modal laci kasir, jam operasional kasir, dan audit selisih uang fisik saat serah terima shift.
        </p>
      </div>
      <div class="header-actions">
        <BaseButton
          v-if="!activeShift"
          variant="primary"
          size="md"
          @click="openNewShiftModal"
        >
          <AppIcon name="clock" :size="16" />
          Buka Shift Baru
        </BaseButton>
      </div>
    </div>

    <!-- Active Shift Highlight Hero Card (Clean White Aesthetic) -->
    <div
      v-if="activeShift"
      class="shift-hero-card clean-white-card animate-fade-in"
    >
      <!-- Hero Header & Cashier Profile -->
      <div class="hero-top-row">
        <div class="hero-cashier-info">
          <div class="cashier-avatar-wrap">
            <div class="avatar-ring">
              <span class="avatar-initials">{{ getInitials(activeShift.cashierName) }}</span>
            </div>
            <div class="avatar-status-dot" title="Shift Aktif Berjalan"></div>
          </div>

          <div class="cashier-details">
            <div class="status-pill-badge">
              <span class="pulse-indicator"></span>
              <span>Shift Sedang Berjalan</span>
            </div>
            <h2 class="cashier-name">{{ activeShift.cashierName }}</h2>
            <div class="shift-meta-chips">
              <span class="meta-chip">
                <AppIcon name="clock" :size="14" />
                Buka sejak: <strong class="font-mono text-slate-800">{{ activeShift.openedAt }}</strong>
              </span>
              <span class="meta-divider">•</span>
              <span class="meta-chip">
                <AppIcon name="pos" :size="14" />
                {{ activeShift.notes || 'Kasir Utama' }}
              </span>
            </div>
          </div>
        </div>

        <div class="hero-action-box">
          <BaseButton
            variant="danger"
            size="lg"
            class="reconciliation-btn"
            @click="openCloseShiftModal(activeShift)"
          >
            <template #icon><AppIcon name="lock" :size="18" /></template>
            Tutup Shift & Rekonsiliasi Kas
          </BaseButton>
          <span class="action-sub-hint">Hitung uang fisik di laci kasir saat serah terima</span>
        </div>
      </div>

      <!-- Shift Key Metrics Grid -->
      <div class="hero-metrics-grid">
        <!-- Metric 1: Modal Awal Laci -->
        <div class="metric-card-item card-amber">
          <div class="metric-header">
            <span class="metric-icon-wrap amber">
              <AppIcon name="pos" :size="17" />
            </span>
            <span class="metric-label">Modal Awal Laci</span>
          </div>
          <div class="metric-value font-mono">
            {{ formatRp(activeShift.startingCash) }}
          </div>
          <div class="metric-footer">
            Uang modal kembalian di awal shift
          </div>
        </div>

        <!-- Metric 2: Penjualan Kas Masuk -->
        <div class="metric-card-item card-cyan">
          <div class="metric-header">
            <span class="metric-icon-wrap cyan">
              <AppIcon name="trending-up" :size="17" />
            </span>
            <span class="metric-label">Penjualan Kas Masuk</span>
          </div>
          <div class="metric-value font-mono text-cyan-val">
            + {{ formatRp(activeCashSales) }}
          </div>
          <div class="metric-footer">
            Akumulasi uang tunai masuk shift ini
          </div>
        </div>

        <!-- Metric 3: Total Kas Sistem (Seharusnya) -->
        <div class="metric-card-item card-emerald highlight">
          <div class="metric-header">
            <span class="metric-icon-wrap emerald">
              <AppIcon name="dollar" :size="17" />
            </span>
            <span class="metric-label">Total Kas Sistem (Seharusnya)</span>
          </div>
          <div class="metric-value font-mono text-emerald-val">
            {{ formatRp(activeShift.expectedCash) }}
          </div>
          <div class="metric-footer">
            Modal laci + Total penjualan tunai
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State / No Active Shift Card -->
    <div
      v-else
      class="no-shift-alert animate-fade-in"
    >
      <div class="alert-left-content">
        <div class="alert-icon-halo">
          <AppIcon name="clock" :size="24" />
        </div>
        <div>
          <h3 class="alert-title">Tidak Ada Shift Kasir yang Sedang Aktif</h3>
          <p class="alert-desc">
            Pastikan kasir membuka shift baru dan menginput modal kas awal sebelum memulai melayani pesanan di kasir POS.
          </p>
        </div>
      </div>
      <BaseButton variant="primary" size="lg" @click="openNewShiftModal">
        <template #icon><AppIcon name="clock" :size="18" /></template>
        Buka Shift Sekarang
      </BaseButton>
    </div>

    <!-- Shift History Table -->
    <BaseCard class="mt-6">
      <div class="card-title-bar mb-6">
        <h3 class="font-bold text-slate-800 text-lg">Riwayat Shift Kasir Terdahulu</h3>
        <span class="text-sm text-slate-500 mt-1 block">Audit pencatatan uang fisik dan selisih kas per pergantian kasir</span>
      </div>

      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID Shift</th>
              <th>Kasir</th>
              <th>Waktu Buka</th>
              <th>Waktu Tutup</th>
              <th class="text-right">Modal Awal</th>
              <th class="text-right">Kas Sistem</th>
              <th class="text-right">Kas Fisik</th>
              <th class="text-center">Selisih</th>
              <th>Keterangan</th>
              <th class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="shifts.length === 0">
              <td colspan="10" class="empty-state">
                <p class="text-slate-400 text-sm">Belum ada riwayat shift kasir tercatat.</p>
              </td>
            </tr>

            <tr
              v-for="shift in shifts"
              :key="shift.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td>
                <span class="font-mono text-xs font-bold text-slate-700">{{ shift.id }}</span>
              </td>
              <td>
                <span class="font-medium text-slate-800">{{ shift.cashierName }}</span>
              </td>
              <td class="text-xs text-slate-500 whitespace-nowrap">{{ shift.openedAt }}</td>
              <td class="text-xs text-slate-500 whitespace-nowrap">{{ shift.closedAt || '— Masih Aktif —' }}</td>
              <td class="text-right font-mono text-xs font-semibold">{{ formatRp(shift.startingCash) }}</td>
              <td class="text-right font-mono text-xs font-bold text-slate-800">{{ formatRp(shift.expectedCash) }}</td>
              <td class="text-right font-mono text-xs font-bold">
                {{ shift.actualCash !== null ? formatRp(shift.actualCash) : '—' }}
              </td>
              <td class="text-center font-mono text-xs">
                <template v-if="shift.actualCash !== null">
                  <span
                    v-if="shift.cashDifference === 0"
                    class="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                  >
                    Pas (Rp 0)
                  </span>
                  <span
                    v-else-if="shift.cashDifference < 0"
                    class="inline-block px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200"
                  >
                    {{ formatRp(shift.cashDifference) }}
                  </span>
                  <span
                    v-else
                    class="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200"
                  >
                    +{{ formatRp(shift.cashDifference) }}
                  </span>
                </template>
                <span v-else class="text-slate-400">—</span>
              </td>
              <td class="text-xs text-slate-600 max-w-xs truncate" :title="shift.notes">
                {{ shift.notes }}
              </td>
              <td class="text-center">
                <BaseBadge :variant="shift.status === 'OPEN' ? 'warning' : 'neutral'">
                  {{ shift.status === 'OPEN' ? 'Sedang Aktif' : 'Selesai' }}
                </BaseBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Shift Modal -->
    <ShiftModal
      v-model="showShiftModal"
      :shift-to-close="selectedShiftToClose"
      @shift-saved="handleShiftSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import ShiftModal from '../components/ShiftModal.vue'
import { useTransactionStore } from '../stores/transactionStore'

const transactionStore = useTransactionStore()

onMounted(() => {
  transactionStore.fetchShifts()
  transactionStore.fetchCurrentShift()
})

const showShiftModal = ref(false)
const selectedShiftToClose = ref(null)

const shifts = computed(() => transactionStore.shifts)
const activeShift = computed(() => transactionStore.currentActiveShift)

const activeCashSales = computed(() => {
  if (!activeShift.value) return 0
  const expected = activeShift.value.expectedCash || 0
  const starting = activeShift.value.startingCash || 0
  return Math.max(0, expected - starting)
})

function getInitials(name) {
  if (!name) return 'K'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function formatRp(val) {
  if (typeof val !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

function openNewShiftModal() {
  selectedShiftToClose.value = null
  showShiftModal.value = true
}

function openCloseShiftModal(shift) {
  selectedShiftToClose.value = shift
  showShiftModal.value = true
}

function handleShiftSaved() {
  selectedShiftToClose.value = null
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

/* ========================================================
   ACTIVE SHIFT HERO CARD (Clean White Aesthetic)
======================================================== */
.shift-hero-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.75rem 2rem;
  color: #0f172a;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03);
  margin-bottom: 2rem;
}

/* Top Row: Cashier Profile & Actions */
.hero-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.hero-cashier-info {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.cashier-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.avatar-ring {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.05em;
}

.avatar-status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  background-color: #10b981;
  border: 2.5px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.status-pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 11px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 9999px;
  margin-bottom: 6px;
}

.pulse-indicator {
  width: 7px;
  height: 7px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
  animation: pulse-dot 2s infinite ease-in-out;
}

@keyframes pulse-dot {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.35);
    opacity: 0.65;
  }
}

.cashier-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.25;
}

.shift-meta-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.meta-divider {
  color: #cbd5e1;
}

.hero-action-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.reconciliation-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  color: #ffffff !important;
  border: 1px solid #b91c1c !important;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3) !important;
  font-weight: 700 !important;
}

.reconciliation-btn:hover {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%) !important;
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.4) !important;
  transform: translateY(-1px);
}

.action-sub-hint {
  font-size: 11.5px;
  color: #64748b;
}

/* Hero Metrics 3-Card Grid */
.hero-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.metric-card-item {
  border-radius: 14px;
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all var(--duration-fast) ease;
}

.metric-card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
}

/* Card 1: Modal Awal Laci */
.metric-card-item.card-amber {
  background: #fffdf7;
  border: 1px solid #fef3c7;
}

/* Card 2: Penjualan Kas Masuk */
.metric-card-item.card-cyan {
  background: #f0fdfa;
  border: 1px solid #ccfbf1;
}

/* Card 3: Total Kas Sistem (Seharusnya) */
.metric-card-item.card-emerald {
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon-wrap.amber {
  background: #fef3c7;
  color: #d97706;
}

.metric-icon-wrap.cyan {
  background: #ccfbf1;
  color: #0d9488;
}

.metric-icon-wrap.emerald {
  background: #dcfce7;
  color: #16a34a;
}

.metric-label {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card-amber .metric-label {
  color: #92400e;
}

.card-cyan .metric-label {
  color: #0f766e;
}

.card-emerald .metric-label {
  color: #15803d;
}

.metric-value {
  font-size: 1.55rem;
  font-weight: 800;
  line-height: 1.2;
  margin-top: 4px;
}

.card-amber .metric-value {
  color: #0f172a;
}

.card-cyan .metric-value {
  color: #0d9488;
}

.card-emerald .metric-value {
  color: #15803d;
}

.metric-footer {
  font-size: 11.5px;
  line-height: 1.4;
  margin-top: 2px;
}

.card-amber .metric-footer {
  color: #b45309;
}

.card-cyan .metric-footer {
  color: #115e59;
}

.card-emerald .metric-footer {
  color: #166534;
  font-weight: 600;
}

/* ========================================================
   EMPTY STATE / NO SHIFT ALERT
======================================================== */
.no-shift-alert {
  background: #fffbeb;
  border: 1.5px solid #fde68a;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08);
}

.alert-left-content {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.alert-icon-halo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #fef3c7;
  color: #d97706;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #78350f;
  margin: 0;
}

.alert-desc {
  font-size: 0.875rem;
  color: #92400e;
  margin-top: 0.25rem;
  line-height: 1.5;
}

/* ========================================================
   SHIFT HISTORY TABLE
======================================================== */
.card-title-bar {
  display: flex;
  flex-direction: column;
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
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  white-space: nowrap;
}

.data-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

@media (max-width: 900px) {
  .hero-top-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .hero-action-box {
    align-items: flex-start;
    width: 100%;
  }
  .reconciliation-btn {
    width: 100%;
  }
  .hero-metrics-grid {
    grid-template-columns: 1fr;
  }
  .no-shift-alert {
    flex-direction: column;
    align-items: stretch;
  }
  .alert-left-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
