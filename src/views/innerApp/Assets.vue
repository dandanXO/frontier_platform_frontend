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
  div(class="py-7.5 mx-7.5 flex justify-between items-center")
    div
      h5(class="text-h5 font-bold text-primary") {{$t('EE0001')}}
        i18n-t(keypath="RR0068" tag='span' class='text-caption text-black-700 pl-1')
          template(#number) {{materialList.length}}
    div(class="flex items-center gap-x-5")
      btn-functional(
        size='lg'
        @click='handleSelectAll'
      ) {{$t('RR0052')}}
      grid-or-row(@change='isGrid = $event' :isGrid='isGrid' class="justify-self-end")
      btn(
        size="sm"
        prependIcon="add"
      ) {{$t('reuse.create')}}
  div(class="overflow-y-auto flex-grow grid")
    template(v-if="!isSearching && materialList.length > 0")
      div(:class="[isGrid ? 'grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5' : 'grid gap-y-10 mx-7.5 lg:mx-20']")
        grid-item(v-show="isGrid" v-for='material in materialList' :material='material')
        row-item(v-show="!isGrid" v-for='(material, index) in materialList' :material='material' :class="{ 'border-b': index !== materialList.length - 1 }")
    div(v-else class="flex flex-col justify-center items-center -mt-50")
      svg-icon(v-if="isSearching" iconName="loading" size="92" class="text-brand")
      p(v-else-if="inSearch" class="text-center text-body2 text-primary") {{$t('Sorry ! No results found.')}}
      template(v-else)
        div(class="border border-black-400 rounded-md border-dashed p-2 mt-40")
          svg-icon(iconName="add" size="24" class="text-primary")
        p(class="text-body2 text-primary pt-3") {{$t('Create your first fabric')}}
    div(class="py-9.5 justify-self-center self-end")
      pagination(v-model:currentPage="pagination.currentPage" :totalPage="pagination.totalPage" @goTo="getMaterialList($event)")
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
import SearchBox from '@/components/layout/SearchBox.vue'
import Pagination from '@/components/layout/Pagination.vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'Assets',
  components: {
    RowItem,
    GridItem,
    GridOrRow,
    MultiSelectMenu,
    SearchBox,
    Pagination
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { location } = useNavigation()
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
      pattern: null
    }
    const filter = reactive({})
    let timer

    const materialList = computed(() => store.getters['assets/materialList'])
    const pagination = computed(() => store.getters['helper/pagination'])

    const inSearch = computed(() => keyword.value !== '' || tagList.value.length !== 0 || JSON.stringify(filter) !== JSON.stringify(initFilterState))
    const isSearching = ref(false)

    const resetFilter = () => {
      Object.assign(filter, JSON.parse(JSON.stringify(initFilterState)))
    }

    const handleSelectAll = () => {
      if (!isSelectAll.value) {
        isSelectAll.value = true
        store.commit('assets/SET_addedMaterialList', materialList.value)
      }
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
          timer = setTimeout(getAITags, 500)
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
      isSelectAll
    }
  }
}
</script>
