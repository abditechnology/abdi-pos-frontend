import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { promotionService } from '../../../shared/services/promotionService'

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
  async function fetchPromotions(params = {}) {
    try {
      const res = await promotionService.getPromotions(params)
      if (res?.data && Array.isArray(res.data)) {
        promotions.value = res.data.map(p => ({
          id: p.id,
          code: p.code,
          title: p.name || p.title,
          type: p.type || 'PERCENTAGE',
          discountValue: Number(p.discount_value) || 0,
          minPurchase: Number(p.min_purchase) || 0,
          maxDiscount: Number(p.max_discount) || 0,
          validUntil: p.end_date || p.validUntil,
          isActive: Boolean(p.is_active ?? true),
          usageCount: p.usage_count || 0,
          description: p.description || ''
        }))
      }
    } catch (e) {
      console.warn('Backend fetchPromotions offline, using local promo data.')
    }
    return promotions.value
  }

  async function addPromotion(data) {
    let created = null
    try {
      const res = await promotionService.createPromotion({
        name: data.title,
        code: data.code,
        type: data.type,
        discount_value: data.discountValue,
        min_purchase: data.minPurchase,
        max_discount: data.maxDiscount,
        end_date: data.validUntil,
        description: data.description,
        is_active: data.isActive
      })
      if (res?.data?.id) {
        created = res.data
      }
    } catch (e) {
      console.warn('Backend createPromotion offline, saved locally.')
    }

    const newPromo = {
      id: created?.id || `prm-${Date.now()}`,
      usageCount: 0,
      isActive: true,
      ...data
    }
    promotions.value.unshift(newPromo)
    return newPromo
  }

  async function updatePromotion(id, data) {
    try {
      await promotionService.updatePromotion(id, {
        name: data.title,
        code: data.code,
        type: data.type,
        discount_value: data.discountValue,
        min_purchase: data.minPurchase,
        max_discount: data.maxDiscount,
        end_date: data.validUntil,
        description: data.description,
        is_active: data.isActive
      })
    } catch (e) {
      console.warn('Backend updatePromotion offline, updated locally.')
    }

    const idx = promotions.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      promotions.value[idx] = { ...promotions.value[idx], ...data }
      return promotions.value[idx]
    }
    return null
  }

  async function toggleStatus(id) {
    const promo = promotions.value.find(p => p.id === id)
    if (promo) {
      promo.isActive = !promo.isActive
      try {
        await promotionService.updatePromotion(id, { is_active: promo.isActive })
      } catch (e) {
        // Handled
      }
      return promo.isActive
    }
    return false
  }

  async function deletePromotion(id) {
    try {
      await promotionService.deletePromotion(id)
    } catch (e) {
      console.warn('Backend deletePromotion offline, deleted locally.')
    }

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
    fetchPromotions,
    addPromotion,
    updatePromotion,
    toggleStatus,
    deletePromotion
  }
})
