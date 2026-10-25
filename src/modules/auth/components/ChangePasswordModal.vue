<template>
  <BaseModal
    :model-value="modelValue"
    title="Ganti Kata Sandi Akun"
    subtitle="Pastikan akun Anda tetap aman dengan menggunakan kata sandi yang kuat"
    size="md"
    @update:model-value="val => $emit('update:modelValue', val)"
    @close="resetForm"
  >
    <form @submit.prevent="handleSubmit" class="change-password-form">
      <!-- Current Password -->
      <div class="password-field-group">
        <BaseInput
          v-model="form.currentPassword"
          :type="showCurrent ? 'text' : 'password'"
          label="Kata Sandi Saat Ini"
          placeholder="Masukkan kata sandi lama"
          :required="true"
          :error="errors.currentPassword"
        >
          <template #prefix><AppIcon name="lock" :size="16" /></template>
          <template #suffix>
            <button
              type="button"
              class="eye-toggle-btn"
              tabindex="-1"
              @click="showCurrent = !showCurrent"
              aria-label="Tampilkan sandi"
            >
              <AppIcon :name="showCurrent ? 'eye-off' : 'eye'" :size="16" />
            </button>
          </template>
        </BaseInput>
      </div>

      <!-- New Password -->
      <div class="password-field-group">
        <BaseInput
          v-model="form.newPassword"
          :type="showNew ? 'text' : 'password'"
          label="Kata Sandi Baru"
          placeholder="Minimal 8 karakter unik"
          :required="true"
          :error="errors.newPassword"
        >
          <template #prefix><AppIcon name="key" :size="16" /></template>
          <template #suffix>
            <button
              type="button"
              class="eye-toggle-btn"
              tabindex="-1"
              @click="showNew = !showNew"
              aria-label="Tampilkan sandi"
            >
              <AppIcon :name="showNew ? 'eye-off' : 'eye'" :size="16" />
            </button>
          </template>
        </BaseInput>

        <!-- Password Strength Meter -->
        <div v-if="form.newPassword" class="strength-meter-wrap">
          <div class="meter-bar-track">
            <div
              :class="['meter-bar-fill', strengthClass]"
              :style="{ width: `${strengthPercentage}%` }"
            />
          </div>
          <div class="meter-labels">
            <span class="meter-score-text">Kekuatan: <strong>{{ strengthLabel }}</strong></span>
          </div>
        </div>

        <!-- Requirements checklist -->
        <div class="requirements-box">
          <div :class="['req-item', { 'is-valid': hasMinLength }]">
            <AppIcon :name="hasMinLength ? 'check-circle' : 'circle'" :size="13" />
            <span>Minimal 8 karakter</span>
          </div>
          <div :class="['req-item', { 'is-valid': hasMixedCase }]">
            <AppIcon :name="hasMixedCase ? 'check-circle' : 'circle'" :size="13" />
            <span>Huruf besar & huruf kecil (A-z)</span>
          </div>
          <div :class="['req-item', { 'is-valid': hasNumberOrSymbol }]">
            <AppIcon :name="hasNumberOrSymbol ? 'check-circle' : 'circle'" :size="13" />
            <span>Kombinasi angka (0-9) atau simbol</span>
          </div>
        </div>
      </div>

      <!-- Confirm New Password -->
      <div class="password-field-group">
        <BaseInput
          v-model="form.confirmPassword"
          :type="showConfirm ? 'text' : 'password'"
          label="Konfirmasi Kata Sandi Baru"
          placeholder="Ketik ulang kata sandi baru"
          :required="true"
          :error="errors.confirmPassword"
        >
          <template #prefix><AppIcon name="check-circle" :size="16" /></template>
          <template #suffix>
            <button
              type="button"
              class="eye-toggle-btn"
              tabindex="-1"
              @click="showConfirm = !showConfirm"
              aria-label="Tampilkan sandi"
            >
              <AppIcon :name="showConfirm ? 'eye-off' : 'eye'" :size="16" />
            </button>
          </template>
        </BaseInput>
      </div>

      <!-- Modal Footer Action Buttons -->
      <div class="modal-form-actions">
        <BaseButton
          variant="secondary"
          type="button"
          @click="$emit('update:modelValue', false)"
        >
          Batal
        </BaseButton>

        <BaseButton
          variant="primary"
          type="submit"
          :loading="isSubmitting"
        >
          <template #icon><AppIcon name="lock" :size="16" /></template>
          Perbarui Kata Sandi
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../../shared/stores/authStore'
import BaseModal from '../../../shared/components/ui/BaseModal.vue'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const authStore = useAuthStore()
const isSubmitting = ref(false)
const errors = ref({})

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const resetForm = () => {
  form.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  errors.value = {}
  showCurrent.value = false
  showNew.value = false
  showConfirm.value = false
}

// Password Strength Computation
const hasMinLength = computed(() => form.value.newPassword.length >= 8)
const hasMixedCase = computed(() => /[a-z]/.test(form.value.newPassword) && /[A-Z]/.test(form.value.newPassword))
const hasNumberOrSymbol = computed(() => /[0-9!@#$%^&*(),.?":{}|<>]/.test(form.value.newPassword))

const strengthScore = computed(() => {
  let score = 0
  if (hasMinLength.value) score += 1
  if (hasMixedCase.value) score += 1
  if (hasNumberOrSymbol.value) score += 1
  if (form.value.newPassword.length >= 12) score += 1
  return score
})

const strengthPercentage = computed(() => {
  return (strengthScore.value / 4) * 100
})

const strengthLabel = computed(() => {
  if (strengthScore.value <= 1) return 'Sangat Lemah'
  if (strengthScore.value === 2) return 'Cukup'
  if (strengthScore.value === 3) return 'Kuat'
  return 'Sangat Kuat & Aman'
})

const strengthClass = computed(() => {
  if (strengthScore.value <= 1) return 'strength-weak'
  if (strengthScore.value === 2) return 'strength-fair'
  if (strengthScore.value === 3) return 'strength-good'
  return 'strength-strong'
})

const handleSubmit = () => {
  errors.value = {}

  if (!form.value.currentPassword.trim()) {
    errors.value.currentPassword = 'Kata sandi saat ini wajib diisi'
  }

  if (form.value.newPassword.length < 8) {
    errors.value.newPassword = 'Kata sandi baru minimal 8 karakter'
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Konfirmasi kata sandi tidak cocok'
  }

  if (Object.keys(errors.value).length > 0) return

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    authStore.changePassword(form.value.currentPassword, form.value.newPassword)
    emit('update:modelValue', false)
    emit('success')
    resetForm()
  }, 500)
}
</script>

<style scoped>
.change-password-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.password-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.eye-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 4px;
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--duration-fast) ease;
}

.eye-toggle-btn:hover {
  color: var(--primary-600);
}

/* Strength Meter */
.strength-meter-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.meter-bar-track {
  height: 6px;
  background-color: var(--slate-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.meter-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 300ms ease, background-color 300ms ease;
}

.strength-weak { background-color: var(--danger-500); }
.strength-fair { background-color: var(--warning-500); }
.strength-good { background-color: var(--primary-600); }
.strength-strong { background-color: var(--success-500); }

.meter-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-secondary);
}

/* Requirements Box */
.requirements-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background-color: var(--slate-50);
  border-radius: var(--radius-md);
  margin-top: 6px;
  font-size: 11.5px;
}

.req-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  transition: color var(--duration-fast) ease;
}

.req-item.is-valid {
  color: var(--success-600);
  font-weight: 600;
}

.modal-form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--border-app);
  margin-top: 6px;
}
</style>
