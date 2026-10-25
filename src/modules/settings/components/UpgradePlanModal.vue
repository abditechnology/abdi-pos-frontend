<template>
  <BaseModal
    :model-value="modelValue"
    title="Upgrade Paket Langganan SaaS"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="space-y-6">
      <p class="text-xs text-slate-600 text-center max-w-md mx-auto">
        Tingkatkan kapasitas gerai cabang, batas staf kasir, dan buka fitur premium seperti multi-outlet dan custom domain.
      </p>

      <!-- Plans Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Starter Plan -->
        <div class="plan-card">
          <div class="plan-header">
            <span class="plan-name">Starter Plan</span>
            <div class="plan-price font-mono">Rp 99.000<span class="text-xs font-normal">/bln</span></div>
            <p class="plan-desc">Cocok untuk 1 gerai rintisan mandiri</p>
          </div>
          <ul class="plan-features text-xs space-y-2">
            <li>✓ Maksimal 1 Cabang</li>
            <li>✓ 2 Akun Kasir</li>
            <li>✓ Transaksi Unlimited</li>
            <li class="text-slate-400">✕ Custom Domain</li>
            <li class="text-slate-400">✕ Manajemen Inventaris Multi-gudang</li>
          </ul>
          <BaseButton variant="secondary" size="sm" class="w-full mt-4" disabled>
            Paket Lebih Rendah
          </BaseButton>
        </div>

        <!-- Pro Plan (Current Active) -->
        <div class="plan-card active-card border-blue-500 shadow-md">
          <div class="active-badge">Paket Aktif Saat Ini</div>
          <div class="plan-header">
            <span class="plan-name text-blue-600">Pro Plan</span>
            <div class="plan-price font-mono text-blue-900">Rp 299.000<span class="text-xs font-normal">/bln</span></div>
            <p class="plan-desc">Bisnis berkembang dengan banyak cabang</p>
          </div>
          <ul class="plan-features text-xs space-y-2">
            <li>✓ Hingga 5 Cabang Outlet</li>
            <li>✓ 15 Akun Kasir & Supervisor</li>
            <li>✓ Self-Order QR Meja Digital</li>
            <li>✓ Custom Domain Toko (.com / .id)</li>
            <li>✓ Mutasi Stok & Penyesuaian Opname</li>
          </ul>
          <BaseButton variant="primary" size="sm" class="w-full mt-4" disabled>
            Sedang Digunakan
          </BaseButton>
        </div>

        <!-- Enterprise Plan -->
        <div class="plan-card">
          <div class="plan-header">
            <span class="plan-name text-purple-600">Enterprise Plan</span>
            <div class="plan-price font-mono text-purple-900">Rp 799.000<span class="text-xs font-normal">/bln</span></div>
            <p class="plan-desc">Jaringan waralaba & multi-cabang besar</p>
          </div>
          <ul class="plan-features text-xs space-y-2">
            <li>✓ Unlimited Cabang Outlet</li>
            <li>✓ Unlimited Akun Staf Kasir</li>
            <li>✓ Dedicated API & Webhook POS</li>
            <li>✓ Multi-Tenant Franchise Whitelabel</li>
            <li>✓ Priority Support 24/7 SLA</li>
          </ul>
          <BaseButton
            variant="primary"
            size="sm"
            class="w-full mt-4"
            :loading="isUpgrading"
            @click="handleUpgrade('Enterprise Plan')"
          >
            Upgrade ke Enterprise
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
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

function handleUpgrade(planName) {
  isUpgrading.value = true
  setTimeout(() => {
    isUpgrading.value = false
    toast.success(`Faktur tagihan upgrade ke ${planName} telah diterbitkan via Virtual Account!`)
    emit('update:modelValue', false)
  }, 1200)
}
</script>

<style scoped>
.plan-card {
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #ffffff;
  position: relative;
}

.active-card {
  border-width: 2px;
  background: #f0f9ff;
}

.active-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #0284c7;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 9999px;
  letter-spacing: 0.5px;
}

.plan-name {
  font-size: 0.95rem;
  font-weight: 800;
  display: block;
}

.plan-price {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0.25rem 0;
}

.plan-desc {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.plan-features {
  border-top: 1px dashed #cbd5e1;
  padding-top: 0.75rem;
  color: #334155;
}
</style>
