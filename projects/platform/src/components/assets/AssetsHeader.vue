<template>
  <div
    data-tooltip-boundary-reference="search-table-header"
    :data-cy="'search-table'"
    class="flex justify-between items-center"
  >
    <div>
      <h5 class="text-h5 font-bold text-grey-900">
        {{ $t('RR0008') }}
        <span class="text-caption text-grey-600 pl-1">
          <span>(</span>
          <i18n-t keypath="RR0068" tag="span" scope="global">
            <template #number>{{ pagination.totalCount }}</template>
          </i18n-t>
          <span>)</span>
        </span>
      </h5>
    </div>
    <div class="flex items-center gap-x-5">
      <f-input-checkbox
        v-if="isKeywordDirty"
        :inputValue="isShowMatch"
        @update:inputValue="handleCheckboxInput"
        :disabled="isSearching"
        :label="$t('RR0069')"
        binary
        iconSize="20"
      />
      <f-pill
        :size="SIZE.LG"
        @click="selectAll"
        :disabled="!canSelectAll || isSearching"
      >
        <f-svg-icon iconName="checklist" size="24"></f-svg-icon>
        <p>{{ $t('RR0209') }}</p>
      </f-pill>
      <f-popper placement="bottom-end">
        <template #trigger="{ isExpand }">
          <f-pill :size="SIZE.LG" :active="isExpand" :disabled="isSearching">
            <f-svg-icon
              iconName="sortby"
              size="24"
              class="transform cursor-pointer"
            ></f-svg-icon>
            <p>{{ $t('RR0272') }}</p>
          </f-pill>
        </template>
        <template #content>
          <f-contextual-menu
            :inputSelectValue="sort"
            @update:inputSelectValue="searchStore.setSort"
            :selectMode="CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL"
            :menuTree="sortMenuTree"
            @click:menu="search()"
          ></f-contextual-menu>
        </template>
      </f-popper>
      <f-pill
        :size="SIZE.LG"
        @click="canFilter && (isOpenFilterPanel = !isOpenFilterPanel)"
        :active="isOpenFilterPanel"
        :disabled="!canFilter || isSearching"
      >
        <f-svg-icon
          iconName="instant_mix"
          size="24"
          class="transform cursor-pointer"
        ></f-svg-icon>
        <p>{{ $t('RR0085') }}</p>
      </f-pill>
      <f-pill-group
        v-if="!imageSearchData"
        :optionList="displayModeOptions"
        v-model:inputValue="displayMode"
        :size="SIZE.LG"
      />
      <f-button
        v-permission="{
          FUNC_ID: FUNC_ID.ASSET_CREATE,
          behavior: 'deleteElement',
        }"
        :size="SIZE.LG"
        prependIcon="texture_add"
        @click="goToMaterialUpload"
        >{{ $t('UU0020') }}
      </f-button>
    </div>
  </div>
  <filter-panel
    v-if="isOpenFilterPanel"
    :searchType="SEARCH_TYPE.ASSETS"
    @search="handleSearch"
    @resetFilter="resetFilterHandler"
  ></filter-panel>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import { FUNC_ID, SEARCH_TYPE } from '@/utils/constants'
import { useSearchStore } from '@/stores/search'
import { useAssetsLibraryStore } from '@/stores/assets/library'
import { useFilterStore } from '@/stores/filter'
import useNavigation from '@/composables/useNavigation'
import { CONTEXTUAL_MENU_MODE, SIZE } from '@frontier/constants'
import {
  type AssetsFilter,
  type PaginationReq,
  PaginationReqSortEnum,
  type Search,
} from '@frontier/platform-web-sdk'
import FilterPanel from '../common/FilterPanel.vue'

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

const searchStore = useSearchStore()
const assetsLibraryStore = useAssetsLibraryStore()
const filterStore = useFilterStore()
const route = useRoute()
const router = useRouter()
const { goToMaterialUpload } = useNavigation()

