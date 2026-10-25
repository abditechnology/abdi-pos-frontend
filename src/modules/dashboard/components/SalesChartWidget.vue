<template>
  <div class="sales-chart-widget base-card card-bordered card-hover-lift">
    <!-- Header -->
    <div class="chart-header">
      <div class="header-titles">
        <div class="title-row">
          <div class="icon-wrap">
            <AppIcon name="chart" :size="20" />
          </div>
          <h3 class="chart-title">Tren Penjualan & Transaksi</h3>
        </div>
        <p class="chart-subtitle">Ringkasan grafik omset berdasarkan waktu operasional kasir</p>
      </div>

      <!-- Time Period Switcher Pills -->
      <div class="period-switcher">
        <button
          v-for="period in periods"
          :key="period.key"
          type="button"
          :class="['period-btn', { 'is-active': activePeriod === period.key }]"
          @click="activePeriod = period.key"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Chart Body & SVG Bars -->
    <div class="chart-container">
      <div class="chart-meta-summary">
        <div class="summary-metric">
          <span class="metric-label">Total Omset Periode Ini</span>
          <span class="metric-value">Rp {{ formatNumber(currentTotalRevenue) }}</span>
        </div>
        <div class="summary-metric">
          <span class="metric-label">Total Struk Transaksi</span>
          <span class="metric-value">{{ currentTotalTrx }} Struk</span>
        </div>
      </div>

      <!-- SVG Bar & Line Canvas -->
      <div class="svg-wrapper">
        <svg
          class="chart-svg"
          viewBox="0 0 700 220"
          preserveAspectRatio="none"
        >
          <!-- Horizontal Grid Lines -->
          <line x1="0" y1="40" x2="700" y2="40" stroke="#f1f5f9" stroke-dasharray="4" />
          <line x1="0" y1="90" x2="700" y2="90" stroke="#f1f5f9" stroke-dasharray="4" />
          <line x1="0" y1="140" x2="700" y2="140" stroke="#f1f5f9" stroke-dasharray="4" />
          <line x1="0" y1="190" x2="700" y2="190" stroke="#e2e8f0" />

          <!-- Dynamic Animated Bars -->
          <g
            v-for="(point, idx) in chartPoints"
            :key="idx"
            class="bar-group"
            @mouseenter="hoveredIndex = idx"
            @mouseleave="hoveredIndex = null"
          >
            <!-- Background hover track -->
            <rect
              :x="getBarX(idx) - 8"
              y="20"
              width="44"
              height="170"
              rx="6"
              fill="transparent"
              class="bar-track"
            />

            <!-- Filled Gradient Bar -->
            <rect
              :x="getBarX(idx)"
              :y="190 - getBarHeight(point.amount)"
              width="28"
              :height="getBarHeight(point.amount)"
              rx="6"
              :class="['svg-bar', { 'is-hovered': hoveredIndex === idx }]"
            />

            <!-- Value tooltip dot -->
            <circle
              v-if="hoveredIndex === idx"
              :cx="getBarX(idx) + 14"
              :cy="190 - getBarHeight(point.amount)"
              r="5"
              fill="#ffffff"
              stroke="#2563eb"
              stroke-width="3"
            />
          </g>
        </svg>

        <!-- Dynamic Tooltip -->
        <Transition name="tooltip-fade">
          <div
            v-if="hoveredIndex !== null && chartPoints[hoveredIndex]"
            class="interactive-tooltip"
            :style="{ left: `${(hoveredIndex / (chartPoints.length - 1)) * 85 + 5}%` }"
          >
            <div class="tooltip-time">{{ chartPoints[hoveredIndex].label }}</div>
            <div class="tooltip-revenue">Rp {{ formatNumber(chartPoints[hoveredIndex].amount) }}</div>
            <div class="tooltip-trx">{{ chartPoints[hoveredIndex].trx }} Transaksi</div>
          </div>
        </Transition>
      </div>

      <!-- X-Axis Labels -->
      <div class="chart-labels">
        <span
          v-for="(point, idx) in chartPoints"
          :key="idx"
          :class="['axis-label', { 'is-active': hoveredIndex === idx }]"
        >
          {{ point.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const activePeriod = ref('today')
const hoveredIndex = ref(null)

const periods = [
  { key: 'today', label: 'Hari Ini' },
  { key: 'week', label: '7 Hari Terakhir' },
  { key: 'month', label: 'Bulan Ini' }
]

// Mock trend dataset per period
const dataByPeriod = {
  today: [
    { label: '08:00', amount: 450000, trx: 8 },
    { label: '10:00', amount: 1250000, trx: 19 },
    { label: '12:00', amount: 2800000, trx: 35 },
    { label: '14:00', amount: 1950000, trx: 24 },
    { label: '16:00', amount: 3100000, trx: 41 },
    { label: '18:00', amount: 4650000, trx: 58 },
    { label: '20:00', amount: 5400000, trx: 64 },
    { label: '22:00', amount: 2100000, trx: 22 }
  ],
  week: [
    { label: 'Sen', amount: 12400000, trx: 145 },
    { label: 'Sel', amount: 14800000, trx: 168 },
    { label: 'Rab', amount: 13900000, trx: 152 },
    { label: 'Kam', amount: 16200000, trx: 180 },
    { label: 'Jum', amount: 21500000, trx: 240 },
    { label: 'Sab', amount: 28400000, trx: 310 },
    { label: 'Min', amount: 26800000, trx: 295 }
  ],
  month: [
    { label: 'Mgg 1', amount: 98000000, trx: 1120 },
    { label: 'Mgg 2', amount: 114000000, trx: 1280 },
    { label: 'Mgg 3', amount: 128000000, trx: 1420 },
    { label: 'Mgg 4', amount: 142000000, trx: 1590 }
  ]
}

const chartPoints = computed(() => {
  return dataByPeriod[activePeriod.value] || []
})

const maxAmount = computed(() => {
  const amounts = chartPoints.value.map(p => p.amount)
  return Math.max(...amounts, 1)
})

const currentTotalRevenue = computed(() => {
  return chartPoints.value.reduce((acc, p) => acc + p.amount, 0)
})

const currentTotalTrx = computed(() => {
  return chartPoints.value.reduce((acc, p) => acc + p.trx, 0)
})

const getBarX = (idx) => {
  const total = chartPoints.value.length
  const step = 660 / (total - 1 || 1)
  return 20 + idx * step - 14
}

const getBarHeight = (amount) => {
  const ratio = amount / maxAmount.value
  return Math.max(ratio * 150, 10)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>

<style scoped>
.sales-chart-widget {
  background-color: var(--bg-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--slate-100);
  flex-wrap: wrap;
  gap: 16px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background-color: var(--primary-50);
  color: var(--primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.chart-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.period-switcher {
  display: flex;
  align-items: center;
  background-color: var(--slate-100);
  padding: 3px;
  border-radius: var(--radius-lg);
}

.period-btn {
  padding: 6px 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--slate-600);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) ease;
}

.period-btn.is-active {
  background-color: #ffffff;
  color: var(--primary-600);
  box-shadow: var(--shadow-sm);
}

.chart-container {
  padding: 22px 24px;
}

.chart-meta-summary {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 18px;
}

.summary-metric {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.metric-value {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

.svg-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
}

.chart-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.svg-bar {
  fill: #93c5fd;
  transition: all var(--duration-normal) var(--ease-spring);
  cursor: pointer;
}

.svg-bar.is-hovered {
  fill: var(--primary-600);
  filter: drop-shadow(0 4px 10px rgba(37, 99, 235, 0.4));
}

.bar-track:hover {
  fill: rgba(239, 246, 255, 0.8);
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 10px;
}

.axis-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--slate-400);
  transition: color var(--duration-fast) ease;
}

.axis-label.is-active {
  color: var(--primary-600);
  font-weight: 700;
}

.interactive-tooltip {
  position: absolute;
  top: 10px;
  transform: translateX(-50%);
  background-color: var(--navy-950);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  pointer-events: none;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  z-index: 20;
}

.tooltip-time {
  font-weight: 700;
  color: var(--primary-300);
  margin-bottom: 2px;
}

.tooltip-revenue {
  font-weight: 800;
  font-size: 13px;
}

.tooltip-trx {
  color: var(--slate-400);
  font-size: 11px;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
