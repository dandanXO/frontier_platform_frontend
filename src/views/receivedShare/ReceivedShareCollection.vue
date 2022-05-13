<style lang="scss">
#pagination-container {
  padding-bottom: 152px;
}
</style>

<template lang="pug">
div(class="w-315 h-full mx-auto")
  search-table(
    :searchType="SEARCH_TYPE.SHARE"
    :optionSort="optionSort"
    :optionMultiSelect="optionMultiSelect"
    :searchCallback="getShareReceivedList"
    :itemList="nodeList"
    v-model:selectedItemList="selectedNodeList"
  )
    template(#header-above="{ goTo }")
      div(class="mx-7.5 pt-5 -mb-7")
        div(class="flex justify-between items-center pb-5")
          div(class="flex items-start")
            div(class="flex items-end pr-3")
              breadcrumb(:breadcrumbList="breadcrumbList" @click:item="(currentNodeKey = $event.nodeKey); goTo()" fontSize="text-h5")
              p(class="flex text-caption text-black-700 pl-1")
                span (
                i18n-t(keypath="RR0068" tag="span")
                  template(#number) {{ pagination.totalCount }}
                span )
            tooltip(placement="bottom")
              template(#trigger)
                svg-icon(iconName="clone" class="text-black-700 hover:text-brand cursor-pointer" size="24" @click="receivedShareCloneByNodeKey(currentNodeKey)")
              template(#content)
                p(class="text-caption text-primary px-3 py-1") {{ $t("RR0056") }}
          btn(size="sm" type="secondary" @click="isCollectionDetailExpand = !isCollectionDetailExpand") {{ isCollectionDetailExpand ? $t("UU0026") : $t("UU0071") }}
        div(v-if="isCollectionDetailExpand" class="flex items-start gap-x-9")
          div(class="relative w-97.5 h-69 bg-black-200 flex items-center justify-center flex-shrink-0")
            div(v-if="collection.trendBoardCoverImg" class="w-full h-full")
              img(:src="collection.trendBoardCoverImg" class="w-full h-full object-contain")
              a(:href="collection.trendBoardUrl" target="_blank" class="absolute right-3.5 bottom-3.5 card-shadow w-7 h-7 rounded-sm bg-black-0 flex items-center justify-center")
                svg-icon(iconName="search" class="text-black-700" size="24")
            p(v-else class="text-body2 text-black-400") {{ $t("FF0007") }}
          overlay-scrollbar-container(class="flex-grow h-61.5 max-w-193.5")
            p(v-if="collection.description" class="text-body2 text-primary leading-1.5") {{ collection.description }}
            div(v-else class="w-full h-full flex items-center justify-center")
              p(class="text-body2 text-primary") {{ $t("GG0028") }}
    template(#default="{ goTo }")
      div(v-if="nodeList.length > 0" class="mx-7.5 grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start")
        child-node-item(
          v-for="node in nodeList"
          v-model:selectedList="selectedNodeList"
          :node="node"
          :properties="node"
          :displayName="node.nodeType === NODE_TYPE.COLLECTION ? node.name : node.materialNo"
          @click.stop="handleNodeClick(node, goTo)"
        )
          template(#cover-overlay)
            svg-icon(
              iconName="clone"
              size="20"
              class="absolute bottom-3 right-3 cursor-pointer text-black-500"
              @click.stop="receivedShareCloneByNodeKey(node.nodeKey)"
            )
</template>

<script setup>
import SearchTable from '@/components/layout/SearchTable.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { SEARCH_TYPE, SORT_BY, NODE_TYPE } from '@/utils/constants.js'
import { useRoute, useRouter } from 'vue-router'
import ChildNodeItem from '@/components/layout/ChildNodeItem.vue'
import useReceivedShare from '@/composables/useReceivedShare.js'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation.js'

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const router = useRouter()
const props = defineProps({
  nodeKey: {
    type: String,
    required: true
  }
})

const { receivedShareCloneByNodeKey, receivedShareCloneByNodeList } = useReceivedShare()
const { goToReceivedShareMaterial } = useNavigation()

const optionSort = {
  base: [
    SORT_BY.MATERIAL_NO_A_Z_C_M,
    SORT_BY.NEW_ARRIVED
  ],
  keywordSearch: [
    SORT_BY.RELEVANCE_M_C
  ]
}
const optionMultiSelect = [
  {
    name: t('RR0167'),
    func: receivedShareCloneByNodeList
  }
]

const share = computed(() => store.getters['receivedShare/share'])
const pagination = computed(() => store.getters['helper/search/pagination'])
const nodeList = computed(() => store.getters['receivedShare/nodeList'])
const breadcrumbList = computed(() => store.getters['receivedShare/collectionBreadcrumbList']())
const collection = computed(() => store.getters['receivedShare/collection'])
const currentNodeKey = ref(props.nodeKey)
const selectedNodeList = ref([])
const isCollectionDetailExpand = ref(true)

const getShareReceivedList = async (targetPage = 1, query) => {
  await router.push({
    name: route.name,
    params: {
      nodeKey: currentNodeKey.value
    },
    query
  })
  await store.dispatch('receivedShare/getShareReceivedList', {
    targetPage,
    sharingKey: share.value.sharingKey,
    nodeKey: currentNodeKey.value
  })
}

const handleNodeClick = (node, goTo) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    currentNodeKey.value = node.nodeKey
    goTo()
  } else {
    goToReceivedShareMaterial(node.nodeKey, share.value.sharingKey)
  }
}


</script>
