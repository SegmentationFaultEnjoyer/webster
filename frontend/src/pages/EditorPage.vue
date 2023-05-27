<template>
  <div class="main-page">
    <h1>{{ $t('main-page.title') }}</h1>
    <image-editor :image-url="testImage" />
  </div>
</template>

<script setup lang="ts">
import { ImageEditor } from '@/components'

const testImage =
  'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/e50e35c3-224c-40df-9fe4-0eb1477e9122.jpeg'
</script>

<style lang="scss" scoped>
.main-page {
  padding: toRem(30);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(20);
}
</style>
