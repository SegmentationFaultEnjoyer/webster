<template>
  <div class="animation">
    <vue3-lottie
      :animation-data="animationData"
      v-bind="$attrs"
      ref="animationRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, Ref } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'

type Direction = 'forward' | 'reverse'

export interface LottieController {
  play: () => void
  playSegments: (segments: number[], forceFlag?: boolean) => void
  pause: () => void
  stop: () => void
  destroy: () => void
  setSpeed: (speed: number) => void
  goToAndStop: (position: number, isFrame: boolean) => void
  goToAndPlay: (position: number, isFrame: boolean) => void
  setDirection: (direction: Direction) => void
  getDuration: (isFrames: boolean) => number
}

const animationRef = ref<LottieController | null>(null)

defineProps<{
  animationData: JSON
}>()

defineExpose<{ controller: Ref<LottieController | null> }>({
  controller: animationRef,
})
</script>

<style lang="scss" scoped></style>
