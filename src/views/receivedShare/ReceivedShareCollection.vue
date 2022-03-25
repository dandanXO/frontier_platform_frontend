<style lang="scss">
#pagination-container {
  padding-bottom: 152px;
}
</style>

<template lang="pug">
div(class="w-315 h-full mx-auto")
  search-table(
    ref="refSearchTable"
    @selectAll="handleSelectAll"
    :searchType="SEARCH_TYPE.SHARE"
    :optionSort="optionSort"
    :searchCallback="getShareReceivedList"
  )
    template(#header-above)
      div(class="mx-7.5 pt-5 -mb-7")
        div(class="flex justify-between items-center pb-5")
          div(class="flex items-start")
            div(class="flex items-end pr-3")
              breadcrumb(:breadcrumbList="breadcrumbList" @click:item="goTo($event.key)" fontSize="text-h5")
              p(class="flex text-caption text-black-700 pl-1")
                span (
                i18n-t(keypath="RR0068" tag="span")
                  template(#number) {{ pagination.totalCount }}
                span )
            tooltip(placement="bottom")
              template(#trigger)
                svg-icon(iconName="clone" class="text-black-700 hover:text-brand cursor-pointer" size="24" @click="cloneReceivedShare([workspaceNodeId])")
              template(#content)
                p(class="text-caption text-primary px-3 py-1") {{ $t("RR0056") }}
          btn(size="sm" type="secondary" @click="isCollectionDetailExpand = !isCollectionDetailExpand") {{ isCollectionDetailExpand ? $t("UU0026") : $t("UU0071") }}
        div(v-if="isCollectionDetailExpand" class="flex items-start gap-x-9")
          div(class="relative w-97.5 h-69 bg-black-200 flex items-center justify-center flex-shrink-0")
            div(v-if="collection.trendBoardCoverImg" class="w-full h-full")
              img(:src="collection.trendBoardCoverImg" class="w-full h-full object-contain")
              a(:href="collection.trendBoardUrl" target="_blank" class="absolute right-3.5 bottom-3.5 card-shadow w-7 h-7 rounded-sm bg-black-0 flex items-center justify-center")
                svg-icon(iconName="search" class="text-black-700" size="24")
            p(v-else class="text-body2 text-black-400") {{ $t("FF0007") }}
          overlay-scrollbar-container(class="flex-grow h-61.5 max-w-193.5")
            p(v-if="collection.description" class="text-body2 text-primary leading-1.5") {{ collection.description }}
            div(v-else class="w-full h-full flex items-center justify-center")
              p(class="text-body2 text-primary") {{ $t("GG0028") }}
    template(#default)
      div(v-if="nodeList.length > 0" class="mx-7.5 grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start")
        template(v-for="node in nodeList")
          template(v-if="node.nodeType === NODE_TYPE.COLLECTION")
            node-item(
              v-model:selectedList="selectedNodeList"
              :node="node"
              :displayName="node.name"
              @click="goTo(node.nodeKey)"
            )
              template(#cover-overlay)
                svg-icon(
                  iconName="clone"
                  size="20"
                  class="absolute bottom-3 right-3 cursor-pointer text-black-500"
                  @click="cloneReceivedShare([node.workspaceNodeId])"
                )
          template(v-if="node.nodeType === NODE_TYPE.MATERIAL")
            node-item(
              v-model:selectedList="selectedNodeList"
              :node="node"
              :displayName="node.materialNo"
              @click="goToReceivedShareMaterial(node.workspaceNodeId, share.sharingKey)"
            )
              template(#cover-overlay)
                svg-icon(
                  iconName="clone"
                  size="20"
                  class="absolute bottom-3 right-3 cursor-pointer text-black-500"
                  @click="cloneReceivedShare([node.workspaceNodeId])"
                )
  multi-select-menu(:options="optionMultiSelect" v-model:selectedList="selectedNodeList")
</template>

<script>
import SearchTable from '@/components/layout/SearchTable.vue'
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { SEARCH_TYPE, SORT_BY, NODE_TYPE } from '@/utils/constants.js'
import { useRoute, useRouter } from 'vue-router'
import NodeItem from '@/components/layout/NodeItem.vue'
import useReceivedShare from '@/composables/useReceivedShare.js'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation.js'

export default {
  name: 'ReceivedShareCollection',
  components: {
    FullscreenHeader,
    SearchTable,
    NodeItem
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { cloneReceivedShare, multipleCloneReceivedShare } = useReceivedShare()
    const { goToReceivedShareMaterial } = useNavigation()

    const optionSort = {
      base: [
        SORT_BY.MATERIAL_NO_A_Z_C_M,
        SORT_BY.NEW_ARRIVED
      ],
      keywordSearch: [
        SORT_BY.RELEVANCE_M_C
      ]
    }
    const optionMultiSelect = [
      {
        name: t('RR0056'),
        func: multipleCloneReceivedShare
      }
    ]

    const share = computed(() => store.getters['receivedShare/share'])
    const pagination = computed(() => store.getters['helper/search/pagination'])
    const nodeList = computed(() => store.getters['receivedShare/nodeList'])
    const breadcrumbList = computed(() => store.getters['receivedShare/collectionBreadcrumbList']())
    const collection = computed(() => store.getters['receivedShare/collection'])
    const selectedNodeList = ref([])
    const workspaceNodeId = ref(route.query.workspaceNodeId || share.value.workspaceNodeId)
    const isCollectionDetailExpand = ref(true)
    const refSearchTable = ref(null)

    const getShareReceivedList = async (targetPage = 1, query) => {
      await router.push({
        name: route.name,
        query: {
          sharingKey: share.value.sharingKey,
          workspaceNodeId: workspaceNodeId.value,
          ...query
        }
      })
      await store.dispatch('receivedShare/getShareReceivedList', {
        targetPage,
        sharingKey: share.value.sharingKey,
        workspaceNodeId: workspaceNodeId.value
      })
    }

    const search = () => refSearchTable.value.search(pagination.value.currentPage)

    const goTo = (key) => {
      workspaceNodeId.value = key.split('-')[1]
      store.dispatch('helper/search/reset', { sort: optionSort.base[0].value })
      store.dispatch('helper/search/setPagination', { currentPage: 1 })
      search()
    }

    const handleSelectAll = () => {
      const stringifyArr = nodeList.value.map(node => JSON.stringify(node))
      const duplicateArr = selectedNodeList.value.concat(stringifyArr)
      selectedNodeList.value = [...new Set(duplicateArr)]
    }

    return {
      share,
      SEARCH_TYPE,
      optionSort,
      getShareReceivedList,
      nodeList,
      selectedNodeList,
      NODE_TYPE,
      breadcrumbList,
      pagination,
      collection,
      isCollectionDetailExpand,
      goTo,
      refSearchTable,
      cloneReceivedShare,
      workspaceNodeId,
      optionMultiSelect,
      goToReceivedShareMaterial,
      handleSelectAll
    }
  }
}
</script>
