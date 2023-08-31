<template lang="pug">
grid-item-material(
  v-if="node.nodeType === NODE_TYPE.MATERIAL"
  :material="node.properties"
  v-model:selectedValue="innerSelectedValue"
  :isSelectable="isSelectable"
  :selectValue="node"
  :optionList="optionList"
  @click:option="$emit('click:option', $event)"
  @click="clickNodeHandler"
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
  @click="clickNodeHandler"
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
    p(class="text-caption2 md:text-body1/1.6 font-bold text-grey-0") {{ $t('RR0068', { number: node.properties.itemCounts }) }}
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
import { useStore } from 'vuex'

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
    default: () => [],
  },
  optionList: {
    type: Array,
    default: () => [], // [[{ name: '', func: () => { }, disabled: false }]]
  },
})
const emit = defineEmits(['update:selectedValue', 'click:option', 'click:node'])
const store = useStore()

const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v),
})

const drawerOpenFromLocationList = useStickerLocationList(props.node.location)

const clickNodeHandler = async () => {
  const { nodeType, properties } = props.node
  if (
    !(
      nodeType === NODE_TYPE.MATERIAL &&
      properties.materialId === store.getters['sticker/currentMaterialId']
    )
  ) {
    await store.dispatch('sticker/closeStickerDrawer')
  }
  emit('click:node')
}
</script>
