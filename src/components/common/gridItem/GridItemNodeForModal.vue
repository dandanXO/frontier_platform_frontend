<template lang="pug">
grid-item-wrapper(
  :isSelectable="isSelectable"
  :isMultiSelect="isMultiSelect"
  v-model:selectedValue="innerSelectedValue"
  :selectValue="node"
  :selectOnHover="false"
)
  template(#title="{ isHover }")
    span(:class="{ 'text-brand': isHover }") {{ node.nodeType === NODE_TYPE.COLLECTION ? node.properties.name : node.properties.materialNo }}
  template(#content)
    template(v-if="node.nodeType === NODE_TYPE.COLLECTION")
      div(class="grid grid-rows-2 grid-cols-2 grid-flow-col h-full rounded-md overflow-hidden")
        div(class="row-span-2 bg-primary-thin")
          img(v-if="node.properties.coverImgList[0]" :src="node.properties.coverImgList[0]" class="w-full h-full object-cover")
        div(class="bg-black-200")
          img(v-if="node.properties.coverImgList[1]" :src="node.properties.coverImgList[1]" class="w-full h-full")
        div(class="bg-black-50")
          img(v-if="node.properties.coverImgList[2]" :src="node.properties.coverImgList[2]" class="w-full h-full")
      div(v-if="node.properties.hasChildCollection" class="w-full h-7.5 absolute bottom-0 left-0")
        div(class="bg-linear w-full h-full rounded-t-md transform rotate-180")
        svg-icon(iconName="folder" size="14" class="text-black-0 absolute right-2 bottom-2")
    template(v-if="node.nodeType === NODE_TYPE.MATERIAL")
      img(v-defaultImg :src="node.properties.coverImg" class="w-full h-full rounded-md overflow-hidden")
  template(#title-right-icon)
    slot(name="title-right-icon")
</template>

<script setup>
import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import { NODE_TYPE } from '@/utils/constants'
import { computed } from 'vue'

const emit = defineEmits(['update:selectedValue'])
const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  isSelectable: {
    type: Boolean,
    default: true
  },
  isMultiSelect: {
    type: Boolean,
    default: true
  },
  selectedValue: {
    type: [Array, String, Object]
  }
})

const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v)
})

</script>
