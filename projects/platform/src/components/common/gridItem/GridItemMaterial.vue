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
      img(
        v-defaultImg
        :src="material.coverImage?.thumbnailUrl"
        class="w-full h-full object-contain"
      )
  template(#hover-content)
    div(
      class="text-grey-0 p-2 md:px-7.5 md:py-10 w-full h-full flex flex-col items-center justify-center text-center"
      @click="preventClickWhenSelectText($event)"
    )
      p(
        v-for="(info, index) in materialInfo"
        :key="index"
        :class="{ 'font-bold': index === 0 }"
        class="text-body2 line-clamp-1"
      ) {{ info }}
  template(#corner-top-right)
    digital-thread-entrance(
      :material="material"
      :drawerOpenFromLocationList="drawerOpenFromLocationList"
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
import type { Material } from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import { getMaterialMainSide } from '@/utils/material/getMaterialMainSide'

const props = withDefaults(
  defineProps<{
    material: Material
    isSelectable?: boolean
    selectValue?: any
    selectedValue?: Array<any>
    optionList?: FunctionOption<any>[][]
    drawerOpenFromLocationList: string[]
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
  const mainSide = getMaterialMainSide(props.material)
  const { isComposite, width, weight, weightForDisplay, weightDisplaySetting } =
    props.material
  const { contentList, finishList, materialType, descriptionList } = mainSide

  const list = [
    materialInfoForDisplay.materialType(
      isComposite,
      materialType,
      descriptionList
    ).value,
  ]

  if (contentList.length > 0) {
    list.push(materialInfoForDisplay.contentList(contentList).value)
  }

  if (width) {
    list.push(materialInfoForDisplay.width(width).value)
  }

  if (weight) {
    list.push(
      materialInfoForDisplay.weight(
        weight,
        weightForDisplay,
        weightDisplaySetting
      ).value
    )
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
