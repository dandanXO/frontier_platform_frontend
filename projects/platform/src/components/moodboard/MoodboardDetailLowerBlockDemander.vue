<template lang="pug">
div(class="h-242.5 pt-16 pb-6.5 px-8 bg-grey-50 flex flex-col")
  div(class="pl-31 pb-13.5")
    h5(class="text-h5 font-bold text-grey-900 pb-3") {{ $t('QQ0016') }}
    p(class="text-body2 text-grey-250") {{ $t('QQ0017') }}
  div(class="flex-grow flex gap-x-5.5")
    div(class="w-52 shrink-0 h-full")
      f-button(
        size="md"
        prependIcon="add"
        class="w-full"
        @click="openModalMoodboardShareList"
      ) {{ $t('UU0096') }}
      div(
        class="w-full h-23 rounded flex flex-col justify-center pl-6 mt-6 hover:bg-grey-100 cursor-pointer"
        :class="[{ 'bg-grey-250': currentOfferId === MOODBOARD_OFFER_ID_ALL }]"
        @click="switchOffer(MOODBOARD_OFFER_ID_ALL, null)"
      )
        p(class="text-body1 font-bold text-grey-900 leading-1.6") {{ $t('RR0052') }}
        p(class="text-caption text-grey-600 leading-1.6") {{ $t('RR0201', { number: moodboardOfferList.length }) }}・{{ $t('RR0068', { number: totalOfferItemCounts }) }}
      div(class="border-t border-b border-grey-150 py-2")
        f-scrollbar-container(class="max-h-156 -mx-5 px-5")
          div(class="grid gap-y-2")
            div(
              v-for="offer in moodboardOfferList"
              :key="offer.rootNodeId"
              class="h-20 flex items-center gap-x-3 pl-3 rounded hover:bg-grey-100 cursor-pointer"
              :class="[{ 'bg-grey-250': Number(currentOfferId) === offer.offerId }]"
              @click="switchOffer(offer.offerId, offer.rootNodeId)"
            )
              div(class="relative flex-shrink-0")
                img(:src="offer.logo" class="w-8 h-8 rounded-full")
                div(
                  v-if="offer.hasNewUpdate"
                  class="absolute w-3 h-3 bg-primary-400 border border-grey-0 rounded-full top-0 -right-0.5"
                )
              div
                p(class="text-body1 font-bold text-grey-900 leading-1.6 line-clamp-1") {{ offer.name }}
                p(class="text-caption text-grey-600 leading-1.6") {{ $t('RR0068', { number: offer.itemCounts }) }}・{{ offer.lastUpdateTime }}
    div(class="flex-grow flex flex-col bg-grey-0 border-grey-150 border rounded px-6 pt-2")
      div(v-if="moodboardOfferList.length === 0" class="text-center pt-30")
        h4(class="text-h4 text-grey-900 pb-6") {{ $t('QQ0018') }}
        p(class="text-body2 text-grey-600") {{ $t('QQ0019') }}
      template(v-else)
        f-tabs(
          v-if="currentOfferId !== MOODBOARD_OFFER_ID_ALL"
          :tabList="tabList"
          :initValue="currentTab"
          :key="`${currentOfferId} + ${currentTab}`"
          @switch="switchTab($event.path)"
        )
        div(
          v-if="currentTab !== MOODBOARD_TAB.COMMENT"
          class="flex-grow pt-4 flex flex-col"
        )
          template(v-if="moodboardNodeCollection")
            div(class="flex justify-between items-center")
              f-input-text(
                v-model:textValue="keyword"
                size="md"
                class="w-67.5"
                prependIcon="search"
                :placeholder="$t('RR0053')"
                @enter="search"
                @clear="search"
              )
              div(class="flex")
                f-button(
                  v-if="!isFirstLayer"
                  size="sm"
                  type="secondary"
                  class="mr-3"
                  @click="openModalMoodboardCollectionDetail(false)"
                ) {{ $t('UU0057') }}
                f-button(
                  v-if="currentOfferId === MOODBOARD_OFFER_ID_ALL"
                  size="sm"
                  type="secondary"
                  prependIcon="pinned"
                  @click="goToMoodboardPickedList({}, moodboard.moodboardId)"
                ) {{ $t('QQ0086') }}
            div(class="pt-3 pb-3.5 h-6 box-content flex items-center justify-between")
              global-breadcrumb-list(
                :breadcrumbList="moodboardNodeCollection.nodeMeta.locationList"
                fontSize="text-body2"
                @click:item="goTo($event.nodeId)"
              )
              f-button-label(
                v-if="currentOfferId !== MOODBOARD_OFFER_ID_ALL && currentTab === MOODBOARD_TAB.PICKED"
                size="lg"
                @click="selectAll"
              ) {{ $t('RR0209') }}
            div(v-if="isLoading" class="flex-grow flex items-center justify-center")
              f-svg-icon(iconName="loading" size="92" class="text-primary-400")
            div(
              v-else
              class="flex-grow grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start pb-2 overflow-y-auto hide-scrollbar"
            )
              grid-item-node-moodboard(
                v-for="node in moodboardNodeCollection.childNodeList"
                :key="node.nodeMeta.nodeId"
                v-model:selectedValue="selectedNodeList"
                :node="node"
                :isSelectable="currentOfferId !== MOODBOARD_OFFER_ID_ALL && currentTab === MOODBOARD_TAB.PICKED"
                :optionList="optionNode(node)"
                @click:node="handleNodeClick(node)"
              )
                template(
                  #caption
                  v-if="node.nodeMeta.nodeType === NodeType.MATERIAL"
                )
                  btn-pick-tooltip(
                    class="absolute right-0 -bottom-0.5"
                    :isPicked="node.moodboardInfo.isPicked"
                    @togglePick="togglePick(node, currentTab === MOODBOARD_TAB.PICKED, false)"
                  )
        template(v-if="currentTab === MOODBOARD_TAB.COMMENT")
          mood-board-comment(
            :moodboardId="moodboard.moodboardId"
            :offerId="Number(currentOfferId)"
          )
