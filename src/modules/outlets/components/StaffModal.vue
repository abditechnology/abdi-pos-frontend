<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Edit Akun Staf' : 'Undang & Daftarkan Staf Baru'"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="form-group">
        <label class="form-label required">Nama Lengkap Staf</label>
        <input
          v-model="form.name"
          type="text"
          class="form-input"
          placeholder="Contoh: Siti Rahayu"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label required">Alamat Email (Akun Login)</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="staf@bisnis.com"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label required">No. WhatsApp / HP</label>
          <input
            v-model="form.phone"
            type="tel"
            class="form-input"
            placeholder="081234567890"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label required">Peran / Hak Akses (RBAC)</label>
          <select v-model="form.role" class="form-input" required>
            <option value="CASHIER">Kasir (Buka Shift & Transaksi)</option>
            <option value="SUPERVISOR">Supervisor (Void, Stok & Laporan)</option>
            <option value="MANAGER">Manager (Kelola Menu & Cabang)</option>
            <option value="KITCHEN">Dapur (Kitchen Display System)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label required">Penugasan Cabang</label>
          <select v-model="form.outletId" class="form-input" required>
            <option
              v-for="ot in outletStore.outlets"
              :key="ot.id"
              :value="ot.id"
            >
              {{ ot.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="!isEdit" class="form-group">
        <label class="form-label required">Password Awal Akun Staf</label>
        <input
          v-model="form.password"
          type="password"
          class="form-input"
          placeholder="Minimal 8 karakter"
          required
        />
      </div>

      <div class="modal-form-actions pt-2">
        <BaseButton variant="secondary" type="button" @click="$emit('update:modelValue', false)">
          Batal
        </BaseButton>
        <BaseButton variant="primary" type="submit" :loading="isSubmitting">
          {{ isEdit ? 'Simpan Perubahan' : 'Undang Staf' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import { useStaffStore } from '../stores/staffStore'
import { useOutletStore } from '@/shared/stores/outletStore'
import { useToast } from '@/shared/composables/useToast'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  staff: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'staff-saved'])

const toast = useToast()
const staffStore = useStaffStore()
const outletStore = useOutletStore()

const isSubmitting = ref(false)
const isEdit = computed(() => !!props.staff)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  role: 'CASHIER',
  outletId: 1,
  password: 'Password123!'
})

// Declare resetForm BEFORE watch
function resetForm() {
  if (props.staff) {
    form.name = props.staff.name
    form.email = props.staff.email
    form.phone = props.staff.phone
    form.role = props.staff.role
    form.outletId = props.staff.outletId || outletStore.outlets[0]?.id || 1
    form.password = ''
  } else {
    form.name = ''
    form.email = ''
    form.phone = ''
    form.role = 'CASHIER'
    form.outletId = outletStore.outlets[0]?.id || 1
    form.password = 'Password123!'
  }
}

watch(
  () => props.staff,
  () => {
    resetForm()
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.name.trim() || !form.email.trim()) {
    toast.error('Nama dan email staf wajib diisi!')
    return
  }

  isSubmitting.value = true
  try {
    const assignedOutlet = outletStore.outlets.find(o => o.id === form.outletId)
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      outletId: form.outletId,
      outletName: assignedOutlet ? assignedOutlet.name : 'Semua Cabang'
    }

    if (isEdit.value) {
      staffStore.updateStaff(props.staff.id, payload)
      toast.success('Data staf berhasil diperbarui!')
    } else {
      staffStore.addStaff(payload)
      toast.success(`Akun staf untuk "${payload.name}" berhasil dibuat!`)
    }

    emit('update:modelValue', false)
    emit('staff-saved')
  } catch (err) {
    toast.error('Gagal memproses data staf.')
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
