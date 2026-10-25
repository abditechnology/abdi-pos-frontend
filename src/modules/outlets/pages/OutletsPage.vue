<template>
  <div class="outlets-page space-y-6">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Cabang & Outlet Operasional</h1>
        <p class="page-subtitle">
          Kelola lokasi fisik gerai atau dapur cabang di bawah naungan akun tenant SaaS Anda.
        </p>
      </div>

      <div class="header-actions">
        <BaseButton variant="primary" size="md" @click="openAddModal">
          <AppIcon name="plus" :size="16" />
          Buka Cabang Baru
        </BaseButton>
      </div>
    </div>

    <!-- Active Outlet Indicator Banner -->
    <div class="active-outlet-hero base-card">
      <div class="active-outlet-left">
        <div class="active-outlet-icon-halo halo-blue">
          <AppIcon name="store" :size="26" />
        </div>
        <div>
          <div class="active-outlet-badge">
            <span class="active-pulse-dot"></span>
            <span>Cabang Terpilih Saat Ini</span>
          </div>
          <h2 class="active-outlet-title">{{ currentOutlet.name }}</h2>
          <div class="active-outlet-meta">
            <span class="meta-code-tag font-mono">{{ currentOutlet.code }}</span>
            <span class="meta-text"><AppIcon name="map-pin" :size="14" /> {{ currentOutlet.address }}</span>
            <span class="meta-divider">•</span>
            <span class="meta-text"><AppIcon name="phone" :size="14" /> {{ currentOutlet.phone }}</span>
          </div>
        </div>
      </div>
      <div class="active-outlet-right">
        <span class="active-status-chip">
          <AppIcon name="check" :size="16" /> Terkoneksi ke Kasir POS
        </span>
      </div>
    </div>

    <!-- Outlet Cards Grid -->
    <div class="outlets-grid">
      <div
        v-for="ot in outlets"
        :key="ot.id"
        class="outlet-box-card base-card card-bordered card-hover-lift"
        :class="{ 'is-current-active': currentOutlet.id === ot.id }"
      >
        <div class="outlet-card-top">
          <div class="stat-icon-halo" :class="ot.isPrimary ? 'halo-amber' : 'halo-blue'">
            <AppIcon name="store" :size="24" />
          </div>

          <div class="outlet-top-badges">
            <span v-if="ot.isPrimary" class="primary-badge-chip">
              ★ Pusat Utama
            </span>
            <BaseBadge :variant="ot.status === 'active' ? 'success' : 'danger'">
              {{ ot.status === 'active' ? 'Aktif' : 'Nonaktif' }}
            </BaseBadge>
          </div>
        </div>

        <div class="outlet-card-body">
          <div class="code-and-title">
            <span class="outlet-code-badge font-mono">{{ ot.code }}</span>
            <h3 class="outlet-card-title">{{ ot.name }}</h3>
          </div>

          <div class="outlet-card-info-list">
            <div class="info-row">
              <AppIcon name="map-pin" :size="15" class="info-icon" />
              <span class="info-text">{{ ot.address }}</span>
            </div>
            <div class="info-row">
              <AppIcon name="phone" :size="15" class="info-icon" />
              <span class="info-text">{{ ot.phone }}</span>
            </div>
          </div>
        </div>

        <div class="outlet-card-footer">
          <BaseButton
            v-if="currentOutlet.id !== ot.id"
            variant="secondary"
            size="sm"
            @click="switchCurrentOutlet(ot.id)"
          >
            Pilih Cabang Ini
          </BaseButton>
          <span v-else class="active-tag-indicator">
            <AppIcon name="check" :size="14" /> Cabang Aktif
          </span>

          <div class="card-action-btns">
            <button
              type="button"
              class="icon-action-btn btn-edit"
              title="Edit Cabang"
              @click="openEditModal(ot)"
            >
              <AppIcon name="edit" :size="14" />
            </button>
            <button
              v-if="!ot.isPrimary && outlets.length > 1"
              type="button"
              class="icon-action-btn btn-delete"
              title="Hapus Cabang"
              @click="confirmDelete(ot)"
            >
              <AppIcon name="trash" :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Outlet Modal -->
    <OutletModal
      v-model="showOutletModal"
      :outlet="selectedOutlet"
      @outlet-saved="handleOutletSaved"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Hapus Cabang Outlet?"
      confirm-text="Ya, Hapus Cabang"
      variant="danger"
      @confirm="executeDelete"
    >
      <p class="text-sm text-slate-600">
        Apakah Anda yakin ingin menghapus <strong>{{ outletToDelete?.name }}</strong>? Seluruh data operasional lokal akan dinonaktifkan.
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
import OutletModal from '../components/OutletModal.vue'
import { useOutletStore } from '@/shared/stores/outletStore'

