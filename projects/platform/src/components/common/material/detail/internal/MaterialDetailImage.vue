<template lang="pug">
div(class="flex flex-col gap-y-3")
  div(class="w-125 h-125 relative")
    img(
      class="w-full h-full overflow-hidden rounded object-cover"
      :class="{ 'border border-grey-250': !displayImageList[currentDisplayIndex].displayUrl }"
      :src="displayImageList[currentDisplayIndex].displayUrl || undefined"
      :key="currentDisplayIndex"
      v-default-img
    )
    button(
      v-if="!!displayImageList[currentDisplayIndex].displayUrl"
      class="absolute w-10 h-10 rounded-md bg-grey-100/40 bottom-5 left-5 flex items-center justify-center cursor-pointer"
      @click="openModalFileViewer"
    )
      f-svg-icon(iconName="search" size="32" class="text-grey-900")
    button(
      v-if="canEdit"
      class="absolute w-10 h-10 rounded-md bg-grey-100/40 bottom-5 left-20 flex items-center justify-center cursor-pointer"
      @click="openModalEditSideImage"
    )
      f-svg-icon(iconName="create" size="32" class="text-grey-900")
  slider(heightLinerBg="h-19.5" :scrollPerItem="5")
    div(class="grid grid-flow-col gap-x-2 justify-start")
      template(
        v-for="(image, index) in displayImageList"
        :key="image.thumbnailUrl"
      )
        div(class="w-18 flex flex-col items-center gap-y-0.5")
          div(
            class="w-18 h-18 rounded box-border overflow-hidden border-grey-250 bg-grey-100"
            :class="[currentDisplayIndex === index ? 'border-4 border-primary-400' : 'border']"
            @click="currentDisplayIndex = index"
          )
            img(
              v-if="!!image.thumbnailUrl"
              :src="image.thumbnailUrl"
              class="w-full h-full"
              v-default-img
            )
            div(v-else class="w-full h-full flex items-center justify-center")
              p(class="text-caption/1.3 text-grey-250") {{ $t('RR0103') }}
          span(class="text-caption/1.6 text-grey-900 line-clamp-1") {{ image.imgName }}
          span(v-if="image.caption !== null" class="text-caption/1.6 text-grey-900") ({{ image.caption }})
</template>

<script setup lang="ts">
import Slider from '@/components/common/Slider.vue'
import { ref } from 'vue'

withDefaults(
  defineProps<{
    displayImageList: Array<{
      displayUrl: string | null
      thumbnailUrl: string | null
      imgName: string
      caption: string | null
    }>
    canEdit?: boolean
  }>(),
  {
    canEdit: false,
  }
)

const currentDisplayIndex = ref(0)

const openModalFileViewer = () => {}
const openModalEditSideImage = () => {}
</script>
