import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { customerService } from '../../../shared/services/customerService'

export const useCustomerStore = defineStore('customers', () => {
  const customers = ref([
    {
      id: 'cust-01',
      name: 'Budi Santoso',
      phone: '081234567890',
      email: 'budi.santoso@gmail.com',
      tier: 'GOLD',
      points: 450,
      totalSpent: 1250000,
      totalVisits: 14,
      lastVisit: '2026-10-25',
      referralCode: 'BUDI88',
      notes: 'Suka martabak manis adonan tebal, minim mentega'
    },
    {
      id: 'cust-02',
      name: 'Siti Rahma',
      phone: '081987654321',
      email: 'siti.rahma@yahoo.com',
      tier: 'SILVER',
      points: 210,
      totalSpent: 580000,
      totalVisits: 7,
      lastVisit: '2026-10-25',
      referralCode: 'SITI99',
      notes: 'Pelanggan langganan take away sore hari'
    },
    {
      id: 'cust-03',
      name: 'Hendro Prasetyo',
      phone: '081399887766',
      email: 'hendro.p@corp.id',
      tier: 'PLATINUM',
      points: 1250,
      totalSpent: 3450000,
      totalVisits: 32,
      lastVisit: '2026-10-24',
      referralCode: 'HENDROVIP',
      notes: 'Sering pesan dalam jumlah besar untuk kantor'
    },
    {
      id: 'cust-04',
      name: 'Nadia Putri',
      phone: '085712344321',
      email: 'nadia.putri@gmail.com',
      tier: 'BRONZE',
      points: 80,
      totalSpent: 190000,
      totalVisits: 3,
      lastVisit: '2026-10-20',
      referralCode: 'NADIAP',
      notes: ''
    },
    {
      id: 'cust-05',
      name: 'Rian Firmansyah',
      phone: '082155667788',
      email: 'rian.firmansyah@gmail.com',
      tier: 'BRONZE',
      points: 50,
      totalSpent: 120000,
      totalVisits: 2,
      lastVisit: '2026-10-18',
      referralCode: 'RIAN01',
      notes: 'Pelanggan QR meja baru'
    }
  ])

  // Getters
  const totalPointsCirculating = computed(() => {
    return customers.value.reduce((sum, c) => sum + c.points, 0)
  })

  // Actions
  async function fetchCustomers(params = {}) {
    try {
      const res = await customerService.getCustomers(params)
      if (res?.data && Array.isArray(res.data)) {
        customers.value = res.data.map(c => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          email: c.email,
          tier: c.tier || 'BRONZE',
          points: Number(c.points) || 0,
          totalSpent: Number(c.total_spent) || 0,
          totalVisits: Number(c.total_visits) || 0,
          lastVisit: c.last_visit || new Date().toISOString().slice(0, 10),
          referralCode: c.referral_code || '',
          notes: c.notes || ''
        }))
      }
    } catch (e) {
      console.warn('Backend fetchCustomers offline, using local customer data.')
    }
    return customers.value
  }

  async function addCustomer(data) {
    let created = null
    try {
      const res = await customerService.createCustomer({
        name: data.name,
        phone: data.phone,
        email: data.email,
        notes: data.notes
      })
      if (res?.data?.id) {
        created = res.data
      }
    } catch (e) {
      console.warn('Backend createCustomer offline, saved locally.')
    }

    const newCust = {
      id: created?.id || `cust-${Date.now()}`,
      points: Number(data.points) || 0,
      totalSpent: 0,
      totalVisits: 1,
      lastVisit: new Date().toISOString().slice(0, 10),
      referralCode: (data.name.replace(/\s+/g, '').slice(0, 6) + Math.floor(Math.random() * 90 + 10)).toUpperCase(),
      ...data
    }
    customers.value.unshift(newCust)
    return newCust
  }

  async function updateCustomer(id, data) {
    try {
      await customerService.updateCustomer(id, {
        name: data.name,
        phone: data.phone,
        email: data.email,
        notes: data.notes
      })
    } catch (e) {
      console.warn('Backend updateCustomer offline, updated locally.')
    }

    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      customers.value[idx] = { ...customers.value[idx], ...data }
      return customers.value[idx]
    }
    return null
  }

  async function deleteCustomer(id) {
    try {
      await customerService.deleteCustomer(id)
    } catch (e) {
      console.warn('Backend deleteCustomer offline, deleted locally.')
    }

    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      customers.value.splice(idx, 1)
      return true
    }
    return false
  }

  return {
    customers,
    totalPointsCirculating,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  }
})
