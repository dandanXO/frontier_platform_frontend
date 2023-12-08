<template lang="pug">
div(
  class="shrink-0 w-full h-27.5 bg-grey-900 px-3 md:px-10 flex items-center justify-between border-b border-grey-700"
)
  div(class="flex items-center gap-x-1 md:gap-x-4")
    f-svg-icon(iconName="zoom_in" size="24" class="text-grey-50")
    p(class="text-grey-50 text-caption md:text-body1 font-bold") {{ $t('EE0132') }}
  div(class="grid grid-flow-col gap-x-2")
    template(v-for="(file, index) in fileList" :key="`file-${index}`")
      div(
        class="w-15 md:w-19.5 h-15 md:h-19.5 rounded overflow-hidden bg-grey-100 cursor-pointer"
        :class="[currentIndex === index ? 'border-4 border-primary-400' : 'border border-grey-700']"
        @click="emits('changeIndex', index)"
      )
        f-svg-icon(
          iconName="open_in_full"
          size="20"
          class="group-hover:visible invisible z-2 absolute top-2 left-2 text-grey-0 cursor-pointer"
        )
        img(
          v-if="[PNG, JPEG, JPG, PDF].includes(file.extension)"
          :src="file.thumbnailUrl"
          class="w-full h-full object-contain"
        )
        div(
          v-else-if="[GIF, MOV, MP4].includes(file.extension)"
          class="relative flex justify-center items-center w-full h-full"
        )
          video(class="w-full h-full object-contain")
            source(:src="file.originalUrl" type="video/mp4")
          div(
            class="absolute w-16 h-16 rounded-full bg-grey-900/70 flex justify-center items-center"
          )
            f-svg-icon(iconName="play_arrow" size="40" class="text-grey-0")
        div(
          v-else-if="file.extension === ZIP"
          class="flex justify-center items-center w-full h-full bg-grey-250"
        )
          f-svg-icon(iconName="file_zip" size="40" class="text-grey-0")
        f-svg-icon(v-else iconName="file" size="50" class="text-grey-0")
  f-button(size="md" @click="emits('close')") Exit
</template>

<script setup lang="ts">
import type { MaterialViewModeFile } from '@/types'
import { EXTENSION } from '@frontier/constants'

const { PNG, JPEG, JPG, GIF, MOV, MP4, ZIP, PDF } = EXTENSION

defineProps<{
  currentIndex: number
  fileList: MaterialViewModeFile[]
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'changeIndex', index: number): void
}>()
</script>

<style scoped></style>
