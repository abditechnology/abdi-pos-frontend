<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Ubah Data Bahan Baku' : 'Tambah Bahan Baku Baru'"
    :subtitle="isEdit ? `ID: #${form.id} • ${form.name}` : 'Daftarkan bahan baku atau kemasan untuk dipantau stoknya'"
    size="md"
    @update:model-value="val => $emit('update:modelValue', val)"
    @close="resetForm"
  >
    <form @submit.prevent="handleSubmit" class="material-form">
      <BaseInput
        v-model="form.name"
        label="Nama Bahan Baku"
        placeholder="Contoh: Tepung Terigu Segitiga Biru"
        :required="true"
        :error="errors.name"
      >
        <template #prefix><AppIcon name="package" :size="16" /></template>
      </BaseInput>

      <div class="form-row">
        <BaseInput
          v-model="form.sku"
          label="Kode SKU Bahan"
          placeholder="RAW-TPG-01"
        >
          <template #prefix><AppIcon name="tag" :size="16" /></template>
        </BaseInput>

        <div class="custom-select-group">
          <label class="select-label">Kategori Bahan</label>
          <select v-model="form.category" class="app-select">
            <option value="Bahan Utama">Bahan Utama</option>
            <option value="Topping & Lemak">Topping & Lemak</option>
            <option value="Bahan Penunjang">Bahan Penunjang</option>
            <option value="Bahan Isian">Bahan Isian</option>
            <option value="Kemasan & Packaging">Kemasan & Packaging</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <BaseInput
          v-model="form.stock"
          type="number"
          label="Jumlah Stok Masuk"
          placeholder="50"
          :required="true"
        >
          <template #prefix><AppIcon name="boxes" :size="16" /></template>
        </BaseInput>

        <div class="custom-select-group">
          <label class="select-label">Satuan Unit</label>
          <select v-model="form.unit" class="app-select">
            <option value="Kg">Kg</option>
            <option value="Gram">Gram</option>
            <option value="Butir">Butir</option>
            <option value="Kaleng">Kaleng</option>
            <option value="Balok 2kg">Balok 2kg</option>
            <option value="Liter">Liter</option>
            <option value="Pcs">Pcs</option>
            <option value="Dus / Box">Dus / Box</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <BaseInput
          v-model="form.minStock"
          type="number"
          label="Batas Minimum Stok (Alert)"
          placeholder="15"
          help-text="Peringatan muncul jika stok di bawah angka ini"
        >
          <template #prefix><AppIcon name="alert-triangle" :size="16" /></template>
        </BaseInput>

        <BaseInput
          v-model="form.costPerUnit"
          type="number"
          label="Biaya Modal per Satuan (Rp)"
          placeholder="12500"
          help-text="Harga beli dari supplier"
        >
          <template #prefix><AppIcon name="dollar" :size="16" /></template>
        </BaseInput>
      </div>

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
          {{ isEdit ? 'Simpan Perubahan' : 'Daftarkan Bahan' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useInventoryStore } from '../stores/inventoryStore'
import BaseModal from '../../../shared/components/ui/BaseModal.vue'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  materialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const inventoryStore = useInventoryStore()
const isEdit = ref(false)
const isSubmitting = ref(false)
const errors = ref({})

const form = ref({
  name: '',
  sku: '',
  category: 'Bahan Utama',
  stock: 20,
  minStock: 10,
  unit: 'Kg',
  costPerUnit: 15000
})

const resetForm = () => {
  form.value = {
    name: '',
    sku: '',
    category: 'Bahan Utama',
    stock: 20,
    minStock: 10,
    unit: 'Kg',
    costPerUnit: 15000
  }
  errors.value = {}
}

watch(
  () => props.materialData,
  (val) => {
    if (val) {
      isEdit.value = true
      form.value = { ...val }
    } else {
      isEdit.value = false
      resetForm()
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Nama bahan baku wajib diisi'

  if (Object.keys(errors.value).length > 0) return

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    if (isEdit.value) {
      inventoryStore.updateMaterial(form.value.id, form.value)
    } else {
      inventoryStore.createMaterial(form.value)
    }
    emit('update:modelValue', false)
    emit('success')
  }, 400)
}
</script>

<style scoped>
.material-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.custom-select-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.select-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.app-select {
  height: 42px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  background-color: #ffffff;
  font-size: 13.5px;
  color: var(--text-main);
  outline: none;
  cursor: pointer;
}

.modal-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--border-app);
  margin-top: 8px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
