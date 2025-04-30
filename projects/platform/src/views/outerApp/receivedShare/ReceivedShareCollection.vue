<template lang="pug">
search-table(
  :searchType="SEARCH_TYPE.EXTERNAL"
  :optionSort="optionSort"
  :optionMultiSelect="optionMultiSelect"
  :searchCallback="getShareReceivedList"
  :itemList="nodeList"
  v-model:selectedItemList="selectedNodeList"
)
  template(#header-left="{ visit, totalCount }")
    div(class="flex items-start")
      div(class="flex items-end pr-3")
        global-breadcrumb-list(
          :breadcrumbList="locationList"
          @click:item="currentNodeId = $event.nodeId; visit()"
          fontSize="text-h5"
        )
        p(class="flex text-caption text-grey-600 pl-1")
          span (
          i18n-t(keypath="RR0068" tag="span" scope="global")
            template(#number) {{ totalCount }}
          span )
  template(#sub-header)
    collection-overview(
      v-if="workspaceNodeCollection"
      :collection="workspaceNodeCollection.collection"
    )
  template(#default="{ visit }")
    div(
      v-if="nodeList.length > 0"
      class="mx-7.5 grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-y-6.5 md:gap-x-5 grid-flow-row auto-rows-auto content-start"
    )
      grid-item-node(
        v-for="node in nodeList"
        :key="node.nodeMeta.nodeId"
        v-model:selectedValue="selectedNodeList"
        :node="node"
        @click:node="handleNodeClick(node, visit)"
        showReachOutEmail
        :showReachOutEmailCategory="reachOutEmailCategory.SharedDetailPage"
      )
        template(#corner-bottom-left)
          f-svg-icon(
            iconName="clone"
            size="20"
            class="cursor-pointer text-grey-250"
            @click.stop="receivedShareClone([node.nodeMeta.nodeId])"
          )
</template>

<script setup lang="ts">
import SearchTable, {
  type RouteQuery,
  type SearchPayload,
} from '@/components/common/SearchTable.vue'
import { computed, ref } from 'vue'
import { SEARCH_TYPE, reachOutEmailCategory } from '@/utils/constants'
import { useRoute, useRouter } from 'vue-router'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import useReceivedShare from '@/composables/useReceivedShare.js'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import CollectionOverview from '@/components/outerApp/CollectionOverview.vue'
import { useOuterStore } from '@/stores/outer'
import {
  type WorkspaceNodeCollection,
  type ExternalFilter,
  type NodeChild,
  NodeType,
} from '@frontier/platform-web-sdk'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  sharingKey: string
  nodeId: string
}>()

const currentNodeId = ref<number>(Number(props.nodeId))

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const outerStore = useOuterStore()
const { ogBaseReceivedShareApi } = outerStore
const { shareInfo } = storeToRefs(outerStore)
const workspaceNodeCollection = ref<WorkspaceNodeCollection>()
const { receivedShareClone, receivedShareCloneByNodeList } = useReceivedShare()
const { goToReceivedShareMaterial } = useNavigation()

const optionSort = computed(() => {
  const {
    ITEM_NO_A_Z_C_M,
    NEW_ARRIVED,
    GHG_LOW_TO_HIGH,
    WATER_LOW_TO_HIGH,
    LAND_LOW_TO_HIGH,
    RELEVANCE_M_C,
  } = searchStore.sortOption
  return {
    base: [
      ITEM_NO_A_Z_C_M,
      NEW_ARRIVED,
      {
        ...GHG_LOW_TO_HIGH,
        disabled: !shareInfo.value?.isSourceOrgHasMade2FlowPlan,
        tooltipMessage: t('VV0047'),
      },
      {
        ...WATER_LOW_TO_HIGH,
        disabled: !shareInfo.value?.isSourceOrgHasMade2FlowPlan,
        tooltipMessage: t('VV0047'),
      },
      {
        ...LAND_LOW_TO_HIGH,
        disabled: !shareInfo.value?.isSourceOrgHasMade2FlowPlan,
        tooltipMessage: t('VV0047'),
      },
    ],
    keywordSearch: [RELEVANCE_M_C],
  }
})

const optionMultiSelect = computed(() => [receivedShareCloneByNodeList])

const nodeList = computed(
  () => workspaceNodeCollection.value?.childNodeList ?? []
)
const locationList = computed(
  () => workspaceNodeCollection.value?.nodeMeta.locationList ?? []
)
const selectedNodeList = ref([])

const getShareReceivedList = async (
  payload: SearchPayload<ExternalFilter>,
  query: RouteQuery
) => {
  router.push({
    name: route.name as string,
    params: {
      sharingKey: props.sharingKey,
      nodeId: currentNodeId.value,
    },
    query,
  })
  const {
    data: { result },
  } = await ogBaseReceivedShareApi('getReceivedShareList', {
    ...payload,
    sharingKey: props.sharingKey,
    nodeId: currentNodeId.value,
    privateInfo: outerStore.getPrivateInfo(),
  })

  workspaceNodeCollection.value = result.workspaceNodeCollection
  searchStore.setPaginationRes(result.pagination)
}

const handleNodeClick = (node: NodeChild, visit: Function) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    searchStore.setKeyword('')
    currentNodeId.value = node.nodeMeta.nodeId
    visit()
  } else {
    goToReceivedShareMaterial(
      props.sharingKey,
      node.nodeMeta.nodeId,
      node.nodeMeta.rank ?? undefined
    )
  }
}
</script>
