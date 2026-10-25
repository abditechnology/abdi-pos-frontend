<template>
  <div class="inventory-page animate-fade-in">
    <!-- Header -->
    <header class="page-header">
      <div>
        <div class="header-badge">
          <AppIcon name="boxes" :size="16" />
          <span>Gudang & Bahan Baku</span>
        </div>
        <h1 class="page-title">Stok & Inventaris Bahan</h1>
        <p class="page-desc">
          Pantau stok bahan mentah, lakukan penyesuaian fisik (Stock Opname), dan cegah kehabisan bahan saat jam ramai penjualan.
        </p>
      </div>

      <BaseButton variant="primary" size="lg" @click="openCreateModal">
        <template #icon><AppIcon name="plus" :size="18" /></template>
        Tambah Bahan Baru
      </BaseButton>
    </header>

    <!-- 3 Inventory Metrics (Cards with Colored Halo Icons) -->
    <div class="metrics-grid-3">
      <div class="stat-card">
        <div class="stat-icon-halo halo-blue">
          <AppIcon name="boxes" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Total Jenis Bahan</span>
          <span class="stat-value">{{ inventoryStore.scopedMaterials.length }} Bahan</span>
          <span class="stat-sub">Tercatat di cabang aktif</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-rose">
          <AppIcon name="alert-circle" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Stok Kritis / Perlu Belanja</span>
          <span class="stat-value text-rose-600">{{ inventoryStore.lowStockCount }} Bahan</span>
          <span class="stat-sub">Di bawah batas minimum aman</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-emerald">
          <AppIcon name="dollar" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Estimasi Nilai Inventaris</span>
          <span class="stat-value font-mono text-emerald-700">Rp {{ formatNumber(inventoryStore.totalValue) }}</span>
          <span class="stat-sub">Total nilai aset persediaan</span>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar base-card card-bordered">
      <div class="search-wrap">
        <BaseInput
          v-model="searchQuery"
          placeholder="Cari nama bahan baku atau SKU..."
          :clearable="true"
        >
          <template #prefix><AppIcon name="search" :size="16" /></template>
        </BaseInput>
      </div>

      <div class="filter-options">
        <select v-model="selectedCategory" class="filter-select">
          <option value="all">Semua Kategori Bahan</option>
          <option value="Bahan Utama">Bahan Utama</option>
          <option value="Topping & Lemak">Topping & Lemak</option>
          <option value="Bahan Penunjang">Bahan Penunjang</option>
          <option value="Bahan Isian">Bahan Isian</option>
          <option value="Kemasan & Packaging">Kemasan & Packaging</option>
        </select>

        <select v-model="selectedStockFilter" class="filter-select">
          <option value="all">Semua Status Stok</option>
          <option value="critical">Hanya Stok Menipis / Kritis</option>
          <option value="safe">Stok Aman</option>
        </select>
      </div>
    </div>

    <!-- Inventory Data Table -->
    <div class="table-card base-card card-bordered">
      <div class="table-responsive">
        <table class="app-table">
          <thead>
            <tr>
              <th>Nama Bahan Baku & SKU</th>
              <th>Kategori</th>
              <th>Sisa Stok Fisik</th>
              <th>Batas Min.</th>
              <th>Biaya / Unit</th>
              <th>Total Nilai Aset</th>
              <th>Status</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredMaterials.length === 0">
              <td colspan="8" class="text-center py-10">
                <div class="empty-state">
                  <AppIcon name="boxes" :size="40" custom-class="text-slate-400" />
                  <p class="mt-2 font-semibold text-slate-700">Tidak ada bahan baku yang cocok dengan filter Anda.</p>
                </div>
              </td>
            </tr>

            <tr v-for="m in filteredMaterials" :key="m.id">
              <td>
                <div class="material-identity">
                  <strong class="m-name">{{ m.name }}</strong>
                  <span class="m-sku">{{ m.sku }}</span>
                </div>
              </td>

              <td>
                <span class="cat-pill">{{ m.category }}</span>
              </td>

              <td>
                <span :class="['stock-number', { 'is-critical': m.stock <= m.minStock }]">
                  {{ m.stock }} {{ m.unit }}
                </span>
              </td>

              <td>
                <span class="text-secondary text-sm">{{ m.minStock }} {{ m.unit }}</span>
              </td>

              <td>
                <span class="text-secondary text-sm">Rp {{ formatNumber(m.costPerUnit) }}</span>
              </td>

              <td>
                <strong>Rp {{ formatNumber(m.stock * m.costPerUnit) }}</strong>
              </td>

              <td>
                <BaseBadge
                  :variant="m.stock <= m.minStock ? 'danger' : 'success'"
                  :dot="true"
                  :pulse="m.stock <= m.minStock"
                  size="sm"
                >
                  {{ m.stock <= m.minStock ? 'Stok Kritis' : 'Aman' }}
                </BaseBadge>
              </td>

              <td class="text-right">
                <div class="row-actions">
                  <BaseButton
                    variant="secondary"
                    size="sm"
                    @click="openOpnameModal(m)"
                  >
                    <template #icon><AppIcon name="boxes" :size="14" /></template>
                    Opname
                  </BaseButton>

                  <button
                    type="button"
                    class="action-icon-btn btn-edit"
                    title="Ubah Bahan"
                    @click="openEditModal(m)"
                  >
                    <AppIcon name="settings" :size="15" />
                  </button>

                  <button
                    type="button"
                    class="action-icon-btn btn-delete"
                    title="Hapus Bahan"
                    @click="promptDelete(m)"
                  >
                    <AppIcon name="trash" :size="15" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stock Opname Modal -->
    <StockOpnameModal
      v-model="isOpnameModalOpen"
      :material-item="selectedMaterialForOpname"
      @success="isOpnameModalOpen = false"
    />

    <!-- Material Modal (Create/Edit) -->
    <MaterialModal
      v-model="isMaterialModalOpen"
      :material-data="selectedMaterialForEdit"
      @success="isMaterialModalOpen = false"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="isDeleteModalOpen"
      title="Hapus Bahan Baku?"
      :message="`Apakah Anda yakin ingin menghapus '${materialToDelete?.name}' dari inventaris? Data stok dan riwayat mutasi bahan ini akan dihapus.`"
      variant="danger"
      confirm-text="Ya, Hapus Bahan"
      cancel-text="Batal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInventoryStore } from '../stores/inventoryStore'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import BaseBadge from '../../../shared/components/ui/BaseBadge.vue'
