<template>
  <BaseModal
    :model-value="modelValue"
    title="Pilihan Paket Langganan Abdi POS"
    size="xl"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="space-y-6">
      <div class="text-center max-w-xl mx-auto">
        <p class="text-xs text-slate-500">
          Tingkatkan skala usaha Anda dari kedai tunggal hingga puluhan cabang dengan fitur kasir modern dan add-on plugin modular.
        </p>
      </div>

      <!-- Plans Grid (4 Tiers) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. Free Plan -->
        <div class="plan-card">
          <div class="plan-header">
            <div class="plan-badge-top badge-slate">Trial 30 Hari</div>
            <span class="plan-name">Free Plan</span>
            <div class="plan-price font-mono">Rp 0<span class="price-period">/ 30 hari</span></div>
            <p class="plan-desc">Uji coba lengkap fitur kasir untuk rintisan awal</p>
          </div>
          <ul class="plan-features">
            <li><span class="tick">✓</span> 1 Cabang Outlet</li>
            <li><span class="tick">✓</span> 1 Akun</li>
            <li><span class="tick">✓</span> Katalog Maks. 20 Menu</li>
            <li><span class="tick">✓</span> Maks. 50 Transaksi</li>
            <li><span class="tick">✓</span> Laporan Penjualan Harian</li>
            <li class="disabled"><span class="cross">✕</span> Buka-Tutup Shift Kasir</li>
            <li class="disabled"><span class="cross">✕</span> Program Member & Poin</li>
            <li class="disabled"><span class="cross">✕</span> Kitchen Display (KDS)</li>
          </ul>
          <BaseButton variant="secondary" size="sm" class="w-full mt-4" disabled>
            Trial Selesai
          </BaseButton>
        </div>

        <!-- 2. Ekonomis UMKM -->
        <div class="plan-card">
          <div class="plan-header">
            <div class="plan-badge-top badge-emerald">Ekonomis</div>
            <span class="plan-name text-emerald-700">Ekonomis UMKM</span>
            <div class="plan-price font-mono text-emerald-900">Rp 49.000<span class="price-period">/bln</span></div>
            <p class="plan-desc">Solusi hemat & lengkap untuk pemilik usaha mandiri</p>
          </div>
          <ul class="plan-features">
            <li><span class="tick">✓</span> 1 Cabang Outlet</li>
            <li><span class="tick">✓</span> 2 Akun</li>
            <li><span class="tick">✓</span> Katalog Maks. 20 Menu</li>
            <li><span class="tick">✓</span> Maks. 50 Transaksi Harian</li>
            <li><span class="tick">✓</span> Stok Inventaris & Bahan</li>
            <li class="highlight-feature"><span class="tick">✓</span> <strong>Member & Poin Loyalitas</strong></li>
            <li class="highlight-feature"><span class="tick">✓</span> <strong>Diskon & Bundling Promo</strong></li>
            <li><span class="tick">✓</span> Ekspor Laporan CSV/Excel</li>
            <li class="disabled"><span class="cross">✕</span> Buka-Tutup Shift Kasir</li>
            <li class="disabled"><span class="cross">✕</span> Kitchen Display (KDS)</li>
          </ul>
          <BaseButton
            variant="outline"
            size="sm"
            class="w-full mt-4"
            :loading="isUpgrading && targetPlan === 'Ekonomis UMKM'"
            @click="handleUpgrade('Ekonomis UMKM')"
          >
            Pilih Paket Ini
          </BaseButton>
        </div>

        <!-- 3. Business Pro (Best Seller - Currently Active) -->
        <div class="plan-card active-card">
          <div class="active-badge">Paket Aktif Saat Ini</div>
          <div class="plan-header">
            <div class="plan-badge-top badge-blue">Best Seller</div>
            <span class="plan-name text-blue-700">Business Pro</span>
            <div class="plan-price font-mono text-blue-900">Rp 149.000<span class="price-period">/bln</span></div>
            <p class="plan-desc">Favorit cafe, salon, resto & retail berkembang</p>
          </div>
          <ul class="plan-features">
            <li><span class="tick">✓</span> Maks. 2 Cabang Outlet</li>
            <li><span class="tick">✓</span> 5 Akun</li>
            <li><span class="tick">✓</span> Katalog Maks. 50 Menu</li>
            <li><span class="tick">✓</span> Transaksi Tanpa Batas (Unlimited)</li>
            <li><span class="tick">✓</span> Semua Fitur Paket UMKM</li>
            <li class="highlight-feature"><span class="tick">✓</span> <strong>Buka-Tutup Shift & Kas</strong></li>
            <li><span class="tick">✓</span> Resep Bahan Baku & HPP Otomatis</li>
            <li><span class="tick">✓</span> Laporan Analitik Multi-Cabang</li>
            <li class="disabled"><span class="cross">✕</span> Kitchen Display (KDS)</li>
            <li class="disabled"><span class="cross">✕</span> Custom Domain Toko</li>
          </ul>
          <BaseButton variant="primary" size="sm" class="w-full mt-4" disabled>
            Sedang Digunakan
          </BaseButton>
        </div>

        <!-- 4. Enterprise -->
        <div class="plan-card">
          <div class="plan-header">
            <div class="plan-badge-top badge-purple">Multi-Cabang</div>
            <span class="plan-name text-purple-700">Enterprise</span>
            <div class="plan-price font-mono text-purple-900">Rp 299.000<span class="price-period">/bln</span></div>
            <p class="plan-desc">Jaringan cabang besar, waralaba & franchise</p>
          </div>
          <ul class="plan-features">
            <li><span class="tick">✓</span> Hingga 10 Cabang Outlet</li>
            <li><span class="tick">✓</span> 20 Akun</li>
            <li><span class="tick">✓</span> Katalog Maks. 100 Menu</li>
            <li><span class="tick">✓</span> Semua Fitur Business Pro</li>
            <li class="highlight-feature"><span class="tick">✓</span> <strong>Kitchen Display System (KDS)</strong></li>
            <li class="highlight-feature"><span class="tick">✓</span> <strong>Custom Domain (.com / .id)</strong></li>
            <li><span class="tick">✓</span> Multi-Outlet Central Dashboard</li>
            <li><span class="tick">✓</span> Transfer Stok Antar-Cabang</li>
            <li><span class="tick">✓</span> Konsolidasi Finansial Multi-Cabang</li>
            <li><span class="tick">✓</span> Hak Akses Tingkat Lanjut</li>
          </ul>
          <BaseButton
            variant="primary"
            size="sm"
            class="w-full mt-4"
            :loading="isUpgrading && targetPlan === 'Enterprise'"
            @click="handleUpgrade('Enterprise')"
          >
            Upgrade ke Enterprise
          </BaseButton>
        </div>
      </div>

      <!-- Add-on note -->
      <div class="plugin-addon-notice">
        <AppIcon name="sparkles" :size="16" class="text-purple-600 shrink-0" />
        <span class="text-xs text-slate-600">
          Butuh fitur spesifik seperti <strong>Absensi Selfie GPS, Komisi Karyawan, Meja QR Self-Order, Bot WhatsApp, atau Booking Online</strong>?
          Tersedia add-on plugin mulai <strong>Rp 15.000/bln</strong> di
          <router-link to="/app/plugins" class="font-bold text-purple-700 hover:underline" @click="$emit('update:modelValue', false)">
            Marketplace Plugin
          </router-link>.
        </span>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import { useToast } from '@/shared/composables/useToast'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()
