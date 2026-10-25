<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.self="handleBackdropClick"
        @keydown.esc="handleEscape"
      >
        <div
          :class="['modal-container', `modal-${size}`, customClass]"
          ref="modalRef"
          tabindex="-1"
        >
          <!-- Modal Header -->
          <header v-if="$slots.header || title" class="modal-header">
            <slot name="header">
              <div class="header-titles">
                <h3 :id="titleId" class="modal-title">{{ title }}</h3>
                <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
              </div>
            </slot>

            <button
              v-if="showClose"
              type="button"
              class="modal-close-btn"
              aria-label="Tutup Modal"
              @click="close"
            >
              <AppIcon name="x" :size="18" />
            </button>
          </header>

          <!-- Modal Body Content -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Modal Footer -->
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" :close="close" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import AppIcon from '../icons/AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (s) => ['sm', 'md', 'lg', 'xl', 'full'].includes(s)
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'open'])

const modalRef = ref(null)
const titleId = `modal-title-${Math.random().toString(36).substring(2, 9)}`

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

const handleEscape = (e) => {
  if (props.closeOnEscape && props.modelValue) {
    e.stopPropagation()
    close()
  }
}

// Global ESC key listener & body scroll lock
const onKeyDown = (e) => {
  if (e.key === 'Escape' && props.modelValue && props.closeOnEscape) {
    close()
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
      emit('open')
      nextTick(() => {
        if (modalRef.value) {
          modalRef.value.focus()
        }
      })
    } else {
      document.body.style.overflow = ''
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  if (props.modelValue) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Backdrop overlay with blur */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: rgba(11, 21, 40, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Modal Dialog Card */
.modal-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 90vh;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-app);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl), 0 0 0 1px rgba(255, 255, 255, 0.2);
  outline: none;
  overflow: hidden;
}

/* Size Variants */
.modal-sm { max-width: 420px; }
.modal-md { max-width: 560px; }
.modal-lg { max-width: 780px; }
.modal-xl { max-width: 1020px; }
.modal-full {
  max-width: calc(100vw - 40px);
  height: calc(100vh - 40px);
}

/* Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--slate-100);
  background: linear-gradient(180deg, #ffffff 0%, var(--slate-50) 100%);
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

.modal-subtitle {
  font-size: 13px;
  color: var(--text-muted);
}

.modal-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  color: var(--slate-400);
  background-color: transparent;
  transition: all var(--duration-fast) ease;
}

.modal-close-btn:hover {
  background-color: var(--slate-100);
  color: var(--slate-700);
  transform: rotate(90deg);
}

/* Body */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

/* Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background-color: var(--slate-50);
  border-top: 1px solid var(--slate-100);
}

/* Vue Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity var(--duration-normal) var(--ease-spring);
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform var(--duration-normal) var(--ease-spring), opacity var(--duration-normal) var(--ease-spring);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container {
  opacity: 0;
  transform: scale(0.92) translateY(14px);
}

.modal-fade-leave-to .modal-container {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
