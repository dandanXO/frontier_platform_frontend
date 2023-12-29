<template lang="pug">
modal-behavior(
  :header="$t('Upload multimedia')"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="handleSave"
  @click:secondary="closeModal"
)
  template(#note)
    div(class="flex flex-row items-center gap-x-1")
      f-svg-icon(class="text-grey-600" iconName="info_outline" size="14")
      span {{ $t('The image set as the cover will be copied in the first one. Move the images to adjust their order.') }}
  div(class="w-200 flex flex-col gap-y-6")
    p(class="text-body2 text-grey-900 font-bold") {{ $t('Preview your material image') }}
    div(class="grid grid-flow-col gap-x-2 justify-start")
      template(v-for="image in coverAndSideImageList" :key="image.id")
        div(class="w-25 flex flex-col items-center gap-y-0.5")
          div(
            class="relative w-25 h-25 rounded border box-border overflow-hidden border-grey-250 bg-grey-100"
            @click="handleCoverAndSideImageClick"
          )
            div(v-if="image.canSetCover" class="absolute right-0 bottom-0 z-1")
              f-svg-icon(
                :class="[image.isCover ? 'text-primary-400' : 'text-grey-400', 'cursor-pointer']"
                iconName="star"
                size="24"
                @click.stop="selectCover(image.id)"
              )
            file-thumbnail(
              class="w-25 h-25"
              :thumbnailUrl="image.thumbnailUrl"
              :originalUrl="null"
              :extension="image.extension"
            )
          span(class="text-caption/1.6 text-grey-900 line-clamp-1") {{ image.imgName }}
          span(v-if="image.caption !== null" class="text-caption/1.6 text-grey-900") ({{ image.caption }})
    div(class="w-full h-[1px] bg-grey-150")
    p(class="text-body2 text-grey-900 font-bold") {{ $t('Edit your multimedia') }}
    div(class="flex flex-col gap-y-5")
      div(class="flex flex-wrap gap-5")
        div(
          class="w-25 h-25 border-2 border-dashed rounded border-grey-200 flex items-center justify-center cursor-pointer"
          @click="openModalMultimediaSelect"
        )
          f-svg-icon(iconName="add" size="24" class="text-grey-200")
        draggable(
          v-if="multimediaList.length > 0"
          class="flex flex-wrap gap-5"
          v-model="multimediaListForDraggable"
          v-bind="fileCardDragOptions"
          group="multimedia"
          @change="handleMultimediaListChange"
        )
          template(#item="{ element: multimedia, index }")
            multimedia-card(
              :key="multimedia.fileId"
              :isCover="selectedCoverId != null ? selectedCoverId === multimedia.fileId : multimedia.isCover"
              :thumbnailUrl="multimedia.thumbnailUrl"
              :originalUrl="multimedia.originalUrl"
              :extension="multimedia.extension"
              :displayFileName="multimedia.displayFileName"
              :menuTree="getMultimediaMenuTree(multimedia.fileId)"
              @setCover="selectCover(multimedia.fileId)"
              @edit="startCropMultimedia(multimedia.fileId)"
              @click="openMultimediaViewMode(index)"
            )
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, toRaw } from 'vue'
import { useStore } from 'vuex'
import Draggable from 'vuedraggable'
import MultimediaCard from '@/components/common/material/multimedia/MultimediaCard.vue'
import useMaterial from '@/composables/material/useMaterial'
import { fileCardDragOptions } from '@/utils/constants'
import type { CoverId, MaterialMultimediaUpdateService } from '@/types'
import FileThumbnail from '@/components/common/material/file/FileThumbnail.vue'
import { CoverMode } from '@frontier/platform-web-sdk'

const props = defineProps<{
  multimediaUpdateService: MaterialMultimediaUpdateService
}>()

const store = useStore()

const multimediaUpdateService = toRaw(props.multimediaUpdateService)

const coverAndSideImageList = computed(() => {
  return multimediaUpdateService.coverAndSideImageList.value
})

const {
  material,
  selectedCoverId,
  multimediaList,
  openModalMultimediaSelect,
  getMultimediaMenuTree,
  saveCover,
  selectCover,
  updateMultimediaList,
  moveMultimedia,
  startCropMultimedia,
} = multimediaUpdateService

const multimediaListForDraggable = computed({
  get: () => multimediaList.value,
  set: updateMultimediaList,
})

const handleCoverAndSideImageClick = () => {
  // TODO
}

const handleMultimediaListChange = (e: any) => {
  const { element, newIndex } = e.moved
  moveMultimedia(element.fileId, newIndex)
}

const { publicFileList } = useMaterial(material)

const openMultimediaViewMode = (index: number) => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: index,
        fileList: publicFileList,
        getMenuTree: getMultimediaMenuTree,
      },
    },
  })
}

onMounted(() => {
  const getSelectedCoverId = (): CoverId => {
    const coverImageMode = material.value.coverImage.mode
    switch (coverImageMode) {
      case CoverMode.FACE:
        return 'faceSide'
      case CoverMode.BACK:
        return 'backSide'
      case CoverMode.DIGITAL_DRAPE:
        return 'digitalDrape'
      case CoverMode.MULTI_MEDIA: {
        const multimediaId = multimediaList.value.find(
          (file) => file.isCover
        )?.fileId
        if (!multimediaId) {
          throw new Error('Cover is not found')
        }
        return multimediaId
      }
      default:
        throw new Error('Invalid cover mode')
    }
  }
  selectedCoverId.value = getSelectedCoverId()
})

onUnmounted(() => {
  selectedCoverId.value = null
})

const closeModal = () => {
  store.dispatch('helper/closeModalBehavior')
}

const handleSave = async () => {
  await saveCover()
  closeModal()
}
</script>
