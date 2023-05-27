<template>
  <router-link
    :class="`app-logo app-logo--${scheme} app-logo--${size}`"
    :to="{ name: $routes.main }"
    @click="hideSidebar"
  >
    <img class="app-logo__icon" src="/branding/logo.png" />
  </router-link>
</template>

<script lang="ts" setup>
type SCHEMES = 'dark' | 'light'
type SIZE = 'medium' | 'large'

withDefaults(
  defineProps<{
    scheme?: SCHEMES
    size?: SIZE
  }>(),
  {
    scheme: 'dark',
    size: 'medium',
  },
)

const emit = defineEmits<{
  (event: 'hideSidebar'): void
}>()

const hideSidebar = () => {
  emit('hideSidebar')
}
</script>

<style lang="scss" scoped>
.app-logo {
  display: flex;
  align-items: center;
  color: var(--text-primary-main);
  transition: scale 0.1s ease-in-out;

  &--light {
    color: var(--text-primary-invert-main);
  }

  &:hover {
    scale: 1.03;
  }
}

.app-logo__icon {
  --size: #{toRem(150)};

  .app-logo--large & {
    --size: #{toRem(200)};
  }

  max-width: var(--size);
  max-height: var(--size);
}
</style>
