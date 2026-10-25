import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStaffStore = defineStore('staff', () => {
  const staffList = ref([
    {
      id: 'usr-01',
      name: 'Abdulloh Najib',
      email: 'owner@abdimartabak.com',
      phone: '081234567890',
      role: 'OWNER',
      outletId: null,
      outletName: 'Semua Cabang (Global)',
      status: 'ACTIVE',
      joinedDate: '2026-01-01',
      lastLogin: '2026-10-25 10:30'
    },
    {
      id: 'usr-02',
      name: 'Ahmad Faiz',
      email: 'faiz@abdimartabak.com',
      phone: '081234567802',
      role: 'CASHIER',
      outletId: 1,
      outletName: 'Outlet Pusat - Sudirman',
      status: 'ACTIVE',
      joinedDate: '2026-02-15',
      lastLogin: '2026-10-25 08:00'
    },
    {
      id: 'usr-03',
      name: 'Rian Hidayat',
      email: 'rian@abdimartabak.com',
      phone: '081234567803',
      role: 'SUPERVISOR',
      outletId: 1,
      outletName: 'Outlet Pusat - Sudirman',
      status: 'ACTIVE',
      joinedDate: '2026-02-01',
      lastLogin: '2026-10-24 15:00'
    },
    {
      id: 'usr-04',
      name: 'Dina Lestari',
      email: 'dina@abdimartabak.com',
      phone: '081234567804',
      role: 'CASHIER',
      outletId: 2,
      outletName: 'Outlet Cabang - Tebet',
      status: 'ACTIVE',
      joinedDate: '2026-03-10',
      lastLogin: '2026-10-24 10:00'
    },
    {
      id: 'usr-05',
      name: 'Chef Bambang',
      email: 'bambang@abdimartabak.com',
      phone: '081234567805',
      role: 'KITCHEN',
      outletId: 1,
      outletName: 'Outlet Pusat - Sudirman',
      status: 'ACTIVE',
      joinedDate: '2026-01-20',
      lastLogin: '2026-10-25 07:30'
    }
  ])

  // Actions
  function addStaff(data) {
    const newStaff = {
      id: `usr-${Date.now()}`,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().slice(0, 10),
      lastLogin: 'Belum pernah login',
      ...data
    }
    staffList.value.push(newStaff)
    return newStaff
  }

  function updateStaff(id, data) {
    const idx = staffList.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      staffList.value[idx] = { ...staffList.value[idx], ...data }
      return staffList.value[idx]
    }
    return null
  }

  function deleteStaff(id) {
    const idx = staffList.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      staffList.value.splice(idx, 1)
      return true
    }
    return false
  }

  return {
    staffList,
    addStaff,
    updateStaff,
    deleteStaff
  }
})
