<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Ubah Informasi Tenant' : 'Daftarkan Tenant Baru (Client Bisnis)'"
    :subtitle="isEdit ? `ID: #${form.id} • ${form.name}` : 'Tambahkan bisnis baru ke dalam ekosistem SaaS Abdi POS Anda'"
    size="lg"
    @update:model-value="val => $emit('update:modelValue', val)"
    @close="resetForm"
  >
    <form @submit.prevent="handleSubmit" class="tenant-form">
      <!-- Section 1: Profil Bisnis & Subdomain -->
      <div class="form-section-title">
        <AppIcon name="store" :size="16" />
        <span>1. Identitas Bisnis & Domain SaaS</span>
      </div>

      <div class="form-row">
        <BaseInput
          v-model="form.name"
          label="Nama Bisnis / Brand"
          placeholder="Contoh: Kopi Janji Jiwa, Martabak Bangka 88"
          :required="true"
          :error="errors.name"
          @input="handleNameInput"
        >
          <template #prefix>
            <AppIcon name="store" :size="16" />
          </template>
        </BaseInput>

        <BaseInput
          v-model="form.slug"
          label="Subdomain Bawaan (.abdipos.com)"
          placeholder="kopikenangan"
          :required="true"
          :help-text="`URL Toko: https://${form.slug || 'nama-toko'}.abdipos.com`"
          :error="errors.slug"
        >
          <template #prefix>
            <AppIcon name="globe" :size="16" />
          </template>
        </BaseInput>
      </div>

      <div class="form-row">
        <BaseInput
          v-model="form.customDomain"
          label="Custom Domain Klien (Opsional)"
          placeholder="martabaknusantara.id (tanpa https://)"
          help-text="Dapat diverifikasi dan diaktifkan kemudian di menu domain"
        >
          <template #prefix>
            <AppIcon name="globe" :size="16" />
          </template>
        </BaseInput>

        <BaseInput
          v-model="form.outletsCount"
          label="Kuota Awal Cabang / Outlet"
          type="number"
          placeholder="1"
          :required="true"
        >
          <template #prefix>
            <AppIcon name="boxes" :size="16" />
          </template>
        </BaseInput>
      </div>

      <!-- Section 2: Pemilik Akun (Owner) -->
      <div class="form-section-title">
        <AppIcon name="user" :size="16" />
        <span>2. Penanggung Jawab / Pemilik Toko (Owner)</span>
      </div>

      <div class="form-row">
        <BaseInput
          v-model="form.ownerName"
          label="Nama Lengkap Pemilik"
          placeholder="Ahmad Najib"
          :required="true"
          :error="errors.ownerName"
        >
          <template #prefix>
            <AppIcon name="user" :size="16" />
          </template>
        </BaseInput>

        <BaseInput
          v-model="form.ownerEmail"
          label="Email Akun Login Owner"
          type="email"
          placeholder="owner@bisnis.com"
          :required="true"
          :error="errors.ownerEmail"
          help-text="Kredensial login awal akan dikirimkan ke email ini"
        />
      </div>

      <div class="form-row">
        <BaseInput
          v-model="form.phone"
          label="Nomor WhatsApp / HP"
          placeholder="0812-3456-7890"
        />

        <!-- Pilihan Paket Langganan -->
        <div class="form-field-custom">
          <label class="field-label">Pilihan Paket Langganan SaaS <span class="required-mark">*</span></label>
          <select v-model="form.planId" class="native-select">
            <option v-for="plan in platformStore.plans" :key="plan.id" :value="plan.id">
              {{ plan.name }} — Rp {{ plan.priceMonthly.toLocaleString('id-ID') }}/bln (Maks {{ plan.maxOutlets }} Cabang)
            </option>
          </select>
        </div>
      </div>

      <!-- Section 3: Status Awal -->
      <div class="trial-toggle-box">
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.isTrial" />
          <div>
            <strong>Masa Uji Coba Gratis (Free Trial 14 Hari)</strong>
            <p>Tenant dapat langsung menggunakan aplikasi secara gratis selama 14 hari sebelum ditagih langganan berbayar.</p>
          </div>
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
        {{ isEdit ? 'Simpan Perubahan' : 'Daftarkan Tenant Sekarang' }}
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
  tenantData: {
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
  slug: '',
  customDomain: '',
  outletsCount: 1,
  ownerName: '',
  ownerEmail: '',
  phone: '',
  planId: 2,
  isTrial: false
})

const errors = ref({})

// Otomatis buat slug dari nama jika belum diubah manual
const handleNameInput = () => {
  if (!isEdit.value && !form.value.slug) {
    form.value.slug = form.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    slug: '',
    customDomain: '',
    outletsCount: 1,
    ownerName: '',
    ownerEmail: '',
    phone: '',
    planId: 2,
    isTrial: false
  }
  errors.value = {}
}

watch(
  () => props.tenantData,
  (val) => {
    if (val) {
      isEdit.value = true
      form.value = {
        id: val.id,
        name: val.name,
        slug: val.slug,
        customDomain: val.customDomain || '',
        outletsCount: val.outletsCount || 1,
        ownerName: val.ownerName,
        ownerEmail: val.ownerEmail,
        phone: val.phone || '',
        planId: val.planId,
        isTrial: val.status === 'trial'
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

  if (!form.value.name.trim()) errors.value.name = 'Nama bisnis wajib diisi'
  if (!form.value.slug.trim()) errors.value.slug = 'Subdomain wajib diisi'
  if (!form.value.ownerName.trim()) errors.value.ownerName = 'Nama pemilik wajib diisi'
  if (!form.value.ownerEmail.trim()) errors.value.ownerEmail = 'Email pemilik wajib diisi'

  if (Object.keys(errors.value).length > 0) return

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    if (!isEdit.value) {
      platformStore.createTenant(form.value)
    } else {
      // Update logic
      const tenant = platformStore.tenants.find(t => t.id === form.value.id)
      if (tenant) {
        tenant.name = form.value.name
        tenant.slug = form.value.slug
        tenant.subdomain = `${form.value.slug}.abdipos.com`
        tenant.customDomain = form.value.customDomain
        tenant.ownerName = form.value.ownerName
        tenant.ownerEmail = form.value.ownerEmail
        tenant.phone = form.value.phone
        tenant.planId = form.value.planId
        tenant.outletsCount = Number(form.value.outletsCount)
      }
    }
    emit('update:modelValue', false)
    emit('success')
    resetForm()
  }, 500)
}
</script>

<style scoped>
.tenant-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-field-custom {
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

.native-select {
  height: 42px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  background-color: var(--bg-surface);
  color: var(--text-main);
  font-size: 13.5px;
  outline: none;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.native-select:focus {
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.trial-toggle-box {
  background-color: var(--slate-50);
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-md);
  padding: 12px 14px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  font-size: 13px;
}

.checkbox-label input {
  margin-top: 3px;
  width: 16px;
  height: 16px;
  accent-color: var(--primary-600);
}

.checkbox-label strong {
  color: var(--text-main);
  display: block;
}

.checkbox-label p {
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 2px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
