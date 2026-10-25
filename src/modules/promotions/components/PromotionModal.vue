<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Edit Program Promosi' : 'Buat Promo & Diskon Baru'"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-3 gap-3">
        <div class="col-span-2 form-group">
          <label class="form-label required">Nama / Judul Promosi</label>
          <input
            v-model="form.title"
            type="text"
            class="form-input"
            placeholder="Contoh: Diskon Gajian 25%"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label required">Kode Promo</label>
          <input
            v-model="form.code"
            type="text"
            class="form-input font-mono uppercase"
            placeholder="GAJIAN25"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label required">Tipe Promosi</label>
          <select v-model="form.type" class="form-input">
            <option value="PERCENTAGE">Persentase Diskon (%)</option>
            <option value="FIXED">Potongan Nominal Flat (Rp)</option>
            <option value="BUNDLE">Paket Bundling Menu</option>
            <option value="TEBUS_MURAH">Tebus Murah Item</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label required">
            {{ form.type === 'PERCENTAGE' ? 'Besar Diskon (%)' : 'Nilai Potongan (Rp)' }}
          </label>
          <input
            v-model.number="form.discountValue"
            type="number"
            min="1"
            class="form-input font-bold text-blue-700"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Minimal Belanja (Rp)</label>
          <input
            v-model.number="form.minPurchase"
            type="number"
            min="0"
            step="5000"
            class="form-input"
            placeholder="0"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Maksimal Diskon (Rp)</label>
          <input
            v-model.number="form.maxDiscount"
            type="number"
            min="0"
            step="5000"
            class="form-input"
            placeholder="0 jika tanpa batas"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label required">Berlaku Sampai Tanggal</label>
          <input
            v-model="form.validUntil"
            type="date"
            class="form-input"
            required
          />
        </div>

        <div class="form-group flex flex-col justify-center">
          <label class="form-label">Status Promosi</label>
          <label class="flex items-center gap-2 cursor-pointer mt-1">
            <input
              v-model="form.isActive"
              type="checkbox"
              class="w-4 h-4 text-blue-600 rounded"
            />
            <span class="text-sm font-medium text-slate-700">Aktifkan Promosi Sekarang</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Deskripsi Syarat & Ketentuan</label>
        <textarea
          v-model="form.description"
          rows="2"
          class="form-textarea"
          placeholder="Tuliskan syarat & ketentuan promo untuk kasir atau pelanggan..."
        ></textarea>
      </div>

      <div class="modal-form-actions pt-2">
        <BaseButton variant="secondary" type="button" @click="$emit('update:modelValue', false)">
          Batal
        </BaseButton>
        <BaseButton variant="primary" type="submit" :loading="isSubmitting">
          {{ isEdit ? 'Simpan Perubahan' : 'Buat Promo' }}
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
import { usePromotionStore } from '../stores/promotionStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  promotion: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'promotion-saved'])

const toast = useToast()
const promoStore = usePromotionStore()

const isSubmitting = ref(false)
const isEdit = computed(() => !!props.promotion)

const form = reactive({
  title: '',
  code: '',
  type: 'PERCENTAGE',
  discountValue: 10,
  minPurchase: 0,
  maxDiscount: 0,
  validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  isActive: true,
  description: ''
})

// Declare resetForm BEFORE watch
function resetForm() {
  if (props.promotion) {
    form.title = props.promotion.title
    form.code = props.promotion.code
    form.type = props.promotion.type
    form.discountValue = props.promotion.discountValue
    form.minPurchase = props.promotion.minPurchase || 0
    form.maxDiscount = props.promotion.maxDiscount || 0
    form.validUntil = props.promotion.validUntil
    form.isActive = props.promotion.isActive
    form.description = props.promotion.description || ''
  } else {
    form.title = ''
    form.code = ''
    form.type = 'PERCENTAGE'
    form.discountValue = 10
    form.minPurchase = 0
    form.maxDiscount = 0
    form.validUntil = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10)
    form.isActive = true
    form.description = ''
  }
}

watch(
  () => props.promotion,
  () => {
    resetForm()
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.title.trim() || !form.code.trim()) {
    toast.error('Judul dan kode promo wajib diisi!')
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      title: form.title.trim(),
      code: form.code.trim().toUpperCase(),
      type: form.type,
      discountValue: Number(form.discountValue),
      minPurchase: Number(form.minPurchase) || 0,
      maxDiscount: Number(form.maxDiscount) || 0,
      validUntil: form.validUntil,
      isActive: form.isActive,
      description: form.description.trim()
    }

    if (isEdit.value) {
      promoStore.updatePromotion(props.promotion.id, payload)
      toast.success('Program promosi berhasil diperbarui!')
    } else {
      promoStore.addPromotion(payload)
      toast.success('Promosi baru berhasil dibuat!')
    }

    emit('update:modelValue', false)
    emit('promotion-saved')
  } catch (err) {
    toast.error('Gagal menyimpan program promosi.')
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
