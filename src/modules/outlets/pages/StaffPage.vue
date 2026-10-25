<template>
  <div class="staff-page space-y-6">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Staf & Hak Akses (RBAC)</h1>
        <p class="page-subtitle">
          Kelola akun kasir, supervisor, koki dapur, dan atur penugasan cabang operasional staf Anda.
        </p>
      </div>

      <div class="header-actions">
        <BaseButton variant="primary" size="md" @click="openAddModal">
          <AppIcon name="plus" :size="16" />
          Undang Staf Baru
        </BaseButton>
      </div>
    </div>

    <!-- Role Explanation Banner -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="p-3 bg-purple-50 rounded-xl border border-purple-100">
        <span class="text-xs font-bold text-purple-700 block">Owner / Pemilik</span>
        <span class="text-[11px] text-purple-600 mt-0.5 block">Hak akses absolut, langganan & keuangan</span>
      </div>
      <div class="p-3 bg-blue-50 rounded-xl border border-blue-100">
        <span class="text-xs font-bold text-blue-700 block">Supervisor</span>
        <span class="text-[11px] text-blue-600 mt-0.5 block">Audit kas, rekonsiliasi shift & void struk</span>
      </div>
      <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
        <span class="text-xs font-bold text-emerald-700 block">Kasir (Cashier)</span>
        <span class="text-[11px] text-emerald-600 mt-0.5 block">POS kasir, buat order & cetak struk</span>
      </div>
      <div class="p-3 bg-amber-50 rounded-xl border border-amber-100">
        <span class="text-xs font-bold text-amber-700 block">Dapur (Kitchen)</span>
        <span class="text-[11px] text-amber-600 mt-0.5 block">Kitchen Display System (KDS) live</span>
      </div>
    </div>

    <!-- Staff Table Section -->
    <BaseCard>
      <div class="table-toolbar">
        <div class="search-box">
          <AppIcon name="search" :size="18" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama atau email staf..."
            class="search-input"
          />
        </div>

        <div class="filters-wrap">
          <select v-model="selectedRole" class="filter-select">
            <option value="ALL">Semua Peran (Role)</option>
            <option value="OWNER">Owner</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="CASHIER">Kasir</option>
            <option value="KITCHEN">Dapur</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Staf</th>
              <th>Kontak</th>
              <th class="text-center">Peran (Role)</th>
              <th>Penugasan Cabang</th>
              <th>Terakhir Login</th>
              <th class="text-center">Status</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredStaff.length === 0">
              <td colspan="7" class="empty-state">
                <AppIcon name="users" :size="36" class="text-slate-300 mx-auto mb-2" />
                <p class="font-medium text-slate-600">Tidak ada staf ditemukan.</p>
              </td>
            </tr>

            <tr
              v-for="s in filteredStaff"
              :key="s.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar-circle">
                    {{ s.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <span class="font-bold text-slate-800 block">{{ s.name }}</span>
                    <span class="text-xs text-slate-400">Bergabung: {{ s.joinedDate }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex flex-col text-xs">
                  <span class="font-medium text-slate-700">{{ s.email }}</span>
                  <span class="text-slate-400">{{ s.phone }}</span>
                </div>
              </td>
              <td class="text-center">
                <span
                  class="role-badge"
                  :class="`role-${s.role.toLowerCase()}`"
                >
                  {{ s.role }}
                </span>
              </td>
              <td>
                <span class="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {{ s.outletName }}
                </span>
              </td>
              <td class="text-xs text-slate-500 whitespace-nowrap">
                {{ s.lastLogin }}
              </td>
              <td class="text-center">
                <BaseBadge :variant="s.status === 'ACTIVE' ? 'success' : 'neutral'">
                  {{ s.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif' }}
                </BaseBadge>
              </td>
              <td class="text-center">
                <div class="flex items-center justify-center gap-1">
                  <BaseButton variant="secondary" size="sm" @click="openEditModal(s)">
                    <AppIcon name="edit" :size="14" />
                  </BaseButton>
                  <BaseButton
                    v-if="s.role !== 'OWNER'"
                    variant="danger"
                    size="sm"
                    @click="confirmDelete(s)"
                  >
                    <AppIcon name="trash" :size="14" />
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Staff Modal -->
    <StaffModal
      v-model="showStaffModal"
      :staff="selectedStaff"
      @staff-saved="handleStaffSaved"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Hapus Akun Staf?"
      confirm-text="Ya, Hapus Akun"
      variant="danger"
      @confirm="executeDelete"
    >
      <p class="text-sm text-slate-600">
        Apakah Anda yakin ingin menghapus akun <strong>{{ staffToDelete?.name }}</strong>? Staf ini tidak akan dapat login lagi ke sistem.
      </p>
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import ConfirmModal from '@/shared/components/ui/ConfirmModal.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import StaffModal from '../components/StaffModal.vue'
import { useStaffStore } from '../stores/staffStore'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()
const staffStore = useStaffStore()

const searchQuery = ref('')
const selectedRole = ref('ALL')

const showStaffModal = ref(false)
const showDeleteConfirm = ref(false)

const selectedStaff = ref(null)
const staffToDelete = ref(null)

const staffList = computed(() => staffStore.staffList)

const filteredStaff = computed(() => {
  return staffList.value.filter(s => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)

    const matchesRole =
      selectedRole.value === 'ALL' || s.role === selectedRole.value

    return matchesSearch && matchesRole
  })
})

function openAddModal() {
  selectedStaff.value = null
  showStaffModal.value = true
}

function openEditModal(s) {
  selectedStaff.value = s
  showStaffModal.value = true
}

function confirmDelete(s) {
  staffToDelete.value = s
  showDeleteConfirm.value = true
}

function executeDelete() {
  if (staffToDelete.value) {
    staffStore.deleteStaff(staffToDelete.value.id)
    toast.success(`Akun staf ${staffToDelete.value.name} telah dihapus.`)
    showDeleteConfirm.value = false
  }
}

function handleStaffSaved() {
  selectedStaff.value = null
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.search-box {
  position: relative;
  min-width: 280px;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 0.55rem 0.75rem 0.55rem 2.25rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.filters-wrap {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.55rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  background-color: #ffffff;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  white-space: nowrap;
}

.data-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0284c7;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.role-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.role-owner {
  background: #f3e8ff;
  color: #7e22ce;
  border: 1px solid #d8b4fe;
}

.role-supervisor {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.role-cashier {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.role-kitchen {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}
</style>
