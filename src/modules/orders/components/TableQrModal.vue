<template>
  <BaseModal
    :model-value="modelValue"
    title="QR Meja & Self-Order Digital"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="table" class="qr-modal-body">
      <!-- Acrylic Standee Simulator -->
      <div class="acrylic-standee">
        <div class="standee-header">
          <div class="standee-brand">ABDI MARTABAK</div>
          <div class="standee-table-badge">{{ table.number }}</div>
          <p class="standee-instruction">Scan QR untuk Pesan & Bayar Langsung</p>
        </div>

        <div class="qr-code-box">
          <!-- Realistic SVG QR Representation -->
          <svg viewBox="0 0 100 100" class="qr-svg">
            <rect width="100" height="100" fill="#ffffff" />
            <!-- Corners -->
            <rect x="10" y="10" width="24" height="24" fill="#0f172a" rx="4" />
            <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="2" />
            <rect x="18" y="18" width="8" height="8" fill="#0284c7" />

            <rect x="66" y="10" width="24" height="24" fill="#0f172a" rx="4" />
            <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="2" />
            <rect x="74" y="18" width="8" height="8" fill="#0284c7" />

            <rect x="10" y="66" width="24" height="24" fill="#0f172a" rx="4" />
            <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="2" />
            <rect x="18" y="74" width="8" height="8" fill="#0284c7" />

            <!-- Pattern Dots -->
            <circle cx="42" cy="18" r="3" fill="#0f172a" />
            <circle cx="50" cy="18" r="3" fill="#0f172a" />
            <circle cx="42" cy="26" r="3" fill="#0f172a" />
            <circle cx="50" cy="34" r="3" fill="#0f172a" />
            <circle cx="18" cy="46" r="3" fill="#0f172a" />
            <circle cx="26" cy="46" r="3" fill="#0f172a" />
            <circle cx="34" cy="46" r="3" fill="#0f172a" />
            <circle cx="46" cy="46" r="4" fill="#0284c7" />
            <circle cx="58" cy="46" r="3" fill="#0f172a" />
            <circle cx="70" cy="46" r="3" fill="#0f172a" />
            <circle cx="82" cy="46" r="3" fill="#0f172a" />
            <circle cx="42" cy="58" r="3" fill="#0f172a" />
            <circle cx="54" cy="58" r="3" fill="#0f172a" />
            <circle cx="66" cy="58" r="3" fill="#0f172a" />
            <circle cx="78" cy="58" r="3" fill="#0f172a" />
            <circle cx="42" cy="74" r="3" fill="#0f172a" />
            <circle cx="50" cy="82" r="3" fill="#0f172a" />
            <circle cx="62" cy="74" r="3" fill="#0f172a" />
            <circle cx="74" cy="82" r="3" fill="#0f172a" />
            <circle cx="82" cy="70" r="3" fill="#0f172a" />
          </svg>
          <div class="qr-center-logo">
            <AppIcon name="cart" :size="18" class="text-blue-600" />
          </div>
        </div>

        <div class="standee-footer">
          <p class="font-bold text-slate-800 text-xs">Tanpa Antre di Kasir</p>
          <p class="text-slate-500 text-[11px] mt-0.5">Buka kamera HP Anda & arahkan ke kode QR ini</p>
          <div class="standee-url font-mono">{{ orderUrl }}</div>
        </div>
      </div>

      <!-- Action Options -->
      <div class="flex flex-col gap-2 w-full">
        <BaseButton variant="secondary" size="md" @click="copyOrderLink">
          <AppIcon name="copy" :size="16" />
          Salin URL Pemesanan Meja
        </BaseButton>
        <BaseButton variant="primary" size="md" @click="simulatePrintStandee">
          <AppIcon name="printer" :size="16" />
          Cetak Stand Akrilik Meja (PDF/Print)
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import { useToast } from '@/shared/composables/useToast'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  table: {
    type: Object,
    default: null
  }
})

defineEmits(['update:modelValue'])

const toast = useToast()

const orderUrl = computed(() => {
  const tableSlug = props.table ? props.table.number.toLowerCase().replace(/\s+/g, '-') : 'meja'
  return `https://order.abdipos.com/m/${tableSlug}`
})

function copyOrderLink() {
  navigator.clipboard.writeText(orderUrl.value)
  toast.success('Link pemesanan meja berhasil disalin ke clipboard!')
}

function simulatePrintStandee() {
  toast.success(`Mencetak template standee QR untuk ${props.table?.number}...`)
}
</script>

<style scoped>
.qr-modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.acrylic-standee {
  width: 100%;
  max-width: 320px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem 1.25rem;
  text-align: center;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}

.standee-brand {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: #0284c7;
}

.standee-table-badge {
  display: inline-block;
  margin: 0.5rem 0;
  background: #0f172a;
  color: #ffffff;
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.standee-instruction {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0.25rem 0 1rem;
}

.qr-code-box {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
  padding: 8px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.qr-svg {
  width: 100%;
  height: 100%;
}

.qr-center-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  background: #ffffff;
  border: 2px solid #0284c7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.standee-footer {
  margin-top: 1rem;
}

.standee-url {
  font-size: 0.65rem;
  color: #94a3b8;
  margin-top: 0.5rem;
  padding: 2px 8px;
  background: #f1f5f9;
  border-radius: 4px;
  display: inline-block;
}
</style>
