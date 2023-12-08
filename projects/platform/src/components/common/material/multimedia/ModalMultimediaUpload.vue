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
    modal-view-mode(
      v-if="openMagnifierMode"
      :startIndex="previewStartIndex"
      :fileList="publicFileViewModeList"
      :getMenuTree="getMultimediaMenuTree"
      @close="openMagnifierMode = false"
    )
    p(class="text-body2 text-grey-900 font-bold") {{ $t('Preview your material image') }}
    div(class="grid grid-flow-col gap-x-2 justify-start")
      template(v-for="image in coverAndSideImageList" :key="image.id")
        div(class="w-18 flex flex-col items-center gap-y-0.5")
          div(
            class="relative w-18 h-18 rounded border box-border overflow-hidden border-grey-250 bg-grey-100"
            @click="handleCoverAndSideImageClick"
          )
            div(v-if="image.canSetCover" class="absolute right-0 bottom-0")
              f-svg-icon(
                :class="[image.isCover ? 'text-primary-400' : 'text-grey-400', 'cursor-pointer']"
                iconName="star"
                size="24"
                @click.stop="selectCover(image.id)"
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
          v-bind="cardDragOptions"
          group="multimedia"
          @change="handleMultimediaListChange"
        )
          template(#item="{ element: multimedia, index }")
            multimedia-card(
              :key="multimedia.fileId"
              :isCover="selectedCoverId != null ? selectedCoverId === multimedia.fileId : multimedia.isCover"
              :thumbnailUrl="multimedia.thumbnailUrl"
              :fileName="multimedia.displayFileName"
              :menuTree="getMultimediaMenuTree(multimedia.fileId)"
              @setCover="selectCover(multimedia.fileId)"
              @edit="startCropMultimedia(multimedia.fileId)"
              @click="openMultimediaPreview(index)"
            )
</template>

<script setup lang="ts">
import { ref, computed, toRaw } from 'vue'
import { useStore } from 'vuex'
import Draggable from 'vuedraggable'
import MultimediaCard from '@/components/common/material/multimedia/MultimediaCard.vue'
import ModalViewMode from '@/components/common/material/file/viewMode/ModalViewMode.vue'
import type { MaterialMultimediaUpdateService } from '@/types'
import useMaterial from '@/composables/material/useMaterial'

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

const cardDragOptions = {
  itemKey: 'id',
  forceFallback: true,
  scrollSensitivity: 40,
  scrollSpeed: 7,
  animation: 250,
  disabled: false,
}

const handleCoverAndSideImageClick = () => {
  // TODO
}

const handleMultimediaListChange = (e: any) => {
  const { element, newIndex } = e.moved
  moveMultimedia(element.fileId, newIndex)
}

const previewStartIndex = ref(0)
const openMagnifierMode = ref(false)

const { publicFileViewModeList } = useMaterial(material)

const openMultimediaPreview = (index: number) => {
  openMagnifierMode.value = true
  previewStartIndex.value = index
}

const closeModal = () => {
  store.dispatch('helper/closeModalBehavior')
  selectedCoverId.value = null
}
const handleSave = async () => {
  await saveCover()
  closeModal()
}
</script>
