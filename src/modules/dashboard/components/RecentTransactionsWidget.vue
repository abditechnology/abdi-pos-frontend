<template>
  <div class="transactions-widget base-card card-bordered card-hover-lift">
    <div class="widget-header">
      <div class="title-meta">
        <div class="header-icon-box">
          <AppIcon name="receipt" :size="20" />
        </div>
        <div>
          <h3 class="widget-title">Transaksi Terkini</h3>
          <p class="widget-subtitle">Aktivitas struk kasir yang masuk secara realtime</p>
        </div>
      </div>

      <router-link to="/app/transactions" class="view-all-link">
        Lihat Semua
        <AppIcon name="chevron-right" :size="16" />
      </router-link>
    </div>

    <!-- Table Container -->
    <div class="table-responsive">
      <table class="pos-table">
        <thead>
          <tr>
            <th>No. Struk</th>
            <th>Waktu & Outlet</th>
            <th>Kasir / Pelanggan</th>
            <th>Metode Bayar</th>
            <th class="text-right">Total Belanja</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="trx in transactions"
            :key="trx.id"
            class="table-row"
          >
            <!-- Invoice ID -->
            <td class="cell-invoice">
              <span class="invoice-number">{{ trx.invoiceNumber }}</span>
              <span class="item-count">{{ trx.itemsCount }} Item</span>
            </td>

            <!-- Time & Outlet -->
            <td class="cell-time">
              <span class="time-text">{{ trx.time }}</span>
              <span class="outlet-pill">{{ trx.outletName }}</span>
            </td>

            <!-- Staff & Customer -->
            <td>
              <div class="staff-info">
                <span class="customer-name">{{ trx.customerName }}</span>
                <span class="cashier-label">Kasir: {{ trx.cashierName }}</span>
              </div>
            </td>

            <!-- Payment Method -->
            <td>
              <span :class="['payment-badge', `pay-${trx.paymentMethod.toLowerCase()}`]">
                <AppIcon :name="getPaymentIcon(trx.paymentMethod)" :size="14" />
                {{ trx.paymentMethod }}
              </span>
            </td>

            <!-- Total Amount -->
            <td class="text-right cell-amount">
              <MoneyDisplay :amount="trx.totalAmount" size="md" variant="primary" />
            </td>

            <!-- Status Badge -->
            <td class="text-center">
              <BaseBadge
                :variant="trx.status === 'success' ? 'success' : trx.status === 'pending' ? 'warning' : 'danger'"
                :dot="true"
                :pulse="trx.status === 'pending'"
                size="sm"
              >
                {{ trx.statusLabel }}
              </BaseBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'
import BaseBadge from '../../../shared/components/ui/BaseBadge.vue'
import MoneyDisplay from '../../../shared/components/ui/MoneyDisplay.vue'

const transactions = ref([
  {
    id: 1,
    invoiceNumber: '#TRX-20261024-0089',
    time: '18:42 WIB',
    outletName: 'Outlet Pusat',
    itemsCount: 3,
    cashierName: 'Ahmad Najib',
    customerName: 'Budi Santoso (Member)',
    paymentMethod: 'QRIS',
    totalAmount: 115000,
    status: 'success',
    statusLabel: 'Selesai'
  },
  {
    id: 2,
    invoiceNumber: '#TRX-20261024-0088',
    time: '18:35 WIB',
    outletName: 'Outlet Pusat',
    itemsCount: 2,
    cashierName: 'Ahmad Najib',
    customerName: 'Pelanggan Umum',
    paymentMethod: 'Tunai',
    totalAmount: 65000,
    status: 'success',
    statusLabel: 'Selesai'
  },
  {
    id: 3,
    invoiceNumber: '#TRX-20261024-0087',
    time: '18:22 WIB',
    outletName: 'Outlet Tebet',
    itemsCount: 4,
    cashierName: 'Siti Rahma',
    customerName: 'Dewi Lestari',
    paymentMethod: 'Debit',
    totalAmount: 185000,
    status: 'success',
    statusLabel: 'Selesai'
  },
  {
    id: 4,
    invoiceNumber: '#TRX-20261024-0086',
    time: '18:14 WIB',
    outletName: 'Outlet Pusat',
    itemsCount: 1,
    cashierName: 'Ahmad Najib',
    customerName: 'Online Grab/Gojek',
    paymentMethod: 'Transfer',
    totalAmount: 45000,
    status: 'pending',
    statusLabel: 'Menunggu'
  },
  {
    id: 5,
    invoiceNumber: '#TRX-20261024-0085',
    time: '17:58 WIB',
    outletName: 'Outlet Tebet',
    itemsCount: 2,
    cashierName: 'Siti Rahma',
    customerName: 'Rian Pratama',
    paymentMethod: 'QRIS',
    totalAmount: 78000,
    status: 'success',
    statusLabel: 'Selesai'
  }
])

const getPaymentIcon = (method) => {
  if (method === 'QRIS' || method === 'Transfer') return 'sparkles'
  if (method === 'Debit') return 'credit-card'
  return 'dollar'
}
</script>

<style scoped>
.transactions-widget {
  background-color: var(--bg-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--slate-100);
}

.title-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon-box {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background-color: var(--primary-50);
  color: var(--primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
}

.widget-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.widget-subtitle {
  font-size: 12.5px;
  color: var(--text-muted);
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-600);
  transition: all var(--duration-fast) ease;
}

.view-all-link:hover {
  color: var(--primary-800);
  transform: translateX(2px);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.pos-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13.5px;
}

.pos-table th {
  padding: 12px 20px;
  background-color: var(--slate-50);
  color: var(--text-muted);
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--slate-200);
}

.pos-table td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--slate-100);
  vertical-align: middle;
}

.table-row {
  transition: background-color var(--duration-fast) ease;
}

.table-row:hover {
  background-color: #f8fbff;
}

.cell-invoice {
  display: flex;
  flex-direction: column;
}

.invoice-number {
  font-weight: 700;
  color: var(--primary-700);
  font-family: monospace;
  font-size: 13px;
}

.item-count {
  font-size: 11px;
  color: var(--text-muted);
}

.cell-time {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-text {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-main);
}

.outlet-pill {
  font-size: 10.5px;
  color: var(--slate-500);
  background-color: var(--slate-100);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  display: inline-block;
  width: fit-content;
}

.staff-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 600;
  color: var(--text-main);
}

.cashier-label {
  font-size: 11px;
  color: var(--text-muted);
}

.payment-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: var(--radius-md);
}

.pay-qris { background-color: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
.pay-tunai { background-color: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
.pay-debit { background-color: #faf5ff; color: #6b21a8; border: 1px solid #e9d5ff; }
.pay-transfer { background-color: #fff7ed; color: #9a3412; border: 1px solid #fed7aa; }

.text-right { text-align: right; }
.text-center { text-align: center; }

.cell-amount {
  font-weight: 700;
}
</style>
