<template lang="pug">
div(class="w-full h-full")
  search-table(
    ref="refSearchTable"
    :searchType="SEARCH_TYPE.PUBLIC_LIBRARY"
    :searchCallback="getShareToMeList"
    :optionSort="optionSort"
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
      div(class="mx-7.5 mb-7.5 text-caption text-black-700 flex items-center")
        p(class="pr-2.5") {{workspaceCollection.share.displayName}}
        p {{$t('RR0148')}} {{$dayjs.unix(workspaceCollection.share.shareDate).format('MM/DD/YYYY')}}
    template(#default="{ inSearch }")
      div(v-if="nodeList.length > 0" class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start")
        template(v-for="node in nodeList")
          template(v-if="node.nodeType === NODE_TYPE.COLLECTION")
            node-item(
              v-model:selectedList="selectedNodeKeyList"
              :nodeType="node.nodeType"
              :nodeKey="node.key"
              :node="node.data"
              :displayName="node.data.name"
              :optionList="optionNode"
              :isShowLocation="inSearch"
              @click="goTo(node.key, node.data.share.sharingId)"
              @click:option="$event.func(node.key)"
            )
              template(#node-caption v-if="isFirstLayer")
                div(class="mt-1.5 h-6 flex items-center")
                  img(
                    :src="node.data.share.logo ? node.data.share.log : require('@/assets/images/logo-default.png')"
                    class="aspect-ratio h-full rounded-full"
                  )
                  p(class="pl-1 font-bold text-caption text-primary") {{node.data.share.displayName}}
          template(v-if="node.nodeType === NODE_TYPE.MATERIAL")
            node-item(
              v-model:selectedList="selectedNodeKeyList"
              :nodeType="node.nodeType"
              :nodeKey="node.key"
              :node="node.data"
              :displayName="node.data.materialNo"
              :optionList="optionNode"
              :isShowLocation="inSearch"
              @click:option="$event.func(node.key, node.data.share.sharingId)"
              @click.stop="goToShareToMeMaterial({ workspaceNodeId: node.data.workspaceNodeId, sharingId: node.data.share.sharingId })"
            )
              template(#node-caption v-if="isFirstLayer")
                div(class="mt-1.5 h-6 flex items-center")
                  img(
                    :src="node.data.share.logo ? node.data.share.log : require('@/assets/images/logo-default.png')"
                    class="aspect-ratio h-full rounded-full"
                  )
                  p(class="pl-1 font-bold text-caption text-primary") {{node.data.share.displayName}}
      div(v-else class="flex h-full justify-center items-end")
        p(class="text-body1 text-primary") {{$t('HH0001')}}
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
import usePublicLibrary from '@/composables/usePublicLibrary'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'ShareToMe',
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
    const { goToShareToMeMaterial } = useNavigation()

    const optionSort = {
      base: [
        SORT_BY.MATERIAL_NO_A_Z_C_M,
        SORT_BY.LAST_UPDATE
      ],
      keywordSearch: [
        SORT_BY.RELEVANCE_C_M
      ]
    }

    const optionMultiSelect = [cloneNode]
    const pagination = computed(() => store.getters['helper/search/pagination'])
    const workspaceCollection = computed(() => store.getters['shareToMe/workspaceCollection'])
    const breadcrumbList = computed(() => store.getters['shareToMe/breadcrumbList']({
      name: t('RR0010'),
      key: null
    }))
    const isFirstLayer = computed(() => breadcrumbList.value.length === 1)
    const nodeList = computed(() => store.getters['shareToMe/nodeList'])
    const publishBy = computed(() => store.getters['shareToMe/publishBy'])
    const optionNode = computed(() => ([
      [
        cloneNode,
        shareNode
      ]
    ]))

    const workspaceNodeId = ref(route.query.workspaceNodeId || null)
    const sharingId = ref(route.query.sharingId || null)
    const refSearchTable = ref(null)
    const selectedNodeKeyList = ref([])

    const getShareToMeList = async (targetPage = 1) => {
      await router.push({
        name: route.name,
        query: {
          sharingId: sharingId.value,
          workspaceNodeId: workspaceNodeId.value,
          ...route.query
        }
      })
      await store.dispatch('shareToMe/getShareToMeList', { targetPage, sharingId: sharingId.value, workspaceNodeId: workspaceNodeId.value })
    }

    const search = () => refSearchTable.value.search(pagination.value.currentPage)

    const parseAndSetKey = (key) => {
      if (key === null) {
        workspaceNodeId.value = null
      } else {
        workspaceNodeId.value = key.split('-')[1]
      }
    }

    const goTo = (key, targetSharingId = null) => {
      store.dispatch('helper/search/setPagination', { currentPage: 1 })
      parseAndSetKey(key)
      if (targetSharingId && isFirstLayer.value) {
        sharingId.value = targetSharingId
      } else if (key === null && targetSharingId === null) {
        sharingId.value = null
      }
      search()
    }

    const handleSelectAll = () => {
      const stringifyArr = nodeList.value.map(node => node.key)
      const duplicateArr = selectedNodeKeyList.value.concat(stringifyArr)
      selectedNodeKeyList.value = [...new Set(duplicateArr)]
    }

    const openModalCollectionDetail = () => {
      store.dispatch('helper/openModal', {
        header: t('FF0006'),
        component: 'modal-collection-detail',
        properties: {
          ...workspaceCollection.value
        }
      })
    }

    return {
      getShareToMeList,
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
      workspaceCollection,
      openModalCollectionDetail,
      publishBy,
      goToShareToMeMaterial,
      selectedNodeKeyList,
      handleSelectAll,
      optionMultiSelect
    }
  }
}

</script>
