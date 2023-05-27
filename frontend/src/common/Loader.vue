<template>
  <div class="loader">
    <component :is="loader" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Spinner, LiquidDots, HamsterLoader } from '@/common/loader'

type SCHEME = 'spinner' | 'liquid' | 'hamster' | 'default'

const props = withDefaults(
  defineProps<{
    scheme?: SCHEME
  }>(),
  {
    scheme: 'spinner',
  },
)

const loader = computed(() => {
  switch (props.scheme) {
    case 'liquid':
      return LiquidDots
    case 'hamster':
      return HamsterLoader
    case 'spinner':
    default:
      return Spinner
  }
})
</script>

<style lang="scss" scoped>
.loader {
  display: grid;
  place-items: center;
}
</style>
