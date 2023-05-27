<template>
  <aside v-bind="$attrs" class="image-editor-tool-kit">
    <tools-switcher v-model="currentMode" />

    <hr class="image-editor-tool-kit__divider" />

    <layering-tool />

    <transition name="tool-switch" mode="out-in">
      <component :is="tool" />
    </transition>

    <color-tool
      v-if="currentMode !== TOOL_MODS.drawing"
      :disabled-color-types="disabledColorTools"
    />
    <zoom-tool />
    <p class="image-editor-tool-kit__label">
      {{ $t('image-editor-toolkit.options-lbl') }}
    </p>
    <checkbox-field
      v-model="isGuidelinesDisabled"
      :label="$t('image-editor-toolkit.disable-guidelines-lbl')"
    />
    <history-tool class="image-editor-tool-kit__history" />

    <context-menu v-model:is-shown="contextMenuState.isShown">
      <ul class="image-editor-tool-kit__context-menu">
        <template v-if="contextMenuState.target">
          <li
            class="image-editor-tool-kit__context-menu-item"
            @click="bringToFrontClick"
          >
            {{ $t('image-editor-toolkit.bring-to-front-lbl') }}
          </li>
          <li
            class="image-editor-tool-kit__context-menu-item"
            @click="sendToBackClick"
          >
            {{ $t('image-editor-toolkit.send-to-back-lbl') }}
          </li>
          <li
            class="image-editor-tool-kit__context-menu-item"
            @click="copyClick"
          >
            {{ $t('image-editor-toolkit.copy-lbl') }}
          </li>
        </template>
        <li
          class="image-editor-tool-kit__context-menu-item"
          @click="pasteClick"
        >
          {{ $t('image-editor-toolkit.paste-lbl') }}
        </li>
      </ul>
    </context-menu>
  </aside>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, computed, provide, watch } from 'vue'

import { ContextMenu } from '@/common'

import {
  EditorInstanceKey,
  type DefaultObjectParams,
  DefaultParamsKey,
} from '@/types'
import {
  ToolsSwitcher,
  LayeringTool,
  TextTool,
  ColorTool,
  ShapesTool,
  DrawingTool,
  HistoryTool,
  ZoomTool,
} from '@/components'
import { safeInject } from '@/helpers'
import { CheckboxField } from '@/fields'
import { TOOL_MODS } from '@/enums'

const defaultParams = ref<DefaultObjectParams>({
  fill: '#000000',
  background: '#77f',
  strokeColor: '#000000',
  strokeWidth: 0,
})

provide(DefaultParamsKey, {
  params: defaultParams,
})
const isGuidelinesDisabled = ref(false)
const currentMode = ref<TOOL_MODS>(TOOL_MODS.text)

const tool = computed(() => {
  switch (currentMode.value) {
    case TOOL_MODS.shapes:
      return ShapesTool
    case TOOL_MODS.drawing:
      return DrawingTool
    case TOOL_MODS.text:
    default:
      return TextTool
  }
})

const disabledColorTools = computed(() => {
  switch (currentMode.value) {
    case TOOL_MODS.shapes:
      return ['background']
    case TOOL_MODS.drawing:
    case TOOL_MODS.text:
    default:
      return []
  }
})

const {
  instance: {
    unmountCleanUp,
    contextMenuState,
    bringToFront,
    sendToBack,
    copyObjectToClipboard,
    pasteObjectFromClipboard,
    setGuildelinesState,
  },
} = safeInject(EditorInstanceKey)

const bringToFrontClick = () => {
  bringToFront()
  contextMenuState.value.isShown = false
}

const sendToBackClick = () => {
  sendToBack()
  contextMenuState.value.isShown = false
}

const copyClick = () => {
  copyObjectToClipboard()
  contextMenuState.value.isShown = false
}

const pasteClick = () => {
  pasteObjectFromClipboard()
  contextMenuState.value.isShown = false
}

onBeforeUnmount(() => {
  if (!unmountCleanUp.value) return

  unmountCleanUp.value()
})

watch(isGuidelinesDisabled, () => {
  setGuildelinesState(isGuidelinesDisabled.value)
})
</script>
<style scoped lang="scss">
.image-editor-tool-kit {
  display: flex;
  flex-direction: column;
  gap: toRem(15);
  padding: toRem(20);
  background-color: var(--tertiary-main);
  border-radius: toRem(8);
}

.image-editor-tool-kit__divider {
  background-color: var(--border-primary-main);
  height: toRem(1);
  width: 100%;
  border: none;
}

.image-editor-tool-kit__history {
  margin-top: auto;
}

.tool-switch-enter-active,
.tool-switch-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.tool-switch-enter-from,
.tool-switch-leave-to {
  opacity: 0;
}

.image-editor-tool-kit__context-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: toRem(8);
}

.image-editor-tool-kit__context-menu-item {
  transition: 0.2s ease-in-out;
  transition-property: background-color;
  background-color: var(--background-primary);
  color: var(--text-primary-main);
  padding: toRem(10) toRem(15);
  font-weight: 400;
  font-size: toRem(15);

  &:first-child:last-child {
    border-radius: toRem(8);
  }

  &:first-child {
    border-radius: toRem(8) toRem(8) 0 0;
  }

  &:last-child {
    border-radius: 0 0 toRem(8) toRem(8);
  }

  &:hover {
    cursor: pointer;
    background-color: var(--background-tertiary);
  }
}

.image-editor-tool-kit__label {
  @include tool-label;
}
</style>
