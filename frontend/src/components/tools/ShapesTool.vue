<template>
  <section class="shapes-tool">
    <p class="shapes-tool__label">
      {{ $t('shapes-tool.title') }}
    </p>
    <div class="shapes-tool__shapes">
      <editor-button
        modifications="first-in-group"
        icon-size="large"
        :icon-name="ICON_NAMES.rectangle"
        @click="addShape(addRectangle)"
      />
      <editor-button
        icon-size="large"
        :icon-name="ICON_NAMES.circle"
        @click="addShape(addCircle)"
      />
      <editor-button
        icon-size="large"
        modifications="last-in-group"
        :icon-name="ICON_NAMES.triangle"
        @click="addShape(addTriangle)"
      />
    </div>
    <p class="shapes-tool__label">
      {{ $t('shapes-tool.subtitle') }}
    </p>
    <app-button
      v-if="fieldRef"
      class="shapes-tool__add-image-btn"
      size="small"
      scheme="flat"
      :text="$t('shapes-tool.upload-btn')"
      :icon-right="ICON_NAMES.plus"
      @click="fieldRef.click()"
    />
    <input
      ref="fieldRef"
      type="file"
      hidden
      accept="image/*"
      @change="addImageLayer"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppButton } from '@/common'
import { Bus, formatFileSize, safeInject } from '@/helpers'
import { EditorButton } from '@/common'
import { ICON_NAMES } from '@/enums'
import { EditorInstanceKey, DefaultParamsKey } from '@/types'
import type { fabric } from 'fabric'
import { FileFieldChangeEvent } from '@/fields/FileField.vue'

const SUPPORTED_MIME_TYPES = [
  'image/jpg',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
]
const MAX_IMAGE_SIZE = 5242880

const {
  instance: { addCircle, addRectangle, addTriangle, addImage },
} = safeInject(EditorInstanceKey)

const { params } = safeInject(DefaultParamsKey)

const fieldRef = ref<HTMLInputElement | null>(null)

const addShape = (addFunc: (options?: fabric.IObjectOptions) => void) => {
  addFunc({
    fill: params.value.fill,
    stroke: params.value.strokeColor as string,
    strokeWidth: params.value.strokeWidth,
  })
}

const addImageLayer = (event: FileFieldChangeEvent) => {
  if (!event?.target.files || event.target.files.length < 1) return

  const selectedFile = event.target.files[0]

  // type Validation
  if (!SUPPORTED_MIME_TYPES.includes(selectedFile.type)) {
    Bus.warning(`File type "${selectedFile.type}" is not supported.`)
    return
  }

  // SIZE Validation
  if (selectedFile.size > MAX_IMAGE_SIZE) {
    Bus.warning(`File size exceeds ${formatFileSize(MAX_IMAGE_SIZE)}.`)
    return
  }

  addImage(selectedFile)

  if (!fieldRef.value) return
  fieldRef.value.value = ''
}
</script>

<style lang="scss" scoped>
.shapes-tool {
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.shapes-tool__shapes {
  display: flex;
  justify-content: center;

  & > *:nth-child(2) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
}

.shapes-tool__label {
  @include tool-label;
}

.shapes-tool__add-image-btn {
  width: 100%;
  height: toRem(45);
  border: toRem(1) solid var(--secondary-main);
  color: var(--secondary-dark);

  --app-button-flat-text-hover: var(--primary-light);
  --app-button-flat-border-hover: #{toRem(1)} solid var(--primary-light);
}
</style>
