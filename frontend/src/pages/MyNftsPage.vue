<template>
  <div class="my-nfts-page">
    <h3>{{ $t('my-nfts-page.title') }}</h3>
    <template v-if="provider.selectedAddress">
      <section v-if="nftList.length && !isLoading" class="my-nfts-page__items">
        <nft-card
          v-for="item in nftList"
          scheme="purchased"
          :key="item.token_id"
          :nft="item"
        />
      </section>
      <app-button
        v-if="isLoadMoreBtnShown"
        class="my-nfts-page__load-more-btn"
        scheme="flat"
        size="small"
        :text="$t('main-page.load-more-btn')"
        @click="loadNextPage"
      />

      <loader v-if="isLoading" scheme="liquid" />

      <error-message
        v-if="isLoadFailed"
        :message="$t('my-nfts-page.error-msg')"
      />

      <no-data-message
        v-else-if="!nftList.length && !isLoading"
        :message="$t('my-nfts-page.empty')"
      />
    </template>
    <section v-else class="my-nfts-page__not-connected">
      <h4 class="my-nfts-page__connect-msg">
        {{ $t('my-nfts-page.not-connected-msg') }}
      </h4>
      <app-button
        class="my-nfts-page__connect-btn"
        :text="$t('projects-no-data.connect-btn')"
        :icon-right="$icons.metamask"
        @click="provider.connect"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { Loader, NoDataMessage, ErrorMessage, AppButton } from '@/common'
import { NftCard } from '@/components'
import { useMarketplace, usePaginate } from '@/composables'
import { FullNftInfo, OfferResponse } from '@/types'
import { ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

const nftList = ref<FullNftInfo[]>([])
const isLoadFailed = ref(false)

const { getOffersList, addMetadataToList } = useMarketplace()

const loadList = computed(
  () => () =>
    getOffersList({
      buyer: provider.value.selectedAddress,
    }),
)

const setList = async (chunk: OfferResponse[]) => {
  const dataWithMetadata = await addMetadataToList(chunk)

  nftList.value = dataWithMetadata ?? []
}

const concatList = async (chunk: OfferResponse[]) => {
  const dataWithMetadata = await addMetadataToList(chunk)

  nftList.value = nftList.value.concat(dataWithMetadata ?? [])
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
    isLoadOnMounted: provider.value.isConnected,
  },
)
</script>

<style lang="scss" scoped>
.my-nfts-page {
  padding: toRem(70) toRem(180);
  flex: 1;

  @include respond-to(tablet) {
    padding: toRem(60) toRem(30);
  }
}

.my-nfts-page__items {
  display: flex;
  flex-flow: row wrap;
  gap: toRem(25);
  padding: toRem(20) 0;

  @include respond-to(tablet) {
    justify-content: center;
  }
}

.my-nfts-page__load-more-btn {
  margin: toRem(10) auto;
  text-transform: uppercase;

  --app-button-flat-text-hover: var(--info-dark);
  --app-button-flat-border-hover: #{toRem(2)} solid var(--info-dark);
}

.my-nfts-page__connect-msg {
  font-weight: 500;
}

.my-nfts-page__connect-btn {
  text-transform: uppercase;
  margin-top: toRem(20);
  background-color: var(--primary-light);
}

.my-nfts-page__not-connected {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: toRem(100);
}
</style>
