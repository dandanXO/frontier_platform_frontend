<template lang="pug">
div(class="w-full h-full flex flex-col px-8 pt-8 gap-8 bg-primary" v-bind="$attrs")
  slot(name="box-above")
  div(class="flex flex-col items-center justify-center" data-cy="search-box")
    f-search-bar(
      :keyword="keyword"
      @typing="typing"
      @search="handleSearch"
      @clear="() => searchStore.setKeyword('')"
      :rightIcon="rightIconSearch"
      @clickRightIcon="$emit('clickRightIconSearch')"
      class="w-160"
    )
    filter-panel(
      v-if="isOpenFilterPanel"
      :searchType="searchType"
      @search="handleSearch"
      @resetFilter="resetFilterHandler"
    )
  div(class="flex flex-col gap-5 min-h-0 flex-1")
    slot(name="header-above" :visit="visit")
    div(
      data-tooltip-boundary-reference="search-table-header"
      :data-cy="testId ?? 'search-table'"
      class="flex justify-between items-center"
    )
      div
        slot(
          name="header-left"
          :visit="visit"
          :totalCount="pagination?.totalCount ?? 0"
        )
      div(class="flex items-center gap-x-5")
        f-input-checkbox(
          v-if="isKeywordDirty"
          :inputValue="isShowMatch"
          @update:inputValue="handleCheckboxInput"
          :label="$t('RR0069')"
          binary
          iconSize="20"
        )
        f-pill(
          :size="SIZE.LG"
          @click="selectAll"
          :disabled="!canSelectAll || isSearching"
        ) 
          f-svg-icon(iconName="checklist" size="24")
          p {{ $t('RR0209') }}
        f-popper(placement="bottom-end" v-if="!props.optionSort.disabled")
          template(#trigger="{ isExpand }")
            f-pill(:size="SIZE.LG" :active="isExpand") 
              f-svg-icon(iconName="sortby" size="24" class="transform cursor-pointer")
              p {{ $t('RR0272') }}

          template(#content)
            f-contextual-menu(
              :inputSelectValue="sort"
              @update:inputSelectValue="searchStore.setSort"
              :selectMode="CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL"
              :menuTree="sortMenuTree"
              @click:menu="search()"
            )
        f-pill(
          :size="SIZE.LG"
          @click="canFilter && (isOpenFilterPanel = !isOpenFilterPanel)"
          :active="isOpenFilterPanel"
          :disabled="!canFilter || isSearching"
        ) 
          f-svg-icon(iconName="instant_mix" size="24" class="transform cursor-pointer")
          p {{ $t('RR0085') }}
        slot(name="header-right")
    slot(name="sub-header")
    div(v-if="pagination" class="overflow-auto flex flex-1 flex-col")
      div(
        v-if="showLoading && (isSearching || (inSearch && pagination.totalCount === 0))"
        class="flex-grow flex flex-col justify-center items-center"
      )
        f-svg-icon(
          v-if="isSearching"
          iconName="loading"
          size="92"
          class="text-green-600-v1"
          testId="loading-indicator"
        )
        p(
          v-else-if="inSearch && pagination.totalCount === 0"
          class="text-center text-body2 text-grey-900"
        ) {{ $t('RR0105') }}
      div(v-else class="flex-grow")
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
import { ref, computed, defineOptions } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { debounce } from 'debounce'

import { SEARCH_TYPE, CONTEXTUAL_MENU_MODE, SIZE } from '@/utils/constants'
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
import FilterPanel from '@/components/common/FilterPanel.vue'

defineOptions({
  inheritAttrs: false,
})

export interface SortOption {
  text: string
  value: PaginationReqSortEnum
  disabled?: boolean
  tooltipMessage?: string
}

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
    rightIconSearch?: string
    showLoading?: boolean
  }>(),
  {
    canSelectAll: true,
    canFilter: true,
    showLoading: true,
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
} = storeToRefs(searchStore)
const { isFilterDirty, filterState, filterDirty } = storeToRefs(filterStore)

const isSearching = ref(false)
const inSearch = ref(false)
const isOpenFilterPanel = ref(false)
const isKeywordDirty = ref(false)
const defaultSort = computed(() => props.optionSort.base[0].value)
const searchDirty = computed(() => {
  return isKeywordDirty.value || isFilterDirty.value
})
const sortMenuTree = computed(() => {
  const { base, keywordSearch } = props.optionSort
  const temp = [...base]
  if (isKeywordDirty.value) {
    temp.unshift(...keywordSearch)
  }

  return {
    blockList: [
      {
        menuList: temp.map(
          ({ text, value, disabled = false, tooltipMessage = '' }) => ({
            title: text,
            selectValue: value,
            disabled,
            tooltipMessage,
            tooltipPlacement: 'top',
          })
        ),
      },
    ],
  }
})

const visit = () => {
  searchStore.setSort(defaultSort.value)
  search()
}

const innerSelectedItemList = computed({
  get: () => props.selectedItemList,
  set: (v) => emit('update:selectedItemList', v),
})

const selectAll = () => {
  if (!props.canSelectAll || !props.selectedItemList) {
    return
  }

  const stringifyItemList = props.itemList.map((item) => JSON.stringify(item))
  const stringifySelectedItemList = props.selectedItemList.map((item) =>
    JSON.stringify(item)
  )
  const nonDuplicateList = [
    ...new Set(stringifySelectedItemList.concat(stringifyItemList)),
  ].map((item) => JSON.parse(item))
  emit('update:selectedItemList', nonDuplicateList)
}

const resetFilterHandler = () => {
  if (isFilterDirty.value) {
    filterStore.resetFilterState()
    handleSearch()
  }
}

const debounceSearchAITag = debounce(searchStore.getAITags, 300)

const typing = (e: Event) => {
  const target = e.target as HTMLInputElement
  const v = target.value
  searchStore.setKeyword(v)
  if (v.trim() === '') {
    searchStore.setTagList([])
    searchStore.setSelectedTagList([])
    return
  }
  debounceSearchAITag()
}

const handleSearch = () => {
  searchStore.setKeyword(searchStore.keyword?.trim() ?? null)
  search()
}

const search = async (targetPage = 1) => {
  isSearching.value = true

  /**
   * when first time using keyword search (no keyword -> with keyword),
   * sort value will automatically change to optionSort.keywordSearch[0].value,
   * and when first time searching without keyword (with keyword -> no keyword),
   * sort value will automatically change to defaultSort.value
   */
  if (props.optionSort.keywordSearch.length > 0) {
    if (!isKeywordDirty.value && !!keyword.value) {
      searchStore.setSort(props.optionSort.keywordSearch[0].value)
    } else if (isKeywordDirty.value && !keyword.value) {
      searchStore.setSort(defaultSort.value)
    }
  }

  isKeywordDirty.value = !!keyword.value

  // only when searchDirty is true, it's considered a search mode
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

  isSearching.value = false
}

const handleCheckboxInput = (value: any) => {
  searchStore.setIsShowMatch(value)
  search()
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
