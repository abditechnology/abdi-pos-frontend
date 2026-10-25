<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Ubah Konfigurasi Paket Langganan' : 'Buat Paket Langganan SaaS Baru'"
    :subtitle="isEdit ? `Paket: ${form.name}` : 'Tentukan harga, limitasi cabang, dan fitur untuk ditawarkan kepada calon tenant'"
    size="md"
    @update:model-value="val => $emit('update:modelValue', val)"
    @close="resetForm"
  >
    <form @submit.prevent="handleSubmit" class="plan-form">
      <div class="form-row">
        <BaseInput
          v-model="form.name"
          label="Nama Paket"
          placeholder="Contoh: Business Pro"
          :required="true"
          :error="errors.name"
        >
          <template #prefix>
            <AppIcon name="credit-card" :size="16" />
          </template>
        </BaseInput>

        <BaseInput
          v-model="form.badge"
          label="Label / Badge Paket"
          placeholder="Contoh: Paling Populer, UMKM"
        >
          <template #prefix>
            <AppIcon name="tag" :size="16" />
          </template>
        </BaseInput>
      </div>

      <!-- Pricing Row -->
      <div class="form-row">
        <BaseInput
          v-model="form.priceMonthly"
          label="Harga Bulanan (Rp / Bulan)"
          type="number"
          placeholder="249000"
          :required="true"
          help-text="Masukkan 0 jika paket gratis"
        >
          <template #prefix>
            <AppIcon name="dollar" :size="16" />
          </template>
        </BaseInput>

        <BaseInput
          v-model="form.priceYearly"
          label="Harga Tahunan (Rp / Tahun)"
          type="number"
          placeholder="2490000"
          help-text="Diskon bayar tahunan sekaligus"
        >
          <template #prefix>
            <AppIcon name="dollar" :size="16" />
          </template>
        </BaseInput>
      </div>

      <!-- Limits Row -->
      <div class="form-section-title">
        <AppIcon name="shield" :size="16" />
        <span>Batasan Kuota (Quota Limits)</span>
      </div>

      <div class="form-row-three">
        <BaseInput
          v-model="form.maxOutlets"
          label="Maksimal Cabang"
          type="number"
          placeholder="3"
          :required="true"
        />

        <BaseInput
          v-model="form.maxStaff"
          label="Maksimal Staf"
          type="number"
          placeholder="10"
          :required="true"
        />

        <BaseInput
          v-model="form.maxProducts"
          label="Maksimal Menu"
          type="number"
          placeholder="2000"
          :required="true"
        />
      </div>

      <!-- Features Checklist (Textarea) -->
      <div class="features-input-field">
        <label class="field-label">
          Daftar Fitur Paket (1 baris per fitur)
          <span class="required-mark">*</span>
        </label>
        <textarea
          v-model="form.featuresText"
          rows="5"
          class="native-textarea"
          placeholder="Contoh:
Hingga 3 Cabang / Outlet
Manajemen Inventaris Multi-Cabang
Diskon, Promo Bundling & Tebus Murah
Dukungan Custom Domain (.id / .com)
Laporan Laba/Rugi & Analitik Lengkap"
        />
        <span class="help-text">Setiap baris akan ditampilkan sebagai centang hijau di halaman paket langganan.</span>
      </div>

      <div class="popular-toggle-box">
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.isPopular" />
          <span>Tandai paket ini sebagai <strong>"Paling Populer"</strong> (diberi aksen border biru & rekomendasi)</span>
        </label>
      </div>
    </form>

    <template #footer="{ close }">
      <BaseButton variant="ghost" @click="close">
        Batal
      </BaseButton>
      <BaseButton
        variant="primary"
        :loading="isSubmitting"
        @click="handleSubmit"
      >
        <template #icon>
          <AppIcon name="check-circle" :size="16" />
        </template>
        {{ isEdit ? 'Simpan Perubahan Paket' : 'Terbitkan Paket Baru' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePlatformStore } from '../stores/platformStore'
import BaseModal from '../../../shared/components/ui/BaseModal.vue'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  planData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const platformStore = usePlatformStore()
const isEdit = ref(false)
const isSubmitting = ref(false)

const form = ref({
  name: '',
  badge: 'Populer',
  priceMonthly: 199000,
  priceYearly: 1990000,
  maxOutlets: 2,
  maxStaff: 5,
  maxProducts: 1000,
  featuresText: '',
  isPopular: false
})

const errors = ref({})

const resetForm = () => {
  form.value = {
    name: '',
    badge: 'Populer',
    priceMonthly: 199000,
    priceYearly: 1990000,
    maxOutlets: 2,
    maxStaff: 5,
    maxProducts: 1000,
    featuresText: '1 Cabang / Outlet\nManajemen Menu & Stok\nLaporan Penjualan Realtime',
    isPopular: false
  }
  errors.value = {}
}

watch(
  () => props.planData,
  (val) => {
    if (val) {
      isEdit.value = true
      form.value = {
        id: val.id,
        name: val.name,
        badge: val.badge || '',
        priceMonthly: val.priceMonthly,
        priceYearly: val.priceYearly,
        maxOutlets: val.maxOutlets,
        maxStaff: val.maxStaff,
        maxProducts: val.maxProducts,
        featuresText: Array.isArray(val.features) ? val.features.join('\n') : '',
        isPopular: Boolean(val.isPopular)
      }
    } else {
      isEdit.value = false
      resetForm()
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Nama paket wajib diisi'

  if (Object.keys(errors.value).length > 0) return

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    if (!isEdit.value) {
      platformStore.createPlan(form.value)
    } else {
      platformStore.updatePlan(form.value.id, form.value)
    }
    emit('update:modelValue', false)
    emit('success')
    resetForm()
  }, 500)
}
</script>

<style scoped>
.plan-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-row-three {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.form-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-700);
  background-color: var(--primary-50);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  margin-top: 4px;
}

.features-input-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 6px;
}

.required-mark {
  color: var(--danger-500);
}

.native-textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  background-color: var(--bg-surface);
  color: var(--text-main);
  font-size: 13.5px;
  line-height: 1.5;
  font-family: inherit;
  outline: none;
  resize: vertical;
  transition: all var(--duration-fast) ease;
}

.native-textarea:focus {
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.help-text {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.popular-toggle-box {
  background-color: var(--primary-50);
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-md);
  padding: 12px 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  color: var(--primary-900);
}

.checkbox-label input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-600);
}

@media (max-width: 640px) {
  .form-row, .form-row-three {
    grid-template-columns: 1fr;
  }
}
</style>
