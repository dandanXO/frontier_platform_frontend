<template lang="pug">
modal-view-mode(
  v-if="isFilePreviewOpen && openViewModeFileListIndex != null"
  :fileList="viewModeFileList"
  :startIndex="openViewModeFileListIndex"
  :getMenuTree="getMenuTree"
  @close="isFilePreviewOpen = false"
)
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
      @click="emits('editScannedImage')"
    )
      f-svg-icon(iconName="image_file" size="32" class="text-grey-900")
    button(
      v-if="canEdit"
      class="absolute w-10 h-10 rounded-md bg-grey-100/40 bottom-5 left-35 flex items-center justify-center cursor-pointer"
      @click="emits('editMultimedia')"
    )
      f-svg-icon(iconName="create" size="32" class="text-grey-900")
  slider(heightLinerBg="h-19.5" :scrollPerItem="5")
    div(class="grid grid-flow-col gap-x-2 justify-start")
      div(
        v-for="(image, index) in displayImageList"
        :key="image.imgName"
        class="w-18 flex flex-col items-center gap-y-0.5"
      )
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
import { computed, ref } from 'vue'
import Slider from '@/components/common/Slider.vue'
import ModalViewMode from '@/components/common/material/file/viewMode/ModalViewMode.vue'
import type { THEME } from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'
import type { MaterialDisplayImage, MaterialViewModeFile } from '@/types'

const props = withDefaults(
  defineProps<{
    displayImageList: Array<MaterialDisplayImage>
    viewModeFileList: Array<MaterialViewModeFile>
    getMenuTree?: ((index: number | string, theme: THEME) => MenuTree) | null
    canEdit?: boolean
  }>(),
  {
    canEdit: false,
  }
)

const emits = defineEmits<{
  (e: 'editMultimedia'): void
  (e: 'editScannedImage'): void
}>()

const currentDisplayIndex = ref(0)
const isFilePreviewOpen = ref(false)

const currentImage = computed(() => {
  return props.displayImageList[currentDisplayIndex.value]
})

const openViewModeFileListIndex = computed(() => {
  if (!currentImage.value) {
    return null
  }

  const targetIndex = props.viewModeFileList.findIndex(
    (f) => f.id === currentImage.value.id
  )
  if (targetIndex == -1) {
    return null
  }

  return targetIndex
})

const openModalFileViewer = () => {
  isFilePreviewOpen.value = true
}
</script>
