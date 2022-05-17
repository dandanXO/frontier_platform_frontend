<template lang="pug">
div(class="h-242.5 pt-16 pb-6.5 px-8 bg-black-50 flex flex-col")
  div(class="pl-31 pb-13.5")
    h5(class="text-h5 font-bold text-primary pb-3") {{ $t('QQ0016') }}
    p(class="text-body2 text-black-500") {{ $t('QQ0017') }}
  div(class="flex-grow flex gap-x-5.5")
    div(class="w-52 shrink-0 h-full")
      btn(size="md" prependIcon="add" class="w-full" @click="openModalMoodboardShareList") {{ $t('UU0096') }}
      div(
        class="w-full h-23 rounded flex flex-col justify-center pl-6 mt-6 hover:bg-black-200"
        :class="[{ 'bg-black-400': currentOfferId === 'all' }]"
        @click="switchOffer('all', null)"
      )
        p(class="text-body1 font-bold text-primary leading-1.6") {{ $t('RR0052') }}
        p(class="text-caption text-black-800 leading-1.6") {{ $t('RR0201', { number: moodboardOfferList.length }) }}・{{ $t('RR0068', { number: totalOfferItemCounts }) }}
      div(class="border-t border-b border-primary-middle py-2 max-h-156 grid gap-y-2 overflow-y-scroll")
        div(
          v-for="offer in moodboardOfferList"
          class="h-20 flex items-center gap-x-3 pl-3 rounded hover:bg-black-200"
          :class="[{ 'bg-black-400': Number(currentOfferId) === offer.offerId }]"
          @click="switchOffer(offer.offerId, offer.rootNodeId)"
        )
          img(:src="offer.logo" class="w-8 h-8 rounded-full")
          div
            p(class="text-body1 font-bold text-primary leading-1.6") {{ offer.name }}
            p(class="text-caption text-black-800 leading-1.6") {{ $t('RR0068', { number: offer.itemCounts }) }}・{{ offer.lastUpdateTime }}
    div(class="flex-grow bg-black-0 border-primary-middle border rounded h-full")
      div(v-if="moodboardOfferList.length === 0" class="text-center pt-30")
        h4(class="text-h4 text-primary pb-6") {{ $t('QQ0018') }}
        p(class="text-body2 text-black-700") {{ $t('QQ0019') }}
      template(v-else)
        div(class="h-full flex flex-col")
          div(v-if="currentOfferId !== 'all'" class="flex px-6 pt-5 -mx-6")
            div(class="w-6 border-b border-black-400")
            tabs(:tabList="tabList" :initValue="currentTab" class="flex-grow" @switch="switchTab($event)")
            div(class="w-6 border-b border-black-400")
          div(v-if="currentTab !== MOODBOARD_TAB.COMMENT" class="px-6")
            div(class="flex justify-between items-center pt-4")
              input-text(
                v-model:textValue="keyword"
                size="sm"
                class="w-67.5"
                prependIcon="search"
                :placeholder="$t('RR0053')"
                @enter="search"
                @clear="search"
              )
              btn(v-if="currentOfferId === 'all'" size="sm" type="secondary" prependIcon="bookmark") {{ $t("QQ0029") }}
            div(class="pt-3 pb-3.5 h-6 box-content flex items-center justify-between")
              breadcrumb(:breadcrumbList="moodboardOfferNodeCollection.locationList" fontSize="text-body2" @click:item="goTo($event.nodeId)")
              btn-functional(v-if="currentOfferId !== 'all' && currentTab === MOODBOARD_TAB.PICKED" size="lg") {{ $t("RR0209") }}
            div(v-if="isLoading" class="flex-grow flex items-center justify-center")
              svg-icon(iconName="loading" size="92" class="text-brand")
            div(v-else
              class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start pb-2 overflow-y-auto hide-scrollbar"
              :class="[currentOfferId === 'all' ? 'h-170' : 'h-156']"
            )
              child-node-item(
                v-for="node in moodboardOfferNodeCollection.childNodeList"
                :node="node"
                :properties="node.properties"
                :isSelectable="false"
                :displayName="node.nodeType === NODE_TYPE.COLLECTION ? node.properties.name : node.properties.materialNo"
                @click.stop="handleNodeClick(node)"
              )
                template(#caption v-if="node.nodeType === NODE_TYPE.MATERIAL")
                  tooltip(class="absolute right-0 -bottom-0.5" placement="top")
                    template(#trigger)
                      div(class="w-6.5 h-6.5 group cursor-pointer hover:bg-brand/10 rounded-full flex items-center justify-center" @click="togglePick(node)")
                        svg-icon(
                          size="20"
                          :iconName="node.isPicked ? 'bookmark' : 'bookmark_border'"
                          :class="[node.isPicked ? 'text-brand' : 'text-black-800']"
                          class="group-hover:text-brand"
                        )
                    template(#content)
                      p(class="text-caption text-primary p-2.5 whitespace-nowrap") {{ node.isPicked ? $t('QQ0081') : $t('QQ0082') }}
          mood-board-comment(
            v-if="currentTab === MOODBOARD_TAB.COMMENT"
            :moodboardId="moodboard.moodboardId"
            :offerId="Number(currentOfferId)"
          )
</template>

<script setup>
import { computed, ref } from '@vue/reactivity'
import { watch } from 'vue'
import { useStore } from 'vuex'
import { MOODBOARD_TAB, NODE_TYPE } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import ChildNodeItem from '@/components/layout/ChildNodeItem.vue'
import MoodBoardComment from '@/components/moodboard/MoodBoardComment.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const tabList = [
  { name: t('QQ0051'), path: MOODBOARD_TAB.OFFER },
  { name: t('QQ0052'), path: MOODBOARD_TAB.PICKED },
  { name: t('QQ0031'), path: MOODBOARD_TAB.COMMENT }
]

const openModalMoodboardShareList = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-moodboard-share-list',
  })
}

