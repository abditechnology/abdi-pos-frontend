<template>
  <div class="top-products-widget base-card card-bordered card-hover-lift">
    <div class="widget-header">
      <div class="header-titles">
        <div class="header-icon-box">
          <AppIcon name="package" :size="20" />
        </div>
        <div>
          <h3 class="widget-title">Menu Terlaris (Top Selling)</h3>
          <p class="widget-subtitle">Produk dengan volume penjualan tertinggi</p>
        </div>
      </div>
    </div>

    <div class="products-list">
      <div
        v-for="(product, idx) in products"
        :key="product.id"
        class="product-item"
      >
        <!-- Rank Medal Badge -->
        <div :class="['rank-badge', `rank-${idx + 1}`]">
          {{ idx + 1 }}
        </div>

        <!-- Product Details -->
        <div class="product-details">
          <div class="product-top-row">
            <span class="product-name">{{ product.name }}</span>
            <span class="product-revenue">Rp {{ formatNumber(product.revenue) }}</span>
          </div>

          <div class="product-meta-row">
            <span class="product-category">{{ product.category }}</span>
            <span class="product-sold">{{ product.soldCount }} Terjual</span>
          </div>

          <!-- Animated Progress Bar -->
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: `${(product.soldCount / maxSold) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const products = [
  {
    id: 1,
    name: 'Terang Bulan Spesial Coklat Keju',
    category: 'Terang Bulan',
    soldCount: 84,
    revenue: 3360000
  },
  {
    id: 2,
    name: 'Martabak Telur Bebek Double Daging',
    category: 'Martabak Telur',
    soldCount: 68,
    revenue: 3060000
  },
  {
    id: 3,
    name: 'Terang Bulan Red Velvet Cream Cheese',
    category: 'Terang Bulan',
    soldCount: 52,
    revenue: 2600000
  },
  {
    id: 4,
    name: 'Martabak Tipis Kering (Tipker) Coklat',
    category: 'Martabak Kering',
    soldCount: 45,
    revenue: 1125000
  },
  {
    id: 5,
    name: 'Es Teh Manis Jumbo Nusantara',
    category: 'Minuman',
    soldCount: 110,
    revenue: 660000
  }
]

const maxSold = computed(() => {
  return Math.max(...products.map(p => p.soldCount), 1)
})

const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>

<style scoped>
.top-products-widget {
  background-color: var(--bg-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.widget-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--slate-100);
}

.header-titles {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon-box {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background-color: var(--primary-50);
  color: var(--primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
}

.widget-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.widget-subtitle {
  font-size: 12.5px;
  color: var(--text-muted);
}

.products-list {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 0;
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.rank-1 {
  background: linear-gradient(135deg, #fef08a 0%, #eab308 100%);
  color: #713f12;
  box-shadow: 0 2px 6px rgba(234, 179, 8, 0.4);
}

.rank-2 {
  background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%);
  color: #334155;
  box-shadow: 0 2px 6px rgba(148, 163, 184, 0.4);
}

.rank-3 {
  background: linear-gradient(135deg, #fed7aa 0%, #ea580c 100%);
  color: #7c2d12;
  box-shadow: 0 2px 6px rgba(234, 88, 12, 0.4);
}

.rank-4, .rank-5 {
  background-color: var(--slate-100);
  color: var(--slate-500);
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-name {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-main);
}

.product-revenue {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--primary-700);
}

.product-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11.5px;
  color: var(--text-muted);
}

.product-category {
  background-color: var(--slate-100);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
}

.progress-track {
  width: 100%;
  height: 6px;
  background-color: var(--slate-100);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-500) 0%, var(--primary-600) 100%);
  border-radius: var(--radius-full);
  transition: width 1s var(--ease-spring);
}
</style>
