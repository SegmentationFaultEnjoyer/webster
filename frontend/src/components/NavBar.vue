<template>
  <nav class="nav-bar">
    <app-logo class="nav-bar__logo" />
    <div class="nav-bar__hamburger" @click="onMenuClick">
      <animation
        ref="menuRef"
        :animation-data="HamburgerMenu"
        :auto-play="false"
        :loop="false"
        :speed="1.4"
      />
    </div>
    <nav-bar-mobile v-model:is-shown="isMenuOpen" />
    <section class="nav-bar__links">
      <router-link class="nav-bar__links-item" :to="{ name: $routes.main }">
        {{ $t('nav-bar.marketplace-link') }}
      </router-link>
      <router-link class="nav-bar__links-item" :to="{ name: $routes.projects }">
        {{ $t('nav-bar.my-projects-link') }}
      </router-link>
      <router-link class="nav-bar__links-item" :to="{ name: $routes.nfts }">
        {{ $t('nav-bar.my-nfts-link') }}
      </router-link>
    </section>

    <app-button
      v-if="!provider.selectedAddress"
      class="nav-bar__connect-btn"
      scheme="flat"
      size="small"
      :icon-left="$icons.metamask"
      :text="$t('nav-bar.connect-btn')"
      @click="connect"
    />
    <account-info v-else />
  </nav>
</template>

<script setup lang="ts">
import HamburgerMenu from '@/assets/animations/hamburger-menu.json'

import { computed, ref, watch } from 'vue'
import { AppButton, AppLogo, Animation } from '@/common'
import { AccountInfo, NavBarMobile } from '@/components'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler } from '@/helpers'
import { ProviderUserRejectedRequest } from '@/errors/runtime.errors'
import { RouterLink } from 'vue-router'
import { LottieController } from '@/common/Animation.vue'

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

const menuRef = ref<{ controller: LottieController }>()
const isMenuOpen = ref(false)

const onMenuClick = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const connect = async () => {
  if (!provider.value) return

  try {
    provider.value.connect()
  } catch (error) {
    if (error instanceof ProviderUserRejectedRequest) {
      ErrorHandler.processWithoutFeedback(error)
      return
    }

    ErrorHandler.process(error)
  }
}

watch(isMenuOpen, () => {
  if (!menuRef.value) return

  const { controller } = menuRef.value

  if (isMenuOpen.value) {
    controller.playSegments([0, 45], true)
    return
  }

  controller.playSegments([45, 97], true)
})
</script>

<style lang="scss" scoped>
.nav-bar {
  background-color: var(--tertiary-main);
  padding: toRem(10) toRem(20);
  display: flex;
  justify-content: space-between;
  height: toRem(80);
  position: relative;
  z-index: 2;
}

.nav-bar__links {
  display: flex;
  justify-content: space-between;
  gap: toRem(40);

  @include respond-to(tablet) {
    display: none;
  }
}

.nav-bar__connect-btn {
  text-transform: uppercase;

  &:disabled {
    opacity: 1;
  }

  &:deep(.app-button__icon-left) {
    width: toRem(30);
    height: toRem(30);
  }
}

.nav-bar__links-item {
  text-transform: uppercase;
  transition: 0.2s ease-in-out;
  transition-property: color;
  color: var(--text-primary-main);
  display: grid;
  place-content: center;
  position: relative;

  &:hover {
    color: var(--text-secondary-light);
  }

  &.router-link-active {
    &::after {
      content: '';
      position: absolute;
      top: toRem(45);
      width: 100%;
      height: toRem(2);
      background-color: var(--primary-light);
    }
  }
}

.nav-bar__logo {
  @include respond-to(tablet) {
    display: none;
  }
}

.nav-bar__hamburger {
  display: none;
  width: toRem(50);
  overflow: hidden;

  @include respond-to(tablet) {
    display: grid;
    place-content: center;
  }
}
</style>
