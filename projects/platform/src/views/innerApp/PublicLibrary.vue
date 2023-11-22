<template lang="pug">
div(class="relative")
  search-table(
    :searchType="SEARCH_TYPE.INNER_EXTERNAL"
    :searchCallback="getPublicList"
    :optionSort="optionSort"
    :optionMultiSelect="optionMultiSelect"
    :canSelectAll="isNode"
    :itemList="nodeList"
    v-model:selectedItemList="selectedNodeList"
  )
    template(#header-left="{ visit, totalCount }")
      div(class="flex items-center")
        div(class="flex items-end")
          global-breadcrumb-list(
            :breadcrumbList="locationList"
            @click:item="$event.goTo(); visit()"
            fontSize="text-h6"
          )
          p(class="flex text-caption text-grey-600 pl-1")
            span (
            i18n-t(keypath="RR0068" tag="span" scope="global")
              template(#number) {{ totalCount }}
            span )
        f-tooltip-standard(
          v-if="isNode && workspaceNodeCollection"
          :tooltipMessage="$t('RR0167')"
        )
          template(#slot:tooltip-trigger)
            f-svg-icon(
              iconName="clone"
              class="text-grey-600 cursor-pointer hover:text-primary-400 ml-1"
              size="24"
              @click="publicLibraryClone([workspaceNodeCollection.nodeMeta.nodeId], workspaceNodeCollection.nodeMeta.isCanClone, $t('II0009'))"
            )
    template(#header-right)
      f-button(
        v-if="isNode"
        size="sm"
        type="secondary"
        @click="openModalCollectionDetail"
      ) {{ $t('UU0057') }}
    template(#sub-header)
      div(
        v-if="!isFirstLayer && workspaceNodeCollection"
        class="mx-7.5 mb-4 flex items-center gap-x-2"
      )
        i18n-t(
          keypath="II0002"
          tag="p"
          class="text-caption text-grey-600"
          scope="global"
        )
        f-avatar(
          type="org"
          size="md"
          :imageUrl="workspaceNodeCollection.nodeMeta.unitLogo"
        )
        p(v-if="isNode") {{ workspaceNodeCollection.nodeMeta.unitName }}
    template(v-if="isFirstLayer" #banner="{ inSearch, currentPage }")
      div(v-if="!inSearch && currentPage === 1" class="pb-6 px-7.5")
        showroom-banner(
          v-if="banner"
          :title="banner.title"
          :coverImg="banner.coverImg"
          :textColor="banner.color"
          :slotContent="banner.description"
        )
        div(class="mt-4 w-full")
          showroom-carousel(:showroomList="showroomList")
    template(#default="{ visit }")
      div(
        v-if="nodeList.length > 0"
        class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start"
      )
        grid-item-node(
          v-for="node in nodeList"
          :key="node.nodeMeta.nodeId"
          v-model:selectedValue="selectedNodeList"
          :node="node"
          :isSelectable="isNode"
          :optionList="optionNode"
          @click:node="handleNodeClick(node, visit)"
        )
          template(#caption v-if="isFirstLayer")
            div(
              class="mt-1.5 h-6 flex items-center"
              @click.stop="searchOrgId = node.nodeMeta.orgId; visit()"
            )
              f-avatar(:imageUrl="node.nodeMeta.unitLogo" type="org" size="sm")
              p(class="pl-1 font-bold text-caption text-grey-900") {{ node.nodeMeta.unitName }}
      div(v-else class="flex h-full justify-center items-end")
        p(class="text-body1 text-grey-900") {{ $t('II0007') }}
  div(v-if="planStatus.INACTIVE" class="absolute inset-0 z-99 opacity-30 bg-grey-0")
  notify-bar-inactive(
    v-if="planStatus.INACTIVE || planStatus.TRANSITION"
    class="absolute bottom-0 left-0 z-100"
  )
</template>

<script setup lang="ts">
import SearchTable, {
  type RouteQuery,
  type SearchPayload,
} from '@/components/common/SearchTable.vue'
import { SEARCH_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { watch, ref, computed } from 'vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import { useRoute, useRouter } from 'vue-router'
import usePublicLibrary from '@/composables/usePublicLibrary'
import useNavigation from '@/composables/useNavigation'
import NotifyBarInactive from '@/components/billings/NotifyBarInactive.vue'
import ShowroomCarousel from '@/components/showroom/ShowroomCarousel.vue'
import { useSearchStore } from '@/stores/search'
import { usePublicLibraryStore } from '@/stores/publicLibrary'
import {
  NodeType,
  type NodeChild,
  type WorkspaceNodeCollection,
  type InnerExternalFilter,
} from '@frontier/platform-web-sdk'
import type { PropsModalCollectionDetail } from '@/components/common/ModalCollectionDetail.vue'
import { useShowroomStore } from '@/stores/showroom'
import ShowroomBanner from '@/components/showroom/ShowroomBanner.vue'

const props = defineProps<{
  nodeId?: string
}>()

const currentNodeId = ref<number | null>(
  props.nodeId ? Number(props.nodeId) : null
)

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()
const searchStore = useSearchStore()
const { ogBasePublicLibraryApi } = usePublicLibraryStore()
const { publicLibraryClone, publicLibraryShare, publicLibraryCloneByNodeList } =
  usePublicLibrary()
const { goToPublicLibraryMaterialDetail } = useNavigation()
const { ogBaseShowroomApi } = useShowroomStore()
const { data } = await ogBaseShowroomApi('getShowroomBannerAndShowroomList')
const banner = data.result.banner
const showroomList = data.result.showroomList
const workspaceNodeCollection = ref<WorkspaceNodeCollection>()

const selectedNodeList = ref<NodeChild[]>([])
const searchOrgId = ref<number | null>(
  (route.query.searchOrgId as unknown as number) ?? null
)
const hasSpecifiedOrg = computed(() => searchOrgId.value !== null)

const optionSort = computed(() => {
  const {
    RANDOM,
    NEW_ARRIVED,
    GHG_LOW_TO_HIGH,
    WATER_LOW_TO_HIGH,
    LAND_LOW_TO_HIGH,
  } = searchStore.sortOption
  return {
    base: [
      RANDOM,
      NEW_ARRIVED,
      GHG_LOW_TO_HIGH,
      WATER_LOW_TO_HIGH,
      LAND_LOW_TO_HIGH,
    ],
    keywordSearch: [],
  }
})

const optionMultiSelect = computed(() => [publicLibraryCloneByNodeList])
const planStatus = computed(() => store.getters['polling/planStatus'])
const isNode = computed(
  () =>
    workspaceNodeCollection.value?.nodeMeta &&
    workspaceNodeCollection.value?.nodeMeta?.nodeId !== -1
)
const locationList = computed(() => {
  return [
    {
      name: t('RR0003'),
      goTo: () => {
        currentNodeId.value = null
        searchOrgId.value = null
      },
    },
    ...(workspaceNodeCollection.value?.nodeMeta?.locationList.map(
      ({ name, nodeId }, index) => {
        if (hasSpecifiedOrg.value && index === 0) {
          return {
            name,
            goTo: () => {
              currentNodeId.value = null
            },
          }
        }

        return {
          name,
          goTo: () => {
            currentNodeId.value = nodeId
          },
        }
      }
    ) ?? []),
  ]
})
const isFirstLayer = computed(() => locationList.value.length === 1)
const nodeList = computed(
  () => workspaceNodeCollection.value?.childNodeList ?? []
)
const optionNode = computed(() => [
  [publicLibraryCloneByNodeList, publicLibraryShare],
])

const getPublicList = async (
  payload: SearchPayload<InnerExternalFilter>,
  query: RouteQuery
) => {
  router.push({
    name: route.name as string,
    params: {
      nodeId: currentNodeId.value,
    },
    query: {
      searchOrgId: searchOrgId.value,
      ...query,
    },
  })
  const {
    data: { result },
  } = await ogBasePublicLibraryApi('getPublicLibraryList', {
    ...payload,
    nodeId: currentNodeId.value,
    searchOrgId: searchOrgId.value,
  })

  workspaceNodeCollection.value = result.workspaceNodeCollection
  searchStore.setPaginationRes(result.pagination)
}

const openModalCollectionDetail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-collection-detail',
    properties: {
      nodeMeta: workspaceNodeCollection.value?.nodeMeta,
      collection: workspaceNodeCollection.value?.collection,
      canEdit: false,
    } as PropsModalCollectionDetail,
  })
}

const handleNodeClick = (node: NodeChild, visit: Function) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    currentNodeId.value = node.nodeMeta.nodeId
    visit()
  } else {
    goToPublicLibraryMaterialDetail(
      {},
      node.nodeMeta.nodeId,
      node.nodeMeta.rank ?? undefined
    )
  }
}

watch(
  () => isFirstLayer.value,
  () => (selectedNodeList.value.length = 0)
)
</script>
