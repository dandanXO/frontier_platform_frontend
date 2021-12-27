<template lang="pug">
div(class="w-full h-full")
  search-table(
    ref="refSearchTable"
    @selectAll="handleSelectAll"
    :searchType="SEARCH_TYPE.WORKSPACE"
    :searchCallback="getWorkspace"
    :optionSort="optionSort"
  )
    template(#header-left)
      div(class="flex items-end")
        breadcrumb(:breadcrumbList="breadcrumbList" @click:item="goTo($event.key)" fontSize="text-h6")
        p(class="flex text-caption text-black-700 pl-1")
          span (
          i18n-t(keypath="RR0068" tag="span")
            template(#number) {{pagination.totalCount}}
          span )
    template(#header-right)
      btn(v-if="!isFirstLayer" size="sm" type="secondary" class="-mr-3" @click="openModalCollectionDetail") {{$t('UU0057')}}
      btn(size="sm" prependIcon="add" @click="addMaterialFromAssetsList") {{$t('UU0055')}}
    template(v-if="!isFirstLayer" #sub-header)
      p(class="mx-7.5 mb-7.5 text-caption text-black-700") {{$t('FF0002')}}: {{unixToDate(workspaceCollection.createDate)}}
    template(#default="{ inSearch }")
      div(class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start")
        div(class="aspect-ratio border border-black-400 border-dashed rounded-md flex justify-center items-center cursor-pointer" @click="openModalCreateCollection")
          div(class="grid justify-items-center gap-y-3.5")
            svg-icon(iconName="add" size="24" class="text-primary")
            span(class="text-body1 text-primary") {{$t('FF0003')}}
        template(v-for="node in nodeList")
          template(v-if="node.nodeType === NODE_TYPE.COLLECTION")
            node-item(
              v-model:selectedList="selectedNodeKeyList"
              :nodeType="node.nodeType"
              :nodeKey="node.key"
              :node="node.data"
              :displayName="node.data.name"
              :optionList="optionNodeCollection"
              :isShowLocation="inSearch"
              @click="goTo(node.key)"
              @click:option="$event.func(node.data)"
            )
              template(#cover-overlay v-if="isFirstLayer")
                svg-icon(
                  :iconName="node.data.isPublic ? 'public' : 'lock_outline'"
                  size="20"
                  class="absolute bottom-3 left-3 cursor-pointer text-black-500"
                  @click.stop="openModalPublish(node.data)"
                )
          template(v-if="node.nodeType === NODE_TYPE.MATERIAL")
            node-item(
              v-model:selectedList="selectedNodeKeyList"
              :nodeType="node.nodeType"
              :nodeKey="node.key"
              :node="node.data"
              :displayName="node.data.materialNo"
              :optionList="optionNodeMaterial"
              :isShowLocation="inSearch"
              @click:option="$event.func(node.data)"
              @click.stop="goToWorkspaceMaterialDetail(node.key)"
            )
              template(#cover-overlay v-if="isFirstLayer")
                svg-icon(
                  :iconName="node.data.isPublic ? 'public' : 'lock_outline'"
                  size="20"
                  class="absolute bottom-3 left-3 cursor-pointer text-black-500"
                  @click.stop="openModalPublish(node.data)"
                )
  multi-select-menu(:options="optionMultiSelect" v-model:selectedList="selectedNodeKeyList")
</template>

<script>
import SearchTable from '@/components/layout/SearchTable'
import { SORT_BY, SEARCH_TYPE, NODE_TYPE } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import NodeItem from '@/components/layout/NodeItem'
import { useRoute, useRouter } from 'vue-router'
import { unixToDate } from '@/utils/time-formatting'
import useWorkspace from '@/composables/useWorkspace'
import useNavigation from '@/composables/useNavigation.js'

export default {
  name: 'Workspace',
  components: {
    SearchTable,
    NodeItem
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { goToWorkspaceMaterialDetail } = useNavigation()
    const { editCollection, editMaterial, duplicateNode, moveNode, deleteCollection, deleteMaterial, deleteMultipleNode, shareNode } = useWorkspace()

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
    const workspaceCollection = computed(() => store.getters['workspace/workspaceCollection'])
    const breadcrumbList = computed(() => store.getters['workspace/breadcrumbList']({
      name: t('FF0001'),
      key: `${defaultWorkspaceNodeLocation.value}-${defaultWorkspaceNodeId.value}`
    }))
    const isFirstLayer = computed(() => breadcrumbList.value.length === 1)
    const nodeList = computed(() => store.getters['workspace/nodeList'])
    const defaultWorkspaceNodeId = computed(() => store.getters['workspace/defaultWorkspaceNodeId'])
    const defaultWorkspaceNodeLocation = computed(() => store.getters['workspace/defaultWorkspaceNodeLocation'])
    const optionNodeCollection = computed(() => {
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

      if (isFirstLayer.value) {
        optionList[1].push(shareNode)
      }

      return optionList
    })
    const optionNodeMaterial = computed(() => {
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

      if (isFirstLayer.value) {
        optionList[1].push(shareNode)
      }

      return optionList
    })

    const workspaceNodeId = ref(route.query.workspaceNodeId || defaultWorkspaceNodeId.value)
    const refSearchTable = ref(null)
    const selectedNodeKeyList = ref([])

    const getWorkspace = async (targetPage = 1) => {
      await router.push({
        name: route.name,
        query: {
          workspaceNodeId: workspaceNodeId.value,
          ...route.query
        }
      })
      await store.dispatch('workspace/getWorkspace', { targetPage, workspaceNodeId: workspaceNodeId.value })
    }

    const search = () => refSearchTable.value.search(pagination.value.currentPage)

    const goTo = (key) => {
      workspaceNodeId.value = key.split('-')[1]
      store.dispatch('helper/search/setPagination', { currentPage: 1 })
      search()
    }

    const handleSelectAll = () => {
      const stringifyArr = nodeList.value.map(node => node.key)
      const duplicateArr = selectedNodeKeyList.value.concat(stringifyArr)
      selectedNodeKeyList.value = [...new Set(duplicateArr)]
    }

    const openModalCreateCollection = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-create-or-edit-collection',
        properties: {
          mode: 1,
          workspaceNodeId: workspaceNodeId.value
        }
      })
    }

    const openModalCollectionDetail = () => {
      store.dispatch('helper/openModal', {
        header: t('FF0006'),
        component: 'modal-collection-detail'
      })
    }

    const addMaterialFromAssetsList = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-assets-list',
        properties: {
          modalTitle: t('FF0016'),
          actionText: t('UU0035'),
          actionCallback: async (materialIdList) => {
            const failMaterialList = await store.dispatch('assets/addToWorkspace', {
              materialIdList,
              targetWorkspaceNodeList: [
                {
                  id: workspaceCollection.value.workspaceNodeId,
                  location: workspaceCollection.value.workspaceNodeLocation
                }
              ]
            })

            if (failMaterialList && failMaterialList.length > 0) {
              store.dispatch('helper/openModal', {
                component: 'modal-add-to-workspace-fail',
                properties: {
                  failMaterialList
                }
              })
            } else {
              store.dispatch('helper/closeModal')
            }

            store.dispatch('helper/reloadInnerApp')

            if (!failMaterialList || (failMaterialList.length !== materialIdList.length)) {
              store.commit('helper/PUSH_message', t('FF0018'))
            }
          }
        }
      })
    }

    const openModalPublish = (workspaceNode) => {
      store.dispatch('helper/openModal', {
        component: 'modal-publish',
        properties: {
          workspaceNode
        }
      })
    }

    return {
      getWorkspace,
      optionSort,
      optionMultiSelect,
      pagination,
      refSearchTable,
      SEARCH_TYPE,
      search,
      NODE_TYPE,
      nodeList,
      selectedNodeKeyList,
      goTo,
      breadcrumbList,
      optionNodeCollection,
      optionNodeMaterial,
      isFirstLayer,
      workspaceCollection,
      unixToDate,
      handleSelectAll,
      addMaterialFromAssetsList,
      openModalCreateCollection,
      openModalCollectionDetail,
      openModalPublish,
      goToWorkspaceMaterialDetail
    }
  }
}

</script>
