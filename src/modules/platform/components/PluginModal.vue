<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Ubah Konfigurasi Plugin Modular' : 'Tambah Plugin Add-on Baru'"
    :subtitle="isEdit ? `Plugin: ${form.name}` : 'Tentukan harga, target industri, dan kapabilitas plugin yang dapat diaktifkan tenant'"
    size="md"
    @update:model-value="val => $emit('update:modelValue', val)"
    @close="resetForm"
  >
    <form @submit.prevent="handleSubmit" class="plugin-form space-y-4">
      <div class="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          v-model="form.name"
          label="Nama Plugin"
          placeholder="Contoh: Kalkulator Komisi Staf"
          :required="true"
        >
          <template #prefix>
            <AppIcon name="sparkles" :size="16" />
          </template>
        </BaseInput>

        <BaseInput
          v-model="form.priceMonthly"
          label="Harga Bulanan (Rp / Bulan)"
          type="number"
          placeholder="25000"
          :required="true"
        >
          <template #prefix>
            <AppIcon name="dollar" :size="16" />
          </template>
        </BaseInput>
      </div>

      <div class="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="select-field">
          <label class="field-label font-bold text-xs text-slate-700 block mb-1">
            Kategori Plugin <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="form.category"
            class="form-select w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
            @change="syncCategoryLabel"
          >
            <option value="hr">SDM & Karyawan</option>
            <option value="whatsapp">Otomasi WhatsApp</option>
            <option value="service">Layanan & Booking</option>
            <option value="finance">Keuangan & Kas Bon</option>
          </select>
        </div>

        <div class="select-field">
          <label class="field-label font-bold text-xs text-slate-700 block mb-1">
            Ikon Visual <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="form.icon"
            class="form-select w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="sparkles">Sparkles (Default)</option>
            <option value="camera">Kamera (Absensi)</option>
            <option value="dollar">Dollar (Komisi)</option>
            <option value="bell">Lonceng (Notifikasi)</option>
            <option value="gift">Kado (Broadcast Promo)</option>
            <option value="clock">Jam (Booking Online)</option>
            <option value="receipt">Struk (Kas Bon)</option>
            <option value="chart">Grafik (Biaya & Laba)</option>
          </select>
        </div>
      </div>

      <BaseInput
        v-model="form.targetSectors"
        label="Target Sektor Bisnis"
        placeholder="Contoh: Salon, Barbershop, Spa, Klinik & Bengkel"
        :required="true"
      >
        <template #prefix>
          <AppIcon name="tag" :size="16" />
        </template>
      </BaseInput>

      <BaseInput
        v-model="form.shortDesc"
        label="Deskripsi Singkat Manfaat"
        placeholder="Contoh: Otomatis hitung bagi hasil/komisi per jasa treatment kasir."
        :required="true"
      />

      <!-- Features Checklist (Textarea) -->
      <div class="features-input-field">
        <label class="field-label font-bold text-xs text-slate-700 block mb-1">
          Daftar Fitur Utama (1 baris per fitur)
          <span class="text-rose-500">*</span>
        </label>
        <textarea
          v-model="form.featuresText"
          rows="4"
          class="w-full text-xs p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none leading-relaxed"
          placeholder="Contoh:
