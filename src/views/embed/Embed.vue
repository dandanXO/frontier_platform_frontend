<template lang="pug">
div(class="w-315 h-full mx-auto pt-10")
  search-table(
    :searchType="SEARCH_TYPE.SHARE"
    :canSelectAll="false"
    :optionSort="optionSort"
    :searchCallback="getEmbedList"
    :itemList="nodeList"
  )
    template(#header-above="{ goTo }")
      div(class="mx-7.5 pt-5 -mb-7")
        div(class="flex justify-between items-center pb-5")
          div(class="flex items-center")
            img(:src="logo" class="w-10 h-10 rounded-full")
            div(class="flex items-end pl-2.5")
              breadcrumb(:breadcrumbList="breadcrumbList" @click:item="(currentNodeKey = $event.nodeKey); goTo()" fontSize="text-h5")
              p(class="flex text-caption text-black-700 pl-1")
                span (
                i18n-t(keypath="RR0068" tag="span")
                  template(#number) {{ pagination.totalCount }}
                span )
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
    template(#default="{ goTo }")
      div(v-if="nodeList.length > 0" class="mx-7.5 grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start")
        child-node-item(
          v-for="node in nodeList"
          :nodeType="node.nodeType"
          :properties="node"
          :displayName="node.nodeType === NODE_TYPE.COLLECTION ? node.name : node.materialNo"
          :isSelectable="false"
          @click.stop="handleNodeClick(node, goTo)"
        )
div(class="fixed z-footer bottom-0 w-full h-13 bg-black-100 px-36 flex items-center justify-end card-shadow")
  img(src="@/assets/images/frontier_logo.png" class="w-20.5 h-4 mr-2")
  p(class="text-body2 text-primary") {{ $t("GG0004") }}
</template>

<script setup>
import SearchTable from '@/components/layout/SearchTable.vue'
import ChildNodeItem from '@/components/layout/ChildNodeItem.vue'
import { SEARCH_TYPE, SORT_BY, NODE_TYPE } from '@/utils/constants.js'
import useNavigation from '@/composables/useNavigation.js'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

const store = useStore()
const route = useRoute()
const router = useRouter()
const { goToEmbedMaterialDetail } = useNavigation()

const props = defineProps({
  sharingKey: {
    type: String,
    required: true
  },
  nodeKey: {
    type: String,
    required: true
  }
})

const optionSort = {
  base: [
    SORT_BY.MATERIAL_NO_A_Z_C_M,
    SORT_BY.NEW_ARRIVED
  ],
  keywordSearch: [
    SORT_BY.RELEVANCE_M_C
  ]
}

const share = computed(() => store.getters['embed/share'])
const logo = computed(() => store.getters['embed/logo'])
const pagination = computed(() => store.getters['helper/search/pagination'])
const nodeList = computed(() => store.getters['embed/nodeList'])
const breadcrumbList = computed(() => store.getters['embed/collectionBreadcrumbList']())
const collection = computed(() => store.getters['embed/collection'])
const currentNodeKey = ref(props.nodeKey)
const isCollectionDetailExpand = ref(true)

const getEmbedList = async (targetPage = 1, query) => {
  await router.push({
    name: route.name,
    params: {
      nodeKey: currentNodeKey.value
    },
    query
  })
  await store.dispatch('embed/getEmbedList', {
    targetPage,
    sharingKey: share.value.sharingKey,
    nodeKey: currentNodeKey.value
  })
}

const handleNodeClick = (node, goTo) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    currentNodeKey.value = node.nodeKey
    goTo()
  } else {
    goToEmbedMaterialDetail(node.nodeKey, share.value.sharingKey)
  }
}
</script>
