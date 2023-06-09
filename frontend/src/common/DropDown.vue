<template>
  <div
    ref="rootEl"
    class="'drop-down"
    :classes="{ 'drop-down--disabled': isDisabled }"
    :style="cssVars"
  >
    <slot name="head" :menu="exposedMenuObject" />
    <transition
      name="drop-down"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <div class="drop-down__body" v-show="isOpen">
        <slot :menu="exposedMenuObject" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { ref, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    right?: number
  }>(),
  {
    right: -10,
  },
)

const attrs = useAttrs()

const rootEl = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const exposedMenuObject = {
  isOpen,
  toggle: () => {
    isOpen.value = !isOpen.value
  },
  open: () => {
    isOpen.value = true
  },
  close: () => {
    isOpen.value = false
  },
}

const cssVars = computed(() => ({
  '--dropdown-right': `${props.right}px`,
}))

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--dropdown-body-height',
    `${element.scrollHeight}px`,
  )
}

onMounted(() => {
  if (rootEl.value) {
    onClickOutside(rootEl, () => {
      isOpen.value = false
    })
  }
})
</script>

<style lang="scss" scoped>
.drop-down {
  z-index: var(--drop-down-index);

  &--disabled {
    opacity: 0.7;
    pointer-events: none;
  }
}

.drop-down__body {
  position: absolute;
  top: toRem(80);
  right: var(--dropdown-right);
  border-radius: toRem(8);
  width: fit-content;
  box-shadow: 0 toRem(4) toRem(11) rgba(var(--drop-down-shadow-rgb), 0.25);
  overflow: hidden;
}

.drop-down-enter-active {
  animation: appear-animation 0.3s ease-in-out;
}

.drop-down-leave-active {
  animation: appear-animation 0.3s ease-in-out reverse;
}

@keyframes appear-animation {
  0% {
    opacity: 0;
    height: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    height: var(--dropdown-body-height);
  }
}
</style>
