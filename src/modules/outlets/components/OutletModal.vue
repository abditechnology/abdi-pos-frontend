<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Edit Cabang Outlet' : 'Tambah Cabang Outlet Baru'"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="form-group">
        <label class="form-label required">Nama Cabang / Outlet</label>
        <input
          v-model="form.name"
          type="text"
          class="form-input"
          placeholder="Contoh: Outlet Cabang - Bekasi Cyber Park"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label required">Kode Outlet</label>
          <input
            v-model="form.code"
            type="text"
            class="form-input font-mono uppercase"
            placeholder="OUT-BCP-04"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label required">No. Telepon / WhatsApp Outlet</label>
          <input
            v-model="form.phone"
            type="tel"
            class="form-input"
            placeholder="0812-3456-7890"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label required">Alamat Lengkap</label>
        <textarea
          v-model="form.address"
          rows="2"
          class="form-textarea"
          placeholder="Jalan, No. Bangunan, Ruko / Mall, Kota..."
          required
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Status Operasional</label>
          <select v-model="form.status" class="form-input">
            <option value="active">Aktif & Beroperasi</option>
            <option value="inactive">Nonaktif / Renovasi</option>
          </select>
        </div>

        <div class="form-group flex flex-col justify-center">
          <label class="flex items-center gap-2 cursor-pointer mt-5">
            <input
              v-model="form.isPrimary"
              type="checkbox"
              class="w-4 h-4 text-blue-600 rounded"
            />
            <span class="text-xs font-semibold text-slate-700">Jadikan Outlet Pusat Utama</span>
          </label>
        </div>
      </div>

      <div class="modal-form-actions pt-2">
        <BaseButton variant="secondary" type="button" @click="$emit('update:modelValue', false)">
          Batal
        </BaseButton>
        <BaseButton variant="primary" type="submit" :loading="isSubmitting">
          {{ isEdit ? 'Simpan Perubahan' : 'Buka Cabang Baru' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import { useOutletStore } from '@/shared/stores/outletStore'
import { useToast } from '@/shared/composables/useToast'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  outlet: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'outlet-saved'])

const toast = useToast()
const outletStore = useOutletStore()

const isSubmitting = ref(false)
const isEdit = computed(() => !!props.outlet)

const form = reactive({
  name: '',
  code: '',
  phone: '',
  address: '',
  status: 'active',
  isPrimary: false
})

// Declare resetForm BEFORE watch
function resetForm() {
  if (props.outlet) {
    form.name = props.outlet.name
    form.code = props.outlet.code
    form.phone = props.outlet.phone
    form.address = props.outlet.address
    form.status = props.outlet.status || 'active'
    form.isPrimary = props.outlet.isPrimary || false
  } else {
    form.name = ''
    form.code = ''
    form.phone = ''
    form.address = ''
    form.status = 'active'
    form.isPrimary = false
  }
}

watch(
  () => props.outlet,
  () => {
    resetForm()
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.name.trim() || !form.address.trim()) {
    toast.error('Nama cabang dan alamat lengkap wajib diisi!')
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      status: form.status,
      isPrimary: form.isPrimary
    }

    if (isEdit.value) {
      outletStore.updateOutlet(props.outlet.id, payload)
    } else {
      outletStore.createOutlet(payload)
    }

    emit('update:modelValue', false)
    emit('outlet-saved')
  } catch (err) {
    toast.error('Gagal memproses data cabang.')
  } finally {
    isSubmitting.value = false
  }
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

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.form-input:focus,
.form-textarea:focus {
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
