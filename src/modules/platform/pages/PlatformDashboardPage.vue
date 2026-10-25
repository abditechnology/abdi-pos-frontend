<template>
  <div class="platform-dashboard animate-fade-in">
    <!-- Top Greeting Banner -->
    <section class="superadmin-banner base-card card-bordered">
      <div class="banner-content">
        <div class="banner-badge">
          <AppIcon name="shield" :size="16" />
          <span>PUSAT KENDALI SAAS OWNER</span>
        </div>
        <h1 class="banner-title">Ringkasan Ekosistem Abdi POS</h1>
        <p class="banner-desc">
          Pantau pertumbuhan tenant bisnis, pendapatan bulanan (MRR), dan kinerja paket langganan secara terpusat.
        </p>
      </div>

      <div class="banner-actions">
        <BaseButton variant="secondary" @click="isPlanModalOpen = true">
          <template #icon><AppIcon name="credit-card" :size="16" /></template>
          Buat Paket Baru
        </BaseButton>
        <BaseButton variant="primary" @click="isTenantModalOpen = true">
          <template #icon><AppIcon name="plus" :size="16" /></template>
          + Tambah Tenant Baru
        </BaseButton>
      </div>
    </section>

    <!-- 4 Key SaaS Business Metric Cards -->
    <section class="stats-grid">
      <!-- 1. MRR -->
      <div class="saas-stat-card card-hover-lift theme-blue">
        <div class="stat-top">
          <span class="stat-label">Monthly Recurring Revenue (MRR)</span>
          <div class="stat-icon-wrap"><AppIcon name="dollar" :size="22" /></div>
        </div>
        <div class="stat-main">
          <span class="currency-tag">Rp</span>
          <span class="stat-number">{{ formatNumber(platformStore.totalMRR) }}</span>
        </div>
        <div class="stat-footer">
          <span class="trend-badge trend-up">
            <AppIcon name="trending-up" :size="14" />
            +24.5% MoM
          </span>
          <span class="footer-caption">Bulan berjalan</span>
        </div>
      </div>

      <!-- 2. Total Tenants -->
      <div class="saas-stat-card card-hover-lift theme-indigo">
        <div class="stat-top">
          <span class="stat-label">Total Tenant Terdaftar</span>
          <div class="stat-icon-wrap"><AppIcon name="store" :size="22" /></div>
        </div>
        <div class="stat-main">
          <span class="stat-number">{{ platformStore.totalTenants }}</span>
          <span class="unit-tag">Bisnis</span>
        </div>
        <div class="stat-footer">
          <span class="status-chip chip-active">{{ platformStore.activeTenants }} Aktif</span>
          <span class="status-chip chip-trial">{{ platformStore.trialTenants }} Masa Trial</span>
        </div>
      </div>

      <!-- 3. Total Outlets Managed -->
      <div class="saas-stat-card card-hover-lift theme-emerald">
        <div class="stat-top">
          <span class="stat-label">Total Cabang / Outlet Aktif</span>
          <div class="stat-icon-wrap"><AppIcon name="boxes" :size="22" /></div>
        </div>
        <div class="stat-main">
          <span class="stat-number">{{ platformStore.totalOutletsManaged }}</span>
          <span class="unit-tag">Lokasi</span>
        </div>
        <div class="stat-footer">
          <span class="footer-caption">Rata-rata 2.6 cabang / tenant</span>
        </div>
      </div>

      <!-- 4. Subscription Plans -->
      <div class="saas-stat-card card-hover-lift theme-purple">
        <div class="stat-top">
          <span class="stat-label">Paket Langganan Aktif</span>
          <div class="stat-icon-wrap"><AppIcon name="credit-card" :size="22" /></div>
        </div>
        <div class="stat-main">
          <span class="stat-number">{{ platformStore.plans?.length ?? 0 }}</span>
          <span class="unit-tag">Pilihan Tier</span>
        </div>
        <div class="stat-footer">
          <router-link to="/platform/plans" class="plans-link">
            Kelola Paket SaaS →
          </router-link>
        </div>
      </div>
    </section>

    <!-- Main Content Dual-Column Section -->
    <div class="dashboard-grid">
      <!-- Left Column: Tenant Distribution & Recent Onboarding -->
      <div class="grid-col-main">
        <!-- Paket Distribution Card -->
        <div class="base-card card-bordered">
          <div class="card-header">
            <div class="header-title-box">
              <AppIcon name="chart" :size="20" />
              <div>
                <h3 class="card-title">Distribusi Klien per Paket Langganan</h3>
                <p class="card-subtitle">Perbandingan tenant yang membeli setiap paket SaaS Anda</p>
              </div>
            </div>
            <router-link to="/platform/plans" class="header-action-link">Detail Paket</router-link>
          </div>

          <div class="plans-distribution-list">
            <div
              v-for="plan in platformStore.plans"
              :key="plan.id"
              class="plan-dist-item"
            >
              <div class="dist-info-row">
                <div class="dist-name-group">
                  <span class="plan-name">{{ plan.name }}</span>
                  <span v-if="plan.isPopular" class="popular-tag">Populer</span>
                </div>
                <div class="dist-figures">
                  <strong>{{ getSubscribersForPlan(plan.id) }} Tenant</strong>
                  <span class="mrr-sub">Rp {{ formatNumber((plan.priceMonthly || 0) * getSubscribersForPlan(plan.id)) }}/bln</span>
                </div>
              </div>

              <!-- Bar Progress Share -->
              <div class="dist-bar-track">
                <div
                  class="dist-bar-fill"
                  :style="{ width: `${(getSubscribersForPlan(plan.id) / (platformStore.totalTenants || 1)) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Registered Tenants Table Preview -->
        <div class="base-card card-bordered">
          <div class="card-header">
            <div class="header-title-box">
              <AppIcon name="store" :size="20" />
              <div>
                <h3 class="card-title">Klien / Tenant Terbaru</h3>
                <p class="card-subtitle">Bisnis yang baru mendaftar atau diperbarui</p>
              </div>
            </div>
            <router-link to="/platform/tenants" class="header-action-link">Lihat Semua ({{ platformStore.totalTenants }})</router-link>
          </div>

          <div class="table-responsive">
            <table class="superadmin-table">
              <thead>
                <tr>
                  <th>Nama Bisnis</th>
                  <th>Pemilik (Owner)</th>
                  <th>Paket SaaS</th>
                  <th>Cabang</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in (platformStore.tenants?.slice(0, 4) || [])" :key="t.id">
                  <td>
                    <div class="tenant-cell">
                      <span class="t-name">{{ t.name }}</span>
                      <span class="t-subdomain">{{ t.subdomain }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="owner-cell">
                      <span class="o-name">{{ t.ownerName }}</span>
                      <span class="o-email">{{ t.ownerEmail }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="plan-pill">{{ getPlanName(t.planId) }}</span>
                  </td>
                  <td>{{ t.outletsCount }} Cabang</td>
                  <td>
                    <BaseBadge
                      :variant="t.status === 'active' ? 'success' : t.status === 'trial' ? 'warning' : 'danger'"
                      :dot="true"
                      :pulse="t.status === 'trial'"
                      size="sm"
                    >
                      {{ t.status === 'active' ? 'Aktif' : t.status === 'trial' ? 'Trial' : 'Suspended' }}
                    </BaseBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Audit Logs & Platform System Status -->
      <div class="grid-col-side">
        <!-- Platform Health Card -->
        <div class="base-card card-bordered system-health-card">
          <div class="health-header">
            <div class="health-pulse" />
            <h4 class="health-title">Status Server & Infrastruktur</h4>
          </div>
          <p class="health-desc">Semua layanan cloud, database multi-tenant, dan gateway pembayaran berjalan normal 100%.</p>

          <div class="health-metrics">
            <div class="health-item">
              <span>Database PostgreSQL</span>
              <strong class="text-success">Optimal (4ms)</strong>
            </div>
            <div class="health-item">
              <span>Laravel 13 API Core</span>
              <strong class="text-success">Sehat (99.98%)</strong>
            </div>
            <div class="health-item">
              <span>Domain DNS Resolver</span>
              <strong class="text-success">Aktif (Wildcard Ready)</strong>
            </div>
          </div>
        </div>

        <!-- Recent Superadmin Activity Logs -->
        <div class="base-card card-bordered">
          <div class="card-header">
            <div class="header-title-box">
              <AppIcon name="shield" :size="18" />
              <h3 class="card-title">Aktivitas Terkini</h3>
            </div>
            <router-link to="/platform/audit-logs" class="header-action-link">Log Lengkap</router-link>
          </div>

          <div class="audit-list">
            <div
              v-for="log in (platformStore.auditLogs?.slice(0, 4) || [])"
              :key="log.id"
              class="audit-item"
            >
              <div class="audit-dot" />
              <div class="audit-body">
                <span class="audit-target">{{ log.target }}</span>
                <p class="audit-desc">{{ log.description }}</p>
                <span class="audit-time">{{ log.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tenant Modal Trigger -->
    <TenantModal
      v-model="isTenantModalOpen"
      @success="isTenantModalOpen = false"
    />

    <!-- Plan Modal Trigger -->
    <PlanModal
      v-model="isPlanModalOpen"
      @success="isPlanModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePlatformStore } from '../stores/platformStore'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseBadge from '../../../shared/components/ui/BaseBadge.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'
import TenantModal from '../components/TenantModal.vue'
import PlanModal from '../components/PlanModal.vue'

const platformStore = usePlatformStore()

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(Number(num) || 0)

const isTenantModalOpen = ref(false)
const isPlanModalOpen = ref(false)

const getSubscribersForPlan = (planId) => {
  return platformStore.tenants.filter(t => t.planId === planId).length
}

const getPlanName = (planId) => {
  const plan = platformStore.plans.find(p => p.id === planId)
  return plan ? plan.name : 'Standar'
}
</script>

<style scoped>
.platform-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Banner */
.superadmin-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  background: linear-gradient(135deg, #ffffff 0%, #f5f7ff 100%);
  border: 1px solid #dbeafe;
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
  flex-wrap: wrap;
  gap: 20px;
}

.banner-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: #ede9fe;
  color: #5b21b6;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.banner-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

.banner-desc {
  font-size: 14px;
  color: var(--text-secondary);
  max-width: 650px;
  margin-top: 4px;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 4 Stat Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.saas-stat-card {
  padding: 22px;
  background-color: #ffffff;
  border: 1px solid var(--border-app);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all var(--duration-normal) var(--ease-spring);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-blue .stat-icon-wrap { background-color: var(--primary-50); color: var(--primary-600); }
.theme-indigo .stat-icon-wrap { background-color: #ede9fe; color: #6366f1; }
.theme-emerald .stat-icon-wrap { background-color: #ecfdf5; color: #10b981; }
.theme-purple .stat-icon-wrap { background-color: #faf5ff; color: #a855f7; }

.stat-main {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 14px 0 10px 0;
}

.currency-tag {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-muted);
}

.stat-number {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.03em;
}

.unit-tag {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.trend-up { background-color: #ecfdf5; color: #047857; }

.status-chip {
  font-size: 11.5px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.chip-active { background-color: #ecfdf5; color: #059669; }
.chip-trial { background-color: #fffbeb; color: #d97706; }

.footer-caption {
  font-size: 12px;
  color: var(--text-muted);
}

.plans-link {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--primary-600);
}

/* Dual Column */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

.grid-col-main, .grid-col-side {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--slate-100);
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

.header-action-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-600);
}

/* Plans Distribution List */
.plans-distribution-list {
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dist-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.dist-name-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.plan-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.popular-tag {
  font-size: 10px;
  font-weight: 700;
  background-color: var(--primary-50);
  color: var(--primary-700);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--primary-200);
}

.dist-figures {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
}

.mrr-sub {
  color: var(--text-muted);
  font-size: 12px;
}

.dist-bar-track {
  width: 100%;
  height: 8px;
  background-color: var(--slate-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.dist-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #3b82f6 100%);
  border-radius: var(--radius-full);
  transition: width 1s ease;
}

/* Table */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.superadmin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13.5px;
}

.superadmin-table th {
  padding: 12px 20px;
  background-color: var(--slate-50);
  color: var(--text-muted);
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 1px solid var(--slate-200);
}

.superadmin-table td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--slate-100);
  vertical-align: middle;
}

.tenant-cell, .owner-cell {
  display: flex;
  flex-direction: column;
}

.t-name, .o-name {
  font-weight: 700;
  color: var(--text-main);
}

.t-subdomain, .o-email {
  font-size: 11.5px;
  color: var(--text-muted);
}

.plan-pill {
  font-size: 12px;
  font-weight: 600;
  background-color: #ede9fe;
  color: #5b21b6;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
}

/* System Health */
.system-health-card {
  padding: 22px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.health-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.health-pulse {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  background-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
  animation: pulseDot 2s infinite ease-in-out;
}

.health-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}

.health-desc {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 16px;
}

.health-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--slate-200);
}

.health-item {
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
  color: var(--text-secondary);
}

.text-success { color: #059669; }

/* Audit List */
.audit-list {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.audit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.audit-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: #6366f1;
  margin-top: 5px;
  flex-shrink: 0;
}

.audit-target {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
}

.audit-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-top: 2px;
}

.audit-time {
  font-size: 11px;
  color: var(--text-muted);
  display: block;
  margin-top: 3px;
}

@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
