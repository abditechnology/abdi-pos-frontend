<template>
  <span
    :class="[
      'base-badge',
      `badge-${variant}`,
      `badge-${size}`,
      { 'badge-pill': pill }
    ]"
  >
    <!-- Animative Pulsing Indicator Dot -->
    <span v-if="dot" class="badge-dot-container">
      <span class="badge-dot" :class="{ 'badge-dot-pulse': pulse }" />
    </span>

    <!-- Leading Icon -->
    <span v-if="$slots.icon" class="badge-icon">
      <slot name="icon" />
    </span>

    <!-- Badge Text -->
    <span class="badge-text">
      <slot />
    </span>
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'neutral',
    validator: (v) => ['neutral', 'primary', 'success', 'warning', 'danger', 'info', 'purple'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (s) => ['sm', 'md'].includes(s)
  },
  dot: {
    type: Boolean,
    default: false
  },
  pulse: {
    type: Boolean,
    default: false
  },
  pill: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  letter-spacing: -0.01em;
  transition: all var(--duration-fast) ease;
}

/* Sizing */
.badge-sm {
  padding: 4px 8px;
  font-size: 11px;
}
.badge-md {
  padding: 5px 10px;
  font-size: 12px;
}

.badge-pill {
  border-radius: var(--radius-full);
}

/* Color Variants */
/* 1. Primary (Blue) */
.badge-primary {
  background-color: var(--primary-50);
  color: var(--primary-700);
  border: 1px solid var(--primary-200);
}
.badge-primary .badge-dot { background-color: var(--primary-600); }

/* 2. Success */
.badge-success {
  background-color: var(--success-50);
  color: var(--success-700);
  border: 1px solid var(--success-100);
}
.badge-success .badge-dot { background-color: var(--success-600); }

/* 3. Warning */
.badge-warning {
  background-color: var(--warning-50);
  color: #b45309;
  border: 1px solid var(--warning-100);
}
.badge-warning .badge-dot { background-color: var(--warning-500); }

/* 4. Danger */
.badge-danger {
  background-color: var(--danger-50);
  color: var(--danger-700);
  border: 1px solid var(--danger-100);
}
.badge-danger .badge-dot { background-color: var(--danger-600); }

/* 5. Info */
.badge-info {
  background-color: var(--info-50);
  color: var(--info-600);
  border: 1px solid var(--info-100);
}
.badge-info .badge-dot { background-color: var(--info-500); }

/* 6. Purple */
.badge-purple {
  background-color: var(--purple-50);
  color: var(--purple-600);
  border: 1px solid var(--purple-100);
}
.badge-purple .badge-dot { background-color: var(--purple-500); }

/* 7. Neutral */
.badge-neutral {
  background-color: var(--slate-100);
  color: var(--slate-700);
  border: 1px solid var(--slate-200);
}
.badge-neutral .badge-dot { background-color: var(--slate-500); }

/* Dot Indicator */
.badge-dot-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
}

.badge-dot-pulse {
  animation: pulseDot 2s infinite ease-in-out;
}

.badge-icon {
  display: inline-flex;
  align-items: center;
}
</style>
