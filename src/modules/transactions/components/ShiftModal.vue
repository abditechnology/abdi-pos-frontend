<template>
  <BaseModal
    :model-value="modelValue"
    :title="isClosing ? 'Tutup Shift & Rekonsiliasi Kas' : 'Buka Shift Kasir Baru'"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <form @submit.prevent="handleSubmit" class="shift-form">
      <!-- Alert banner if closing -->
      <BaseAlert v-if="isClosing" variant="warning">
        Hitung uang tunai fisik di laci kasir (cash drawer) secara teliti sebelum menutup shift.
      </BaseAlert>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Cabang / Outlet</label>
          <input
            type="text"
            class="form-input bg-slate-50 text-slate-600"
            :value="outletName"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">Nama Kasir</label>
          <input
            type="text"
            class="form-input bg-slate-50 text-slate-600"
            :value="cashierName"
            readonly
          />
        </div>
      </div>

      <!-- Mode Buka Shift -->
      <template v-if="!isClosing">
        <div class="form-group">
          <label class="form-label required">Modal Kas Awal (Rp)</label>
          <div class="relative">
            <span class="currency-prefix">Rp</span>
            <input
              v-model.number="form.startingCash"
              type="number"
              min="0"
              step="5000"
              class="form-input with-prefix font-bold text-lg text-blue-700"
              placeholder="Contoh: 200000"
              required
            />
          </div>
          <span class="form-hint">Uang kembalian yang dimasukkan ke laci kasir saat awal shift.</span>
        </div>
      </template>

      <!-- Mode Tutup Shift -->
      <template v-else>
        <div class="reconciliation-panel">
          <div class="recon-row">
            <span class="text-slate-600">Kas Awal:</span>
            <span class="font-semibold">{{ formatRp(activeShift?.startingCash || 0) }}</span>
          </div>
          <div class="recon-row">
            <span class="text-slate-600">Total Kas Sistem (Seharusnya):</span>
            <span class="font-bold text-slate-900">{{ formatRp(activeShift?.expectedCash || 0) }}</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">Jumlah Uang Kas Fisik di Laci (Rp)</label>
          <div class="relative">
            <span class="currency-prefix">Rp</span>
            <input
              v-model.number="form.actualCash"
              type="number"
              min="0"
              class="form-input with-prefix font-bold text-lg"
              placeholder="Masukkan total uang cash hasil hitung fisik"
              required
            />
          </div>
        </div>

        <!-- Difference calculation banner -->
        <div
          v-if="form.actualCash !== null && form.actualCash !== undefined && form.actualCash !== ''"
          class="discrepancy-box"
          :class="{
            'exact-match': calculatedDiff === 0,
            'shortage': calculatedDiff < 0,
            'overage': calculatedDiff > 0
          }"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm font-semibold">
              {{ calculatedDiff === 0 ? '✓ Kas Seimbang (Pas)' : calculatedDiff < 0 ? '⚠ Kas Kurang (Minus)' : '★ Kas Lebih (Surplus)' }}
            </span>
            <span class="text-base font-bold font-mono">
              {{ formatRp(calculatedDiff) }}
            </span>
          </div>
        </div>
      </template>

      <div class="form-group">
        <label class="form-label">Catatan Serah Terima / Keterangan</label>
        <textarea
          v-model="form.notes"
          rows="2"
          class="form-textarea"
          :placeholder="isClosing ? 'Contoh: Laci kasir diserahterimakan ke shift malam dalam kondisi bersih' : 'Catatan pembukaan shift (opsional)'"
        ></textarea>
      </div>

      <div class="modal-form-actions">
        <BaseButton variant="secondary" type="button" @click="$emit('update:modelValue', false)">
          Batal
        </BaseButton>
        <BaseButton :variant="isClosing ? 'danger' : 'primary'" type="submit" :loading="isSubmitting">
          {{ isClosing ? 'Konfirmasi Tutup Shift' : 'Buka Shift Sekarang' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseAlert from '@/shared/components/ui/BaseAlert.vue'
import { useToast } from '@/shared/composables/useToast'
import { useOutletStore } from '@/shared/stores/outletStore'
import { useAuthStore } from '@/shared/stores/authStore'
import { useTransactionStore } from '../stores/transactionStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  shiftToClose: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'shift-saved'])

const toast = useToast()
const outletStore = useOutletStore()
const authStore = useAuthStore()
const transactionStore = useTransactionStore()

const isSubmitting = ref(false)
const isClosing = computed(() => !!props.shiftToClose)
const activeShift = computed(() => props.shiftToClose)

const outletName = computed(() => outletStore.currentOutlet?.name || 'Cabang Utama')
const cashierName = computed(() => authStore.user?.name || 'Ahmad Faiz')

const form = reactive({
  startingCash: 200000,
  actualCash: null,
  notes: ''
})

const calculatedDiff = computed(() => {
  if (form.actualCash === null || form.actualCash === undefined) return 0
  const expected = activeShift.value?.expectedCash || 0
  return Number(form.actualCash) - expected
})

function formatRp(val) {
  if (typeof val !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

// Ensure resetForm is declared BEFORE watch
function resetForm() {
  if (props.shiftToClose) {
    form.actualCash = props.shiftToClose.expectedCash
    form.notes = ''
  } else {
    form.startingCash = 200000
    form.actualCash = null
    form.notes = ''
  }
}

watch(
  () => props.shiftToClose,
  () => {
    resetForm()
  },
  { immediate: true }
)

function handleSubmit() {
  isSubmitting.value = true
  try {
    if (isClosing.value) {
      if (form.actualCash === null || form.actualCash === undefined) {
        toast.error('Masukkan jumlah uang fisik di laci kasir!')
        isSubmitting.value = false
        return
      }

      transactionStore.closeShift({
        shiftId: props.shiftToClose.id,
        actualCash: form.actualCash,
        notes: form.notes
      })
      toast.success('Shift kasir berhasil ditutup dan direkonsiliasi!')
    } else {
      transactionStore.openShift({
        outletId: outletStore.currentOutlet?.id || 'out-01',
        cashierId: authStore.user?.id || 'usr-02',
        cashierName: cashierName.value,
        startingCash: form.startingCash,
        notes: form.notes
      })
      toast.success('Shift kasir berhasil dibuka!')
    }

    emit('update:modelValue', false)
    emit('shift-saved')
  } catch (err) {
    toast.error('Gagal memproses shift kasir.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.shift-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
  background-color: #ffffff;
  transition: all var(--duration-fast);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.currency-prefix {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 700;
  color: #64748b;
  font-size: 0.9rem;
}

.form-input.with-prefix {
  padding-left: 2.5rem;
}

.form-hint {
  font-size: 0.75rem;
  color: #64748b;
}

.reconciliation-panel {
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
}

.recon-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.discrepancy-box {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  margin-top: -0.5rem;
}

.exact-match {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.shortage {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.overage {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.modal-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
