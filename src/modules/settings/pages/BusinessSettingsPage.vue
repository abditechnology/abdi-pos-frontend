<template>
  <div class="settings-page space-y-6">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Pengaturan Bisnis Tenant</h1>
        <p class="page-subtitle">
          Konfigurasi identitas brand, tarif pajak PPN default, dan format cetak struk kasir termal.
        </p>
      </div>

      <div class="header-actions">
        <BaseButton variant="primary" size="md" :loading="isSaving" @click="saveSettings">
          <AppIcon name="check" :size="16" />
          Simpan Seluruh Pengaturan
        </BaseButton>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Col 1: Store Brand & Identity -->
      <BaseCard class="lg:col-span-2 space-y-4">
        <h3 class="font-bold text-slate-800 text-base border-b border-slate-100 pb-2">
          Profil Bisnis & Brand
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label required">Nama Brand / Usaha</label>
            <input
              v-model="form.brandName"
              type="text"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Slogan / Tagline</label>
            <input
              v-model="form.tagline"
              type="text"
              class="form-input"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label required">Email Kontak Resmi</label>
            <input
              v-model="form.businessEmail"
              type="email"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label required">No. WhatsApp Customer Care</label>
            <input
              v-model="form.businessPhone"
              type="tel"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Alamat Kantor Pusat / Manajemen</label>
          <textarea
            v-model="form.headquartersAddress"
            rows="2"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">URL Logo Brand</label>
          <input
            v-model="form.logoUrl"
            type="url"
            class="form-input"
            placeholder="https://domain.com/logo.png"
          />
        </div>
      </BaseCard>

      <!-- Col 2: POS Receipt & Tax Configuration -->
      <BaseCard class="space-y-4">
        <h3 class="font-bold text-slate-800 text-base border-b border-slate-100 pb-2">
          Pajak & Struk Kasir
        </h3>

        <div class="form-group">
          <label class="form-label">Tarif Pajak PPN (%)</label>
          <div class="relative">
            <input
              v-model.number="form.taxRate"
              type="number"
              min="0"
              max="30"
              class="form-input font-bold"
            />
            <span class="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
          </div>
          <span class="text-xs text-slate-500">Standar PPN di Indonesia adalah 11%.</span>
        </div>

        <div class="form-group">
          <label class="form-label">Biaya Layanan Resto (Service %)</label>
          <div class="relative">
            <input
              v-model.number="form.serviceChargeRate"
              type="number"
              min="0"
              max="20"
              class="form-input font-bold"
            />
            <span class="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
          </div>
          <span class="text-xs text-slate-500">Isi 0% bila tidak ada service charge.</span>
        </div>

        <div class="form-group">
          <label class="form-label">Format Nomor Struk</label>
          <input
            v-model="form.invoicePrefix"
            type="text"
            class="form-input font-mono uppercase"
          />
          <span class="text-xs text-slate-500">Contoh hasil: INV-20261025-001</span>
        </div>

        <div class="form-group">
          <label class="form-label">Pesan Footer Struk Kasir</label>
          <textarea
            v-model="form.receiptFooterText"
            rows="2"
            class="form-textarea text-xs font-mono"
          ></textarea>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()
const isSaving = ref(false)

const form = reactive({
  brandName: 'Abdi Martabak & Terang Bulan',
  tagline: 'Martabak Legendaris Rasa Kekinian',
  businessEmail: 'halo@abdimartabak.com',
  businessPhone: '0812-3456-7890',
  headquartersAddress: 'Ruko Boulevard Grand Galaxy City Blok RGM No. 12, Bekasi Selatan, Jawa Barat',
  logoUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150',
  taxRate: 11,
  serviceChargeRate: 0,
  invoicePrefix: 'INV-[YYYYMMDD]-[SEQ]',
  receiptFooterText: 'Terima kasih atas kunjungan Anda!\nKunjungi kami lagi di abdimartabak.com'
})

function saveSettings() {
  isSaving.value = true
  setTimeout(() => {
    isSaving.value = false
    toast.success('Pengaturan bisnis tenant berhasil disimpan!')
  }, 800)
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

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
</style>
