<template>
  <label
    class="checkbox-field"
    :class="{
      'checkbox-field--disabled': disabled,
      'checkbox-field--checked': modelValue,
    }"
  >
    <input
      v-bind="$attrs"
      class="checkbox-field__input"
      type="checkbox"
      :checked="modelValue"
      :name="$attrs.name || label"
      :value="value"
      :disabled="disabled"
      @change="onChange"
    />

    <span class="checkbox-field__frame-wrp" aria-hidden="true">
      <span
        class="checkbox-field__frame"
        :class="{ 'checkbox-field__frame--checked': modelValue }"
      >
        <icon
          v-if="modelValue"
          class="checkbox-field__frame-icon"
          :name="$icons.check"
        />
      </span>
    </span>

    <span class="checkbox-field__label">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { Icon } from '@/common'

const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void
}>()

withDefaults(
  defineProps<{
    modelValue?: boolean
    value?: string | number
    label?: string
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    value: '',
    label: '',
    disabled: false,
  },
)

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  emit('update:modelValue', target.checked)
}
</script>

<style lang="scss" scoped>
.checkbox-field {
  cursor: pointer;
  display: grid;
  align-items: start;
  grid-template-columns: toRem(18) 1fr;
  grid-gap: toRem(12);

  &--disabled {
    cursor: not-allowed;
    filter: grayscale(50);
    opacity: 0.5;
  }
}

.checkbox-field__input {
  position: absolute;
  width: toRem(1);
  height: toRem(1);
  margin: calc(#{toRem(1)} * -1);
  border: 0;
  padding: 0;
  white-space: nowrap;
  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
}

.checkbox-field__frame-wrp {
  overflow: hidden;
  width: toRem(18);
  height: toRem(18);
  transition: var(--field-transition-duration) ease-in;
  transition-property: border-color, box-shadow, background-color;
  border-radius: toRem(3);
  box-shadow: inset 0 0 0 toRem(2) var(--field-border);
}

.checkbox-field__frame {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--field-bg);

  .checkbox-field--checked & {
    background-color: var(--secondary-dark);
  }
}

.checkbox-field__frame-icon {
  width: toRem(42);
  height: toRem(42);
}

.checkbox-field__label {
  display: inline-flex;
  user-select: none;

  @include field-text;
}
</style>
