<template lang="pug">
div(class="h-242.5 pt-16 pb-6.5 px-8 bg-grey-50 flex flex-col")
  div(class="pl-31 pb-13.5")
    h5(class="text-h5 font-bold text-grey-900 pb-3") {{ $t('QQ0061') }}
    p(class="text-body2 text-grey-250") {{ $t('QQ0062', { Creator: moodboard.creator }) }}
  div(class="bg-grey-0 border-grey-150 border rounded flex-grow px-6 pt-2")
    f-tabs(
      :tabList="tabList"
      :initValue="currentTab"
      :key="currentTab"
      @switch="switchTab($event.path)"
    )
      div(v-if="currentTab !== MOODBOARD_TAB.COMMENT" class="pt-4")
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
                @click="openModalMoodboardCollectionDetail(true)"
              ) {{ $t('UU0057') }}
              f-button(
                v-if="currentTab === MOODBOARD_TAB.OFFER"
                size="sm"
                prependIcon="add"
                @click="openModalCreateOrEditMoodboardCollection(CREATE_EDIT.CREATE, currentNodeId ? currentNodeId : moodboardProperties.myRootNodeId)"
              ) {{ $t('FF0003') }}
          div(class="py-2 flex justify-between items-center")
            global-breadcrumb-list(
              :breadcrumbList="moodboardNodeCollection.nodeMeta.locationList"
              @click:item="goTo($event.nodeId)"
              fontSize="text-body2"
            )
            f-button-label(size="lg" @click="selectAll") {{ $t('RR0209') }}
          div(class="bg-grey-50 h-10 flex items-center gap-x-3 pl-4")
            f-svg-icon(iconName="public" size="20" class="text-grey-600")
            p(class="text-caption text-grey-600") {{ $t('QQ0053') }}
          div(v-if="isLoading" class="flex-grow flex items-center justify-center")
            f-svg-icon(iconName="loading" size="92" class="text-primary-400")
          div(
            v-else
            class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start h-149 py-2 overflow-y-auto"
          )
            div(
              v-if="currentTab === MOODBOARD_TAB.OFFER"
              class="aspect-square border border-grey-250 border-dashed rounded-md flex justify-center items-center cursor-pointer"
              @click="openModalAssetsList"
            )
              div(class="flex flex-col justify-center items-center")
                f-svg-icon(iconName="add" size="24" class="text-grey-900 mb-3.5")
                span(class="text-body1 text-grey-900") {{ $t('UU0055') }}
            grid-item-node-moodboard(
              v-for="node in moodboardNodeCollection.childNodeList"
              :key="node.nodeMeta.nodeId"
              v-model:selectedValue="selectedNodeList"
              :node="node"
              :optionList="optionNode(node)"
              @click:node="handleNodeClick(node)"
            )
              template(
                #caption
                v-if="currentTab === MOODBOARD_TAB.PICKED && node.nodeMeta.nodeType === NodeType.MATERIAL"
              )
                btn-pick-tooltip(
                  class="absolute right-0 -bottom-0.5"
                  :isPicked="node.moodboardInfo.isPicked"
                )
      template(v-if="currentTab === MOODBOARD_TAB.COMMENT")
        div(v-if="isLoading" class="flex-grow flex items-center justify-center")
          f-svg-icon(iconName="loading" size="92" class="text-primary-400")
        mood-board-comment(
          v-else
          :moodboardId="moodboard.moodboardId"
          :offerId="moodboardProperties.myOfferId"
        )
multi-select-menu(
  :optionMultiSelect="optionMultiSelect"
  v-model:selectedList="selectedNodeList"
)
</template>

<script setup lang="ts">
import { h, computed, shallowRef, ref } from 'vue'
import { useStore } from 'vuex'
import { MOODBOARD_TAB, CREATE_EDIT } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import GridItemNodeMoodboard from '@/components/moodboard/GridItemNodeMoodboard.vue'
import { FSvgIcon } from '@frontier/ui-component'
import MultiSelectMenu from '@/components/common/MultiSelectMenu.vue'
import MoodBoardComment from '@/components/moodboard/MoodBoardComment.vue'
import BtnPickTooltip from '@/components/moodboard/BtnPickTooltip.vue'
import useMoodboardDetail from '@/composables/useMoodboardDetail.js'
import useMoodboardNode from '@/composables/useMoodboardNode.js'
import type {
  Moodboard,
  MoodboardPropertiesProvider,
  MoodboardNodeChild,
} from '@frontier/platform-web-sdk'
import { NodeType } from '@frontier/platform-web-sdk'
import type { PropsModalAssetsList } from '@/components/assets/ModalAssetsList.vue'
import { useMoodboardStore } from '@/stores/moodboard'

const props = defineProps<{
  moodboard: Moodboard
}>()

const moodboardProperties = ref(
  props.moodboard.properties as MoodboardPropertiesProvider
)

const { ogBaseMoodboardApi } = useMoodboardStore()
const store = useStore()
const { t } = useI18n()

const {
  keyword,
  currentTab,
  currentNodeId,
  isLoading,
  switchTab,
  goTo,
  search,
  moodboardNodeCollection,
  selectedNodeList,
  selectAll,
} = useMoodboardDetail(
  props.moodboard.moodboardId,
  moodboardProperties.value.myOfferId,
  moodboardProperties.value.myRootNodeId
)
const {
  deleteMoodboardNode,
  editMoodboardNodeCollection,
  openModalCreateOrEditMoodboardCollection,
  openModalMoodboardCollectionDetail,
  openModalMoodboardMaterialDetail,
} = useMoodboardNode(ref(props.moodboard), moodboardNodeCollection)

const isFirstLayer = computed(
  () => moodboardNodeCollection.value?.nodeMeta.locationList.length === 1
)

const tabList = computed(() => [
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
    hasNewUpdate: moodboardProperties.value.hasNewComment,
  },
])

const optionNode = (node: MoodboardNodeChild) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    return [[editMoodboardNodeCollection, deleteMoodboardNode]]
  } else {
    return [[deleteMoodboardNode]]
  }
}

const optionMultiSelect = computed(() => [deleteMoodboardNode])

const handleNodeClick = (node: MoodboardNodeChild) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    goTo(node.nodeMeta.nodeId)
  } else {
    openModalMoodboardMaterialDetail(node)
  }
}

const openModalAssetsList = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-assets-list',
    properties: {
      modalTitle: t('RR0008'),
      actionText: t('UU0035'),
      actionCallback: async (materialIdList) => {
        store.dispatch('helper/pushModalLoading')
        await ogBaseMoodboardApi('createMoodboardOfferNodeMaterial', {
          nodeId: currentNodeId.value
            ? currentNodeId.value
            : moodboardProperties.value.myRootNodeId,
          materialIdList,
        })
        store.dispatch('helper/reloadInnerApp')
        store.dispatch('helper/closeModalLoading')
        store.dispatch('helper/closeModalBehavior')
      },
      noteComponent: shallowRef({
        render: () => {
          return h('div', { class: 'flex items-center text-grey-600' }, [
            h(FSvgIcon, { iconName: 'info_outline', size: '20' }),
            h('p', { class: 'text-caption leading-1.6 pl-1.5' }, t('QQ0053')),
          ])
        },
      }),
    } as PropsModalAssetsList,
  })
}
</script>
