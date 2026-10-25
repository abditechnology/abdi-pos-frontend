<template>
  <BaseModal
    :model-value="modelValue"
    title="Penyesuaian Stok Fisik (Stock Opname)"
    subtitle="Cocokkan jumlah stok fisik di gudang dengan catatan di sistem kasir"
    size="md"
    @update:model-value="val => $emit('update:modelValue', val)"
    @close="resetForm"
  >
    <form @submit.prevent="handleSubmit" class="opname-form">
      <div v-if="materialItem" class="item-summary-card">
        <div class="item-name-group">
          <strong class="item-title">{{ materialItem.name }}</strong>
          <span class="item-sku">SKU: {{ materialItem.sku }} • {{ materialItem.category }}</span>
        </div>

        <div class="system-stock-display">
          <span class="sys-label">Stok Sistem Saat Ini:</span>
          <strong class="sys-val">{{ materialItem.stock }} {{ materialItem.unit }}</strong>
        </div>
      </div>

      <!-- Physical Stock Input -->
      <BaseInput
        v-model="actualStock"
        type="number"
        label="Jumlah Hitungan Fisik Nyata"
        placeholder="0"
        :required="true"
        :help-text="`Satuan: ${materialItem?.unit || 'Unit'}`"
      >
        <template #prefix><AppIcon name="boxes" :size="16" /></template>
      </BaseInput>

      <!-- Difference Indicator -->
      <div v-if="materialItem && actualStock !== ''" class="difference-box">
        <span class="diff-label">Hasil Selisih Stok:</span>
        <div :class="['diff-badge', diffClass]">
          <AppIcon :name="diffIcon" :size="16" />
          <span>{{ differenceText }}</span>
        </div>
      </div>

      <!-- Reason Selection -->
      <div class="reason-group">
        <label class="field-label">Alasan Penyesuaian Stok <span class="req">*</span></label>
        <select v-model="reason" class="app-select">
          <option value="Opname Rutin Mingguan">Opname Rutin Mingguan / Bulanan</option>
          <option value="Bahan Basi / Kedaluwarsa">Bahan Basi / Kedaluwarsa (Expired)</option>
          <option value="Tumpah / Rusak Saat Masak">Tumpah / Rusak Saat Masak</option>
          <option value="Koreksi Salah Input Awal">Koreksi Salah Input Awal</option>
          <option value="Penerimaan Barang Baru">Penerimaan Barang Masuk Tambahan</option>
        </select>
      </div>

      <BaseInput
        v-model="notes"
        label="Catatan Tambahan (Opsional)"
        placeholder="Keterangan penanggung jawab opname"
      />

      <div class="modal-form-actions">
        <BaseButton
          variant="secondary"
          type="button"
          @click="$emit('update:modelValue', false)"
        >
          Batal
        </BaseButton>

        <BaseButton
          variant="primary"
          type="submit"
          :loading="isSubmitting"
        >
          <template #icon><AppIcon name="check-circle" :size="16" /></template>
          Simpan Penyesuaian Stok
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useInventoryStore } from '../stores/inventoryStore'
import BaseModal from '../../../shared/components/ui/BaseModal.vue'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  materialItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const inventoryStore = useInventoryStore()
const isSubmitting = ref(false)

const actualStock = ref(0)
const reason = ref('Opname Rutin Mingguan')
const notes = ref('')

const resetForm = () => {
  actualStock.value = props.materialItem ? props.materialItem.stock : 0
  reason.value = 'Opname Rutin Mingguan'
  notes.value = ''
}

watch(
  () => props.materialItem,
  (val) => {
    if (val) {
      actualStock.value = val.stock
    }
  },
  { immediate: true }
)

const diff = computed(() => {
  if (!props.materialItem) return 0
  return Number(actualStock.value) - props.materialItem.stock
})

const differenceText = computed(() => {
  if (!props.materialItem) return '0'
  if (diff.value === 0) return 'Stok Sesuai (0 Selisih)'
  if (diff.value > 0) return `Surplus +${diff.value} ${props.materialItem.unit}`
  return `Defisit ${diff.value} ${props.materialItem.unit}`
})

const diffClass = computed(() => {
  if (diff.value === 0) return 'diff-match'
  if (diff.value > 0) return 'diff-surplus'
  return 'diff-deficit'
})

const diffIcon = computed(() => {
  if (diff.value === 0) return 'check-circle'
  if (diff.value > 0) return 'trending-up'
  return 'alert-triangle'
})

const handleSubmit = () => {
  if (!props.materialItem) return

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    inventoryStore.adjustStock(
      props.materialItem.id,
      actualStock.value,
      `${reason.value}${notes.value ? ` - ${notes.value}` : ''}`
    )
    emit('update:modelValue', false)
    emit('success')
  }, 400)
}
</script>

<style scoped>
.opname-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-summary-card {
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  background-color: var(--slate-50);
  border: 1px solid var(--border-app);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.item-name-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: 14.5px;
  color: var(--text-main);
}

.item-sku {
  font-size: 11.5px;
  color: var(--text-muted);
}

.system-stock-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.sys-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.sys-val {
  font-size: 15px;
  color: var(--primary-700);
}

.difference-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background-color: #f8fafc;
  border: 1px dashed var(--border-app);
}

.diff-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.diff-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12.5px;
  font-weight: 700;
}

.diff-match { background-color: #eff6ff; color: #2563eb; }
.diff-surplus { background-color: #ecfdf5; color: #059669; }
.diff-deficit { background-color: #fef2f2; color: #dc2626; }

.reason-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.req {
  color: var(--danger-500);
}

.app-select {
  height: 42px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  background-color: #ffffff;
  font-size: 13.5px;
  color: var(--text-main);
  outline: none;
  cursor: pointer;
}

.modal-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--border-app);
  margin-top: 8px;
}
</style>
