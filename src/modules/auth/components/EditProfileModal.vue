<template>
  <BaseModal
    :model-value="modelValue"
    title="Ubah Profil Pengguna"
    subtitle="Perbarui data kontak, domisili, dan foto profil akun Anda"
    size="md"
    @update:model-value="val => $emit('update:modelValue', val)"
    @close="resetForm"
  >
    <form @submit.prevent="handleSubmit" class="edit-profile-form">
      <!-- Avatar Section -->
      <div class="avatar-edit-section">
        <div class="avatar-preview-wrap">
          <img :src="form.avatar" alt="Avatar Preview" class="current-avatar-img" />
          <div class="avatar-badge">
            <AppIcon name="camera" :size="14" />
          </div>
        </div>

        <div class="avatar-selection-box">
          <label class="section-sublabel">Pilih Avatar Cepat:</label>
          <div class="preset-avatars-row">
            <button
              v-for="(pAvatar, idx) in presetAvatars"
              :key="idx"
              type="button"
              :class="['preset-avatar-btn', { 'is-selected': form.avatar === pAvatar }]"
              @click="form.avatar = pAvatar"
            >
              <img :src="pAvatar" :alt="`Avatar Preset ${idx + 1}`" />
            </button>
          </div>
          <BaseInput
            v-model="form.avatar"
            label="Atau URL Foto Kustom"
            placeholder="https://..."
            size="sm"
          >
            <template #prefix><AppIcon name="camera" :size="14" /></template>
          </BaseInput>
        </div>
      </div>

      <hr class="form-divider" />

      <!-- Form Inputs -->
      <div class="form-row">
        <BaseInput
          v-model="form.name"
          label="Nama Lengkap"
          placeholder="Ahmad Najib"
          :required="true"
          :error="errors.name"
        >
          <template #prefix><AppIcon name="user" :size="16" /></template>
        </BaseInput>

        <BaseInput
          v-model="form.email"
          label="Alamat Email"
          type="email"
          placeholder="najib@martabaknusantara.com"
          :required="true"
          :error="errors.email"
        >
          <template #prefix><AppIcon name="mail" :size="16" /></template>
        </BaseInput>
      </div>

      <div class="form-row">
        <BaseInput
          v-model="form.phone"
          label="Nomor WhatsApp / Telepon"
          placeholder="0812-3456-7890"
          :required="true"
          :error="errors.phone"
        >
          <template #prefix><AppIcon name="phone" :size="16" /></template>
        </BaseInput>

        <BaseInput
          v-model="assignedOutletDisplay"
          label="Penugasan Cabang / Outlet"
          :disabled="true"
          help-text="Ditetapkan oleh Admin Bisnis"
        >
          <template #prefix><AppIcon name="store" :size="16" /></template>
        </BaseInput>
      </div>

      <div class="form-group">
        <BaseInput
          v-model="form.address"
          label="Alamat Domisili / Tempat Tinggal"
          placeholder="Jl. Jenderal Sudirman No. 45, Jakarta Selatan"
        />
      </div>

      <!-- Action Buttons in Modal Footer -->
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
          <template #icon><AppIcon name="check-circle" :size="16" /></template>
          Simpan Perubahan
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../../../shared/stores/authStore'
import BaseModal from '../../../shared/components/ui/BaseModal.vue'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const authStore = useAuthStore()
const isSubmitting = ref(false)
const errors = ref({})

const presetAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160&h=160&fit=crop&crop=faces'
]

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: ''
})

const assignedOutletDisplay = computed(() => {
  return authStore.user?.assignedOutletName || 'Semua Cabang'
})

const resetForm = () => {
  if (authStore.user) {
    form.value = {
      name: authStore.user.name || '',
      email: authStore.user.email || '',
      phone: authStore.user.phone || '',
      address: authStore.user.address || '',
      avatar: authStore.user.avatar || presetAvatars[0]
    }
  }
  errors.value = {}
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) resetForm()
  },
  { immediate: true }
)

const handleSubmit = () => {
  errors.value = {}

  if (!form.value.name.trim()) errors.value.name = 'Nama lengkap wajib diisi'
  if (!form.value.email.trim()) errors.value.email = 'Alamat email wajib diisi'
  if (!form.value.phone.trim()) errors.value.phone = 'Nomor telepon/WA wajib diisi'

  if (Object.keys(errors.value).length > 0) return

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    authStore.updateProfile(form.value)
    emit('update:modelValue', false)
    emit('success')
  }, 400)
}
</script>

<style scoped>
.edit-profile-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.avatar-edit-section {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px;
  background-color: var(--slate-50);
  border: 1px solid var(--border-app);
  border-radius: var(--radius-lg);
}

.avatar-preview-wrap {
  position: relative;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
}

.current-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 3px solid var(--primary-500);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background-color: var(--primary-600);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
}

.avatar-selection-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-sublabel {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-secondary);
}

.preset-avatars-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.preset-avatar-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  transition: transform var(--duration-fast) ease, border-color var(--duration-fast) ease;
}

.preset-avatar-btn:hover {
  transform: scale(1.1);
}

.preset-avatar-btn.is-selected {
  border-color: var(--primary-600);
  transform: scale(1.12);
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
}

.preset-avatar-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-divider {
  border: 0;
  height: 1px;
  background-color: var(--border-app);
  margin: 4px 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.modal-form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-app);
  margin-top: 8px;
}

@media (max-width: 640px) {
  .avatar-edit-section {
    flex-direction: column;
    align-items: flex-start;
  }
  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
