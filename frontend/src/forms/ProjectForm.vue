<template>
  <form class="project-form" @submit.prevent="submit">
    <h4>{{ title }}</h4>
    <input-field
      v-model="form.title"
      :label="$t('project-form.name-lbl')"
      :placeholder="$t('project-form.name-placeholder')"
      :error-message="getFieldErrorMessage('title')"
      :disabled="isFormDisabled"
      @blur="touchField('title')"
    />
    <input-field
      v-if="isUpdate"
      v-model="form.owner"
      :label="$t('project-form.owner-lbl')"
      :placeholder="$t('project-form.owner-placeholder')"
      :error-message="getFieldErrorMessage('owner')"
      :disabled="isFormDisabled"
      @blur="touchField('owner')"
    />
    <section class="project-form__actions">
      <app-button
        scheme="flat"
        size="small"
        :text="$t('project-form.cancel-btn')"
        :disabled="isFormDisabled"
        @click="emit('close')"
      />
      <app-button
        type="submit"
        size="small"
        :text="$t('project-form.submit-btn')"
        :disabled="isFormDisabled"
      />
    </section>
  </form>
</template>

<script setup lang="ts">
import { AppButton } from '@/common'
import { useForm, useFormValidation, useProjects } from '@/composables'
import { InputField } from '@/fields'
import { useI18n } from 'vue-i18n'
import { computed, reactive } from 'vue'
import { ProjectInfo } from '@/types'
import {
  required,
  minLength,
  maxLength,
  requiredIf,
  address,
} from '@/validators'
import { Bus, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'

const MIN_TITLE_LENGTH = 4
const MAX_TITLE_LENGT = 36

const { t } = useI18n()
const web3Store = useWeb3ProvidersStore()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'page-reload'): void
}>()

const props = defineProps<{
  project?: ProjectInfo
}>()

const provider = computed(() => web3Store.provider)

const title = computed(() =>
  !props.project
    ? t('project-form.create-title')
    : t('project-form.update-title'),
)

const isUpdate = computed(() => Boolean(props.project))

const { createProject, updateProject } = useProjects()

const form = reactive({
  title: props.project?.title ?? '',
  owner: props.project?.owner ?? '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()
const { isFormValid, touchField, getFieldErrorMessage } = useFormValidation(
  form,
  {
    title: {
      required,
      minLength: minLength(MIN_TITLE_LENGTH),
      maxLength: maxLength(MAX_TITLE_LENGT),
    },
    owner: {
      requiredIf: requiredIf(isUpdate),
      address,
    },
  },
)

const _createProject = () => {
  if (!provider.value.selectedAddress) return

  return createProject({
    title: form.title,
    content: JSON.stringify({}),
    owner: provider.value.selectedAddress,
  })
}

const _updateProject = () => {
  if (!props.project) return

  return updateProject({
    id: props.project.id,
    title: form.title,
  })
}

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    if (!isUpdate.value) {
      await _createProject()
    } else {
      await _updateProject()
    }

    Bus.success(
      !isUpdate.value
        ? t('project-form.success-create-msg')
        : t('project-form.success-update-msg'),
    )

    emit('close')
    emit('page-reload')
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.project-form {
  padding: toRem(30) toRem(25);
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  min-width: toRem(350);
}

.project-form__actions {
  display: flex;
  justify-content: space-between;
  gap: toRem(40);
}
</style>
