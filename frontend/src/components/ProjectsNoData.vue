<template>
  <div class="projects-no-data">
    <template v-if="scheme === 'default'">
      <h3>{{ $t('projects-no-data.title') }}</h3>
      <h4>{{ $t('projects-no-data.subtitle') }}</h4>
    </template>
    <template v-else>
      <h4 class="project-no-data__connect-msg">
        {{ $t('projects-no-data.not-connected-msg') }}
      </h4>
      <app-button
        class="project-no-data__connect-btn"
        :text="$t('projects-no-data.connect-btn')"
        :icon-right="$icons.metamask"
        @click="provider.connect"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { AppButton } from '@/common'

type SCHEME = 'not-connected' | 'default'

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

withDefaults(
  defineProps<{
    scheme: SCHEME
  }>(),
  {
    scheme: 'default',
  },
)
</script>

<style lang="scss" scoped>
.projects-no-data {
  padding: toRem(60) toRem(20);
  padding-bottom: 0;
  text-align: center;
  display: flex;
  margin-bottom: toRem(200);
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: toRem(10);
}

.project-no-data__connect-btn {
  text-transform: uppercase;
  margin-top: toRem(20);
  background-color: var(--primary-light);
}

.project-no-data__connect-msg {
  font-weight: 500;
}
</style>
