<template>
  <div class="platform-audit-logs-page animate-fade-in">
    <header class="page-header">
      <div>
        <div class="header-badge">
          <AppIcon name="shield" :size="16" />
          <span>Keamanan & Transparansi Platform</span>
        </div>
        <h1 class="page-title">Jejak Audit Aktivitas Superadmin</h1>
        <p class="page-desc">
          Catatan kronologis seluruh perubahan sistem, pembuatan tenant, penyesuaian harga paket, pembekuan akun, dan akses impersonasi.
        </p>
      </div>

      <div class="log-count-pill">
        <AppIcon name="clock" :size="16" />
        <span>{{ platformStore.auditLogs.length }} Aktivitas Tercatat</span>
      </div>
    </header>

    <!-- Logs Container -->
    <div class="logs-card base-card card-bordered">
      <div class="logs-timeline">
        <div
          v-for="log in platformStore.auditLogs"
          :key="log.id"
          class="timeline-item"
        >
          <!-- Timeline Marker -->
          <div :class="['timeline-marker', getActionClass(log.action)]">
            <AppIcon :name="getActionIcon(log.action)" :size="16" />
          </div>

          <!-- Timeline Content -->
          <div class="timeline-content">
            <div class="content-header">
              <div class="action-title-row">
                <span class="action-badge">{{ formatActionName(log.action) }}</span>
                <span class="target-name">{{ log.target }}</span>
              </div>
              <span class="log-time">{{ log.time }}</span>
            </div>

            <p class="log-description">{{ log.description }}</p>

            <div class="log-meta-footer">
              <span class="meta-tag">
                <AppIcon name="user" :size="12" />
                Aktor: <strong>{{ log.actor }}</strong>
              </span>
              <span class="meta-tag">
                IP: {{ log.ipAddress }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlatformStore } from '../stores/platformStore'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const platformStore = usePlatformStore()

const getActionClass = (action) => {
  if (action.includes('CREATED')) return 'action-created'
  if (action.includes('SUSPENDED') || action.includes('DELETED')) return 'action-danger'
  return 'action-updated'
}

const getActionIcon = (action) => {
  if (action.includes('CREATED')) return 'plus'
  if (action.includes('SUSPENDED') || action.includes('DELETED')) return 'alert-triangle'
  return 'settings'
}

const formatActionName = (action) => {
  const map = {
    TENANT_CREATED: 'Tenant Baru Terdaftar',
    TENANT_SUSPENDED: 'Tenant Dibekukan',
    TENANT_ACTIVATED: 'Tenant Diaktifkan',
    TENANT_DELETED: 'Tenant Dihapus',
    PLAN_CREATED: 'Paket Baru Diterbitkan',
    PLAN_UPDATED: 'Paket Diperbarui',
    PLAN_DELETED: 'Paket Dihapus'
  }
  return map[action] || action
}
</script>

<style scoped>
.platform-audit-logs-page {
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

.log-count-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background-color: var(--slate-100);
  border-radius: var(--radius-md);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--slate-700);
}

.logs-card {
  padding: 24px;
}

.logs-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
}

.logs-timeline::before {
  content: '';
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 17px;
  width: 2px;
  background-color: var(--slate-200);
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  position: relative;
}

.timeline-marker {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 2;
  box-shadow: 0 0 0 4px #ffffff;
}

.action-created { background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
.action-updated { background-color: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.action-danger { background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

.timeline-content {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid var(--border-app);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  box-shadow: var(--shadow-xs);
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.action-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-badge {
  font-size: 12px;
  font-weight: 700;
  background-color: var(--slate-100);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  color: var(--text-main);
}

.target-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-700);
}

.log-time {
  font-size: 12px;
  color: var(--text-muted);
}

.log-description {
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
}

.log-meta-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 10px;
  border-top: 1px solid var(--slate-100);
  font-size: 12px;
  color: var(--text-muted);
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
