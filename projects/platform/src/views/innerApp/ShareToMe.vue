<template lang="pug">
search-table(
  :searchType="SEARCH_TYPE.INNER_EXTERNAL"
  :searchCallback="getShareToMeList"
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
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
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
  type ShareNodeCollection,
  NodeType,
} from '@frontier/platform-web-sdk'
import useCurrentUnit from '@/composables/useCurrentUnit'
import type { PropsModalCollectionDetail } from '@/components/common/collection/ModalCollectionDetail.vue'

const props = defineProps<{
  sharingId?: string
  nodeId?: string
}>()

const currentSharingId = ref<number | null>(
  props.sharingId ? Number(props.sharingId) : null
)

const currentNodeId = ref<number | null>(
  props.nodeId ? Number(props.nodeId) : null
)

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()
const searchStore = useSearchStore()
const { ogNodeId } = useCurrentUnit()
const { ogBaseShareToMeApi } = useShareToMeStore()
const { shareToMeClone, shareToMeCloneByNodeList, shareToMeDeleteByNodeList } =
  useShareToMe()
const { goToShareToMeMaterial, goToWorkspace } = useNavigation()

const shareNodeCollection = ref<ShareNodeCollection>()

const tabList = ref([
  {
    name: t('FF0001'),
    id: 'workspace',
    goTo: goToWorkspace.bind(null, {}, ogNodeId.value),
  },
  {
    name: t('RR0010'),
    id: 'share-to-me',
    goTo: () => {},
  },
])

const optionSort = computed(() => {
  const { ITEM_NO_A_Z_C_M, LAST_UPDATE, RELEVANCE_C_M } = searchStore.sortOption
  return {
    base: [ITEM_NO_A_Z_C_M, LAST_UPDATE],
    keywordSearch: [RELEVANCE_C_M],
  }
})
const optionMultiSelect = computed(() => {
  return isFirstLayer.value
    ? [shareToMeDeleteByNodeList]
    : [shareToMeCloneByNodeList]
})
const locationList = computed(() => {
  const root = {
    name: t('RR0010'),
    nodeId: -1,
  }
  return shareNodeCollection.value && shareNodeCollection.value.nodeMeta
    ? [root, ...shareNodeCollection.value.nodeMeta.locationList]
    : [root]
})
const isFirstLayer = computed(() => locationList.value.length === 1)
const nodeList = computed(() => shareNodeCollection.value?.childNodeList ?? [])
const optionNode = computed(() => {
  const optionList = [[shareToMeCloneByNodeList]]
  if (isFirstLayer.value) {
    optionList[0].push(shareToMeDeleteByNodeList)
  }
  return optionList
})
const selectedNodeList = ref([])
const isFirstTime = ref(true)
const haveMsgAndFirstRead = computed(
  () => !!shareNodeCollection.value?.shareInfo.message && isFirstTime.value
)

const getShareToMeList = async (
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
    ...payload,
  })

  shareNodeCollection.value = result.shareNodeCollection
  searchStore.setPaginationRes(result.pagination)
}

const openModalCollectionDetail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-collection-detail',
    properties: {
      nodeMeta: shareNodeCollection.value?.nodeMeta,
      collection: shareNodeCollection.value?.collection,
      canEdit: false,
    } as PropsModalCollectionDetail,
  })
}

const openModalShareMessage = () => {
  isFirstTime.value = false
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-share-message',
    properties: {
      message: shareNodeCollection.value?.shareInfo.message,
    },
  })
}

const setSharingIdAndNodeKey = (nodeId: number, targetSharingId?: number) => {
  if (nodeId === -1 && !targetSharingId) {
    currentSharingId.value = null
    currentNodeId.value = null
    return
  }

  currentNodeId.value = nodeId
  if (targetSharingId) {
    currentSharingId.value = targetSharingId
  }
}

const handleNodeClick = (node: ShareNodeChild, visit: Function) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    setSharingIdAndNodeKey(node.nodeMeta.nodeId, node.shareInfo.sharingId)
    visit()
  } else {
    goToShareToMeMaterial(
      {},
      node.shareInfo.sharingId,
      node.nodeMeta.nodeId,
      node.nodeMeta.rank ?? undefined
    )
  }
}
</script>
