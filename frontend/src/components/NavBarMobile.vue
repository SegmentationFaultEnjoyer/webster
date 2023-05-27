<template>
  <aside class="nav-bar-mobile" :class="{ 'nav-bar-mobile--open': isShown }">
    <router-link class="nav-bar-mobile__link" :to="{ name: $routes.main }">
      {{ $t('nav-bar.marketplace-link') }}
    </router-link>
    <router-link class="nav-bar-mobile__link" :to="{ name: $routes.projects }">
      {{ $t('nav-bar.my-projects-link') }}
    </router-link>
    <router-link class="nav-bar-mobile__link" :to="{ name: $routes.nfts }">
      {{ $t('nav-bar.my-nfts-link') }}
    </router-link>
    <app-logo class="nav-bar-mobile__logo" size="large" />
    <footer class="nav-bar-mobile__footer">
      <app-button
        class="app-footer__link"
        scheme="default"
        :href="config.GITHUB_LINK"
        :text="$t('app-footer.github-link')"
      />
      <app-button
        class="app-footer__link"
        scheme="default"
        :href="config.TELEGRAM_LINK"
        :text="$t('app-footer.telegram-link')"
      />
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { AppButton, AppLogo } from '@/common'
import { RouterLink } from 'vue-router'
import { router } from '@/router'
import { config } from '@/config'

defineProps<{
  isShown: boolean
}>()

const emit = defineEmits<{
  (event: 'update:is-shown', payload: boolean): void
}>()

router.afterEach(() => {
  emit('update:is-shown', false)
})
</script>

<style lang="scss" scoped>
.nav-bar-mobile {
  --top-offset: #{toRem(0)};

  display: none;
  transform: translateX(-100%);
  transition: transform 0.5s ease-in-out;
  height: calc(100dvh - var(--top-offset));
  width: 100vw;
  position: fixed;
  top: var(--top-offset);
  left: 0;
  z-index: -1;
  padding: toRem(50) toRem(20);
  padding-top: toRem(200);
  background-color: var(--tertiary-main);

  &--open {
    transform: translateX(0);
  }

  @include respond-to(tablet) {
    display: flex;
    flex-direction: column;
    gap: toRem(25);
    align-items: center;
  }
}

.nav-bar-mobile__link {
  text-transform: uppercase;
  transition: 0.2s ease-in-out;
  transition-property: color;
  color: var(--text-primary-main);
  display: grid;
  place-content: center;
  font-size: toRem(22);

  &:hover {
    color: var(--text-secondary-light);
  }

  &.router-link-active {
    color: var(--info-main);
  }
}

.nav-bar-mobile__footer {
  margin-top: auto;
  display: flex;
  justify-content: center;
  gap: toRem(20);
  flex-flow: row wrap;
}

.nav-bar-mobile__logo {
  margin-top: toRem(100);
}
</style>
