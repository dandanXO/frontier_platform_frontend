<template lang="pug">
div(v-if="isLoading" class="flex flex-col gap-2")
  skeleton-base(class="w-[194px] h-[194px] rounded-md")
  skeleton-base(class="w-[194px] h-[24px] rounded-md")
grid-item-wrapper(
  v-else
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
        v-if="showImage"
        v-defaultImg
        :src="material.coverImage?.thumbnailUrl || undefined"
        class="w-full h-full object-contain"
        @error="imageOnerror"
      )
      div(v-else class="w-full h-full flex items-center justify-center bg-grey-100")
        img(class="w-full h-full object-contain" :src="imgDefaultMaterial")
  template(#hover-content)
    f-popper(
      v-if="optionList && optionList.length > 0 && !isLoading"
      placement="right-start"
      class="cursor-pointer h-full w-full"
      :class="['visible']"
    )
      template(#trigger)
        div(
          class="text-grey-0 p-2 md:px-7.5 md:py-10 w-full h-full flex flex-col items-center justify-center text-center"
          @click="preventClickWhenSelectText($event)"
        )
          div(
            v-for="(info, index) in materialInfo"
            :key="index"
            :class="{ 'font-bold': index === 0 }"
            class="text-body2 line-clamp-1"
          ) {{ info }}
      template(#content="{ collapsePopper }")
        f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")

    // Loading animation on hover
    div(
      v-if="isLoading"
      class="cursor-wait h-full w-full flex flex-col items-center justify-center bg-grey-900 bg-opacity-70 text-center"
    )
      div(class="text-grey-0 text-caption mt-2") Loading...

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
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import SkeletonBase from '@/components/common/SkeletonBase.vue'

import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'
import type { Material } from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import { getMaterialMainSide } from '@/utils/material/getMaterialMainSide'
import imgDefaultMaterial from '@/assets/images/default_material.png'
import type { MenuTree } from '@frontier/ui-component'

const props = withDefaults(
  defineProps<{
    material: Material
    isSelectable?: boolean
    selectValue?: any
    selectedValue?: Array<any>
    optionList?: FunctionOption<any>[][]
    drawerOpenFromLocationList: string[]
    isLoading?: boolean
  }>(),
  {
    isSelectable: true,
    isLoading: false,
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
    materialInfoForDisplay.materialType(isComposite, materialType).value,
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
const showImage = ref(true)
const imageOnerror = () => {
  showImage.value = false
}

const menuTree = computed<MenuTree>(() => ({
  blockList:
    props.optionList?.map((block) => ({
      menuList: block.map((option) => ({
        title: option.name(props.selectValue),
        clickHandler: () => option.func(props.selectValue),
        disabled: option.disabled ? option.disabled(props.selectValue) : false,
        testId: option.testId,
      })),
    })) ?? [],
}))
</script>
