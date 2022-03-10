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
      div(class="flex items-center")
        div(class="flex items-end")
          breadcrumb(:breadcrumbList="breadcrumbList" @click:item="goTo($event.key)" fontSize="text-h6")
          p(class="flex text-caption text-black-700 pl-1")
            span (
            i18n-t(keypath="RR0068" tag="span")
              template(#number) {{pagination.totalCount}}
            span )
        tooltip(v-if="!isFirstLayer" placement="bottom")
          template(#trigger)
            svg-icon(
              iconName="clone"
              class="text-black-700 cursor-pointer hover:text-brand ml-1"
              size="24"
              @click="cloneNode.func(`${collection.workspaceNodeLocation}-${collection.workspaceNodeId}`, collection.share.isCanClone)"
            )
          template(#content)
            p(class="text-caption text-primary px-3 py-1") {{$t('RR0056')}}
    template(#header-right)
      div(v-if="!isFirstLayer" class="relative cursor-pointer" @click="openModalShareMessage")
        svg-icon(iconName="chat" size="24" class="text-black-700")
        div(v-if="haveMsgAndFirstRead" class="absolute -top-px -right-px w-2 h-2 rounded-full border border-black-0 bg-warn")
      btn(v-if="!isFirstLayer" size="sm" type="secondary" class="-mr-3" @click="openModalCollectionDetail") {{$t('UU0057')}}
    template(v-if="!isFirstLayer" #sub-header)
      div(class="mx-7.5 mb-7.5 text-caption text-black-700 flex items-center")
        p(class="pr-2.5") {{collection.share.displayName}}
        p {{$t('RR0148')}} {{$dayjs.unix(collection.share.shareDate).format('MM/DD/YYYY')}}
    template(#default="{ inSearch }")
      div(v-if="nodeList.length > 0" class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start")
        template(v-for="node in nodeList")
          template(v-if="node.nodeType === NODE_TYPE.COLLECTION")
            node-item(
              v-model:selectedList="selectedNodeList"
              :node="node"
              :displayName="node.name"
              :optionList="optionNode"
              :isShowLocation="inSearch"
              @click="goTo(node.nodeKey, node.share.sharingId)"
              @click:option="$event.func(node)"
            )
              template(#node-caption v-if="isFirstLayer")
                div(class="mt-1.5 h-6 flex items-center")
                  img(:src="node.share.logo" class="aspect-ratio h-full rounded-full")
                  p(class="pl-1 font-bold text-caption text-primary") {{node.share.displayName}}
          template(v-if="node.nodeType === NODE_TYPE.MATERIAL")
            node-item(
              v-model:selectedList="selectedNodeList"
              :node="node"
              :displayName="node.materialNo"
              :optionList="optionNode"
              :isShowLocation="inSearch"
              @click:option="$event.func(node)"
              @click.stop="goToShareToMeMaterial(node.nodeKey, node.share.sharingId)"
            )
              template(#node-caption v-if="isFirstLayer")
                div(class="mt-1.5 h-6 flex items-center")
                  img(:src="node.share.logo" class="aspect-ratio h-full rounded-full")
                  p(class="pl-1 font-bold text-caption text-primary") {{node.share.displayName}}
      div(v-else class="flex h-full justify-center items-end")
        p(class="text-body1 text-primary") {{$t('HH0001')}}
  multi-select-menu(:options="optionMultiSelect" v-model:selectedList="selectedNodeList")
    template(#default="{ option }")
      div(
        v-if="option.id === 'clone'"
        class="whitespace-nowrap px-5 cursor-pointer hover:text-brand"
        @click="option.func(selectedNodeList, collection.share.isCanClone)"
      ) {{option.name}}

</template>

<script>
import SearchTable from '@/components/layout/SearchTable.vue'
import { SORT_BY, SEARCH_TYPE, NODE_TYPE } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import NodeItem from '@/components/layout/NodeItem.vue'
import { useRoute, useRouter } from 'vue-router'
import useShareToMe from '@/composables/useShareToMe'
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
    const { cloneNode, deleteNode } = useShareToMe()
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
    const optionMultiSelect = computed(() => isFirstLayer.value ? [deleteNode] : [cloneNode])
    const pagination = computed(() => store.getters['helper/search/pagination'])
    const collection = computed(() => store.getters['shareToMe/collection'])
    const breadcrumbList = computed(() => store.getters['shareToMe/collectionBreadcrumbList']({
      name: t('RR0010'),
      key: null
    }))
    const isFirstLayer = computed(() => breadcrumbList.value.length === 1)
    const nodeList = computed(() => store.getters['shareToMe/nodeList'])
    const optionNode = computed(() => {
      const optionList = [
        [
          cloneNode
        ]
      ]
      if (isFirstLayer.value) {
        optionList[0].push(deleteNode)
      }
      return optionList
    })
    const workspaceNodeId = ref(route.query.workspaceNodeId || null)
    const sharingId = ref(route.query.sharingId || null)
    const refSearchTable = ref(null)
    const selectedNodeList = ref([])
    const isFirstTime = ref(true)
    const haveMsgAndFirstRead = computed(() => !!collection.value?.share?.message && isFirstTime.value)

    const getShareToMeList = async (targetPage = 1, query) => {
      await router.push({
        name: route.name,
        query: {
          sharingId: sharingId.value,
          workspaceNodeId: workspaceNodeId.value,
          ...query
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
      store.dispatch('helper/search/reset', { sort: optionSort.base[0].value })
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

    const openModalShareMessage = () => {
      isFirstTime.value = false
      store.dispatch('helper/openModal', {
        component: 'modal-share-message',
        header: t('RR0146'),
        properties: {
          message: collection.value.share.message
        }
      })
    }

    watch(
      () => isFirstLayer.value,
      () => (selectedNodeList.value.length = 0)
    )

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
      collection,
      openModalCollectionDetail,
      goToShareToMeMaterial,
      selectedNodeList,
      handleSelectAll,
      optionMultiSelect,
      haveMsgAndFirstRead,
      openModalShareMessage,
      cloneNode
    }
  }
}

</script>
