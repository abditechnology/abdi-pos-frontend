import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'
import { pluginService } from '../services/pluginService'

export const usePluginStore = defineStore('plugin', () => {
  const toast = useToast()

  const plugins = ref([
    {
      id: 'absensi_selfie',
      name: 'Absensi Selfie & Geofencing GPS',
      shortDesc: 'Clock-in/out staf dengan kamera selfie tablet/HP + validasi radius GPS toko.',
      category: 'hr',
      categoryLabel: 'SDM & Karyawan',
      icon: 'camera',
      colorClass: 'halo-purple',
      badgeClass: 'tag-purple',
      priceMonthly: 20000,
      isInstalled: true,
      trialDaysLeft: 14,
      subscriberCount: 18,
      status: 'active',
      targetSectors: 'Semua Sektor (F&B, Salon, Ritel, Jasa)',
      features: [
        'Wajib foto selfie wajah saat jam masuk & pulang',
        'Deteksi radius koordinat GPS toko (maks. 50 meter)',
        'Rekap otomatis keterlambatan & total jam lembur',
        'Cegah kecurangan titip absen antar karyawan'
      ],
      demoType: 'selfie'
    },
    {
      id: 'kalkulator_komisi',
      name: 'Kalkulator Komisi Staf & Terapis',
      shortDesc: 'Otomatis hitung bagi hasil/komisi per jasa treatment atau item ritel terjual.',
      category: 'hr',
      categoryLabel: 'SDM & Jasa',
      icon: 'dollar',
      colorClass: 'halo-emerald',
      badgeClass: 'tag-emerald',
      priceMonthly: 25000,
      isInstalled: false,
      trialDaysLeft: null,
      subscriberCount: 8,
      status: 'active',
      targetSectors: 'Salon, Barbershop, Spa, Klinik & Bengkel',
      features: [
        'Set persentase komisi per jasa (contoh 20% potong rambut)',
        'Set komisi nominal flat per barang (contoh Rp 5.000/pomade)',
        'Pilih nama staf/kapster langsung di layar kasir POS',
        'Laporan rekap slip gaji & komisi bulanan siap cetak'
      ],
      demoType: 'commission'
    },
    {
      id: 'whatsapp_bot',
      name: 'WhatsApp Bot & Notifikasi Status',
      shortDesc: 'Kirim pesan otomatis saat pesanan siap diambil, cucian selesai, atau servis tuntas.',
      category: 'whatsapp',
      categoryLabel: 'Otomasi WhatsApp',
      icon: 'bell',
      colorClass: 'halo-cyan',
      badgeClass: 'tag-cyan',
      priceMonthly: 29000,
      isInstalled: true,
      trialDaysLeft: 21,
      subscriberCount: 14,
      status: 'active',
      targetSectors: 'Laundry, Ekspedisi, Servis & F&B',
      features: [
        'Pesan otomatis saat cucian laundry siap diambil',
        'Pesan status servis kendaraan / barang elektronik tuntas',
        'Kirim link resi digital langsung ke nomor WA pelanggan',
        'Template pesan ramah dan personal dengan nama pelanggan'
      ],
      demoType: 'waboot'
    },
    {
      id: 'whatsapp_broadcast',
      name: 'WhatsApp Broadcast & Pengingat Ultah',
      shortDesc: 'Kirim pesan promosi massal & voucher hadiah ulang tahun otomatis ke pelanggan.',
      category: 'whatsapp',
      categoryLabel: 'Pemasaran & Retensi',
      icon: 'gift',
      colorClass: 'halo-blue',
      badgeClass: 'tag-blue',
      priceMonthly: 25000,
      isInstalled: false,
      trialDaysLeft: null,
      subscriberCount: 11,
      status: 'active',
      targetSectors: 'F&B, Butik Fashion, Salon & Spa',
      features: [
        'Kirim ucapan selamat ulang tahun otomatis berhadiah voucher',
        'Broadcast pengumuman diskon akhir pekan dengan 1 klik',
        'Filter penerima berdasarkan total belanja atau tier member',
        'Anti-banned delay interval pengiriman aman'
      ],
      demoType: 'broadcast'
    },
    {
      id: 'booking_online',
      name: 'Reservasi & Booking Mandiri Online',
      shortDesc: 'Portal booking mandiri jadwal kunjungan treatment & pilih staf dari rumah.',
      category: 'service',
      categoryLabel: 'Layanan & Booking',
      icon: 'clock',
      colorClass: 'halo-indigo',
      badgeClass: 'tag-indigo',
      priceMonthly: 35000,
      isInstalled: false,
      trialDaysLeft: null,
      subscriberCount: 7,
      status: 'active',
      targetSectors: 'Salon, Barbershop, Spa, Dokter Gigi & Cuci Mobil',
      features: [
        'Link web booking mandiri (contoh: booking.abdipos.com/namasalon)',
        'Pelanggan bebas pilih jam, layanan, dan staf favorit',
        'Sinkronisasi kalender jadwal terapis agar tidak bentrok',
        'Opsi DP / uang muka reservasi via QRIS'
      ],
      demoType: 'booking'
    },
    {
      id: 'kas_bon',
      name: 'Kas Bon & Pembukuan Piutang Pelanggan',
      shortDesc: 'Catat hutang/bon pelanggan setia, batas kredit, dan reminder tagihan santun via WA.',
      category: 'finance',
      categoryLabel: 'Keuangan & Kas Bon',
      icon: 'receipt',
      colorClass: 'halo-amber',
      badgeClass: 'tag-amber',
      priceMonthly: 15000,
      isInstalled: false,
      trialDaysLeft: null,
      subscriberCount: 12,
      status: 'active',
      targetSectors: 'Toko Kelontong, Warkop, Ritel & Bengkel',
      features: [
        'Catat transaksi "Hutang / Kas Bon" di kasir POS dengan 1 klik',
        'Batas maksimal limit kredit per member pelanggan',
        'Riwayat pembayaran cicilan / pelunasan bertahap',
        'Kirim rekap rincian hutang via WhatsApp dengan kalimat santun'
      ],
      demoType: 'kasbon'
    },
    {
      id: 'biaya_operasional',
      name: 'Catat Biaya Operasional & Laba Bersih',
      shortDesc: 'Catat arus kas keluar non-HPP (listrik, sewa, gaji, kantong) untuk laba bersih riil.',
      category: 'finance',
      categoryLabel: 'Keuangan & Analitik',
      icon: 'chart',
      colorClass: 'halo-rose',
      badgeClass: 'tag-rose',
      priceMonthly: 29000,
      isInstalled: true,
      trialDaysLeft: 18,
      subscriberCount: 16,
      status: 'active',
      targetSectors: 'Semua Sektor Bisnis',
      features: [
        'Pencatatan kas keluar: listrik PLN, air PDAM, sewa toko, sampah',
        'Kalkulasi Net Profit (Laba Bersih riil setelah semua beban)',
        'Grafik tren pengeluaran operasional per kategori',
        'Laporan Arus Kas (Cash Flow) bulanan komprehensif'
      ],
      demoType: 'expense'
    },
    {
      id: 'meja_qr',
      name: 'Meja & Standee QR Self-Order',
      shortDesc: 'Pelanggan scan barcode QR di meja, pesan menu mandiri & bayar via QRIS tanpa antri kasir.',
      category: 'ordering',
      categoryLabel: 'Self-Order & Meja',
      icon: 'qr',
      colorClass: 'halo-orange',
      badgeClass: 'tag-orange',
      priceMonthly: 30000,
      isInstalled: false,
      trialDaysLeft: null,
      subscriberCount: 15,
      status: 'active',
      targetSectors: 'Cafe, Resto, Pujasera, Foodcourt & Warkop',
      features: [
        'Generate dan cetak QR Code unik per nomor meja atau standee',
        'Buku menu digital interaktif dengan foto & opsi kustomisasi',
        'Pesanan langsung masuk ke Kasir POS & Kitchen Display (KDS)',
        'Mendukung bayar langsung di awal (QRIS) atau bayar di kasir'
      ],
      demoType: 'meja_qr'
    }
  ])

  // Mock Tenant Subscribers for Superadmin breakdown
  const tenantSubscribers = ref([
    { id: 1, pluginId: 'absensi_selfie', tenantName: 'Martabak & Terang Bulan Nusantara', subdomain: 'martabaknusantara.abdipos.com', ownerName: 'Ahmad Najib', phone: '0812-3456-7890', installedAt: '12 Agustus 2026', monthlyFee: 20000, status: 'active' },
    { id: 2, pluginId: 'absensi_selfie', tenantName: 'Kopi Kenangan Senja', subdomain: 'kopisenja.abdipos.com', ownerName: 'Fathur Rahman', phone: '0813-9876-1122', installedAt: '01 Juli 2026', monthlyFee: 20000, status: 'active' },
    { id: 3, pluginId: 'absensi_selfie', tenantName: 'Barbershop Ganteng Maksimal', subdomain: 'barbershop.abdipos.com', ownerName: 'Rian Pratama', phone: '0819-3344-5566', installedAt: '25 September 2026', monthlyFee: 20000, status: 'active' },
    { id: 4, pluginId: 'whatsapp_bot', tenantName: 'Laundry Kilat 24 Jam', subdomain: 'laundrykilat.abdipos.com', ownerName: 'Dewi Lestari', phone: '0821-4455-6677', installedAt: '05 September 2026', monthlyFee: 29000, status: 'active' },
    { id: 5, pluginId: 'whatsapp_bot', tenantName: 'Bengkel Motor Berkah Jaya', subdomain: 'bengkelberkah.abdipos.com', ownerName: 'Hendra Saputra', phone: '0852-6677-8899', installedAt: '14 Oktober 2026', monthlyFee: 29000, status: 'active' },
    { id: 6, pluginId: 'kalkulator_komisi', tenantName: 'Glow Up Aesthetic & Beauty Clinic', subdomain: 'glowup.abdipos.com', ownerName: 'dr. Sarah Amanda', phone: '0812-8899-0011', installedAt: '19 Agustus 2026', monthlyFee: 25000, status: 'active' },
    { id: 7, pluginId: 'kalkulator_komisi', tenantName: 'Barbershop Ganteng Maksimal', subdomain: 'barbershop.abdipos.com', ownerName: 'Rian Pratama', phone: '0819-3344-5566', installedAt: '25 September 2026', monthlyFee: 25000, status: 'active' },
    { id: 8, pluginId: 'booking_online', tenantName: 'Glow Up Aesthetic & Beauty Clinic', subdomain: 'glowup.abdipos.com', ownerName: 'dr. Sarah Amanda', phone: '0812-8899-0011', installedAt: '19 Agustus 2026', monthlyFee: 35000, status: 'active' },
    { id: 9, pluginId: 'whatsapp_broadcast', tenantName: 'Butik Hijab Cantika', subdomain: 'cantika.abdipos.com', ownerName: 'Nur Hasanah', phone: '0878-1122-3344', installedAt: '03 Oktober 2026', monthlyFee: 25000, status: 'active' },
    { id: 10, pluginId: 'kas_bon', tenantName: 'Toko Kelontong Sumber Rejeki', subdomain: 'sumberrejeki.abdipos.com', ownerName: 'Pak Hadi', phone: '0813-7788-9900', installedAt: '28 September 2026', monthlyFee: 15000, status: 'active' },
    { id: 11, pluginId: 'biaya_operasional', tenantName: 'Martabak & Terang Bulan Nusantara', subdomain: 'martabaknusantara.abdipos.com', ownerName: 'Ahmad Najib', phone: '0812-3456-7890', installedAt: '15 Agustus 2026', monthlyFee: 29000, status: 'active' },
    { id: 12, pluginId: 'biaya_operasional', tenantName: 'Kopi Kenangan Senja', subdomain: 'kopisenja.abdipos.com', ownerName: 'Fathur Rahman', phone: '0813-9876-1122', installedAt: '01 Juli 2026', monthlyFee: 29000, status: 'active' },
    { id: 13, pluginId: 'meja_qr', tenantName: 'Kopi Kenangan Senja', subdomain: 'kopisenja.abdipos.com', ownerName: 'Fathur Rahman', phone: '0813-9876-1122', installedAt: '10 Oktober 2026', monthlyFee: 30000, status: 'active' }
  ])

  // Computed
  const activePlugins = computed(() => plugins.value.filter(p => p.isInstalled))
  const totalActiveMonthlyFee = computed(() => {
    return activePlugins.value.reduce((acc, p) => acc + p.priceMonthly, 0)
  })

  const totalPluginMRR = computed(() => {
    return plugins.value.reduce((acc, p) => acc + (p.priceMonthly * (p.subscriberCount || 0)), 0)
  })

  const totalPluginSubscribers = computed(() => {
    return plugins.value.reduce((acc, p) => acc + (p.subscriberCount || 0), 0)
  })

  async function fetchPlugins() {
    try {
      const res = await pluginService.getTenantPlugins()
      if (res?.data && Array.isArray(res.data)) {
        res.data.forEach(bePlugin => {
          const match = plugins.value.find(p => p.id === bePlugin.id || p.id.replace('_', '-') === bePlugin.id)
          if (match) {
            match.isInstalled = Boolean(bePlugin.is_active)
          }
        })
      }
    } catch (e) {
      console.warn('Backend fetchPlugins offline, using local plugin data.')
    }
  }

  async function togglePlugin(pluginId) {
    try {
      const cleanKey = pluginId.replace('_', '-')
      await pluginService.togglePlugin(cleanKey)
    } catch (e) {
      console.warn('Backend togglePlugin offline, toggling locally.')
    }

    const p = plugins.value.find(item => item.id === pluginId)
    if (p) {
      p.isInstalled = !p.isInstalled
      if (p.isInstalled) {
        p.trialDaysLeft = 30
      }
      return p.isInstalled
    }
    return false
  }

  function getPlugin(pluginId) {
    return plugins.value.find(item => item.id === pluginId)
  }

  function createPlugin(newPlugin) {
    const id = newPlugin.id || `plugin_${Date.now()}`
    const pluginToAdd = {
      ...newPlugin,
      id,
      subscriberCount: 0,
      isInstalled: false,
      trialDaysLeft: null,
      status: 'active'
    }
    plugins.value.push(pluginToAdd)
    toast.success(`Plugin "${newPlugin.name}" berhasil ditambahkan ke katalog SaaS!`)
    return pluginToAdd
  }

  function updatePlugin(pluginId, updatedData) {
    const idx = plugins.value.findIndex(p => p.id === pluginId)
    if (idx !== -1) {
      plugins.value[idx] = {
        ...plugins.value[idx],
        ...updatedData
      }
      toast.success(`Konfigurasi plugin "${plugins.value[idx].name}" berhasil diperbarui!`)
      return plugins.value[idx]
    }
    return null
  }

  function deletePlugin(pluginId) {
    const idx = plugins.value.findIndex(p => p.id === pluginId)
    if (idx !== -1) {
      const deletedName = plugins.value[idx].name
      plugins.value.splice(idx, 1)
      toast.info(`Plugin "${deletedName}" berhasil dihapus dari katalog SaaS.`)
      return true
    }
    return false
  }

  return {
    plugins,
    activePlugins,
    tenantSubscribers,
    totalActiveMonthlyFee,
    totalPluginMRR,
    totalPluginSubscribers,
    fetchPlugins,
    togglePlugin,
    getPlugin,
    createPlugin,
    updatePlugin,
    deletePlugin
  }
})
