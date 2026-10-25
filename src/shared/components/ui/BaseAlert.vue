<template>
  <Transition name="alert-slide">
    <div
      v-if="visible"
      :class="['base-alert', `alert-${variant}`, { 'alert-bordered': bordered }]"
      role="alert"
    >
      <!-- Icon Indicator -->
      <div class="alert-icon-wrapper">
        <AppIcon :name="resolvedIcon" :size="20" />
      </div>

      <!-- Main Message Content -->
      <div class="alert-content">
        <h4 v-if="title" class="alert-title">{{ title }}</h4>
        <div class="alert-message">
          <slot>{{ message }}</slot>
        </div>
      </div>

      <!-- Action Slot -->
      <div v-if="$slots.action" class="alert-action">
        <slot name="action" />
      </div>

      <!-- Dismiss Button -->
      <button
        v-if="dismissible"
        type="button"
        class="alert-dismiss-btn"
        aria-label="Tutup Peringatan"
        @click="dismiss"
      >
        <AppIcon name="x" :size="16" />
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppIcon from '../icons/AppIcon.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (v) => ['info', 'success', 'warning', 'danger'].includes(v)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  bordered: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['dismiss'])
const visible = ref(true)

const resolvedIcon = computed(() => {
  switch (props.variant) {
    case 'success': return 'check-circle'
    case 'warning': return 'alert-triangle'
    case 'danger': return 'alert-circle'
    case 'info':
    default:
      return 'info'
  }
})

const dismiss = () => {
  visible.value = false
  emit('dismiss')
}
</script>

<style scoped>
.base-alert {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
  transition: all var(--duration-normal) var(--ease-spring);
}

.alert-bordered {
  border-left-width: 4px;
  border-left-style: solid;
}

/* Variant 1: Info (Modern Blue) */
.alert-info {
  background-color: var(--primary-50);
  color: var(--primary-900);
  border: 1px solid var(--primary-200);
  border-left-color: var(--primary-600);
}
.alert-info .alert-icon-wrapper {
  color: var(--primary-600);
}

/* Variant 2: Success */
.alert-success {
  background-color: var(--success-50);
  color: var(--success-700);
  border: 1px solid var(--success-100);
  border-left-color: var(--success-600);
}
.alert-success .alert-icon-wrapper {
  color: var(--success-600);
}

/* Variant 3: Warning */
.alert-warning {
  background-color: var(--warning-50);
  color: #92400e;
  border: 1px solid var(--warning-100);
  border-left-color: var(--warning-500);
}
.alert-warning .alert-icon-wrapper {
  color: var(--warning-600);
}

/* Variant 4: Danger */
.alert-danger {
  background-color: var(--danger-50);
  color: var(--danger-700);
  border: 1px solid var(--danger-100);
  border-left-color: var(--danger-600);
}
.alert-danger .alert-icon-wrapper {
  color: var(--danger-600);
}

.alert-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 2px;
  letter-spacing: -0.01em;
}

.alert-message {
  font-size: 13.5px;
  opacity: 0.95;
}

.alert-action {
  margin-left: 8px;
}

.alert-dismiss-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: transparent;
  color: currentColor;
  opacity: 0.6;
  transition: opacity var(--duration-fast) ease, transform var(--duration-fast) ease;
}

.alert-dismiss-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Transitions */
.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: all var(--duration-normal) var(--ease-spring);
}

.alert-slide-enter-from,
.alert-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
