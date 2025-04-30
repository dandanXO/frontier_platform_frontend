<template lang="pug">
grid-item-wrapper(
  v-if="nodeType === NodeType.MATERIAL && mainMaterial"
  v-model:selectedValue="innerSelectedValue"
  :isSelectable="isSelectable"
  :selectValue="node"
  :optionList="optionList"
  @click="clickNodeHandler"
  :cornerTopRightHover="mainMaterial.digitalThreadInfo.threadQty === 0 && currentMaterialId !== mainMaterial.materialId"
  :data-cy="testId"
)
  template(#title) {{ mainMaterial.itemNo }}
  template(#content)
    div(class="w-full h-full rounded-md border-grey-250 overflow-hidden bg-cover")
      img(
        v-defaultImg
        :src="mainMaterial.coverImage?.thumbnailUrl ?? undefined"
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

    f-tooltip-standard(
      v-if="showReachOutEmail"
      @click.stop="openEmailModal"
      :tooltipMessage="$t('FF0096')"
      class="z-11 absolute top-2 right-2 cursor-pointer rounded bg-grey-0 hover:bg-grey-100 flex items-center justify-start gap-x-2 p-1 overflow-hidden text-green-500-v1 border border-green-200-v1"
    )
      template(#slot:tooltip-trigger)
        div(class="flex items- gap-x-2 min-w-0")
          f-svg-icon(iconName="contact_mail" size="20")

  template(#corner-top-right)
    slot(name="corner-top-right")
  template(#corner-bottom-left)
    slot(name="corner-bottom-left")
  template(#title-right-icon)
    slot(name="title-right-icon")
  template(#caption)
    slot(name="caption")
grid-item-collection(
  v-else-if="nodeType === NodeType.COLLECTION && collection"
  :collection="collection"
  v-model:selectedValue="innerSelectedValue"
  :isSelectable="isSelectable"
  :selectValue="node"
  :optionList="optionList"
  @click="clickNodeHandler"
  :data-cy="testId"
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
import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import GridItemCollection from '@/components/common/gridItem/GridItemCollection.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import type {
  Collection,
  MainMaterial,
  NodeChild,
  ShareNodeChild,
} from '@frontier/platform-web-sdk'
import { NodeType } from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import { useUserStore } from '@/stores/user'

const props = withDefaults(
  defineProps<{
    node: NodeChild | ShareNodeChild
    isSelectable?: boolean
    selectedValue?: NodeChild[] | ShareNodeChild[]
    optionList?:
      | FunctionOption<NodeChild>[][]
      | FunctionOption<ShareNodeChild>[][]
    testId?: string
    showReachOutEmail?: boolean
    showReachOutEmailCategory: number
  }>(),
  {
    showReachOutEmail: false,
    isSelectable: true,
  }
)
const emit = defineEmits<{
  (e: 'update:selectedValue', v: NodeChild[] | ShareNodeChild[]): void
  (e: 'click:node', v: NodeChild | ShareNodeChild): void
}>()
const userStore = useUserStore()
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
  const {
    isComposite,
    width,
    weight,
    weightForDisplay,
    weightDisplaySetting,
    mainSide,
  } = mainMaterial.value
  const { materialType, descriptionList, contentList, finishList } = mainSide

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

const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v!),
})

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

// Opens the Reach Out modal
async function openEmailModal() {
  await userStore.checkHasLogin()
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-email-contact',
    properties: {
      node: props.node,
      showEmail: userStore.hasLogin,
      material: mainMaterial.value,
      showReachOutEmailCategory: props.showReachOutEmailCategory,
    },
  })
}
</script>
