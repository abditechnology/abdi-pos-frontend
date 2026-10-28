import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast()

  // Current active user
  const user = ref({
    id: 1,
    name: 'Ahmad Najib',
    email: 'najib@martabaknusantara.com',
    role: 'Owner & Tenant Admin',
    roleCode: 'owner', // 'owner', 'cashier', 'superadmin'
    phone: '0812-3456-7890',
    address: 'Jl. Jenderal Sudirman No. 45, Kebayoran Baru, Jakarta Selatan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces',
    joinDate: '10 Agustus 2026',
    lastPasswordChange: '11 Oktober 2026',
    assignedOutletId: 1,
    assignedOutletName: 'Outlet Pusat - Sudirman',
    activeSessions: [
      { id: 1, device: 'Chrome on macOS (Device Ini)', location: 'Jakarta, ID', ip: '180.244.12.89', current: true, time: 'Aktif Sekarang' },
      { id: 2, device: 'Tablet POS Sunmi V2 Pro', location: 'Outlet Sudirman', ip: '192.168.1.104', current: false, time: 'Kemarin, 21:30' }
    ],
    permissions: [
      'pos:transact',
      'pos:shift_open_close',
      'inventory:view',
      'inventory:adjust',
      'reports:view_all',
      'products:crud',
      'promotions:manage',
      'tenant:manage_subscription'
    ]
  })

  // Active Tenant Context (Derived from domain/auth as per PRD Section 5 & 6)
  const tenant = ref({
    id: 101,
    name: 'Martabak & Terang Bulan Nusantara',
    slug: 'martabak-nusantara',
    subdomain: 'martabaknusantara.abdipos.com',
    customDomain: 'martabaknusantara.id',
    plan: 'Business Pro',
    status: 'active',
    currency: 'IDR',
    currencySymbol: 'Rp'
  })

  // Cashier active shift state (PRD Section 9.12)
  const activeShift = ref({
    id: 402,
    outletId: 1,
    cashierName: 'Ahmad Najib',
    openedAt: '2026-10-25 08:00',
    startingCash: 250000,
    status: 'open'
  })

  // Demo Accounts for seamless developer & reviewer quick testing
  const demoAccounts = [
    {
      role: 'Owner & Admin',
      roleCode: 'owner',
      name: 'Ahmad Najib',
      email: 'najib@martabaknusantara.com',
      password: 'password123',
      phone: '0812-3456-7890',
      address: 'Jl. Jenderal Sudirman No. 45, Jakarta Selatan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces',
      assignedOutletName: 'Outlet Pusat - Sudirman',
      description: 'Akses penuh seluruh cabang, laporan keuangan, dan langganan SaaS.'
    },
    {
      role: 'Kasir Operasional',
      roleCode: 'cashier',
      name: 'Siti Rahmawati',
      email: 'kasir.tebet@martabaknusantara.com',
      password: 'kasir123',
      phone: '0857-9988-1122',
      address: 'Jl. Tebet Raya No. 12, Tebet, Jakarta Selatan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces',
      assignedOutletName: 'Cabang Tebet',
      description: 'Akses cepat kasir (POS), buka/tutup shift, dan cetak struk.'
    },
    {
      role: 'Superadmin SaaS Owner',
      roleCode: 'superadmin',
      name: 'Founder Abdi POS',
      email: 'admin@abdipos.com',
      password: 'superadmin123',
      phone: '0811-2233-4455',
      address: 'Cyber 2 Tower, Kuningan, Jakarta Selatan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces',
      assignedOutletName: 'Konsol Superadmin Cloud',
      description: 'Pengendali seluruh tenant, katalog paket harga, dan infrastruktur domain.'
    }
  ]

  const isAuthenticated = computed(() => !!user.value)

  const hasPermission = (permission) => {
    if (!user.value) return false
    if (user.value.roleCode === 'owner' || user.value.roleCode === 'superadmin') return true
    return user.value.permissions?.includes(permission) || false
  }

  // Action: Login (with demo accounts matching or custom login)
  const login = async (email, password, remember = false) => {
    const matched = demoAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase())

    if (matched) {
      user.value = {
        id: matched.roleCode === 'owner' ? 1 : matched.roleCode === 'cashier' ? 2 : 99,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        roleCode: matched.roleCode,
        phone: matched.phone,
        address: matched.address,
        avatar: matched.avatar,
        joinDate: '10 Agustus 2026',
        lastPasswordChange: '11 Oktober 2026',
        assignedOutletId: matched.roleCode === 'cashier' ? 2 : 1,
        assignedOutletName: matched.assignedOutletName,
        activeSessions: [
          { id: 1, device: 'Browser Saat Ini', location: 'Jakarta, ID', ip: '180.244.12.89', current: true, time: 'Aktif Sekarang' }
        ],
        permissions: matched.roleCode === 'cashier' 
          ? ['pos:transact', 'pos:shift_open_close']
          : ['all']
      }
    } else {
      // Fallback for custom credentials
      user.value = {
        id: Date.now(),
        name: email.split('@')[0].replace(/[._-]/g, ' ').toUpperCase(),
        email: email,
        role: 'Staf Operasional',
        roleCode: 'cashier',
        phone: '0812-0000-0000',
        address: 'Indonesia',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces',
        joinDate: 'Hari ini',
        lastPasswordChange: 'Baru saja',
        assignedOutletId: 1,
        assignedOutletName: 'Outlet Utama',
        activeSessions: [
          { id: 1, device: 'Browser Saat Ini', location: 'Jakarta, ID', ip: '127.0.0.1', current: true, time: 'Aktif Sekarang' }
        ],
        permissions: ['pos:transact']
      }
    }

    toast.success(`Selamat datang kembali, ${user.value.name}!`, 'Login Berhasil')
    return user.value
  }

  // Action: Logout
  const logout = () => {
    const prevName = user.value?.name || 'Pengguna'
    user.value = null
    toast.info(`Anda telah keluar dari akun ${prevName}.`, 'Sesi Berakhir')
  }

  // Action: Update Profile Data (CRUD Profile)
  const updateProfile = (profileData) => {
    if (!user.value) return false

    user.value = {
      ...user.value,
      name: profileData.name || user.value.name,
      email: profileData.email || user.value.email,
      phone: profileData.phone || user.value.phone,
      address: profileData.address || user.value.address,
      avatar: profileData.avatar || user.value.avatar
    }

    toast.success('Profil pengguna berhasil diperbarui!', 'Perubahan Disimpan')
    return true
  }

  // Action: Update Password
  const changePassword = (currentPassword, newPassword) => {
    if (!user.value) return false

    user.value.lastPasswordChange = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    toast.success('Kata sandi berhasil diubah! Gunakan kata sandi baru untuk login berikutnya.', 'Sandi Diperbarui')
    return true
  }

  // Action: Terminate Session
  const terminateSession = (sessionId) => {
    if (!user.value) return
    user.value.activeSessions = user.value.activeSessions.filter(s => s.id !== sessionId)
    toast.info('Sesi login pada perangkat lain berhasil dihentikan.', 'Sesi Diputus')
  }

  return {
    user,
    tenant,
    activeShift,
    demoAccounts,
    isAuthenticated,
    hasPermission,
    login,
    logout,
    updateProfile,
    changePassword,
    terminateSession
  }
})
