<template lang="pug">
div(class="w-full h-full flex flex-col px-8 pt-8 gap-8 bg-primary" v-bind="$attrs")
  slot(name="box-above")
  div(class="flex flex-col gap-5 min-h-0 flex-1")
    assets-header
    div(
      v-if="pagination"
      class="md:overflow-y-auto flex-grow flex flex-col"
      ref="scrollContainer"
    )
      div(
        v-if="inSearch && pagination.totalCount === 0"
        class="flex-grow flex flex-col justify-center items-center"
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
          @goTo="search($event)"
        )
multi-select-menu(
  v-if="optionMultiSelect && optionMultiSelect.length > 0 && innerSelectedItemList"
  :optionMultiSelect="optionMultiSelect"
  v-model:selectedList="innerSelectedItemList"
)
  template(#default="{ option }")
    slot(name="menu-option" :option="option")
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
  NodeChild,
  PaginationReqSortEnum,
  AssetsFilter,
  WorkspaceFilter,
  ExternalFilter,
  InnerExternalFilter,
  Search,
  PaginationReq,
  ShareNodeChild,
} from '@frontier/platform-web-sdk'
import { useSearchStore } from '@/stores/search'
import { useFilterStore } from '@/stores/filter'
import MultiSelectMenu from '@/components/common/MultiSelectMenu.vue'
import AssetsHeader from '../assets/AssetsHeader.vue'
import type { SortOption } from '@/stores/assets/library'

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
    optionMultiSelect?:
      | FunctionOption<Material>[]
      | FunctionOption<NodeChild>[]
      | FunctionOption<ShareNodeChild>[]
    searchCallback: (
      payload:
        | SearchPayload<AssetsFilter>
        | SearchPayload<WorkspaceFilter>
        | SearchPayload<InnerExternalFilter>
        | SearchPayload<ExternalFilter>,
      query: RouteQuery
    ) => Promise<void>
    itemList: Material[] | NodeChild[] | ShareNodeChild[]
    testId?: string
    canSelectAll?: boolean
    canFilter?: boolean
    selectedItemList?: Material[] | NodeChild[] | ShareNodeChild[]
    assets?: boolean
    isAssetSlimListLoading?: boolean
    displayMode?: ASSET_LIST_DISPLAY_MODE
    rightIconSearch?: string
  }>(),
  {
    canSelectAll: true,
    canFilter: true,
  }
)

const emit = defineEmits<{
  (e: 'clickRightIconSearch'): void
  (
    e: 'update:selectedItemList',
    value: Material[] | NodeChild[] | ShareNodeChild[]
  ): void
  (
    e: 'search',
    payload:
      | SearchPayload<AssetsFilter>
      | SearchPayload<WorkspaceFilter>
      | SearchPayload<InnerExternalFilter>
      | SearchPayload<ExternalFilter>,
    query: RouteQuery
  ): void
}>()

const route = useRoute()
const searchStore = useSearchStore()
const filterStore = useFilterStore()
const {
  keyword,
  selectedTagList,
  sort,
  isShowMatch,
  paginationRes: pagination,
  isSubmitted,
} = storeToRefs(searchStore)
const { isFilterDirty, filterState, filterDirty } = storeToRefs(filterStore)

const isSearching = ref(false)
const inSearch = ref(false)
const isKeywordDirty = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
const defaultSort = computed(() => props.optionSort.base[0].value)
const searchDirty = computed(() => {
  return isKeywordDirty.value || isFilterDirty.value
})

const visit = () => {
  searchStore.setSort(defaultSort.value)
  search()
}

const innerSelectedItemList = computed({
  get: () => props.selectedItemList,
  set: (v) => emit('update:selectedItemList', v),
})

const handleSearch = () => {
  searchStore.setKeyword(searchStore.keyword?.trim() ?? null)
  search()
}

watch(isSubmitted, (isSubmittedNow) => {
  isSubmittedNow && handleSearch()
})

const search = async (targetPage = 1) => {
  if (!props.assets) {
    isSearching.value = true
  }

  if (props.optionSort.keywordSearch.length > 0) {
    if (!isKeywordDirty.value && !!keyword.value) {
      searchStore.setSort(props.optionSort.keywordSearch[0].value)
    } else if (isKeywordDirty.value && !keyword.value) {
      searchStore.setSort(defaultSort.value)
    }
  }

  isKeywordDirty.value = !!keyword.value

  inSearch.value = searchDirty.value

  const { densityAndYarn } = filterState.value
  const woven = filterDirty.value.densityAndYarn
    ? densityAndYarn.knit.knitYarnSize === null
      ? densityAndYarn.woven
      : null
    : null
  const knit =
    woven === null && filterDirty.value.densityAndYarn
      ? {
          knitYarnSize: densityAndYarn.knit.knitYarnSize as string,
        }
      : null
  await props.searchCallback(
    {
      pagination: {
        sort: sort.value,
        isShowMatch: isShowMatch.value,
        targetPage,
        perPageCount: 40,
      },
      search: (() => {
        return !keyword.value && selectedTagList.value.length === 0
          ? null
          : {
              keyword: keyword.value,
              tagList: selectedTagList.value,
            }
      })(),
      filter: (() => {
        if (!isFilterDirty.value) {
          return null
        }

        return {
          ...Object.keys(filterState.value).reduce((acc, key) => {
            const property = key as keyof typeof filterState.value

            if (props.searchType !== SEARCH_TYPE.ASSETS) {
              if (property === 'status') {
                return acc
              }
              if (props.searchType !== SEARCH_TYPE.WORKSPACE) {
                if (property === 'withOutEcoImpactor') {
                  return acc
                }
              }
            }

            if (props.searchType !== SEARCH_TYPE.INNER_EXTERNAL) {
              if (property === 'countryList') {
                return acc
              }
            }

            return {
              ...acc,
              [property]: filterDirty.value[property]
                ? filterState.value[property]
                : null,
            }
          }, {}),
          densityAndYarn: woven || knit ? { woven, knit } : null,
        } as
          | AssetsFilter
          | WorkspaceFilter
          | InnerExternalFilter
          | ExternalFilter
      })(),
    },
    {
      currentPage: targetPage,
      sort: sort.value,
      isShowMatch: isShowMatch.value ? isShowMatch.value : undefined,
      keyword: keyword.value ?? undefined,
      tagList:
        selectedTagList.value.length > 0
          ? encodeURI(JSON.stringify(selectedTagList.value))
          : undefined,
      filter: (() => {
        if (!isFilterDirty.value) {
          return undefined
        }
        return encodeURI(
          JSON.stringify(
            Object.keys(filterState.value).reduce((acc, key) => {
              const property = key as keyof typeof filterState.value

              return filterDirty.value[property]
                ? {
                    ...acc,
                    [property]: filterState.value[property],
                  }
                : acc
            }, {})
          )
        )
      })(),
    }
  )

  if (!props.assets) {
    isSearching.value = false
  }
}

watch(
  () => (props.assets ? props.isAssetSlimListLoading : isSearching.value),
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

search(currentPage ? Number(currentPage) : 1)
</script>
