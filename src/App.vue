<template>
  <RouterView />
  <ModeTransitionOverlay />
</template>

<script setup>
import { RouterView } from 'vue-router'
import ModeTransitionOverlay from './shared/components/layout/ModeTransitionOverlay.vue'
</script>

<style>
/* Root styling is managed by design-system.css */
</style>
