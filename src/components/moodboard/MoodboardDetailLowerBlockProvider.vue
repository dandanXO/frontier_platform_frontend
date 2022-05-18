<template lang="pug">
div(class="h-242.5 pt-16 pb-6.5 px-8 bg-black-50 flex flex-col")
  div(class="pl-31 pb-13.5")
    h5(class="text-h5 font-bold text-primary pb-3") {{ $t('QQ0061') }}
    p(class="text-body2 text-black-500") {{ $t('QQ0062') }}
  div(class="bg-black-0 border-primary-middle border rounded flex-grow flex flex-col")
    div(class="flex pt-5")
      div(class="w-6 border-b border-black-400")
      tabs(:tabList="tabList" class="flex-grow" :initValue="currentTab" @switch="switchTab($event)")
      div(class="w-6 border-b border-black-400")
    div
      div(v-if="currentTab === MOODBOARD_TAB.OFFER" class="px-7 pt-4 flex-grow flex flex-col")
        div(class="flex justify-between items-center")
          input-text(
            v-model:textValue="keyword"
            size="sm"
            class="w-67.5"
            prependIcon="search"
            :placeholder="$t('RR0053')"
            @enter="search"
            @clear="search"
          )
          btn(v-if="currentTab === MOODBOARD_TAB.OFFER" size="sm" prependIcon="add" @click="addMaterialFromAssetsList") {{ $t("UU0055") }}
        div(class="py-2 flex justify-between items-center")
          breadcrumb(:breadcrumbList="moodboardOfferNodeCollection.locationList" @click:item="goTo($event.nodeId)" fontSize="text-body2")
          btn-functional(size="lg") {{ $t("RR0209") }}
        div(class="bg-black-50 h-10 flex items-center gap-x-3 pl-4")
          svg-icon(iconName="public" size="20" class="text-black-600")
          p(class="text-caption text-black-800") {{ $t('QQ0053') }}
        div(v-if="isLoading" class="flex-grow flex items-center justify-center")
          svg-icon(iconName="loading" size="92" class="text-brand")
        div(v-else class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start h-150 py-2 overflow-y-auto hide-scrollbar")
          div(v-if="currentTab === MOODBOARD_TAB.OFFER" class="aspect-square border border-black-400 border-dashed rounded-md flex justify-center items-center cursor-pointer" @click="openModalCreateOrEditMoodboardCollection(CREATE_EDIT.CREATE, currentNodeId)")
            div(class="flex flex-col justify-center items-center")
              svg-icon(iconName="add" size="24" class="text-primary mb-3.5")
              span(class="text-body1 text-primary") {{ $t("FF0003") }}
          child-node-item(
            v-for="node in moodboardOfferNodeCollection.childNodeList"
            v-model:selectedList="selectedNodeList"
            :node="node"
            :properties="node.properties"
            :displayName="node.nodeType === NODE_TYPE.COLLECTION ? node.properties.name : node.properties.materialNo"
            :optionList="optionNode(node.nodeType)"
            @click:option="$event.func(node)"
            @click.stop="handleNodeClick(node)"
          )
            template(#caption v-if="currentTab === MOODBOARD_TAB.PICKED && node.nodeType === NODE_TYPE.MATERIAL")
              tooltip(class="absolute right-0 -bottom-0.5" placement="top")
                template(#trigger)
                  div(class="w-6.5 h-6.5 group hover:bg-brand/10 rounded-full flex items-center justify-center")
                    svg-icon(size="20" iconName="bookmark" class="text-brand group-hover:text-brand")
                template(#content)
                  p(class="text-caption text-primary p-2.5 whitespace-nowrap") {{ $t('QQ0081') }}
      mood-board-comment(
        v-if="currentTab === MOODBOARD_TAB.COMMENT"
        :moodboardId="moodboard.moodboardId"
        :offerId="moodboard.properties.myOfferId"  
      )
multi-select-menu(:optionMultiSelect="optionMultiSelect" v-model:selectedList="selectedNodeList")
</template>

<script setup>
import { h, watch, computed, ref, shallowRef } from 'vue'
import { useStore } from 'vuex'
import { MOODBOARD_TAB, CREATE_EDIT, NODE_TYPE } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import ChildNodeItem from '@/components/layout/ChildNodeItem.vue'
import SvgIcon from '@/components/common/SvgIcon.vue'
import MultiSelectMenu from '@/components/layout/MultiSelectMenu.vue'
import MoodBoardComment from '@/components/moodboard/MoodBoardComment.vue'

const store = useStore()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const moodboard = computed(() => store.getters['moodboard/moodboard'])
const moodboardOfferNodeCollection = computed(() => store.getters['moodboard/moodboardOfferNodeCollection'])

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
    showNotification: moodboard.value.properties.hasNewComment
  }
])

const addMaterialFromAssetsList = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-assets-list',
    properties: {
      modalTitle: t('FF0016'),
      actionText: t('UU0035'),
      actionCallback: async (materialList) => {
        await store.dispatch('moodboard/addMaterialToMoodboardNode', {
          nodeId: currentNodeId.value,
          materialIdList: materialList.map(({ materialId }) => materialId)
        })
        store.dispatch('helper/closeModalBehavior')
      },
      noteComponent: shallowRef({
        render: () => {
          return h('div', { class: 'flex items-center text-black-600' }, [
            h(SvgIcon, { iconName: 'info_outline', size: "20" }),
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

const switchTab = (tab) => {
  router.push({ name: route.name, query: { tab: tab.path } })
}

const keyword = ref('')
const currentTab = computed(() => route.query.tab)
const currentNodeId = computed(() => Number(route.query.nodeId) || moodboard.value.properties.myRootNodeId)
const selectedNodeList = ref([])
const isLoading = ref(false)

const deleteMoodboardNode = (nodeType, nodeIdList) => {
  store.dispatch('helper/openModalConfirm', {
    type: 1,
    header: nodeType === NODE_TYPE.COLLECTION ? t('QQ0072') : t('QQ0065'),
    content: nodeType === NODE_TYPE.COLLECTION ? t('QQ0073') : t('QQ0066'),
    primaryBtnText: t('UU0091'),
    primaryBtnHandler: async () => {
      await store.dispatch('moodboard/deleteMoodboardNode', { nodeIdList })
      store.dispatch('helper/reloadInnerApp')
    },
    secondaryBtnText: t('UU0002')
  })
}

const optionNode = (nodeType) => {
  if (nodeType === NODE_TYPE.COLLECTION) {
    return [
      [
        { name: t('UU0027'), func: (node) => openModalCreateOrEditMoodboardCollection(CREATE_EDIT.EDIT, node.nodeId) },
        { name: t('UU0013'), func: (node) => deleteMoodboardNode(nodeType, [node.nodeId]) }
      ]
    ]
  } else {
    return [
      [
        { name: t('UU0013'), func: (node) => deleteMoodboardNode(nodeType, [node.nodeId]) }
      ]
    ]
  }
}

const optionMultiSelect = [
  { name: t('UU0013'), func: (nodeList) => deleteMoodboardNode(NODE_TYPE.MATERIAL, nodeList.map(({ nodeId }) => nodeId)) }
]

const handleNodeClick = (node) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    goTo(node.nodeId)
  } else {
    // go to detail page
  }
}

const goTo = (nodeId) => {
  keyword.value = ''
  router.push({ name: route.name, query: { tab: currentTab.value, nodeId } })
}


const search = async () => {
  isLoading.value = true
  if (currentTab.value === MOODBOARD_TAB.OFFER) {
    await store.dispatch('moodboard/getMoodboardNodeCollection', {
      moodboardId: moodboard.value.moodboardId,
      nodeId: currentNodeId.value,
      keyword: keyword.value || null
    })
  } else if (currentTab.value === MOODBOARD_TAB.PICKED) {
    await store.dispatch('moodboard/getPickedMoodboardNode', {
      moodboardId: moodboard.value.moodboardId,
      offerId: moodboard.value.properties.myOfferId,
      keyword: keyword.value || null
    })
  }
  isLoading.value = false
}

watch(
  [() => currentTab.value, () => currentNodeId.value],
  async () => {
    await search()
  },
  {
    immediate: true
  }
)

</script>
