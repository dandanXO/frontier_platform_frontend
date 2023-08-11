<style lang="scss">
#pagination-container {
  @apply pb-20 xl:pb-30;
}
.v-enter-active {
  transition: all 0.2s ease-out;
}
.v-leave-active {
  transition: all 0.2s ease-in;
}

.v-enter-to {
  opacity: 0;
  height: 324px;
}
.v-enter-from {
  opacity: 0;
  height: 0px;
}
.v-leave-to {
  opacity: 0;
  height: 0px;
}
</style>

<template lang="pug">
div(class="max-w-315 h-full mx-auto")
  search-table(
    :searchType="SEARCH_TYPE.SHARE"
    :optionSort="optionSort"
    :optionMultiSelect="optionMultiSelect"
    :searchCallback="getShareReceivedList"
    :itemList="nodeList"
    v-model:selectedItemList="selectedNodeList"
  )
    template(#header-left="{ goTo }")
      div(class="flex items-start")
        div(class="flex items-end pr-3")
          global-breadcrumb-list(
            :breadcrumbList="breadcrumbList"
            @click:item="currentNodeKey = $event.nodeKey; goTo()"
            fontSize="text-h5"
          )
          p(class="flex text-caption text-grey-600 pl-1")
            span (
            i18n-t(keypath="RR0068" tag="span" scope="global")
              template(#number) {{ pagination.totalCount }}
            span )
        f-tooltip-standard(:tooltipMessage="$t('RR0056')")
          template(#slot:tooltip-trigger)
            f-svg-icon(
              iconName="clone"
              class="text-grey-600 hover:text-primary-400 cursor-pointer"
              size="24"
              @click="receivedShareCloneByNodeKey(currentNodeKey)"
            )
    template(#sub-header)
      collection-overview(:collection="collection")
    template(#default="{ goTo }")
      div(
        v-if="nodeList.length > 0"
        class="mx-7.5 grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start"
      )
        grid-item-node(
          v-for="node in nodeList"
          :key="node.nodeKey"
          v-model:selectedValue="selectedNodeList"
          :node="node"
          @click:node="handleNodeClick(node, goTo)"
        )
          template(#corner-bottom-left)
            f-svg-icon(
              iconName="clone"
              size="20"
              class="cursor-pointer text-grey-250"
              @click.stop="receivedShareCloneByNodeKey(node.nodeKey)"
            )
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { SEARCH_TYPE, NODE_TYPE, useConstants } from '@/utils/constants'
import { useRoute, useRouter } from 'vue-router'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import useReceivedShare from '@/composables/useReceivedShare.js'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation.js'
import CollectionOverview from '@/components/outerApp/CollectionOverview.vue'

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const router = useRouter()
const props = defineProps({
  nodeKey: {
    type: String,
    required: true,
  },
})

const { receivedShareCloneByNodeKey, receivedShareCloneByNodeList } =
  useReceivedShare()
const { goToReceivedShareMaterial } = useNavigation()

const share = computed(() => store.getters['receivedShare/share'])
const optionSort = computed(() => {
  const { SORT_BY } = useConstants()
  const {
    MATERIAL_NO_A_Z_C_M,
    NEW_ARRIVED,
    GHG_RESULTS,
    WATER_DEPLETION_RESULTS,
    LAND_USE_RESULTS,
    RELEVANCE_M_C,
  } = SORT_BY.value
  return {
    base: [
      MATERIAL_NO_A_Z_C_M,
      NEW_ARRIVED,
      {
        ...GHG_RESULTS,
        disabled: !share.value.isSourceOrgHasMade2FlowPlan,
        tooltipMessage: t('VV0047'),
      },
      {
        ...WATER_DEPLETION_RESULTS,
        disabled: !share.value.isSourceOrgHasMade2FlowPlan,
        tooltipMessage: t('VV0047'),
      },
      {
        ...LAND_USE_RESULTS,
        disabled: !share.value.isSourceOrgHasMade2FlowPlan,
        tooltipMessage: t('VV0047'),
      },
    ],
    keywordSearch: [RELEVANCE_M_C],
  }
})

const optionMultiSelect = computed(() => [
  {
    name: t('RR0167'),
    func: receivedShareCloneByNodeList,
  },
])

const pagination = computed(() => store.getters['helper/search/pagination'])
const nodeList = computed(() => store.getters['receivedShare/nodeList'])
const breadcrumbList = computed(() =>
  store.getters['receivedShare/collectionBreadcrumbList']()
)
const collection = computed(() => store.getters['receivedShare/collection'])
const currentNodeKey = ref(props.nodeKey)
const selectedNodeList = ref([])

const getShareReceivedList = async (targetPage = 1, query) => {
  router.push({
    name: route.name,
    params: {
      nodeKey: currentNodeKey.value,
    },
    query,
  })
  await store.dispatch('receivedShare/getShareReceivedList', {
    targetPage,
    sharingKey: share.value.sharingKey,
    nodeKey: currentNodeKey.value,
  })
}

const handleNodeClick = (node, goTo) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    currentNodeKey.value = node.nodeKey
    goTo()
  } else {
    goToReceivedShareMaterial(node.nodeKey, share.value.sharingKey, node.rank)
  }
}
</script>
