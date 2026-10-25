<template>
  <div class="orders-page space-y-6">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Pesanan Self-Order & Meja</h1>
        <p class="page-subtitle">
          Kitchen Display System (KDS) live kanban, antrean masak dapur, dan pengaturan kode QR meja pelanggan.
        </p>
      </div>

      <div class="header-actions">
        <div class="view-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'kanban' }"
            @click="activeTab = 'kanban'"
          >
            <AppIcon name="cart" :size="16" />
            Kitchen Display (Live KDS)
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'tables' }"
            @click="activeTab = 'tables'"
          >
            <AppIcon name="qr" :size="16" />
            Daftar Meja & QR
          </button>
        </div>

        <BaseButton
          v-if="activeTab === 'tables'"
          variant="primary"
          size="md"
          @click="openAddTableModal"
        >
          <AppIcon name="plus" :size="16" />
          Tambah Meja Baru
        </BaseButton>
      </div>
    </div>

    <!-- TAB 1: KITCHEN DISPLAY / LIVE ORDER KANBAN -->
    <div v-if="activeTab === 'kanban'" class="kanban-container">
      <!-- Column 1: PENDING -->
      <div class="kanban-column">
        <div class="column-header border-amber-400 bg-amber-50">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
            <span class="font-bold text-amber-900 text-sm">Pesanan Baru Masuk</span>
          </div>
          <span class="badge-count bg-amber-200 text-amber-900">{{ orderStore.pendingOrders.length }}</span>
        </div>

        <div class="column-cards">
          <div
            v-for="order in orderStore.pendingOrders"
            :key="order.id"
            class="order-card border-l-4 border-l-amber-500"
          >
            <div class="order-top">
              <span class="order-table">{{ order.tableNumber }}</span>
              <span class="order-time">{{ order.time }}</span>
            </div>
            <div class="order-customer">
              <span class="font-medium text-slate-800 text-xs">{{ order.customerName }}</span>
              <span class="order-no">{{ order.orderNumber }}</span>
            </div>

            <div class="order-items-list">
              <div v-for="(it, idx) in order.items" :key="idx" class="order-item">
                <span class="item-qty">{{ it.qty }}x</span>
                <span class="item-name">{{ it.name }}</span>
                <span v-if="it.notes" class="item-note">({{ it.notes }})</span>
              </div>
            </div>

            <div class="order-bottom">
              <span class="order-total font-mono">{{ formatRp(order.total) }}</span>
              <BaseButton
                variant="primary"
                size="sm"
                @click="advanceOrder(order.id, 'COOKING')"
              >
                Mulai Masak →
              </BaseButton>
            </div>
          </div>

          <div v-if="orderStore.pendingOrders.length === 0" class="empty-column">
            Tidak ada pesanan baru
          </div>
        </div>
      </div>

      <!-- Column 2: COOKING -->
      <div class="kanban-column">
        <div class="column-header border-blue-400 bg-blue-50">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
            <span class="font-bold text-blue-900 text-sm">Sedang Dimasak (Dapur)</span>
          </div>
          <span class="badge-count bg-blue-200 text-blue-900">{{ orderStore.cookingOrders.length }}</span>
        </div>

        <div class="column-cards">
          <div
            v-for="order in orderStore.cookingOrders"
            :key="order.id"
            class="order-card border-l-4 border-l-blue-500"
          >
            <div class="order-top">
              <span class="order-table">{{ order.tableNumber }}</span>
              <span class="order-time">{{ order.time }}</span>
            </div>
            <div class="order-customer">
              <span class="font-medium text-slate-800 text-xs">{{ order.customerName }}</span>
              <span class="order-no">{{ order.orderNumber }}</span>
            </div>

            <div class="order-items-list">
              <div v-for="(it, idx) in order.items" :key="idx" class="order-item">
                <span class="item-qty">{{ it.qty }}x</span>
                <span class="item-name">{{ it.name }}</span>
                <span v-if="it.notes" class="item-note">({{ it.notes }})</span>
              </div>
            </div>

            <div class="order-bottom">
              <span class="order-total font-mono">{{ formatRp(order.total) }}</span>
              <BaseButton
                variant="success"
                size="sm"
                @click="advanceOrder(order.id, 'READY')"
              >
                Siap Saji ✓
              </BaseButton>
            </div>
          </div>

          <div v-if="orderStore.cookingOrders.length === 0" class="empty-column">
            Semua masakan sudah selesai
          </div>
        </div>
      </div>

      <!-- Column 3: READY TO SERVE -->
      <div class="kanban-column">
        <div class="column-header border-emerald-400 bg-emerald-50">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span class="font-bold text-emerald-900 text-sm">Siap Diantar / Ambil</span>
          </div>
          <span class="badge-count bg-emerald-200 text-emerald-900">{{ orderStore.readyOrders.length }}</span>
        </div>

        <div class="column-cards">
          <div
            v-for="order in orderStore.readyOrders"
            :key="order.id"
            class="order-card border-l-4 border-l-emerald-500"
          >
            <div class="order-top">
              <span class="order-table">{{ order.tableNumber }}</span>
              <span class="order-time">{{ order.time }}</span>
            </div>
            <div class="order-customer">
              <span class="font-medium text-slate-800 text-xs">{{ order.customerName }}</span>
              <span class="order-no">{{ order.orderNumber }}</span>
            </div>

            <div class="order-items-list">
              <div v-for="(it, idx) in order.items" :key="idx" class="order-item">
                <span class="item-qty">{{ it.qty }}x</span>
                <span class="item-name">{{ it.name }}</span>
              </div>
            </div>

            <div class="order-bottom">
              <span class="order-total font-mono">{{ formatRp(order.total) }}</span>
              <BaseButton
                variant="primary"
                size="sm"
                @click="advanceOrder(order.id, 'COMPLETED')"
              >
                Selesaikan
              </BaseButton>
            </div>
          </div>

          <div v-if="orderStore.readyOrders.length === 0" class="empty-column">
            Tidak ada pesanan menunggu diantar
          </div>
        </div>
      </div>

      <!-- Column 4: COMPLETED -->
      <div class="kanban-column">
        <div class="column-header border-slate-300 bg-slate-100">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-slate-400"></span>
            <span class="font-bold text-slate-700 text-sm">Selesai Hari Ini</span>
          </div>
          <span class="badge-count bg-slate-200 text-slate-700">{{ orderStore.completedOrders.length }}</span>
        </div>

        <div class="column-cards">
          <div
            v-for="order in orderStore.completedOrders"
            :key="order.id"
            class="order-card opacity-75 border-l-4 border-l-slate-400"
          >
            <div class="order-top">
              <span class="order-table">{{ order.tableNumber }}</span>
              <span class="order-time">{{ order.time }}</span>
            </div>
            <div class="order-customer">
              <span class="font-medium text-slate-800 text-xs">{{ order.customerName }}</span>
              <span class="order-no">{{ order.orderNumber }}</span>
            </div>

            <div class="order-items-list text-xs text-slate-500">
              {{ order.items.map(i => `${i.qty}x ${i.name}`).join(', ') }}
            </div>

            <div class="order-bottom">
              <span class="order-total font-mono text-xs">{{ formatRp(order.total) }}</span>
              <span class="text-xs font-semibold text-emerald-600">✓ Selesai</span>
            </div>
          </div>

          <div v-if="orderStore.completedOrders.length === 0" class="empty-column">
            Belum ada pesanan selesai
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: TABLE & QR MANAGEMENT -->
    <div v-else class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <BaseCard
          v-for="table in orderStore.tables"
          :key="table.id"
          class="table-grid-card hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-bold text-slate-900">{{ table.number }}</h3>
              <p class="text-xs text-slate-500">{{ table.area }} • {{ table.capacity }} Kursi</p>
            </div>
            <BaseBadge
              :variant="
                table.status === 'AVAILABLE'
                  ? 'success'
                  : table.status === 'OCCUPIED'
                  ? 'danger'
                  : 'warning'
              "
            >
              {{
                table.status === 'AVAILABLE'
                  ? 'Tersedia'
                  : table.status === 'OCCUPIED'
                  ? 'Terisi'
                  : 'Reserved'
              }}
            </BaseBadge>
          </div>

          <div class="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center my-3">
            <AppIcon name="qr" :size="32" class="text-blue-600 mx-auto mb-1" />
            <span class="text-xs font-semibold text-slate-700 block">Self-Order QR Aktif</span>
            <span class="text-[11px] text-slate-400">Scan & bayar di tempat</span>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-100">
            <BaseButton
              variant="secondary"
              size="sm"
              @click="openQrModal(table)"
            >
              <AppIcon name="qr" :size="14" />
              Lihat QR
            </BaseButton>

            <div class="flex gap-1">
              <BaseButton
                variant="secondary"
                size="sm"
                @click="openEditTableModal(table)"
              >
                <AppIcon name="edit" :size="14" />
              </BaseButton>
              <BaseButton
                variant="danger"
                size="sm"
                @click="confirmDeleteTable(table)"
              >
                <AppIcon name="trash" :size="14" />
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Modals -->
    <TableModal
      v-model="showTableModal"
      :table="selectedTable"
      @table-saved="handleTableSaved"
    />

    <TableQrModal
      v-model="showQrModal"
      :table="selectedTable"
    />

    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Hapus Meja?"
      confirm-text="Ya, Hapus"
      variant="danger"
      @confirm="executeDeleteTable"
    >
      <p class="text-sm text-slate-600">
        Apakah Anda yakin ingin menghapus <strong>{{ tableToDelete?.number }}</strong>? QR meja ini tidak akan dapat diakses pelanggan lagi.
      </p>
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import ConfirmModal from '@/shared/components/ui/ConfirmModal.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import TableModal from '../components/TableModal.vue'
import TableQrModal from '../components/TableQrModal.vue'
import { useOrderStore } from '../stores/orderStore'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()
const orderStore = useOrderStore()

