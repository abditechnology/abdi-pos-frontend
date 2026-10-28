<template>
  <BaseModal
    :model-value="modelValue"
    :title="`Simulasi Fitur: ${plugin?.name || 'Demo Plugin'}`"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="plugin" class="plugin-demo-container space-y-6">
      <!-- Plugin Header Brief -->
      <div class="demo-header-box base-card">
        <div class="flex items-center gap-4">
          <div class="stat-icon-halo" :class="plugin.colorClass">
            <AppIcon :name="plugin.icon" :size="26" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-900 text-base">{{ plugin.name }}</h3>
              <span class="category-pill" :class="plugin.badgeClass">{{ plugin.categoryLabel }}</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">{{ plugin.shortDesc }}</p>
          </div>
        </div>
      </div>

      <!-- SIMULATOR INTERAKTIF SESUAI JENIS PLUGIN -->

      <!-- 1. SIMULATOR ABSENSI SELFIE & GPS -->
      <div v-if="plugin.demoType === 'selfie'" class="simulator-card base-card">
        <h4 class="sim-title">Pratinjau Layar Kasir: Clock-In Karyawan</h4>
        <div class="camera-simulation-box">
          <div class="camera-viewfinder" :class="{ 'photo-taken': selfieTaken }">
            <div class="face-target-guide">
              <div class="scanner-line"></div>
              <AppIcon name="user" :size="64" class="face-silhouette" />
            </div>

            <div class="viewfinder-overlay">
              <div class="gps-badge">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>GPS: 12 meter dari Toko (Radius Valid)</span>
              </div>
              <div class="timestamp-badge">
                26 Oktober 2026 • 08:02:14 WIB
              </div>
            </div>
          </div>

          <div class="sim-controls space-y-3">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-medium">Karyawan Bertugas:</span>
              <strong class="text-slate-800">Ahmad Faiz (Kasir Utama)</strong>
            </div>

            <div v-if="!selfieTaken">
              <BaseButton
                variant="primary"
                size="md"
                class="w-full"
                @click="triggerSelfie"
              >
                <template #icon><AppIcon name="camera" :size="16" /></template>
                Ambil Foto Selfie & Clock-In
              </BaseButton>
            </div>
            <div v-else class="success-alert">
              <span class="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                <AppIcon name="check" :size="16" /> Absensi Masuk Berhasil Diverifikasi!
              </span>
              <p class="text-[11px] text-emerald-600 mt-0.5">Wajah 99% cocok • Titik koordinat GPS tersimpan di audit log.</p>
              <button class="reset-btn text-xs text-slate-500 underline mt-2" @click="selfieTaken = false">
                Ulangi Simulasi
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. SIMULATOR KALKULATOR KOMISI -->
      <div v-else-if="plugin.demoType === 'commission'" class="simulator-card base-card">
        <h4 class="sim-title">Simulasi Perhitungan Komisi Jasa & Ritel</h4>
        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="font-bold text-slate-700 block mb-1">Pilih Staf / Terapis:</label>
              <select v-model="selectedStaff" class="sim-select">
                <option value="Budi Santoso (Kapster / Barber Senior)">Budi Santoso (Kapster Senior)</option>
                <option value="Sari Dewi (Terapis Creambath & Spa)">Sari Dewi (Terapis Spa)</option>
                <option value="Joko Anwar (Mekanik Servis)">Joko Anwar (Mekanik Servis)</option>
              </select>
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">Pilih Layanan Treatment:</label>
              <select v-model="selectedServicePrice" class="sim-select">
                <option :value="50000">Potong Rambut + Cuci (Rp 50.000)</option>
                <option :value="85000">Paket Creambath + Pijat (Rp 85.000)</option>
                <option :value="120000">Coloring / Pewarnaan (Rp 120.000)</option>
              </select>
            </div>
          </div>

          <!-- Calculation Result Card -->
          <div class="commission-box bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs text-emerald-800">Skema Komisi Layanan (20%):</span>
              <strong class="text-sm font-mono text-emerald-900">{{ formatRp(selectedServicePrice * 0.2) }}</strong>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs text-emerald-800">Bonus Penjualan Pomade (Flat):</span>
              <strong class="text-sm font-mono text-emerald-900">Rp 5.000</strong>
            </div>
            <div class="border-t border-emerald-200 pt-2 flex justify-between items-center">
              <span class="text-xs font-bold text-emerald-950">Total Komisi Masuk ke {{ selectedStaff.split(' ')[0] }}:</span>
              <span class="text-base font-bold font-mono text-emerald-700">{{ formatRp((selectedServicePrice * 0.2) + 5000) }}</span>
            </div>
          </div>
          <p class="text-[11px] text-slate-400">Komisi langsung terakumulasi ke slip gaji bulanan staf tanpa hitung manual.</p>
        </div>
      </div>

      <!-- 3. SIMULATOR WHATSAPP BOT -->
      <div v-else-if="plugin.demoType === 'waboot'" class="simulator-card base-card">
        <h4 class="sim-title">Pratinjau Percakapan WhatsApp Otomatis ke Pelanggan</h4>
        <div class="whatsapp-mock-phone">
          <div class="wa-header">
            <div class="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-xs">
              AP
            </div>
            <div>
              <div class="text-xs font-bold text-white">Abdi POS Official Notifier</div>
              <div class="text-[10px] text-emerald-100">WhatsApp Business API Terverifikasi</div>
            </div>
          </div>

          <div class="wa-chat-body">
            <div class="wa-bubble received">
              <p class="text-xs text-slate-800 leading-relaxed">
                Halo Kak <strong>Budi Santoso</strong>! 👋<br><br>
                Cucian Anda (3.2 kg) di <strong>Abdi Laundry Galaxy</strong> sudah <strong>SELESAI</strong> disetrika rapi dan wangi ✨.<br><br>
                📦 No Nota: <span class="font-mono font-bold">#LND-202610-09</span><br>
                💰 Total Tagihan: <span class="font-bold text-emerald-700">Rp 26.000 (Lunas)</span><br><br>
                Silakan diambil di gerai ya Kak. Terima kasih sudah mempercayakan cucian Anda pada kami! 😊
              </p>
              <span class="wa-time">10:15 WIB • ✓✓</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. SIMULATOR WHATSAPP BROADCAST -->
      <div v-else-if="plugin.demoType === 'broadcast'" class="simulator-card base-card">
        <h4 class="sim-title">Kirim Pesan Promo & Pengingat Ultah Massal</h4>
        <div class="space-y-3 text-xs">
          <div>
            <label class="font-bold text-slate-700 block mb-1">Target Segmen Pelanggan:</label>
            <select class="sim-select">
              <option>Pelanggan Berulang Tahun Bulan Ini (14 Member)</option>
              <option>Pelanggan VIP Platinum (28 Member)</option>
              <option>Seluruh Database Pelanggan (240 Kontak)</option>
            </select>
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">Pesan Template WhatsApp:</label>
            <textarea
              class="sim-textarea"
              rows="3"
              readonly
              value="Selamat Ulang Tahun Kak {NAMA}! 🎂 Spesial untuk hari bahagiamu, nikmati diskon 25% untuk seluruh menu & layanan treatment di Abdi POS. Tunjukkan pesan ini saat transaksi ya!"
            />
          </div>

          <BaseButton variant="primary" size="sm" class="w-full" @click="handleBroadcastSim">
            <template #icon><AppIcon name="gift" :size="14" /></template>
            Simulasi Kirim Broadcast (14 Member)
          </BaseButton>
        </div>
      </div>

      <!-- 5. SIMULATOR BOOKING MANDIRI ONLINE -->
      <div v-else-if="plugin.demoType === 'booking'" class="simulator-card base-card">
        <h4 class="sim-title">Portal Booking Mandiri Pelanggan dari Rumah</h4>
        <div class="booking-preview-container bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div class="text-center mb-3">
            <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider">https://booking.abdipos.com/abdi-salon</span>
            <h5 class="text-sm font-bold text-slate-800 mt-1">Reservasi Jadwal Kunjungan</h5>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <span class="text-slate-500 block mb-1">Pilih Jam Kedatangan Hari Ini:</span>
              <div class="flex gap-2">
                <button
                  v-for="time in ['10:00', '13:30', '15:00', '19:00']"
                  :key="time"
                  class="time-pill-btn"
                  :class="{ active: selectedBookingTime === time }"
                  @click="selectedBookingTime = time"
                >
                  {{ time }}
                </button>
              </div>
            </div>

            <div class="p-3 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <strong class="text-slate-800 block">Creambath Ginseng + Blow</strong>
                <span class="text-[11px] text-slate-500">Terapis: Sari Dewi • Durasi: 60 Menit</span>
              </div>
              <span class="font-mono font-bold text-blue-600">Rp 75.000</span>
            </div>

            <BaseButton variant="primary" size="sm" class="w-full" @click="handleBookingSim">
              Konfirmasi Reservasi Jadwal ({{ selectedBookingTime }} WIB)
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- 6. SIMULATOR KAS BON -->
      <div v-else-if="plugin.demoType === 'kasbon'" class="simulator-card base-card">
        <h4 class="sim-title">Pencatatan Kas Bon & Piutang Pelanggan</h4>
        <div class="space-y-3 text-xs">
          <div class="flex justify-between items-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div>
              <strong class="text-amber-950 block text-sm">Pak Joko (Pelanggan Tetap)</strong>
              <span class="text-amber-800 text-[11px]">Batas Limit Kredit: Rp 250.000</span>
            </div>
            <div class="text-right">
              <span class="text-amber-700 text-[11px] block">Total Kas Bon Belum Lunas:</span>
              <span class="text-base font-bold font-mono text-rose-700">Rp 65.000</span>
            </div>
          </div>

          <div class="border-t border-slate-200 pt-2 flex justify-between items-center">
            <span class="text-slate-500 text-[11px]">Ingatkan tagihan via WhatsApp secara santun:</span>
            <BaseButton variant="secondary" size="sm" @click="handleRemindKasbon">
              <template #icon><AppIcon name="receipt" :size="14" /></template>
              Kirim Reminder Tagihan WA
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- 7. SIMULATOR BIAYA OPERASIONAL & NET PROFIT -->
      <div v-else-if="plugin.demoType === 'expense'" class="simulator-card base-card">
        <h4 class="sim-title">Kalkulasi Otomatis Laba Bersih (Net Profit Riil)</h4>
        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span class="text-slate-500 block">Total Omset Kotor:</span>
              <strong class="text-base font-mono text-blue-700">Rp 15.500.000</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span class="text-slate-500 block">Modal Bahan HPP:</span>
              <strong class="text-base font-mono text-slate-800">- Rp 7.200.000</strong>
            </div>
          </div>

          <div class="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
            <span class="text-xs font-bold text-rose-900 block mb-1">Beban Operasional Non-HPP:</span>
            <div class="flex justify-between text-rose-800 text-[11px]">
              <span>Listrik PLN & Token:</span>
              <span class="font-mono">- Rp 450.000</span>
            </div>
            <div class="flex justify-between text-rose-800 text-[11px]">
              <span>Sewa Ruko / Tempat:</span>
              <span class="font-mono">- Rp 800.000</span>
            </div>
            <div class="flex justify-between text-rose-800 text-[11px]">
              <span>Kantong Kresek & Kebersihan:</span>
              <span class="font-mono">- Rp 150.000</span>
            </div>
          </div>

          <div class="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex justify-between items-center">
            <div>
              <strong class="text-emerald-950 text-sm block">LABA BERSIH RIIL (NET PROFIT)</strong>
              <span class="text-emerald-700 text-[11px]">Uang murni yang bisa dibawa pulang owner</span>
            </div>
            <span class="text-lg font-bold font-mono text-emerald-700">Rp 6.900.000</span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-action-bar flex justify-between items-center pt-4 border-t border-slate-200">
        <div>
          <span class="text-xs text-slate-500">Biaya Add-on:</span>
          <strong class="text-sm font-mono text-slate-900 ml-1">{{ formatRp(plugin.priceMonthly) }} / bulan</strong>
        </div>

        <div class="flex items-center gap-3">
          <BaseButton variant="secondary" size="md" @click="$emit('update:modelValue', false)">
            Tutup
          </BaseButton>
          <BaseButton
            :variant="plugin.isInstalled ? 'danger' : 'primary'"
            size="md"
            @click="$emit('install-requested', plugin)"
          >
            {{ plugin.isInstalled ? 'Nonaktifkan Plugin' : 'Pasang Plugin Sekarang' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/shared/components/ui/BaseModal.vue'
import BaseButton from '@/shared/components/ui/BaseButton.vue'
import AppIcon from '@/shared/components/icons/AppIcon.vue'
import { useToast } from '@/shared/composables/useToast'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  plugin: {
    type: Object,
    default: null
  }
})

