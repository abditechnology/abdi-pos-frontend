<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-text-wrap">
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

    <div class="settings-grid-layout">
      <!-- Col 1: Store Brand & Identity -->
      <BaseCard class="settings-card card-primary-col">
        <div class="card-section-header">
          <h3 class="card-section-title">Profil Bisnis & Brand</h3>
          <p class="card-section-desc">Identitas toko yang ditampilkan pada struk belanja dan katalog online</p>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Nama Brand / Usaha</label>
            <input
              v-model="form.brandName"
              type="text"
              class="form-input"
              placeholder="Contoh: Abdi Martabak & Terang Bulan"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Slogan / Tagline</label>
            <input
              v-model="form.tagline"
              type="text"
              class="form-input"
              placeholder="Contoh: Martabak Legendaris Rasa Kekinian"
            />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Email Kontak Resmi</label>
            <input
              v-model="form.businessEmail"
              type="email"
              class="form-input"
              placeholder="halo@bisnisanda.com"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label required">No. WhatsApp Customer Care</label>
            <input
              v-model="form.businessPhone"
              type="tel"
              class="form-input"
              placeholder="0812-3456-7890"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Alamat Kantor Pusat / Manajemen</label>
          <textarea
            v-model="form.headquartersAddress"
            rows="3"
            class="form-textarea"
            placeholder="Jalan, Nomor Bangunan, Kota, Kode Pos..."
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
          <span class="form-hint">Disarankan format PNG transparan dengan resolusi 200x200 pixel.</span>
        </div>
      </BaseCard>

      <!-- Col 2: POS Receipt & Tax Configuration -->
      <BaseCard class="settings-card">
        <div class="card-section-header">
          <h3 class="card-section-title">Pajak & Struk Kasir</h3>
          <p class="card-section-desc">Aturan kalkulasi pajak dan format struk thermal</p>
        </div>

        <div class="form-group">
          <label class="form-label">Tarif Pajak PPN (%)</label>
          <div class="input-unit-wrap">
            <input
              v-model.number="form.taxRate"
              type="number"
              min="0"
              max="30"
              class="form-input font-bold"
            />
            <span class="unit-suffix">%</span>
          </div>
          <span class="form-hint">Standar tarif PPN restoran di Indonesia adalah 11%.</span>
        </div>

        <div class="form-group">
          <label class="form-label">Biaya Layanan Resto (Service %)</label>
          <div class="input-unit-wrap">
            <input
              v-model.number="form.serviceChargeRate"
              type="number"
              min="0"
              max="20"
              class="form-input font-bold"
            />
            <span class="unit-suffix">%</span>
          </div>
          <span class="form-hint">Isi 0% bila gerai Anda tidak menerapkan service charge.</span>
        </div>

        <div class="form-group">
          <label class="form-label">Format Nomor Struk Invoice</label>
          <input
            v-model="form.invoicePrefix"
            type="text"
            class="form-input font-mono uppercase font-bold text-blue-700"
          />
          <span class="form-hint">Format otomatis: INV-[YYYYMMDD]-[SEQ]</span>
        </div>

        <div class="form-group">
          <label class="form-label">Pesan Footer Struk Kasir</label>
          <textarea
            v-model="form.receiptFooterText"
            rows="3"
            class="form-textarea text-xs font-mono"
            placeholder="Pesan penutup struk..."
          ></textarea>
          <span class="form-hint">Tercetak di bagian paling bawah kertas struk thermal 58mm/80mm.</span>
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
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.header-text-wrap {
  flex: 1;
}

.page-title {
  font-size: 1.625rem;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.025em;
  color: #0f172a;
  margin: 0;
}

.page-subtitle {
  font-size: 0.925rem;
  line-height: 1.6;
  color: #64748b;
  margin-top: 0.5rem;
}

.header-actions {
  flex-shrink: 0;
}

.settings-grid-layout {
  display: grid;
  grid-template-columns: 1.8fr 1.2fr;
  gap: 1.75rem;
}

@media (max-width: 1024px) {
  .settings-grid-layout {
    grid-template-columns: 1fr;
  }
}

.settings-card {
  padding: 1.75rem 2rem;
}

.card-section-header {
  margin-bottom: 1.75rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.card-section-desc {
  font-size: 0.825rem;
  line-height: 1.5;
  color: #64748b;
  margin-top: 0.35rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 640px) {
  .form-grid-2 {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  line-height: 1.5;
  color: #0f172a;
  background-color: #ffffff;
  transition: all var(--duration-fast);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.form-hint {
  font-size: 0.775rem;
  line-height: 1.4;
  color: #64748b;
  margin-top: 0.25rem;
}

.input-unit-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.unit-suffix {
  position: absolute;
  right: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #94a3b8;
  pointer-events: none;
}
</style>
