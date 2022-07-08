<template lang="pug">
div(class="w-full h-full")
  search-table(
    :searchType="SEARCH_TYPE.WORKSPACE"
    :searchCallback="getWorkspace"
    :optionSort="optionSort"
    :optionMultiSelect="optionMultiSelect"
    :itemList="nodeList"
    v-model:selectedItemList="selectedNodeList"
  )
    template(#header-left="{ goTo }")
      div(class="flex items-end")
        breadcrumb(:breadcrumbList="breadcrumbList" @click:item="(currentNodeKey = $event.nodeKey); goTo()" fontSize="text-h6")
        p(class="flex text-caption text-black-700 pl-1")
          span (
          i18n-t(keypath="RR0068" tag="span" scope="global")
            template(#number) {{ pagination.totalCount }}
          span )
    template(#header-right)
      btn(v-if="!isFirstLayer" size="sm" type="secondary" class="-mr-3" @click="openModalCollectionDetail") {{ $t("UU0057") }}
      btn(size="sm" prependIcon="add" @click="openModalAssetsList") {{ $t("UU0055") }}
    template(v-if="!isFirstLayer" #sub-header)
      p(class="mx-7.5 mb-7.5 text-caption text-black-700") {{ $t("FF0002") }}: {{ $dayjs.unix(collection.createDate).format("YYYY/MM/DD") }}
    template(#default="{ inSearch, goTo }")
      div(class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start")
        div(class="aspect-square border border-black-400 border-dashed rounded-md flex justify-center items-center cursor-pointer" @click="openModalCreateCollection")
          div(class="flex flex-col justify-center items-center")
            svg-icon(iconName="add" size="24" class="text-primary mb-3.5")
            span(class="text-body1 text-primary") {{ $t("FF0003") }}
        grid-item-node(
          v-for="node in nodeList"
          v-model:selectedValue="selectedNodeList"
          :node="node"
          :optionList="optionNode(node.nodeType, inSearch)"
          @click:option="$event.func(node)"
          @click.stop="handleNodeClick(node, goTo)"
        )
          template(#hover-corner-bottom-left v-if="isFirstLayer")
            svg-icon(
              :iconName="node.isPublic ? 'public' : 'lock_outline'"
              size="20"
              class="cursor-pointer text-black-500"
              @click.stop="openModalPublish(node)"
            )
          template(#title-right-icon)
            tooltip-location(v-if="inSearch" :location="node.location")
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import { SORT_BY, SEARCH_TYPE, NODE_TYPE } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import TooltipLocation from '@/components/common/TooltipLocation.vue'
import { useRoute, useRouter } from 'vue-router'
import useWorkspace from '@/composables/useWorkspace'
import useNavigation from '@/composables/useNavigation.js'

const props = defineProps({
  nodeKey: {
    type: String,
    default: null
  }
})

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()
const { goToWorkspaceMaterialDetail } = useNavigation()
const { editCollection, editMaterial, duplicateNode, moveNode, shareNode, deleteCollection, deleteMaterial, deleteMultipleNode } = useWorkspace()

const optionSort = {
  base: [
    SORT_BY.MATERIAL_NO_A_Z_C_M,
    SORT_BY.MATERIAL_NO_A_Z_M_C,
    SORT_BY.CREATE_DATE_C_M,
    SORT_BY.CREATE_DATE_M_C
  ],
  keywordSearch: [
    SORT_BY.RELEVANCE_C_M,
    SORT_BY.RELEVANCE_M_C
  ]
}

const optionMultiSelect = [deleteMultipleNode]

const pagination = computed(() => store.getters['helper/search/pagination'])
const collection = computed(() => store.getters['workspace/collection'])
const defaultWorkspaceNodeKey = computed(() => store.getters['workspace/defaultWorkspaceNodeKey'])
const breadcrumbList = computed(() => store.getters['workspace/collectionBreadcrumbList']({
  name: t('FF0001'),
  nodeKey: defaultWorkspaceNodeKey.value
}))
const isFirstLayer = computed(() => breadcrumbList.value.length === 1)
const nodeList = computed(() => store.getters['workspace/nodeList'])
const optionNode = (nodeType, inSearch) => {
  if (nodeType === NODE_TYPE.COLLECTION) {
    const optionList = [
      [
        editCollection
      ],
      [
        duplicateNode,
        moveNode
      ],
      [
        deleteCollection
      ]
    ]

    if (isFirstLayer.value && !inSearch) {
      optionList[1].push(shareNode)
    }
    return optionList
  } else {
    const optionList = [
      [
        editMaterial
      ],
      [
        moveNode
      ],
      [
        deleteMaterial
      ]
    ]

    if (isFirstLayer.value && !inSearch) {
      optionList[1].push(shareNode)
    }

    return optionList
  }
}
const currentNodeKey = ref(props.nodeKey)
const selectedNodeList = ref([])

const getWorkspace = async (targetPage = 1, query) => {
  await router.push({
    name: route.name,
    params: {
      nodeKey: currentNodeKey.value
    },
    query
  })
  await store.dispatch('workspace/getWorkspace', { targetPage, nodeKey: currentNodeKey.value })
}

const openModalCreateCollection = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-collection',
    properties: {
      mode: 1,
      workspaceNodeId: currentNodeKey.value.split('-')[1]
    }
  })
}

const openModalCollectionDetail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-collection-detail',
    properties: {
      ...collection.value,
      canEdit: true
    }
  })
}

const openModalAssetsList = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-assets-list',
    properties: {
      modalTitle: t('FF0016'),
      actionText: t('UU0035'),
      actionCallback: async (materialList) => {
        const materialIdList = materialList.map(({ materialId }) => materialId)
        const failMaterialList = await store.dispatch('assets/addToWorkspace', {
          materialIdList,
          targetWorkspaceNodeList: [
            {
              id: collection.value.workspaceNodeId,
              location: collection.value.workspaceNodeLocation
            }
          ]
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
              materialNoList: failMaterialList
            }
          })
        } else {
          store.dispatch('helper/closeModal')
        }

        store.dispatch('helper/reloadInnerApp')

        if (!failMaterialList || (failMaterialList.length !== materialIdList.length)) {
          store.dispatch('helper/pushFlashMessage', t('FF0018'))
        }
      }
    }
  })
}

const openModalPublish = (workspaceNode) => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-publish',
    properties: {
      workspaceNode
    }
  })
}

const handleNodeClick = (node, goTo) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    currentNodeKey.value = node.nodeKey
    goTo()
  } else {
    goToWorkspaceMaterialDetail(node.nodeKey)
  }
}
</script>
