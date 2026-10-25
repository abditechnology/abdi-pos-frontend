<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Edit Data Meja' : 'Tambah Meja Baru'"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="form-group">
        <label class="form-label required">Nomor / Nama Meja</label>
        <input
          v-model="form.number"
          type="text"
          class="form-input"
          placeholder="Contoh: Meja 07 atau VIP Bar"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label required">Kapasitas Kursi</label>
          <input
            v-model.number="form.capacity"
            type="number"
            min="1"
            max="100"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label required">Area / Ruangan</label>
          <select v-model="form.area" class="form-input" required>
            <option value="Indoor AC">Indoor AC</option>
            <option value="Outdoor / Smoking">Outdoor / Smoking</option>
            <option value="VIP Room">VIP Room</option>
            <option value="Lantai 2">Lantai 2</option>
          </select>
        </div>
      </div>

      <div class="modal-form-actions pt-2">
        <BaseButton variant="secondary" type="button" @click="$emit('update:modelValue', false)">
          Batal
        </BaseButton>
        <BaseButton variant="primary" type="submit" :loading="isSubmitting">
          {{ isEdit ? 'Simpan Perubahan' : 'Tambah Meja' }}
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
import { useOrderStore } from '../stores/orderStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  table: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'table-saved'])

const toast = useToast()
const orderStore = useOrderStore()

const isSubmitting = ref(false)
const isEdit = computed(() => !!props.table)

const form = reactive({
  number: '',
  capacity: 4,
  area: 'Indoor AC'
})

// Declare resetForm BEFORE watch
function resetForm() {
  if (props.table) {
    form.number = props.table.number
    form.capacity = props.table.capacity
    form.area = props.table.area
  } else {
    form.number = ''
    form.capacity = 4
    form.area = 'Indoor AC'
  }
}

watch(
  () => props.table,
  () => {
    resetForm()
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.number.trim()) {
    toast.error('Nomor meja wajib diisi!')
    return
  }

  isSubmitting.value = true
  try {
    if (isEdit.value) {
      orderStore.updateTable(props.table.id, {
        number: form.number,
        capacity: Number(form.capacity),
        area: form.area
      })
      toast.success('Data meja berhasil diperbarui!')
    } else {
      orderStore.addTable({
        number: form.number,
        capacity: Number(form.capacity),
        area: form.area
      })
      toast.success('Meja baru berhasil ditambahkan!')
    }

    emit('update:modelValue', false)
    emit('table-saved')
  } catch (err) {
    toast.error('Gagal menyimpan meja.')
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
