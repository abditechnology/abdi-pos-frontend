<template>
  <div class="skeleton-wrapper">
    <div
      v-for="i in count"
      :key="i"
      :class="['skeleton-item', `skeleton-${type}`, customClass]"
      :style="{
        width: computedWidth,
        height: computedHeight,
        borderRadius: rounded ? 'var(--radius-full)' : undefined
      }"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (t) => ['text', 'avatar', 'rect', 'card', 'button'].includes(t)
  },
  count: {
    type: Number,
    default: 1
  },
  width: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
  rounded: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})

const computedWidth = computed(() => {
  if (props.width) return props.width
  if (props.type === 'avatar') return '44px'
  if (props.type === 'button') return '100px'
  if (props.type === 'card') return '100%'
  return '100%'
})

const computedHeight = computed(() => {
  if (props.height) return props.height
  if (props.type === 'avatar') return '44px'
  if (props.type === 'text') return '16px'
  if (props.type === 'button') return '38px'
  if (props.type === 'card') return '140px'
  return '20px'
})
</script>

<style scoped>
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.skeleton-item {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite ease-in-out;
  border-radius: var(--radius-sm);
}

.skeleton-avatar {
  border-radius: var(--radius-full);
}

.skeleton-card {
  border-radius: var(--radius-xl);
}

.skeleton-button {
  border-radius: var(--radius-md);
}
</style>
