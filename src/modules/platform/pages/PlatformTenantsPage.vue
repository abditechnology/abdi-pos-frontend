<template>
  <div class="platform-tenants-page animate-fade-in">
    <!-- Header -->
    <header class="page-header">
      <div>
        <div class="header-badge">
          <AppIcon name="store" :size="16" />
          <span>Manajemen Klien SaaS</span>
        </div>
        <h1 class="page-title">Daftar Tenant & Pengguna POS</h1>
        <p class="page-desc">
          Kelola seluruh bisnis yang mendaftar di sistem Abdi POS. Pantau paket langganan, subdomain, status aktif, dan jumlah cabang.
        </p>
      </div>

      <BaseButton variant="primary" size="lg" @click="openCreateModal">
        <template #icon><AppIcon name="plus" :size="18" /></template>
        + Tambah Tenant Baru
      </BaseButton>
    </header>

    <!-- Search & Filter Bar -->
    <div class="filter-bar base-card card-bordered">
      <div class="search-box">
        <BaseInput
          v-model="searchQuery"
          placeholder="Cari nama bisnis, subdomain, atau nama pemilik..."
          :clearable="true"
        >
          <template #prefix><AppIcon name="search" :size="16" /></template>
        </BaseInput>
      </div>

      <div class="filter-options">
        <!-- Status Filter Pills -->
        <div class="status-pills">
          <button
            v-for="s in statusOptions"
            :key="s.value"
            type="button"
            :class="['pill-btn', { 'is-active': selectedStatus === s.value }]"
            @click="selectedStatus = s.value"
          >
            {{ s.label }}
          </button>
        </div>

        <!-- Plan Filter Dropdown -->
        <select v-model="selectedPlan" class="plan-filter-select">
          <option value="all">Semua Paket SaaS</option>
          <option v-for="plan in platformStore.plans" :key="plan.id" :value="plan.id">
            {{ plan.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Tenants Data Table -->
    <div class="table-card base-card card-bordered">
      <div class="table-responsive">
        <table class="tenants-table">
          <thead>
            <tr>
              <th>Bisnis & Subdomain</th>
              <th>Pemilik (Owner)</th>
              <th>Paket Langganan</th>
              <th>Cabang</th>
              <th>Status Akun</th>
              <th>Masa Berlaku</th>
              <th class="text-right">Aksi Superadmin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredTenants.length === 0">
              <td colspan="7" class="text-center py-8">
                <div class="empty-state">
                  <AppIcon name="store" :size="40" custom-class="text-slate-400" />
                  <p class="mt-2 font-semibold">Tidak ada tenant yang sesuai dengan filter.</p>
                </div>
              </td>
            </tr>

            <tr v-for="t in filteredTenants" :key="t.id" class="tenant-row">
              <!-- Business & Domain -->
              <td>
                <div class="tenant-identity">
                  <span class="tenant-name">{{ t.name }}</span>
                  <a :href="`https://${t.subdomain}`" target="_blank" class="tenant-subdomain">
                    {{ t.subdomain }}
                    <AppIcon name="arrow-up-right" :size="12" />
                  </a>
                  <span v-if="t.customDomain" class="custom-domain-tag">
                    <AppIcon name="globe" :size="12" />
                    {{ t.customDomain }}
                  </span>
                </div>
              </td>

              <!-- Owner -->
              <td>
                <div class="owner-info">
                  <span class="owner-name">{{ t.ownerName }}</span>
                  <span class="owner-contact">{{ t.ownerEmail }}</span>
                  <span class="owner-phone">{{ t.phone }}</span>
                </div>
              </td>

              <!-- Plan -->
              <td>
                <div class="plan-cell">
                  <span class="plan-badge">{{ getPlanName(t.planId) }}</span>
                  <span class="plan-price">Rp {{ formatNumber(getPlanPrice(t.planId)) }}/bln</span>
                </div>
              </td>

              <!-- Outlets Count -->
              <td>
                <span class="outlets-count-pill">{{ t.outletsCount }} Cabang</span>
              </td>

              <!-- Status -->
              <td>
                <BaseBadge
                  :variant="t.status === 'active' ? 'success' : t.status === 'trial' ? 'warning' : 'danger'"
                  :dot="true"
                  :pulse="t.status === 'trial'"
                  size="sm"
                >
                  {{ t.status === 'active' ? 'Aktif' : t.status === 'trial' ? 'Masa Trial' : 'Dibekukan' }}
                </BaseBadge>
              </td>

              <!-- Expiry -->
              <td>
                <span class="date-text">{{ t.expiresAt }}</span>
              </td>

              <!-- Superadmin Action Buttons -->
              <td class="text-right">
                <div class="actions-group">
                  <!-- Impersonate (Login sebagai Tenant) -->
                  <button
                    type="button"
                    class="action-btn btn-impersonate"
                    title="Masuk ke Akun Tenant (Impersonate)"
                    @click="impersonateTenant(t)"
                  >
                    <AppIcon name="user" :size="15" />
                    <span>Login</span>
                  </button>

                  <!-- Edit Tenant -->
                  <button
                    type="button"
                    class="action-btn btn-edit"
                    title="Ubah Data Tenant"
                    @click="openEditModal(t)"
                  >
                    <AppIcon name="settings" :size="15" />
                  </button>

                  <!-- Toggle Suspend / Active -->
                  <button
                    v-if="t.status === 'active'"
                    type="button"
                    class="action-btn btn-suspend"
                    title="Bekukan Akun (Suspend)"
                    @click="promptSuspend(t)"
                  >
                    <AppIcon name="alert-triangle" :size="15" />
                  </button>
                  <button
                    v-else
                    type="button"
                    class="action-btn btn-activate"
                    title="Aktifkan Kembali Akun"
                    @click="activateTenant(t)"
                  >
                    <AppIcon name="check-circle" :size="15" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    class="action-btn btn-delete"
                    title="Hapus Tenant Permanen"
                    @click="promptDelete(t)"
                  >
                    <AppIcon name="x" :size="15" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tenant Modal (Create & Edit) -->
    <TenantModal
      v-model="isModalOpen"
      :tenant-data="selectedTenantForEdit"
      @success="isModalOpen = false"
    />

    <!-- Suspend Confirmation Modal -->
    <ConfirmModal
      v-model="isSuspendModalOpen"
      title="Bekukan Akun Tenant?"
      :message="`Apakah Anda yakin ingin membekukan akun tenant '${tenantToSuspend?.name}'? Seluruh akses kasir dan storefront domain akan dihentikan sementara.`"
      variant="warning"
      confirm-text="Ya, Bekukan Akun"
      cancel-text="Batal"
      @confirm="confirmSuspendAction"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="isDeleteModalOpen"
      title="Hapus Tenant Permanen?"
      :message="`PERINGATAN: Tindakan ini akan menghapus data '${tenantToDelete?.name}' secara permanen dari server. Tindakan ini tidak dapat dibatalkan.`"
      variant="danger"
      confirm-text="Hapus Permanen"
      cancel-text="Batalkan"
      @confirm="confirmDeleteAction"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlatformStore } from '../stores/platformStore'
import { useAuthStore } from '../../../shared/stores/authStore'
import { useToast } from '../../../shared/composables/useToast'

import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import BaseBadge from '../../../shared/components/ui/BaseBadge.vue'
import ConfirmModal from '../../../shared/components/ui/ConfirmModal.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'
import TenantModal from '../components/TenantModal.vue'

const router = useRouter()
const platformStore = usePlatformStore()
const authStore = useAuthStore()
const toast = useToast()

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(Number(num) || 0)

const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedPlan = ref('all')

const statusOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Aktif', value: 'active' },
  { label: 'Masa Trial', value: 'trial' },
  { label: 'Dibekukan', value: 'suspended' }
]

