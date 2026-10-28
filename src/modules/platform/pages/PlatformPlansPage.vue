<template>
  <div class="platform-plans-page animate-fade-in">
    <!-- Header -->
    <header class="page-header">
      <div>
        <div class="header-badge">
          <AppIcon name="credit-card" :size="16" />
          <span>Katalog Paket SaaS</span>
        </div>
        <h1 class="page-title">Paket Langganan & Harga SaaS</h1>
        <p class="page-desc">
          Atur struktur harga, kuota cabang, batas akun, serta fitur eksklusif yang ditawarkan kepada tenant Abdi POS.
        </p>
      </div>

      <BaseButton variant="primary" size="lg" @click="openCreateModal">
        <template #icon><AppIcon name="plus" :size="18" /></template>
        + Buat Paket Baru
      </BaseButton>
    </header>

    <!-- Pricing Comparison Grid -->
    <div class="plans-grid">
      <div
        v-for="plan in platformStore.plans"
        :key="plan.id"
        :class="['plan-pricing-card', 'card-hover-lift', { 'is-popular': plan.isPopular }]"
      >
        <!-- Top Pill -->
        <div class="plan-top-bar">
          <span :class="['plan-badge-tag', { 'popular-tag': plan.isPopular }]">
            {{ plan.badge || 'Paket SaaS' }}
          </span>

          <!-- Subscriber Count Pill -->
          <div class="subscriber-pill" title="Jumlah klien yang membeli paket ini">
            <AppIcon name="users" :size="14" />
            <span>{{ getSubscriberCount(plan.id) }} Tenant</span>
          </div>
        </div>

        <!-- Plan Name & Pricing -->
        <h3 class="plan-card-title">{{ plan.name }}</h3>

        <div class="pricing-box">
          <div class="price-monthly">
            <span class="currency">Rp</span>
            <span class="price-num">{{ formatNumber(plan.priceMonthly) }}</span>
            <span class="cycle">/bulan</span>
          </div>
          <div v-if="plan.priceYearly" class="price-yearly">
            atau Rp {{ formatNumber(plan.priceYearly) }} /tahun (hemat 2 bulan)
          </div>
        </div>

        <!-- Limits Highlights -->
        <div class="limits-box">
          <div class="limit-item">
            <AppIcon name="store" :size="16" />
            <span>Hingga <strong>{{ plan.maxOutlets }} Cabang</strong></span>
          </div>
          <div class="limit-item">
            <AppIcon name="users" :size="16" />
            <span>Maks <strong>{{ plan.maxStaff }} Akun</strong></span>
          </div>
          <div class="limit-item">
            <AppIcon name="package" :size="16" />
            <span>Katalog <strong>{{ plan.maxProducts }} Menu</strong></span>
          </div>
        </div>

        <!-- Feature List -->
        <div class="features-list">
          <div class="features-label">FITUR YANG DIAKTIFKAN:</div>
          <div
            v-for="(feature, fIdx) in plan.features"
            :key="fIdx"
            class="feature-row"
          >
            <AppIcon name="check-circle" :size="16" custom-class="feature-check" />
            <span>{{ feature }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="plan-actions">
          <BaseButton
            variant="secondary"
            :block="true"
            @click="openEditModal(plan)"
          >
            <template #icon><AppIcon name="settings" :size="15" /></template>
            Ubah Konfigurasi
          </BaseButton>

          <button
            type="button"
            class="delete-plan-btn"
            title="Hapus Paket"
            @click="promptDeletePlan(plan)"
          >
            <AppIcon name="trash" :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Tenant Breakdown Section: Siapa Saja yang Membeli Tiap Paket -->
    <div class="tenant-breakdown-card base-card card-bordered">
      <div class="card-header">
        <div class="header-title-box">
          <AppIcon name="users" :size="20" />
          <div>
            <h3 class="card-title">Daftar Tenant Berdasarkan Paket yang Dibeli</h3>
            <p class="card-subtitle">Periksa secara spesifik bisnis mana saja yang berlangganan pada setiap tier</p>
          </div>
        </div>

        <!-- Filter by plan tabs -->
        <div class="plan-tabs">
          <button
            v-for="p in platformStore.plans"
            :key="p.id"
            type="button"
            :class="['plan-tab-btn', { 'is-active': activeTabPlanId === p.id }]"
            @click="activeTabPlanId = p.id"
          >
            {{ p.name }} ({{ getSubscriberCount(p.id) }})
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="subscribers-table">
          <thead>
            <tr>
              <th>Nama Bisnis Tenant</th>
              <th>Nama Pemilik</th>
              <th>Kontak Email / WA</th>
              <th>Siklus Tagihan</th>
              <th>Masa Berlaku</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tenantsUnderActivePlan.length === 0">
              <td colspan="6" class="text-center py-6 text-muted">
                Belum ada tenant yang menggunakan paket ini.
              </td>
            </tr>
            <tr v-for="t in tenantsUnderActivePlan" :key="t.id">
              <td>
                <div class="tenant-meta">
                  <strong>{{ t.name }}</strong>
                  <span class="subdomain-text">{{ t.subdomain }}</span>
                </div>
              </td>
              <td>{{ t.ownerName }}</td>
              <td>
                <span class="email-text">{{ t.ownerEmail }}</span>
              </td>
              <td>
                <span class="billing-pill">{{ t.billingCycle === 'yearly' ? 'Tahunan (Yearly)' : t.billingCycle === 'trial' ? 'Masa Trial' : 'Bulanan' }}</span>
              </td>
              <td>{{ t.expiresAt }}</td>
              <td>
                <BaseBadge
                  :variant="t.status === 'active' ? 'success' : t.status === 'trial' ? 'warning' : 'danger'"
                  size="sm"
                  :dot="true"
                >
                  {{ t.status === 'active' ? 'Aktif' : t.status === 'trial' ? 'Trial' : 'Suspended' }}
                </BaseBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Plan Modal (Create & Edit) -->
    <PlanModal
      v-model="isPlanModalOpen"
      :plan-data="selectedPlanForEdit"
      @success="isPlanModalOpen = false"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="isDeleteModalOpen"
      title="Hapus Paket Langganan?"
      :message="`Apakah Anda yakin ingin menghapus paket '${planToDelete?.name}'? Paket ini tidak akan bisa dipilih lagi oleh tenant baru.`"
      variant="danger"
      confirm-text="Ya, Hapus Paket"
      cancel-text="Batal"
      @confirm="confirmDeletePlanAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlatformStore } from '../stores/platformStore'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseBadge from '../../../shared/components/ui/BaseBadge.vue'
import ConfirmModal from '../../../shared/components/ui/ConfirmModal.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'
import PlanModal from '../components/PlanModal.vue'

const platformStore = usePlatformStore()

onMounted(() => {
  platformStore.fetchPlatformPlans()
})

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(Number(num) || 0)

const isPlanModalOpen = ref(false)
const selectedPlanForEdit = ref(null)

const isDeleteModalOpen = ref(false)
const planToDelete = ref(null)

const activeTabPlanId = ref(2) // Default to Pro

const getSubscriberCount = (planId) => {
  return platformStore.tenants.filter(t => t.planId === planId).length
}

const tenantsUnderActivePlan = computed(() => {
  return platformStore.tenants.filter(t => t.planId === activeTabPlanId.value)
})

const openCreateModal = () => {
  selectedPlanForEdit.value = null
  isPlanModalOpen.value = true
}

const openEditModal = (plan) => {
  selectedPlanForEdit.value = { ...plan }
  isPlanModalOpen.value = true
}

const promptDeletePlan = (plan) => {
  planToDelete.value = plan
  isDeleteModalOpen.value = true
}

const confirmDeletePlanAction = () => {
  if (planToDelete.value) {
    platformStore.deletePlan(planToDelete.value.id)
    isDeleteModalOpen.value = false
    planToDelete.value = null
  }
}
</script>

<style scoped>
.platform-plans-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
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

/* Plans Comparison Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.plan-pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
  background-color: #ffffff;
  border: 1px solid var(--border-app);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal) var(--ease-spring);
}

.plan-pricing-card.is-popular {
  border: 2px solid var(--primary-600);
  box-shadow: 0 8px 30px rgba(37, 99, 235, 0.18);
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
}

.plan-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.plan-badge-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background-color: var(--slate-100);
  color: var(--slate-600);
}

.popular-tag {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
}

.subscriber-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--primary-700);
  background-color: var(--primary-50);
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.plan-card-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.01em;
}

.pricing-box {
  margin: 14px 0 18px 0;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--slate-100);
}

.price-monthly {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-muted);
}

.price-num {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.03em;
}

.cycle {
  font-size: 13px;
  color: var(--text-muted);
}

.price-yearly {
  font-size: 11.5px;
  color: #047857;
  font-weight: 600;
  margin-top: 4px;
}

.limits-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  background-color: var(--slate-50);
  border-radius: var(--radius-md);
  margin-bottom: 18px;
}

.limit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--text-secondary);
}

.limit-item strong {
  color: var(--text-main);
}

.features-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.features-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

.feature-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: var(--text-main);
  line-height: 1.4;
}

.feature-check {
  color: var(--success-500);
  flex-shrink: 0;
  margin-top: 2px;
}

.plan-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-plan-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-app);
  color: var(--slate-400);
  background-color: transparent;
  transition: all var(--duration-fast) ease;
}

.delete-plan-btn:hover {
  background-color: #fef2f2;
  color: #dc2626;
  border-color: #fee2e2;
}

/* Tenant Breakdown */
.tenant-breakdown-card {
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--slate-100);
  flex-wrap: wrap;
  gap: 16px;
}

.header-title-box {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--primary-600);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.card-subtitle {
  font-size: 12.5px;
  color: var(--text-muted);
}

.plan-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--slate-100);
  padding: 4px;
  border-radius: var(--radius-md);
}

.plan-tab-btn {
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--slate-600);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) ease;
}

.plan-tab-btn.is-active {
  background-color: #ffffff;
  color: var(--primary-600);
  box-shadow: var(--shadow-sm);
}

.subscribers-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13.5px;
}

.subscribers-table th {
  padding: 12px 20px;
  background-color: var(--slate-50);
  color: var(--text-muted);
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 1px solid var(--slate-200);
}

.subscribers-table td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--slate-100);
  vertical-align: middle;
}

.tenant-meta {
  display: flex;
  flex-direction: column;
}

.subdomain-text {
  font-size: 11.5px;
  color: var(--text-muted);
  font-family: monospace;
}

.email-text {
  color: var(--text-secondary);
}

.billing-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background-color: var(--slate-100);
  color: var(--slate-700);
}

@media (max-width: 1100px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style>
