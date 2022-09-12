<template lang="pug">
div(class="h-242.5 pt-16 pb-6.5 px-8 bg-black-50 flex flex-col")
  div(class="pl-31 pb-13.5")
    h5(class="text-h5 font-bold text-primary pb-3") {{ $t('QQ0061') }}
    p(class="text-body2 text-black-500") {{ $t('QQ0062') }}
  div(class="bg-black-0 border-primary-middle border rounded flex-grow px-6 pt-2")
    f-tabs(:tabList="tabList" :initValue="currentTab" @switch="switchTab($event)")
      div(v-if="currentTab !== MOODBOARD_TAB.COMMENT" class="pt-4")
        div(class="flex justify-between items-center")
          f-input-text(
            v-model:textValue="keyword"
            size="sm"
            class="w-67.5"
            prependIcon="search"
            :placeholder="$t('RR0053')"
            @enter="search"
            @clear="search"
          )
          div(class="flex")
            f-button(v-if="!isFirstLayer" size="sm" type="secondary" class="mr-3" @click="openModalMoodboardCollectionDetail(true)") {{ $t("UU0057") }}
            f-button(v-if="currentTab === MOODBOARD_TAB.OFFER" size="sm" prependIcon="add" @click="openModalAssetsList") {{ $t("UU0055") }}
        div(class="py-2 flex justify-between items-center")
          f-breadcrumb(:breadcrumbList="moodboardOfferNodeCollection.locationList" @click:item="goTo($event.nodeId)" fontSize="text-body2")
          f-button-label(size="lg" @click="selectAll") {{ $t("RR0209") }}
        div(class="bg-black-50 h-10 flex items-center gap-x-3 pl-4")
          f-svg-icon(iconName="public" size="20" class="text-black-600")
          p(class="text-caption text-black-800") {{ $t('QQ0053') }}
        div(v-if="isLoading" class="flex-grow flex items-center justify-center")
          f-svg-icon(iconName="loading" size="92" class="text-brand")
        div(v-else class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start h-149 py-2 overflow-y-scroll")
          div(v-if="currentTab === MOODBOARD_TAB.OFFER" class="aspect-square border border-black-400 border-dashed rounded-md flex justify-center items-center cursor-pointer" @click="openModalCreateOrEditMoodboardCollection(CREATE_EDIT.CREATE, currentNodeId)")
            div(class="flex flex-col justify-center items-center")
              f-svg-icon(iconName="add" size="24" class="text-primary mb-3.5")
              span(class="text-body1 text-primary") {{ $t("FF0003") }}
          grid-item-node(
            v-for="node in moodboardOfferNodeCollection.childNodeList"
            v-model:selectedValue="selectedNodeList"
            :node="node"
            :optionList="optionNode(node)"
            @click:option="$event.func(node)"
            @click.stop="handleNodeClick(node)"
          )
            template(#caption v-if="currentTab === MOODBOARD_TAB.PICKED && node.nodeType === NODE_TYPE.MATERIAL")
              btn-pick-tooltip(class="absolute right-0 -bottom-0.5" :isPicked="node.isPicked")
      template(v-if="currentTab === MOODBOARD_TAB.COMMENT")
        div(v-if="isLoading" class="flex-grow flex items-center justify-center")
          f-svg-icon(iconName="loading" size="92" class="text-brand")
        mood-board-comment(v-else :moodboardId="moodboard.moodboardId" :offerId="moodboard.properties.myOfferId")
multi-select-menu(:optionMultiSelect="optionMultiSelect" v-model:selectedList="selectedNodeList")
</template>

<script setup>
import { h, computed, shallowRef } from 'vue'
import { useStore } from 'vuex'
import { MOODBOARD_TAB, CREATE_EDIT, NODE_TYPE } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import FSvgIcon from '@frontier/ui-component/src/FSvgIcon/FSvgIcon.vue'
import MultiSelectMenu from '@/components/common/MultiSelectMenu.vue'
import MoodBoardComment from '@/components/moodboard/MoodBoardComment.vue'
import BtnPickTooltip from '@/components/moodboard/BtnPickTooltip.vue'
import useMoodboardDetail from '@/composables/useMoodboardDetail.js'
import useMoodboardNode from '@/composables/useMoodboardNode.js'

const store = useStore()
const { t } = useI18n()
const moodboard = computed(() => store.getters['moodboard/moodboard'])
const moodboardOfferNodeCollection = computed(() => store.getters['moodboard/moodboardOfferNodeCollection'])
const isFirstLayer = computed(() => moodboardOfferNodeCollection.value.locationList.length === 1)
const {
  selectedNodeList,
  selectAll,
  deleteMoodboardNode,
  openModalMoodboardMaterialDetail,
  openModalMoodboardCollectionDetail
} = useMoodboardNode(moodboard, moodboardOfferNodeCollection)
const {
  keyword,
  currentTab,
  currentNodeId,
  isLoading,
  switchTab,
  goTo,
  search
} = useMoodboardDetail({ defaultOfferId: moodboard.value.properties.myOfferId, defaultNodeId: moodboard.value.properties.myRootNodeId, selectedNodeList })
const handleNodeClick = (node) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    goTo(node.nodeId)
  } else {
    openModalMoodboardMaterialDetail(node)
  }
}

const tabList = computed(() => [
  {
    name: t('QQ0051'),
    path: MOODBOARD_TAB.OFFER
  },
  {
    name: t('QQ0052'),
    path: MOODBOARD_TAB.PICKED
  },
  {
    name: t('QQ0031'),
    path: MOODBOARD_TAB.COMMENT,
    hasNewUpdate: moodboard.value.properties.hasNewComment
  }
])

const openModalAssetsList = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-assets-list',
    properties: {
      modalTitle: t('FF0016'),
      actionText: t('UU0035'),
      actionCallback: async (materialList) => {
        store.dispatch('helper/pushModalLoading')
        await store.dispatch('moodboard/addMaterialToMoodboardNode', {
          nodeId: currentNodeId.value,
          materialIdList: materialList.map(({ materialId }) => materialId)
        })
        store.dispatch('helper/closeModalLoading')
        store.dispatch('helper/closeModalBehavior')
      },
      noteComponent: shallowRef({
        render: () => {
          return h('div', { class: 'flex items-center text-black-600' }, [
            h(FSvgIcon, { iconName: 'info_outline', size: "20" }),
            h('p', { class: 'text-caption leading-1.6 pl-1.5', }, t('QQ0053'))
          ])
        }
      })
    }
  })
}

const openModalCreateOrEditMoodboardCollection = (mode, nodeId) => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-moodboard-collection',
    properties: {
      mode,
      nodeId
    }
  })
}

const optionNode = (node) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    return [
      [
        { name: t('UU0027'), func: (n) => openModalCreateOrEditMoodboardCollection(CREATE_EDIT.EDIT, n.nodeId) },
        { name: t('UU0013'), func: (n) => deleteMoodboardNode([n]) }
      ]
    ]
  } else {
    return [
      [
        { name: t('UU0013'), func: (n) => deleteMoodboardNode([n]) }
      ]
    ]
  }
}

const optionMultiSelect = [
  { name: t('UU0013'), func: deleteMoodboardNode }
]
</script>
