<template>
  <div class="products-page animate-fade-in">
    <!-- Header -->
    <header class="page-header">
      <div>
        <div class="header-badge">
          <AppIcon name="package" :size="16" />
          <span>Katalog Menu Kasir</span>
        </div>
        <h1 class="page-title">Master Produk & Menu Toko</h1>
        <p class="page-desc">
          Kelola seluruh daftar menu makanan, minuman, harga jual, estimasi HPP, dan persediaan stok di kasir POS.
        </p>
      </div>

      <div class="header-actions">
        <router-link to="/app/categories" class="header-secondary-link">
          <AppIcon name="tag" :size="16" />
          <span>Kelola Kategori</span>
        </router-link>

        <BaseButton variant="primary" size="lg" @click="openCreateModal">
          <template #icon><AppIcon name="plus" :size="18" /></template>
          Tambah Produk Baru
        </BaseButton>
      </div>
    </header>

    <!-- 3 Quick Metrics (Cards with Colored Halo Icons) -->
    <div class="metrics-grid-3">
      <div class="stat-card">
        <div class="stat-icon-halo halo-blue">
          <AppIcon name="package" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Total Item Menu</span>
          <span class="stat-value">{{ productStore.totalProducts }} Item</span>
          <span class="stat-sub">Tersedia di katalog sistem</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-emerald">
          <AppIcon name="check" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Menu Aktif Dijual</span>
          <span class="stat-value text-emerald-600">{{ productStore.activeProducts }} Item</span>
          <span class="stat-sub">Tampil di layar kasir POS</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-amber">
          <AppIcon name="alert-circle" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Perlu Tambah Stok</span>
          <span class="stat-value text-amber-600">{{ productStore.lowStockProducts }} Menu</span>
          <span class="stat-sub">Stok di bawah 20 porsi</span>
        </div>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="filter-bar base-card card-bordered">
      <div class="search-wrap">
        <BaseInput
          v-model="searchQuery"
          placeholder="Cari nama menu atau kode SKU..."
          :clearable="true"
        >
          <template #prefix><AppIcon name="search" :size="16" /></template>
        </BaseInput>
      </div>

      <div class="filter-options">
        <select v-model="selectedCategory" class="filter-select">
          <option value="all">Semua Kategori ({{ productStore.totalProducts }})</option>
          <option v-for="cat in productStore.categories" :key="cat.id" :value="cat.id">
            {{ cat.name }} ({{ getCategoryProductCount(cat.id) }})
          </option>
        </select>

        <select v-model="selectedStockStatus" class="filter-select">
          <option value="all">Semua Status Stok</option>
          <option value="low">Hanya Stok Menipis (≤ 20)</option>
          <option value="active">Hanya Menu Aktif</option>
          <option value="inactive">Hanya Menu Nonaktif</option>
        </select>
      </div>
    </div>

    <!-- Products Data Table -->
    <div class="table-card base-card card-bordered">
      <div class="table-responsive">
        <table class="app-table">
          <thead>
            <tr>
              <th>Foto & Nama Menu</th>
              <th>Kategori</th>
              <th>Harga Jual (Rp)</th>
              <th>HPP Modal (Rp)</th>
              <th>Sisa Stok</th>
              <th>Status</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="7" class="text-center py-10">
                <div class="empty-state">
                  <AppIcon name="package" :size="40" custom-class="text-slate-400" />
                  <p class="mt-2 font-semibold text-slate-700">Tidak ada produk yang sesuai dengan pencarian Anda.</p>
                  <BaseButton variant="outline" size="sm" class="mt-3" @click="resetFilters">
                    Reset Filter
                  </BaseButton>
                </div>
              </td>
            </tr>

            <tr v-for="p in filteredProducts" :key="p.id">
              <td>
                <div class="product-identity">
                  <img :src="p.image" :alt="p.name" class="p-thumb" />
                  <div class="p-meta">
                    <strong class="p-name">{{ p.name }}</strong>
                    <span class="p-sku">SKU: {{ p.sku }}</span>
                  </div>
                </div>
              </td>

              <td>
                <span class="category-chip">
                  {{ productStore.getCategoryName(p.categoryId) }}
                </span>
              </td>

              <td>
                <strong class="text-primary-700">Rp {{ formatNumber(p.price) }}</strong>
              </td>

              <td>
                <span class="cost-price-text">Rp {{ formatNumber(p.costPrice) }}</span>
                <span class="margin-text">Margin: {{ getMarginPercentage(p.price, p.costPrice) }}%</span>
              </td>

              <td>
                <div v-if="p.trackStock" class="stock-cell">
                  <span :class="['stock-badge', { 'stock-low': p.stock <= 20 }]">
                    {{ p.stock }} {{ p.unit }}
                  </span>
                  <span v-if="p.stock <= 20" class="low-warning-tag">Menipis</span>
                </div>
                <span v-else class="text-muted text-xs">Stok Tak Terbatas</span>
              </td>

              <td>
                <BaseBadge :variant="p.isActive ? 'success' : 'neutral'" :dot="true" size="sm">
                  {{ p.isActive ? 'Aktif' : 'Nonaktif' }}
                </BaseBadge>
              </td>

              <td class="text-right">
                <div class="row-actions">
                  <button
                    type="button"
                    class="action-icon-btn btn-edit"
                    title="Ubah Produk"
                    @click="openEditModal(p)"
                  >
                    <AppIcon name="settings" :size="15" />
                  </button>

                  <button
                    type="button"
                    class="action-icon-btn btn-delete"
                    title="Hapus Produk"
                    @click="promptDelete(p)"
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

    <!-- Product Modal -->
    <ProductModal
      v-model="isModalOpen"
      :product-data="selectedProduct"
      @success="isModalOpen = false"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="isDeleteModalOpen"
      title="Hapus Produk dari Menu?"
      :message="`Apakah Anda yakin ingin menghapus produk '${productToDelete?.name}'? Menu ini tidak akan bisa dipilih lagi di kasir POS.`"
      variant="danger"
      confirm-text="Ya, Hapus Produk"
      cancel-text="Batal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '../stores/productStore'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import BaseBadge from '../../../shared/components/ui/BaseBadge.vue'
