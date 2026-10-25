<template>
  <BaseModal
    :model-value="modelValue"
    title="Hubungkan Custom Domain Bisnis"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="form-group">
        <label class="form-label required">Nama Domain Kustom Anda</label>
        <input
          v-model="form.domain"
          type="text"
          class="form-input font-mono"
          placeholder="order.namabisnis.com atau namabisnis.id"
          required
        />
        <span class="text-xs text-slate-500">
          Gunakan subdomain seperti <strong>order.tokoanda.com</strong> atau apex domain.
        </span>
      </div>

      <!-- DNS Configuration Instructions -->
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Pengaturan DNS di Registrar Domain Anda
        </h4>
        <p class="text-xs text-slate-600">
          Buka dashboard DNS provider Anda (Cloudflare, Niagahoster, Domainesia, dll) dan tambahkan CNAME record berikut:
        </p>

        <div class="dns-record-row flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 text-xs font-mono">
          <div>
            <span class="text-slate-400 block text-[10px]">TIPE</span>
            <span class="font-bold text-slate-800">CNAME</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">HOST / NAMA</span>
            <span class="font-bold text-slate-800">order</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">TARGET / VALUE</span>
            <span class="font-bold text-blue-600">cname.abdipos.com</span>
          </div>
        </div>

        <p class="text-[11px] text-slate-500">
          Sertifikat SSL (HTTPS) akan diterbitkan secara otomatis dalam 5-15 menit setelah DNS terpropagasi.
        </p>
      </div>

      <div class="modal-form-actions pt-2">
        <BaseButton variant="secondary" type="button" @click="$emit('update:modelValue', false)">
          Batal
        </BaseButton>
        <BaseButton variant="primary" type="submit" :loading="isSubmitting">
          Verifikasi & Hubungkan Domain
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import { useToast } from '@/shared/composables/useToast'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'domain-connected'])

const toast = useToast()
const isSubmitting = ref(false)

const form = reactive({
  domain: ''
})

function handleSubmit() {
  if (!form.domain.trim()) {
    toast.error('Masukkan nama domain terlebih dahulu!')
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    toast.success(`Domain "${form.domain.trim()}" berhasil didaftarkan dan menunggu verifikasi DNS!`)
    emit('domain-connected', form.domain.trim())
    emit('update:modelValue', false)
    form.domain = ''
  }, 1000)
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.825rem;
  font-weight: 600;
  color: #334155;
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.modal-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
