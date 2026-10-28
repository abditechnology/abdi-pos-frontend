import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '../../../shared/composables/useToast'
import { subscriptionService } from '../../../shared/services/subscriptionService'

export const usePlatformStore = defineStore('platform', () => {
  const toast = useToast()

  // 1. Data Paket Langganan SaaS (SaaS Subscription Plans)
  const plans = ref([
    {
      id: 1,
      code: 'free_trial',
      name: 'Free Plan (Trial 30 Hari)',
      badge: 'Uji Coba Penuh',
      priceMonthly: 0,
      priceYearly: 0,
      maxOutlets: 1,
      maxStaff: 1,
      maxProducts: 20,
      features: [
        '1 Cabang / Outlet',
        '1 Akun',
        'Katalog Maksimal 20 Menu',
        'Maksimal 50 Transaksi Kasir',
        'Laporan Penjualan Dasar',
        'Subdomain (.abdipos.com)'
      ],
      isPopular: false,
      isActive: true,
      subscriberCount: 8
    },
    {
      id: 2,
      code: 'ekonomis',
      name: 'Ekonomis UMKM',
      badge: 'Paling Terjangkau',
      priceMonthly: 49000,
      priceYearly: 490000,
      maxOutlets: 1,
      maxStaff: 2,
      maxProducts: 20,
      features: [
        '1 Cabang / Outlet',
        '2 Akun',
        'Katalog Maksimal 20 Menu',
        'Maksimal 50 Transaksi Harian',
        'Program Member & Poin Loyalitas',
        'Diskon, Voucher & Bundling Promo',
        'Manajemen Stok Inventaris',
        'Ekspor Laporan ke Excel (CSV)'
      ],
      isPopular: false,
      isActive: true,
      subscriberCount: 28
    },
    {
      id: 3,
      code: 'pro',
      name: 'Business Pro',
      badge: 'Best Seller',
      priceMonthly: 149000,
      priceYearly: 1490000,
      maxOutlets: 2,
      maxStaff: 5,
      maxProducts: 50,
      features: [
        'Maksimal 2 Cabang / Outlet',
        '5 Akun',
        'Katalog Maksimal 50 Menu',
        'Transaksi Tanpa Batas (Unlimited)',
        'Semua Fitur Paket UMKM',
        'Buka-Tutup Shift & Rekonsiliasi Kas',
        'Resep Bahan Baku & HPP Otomatis',
        'Laporan Analitik Multi-Cabang'
      ],
      isPopular: true,
      isActive: true,
      subscriberCount: 42
    },
    {
      id: 4,
      code: 'enterprise',
      name: 'Enterprise',
      badge: 'Multi-Cabang & Waralaba',
      priceMonthly: 299000,
      priceYearly: 2990000,
      maxOutlets: 10,
      maxStaff: 20,
      maxProducts: 100,
      features: [
        'Hingga 10 Cabang / Outlet',
        '20 Akun',
        'Katalog Maksimal 100 Menu',
        'Semua Fitur Business Pro',
        'Kitchen Display System (KDS Kanban)',
        'Multi-Outlet Centralized Dashboard',
        'Mutasi & Transfer Stok Antar-Cabang',
        'Dukungan Custom Domain (.com / .id)',
        'Sertifikat SSL HTTPS Otomatis',
        'Laporan Finansial Konsolidasi',
        'Hak Akses Tingkat Lanjut (RBAC)'
      ],
      isPopular: false,
      isActive: true,
      subscriberCount: 12
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

  // 5. Data Profil & Pengaturan Superadmin Root
  const superadmin = ref({
    name: 'Abdulloh Najib',
    email: 'admin@abdipos.com',
    role: 'Superadmin SaaS Owner',
    title: 'Platform Architect & CEO',
    phone: '0812-3456-7890',
    location: 'Tulungagung, Jawa Timur, ID',
    address: 'Jl. Pahlawan No. 88, Kedungwaru, Tulungagung',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces',
    joinDate: '10 Januari 2026',
    lastLogin: 'Hari ini, 08:15 WIB',
    twoFactorEnabled: true,
    maintenanceMode: false,
    sessionTimeout: '24 Jam',
    emailNotifications: {
      newTenant: true,
      subscriptionPaid: true,
      serverAlerts: true
    },
    activeSessions: [
      { id: 1, device: 'MacBook Pro 16" (macOS Sequoia)', location: 'Tulungagung, ID', ip: '180.244.12.89', current: true, time: 'Aktif Sekarang' },
      { id: 2, device: 'iPhone 15 Pro (Safari Mobile)', location: 'Surabaya, ID', ip: '114.125.45.22', current: false, time: 'Kemarin, 20:15' }
    ]
  })

  const updateSuperadminProfile = (data) => {
    Object.assign(superadmin.value, data)
    auditLogs.value.unshift({
      id: Date.now(),
      action: 'ADMIN_PROFILE_UPDATED',
      actor: 'Superadmin (Anda)',
      target: superadmin.value.name,
      description: 'Memperbarui informasi profil dan kontak akun Superadmin.',
      time: 'Baru saja',
      ipAddress: '127.0.0.1'
    })
    toast.success('Profil Superadmin berhasil diperbarui!')
    return true
  }

  const updateSuperadminPassword = (oldPassword, newPassword) => {
    auditLogs.value.unshift({
      id: Date.now(),
      action: 'ADMIN_PASSWORD_CHANGED',
      actor: 'Superadmin (Anda)',
      target: 'Root Security',
      description: 'Kata sandi akun Superadmin berhasil diubah.',
      time: 'Baru saja',
      ipAddress: '127.0.0.1'
    })
    toast.success('Kata sandi Superadmin berhasil diubah!')
    return true
  }

  const fetchPlatformPlans = async () => {
    try {
      const res = await subscriptionService.getPlatformPlans()
      if (res?.data && Array.isArray(res.data)) {
        plans.value = res.data.map(p => ({
          id: p.id,
          code: p.code,
          name: p.name,
          badge: p.is_popular ? 'Paling Populer' : (p.price === 0 ? 'Free' : ''),
          priceMonthly: Number(p.price) || 0,
          priceYearly: (Number(p.price) || 0) * 10,
          maxOutlets: p.limits?.outlet || 1,
          maxStaff: p.limits?.user || 1,
          maxProducts: p.limits?.product || 20,
          features: Object.entries(p.features || {})
            .filter(([_, enabled]) => Boolean(enabled))
            .map(([k]) => k.replace(/_/g, ' ')),
          isPopular: Boolean(p.is_popular),
          isActive: p.status === 'active',
          subscriberCount: p.subscriptions_count || 0
        }))
      }
    } catch (e) {
      console.warn('Backend fetchPlatformPlans offline, using local plans.')
    }
    return plans.value
  }

  const getPlanById = (id) => {
    return plans.value.find(p => p.id === id) || { name: 'Unknown Plan', priceMonthly: 0 }
  }

  return {
    plans,
    tenants,
    domains,
    auditLogs,
    superadmin,
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
    fetchPlatformPlans,
    verifyDomain,
    updateSuperadminProfile,
    updateSuperadminPassword,
    getPlanById
  }
})
