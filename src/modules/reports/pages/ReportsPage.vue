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

    <!-- Financial Summary Cards (Consistent Modern Cards with Colored Halo Icons) -->
    <div class="metrics-grid-4">
      <div class="stat-card">
        <div class="stat-icon-halo halo-blue">
          <AppIcon name="dollar" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Total Omset Kotor</span>
          <span class="stat-value font-mono">{{ formatRp(summaryData.grossSales) }}</span>
          <span class="stat-sub text-emerald-600 font-semibold">↑ +14.2% vs periode lalu</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-emerald">
          <AppIcon name="trending-up" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Estimasi Laba Kotor</span>
          <span class="stat-value font-mono text-emerald-600">{{ formatRp(summaryData.grossProfit) }}</span>
          <span class="stat-sub">Margin laba kotor ~56.4%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-amber">
          <AppIcon name="percent" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Total Diskon Diberikan</span>
          <span class="stat-value font-mono text-amber-600">{{ formatRp(summaryData.totalDiscounts) }}</span>
          <span class="stat-sub">Dari program voucher & promo</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-purple">
          <AppIcon name="receipt" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">PPN 11% Terkumpul</span>
          <span class="stat-value font-mono">{{ formatRp(summaryData.totalTax) }}</span>
          <span class="stat-sub">Kewajiban setoran pajak</span>
        </div>
      </div>
    </div>

    <!-- 1. METODE PEMBAYARAN -->
    <BaseCard :bordered="true" custom-class="payment-methods-card">
      <div class="card-section-header">
        <div class="card-title-group">
          <div class="flex items-center gap-2">
            <AppIcon name="credit-card" :size="20" class="text-blue-600" />
            <h3 class="card-section-title">Metode Pembayaran</h3>
          </div>
          <p class="card-section-subtitle">
            Distribusi omset dan proporsi cara bayar pelanggan pada transaksi kasir POS
          </p>
        </div>

        <div class="header-tools-group">
          <!-- View Switcher: Card Arah Horizontal vs Grid 3 Kolom -->
          <div class="layout-toggle-pills">
            <button
              type="button"
              class="layout-pill-btn"
              :class="{ active: paymentLayoutMode === 'horizontal' }"
              title="Tampilan Card Arah Horizontal (Mendatar & Hemat Ruang)"
              @click="paymentLayoutMode = 'horizontal'"
            >
              <span>Card Horizontal</span>
            </button>
            <button
              type="button"
              class="layout-pill-btn"
              :class="{ active: paymentLayoutMode === 'grid' }"
              title="Tampilan Grid 3 Kolom Berdampingan"
              @click="paymentLayoutMode = 'grid'"
            >
              <AppIcon name="dashboard" :size="13" />
              <span>Grid Kolom</span>
            </button>
          </div>

          <span class="payment-summary-pill">
            <span class="pulse-dot-green"></span>
            <span>Total 948 Transaksi Kasir</span>
          </span>
        </div>
      </div>

      <div class="payment-card-body">
        <!-- Visual Multi-segment Distribution Bar -->
        <div class="distribution-bar-wrapper">
          <div class="distribution-label-row">
            <span class="text-xs font-bold text-slate-700">Komposisi Transaksi Pembayaran:</span>
            <span class="text-xs font-semibold text-slate-500">100% Tercatat Otomatis</span>
          </div>

          <div class="multi-segment-bar">
            <div
              v-for="pm in paymentBreakdown"
              :key="pm.name"
              class="bar-segment"
              :style="{ width: `${pm.percentage}%`, backgroundColor: pm.colorHex }"
              :title="`${pm.shortName}: ${pm.percentage}% (${formatRp(pm.amount)})`"
            ></div>
          </div>
        </div>

        <!-- TAMPILAN 1: CARD DENGAN ARAH HORIZONTAL (Mendatar, Ramping & Sangat Hemat Ruang) -->
        <div v-if="paymentLayoutMode === 'horizontal'" class="payment-horizontal-list">
          <div
            v-for="pm in paymentBreakdown"
            :key="pm.name"
            class="payment-row-card card-hover-lift"
            :class="pm.borderClass"
          >
            <!-- Kolom Kiri: Halo Icon + Nama Metode & Provider -->
            <div class="payment-row-left">
              <div class="stat-icon-halo" :class="pm.haloClass">
                <AppIcon :name="pm.icon" :size="24" />
              </div>
              <div class="payment-row-text">
                <div class="payment-name-row">
                  <h4 class="payment-name-title">{{ pm.name }}</h4>
                  <span class="share-badge" :class="pm.badgeClass">
                    {{ pm.percentage }}% Omset
                  </span>
                </div>
                <p class="payment-provider-sub">{{ pm.provider }}</p>
              </div>
            </div>

            <!-- Kolom Tengah: Total Diterima Box -->
            <div class="payment-row-amount-box">
              <span class="row-amount-label">Total Diterima:</span>
              <span class="row-amount-value font-mono">{{ formatRp(pm.amount) }}</span>
            </div>

            <!-- Kolom Kanan: Transaksi & Highlight Badge -->
            <div class="payment-row-stats">
              <div class="row-tx-count">
                <AppIcon name="receipt" :size="15" class="text-slate-400" />
                <span class="tx-number">{{ pm.txCount }}</span>
                <span class="tx-unit">Transaksi</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TAMPILAN 2: GRID 3 KOLOM (Card Berdampingan Horizontal, Spacing Lega) -->
        <div v-else class="payment-grid-3">
          <div
            v-for="pm in paymentBreakdown"
            :key="pm.name"
            class="payment-grid-card card-hover-lift"
            :class="pm.borderClass"
          >
            <!-- Top Row: Icon & Share Badge -->
            <div class="grid-card-top">
              <div class="stat-icon-halo" :class="pm.haloClass">
                <AppIcon :name="pm.icon" :size="22" />
              </div>
              <span class="share-badge" :class="pm.badgeClass">
                {{ pm.percentage }}% Omset
              </span>
            </div>

            <!-- Content Group: Judul, Subjudul & Kotak Nominal yang Berjarak Lega -->
            <div class="grid-card-content">
              <h4 class="grid-card-title">{{ pm.name }}</h4>
              <p class="grid-card-sub">{{ pm.provider }}</p>

              <div class="grid-card-amount-box">
                <span class="grid-amount-label">Total Diterima:</span>
                <span class="grid-amount-value font-mono">{{ formatRp(pm.amount) }}</span>
              </div>
            </div>

            <!-- Bottom Progress & TX Count: Berjarak Lega -->
            <div class="grid-card-footer">
              <span class="footer-tx-count">
                <AppIcon name="receipt" :size="14" class="text-slate-400" />
                {{ pm.txCount }} Transaksi
              </span>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- 2. KONTRIBUSI PENJUALAN PER CABANG -->
    <BaseCard :bordered="true" custom-class="outlet-contribution-card">
      <div class="card-section-header">
        <div class="card-title-group">
          <div class="flex items-center gap-2">
            <AppIcon name="store" :size="20" class="text-indigo-600" />
            <h3 class="card-section-title">Kontribusi Penjualan per Cabang</h3>
          </div>
          <p class="card-section-subtitle">
            Perbandingan omset, volume transaksi, dan rata-rata belanja (*average basket size*) antar outlet operasional
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="section-tag-pill">
            {{ outletPerformance.length }} Outlet Terdaftar
          </span>
        </div>
      </div>

      <div class="table-container-wrap">
        <div class="overflow-x-auto">
          <table class="report-data-table">
            <thead>
              <tr>
                <th class="col-outlet">Nama Cabang / Outlet</th>
                <th class="text-center">Total Transaksi</th>
                <th class="text-right">Total Omset Penjualan</th>
                <th class="text-right">Rata-rata Keranjang (Basket)</th>
                <th class="text-center">Status Operasional</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ot in outletPerformance" :key="ot.name" class="table-row-hover">
                <td class="col-outlet">
                  <div class="flex items-center gap-3">
                    <div class="outlet-icon-halo">
                      <AppIcon name="store" :size="18" />
                    </div>
                    <div>
                      <span class="font-bold text-slate-900 block text-sm">{{ ot.name }}</span>
                      <span class="text-xs text-slate-400 mt-0.5 block">{{ ot.address || 'Cabang Aktif Tenant' }}</span>
                    </div>
                  </div>
                </td>
                <td class="text-center font-mono">
                  <span class="tx-badge">{{ ot.ordersCount }} tx</span>
                </td>
                <td class="text-right font-mono font-bold text-blue-700 text-sm">
                  {{ formatRp(ot.revenue) }}
                </td>
                <td class="text-right font-mono text-xs font-semibold text-slate-600">
                  {{ formatRp(ot.avgBasket) }}
                </td>
                <td class="text-center">
                  <span class="status-badge-active">
                    <span class="status-dot"></span>
                    Operasional Aktif
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseCard>

    <!-- 3. MENU TERLARIS (TOP SELLING ITEMS) -->
    <BaseCard :bordered="true" custom-class="top-selling-card">
      <div class="card-section-header">
        <div class="card-title-group">
          <div class="flex items-center gap-2">
            <AppIcon name="package" :size="20" class="text-amber-600" />
            <h3 class="card-section-title">Menu Terlaris (Top Selling Items)</h3>
          </div>
          <p class="card-section-subtitle">
            Peringkat menu dengan volume penjualan tertinggi dan kontribusi laba terbesar pada periode terpilih
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="section-tag-pill">
            Top 5 Menu Paling Laris
          </span>
        </div>
      </div>

      <div class="table-container-wrap">
        <div class="overflow-x-auto">
          <table class="report-data-table">
            <thead>
              <tr>
                <th class="text-center col-rank"># Rank</th>
                <th class="col-menu-name">Nama Item Menu</th>
                <th>Kategori Produk</th>
                <th class="text-right">Harga Jual</th>
                <th class="text-center">Qty Terjual</th>
                <th class="text-right">Total Omset</th>
                <th class="text-right">Estimasi Laba Kotor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in topProducts" :key="item.name" class="table-row-hover">
                <td class="text-center col-rank">
                  <span
                    class="rank-badge"
                    :class="idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'rank-other'"
                  >
                    {{ idx + 1 }}
                  </span>
                </td>
                <td class="col-menu-name">
                  <div class="item-name-group">
                    <span class="item-title font-bold text-slate-900 block text-sm">{{ item.name }}</span>
                    <span class="item-sku text-xs text-slate-400 font-mono mt-1 block">SKU: {{ item.sku }}</span>
                  </div>
                </td>
                <td>
                  <span class="category-pill-table">{{ item.category }}</span>
                </td>
                <td class="text-right font-mono text-xs font-semibold text-slate-700">
                  {{ formatRp(item.price) }}
                </td>
                <td class="text-center font-mono font-bold text-blue-600 text-sm">
                  <span class="sold-qty-badge">{{ item.soldQty }} porsi</span>
                </td>
                <td class="text-right font-mono font-bold text-slate-900 text-sm">
                  {{ formatRp(item.soldQty * item.price) }}
                </td>
                <td class="text-right font-mono font-bold text-emerald-600 text-sm">
                  {{ formatRp(item.profit) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
const paymentLayoutMode = ref('horizontal')

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
    shortName: 'QRIS Digital',
    provider: 'Gopay, ShopeePay, BCA, Dana, OVO',
    amount: 27244000,
    percentage: 56,
    txCount: 524,
    icon: 'qr',
    haloClass: 'halo-blue',
    badgeClass: 'tag-blue',
    borderClass: 'border-blue-100',
    textClass: 'text-blue-600',
    colorHex: '#2563eb',
  },
  {
    name: 'Uang Tunai (Cash)',
    shortName: 'Tunai Kasir',
    provider: 'Pembayaran cash di laci kasir',
    amount: 15568000,
    percentage: 32,
    txCount: 312,
    icon: 'dollar',
    haloClass: 'halo-emerald',
    badgeClass: 'tag-emerald',
    borderClass: 'border-emerald-100',
    textClass: 'text-emerald-600',
    colorHex: '#10b981',
  },
  {
    name: 'Kartu Debit / EDC',
    shortName: 'Mesin EDC',
    provider: 'Kartu Debit Mandiri, BCA, BRI',
    amount: 5838000,
    percentage: 12,
    txCount: 112,
    icon: 'credit-card',
    haloClass: 'halo-purple',
    badgeClass: 'tag-purple',
    borderClass: 'border-purple-100',
    textClass: 'text-purple-600',
    colorHex: '#9333ea',
  }
])

