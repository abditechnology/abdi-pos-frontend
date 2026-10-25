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
    <div class="active-banner bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          <AppIcon name="store" :size="20" />
        </div>
        <div>
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Cabang Yang Sedang Dipilih</span>
          <h3 class="text-base font-bold text-slate-900">{{ currentOutlet.name }} ({{ currentOutlet.code }})</h3>
          <p class="text-xs text-slate-500 mt-0.5">{{ currentOutlet.address }}</p>
        </div>
      </div>
      <BaseBadge variant="primary">Sedang Terpilih</BaseBadge>
    </div>

    <!-- Outlet Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard
        v-for="ot in outlets"
        :key="ot.id"
        class="outlet-card flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
      >
        <div v-if="ot.isPrimary" class="primary-ribbon">
          Pusat Utama
        </div>

        <div>
          <div class="flex justify-between items-start mb-2">
            <div>
              <span class="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {{ ot.code }}
              </span>
              <h3 class="text-lg font-bold text-slate-900 mt-2">{{ ot.name }}</h3>
            </div>
            <BaseBadge :variant="ot.status === 'active' ? 'success' : 'danger'">
              {{ ot.status === 'active' ? 'Aktif' : 'Nonaktif' }}
            </BaseBadge>
          </div>

          <div class="space-y-2 mt-4 text-xs text-slate-600">
            <div class="flex items-start gap-2">
              <AppIcon name="map-pin" :size="15" class="text-slate-400 mt-0.5 shrink-0" />
              <span>{{ ot.address }}</span>
            </div>
            <div class="flex items-center gap-2">
              <AppIcon name="phone" :size="15" class="text-slate-400 shrink-0" />
              <span>{{ ot.phone }}</span>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <BaseButton
            v-if="currentOutlet.id !== ot.id"
            variant="secondary"
            size="sm"
            @click="switchCurrentOutlet(ot.id)"
          >
            Pilih Cabang Ini
          </BaseButton>
          <span v-else class="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <AppIcon name="check" :size="14" /> Cabang Aktif
          </span>

          <div class="flex items-center gap-1">
            <BaseButton variant="secondary" size="sm" @click="openEditModal(ot)">
              <AppIcon name="edit" :size="14" />
            </BaseButton>
            <BaseButton
              v-if="!ot.isPrimary && outlets.length > 1"
              variant="danger"
              size="sm"
              @click="confirmDelete(ot)"
            >
              <AppIcon name="trash" :size="14" />
            </BaseButton>
          </div>
        </div>
      </BaseCard>
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

.outlet-card {
  position: relative;
  min-height: 220px;
}

.primary-ribbon {
  position: absolute;
  top: 10px;
  right: -30px;
  background: #f59e0b;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 30px;
  transform: rotate(45deg);
  letter-spacing: 0.5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
</style>
