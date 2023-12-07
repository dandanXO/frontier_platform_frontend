<template lang="pug">
//- 目前在 Moodboard的 多選功能只有 export，而 export 需要等 online spreadsheet 功能上線後才能開啟
//- 所以 isSelectable 暫時設為 false。
grid-item-material(
  v-if="nodeType === NodeType.MATERIAL && material"
  :material="material"
  :isSelectable="false"
  v-model:selectedValue="innerSelectedValue"
  :selectValue="node"
  :optionList="optionList"
  :drawerOpenFromLocationList="node.nodeMeta.locationList.map((l) => l.name)"
  @click="clickNodeHandler"
)
  template(#corner-bottom-left)
    slot(name="corner-bottom-left")
  template(#title-right-icon)
    slot(name="title-right-icon")
  template(#caption)
    slot(name="caption")
grid-item-collection(
  v-else-if="nodeType === NodeType.COLLECTION && collection"
  :collection="collection"
  :isSelectable="false"
  v-model:selectedValue="innerSelectedValue"
  :selectValue="node"
  :optionList="optionList"
  @click="clickNodeHandler"
)
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
import GridItemMaterial from '@/components/common/gridItem/GridItemMaterial.vue'
import GridItemCollection from '@/components/common/gridItem/GridItemCollection.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import type {
  Collection,
  MoodboardNodeChild,
  Material,
} from '@frontier/platform-web-sdk'
import { NodeType } from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'

const props = defineProps<{
  node: MoodboardNodeChild
  selectedValue: MoodboardNodeChild[]
  optionList: FunctionOption<MoodboardNodeChild>[][]
}>()
const emit = defineEmits<{
  (e: 'update:selectedValue', v: MoodboardNodeChild[]): void
  (e: 'click:node', v: MoodboardNodeChild): void
}>()

const store = useStore()
const nodeType = computed(() => props.node.nodeMeta.nodeType)
const collection = computed(() =>
  nodeType.value === NodeType.COLLECTION
    ? (props.node.nodeProperty as Collection)
    : null
)
const material = computed(() =>
  nodeType.value === NodeType.MATERIAL
    ? (props.node.nodeProperty as Material)
    : null
)
const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v!),
})

const currentMaterialId = computed(
  () => store.getters['sticker/currentMaterialId']
)

const clickNodeHandler = async () => {
  if (
    !(material.value && material.value.materialId === currentMaterialId.value)
  ) {
    await store.dispatch('sticker/closeStickerDrawer')
  }
  emit('click:node', props.node)
}
</script>
