<template>
  <span :class="['money-display', `money-${size}`, `money-${variant}`]">
    <span class="currency-prefix">{{ prefix }}</span>
    <span class="currency-amount">{{ formattedAmount }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  amount: {
    type: [Number, String],
    default: 0
  },
  prefix: {
    type: String,
    default: 'Rp '
  },
  size: {
    type: String,
    default: 'md',
    validator: (s) => ['sm', 'md', 'lg', 'xl'].includes(s)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'primary', 'success', 'danger'].includes(v)
  }
})

const formattedAmount = computed(() => {
  const num = Number(props.amount) || 0
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0
  }).format(num)
})
</script>

<style scoped>
.money-display {
  display: inline-flex;
  align-items: baseline;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.currency-prefix {
  font-size: 0.8em;
  font-weight: 600;
  margin-right: 2px;
  opacity: 0.85;
}

/* Sizing */
.money-sm { font-size: 13px; }
.money-md { font-size: 15px; }
.money-lg { font-size: 20px; }
.money-xl { font-size: 28px; }

/* Colors */
.money-default { color: var(--text-main); }
.money-primary { color: var(--primary-600); }
.money-success { color: var(--success-600); }
.money-danger { color: var(--danger-600); }
</style>