const isUpgrading = ref(false)
const targetPlan = ref('')

function handleUpgrade(planName) {
  targetPlan.value = planName
  isUpgrading.value = true
  setTimeout(() => {
    isUpgrading.value = false
    targetPlan.value = ''
    toast.success(`Faktur tagihan beralih ke paket ${planName} telah diterbitkan via Virtual Account / QRIS!`)
    emit('update:modelValue', false)
  }, 1200)
}
</script>

<style scoped>
.plan-card {
  padding: 1.25rem;
  border-radius: var(--radius-xl);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #ffffff;
  position: relative;
  transition: all 0.2s ease;
}

.plan-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 8px 24px -8px rgba(15, 23, 42, 0.08);
}

.active-card {
  border: 2px solid #2563eb;
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 40%);
  box-shadow: 0 12px 28px -10px rgba(37, 99, 235, 0.2);
}

.active-badge {
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 9999px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}

.plan-badge-top {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-slate {
  background: #f1f5f9;
  color: #475569;
}

.badge-emerald {
  background: #ecfdf5;
  color: #059669;
}

.badge-blue {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-purple {
  background: #f3e8ff;
  color: #7e22ce;
}

.plan-name {
  font-size: 1.05rem;
  font-weight: 800;
  display: block;
  letter-spacing: -0.01em;
}

.plan-price {
  font-size: 1.45rem;
  font-weight: 800;
  margin: 0.25rem 0;
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.price-period {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
}

.plan-desc {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
  min-height: 34px;
  margin-bottom: 0.75rem;
}

.plan-features {
  border-top: 1px dashed #e2e8f0;
  padding-top: 0.85rem;
  color: #334155;
  font-size: 0.75rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex-grow: 1;
}

.plan-features li {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
}

.tick {
  color: #10b981;
  font-weight: 700;
  flex-shrink: 0;
}

.cross {
  color: #94a3b8;
  font-weight: 700;
  flex-shrink: 0;
}

.plan-features li.disabled {
  color: #94a3b8;
}

.plan-features li.highlight-feature {
  color: #0f172a;
}

.plugin-addon-notice {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.15rem;
  background: #faf5ff;
  border: 1px solid #e9d5ff;
  border-radius: var(--radius-lg);
}
</style>