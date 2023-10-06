<template lang="pug">
grid-item-wrapper(
  v-model:selectedValue="innerSelectedValue"
  :selectValue="material"
  isSelectable
  :optionList="optionList"
  @click:option="$emit('click:option', $event)"
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
import { unitFormatter } from '@frontier/lib'

const props = defineProps<{
  material: Material
  selectedValue: Material[]
  optionList: FunctionOption<Material>[][]
}>()

const emit = defineEmits(['update:selectedValue', 'click:option'])

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

  const { materialType, descriptionList, contentList, finishList } =
    mainSide as MaterialFaceSide | MaterialBackSide

  return [
    [
      ...(isComposite ? [`Composite`, materialType] : [materialType]),
      ...descriptionList.map(({ name }) => name),
    ].join(', '),
    contentList
      .map(({ name, percentage }) => `${percentage}%${name}`)
      .join(', '),
    `${width.cuttable}/${width.full}`,
    `${weight.value}${unitFormatter.weight(weight.unit)}`,
    finishList.map(({ name }) => name).join(', '),
  ]
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
