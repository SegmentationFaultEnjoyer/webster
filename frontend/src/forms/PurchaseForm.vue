<template>
  <form class="purchase-form" @submit.prevent="submit">
    <h4>{{ $t('purchase-form.title') }}</h4>
    <template v-if="isValidChain">
      <input-field
        v-model="form.recipient"
        :label="$t('purchase-form.recipient-lbl')"
        :placeholder="$t('purchase-form.recipient-placeholder')"
        :error-message="getFieldErrorMessage('recipient')"
        :disabled="isFormDisabled"
        @blur="touchField('recipient')"
      />
      <section class="purchase-form__actions">
        <app-button
          scheme="flat"
          size="small"
          :disabled="isFormDisabled"
          :text="$t('purchase-form.cancel-btn')"
          @click="emit('close')"
        />
        <app-button
          size="small"
          type="submit"
          :disabled="isFormDisabled"
          :text="$t('purchase-form.submit-btn')"
        />
      </section>
    </template>
    <template v-else>
      <h5>{{ $t('put-offer-form.wrong-network') }}</h5>
      <app-button
        class="purchase-form__switch-btn"
        :disabled="isFormDisabled"
        :text="$t('put-offer-form.switch-btn')"
        :icon-right="$icons.refresh"
        @click="provider.switchChain($config.CHAIN_ID)"
      />
    </template>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

import { AppButton } from '@/common'
import { useForm, useMarketplace, useFormValidation } from '@/composables'
import { InputField } from '@/fields'
import { Bus, ErrorHandler } from '@/helpers'
import { FullNftInfo } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { config } from '@/config'
import { useI18n } from 'vue-i18n'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'
import { required, address } from '@/validators'

const props = defineProps<{
  nftInfo: FullNftInfo
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { t } = useI18n()

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)
const isValidChain = computed(
  () => provider.value.chainId === Number(config.CHAIN_ID),
)

const form = reactive({
  recipient: provider.value.selectedAddress,
})

const { isFormDisabled, disableForm, enableForm } = useForm()
const { isFormValid, touchField, getFieldErrorMessage } = useFormValidation(
  form,
  {
    recipient: {
      required,
      address,
    },
  },
)
const { buyToken } = useMarketplace()

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    await buyToken(
      form.recipient!,
      props.nftInfo.seller,
      props.nftInfo.price,
      props.nftInfo.token_id,
    )

    emit('close')
    Bus.success(t('purchase-form.success-msg'))
    router.push({ name: ROUTE_NAMES.nfts })
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.purchase-form {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  min-width: toRem(350);
  padding: toRem(20);
}

.purchase-form__actions {
  display: flex;
  justify-content: space-between;
  gap: toRem(20);
  margin-top: toRem(15);

  & > * {
    text-transform: uppercase;
  }
}

.purchase-form__switch-btn {
  margin: 0 auto;
  text-transform: uppercase;
}
</style>
