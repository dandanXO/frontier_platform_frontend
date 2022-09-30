<style lang="scss">
#pagination-container {
  padding-bottom: 152px;
}
</style>

<template lang="pug">
div(class="max-w-315 h-full mx-auto pt-10")
  search-table(
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
          f-breadcrumb(:breadcrumbList="breadcrumbList" @click:item="(currentNodeKey = $event.nodeKey); goTo()" fontSize="text-h5")
          p(class="flex text-caption text-black-700 pl-1")
            span (
            i18n-t(keypath="RR0068" tag="span" scope="global")
              template(#number) {{ pagination.totalCount }}
            span )
    template(#sub-header)
      f-expansion-panel(class="px-7.5 pb-8 pt-1.5" isExpand)
        template(#trigger="{ isExpand }")
          div(class="w-full h-12 border border-primary-middle bg-black-0 flex items-center justify-between pl-7 pr-4 cursor-pointer"  :class="[isExpand ? 'rounded-t bg-black-200' : 'rounded']")
            h5(class="text-caption text-primary font-bold") {{ $t("RR0246") }}
            f-svg-icon(
              iconName="keyboard_arrow_right"
              size="20"
              class="transform text-primary"
              :class="[isExpand ? '-rotate-90' : 'rotate-90']"
            )
        template(#content)
          div(class="w-full h-81 border border-primary-middle rounded-b !border-t-0 py-6 pl-7 pr-11 flex justify-between")
            div(class="w-155.5 h-full")
              f-scrollbar-container(v-if="collection.description" :sizeAutoCapable="false" class="h-full -ml-6.5 px-6.5 break-all text-body2 text-primary leading-1.6") {{ collection.description }}
              p(v-else class="text-body2 text-primary leading-1.6") {{ $t("FF0008") }}
            div(class="relative w-97.5 h-69 rounded bg-black-400 flex items-center justify-center flex-shrink-0")
              div(v-if="collection.trendBoardCoverImg" class="rounded w-full h-full px-7.5 py-6 bg-black-200")
                div(class="w-full h-full bg-cover bg-center rounded" :style="{ backgroundImage: `url(${collection.trendBoardCoverImg})`}")
                a(:href="collection.trendBoardUrl" target="_blank" class="absolute right-3.5 bottom-3.5 card-shadow w-7 h-7 rounded-sm bg-black-0 flex items-center justify-center")
                  f-svg-icon(iconName="open_in_new" class="text-black-700" size="24")
              div(v-else)
                f-svg-icon(iconName="file" size="110" class="text-black-0 mx-auto")
                p(class="text-body1 font-bold text-black-50 pt-3") {{ $t("RR0247") }}
    template(#default="{ goTo }")
      div(v-if="nodeList.length > 0" class="mx-7.5 grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start")
        grid-item-node(
          v-for="node in nodeList"
          :node="node"
          :isSelectable="false"
          @click.stop="handleNodeClick(node, goTo)"
        )
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import { SEARCH_TYPE, SORT_BY, NODE_TYPE } from '@/utils/constants.js'
import useNavigation from '@/composables/useNavigation.js'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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

const share = computed(() => store.getters['embed/share'])
const optionSort = computed(() => {
  return {
    base: [
      SORT_BY.MATERIAL_NO_A_Z_C_M,
      SORT_BY.NEW_ARRIVED,
      { ...SORT_BY.GHG_RESULTS, disabled: !share.value.isSourceOrgHasMade2FlowPlan, tooltip: t('VV0047') },
      { ...SORT_BY.WATER_DEPLETION_RESULTS, disabled: !share.value.isSourceOrgHasMade2FlowPlan, tooltip: t('VV0047') },
      { ...SORT_BY.LAND_USE_RESULTS, disabled: !share.value.isSourceOrgHasMade2FlowPlan, tooltip: t('VV0047') }
    ],
    keywordSearch: [
      SORT_BY.RELEVANCE_M_C
    ]
  }
})
const logo = computed(() => store.getters['embed/logo'])
const pagination = computed(() => store.getters['helper/search/pagination'])
const nodeList = computed(() => store.getters['embed/nodeList'])
const breadcrumbList = computed(() => store.getters['embed/collectionBreadcrumbList']())
const collection = computed(() => store.getters['embed/collection'])
const currentNodeKey = ref(props.nodeKey)

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
