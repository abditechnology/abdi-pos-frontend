<template>
  <div class="platform-domains-page animate-fade-in">
    <header class="page-header">
      <div>
        <div class="header-badge">
          <AppIcon name="globe" :size="16" />
          <span>Infrastruktur Domain SaaS</span>
        </div>
        <h1 class="page-title">Pemetaan Domain & Subdomain</h1>
        <p class="page-desc">
          Pantau status verifikasi DNS, sertifikat SSL Let's Encrypt, dan routing hostname multi-tenant ke server backend Laravel 13.
        </p>
      </div>

      <div class="header-info-pill">
        <span class="pulse-dot" />
        <span>Wildcard CNAME (*.abdipos.com) Aktif</span>
      </div>
    </header>

    <!-- Domains Table -->
    <div class="table-card base-card card-bordered">
      <div class="table-responsive">
        <table class="domains-table">
          <thead>
            <tr>
              <th>Hostname / Domain</th>
              <th>Tenant Pemilik</th>
              <th>Tipe Domain</th>
              <th>Status DNS</th>
              <th>Sertifikat SSL</th>
              <th>Tanggal Registrasi</th>
              <th class="text-right">Aksi Verifikasi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in platformStore.domains" :key="d.id">
              <td>
                <div class="domain-cell">
                  <a :href="`https://${d.hostname}`" target="_blank" class="domain-name">
                    {{ d.hostname }}
                    <AppIcon name="arrow-up-right" :size="12" />
                  </a>
                  <span v-if="d.isPrimary" class="primary-pill">Primary Domain</span>
                </div>
              </td>
              <td>
                <span class="tenant-name">{{ d.tenantName }}</span>
              </td>
              <td>
                <span class="type-pill">{{ d.type === 'custom' ? 'Custom Domain' : 'Subdomain Bawaan' }}</span>
              </td>
              <td>
                <BaseBadge
                  :variant="d.dnsVerified ? 'success' : 'warning'"
                  :dot="true"
                  :pulse="!d.dnsVerified"
                  size="sm"
                >
                  {{ d.dnsVerified ? 'Terverifikasi (A Record)' : 'Pending DNS Check' }}
                </BaseBadge>
              </td>
              <td>
                <BaseBadge
                  :variant="d.sslStatus === 'active' ? 'success' : 'warning'"
                  size="sm"
                >
                  {{ d.sslStatus === 'active' ? 'SSL Aktif (TLS 1.3)' : 'Menunggu Penerbitan' }}
                </BaseBadge>
              </td>
              <td>{{ d.createdAt }}</td>
              <td class="text-right">
                <BaseButton
                  v-if="!d.dnsVerified"
                  variant="primary"
                  size="sm"
                  @click="platformStore.verifyDomain(d.id)"
                >
                  Verifikasi Sekarang
                </BaseButton>
                <span v-else class="verified-label">
                  <AppIcon name="check-circle" :size="16" />
                  Siap Diakses
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlatformStore } from '../stores/platformStore'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseBadge from '../../../shared/components/ui/BaseBadge.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const platformStore = usePlatformStore()
</script>

<style scoped>
.platform-domains-page {
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

.header-info-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
  border-radius: var(--radius-lg);
  font-size: 12.5px;
  font-weight: 600;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: #10b981;
  animation: pulseDot 2s infinite ease-in-out;
}

.table-card {
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.domains-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13.5px;
}

.domains-table th {
  padding: 14px 20px;
  background-color: var(--slate-50);
  color: var(--text-muted);
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 1px solid var(--slate-200);
}

.domains-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--slate-100);
  vertical-align: middle;
}

.domain-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.domain-name {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  color: var(--primary-700);
  font-family: monospace;
  font-size: 13.5px;
}

.primary-pill {
  font-size: 10px;
  font-weight: 700;
  background-color: #ecfdf5;
  color: #047857;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  width: fit-content;
}

.tenant-name {
  font-weight: 600;
  color: var(--text-main);
}

.type-pill {
  font-size: 12px;
  background-color: var(--slate-100);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  color: var(--slate-700);
}

.verified-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: #059669;
}

.text-right { text-align: right; }
</style>