import ConfirmModal from '../../../shared/components/ui/ConfirmModal.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'
import ProductModal from '../components/ProductModal.vue'

const productStore = useProductStore()

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedStockStatus = ref('all')

const isModalOpen = ref(false)
const selectedProduct = ref(null)

const isDeleteModalOpen = ref(false)
const productToDelete = ref(null)

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(Number(num) || 0)

const getCategoryProductCount = (catId) => {
  return productStore.products.filter(p => p.categoryId === catId).length
}

const getMarginPercentage = (price, cost) => {
  if (!price || !cost || price <= 0) return 0
  return Math.round(((price - cost) / price) * 100)
}

const filteredProducts = computed(() => {
  return productStore.products.filter(p => {
    // Filter Category
    const matchCat = selectedCategory.value === 'all' || p.categoryId === Number(selectedCategory.value)

    // Filter Stock Status
    let matchStock = true
    if (selectedStockStatus.value === 'low') {
      matchStock = p.trackStock && p.stock <= 20
    } else if (selectedStockStatus.value === 'active') {
      matchStock = p.isActive
    } else if (selectedStockStatus.value === 'inactive') {
      matchStock = !p.isActive
    }

    // Filter Search
    const q = searchQuery.value.toLowerCase().trim()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)

    return matchCat && matchStock && matchSearch
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedStockStatus.value = 'all'
}

const openCreateModal = () => {
  selectedProduct.value = null
  isModalOpen.value = true
}

const openEditModal = (p) => {
  selectedProduct.value = { ...p }
  isModalOpen.value = true
}

const promptDelete = (p) => {
  productToDelete.value = p
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (productToDelete.value) {
    productStore.deleteProduct(productToDelete.value.id)
    isDeleteModalOpen.value = false
    productToDelete.value = null
  }
}
</script>

<style scoped>
.products-page {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-secondary-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  background-color: #ffffff;
  color: var(--text-secondary);
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--duration-fast) ease;
}

.header-secondary-link:hover {
  border-color: var(--primary-500);
  color: var(--primary-600);
  background-color: var(--primary-50);
}

/* Filter Bar */
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

/* Table */
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

.product-identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.p-thumb {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 1px solid var(--border-app);
}

.p-meta {
  display: flex;
  flex-direction: column;
}

.p-name {
  font-size: 13.5px;
  color: var(--text-main);
}

.p-sku {
  font-size: 11px;
  color: var(--text-muted);
}

.category-chip {
  display: inline-block;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  background-color: var(--slate-100);
  color: var(--slate-700);
  font-size: 11.5px;
  font-weight: 600;
}

.cost-price-text {
  display: block;
  font-size: 12.5px;
  color: var(--text-secondary);
}

.margin-text {
  font-size: 10.5px;
  color: var(--success-600);
  font-weight: 700;
}

.stock-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stock-badge {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-main);
}

.stock-badge.stock-low {
  color: var(--warning-600);
}

.low-warning-tag {
  font-size: 9.5px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: var(--radius-sm);
  background-color: #fef3c7;
  color: #92400e;
}

.row-actions {
  display: flex;
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