const {
  keyword,
  sort,
  isShowMatch,
  paginationRes: pagination,
  selectedTagList,
} = storeToRefs(searchStore)
const {
  displayedMaterialList,
  materialList,
  slimMaterialList,
  selectedMaterialList,
  sortOptions,
  isLoading,
  isSlimMaterialsLoading,
  displayMode,
  displayModeOptions,
} = storeToRefs(assetsLibraryStore)
const {
  filterState,
  isFilterDirty,
  filterDirty,
  imageFileURL: imageSearchData,
} = storeToRefs(filterStore)
const defaultSort = computed(() => sortOptions.value.base[0].value)
const sortMenuTree = computed(() => {
  const { base, keywordSearch } = sortOptions.value
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
const searchDirty = computed(() => {
  return isKeywordDirty.value || isFilterDirty.value
})
const isKeywordDirty = ref(false)
const isOpenFilterPanel = ref(false)
const isSearching = ref(false)
const inSearch = ref(false)
const canSelectAll = ref(true)
const canFilter = ref(true)

const selectAll = () => {
  if (!canSelectAll.value) {
    return
  }

  const stringifyItemList = displayedMaterialList.value.map((item) =>
    JSON.stringify(item)
  )
  const stringifySelectedItemList = selectedMaterialList.value.map((item) =>
    JSON.stringify(item)
  )
  const nonDuplicateList = [
    ...new Set(stringifySelectedItemList.concat(stringifyItemList)),
  ].map((item) => JSON.parse(item))
  selectedMaterialList.value = nonDuplicateList
}

const updateUrlWithSearchParams = (query: RouteQuery): boolean => {
  const queryParams = new URLSearchParams()
  queryParams.set('displayMode', displayMode.value.toString())

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.set(key, value.toString())
    }
  })

  // Compare with current route query
  const currentQuery = new URLSearchParams(
    route.query as Record<string, string>
  )
  if (queryParams.toString() === currentQuery.toString()) {
    return false
  }

  // Use router.replace to update the URL without triggering a full navigation
  router.replace({
    query: Object.fromEntries(queryParams),
    hash: route.hash,
  })
  return true
}

const getMaterialList = async (
  payload: SearchPayload<AssetsFilter>,
  query: RouteQuery
) => {
  // Reset slim and full material list when starting a new search to avoid showing stale data
  slimMaterialList.value = []
  materialList.value = []

  isLoading.value = true
  isSlimMaterialsLoading.value = true

  const requestInfo = {
    fullMaterialCanceled: false,
    slimMaterialCanceled: false,
  }

  // Update URL and check if it was actually changed
  const updated = updateUrlWithSearchParams(query)
  if (updated) {
    isLoading.value = false
    isSlimMaterialsLoading.value = false
    return
  }

  await Promise.allSettled([
    assetsLibraryStore
      .getAssetsMaterialList(payload as SearchPayload<AssetsFilter>)
      .catch((error: any) => {
        if (error?.name === 'CanceledError') {
          requestInfo.fullMaterialCanceled = true
        }
        throw error
      }),
    assetsLibraryStore
      .getAssetsMaterialSlimList(payload as SearchPayload<AssetsFilter>)
      .then((response) => {
        if (!requestInfo.slimMaterialCanceled) {
          isSlimMaterialsLoading.value = false
        }
        return response
      })
      .catch((error: any) => {
        if (error?.name === 'CanceledError') {
          requestInfo.slimMaterialCanceled = true
        }
        throw error
      }),
  ])

  if (!requestInfo.fullMaterialCanceled) {
    isLoading.value = false
  }
}

const search = async (targetPage = 1) => {
  if (sortOptions.value.keywordSearch.length > 0) {
    if (!isKeywordDirty.value && !!keyword.value) {
      searchStore.setSort(sortOptions.value.keywordSearch[0].value)
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
  await getMaterialList(
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

            if (property === 'status') {
              return acc
            }

            return {
              ...acc,
              [property]: filterDirty.value[property]
                ? filterState.value[property]
                : null,
            }
          }, {}),
          densityAndYarn: woven || knit ? { woven, knit } : null,
        } as AssetsFilter
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
}

const handleCheckboxInput = (value: any) => {
  searchStore.setIsShowMatch(value)
  search()
}

const handleSearch = () => {
  searchStore.setKeyword(searchStore.keyword?.trim() ?? null)
  search()
}

const resetFilterHandler = () => {
  if (isFilterDirty.value) {
    filterStore.resetFilterState()
    handleSearch()
  }
}
</script>
