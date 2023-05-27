<template>
  <div class="project-item-page">
    <template v-if="!isLoading && projectInfo">
      <project-item-header :project="projectInfo" @page-reload="initPage" />
      <project-details ref="detailsInfo" :project="projectInfo" />

      <template v-if="isEditorShown">
        <image-editor
          ref="editorInstance"
          :image-url="detailsInfo?.imageUrl"
          :saved-state="
            !isEmpty(projectInfo.content) ? projectInfo.content : undefined
          "
        />
        <section class="project-item-page__actions">
          <app-button
            class="project-item-page__download-btn"
            :text="$t('project-item-page.download-image-btn')"
            :disabled="isFormDisabled"
            :icon-right="$icons.inboxIn"
            @click="download"
          />
          <app-button
            class="project-item-page__download-btn"
            :text="$t('project-item-page.save-image-btn')"
            :disabled="isFormDisabled"
            :icon-right="$icons.cloudDownload"
            @click="save"
          />
          <app-button
            class="project-item-page__download-btn"
            :text="$t('project-item-page.sell-btn')"
            :disabled="isFormDisabled"
            :icon-right="$icons.ethereum"
            @click="isSaleFormShown = true"
          />
        </section>
      </template>
    </template>
    <loader v-else scheme="liquid" />
    <modal v-if="projectInfo" v-model:is-shown="isSaleFormShown">
      <template #default="{ modal }">
        <put-offer-form
          :project="projectInfo"
          :get-image="convertToFormData"
          @close="modal.close"
        />
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted } from 'vue'
import { router } from '@/router'

import { ImageEditor } from '@/components'
import { Loader, AppButton, Modal } from '@/common'
import { PutOfferForm } from '@/forms'
import { useWeb3ProvidersStore } from '@/store'
import { useProjects, useForm } from '@/composables'
import { CanvasRepresentation, ProjectInfo, UseImageEditor } from '@/types'
import { ROUTE_NAMES } from '@/enums'
import { Bus, ErrorHandler } from '@/helpers'

import { ProjectItemHeader, ProjectDetails } from '@/pages/ProjectItem'

import uuidv4 from 'uuidv4'

const props = defineProps<{
  id: string
}>()

const { t } = useI18n()

const { getProject, updateProject, uploadProjectBackground } = useProjects()
const { isFormDisabled, disableForm, enableForm } = useForm()

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

const projectInfo = ref<ProjectInfo>()
const isLoading = ref(false)
const isSaleFormShown = ref(false)

const detailsInfo = ref<{
  imageUrl: string | undefined
  imageFile: File | undefined
  goWithDefault: boolean
}>()

const editorInstance = ref<{
  editorInstance: UseImageEditor | null
}>()

const isEditorShown = computed(
  () =>
    detailsInfo.value?.imageUrl ||
    detailsInfo.value?.goWithDefault ||
    !isEmpty(projectInfo.value?.content),
)

const download = () => {
  if (!editorInstance.value) return

  const { editorInstance: editor } = editorInstance.value

  if (!editor) return

  editor.download(uuidv4())
}

const updateBackgroundSrc = (canvasJson: string, src: string) => {
  const canvas: CanvasRepresentation = JSON.parse(canvasJson)

  canvas.backgroundImage.src = src

  return JSON.stringify(canvas)
}

const save = async () => {
  if (!editorInstance.value || !detailsInfo.value) return

  const { editorInstance: editor } = editorInstance.value

  if (!editor) return

  disableForm()
  try {
    let canvasState = editor.canvasToJson()

    if (isEmpty(projectInfo.value?.content) && detailsInfo.value.imageFile) {
      const url = await uploadProjectBackground(
        props.id,
        detailsInfo.value.imageFile,
      )

      canvasState = updateBackgroundSrc(canvasState, url)
    }

    await updateProject({
      id: props.id,
      content: canvasState,
    })
    Bus.success(t('project-item-page.success-save'))
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}

const convertToFormData = (name: string) => {
  if (!editorInstance.value) return null

  const { editorInstance: editor } = editorInstance.value

  if (!editor) return null

  return editor.canvasToFormData(name)
}

const initPage = async () => {
  isLoading.value = true
  try {
    const { data } = await getProject(props.id)

    if (!data) return

    // console.log(data.content.backgroundImage.src)

    if (data.owner !== provider.value.selectedAddress) {
      router.push({ name: ROUTE_NAMES.projects })
      return
    }

    projectInfo.value = data
  } catch (error) {
    ErrorHandler.process(error)
  }
  //   setTimeout(() => {
  //     isLoading.value = false
  //   }, 1200)
  isLoading.value = false
}

onMounted(initPage)
</script>

<style lang="scss" scoped>
.project-item-page {
  flex: 1;
  padding: toRem(40);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(40);

  @include respond-to(tablet) {
    padding: toRem(20);
  }
}

.project-item-page__download-btn {
  text-transform: uppercase;
  align-items: flex-start;
}

.project-item-page__actions {
  display: flex;
  justify-content: center;
  gap: toRem(20);

  @include respond-to(small) {
    flex-direction: column;
    width: 80%;

    & > * {
      width: 100%;
    }
  }
}
</style>
