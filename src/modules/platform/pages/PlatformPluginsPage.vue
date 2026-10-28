<template>
  <div class="platform-plugins-page animate-fade-in space-y-6">
    <!-- Header -->
    <header class="page-header">
      <div>
        <div class="header-badge">
          <AppIcon name="sparkles" :size="16" />
          <span>Katalog Ekstensi Modular SaaS</span>
        </div>
        <h1 class="page-title">Kelola Plugin & Ekstensi Modular</h1>
        <p class="page-desc">
          Atur struktur harga add-on bulanan, ketersediaan fitur, target industri bisnis, dan rincian kapabilitas plugin untuk seluruh tenant Abdi POS.
        </p>
      </div>

      <BaseButton variant="primary" size="lg" @click="openCreateModal">
        <template #icon><AppIcon name="plus" :size="18" /></template>
        + Tambah Plugin Baru
      </BaseButton>
    </header>

    <!-- 4 Overview Metric Cards -->
    <div class="metrics-grid-4">
      <div class="stat-card">
        <div class="stat-icon-halo halo-purple">
          <AppIcon name="sparkles" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Total Plugin Tersedia</span>
          <span class="stat-value">{{ pluginStore.plugins.length }} Ekstensi</span>
          <span class="stat-sub">Modul add-on di marketplace</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-blue">
          <AppIcon name="store" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Total Pemasangan Tenant</span>
          <span class="stat-value">{{ pluginStore.totalPluginSubscribers }} Modul</span>
          <span class="stat-sub">Aktif digunakan di cabang tenant</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-emerald">
          <AppIcon name="chart" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Estimasi MRR Add-on</span>
          <span class="stat-value font-mono text-emerald-700">Rp {{ formatNumber(pluginStore.totalPluginMRR) }}</span>
          <span class="stat-sub">Total omset add-on per bulan</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-amber">
          <AppIcon name="dollar" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Rata-rata Harga Plugin</span>
          <span class="stat-value font-mono text-amber-700">Rp {{ formatNumber(averagePluginPrice) }}</span>
          <span class="stat-sub">Biaya mikro terjangkau / bulan</span>
        </div>
      </div>
    </div>

    <!-- Plugins Configuration Grid -->
    <div class="plugins-grid">
      <div
        v-for="plugin in pluginStore.plugins"
        :key="plugin.id"
        class="plugin-card base-card card-bordered card-hover-lift"
      >
        <!-- Top Row -->
        <div class="plugin-top-bar">
          <span class="category-pill" :class="plugin.badgeClass">
            {{ plugin.categoryLabel }}
          </span>

          <div class="subscriber-pill" title="Jumlah tenant yang menggunakan plugin ini">
            <AppIcon name="users" :size="13" />
            <span>{{ plugin.subscriberCount || 0 }} Tenant</span>
          </div>
        </div>

        <!-- Name & Icon -->
        <div class="plugin-header-row">
          <div class="stat-icon-halo" :class="plugin.colorClass">
            <AppIcon :name="plugin.icon" :size="24" />
          </div>
          <div>
            <h3 class="plugin-title">{{ plugin.name }}</h3>
            <div class="target-sectors-chip">
              <AppIcon name="tag" :size="12" />
              <span>{{ plugin.targetSectors }}</span>
            </div>
          </div>
        </div>

        <p class="plugin-desc">{{ plugin.shortDesc }}</p>

        <!-- Pricing Box -->
        <div class="pricing-box">
          <div class="price-monthly">
            <span class="currency">Rp</span>
            <span class="price-num">{{ formatNumber(plugin.priceMonthly) }}</span>
            <span class="cycle">/bulan</span>
          </div>
        </div>

        <!-- Features Checklist -->
        <div class="features-list">
          <div class="features-label">KAPABILITAS FITUR:</div>
          <div
            v-for="(feature, fIdx) in plugin.features"
            :key="fIdx"
            class="feature-row"
          >
            <AppIcon name="check-circle" :size="15" custom-class="feature-check" />
            <span>{{ feature }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="plugin-actions">
          <BaseButton
            variant="outline"
            size="sm"
            @click="openDemoModal(plugin)"
          >
            <template #icon><AppIcon name="sparkles" :size="14" /></template>
            Simulasi Demo
          </BaseButton>

          <BaseButton
            variant="secondary"
            size="sm"
            class="flex-1"
            @click="openEditModal(plugin)"
          >
            <template #icon><AppIcon name="settings" :size="14" /></template>
            Ubah
          </BaseButton>

          <button
            type="button"
            class="delete-plugin-btn"
            title="Hapus Plugin"
            @click="promptDeletePlugin(plugin)"
          >
            <AppIcon name="trash" :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Tenant Breakdown Section: Siapa Saja yang Memasang Plugin -->
    <div class="tenant-breakdown-card base-card card-bordered">
      <div class="card-header">
        <div class="header-title-box">
          <AppIcon name="users" :size="20" />
          <div>
            <h3 class="card-title">Daftar Tenant Berdasarkan Plugin yang Terpasang</h3>
            <p class="card-subtitle">Pantau secara spesifik bisnis mana saja yang aktif memasang setiap modul add-on</p>
          </div>
        </div>

        <!-- Filter tabs for each plugin -->
        <div class="plugin-tabs">
          <button
            v-for="p in pluginStore.plugins"
            :key="p.id"
            type="button"
            :class="['plugin-tab-btn', { 'is-active': activeTabPluginId === p.id }]"
            @click="activeTabPluginId = p.id"
          >
            {{ p.name }} ({{ getSubscribersForPlugin(p.id).length }})
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="subscribers-table">
          <thead>
            <tr>
              <th>Nama Bisnis Tenant</th>
              <th>Pemilik Toko</th>
              <th>Kontak WhatsApp</th>
              <th>Tanggal Pemasangan</th>
              <th class="text-right">Biaya Add-on</th>
              <th class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="subscribersUnderActivePlugin.length === 0">
              <td colspan="6" class="text-center py-6 text-muted">
                Belum ada tenant yang memasang plugin ini.
              </td>
            </tr>
            <tr v-for="t in subscribersUnderActivePlugin" :key="t.id">
              <td>
                <div class="tenant-meta">
                  <strong>{{ t.tenantName }}</strong>
                  <span class="subdomain-text">{{ t.subdomain }}</span>
                </div>
              </td>
              <td>{{ t.ownerName }}</td>
              <td>
                <span class="phone-text">{{ t.phone }}</span>
              </td>
              <td>{{ t.installedAt }}</td>
              <td class="text-right font-mono font-bold text-slate-800">
                Rp {{ formatNumber(t.monthlyFee) }} /bln
              </td>
              <td class="text-center">
                <BaseBadge variant="success" size="sm" :dot="true">
                  Terpasang
                </BaseBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Plugin Create / Edit Modal -->
    <PluginModal
      v-model="isPluginModalOpen"
      :plugin-data="selectedPluginForEdit"
      @success="isPluginModalOpen = false"
    />

    <!-- Interactive Plugin Demo Simulator Modal -->
    <PluginDemoModal
      v-model="showDemoModal"
      :plugin="selectedDemoPlugin"
      @install-requested="showDemoModal = false"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="isDeleteModalOpen"
      title="Hapus Plugin dari Katalog SaaS?"
      :message="`Apakah Anda yakin ingin menghapus plugin '${pluginToDelete?.name}'? Plugin ini tidak akan muncul lagi di marketplace tenant.`"
      variant="danger"
      confirm-text="Ya, Hapus Plugin"
      cancel-text="Batal"
      @confirm="confirmDeletePluginAction"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import ConfirmModal from '@/shared/components/ui/ConfirmModal.vue'
import PluginModal from '../components/PluginModal.vue'
import PluginDemoModal from '@/modules/settings/components/PluginDemoModal.vue'
import { usePluginStore } from '@/shared/stores/pluginStore'

const pluginStore = usePluginStore()

const isPluginModalOpen = ref(false)
const selectedPluginForEdit = ref(null)

const isDeleteModalOpen = ref(false)
const pluginToDelete = ref(null)

const showDemoModal = ref(false)
const selectedDemoPlugin = ref(null)

const activeTabPluginId = ref(pluginStore.plugins[0]?.id || 'absensi_selfie')

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(Number(num) || 0)

const averagePluginPrice = computed(() => {
  if (pluginStore.plugins.length === 0) return 0
  const sum = pluginStore.plugins.reduce((acc, p) => acc + (p.priceMonthly || 0), 0)
  return Math.round(sum / pluginStore.plugins.length)
})

function getSubscribersForPlugin(pluginId) {
  return pluginStore.tenantSubscribers.filter(s => s.pluginId === pluginId)
}

const subscribersUnderActivePlugin = computed(() => {
  return getSubscribersForPlugin(activeTabPluginId.value)
})

function openCreateModal() {
  selectedPluginForEdit.value = null
  isPluginModalOpen.value = true
}

function openEditModal(plugin) {
  selectedPluginForEdit.value = { ...plugin }
  isPluginModalOpen.value = true
}

function openDemoModal(plugin) {
  selectedDemoPlugin.value = plugin
  showDemoModal.value = true
}

function promptDeletePlugin(plugin) {
  pluginToDelete.value = plugin
  isDeleteModalOpen.value = true
}

function confirmDeletePluginAction() {
  if (pluginToDelete.value) {
    pluginStore.deletePlugin(pluginToDelete.value.id)
    if (activeTabPluginId.value === pluginToDelete.value.id) {
      activeTabPluginId.value = pluginStore.plugins[0]?.id || ''
    }
    pluginToDelete.value = null
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: #f3e8ff;
  color: #7e22ce;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}

.page-desc {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
  max-width: 640px;
}

/* Plugins Grid */
.plugins-grid {
  display: grid;
  grid-cols: 1;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .plugins-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .plugins-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

.plugin-card {
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid var(--border-app);
}

.plugin-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.subscriber-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  background-color: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
}

.plugin-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 0.75rem;
}

.plugin-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
}

.target-sectors-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #64748b;
  margin-top: 3px;
}