// Modal states
const isModalOpen = ref(false)
const selectedTenantForEdit = ref(null)

const isSuspendModalOpen = ref(false)
const tenantToSuspend = ref(null)

const isDeleteModalOpen = ref(false)
const tenantToDelete = ref(null)

const filteredTenants = computed(() => {
  return platformStore.tenants.filter(t => {
    // Filter status
    const matchStatus = selectedStatus.value === 'all' || t.status === selectedStatus.value
    // Filter plan
    const matchPlan = selectedPlan.value === 'all' || t.planId === Number(selectedPlan.value)
    // Filter search
    const q = searchQuery.value.toLowerCase().trim()
    const matchSearch = !q ||
      t.name.toLowerCase().includes(q) ||
      t.subdomain.toLowerCase().includes(q) ||
      t.ownerName.toLowerCase().includes(q) ||
      t.ownerEmail.toLowerCase().includes(q)

    return matchStatus && matchPlan && matchSearch
  })
})

const getPlanName = (planId) => {
  const plan = platformStore.plans.find(p => p.id === planId)
  return plan ? plan.name : 'Standar'
}

const getPlanPrice = (planId) => {
  const plan = platformStore.plans.find(p => p.id === planId)
  return plan ? plan.priceMonthly : 0
}

const openCreateModal = () => {
  selectedTenantForEdit.value = null
  isModalOpen.value = true
}

const openEditModal = (tenant) => {
  selectedTenantForEdit.value = { ...tenant }
  isModalOpen.value = true
}

const promptSuspend = (tenant) => {
  tenantToSuspend.value = tenant
  isSuspendModalOpen.value = true
}

