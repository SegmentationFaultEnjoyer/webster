<template>
  <form class="edit-offer-form" @submit.prevent="submit">
    <h4>{{ $t('edit-offer-form.title') }}</h4>
    <input-field
      v-model="form.price"
      :disabled="isFormDisabled"
      :label="$t('edit-offer-form.price-lbl')"
      :placeholder="$t('edit-offer-form.price-placeholder')"
      :error-message="getFieldErrorMessage('price')"
      @blur="touchField('price')"
    />
    <section class="edit-offer-form__actions">
      <app-button
        scheme="flat"
        size="small"
        :disabled="isFormDisabled"
        :text="$t('edit-offer-form.cancel-btn')"
        @click="emit('close')"
      />
      <app-button
        size="small"
        type="submit"
        :disabled="isFormDisabled"
        :text="$t('edit-offer-form.submit-btn')"
      />
    </section>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { AppButton } from '@/common'
import { useForm, useFormValidation, useMarketplace } from '@/composables'
import { InputField } from '@/fields'
import { FullNftInfo } from '@/types'
import { required, minValue, maxValue } from '@/validators'
import { ErrorHandler, formatAssetFromWei } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { Bus } from '@/helpers'

const MIN_PRICE = 0.01
const MAX_PRICE = 100_000

const props = defineProps<{
  offer: FullNftInfo
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'page-reload'): void
}>()

const form = reactive({
  price: formatAssetFromWei(props.offer.price, 2),
})

const { t } = useI18n()

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

const { disableForm, enableForm, isFormDisabled } = useForm()
const { isFormValid, touchField, getFieldErrorMessage } = useFormValidation(
  form,
  {
    price: {
      required,
      minValue: minValue(MIN_PRICE),
      maxValue: maxValue(MAX_PRICE),
    },
  },
)

const { updateOffer } = useMarketplace()

const submit = async () => {
  if (!isFormValid() || !provider.value.selectedAddress) return

  disableForm()
  try {
    await updateOffer({
      price: form.price,
      id: props.offer.token_id,
    })

    Bus.success(t('edit-offer-form.success-msg'))

    emit('close')
    emit('page-reload')
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.edit-offer-form {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  min-width: toRem(350);
  padding: toRem(20);
}

.edit-offer-form__actions {
  display: flex;
  justify-content: space-between;
  gap: toRem(20);
  margin-top: toRem(15);

  & > * {
    text-transform: uppercase;
  }
}

.edit-offer-form__switch-btn {
  margin: 0 auto;
  text-transform: uppercase;
}
</style>
