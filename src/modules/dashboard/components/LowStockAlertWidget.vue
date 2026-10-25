<template>
  <div class="low-stock-widget base-card card-bordered card-hover-lift">
    <div class="widget-header">
      <div class="title-meta">
        <div class="header-icon-box">
          <AppIcon name="alert-triangle" :size="20" />
        </div>
        <div>
          <h3 class="widget-title">Peringatan Stok Menipis</h3>
          <p class="widget-subtitle">Bahan & item di bawah batas minimum cabang</p>
        </div>
      </div>

      <span class="warning-count-pill">{{ items.length }} Item Kritis</span>
    </div>

    <div class="items-list">
      <div
        v-for="item in items"
        :key="item.id"
        class="stock-row"
      >
        <div class="stock-info">
          <span class="stock-item-name">{{ item.name }}</span>
          <span class="stock-category">{{ item.category }} • SKU: {{ item.sku }}</span>
        </div>

        <div class="stock-status-group">
          <div class="stock-counter">
            <span class="stock-remaining">{{ item.currentStock }} {{ item.unit }}</span>
            <span class="stock-min">Min: {{ item.minStock }} {{ item.unit }}</span>
          </div>

          <BaseBadge
            :variant="item.isCritical ? 'danger' : 'warning'"
            size="sm"
            :dot="true"
            :pulse="item.isCritical"
          >
            {{ item.isCritical ? 'Kritis' : 'Menipis' }}
          </BaseBadge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'
import BaseBadge from '../../../shared/components/ui/BaseBadge.vue'

const items = ref([
  {
    id: 1,
    name: 'Tepung Terigu Segitiga Biru 25kg',
    sku: 'BHP-TRG-01',
    category: 'Bahan Baku',
    currentStock: 3,
    minStock: 10,
    unit: 'Sak',
    isCritical: true
  },
  {
    id: 2,
    name: 'Keju Cheddar Olahan Prochiz 2kg',
    sku: 'BHP-KEJ-04',
    category: 'Bahan Topping',
    currentStock: 4,
    minStock: 12,
    unit: 'Blok',
    isCritical: true
  },
  {
    id: 3,
    name: 'Coklat Butir / Ceres Meises Super',
    sku: 'BHP-MSS-02',
    category: 'Bahan Topping',
    currentStock: 6,
    minStock: 15,
    unit: 'Kg',
    isCritical: false
  },
  {
    id: 4,
    name: 'Kotak Dus Martabak Jumbo Ekstra',
    sku: 'PKG-BOX-01',
    category: 'Packaging',
    currentStock: 45,
    minStock: 150,
    unit: 'Pcs',
    isCritical: false
  }
])
</script>

<style scoped>
.low-stock-widget {
  background-color: var(--bg-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--slate-100);
}

.title-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon-box {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background-color: var(--warning-50);
  color: var(--warning-600);
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

.warning-count-pill {
  font-size: 11px;
  font-weight: 700;
  background-color: var(--danger-50);
  color: var(--danger-600);
  padding: 4px 8px;
  border-radius: var(--radius-full);
  border: 1px solid var(--danger-100);
}

.items-list {
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
}

.stock-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--slate-100);
}

.stock-row:last-child {
  border-bottom: none;
}

.stock-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stock-item-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-main);
}

.stock-category {
  font-size: 11.5px;
  color: var(--text-muted);
}

.stock-status-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stock-counter {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stock-remaining {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--danger-600);
}

.stock-min {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
