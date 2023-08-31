<style lang="scss">
#pagination-container {
  @apply pb-20 md:pb-30;
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
div(class="w-full h-full flex flex-col items-center md:pt-10")
  search-table(
    class="max-w-315"
    :searchType="SEARCH_TYPE.SHARE"
    :canSelectAll="false"
    :optionSort="optionSort"
    :searchCallback="getEmbedList"
    :itemList="nodeList"
  )
    template(#header-left="{ goTo }")
      div(class="flex items-center")
        img(:src="logo" class="w-10 h-10 rounded-full")
        div(class="flex items-end pl-2.5")
          global-breadcrumb-list(
            :breadcrumbList="breadcrumbList"
            @click:item="currentNodeKey = $event.nodeKey; goTo()"
          )
          p(class="flex text-caption text-grey-600 pl-1")
            span (
            i18n-t(keypath="RR0068" tag="span" scope="global")
              template(#number) {{ pagination.totalCount }}
            span )
    template(#sub-header)
      collection-overview(:collection="collection")
    template(#default="{ goTo }")
      div(
        v-if="nodeList.length > 0"
        class="mx-7.5 grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-y-6.5 md:gap-x-5 grid-flow-row auto-rows-auto content-start"
      )
        grid-item-node(
          v-for="node in nodeList"
          :key="node.nodeKey"
          :node="node"
          :isSelectable="false"
          @click:node="handleNodeClick(node, goTo)"
        )
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import { SEARCH_TYPE, NODE_TYPE, useConstants } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation.js'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CollectionOverview from '@/components/outerApp/CollectionOverview.vue'

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const router = useRouter()
const { goToEmbedMaterialDetail } = useNavigation()

const props = defineProps({
  sharingKey: {
    type: String,
    required: true,
  },
  nodeKey: {
    type: String,
    required: true,
  },
})

const share = computed(() => store.getters['embed/share'])
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
const logo = computed(() => store.getters['embed/logo'])
const pagination = computed(() => store.getters['helper/search/pagination'])
const nodeList = computed(() => store.getters['embed/nodeList'])
const breadcrumbList = computed(() =>
  store.getters['embed/collectionBreadcrumbList']()
)
const collection = computed(() => store.getters['embed/collection'])
const currentNodeKey = ref(props.nodeKey)

const getEmbedList = async (targetPage = 1, query) => {
  router.push({
    name: route.name,
    params: {
      nodeKey: currentNodeKey.value,
    },
    query,
  })
  await store.dispatch('embed/getEmbedList', {
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
    goToEmbedMaterialDetail(node.nodeKey, share.value.sharingKey, node.rank)
  }
}
</script>
