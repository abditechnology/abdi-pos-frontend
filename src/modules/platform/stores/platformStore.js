import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '../../../shared/composables/useToast'

export const usePlatformStore = defineStore('platform', () => {
  const toast = useToast()

  // 1. Data Paket Langganan SaaS (SaaS Subscription Plans)
  const plans = ref([
    {
      id: 1,
      code: 'starter',
      name: 'Starter UMKM',
      badge: 'UMKM & Pemula',
      priceMonthly: 99000,
      priceYearly: 990000,
      maxOutlets: 1,
      maxStaff: 3,
      maxProducts: 200,
      features: [
        '1 Cabang / Outlet',
        'Maksimal 3 Akun Kasir',
        'Katalog 200 Produk',
        'Laporan Penjualan Standar',
        'Subdomain (.abdipos.com)'
      ],
      isPopular: false,
      isActive: true,
      subscriberCount: 14
    },
    {
      id: 2,
      code: 'pro',
      name: 'Business Pro',
      badge: 'Paling Populer',
      priceMonthly: 249000,
      priceYearly: 2490000,
      maxOutlets: 3,
      maxStaff: 10,
      maxProducts: 2000,
      features: [
        'Hingga 3 Cabang / Outlet',
        'Maksimal 10 Akun Staf/Kasir',
        'Manajemen Inventaris Multi-Cabang',
        'Diskon, Promo Bundling & Tebus Murah',
        'Dukungan Custom Domain (.id / .com)',
        'Laporan Laba/Rugi & Analitik Lengkap'
      ],
      isPopular: true,
      isActive: true,
      subscriberCount: 22
    },
    {
      id: 3,
      code: 'enterprise',
      name: 'Enterprise Franchise',
      badge: 'Skala Besar',
      priceMonthly: 699000,
      priceYearly: 6990000,
      maxOutlets: 15,
      maxStaff: 50,
      maxProducts: 10000,
      features: [
        'Hingga 15 Cabang / Outlet',
        'Akses Staf & Kasir Tanpa Batas',
        'Sistem Self-Order QR Meja',
        'Akses API / Webhook Integrasi Akuntansi',
        'Prioritas Server & SLA Support 24/7',
        'Dedicated Domain & White-label Receipt'
      ],
      isPopular: false,
      isActive: true,
      subscriberCount: 6
    }
  ])

  // 2. Data Tenant (Klien Bisnis yang Terdaftar di SaaS Anda)
  const tenants = ref([
    {
      id: 101,
      name: 'Martabak & Terang Bulan Nusantara',
      slug: 'martabak-nusantara',
      subdomain: 'martabaknusantara.abdipos.com',
      customDomain: 'martabaknusantara.id',
      ownerName: 'Ahmad Najib',
      ownerEmail: 'najib@martabaknusantara.com',
      phone: '0812-3456-7890',
      planId: 2,
      status: 'active', // active, trial, suspended
      outletsCount: 3,
      staffCount: 8,
      registeredAt: '2026-08-10',
      expiresAt: '2027-08-10',
      billingCycle: 'yearly'
    },
    {
      id: 102,
      name: 'Kopi Kenangan Senja',
      slug: 'kopisenja',
      subdomain: 'kopisenja.abdipos.com',
      customDomain: 'kopikenangansenja.com',
      ownerName: 'Fathur Rahman',
      ownerEmail: 'fathur@kopisenja.com',
      phone: '0813-9876-1122',
      planId: 3,
      status: 'active',
      outletsCount: 7,
      staffCount: 24,
      registeredAt: '2026-07-01',
      expiresAt: '2027-07-01',
      billingCycle: 'yearly'
    },
    {
      id: 103,
      name: 'Ayam Geprek Sambal Korek Juara',
      slug: 'geprek-juara',
      subdomain: 'geprekjuara.abdipos.com',
      customDomain: '',
      ownerName: 'Bambang Sudirjo',
      ownerEmail: 'bambang@geprekjuara.id',
      phone: '0857-1122-3344',
      planId: 1,
      status: 'active',
      outletsCount: 1,
      staffCount: 2,
      registeredAt: '2026-09-15',
      expiresAt: '2026-11-15',
      billingCycle: 'monthly'
    },
    {
      id: 104,
      name: 'Bakso Malang Cak Gundul',
      slug: 'baksocakgundul',
      subdomain: 'baksocakgundul.abdipos.com',
      customDomain: '',
      ownerName: 'Agus Santoso',
      ownerEmail: 'agus@cakgundul.com',
      phone: '0812-5566-7788',
      planId: 1,
      status: 'trial',
      outletsCount: 1,
      staffCount: 2,
      registeredAt: '2026-10-18',
      expiresAt: '2026-11-01',
      billingCycle: 'trial'
    },
    {
      id: 105,
      name: 'Roti Bakar & Warkop 99',
      slug: 'warkop99',
      subdomain: 'warkop99.abdipos.com',
      customDomain: '',
      ownerName: 'Hendra Gunawan',
      ownerEmail: 'hendra99@gmail.com',
      phone: '0819-2233-4455',
      planId: 1,
      status: 'suspended',
      outletsCount: 1,
      staffCount: 3,
      registeredAt: '2026-05-12',
      expiresAt: '2026-09-12',
      billingCycle: 'monthly'
    }
  ])

  // 3. Domain & Subdomain Tenant
  const domains = ref([
    {
      id: 1,
      tenantId: 101,
      tenantName: 'Martabak & Terang Bulan Nusantara',
      hostname: 'martabaknusantara.id',
      type: 'custom',
      sslStatus: 'active',
      dnsVerified: true,
      isPrimary: true,
      createdAt: '2026-08-15'
    },
    {
      id: 2,
      tenantId: 102,
      tenantName: 'Kopi Kenangan Senja',
      hostname: 'kopikenangansenja.com',
      type: 'custom',
      sslStatus: 'active',
      dnsVerified: true,
      isPrimary: true,
      createdAt: '2026-07-05'
    },
    {
      id: 3,
      tenantId: 104,
      tenantName: 'Bakso Malang Cak Gundul',
      hostname: 'baksocakgundul.com',
      type: 'custom',
      sslStatus: 'pending',
      dnsVerified: false,
      isPrimary: false,
      createdAt: '2026-10-20'
    }
  ])

  // 4. Log Audit Aktivitas Superadmin
  const auditLogs = ref([
    {
      id: 1,
      action: 'TENANT_CREATED',
      actor: 'Superadmin (Anda)',
      target: 'Bakso Malang Cak Gundul',
      description: 'Mendaftarkan tenant baru dalam masa uji coba (Trial 14 hari).',
      time: '18 Okt 2026, 10:45 WIB',
      ipAddress: '180.244.12.89'
    },
    {
      id: 2,
      action: 'PLAN_PRICE_UPDATED',
      actor: 'Superadmin (Anda)',
      target: 'Business Pro',
      description: 'Menyesuaikan fitur paket: penambahan limit produk menjadi 2.000 item.',
      time: '12 Okt 2026, 14:20 WIB',
      ipAddress: '180.244.12.89'
    },
    {
      id: 3,
      action: 'TENANT_SUSPENDED',
      actor: 'Superadmin (Anda)',
      target: 'Roti Bakar & Warkop 99',
      description: 'Akun dibekukan karena tagihan langganan telah jatuh tempo melewati 30 hari.',
      time: '01 Okt 2026, 09:00 WIB',
      ipAddress: '180.244.12.89'
    }
  ])

  // Computed Metrics
  const totalTenants = computed(() => tenants.value.length)
  const activeTenants = computed(() => tenants.value.filter(t => t.status === 'active').length)
  const trialTenants = computed(() => tenants.value.filter(t => t.status === 'trial').length)
  const suspendedTenants = computed(() => tenants.value.filter(t => t.status === 'suspended').length)

  const totalOutletsManaged = computed(() => {
    return tenants.value.reduce((acc, t) => acc + (t.outletsCount || 1), 0)
  })

  // Perhitungan Monthly Recurring Revenue (MRR)
  const totalMRR = computed(() => {
    return tenants.value.reduce((total, t) => {
      if (t.status !== 'active') return total
      const plan = plans.value.find(p => p.id === t.planId)
      if (!plan) return total
      return total + plan.priceMonthly
    }, 0)
  })

  // Action: Tambah Tenant Baru
  const createTenant = (tenantData) => {
    const newId = Date.now()
    const cleanSlug = tenantData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    const selectedPlan = plans.value.find(p => p.id === Number(tenantData.planId)) || plans.value[0]

    const newTenant = {
      id: newId,
      name: tenantData.name,
      slug: cleanSlug,
      subdomain: `${cleanSlug}.abdipos.com`,
      customDomain: tenantData.customDomain ? tenantData.customDomain.toLowerCase().trim() : '',
      ownerName: tenantData.ownerName,
      ownerEmail: tenantData.ownerEmail,
      phone: tenantData.phone || '0812-0000-0000',
      planId: selectedPlan.id,
      status: tenantData.isTrial ? 'trial' : 'active',
      outletsCount: Number(tenantData.outletsCount) || 1,
      staffCount: 1,
      registeredAt: new Date().toISOString().split('T')[0],
      expiresAt: tenantData.isTrial ? '2026-11-08' : '2027-10-25',
      billingCycle: tenantData.isTrial ? 'trial' : 'monthly'
    }

    tenants.value.unshift(newTenant)
    selectedPlan.subscriberCount = (selectedPlan.subscriberCount || 0) + 1

    // Catat log
    auditLogs.value.unshift({
      id: Date.now(),
      action: 'TENANT_CREATED',
      actor: 'Superadmin (Anda)',
      target: newTenant.name,
      description: `Menambahkan tenant baru "${newTenant.name}" dengan paket ${selectedPlan.name}.`,
      time: 'Baru saja',
      ipAddress: '127.0.0.1'
    })

    toast.success(`Tenant "${newTenant.name}" berhasil didaftarkan! Subdomain: ${newTenant.subdomain}`, 'Tenant Baru Dibuat')
    return newTenant
  }

  // Action: Ubah Status Tenant (Aktifkan / Bekukan / Suspend)
  const updateTenantStatus = (tenantId, newStatus, reason = '') => {
    const tenant = tenants.value.find(t => t.id === tenantId)
    if (tenant) {
      const oldStatus = tenant.status
      tenant.status = newStatus

      auditLogs.value.unshift({
        id: Date.now(),
        action: newStatus === 'suspended' ? 'TENANT_SUSPENDED' : 'TENANT_ACTIVATED',
        actor: 'Superadmin (Anda)',
        target: tenant.name,
        description: `Mengubah status tenant dari ${oldStatus} menjadi ${newStatus}. Alasan: ${reason || 'Operasional Superadmin'}`,
        time: 'Baru saja',
        ipAddress: '127.0.0.1'
      })

      const statusLabels = { active: 'Aktif', suspended: 'Dibekukan (Suspended)', trial: 'Masa Trial' }
      toast.info(`Status tenant "${tenant.name}" diubah menjadi: ${statusLabels[newStatus]}`, 'Status Diperbarui')
      return true
    }
    return false
  }

  // Action: Hapus Tenant
  const deleteTenant = (tenantId) => {
    const index = tenants.value.findIndex(t => t.id === tenantId)
    if (index !== -1) {
      const deleted = tenants.value.splice(index, 1)[0]
      auditLogs.value.unshift({
        id: Date.now(),
        action: 'TENANT_DELETED',
        actor: 'Superadmin (Anda)',
        target: deleted.name,
        description: `Menghapus tenant ${deleted.name} secara permanen dari platform SaaS.`,
        time: 'Baru saja',
        ipAddress: '127.0.0.1'
      })
      toast.error(`Tenant "${deleted.name}" telah dihapus dari platform.`, 'Tenant Dihapus')
      return true
    }
    return false
  }

  // Action: Tambah Paket Baru
  const createPlan = (planData) => {
    const newId = plans.value.length ? Math.max(...plans.value.map(p => p.id)) + 1 : 1
    const newPlan = {
      id: newId,
      code: planData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: planData.name,
      badge: planData.badge || 'Paket Baru',
      priceMonthly: Number(planData.priceMonthly) || 0,
      priceYearly: Number(planData.priceYearly) || 0,
      maxOutlets: Number(planData.maxOutlets) || 1,
      maxStaff: Number(planData.maxStaff) || 5,
      maxProducts: Number(planData.maxProducts) || 500,
      features: Array.isArray(planData.features) ? planData.features : (planData.featuresText || '').split('\n').filter(Boolean),
      isPopular: Boolean(planData.isPopular),
      isActive: true,
      subscriberCount: 0
    }

    plans.value.push(newPlan)
    auditLogs.value.unshift({
      id: Date.now(),
      action: 'PLAN_CREATED',
      actor: 'Superadmin (Anda)',
      target: newPlan.name,
      description: `Menerbitkan paket langganan baru "${newPlan.name}" dengan harga Rp ${newPlan.priceMonthly.toLocaleString('id-ID')}/bln.`,
      time: 'Baru saja',
      ipAddress: '127.0.0.1'
    })
    toast.success(`Paket langganan "${newPlan.name}" berhasil dibuat!`, 'Paket Diterbitkan')
    return newPlan
  }

  // Action: Edit Paket
  const updatePlan = (planId, planData) => {
    const plan = plans.value.find(p => p.id === planId)
    if (plan) {
      plan.name = planData.name || plan.name
      plan.badge = planData.badge !== undefined ? planData.badge : plan.badge
      plan.priceMonthly = Number(planData.priceMonthly) || plan.priceMonthly
      plan.priceYearly = Number(planData.priceYearly) || plan.priceYearly
      plan.maxOutlets = Number(planData.maxOutlets) || plan.maxOutlets
      plan.maxStaff = Number(planData.maxStaff) || plan.maxStaff
      plan.maxProducts = Number(planData.maxProducts) || plan.maxProducts
      plan.isPopular = Boolean(planData.isPopular)
      if (planData.featuresText) {
        plan.features = planData.featuresText.split('\n').filter(Boolean)
      } else if (Array.isArray(planData.features)) {
        plan.features = planData.features
      }

      auditLogs.value.unshift({
        id: Date.now(),
        action: 'PLAN_UPDATED',
        actor: 'Superadmin (Anda)',
        target: plan.name,
        description: `Memperbarui konfigurasi dan harga paket "${plan.name}".`,
        time: 'Baru saja',
        ipAddress: '127.0.0.1'
      })
      toast.success(`Paket "${plan.name}" berhasil diperbarui!`, 'Paket Disimpan')
      return true
    }
    return false
  }

  // Action: Hapus Paket
  const deletePlan = (planId) => {
    const plan = plans.value.find(p => p.id === planId)
    if (!plan) return false

    // Cek apakah paket sedang dipakai oleh tenant
    const activeSubscribers = tenants.value.filter(t => t.planId === planId)
    if (activeSubscribers.length > 0) {
      toast.error(`Tidak dapat menghapus paket "${plan.name}" karena sedang digunakan oleh ${activeSubscribers.length} tenant!`, 'Hapus Ditolak')
      return false
    }

    const index = plans.value.findIndex(p => p.id === planId)
    plans.value.splice(index, 1)

    auditLogs.value.unshift({
      id: Date.now(),
      action: 'PLAN_DELETED',
      actor: 'Superadmin (Anda)',
      target: plan.name,
      description: `Menghapus paket ${plan.name} dari katalog SaaS.`,
      time: 'Baru saja',
      ipAddress: '127.0.0.1'
    })
    toast.info(`Paket "${plan.name}" berhasil dihapus.`, 'Paket Dihapus')
    return true
  }

  // Action: Verifikasi Domain Manual
  const verifyDomain = (domainId) => {
    const d = domains.value.find(item => item.id === domainId)
    if (d) {
      d.dnsVerified = true
      d.sslStatus = 'active'
      toast.success(`Domain "${d.hostname}" berhasil diverifikasi dan SSL aktif!`, 'DNS Terverifikasi')
      return true
    }
    return false
  }

  const getPlanById = (id) => {
    return plans.value.find(p => p.id === id) || { name: 'Unknown Plan', priceMonthly: 0 }
  }

  return {
    plans,
    tenants,
    domains,
    auditLogs,
    totalTenants,
    activeTenants,
    trialTenants,
    suspendedTenants,
    totalOutletsManaged,
    totalMRR,
    createTenant,
    updateTenantStatus,
    deleteTenant,
    createPlan,
    updatePlan,
    deletePlan,
    verifyDomain,
    getPlanById
  }
})