.plugin-desc {
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.5;
  min-height: 38px;
  margin-bottom: 1rem;
}

.pricing-box {
  background-color: #f8fafc;
  border-radius: var(--radius-lg);
  padding: 10px 14px;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
}

.price-monthly {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.price-num {
  font-size: 1.35rem;
  font-weight: 800;
  font-family: monospace;
  color: #0f172a;
}

.cycle {
  font-size: 11.5px;
  color: #64748b;
}

.features-list {
  border-top: 1px dashed #e2e8f0;
  padding-top: 0.875rem;
  margin-bottom: 1.25rem;
  flex-grow: 1;
}

.features-label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.feature-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #334155;
  margin-bottom: 6px;
  line-height: 1.4;
}

.feature-check {
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.plugin-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 0.875rem;
  border-top: 1px solid #f1f5f9;
}

.delete-plugin-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: 1px solid #fecdd3;
  color: #f43f5e;
  background-color: #fff1f2;
  cursor: pointer;
  transition: all 0.15s ease;
}

.delete-plugin-btn:hover {
  background-color: #ffe4e6;
  color: #e11d48;
}

/* Tenant Breakdown Card */
.tenant-breakdown-card {
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  background: #ffffff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.header-title-box {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4338ca;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: #0f172a;
}

.card-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: 2px;
}

