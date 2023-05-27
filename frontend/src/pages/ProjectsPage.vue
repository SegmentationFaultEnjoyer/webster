<template>
  <div class="projects-page">
    <header v-if="provider.isConnected" class="projects-page__header">
      <h4 class="projects-page__header-title">
        {{ $t('projects-page.title') }}
      </h4>
      <app-button
        class="projects-page__create-btn"
        size="small"
        :text="$t('projects-page.create-btn')"
        :icon-right="$icons.plus"
        @click="isModalShown = true"
      />
    </header>

    <section
      v-if="!isLoading && projectsList.length && provider.isConnected"
      class="projects-page__projects"
    >
      <project-card
        v-for="project in projectsList"
        :key="project.id"
        :project="project"
      />
    </section>

    <template v-if="!isLoading">
      <error-message
        v-if="isLoadFailed"
        :message="$t('projects-page.error-msg')"
      />
      <projects-no-data
        v-else-if="!projectsList.length || !provider.selectedAddress"
        :scheme="noDataScheme"
      />
      <app-button
        v-if="isLoadMoreBtnShown && projectsList.length"
        class="projects-page__load-more-btn"
        scheme="flat"
        size="small"
        :text="$t('projects-page.load-more-btn')"
        @click="loadNextPage"
      />
    </template>

    <div v-if="isLoading" class="projects-page__loader">
      <loader scheme="liquid" />
    </div>

    <modal v-model:is-shown="isModalShown">
      <template #default="{ modal }">
        <project-form @close="modal.close" @page-reload="loadFirstPage" />
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Loader, ErrorMessage, AppButton, Modal } from '@/common'
import { ProjectsNoData, ProjectCard } from '@/components'
import { useWeb3ProvidersStore } from '@/store'
import { useProjects, usePaginate } from '@/composables'
import { ProjectForm } from '@/forms'
import { ProjectInfo } from '@/types'
import { ErrorHandler } from '@/helpers'

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

const { getProjectsList } = useProjects()

const isLoadFailed = ref(false)
const isModalShown = ref(false)
const projectsList = ref<ProjectInfo[]>([])

const noDataScheme = computed(() =>
  provider.value.isConnected ? 'default' : 'is-not-connected',
)

const loadList = computed(
  () => () => getProjectsList({ owner: provider.value.selectedAddress }),
)

const setList = (chunk: ProjectInfo[]) => {
  projectsList.value = chunk ?? []
}

const concatList = (chunk: ProjectInfo[]) => {
  projectsList.value = projectsList.value.concat(chunk ?? [])
}

const onError = (e: Error) => {
  isLoadFailed.value = true
  ErrorHandler.processWithoutFeedback(e)
}

const { loadNextPage, loadFirstPage, isLoading, isLoadMoreBtnShown } =
  usePaginate(loadList, setList, concatList, onError, {
    debounceLoaderTime: 1200,
    isLoadOnMounted: provider.value.isConnected,
  })
</script>

<style lang="scss" scoped>
.projects-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: toRem(20);
  flex: 1;

  @include respond-to(small) {
    padding: toRem(20) 0;
  }
}

.projects-page__loader {
  display: grid;
}

.projects-page__create-btn {
  text-transform: uppercase;
}

.projects-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60%;
  margin-top: toRem(20);

  @include respond-to(small) {
    flex-direction: column-reverse;
    gap: toRem(50);
  }
}

.projects-page__header-title {
  font-size: toRem(30);
}

.projects-page__load-more-btn {
  text-transform: uppercase;

  --app-button-flat-text-hover: var(--primary-light);
  --app-button-flat-border-hover: #{toRem(2)} solid var(--primary-light);
}

.projects-page__projects {
  display: flex;
  flex-flow: row wrap;
  gap: toRem(20);
  padding: toRem(40) 0;
  width: 60%;

  @include respond-to(small) {
    width: 100%;
    justify-content: center;
  }
}
</style>
