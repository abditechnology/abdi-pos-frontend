<template>
  <div class="app-layout">
    <!-- Main Collapsible Animated Sidebar -->
    <AppSidebar />

    <!-- Mobile Overlay Backdrop -->
    <div
      v-if="uiStore.isMobileSidebarOpen"
      class="mobile-backdrop"
      @click="uiStore.toggleMobileSidebar"
    />

    <!-- Main Content Area -->
    <div
      :class="[
        'main-wrapper',
        { 'sidebar-collapsed': uiStore.isSidebarCollapsed }
      ]"
    >
      <!-- Top Sticky Header -->
      <AppHeader />

      <!-- Page Content Router View with Spring Transition -->
      <main class="page-content">
        <router-view v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </main>
    </div>

    <!-- Global Toast Container (Stack notifications at top-right) -->
    <ToastContainer />
  </div>
</template>

<script setup>
import { useUiStore } from '../../shared/stores/uiStore'
import AppSidebar from '../../shared/components/layout/AppSidebar.vue'
import AppHeader from '../../shared/components/layout/AppHeader.vue'
import ToastContainer from '../../shared/components/ui/ToastContainer.vue'

const uiStore = useUiStore()
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  background-color: var(--bg-app);
  position: relative;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  transition: margin-left var(--duration-normal) var(--ease-spring);
}

.main-wrapper.sidebar-collapsed {
  margin-left: var(--sidebar-collapsed-width);
}

.page-content {
  flex: 1;
  padding: 24px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

.mobile-backdrop {
  position: fixed;
  inset: 0;
  z-index: 140;
  background-color: rgba(7, 13, 24, 0.6);
  backdrop-filter: blur(4px);
}

/* Page Transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 200ms ease, transform 200ms var(--ease-spring);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 900px) {
  .main-wrapper {
    margin-left: 0 !important;
  }
  .page-content {
    padding: 16px;
  }
}
</style>
