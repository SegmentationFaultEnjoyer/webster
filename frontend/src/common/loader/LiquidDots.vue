<template>
  <div class="liquid-dots">
    <animation :animation-data="Loader" />
  </div>
</template>

<script setup lang="ts">
import Loader from '@/assets/animations/liquid-dot-loader.json'

import { Animation } from '@/common'
</script>

<style scoped lang="scss">
.liquid-dots {
  max-width: toRem(300);
  max-height: toRem(300);
}
</style>
