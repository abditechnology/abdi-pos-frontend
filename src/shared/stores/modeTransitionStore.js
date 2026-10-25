import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModeTransitionStore = defineStore('modeTransition', () => {
  const isTransitioning = ref(false)
  const targetMode = ref('superadmin') // 'superadmin' | 'tenant'
  const progress = ref(0)
  const currentStep = ref(1)

  let animationTimer = null

  /**
   * Start the mode transition animation
   * @param {'superadmin' | 'tenant'} mode - Target destination mode
   * @returns {Promise<void>} Resolves when transition sequence is completed
   */
  function startTransition(mode = 'superadmin') {
    if (isTransitioning.value) return Promise.resolve()

    targetMode.value = mode
    isTransitioning.value = true
    progress.value = 0
    currentStep.value = 1

    return new Promise((resolve) => {
      // Clear any prior running timer
      if (animationTimer) clearInterval(animationTimer)

      const startTime = performance.now()
      const totalDuration = 850 // Total animation duration in ms

      animationTimer = setInterval(() => {
        const elapsed = performance.now() - startTime
        const rawProgress = Math.min(elapsed / totalDuration, 1)

        // Ease-out cubic calculation for natural speed-up then settle
        const easeProgress = 1 - Math.pow(1 - rawProgress, 3)
        progress.value = Math.round(easeProgress * 100)

        // Step phases
        if (progress.value < 40) {
          currentStep.value = 1
        } else if (progress.value < 85) {
          currentStep.value = 2
        } else {
          currentStep.value = 3
        }

        if (rawProgress >= 1) {
          clearInterval(animationTimer)
          progress.value = 100
          currentStep.value = 3

          // Keep 100% visible briefly before closing
          setTimeout(() => {
            isTransitioning.value = false
            resolve()
          }, 150)
        }
      }, 16)
    })
  }

  return {
    isTransitioning,
    targetMode,
    progress,
    currentStep,
    startTransition
  }
})
