<template>
  <div class="categories-page animate-fade-in">
    <!-- Header -->
    <header class="page-header">
      <div>
        <div class="header-badge">
          <AppIcon name="tag" :size="16" />
          <span>Pengelompokan Menu</span>
        </div>
        <h1 class="page-title">Kategori Produk & Menu</h1>
        <p class="page-desc">
          Atur pengelompokan menu seperti Terang Bulan Manis, Martabak Telur, Minuman Segar, dan Topping Tambahan.
        </p>
      </div>

      <div class="header-actions">
        <router-link to="/app/products" class="header-secondary-link">
          <AppIcon name="package" :size="16" />
          <span>Kembali ke Master Produk</span>
        </router-link>

        <BaseButton variant="primary" size="lg" @click="openCreateModal">
          <template #icon><AppIcon name="plus" :size="18" /></template>
          Tambah Kategori Baru
        </BaseButton>
      </div>
    </header>

    <!-- Categories Grid Cards -->
    <div class="categories-grid">
      <div
        v-for="cat in productStore.categories"
        :key="cat.id"
        class="category-card base-card card-bordered card-hover-lift"
      >
        <div class="card-top-row">
          <div
            class="cat-icon-halo"
            :style="{ backgroundColor: `${cat.color}20`, color: cat.color }"
          >
            <AppIcon :name="cat.icon" :size="22" />
          </div>

          <div class="cat-actions">
            <button
              type="button"
              class="icon-action-btn btn-edit"
              title="Ubah Kategori"
              @click="openEditModal(cat)"
            >
              <AppIcon name="settings" :size="15" />
            </button>

            <button
              type="button"
              class="icon-action-btn btn-delete"
              title="Hapus Kategori"
              @click="promptDelete(cat)"
            >
              <AppIcon name="trash" :size="15" />
            </button>
          </div>
        </div>

        <div class="cat-content">
          <h3 class="cat-title">{{ cat.name }}</h3>
          <p class="cat-desc">{{ cat.description || 'Tidak ada deskripsi' }}</p>
        </div>

        <div class="cat-footer">
          <span class="count-pill">
            <AppIcon name="package" :size="14" />
            <strong>{{ getProductCount(cat.id) }} Menu</strong> Terdaftar
          </span>

          <router-link
            :to="{ path: '/app/products', query: { category: cat.id } }"
            class="view-products-link"
          >
            Lihat Produk →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <CategoryModal
      v-model="isModalOpen"
      :category-data="selectedCategory"
      @success="isModalOpen = false"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="isDeleteModalOpen"
      title="Hapus Kategori Produk?"
      :message="`Apakah Anda yakin ingin menghapus kategori '${categoryToDelete?.name}'? Kategori yang memiliki produk aktif tidak dapat dihapus.`"
      variant="danger"
      confirm-text="Ya, Hapus Kategori"
      cancel-text="Batal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProductStore } from '../stores/productStore'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import ConfirmModal from '../../../shared/components/ui/ConfirmModal.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'
import CategoryModal from '../components/CategoryModal.vue'

const productStore = useProductStore()

const isModalOpen = ref(false)
const selectedCategory = ref(null)

const isDeleteModalOpen = ref(false)
const categoryToDelete = ref(null)

const getProductCount = (catId) => {
  return productStore.products.filter(p => p.categoryId === catId).length
}

const openCreateModal = () => {
  selectedCategory.value = null
  isModalOpen.value = true
}

const openEditModal = (cat) => {
  selectedCategory.value = { ...cat }
  isModalOpen.value = true
}

const promptDelete = (cat) => {
  categoryToDelete.value = cat
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (categoryToDelete.value) {
    productStore.deleteCategory(categoryToDelete.value.id)
    isDeleteModalOpen.value = false
    categoryToDelete.value = null
  }
}
</script>

<style scoped>
.categories-page {
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.category-card {
  padding: 20px;
  border-radius: var(--radius-xl);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cat-icon-halo {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-actions {
  display: flex;
  gap: 6px;
}

.icon-action-btn {
  width: 30px;
  height: 30px;
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

.cat-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cat-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.cat-desc {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.45;
}

.cat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--border-app);
  font-size: 12px;
}

.count-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
}

.count-pill strong {
  color: var(--text-main);
}

.view-products-link {
  color: var(--primary-600);
  font-weight: 600;
  text-decoration: none;
}

.view-products-link:hover {
  text-decoration: underline;
}
</style>
