import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Current active user
  const user = ref({
    id: 1,
    name: 'Ahmad Najib',
    email: 'najib@martabaknusantara.com',
    role: 'Owner & Tenant Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
  })

  // Active Tenant Context (Derived from domain/auth as per PRD Section 5 & 6)
  const tenant = ref({
    id: 101,
    name: 'Martabak & Terang Bulan Nusantara',
    slug: 'martabak-nusantara',
    subdomain: 'martabaknusantara.abdipos.com',
    customDomain: 'martabaknusantara.id',
    plan: 'Pro SaaS Plan',
    status: 'active',
    currency: 'IDR',
    currencySymbol: 'Rp'
  })

  // Cashier active shift state (PRD Section 9.12)
  const activeShift = ref({
    id: 402,
    outletId: 1,
    cashierName: 'Ahmad Najib',
    openedAt: '2026-10-24 08:00',
    startingCash: 250000,
    status: 'open'
  })

  const isAuthenticated = computed(() => !!user.value)

  const hasPermission = (permission) => {
    // In actual implementation, check against backend permissions array
    return true
  }

  return {
    user,
    tenant,
    activeShift,
    isAuthenticated,
    hasPermission
  }
})