multi-select-menu(
  :optionMultiSelect="optionMultiSelect"
  v-model:selectedList="selectedNodeList"
)
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { MOODBOARD_TAB, MOODBOARD_OFFER_ID_ALL } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import GridItemNodeMoodboard from '@/components/moodboard/GridItemNodeMoodboard.vue'
import MoodBoardComment from '@/components/moodboard/MoodBoardComment.vue'
import BtnPickTooltip from '@/components/moodboard/BtnPickTooltip.vue'
import MultiSelectMenu from '@/components/common/MultiSelectMenu.vue'
import useMoodboardDetail from '@/composables/useMoodboardDetail.js'
import useMoodboardNode from '@/composables/useMoodboardNode.js'
import useNavigation from '@/composables/useNavigation'
import type {
  Moodboard,
  MoodboardPropertiesDemander,
  MoodboardNodeChild,
} from '@frontier/platform-web-sdk'
import { NodeType } from '@frontier/platform-web-sdk'
import type { PropsModalMoodboardShareList } from './ModalMoodboardShareList.vue'

const props = defineProps<{
  moodboard: Moodboard
}>()

const moodboardProperties = ref(
  props.moodboard.properties as MoodboardPropertiesDemander
)
const { t } = useI18n()
const store = useStore()
const { goToMoodboardPickedList } = useNavigation()

const {
  keyword,
  currentTab,
  currentOfferId,
  isLoading,
  switchOffer,
  switchTab,
  goTo,
  search,
  moodboardNodeCollection,
  selectedNodeList,
  selectAll,
} = useMoodboardDetail(
  props.moodboard.moodboardId,
  MOODBOARD_OFFER_ID_ALL,
  null
)
const {
  cloneMoodboardNode,
  exportMoodboardNode,
  downloadU3m,
  togglePick,
  openModalMoodboardCollectionDetail,
  openModalMoodboardMaterialDetail,
} = useMoodboardNode(ref(props.moodboard), moodboardNodeCollection)

const isFirstLayer = computed(
  () => moodboardNodeCollection.value?.nodeMeta.locationList.length === 1
)
const moodboardOfferList = computed(
  () => moodboardProperties.value.offerList || []
)
const totalOfferItemCounts = computed(() =>
  moodboardOfferList.value.reduce(
    (prev, current) => prev + current.itemCounts,
    0
  )
)

const tabList = computed(() => {
  const currentOffer = moodboardOfferList.value.find(
    (offer) => offer.offerId === Number(currentOfferId.value)
  )
  return [
    {
      name: t('QQ0051'),
      path: MOODBOARD_TAB.OFFER,
    },
    {
      name: t('QQ0052'),
      path: MOODBOARD_TAB.PICKED,
    },
    {
      name: t('QQ0031'),
      path: MOODBOARD_TAB.COMMENT,
      hasNewUpdate: currentOffer ? currentOffer.hasNewComment : false,
    },
  ]
})

const optionNode = (node: MoodboardNodeChild) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    return [[cloneMoodboardNode]]
  } else {
    return [[cloneMoodboardNode, downloadU3m]]
  }
}

const optionMultiSelect = computed(() => [exportMoodboardNode])

const handleNodeClick = (node: MoodboardNodeChild) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    goTo(node.nodeMeta.nodeId)
  } else {
    const willRemove = currentTab.value === MOODBOARD_TAB.PICKED
    const willRecovery = currentTab.value === MOODBOARD_TAB.PICKED
    openModalMoodboardMaterialDetail(node, willRemove, willRecovery)
  }
}
const openModalMoodboardShareList = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-moodboard-share-list',
    properties: {
      moodboardId: props.moodboard.moodboardId,
      shareList: moodboardProperties.value.shareList,
    } as PropsModalMoodboardShareList,
  })
}
</script>