const activeTab = ref('kanban')

const showTableModal = ref(false)
const showQrModal = ref(false)
const showDeleteConfirm = ref(false)

const selectedTable = ref(null)
const tableToDelete = ref(null)

function formatRp(val) {
  if (typeof val !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

function advanceOrder(orderId, nextStatus) {
  orderStore.updateOrderStatus(orderId, nextStatus)
  const statusMsg =
    nextStatus === 'COOKING'
      ? 'Pesanan dikirim ke dapur untuk dimasak'
      : nextStatus === 'READY'
      ? 'Pesanan siap disajikan ke meja!'
      : 'Pesanan diselesaikan'
  toast.success(statusMsg)
}

function openAddTableModal() {
  selectedTable.value = null
  showTableModal.value = true
}

function openEditTableModal(table) {
  selectedTable.value = table
  showTableModal.value = true
}

function openQrModal(table) {
  selectedTable.value = table
  showQrModal.value = true
}

function confirmDeleteTable(table) {
  tableToDelete.value = table
  showDeleteConfirm.value = true
}

function executeDeleteTable() {
  if (tableToDelete.value) {
    orderStore.deleteTable(tableToDelete.value.id)
    toast.success(`Meja ${tableToDelete.value.number} berhasil dihapus.`)
    showDeleteConfirm.value = false
  }
}

function handleTableSaved() {
  selectedTable.value = null
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-tabs {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-md);
  font-size: 0.825rem;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.tab-btn.active {
  background: #ffffff;
  color: #0284c7;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.kanban-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  align-items: start;
}

.kanban-column {
  background: #f8fafc;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
  border-bottom: 2px solid;
}

.badge-count {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
}

.column-cards {
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  flex: 1;
}

.order-card {
  background: #ffffff;
  border-radius: var(--radius-md);
  padding: 0.85rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-table {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
}

.order-time {
  font-size: 0.7rem;
  color: #64748b;
}

.order-customer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 0.35rem;
}

.order-no {
  font-size: 0.7rem;
  font-family: monospace;
  color: #94a3b8;
}

.order-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.order-item {
  display: flex;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #334155;
}

.item-qty {
  font-weight: 700;
  color: #0284c7;
}

.item-name {
  font-weight: 500;
}

.item-note {
  font-size: 0.725rem;
  color: #e11d48;
  font-style: italic;
}

.order-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.4rem;
  border-top: 1px solid #f1f5f9;
}

.order-total {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.875rem;
}

.empty-column {
  text-align: center;
  color: #94a3b8;
  font-size: 0.8rem;
  margin-top: 2rem;
  font-style: italic;
}
</style>
