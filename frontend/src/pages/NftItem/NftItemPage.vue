<template>
  <div class="nft-item-page">
    <loader class="nft-item-page__loader" v-if="isLoading" scheme="liquid" />
    <template v-if="nftInfo">
      <div class="nft-item-page__cover-wrp">
        <img
          :src="nftInfo.image"
          :alt="nftInfo.name"
          class="nft-item-page__cover"
        />
      </div>
      <div class="nft-item-page__details">
        <header class="nft-item-page__details-header">
          <h1>{{ nftInfo.name }}</h1>
          <app-button
            v-if="isAuthor"
            class="nft-item-page__edit-btn"
            scheme="default"
            size="small"
            :icon-right="$icons.pencil"
            @click="isEditing = true"
          />
        </header>

        <p class="nft-item-page__description">
          {{ nftInfo.description }}
        </p>
        <nft-details :nft="nftInfo" />
        <app-button
          v-if="!isOwner && !isAuthor"
          class="nft-item-page__purchase-btn"
          :text="$t('nft-item-page.buy-btn')"
          @click="isBuying = true"
        />
        <p v-else-if="isAuthor" class="nft-item-page__owner-lbl">
          {{ $t('nft-item-page.author-lbl') }}
        </p>
        <p v-else class="nft-item-page__owner-lbl">
          {{ $t('nft-item-page.owner-lbl') }}
        </p>
      </div>
    </template>
    <template v-if="nftInfo">
      <modal v-model:is-shown="isBuying">
        <template #default="{ modal }">
          <purchase-form :nft-info="nftInfo" @close="modal.close" />
        </template>
      </modal>
      <modal v-if="isAuthor" v-model:is-shown="isEditing">
        <template #default="{ modal }">
          <edit-offer-form
            :offer="nftInfo"
            @close="modal.close"
            @page-reload="initPage"
          />
        </template>
      </modal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import { Loader, AppButton, Modal } from '@/common'
import { useMarketplace } from '@/composables'
import { FullNftInfo } from '@/types'
import { ErrorHandler } from '@/helpers'
import { NftDetails } from '@/pages/NftItem'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'
import { PurchaseForm, EditOfferForm } from '@/forms'
import { useWeb3ProvidersStore } from '@/store'

const props = defineProps<{
  id: string
  address: string
}>()

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)
const isOwner = computed(
  () => nftInfo.value?.buyer === provider.value.selectedAddress,
)
const isAuthor = computed(
  () => nftInfo.value?.seller === provider.value.selectedAddress,
)

const nftInfo = ref<FullNftInfo>()
const isLoading = ref(false)
const isBuying = ref(false)
const isEditing = ref(false)

const { getOffer, addMetadataToItem } = useMarketplace()

const initPage = async () => {
  isLoading.value = true
  try {
    const { data } = await getOffer(props.id)

    if (!data.is_enabled && data.buyer !== provider.value.selectedAddress) {
      router.push({ name: ROUTE_NAMES.main })
      return
    }

    nftInfo.value = await addMetadataToItem(data)
  } catch (error) {
    ErrorHandler.process(error)
  }
  isLoading.value = false
}

onMounted(initPage)
</script>

<style lang="scss" scoped>
.nft-item-page {
  $left-column: clamp(#{toRem(200)}, 45%, #{toRem(600)});
  $right-column: clamp(#{toRem(250)}, 50%, #{toRem(700)});

  display: grid;
  flex: 1;
  width: 100%;
  grid-template-columns: $left-column $right-column;
  grid-column-gap: clamp(#{toRem(10)}, 5%, #{toRem(80)});
  padding-top: toRem(60);
  justify-content: center;

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
    row-gap: toRem(40);
    text-align: center;
  }

  @include respond-to(small) {
    max-width: 100%;
  }
}

.nft-item-page__loader {
  grid-column: 1/-1;
}

.nft-item-page__cover-wrp {
  max-width: 100%;
}

.nft-item-page__cover {
  width: 100%;
  height: auto;
  border-radius: toRem(8);
  filter: drop-shadow(0 toRem(4) toRem(16) rgba(#9799a0, 0.25));

  @include respond-to(medium) {
    display: block;
    width: auto;
    max-height: toRem(500);
    max-width: 100%;
    margin: 0 auto;
  }
}

.nft-item-page__details {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.nft-item-page__description {
  word-wrap: break-word;
  line-height: 130%;
  font-size: toRem(18);
}

.nft-item-page__purchase-btn {
  text-transform: uppercase;
  margin-top: auto;
  width: 100%;
  font-size: toRem(20);
}

.nft-item-page__owner-lbl {
  margin-top: auto;
  font-size: toRem(20);
  align-self: center;
  color: var(--primary-light);
  border: toRem(1) dashed var(--secondary-main);
  border-radius: toRem(5);
  padding: toRem(10);
  transform: rotate(10deg);
}

.nft-item-page__details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nft-item-page__edit-btn {
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
