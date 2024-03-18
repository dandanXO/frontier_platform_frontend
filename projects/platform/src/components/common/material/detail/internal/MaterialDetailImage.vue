<template lang="pug">
div(class="flex flex-col gap-y-3")
  div(class="w-125 h-125 relative")
    file-display(
      class="w-full h-full"
      :displayUrl="publicFileList[currentDisplayIndex].displayUrl"
      :originalUrl="publicFileList[currentDisplayIndex].originalUrl"
      :extension="publicFileList[currentDisplayIndex].extension"
    )
    button(
      class="absolute w-10 h-10 rounded-md bg-grey-100/40 bottom-5 left-5 flex items-center justify-center cursor-pointer"
      @click="openViewMode"
    )
      f-svg-icon(iconName="search" size="32" class="text-grey-900")
    button(
      v-if="canEdit"
      class="absolute w-10 h-10 rounded-md bg-grey-100/40 bottom-5 left-20 flex items-center justify-center cursor-pointer"
      @click="emits('editScannedImage')"
    )
      f-svg-icon(iconName="reset_image" size="32" class="text-grey-900")
    button(
      v-if="canEdit"
      class="absolute w-10 h-10 rounded-md bg-grey-100/40 bottom-5 left-35 flex items-center justify-center cursor-pointer"
      @click="emits('editMultimedia')"
    )
      f-svg-icon(iconName="upload_multimedia" size="32" class="text-grey-900")
  slider(heightLinerBg="h-19.5" :scrollPerItem="5")
    div(class="grid grid-flow-col gap-x-2 justify-start")
      div(
        v-for="(image, index) in publicFileList"
        :key="image.displayNameShort"
        class="w-18 flex flex-col items-center gap-y-0.5"
      )
        file-thumbnail(
          class="w-18 h-18 hover:border-2 hover:border-primary-300"
          :thumbnailUrl="image.thumbnailUrl"
          :originalUrl="image.originalUrl"
          :extension="image.extension"
          :class="{ 'border-2 border-primary-300': currentDisplayIndex === index }"
          @click="currentDisplayIndex = index"
        )
        span(class="text-caption/1.6 text-grey-900 line-clamp-1") {{ image.displayNameShort }}
        span(v-if="image.caption !== null" class="text-caption/1.6 text-grey-900") ({{ image.caption }})
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import Slider from '@/components/common/Slider.vue'
import type { THEME } from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'
import type { MaterialFile } from '@/types'
import FileThumbnail from '@/components/common/material/file/FileThumbnail.vue'
import FileDisplay from '@/components/common/material/file/FileDisplay.vue'

const props = withDefaults(
  defineProps<{
    publicFileList: Array<MaterialFile>
    currentSideType: number
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

const store = useStore()

const currentDisplayIndex = ref(0)

const openViewMode = () => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: currentDisplayIndex.value,
        fileList: computed(() => props.publicFileList),
        getMenuTree: props.getMenuTree,
      },
    },
  })
}

watch(
  () => props.currentSideType,
  (currentSideIndex) => {
    currentDisplayIndex.value = currentSideIndex
  }
)
</script>
