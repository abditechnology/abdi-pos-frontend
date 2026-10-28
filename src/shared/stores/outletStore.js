import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'
import { outletService } from '../services/outletService'

export const useOutletStore = defineStore('outlet', () => {
  const toast = useToast()

  // Sample authorized outlets as defined in PRD Section 7
  const outlets = ref([
    {
      id: 1,
      name: 'Outlet Pusat - Sudirman',
      code: 'OUT-SDR-01',
      address: 'Jl. Jenderal Sudirman No. 45, Jakarta Pusat',
      phone: '0812-3456-7890',
      status: 'active',
      isPrimary: true
    },
    {
      id: 2,
      name: 'Outlet Cabang - Tebet',
      code: 'OUT-TBT-02',
      address: 'Jl. Tebet Raya No. 18, Jakarta Selatan',
      phone: '0812-9876-5432',
      status: 'active',
      isPrimary: false
    },
    {
      id: 3,
      name: 'Outlet Cabang - Kelapa Gading',
      code: 'OUT-GKG-03',
      address: 'Jl. Boulevard Barat Raya Blok LC7, Jakarta Utara',
      phone: '0813-1122-3344',
      status: 'active',
      isPrimary: false
    }
  ])

  // Active Outlet (Default to the first or primary outlet)
  const currentOutletId = ref(1)

  const currentOutlet = computed(() => {
    return outlets.value.find(o => o.id === currentOutletId.value) || outlets.value[0]
  })

  // Switching outlet refreshes scoped data and notifies user (PRD Section 7)
  const switchOutlet = (id) => {
    const found = outlets.value.find(o => o.id === id)
    if (found && found.id !== currentOutletId.value) {
      currentOutletId.value = found.id
      toast.info(`Beralih ke cabang: ${found.name}`, 'Outlet Diperbarui')
      // Note: In real API, refetch outlet-scoped data here
      return true
    }
    return false
  }

  // Actions CRUD Cabang
  const fetchOutlets = async (params = {}) => {
    try {
      const res = await outletService.getOutlets(params)
      if (res?.data && Array.isArray(res.data)) {
        outlets.value = res.data.map((o, idx) => ({
          id: o.id,
          name: o.name,
          code: o.code || `OUT-${String(o.id).padStart(2, '0')}`,
          address: o.address || '',
          phone: o.phone || '',
          status: (o.status === 'active' || o.is_active) ? 'active' : 'inactive',
          isPrimary: idx === 0 || Boolean(o.is_primary)
        }))
      }
    } catch (e) {
      console.warn('Backend fetchOutlets offline, using local outlet data.')
    }
    return outlets.value
  }

  const createOutlet = async (data) => {
    let created = null
    try {
      const res = await outletService.createOutlet({
        name: data.name,
        code: data.code,
        address: data.address,
        phone: data.phone,
        is_active: data.status !== 'inactive'
      })
      if (res?.data?.id) {
        created = res.data
      }
    } catch (e) {
      console.warn('Backend createOutlet offline, created locally.')
    }

    const newId = created?.id || (outlets.value.length ? Math.max(...outlets.value.map(o => o.id)) + 1 : 1)
    const newOutlet = {
      id: newId,
      name: data.name,
      code: data.code || `OUT-${String(newId).padStart(2, '0')}`,
      address: data.address || '',
      phone: data.phone || '',
      status: data.status || 'active',
      isPrimary: false
    }
    outlets.value.push(newOutlet)
    toast.success(`Cabang "${newOutlet.name}" berhasil ditambahkan!`, 'Cabang Baru')
    return newOutlet
  }

  const updateOutlet = async (id, data) => {
    try {
      await outletService.updateOutlet(id, {
        name: data.name,
        code: data.code,
        address: data.address,
        phone: data.phone,
        is_active: data.status !== 'inactive'
      })
    } catch (e) {
      console.warn('Backend updateOutlet offline, updated locally.')
    }

    const index = outlets.value.findIndex(o => o.id === id)
    if (index !== -1) {
      outlets.value[index] = { ...outlets.value[index], ...data }
      toast.success(`Data cabang "${outlets.value[index].name}" berhasil diperbarui.`, 'Cabang Diperbarui')
      return true
    }
    return false
  }

  const deleteOutlet = async (id) => {
    if (outlets.value.length <= 1) {
      toast.error('Tidak dapat menghapus cabang terakhir bisnis Anda.', 'Gagal Hapus')
      return false
    }

    try {
      await outletService.deleteOutlet(id)
    } catch (e) {
      console.warn('Backend deleteOutlet offline, deleted locally.')
    }

    const index = outlets.value.findIndex(o => o.id === id)
    if (index !== -1) {
      const deleted = outlets.value.splice(index, 1)[0]
      if (currentOutletId.value === id) {
        currentOutletId.value = outlets.value[0].id
      }
      toast.info(`Cabang "${deleted.name}" telah dihapus.`, 'Cabang Dihapus')
      return true
    }
    return false
  }

  return {
    outlets,
    currentOutletId,
    currentOutlet,
    switchOutlet,
    fetchOutlets,
    createOutlet,
    updateOutlet,
    deleteOutlet
  }
})
