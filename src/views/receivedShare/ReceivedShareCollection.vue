<style lang="scss">
#pagination-container {
  padding-bottom: 152px;
}
</style>

<template lang="pug">
div(class="w-315 h-full mx-auto")
  search-table(
    ref="refSearchTable"
    :searchType="SEARCH_TYPE.SHARE"
    :optionSort="optionSort"
    :searchCallback="getShareReceivedList"
  )
    template(#header-above)
      div(class="mx-7.5 pt-5 -mb-7")
        div(class="flex justify-between items-center pb-5")
          div(class="flex items-end")
            breadcrumb(:breadcrumbList="breadcrumbList" @click:item="goTo($event.key)" fontSize="text-h5")
            p(class="flex text-caption text-black-700 pl-1")
              span (
              i18n-t(keypath="RR0068" tag="span")
                template(#number) {{pagination.totalCount}}
              span )
          btn(size="sm" type="secondary" @click="isCollectionDetailExpand = !isCollectionDetailExpand") {{isCollectionDetailExpand ? $t('UU0026') : $t('UU0071')}}
        div(v-if="isCollectionDetailExpand" class="flex items-start gap-x-9")
          div(class="relative w-97.5 h-69 bg-black-200 flex items-center justify-center flex-shrink-0")
            div(v-if="workspaceCollection.trendBoardCoverImg" class="w-full h-full")
              img(:src="workspaceCollection.trendBoardCoverImg" class="w-full h-full object-contain")
              a(:href="workspaceCollection.trendBoardUrl" target="_blank" class="absolute right-3.5 bottom-3.5 card-shadow w-7 h-7 rounded-sm bg-black-0 flex items-center justify-center")
                svg-icon(iconName="search" class="text-black-700" size="24")
            p(v-else class="text-body2 text-black-400") {{$t('FF0007')}}
          overlay-scrollbar-container(class="flex-grow h-61.5 max-w-193.5")
            p(v-if="workspaceCollection.description" class="text-body2 text-primary line-height-1.5") {{workspaceCollection.description}}
            div(v-else class="w-full h-full flex items-center justify-center")
              p(class="text-body2 text-primary") {{$t('GG0028')}}
    template(#default)
      div(v-if="nodeList.length > 0" class="mx-7.5 grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start")
        template(v-for="node in nodeList")
          template(v-if="node.nodeType === NODE_TYPE.COLLECTION")
            node-item(
              v-model:selectedList="selectedNodeKeyList"
              :nodeType="node.nodeType"
              :nodeKey="node.key"
              :node="node.data"
              :displayName="node.data.name"
              @click="goTo(node.key)"
              @click:option="$event.func(node.key)"
            )
          template(v-if="node.nodeType === NODE_TYPE.MATERIAL")
            node-item(
              v-model:selectedList="selectedNodeKeyList"
              :nodeType="node.nodeType"
              :nodeKey="node.key"
              :node="node.data"
              :displayName="node.data.materialNo"
              @click:option="$event.func(node.key)"
            )
div(class="fixed z-index:footer bottom-0 w-full h-13 bg-black-100 px-36 flex items-center justify-end card-shadow")
  p(class="text-body2 text-primary") {{$t('GG0004')}}
</template>

<script>
import SearchTable from '@/components/layout/SearchTable'
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { SEARCH_TYPE, SORT_BY, NODE_TYPE } from '@/utils/constants.js'
import { useRoute, useRouter } from 'vue-router'
import NodeItem from '@/components/layout/NodeItem'

export default {
  name: 'ReceivedShare',
  components: {
    FullscreenHeader,
    SearchTable,
    NodeItem
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const optionSort = {
      base: [
        SORT_BY.MATERIAL_NO_A_Z_C_M,
        SORT_BY.NEW_ARRIVED
      ],
      keywordSearch: [
        SORT_BY.RELEVANCE_M_C
      ]
    }

    const share = computed(() => store.getters['share/share'])
    const pagination = computed(() => store.getters['helper/search/pagination'])
    const nodeList = computed(() => store.getters['share/nodeList'])
    const breadcrumbList = computed(() => store.getters['share/breadcrumbList']())
    const workspaceCollection = computed(() => store.getters['share/workspaceCollection'])
    const selectedNodeKeyList = ref([])
    const sharingKey = ref(route.query.sharingKey)
    const workspaceNodeId = ref(route.query.workspaceNodeId || share.value.workspaceNodeId)
    const isCollectionDetailExpand = ref(true)
    const refSearchTable = ref(null)

    const getShareReceivedList = async (targetPage = 1) => {
      await router.push({
        name: route.name,
        query: {
          sharingKey: sharingKey.value,
          workspaceNodeId: workspaceNodeId.value,
          ...route.query
        }
      })
      await store.dispatch('share/getShareReceivedList', {
        targetPage,
        sharingKey: sharingKey.value,
        workspaceNodeId: workspaceNodeId.value
      })
    }

    const search = () => refSearchTable.value.search(pagination.value.currentPage)

    const goTo = (key) => {
      workspaceNodeId.value = key.split('-')[1]
      store.dispatch('helper/search/setPagination', { currentPage: 1 })
      search()
    }

    return {
      share,
      SEARCH_TYPE,
      optionSort,
      getShareReceivedList,
      nodeList,
      selectedNodeKeyList,
      NODE_TYPE,
      breadcrumbList,
      pagination,
      workspaceCollection,
      isCollectionDetailExpand,
      goTo,
      refSearchTable
    }
  }
}
</script>