const confirmSuspendAction = () => {
  if (tenantToSuspend.value) {
    platformStore.updateTenantStatus(tenantToSuspend.value.id, 'suspended', 'Dibekukan oleh Superadmin')
    isSuspendModalOpen.value = false
    tenantToSuspend.value = null
  }
}

const activateTenant = (tenant) => {
  platformStore.updateTenantStatus(tenant.id, 'active', 'Diaktifkan kembali oleh Superadmin')
}

const promptDelete = (tenant) => {
  tenantToDelete.value = tenant
  isDeleteModalOpen.value = true
}

const confirmDeleteAction = () => {
  if (tenantToDelete.value) {
    platformStore.deleteTenant(tenantToDelete.value.id)
    isDeleteModalOpen.value = false
    tenantToDelete.value = null
  }
}

// Fitur Impersonate: Masuk ke aplikasi sebagai tenant tersebut
const impersonateTenant = (tenant) => {
  authStore.tenant = {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    subdomain: tenant.subdomain,
    customDomain: tenant.customDomain,
    plan: getPlanName(tenant.planId),
    status: tenant.status,
    currency: 'IDR',
    currencySymbol: 'Rp'
  }
  authStore.user = {
    id: 99,
    name: tenant.ownerName,
    email: tenant.ownerEmail,
    role: 'Owner (Impersonated by Superadmin)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
  }

  toast.success(`Berhasil login sebagai "${tenant.name}". Anda dialihkan ke Portal Tenant.`, 'Mode Impersonate Aktif')
  router.push('/app/dashboard')
}
</script>

<style scoped>
.platform-tenants-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: #ede9fe;
  color: #5b21b6;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
  margin-bottom: 6px;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

.page-desc {
  font-size: 14px;
  color: var(--text-secondary);
  max-width: 720px;
  margin-top: 2px;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  max-width: 440px;
}

.filter-options {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.status-pills {
  display: flex;
  align-items: center;
  background-color: var(--slate-100);
  padding: 3px;
  border-radius: var(--radius-md);
}

.pill-btn {
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--slate-600);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) ease;
}

.pill-btn.is-active {
  background-color: #ffffff;
  color: var(--primary-600);
  box-shadow: var(--shadow-sm);
}

.plan-filter-select {
  height: 38px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  background-color: #ffffff;
  font-size: 13px;
  color: var(--text-main);
  outline: none;
}

/* Table */
.table-card {
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.tenants-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13.5px;
}

.tenants-table th {
  padding: 14px 20px;
  background-color: var(--slate-50);
  color: var(--text-muted);
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 1px solid var(--slate-200);
  letter-spacing: 0.04em;
}

.tenants-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--slate-100);
  vertical-align: middle;
}

.tenant-row:hover {
  background-color: #f8fbff;
}

.tenant-identity {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.tenant-name {
  font-weight: 700;
  color: var(--text-main);
  font-size: 14px;
}

.tenant-subdomain {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--primary-600);
  font-family: monospace;
}

.custom-domain-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #047857;
  background-color: #ecfdf5;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  width: fit-content;
  margin-top: 2px;
}

.owner-info {
  display: flex;
  flex-direction: column;
}

.owner-name {
  font-weight: 600;
  color: var(--text-main);
}

.owner-contact, .owner-phone {
  font-size: 11.5px;
  color: var(--text-muted);
}

.plan-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.plan-badge {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 700;
  color: #4338ca;
  background-color: #ede9fe;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  width: fit-content;
}

.plan-price {
  font-size: 11px;
  color: var(--text-muted);
}

.outlets-count-pill {
  font-size: 12px;
  font-weight: 600;
  background-color: var(--slate-100);
  color: var(--slate-700);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
}

.date-text {
  font-size: 12.5px;
  color: var(--text-secondary);
}

/* Actions Group */
.actions-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  padding: 0 10px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  transition: all var(--duration-fast) ease;
  cursor: pointer;
  border: 1px solid var(--border-app);
  background-color: #ffffff;
}

.btn-impersonate {
  background-color: var(--primary-50);
  color: var(--primary-700);
  border-color: var(--primary-200);
}
.btn-impersonate:hover {
  background-color: var(--primary-600);
  color: #ffffff;
}

.btn-edit:hover { background-color: var(--slate-100); color: var(--primary-600); }
.btn-suspend { color: #d97706; }
.btn-suspend:hover { background-color: #fffbeb; border-color: #fef3c7; }
.btn-activate { color: #059669; }
.btn-activate:hover { background-color: #ecfdf5; border-color: #d1fae5; }
.btn-delete { color: #dc2626; }
.btn-delete:hover { background-color: #fef2f2; border-color: #fee2e2; }

.text-right { text-align: right; }
.text-center { text-align: center; }
.py-8 { padding-top: 32px; padding-bottom: 32px; }
</style>
