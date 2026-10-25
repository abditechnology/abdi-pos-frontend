<template>
  <button
    :type="type"
    :class="[
      'base-button',
      `btn-${variant}`,
      `btn-${size}`,
      {
        'btn-loading': loading,
        'btn-block': block,
        'btn-icon-only': iconOnly
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loading Spinner Icon -->
    <span v-if="loading" class="spinner-container">
      <svg class="spinner" viewBox="0 0 24 24" fill="none">
        <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
        <path class="spinner-arc" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </span>

    <!-- Leading Icon Slot -->
    <span v-if="$slots.icon && !loading" class="btn-icon leading-icon">
      <slot name="icon" />
    </span>

    <!-- Button Text / Main Slot -->
    <span v-if="!iconOnly" class="btn-content" :class="{ 'btn-invisible': loading }">
      <slot />
    </span>

    <!-- Trailing Icon Slot -->
    <span v-if="$slots.trailingIcon && !loading" class="btn-icon trailing-icon">
      <slot name="trailingIcon" />
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (s) => ['sm', 'md', 'lg'].includes(s)
  },
  type: {
    type: String,
    default: 'button'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (e) => {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>

<style scoped>
.base-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: all var(--duration-fast) var(--ease-spring);
  outline: none;
  overflow: hidden;
}

/* Micro-interaction: Active Scale down */
.base-button:active:not(:disabled) {
  transform: scale(0.97);
}

.base-button:focus-visible {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.4);
}

/* Sizing Variants */
.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
  height: 32px;
}
.btn-sm.btn-icon-only {
  width: 32px;
  padding: 0;
}

.btn-md {
  padding: 8px 16px;
  font-size: 14px;
  height: 40px;
}
.btn-md.btn-icon-only {
  width: 40px;
  padding: 0;
}

.btn-lg {
  padding: 12px 24px;
  font-size: 15px;
  height: 48px;
  border-radius: var(--radius-lg);
}
.btn-lg.btn-icon-only {
  width: 48px;
  padding: 0;
}

.btn-block {
  width: 100%;
}

/* Color Variants */
/* 1. Primary - Royal Blue */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
  color: #ffffff;
  border: 1px solid var(--primary-700);
  box-shadow: var(--shadow-sm), 0 2px 8px rgba(37, 99, 235, 0.25);
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  box-shadow: var(--shadow-md), var(--shadow-blue-glow);
  transform: translateY(-1px);
}

/* 2. Secondary - Soft Light Blue */
.btn-secondary {
  background-color: var(--primary-50);
  color: var(--primary-700);
  border: 1px solid var(--primary-200);
}
.btn-secondary:hover:not(:disabled) {
  background-color: var(--primary-100);
  color: var(--primary-800);
  border-color: var(--primary-300);
  transform: translateY(-1px);
}

/* 3. Outline */
.btn-outline {
  background-color: transparent;
  color: var(--primary-600);
  border: 1.5px solid var(--primary-400);
}
.btn-outline:hover:not(:disabled) {
  background-color: var(--primary-50);
  border-color: var(--primary-600);
  color: var(--primary-700);
}

/* 4. Ghost */
.btn-ghost {
  background-color: transparent;
  color: var(--slate-600);
  border: 1px solid transparent;
}
.btn-ghost:hover:not(:disabled) {
  background-color: var(--slate-100);
  color: var(--text-main);
}

/* 5. Danger */
.btn-danger {
  background: linear-gradient(135deg, var(--danger-500) 0%, var(--danger-600) 100%);
  color: #ffffff;
  border: 1px solid var(--danger-700);
  box-shadow: var(--shadow-sm);
}
.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #f87171 0%, var(--danger-500) 100%);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
  transform: translateY(-1px);
}

/* 6. Success */
.btn-success {
  background: linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%);
  color: #ffffff;
  border: 1px solid var(--success-700);
  box-shadow: var(--shadow-sm);
}
.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #34d399 0%, var(--success-500) 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
  transform: translateY(-1px);
}

/* Disabled State */
.base-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Spinner */
.spinner-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spinner {
  width: 18px;
  height: 18px;
  animation: spin 0.8s linear infinite;
}
.spinner-track {
  opacity: 0.25;
}
.spinner-arc {
  opacity: 0.9;
}
.btn-invisible {
  visibility: hidden;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
}
</style>
