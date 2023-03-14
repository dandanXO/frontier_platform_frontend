<style lang="scss">
#pagination-container {
  padding-bottom: 152px;
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
          f-breadcrumb(
            :breadcrumbList="breadcrumbList"
            @click:item="currentNodeKey = $event.nodeKey; goTo()"
            fontSize="text-h5"
          )
          p(class="flex text-caption text-grey-600 pl-1")
            span (
            i18n-t(keypath="RR0068" tag="span" scope="global")
              template(#number) {{ pagination.totalCount }}
            span )
    template(#sub-header)
      div(
        v-if="collection.description || collection.trendBoardCoverImg"
        class="px-7.5 pb-8 pt-1.5"
      )
        f-expansion-panel(
          class="drop-shadow-2 rounded border border-grey-150 overflow-hidden"
        )
          template(#trigger="{ isExpand }")
            div(
              class="group w-full h-14 flex items-center gap-x-6 px-7 cursor-pointer"
              :class="[isExpand ? 'bg-grey-50 hover:bg-grey-150 active:bg-grey-50' : 'bg-grey-0 hover:bg-grey-100 active:bg-grey-150']"
            )
              h5(class="text-body1 text-grey-900 font-bold cursor-pointer") {{ $t('RR0246') }}
              span(
                v-if="collection.description && !isExpand"
                class="max-w-100 line-clamp-1 text-grey-300 text-body2"
              ) {{ collection.description }}
              span(
                class="text-body2 flex-grow"
                :class="[isExpand ? 'text-grey-400 invisible group-hover:visible' : 'text-primary-400']"
              ) {{ isExpand ? 'Show less' : 'Show more' }}
              div(
                v-if="isExpand"
                class="w-7 h-7 rounded-full flex items-center justify-center bg-grey-150 group-hover:bg-grey-200"
              )
                f-svg-icon(iconName="close" size="24" class="transform text-grey-600")
          template(#content)
            div(class="w-full h-81 bg-grey-50 py-6 px-7 flex justify-between")
              div(class="w-155.5 h-full")
                f-scrollbar-container(
                  v-if="collection.description"
                  :sizeAutoCapable="false"
                  class="h-full -ml-6.5 px-6.5 break-all text-body2 text-grey-900 leading-1.6"
                )
                  pre(
                    class="whitespace-pre-wrap"
                    :style="{ 'word-break': 'break-word', 'font-family': 'unset' }"
                  ) {{ collection.description }}
                p(v-else class="text-body2 text-grey-900 leading-1.6") {{ $t('FF0008') }}
              div(
                class="relative w-97.5 h-69 rounded bg-grey-250 flex items-center justify-center flex-shrink-0"
              )
                div(
                  v-if="collection.trendBoardCoverImg"
                  class="rounded w-full h-full px-7.5 py-6 bg-grey-100"
                )
                  div(
                    class="w-full h-full bg-cover bg-center rounded"
                    :style="{ backgroundImage: `url(${collection.trendBoardCoverImg})` }"
                  )
                  a(
                    :href="collection.trendBoardUrl"
                    target="_blank"
                    class="absolute right-3.5 bottom-3.5 card-shadow w-7 h-7 rounded-sm bg-grey-0 flex items-center justify-center"
                  )
                    f-svg-icon(iconName="open_in_new" class="text-grey-600" size="24")
                div(v-else)
                  f-svg-icon(iconName="file" size="110" class="text-grey-0 mx-auto")
                  p(class="text-body1 font-bold text-grey-50 pt-3") {{ $t('RR0247') }}
    template(#default="{ goTo }")
      div(
        v-if="nodeList.length > 0"
        class="mx-7.5 grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start"
      )
        grid-item-node(
          v-for="node in nodeList"
          :node="node"
          :isSelectable="false"
          @click.stop="handleNodeClick(node, goTo)"
          :canAddSticker="false"
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
        tooltip: t('VV0047'),
      },
      {
        ...WATER_DEPLETION_RESULTS,
        disabled: !share.value.isSourceOrgHasMade2FlowPlan,
        tooltip: t('VV0047'),
      },
      {
        ...LAND_USE_RESULTS,
        disabled: !share.value.isSourceOrgHasMade2FlowPlan,
        tooltip: t('VV0047'),
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
