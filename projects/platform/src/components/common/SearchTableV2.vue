<template lang="pug">
div(class="flex flex-col w-full h-full gap-8 px-8 bg-primary" v-bind="$attrs")
  slot(name="box-above")
  div(class="flex flex-row gap-5 min-h-0 min-w-[1440px] flex-1")
    slot(name="left-side-content")
    div(
      v-if="pagination"
      class="flex flex-col flex-grow md:overflow-y-auto"
      ref="scrollContainer"
    )
      div(
        v-if="inSearch && pagination.totalCount === 0"
        class="flex flex-col items-center justify-center flex-grow"
      )
        p(class="text-center text-body2 text-grey-900") {{ $t('RR0105') }}
      div(class="flex-grow" v-else)
        slot(
          :inSearch="inSearch"
          :currentPage="pagination.currentPage"
          name="banner"
        )
        slot(:inSearch="inSearch" :visit="visit" :isSearching="isSearching")
      #pagination-container(
        v-if="!isSearching && pagination.totalCount > 0"
        class="py-9.5 self-center"
      )
        f-paginator(
          showQuickJumper
          v-model:currentPage="pagination.currentPage"
          :totalPage="pagination.totalPage"
          @goTo="assetsLibraryStore.search($event)"
        )
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineOptions,
  nextTick,
  watch,
  onBeforeUnmount,
} from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import {
  SEARCH_TYPE,
  ASSET_LIST_DISPLAY_MODE,
  SCROLL_POSITION_KEY,
} from '@/utils/constants'
import type { FunctionOption } from '@/types'
import type {
  Material,
  PaginationReqSortEnum,
  Search,
  PaginationReq,
} from '@frontier/platform-web-sdk'
import { useSearchStore } from '@/stores/search'
import { useFilterStore } from '@/stores/filter'
import { useAssetsLibraryStore, type SortOption } from '@/stores/assets/library'
import { noop } from '@vueuse/core'

defineOptions({
  inheritAttrs: false,
})

export interface SearchPayload<FilterType> {
  pagination: PaginationReq
  search: Search | null
  filter: FilterType | null
}

export interface RouteQuery {
  currentPage: number
  sort: PaginationReqSortEnum
  isShowMatch?: boolean
  keyword?: string
  tagList?: string
  filter?: string
}

const props = withDefaults(
  defineProps<{
    searchType: SEARCH_TYPE
    optionSort: {
      base: SortOption[]
      keywordSearch: SortOption[]
      disabled?: boolean
    }
    optionMultiSelect?: FunctionOption<Material>[]
    itemList: Material[]
    testId?: string
    selectedItemList?: Material[]
    isAssetSlimListLoading?: boolean
    displayMode?: ASSET_LIST_DISPLAY_MODE
  }>(),
  {}
)

const route = useRoute()
const searchStore = useSearchStore()
const filterStore = useFilterStore()
const assetsLibraryStore = useAssetsLibraryStore()
const { isSearching, inSearch } = storeToRefs(assetsLibraryStore)
const { paginationRes: pagination } = storeToRefs(searchStore)
const scrollContainer = ref<HTMLElement | null>(null)
const defaultSort = computed(() => props.optionSort.base[0].value)

const search = computed(() =>
  props.searchType === SEARCH_TYPE.ASSETS ? assetsLibraryStore.search : noop
)

const visit = () => {
  searchStore.setSort(defaultSort.value)
  search.value()
}

watch(
  () =>
    props.searchType === SEARCH_TYPE.ASSETS
      ? props.isAssetSlimListLoading
      : isSearching.value,
  (newVal) => {
    nextTick(() => {
      if (!newVal && props.displayMode === ASSET_LIST_DISPLAY_MODE.GRID) {
        const savedData = sessionStorage.getItem(SCROLL_POSITION_KEY)
        if (scrollContainer.value && savedData) {
          const { position, page } = JSON.parse(savedData)
          if (page === pagination.value?.currentPage) {
            smoothScrollTo(scrollContainer.value, position)
            sessionStorage.removeItem(SCROLL_POSITION_KEY)
          }
        }
      }
    })
  }
)

onBeforeUnmount(() => {
  if (scrollContainer.value) {
    sessionStorage.setItem(
      SCROLL_POSITION_KEY,
      scrollContainer.value.scrollTop.toString()
    )
  }
})

const smoothScrollTo = (
  element: HTMLElement,
  target: number,
  duration: number = 500
) => {
  const start = element.scrollTop
  const change = target - start
  const startTime = performance.now()

  function animateScroll(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1) // progress from 0 to 1
    element.scrollTop = start + change * easeInOutQuad(progress)

    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }

  function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  requestAnimationFrame(animateScroll)
}

// Initialize search and filter
const {
  currentPage,
  sort: qSort,
  isShowMatch: qIsShowMatch,
  keyword: qKeyword,
  tagList: qTagList,
  filter: qFilter,
} = route.query

searchStore.setSort(
  qSort ? (Number(qSort) as PaginationReqSortEnum) : defaultSort.value
)
searchStore.setIsShowMatch(qIsShowMatch === 'true')
searchStore.setKeyword(qKeyword ? (qKeyword as string) : null)
searchStore.getAITags()
searchStore.setSelectedTagList(
  qTagList ? JSON.parse(decodeURI(qTagList as string)) : []
)

filterStore.setFilterStateByQueryString(qFilter ? (qFilter as string) : '{}')
search.value(currentPage ? Number(currentPage) : 1)
</script>
