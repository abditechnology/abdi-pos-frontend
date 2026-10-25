<template>
  <BaseModal
    :model-value="modelValue"
    size="sm"
    :show-close="!loading"
    :close-on-backdrop="!loading"
    :close-on-escape="!loading"
    @update:model-value="val => $emit('update:modelValue', val)"
    @close="$emit('cancel')"
  >
    <div class="confirm-content">
      <!-- Animated Status Icon with Pulsing Halo -->
      <div :class="['icon-halo', `halo-${variant}`]">
        <div class="icon-inner">
          <AppIcon :name="resolvedIcon" :size="28" />
        </div>
      </div>

      <!-- Action Title & Description -->
      <h3 class="confirm-title">{{ title }}</h3>
      <p class="confirm-message">{{ message }}</p>

      <div v-if="$slots.details" class="confirm-details">
        <slot name="details" />
      </div>
    </div>

    <template #footer>
      <div class="confirm-actions">
        <BaseButton
          variant="ghost"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelText }}
        </BaseButton>

        <BaseButton
          :variant="confirmButtonVariant"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from '../icons/AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Konfirmasi Tindakan'
  },
  message: {
    type: String,
    default: 'Apakah Anda yakin ingin melanjutkan tindakan ini? Data yang diubah mungkin tidak dapat dikembalikan.'
  },
  variant: {
    type: String,
    default: 'danger',
    validator: (v) => ['danger', 'warning', 'info', 'primary'].includes(v)
  },
  confirmText: {
    type: String,
    default: 'Ya, Lanjutkan'
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const resolvedIcon = computed(() => {
  if (props.variant === 'danger') return 'alert-circle'
  if (props.variant === 'warning') return 'alert-triangle'
  if (props.variant === 'info') return 'info'
  return 'shield'
})

const confirmButtonVariant = computed(() => {
  if (props.variant === 'danger') return 'danger'
  if (props.variant === 'warning') return 'primary'
  return 'primary'
})

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.confirm-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px 0 16px 0;
}

/* Glowing Pulsing Icon Ring */
.icon-halo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  margin-bottom: 20px;
  transition: transform var(--duration-normal) var(--ease-spring);
}

.icon-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
}

/* Danger Variant Halo */
.halo-danger {
  background-color: var(--danger-50);
}
.halo-danger .icon-inner {
  background-color: var(--danger-100);
  color: var(--danger-600);
  box-shadow: 0 0 0 6px var(--danger-50);
}

/* Warning Variant Halo */
.halo-warning {
  background-color: var(--warning-50);
}
.halo-warning .icon-inner {
  background-color: var(--warning-100);
  color: var(--warning-600);
  box-shadow: 0 0 0 6px var(--warning-50);
}

/* Info Variant Halo */
.halo-info {
  background-color: var(--primary-50);
}
.halo-info .icon-inner {
  background-color: var(--primary-100);
  color: var(--primary-600);
  box-shadow: 0 0 0 6px var(--primary-50);
}

.confirm-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}

.confirm-message {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 320px;
}

.confirm-details {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background-color: var(--slate-50);
  border-radius: var(--radius-md);
  border: 1px dashed var(--slate-200);
}

.confirm-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}
</style>
