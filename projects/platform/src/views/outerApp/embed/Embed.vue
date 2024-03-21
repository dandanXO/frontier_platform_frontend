<template lang="pug">
search-table(
  :searchType="SEARCH_TYPE.EXTERNAL"
  :canSelectAll="false"
  :optionSort="optionSort"
  :searchCallback="getEmbedList"
  :itemList="nodeList"
)
  template(#header-left="{ visit, totalCount }")
    div(class="flex items-center")
      img(:src="shareInfo?.unitLogo" class="w-10 h-10 rounded-full")
      div(class="flex items-end pl-2.5")
        global-breadcrumb-list(
          :breadcrumbList="locationList"
          @click:item="currentNodeId = $event.nodeId; visit()"
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
        :node="node"
        :isSelectable="false"
        @click:node="handleNodeClick(node, visit)"
      )
</template>

<script setup lang="ts">
import SearchTable, {
  type RouteQuery,
  type SearchPayload,
} from '@/components/common/SearchTable.vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import { SEARCH_TYPE } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CollectionOverview from '@/components/outerApp/CollectionOverview.vue'
import { useSearchStore } from '@/stores/search'
import { useOuterStore } from '@/stores/outer'
import useLogSender from '@/composables/useLogSender'
import {
  type WorkspaceNodeCollection,
  type ExternalFilter,
  type NodeChild,
  NodeType,
} from '@frontier/platform-web-sdk'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  sharingKey: string
  nodeId: string
}>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const outerStore = useOuterStore()
const { getEmbedInfo, ogBaseEmbedApi } = outerStore
const { shareInfo, privateInfo, isPrivate } = storeToRefs(outerStore)
const workspaceNodeCollection = ref<WorkspaceNodeCollection>()
const { goToEmbedMaterialDetail } = useNavigation()

await getEmbedInfo(props.sharingKey)

if (!shareInfo.value) {
  throw 'shareInfo is not defined'
}

/**
 * 因舊有的 URL 組成為 BASE_URL/sharingKey/nodeKey(NodeLocation-NodeId)，
 * 而新的 URL 組成為 BASE_URL/sharingKey/nodeId，
 * 所以如果直接取用 props.nodeId 會誤將 nodeKey(NodeLocation-NodeId) 當作 nodeId，
 * 造成無法正確取得資料，故取用 sharingKey 所取得的 shareInfo 中的 nodeId。
 */
const currentNodeId = ref<number>(shareInfo.value.nodeId)

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
        disabled: shareInfo.value?.isSourceOrgHasMade2FlowPlan,
        tooltipMessage: t('VV0047'),
      },
      {
        ...WATER_LOW_TO_HIGH,
        disabled: shareInfo.value?.isSourceOrgHasMade2FlowPlan,
        tooltipMessage: t('VV0047'),
      },
      {
        ...LAND_LOW_TO_HIGH,
        disabled: shareInfo.value?.isSourceOrgHasMade2FlowPlan,
        tooltipMessage: t('VV0047'),
      },
    ],
    keywordSearch: [RELEVANCE_M_C],
  }
})
const nodeList = computed(
  () => workspaceNodeCollection.value?.childNodeList ?? []
)
const locationList = computed(
  () => workspaceNodeCollection.value?.nodeMeta.locationList ?? []
)

const getEmbedList = async (
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
  } = await ogBaseEmbedApi('getEmbedList', {
    ...payload,
    sharingKey: props.sharingKey,
    nodeId: currentNodeId.value,
    accessCode: isPrivate.value ? privateInfo.value.accessCode : null,
  })

  workspaceNodeCollection.value = result.workspaceNodeCollection
  searchStore.setPaginationRes(result.pagination)
}

const handleNodeClick = (node: NodeChild, visit: Function) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    currentNodeId.value = node.nodeMeta.nodeId
    visit()
  } else {
    goToEmbedMaterialDetail(
      props.sharingKey,
      node.nodeMeta.nodeId,
      node.nodeMeta.rank ?? undefined
    )
  }
}

const logSender = useLogSender()

logSender.createEmbedPageLog(props.sharingKey)
</script>
