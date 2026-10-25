<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Edit Data Pelanggan' : 'Daftarkan Pelanggan Baru'"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="form-group">
        <label class="form-label required">Nama Lengkap Pelanggan</label>
        <input
          v-model="form.name"
          type="text"
          class="form-input"
          placeholder="Contoh: Budi Santoso"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label required">Nomor WhatsApp / HP</label>
          <input
            v-model="form.phone"
            type="tel"
            class="form-input"
            placeholder="081234567890"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Email Pelanggan</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="nama@email.com"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label required">Tier Membership</label>
          <select v-model="form.tier" class="form-input">
            <option value="BRONZE">Bronze (Member Dasar)</option>
            <option value="SILVER">Silver (Diskon 5%)</option>
            <option value="GOLD">Gold (Diskon 10%)</option>
            <option value="PLATINUM">Platinum (VIP 15%)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Poin Loyalitas Awal</label>
          <input
            v-model.number="form.points"
            type="number"
            min="0"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Catatan Khusus / Preferensi Menu</label>
        <textarea
          v-model="form.notes"
          rows="2"
          class="form-textarea"
          placeholder="Contoh: Tidak suka terlalu manis, alergi kacang, dll"
        ></textarea>
      </div>

      <div class="modal-form-actions pt-2">
        <BaseButton variant="secondary" type="button" @click="$emit('update:modelValue', false)">
          Batal
        </BaseButton>
        <BaseButton variant="primary" type="submit" :loading="isSubmitting">
          {{ isEdit ? 'Simpan Perubahan' : 'Daftarkan Pelanggan' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import { useToast } from '@/shared/composables/useToast'
import { useCustomerStore } from '../stores/customerStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  customer: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'customer-saved'])

const toast = useToast()
const customerStore = useCustomerStore()

const isSubmitting = ref(false)
const isEdit = computed(() => !!props.customer)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  tier: 'BRONZE',
  points: 0,
  notes: ''
})

// Declare resetForm BEFORE watch
function resetForm() {
  if (props.customer) {
    form.name = props.customer.name
    form.phone = props.customer.phone
    form.email = props.customer.email || ''
    form.tier = props.customer.tier || 'BRONZE'
    form.points = props.customer.points || 0
    form.notes = props.customer.notes || ''
  } else {
    form.name = ''
    form.phone = ''
    form.email = ''
    form.tier = 'BRONZE'
    form.points = 0
    form.notes = ''
  }
}

watch(
  () => props.customer,
  () => {
    resetForm()
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.name.trim() || !form.phone.trim()) {
    toast.error('Nama dan nomor HP pelanggan wajib diisi!')
    return
  }

  isSubmitting.value = true
  try {
    if (isEdit.value) {
      customerStore.updateCustomer(props.customer.id, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        tier: form.tier,
        points: Number(form.points) || 0,
        notes: form.notes
      })
      toast.success('Data pelanggan berhasil diperbarui!')
    } else {
      customerStore.addCustomer({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        tier: form.tier,
        points: Number(form.points) || 0,
        notes: form.notes
      })
      toast.success('Pelanggan baru berhasil didaftarkan!')
    }

    emit('update:modelValue', false)
    emit('customer-saved')
  } catch (err) {
    toast.error('Gagal menyimpan data pelanggan.')
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
