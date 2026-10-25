<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Ubah Informasi Produk' : 'Tambah Produk / Menu Baru'"
    :subtitle="isEdit ? `ID: #${form.id} • ${form.name}` : 'Masukkan data menu, harga jual, dan stok untuk kasir POS'"
    size="lg"
    @update:model-value="val => $emit('update:modelValue', val)"
    @close="resetForm"
  >
    <form @submit.prevent="handleSubmit" class="product-form">
      <!-- Section 1: Identitas & Gambar -->
      <div class="form-row-top">
        <div class="image-preview-box">
          <img :src="form.image" alt="Preview Menu" class="menu-preview-img" />
          <div class="preset-images-picker">
            <span class="preset-label">Pilih Foto Cepat:</span>
            <div class="preset-images-list">
              <button
                v-for="(img, idx) in presetImages"
                :key="idx"
                type="button"
                :class="['img-preset-btn', { 'is-selected': form.image === img }]"
                @click="form.image = img"
              >
                <img :src="img" alt="Preset" />
              </button>
            </div>
          </div>
        </div>

        <div class="form-col-info">
          <BaseInput
            v-model="form.name"
            label="Nama Menu / Produk"
            placeholder="Contoh: Terang Bulan Spesial Red Velvet"
            :required="true"
            :error="errors.name"
          >
            <template #prefix><AppIcon name="package" :size="16" /></template>
          </BaseInput>

          <div class="form-row">
            <BaseInput
              v-model="form.sku"
              label="Kode SKU / Barcode"
              placeholder="TB-RV-01"
              help-text="Bisa di-scan di kasir POS"
            >
              <template #prefix><AppIcon name="tag" :size="16" /></template>
            </BaseInput>

            <div class="custom-select-group">
              <label class="select-label">Kategori Produk <span class="req">*</span></label>
              <select v-model="form.categoryId" class="app-select">
                <option v-for="cat in productStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Harga & Finansial -->
      <div class="form-section-title">
        <AppIcon name="dollar" :size="16" />
        <span>Harga Jual & Estimasi Modal (HPP)</span>
      </div>

      <div class="form-row">
        <BaseInput
          v-model="form.price"
          type="number"
          label="Harga Jual ke Pelanggan (Rp)"
          placeholder="35000"
          :required="true"
          :error="errors.price"
        >
          <template #prefix><AppIcon name="dollar" :size="16" /></template>
        </BaseInput>

        <BaseInput
          v-model="form.costPrice"
          type="number"
          label="Harga Pokok Penjualan / HPP (Rp)"
          placeholder="20000"
          help-text="Untuk kalkulasi margin laba kotor"
        >
          <template #prefix><AppIcon name="dollar" :size="16" /></template>
        </BaseInput>
      </div>

      <!-- Section 3: Inventaris & Satuan -->
      <div class="form-section-title">
        <AppIcon name="boxes" :size="16" />
        <span>Manajemen Stok & Ketersediaan</span>
      </div>

      <div class="form-row">
        <BaseInput
          v-model="form.stock"
          type="number"
          label="Jumlah Stok Tersedia"
          placeholder="50"
          :disabled="!form.trackStock"
        >
          <template #prefix><AppIcon name="boxes" :size="16" /></template>
        </BaseInput>

        <div class="custom-select-group">
          <label class="select-label">Satuan Unit</label>
          <select v-model="form.unit" class="app-select">
            <option value="Porsi">Porsi</option>
            <option value="Cup">Cup</option>
            <option value="Pcs">Pcs</option>
            <option value="Box">Box</option>
            <option value="Botol">Botol</option>
          </select>
        </div>
      </div>

      <!-- Toggle Switches -->
      <div class="toggles-row">
        <label class="switch-item">
          <input type="checkbox" v-model="form.trackStock" class="custom-checkbox" />
          <div class="switch-text">
            <strong>Pantau Stok Otomatis</strong>
            <span>Stok berkurang otomatis setiap ada pesanan kasir POS.</span>
          </div>
        </label>

        <label class="switch-item">
          <input type="checkbox" v-model="form.isActive" class="custom-checkbox" />
          <div class="switch-text">
            <strong>Produk Aktif / Dijual</strong>
            <span>Tampilkan menu ini di layar kasir dan self-order.</span>
          </div>
        </label>
      </div>

      <!-- Action Buttons -->
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
          {{ isEdit ? 'Simpan Perubahan' : 'Terbitkan Produk Baru' }}
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
  productData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const productStore = useProductStore()
const isEdit = ref(false)
const isSubmitting = ref(false)
const errors = ref({})

const presetImages = [
  'https://images.unsplash.com/photo-1579888944880-d98341245702?w=160&h=160&fit=crop',
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=160&h=160&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160&h=160&fit=crop',
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=160&h=160&fit=crop',
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=160&h=160&fit=crop'
]

const form = ref({
  name: '',
  sku: '',
  categoryId: 1,
  price: 35000,
  costPrice: 20000,
  stock: 50,
  unit: 'Porsi',
  image: presetImages[0],
  trackStock: true,
  isActive: true
})

const resetForm = () => {
  form.value = {
    name: '',
    sku: '',
    categoryId: productStore.categories[0]?.id || 1,
    price: 35000,
    costPrice: 20000,
    stock: 50,
    unit: 'Porsi',
    image: presetImages[0],
    trackStock: true,
    isActive: true
  }
  errors.value = {}
}

watch(
  () => props.productData,
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
  if (!form.value.name.trim()) errors.value.name = 'Nama produk wajib diisi'
  if (!form.value.price || Number(form.value.price) <= 0) errors.value.price = 'Harga jual wajib diisi valid'

  if (Object.keys(errors.value).length > 0) return

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    if (isEdit.value) {
      productStore.updateProduct(form.value.id, form.value)
    } else {
      productStore.createProduct(form.value)
    }
    emit('update:modelValue', false)
    emit('success')
  }, 400)
}
</script>

<style scoped>
.product-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row-top {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.image-preview-box {
  width: 140px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.menu-preview-img {
  width: 100%;
  height: 110px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  border: 2px solid var(--border-app);
}

.preset-images-picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preset-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
}

.preset-images-list {
  display: flex;
  gap: 4px;
}

.img-preset-btn {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-app);
  padding: 0;
  cursor: pointer;
}

.img-preset-btn.is-selected {
  border-color: var(--primary-600);
  box-shadow: 0 0 0 1px var(--primary-600);
}

.img-preset-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-col-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.req {
  color: var(--danger-500);
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
  transition: border-color var(--duration-fast) ease;
}

.app-select:focus {
  border-color: var(--primary-600);
}

.form-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--primary-700);
  padding: 6px 0;
  border-bottom: 1px solid var(--border-app);
  margin-top: 4px;
}

.toggles-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 12px;
  background-color: var(--slate-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
}

.switch-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-600);
  margin-top: 2px;
  cursor: pointer;
}

.switch-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.switch-text strong {
  font-size: 12.5px;
  color: var(--text-main);
}

.switch-text span {
  font-size: 11px;
  color: var(--text-muted);
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
  .form-row-top {
    flex-direction: column;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .toggles-row {
    grid-template-columns: 1fr;
  }
}
</style>