import ConfirmModal from '../../../shared/components/ui/ConfirmModal.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'
import StockOpnameModal from '../components/StockOpnameModal.vue'
import MaterialModal from '../components/MaterialModal.vue'

const inventoryStore = useInventoryStore()

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedStockFilter = ref('all')

const isOpnameModalOpen = ref(false)
const selectedMaterialForOpname = ref(null)

const isMaterialModalOpen = ref(false)
const selectedMaterialForEdit = ref(null)

const isDeleteModalOpen = ref(false)
const materialToDelete = ref(null)

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(Number(num) || 0)

const filteredMaterials = computed(() => {
  return inventoryStore.scopedMaterials.filter(m => {
    const matchCat = selectedCategory.value === 'all' || m.category === selectedCategory.value
    let matchStock = true
    if (selectedStockFilter.value === 'critical') {
      matchStock = m.stock <= m.minStock
    } else if (selectedStockFilter.value === 'safe') {
      matchStock = m.stock > m.minStock
    }
    const q = searchQuery.value.toLowerCase().trim()
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q)

    return matchCat && matchStock && matchSearch
  })
})

const openOpnameModal = (item) => {
  selectedMaterialForOpname.value = item
  isOpnameModalOpen.value = true
}

const openCreateModal = () => {
  selectedMaterialForEdit.value = null
  isMaterialModalOpen.value = true
}

const openEditModal = (item) => {
  selectedMaterialForEdit.value = { ...item }
  isMaterialModalOpen.value = true
}

const promptDelete = (item) => {
  materialToDelete.value = item
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (materialToDelete.value) {
    inventoryStore.deleteMaterial(materialToDelete.value.id)
    isDeleteModalOpen.value = false
    materialToDelete.value = null
  }
}
</script>

<style scoped>
.inventory-page {
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
  background-color: var(--primary-50);
  color: var(--primary-700);
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
  line-height: 1.3;
}

.page-desc {
  font-size: 14px;
  color: var(--text-secondary);
  max-width: 680px;
  margin-top: 0.5rem;
  line-height: 1.6;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  background-color: #ffffff;
  gap: 16px;
  flex-wrap: wrap;
}

.search-wrap {
  flex: 1;
  min-width: 280px;
}

.filter-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  height: 42px;
  padding: 0 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  background-color: #ffffff;
  font-size: 13px;
  color: var(--text-main);
  outline: none;
  cursor: pointer;
}

.table-card {
  border-radius: var(--radius-xl);
  background-color: #ffffff;
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.app-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.app-table th {
  padding: 14px 18px;
  background-color: var(--slate-50);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-app);
}

.app-table td {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-app);
  font-size: 13.5px;
  color: var(--text-main);
  vertical-align: middle;
}

.app-table tr:hover td {
  background-color: var(--slate-50);
}

.material-identity {
  display: flex;
  flex-direction: column;
}

.m-name {
  font-size: 13.5px;
  color: var(--text-main);
}

.m-sku {
  font-size: 11px;
  color: var(--text-muted);
}

.cat-pill {
  display: inline-block;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  background-color: var(--slate-100);
  color: var(--slate-700);
  font-size: 11.5px;
  font-weight: 600;
}

.stock-number {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-main);
}

.stock-number.is-critical {
  color: var(--danger-600);
}

.row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.action-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--duration-fast) ease;
}

.btn-edit:hover {
  background-color: var(--primary-50);
  color: var(--primary-600);
  border-color: var(--primary-200);
}

.btn-delete:hover {
  background-color: #fee2e2;
  color: #b91c1c;
  border-color: #fecaca;
}

@media (max-width: 900px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
