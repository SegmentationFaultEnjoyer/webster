<template>
  <div
    class="file-field"
    :class="{ 'file-field--hoverable': !modelValue }"
    @click="fieldRef?.click()"
  >
    <template v-if="!modelValue">
      <input
        ref="fieldRef"
        type="file"
        hidden
        accept="image/*"
        @change="handleFileChange"
      />
      <icon class="file-field__icon" :name="$icons.upload" />
      <section class="file-fields__labels">
        <p v-if="label" :for="`file-field--${uid}`" class="file-field__label">
          {{ label }}
        </p>
        <p v-if="sublabel" class="file-field__sublabel">
          {{ sublabel }}
        </p>
      </section>
    </template>
    <template v-else>
      <app-button
        class="file-field__clear-btn"
        scheme="default"
        :icon-left="$icons.x"
        @click="clearInput"
      />
      <section class="file-fields__labels">
        <p class="file-field__label">
          {{ modelValue.name }}
        </p>
        <p class="file-field__sublabel">
          {{ formatFileSize(modelValue.size) }}
        </p>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon, AppButton } from '@/common'
import uuid from 'uuidv4'
import { Bus, formatFileSize } from '@/helpers'

export type FileFieldChangeEvent = Event & {
  target: HTMLInputElement
}

// const defaultMimeTypes =
// ['image/jpg', 'image/png', 'image/jpeg', 'image/webp']

// const defaultMaxSize = 5242880 // bytes  5 mb

const props = withDefaults(
  defineProps<{
    modelValue?: File
    label?: string
    sublabel?: string
    mimeTypes?: Array<string>
    maxSize?: number
  }>(),
  {
    mimeTypes: () => ['image/jpg', 'image/png', 'image/jpeg', 'image/webp'],
    maxSize: 5242880,
    label: '',
    sublabel: '',
    modelValue: undefined,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', payload?: File): void
}>()

const fieldRef = ref<HTMLInputElement | null>(null)

const uid = uuid()

const handleFileChange = (event: FileFieldChangeEvent) => {
  if (!event?.target.files || event.target.files.length < 1) return

  const selectedFile = event.target.files[0]

  // MIME TYPE validation
  if (!props.mimeTypes.includes(selectedFile.type)) {
    Bus.warning(`File type "${selectedFile.type}" is not supported.`)
    return
  }

  // SIZE Validation
  if (selectedFile.size > props.maxSize) {
    Bus.warning(`File size exceeds ${formatFileSize(props.maxSize)}.`)
    return
  }

  emit('update:modelValue', selectedFile)
}

const clearInput = () => {
  setTimeout(() => {
    emit('update:modelValue', undefined)
  }, 100)
}
</script>

<style lang="scss" scoped>
.file-field {
  border: toRem(1) dashed var(--secondary-main);
  padding: toRem(20);
  border-radius: toRem(8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(10);
  transition: background-color 0.2s ease-in-out;
  position: relative;

  &--hoverable {
    &:hover {
      cursor: pointer;
      background-color: rgba(var(--secondary-light-rgb), 0.3);
    }
  }
}

.file-field__icon {
  --size: #{toRem(40)};

  max-width: var(--size);
  max-height: var(--size);
}

.file-fields__labels {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-field__label {
  font-weight: 500;
  font-size: toRem(18);
  text-align: center;
}

.file-field__sublabel {
  font-weight: 300;
  font-size: toRem(14);
}

.file-field__clear-btn {
  position: absolute;
  top: toRem(-5);
  right: toRem(-5);
  transition: 0.2s ease-in-out;
  transition-property: transform;

  &:hover {
    transform: rotate(90deg);
  }
}
</style>
