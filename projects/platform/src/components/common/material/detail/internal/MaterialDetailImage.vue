<template lang="pug">
div(class="flex flex-col gap-y-4")
  div(class="w-125 h-125 relative")
    file-display(
      class="w-full h-full"
      :displayUrl="availableFileList[currentDisplayIndex]?.displayUrl"
      :originalUrl="availableFileList[currentDisplayIndex]?.originalUrl"
      :extension="availableFileList[currentDisplayIndex]?.extension"
    )
    div(class="absolute bottom-5 left-5 flex gap-x-5")
      button(
        v-if="!props.hideMagnifier"
        class="w-10 h-10 rounded-md bg-grey-100/40 flex items-center justify-center cursor-pointer"
        @click="openViewMode"
      )
        f-svg-icon(iconName="search" size="32" class="text-grey-900")
      button(
        v-if="isShowEdit"
        class="w-10 h-10 rounded-md bg-grey-100/40 flex items-center justify-center cursor-pointer"
        @click="emits('editScannedImage')"
      )
        f-svg-icon(iconName="reset_image" size="32" class="text-grey-900")
      button(
        v-if="isShowStar"
        class="w-10 h-10 rounded-md bg-grey-100/40 flex items-center justify-center cursor-pointer"
        @click="emits('updateCurrentCoverIndex', currentDisplayIndex)"
      )
        f-svg-icon(
          v-if="availableFileList[currentDisplayIndex].id === props.coverId"
          iconName="star_solid"
          size="32"
          class="text-primary-400"
        )
        f-svg-icon(
          v-else
          iconName="star"
          size="32"
          :class="[props.selectedId && props.selectedId === availableFileList[currentDisplayIndex].id ? 'text-primary-400' : 'text-grey-900']"
        )
  slider(
    :key="availableFileList.length"
    heightLinerBg="h-19.5"
    :scrollPerItem="5"
  )
    div(class="grid grid-flow-col gap-x-2 justify-start")
      div(
        v-for="(image, index) in availableFileList"
        :key="image.displayNameShort"
        class="w-18 flex flex-col items-center gap-y-0.5"
      )
        file-thumbnail(
          class="w-18 h-18 hover:border-2 hover:border-primary-300"
          :thumbnailUrl="currentCoverImageUrl(image, index)"
          :originalUrl="image.originalUrl"
          :extension="image.extension"
          :class="{ 'border-2 border-primary-300': currentDisplayIndex === index }"
          @click="clickSmallImage(index)"
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
import type { CoverId, MaterialFile } from '@/types'
import FileThumbnail from '@/components/common/material/file/FileThumbnail.vue'
import FileDisplay from '@/components/common/material/file/FileDisplay.vue'
import {
  ATTACHMENT_FILE_ACCEPT_TYPE,
  IMAGE_FILE_ACCEPT_TYPE,
} from '@/utils/constants'
import { useCurrentDisplayIndex } from '@/composables/material/useMaterialDetailImage'
const preDisplayIndex = ref(-1)
const props = withDefaults(
  defineProps<{
    availableFileList: Array<MaterialFile>
    currentCoverIndex: number
    currentSideType: number
    getMenuTree?: ((index: number | string, theme: THEME) => MenuTree) | null
    canEdit?: boolean
    canStar?: boolean
    selectedId?: number | null
    selectCover?: ((index: CoverId) => void) | null
    coverId?: CoverId | null
    hideMagnifier?: boolean
  }>(),
  {
    canEdit: false,
    canStar: false,
    selectedId: null,
    coverId: null,
    hideMagnifier: false,
  }
)

const currentCoverImageUrl = (image: MaterialFile, index: number) => {
  return index !== 0
    ? image.thumbnailUrl
    : props.availableFileList[props.currentCoverIndex ?? 0].thumbnailUrl
}

// 這裡的currentDisplayIndex地方 1:face, 2:middle 3:back
const { currentDisplayIndex, setCurrentDisplayIndex } = useCurrentDisplayIndex()
// reset to 0
setCurrentDisplayIndex(0)

preDisplayIndex.value = currentDisplayIndex.value
const clickSmallImage = (index: number) => {
  const isValidCoverIndex =
    index === 0 &&
    props.currentCoverIndex != null &&
    props.currentCoverIndex < props.availableFileList.length

  setCurrentDisplayIndex(isValidCoverIndex ? props.currentCoverIndex : index)
}

const emits = defineEmits<{
  (e: 'editMultimedia'): void
  (e: 'editScannedImage'): void
  (e: 'updateCurrentCoverIndex', index: number): void
}>()

const store = useStore()

const openViewMode = () => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: currentDisplayIndex.value,
        fileList: computed(() => props.availableFileList),
        getMenuTree: props.getMenuTree,
      },
    },
  })
}

const isShowStar = computed(
  () =>
    props.canStar &&
    IMAGE_FILE_ACCEPT_TYPE.includes(
      props.availableFileList[currentDisplayIndex.value].extension
    ) &&
    props.availableFileList[currentDisplayIndex.value].id !== 'faceSideRuler' &&
    props.availableFileList[currentDisplayIndex.value].id !== 'backSideRuler' &&
    props.availableFileList[currentDisplayIndex.value].id !== 'cover'
)

const isShowEdit = computed(
  () =>
    props.canEdit &&
    IMAGE_FILE_ACCEPT_TYPE.includes(
      props.availableFileList[currentDisplayIndex.value].extension
    ) &&
    (props.availableFileList[currentDisplayIndex.value].id === 'faceSide' ||
      props.availableFileList[currentDisplayIndex.value].id === 'backSide')
)

watch(
  // props.currentSideType 1:face, 2:middle 3:back
  () => props.currentSideType,
  (currentSideIndex) => {
    // 2是mimiddle 不會有圖片因此跳過
    if (currentSideIndex === 2) {
      return
    }
    currentDisplayIndex.value = currentSideIndex
  }
)
</script>
