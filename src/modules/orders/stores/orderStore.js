import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrderStore = defineStore('orders', () => {
  const tables = ref([
    { id: 'tbl-1', number: 'Meja 01', capacity: 2, area: 'Indoor AC', status: 'AVAILABLE' },
    { id: 'tbl-2', number: 'Meja 02', capacity: 4, area: 'Indoor AC', status: 'AVAILABLE' },
    { id: 'tbl-3', number: 'Meja 03', capacity: 4, area: 'Indoor AC', status: 'OCCUPIED' },
    { id: 'tbl-4', number: 'Meja 04', capacity: 6, area: 'Outdoor / Smoking', status: 'OCCUPIED' },
    { id: 'tbl-5', number: 'Meja 05', capacity: 2, area: 'Outdoor / Smoking', status: 'AVAILABLE' },
    { id: 'tbl-6', number: 'Meja VIP 01', capacity: 10, area: 'VIP Room', status: 'RESERVED' }
  ])

  const orders = ref([
    {
      id: 'ord-101',
      orderNumber: 'ORD-1025-001',
      tableNumber: 'Meja 04',
      customerName: 'Budi Santoso',
      customerPhone: '081234567890',
      time: '5 menit yang lalu',
      items: [
        { name: 'Terang Bulan Spesial Coklat Keju', qty: 1, price: 45000, notes: 'Adonan tebal manis sedang' },
        { name: 'Es Teh Manis Jumbo', qty: 2, price: 6000, notes: 'Es batu sedikit' }
      ],
      total: 57000,
      paymentStatus: 'PAID',
      status: 'PENDING', // PENDING -> COOKING -> READY -> COMPLETED / CANCELLED
      notes: 'Dine In Meja 04'
    },
    {
      id: 'ord-102',
      orderNumber: 'ORD-1025-002',
      tableNumber: 'Meja 03',
      customerName: 'Rina Kusuma',
      customerPhone: '081987654321',
      time: '18 menit yang lalu',
      items: [
        { name: 'Martabak Telur Spesial Bebek 3 Telur', qty: 1, price: 58000, notes: 'Kuah cuko pedas' },
        { name: 'Kopi Susu Gula Aren', qty: 1, price: 18000, notes: 'Normal ice' }
      ],
      total: 76000,
      paymentStatus: 'PAID',
      status: 'COOKING',
      notes: 'Dine In Meja 03'
    },
    {
      id: 'ord-103',
      orderNumber: 'ORD-1025-003',
      tableNumber: 'Take Away #01',
      customerName: 'Fajar Nugraha',
      customerPhone: '085711223344',
      time: '28 menit yang lalu',
      items: [
        { name: 'Terang Bulan Tipis Kering Coklat', qty: 2, price: 25000, notes: 'Dipisah wadahnya' }
      ],
      total: 50000,
      paymentStatus: 'PAID',
      status: 'READY',
      notes: 'Bungkus bawa pulang'
    },
    {
      id: 'ord-100',
      orderNumber: 'ORD-1025-000',
      tableNumber: 'Meja 02',
      customerName: 'Dewi Lestari',
      customerPhone: '081344556677',
      time: '45 menit yang lalu',
      items: [
        { name: 'Martabak Manis Pandan Jagung Keju', qty: 1, price: 50000, notes: '' },
        { name: 'Mineral Water 600ml', qty: 2, price: 5000, notes: 'Dingin' }
      ],
      total: 60000,
      paymentStatus: 'PAID',
      status: 'COMPLETED',
      notes: 'Pesanan selesai & meja sudah dibersihkan'
    }
  ])

  // Getters
  const pendingOrders = computed(() => orders.value.filter(o => o.status === 'PENDING'))
  const cookingOrders = computed(() => orders.value.filter(o => o.status === 'COOKING'))
  const readyOrders = computed(() => orders.value.filter(o => o.status === 'READY'))
  const completedOrders = computed(() => orders.value.filter(o => o.status === 'COMPLETED'))

  // Actions
  function updateOrderStatus(orderId, newStatus) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = newStatus
      return true
    }
    return false
  }

  function addTable(tableData) {
    const newTbl = {
      id: `tbl-${Date.now()}`,
      status: 'AVAILABLE',
      ...tableData
    }
    tables.value.push(newTbl)
    return newTbl
  }

  function updateTable(tableId, tableData) {
    const idx = tables.value.findIndex(t => t.id === tableId)
    if (idx !== -1) {
      tables.value[idx] = { ...tables.value[idx], ...tableData }
      return tables.value[idx]
    }
    return null
  }

  function deleteTable(tableId) {
    const idx = tables.value.findIndex(t => t.id === tableId)
    if (idx !== -1) {
      tables.value.splice(idx, 1)
      return true
    }
    return false
  }

  return {
    tables,
    orders,
    pendingOrders,
    cookingOrders,
    readyOrders,
    completedOrders,
    updateOrderStatus,
    addTable,
    updateTable,
    deleteTable
  }
})
