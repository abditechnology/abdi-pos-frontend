import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePromotionStore = defineStore('promotions', () => {
  const promotions = ref([
    {
      id: 'prm-01',
      code: 'WEEKEND20',
      title: 'Diskon Weekend Martabak 20%',
      type: 'PERCENTAGE',
      discountValue: 20,
      minPurchase: 50000,
      maxDiscount: 15000,
      validUntil: '2026-11-30',
      isActive: true,
      usageCount: 68,
      description: 'Potongan harga 20% untuk semua varian Martabak Manis & Terang Bulan di akhir pekan.'
    },
    {
      id: 'prm-02',
      code: 'HEMAT10K',
      title: 'Potongan Langsung Rp 10.000',
      type: 'FIXED',
      discountValue: 10000,
      minPurchase: 60000,
      maxDiscount: 10000,
      validUntil: '2026-12-31',
      isActive: true,
      usageCount: 112,
      description: 'Voucher potongan flat Rp 10.000 dengan minimal pembelanjaan Rp 60.000.'
    },
    {
      id: 'prm-03',
      code: 'BUNDLING-NGEMIL',
      title: 'Paket Ngemil Sore (Martabak + 2 Es Teh)',
      type: 'BUNDLE',
      discountValue: 12000,
      minPurchase: 45000,
      maxDiscount: 12000,
      validUntil: '2026-11-15',
      isActive: true,
      usageCount: 45,
      description: 'Beli 1 Terang Bulan Coklat Keju gratis 2 gelas Es Teh Manis Jumbo.'
    },
    {
      id: 'prm-04',
      code: 'TEBUS-5K',
      title: 'Tebus Murah Kopi Susu Rp 5.000',
      type: 'TEBUS_MURAH',
      discountValue: 13000,
      minPurchase: 75000,
      maxDiscount: 13000,
      validUntil: '2026-10-31',
      isActive: false,
      usageCount: 29,
      description: 'Belanja minimal Rp 75.000 dapat menebus Kopi Susu Gula Aren hanya seharga Rp 5.000 (normal Rp 18.000).'
    }
  ])

  // Getters
  const activePromotions = computed(() => promotions.value.filter(p => p.isActive))
  const totalUsages = computed(() => promotions.value.reduce((sum, p) => sum + p.usageCount, 0))

  // Actions
  function addPromotion(data) {
    const newPromo = {
      id: `prm-${Date.now()}`,
      usageCount: 0,
      isActive: true,
      ...data
    }
    promotions.value.unshift(newPromo)
    return newPromo
  }

  function updatePromotion(id, data) {
    const idx = promotions.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      promotions.value[idx] = { ...promotions.value[idx], ...data }
      return promotions.value[idx]
    }
    return null
  }

  function toggleStatus(id) {
    const promo = promotions.value.find(p => p.id === id)
    if (promo) {
      promo.isActive = !promo.isActive
      return promo.isActive
    }
    return false
  }

  function deletePromotion(id) {
    const idx = promotions.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      promotions.value.splice(idx, 1)
      return true
    }
    return false
  }

  return {
    promotions,
    activePromotions,
    totalUsages,
    addPromotion,
    updatePromotion,
    toggleStatus,
    deletePromotion
  }
})
