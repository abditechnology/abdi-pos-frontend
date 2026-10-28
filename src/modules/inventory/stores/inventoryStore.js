import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '../../../shared/composables/useToast'
import { useOutletStore } from '../../../shared/stores/outletStore'
import { inventoryService } from '../../../shared/services/inventoryService'

export const useInventoryStore = defineStore('inventory', () => {
  const toast = useToast()
  const outletStore = useOutletStore()

  const rawMaterials = ref([
    {
      id: 1,
      name: 'Tepung Terigu Segitiga Biru Premium',
      sku: 'RAW-TPG-01',
      category: 'Bahan Utama',
      stock: 45,
      minStock: 20,
      unit: 'Kg',
      costPerUnit: 12500,
      outletId: 1,
      lastUpdated: '24 Okt 2026, 17:00'
    },
    {
      id: 2,
      name: 'Telur Ayam Negeri Fresh',
      sku: 'RAW-TLR-02',
      category: 'Bahan Utama',
      stock: 120,
      minStock: 50,
      unit: 'Butir',
      costPerUnit: 2200,
      outletId: 1,
      lastUpdated: '25 Okt 2026, 06:30'
    },
    {
      id: 3,
      name: 'Telur Bebek Organik',
      sku: 'RAW-TBB-03',
      category: 'Bahan Utama',
      stock: 18,
      minStock: 25,
      unit: 'Butir',
      costPerUnit: 3500,
      outletId: 1,
      lastUpdated: '24 Okt 2026, 14:00'
    },
    {
      id: 4,
      name: 'Mentega Wijsman Kaleng Asli',
      sku: 'RAW-MTG-04',
      category: 'Topping & Lemak',
      stock: 8,
      minStock: 10,
      unit: 'Kaleng',
      costPerUnit: 98000,
      outletId: 1,
      lastUpdated: '23 Okt 2026, 20:15'
    },
    {
      id: 5,
      name: 'Keju Cheddar Blok Meg',
      sku: 'RAW-KJU-05',
      category: 'Topping & Lemak',
      stock: 14,
      minStock: 10,
      unit: 'Balok 2kg',
      costPerUnit: 115000,
      outletId: 1,
      lastUpdated: '25 Okt 2026, 08:00'
    },
    {
      id: 6,
      name: 'Susu Kental Manis Carnation',
      sku: 'RAW-SKM-06',
      category: 'Bahan Penunjang',
      stock: 36,
      minStock: 15,
      unit: 'Kaleng',
      costPerUnit: 13000,
      outletId: 1,
      lastUpdated: '24 Okt 2026, 11:30'
    },
    {
      id: 7,
      name: 'Daging Sapi Giling Cincang',
      sku: 'RAW-DGG-07',
      category: 'Bahan Isian',
      stock: 9,
      minStock: 15,
      unit: 'Kg',
      costPerUnit: 110000,
      outletId: 1,
      lastUpdated: '25 Okt 2026, 07:45'
    },
    {
      id: 8,
      name: 'Daun Bawang Iris Segar',
      sku: 'RAW-DBW-08',
      category: 'Bahan Isian',
      stock: 6,
      minStock: 8,
      unit: 'Kg',
      costPerUnit: 16000,
      outletId: 1,
      lastUpdated: '25 Okt 2026, 07:45'
    }
  ])

  // Getters scoped to current outlet or all
  const scopedMaterials = computed(() => {
    return rawMaterials.value.filter(m => m.outletId === outletStore.currentOutletId || !m.outletId)
  })

  const totalValue = computed(() => {
    return scopedMaterials.value.reduce((acc, m) => acc + (m.stock * m.costPerUnit), 0)
  })

  const lowStockCount = computed(() => {
    return scopedMaterials.value.filter(m => m.stock <= m.minStock).length
  })

  // Actions
  const fetchStock = async (params = {}) => {
    try {
      const res = await inventoryService.getStock(params)
      if (res?.data && Array.isArray(res.data)) {
        rawMaterials.value = res.data.map(m => ({
          id: m.id,
          name: m.product?.name || m.name,
          sku: m.product?.sku || m.sku,
          category: m.category || 'Bahan Utama',
          stock: Number(m.quantity || m.stock) || 0,
          minStock: Number(m.min_stock || m.minStock) || 10,
          unit: m.unit || 'Kg',
          costPerUnit: Number(m.cost_per_unit || m.costPerUnit) || 0,
          outletId: m.outlet_id || outletStore.currentOutletId,
          lastUpdated: 'Sinkronisasi Backend'
        }))
      }
    } catch (e) {
      console.warn('Backend fetchStock offline, using local inventory data.')
    }
    return rawMaterials.value
  }

  const adjustStock = async (itemId, actualStock, reason = 'Opname Rutin') => {
    try {
      await inventoryService.adjustStock({
        item_id: itemId,
        actual_stock: Number(actualStock),
        reason
      })
    } catch (e) {
      console.warn('Backend adjustStock offline, adjusted locally.')
    }

    const item = rawMaterials.value.find(m => m.id === itemId)
    if (item) {
      const diff = Number(actualStock) - item.stock
      item.stock = Number(actualStock)
      item.lastUpdated = 'Baru saja'

      const diffText = diff > 0 ? `+${diff}` : `${diff}`
      toast.success(
        `Penyesuaian stok "${item.name}" berhasil disimpan (${diffText} ${item.unit}). Alasan: ${reason}`,
        'Stock Opname Disimpan'
      )
      return true
    }
    return false
  }

  const createMaterial = (data) => {
    const newId = rawMaterials.value.length ? Math.max(...rawMaterials.value.map(m => m.id)) + 1 : 1
    const newMaterial = {
      id: newId,
      name: data.name,
      sku: data.sku || `RAW-${Date.now().toString().slice(-4)}`,
      category: data.category || 'Bahan Utama',
      stock: Number(data.stock) || 0,
      minStock: Number(data.minStock) || 10,
      unit: data.unit || 'Kg',
      costPerUnit: Number(data.costPerUnit) || 0,
      outletId: outletStore.currentOutletId,
      lastUpdated: 'Baru saja'
    }
    rawMaterials.value.unshift(newMaterial)
    toast.success(`Bahan baku "${newMaterial.name}" berhasil didaftarkan!`, 'Bahan Baru Dibuat')
    return newMaterial
  }

  const updateMaterial = (id, data) => {
    const index = rawMaterials.value.findIndex(m => m.id === id)
    if (index !== -1) {
      rawMaterials.value[index] = {
        ...rawMaterials.value[index],
        ...data,
        stock: Number(data.stock) || 0,
        minStock: Number(data.minStock) || 0,
        costPerUnit: Number(data.costPerUnit) || 0,
        lastUpdated: 'Baru saja'
      }
      toast.success(`Data bahan baku "${rawMaterials.value[index].name}" diperbarui.`, 'Bahan Diperbarui')
      return true
    }
    return false
  }

  const deleteMaterial = (id) => {
    const index = rawMaterials.value.findIndex(m => m.id === id)
    if (index !== -1) {
      const deleted = rawMaterials.value.splice(index, 1)[0]
      toast.info(`Bahan "${deleted.name}" telah dihapus dari inventaris.`, 'Bahan Dihapus')
      return true
    }
    return false
  }

  return {
    rawMaterials,
    scopedMaterials,
    totalValue,
    lowStockCount,
    fetchStock,
    adjustStock,
    createMaterial,
    updateMaterial,
    deleteMaterial
  }
})
