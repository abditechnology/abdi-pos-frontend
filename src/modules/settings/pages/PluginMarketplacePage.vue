<template>
  <div class="plugin-marketplace-page space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Plugin Marketplace & Ekstensi Modular</h1>
        <p class="page-subtitle">
          Perluas fungsionalitas Abdi POS sesuai kebutuhan industri bisnis Anda (Salon, Laundry, Jasa Kirim, Ritel, & F&B).
        </p>
      </div>

      <div class="header-actions">
        <router-link to="/app/subscription" class="header-link-btn">
          <AppIcon name="credit-card" :size="16" />
          <span>Kelola Paket Langganan</span>
        </router-link>
      </div>
    </div>

    <!-- Quick Stat Cards -->
    <div class="metrics-grid-4">
      <div class="stat-card">
        <div class="stat-icon-halo halo-blue">
          <AppIcon name="sparkles" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Total Plugin Tersedia</span>
          <span class="stat-value">{{ pluginStore.plugins.length }} Ekstensi</span>
          <span class="stat-sub">Fitur modular siap pasang</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-emerald">
          <AppIcon name="check" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Plugin Aktif Saat Ini</span>
          <span class="stat-value text-emerald-600">{{ pluginStore.activePlugins.length }} Aktif</span>
          <span class="stat-sub">Terpasang di outlet toko</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-purple">
          <AppIcon name="receipt" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Estimasi Add-on / Bulan</span>
          <span class="stat-value font-mono text-purple-700">{{ formatRp(pluginStore.totalActiveMonthlyFee) }}</span>
          <span class="stat-sub">Total biaya ekstensi aktif</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-halo halo-amber">
          <AppIcon name="shield" :size="24" />
        </div>
        <div class="stat-body">
          <span class="stat-label">Model Fleksibel</span>
          <span class="stat-value">Bebas Batal</span>
          <span class="stat-sub">Tanpa kontrak jangka panjang</span>
        </div>
      </div>
    </div>

    <!-- Category Filter Bar -->
    <div class="filter-tab-bar base-card">
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-tab-btn"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >
          <span>{{ cat.label }}</span>
          <span class="tab-count-badge">{{ getCategoryCount(cat.id) }}</span>
        </button>
      </div>

      <div class="search-mini-wrap">
        <AppIcon name="search" :size="16" class="search-mini-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama plugin atau fungsi..."
          class="search-mini-input"
        />
      </div>
    </div>

    <!-- Plugins Grid -->
    <div class="plugins-grid">
      <div
        v-for="plugin in filteredPlugins"
        :key="plugin.id"
        class="plugin-card base-card card-bordered card-hover-lift"
        :class="{ 'is-installed': plugin.isInstalled }"
      >
        <!-- Top Row -->
        <div class="plugin-card-top">
          <div class="stat-icon-halo" :class="plugin.colorClass">
            <AppIcon :name="plugin.icon" :size="26" />
          </div>

          <div class="plugin-badges-wrap">
            <span class="category-pill" :class="plugin.badgeClass">
              {{ plugin.categoryLabel }}
            </span>
            <BaseBadge :variant="plugin.isInstalled ? 'success' : 'neutral'">
              {{ plugin.isInstalled ? '● Terpasang' : 'Tersedia' }}
            </BaseBadge>
          </div>
        </div>

        <!-- Body -->
        <div class="plugin-card-body">
          <h3 class="plugin-title">{{ plugin.name }}</h3>
          <p class="plugin-desc">{{ plugin.shortDesc }}</p>

          <div class="target-sectors-chip">
            <AppIcon name="tag" :size="13" />
            <span>{{ plugin.targetSectors }}</span>
          </div>

          <ul class="plugin-features-list">
            <li v-for="(feat, idx) in plugin.features" :key="idx" class="feature-item">
              <span class="check-icon">✓</span>
              <span>{{ feat }}</span>
            </li>
          </ul>
        </div>

        <!-- Footer / Pricing & Actions -->
        <div class="plugin-card-footer">
          <div class="pricing-wrap">
            <span class="price-val font-mono">{{ formatRp(plugin.priceMonthly) }}</span>
            <span class="price-unit">/ bulan</span>
          </div>

          <div class="action-buttons-wrap">
            <BaseButton
              variant="outline"
              size="sm"
              @click="openDemoModal(plugin)"
            >
              <template #icon><AppIcon name="sparkles" :size="14" /></template>
              Simulasi Demo
            </BaseButton>

            <BaseButton
              :variant="plugin.isInstalled ? 'secondary' : 'primary'"
              size="sm"
              @click="handleToggle(plugin)"
            >
              <template #icon>
                <AppIcon :name="plugin.isInstalled ? 'check' : 'plus'" :size="14" />
              </template>
              {{ plugin.isInstalled ? 'Batalkan' : 'Aktifkan Plugin' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPlugins.length === 0" class="empty-plugins base-card">
      <AppIcon name="search" :size="36" class="text-slate-300 mx-auto mb-2" />
      <h3 class="font-bold text-slate-700">Tidak ada plugin ditemukan</h3>
      <p class="text-sm text-slate-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
    </div>

    <!-- Interactive Plugin Demo Simulator Modal -->
    <PluginDemoModal
      v-model="showDemoModal"
      :plugin="selectedDemoPlugin"
      @install-requested="handleInstallFromModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import PluginDemoModal from '../components/PluginDemoModal.vue'
import { usePluginStore } from '@/shared/stores/pluginStore'
import { useToast } from '@/shared/composables/useToast'

const pluginStore = usePluginStore()
const toast = useToast()

onMounted(() => {
  pluginStore.fetchPlugins()
})

const selectedCategory = ref('all')
const searchQuery = ref('')
const showDemoModal = ref(false)
const selectedDemoPlugin = ref(null)

const categories = [
  { id: 'all', label: 'Semua Kategori' },
  { id: 'hr', label: 'SDM & Karyawan' },
  { id: 'ordering', label: 'Self-Order & Meja' },
  { id: 'whatsapp', label: 'WhatsApp & Pemasaran' },
  { id: 'service', label: 'Layanan & Booking' },
  { id: 'finance', label: 'Keuangan & Kas Bon' }
]

function getCategoryCount(catId) {
  if (catId === 'all') return pluginStore.plugins.length
  return pluginStore.plugins.filter(p => p.category === catId).length
}

const filteredPlugins = computed(() => {
  return pluginStore.plugins.filter(p => {
    const matchCategory = selectedCategory.value === 'all' || p.category === selectedCategory.value
    const matchQuery =
      searchQuery.value === '' ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.targetSectors.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchQuery
  })
})

function formatRp(val) {
  if (typeof val !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

function handleToggle(plugin) {
  const isNowInstalled = pluginStore.togglePlugin(plugin.id)
  if (isNowInstalled) {
    toast.success(`Plugin "${plugin.name}" berhasil diaktifkan dengan masa uji coba 30 hari!`)
  } else {
    toast.info(`Plugin "${plugin.name}" telah dinonaktifkan.`)
  }
}

function openDemoModal(plugin) {
  selectedDemoPlugin.value = plugin
  showDemoModal.value = true
}

function handleInstallFromModal(plugin) {
  if (!plugin.isInstalled) {
    handleToggle(plugin)
  }
  showDemoModal.value = false
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

.header-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md);
  font-size: 13.5px;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  transition: all var(--duration-fast);
}

.header-link-btn:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

/* Category Filter Bar */
.filter-tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  background: #ffffff;
}

.category-tabs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.cat-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  border: 1px solid transparent;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.cat-tab-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.cat-tab-btn.active {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.tab-count-badge {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 9999px;
  background: #e2e8f0;
  color: #475569;
}

.cat-tab-btn.active .tab-count-badge {
  background: #2563eb;
  color: #ffffff;
}

.search-mini-wrap {
  position: relative;
  min-width: 260px;
}

.search-mini-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-mini-input {
  width: 100%;
  padding: 6px 12px 6px 32px;
  font-size: 13px;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  outline: none;
  transition: all var(--duration-fast);
}

.search-mini-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

/* Plugins Grid */
.plugins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.plugin-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 380px;
  transition: all var(--duration-fast) var(--ease-spring);
}

.plugin-card.is-installed {
  border-color: #a7f3d0;
  background: linear-gradient(180deg, #ffffff 0%, #fafffc 100%);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.08);
}

.plugin-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.plugin-badges-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-pill {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 9999px;
}

.tag-purple { background: #faf5ff; color: #7c3aed; border: 1px solid #e9d5ff; }
.tag-emerald { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
.tag-cyan { background: #ecfeff; color: #0891b2; border: 1px solid #a5f3fc; }
.tag-blue { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.tag-indigo { background: #eef2ff; color: #4f46e5; border: 1px solid #c7d2fe; }
.tag-amber { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
.tag-rose { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

.plugin-card-body {
  flex: 1;
}

.plugin-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
  line-height: 1.35;
}

.plugin-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 10px 0;
}

.target-sectors-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.plugin-features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #475569;
  line-height: 1.4;
}

.check-icon {
  color: #10b981;
  font-weight: 800;
  font-size: 13px;
  line-height: 1;
}

.plugin-card-footer {
  margin-top: 1.25rem;
  padding-top: 1.15rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.pricing-wrap {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-val {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
}

.price-unit {
  font-size: 11.5px;
  color: #64748b;
}

.action-buttons-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.empty-plugins {
  padding: 3rem;
  text-align: center;
}

@media (max-width: 768px) {
  .plugin-card-footer {
    flex-direction: column;
    align-items: stretch;
  }
  .action-buttons-wrap {
    justify-content: stretch;
  }
  .action-buttons-wrap > * {
    flex: 1;
  }
}
</style>
