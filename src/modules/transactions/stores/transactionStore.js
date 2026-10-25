import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([
    {
      id: 'tx-001',
      invoiceNumber: 'INV-20261025-001',
      outletId: 'out-01',
      outletName: 'Abdi Martabak - Grand Galaxy',
      cashierName: 'Ahmad Faiz',
      customerName: 'Budi Santoso',
      customerPhone: '081234567890',
      date: '2026-10-25 10:15:20',
      items: [
        { name: 'Terang Bulan Spesial Coklat Keju', qty: 1, price: 45000, subtotal: 45000 },
        { name: 'Es Teh Manis Jumbo', qty: 2, price: 6000, subtotal: 12000 }
      ],
      subtotal: 57000,
      tax: 6270,
      discount: 0,
      total: 63270,
      paymentMethod: 'QRIS',
      status: 'PAID', // 'PAID', 'VOID'
      notes: 'Meja 04 - Dine In'
    },
    {
      id: 'tx-002',
      invoiceNumber: 'INV-20261025-002',
      outletId: 'out-01',
      outletName: 'Abdi Martabak - Grand Galaxy',
      cashierName: 'Ahmad Faiz',
      customerName: 'Siti Rahma',
      customerPhone: '081987654321',
      date: '2026-10-25 09:40:12',
      items: [
        { name: 'Martabak Telur Spesial Bebek 3 Telur', qty: 1, price: 58000, subtotal: 58000 },
        { name: 'Mineral Water 600ml', qty: 1, price: 5000, subtotal: 5000 }
      ],
      subtotal: 63000,
      tax: 6930,
      discount: 5000,
      total: 64930,
      paymentMethod: 'TUNAI',
      amountPaid: 70000,
      change: 5070,
      status: 'PAID',
      notes: 'Take Away'
    },
    {
      id: 'tx-003',
      invoiceNumber: 'INV-20261025-003',
      outletId: 'out-02',
      outletName: 'Abdi Martabak - Summarecon Mall',
      cashierName: 'Dina Lestari',
      customerName: 'Hendro Prasetyo',
      customerPhone: '081399887766',
      date: '2026-10-25 09:15:00',
      items: [
        { name: 'Terang Bulan Red Velvet Cream Cheese', qty: 1, price: 55000, subtotal: 55000 }
      ],
      subtotal: 55000,
      tax: 6050,
      discount: 0,
      total: 61050,
      paymentMethod: 'DEBIT',
      status: 'PAID',
      notes: 'Bawa Pulang'
    },
    {
      id: 'tx-004',
      invoiceNumber: 'INV-20261024-089',
      outletId: 'out-01',
      outletName: 'Abdi Martabak - Grand Galaxy',
      cashierName: 'Ahmad Faiz',
      customerName: 'Pelanggan Umum',
      customerPhone: '-',
      date: '2026-10-24 21:30:10',
      items: [
        { name: 'Martabak Daging Sapi Reguler', qty: 1, price: 42000, subtotal: 42000 }
      ],
      subtotal: 42000,
      tax: 4620,
      discount: 0,
      total: 46620,
      paymentMethod: 'TUNAI',
      amountPaid: 50000,
      change: 3380,
      status: 'VOID',
      voidReason: 'Salah input pesanan pelanggan, diganti invoice baru',
      voidedBy: 'Ahmad Faiz'
    },
    {
      id: 'tx-005',
      invoiceNumber: 'INV-20261024-088',
      outletId: 'out-02',
      outletName: 'Abdi Martabak - Summarecon Mall',
      cashierName: 'Dina Lestari',
      customerName: 'Nadia Putri',
      customerPhone: '085712344321',
      date: '2026-10-24 20:45:00',
      items: [
        { name: 'Terang Bulan Tipis Kering Coklat', qty: 2, price: 25000, subtotal: 50000 },
        { name: 'Kopi Susu Gula Aren', qty: 2, price: 18000, subtotal: 36000 }
      ],
      subtotal: 86000,
      tax: 9460,
      discount: 10000,
      total: 85460,
      paymentMethod: 'QRIS',
      status: 'PAID',
      notes: 'Voucher PROMO10K'
    }
  ])

  const shifts = ref([
    {
      id: 'shift-102',
      outletId: 'out-01',
      cashierId: 'usr-02',
      cashierName: 'Ahmad Faiz',
      openedAt: '2026-10-25 08:00:00',
      closedAt: null,
      startingCash: 200000,
      expectedCash: 270000,
      actualCash: null,
      cashDifference: 0,
      status: 'OPEN',
      notes: 'Shift Pagi - Kasir Utama'
    },
    {
      id: 'shift-101',
      outletId: 'out-01',
      cashierId: 'usr-03',
      cashierName: 'Rian Hidayat',
      openedAt: '2026-10-24 15:00:00',
      closedAt: '2026-10-24 23:00:00',
      startingCash: 200000,
      expectedCash: 1850000,
      actualCash: 1850000,
      cashDifference: 0,
      status: 'CLOSED',
      notes: 'Shift Malam - Transaksi ramai, kas pas'
    },
    {
      id: 'shift-100',
      outletId: 'out-02',
      cashierId: 'usr-04',
      cashierName: 'Dina Lestari',
      openedAt: '2026-10-24 10:00:00',
      closedAt: '2026-10-24 18:00:00',
      startingCash: 150000,
      expectedCash: 1420000,
      actualCash: 1415000,
      cashDifference: -5000,
      status: 'CLOSED',
      notes: 'Selisih Rp 5.000 karena kekurangan kembalian receh'
    }
  ])

  // Getters
  const totalPaidRevenue = computed(() => {
    return transactions.value
      .filter(t => t.status === 'PAID')
      .reduce((sum, t) => sum + t.total, 0)
  })

  const currentActiveShift = computed(() => {
    return shifts.value.find(s => s.status === 'OPEN') || null
  })

  // Actions
  function addTransaction(txData) {
    const newTx = {
      id: `tx-${Date.now()}`,
      invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(transactions.value.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'PAID',
      ...txData
    }
    transactions.value.unshift(newTx)
    return newTx
  }

  function voidTransaction(txId, reason, cashier) {
    const tx = transactions.value.find(t => t.id === txId)
    if (tx) {
      tx.status = 'VOID'
      tx.voidReason = reason || 'Dibatalkan oleh kasir'
      tx.voidedBy = cashier || 'Kasir Operasional'
      return true
    }
    return false
  }

  function openShift({ outletId, cashierId, cashierName, startingCash, notes }) {
    const newShift = {
      id: `shift-${Date.now()}`,
      outletId,
      cashierId,
      cashierName,
      openedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      closedAt: null,
      startingCash: Number(startingCash) || 0,
      expectedCash: Number(startingCash) || 0,
      actualCash: null,
      cashDifference: 0,
      status: 'OPEN',
      notes: notes || 'Shift baru dibuka'
    }
    shifts.value.unshift(newShift)
    return newShift
  }

  function closeShift({ shiftId, actualCash, notes }) {
    const shift = shifts.value.find(s => s.id === shiftId)
    if (shift) {
      shift.closedAt = new Date().toISOString().replace('T', ' ').slice(0, 19)
      shift.actualCash = Number(actualCash)
      shift.cashDifference = shift.actualCash - shift.expectedCash
      shift.status = 'CLOSED'
      if (notes) shift.notes = notes
      return shift
    }
    return null
  }

  return {
    transactions,
    shifts,
    totalPaidRevenue,
    currentActiveShift,
    addTransaction,
    voidTransaction,
    openShift,
    closeShift
  }
})
