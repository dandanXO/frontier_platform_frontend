<template lang="pug">
search-table(
  class="flex-grow"
  :searchType="SEARCH_TYPE.WORKSPACE"
  :searchCallback="getWorkspace"
  :optionSort="optionSort"
  :optionMultiSelect="optionMultiSelect"
  :itemList="nodeList"
  testId="workspace-name-header"
  v-model:selectedItemList="selectedNodeList"
)
  template(#box-above)
    f-tabs(
      :tabList="tabList"
      class="py-4 px-7.5"
      :initValue="tabList[0].id"
      keyField="id"
      @switch="$event.goTo()"
    )
  template(#header-left="{ visit, totalCount }")
    div(class="flex items-end")
      global-breadcrumb-list(
        :breadcrumbList="locationList"
        @click:item="(item: any) => onClickBreadcrumbItem(item, visit)"
        fontSize="text-h6"
      )
      p(class="flex text-caption text-grey-600 pl-1")
        span (
        i18n-t(keypath="RR0068" tag="span" scope="global")
          template(#number) {{ totalCount }}
        span )
  template(#header-right)
    f-button(
      v-if="!isFirstLayer"
      size="sm"
      type="secondary"
      @click="openModalCollectionDetail"
    ) {{ $t('UU0057') }}
    f-button(
      size="sm"
      prependIcon="add"
      @click="createCollection"
      data-cy="create-new-collection"
    ) {{ $t('FF0003') }}
  template(v-if="!isFirstLayer" #sub-header)
    p(
      v-if="workspaceNodeCollection?.nodeMeta.createDate"
      class="mx-7.5 mb-7.5 text-caption text-grey-600"
    ) {{ $t('FF0002') }}: {{ toYYYYMMDDFormat(workspaceNodeCollection.nodeMeta.createDate) }}
  template(#default="{ inSearch, visit }")
    div(
      class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start"
    )
      div(
        class="aspect-square border border-grey-250 border-dashed rounded-md flex justify-center items-center cursor-pointer"
        data-cy="add-asset-inside-workspace"
        @click="openModalAssetsList"
      )
        div(class="flex flex-col justify-center items-center")
          f-svg-icon(iconName="add" size="24" class="text-grey-900 mb-3.5")
          span(class="text-body1 text-grey-900") {{ $t('UU0055') }}
      grid-item-node(
        v-for="(node, index) in nodeList"
        :key="node.nodeMeta.nodeId"
        v-model:selectedValue="selectedNodeList"
        :node="node"
        :optionList="optionNode(node)"
        @click:node="handleNodeClick(node, visit)"
        :testId="`workspace-item-${index}`"
      )
        template(#corner-bottom-left v-if="showPublicLibrary && isFirstLayer")
          f-svg-icon(
            :iconName="node.nodeMeta.isPublic ? 'public' : 'internal'"
            :tooltipMessage="node.nodeMeta.isPublic ? $t('FF0072') : $t('FF0073')"
            size="20"
            class="cursor-pointer text-grey-250"
            @click.stop="openModalPublish(node.nodeMeta)"
          )
        template(#title-right-icon)
          tooltip-location(
            v-if="inSearch"
            :locationList="node.nodeMeta.locationList"
          )
</template>

<script setup lang="ts">
import SearchTable, {
  type RouteQuery,
  type SearchPayload,
} from '@/components/common/SearchTable.vue'
import { SEARCH_TYPE, CREATE_EDIT } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { computed } from 'vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import TooltipLocation from '@/components/common/TooltipLocation.vue'
import { useRoute, useRouter } from 'vue-router'
import useWorkspace from '@/composables/useWorkspace'
import useNavigation from '@/composables/useNavigation'
import { toYYYYMMDDFormat } from '@frontier/lib'
import { useWorkspaceStore } from '@/stores/workspace'
import { useSearchStore } from '@/stores/search'
import {
  NodeType,
  type NodeChild,
  type NodeMeta,
  type WorkspaceFilter,
} from '@frontier/platform-web-sdk'
import type { PropsModalCollectionDetail } from '@/components/common/collection/ModalCollectionDetail.vue'
import type { PropsModalAssetsList } from '@/components/assets/ModalAssetsList.vue'
import type { PropsModalItemNoList } from '@/components/common/material/ModalItemNoList.vue'
import { useAssetsStore } from '@/stores/assets'
import useWorkspaceCommon from '@/composables/workspace/useWorkspaceCommon'
import useNode from '@/composables/useNode'

const props = defineProps<{
  nodeId: string
}>()

const { t } = useI18n()
const store = useStore()
const searchStore = useSearchStore()
const { ogBaseAssetsApi } = useAssetsStore()
const { ogBaseWorkspaceApi } = useWorkspaceStore()
const notify = useNotifyStore()
const router = useRouter()
const route = useRoute()
const { goToWorkspaceMaterialDetail } = useNavigation()
const { tabList } = useWorkspaceCommon()
const {
  currentNodeId,
  selectedNodeList,
  workspaceNodeCollection,
  locationList,
  nodeList,
  isFirstLayer,
} = useNode('workspace', props.nodeId)
const {
  editNodeCollection,
  editNodeMaterial,
  duplicateNode,
  moveNode,
  shareNode,
  deleteCollection,
  deleteMaterial,
  deleteMultipleNode,
  openModalCreateOrEditCollection,
} = useWorkspace()

const showPublicLibrary = computed(
  () =>
    store.getters['permission/notLittleKingRule'] &&
    !store.getters['permission/isFabriSelectAccount']
)

const onClickBreadcrumbItem = (item: any, visit: VoidFunction) => {
  currentNodeId.value = item.nodeId
  visit()
}

const optionSort = computed(() => {
  const {
    ITEM_NO_A_Z_C_M,
    ITEM_NO_A_Z_M_C,
    CREATE_DATE_C_M,
    CREATE_DATE_M_C,
    GHG_LOW_TO_HIGH,
    WATER_LOW_TO_HIGH,
    LAND_LOW_TO_HIGH,
    RELEVANCE_C_M,
    RELEVANCE_M_C,
  } = searchStore.sortOption
  const valueAddedService = computed(
    () => store.getters['polling/valueAddedService']
  )
  return {
    base: [
      ITEM_NO_A_Z_C_M,
      ITEM_NO_A_Z_M_C,
      CREATE_DATE_C_M,
      CREATE_DATE_M_C,
      {
        ...GHG_LOW_TO_HIGH,
        disabled: !valueAddedService.value.made2flow.planStatus.ACTIVATE,
        tooltipMessage: t('VV0047'),
      },
      {
        ...WATER_LOW_TO_HIGH,
        disabled: !valueAddedService.value.made2flow.planStatus.ACTIVATE,
        tooltipMessage: t('VV0047'),
      },
      {
        ...LAND_LOW_TO_HIGH,
        disabled: !valueAddedService.value.made2flow.planStatus.ACTIVATE,
        tooltipMessage: t('VV0047'),
      },
    ],
    keywordSearch: [RELEVANCE_C_M, RELEVANCE_M_C],
  }
})
const optionMultiSelect = computed(() => [deleteMultipleNode])
const optionNode = (node: NodeChild) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    return [
      [editNodeCollection],
      [duplicateNode, moveNode, shareNode],
      [deleteCollection],
    ]
  } else {
    return [[editNodeMaterial], [moveNode, shareNode], [deleteMaterial]]
  }
}

const getWorkspace = async (
  payload: SearchPayload<WorkspaceFilter>,
  query: RouteQuery
) => {
  router.push({
    name: route.name as string,
    params: {
      nodeId: currentNodeId.value,
    },
    query,
  })
  const {
    data: { result },
  } = await ogBaseWorkspaceApi('getWorkspaceList', {
    nodeId: currentNodeId.value,
    ...payload,
  })

  workspaceNodeCollection.value = result.workspaceNodeCollection
  searchStore.setPaginationRes(result.pagination)
}

const createCollection = () => {
  workspaceNodeCollection.value &&
    openModalCreateOrEditCollection(
      CREATE_EDIT.CREATE,
      workspaceNodeCollection.value.nodeMeta,
      workspaceNodeCollection.value.collection
    )
}

const openModalCollectionDetail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-collection-detail',
    properties: {
      nodeMeta: workspaceNodeCollection.value?.nodeMeta,
      collection: workspaceNodeCollection.value?.collection,
      canEdit: true,
    } as PropsModalCollectionDetail,
  })
}

const openModalAssetsList = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-assets-list',
    properties: {
      modalTitle: t('RR0008'),
      actionText: t('UU0035'),
      actionCallback: async (materialIdList) => {
        const {
          data: {
            result: { failMaterialItemNoList },
          },
        } = await ogBaseAssetsApi('assetsMaterialAddToWorkspace', {
          materialIdList,
          targetNodeIdList: [currentNodeId.value],
        })

        if (failMaterialItemNoList && failMaterialItemNoList.length > 0) {
          store.dispatch('helper/openModalBehavior', {
            component: 'modal-item-no-list',
            properties: {
              header: t('EE0063', { number: failMaterialItemNoList.length }),
              primaryBtnText: t('UU0031'),
              primaryBtnHandler: () => {
                store.dispatch('helper/closeModalBehavior')
              },
              content: t('EE0064'),
              itemNoList: failMaterialItemNoList,
            } as PropsModalItemNoList,
          })
        } else {
          store.dispatch('helper/closeModal')
        }

        store.dispatch('helper/reloadInnerApp')

        if (
          !failMaterialItemNoList ||
          failMaterialItemNoList.length !== materialIdList.length
        ) {
          notify.showNotifySnackbar({ messageText: t('FF0018') })
        }
      },
    } as PropsModalAssetsList,
  })
}

const openModalPublish = (nodeMeta: NodeMeta) => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-publish',
    properties: {
      nodeMeta,
    },
  })
}

const handleNodeClick = (node: NodeChild, visit: Function) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    searchStore.setKeyword('')
    currentNodeId.value = node.nodeMeta.nodeId
    visit()
  } else {
    goToWorkspaceMaterialDetail(
      {},
      node.nodeMeta.nodeId,
      node.nodeMeta.rank ?? undefined,
      currentNodeId.value ?? undefined
    )
  }
}
</script>
