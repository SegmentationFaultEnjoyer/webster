<template>
  <div class="nft-details">
    <div v-for="(item, idx) in nftDetails" :key="idx" class="nft-details__item">
      <p class="nft-details__item-label">
        {{ item.label }}
      </p>
      <p class="nft-details__item-value">
        {{ item.value }}
      </p>
    </div>
    <div class="nft-details__links">
      <div class="nft-details__links-item" @click="toOpenSea">
        <icon class="nft-details__icon" :name="$icons.openSea" />
      </div>
      <div class="nft-details__links-item" @click="toEtherscan">
        <icon class="nft-details__icon" :name="$icons.etherscan" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

import {
  cropAddress,
  formatAssetFromWei,
  formatOpenSeaLink,
  getBlockExplorerLink,
} from '@/helpers'
import { Icon } from '@/common'
import { FullNftInfo } from '@/types'
import { WINDOW_BREAKPOINTS } from '@/enums'

import { useI18n } from 'vue-i18n'
import { config } from '@/config'

const props = defineProps<{
  nft: FullNftInfo
}>()

const { t, d } = useI18n()
const { width } = useWindowSize()

const isSmallScreen = computed(() => width.value <= WINDOW_BREAKPOINTS.tablet)

const nftDetails = computed(() => [
  {
    label: t('nft-details.created-at'),
    value: d(props.nft.created_at, 'long'),
  },
  {
    label: t('nft-details.author'),
    value: !isSmallScreen.value
      ? props.nft.seller
      : cropAddress(props.nft.seller),
  },
  {
    label: t('nft-details.network'),
    value: config.CHAIN_ID,
  },
  {
    label: t('nft-details.price'),
    value: formatAssetFromWei(props.nft.price, 2),
  },
])

const toOpenSea = () => {
  window.open(
    formatOpenSeaLink(props.nft.contract_address, props.nft.token_id),
    '_blank',
  )
}

const toEtherscan = () => {
  window.open(getBlockExplorerLink(props.nft.contract_address), '_blank')
}
</script>

<style lang="scss" scoped>
.nft-details {
  display: flex;
  flex-direction: column;
  gap: toRem(15);
}

.nft-details__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: toRem(15);
}

.nft-details__item-label {
  font-size: toRem(18);
  background-color: var(--tertiary-main);
  border-radius: toRem(5);
  padding: toRem(5) toRem(12);
  flex-basis: 35%;
}

.nft-details__item-value {
  font-size: toRem(18);
  font-weight: 500;
  background-color: var(--tertiary-main);
  border-radius: toRem(5);
  padding: toRem(5) toRem(12);
  flex: 1;
  word-wrap: break-word;
}

.nft-details__links {
  display: flex;
  justify-content: center;
  gap: toRem(20);
  margin-top: toRem(10);
}

.nft-details__icon {
  max-height: toRem(50);
  max-width: toRem(50);
}

.nft-details__links-item {
  transition: transform 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }
}
</style>
