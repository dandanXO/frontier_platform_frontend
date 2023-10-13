<template lang="pug">
div(class="relative")
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
        f-tooltip-standard(v-if="!isFirstLayer" :tooltipMessage="$t('RR0167')")
          template(#slot:tooltip-trigger)
            f-svg-icon(
              iconName="clone"
              class="text-grey-600 cursor-pointer hover:text-primary-400 ml-1"
              size="24"
              @click="publicCloneByCollection(currentNodeKey, collection.publish.isCanClone)"
            )
    template(#header-right)
      f-button(
        v-if="!isFirstLayer"
        size="sm"
        type="secondary"
        @click="openModalCollectionDetail"
      ) {{ $t('UU0057') }}
    template(#sub-header)
      i18n-t(
        v-if="!isFirstLayer"
        keypath="II0002"
        tag="p"
        class="mx-7.5 mb-7.5 text-caption text-grey-600"
        scope="global"
      )
        template(#displayName) {{ publishBy }}
    template(
      #banner="{ inSearch }"
      v-if="pagination.currentPage === 1 && isFirstLayer"
    )
      div(v-if="!inSearch" class="pb-6 px-7.5")
        div(
          class="rounded-md box-border p-5 flex flex-col gap-y-4 justify-between shadow-2 bg-center bg-cover"
          :style="{ backgroundImage: `url(${banner.coverImg})` }"
        )
          h6(
            class="text-h6 font-bold"
            :class="[banner.color === BANNER_TEXT_COLOR.WHITE ? 'text-grey-0' : 'text-grey-900']"
          ) {{ banner.title }}
          component(:is="bannerDescriptionComponent")
        div(class="mt-4 w-full")
          showroom-carousel
    template(#default="{ goTo }")
      div(
        v-if="nodeList.length > 0"
        class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start"
      )
        grid-item-node(
          v-for="node in nodeList"
          :key="node.nodeKey"
          v-model:selectedValue="selectedNodeList"
          :node="node"
          :isSelectable="!isFirstLayer"
          :optionList="optionNode"
          @click:option="$event.func(node)"
          @click:node="handleNodeClick(node, goTo)"
        )
          template(#caption v-if="isFirstLayer")
            div(class="mt-1.5 h-6 flex items-center")
              f-avatar(:imageUrl="node.publish.logo" type="org" size="sm")
              p(class="pl-1 font-bold text-caption text-grey-900") {{ node.publish.displayName }}
      div(v-else class="flex h-full justify-center items-end")
        p(class="text-body1 text-grey-900") {{ $t('II0007') }}
  div(v-if="planStatus.INACTIVE" class="absolute inset-0 z-99 opacity-30 bg-grey-0")
  notify-bar-inactive(
    v-if="planStatus.INACTIVE || planStatus.TRANSITION"
    class="absolute bottom-0 left-0 z-100"
  )
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import {
  SEARCH_TYPE,
  NODE_TYPE,
  useConstants,
  BANNER_TEXT_COLOR,
} from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { watch, ref, computed } from 'vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import { useRoute, useRouter } from 'vue-router'
import usePublicLibrary from '@/composables/usePublicLibrary'
import useNavigation from '@/composables/useNavigation'
import NotifyBarInactive from '@/components/billings/NotifyBarInactive.vue'
import ShowroomCarousel from '@/components/showroom/ShowroomCarousel.vue'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()
const {
  publicCloneByNode,
  publicCloneByNodeList,
  publicCloneByCollection,
  optionShareNode,
} = usePublicLibrary()
const { goToPublicLibraryMaterialDetail } = useNavigation()

const props = defineProps({
  nodeKey: {
    type: String,
    default: null,
  },
})

const optionSort = computed(() => {
  const { SORT_BY } = useConstants()
  const {
    RANDOM,
    NEW_ARRIVED,
    GHG_RESULTS,
    WATER_DEPLETION_RESULTS,
    LAND_USE_RESULTS,
  } = SORT_BY.value
  return {
    base: [
      RANDOM,
      NEW_ARRIVED,
      GHG_RESULTS,
      WATER_DEPLETION_RESULTS,
      LAND_USE_RESULTS,
    ],
    keywordSearch: [],
  }
})

const optionMultiSelect = computed(() => [
  {
    name: t('RR0167'),
    func: publicCloneByNodeList,
  },
])
const planStatus = computed(() => store.getters['polling/planStatus'])
const pagination = computed(() => store.getters['helper/search/pagination'])
const collection = computed(() => store.getters['publicLibrary/collection'])
const breadcrumbList = computed(() =>
  store.getters['publicLibrary/collectionBreadcrumbList']({
    name: t('RR0003'),
    nodeKey: null,
  })
)
const isFirstLayer = computed(() => breadcrumbList.value.length === 1)
const nodeList = computed(() => store.getters['publicLibrary/nodeList'])
const publishBy = computed(() => collection.value.publish.displayName)
const optionNode = computed(() => {
  return [
    [
      {
        name: t('RR0167'),
        func: publicCloneByNode,
      },
      optionShareNode,
    ],
  ]
})

const currentNodeKey = ref(props.nodeKey)
const selectedNodeList = ref([])

const getPublicList = async (targetPage = 1, query) => {
  router.push({
    name: route.name,
    params: {
      nodeKey: currentNodeKey.value,
    },
    query,
  })
  await store.dispatch('publicLibrary/getPublicList', {
    targetPage,
    nodeKey: currentNodeKey.value === '' ? null : currentNodeKey.value,
  })
}

const openModalCollectionDetail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-collection-detail',
    properties: {
      ...collection.value,
    },
  })
}

const handleNodeClick = (node, goTo) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    currentNodeKey.value = node.nodeKey
    goTo()
  } else {
    goToPublicLibraryMaterialDetail(node.nodeKey, node.rank)
  }
}

watch(
  () => isFirstLayer.value,
  () => (selectedNodeList.value.length = 0)
)

/** Showroom */
const banner = computed(() => store.getters['showroom/banner'])
const bannerDescriptionComponent = computed(
  () => store.getters['showroom/bannerDescriptionComponent']
)
</script>
