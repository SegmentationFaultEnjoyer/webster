<template>
  <header class="project-item-header">
    <h3>{{ project.title }}</h3>
    <section class="project-item-header__actions">
      <app-button
        class="project-item-header__button"
        scheme="flat"
        size="small"
        :disabled="isFormDisabled"
        :icon-right="$icons.pencil"
        @click="isEditing = true"
      />
      <app-button
        class="project-item-header__button project-item-header__button--red"
        scheme="flat"
        size="small"
        :disabled="isFormDisabled"
        :icon-right="$icons.trash"
        @click="isDeleting = true"
      />
    </section>
    <confirmation-modal
      v-model:is-shown="isDeleting"
      :entity="$t('project-item-page.project-entity')"
      :is-deleting="isFormDisabled"
      @confirm="_deleteProject"
    />
    <modal v-model:is-shown="isEditing">
      <template #default="{ modal }">
        <project-form
          :project="project"
          @close="modal.close"
          @page-reload="emit('page-reload')"
        />
      </template>
    </modal>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppButton, ConfirmationModal, Modal } from '@/common'
import { ProjectForm } from '@/forms'
import { useProjects, useForm } from '@/composables'
import { ProjectInfo } from '@/types'
import { ROUTE_NAMES } from '@/enums'
import { Bus, ErrorHandler } from '@/helpers'
import { router } from '@/router'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  project: ProjectInfo
}>()

const emit = defineEmits<{
  (event: 'page-reload'): void
}>()

const { t } = useI18n()

const { deleteProject } = useProjects()
const { isFormDisabled, disableForm, enableForm } = useForm()

const isDeleting = ref(false)
const isEditing = ref(false)

const _deleteProject = async () => {
  disableForm()
  try {
    await deleteProject(props.project.id)
    Bus.success(t('project-item-page.success-delete'))
    router.push({ name: ROUTE_NAMES.projects })
  } catch (error) {
    ErrorHandler.process(error)
  }
  isDeleting.value = false
  enableForm()
}
</script>

<style lang="scss" scoped>
.project-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60%;

  @include respond-to(tablet) {
    width: 90%;
  }
}

.project-item-header__actions {
  display: flex;
  justify-content: center;
  gap: toRem(12);
}

.project-item-header__button {
  --app-button-flat-text-hover: var(--info-dark);
  --app-button-flat-border-hover: #{toRem(2)} solid var(--info-dark);

  &--red {
    --app-button-flat-text-hover: var(--error-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--error-main);
  }
}
</style>