const outletPerformance = ref([
  {
    name: 'Abdi Martabak — Grand Galaxy',
    address: 'Ruko Grand Galaxy City Blok RGM No. 12',
    ordersCount: 524,
    revenue: 31250000,
    avgBasket: 59637
  },
  {
    name: 'Abdi Martabak — Summarecon Mall',
    address: 'Food Temptation Lt. 2, Summarecon',
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.date-preset-pills {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
}

.pill-btn {
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
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

/* Card Section Header (Consistent across all Report modules) */
.card-section-header {
  padding: 1.35rem 1.75rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-section-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.015em;
  margin: 0;
  line-height: 1.3;
}

.card-section-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.section-tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background-color: #f1f5f9;
  color: #475569;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
  border: 1px solid #e2e8f0;
}

/* 1. Payment Methods Section Styling */
.payment-card-body {
  padding: 1.5rem 1.75rem 1.75rem;
}

.header-tools-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.layout-toggle-pills {
  display: inline-flex;
  align-items: center;
  background-color: #f1f5f9;
  padding: 3px;
  border-radius: var(--radius-full);
  border: 1px solid #e2e8f0;
}

.layout-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
  color: #64748b;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.layout-pill-btn:hover {
  color: #0f172a;
}

.layout-pill-btn.active {
  background: #ffffff;
  color: #0284c7;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.payment-summary-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  background-color: #ecfdf5;
  color: #047857;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #a7f3d0;
}

.pulse-dot-green {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #10b981;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
  100% { transform: scale(0.95); opacity: 1; }
}

.distribution-bar-wrapper {
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  background-color: #f8fafc;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
}

.distribution-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.65rem;
}

.multi-segment-bar {
  display: flex;
  height: 10px;
  width: 100%;
  border-radius: 9999px;
  overflow: hidden;
  background-color: #e2e8f0;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
}

.bar-segment {
  height: 100%;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ==========================================================================
   TAMPILAN 1: CARD DENGAN ARAH HORIZONTAL (Mendatar & Sangat Hemat Ruang)
   ========================================================================== */
.payment-horizontal-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.payment-row-card {
  padding: 1.15rem 1.5rem;
  border-radius: var(--radius-xl);
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  transition: all 0.2s ease;
}

.payment-row-card:hover {
  box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.payment-row-left {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  min-width: 320px;
  flex: 1 1 auto;
}

.payment-row-text {
  display: flex;
  flex-direction: column;
  gap: 0.35rem; /* Jarak vertikal lega & bersih antara judul dan subjudul */
}

.payment-name-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.payment-name-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
  margin: 0;
}

.payment-provider-sub {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  line-height: 1.45;
}

.payment-row-amount-box {
  background-color: #f8fafc;
  padding: 0.65rem 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 220px;
}

.row-amount-label {
  font-size: 0.725rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
}

.row-amount-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.payment-row-stats {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  justify-content: flex-end;
}

.row-tx-count {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  color: #334155;
}

.tx-number {
  font-weight: 800;
  font-family: monospace;
}

.tx-unit {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
}

.row-highlight-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background-color: #f1f5f9;
}

@media (max-width: 860px) {
  .payment-row-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .payment-row-left {
    min-width: 100%;
  }
  .payment-row-amount-box {
    width: 100%;
  }
  .payment-row-stats {
    width: 100%;
    justify-content: space-between;
  }
}

/* ==========================================================================
   TAMPILAN 2: GRID 3 KOLOM (Card Berdampingan Horizontal, Spacing Lega)
   ========================================================================== */
.payment-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

@media (max-width: 900px) {
  .payment-grid-3 {
    grid-template-columns: 1fr;
  }
}

.payment-grid-card {
  padding: 1.35rem;
  border-radius: var(--radius-xl);
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.15rem;
  transition: all 0.2s ease;
}

.payment-grid-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.grid-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.grid-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.grid-card-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
  margin: 0;
}

