<template lang="pug">
grid-item-material(
  v-if="node.nodeType === NODE_TYPE.MATERIAL"
  :material="node.properties"
  v-model:selectedValue="innerSelectedValue"
  :isSelectable="isSelectable"
  :selectValue="node"
  :optionList="optionList"
  @click:option="$emit('click:option', $event)"
  :canAddSticker="canAddSticker"
  :drawerOpenFromLocationList="drawerOpenFromLocationList"
)
  template(#corner-top-right)
    slot(name="corner-top-right")
  template(#corner-bottom-left)
    slot(name="corner-bottom-left")
  template(#title-right-icon)
    slot(name="title-right-icon")
  template(#caption)
    slot(name="caption")
grid-item-wrapper(
  v-else
  v-model:selectedValue="innerSelectedValue"
  :isSelectable="isSelectable"
  :selectValue="node"
  :optionList="optionList"
  @click:option="$emit('click:option', $event)"
)
  template(#title) {{ node.properties.name }}
  template(#content)
    div(
      class="grid grid-rows-2 grid-cols-2 grid-flow-col h-full rounded-md overflow-hidden"
    )
      div(class="row-span-2 bg-grey-150")
        img(
          v-if="node.properties.coverImgList[0]"
          :src="node.properties.coverImgList[0]"
          class="w-full h-full object-cover"
        )
      div(class="bg-grey-100")
        img(
          v-if="node.properties.coverImgList[1]"
          :src="node.properties.coverImgList[1]"
          class="w-full h-full"
        )
      div(class="bg-grey-50")
        img(
          v-if="node.properties.coverImgList[2]"
          :src="node.properties.coverImgList[2]"
          class="w-full h-full"
        )
  template(#hover-content)
    p(class="text-body1 font-bold leading-1.6 text-grey-0") {{ $t('RR0068', { number: node.properties.itemCounts }) }}
  template(#corner-top-right)
    slot(name="corner-top-right")
  template(#corner-bottom-left)
    slot(name="corner-bottom-left")
  template(#title-right-icon)
    slot(name="title-right-icon")
  template(#caption)
    slot(name="caption")
</template>

<script setup>
import GridItemMaterial from '@/components/common/gridItem/GridItemMaterial.vue'
import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import { NODE_TYPE } from '@/utils/constants'
import { computed } from 'vue'
import useStickerLocationList from '@/composables/useStickerLocationList'

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  isSelectable: {
    type: Boolean,
    default: true,
  },
  selectedValue: {
    type: Array,
    default: [],
  },
  optionList: {
    type: Array,
    default: () => [], // [[{ name: '', func: () => { }, disabled: false }]]
  },
  canAddSticker: {
    type: Boolean,
    default: true,
  },
  drawerOpenFromLocationList: {
    type: Array,
  },
})
const emit = defineEmits(['update:selectedValue', 'click:option'])

const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v),
})

/**
 * sticker drawer location list
 * 不包含 assets, workspace 等 location type => 去除陣列第一個元素
 * 不包含 materialNo, materialId, frontierNo => 去除陣列最後一個元素
 */

const drawerOpenFromLocationList = useStickerLocationList(props.node.location)
</script>
