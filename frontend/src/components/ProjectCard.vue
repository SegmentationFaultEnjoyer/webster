<template>
  <div
    class="project-card"
    @click="
      $router.push({
        name: $routes.project,
        params: {
          id: project.id,
        },
      })
    "
  >
    <div class="project-card__image-wrapper">
      <img
        class="project-card__image"
        :src="
          !isEmpty(project.content)
            ? project.content.backgroundImage.src
            : $config.DEFAULT_IMAGE
        "
      />
    </div>

    <div class="project-card__info">
      <p class="project-card__title">
        {{ project.title }}
      </p>
      <p class="project-card__created-at">
        {{ $d(project.created_at) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProjectInfo } from '@/types'
import { isEmpty } from 'lodash-es'

defineProps<{
  project: ProjectInfo
}>()
</script>

<style lang="scss" scoped>
.project-card {
  background-color: rgba(var(--primary-main-rgb), 0.2);
  border-radius: toRem(8);
  padding: toRem(15);
  max-height: toRem(300);
  width: toRem(250);
  border: toRem(1) solid var(--secondary-light);
  transition: scale 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: toRem(12);

  &:hover {
    scale: 1.02;
    cursor: pointer;
  }
}

.project-card__image-wrapper {
  display: flex;
  overflow: hidden;
  width: 100%;
}

.project-card__image {
  width: 100%;
  max-height: toRem(220);
  border-radius: toRem(8);
  object-fit: cover;
  object-position: top center;
}

.project-card__title {
  font-weight: 600;
  font-size: toRem(22);

  @include text-ellipsis;
}

.project-card__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: toRem(5);
  gap: toRem(10);
}
</style>
