<template>
  <Teleport to="body">
    <div class="toast-viewport" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast-card', `toast-${toast.type}`]"
          role="status"
        >
          <!-- Icon -->
          <div class="toast-icon">
            <AppIcon :name="getIcon(toast.type)" :size="20" />
          </div>

          <!-- Content -->
          <div class="toast-content">
            <h5 v-if="toast.title" class="toast-title">{{ toast.title }}</h5>
            <p class="toast-message">{{ toast.message }}</p>
          </div>

          <!-- Close Button -->
          <button
            type="button"
            class="toast-close"
            aria-label="Tutup notifikasi"
            @click="remove(toast.id)"
          >
            <AppIcon name="x" :size="14" />
          </button>

          <!-- Animated Progress countdown line -->
          <div
            v-if="toast.duration > 0"
            class="toast-progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../../composables/useToast'
import AppIcon from '../icons/AppIcon.vue'

const { toasts, remove } = useToast()

const getIcon = (type) => {
  switch (type) {
    case 'success': return 'check-circle'
    case 'error': return 'alert-circle'
    case 'warning': return 'alert-triangle'
    case 'info':
    default:
      return 'info'
  }
}
</script>

<style scoped>
.toast-viewport {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  max-width: 380px;
  width: calc(100vw - 48px);
}

.toast-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  background-color: var(--bg-surface);
  border: 1px solid var(--border-app);
  box-shadow: var(--shadow-lg), 0 4px 16px rgba(15, 23, 42, 0.08);
  pointer-events: auto;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-spring);
}

/* Toast Color Highlights */
.toast-success {
  border-left: 4px solid var(--success-500);
}
.toast-success .toast-icon { color: var(--success-600); }
.toast-success .toast-progress { background-color: var(--success-500); }

.toast-error {
  border-left: 4px solid var(--danger-500);
}
.toast-error .toast-icon { color: var(--danger-600); }
.toast-error .toast-progress { background-color: var(--danger-500); }

.toast-warning {
  border-left: 4px solid var(--warning-500);
}
.toast-warning .toast-icon { color: var(--warning-600); }
.toast-warning .toast-progress { background-color: var(--warning-500); }

.toast-info {
  border-left: 4px solid var(--primary-600);
}
.toast-info .toast-icon { color: var(--primary-600); }
.toast-info .toast-progress { background-color: var(--primary-600); }

.toast-icon {
  margin-top: 1px;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 2px;
}

.toast-message {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.toast-close {
  color: var(--slate-400);
  padding: 4px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) ease;
}

.toast-close:hover {
  color: var(--slate-700);
  background-color: var(--slate-100);
}

/* Progress bar at the bottom */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  animation: toastProgress linear forwards;
}

@keyframes toastProgress {
  from { width: 100%; }
  to { width: 0%; }
}

/* Transitions */
.toast-list-enter-active {
  animation: slideInRight var(--duration-normal) var(--ease-spring);
}

.toast-list-leave-active {
  transition: all var(--duration-fast) ease;
  position: absolute;
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.toast-list-move {
  transition: transform var(--duration-normal) var(--ease-spring);
}
</style>
