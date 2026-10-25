<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Ubah Kategori Produk' : 'Tambah Kategori Produk Baru'"
    :subtitle="isEdit ? `Kategori: ${form.name}` : 'Kelompokkan menu makanan & minuman agar kasir mudah mencari produk'"
    size="md"
    @update:model-value="val => $emit('update:modelValue', val)"
    @close="resetForm"
  >
    <form @submit.prevent="handleSubmit" class="category-form">
      <BaseInput
        v-model="form.name"
        label="Nama Kategori"
        placeholder="Contoh: Terang Bulan Spesial"
        :required="true"
        :error="errors.name"
      >
        <template #prefix><AppIcon name="tag" :size="16" /></template>
      </BaseInput>

      <!-- Color Theme Picker -->
      <div class="color-picker-group">
        <label class="field-label">Warna Aksen Kategori</label>
        <div class="colors-row">
          <button
            v-for="c in presetColors"
            :key="c"
            type="button"
            :class="['color-circle-btn', { 'is-active': form.color === c }]"
            :style="{ backgroundColor: c }"
            @click="form.color = c"
          />
        </div>
      </div>

      <!-- Icon Picker -->
      <div class="icon-picker-group">
        <label class="field-label">Ikon Visual Kategori</label>
        <div class="icons-row">
          <button
            v-for="ic in presetIcons"
            :key="ic"
            type="button"
            :class="['icon-btn', { 'is-active': form.icon === ic }]"
            @click="form.icon = ic"
          >
            <AppIcon :name="ic" :size="18" />
          </button>
        </div>
      </div>

      <BaseInput
        v-model="form.description"
        label="Deskripsi Singkat (Opsional)"
        placeholder="Keterangan singkat kelompok produk ini"
      />

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
          {{ isEdit ? 'Simpan Perubahan' : 'Buat Kategori' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProductStore } from '../stores/productStore'
import BaseModal from '../../../shared/components/ui/BaseModal.vue'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categoryData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const productStore = useProductStore()
const isEdit = ref(false)
const isSubmitting = ref(false)
const errors = ref({})

const presetColors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#6366f1']
const presetIcons = ['sparkles', 'package', 'tag', 'gift', 'boxes', 'store']

const form = ref({
  name: '',
  color: presetColors[0],
  icon: presetIcons[0],
  description: ''
})

const resetForm = () => {
  form.value = {
    name: '',
    color: presetColors[0],
    icon: presetIcons[0],
    description: ''
  }
  errors.value = {}
}

watch(
  () => props.categoryData,
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
  if (!form.value.name.trim()) errors.value.name = 'Nama kategori wajib diisi'

  if (Object.keys(errors.value).length > 0) return

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    if (isEdit.value) {
      productStore.updateCategory(form.value.id, form.value)
    } else {
      productStore.createCategory(form.value)
    }
    emit('update:modelValue', false)
    emit('success')
  }, 400)
}
</script>

<style scoped>
.category-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  display: block;
  margin-bottom: 8px;
}

.colors-row {
  display: flex;
  gap: 10px;
}

.color-circle-btn {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform var(--duration-fast) ease;
}

.color-circle-btn:hover {
  transform: scale(1.15);
}

.color-circle-btn.is-active {
  border-color: #070d18;
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.icons-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  background-color: var(--slate-50);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.icon-btn:hover {
  border-color: var(--primary-500);
  color: var(--primary-600);
  background-color: #ffffff;
}

.icon-btn.is-active {
  background-color: var(--primary-600);
  color: #ffffff;
  border-color: var(--primary-600);
}

.modal-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--border-app);
  margin-top: 8px;
}
</style>
