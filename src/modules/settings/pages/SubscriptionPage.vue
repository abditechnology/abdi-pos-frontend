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

      <div class="header-actions flex gap-2">
        <router-link to="/app/plugins" class="header-link-btn">
          <AppIcon name="sparkles" :size="16" />
          <span>Marketplace Plugin</span>
        </router-link>
        <BaseButton variant="primary" size="md" @click="showUpgradeModal = true">
          <AppIcon name="credit-card" :size="16" />
          Pilihan Paket
        </BaseButton>
      </div>
    </div>

    <!-- Active Plan Banner -->
    <div class="active-plan-card bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block bg-blue-500/30 text-white font-bold text-xs uppercase px-3 py-1 rounded-full">
              Paket Bisnis Aktif
            </span>
            <span class="inline-block bg-amber-400 text-slate-900 font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
              Best Seller
            </span>
          </div>
          <h2 class="text-3xl font-extrabold">Business Pro</h2>
          <p class="text-blue-100 text-sm mt-1">
            Biaya Paket Utama: <strong class="text-white font-mono">Rp 149.000 / bulan</strong> •
            Periode aktif hingga: <strong class="text-white">25 November 2026</strong>
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
          <span class="text-2xl font-bold font-mono text-slate-900">2 / 2</span>
          <span class="text-xs font-semibold text-amber-600">100% kuota</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div class="bg-amber-500 h-1.5 rounded-full" style="width: 100%"></div>
        </div>
      </BaseCard>

      <BaseCard>
        <span class="text-xs font-semibold text-slate-500 block">Akun</span>
        <div class="flex justify-between items-baseline mt-2">
          <span class="text-2xl font-bold font-mono text-slate-900">3 / 5</span>
          <span class="text-xs font-semibold text-emerald-600">60% terpakai</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div class="bg-emerald-500 h-1.5 rounded-full" style="width: 60%"></div>
        </div>
      </BaseCard>

      <BaseCard>
        <span class="text-xs font-semibold text-slate-500 block">Katalog Menu & Jasa</span>
        <div class="flex justify-between items-baseline mt-2">
          <span class="text-2xl font-bold font-mono text-slate-900">42 / 50</span>
          <span class="text-xs font-semibold text-purple-600">84% terpakai</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div class="bg-purple-500 h-1.5 rounded-full" style="width: 84%"></div>
        </div>
      </BaseCard>

      <BaseCard>
        <span class="text-xs font-semibold text-slate-500 block">Transaksi Kasir POS</span>
        <div class="flex justify-between items-baseline mt-2">
          <span class="text-2xl font-bold font-mono text-slate-900">836 Struk</span>
          <span class="text-xs font-semibold text-indigo-600">Unlimited</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div class="bg-indigo-500 h-1.5 rounded-full" style="width: 100%"></div>
        </div>
      </BaseCard>
    </div>

    <!-- Active Modular Plugins & Extensions (Add-on) -->
    <BaseCard>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <AppIcon name="sparkles" :size="18" class="text-purple-600" />
            <h3 class="font-bold text-slate-900 text-base">Plugin & Ekstensi Aktif (Add-on Modular)</h3>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            Fungsionalitas modular untuk melengkapi kebutuhan spesifik sektor bisnis Anda tanpa harus bayar fitur yang tidak dipakai.
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <div class="text-right">
            <span class="text-xs text-slate-500 block">Subtotal Add-on:</span>
            <span class="text-sm font-bold font-mono text-purple-700">{{ formatRp(pluginStore.totalActiveMonthlyFee) }}/bln</span>
          </div>
          <router-link to="/app/plugins" class="header-link-btn">
            <AppIcon name="plus" :size="14" />
            <span>Tambah Ekstensi</span>
          </router-link>
        </div>
      </div>

      <div v-if="pluginStore.activePlugins.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          v-for="p in pluginStore.activePlugins"
          :key="p.id"
          class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:border-purple-300 transition-colors"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-semibold px-2 py-0.5 rounded-md" :class="p.badgeClass">
                {{ p.categoryLabel }}
              </span>
              <span class="text-xs font-bold font-mono text-slate-800">
                {{ formatRp(p.priceMonthly) }}<span class="font-normal text-slate-500">/bln</span>
              </span>
            </div>

            <h4 class="font-bold text-slate-900 text-sm mb-1">{{ p.name }}</h4>
            <p class="text-xs text-slate-600 line-clamp-2 mb-3">{{ p.shortDesc }}</p>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-1">
            <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Aktif
            </span>
            <button
              type="button"
              class="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              @click="openDemoModal(p)"
            >
              <AppIcon name="sparkles" :size="12" />
              <span>Coba Demo</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <AppIcon name="sparkles" :size="28" class="text-slate-400 mx-auto mb-1" />
        <p class="text-xs font-semibold text-slate-600">Belum ada add-on plugin yang diaktifkan.</p>
        <router-link to="/app/plugins" class="text-xs text-purple-600 font-bold hover:underline mt-1 inline-block">
          Jelajahi 7 Plugin di Marketplace →
        </router-link>
      </div>
    </BaseCard>

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

    <!-- Interactive Plugin Demo Simulator Modal -->
    <PluginDemoModal
      v-model="showDemoModal"
      :plugin="selectedDemoPlugin"
      @install-requested="handleInstallFromModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import UpgradePlanModal from '../components/UpgradePlanModal.vue'
import PluginDemoModal from '../components/PluginDemoModal.vue'
import { usePluginStore } from '@/shared/stores/pluginStore'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()
const pluginStore = usePluginStore()
const showUpgradeModal = ref(false)
const showDemoModal = ref(false)
const selectedDemoPlugin = ref(null)

onMounted(() => {
  pluginStore.fetchPlugins()
})

const invoices = ref([
  {
    id: 'inv-03',
    number: 'INV-SUB-202610-092',
    plan: 'Business Pro Plan (Bulanan)',
    period: '25 Okt 2026 - 25 Nov 2026',
    amount: 149000,
    paidDate: '2026-10-25 00:01'
  },
  {
    id: 'inv-02',
    number: 'INV-SUB-202609-085',
    plan: 'Business Pro Plan (Bulanan)',
    period: '25 Sep 2026 - 25 Okt 2026',
    amount: 149000,
    paidDate: '2026-09-25 00:02'
  },
  {
    id: 'inv-01',
    number: 'INV-SUB-202608-011',
    plan: 'Business Pro Plan (Bulanan)',
    period: '25 Agu 2026 - 25 Sep 2026',
    amount: 149000,
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

function openDemoModal(plugin) {
  selectedDemoPlugin.value = plugin
  showDemoModal.value = true
}

function handleInstallFromModal(plugin) {
  pluginStore.togglePlugin(plugin.id)
  showDemoModal.value = false
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

.active-plan-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #4338ca 100%);
  border-radius: 20px;
  padding: 1.75rem 2rem;
  color: #ffffff;
  box-shadow: 0 16px 36px -10px rgba(30, 58, 138, 0.35);
  position: relative;
  overflow: hidden;
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

.tag-purple { background: #f3e8ff; color: #7e22ce; }
.tag-emerald { background: #ecfdf5; color: #047857; }
.tag-cyan { background: #ecfeff; color: #0e7490; }
.tag-blue { background: #eff6ff; color: #1d4ed8; }
.tag-indigo { background: #e0e7ff; color: #4338ca; }
.tag-amber { background: #fef3c7; color: #b45309; }
.tag-rose { background: #ffe4e6; color: #be123c; }
</style>
