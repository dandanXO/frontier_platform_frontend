<template lang="pug">
div(class="w-full h-full flex flex-col")
  search-box(
    v-model:textValue="keyword"
    v-model:selectedTagList="selectedTagList"
    v-model:filter="filter"
    :tagList="tagList"
    @search="getMaterialList"
    @resetFilter="resetFilter"
  )
  div(class="pt-7.5 pb-2.5 mx-7.5 flex justify-between items-center")
    div
      h5(class="text-h5 font-bold text-primary") {{$t('EE0001')}}
        i18n-t(keypath="RR0068" tag='span' class='text-caption text-black-700 pl-1')
          template(#number) {{isShowExcatMatch ? pagination.totalMatchCount : pagination.totalCount}}
    div(class="flex items-center gap-x-5")
      input-checkbox(
        v-if="inSearch"
        :inputValue="isShowExcatMatch"
        @update:inputValue="showExcatMatch"
        :label="$t('RR0069')"
        binary
        size="20"
      )
      btn-functional(
        size='lg'
        @click='handleSelectAll'
      ) {{$t('RR0052')}}
      btn-sort(v-model:value="sortBy" :optionList="optionSort")
      grid-or-row(@change='isGrid = $event' :isGrid='isGrid' class="justify-self-end")
      btn(
        size="sm"
        prependIcon="add"
        @click="goToMaterialUpload"
      ) {{$t('reuse.create')}}
  div(class="overflow-y-auto flex-grow grid")
    template(v-if="!isSearching && sortedMaterialList.length > 0")
      dynamic-scroller(
        v-show="!isGrid"
        :items="sortedMaterialList"
        :min-item-size="364"
        key-field="materialId"
        pageMode
      )
        template(v-slot='{ item, index, active }')
          dynamic-scroller-item(
            :item="item"
            :active="active"
            :data-index="index"
          )
            row-item(:key="item.materialId" :material='item')
            div(v-if='index !== sortedMaterialList.length - 1' class='border-b mx-7.5 my-5.5')
      div(v-show="isGrid" class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5")
        grid-item(v-for='material in sortedMaterialList' :key="material.materialId" :material='material')
    div(v-else class="flex flex-col justify-center items-center")
      svg-icon(v-if="isSearching" iconName="loading" size="92" class="text-brand")
      p(v-else-if="inSearch" class="text-center text-body2 text-primary") {{$t('RR0105')}}
      template(v-else)
        div(class="border border-black-400 rounded-md border-dashed p-2 mt-40 cursor-pointer" @click="goToMaterialUpload")
          svg-icon(iconName="add" size="24" class="text-primary")
        p(class="text-body2 text-primary pt-3") {{$t('EE0079')}}
    div(class="py-9.5 justify-self-center self-end")
      pagination(v-if="!isSearching && sortedMaterialList.length > 0" v-model:currentPage="pagination.currentPage" :totalPage="totalPage" @goTo="getMaterialList($event)")
multi-select-menu
</template>

<script>
import RowItem from '@/components/assets/material/list/RowItem'
import GridItem from '@/components/assets/material/list/GridItem'
import GridOrRow from '@/components/assets/material/list/GridOrRow'
import MultiSelectMenu from '@/components/assets/material/list/MultiSelectMenu'
import { useStore } from 'vuex'
import { ref, computed, watch, reactive } from 'vue'
import useNavigation from '@/composables/useNavigation'
import useSort from '@/composables/useSort'
import SearchBox from '@/components/layout/SearchBox.vue'
import Pagination from '@/components/layout/Pagination.vue'
import BtnSort from '@/components/layout/BtnSort.vue'
import { useRoute, useRouter } from 'vue-router'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
// https://github.com/Akryum/vue-virtual-scroller/tree/next/packages/vue-virtual-scroller

export default {
  name: 'Assets',
  components: {
    DynamicScroller,
    DynamicScrollerItem,
    RowItem,
    GridItem,
    GridOrRow,
    MultiSelectMenu,
    SearchBox,
    Pagination,
    BtnSort
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { location, goToMaterialUpload } = useNavigation()
    const initFilterState = {
      contentList: [],
      finishList: [],
      complete: null,
      wovenWarpYarnCount: null,
      wovenWeftYarnCount: null,
      knitYarnCount: null,
      warpDensity: null,
      weftDensity: null,
      color: null,
      pattern: null,
      category: null
    }
    let timer
    const { sort, createDate, lastUpdate, materialNoA2Z, relevance } = useSort()
    const isGrid = ref(false)
    const isSelectAll = ref(false)
    const keyword = ref('')
    const tagList = ref([])
    const selectedTagList = ref([])
    const filter = reactive({})
    const sortBy = ref(0)
    const isSearching = ref(false)
    const inSearch = ref(false)
    const isShowExcatMatch = ref(false)

    const searchDirty = computed(() => keyword.value !== '' || selectedTagList.value.length !== 0 || JSON.stringify(filter) !== JSON.stringify(initFilterState))
    const materialList = computed(() => store.getters['assets/materialList'])
    const pagination = computed(() => store.getters['helper/pagination'])
    const totalPage = computed(() => {
      const { totalPage, totalMatchCount, perPageCount } = pagination.value
      if (!isShowExcatMatch.value) {
        return totalPage
      }
      return totalMatchCount === 0 ? 1 : Math.ceil(totalMatchCount / perPageCount)
    })
    const sortedMaterialList = computed(() => {
      const { totalMatchCount, perPageCount } = pagination.value
      if (isShowExcatMatch.value && pagination.value.currentPage === totalPage.value) {
        const matchedList = [...materialList.value].splice(0, totalMatchCount % perPageCount)
        return sort(matchedList, sortBy.value)
      }
      return sort(materialList.value, sortBy.value)
    })
    const optionSort = computed(() => {
      const base = [
        createDate,
        lastUpdate,
        materialNoA2Z
      ]
      if (inSearch.value) {
        base.unshift(relevance)
      }
      return base
    })

    const showExcatMatch = (bool) => {
      isShowExcatMatch.value = bool
      if (isShowExcatMatch.value) {
        getMaterialList(1)
      }
    }

    const resetFilter = () => {
      Object.assign(filter, JSON.parse(JSON.stringify(initFilterState)))
    }

    const addedMaterialList = computed(() => store.getters['assets/addedMaterialList'])
    const handleSelectAll = () => {
      const stringifyArr = materialList.value.map(item => JSON.stringify(item))
      const duplicateArr = addedMaterialList.value.concat(stringifyArr)
      store.commit('assets/SET_addedMaterialList', [...new Set(duplicateArr)])
    }

    const getMaterialList = async (targetPage = 1) => {
      isSearching.value = true

      // only when searchDirty is true, it's considered a seach mode
      inSearch.value = searchDirty.value

      router.push({
        name: route.name,
        query: {
          currentPage: targetPage,
          keyword: keyword.value,
          tagList: JSON.stringify(selectedTagList.value),
          filter: JSON.stringify(filter)
        }
      })
      await store.dispatch('assets/getMaterialList', {
        targetPage,
        location: location.value,
        search: {
          keyword: keyword.value,
          tagList: selectedTagList.value
        },
        filter
      })

      isSearching.value = false
    }

    const getAITags = async () => {
      tagList.value = await store.dispatch('code/getAITags', { searchKeyword: keyword.value })
      selectedTagList.value = selectedTagList.value.filter(selectedTag => tagList.value.some(tag => tag.name === selectedTag.name))
    }

    watch(
      () => keyword.value,
      () => {
        clearTimeout(timer)
        timer = undefined
        if (keyword.value !== '') {
          timer = setTimeout(getAITags, 300)
        } else {
          tagList.value.length = 0
          selectedTagList.value.length = 0
        }
      }
    )

    watch(
      () => inSearch.value,
      (newValue, oldValue) => {
        // only first time inSearch changes from false to true will set the value of sortBy to relevance
        if (!oldValue && newValue) {
          sortBy.value = relevance.value
        }
        /**
         * only when inSearch changes from true to false,
         * it will set the value of sortBy to default value and default value is createDate
         */
        if (oldValue && !newValue) {
          sortBy.value = createDate.value
          isShowExcatMatch.value = false
        }
      },
      {
        immediate: true
      }
    )

    // INIT
    resetFilter()
    const { currentPage, keyword: qKeyword, tagList: qTagList, filter: qFilter } = route.query
    if (qKeyword) {
      keyword.value = qKeyword
    }
    if (qTagList) {
      selectedTagList.value = JSON.parse(qTagList)
    }
    if (qFilter) {
      Object.assign(filter, JSON.parse(qFilter))
    }

    getMaterialList(currentPage)

    return {
      materialList,
      isGrid,
      keyword,
      tagList,
      getAITags,
      selectedTagList,
      getMaterialList,
      filter,
      resetFilter,
      pagination,
      inSearch,
      isSearching,
      handleSelectAll,
      isSelectAll,
      sortedMaterialList,
      sortBy,
      optionSort,
      isShowExcatMatch,
      totalPage,
      showExcatMatch,
      goToMaterialUpload
    }
  }
}
</script>
