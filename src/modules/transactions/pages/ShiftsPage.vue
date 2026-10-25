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
        <BaseButton
          v-else
          variant="danger"
          size="md"
          @click="openCloseShiftModal(activeShift)"
        >
          <AppIcon name="lock" :size="16" />
          Tutup Shift Aktif
        </BaseButton>
      </div>
    </div>

    <!-- Active Shift Highlight Widget -->
    <div
      v-if="activeShift"
      class="active-shift-card bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden"
    >
      <div class="active-shift-glow"></div>
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="inline-flex items-center gap-2 bg-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Shift Sedang Berjalan
          </div>
          <h2 class="text-2xl font-bold">{{ activeShift.cashierName }}</h2>
          <p class="text-blue-100 text-sm mt-1">
            Dibuka sejak: <strong class="font-mono text-white">{{ activeShift.openedAt }}</strong> • {{ activeShift.notes }}
          </p>
        </div>

        <div class="flex items-center gap-6 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
          <div>
            <span class="text-xs text-blue-200 block">Modal Awal Laci</span>
            <span class="text-lg font-bold font-mono">{{ formatRp(activeShift.startingCash) }}</span>
          </div>
          <div class="w-px h-8 bg-white/20"></div>
          <div>
            <span class="text-xs text-blue-200 block">Kas Sistem Saat Ini</span>
            <span class="text-lg font-bold font-mono text-emerald-300">{{ formatRp(activeShift.expectedCash) }}</span>
          </div>
          <BaseButton
            variant="warning"
            size="sm"
            @click="openCloseShiftModal(activeShift)"
          >
            Rekonsiliasi Kas
          </BaseButton>
        </div>
      </div>
    </div>

    <div
      v-else
      class="no-shift-alert bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          <AppIcon name="clock" :size="20" />
        </div>
        <div>
          <h3 class="font-semibold text-amber-900 text-sm">Tidak Ada Shift Kasir yang Sedang Aktif</h3>
          <p class="text-xs text-amber-700 mt-0.5">
            Pastikan kasir membuka shift baru dan menginput modal kas awal sebelum memulai melayani pesanan di kasir POS.
          </p>
        </div>
      </div>
      <BaseButton variant="primary" size="sm" @click="openNewShiftModal">
        Buka Shift Sekarang
      </BaseButton>
    </div>

    <!-- Shift History Table -->
    <BaseCard>
      <div class="card-title-bar mb-4">
        <h3 class="font-bold text-slate-800 text-base">Riwayat Shift Kasir Terdahulu</h3>
        <span class="text-xs text-slate-500">Audit pencatatan uang fisik dan selisih kas per pergantian kasir</span>
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
import { ref, computed } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import ShiftModal from '../components/ShiftModal.vue'
import { useTransactionStore } from '../stores/transactionStore'

const transactionStore = useTransactionStore()

const showShiftModal = ref(false)
const selectedShiftToClose = ref(null)

const shifts = computed(() => transactionStore.shifts)
const activeShift = computed(() => transactionStore.currentActiveShift)

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

.active-shift-card {
  position: relative;
}

.active-shift-glow {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
}

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

.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
}
</style>
