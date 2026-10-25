<template>
  <div
    :class="[
      'base-card',
      {
        'card-hover-lift': hoverLift,
        'card-glass': glass,
        'card-bordered': bordered
      },
      customClass
    ]"
  >
    <!-- Header -->
    <header v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <div class="card-titles">
          <div class="card-title-row">
            <span v-if="$slots.icon" class="card-icon">
              <slot name="icon" />
            </span>
            <h3 class="card-title">{{ title }}</h3>
          </div>
          <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
        </div>
      </slot>

      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions" />
      </div>
    </header>

    <!-- Main Content Body -->
    <div :class="['card-body', bodyClass]">
      <slot />
    </div>

    <!-- Footer -->
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  hoverLift: {
    type: Boolean,
    default: false
  },
  glass: {
    type: Boolean,
    default: false
  },
  bordered: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  },
  bodyClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.base-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal) var(--ease-spring);
  overflow: hidden;
}

.card-bordered {
  border: 1px solid var(--border-app);
}

.card-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--slate-100);
}

.card-titles {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-icon {
  display: inline-flex;
  align-items: center;
  color: var(--primary-600);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.01em;
}

.card-subtitle {
  font-size: 12.5px;
  color: var(--text-muted);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-body {
  padding: 20px 22px;
  flex: 1;
}

.card-footer {
  padding: 14px 22px;
  background-color: var(--slate-50);
  border-top: 1px solid var(--slate-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
