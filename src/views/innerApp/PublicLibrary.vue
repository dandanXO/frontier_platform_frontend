<template lang="pug">
div(class="w-full h-full")
  search-table(
    ref="refSearchTable"
    :searchType="SEARCH_TYPE.PUBLIC_LIBRARY"
    :searchCallback="getPublicList"
    :optionSort="optionSort"
    :canSelectAll="!isFirstLayer"
    @selectAll="handleSelectAll"
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
    template(v-if="!isFirstLayer" #sub-header)
      i18n-t(keypath="II0002" tag="p" class="mx-7.5 mb-7.5 text-caption text-black-700")
        template(#displayName) {{publishBy}}
    template(#default)
      div(v-if="nodeList.length > 0" class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start")
        template(v-for="node in nodeList")
          template(v-if="node.nodeType === NODE_TYPE.COLLECTION")
            node-item(
              v-model:selectedList="selectedNodeList"
              :node="node"
              :displayName="node.name"
              :isSelectable="!isFirstLayer"
              :optionList="optionNode"
              @click="goTo(node.nodeKey)"
              @click:option="$event.func(node)"
            )
          template(v-if="node.nodeType === NODE_TYPE.MATERIAL")
            node-item(
              v-model:selectedList="selectedNodeList"
              :node="node"
              :displayName="node.materialNo"
              :isSelectable="!isFirstLayer"
              :optionList="optionNode"
              @click:option="$event.func(node)"
              @click.stop="goToPublicLibraryMaterialDetail(node.nodeKey)"
            )
      div(v-else class="flex h-full justify-center items-end")
        p(class="text-body1 text-primary") {{$t('II0007')}}
  multi-select-menu(v-if="!isFirstLayer" :options="optionMultiSelect" v-model:selectedList="selectedNodeList")
</template>

<script>
import SearchTable from '@/components/layout/SearchTable.vue'
import { SORT_BY, SEARCH_TYPE, NODE_TYPE } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { watch, ref, computed } from 'vue'
import NodeItem from '@/components/layout/NodeItem.vue'
import { useRoute, useRouter } from 'vue-router'
import usePublicLibrary from '@/composables/usePublicLibrary'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'PublicLibrary',
  components: {
    SearchTable,
    NodeItem
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { cloneNode, shareNode } = usePublicLibrary()
    const { goToPublicLibraryMaterialDetail } = useNavigation()

    const optionSort = {
      base: [
        SORT_BY.RANDOM,
        SORT_BY.NEW_ARRIVED
      ],
      keywordSearch: []
    }

    const optionMultiSelect = [cloneNode]
    const pagination = computed(() => store.getters['helper/search/pagination'])
    const collection = computed(() => store.getters['publicLibrary/collection'])
    const breadcrumbList = computed(() => store.getters['publicLibrary/collectionBreadcrumbList']({
      name: t('II0001'),
      key: null
    }))
    const isFirstLayer = computed(() => breadcrumbList.value.length === 1)
    const nodeList = computed(() => store.getters['publicLibrary/nodeList'])
    const publishBy = computed(() => store.getters['publicLibrary/publishBy'])
    const optionNode = computed(() => {
      const optionList = [
        [
          cloneNode
        ]
      ]
      if (isFirstLayer.value) {
        optionList[0].push(shareNode)
      }
      return optionList
    })

    const workspaceNodeId = ref(route.query.workspaceNodeId || null)
    const workspaceNodeLocation = ref(route.query.workspaceNodeLocation || null)
    const refSearchTable = ref(null)
    const selectedNodeList = ref([])

    const getPublicList = async (targetPage = 1) => {
      await router.push({
        name: route.name,
        query: {
          workspaceNodeId: workspaceNodeId.value,
          workspaceNodeLocation: workspaceNodeLocation.value,
          ...route.query
        }
      })
      await store.dispatch('publicLibrary/getPublicList', { targetPage, workspaceNodeId: workspaceNodeId.value, workspaceNodeLocation: workspaceNodeLocation.value })
    }

    const search = () => refSearchTable.value.search(pagination.value.currentPage)

    const parseAndSetKey = (key) => {
      if (key === null) {
        workspaceNodeLocation.value = null
        workspaceNodeId.value = null
      } else {
        const [location, id] = key.split('-')
        workspaceNodeLocation.value = location
        workspaceNodeId.value = id
      }
    }

    const goTo = (key) => {
      store.dispatch('helper/search/setPagination', { currentPage: 1 })
      parseAndSetKey(key)
      search()
    }

    const handleSelectAll = () => {
      const stringifyArr = nodeList.value.map(node => JSON.stringify(node))
      const duplicateArr = selectedNodeList.value.concat(stringifyArr)
      selectedNodeList.value = [...new Set(duplicateArr)]
    }

    const openModalCollectionDetail = () => {
      store.dispatch('helper/openModal', {
        header: t('FF0006'),
        component: 'modal-collection-detail',
        properties: {
          ...collection.value
        }
      })
    }

    watch(
      () => isFirstLayer.value,
      () => (selectedNodeList.value.length = 0)
    )

    return {
      getPublicList,
      optionSort,
      pagination,
      refSearchTable,
      SEARCH_TYPE,
      NODE_TYPE,
      nodeList,
      goTo,
      breadcrumbList,
      optionNode,
      isFirstLayer,
      openModalCollectionDetail,
      publishBy,
      goToPublicLibraryMaterialDetail,
      selectedNodeList,
      handleSelectAll,
      optionMultiSelect
    }
  }
}

</script>
