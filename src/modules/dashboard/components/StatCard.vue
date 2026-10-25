<template>
  <div :class="['stat-card', `theme-${theme}`, 'card-hover-lift']">
    <div class="stat-top">
      <div class="stat-meta">
        <span class="stat-title">{{ title }}</span>
        <div class="stat-value-container">
          <span v-if="isCurrency" class="stat-currency">Rp</span>
          <span class="stat-value">{{ formattedValue }}</span>
        </div>
      </div>

      <!-- Glowing Icon Container -->
      <div class="stat-icon-halo">
        <AppIcon :name="icon" :size="24" />
      </div>
    </div>

    <!-- Stat Bottom / Trend -->
    <div class="stat-bottom">
      <div
        v-if="trend !== undefined"
        :class="['trend-badge', trend >= 0 ? 'trend-up' : 'trend-down']"
      >
        <AppIcon
          :name="trend >= 0 ? 'arrow-up-right' : 'arrow-down-right'"
          :size="14"
        />
        <span>{{ Math.abs(trend) }}%</span>
      </div>

      <span class="trend-caption">{{ caption }}</span>
    </div>

    <!-- Animated Mini Accent Line -->
    <div class="stat-accent-bar" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  isCurrency: {
    type: Boolean,
    default: false
  },
  trend: {
    type: Number,
    default: undefined
  },
  caption: {
    type: String,
    default: 'vs periode lalu'
  },
  icon: {
    type: String,
    default: 'chart'
  },
  theme: {
    type: String,
    default: 'blue',
    validator: (t) => ['blue', 'emerald', 'amber', 'purple'].includes(t)
  }
})

const formattedValue = computed(() => {
  if (props.isCurrency) {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(props.value)
  }
  if (typeof props.value === 'number') {
    return new Intl.NumberFormat('id-ID').format(props.value)
  }
  return props.value
})
</script>

<style scoped>
.stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-app);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-spring);
}

.stat-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.stat-meta {
  display: flex;
  flex-direction: column;
}

.stat-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: -0.01em;
  margin-bottom: 6px;
}

.stat-value-container {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-currency {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-muted);
}

.stat-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.03em;
  font-feature-settings: "tnum";
}

/* Glowing Icon Halos */
.stat-icon-halo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
  transition: transform var(--duration-normal) var(--ease-spring);
}

.stat-card:hover .stat-icon-halo {
  transform: scale(1.1) rotate(4deg);
}

/* Theme: Blue */
.theme-blue .stat-icon-halo {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
  color: var(--primary-600);
  border: 1px solid var(--primary-200);
}
.theme-blue .stat-accent-bar {
  background: linear-gradient(90deg, var(--primary-500), var(--primary-700));
}

/* Theme: Emerald */
.theme-emerald .stat-icon-halo {
  background: linear-gradient(135deg, var(--success-50) 0%, var(--success-100) 100%);
  color: var(--success-600);
  border: 1px solid var(--success-100);
}
.theme-emerald .stat-accent-bar {
  background: linear-gradient(90deg, #34d399, var(--success-600));
}

/* Theme: Amber */
.theme-amber .stat-icon-halo {
  background: linear-gradient(135deg, var(--warning-50) 0%, var(--warning-100) 100%);
  color: var(--warning-600);
  border: 1px solid var(--warning-100);
}
.theme-amber .stat-accent-bar {
  background: linear-gradient(90deg, #fbbf24, var(--warning-600));
}

/* Theme: Purple */
.theme-purple .stat-icon-halo {
  background: linear-gradient(135deg, var(--purple-50) 0%, var(--purple-100) 100%);
  color: var(--purple-600);
  border: 1px solid var(--purple-100);
}
.theme-purple .stat-accent-bar {
  background: linear-gradient(90deg, #c084fc, var(--purple-600));
}

.stat-bottom {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
}

.trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
}

.trend-up {
  background-color: var(--success-50);
  color: var(--success-700);
}

.trend-down {
  background-color: var(--danger-50);
  color: var(--danger-700);
}

.trend-caption {
  font-size: 12px;
  color: var(--text-muted);
}

.stat-accent-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0.85;
}
</style>