const moodboard = computed(() => store.getters['moodboard/moodboard'])
const moodboardOfferList = computed(() => store.getters['moodboard/moodboardOfferList'])
const totalOfferItemCounts = computed(() => moodboardOfferList.value.reduce((prev, current) => prev + current.itemCounts, 0))
const moodboardOfferNodeCollection = computed(() => store.getters['moodboard/moodboardOfferNodeCollection'])

const keyword = ref('')
const currentTab = computed(() => route.query.tab || MOODBOARD_TAB.OFFER)
const currentOfferId = computed(() => route.query.offerId || 'all')
const currentNodeId = computed(() => route.query.nodeId || null)
const isLoading = ref(false)

const switchOffer = (offerId, nodeId) => {
  keyword.value = ''
  const query = offerId === 'all'
    ? { tab: MOODBOARD_TAB.OFFER, offerId: 'all', nodeId: null }
    : { tab: currentTab.value, offerId, nodeId }
  router.push({ name: route.name, query })
}

const switchTab = (tab) => {
  keyword.value = ''
  router.push({ name: route.name, query: { tab: tab.path, offerId: currentOfferId.value, nodeId: moodboardOfferNodeCollection.value.locationList[0].nodeId } })
}

const goTo = (nodeId) => {
  keyword.value = ''
  router.push({ name: route.name, query: { tab: currentTab.value, offerId: currentOfferId.value, nodeId } })
}

const handleNodeClick = (node) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    goTo(node.nodeId)
  } else {
    // go to detail page
  }
}

const togglePick = async (node) => {
  if (node.isPicked) {
    store.dispatch('moodboard/unpickMoodboardNode', { nodeId: node.nodeId })
    if (currentTab.value === MOODBOARD_TAB.PICKED) {
      const index = moodboardOfferNodeCollection.value.childNodeList.findIndex(cNode => cNode.nodeId === node.nodeId)
      moodboardOfferNodeCollection.value.childNodeList.splice(index, 1)
    }
  } else {
    store.dispatch('moodboard/pickMoodboardNode', { nodeId: node.nodeId })
  }
  node.isPicked = !node.isPicked
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
      offerId: currentOfferId.value,
      keyword: keyword.value || null
    })
  }
  isLoading.value = false
}


watch(
  [() => currentOfferId.value, () => currentTab.value, () => currentNodeId.value],
  async () => {
    await search()
  },
  {
    immediate: true
  }
)
</script>
