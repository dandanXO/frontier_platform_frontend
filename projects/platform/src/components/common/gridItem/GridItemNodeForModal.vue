<template lang="pug">
grid-item-wrapper(
  :isSelectable="isSelectable"
  :isMultiSelect="isMultiSelect"
  v-model:selectedValue="innerSelectedValue"
  :selectValue="node.nodeMeta.nodeId"
  :selectOnHover="false"
)
  template(#title="{ isHover }")
    span(:class="{ 'text-primary-400': isHover }") {{ node.nodeMeta.nodeType === NodeType.COLLECTION ? collection?.name : mainMaterial?.itemNo }}
  template(#content)
    template(v-if="collection")
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
      div(
        v-if="collection.hasChildCollection"
        class="w-full h-7.5 absolute bottom-0 left-0"
      )
        div(class="bg-linear w-full h-full rounded-t-md transform rotate-180")
        f-svg-icon(
          iconName="folder"
          size="14"
          class="text-grey-0 absolute right-2 bottom-2"
        )
    template(v-if="mainMaterial")
      img(
        v-defaultImg
        :src="mainMaterial.coverImage?.thumbnailUrl"
        class="w-full h-full rounded-md overflow-hidden"
      )
  template(#title-right-icon)
    slot(name="title-right-icon")
</template>

<script setup lang="ts">
import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import { computed } from 'vue'
import {
  type NodeChild,
  NodeType,
  type Collection,
  type MainMaterial,
} from '@frontier/platform-web-sdk'

const props = withDefaults(
  defineProps<{
    node: NodeChild
    selectedValue?: Array<number> | number | null
    isSelectable?: boolean
    isMultiSelect?: boolean
  }>(),
  {
    isMultiSelect: true,
    isSelectable: true,
  }
)
const emit = defineEmits<{
  (e: 'update:selectedValue', v: Array<number> | number | null): void
}>()

const collection = computed(() =>
  props.node.nodeMeta.nodeType === NodeType.COLLECTION
    ? (props.node.nodeProperty as Collection)
    : null
)
const mainMaterial = computed(() =>
  props.node.nodeMeta.nodeType === NodeType.MATERIAL
    ? (props.node.nodeProperty as MainMaterial)
    : null
)
const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v),
})
</script>
