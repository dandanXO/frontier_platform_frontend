<template lang="pug">
search-table(
  class="flex-grow"
  :searchType="SEARCH_TYPE.WORKSPACE"
  :searchCallback="getWorkspace"
  :optionSort="optionSort"
  :optionMultiSelect="optionMultiSelect"
  :itemList="nodeList"
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
  template(#header-left="{ goTo }")
    div(class="flex items-end")
      global-breadcrumb-list(
        :breadcrumbList="breadcrumbList"
        @click:item="currentNodeKey = $event.nodeKey; goTo()"
        fontSize="text-h6"
      )
      p(class="flex text-caption text-grey-600 pl-1")
        span (
        i18n-t(keypath="RR0068" tag="span" scope="global")
          template(#number) {{ pagination.totalCount }}
        span )
  template(#header-right)
    f-button(
      v-if="!isFirstLayer"
      size="sm"
      type="secondary"
      @click="openModalCollectionDetail"
    ) {{ $t('UU0057') }}
    f-button(size="sm" prependIcon="add" @click="openModalCreateCollection") {{ $t('FF0003') }}
  template(v-if="!isFirstLayer" #sub-header)
    p(class="mx-7.5 mb-7.5 text-caption text-grey-600") {{ $t('FF0002') }}: {{ toYYYYMMDDFormat(collection.createDate) }}
  template(#default="{ inSearch, goTo }")
    div(
      class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start"
    )
      div(
        class="aspect-square border border-grey-250 border-dashed rounded-md flex justify-center items-center cursor-pointer"
        @click="openModalAssetsList"
      )
        div(class="flex flex-col justify-center items-center")
          f-svg-icon(iconName="add" size="24" class="text-grey-900 mb-3.5")
          span(class="text-body1 text-grey-900") {{ $t('UU0055') }}
      grid-item-node(
        v-for="node in nodeList"
        :key="node.nodeKey"
        v-model:selectedValue="selectedNodeList"
        :node="node"
        :optionList="optionNode(node)"
        @click:option="$event.func(node)"
        @click:node="handleNodeClick(node, goTo)"
      )
        template(#corner-bottom-left v-if="isFirstLayer")
          f-svg-icon(
            :iconName="node.isPublic ? 'public' : 'internal'"
            :tooltipMessage="node.isPublic ? $t('FF0072') : $t('FF0073')"
            size="20"
            class="cursor-pointer text-grey-250"
            @click.stop="openModalPublish(node)"
          )
        template(#title-right-icon)
          tooltip-location(v-if="inSearch" :location="node.location")
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import { SEARCH_TYPE, NODE_TYPE, useConstants } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { ref, computed } from 'vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import TooltipLocation from '@/components/common/TooltipLocation.vue'
import { useRoute, useRouter } from 'vue-router'
import useWorkspace from '@/composables/useWorkspace'
import useNavigation from '@/composables/useNavigation'
import { toYYYYMMDDFormat } from '@frontier/lib'

const props = defineProps({
  nodeKey: {
    type: String,
    default: null,
  },
})

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const router = useRouter()
const route = useRoute()
const { goToWorkspaceMaterialDetail, prefixPath, parsePath } = useNavigation()
const {
  editNodeCollection,
  editNodeMaterial,
  duplicateNode,
  moveNode,
  shareNode,
  deleteCollection,
  deleteMaterial,
  deleteMultipleNode,
} = useWorkspace()

const tabList = ref([
  {
    name: t('FF0001'),
    id: 'workspace',
    goTo: () => {},
  },
  {
    name: t('RR0010'),
    id: 'share-to-me',
    goTo: () => {
      router.push(parsePath(`${prefixPath.value}/share-to-me`))
    },
  },
])

const optionSort = computed(() => {
  const { SORT_BY } = useConstants()
  const {
    MATERIAL_NO_A_Z_C_M,
    MATERIAL_NO_A_Z_M_C,
    CREATE_DATE_C_M,
    CREATE_DATE_M_C,
    GHG_RESULTS,
    WATER_DEPLETION_RESULTS,
    LAND_USE_RESULTS,
    RELEVANCE_C_M,
    RELEVANCE_M_C,
  } = SORT_BY.value
  const valueAddedService = computed(
    () => store.getters['polling/valueAddedService']
  )
  return {
    base: [
      MATERIAL_NO_A_Z_C_M,
      MATERIAL_NO_A_Z_M_C,
      CREATE_DATE_C_M,
      CREATE_DATE_M_C,
      {
        ...GHG_RESULTS,
        disabled: !valueAddedService.value.made2flow.planStatus.ACTIVATE,
        tooltipMessage: t('VV0047'),
      },
      {
        ...WATER_DEPLETION_RESULTS,
        disabled: !valueAddedService.value.made2flow.planStatus.ACTIVATE,
        tooltipMessage: t('VV0047'),
      },
      {
        ...LAND_USE_RESULTS,
        disabled: !valueAddedService.value.made2flow.planStatus.ACTIVATE,
        tooltipMessage: t('VV0047'),
      },
    ],
    keywordSearch: [RELEVANCE_C_M, RELEVANCE_M_C],
  }
})

const optionMultiSelect = computed(() => [deleteMultipleNode])

const pagination = computed(() => store.getters['helper/search/pagination'])
const collection = computed(() => store.getters['workspace/collection'])
const defaultWorkspaceNodeKey = computed(
  () => store.getters['workspace/defaultWorkspaceNodeKey']
)
const breadcrumbList = computed(() =>
  store.getters['workspace/collectionBreadcrumbList']({
    name: t('FF0001'),
    nodeKey: defaultWorkspaceNodeKey.value,
  })
)
const isFirstLayer = computed(() => breadcrumbList.value.length === 1)
const nodeList = computed(() => store.getters['workspace/nodeList'])
const optionNode = (node) => {
  const { nodeType } = node
  if (nodeType === NODE_TYPE.COLLECTION) {
    return [
      [editNodeCollection],
      [duplicateNode, moveNode, shareNode],
      [deleteCollection],
    ]
  } else {
    return [[editNodeMaterial], [moveNode, shareNode], [deleteMaterial]]
  }
}
const currentNodeKey = ref(props.nodeKey)
const selectedNodeList = ref([])

const getWorkspace = async (targetPage = 1, query) => {
  router.push({
    name: route.name,
    params: {
      nodeKey: currentNodeKey.value,
    },
    query,
  })
  await store.dispatch('workspace/getWorkspace', {
    targetPage,
    nodeKey: currentNodeKey.value,
  })
}

const openModalCreateCollection = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-collection',
    properties: {
      mode: 1,
      workspaceNodeId: currentNodeKey.value.split('-')[1],
    },
  })
}

const openModalCollectionDetail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-collection-detail',
    properties: {
      ...collection.value,
      canEdit: true,
    },
  })
}

const openModalAssetsList = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-assets-list',
    properties: {
      modalTitle: t('RR0008'),
      actionText: t('UU0035'),
      actionCallback: async (materialList) => {
        const materialIdList = materialList.map(({ materialId }) => materialId)
        const failMaterialList = await store.dispatch('assets/addToWorkspace', {
          materialIdList,
          targetWorkspaceNodeList: [
            {
              id: collection.value.workspaceNodeId,
              location: collection.value.workspaceNodeLocation,
            },
          ],
        })

        if (failMaterialList && failMaterialList.length > 0) {
          store.dispatch('helper/openModalBehavior', {
            component: 'modal-material-no-list',
            properties: {
              header: t('EE0063', { number: failMaterialList.length }),
              primaryBtnText: t('UU0031'),
              primaryBtnHandler: () => {
                store.dispatch('helper/closeModalBehavior')
              },
              content: t('EE0064'),
              materialNoList: failMaterialList,
            },
          })
        } else {
          store.dispatch('helper/closeModal')
        }

        store.dispatch('helper/reloadInnerApp')

        if (
          !failMaterialList ||
          failMaterialList.length !== materialIdList.length
        ) {
          notify.showNotifySnackbar({ messageText: t('FF0018') })
        }
      },
    },
  })
}

const openModalPublish = (workspaceNode) => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-publish',
    properties: {
      workspaceNode,
    },
  })
}

const handleNodeClick = (node, goTo) => {
  console.log('here')
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    currentNodeKey.value = node.nodeKey
    goTo()
  } else {
    goToWorkspaceMaterialDetail(node.nodeKey, node.rank)
  }
}
</script>
