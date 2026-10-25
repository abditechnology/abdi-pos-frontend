import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // Sidebar state (collapsed or expanded)
  const isSidebarCollapsed = ref(false)
  const isMobileSidebarOpen = ref(false)

  // Notifications
  const notifications = ref([
    {
      id: 1,
      title: 'Stok Terigu Menipis',
      message: 'Sisa stok Terigu Segitiga Biru tinggal 4 kg di Outlet Pusat.',
      type: 'warning',
      time: '10 menit yang lalu',
      unread: true
    },
    {
      id: 2,
      title: 'Shift Kasir Dimulai',
      message: 'Shift kasir pagi telah dibuka oleh Ahmad Najib.',
      type: 'info',
      time: '1 jam yang lalu',
      unread: true
    },
    {
      id: 3,
      title: 'Transaksi Sukses #TRX-8921',
      message: 'Pembayaran QRIS Rp 125.000 terverifikasi.',
      type: 'success',
      time: '2 jam yang lalu',
      unread: false
    }
  ])

  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

  const toggleMobileSidebar = () => {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  }

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach(n => { n.unread = false })
  }

  return {
    isSidebarCollapsed,
    isMobileSidebarOpen,
    notifications,
    toggleSidebar,
    toggleMobileSidebar,
    markAllNotificationsAsRead
  }
})
