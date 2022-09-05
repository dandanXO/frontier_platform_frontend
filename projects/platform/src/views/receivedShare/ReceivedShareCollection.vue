<style lang="scss">
#pagination-container {
  padding-bottom: 152px;
}
</style>

<template lang="pug">
div(class="max-w-315 h-full mx-auto")
  search-table(
    :searchType="SEARCH_TYPE.SHARE"
    :optionSort="optionSort"
    :optionMultiSelect="optionMultiSelect"
    :searchCallback="getShareReceivedList"
    :itemList="nodeList"
    v-model:selectedItemList="selectedNodeList"
  )
    template(#header-left="{ goTo }")
      div(class="flex items-start")
        div(class="flex items-end pr-3")
          f-breadcrumb(:breadcrumbList="breadcrumbList" @click:item="(currentNodeKey = $event.nodeKey); goTo()" fontSize="text-h5")
          p(class="flex text-caption text-black-700 pl-1")
            span (
            i18n-t(keypath="RR0068" tag="span" scope="global")
              template(#number) {{ pagination.totalCount }}
            span )
        f-tooltip
          template(#trigger)
            f-svg-icon(iconName="clone" class="text-black-700 hover:text-brand cursor-pointer" size="24" @click="receivedShareCloneByNodeKey(currentNodeKey)")
          template(#content)
            p {{ $t("RR0056") }}
    template(#sub-header)
      f-expansion-panel(class="px-7.5 pb-8 pt-1.5")
        template(#trigger="{ isExpand }")
          div(class="w-full h-12 border border-primary-middle bg-black-0 flex items-center justify-between pl-7 pr-4 cursor-pointer"  :class="[isExpand ? 'rounded-t bg-black-200' : 'rounded']")
            h5(class="text-caption text-primary font-bold") {{ $t("RR0246") }}
            f-svg-icon(
              iconName="keyboard_arrow_right"
              size="20"
              class="transform text-primary"
              :class="[isExpand ? '-rotate-90' : 'rotate-90']"
            )
        template(#content)
          div(class="w-full h-81 border rounded-b !border-t-0 py-6 pl-7 pr-11 flex justify-between")
            div(class="w-155.5 h-full")
              f-scrollbar-container(:sizeAutoCapable="false" v-if="collection.description" class="h-full -ml-3 px-3 break-all text-body2 text-primary leading-1.6") {{ collection.description }}
              p(v-else class="text-body2 text-primary leading-1.6") {{ $t("FF0008") }}
            div(class="relative w-97.5 h-69 bg-black-400 flex items-center justify-center flex-shrink-0")
              a(v-if="collection.trendBoardCoverImg" :href="collection.trendBoardUrl" target="_blank" class="w-full h-full")
                img(:src="collection.trendBoardCoverImg" class="w-full h-full object-contain")
                div(class="absolute right-3.5 bottom-3.5 card-shadow w-7 h-7 rounded-sm bg-black-0 flex items-center justify-center")
                  f-svg-icon(iconName="open_in_new" class="text-black-700" size="24")
              div(v-else)
                f-svg-icon(iconName="folder_Large" size="110" class="text-black-0 mx-auto")
                p(class="text-body1 font-bold text-black-50 pt-3") {{ $t("RR0247") }}
    template(#default="{ goTo }")
      div(v-if="nodeList.length > 0" class="mx-7.5 grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start")
        grid-item-node(
          v-for="node in nodeList"
          v-model:selectedValue="selectedNodeList"
          :node="node"
          @click.stop="handleNodeClick(node, goTo)"
        )
          template(#hover-corner-bottom-left)
            f-svg-icon(
              iconName="clone"
              size="20"
              class="cursor-pointer text-black-500"
              @click.stop="receivedShareCloneByNodeKey(node.nodeKey)"
            )
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { SEARCH_TYPE, SORT_BY, NODE_TYPE } from '@/utils/constants.js'
import { useRoute, useRouter } from 'vue-router'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
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
