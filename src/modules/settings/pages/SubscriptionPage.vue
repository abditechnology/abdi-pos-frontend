<template>
  <div class="subscription-page space-y-6">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Paket Langganan SaaS & Tagihan</h1>
        <p class="page-subtitle">
          Informasi paket aktif bisnis Anda, kuota pemakaian sumber daya, dan riwayat pembayaran langganan.
        </p>
      </div>

      <div class="header-actions">
        <BaseButton variant="primary" size="md" @click="showUpgradeModal = true">
          <AppIcon name="credit-card" :size="16" />
          Upgrade / Kelola Paket
        </BaseButton>
      </div>
    </div>

    <!-- Active Plan Banner -->
    <div class="active-plan-card bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span class="inline-block bg-blue-500/30 text-white font-bold text-xs uppercase px-3 py-1 rounded-full mb-2">
            Paket Bisnis Aktif
          </span>
          <h2 class="text-3xl font-extrabold">Pro Plan</h2>
          <p class="text-blue-100 text-sm mt-1">
            Biaya Langganan: <strong class="text-white font-mono">Rp 299.000 / bulan</strong> • Periode penagihan berikutnya: <strong class="text-white">25 November 2026</strong>
          </p>
        </div>

        <div class="flex items-center gap-3">
          <BaseButton variant="warning" size="md" @click="showUpgradeModal = true">
            Upgrade ke Enterprise
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Quota & Resource Usage -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <BaseCard>
        <span class="text-xs font-semibold text-slate-500 block">Cabang Outlet Aktif</span>
        <div class="flex justify-between items-baseline mt-2">
          <span class="text-2xl font-bold font-mono text-slate-900">3 / 5</span>
          <span class="text-xs font-semibold text-blue-600">60% terpakai</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div class="bg-blue-600 h-1.5 rounded-full" style="width: 60%"></div>
        </div>
      </BaseCard>

      <BaseCard>
        <span class="text-xs font-semibold text-slate-500 block">Akun Staf & Kasir</span>
        <div class="flex justify-between items-baseline mt-2">
          <span class="text-2xl font-bold font-mono text-slate-900">5 / 15</span>
          <span class="text-xs font-semibold text-emerald-600">33% terpakai</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div class="bg-emerald-500 h-1.5 rounded-full" style="width: 33%"></div>
        </div>
      </BaseCard>

      <BaseCard>
        <span class="text-xs font-semibold text-slate-500 block">Katalog Menu & Produk</span>
        <div class="flex justify-between items-baseline mt-2">
          <span class="text-2xl font-bold font-mono text-slate-900">42 Item</span>
          <span class="text-xs font-semibold text-purple-600">Unlimited</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div class="bg-purple-500 h-1.5 rounded-full" style="width: 100%"></div>
        </div>
      </BaseCard>

      <BaseCard>
        <span class="text-xs font-semibold text-slate-500 block">Transaksi Bulan Ini</span>
        <div class="flex justify-between items-baseline mt-2">
          <span class="text-2xl font-bold font-mono text-slate-900">836 Struk</span>
          <span class="text-xs font-semibold text-indigo-600">Unlimited</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div class="bg-indigo-500 h-1.5 rounded-full" style="width: 100%"></div>
        </div>
      </BaseCard>
    </div>

    <!-- Invoices & Billing History Table -->
    <BaseCard>
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="font-bold text-slate-800 text-base">Riwayat Tagihan & Faktur SaaS</h3>
          <p class="text-xs text-slate-500">Daftar pembayaran langganan bulanan dan bukti faktur resmi</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>No. Faktur</th>
              <th>Paket Langganan</th>
              <th>Periode</th>
              <th class="text-right">Nominal Tagihan</th>
              <th>Tanggal Lunas</th>
              <th class="text-center">Status</th>
              <th class="text-center">Faktur PDF</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in invoices" :key="inv.id" class="hover:bg-slate-50 transition-colors">
              <td class="font-mono font-bold text-blue-600">{{ inv.number }}</td>
              <td class="font-medium text-slate-800">{{ inv.plan }}</td>
              <td class="text-xs text-slate-500">{{ inv.period }}</td>
              <td class="text-right font-mono font-bold text-slate-900">{{ formatRp(inv.amount) }}</td>
              <td class="text-xs text-slate-500">{{ inv.paidDate }}</td>
              <td class="text-center">
                <BaseBadge variant="success">Lunas</BaseBadge>
              </td>
              <td class="text-center">
                <BaseButton variant="secondary" size="sm" @click="downloadInvoice(inv)">
                  <AppIcon name="download" :size="14" />
                  Unduh PDF
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Upgrade Plan Modal -->
    <UpgradePlanModal v-model="showUpgradeModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import UpgradePlanModal from '../components/UpgradePlanModal.vue'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()
const showUpgradeModal = ref(false)

const invoices = ref([
  {
    id: 'inv-03',
    number: 'INV-SUB-202610-092',
    plan: 'Pro Plan (Bulanan)',
    period: '25 Okt 2026 - 25 Nov 2026',
    amount: 299000,
    paidDate: '2026-10-25 00:01'
  },
  {
    id: 'inv-02',
    number: 'INV-SUB-202609-085',
    plan: 'Pro Plan (Bulanan)',
    period: '25 Sep 2026 - 25 Okt 2026',
    amount: 299000,
    paidDate: '2026-09-25 00:02'
  },
  {
    id: 'inv-01',
    number: 'INV-SUB-202608-011',
    plan: 'Pro Plan (Bulanan)',
    period: '25 Agu 2026 - 25 Sep 2026',
    amount: 299000,
    paidDate: '2026-08-25 08:30'
  }
])

function formatRp(val) {
  if (typeof val !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

function downloadInvoice(inv) {
  toast.success(`Mengunduh faktur PDF ${inv.number}...`)
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

.active-plan-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #4338ca 100%);
  border-radius: 20px;
  padding: 1.75rem 2rem;
  color: #ffffff;
  box-shadow: 0 16px 36px -10px rgba(30, 58, 138, 0.35);
  position: relative;
  overflow: hidden;
  margin-bottom: 1.5rem;
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
</style>
