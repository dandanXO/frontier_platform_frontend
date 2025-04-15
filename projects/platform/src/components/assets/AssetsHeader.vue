<template>
  <div
    class="w-full h-fit flex flex-col px-8 py-8 gap-8 bg-primary"
    data-theme="new"
  >
    <f-search-bar
      :keyword="keyword"
      @typing="typing"
      @search="handleSearch"
      @clear="() => searchStore.setKeyword('')"
      rightIcon="image_search"
      @clickRightIcon="showSearchByImageModal"
      class="w-160 self-center min-h-[42px]"
    />
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
        <f-pill :size="SIZE.LG" @click="selectAll" :disabled="isSearching">
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
              @click:menu="assetsLibraryStore.search()"
            ></f-contextual-menu>
          </template>
        </f-popper>
        <f-pill
          :size="SIZE.LG"
          @click="isOpenFilterPanel = !isOpenFilterPanel"
          :active="isOpenFilterPanel"
          :disabled="isSearching"
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
          :disabled="isSearching"
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
  </div>
  <multi-select-menu
    v-if="
      multiSelectOptions &&
      multiSelectOptions.length > 0 &&
      selectedMaterialList
    "
    :optionMultiSelect="multiSelectOptions"
    v-model:selectedList="selectedMaterialList"
  >
    <template #default="{ option }">
      <slot name="menu-option" :option="option"></slot>
    </template>
  </multi-select-menu>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { storeToRefs } from 'pinia'
import { debounce } from 'debounce'
import { useI18n } from 'vue-i18n'

import { FUNC_ID, SEARCH_TYPE } from '@/utils/constants'
import { useSearchStore } from '@/stores/search'
import { useAssetsLibraryStore } from '@/stores/assets/library'
import { useFilterStore } from '@/stores/filter'
import useNavigation from '@/composables/useNavigation'
import { CONTEXTUAL_MENU_MODE, SIZE } from '@frontier/constants'
import {
  type PaginationReq,
  PaginationReqSortEnum,
  type Search,
} from '@frontier/platform-web-sdk'
import ModalSearchByImage from '@/components/common/ModalSearchByImage.vue'
import MultiSelectMenu from '../common/MultiSelectMenu.vue'
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

const { t } = useI18n()
const store = useStore()
const searchStore = useSearchStore()
const assetsLibraryStore = useAssetsLibraryStore()
const filterStore = useFilterStore()
const { goToMaterialUpload } = useNavigation()

const {
  keyword,
  sort,
  isShowMatch,
  paginationRes: pagination,
} = storeToRefs(searchStore)
const {
  displayedMaterialList,
  selectedMaterialList,
  sortOptions,
  multiSelectOptions,
  displayMode,
  displayModeOptions,
  isKeywordDirty,
  isSearching,
  isOpenFilterPanel,
} = storeToRefs(assetsLibraryStore)
const { isFilterDirty, imageFileURL: imageSearchData } =
  storeToRefs(filterStore)
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

const selectAll = () => {
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

const handleCheckboxInput = (value: any) => {
  searchStore.setIsShowMatch(value)
  assetsLibraryStore.search()
}

const handleSearch = () => {
  searchStore.setKeyword(searchStore.keyword?.trim() ?? null)
  assetsLibraryStore.search()
}

const resetFilterHandler = () => {
  if (isFilterDirty.value) {
    filterStore.resetFilterState()
    handleSearch()
  }
}

const showSearchByImageModal = () => {
  store.dispatch('helper/pushModalCommon', {
    body: ModalSearchByImage,
    classModal: 'w-128',
    theme: 'new',
    title: t('RR0483'),
    onClose: () => {
      store.dispatch('helper/closeModal')
    },
    properties: {
      onFinish: (file: File) => {
        filterStore.setImageFileURL(URL.createObjectURL(file))
        handleSearch()
        store.dispatch('helper/closeModal')
      },
    },
  })
}
</script>
