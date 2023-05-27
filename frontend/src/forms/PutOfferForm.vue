<template>
  <form class="put-offer-form" @submit.prevent="submit">
    <h4>{{ $t('put-offer-form.title') }}</h4>
    <p>{{ $t('put-offer-form.save-reminder') }}</p>
    <template v-if="isValidChain">
      <input-field
        v-model="form.title"
        :disabled="isFormDisabled"
        :label="$t('put-offer-form.title-lbl')"
        :placeholder="$t('put-offer-form.title-placeholder')"
        :error-message="getFieldErrorMessage('title')"
        @blur="touchField('title')"
      />
      <amount-field
        v-model="form.price"
        :disabled="isFormDisabled"
        :label="$t('put-offer-form.price-lbl')"
        :placeholder="$t('put-offer-form.price-placeholder')"
        :error-message="getFieldErrorMessage('price')"
        @blur="touchField('price')"
      />
      <textarea-field
        v-model="form.description"
        :disabled="isFormDisabled"
        :label="$t('put-offer-form.description-lbl')"
        :placeholder="$t('put-offer-form.description-placeholder')"
        :error-message="getFieldErrorMessage('description')"
        @blur="touchField('description')"
      />
      <section class="put-offer-form__actions">
        <app-button
          scheme="flat"
          size="small"
          :disabled="isFormDisabled"
          :text="$t('put-offer-form.cancel-btn')"
          @click="emit('close')"
        />
        <app-button
          size="small"
          type="submit"
          :disabled="isFormDisabled"
          :text="$t('put-offer-form.submit-btn')"
        />
      </section>
    </template>
    <template v-else>
      <h5>{{ $t('put-offer-form.wrong-network') }}</h5>
      <app-button
        class="put-offer-form__switch-btn"
        :disabled="isFormDisabled"
        :text="$t('put-offer-form.switch-btn')"
        :icon-right="$icons.refresh"
        @click="provider.switchChain($config.CHAIN_ID)"
      />
    </template>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { AppButton } from '@/common'
import {
  useForm,
  useFormValidation,
  useMarketplace,
  useIpfsUpload,
  HOSTS,
} from '@/composables'
import { InputField, TextareaField, AmountField } from '@/fields'
import { ProjectInfo } from '@/types'
import { required, minValue, maxValue, maxLength } from '@/validators'
import { ErrorHandler, formatIPFSLink } from '@/helpers'
import { config } from '@/config'
import { useWeb3ProvidersStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { Bus } from '@/helpers'

const MIN_PRICE = 0.01
const MAX_PRICE = 100_000
const MAX_DESC_LENGTH = 500

const props = defineProps<{
  project: ProjectInfo
  getImage: (name: string) => Promise<FormData | null> | null
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const form = reactive({
  title: props.project.title,
  description: '',
  price: '',
})

const { t } = useI18n()

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

const isValidChain = computed(
  () => provider.value.chainId === Number(config.CHAIN_ID),
)

const { disableForm, enableForm, isFormDisabled } = useForm()
const { isFormValid, touchField, getFieldErrorMessage } = useFormValidation(
  form,
  {
    title: {
      required,
    },
    description: {
      required,
      maxLength: maxLength(MAX_DESC_LENGTH),
    },
    price: {
      required,
      minValue: minValue(MIN_PRICE),
      maxValue: maxValue(MAX_PRICE),
    },
  },
)

const { createOffer } = useMarketplace()
const { uploadMetaData, upload } = useIpfsUpload(HOSTS.infura)
const submit = async () => {
  if (!isFormValid() || !provider.value.selectedAddress) return

  disableForm()
  try {
    const image = await props.getImage('file')

    if (!image) throw new Error('Failed to get image')

    const fileHash = await upload(image.get('file') as File)
    const metadataHash = await uploadMetaData({
      name: form.title,
      description: form.description,
      image: formatIPFSLink(fileHash),
      properties: {
        contractAddress: config.NFT_IMAGE_CONTRACT_ADDRESS,
      },
    })

    await createOffer({
      token_uri: metadataHash,
      title: form.title,
      price: form.price,
      seller: provider.value.selectedAddress,
      contract_address: config.NFT_IMAGE_CONTRACT_ADDRESS,
    })

    Bus.success(t('put-offer-form.success-msg'))

    emit('close')
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.put-offer-form {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  min-width: toRem(350);
  padding: toRem(20);
}

.put-offer-form__actions {
  display: flex;
  justify-content: space-between;
  gap: toRem(20);
  margin-top: toRem(15);

  & > * {
    text-transform: uppercase;
  }
}

.put-offer-form__switch-btn {
  margin: 0 auto;
  text-transform: uppercase;
}
</style>
