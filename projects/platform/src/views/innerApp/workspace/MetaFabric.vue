<template lang="pug">
search-table(
  :searchType="SEARCH_TYPE.INNER_EXTERNAL"
  :searchCallback="getMetaFabricList"
  :optionSort="optionSort"
  :optionMultiSelect="optionMultiSelect"
  :itemList="nodeList"
  v-model:selectedItemList="selectedNodeList"
)
  template(#box-above)
    f-tabs(
      :tabList="tabList"
      class="py-4 px-7.5"
      :initValue="tabList[1].id"
      keyField="id"
      @switch="$event.goTo()"
    )
  template(#header-left="{ visit, totalCount }")
    div(class="flex items-center")
      div(class="flex items-end")
        global-breadcrumb-list(
          :breadcrumbList="locationList"
          @click:item="setSharingIdAndNodeKey($event.nodeId); visit()"
          fontSize="text-h6"
        )
        p(class="flex text-caption text-grey-600 pl-1")
          span (
          i18n-t(keypath="RR0068" tag="span" scope="global")
            template(#number) {{ totalCount }}
          span )
      f-tooltip-standard(
        v-if="!isFirstLayer && shareNodeCollection"
        :tooltipMessage="$t('RR0056')"
      )
        template(#slot:tooltip-trigger)
          f-svg-icon(
            iconName="clone"
            class="text-grey-600 cursor-pointer hover:text-primary-400 ml-1"
            size="24"
            @click="shareToMeClone(shareNodeCollection.shareInfo.sharingId, [shareNodeCollection.nodeMeta.nodeId], shareNodeCollection.shareInfo.isCanClone, $t('II0009'))"
          )
  template(#header-right)
    div(
      v-if="!isFirstLayer"
      class="relative cursor-pointer"
      @click="openModalShareMessage"
    )
      f-svg-icon(iconName="chat" size="24" class="text-grey-600")
      div(
        v-if="haveMsgAndFirstRead"
        class="absolute -top-px -right-px w-2 h-2 rounded-full border border-grey-0 bg-red-400"
      )
    f-button(
      v-if="!isFirstLayer"
      size="sm"
      type="secondary"
      @click="openModalCollectionDetail"
    ) {{ $t('UU0057') }}
  template(v-if="!isFirstLayer" #sub-header)
    div(
      v-if="shareNodeCollection"
      class="mx-7.5 mb-7.5 text-caption text-grey-600 flex items-center"
    )
      p(class="pr-2.5") {{ shareNodeCollection.nodeMeta.unitName }}
      p {{ $t('RR0148') }} {{ toYYYYMMDDFormat(shareNodeCollection.shareInfo.shareDate) }}
  template(#default="{ inSearch, visit }")
    div(
      v-if="nodeList.length > 0"
      class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start"
    )
      grid-item-node(
        v-for="node in nodeList"
        :key="node.nodeMeta.nodeId"
        v-model:selectedValue="selectedNodeList"
        :node="node"
        :optionList="optionNode"
        @click:node="handleNodeClick(node, visit)"
      )
        template(#title-right-icon)
          tooltip-location(
            v-if="inSearch"
            :locationList="node.nodeMeta.locationList"
          )
        template(#caption v-if="isFirstLayer")
          div(class="mt-1.5 h-6 flex items-center")
            img(
              :src="node.nodeMeta.unitLogo"
              class="aspect-square h-full rounded-full"
            )
            p(class="pl-1 font-bold text-caption text-grey-900") {{ node.nodeMeta.unitName }}
    div(v-else class="flex h-full justify-center items-center")
      p(class="text-body1 text-grey-900") {{ $t('HH0001') }}
</template>

<script setup lang="ts">
import SearchTable, {
  type RouteQuery,
  type SearchPayload,
} from '@/components/common/SearchTable.vue'
import { SEARCH_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import TooltipLocation from '@/components/common/TooltipLocation.vue'
import { useRoute, useRouter } from 'vue-router'
import useShareToMe from '@/composables/useShareToMe'
import useNavigation from '@/composables/useNavigation'
import { toYYYYMMDDFormat } from '@frontier/lib'
import { useSearchStore } from '@/stores/search'
import { useShareToMeStore } from '@/stores/shareToMe'
import {
  type InnerExternalFilter,
  type ShareNodeChild,
  NodeType,
} from '@frontier/platform-web-sdk'
import useWorkspaceCommon from '@/composables/workspace/useWorkspaceCommon'
import useNode from '@/composables/useNode'

const props = defineProps<{
  sharingId?: string
  nodeId?: string
}>()

const { t } = useI18n()
const {
  currentSharingId,
  currentNodeId,
  setSharingIdAndNodeKey,
  shareNodeCollection,
  locationList,
  isFirstLayer,
  nodeList,
  optionMultiSelect,
  optionNode,
  selectedNodeList,
  haveMsgAndFirstRead,
  openModalCollectionDetail,
  openModalShareMessage,
} = useNode('metaFabric', props.nodeId, props.sharingId)

const router = useRouter()
const route = useRoute()
const searchStore = useSearchStore()
const { ogBaseShareToMeApi } = useShareToMeStore()
const { shareToMeClone } = useShareToMe()
const { goToMetaFabricMaterialDetail } = useNavigation()
const { tabList } = useWorkspaceCommon()

const optionSort = computed(() => {
  const { ITEM_NO_A_Z_C_M, LAST_UPDATE, RELEVANCE_C_M } = searchStore.sortOption
  return {
    base: [ITEM_NO_A_Z_C_M, LAST_UPDATE],
    keywordSearch: [RELEVANCE_C_M],
  }
})

// Note: MetaFabric call the same API with ShareToMe
const getMetaFabricList = async (
  payload: SearchPayload<InnerExternalFilter>,
  query: RouteQuery
) => {
  router.push({
    name: route.name as string,
    params: {
      sharingId: currentSharingId.value,
      nodeId: currentNodeId.value,
    },
    query,
  })
  const {
    data: { result },
  } = await ogBaseShareToMeApi('getShareToMeList', {
    sharingId: currentSharingId.value,
    nodeId: currentNodeId.value,
    isFromMetaFabric: true,
    ...payload,
  })

  shareNodeCollection.value = result.shareNodeCollection
  searchStore.setPaginationRes(result.pagination)
}

const handleNodeClick = (node: ShareNodeChild, visit: Function) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    searchStore.setKeyword('')
    setSharingIdAndNodeKey(node.nodeMeta.nodeId, node.shareInfo.sharingId)
    visit()
  } else {
    goToMetaFabricMaterialDetail(
      {},
      node.shareInfo.sharingId,
      node.nodeMeta.nodeId,
      node.nodeMeta.rank ?? undefined
    )
  }
}
</script>