const outletStore = useOutletStore()

const outlets = computed(() => outletStore.outlets)
const currentOutlet = computed(() => outletStore.currentOutlet)

const showOutletModal = ref(false)
const showDeleteConfirm = ref(false)

const selectedOutlet = ref(null)
const outletToDelete = ref(null)

function switchCurrentOutlet(id) {
  outletStore.switchOutlet(id)
}

function openAddModal() {
  selectedOutlet.value = null
  showOutletModal.value = true
}

function openEditModal(ot) {
  selectedOutlet.value = ot
  showOutletModal.value = true
}

function confirmDelete(ot) {
  outletToDelete.value = ot
  showDeleteConfirm.value = true
}

function executeDelete() {
  if (outletToDelete.value) {
    outletStore.deleteOutlet(outletToDelete.value.id)
    showDeleteConfirm.value = false
  }
}

function handleOutletSaved() {
  selectedOutlet.value = null
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

/* Active Outlet Hero Banner */
.active-outlet-hero {
  background: #ffffff;
  border: 1.5px solid #dbeafe;
  border-radius: var(--radius-xl);
  padding: 1.5rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px -2px rgba(37, 99, 235, 0.08);
}

.active-outlet-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.active-outlet-icon-halo {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.active-outlet-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 9999px;
  margin-bottom: 4px;
}

.active-pulse-dot {
  width: 7px;
  height: 7px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 6px #10b981;
  animation: pulse-dot 2s infinite ease-in-out;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.35); opacity: 0.65; }
}

.active-outlet-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.active-outlet-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.meta-code-tag {
  background: #eff6ff;
  color: #2563eb;
  padding: 1px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 11.5px;
  border: 1px solid #bfdbfe;
}

.meta-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.meta-divider {
  color: #cbd5e1;
}

.active-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f0fdf4;
  border: 1.5px solid #86efac;
  border-radius: 9999px;
  color: #15803d;
  font-size: 12.5px;
  font-weight: 700;
}

/* Outlets Grid */
.outlets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.outlet-box-card {
  background: #ffffff;
  border: 1px solid var(--border-app);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 250px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  transition: all var(--duration-fast) var(--ease-spring);
}

.outlet-box-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--primary-300);
}

.outlet-box-card.is-current-active {
  border-color: #93c5fd;
  background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);
}

.outlet-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.outlet-top-badges {
  display: flex;
  align-items: center;
  gap: 6px;
}

.primary-badge-chip {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 9999px;
}

.outlet-card-body {
  flex: 1;
}

.code-and-title {
  margin-bottom: 0.85rem;
}

.outlet-code-badge {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 6px;
}

.outlet-card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.35;
}

.outlet-card-info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.45;
}

.info-icon {
  color: #94a3b8;
  margin-top: 2px;
  flex-shrink: 0;
}

.info-text {
  flex: 1;
}

.outlet-card-footer {
  margin-top: 1.5rem;
  padding-top: 1.15rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.active-tag-indicator {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 700;
  color: #16a34a;
}

.card-action-btns {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-action-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  color: #64748b;
}

.icon-action-btn:hover {
  background-color: var(--primary-50);
  color: var(--primary-600);
  border-color: var(--primary-300);
}

.icon-action-btn.btn-delete:hover {
  background-color: #fee2e2;
  color: #dc2626;
  border-color: #fca5a5;
}
</style>
