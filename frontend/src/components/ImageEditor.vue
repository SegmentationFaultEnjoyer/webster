<template>
  <div class="image-editor">
    <loader v-if="!isEditorInitialized" scheme="hamster" />

    <div
      class="image-editor__editor"
      :class="{
        'image-editor__editor--hidden': !isEditorInitialized || isInitFailed,
      }"
    >
      <div ref="editorContainerRef" class="image-editor__canvas-wrapper">
        <canvas ref="editorCanvasRef" class="image-editor__canvas" />
      </div>
      <image-editor-tool-kit v-if="isEditorInitialized && !isInitFailed" />
    </div>

    <error-message
      v-if="isInitFailed"
      :title="'Error'"
      :message="errorMsg"
      :icon-name="ICON_NAMES.photograph"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, type Ref, defineExpose } from 'vue'
import { Loader, ErrorMessage } from '@/common'
import { useImageEditor } from '@/composables'
import { ImageEditorToolKit } from '@/components'
import {
  EditorInstanceKey,
  type UseImageEditor,
  type CanvasRepresentation,
} from '@/types'

import { ICON_NAMES } from '@/enums'
import { config } from '@/config'

type ExposedEditorInstance = {
  editorInstance: Ref<UseImageEditor | undefined>
}

const props = withDefaults(
  defineProps<{
    imageUrl?: string
    savedState?: CanvasRepresentation
  }>(),
  {
    imageUrl: config.DEFAULT_IMAGE,
    savedState: undefined,
  },
)

const isEditorInitialized = ref(false)
const isInitFailed = ref(false)
const errorMsg = ref('')
const editorContainerRef = ref<HTMLElement | null>(null)
const editorCanvasRef = ref<HTMLCanvasElement | null>(null)

const exposedEditorInstance = ref<UseImageEditor>()

defineExpose<ExposedEditorInstance>({
  editorInstance: exposedEditorInstance,
})

onMounted(async () => {
  if (!editorCanvasRef.value || !editorContainerRef.value) return

  const editorInstance = useImageEditor(
    editorCanvasRef as Ref<HTMLCanvasElement>,
    editorContainerRef as Ref<HTMLElement>,
  )

  // providing canvas instance to all nested layers to avoid props drilling
  provide(EditorInstanceKey, { instance: editorInstance })
  exposedEditorInstance.value = editorInstance

  try {
    if (props.savedState) {
      await editorInstance.init(undefined, props.savedState)
    } else {
      await editorInstance.init(props.imageUrl)
    }
  } catch (error) {
    isInitFailed.value = true

    if (error instanceof Error) errorMsg.value = error.message
  }

  isEditorInitialized.value = true
  // setTimeout(() => {
  //   isEditorInitialized.value = true
  // }, 10000)
})
</script>

<style scoped lang="scss">
.image-editor {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: toRem(20);
  background-color: var(--tertiary-dark);
  padding: toRem(20) toRem(50);
  border-radius: toRem(8);

  @include respond-to(tablet) {
    padding: toRem(20) toRem(10);
  }
}

.image-editor__editor {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(65%, 1fr) minmax(toRem(150), toRem(300));

  &--hidden {
    visibility: hidden;
    position: absolute;
  }

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
  }
}

.image-editor__canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: toRem(8);
  width: 100%;
  overflow-y: auto;
  min-height: toRem(700);
  padding: toRem(40);
  position: static;

  @include respond-to(small) {
    padding: toRem(20) 0;
    min-height: vh(30);
  }
}
</style>
