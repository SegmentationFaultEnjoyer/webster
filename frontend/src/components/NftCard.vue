<template>
  <div
    :class="classes"
    @click="
      $router.push({
        name: $routes.nft,
        params: {
          address: nft.contract_address,
          id: nft.token_id,
        },
      })
    "
  >
    <div v-if="nft.image" class="nft-card__image-wrapper">
      <img class="nft-card__image" :src="nft.image" alt="nft-cover" />
    </div>

    <div class="nft-card__info">
      <p class="nft-card__title">
        {{ nft.title }}
      </p>
      <p v-if="scheme !== 'purchased'" class="nft-card__price">
        {{ formatFiatAssetFromWei(nft.price, 'USD') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FullNftInfo } from '@/types'
import { formatFiatAssetFromWei } from '@/helpers'

type SCHEME = 'purchased' | 'default'

const props = withDefaults(
  defineProps<{
    nft: FullNftInfo
    scheme?: SCHEME
  }>(),
  {
    scheme: 'default',
  },
)

const classes = computed(() => ['nft-card', `nft-card--${props.scheme}`])
</script>

<style lang="scss" scoped>
.nft-card {
  background-color: rgba(var(--primary-main-rgb), 0.2);
  border-radius: toRem(8);
  padding: toRem(15);
  max-height: toRem(300);
  width: toRem(250);
  border: toRem(1) solid var(--secondary-light);
  transition: scale 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: toRem(12);

  &--purchased {
    background-color: rgba(var(--secondary-light-rgb), 0.5);
  }

  &:hover {
    scale: 1.02;
    cursor: pointer;
  }
}

.nft-card__image-wrapper {
  display: flex;
  overflow: hidden;
  width: 100%;
}

.nft-card__image {
  width: 100%;
  max-height: toRem(220);
  border-radius: toRem(8);
  object-fit: cover;
  object-position: top center;
  border: toRem(1) solid var(--secondary-light);
}

.nft-card__title {
  font-weight: 600;
  font-size: toRem(22);

  @include text-ellipsis;
}

.nft-card__price {
  font-weight: 500;
  font-size: toRem(20);

  @include text-ellipsis;
}

.nft-card__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: toRem(5);
  gap: toRem(10);

  .nft-card--purchased & {
    justify-content: center;
  }
}
</style>
