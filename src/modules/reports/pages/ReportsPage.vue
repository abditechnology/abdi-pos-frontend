<template>
  <div class="reports-page space-y-6">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Laporan Penjualan & Analitik</h1>
        <p class="page-subtitle">
          Analisis performa bisnis: omset, laba kotor, kontribusi metode pembayaran, dan ranking produk terlaris.
        </p>
      </div>

      <div class="header-actions">
        <!-- Date preset picker -->
        <div class="date-preset-pills">
          <button
            v-for="p in periodPresets"
            :key="p.id"
            class="pill-btn"
            :class="{ active: selectedPeriod === p.id }"
            @click="selectedPeriod = p.id"
          >
            {{ p.label }}
          </button>
        </div>

        <BaseButton variant="secondary" size="md" @click="downloadReportCSV">
          <AppIcon name="download" :size="16" />
          Download Excel (CSV)
        </BaseButton>
      </div>
    </div>

    <!-- Financial Summary Cards -->
    <div class="metrics-grid">
      <div class="metric-card bg-blue-50/60 border-blue-100">
        <div class="metric-icon-box bg-blue-600 text-white">
          <AppIcon name="dollar" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Total Omset Kotor</span>
          <span class="metric-value text-blue-900">{{ formatRp(summaryData.grossSales) }}</span>
          <span class="text-[11px] text-emerald-600 font-semibold mt-0.5">↑ +14.2% dibanding periode lalu</span>
        </div>
      </div>

      <div class="metric-card bg-emerald-50/60 border-emerald-100">
        <div class="metric-icon-box bg-emerald-600 text-white">
          <AppIcon name="trending-up" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Estimasi Laba Kotor (Gross Profit)</span>
          <span class="metric-value text-emerald-900">{{ formatRp(summaryData.grossProfit) }}</span>
          <span class="text-[11px] text-slate-500 mt-0.5">Margin laba kotor ~56.4%</span>
        </div>
      </div>

      <div class="metric-card bg-amber-50/60 border-amber-100">
        <div class="metric-icon-box bg-amber-500 text-white">
          <AppIcon name="percent" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Total Diskon Diberikan</span>
          <span class="metric-value text-amber-900">{{ formatRp(summaryData.totalDiscounts) }}</span>
          <span class="text-[11px] text-slate-500 mt-0.5">Dari program voucher & promo</span>
        </div>
      </div>

      <div class="metric-card bg-slate-50 border-slate-200">
        <div class="metric-icon-box bg-slate-700 text-white">
          <AppIcon name="receipt" :size="20" />
        </div>
        <div class="metric-info">
          <span class="metric-label">PPN 11% Terkumpul</span>
          <span class="metric-value text-slate-800">{{ formatRp(summaryData.totalTax) }}</span>
          <span class="text-[11px] text-slate-500 mt-0.5">Kewajiban setoran pajak</span>
        </div>
      </div>
    </div>

    <!-- Charts / Split Row: Payment Breakdown & Hourly Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Payment Methods Contribution -->
      <BaseCard class="lg:col-span-1">
        <h3 class="font-bold text-slate-800 text-base mb-1">Metode Pembayaran</h3>
        <p class="text-xs text-slate-500 mb-4">Distribusi transaksi kasir berdasarkan cara bayar</p>

        <div class="space-y-4">
          <div
            v-for="pm in paymentBreakdown"
            :key="pm.name"
            class="payment-progress-row"
          >
            <div class="flex justify-between items-center text-xs mb-1">
              <span class="font-semibold text-slate-700 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full" :class="pm.dotClass"></span>
                {{ pm.name }}
              </span>
              <span class="font-mono font-bold text-slate-900">{{ formatRp(pm.amount) }} ({{ pm.percentage }}%)</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="pm.barClass"
                :style="{ width: `${pm.percentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Outlet Comparison -->
      <BaseCard class="lg:col-span-2">
        <h3 class="font-bold text-slate-800 text-base mb-1">Kontribusi Penjualan per Cabang</h3>
        <p class="text-xs text-slate-500 mb-4">Perbandingan omset dan jumlah transaksi antar outlet operasional</p>

        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nama Cabang</th>
                <th class="text-right">Transaksi</th>
                <th class="text-right">Total Omset</th>
                <th class="text-right">Rata-rata Basket</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ot in outletPerformance" :key="ot.name">
                <td class="font-semibold text-slate-800">{{ ot.name }}</td>
                <td class="text-right font-mono">{{ ot.ordersCount }} tx</td>
                <td class="text-right font-mono font-bold text-blue-700">{{ formatRp(ot.revenue) }}</td>
                <td class="text-right font-mono text-xs text-slate-600">{{ formatRp(ot.avgBasket) }}</td>
                <td class="text-center">
                  <span class="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Operasional Aktif
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>

    <!-- Top Selling Menu Items Table -->
    <BaseCard>
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="font-bold text-slate-800 text-base">Menu Terlaris (Top Selling Items)</h3>
          <p class="text-xs text-slate-500">Ranking item menu dengan volume penjualan tertinggi di periode ini</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th class="text-center"># Rank</th>
              <th>Nama Item Menu</th>
              <th>Kategori</th>
              <th class="text-right">Harga Jual</th>
              <th class="text-center">Qty Terjual</th>
              <th class="text-right">Total Omset</th>
              <th class="text-right">Estimasi Laba</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in topProducts" :key="item.name">
              <td class="text-center font-bold font-mono">
                <span
                  class="rank-badge"
                  :class="idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'rank-other'"
                >
                  {{ idx + 1 }}
                </span>
              </td>
              <td>
                <span class="font-bold text-slate-800 block">{{ item.name }}</span>
                <span class="text-xs text-slate-400">SKU: {{ item.sku }}</span>
              </td>
              <td>
                <span class="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{{ item.category }}</span>
              </td>
              <td class="text-right font-mono text-xs">{{ formatRp(item.price) }}</td>
              <td class="text-center font-mono font-bold text-blue-600 text-sm">
                {{ item.soldQty }} porsi
              </td>
              <td class="text-right font-mono font-bold text-slate-900">
                {{ formatRp(item.soldQty * item.price) }}
              </td>
              <td class="text-right font-mono font-semibold text-emerald-600">
                {{ formatRp(item.profit) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()

const selectedPeriod = ref('this-month')

const periodPresets = [
  { id: 'today', label: 'Hari Ini' },
  { id: 'last-7-days', label: '7 Hari Terakhir' },
  { id: 'this-month', label: 'Bulan Ini' },
  { id: 'this-year', label: 'Tahun Ini' }
]

const summaryData = ref({
  grossSales: 48650000,
  grossProfit: 27438600,
  totalDiscounts: 2450000,
  totalTax: 5351500
})

const paymentBreakdown = ref([
  {
    name: 'QRIS (Gopay / ShopeePay / BCA)',
    amount: 27244000,
    percentage: 56,
    dotClass: 'bg-blue-600',
    barClass: 'bg-blue-600'
  },
  {
    name: 'Uang Tunai (Cash)',
    amount: 15568000,
    percentage: 32,
    dotClass: 'bg-emerald-500',
    barClass: 'bg-emerald-500'
  },
  {
    name: 'Kartu Debit / EDC',
    amount: 5838000,
    percentage: 12,
    dotClass: 'bg-indigo-500',
    barClass: 'bg-indigo-500'
  }
])

const outletPerformance = ref([
  {
    name: 'Abdi Martabak — Grand Galaxy',
    ordersCount: 524,
    revenue: 31250000,
    avgBasket: 59637
  },
  {
    name: 'Abdi Martabak — Summarecon Mall',
    ordersCount: 312,
    revenue: 17400000,
    avgBasket: 55769
  }
])

const topProducts = ref([
  {
    name: 'Terang Bulan Spesial Coklat Keju',
    sku: 'TB-CK-001',
    category: 'Terang Bulan Manis',
    price: 45000,
    soldQty: 240,
    profit: 6720000
  },
  {
    name: 'Martabak Telur Spesial Bebek 3 Telur',
    sku: 'MT-BB-002',
    category: 'Martabak Telur Gurih',
    price: 58000,
    soldQty: 185,
    profit: 5365000
  },
  {
    name: 'Terang Bulan Red Velvet Cream Cheese',
    sku: 'TB-RV-003',
    category: 'Terang Bulan Manis',
    price: 55000,
    soldQty: 128,
    profit: 3968000
  },
  {
    name: 'Terang Bulan Tipis Kering Coklat',
    sku: 'TB-TP-004',
    category: 'Tipis Kering (Tipker)',
    price: 25000,
    soldQty: 165,
    profit: 2640000
  },
  {
    name: 'Es Teh Manis Jumbo',
    sku: 'BV-ET-005',
    category: 'Minuman Segar',
    price: 6000,
    soldQty: 480,
    profit: 2160000
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

function downloadReportCSV() {
  const headers = ['Peringkat', 'Nama Menu', 'SKU', 'Kategori', 'Harga Jual', 'Qty Terjual', 'Total Omset', 'Estimasi Laba']
  const rows = topProducts.value.map((p, i) => [
    i + 1,
    `"${p.name}"`,
    p.sku,
    `"${p.category}"`,
    p.price,
    p.soldQty,
    p.soldQty * p.price,
    p.profit
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `laporan_penjualan_${selectedPeriod.value}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  toast.success('File Laporan Penjualan berhasil diunduh!')
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.date-preset-pills {
  display: flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
}

.pill-btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.775rem;
  font-weight: 600;
  color: #64748b;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.pill-btn.active {
  background: #ffffff;
  color: #0284c7;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 800;
}

.rank-1 {
  background: #fef08a;
  color: #854d0e;
  border: 1px solid #facc15;
}

.rank-2 {
  background: #e2e8f0;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.rank-3 {
  background: #fed7aa;
  color: #9a3412;
  border: 1px solid #fdba74;
}

.rank-other {
  background: #f1f5f9;
  color: #64748b;
}
</style>