.grid-card-sub {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
  line-height: 1.45;
  min-height: 2.3em;
}

.grid-card-amount-box {
  background-color: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.grid-amount-label {
  font-size: 0.725rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
}

.grid-amount-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.grid-card-footer {
  padding-top: 0.85rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
}

.footer-tx-count {
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.footer-highlight-text {
  font-weight: 700;
}

.share-badge {
  font-size: 11px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  letter-spacing: 0.25px;
}

.tag-blue { background-color: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.tag-emerald { background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
.tag-purple { background-color: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; }

/* 2 & 3. Tables Styling */
.table-container-wrap {
  width: 100%;
}

.report-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.report-data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 1.75rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  white-space: nowrap;
}

.report-data-table td {
  padding: 1.15rem 1.75rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.table-row-hover:hover {
  background-color: #f8fafc;
}

.outlet-icon-halo {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-lg);
  background: #eef2ff;
  color: #4338ca;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #c7d2fe;
}

.tx-badge {
  display: inline-block;
  padding: 4px 10px;
  background-color: #f1f5f9;
  color: #334155;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 12px;
}

.status-badge-active {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10b981;
}

/* Menu Terlaris Rank Badge */
.col-rank {
  width: 80px;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 800;
}

.rank-1 {
  background: #fef08a;
  color: #854d0e;
  border: 1px solid #facc15;
  box-shadow: 0 2px 6px rgba(234, 179, 8, 0.25);
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

.col-menu-name {
  min-width: 260px;
}

.item-name-group {
  display: flex;
  flex-direction: column;
}

.category-pill-table {
  display: inline-block;
  padding: 3px 8px;
  background-color: #f1f5f9;
  color: #475569;
  border-radius: var(--radius-md);
  font-size: 11.5px;
  font-weight: 600;
}

.sold-qty-badge {
  display: inline-block;
  padding: 3px 10px;
  background-color: #eff6ff;
  color: #1d4ed8;
  border-radius: var(--radius-md);
  font-weight: 700;
  border: 1px solid #bfdbfe;
}
</style>
