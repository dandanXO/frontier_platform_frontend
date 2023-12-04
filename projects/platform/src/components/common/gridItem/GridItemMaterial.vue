<template lang="pug">
grid-item-wrapper(
  v-model:selectedValue="innerSelectedValue"
  :isSelectable="isSelectable"
  :selectValue="selectValue"
  :optionList="optionList"
  :cornerTopRightHover="material.digitalThreadInfo.threadQty === 0 && currentMaterialId !== material.materialId"
)
  template(#title) {{ material.itemNo }}
  template(#content)
    div(
      class="w-full h-full rounded-md border-grey-250 overflow-hidden bg-cover"
      :class="{ border: hasNoCoverImage }"
    )
      img(v-defaultImg :src="material.coverImage?.thumbnailUrl" class="w-full h-full")
  template(#hover-content)
    div(
      class="text-grey-0 p-2 md:px-7.5 md:py-10 w-full h-full flex flex-col items-center justify-center text-center"
      @click="preventClickWhenSelectText($event)"
    )
      p(
        v-for="(info, index) in materialInfo"
        :key="index"
        :class="{ 'font-bold': index === 0 }"
        class="text-caption2 md:text-body2/1.6 line-clamp-1"
      ) {{ info }}
  template(#corner-top-right="{ isHover }")
    digital-thread-entrance(
      :isHover="isHover"
      :material="material"
      :drawerOpenFromLocationList="[]"
    )
  template(#corner-bottom-left)
    slot(name="corner-bottom-left")
  template(#title-right-icon)
    slot(name="title-right-icon")
  template(#caption)
    slot(name="caption")
</template>

<script setup lang="ts">
import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import { computed } from 'vue'
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'
import { useStore } from 'vuex'
import type {
  Material,
  MaterialBackSide,
  MaterialFaceSide,
} from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'

const props = withDefaults(
  defineProps<{
    material: Material
    isSelectable?: boolean
    selectValue?: any
    selectedValue?: Array<any>
    optionList?: FunctionOption<any>[][]
  }>(),
  {
    isSelectable: true,
  }
)

const emit = defineEmits(['update:selectedValue'])

const store = useStore()
const currentMaterialId = computed(
  () => store.getters['sticker/currentMaterialId']
)

const hasNoCoverImage = computed(() => !props.material.coverImage)
const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v),
})

const materialInfo = computed(() => {
  const { isComposite, width, weight, isDoubleSide, faceSide, backSide } =
    props.material
  let mainSide

  if (faceSide) {
    mainSide = faceSide
  } else if (backSide) {
    mainSide = backSide
  }
  if (isDoubleSide && faceSide) {
    mainSide = faceSide
  }

  const { contentList, finishList, descriptionList } = mainSide as
    | MaterialFaceSide
    | MaterialBackSide

  const list = [
    materialInfoForDisplay.materialType(isComposite, {
      face: faceSide?.materialType,
      back: backSide?.materialType,
    }).value + descriptionList.map(({ name }) => name).join(', '),
  ]

  if (contentList.length > 0) {
    list.push(materialInfoForDisplay.contentList(contentList).value)
  }

  if (width) {
    list.push(materialInfoForDisplay.width(width).value)
  }

  if (weight) {
    list.push(materialInfoForDisplay.weight(weight).value)
  }

  if (finishList.length > 0) {
    list.push(materialInfoForDisplay.finishList(finishList).value)
  }

  return list
})

const preventClickWhenSelectText = (e: Event) => {
  // 避免選取文字的時候出發 click 事件
  if (window.getSelection && window.getSelection()?.toString() !== '') {
    e.stopPropagation()
    return false
  }

  return true
}
</script>