Set persentase komisi per jasa treatment
Pilih nama staf terapis langsung di kasir POS
Laporan rekap slip gaji komisi siap cetak"
          required
        ></textarea>
        <span class="text-[11px] text-slate-400 mt-1 block">Tiap baris teks akan dirender sebagai poin checklist (✓) di kartu marketplace.</span>
      </div>

      <div class="select-field">
        <label class="field-label font-bold text-xs text-slate-700 block mb-1">
          Jenis Simulator Demo Interaktif
        </label>
        <select
          v-model="form.demoType"
          class="form-select w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="selfie">Simulator Kamera Selfie & GPS</option>
          <option value="commission">Simulator Kalkulator Komisi Staf</option>
          <option value="waboot">Simulator Obrolan WhatsApp Bot</option>
          <option value="broadcast">Simulator Broadcast Promo & Ultah</option>
          <option value="booking">Simulator Kalender Reservasi Online</option>
          <option value="kasbon">Simulator Pembukuan Kas Bon & Kredit</option>
          <option value="expense">Simulator Pengeluaran & Net Profit</option>
        </select>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
        <BaseButton variant="secondary" size="md" type="button" @click="$emit('update:modelValue', false)">
          Batal
        </BaseButton>
        <BaseButton variant="primary" size="md" type="submit" :loading="isSubmitting">
          <template #icon><AppIcon name="check" :size="16" /></template>
          {{ isEdit ? 'Simpan Perubahan Plugin' : 'Tambahkan Plugin' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseInput from '@/shared/components/ui/BaseInput.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import { usePluginStore } from '@/shared/stores/pluginStore'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  pluginData: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'success'])

const pluginStore = usePluginStore()
const isSubmitting = ref(false)

const isEdit = computed(() => !!props.pluginData?.id)

const categoryLabels = {
  hr: 'SDM & Karyawan',
  whatsapp: 'Otomasi WhatsApp',
  service: 'Layanan & Booking',
  finance: 'Keuangan & Kas Bon'
}

const categoryColors = {
  hr: { colorClass: 'halo-purple', badgeClass: 'tag-purple' },
  whatsapp: { colorClass: 'halo-cyan', badgeClass: 'tag-cyan' },
  service: { colorClass: 'halo-indigo', badgeClass: 'tag-indigo' },
  finance: { colorClass: 'halo-amber', badgeClass: 'tag-amber' }
}

const form = reactive({
  id: '',
  name: '',
  priceMonthly: 25000,
  category: 'hr',
  categoryLabel: 'SDM & Karyawan',
  icon: 'sparkles',
  targetSectors: '',
  shortDesc: '',
  featuresText: '',
  demoType: 'commission'
})

function resetForm() {
  form.id = ''
  form.name = ''
  form.priceMonthly = 25000
  form.category = 'hr'
  form.categoryLabel = 'SDM & Karyawan'
  form.icon = 'sparkles'
  form.targetSectors = ''
  form.shortDesc = ''
  form.featuresText = ''
  form.demoType = 'commission'
}

function syncCategoryLabel() {
  form.categoryLabel = categoryLabels[form.category] || 'Ekstensi Modular'
}

watch(() => props.pluginData, (val) => {
  if (val) {
    form.id = val.id
    form.name = val.name || ''
    form.priceMonthly = val.priceMonthly || 0
    form.category = val.category || 'hr'
    form.categoryLabel = val.categoryLabel || categoryLabels[val.category] || 'SDM & Karyawan'
    form.icon = val.icon || 'sparkles'
    form.targetSectors = val.targetSectors || ''
    form.shortDesc = val.shortDesc || ''
    form.featuresText = Array.isArray(val.features) ? val.features.join('\n') : ''
    form.demoType = val.demoType || 'commission'
  } else {
    resetForm()
  }
}, { immediate: true })

function handleSubmit() {
  isSubmitting.value = true

  const features = form.featuresText
    .split('\n')
    .map(f => f.trim())
    .filter(f => f.length > 0)

  const colors = categoryColors[form.category] || { colorClass: 'halo-blue', badgeClass: 'tag-blue' }

  const payload = {
    name: form.name,
    priceMonthly: Number(form.priceMonthly) || 0,
    category: form.category,
    categoryLabel: form.categoryLabel,
    icon: form.icon,
    colorClass: colors.colorClass,
    badgeClass: colors.badgeClass,
    targetSectors: form.targetSectors,
    shortDesc: form.shortDesc,
    features,
    demoType: form.demoType
  }

  setTimeout(() => {
    if (isEdit.value) {
      pluginStore.updatePlugin(form.id, payload)
    } else {
      payload.id = `plugin_${form.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
      pluginStore.createPlugin(payload)
    }
    isSubmitting.value = false
    emit('update:modelValue', false)
    emit('success')
  }, 400)
}
</script>
