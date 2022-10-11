<template lang="pug">
div(class="w-full h-full relative")
  search-table(
    :searchType="SEARCH_TYPE.PUBLIC_LIBRARY"
    :searchCallback="getPublicList"
    :optionSort="optionSort"
    :optionMultiSelect="optionMultiSelect"
    :canSelectAll="!isFirstLayer"
    :itemList="nodeList"
    v-model:selectedItemList="selectedNodeList"
  )
    template(#header-left="{ goTo }")
      div(class="flex items-center")
        div(class="flex items-end")
          f-breadcrumb(:breadcrumbList="breadcrumbList" @click:item="(currentNodeKey = $event.nodeKey); goTo()" fontSize="text-h6")
          p(class="flex text-caption text-grey-600 pl-1")
            span (
            i18n-t(keypath="RR0068" tag="span" scope="global")
              template(#number) {{ pagination.totalCount }}
            span )
        f-tooltip(v-if="!isFirstLayer")
          template(#trigger)
            f-svg-icon(
              iconName="clone"
              class="text-grey-600 cursor-pointer hover:text-primary-400 ml-1"
              size="24"
              @click="publicCloneByCollection(currentNodeKey, collection.publish.isCanClone)"
            )
          template(#content)
            p {{ $t("RR0167") }}
    template(#header-right)
      f-button(v-if="!isFirstLayer" size="sm" type="secondary" class="-mr-3" @click="openModalCollectionDetail") {{ $t("UU0057") }}
    template(v-if="!isFirstLayer" #sub-header)
      i18n-t(keypath="II0002" tag="p" class="mx-7.5 mb-7.5 text-caption text-grey-600" scope="global")
        template(#displayName) {{ publishBy }}
    template(#default="{ goTo }")
      div(v-if="nodeList.length > 0" class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start")
        grid-item-node(
          v-for="node in nodeList"
          v-model:selectedValue="selectedNodeList"
          :node="node"
          :isSelectable="!isFirstLayer"
          :optionList="optionNode"
          @click:option="$event.func(node)"
          @click.stop="handleNodeClick(node, goTo)"
        )
          template(#caption v-if="isFirstLayer")
            div(class="mt-1.5 h-6 flex items-center")
              img(:src="node.publish.logo" class="aspect-square h-full rounded-full")
              p(class="pl-1 font-bold text-caption text-grey-900") {{ node.publish.displayName }}
      div(v-else class="flex h-full justify-center items-end")
        p(class="text-body1 text-grey-900") {{ $t("II0007") }}
  div(v-if="planStatus.INACTIVE" class="absolute inset-0 z-99 opacity-30 bg-grey-0")
  notify-bar-inactive(v-if="planStatus.INACTIVE || planStatus.TRANSITION" class="absolute bottom-0 left-0 z-100")
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import { SEARCH_TYPE, NODE_TYPE, useConstants } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { watch, ref, computed } from 'vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import { useRoute, useRouter } from 'vue-router'
import usePublicLibrary from '@/composables/usePublicLibrary'
import useNavigation from '@/composables/useNavigation'
import NotifyBarInactive from '@/components/billings/NotifyBarInactive.vue'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()
const { publicCloneByNode, publicCloneByNodeList, publicCloneByCollection, optionShareNode } = usePublicLibrary()
const { goToPublicLibraryMaterialDetail } = useNavigation()

const props = defineProps({
  nodeKey: {
    type: String,
    default: null
  }
})

const optionSort = computed(() => {
  const { SORT_BY } = useConstants()
  const { RANDOM, NEW_ARRIVED, GHG_RESULTS, WATER_DEPLETION_RESULTS, LAND_USE_RESULTS } = SORT_BY.value
  return {
    base: [
      RANDOM,
      NEW_ARRIVED,
      GHG_RESULTS,
      WATER_DEPLETION_RESULTS,
      LAND_USE_RESULTS
    ],
    keywordSearch: []
  }
})

const optionMultiSelect = [
  {
    name: t('RR0167'),
    func: publicCloneByNodeList
  }
]
const planStatus = computed(() => store.getters['polling/planStatus'])
const pagination = computed(() => store.getters['helper/search/pagination'])
const collection = computed(() => store.getters['publicLibrary/collection'])
const breadcrumbList = computed(() => store.getters['publicLibrary/collectionBreadcrumbList']({
  name: t('II0001'),
  nodeKey: null
}))
const isFirstLayer = computed(() => breadcrumbList.value.length === 1)
const nodeList = computed(() => store.getters['publicLibrary/nodeList'])
const publishBy = computed(() => collection.value.publish.displayName)
const optionNode = computed(() => {
  const optionList = [
    [
      {
        name: t('RR0167'),
        func: publicCloneByNode
      }
    ]
  ]
  if (isFirstLayer.value) {
    optionList[0].push(optionShareNode)
  }
  return optionList
})

const currentNodeKey = ref(props.nodeKey)
const selectedNodeList = ref([])

const getPublicList = async (targetPage = 1, query) => {
  await router.push({
    name: route.name,
    params: {
      nodeKey: currentNodeKey.value
    },
    query
  })
  await store.dispatch('publicLibrary/getPublicList', { targetPage, nodeKey: currentNodeKey.value === '' ? null : currentNodeKey.value })
}

const openModalCollectionDetail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-collection-detail',
    properties: {
      ...collection.value
    }
  })
}

const handleNodeClick = (node, goTo) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    currentNodeKey.value = node.nodeKey
    goTo()
  } else {
    goToPublicLibraryMaterialDetail(node.nodeKey)
  }
}

watch(
  () => isFirstLayer.value,
  () => (selectedNodeList.value.length = 0)
)
</script>
