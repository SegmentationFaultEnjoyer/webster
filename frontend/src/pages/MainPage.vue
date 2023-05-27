<template>
  <div class="main-page">
    <header class="main-page__header">
      <h1 class="main-page__header-title">
        {{ $t('main-page.title') }}
      </h1>
      <h4>{{ $t('main-page.subtitle') }}</h4>
    </header>
    <template v-if="offersList.length && !isLoading">
      <h4 class="main-page__marketplace-title">
        {{ $t('main-page.marketplace-title') }}
      </h4>
      <main class="main-page__items">
        <nft-card
          v-for="offer in offersList"
          :key="offer.token_id"
          :nft="offer"
        />
      </main>
    </template>

    <app-button
      v-if="isLoadMoreBtnShown"
      class="main-page__load-more-btn"
      scheme="flat"
      size="small"
      :text="$t('main-page.load-more-btn')"
      @click="loadNextPage"
    />

    <loader v-if="isLoading" scheme="liquid" />

    <error-message v-if="isLoadFailed" :message="$t('main-page.error-msg')" />

    <no-data-message
      v-else-if="!offersList.length && !isLoading"
      :message="$t('main-page.empty')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { Loader, NoDataMessage, ErrorMessage, AppButton } from '@/common'
import { NftCard } from '@/components'
import { useMarketplace, usePaginate } from '@/composables'
import { FullNftInfo, OfferResponse } from '@/types'
import { ErrorHandler } from '@/helpers'

const offersList = ref<FullNftInfo[]>([])
const isLoadFailed = ref(false)

const { getOffersList, addMetadataToList } = useMarketplace()

const loadList = computed(
  () => () =>
    getOffersList({
      buyer: '',
      is_enabled: true,
    }),
)

const setList = async (chunk: OfferResponse[]) => {
  const dataWithMetadata = await addMetadataToList(chunk)

  offersList.value = dataWithMetadata ?? []
}

const concatList = async (chunk: OfferResponse[]) => {
  const dataWithMetadata = await addMetadataToList(chunk)

  offersList.value = offersList.value.concat(dataWithMetadata ?? [])
}

const onError = (e: Error) => {
  isLoadFailed.value = true
  ErrorHandler.processWithoutFeedback(e)
}

const { loadNextPage, isLoadMoreBtnShown, isLoading } = usePaginate(
  loadList,
  setList,
  concatList,
  onError,
  {
    debounceLoaderTime: 1200,
  },
)
</script>

<style lang="scss" scoped>
.main-page {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: toRem(20);
  text-align: center;
  padding: toRem(40);

  @include respond-to(small) {
    padding: toRem(20) 0;
  }
}

.main-page__header {
  margin-top: toRem(30);
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  margin-bottom: toRem(70);
}

.main-page__header-title {
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: toRem(65);
    left: 50%;
    transform: translateX(-50%);
    width: toRem(500);
    height: toRem(3);
    background-color: var(--secondary-main);

    @include respond-to(medium) {
      top: toRem(50);
      width: toRem(300);
    }

    @include respond-to(small) {
      display: none;
    }
  }
}

.main-page__items {
  display: flex;
  flex-flow: row wrap;
  gap: toRem(25);
  padding: 0 toRem(50);

  @include respond-to(small) {
    justify-content: center;
  }
}

.main-page__marketplace-title {
  font-size: toRem(30);
  margin-bottom: toRem(20);
}

.main-page__load-more-btn {
  margin: toRem(10) auto;
  text-transform: uppercase;

  --app-button-flat-text-hover: var(--info-dark);
  --app-button-flat-border-hover: #{toRem(2)} solid var(--info-dark);
}
</style>