defineEmits(['update:modelValue', 'install-requested'])

const toast = useToast()

// Interactive state for simulators
const selfieTaken = ref(false)
const selectedStaff = ref('Budi Santoso (Kapster / Barber Senior)')
const selectedServicePrice = ref(50000)
const selectedBookingTime = ref('13:30')

function formatRp(val) {
  if (typeof val !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

function triggerSelfie() {
  selfieTaken.value = true
  toast.success('Foto selfie berhasil diambil & posisi GPS tervalidasi!')
}

function handleBroadcastSim() {
  toast.success('Simulasi pesan broadcast berhasil terkirim ke 14 kontak!')
}

function handleBookingSim() {
  toast.success(`Simulasi reservasi mandiri jam ${selectedBookingTime.value} berhasil dijadwalkan!`)
}

function handleRemindKasbon() {
  toast.success('Pesan pengingat kas bon santun berhasil disiapkan via WhatsApp!')
}
</script>

<style scoped>
.demo-header-box {
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-radius: var(--radius-lg);
}

.sim-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.category-pill {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 9999px;
}

.tag-purple { background: #faf5ff; color: #7c3aed; border: 1px solid #e9d5ff; }
.tag-emerald { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
.tag-cyan { background: #ecfeff; color: #0891b2; border: 1px solid #a5f3fc; }
.tag-blue { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.tag-indigo { background: #eef2ff; color: #4f46e5; border: 1px solid #c7d2fe; }
.tag-amber { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
.tag-rose { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

/* Camera Viewfinder Simulation */
.camera-simulation-box {
  background: #091322;
  border-radius: var(--radius-lg);
  overflow: hidden;
  padding: 1rem;
}

.camera-viewfinder {
  height: 200px;
  background: #0b1528;
  border: 2px dashed rgba(59, 130, 246, 0.4);
  border-radius: var(--radius-md);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all var(--duration-fast);
}

.camera-viewfinder.photo-taken {
  border-color: #10b981;
  background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
}

.face-target-guide {
  width: 120px;
  height: 150px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.face-silhouette {
  color: rgba(255, 255, 255, 0.25);
}

.scanner-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
  animation: scan-vertical 2s infinite ease-in-out;
}

@keyframes scan-vertical {
  0%, 100% { top: 10%; }
  50% { top: 90%; }
}

.viewfinder-overlay {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #ffffff;
}

.gps-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 8px;
  border-radius: 4px;
}

.timestamp-badge {
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 8px;
  border-radius: 4px;
}

.sim-controls {
  background: #ffffff;
  padding: 1rem;
  border-radius: var(--radius-md);
}

.success-alert {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 0.75rem;
  border-radius: var(--radius-md);
}

/* Select & Inputs */
.sim-select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: 12px;
  outline: none;
}

.sim-textarea {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: 12px;
  outline: none;
  background: #f8fafc;
}

/* WhatsApp Phone Mockup */
.whatsapp-mock-phone {
  background: #075e54;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.wa-header {
  padding: 10px 14px;
  background: #075e54;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.wa-chat-body {
  background: #efeae2;
  padding: 1rem;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.wa-bubble {
  background: #ffffff;
  padding: 10px 12px;
  border-radius: 8px 8px 8px 0;
  max-width: 85%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.wa-time {
  font-size: 10px;
  color: #94a3b8;
  display: block;
  text-align: right;
  margin-top: 4px;
}

/* Booking Preview */
.time-pill-btn {
  padding: 5px 12px;
  border-radius: var(--radius-md);
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.time-pill-btn.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}
</style>
