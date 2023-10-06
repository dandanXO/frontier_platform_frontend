<template lang="pug">
grid-item-wrapper(
  v-if="nodeType === NodeType.MATERIAL && mainMaterial"
  v-model:selectedValue="innerSelectedValue"
  :isSelectable="isSelectable"
  :selectValue="node"
  :optionList="optionList"
  @click="clickNodeHandler"
  :cornerTopRightHover="mainMaterial.digitalThreadInfo.threadQty === 0 && currentMaterialId !== mainMaterial.materialId"
)
  template(#title) {{ mainMaterial.itemNo }}
  template(#content)
    div(class="w-full h-full rounded-md border-grey-250 overflow-hidden bg-cover")
      img(
        v-defaultImg
        :src="mainMaterial.coverImage.thumbnailUrl"
        class="w-full h-full"
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
        class="text-caption2 md:text-body2/1.6 line-clamp-1"
      ) {{ info }}
  template(#corner-top-right="{ isHover }")
    digital-thread-entrance(
      :isHover="isHover"
      :material="mainMaterial"
      :drawerOpenFromLocationList="drawerOpenFromLocationList"
    )
  template(#corner-bottom-left)
    slot(name="corner-bottom-left")
  template(#title-right-icon)
    slot(name="title-right-icon")
  template(#caption)
    slot(name="caption")
grid-item-wrapper(
  v-else-if="nodeType === NodeType.COLLECTION && collection"
  v-model:selectedValue="innerSelectedValue"
  :isSelectable="isSelectable"
  :selectValue="node"
  :optionList="optionList"
  @click="clickNodeHandler"
)
  template(#title) {{ collection.name }}
  template(#content)
    div(
      class="grid grid-rows-2 grid-cols-2 grid-flow-col h-full rounded-md overflow-hidden"
    )
      div(class="row-span-2 bg-grey-150")
        img(
          v-if="collection.coverImgList[0]"
          :src="collection.coverImgList[0]"
          class="w-full h-full object-cover"
        )
      div(class="bg-grey-100")
        img(
          v-if="collection.coverImgList[1]"
          :src="collection.coverImgList[1]"
          class="w-full h-full"
        )
      div(class="bg-grey-50")
        img(
          v-if="collection.coverImgList[2]"
          :src="collection.coverImgList[2]"
          class="w-full h-full"
        )
  template(#hover-content)
    p(class="text-caption2 md:text-body1/1.6 font-bold text-grey-0") {{ $t('RR0068', { number: collection.itemCounts }) }}
  template(#corner-top-right)
    slot(name="corner-top-right")
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
import useStickerLocationList from '@/composables/useStickerLocationList'
import { useStore } from 'vuex'
import type {
  Collection,
  MainMaterial,
  NodeChild,
} from '@frontier/platform-web-sdk'
import { NodeType } from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'
import { unitFormatter } from '@frontier/lib'
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'

const props = withDefaults(
  defineProps<{
    node: NodeChild
    isSelectable?: boolean
    selectedValue: NodeChild[]
    optionList: FunctionOption<NodeChild>[][]
  }>(),
  {
    isSelectable: true,
  }
)
const emit = defineEmits<{
  (e: 'update:selectedValue', v: NodeChild[]): void
  (e: 'click:node', v: NodeChild): void
}>()
const store = useStore()

const nodeType = computed(() => props.node.nodeMeta.nodeType)
const collection = computed(() =>
  nodeType.value === NodeType.COLLECTION
    ? (props.node.nodeProperty as Collection)
    : null
)
const mainMaterial = computed(() =>
  nodeType.value === NodeType.MATERIAL
    ? (props.node.nodeProperty as MainMaterial)
    : null
)
const materialInfo = computed(() => {
  if (!mainMaterial.value) {
    return []
  }
  const { isComposite, width, weight, mainSide } = mainMaterial.value
  const { materialType, descriptionList, contentList, finishList } = mainSide

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

const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v),
})

const drawerOpenFromLocationList = useStickerLocationList(
  props.node.nodeMeta.locationList.map((location) => location.name)
)
const currentMaterialId = computed(
  () => store.getters['sticker/currentMaterialId']
)

const clickNodeHandler = async () => {
  if (
    !(
      mainMaterial.value &&
      mainMaterial.value.materialId === currentMaterialId.value
    )
  ) {
    await store.dispatch('sticker/closeStickerDrawer')
  }
  emit('click:node', props.node)
}

const preventClickWhenSelectText = (e: Event) => {
  // 避免選取文字的時候出發 click 事件
  if (window.getSelection && window.getSelection()?.toString() !== '') {
    e.stopPropagation()
    return false
  }

  return true
}
</script>
