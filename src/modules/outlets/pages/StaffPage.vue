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

    <!-- Role Explanation Cards (Clean Modern Cards with Role Halo Icons) -->
    <div class="metrics-grid-4">
      <div class="stat-card role-card">
        <div class="stat-icon-halo halo-purple">
          <AppIcon name="shield" :size="24" />
        </div>
        <div class="stat-body">
          <div class="role-header-line">
            <span class="role-title">Owner / Pemilik</span>
            <span class="role-tag-badge tag-purple">Akses Penuh</span>
          </div>
          <span class="stat-sub">Hak akses absolut, kelola cabang, paket SaaS & analitik keuangan</span>
        </div>
      </div>

      <div class="stat-card role-card">
        <div class="stat-icon-halo halo-blue">
          <AppIcon name="users" :size="24" />
        </div>
        <div class="stat-body">
          <div class="role-header-line">
            <span class="role-title">Supervisor</span>
            <span class="role-tag-badge tag-blue">Otorisasi Kas</span>
          </div>
          <span class="stat-sub">Audit laci, rekonsiliasi shift & persetujuan void transaksi</span>
        </div>
      </div>

      <div class="stat-card role-card">
        <div class="stat-icon-halo halo-emerald">
          <AppIcon name="pos" :size="24" />
        </div>
        <div class="stat-body">
          <div class="role-header-line">
            <span class="role-title">Kasir (Cashier)</span>
            <span class="role-tag-badge tag-emerald">Layanan POS</span>
          </div>
          <span class="stat-sub">Operasional kasir, input pesanan, buka-tutup shift & cetak struk</span>
        </div>
      </div>

      <div class="stat-card role-card">
        <div class="stat-icon-halo halo-amber">
          <AppIcon name="cart" :size="24" />
        </div>
        <div class="stat-body">
          <div class="role-header-line">
            <span class="role-title">Dapur (Kitchen)</span>
            <span class="role-tag-badge tag-amber">Display KDS</span>
          </div>
          <span class="stat-sub">Pantau antrean masak pesanan secara live di Kitchen Display</span>
        </div>
      </div>
    </div>

    <!-- Staff Table Section -->
    <BaseCard class="mt-6">
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
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.625rem;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.025em;
  color: #0f172a;
  margin: 0;
}

.page-subtitle {
  font-size: 0.925rem;
  line-height: 1.6;
  color: #64748b;
  margin-top: 0.5rem;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  padding: 0.65rem 0.85rem 0.65rem 2.4rem;
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
  padding: 0.65rem 0.85rem;
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
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  white-space: nowrap;
}

.data-table td {
  padding: 1rem 1.25rem;
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

/* Role Explanation Cards */
.role-card {
  align-items: flex-start;
  padding: 1.25rem 1.35rem;
}

.role-header-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.role-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
}

.role-tag-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

.tag-purple { background: #faf5ff; color: #7c3aed; border: 1px solid #e9d5ff; }
.tag-blue { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.tag-emerald { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
.tag-amber { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
</style>
