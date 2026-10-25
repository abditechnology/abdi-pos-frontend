<template>
  <BaseModal
    :model-value="modelValue"
    title="Detail Struk Transaksi"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="transaction" class="receipt-wrapper">
      <!-- Thermal Paper Simulator Container -->
      <div class="thermal-receipt">
        <!-- Store Header -->
        <div class="receipt-header">
          <div class="store-badge">ABDI POS</div>
          <h3 class="store-name">{{ transaction.outletName || 'Abdi Martabak & Terang Bulan' }}</h3>
          <p class="store-sub">Jl. Boulevard Raya Blok RGM No. 12, Bekasi Selatan</p>
          <p class="store-sub">Telp: 0812-3456-7890 • POS SaaS Multi-outlet</p>
          <div class="receipt-divider-dashed"></div>
        </div>

        <!-- Meta Info -->
        <div class="receipt-meta">
          <div class="meta-row">
            <span>No. Struk</span>
            <span class="font-mono font-bold">{{ transaction.invoiceNumber }}</span>
          </div>
          <div class="meta-row">
            <span>Waktu</span>
            <span>{{ transaction.date }}</span>
          </div>
          <div class="meta-row">
            <span>Kasir</span>
            <span>{{ transaction.cashierName }}</span>
          </div>
          <div class="meta-row">
            <span>Pelanggan</span>
            <span>{{ transaction.customerName }} ({{ transaction.customerPhone || '-' }})</span>
          </div>
          <div v-if="transaction.notes" class="meta-row">
            <span>Keterangan</span>
            <span class="text-blue-600 font-medium">{{ transaction.notes }}</span>
          </div>
          <div class="meta-row">
            <span>Status</span>
            <span :class="transaction.status === 'PAID' ? 'status-paid' : 'status-void'">
              {{ transaction.status === 'PAID' ? '● LUNAS / BERHASIL' : '✕ DIBATALKAN (VOID)' }}
            </span>
          </div>
          <div v-if="transaction.status === 'VOID'" class="void-box">
            <p class="void-title">Alasan Pembatalan:</p>
            <p class="void-desc">{{ transaction.voidReason || 'Dibatalkan oleh kasir' }}</p>
            <p class="void-by">Oleh: {{ transaction.voidedBy || transaction.cashierName }}</p>
          </div>
          <div class="receipt-divider-dashed"></div>
        </div>

        <!-- Itemized List -->
        <div class="receipt-items">
          <div v-for="(item, idx) in transaction.items" :key="idx" class="receipt-item-row">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-calc">
              <span>{{ item.qty }}x @{{ formatRp(item.price) }}</span>
              <span class="font-bold">{{ formatRp(item.subtotal || item.qty * item.price) }}</span>
            </div>
          </div>
          <div class="receipt-divider-dashed"></div>
        </div>

        <!-- Totals & Payment -->
        <div class="receipt-summary">
          <div class="sum-row">
            <span>Subtotal</span>
            <span>{{ formatRp(transaction.subtotal) }}</span>
          </div>
          <div v-if="transaction.discount > 0" class="sum-row text-emerald-600">
            <span>Diskon Promosi</span>
            <span>-{{ formatRp(transaction.discount) }}</span>
          </div>
          <div class="sum-row">
            <span>PPN (11%)</span>
            <span>{{ formatRp(transaction.tax) }}</span>
          </div>
          <div class="receipt-divider-double"></div>
          <div class="sum-row total-row">
            <span>TOTAL BAYAR</span>
            <span class="total-amount">{{ formatRp(transaction.total) }}</span>
          </div>
          <div class="receipt-divider-double"></div>

          <div class="sum-row font-medium">
            <span>Metode Pembayaran</span>
            <span class="font-bold text-blue-700">{{ transaction.paymentMethod }}</span>
          </div>

          <template v-if="transaction.paymentMethod === 'TUNAI' && transaction.amountPaid">
            <div class="sum-row">
              <span>Jumlah Diterima</span>
              <span>{{ formatRp(transaction.amountPaid) }}</span>
            </div>
            <div class="sum-row">
              <span>Kembalian</span>
              <span>{{ formatRp(transaction.change || 0) }}</span>
            </div>
          </template>
        </div>

        <!-- Receipt Footer Note -->
        <div class="receipt-footer">
          <div class="receipt-divider-dashed"></div>
          <p class="footer-msg">Terima kasih atas kunjungan Anda!</p>
          <p class="footer-sub">Simpan struk ini sebagai bukti pembayaran sah.</p>
          <div class="barcode-stub">
            ||| | | |||| || | ||||| |||| | ||
            <div class="barcode-text">{{ transaction.invoiceNumber }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Footer Actions -->
    <template #footer>
      <div class="modal-actions-bar">
        <div class="left-actions">
          <BaseButton
            v-if="transaction && transaction.status === 'PAID'"
            variant="danger"
            size="sm"
            @click="handleInitiateVoid"
          >
            <AppIcon name="alert-circle" :size="16" />
            Void / Batalkan Struk
          </BaseButton>
        </div>

        <div class="right-actions">
          <BaseButton variant="secondary" size="md" @click="$emit('update:modelValue', false)">
            Tutup
          </BaseButton>
          <BaseButton
            variant="primary"
            size="md"
            :loading="isPrinting"
            @click="simulatePrint"
          >
            <AppIcon name="printer" :size="16" />
            {{ isPrinting ? 'Mencetak...' : 'Cetak Struk Thermal' }}
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>

  <!-- Confirm Void Dialog -->
  <ConfirmModal
    v-model="showVoidConfirm"
    title="Batalkan Transaksi (Void)?"
    confirm-text="Ya, Batalkan Struk"
    variant="danger"
    @confirm="confirmVoidAction"
  >
    <div class="space-y-3">
      <p class="text-sm text-slate-600">
        Apakah Anda yakin ingin membatalkan transaksi <strong>{{ transaction?.invoiceNumber }}</strong> senilai
        <strong>{{ formatRp(transaction?.total || 0) }}</strong>?
      </p>
      <div class="form-group">
        <label class="form-label text-xs font-semibold text-slate-700">Alasan Void Transaksi *</label>
        <textarea
          v-model="voidReasonInput"
          class="form-textarea"
          rows="2"
          placeholder="Contoh: Pelanggan salah pesan item / komplain / struk ganda"
        ></textarea>
      </div>
    </div>
  </ConfirmModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import ConfirmModal from '@/shared/components/ui/ConfirmModal.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import { useToast } from '@/shared/composables/useToast'
import { useTransactionStore } from '../stores/transactionStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  transaction: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'transaction-updated'])

const toast = useToast()
const transactionStore = useTransactionStore()

const isPrinting = ref(false)
const showVoidConfirm = ref(false)
const voidReasonInput = ref('')

function formatRp(val) {
  if (typeof val !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

function simulatePrint() {
  isPrinting.value = true
  setTimeout(() => {
    isPrinting.value = false
    toast.success('Struk berhasil dikirim ke printer kasir 58mm/80mm!')
  }, 1200)
}

function handleInitiateVoid() {
  voidReasonInput.value = ''
  showVoidConfirm.value = true
}

function confirmVoidAction() {
  if (!props.transaction) return
  if (!voidReasonInput.value.trim()) {
    toast.error('Mohon masukkan alasan pembatalan transaksi!')
    return
  }

  transactionStore.voidTransaction(
    props.transaction.id,
    voidReasonInput.value.trim(),
    'Kasir Aktif'
  )
  showVoidConfirm.value = false
  toast.warning(`Transaksi ${props.transaction.invoiceNumber} berhasil di-VOID.`)
  emit('transaction-updated')
}
</script>

<style scoped>
.receipt-wrapper {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  background-color: #f1f5f9;
  border-radius: var(--radius-lg);
}

.thermal-receipt {
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  padding: 1.5rem 1.25rem;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Courier New', Courier, monospace;
  color: #1e293b;
  font-size: 0.825rem;
  line-height: 1.4;
}

.receipt-header {
  text-align: center;
}

.store-badge {
  display: inline-block;
  background: #0284c7;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  margin-bottom: 0.4rem;
}

.store-name {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.store-sub {
  font-size: 0.75rem;
  color: #64748b;
  margin: 2px 0 0;
}

.receipt-divider-dashed {
  border-top: 1px dashed #cbd5e1;
  margin: 0.75rem 0;
}

.receipt-divider-double {
  border-top: 2px double #94a3b8;
  margin: 0.5rem 0;
}

.receipt-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.775rem;
}

.status-paid {
  color: #16a34a;
  font-weight: bold;
}

.status-void {
  color: #dc2626;
  font-weight: bold;
}

.void-box {
  margin-top: 0.4rem;
  padding: 0.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  font-size: 0.75rem;
}

.void-title {
  font-weight: bold;
  color: #991b1b;
  margin: 0 0 2px;
}

.void-desc {
  color: #b91c1c;
  margin: 0 0 2px;
  font-style: italic;
}

.void-by {
  font-size: 0.7rem;
  color: #7f1d1d;
  margin: 0;
}

.receipt-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.receipt-item-row {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 600;
  color: #1e293b;
}

.item-calc {
  display: flex;
  justify-content: space-between;
  color: #475569;
  font-size: 0.775rem;
}

.receipt-summary {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sum-row {
  display: flex;
  justify-content: space-between;
}

.total-row {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.total-amount {
  color: #0284c7;
}

.receipt-footer {
  text-align: center;
}

.footer-msg {
  font-weight: 600;
  margin: 0;
}

.footer-sub {
  font-size: 0.7rem;
  color: #64748b;
  margin: 2px 0 0.5rem;
}

.barcode-stub {
  letter-spacing: 2px;
  font-weight: bold;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #334155;
}

.barcode-text {
  letter-spacing: 1px;
  font-size: 0.65rem;
  color: #64748b;
  margin-top: 2px;
}

.modal-actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.right-actions {
  display: flex;
  gap: 0.5rem;
}

.form-group {
  margin-top: 0.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.25rem;
}

.form-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.form-textarea:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
}
</style>
