<template lang="pug">
div(class="w-full h-full flex flex-col" v-bind="$attrs")
  search-box(:searchType="searchType" @search="search")
  slot(name="header-above" :goTo="goTo")
  div(
    data-tooltip-boundary-reference="search-table-header"
    class="py-3 xl:pt-7.5 xl:pb-2.5 mx-7.5 flex justify-between items-center"
  )
    div
      slot(name="header-left" :goTo="goTo")
    div(class="flex items-center gap-x-5")
      f-input-checkbox(
        v-if="keywordDirty"
        v-model:inputValue="isShowMatch"
        @update:inputValue="search()"
        :label="$t('RR0069')"
        binary
        iconSize="20"
      )
      f-button-label(v-if="canSelectAll" size="lg" @click="selectAll") {{ $t('RR0052') }}
      f-popper(placement="bottom-end")
        template(#trigger="{ isExpand }")
          f-svg-icon(
            iconName="sortby"
            size="24"
            class="transform cursor-pointer text-grey-600 hover:text-primary-400"
            :class="{ 'text-primary-400': isExpand }"
            :tooltipMessage="$t('RR0272')"
          )
        template(#content)
          f-contextual-menu(
            v-model:inputSelectValue="sort"
            :selectMode="CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL"
            :menuTree="sortMenuTree"
            @click:menu="search()"
          )
      slot(name="header-right")
  slot(name="sub-header")
  div(class="xl:overflow-y-auto flex-grow flex flex-col")
    div(
      v-if="isSearching || (inSearch && pagination.totalCount === 0)"
      class="flex-grow flex flex-col justify-center items-center"
    )
      f-svg-icon(
        v-if="isSearching"
        iconName="loading"
        size="92"
        class="text-primary-400"
      )
      p(
        v-else-if="inSearch && pagination.totalCount === 0"
        class="text-center text-body2 text-grey-900"
      ) {{ $t('RR0105') }}
    div(v-else class="flex-grow")
      slot(:inSearch="inSearch" name="banner")
      slot(:inSearch="inSearch" :goTo="goTo")
    #pagination-container(
      v-if="!isSearching && pagination.totalCount > 0"
      class="py-9.5 self-center"
    )
      f-paginator(
        v-model:currentPage="pagination.currentPage"
        :totalPage="pagination.totalPage"
        @goTo="search($event)"
      )
multi-select-menu(
  v-if="optionMultiSelect.length > 0"
  :optionMultiSelect="optionMultiSelect"
  v-model:selectedList="innerSelectedItemList"
)
  template(#default="{ option }")
    slot(name="menu-option" :option="option")
</template>

<script setup>
import SearchBox from '@/components/common/SearchBox.vue'
import MultiSelectMenu from '@/components/common/MultiSelectMenu.vue'
import { useStore } from 'vuex'
import { ref, computed, defineOptions } from 'vue'
import { useRoute } from 'vue-router'
import { SEARCH_TYPE, CONTEXTUAL_MENU_MODE } from '@/utils/constants'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  searchType: {
    type: Number,
    default: SEARCH_TYPE.ASSETS,
  },
  optionSort: {
    type: Object,
    required: true,
  },
  optionMultiSelect: {
    type: Array,
    default: [],
  },
  searchCallback: {
    type: Function,
    required: true,
  },
  itemList: {
    type: Array,
    required: true,
  },
  canSelectAll: {
    type: Boolean,
    default: true,
  },
  selectedItemList: {
    type: Array,
    default: [],
  },
})
const emit = defineEmits(['update:selectedItemList'])

const store = useStore()
const route = useRoute()

const isSearching = ref(false)
const inSearch = ref(false)
const keywordDirty = ref(false)

const sortMenuTree = computed(() => {
  const { base, keywordSearch } = props.optionSort
  const temp = [...base]
  if (keywordDirty.value) {
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
const keyword = computed(() => store.getters['helper/search/keyword'])
const filter = computed(() => store.getters['helper/search/filter'])
const selectedTagList = computed(
  () => store.getters['helper/search/selectedTagList']
)
const pagination = computed(() => store.getters['helper/search/pagination'])
const sort = computed({
  get: () => pagination.value.sort,
  set: (v) => store.dispatch('helper/search/setPagination', { sort: v }),
})
const isShowMatch = computed({
  get: () => pagination.value.isShowMatch,
  set: (v) => store.dispatch('helper/search/setPagination', { isShowMatch: v }),
})
const searchDirty = computed(() => {
  const isFilterDirty = store.getters['helper/search/isFilterDirty']
  return keywordDirty.value || isFilterDirty
})

const goTo = () => {
  /**
   *  Since helper/search/filter is watched in the SearchBox.vue
   *  and when its watcher is triggered, it emits a search event,
   *  Also helper/search/reset includes reset filer,
   *  This means it will call search event
   */
  store.dispatch('helper/search/reset', {
    sort: props.optionSort.base[0].value,
  })
}

const innerSelectedItemList = computed({
  get: () => props.selectedItemList,
  set: (v) => emit('update:selectedItemList', v),
})

const selectAll = () => {
  const stringifyItemList = props.itemList.map((item) => JSON.stringify(item))
  const stringifySelectedItemList = props.selectedItemList.map((item) =>
    JSON.stringify(item)
  )
  const nonDuplicateList = [
    ...new Set(stringifySelectedItemList.concat(stringifyItemList)),
  ].map((item) => JSON.parse(item))
  emit('update:selectedItemList', nonDuplicateList)
}

const search = async (targetPage = 1) => {
  isSearching.value = true

  /**
   * when first time using keyword search (no keyword -> with keyword),
   * sort value will automatically change to optionSort.keywordSearch[0].value,
   * and when first time searching without keyword (with keyword -> no keyword),
   * sort value will automatically change to props.optionSort.base[0].value
   */
  if (props.optionSort.keywordSearch.length > 0) {
    if (!keywordDirty.value && !!keyword.value) {
      store.dispatch('helper/search/setPagination', {
        sort: props.optionSort.keywordSearch[0].value,
      })
    } else if (keywordDirty.value && !keyword.value) {
      store.dispatch('helper/search/setPagination', {
        sort: props.optionSort.base[0].value,
      })
    }
  }

  keywordDirty.value = !!keyword.value

  // only when searchDirty is true, it's considered a search mode
  inSearch.value = searchDirty.value

  await props.searchCallback(targetPage, {
    currentPage: targetPage,
    sort: pagination.value.sort,
    isShowMatch: pagination.value.isShowMatch,
    keyword: keyword.value,
    tagList: encodeURI(JSON.stringify(selectedTagList.value)),
    filter: encodeURI(JSON.stringify(filter.value)),
  })

  isSearching.value = false
}

// INIT
store.dispatch('helper/search/reset', { sort: props.optionSort.base[0].value })
const {
  currentPage,
  sort: qSort,
  isShowMatch: qIsShowMatch,
  keyword: qKeyword,
  tagList: qTagList,
  filter: qFilter,
} = route.query
if (qSort) {
  store.dispatch('helper/search/setPagination', { sort: Number(qSort) })
}
if (qIsShowMatch) {
  store.dispatch('helper/search/setPagination', {
    isShowMatch: qIsShowMatch === 'true',
  })
}
if (qKeyword) {
  store.dispatch('helper/search/setKeyword', qKeyword)
}
if (qTagList) {
  store.dispatch(
    'helper/search/setSelectedTagList',
    JSON.parse(decodeURI(qTagList))
  )
}
if (qFilter) {
  store.dispatch('helper/search/setFilter', JSON.parse(decodeURI(qFilter)))
}

search(currentPage)
</script>
