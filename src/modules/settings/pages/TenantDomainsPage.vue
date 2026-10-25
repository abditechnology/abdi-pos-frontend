<template>
  <div class="tenant-domains-page space-y-6">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Domain & Subdomain SaaS</h1>
        <p class="page-subtitle">
          Kelola alamat website storefront, URL katalog digital, dan pemesanan mandiri (self-order) tenant Anda.
        </p>
      </div>

      <div class="header-actions">
        <BaseButton variant="primary" size="md" @click="showConnectModal = true">
          <AppIcon name="globe" :size="16" />
          Hubungkan Custom Domain
        </BaseButton>
      </div>
    </div>

    <!-- Subdomain Bawaan Platform -->
    <BaseCard>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Subdomain Bawaan Abdi POS (Default)</span>
          <h3 class="text-xl font-bold font-mono text-blue-600 mt-1">
            https://abdimartabak.abdipos.com
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Subdomain gratis bawaan platform selalu aktif tanpa perlu konfigurasi DNS.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <BaseBadge variant="success">Aktif & SSL Aman (HTTPS)</BaseBadge>
          <a
            href="https://abdimartabak.abdipos.com"
            target="_blank"
            class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            Buka Web <AppIcon name="arrow-up-right" :size="14" />
          </a>
        </div>
      </div>
    </BaseCard>

    <!-- Custom Domains Section -->
    <BaseCard>
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="font-bold text-slate-800 text-base">Custom Domain Bisnis</h3>
          <p class="text-xs text-slate-500">Gunakan nama domain toko sendiri untuk meningkatkan branding dan kepercayaan pelanggan</p>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="d in customDomains"
          :key="d.domain"
          class="p-4 border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          :class="d.status === 'ACTIVE' ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/50 border-amber-200'"
        >
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-base text-slate-900">{{ d.domain }}</span>
              <BaseBadge :variant="d.status === 'ACTIVE' ? 'success' : 'warning'">
                {{ d.status === 'ACTIVE' ? 'Terverifikasi & Aktif' : 'Menunggu Propagasi DNS' }}
              </BaseBadge>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Target CNAME: <code class="font-mono text-slate-700 bg-slate-200 px-1 py-0.5 rounded">{{ d.cnameTarget }}</code> • SSL: {{ d.sslStatus }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <BaseButton
              v-if="d.status !== 'ACTIVE'"
              variant="secondary"
              size="sm"
              @click="recheckDns(d)"
            >
              <AppIcon name="refresh" :size="14" />
              Cek Ulang DNS
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              @click="confirmRemoveDomain(d)"
            >
              <AppIcon name="trash" :size="14" />
              Putuskan
            </BaseButton>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- DNS Guide Card -->
    <BaseCard class="bg-blue-50/60 border-blue-200">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
          <AppIcon name="info" :size="20" />
        </div>
        <div class="space-y-2 text-xs text-slate-700">
          <h4 class="font-bold text-slate-900 text-sm">Panduan Konfigurasi DNS Custom Domain</h4>
          <p>
            Untuk menghubungkan domain toko Anda, arahkan record <strong>CNAME</strong> pada DNS manager registrar domain Anda ke host <code>cname.abdipos.com</code>.
          </p>
          <p>
            Proses verifikasi DNS dan penerbitan sertifikat SSL otomatis (Let's Encrypt) membutuhkan waktu antara 5 menit hingga maksimal 24 jam tergantung penyedia domain.
          </p>
        </div>
      </div>
    </BaseCard>

    <!-- Connect Domain Modal -->
    <ConnectDomainModal
      v-model="showConnectModal"
      @domain-connected="handleDomainConnected"
    />

    <!-- Confirm Remove Modal -->
    <ConfirmModal
      v-model="showRemoveConfirm"
      title="Putuskan Custom Domain?"
      confirm-text="Ya, Putuskan Domain"
      variant="danger"
      @confirm="executeRemoveDomain"
    >
      <p class="text-sm text-slate-600">
        Apakah Anda yakin ingin memutuskan domain <strong>{{ domainToRemove?.domain }}</strong>? Pelanggan tidak akan dapat mengakses katalog melalui alamat ini lagi.
      </p>
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from '@/shared/components/ui/BaseCard.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import BaseBadge from '@/shared/components/ui/BaseBadge.vue'
import ConfirmModal from '@/shared/components/ui/ConfirmModal.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import ConnectDomainModal from '../components/ConnectDomainModal.vue'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()

const showConnectModal = ref(false)
const showRemoveConfirm = ref(false)
const domainToRemove = ref(null)

const customDomains = ref([
  {
    domain: 'order.abdimartabak.com',
    cnameTarget: 'cname.abdipos.com',
    status: 'ACTIVE',
    sslStatus: 'Let\'s Encrypt Valid (Auto-renew)'
  }
])

function handleDomainConnected(newDomain) {
  customDomains.value.push({
    domain: newDomain,
    cnameTarget: 'cname.abdipos.com',
    status: 'PENDING',
    sslStatus: 'Menunggu Verifikasi DNS'
  })
}

function recheckDns(d) {
  toast.info(`Memeriksa catatan DNS untuk ${d.domain}...`)
  setTimeout(() => {
    d.status = 'ACTIVE'
    d.sslStatus = 'Let\'s Encrypt Valid (Auto-renew)'
    toast.success(`Domain ${d.domain} berhasil terverifikasi!`)
  }, 1200)
}

function confirmRemoveDomain(d) {
  domainToRemove.value = d
  showRemoveConfirm.value = true
}

function executeRemoveDomain() {
  if (domainToRemove.value) {
    const idx = customDomains.value.findIndex(d => d.domain === domainToRemove.value.domain)
    if (idx !== -1) {
      customDomains.value.splice(idx, 1)
      toast.success(`Domain ${domainToRemove.value.domain} telah diputuskan.`)
      showRemoveConfirm.value = false
    }
  }
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
</style>
