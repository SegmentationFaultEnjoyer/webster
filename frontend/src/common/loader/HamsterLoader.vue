<template>
  <div class="hamster-loader">
    <animation :animation-data="Hamster" />
  </div>
</template>

<script setup lang="ts">
import { Animation } from '@/common'

import Hamster from '@/assets/animations/hamster-loader.json'
</script>

<style lang="scss" scoped>
.hamster-loader {
  max-width: toRem(300);
  max-height: toRem(300);
}
</style>
