<template lang="pug">
div(class="w-full h-full flex flex-col")
  search-box(@search="getMaterialList")
  div(class="pt-7.5 pb-2.5 mx-7.5 flex justify-between items-center")
    div
      slot(name="header-left")
    div(class="flex items-center gap-x-5")
      input-checkbox(
        v-if="keywordDirty"
        v-model:inputValue="isShowMatch"
        @update:inputValue="getMaterialList()"
        :label="$t('RR0069')"
        binary
        size="20"
      )
      btn-functional(v-if="selectAll" size='lg' @click="$emit('selectAll')") {{$t('RR0052')}}
      tooltip(
        placement='bottom-end'
        :manual='true'
        :showArrow='false'
        :offset='[0, 8]'
      )
        template(#trigger="{ isActive }")
          svg-icon(
            iconName='swap_horiz'
            size='24'
            class='transform rotate-90 cursor-pointer text-black-700 hover:text-brand'
            :class="{ 'text-brand': isActive }"
          )
        template(#content)
          contextual-menu(v-model:selectValue="sort" :optionList="innerOptionSort" @update:selectValue="getMaterialList()")
      slot(name="header-right")
  div(class="overflow-y-auto flex-grow grid")
    div(v-if="isSearching || inSearch && pagination.totalCount === 0" class="flex flex-col justify-center items-center")
      svg-icon(v-if="isSearching" iconName="loading" size="92" class="text-brand")
      p(v-else-if="inSearch && pagination.totalCount === 0" class="text-center text-body2 text-primary") {{$t('RR0105')}}
    slot(v-else)
    div(class="py-9.5 justify-self-center self-end")
      pagination(v-if="!isSearching && pagination.totalCount > 0" v-model:currentPage="pagination.currentPage" :totalPage="pagination.totalPage" @goTo="getMaterialList($event)")
  multi-select-menu(:options='optionMultiSelect')
</template>

<script>
import SearchBox from '@/components/layout/SearchBox.vue'
import Pagination from '@/components/layout/Pagination.vue'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'MaterialTable',
  components: {
    SearchBox,
    Pagination
  },
  props: {
    selectAll: {
      type: Boolean,
      default: true
    },
    optionSort: {
      type: Object,
      required: true
    },
    optionMultiSelect: {
      type: Array,
      required: true
    }
  },
  emits: ['selectAll'],
  setup (props) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const isSearching = ref(false)
    const inSearch = ref(false)
    const keywordDirty = ref(false)

    const innerOptionSort = computed(() => {
      const { base, keywordSearch } = props.optionSort
      const temp = [...base]
      if (keywordDirty.value) {
        temp.unshift(...keywordSearch)
      }
      return temp
    })
    const keyword = computed(() => store.getters['helper/search/keyword'])
    const filter = computed(() => store.getters['helper/search/filter'])
    const selectedTagList = computed(() => store.getters['helper/search/selectedTagList'])
    const pagination = computed(() => store.getters['helper/search/pagination'])
    const sort = computed({
      get: () => pagination.value.sort,
      set: (v) => store.dispatch('helper/search/setPagination', { sort: v })
    })
    const isShowMatch = computed({
      get: () => pagination.value.isShowMatch,
      set: (v) => store.dispatch('helper/search/setPagination', { isShowMatch: v })
    })

    const searchDirty = computed(() => {
      const filterDirty = store.getters['helper/search/filterDirty']
      const isFilterDirty = Object.keys(filterDirty).some(key => filterDirty[key])
      return keywordDirty.value || isFilterDirty
    })

    const getMaterialList = async (targetPage = 1) => {
      isSearching.value = true

      /**
       * when first time using keyword search (no keyword -> with keyword),
       * sort value will automatically change to optionSort.keywordSearch[0].value,
       * and when first time searhcing without keyword (with keyword -> no keyword),
       * sort value will autmatically chanfe to props.optionSort.base[0].value
       */
      if (!keywordDirty.value && !!keyword.value) {
        store.dispatch('helper/search/setPagination', { sort: props.optionSort.keywordSearch[0].value })
      } else if (keywordDirty.value && !keyword.value) {
        store.dispatch('helper/search/setPagination', { sort: props.optionSort.base[0].value })
      }

      keywordDirty.value = !!keyword.value

      // only when searchDirty is true, it's considered a search mode
      inSearch.value = searchDirty.value

      router.push({
        name: route.name,
        query: {
          currentPage: targetPage,
          sort: pagination.value.sort,
          isShowMatch: pagination.value.isShowMatch,
          keyword: keyword.value,
          tagList: encodeURI(JSON.stringify(selectedTagList.value)),
          filter: encodeURI(JSON.stringify(filter.value))
        }
      })
      await store.dispatch('assets/getMaterialList', { targetPage })

      isSearching.value = false
    }

    // INIT
    store.dispatch('helper/search/reset', { sort: props.optionSort.base[0].value })
    const { currentPage, sort: qSort, isShowMatch: qIsShowMatch, keyword: qKeyword, tagList: qTagList, filter: qFilter } = route.query
    if (qSort) {
      store.dispatch('helper/search/setPagination', { sort: Number(qSort) })
    }
    if (qIsShowMatch) {
      store.dispatch('helper/search/setPagination', { isShowMatch: qIsShowMatch === 'true' })
    }
    if (qKeyword) {
      store.dispatch('helper/search/setKeyword', qKeyword)
    }
    if (qTagList) {
      store.dispatch('helper/search/setSelectedTagList', JSON.parse(decodeURI(qTagList)))
    }
    if (qFilter) {
      store.dispatch('helper/search/setFilter', JSON.parse(decodeURI(qFilter)))
    }

    getMaterialList(currentPage)

    return {
      getMaterialList,
      pagination,
      inSearch,
      isShowMatch,
      sort,
      isSearching,
      keywordDirty,
      innerOptionSort
    }
  }
}
</script>
