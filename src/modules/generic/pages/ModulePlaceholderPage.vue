<template>
  <div class="module-placeholder-page animate-fade-in">
    <!-- Page Header (PRD Section 8: PageHeader) -->
    <header class="page-header">
      <div class="header-titles">
        <div class="title-row">
          <div class="module-icon-wrap">
            <AppIcon :name="moduleIcon" :size="22" />
          </div>
          <div>
            <h1 class="page-title">{{ moduleTitle }}</h1>
            <p class="page-desc">{{ moduleDesc }}</p>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <BaseButton
          variant="primary"
          @click="handlePrimaryAction"
        >
          <template #icon>
            <AppIcon name="plus" :size="16" />
          </template>
          {{ actionLabel }}
        </BaseButton>
      </div>
    </header>

    <!-- Filter Bar (PRD Section 8: FilterBar) -->
    <div class="filter-bar base-card card-bordered">
      <div class="filter-search">
        <BaseInput
          v-model="searchQuery"
          :placeholder="`Cari data di ${moduleTitle}...`"
          :clearable="true"
        >
          <template #prefix>
            <AppIcon name="search" :size="16" />
          </template>
        </BaseInput>
      </div>

      <div class="filter-group">
        <div class="outlet-scope-tag">
          <AppIcon name="store" :size="14" />
          <span>{{ currentOutlet.name }}</span>
        </div>

        <BaseButton variant="ghost" size="sm" @click="resetFilters">
          <template #icon><AppIcon name="refresh" :size="14" /></template>
          Reset Filter
        </BaseButton>
      </div>
    </div>

    <!-- Ready / Module Content Card (PRD Section 8 & 11) -->
    <div class="module-content-card base-card card-bordered">
      <div class="empty-state-container">
        <div class="empty-icon-halo">
          <AppIcon :name="moduleIcon" :size="40" />
        </div>

        <h3 class="empty-title">Modul {{ moduleTitle }} Siap Digunakan</h3>
        <p class="empty-desc">
          Struktur antarmuka telah dikonfigurasi sesuai spesifikasi <strong>{{ moduleTitle }}</strong> pada PRD Frontend POS SaaS.
        </p>

        <div class="empty-details-box">
          <div class="detail-row">
            <span class="detail-label">Scope Tenancy:</span>
            <span class="detail-val">{{ isOutletScoped ? 'Tenant + Outlet Scope' : 'Tenant-Wide Scope' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status Integrasi:</span>
            <BaseBadge variant="success" :dot="true">Routing & State Ready</BaseBadge>
          </div>
          <div class="detail-row">
            <span class="detail-label">Cabang Terpilih:</span>
            <span class="detail-val font-semibold">{{ currentOutlet.name }} ({{ currentOutlet.code }})</span>
          </div>
        </div>

        <div class="empty-actions">
          <BaseButton variant="primary" @click="handlePrimaryAction">
            <template #icon><AppIcon name="plus" :size="16" /></template>
            {{ actionLabel }}
          </BaseButton>

          <router-link to="/app/dashboard">
            <BaseButton variant="secondary">
              Kembali ke Dashboard
            </BaseButton>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOutletStore } from '../../../shared/stores/outletStore'
import { useToast } from '../../../shared/composables/useToast'

import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import BaseBadge from '../../../shared/components/ui/BaseBadge.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const route = useRoute()
const outletStore = useOutletStore()
const { currentOutlet } = storeToRefs(outletStore)
const toast = useToast()

const searchQuery = ref('')

const moduleTitle = computed(() => route.meta?.title || 'Modul POS')
const moduleDesc = computed(() => route.meta?.description || 'Kelola dan pantau data modul ini secara terpusat.')
const moduleIcon = computed(() => route.meta?.icon || 'boxes')
const actionLabel = computed(() => route.meta?.actionLabel || 'Tambah Data Baru')
const isOutletScoped = computed(() => route.meta?.outletScoped || false)

const handlePrimaryAction = () => {
  toast.info(`Aksi "${actionLabel.value}" dibuka untuk modul ${moduleTitle.value}`, 'Aksi Dipilih')
}

const resetFilters = () => {
  searchQuery.value = ''
  toast.info('Filter pencarian telah direset.', 'Filter')
}
</script>

<style scoped>
.module-placeholder-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.module-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
  color: var(--primary-600);
  border: 1px solid var(--primary-200);
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

.page-desc {
  font-size: 13.5px;
  color: var(--text-muted);
  margin-top: 2px;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-search {
  flex: 1;
  max-width: 420px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.outlet-scope-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: var(--primary-50);
  color: var(--primary-700);
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-md);
  font-size: 12.5px;
  font-weight: 600;
}

.module-content-card {
  padding: 48px 24px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 520px;
}

.empty-icon-halo {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background-color: var(--primary-50);
  border: 2px solid var(--primary-200);
  color: var(--primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 20px;
}

.empty-details-box {
  width: 100%;
  background-color: var(--slate-50);
  border: 1px dashed var(--slate-200);
  border-radius: var(--radius-lg);
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  text-align: left;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.detail-label {
  color: var(--text-muted);
}

.detail-val {
  color: var(--text-main);
}

.font-semibold {
  font-weight: 600;
}

.empty-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