.plugin-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.plugin-tab-btn {
  padding: 6px 12px;
  border-radius: var(--radius-full);
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.plugin-tab-btn:hover {
  background-color: #f8fafc;
  color: #0f172a;
}

.plugin-tab-btn.is-active {
  background-color: #4338ca;
  color: #ffffff;
  border-color: #4338ca;
  box-shadow: 0 2px 6px rgba(67, 56, 202, 0.3);
}

.table-responsive {
  overflow-x: auto;
}

.subscribers-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.subscribers-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 700;
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.subscribers-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.tenant-meta strong {
  display: block;
  color: #0f172a;
}

.subdomain-text {
  font-size: 11px;
  color: #2563eb;
  font-family: monospace;
}

.phone-text {
  font-family: monospace;
  color: #475569;
}

.category-pill {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tag-purple { background: #f3e8ff; color: #7e22ce; }
.tag-emerald { background: #ecfdf5; color: #047857; }
.tag-cyan { background: #ecfeff; color: #0e7490; }
.tag-blue { background: #eff6ff; color: #1d4ed8; }
.tag-indigo { background: #e0e7ff; color: #4338ca; }
.tag-amber { background: #fef3c7; color: #b45309; }
.tag-rose { background: #ffe4e6; color: #be123c; }
</style>
