<template>
  <Teleport to="body">
    <Transition name="mode-overlay">
      <div
        v-if="store.isTransitioning"
        :class="['mode-overlay-container', `theme-${store.targetMode}`]"
        role="status"
        aria-live="polite"
        aria-label="Memuat perpindahan mode aplikasi"
      >
        <!-- Background Ambient Glow & Mesh -->
        <div class="ambient-glow"></div>
        <div class="ambient-grid"></div>

        <!-- Central Loading Card -->
        <div class="loading-card">
          <!-- Orbital Rotating Emblem -->
          <div class="emblem-wrapper">
            <!-- Outer spinning dashed orbital ring -->
            <svg class="orbital-ring orbital-outer" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-dasharray="8 6"
              />
            </svg>

            <!-- Inner counter-spinning accent ring -->
            <svg class="orbital-ring orbital-inner" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-dasharray="14 12"
              />
            </svg>

            <!-- Center Halo Icon -->
            <div class="center-emblem">
              <div class="emblem-inner-glow"></div>
              <AppIcon
                :name="store.targetMode === 'superadmin' ? 'shield' : 'store'"
                :size="36"
                class="emblem-icon"
              />
            </div>
          </div>

          <!-- Mode Badge Pill -->
          <div class="mode-pill">
            <span class="pulsing-dot"></span>
            <span class="mode-pill-text">
              {{ store.targetMode === 'superadmin' ? 'KONSOL SAAS OWNER' : 'PORTAL TOKO TENANT' }}
            </span>
          </div>

          <!-- Dynamic Heading & Step Messages -->
          <div class="text-group">
            <h2 class="mode-title">
              {{ store.targetMode === 'superadmin' ? 'Beralih ke Konsol Superadmin' : 'Beralih ke Dashboard Toko' }}
            </h2>

            <p class="mode-subtitle">
              <Transition name="step-fade" mode="out-in">
                <span :key="`${store.targetMode}-${store.currentStep}`">
                  <template v-if="store.targetMode === 'superadmin'">
                    <template v-if="store.currentStep === 1">Memvalidasi izin akses & lisensi Superadmin...</template>
                    <template v-else-if="store.currentStep === 2">Memuat analitik multi-tenant & metrik MRR...</template>
                    <template v-else>Konsol Superadmin siap! Mengalihkan...</template>
                  </template>
                  <template v-else>
                    <template v-if="store.currentStep === 1">Menyiapkan sesi toko & konfigurasi cabang...</template>
                    <template v-else-if="store.currentStep === 2">Memuat katalog menu & operasional POS...</template>
                    <template v-else>Dashboard toko siap! Mengalihkan...</template>
                  </template>
                </span>
              </Transition>
            </p>
          </div>

          <!-- Animated Progress Bar Container -->
          <div class="progress-wrap">
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: `${store.progress}%` }"
              >
                <div class="progress-shimmer"></div>
              </div>
            </div>

            <!-- Progress readout & status -->
            <div class="progress-info">
              <span class="progress-status">
                {{ store.progress === 100 ? 'Selesai' : 'Sinkronisasi konteks...' }}
              </span>
              <span class="progress-percent font-mono">{{ store.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useModeTransitionStore } from '../../stores/modeTransitionStore'
import AppIcon from '../icons/AppIcon.vue'

const store = useModeTransitionStore()
</script>

<style scoped>
.mode-overlay-container {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Theme Superadmin: Deep Midnight Indigo */
.theme-superadmin {
  background: radial-gradient(circle at center, rgba(15, 23, 42, 0.94) 0%, rgba(7, 13, 24, 0.98) 100%);
  color: #f8fafc;
}

.theme-superadmin .ambient-glow {
  background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(59, 130, 246, 0.15) 40%, transparent 70%);
}

.theme-superadmin .orbital-outer {
  color: rgba(129, 140, 248, 0.45);
}

.theme-superadmin .orbital-inner {
  color: rgba(56, 189, 248, 0.35);
}

.theme-superadmin .center-emblem {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
  border: 2px solid rgba(129, 140, 248, 0.6);
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.45), inset 0 0 20px rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.theme-superadmin .mode-pill {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(129, 140, 248, 0.4);
  color: #c7d2fe;
}

.theme-superadmin .pulsing-dot {
  background-color: #818cf8;
  box-shadow: 0 0 8px #818cf8;
}

.theme-superadmin .progress-fill {
  background: linear-gradient(90deg, #6366f1 0%, #3b82f6 50%, #38bdf8 100%);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.7);
}

/* Theme Tenant: Deep Ocean Royal Blue */
.theme-tenant {
  background: radial-gradient(circle at center, rgba(11, 21, 40, 0.94) 0%, rgba(4, 9, 17, 0.98) 100%);
  color: #f8fafc;
}

.theme-tenant .ambient-glow {
  background: radial-gradient(circle, rgba(2, 132, 199, 0.35) 0%, rgba(16, 185, 129, 0.15) 45%, transparent 70%);
}

.theme-tenant .orbital-outer {
  color: rgba(56, 189, 248, 0.45);
}

.theme-tenant .orbital-inner {
  color: rgba(52, 211, 153, 0.35);
}

.theme-tenant .center-emblem {
  background: linear-gradient(135deg, rgba(15, 30, 55, 0.9) 0%, rgba(8, 18, 35, 0.95) 100%);
  border: 2px solid rgba(56, 189, 248, 0.6);
  box-shadow: 0 0 30px rgba(2, 132, 199, 0.45), inset 0 0 20px rgba(2, 132, 199, 0.2);
  color: #38bdf8;
}

.theme-tenant .mode-pill {
  background: rgba(2, 132, 199, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.4);
  color: #bae6fd;
}

.theme-tenant .pulsing-dot {
  background-color: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
}

.theme-tenant .progress-fill {
  background: linear-gradient(90deg, #0284c7 0%, #06b6d4 50%, #10b981 100%);
  box-shadow: 0 0 12px rgba(2, 132, 199, 0.7);
}

/* Background elements */
.ambient-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
  filter: blur(40px);
  animation: pulse-glow 3s ease-in-out infinite alternate;
}

.ambient-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  opacity: 0.6;
}

/* Loading Card */
.loading-card {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 440px;
  width: 90%;
  padding: 2.5rem 2rem;
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: card-appear 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Orbital Rings & Center Emblem */
.emblem-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.orbital-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.orbital-outer {
  animation: spin-clockwise 10s linear infinite;
}

.orbital-inner {
  width: 84%;
  height: 84%;
  top: 8%;
  left: 8%;
  animation: spin-counter-clockwise 7s linear infinite;
}

.center-emblem {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.emblem-icon {
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
  animation: icon-float 2.4s ease-in-out infinite;
}

/* Mode Badge Pill */
.mode-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.pulsing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: dot-pulse 1.2s ease-in-out infinite;
}

/* Typography */
.text-group {
  margin-bottom: 1.75rem;
}

.mode-title {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 0.4rem;
  color: #ffffff;
}

.mode-subtitle {
  font-size: 0.825rem;
  color: #94a3b8;
  margin: 0;
  min-height: 20px;
}

/* Progress Bar */
.progress-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-track {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.progress-fill {
  height: 100%;
  border-radius: 9999px;
  position: relative;
  transition: width 0.1s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer-swipe 1.2s infinite;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.725rem;
  color: #64748b;
}

.progress-status {
  color: #94a3b8;
}

.progress-percent {
  font-weight: 700;
  color: #e2e8f0;
}

/* Transitions */
.mode-overlay-enter-active {
  transition: opacity 0.25s ease;
}

.mode-overlay-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.mode-overlay-enter-from {
  opacity: 0;
}

.mode-overlay-leave-to {
  opacity: 0;
  transform: scale(1.04);
}

.step-fade-enter-active,
.step-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.step-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.step-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Animations */
@keyframes card-appear {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes spin-clockwise {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-counter-clockwise {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes pulse-glow {
  0% {
    transform: translate(-50%, -50%) scale(0.85);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 1;
  }
}

@keyframes dot-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.7);
  }
}

@keyframes icon-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes shimmer-swipe {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
