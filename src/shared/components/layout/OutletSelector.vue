<template>
  <div class="outlet-selector" ref="dropdownRef">
    <button
      type="button"
      class="outlet-trigger"
      :class="{ 'is-open': isOpen }"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggleDropdown"
    >
      <div class="outlet-icon-box">
        <AppIcon name="store" :size="18" />
      </div>

      <div class="outlet-text">
        <span class="outlet-label">Cabang Aktif</span>
        <span class="outlet-name">{{ currentOutlet.name }}</span>
      </div>

      <span class="outlet-badge">{{ currentOutlet.code }}</span>

      <AppIcon
        name="chevron-down"
        :size="16"
        custom-class="trigger-arrow"
        :style="{ transform: isOpen ? 'rotate(180deg)' : 'none' }"
      />
    </button>

    <!-- Animated Dropdown Menu -->
    <Transition name="dropdown-spring">
      <div v-if="isOpen" class="outlet-dropdown-menu" role="listbox">
        <div class="menu-header">
          <span class="menu-title">Pilih Cabang / Outlet</span>
          <span class="outlet-count">{{ outlets.length }} Cabang</span>
        </div>

        <div class="menu-list">
          <button
            v-for="outlet in outlets"
            :key="outlet.id"
            type="button"
            :class="['outlet-option', { 'is-active': outlet.id === currentOutlet.id }]"
            role="option"
            :aria-selected="outlet.id === currentOutlet.id"
            @click="selectOutlet(outlet.id)"
          >
            <div class="option-icon">
              <AppIcon name="store" :size="16" />
            </div>

            <div class="option-info">
              <div class="option-title-row">
                <span class="option-name">{{ outlet.name }}</span>
                <span v-if="outlet.isPrimary" class="primary-pill">Pusat</span>
              </div>
              <span class="option-address">{{ outlet.address }}</span>
            </div>

            <div v-if="outlet.id === currentOutlet.id" class="active-check">
              <AppIcon name="check-circle" :size="18" />
            </div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useOutletStore } from '../../stores/outletStore'
import AppIcon from '../icons/AppIcon.vue'

const outletStore = useOutletStore()
const { outlets, currentOutlet } = storeToRefs(outletStore)

const isOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOutlet = (id) => {
  outletStore.switchOutlet(id)
  isOpen.value = false
}

// Click outside handler
const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.outlet-selector {
  position: relative;
}

.outlet-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 10px;
  background-color: var(--primary-50);
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-spring);
}

.outlet-trigger:hover,
.outlet-trigger.is-open {
  background-color: var(--primary-100);
  border-color: var(--primary-300);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);
}

.outlet-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}

.outlet-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.outlet-label {
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--primary-600);
}

.outlet-name {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-main);
  max-width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.outlet-badge {
  font-size: 11px;
  font-weight: 700;
  background-color: #ffffff;
  color: var(--primary-700);
  border: 1px solid var(--primary-200);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.trigger-arrow {
  color: var(--slate-400);
  transition: transform var(--duration-fast) var(--ease-spring);
}

/* Dropdown Menu */
.outlet-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 200;
  width: 330px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-app);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl), 0 8px 24px rgba(15, 23, 42, 0.12);
  overflow: hidden;
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--slate-50);
  border-bottom: 1px solid var(--slate-100);
}

.menu-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--slate-500);
}

.outlet-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-600);
  background-color: var(--primary-50);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.menu-list {
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 280px;
  overflow-y: auto;
}

.outlet-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  text-align: left;
  background-color: transparent;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.outlet-option:hover {
  background-color: var(--slate-100);
}

.outlet-option.is-active {
  background-color: var(--primary-50);
  border: 1px solid var(--primary-200);
}

.option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background-color: var(--slate-100);
  color: var(--slate-600);
  flex-shrink: 0;
}

.outlet-option.is-active .option-icon {
  background-color: var(--primary-600);
  color: #ffffff;
}

.option-info {
  flex: 1;
  min-width: 0;
}

.option-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.option-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.primary-pill {
  font-size: 10px;
  font-weight: 700;
  background-color: var(--success-50);
  color: var(--success-700);
  padding: 1px 5px;
  border-radius: var(--radius-sm);
}

.option-address {
  display: block;
  font-size: 11.5px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.active-check {
  color: var(--primary-600);
}

/* Dropdown Animation */
.dropdown-spring-enter-active {
  animation: slideDown 220ms var(--ease-spring);
}
.dropdown-spring-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.dropdown-spring-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
