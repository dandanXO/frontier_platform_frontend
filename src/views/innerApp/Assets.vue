updateHandler<template lang="pug">
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
          template(#number) {{pagination.totalCount}}
    div(class="flex items-center gap-x-5")
      btn-functional(
        size='lg'
        @click='handleSelectAll'
      ) {{$t('RR0052')}}
      btn-sort(v-model:value="sortBy" :optionList="optionSort")
      grid-or-row(@change='isGrid = $event' :isGrid='isGrid' class="justify-self-end")
      btn(
        size="sm"
        prependIcon="add"
      ) {{$t('reuse.create')}}
  div(class="overflow-y-auto flex-grow grid")
    template(v-if="!isSearching && sortedMaterialList.length > 0")
      div(:class="[isGrid ? 'grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5' : 'grid']")
        grid-item(v-show="isGrid" v-for='material in sortedMaterialList' :key="material.materialId" :material='material')
        row-item(v-show="!isGrid" v-for='(material, index) in sortedMaterialList' :key="material.materialId" :material='material')
          template(#divide)
            div(v-if='index !== sortedMaterialList.length - 1' class='border-b my-5 mx-8')
    div(v-else class="flex flex-col justify-center items-center")
      svg-icon(v-if="isSearching" iconName="loading" size="92" class="text-brand")
      p(v-else-if="inSearch" class="text-center text-body2 text-primary") {{$t('Sorry ! No results found.')}}
      template(v-else)
        div(class="border border-black-400 rounded-md border-dashed p-2 mt-40")
          svg-icon(iconName="add" size="24" class="text-primary")
        p(class="text-body2 text-primary pt-3") {{$t('Create your first fabric')}}
    div(class="py-9.5 justify-self-center self-end")
      pagination(v-if="pagination.totalCount !== 0" v-model:currentPage="pagination.currentPage" :totalPage="pagination.totalPage" @goTo="getMaterialList($event)")
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

export default {
  name: 'Assets',
  components: {
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
    const { location } = useNavigation()
    const { sort, createDate, lastUpdate, materialNoA2Z } = useSort()
    const isGrid = ref(false)
    const isSelectAll = ref(false)
    const keyword = ref('')
    const tagList = ref([])
    const selectedTagList = ref([])
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
    const filter = reactive({})
    let timer
    const sortBy = ref(1)
    const optionSort = [
      createDate,
      lastUpdate,
      materialNoA2Z
    ]

    const materialList = computed(() => store.getters['assets/materialList'])
    const pagination = computed(() => store.getters['helper/pagination'])

    const sortedMaterialList = computed(() => sort(materialList.value, sortBy.value))

    const inSearch = computed(() => keyword.value !== '' || tagList.value.length !== 0 || JSON.stringify(filter) !== JSON.stringify(initFilterState))
    const isSearching = ref(false)

    const resetFilter = () => {
      Object.assign(filter, JSON.parse(JSON.stringify(initFilterState)))
    }

    const handleSelectAll = () => {
      store.commit('assets/SET_addedMaterialList', JSON.parse(JSON.stringify(materialList.value)))
    }

    const getMaterialList = async (targetPage = 1) => {
      isSearching.value = true

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
      optionSort
    }
  }
}
</script>
