<template>
  <footer class="app-footer">
    <section class="app-footer__links">
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
    </section>

    <app-background />
  </footer>
</template>

<script setup lang="ts">
import { AppButton } from '@/common'
import { AppBackground } from '@/components'
import { config } from '@/config'
</script>

<style lang="scss" scoped>
.app-footer {
  width: 100%;
}

.app-footer__link {
  --app-button-text-hover: var(--text-secondary-light);
}

.app-footer__links {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  padding: toRem(20);
  gap: toRem(30);
  z-index: 1;
}
</style>
