<template>
  <main class="project-info">
    <div
      class="project-info__item"
      v-for="(item, idx) in projectInfo"
      :key="idx"
    >
      <p class="project-info__item-wrapper">
        {{ item.label }}
      </p>
      <p class="project-info__item-wrapper">
        {{ item.value }}
      </p>
    </div>
    <div v-if="!goWithDefault" class="project-info__item">
      <p class="project-info__item-wrapper">
        {{ $t('project-item-page.file-lbl') }}
      </p>
      <p v-if="!isEmpty(project.content)" class="project-info__item-wrapper">
        {{ $t('project-item-page.file-uploaded-lbl') }}
      </p>
      <div v-else class="project-info__item-wrapper">
        <file-field
          v-model="imageFile"
          :label="$t('project-item-page.file-field-title')"
          :sublabel="$t('project-item-page.file-field-description')"
        />
      </div>
    </div>
    <app-button
      v-if="!goWithDefault && !imageFile && isEmpty(project.content)"
      class="project-item-page__default-btn"
      :text="$t('project-item-page.default-image-lbl')"
      @click="setDefaultImage"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, watch, Ref } from 'vue'
import { AppButton } from '@/common'
import { FileField } from '@/fields'
import { ProjectInfo } from '@/types'

import { isEmpty } from 'lodash-es'
import { config } from '@/config'

import { useI18n } from 'vue-i18n'

const props = defineProps<{
  project: ProjectInfo
}>()

const { t, d } = useI18n()

const projectInfo: Array<{ label: string; value: string }> = [
  {
    label: t('project-item-page.owner-lbl'),
    value: props.project.owner,
  },
  {
    label: t('project-item-page.created-at-lbl'),
    value: d(props.project.created_at, 'long'),
  },
]

const imageFile = ref<File>()
const imageUrl = ref<string>()
const goWithDefault = ref(false)

const setDefaultImage = () => {
  goWithDefault.value = true
  imageUrl.value = config.DEFAULT_IMAGE
}

watch(imageFile, () => {
  if (!imageFile.value) {
    imageUrl.value = ''
    return
  }
  imageUrl.value = URL.createObjectURL(imageFile.value)
})

defineExpose<{
  imageFile: Ref<File | undefined>
  imageUrl: Ref<string | undefined>
  goWithDefault: Ref<boolean>
}>({
  imageUrl,
  imageFile,
  goWithDefault,
})
</script>

<style lang="scss" scoped>
.project-info {
  display: flex;
  flex-direction: column;
  gap: toRem(12);
  width: 60%;

  @include respond-to(tablet) {
    width: 90%;
  }
}

.project-info__item {
  display: grid;
  justify-content: center;
  grid-template-columns: minmax(0, toRem(100)) minmax(toRem(400), min-content);
  gap: toRem(15);

  @include respond-to(tablet) {
    display: flex;
    flex-direction: column;
  }

  & > *:first-child {
    font-weight: 600;
    flex-basis: 10%;
  }
}

.project-info__item-wrapper {
  border-radius: toRem(8);
  padding: toRem(10);
  background-color: var(--tertiary-main);
  height: min-content;

  @include text-ellipsis;
}

.project-item-page__default-btn {
  margin: toRem(25) auto;
  text-transform: uppercase;
}
</style>
