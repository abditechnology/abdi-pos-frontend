<template>
  <div class="quick-actions-bar">
    <button
      v-for="action in actions"
      :key="action.id"
      type="button"
      :class="['action-card', `theme-${action.theme}`, 'card-hover-lift']"
      @click="$emit('action-click', action.id)"
    >
      <div class="action-icon">
        <AppIcon :name="action.icon" :size="20" />
      </div>

      <div class="action-text">
        <span class="action-title">{{ action.title }}</span>
        <span class="action-desc">{{ action.desc }}</span>
      </div>

      <div class="action-arrow">
        <AppIcon name="chevron-right" :size="16" />
      </div>
    </button>
  </div>
</template>

<script setup>
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

defineEmits(['action-click'])

const actions = [
  {
    id: 'open-pos',
    title: 'Buka POS / Kasir',
    desc: 'Input transaksi baru & scan barcode',
    icon: 'pos',
    theme: 'primary'
  },
  {
    id: 'add-product',
    title: 'Tambah Produk',
    desc: 'Daftarkan menu atau varian baru',
    icon: 'plus',
    theme: 'blue'
  },
  {
    id: 'close-shift',
    title: 'Tutup Shift Kasir',
    desc: 'Rekap uang fisik & hitung selisih',
    icon: 'clock',
    theme: 'amber'
  },
  {
    id: 'open-demo',
    title: 'Demo Komponen UI',
    desc: 'Tes modal, alert, button & toast',
    icon: 'sparkles',
    theme: 'purple'
  }
]
</script>

<style scoped>
.quick-actions-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-app);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  text-align: left;
  transition: all var(--duration-fast) var(--ease-spring);
}

.action-card:active {
  transform: scale(0.98);
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
  transition: transform var(--duration-fast) ease;
}

.action-card:hover .action-icon {
  transform: scale(1.1);
}

/* Theme: Primary */
.theme-primary .action-icon {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}

/* Theme: Blue */
.theme-blue .action-icon {
  background-color: var(--primary-50);
  color: var(--primary-600);
}

/* Theme: Amber */
.theme-amber .action-icon {
  background-color: var(--warning-50);
  color: var(--warning-600);
}

/* Theme: Purple */
.theme-purple .action-icon {
  background-color: var(--purple-50);
  color: var(--purple-600);
}

.action-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.action-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.action-desc {
  font-size: 11.5px;
  color: var(--text-muted);
  margin-top: 1px;
}

.action-arrow {
  color: var(--slate-300);
  transition: transform var(--duration-fast) ease, color var(--duration-fast) ease;
}

.action-card:hover .action-arrow {
  color: var(--primary-600);
  transform: translateX(3px);
}

@media (max-width: 1100px) {
  .quick-actions-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .quick-actions-bar {
    grid-template-columns: 1fr;
  }
}
</style>
