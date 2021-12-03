<style lang="scss" scoped>
.vue-recycle-scroller__item-view {
  :deep(&[data-last-hover="true"]) {
    z-index: 99;
  }
}
</style>

<template lang="pug">
div(class="w-full h-full")
  search-table(
    @selectAll="handleSelectAll"
    :searchType="SEARCH_TYPE.ASSETS"
    :searchCallback="getMaterialList"
    :optionSort="optionSort"
  )
    template(#header-left)
      h5(class="text-h5 font-bold text-primary") {{$t('EE0001')}}
        span(class='text-caption text-black-700 pl-1')
          span (
          i18n-t(keypath="RR0068" tag='span')
            template(#number) {{pagination.totalCount}}
          span )
    template(#header-right)
      grid-or-row(@change='isGrid = $event' :isGrid='isGrid' class="justify-self-end")
      btn(size="sm" prependIcon="add" @click="goToMaterialUpload") {{$t('UU0020')}}
    template(#default)
      template(v-if="materialList.length > 0")
        recycle-scroller(
          v-show="!isGrid"
          :items="materialList"
          :itemSize="currentItemSize"
          key-field="materialId"
          pageMode
          v-slot="{ item, index, active }"
          @resize="resize"
          :buffer="currentItemSize * 3"
        )
          row-item(:key="item.materialId" :material='item' @mouseenter="onMouseEnter")
          div(v-if='index !== materialList.length - 1' class='border-b mx-7.5 my-5')
        div(v-show="isGrid" class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5")
          grid-item(v-for='material in materialList' :key="material.materialId" :material='material')
      div(v-else class="flex flex-col justify-center items-center")
        div(class="border border-black-400 rounded-md border-dashed p-2 mt-40 cursor-pointer" @click="goToMaterialUpload")
          svg-icon(iconName="add" size="24" class="text-primary")
        p(class="text-body2 text-primary pt-3") {{$t('EE0079')}}
  multi-select-menu(:options='optionMultiSelect')
</template>

<script>
import SearchTable from '@/components/layout/SearchTable'
import RowItem from '@/components/assets/material/list/RowItem'
import GridItem from '@/components/assets/material/list/GridItem'
import GridOrRow from '@/components/assets/material/list/GridOrRow'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useNavigation from '@/composables/useNavigation'
import useAssets from '@/composables/useAssets'
import { SORT_BY, SEARCH_TYPE } from '@/utils/constants.js'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
// https://github.com/Akryum/vue-virtual-scroller/tree/next/packages/vue-virtual-scroller

export default {
  name: 'Assets',
  components: {
    SearchTable,
    RecycleScroller,
    RowItem,
    GridItem,
    GridOrRow
  },
  setup () {
    const store = useStore()
    const { goToMaterialUpload } = useNavigation()
    const isGrid = ref(false)
    const currentItemSize = ref(379)
    const { printCard, downloadU3M, cloneTo, addToWorkspace, exportExcel, printQRCode, mergeCard, deleteMaterial } = useAssets()

    const addedMaterialList = computed(() => store.getters['assets/addedMaterialList'])
    const materialList = computed(() => store.getters['assets/materialList'])
    const pagination = computed(() => store.getters['helper/search/pagination'])
    const optionSort = computed(() => ({
      base: [
        SORT_BY.CREATE_DATE,
        SORT_BY.LAST_UPDATE,
        SORT_BY.MATERIAL_NO_A_Z
      ],
      keywordSearch: [
        SORT_BY.RELEVANCE
      ]
    }))

    const optionMultiSelect = computed(() => [
      cloneTo,
      addToWorkspace,
      printCard,
      printQRCode,
      downloadU3M,
      exportExcel,
      { ...mergeCard, disabled: addedMaterialList.value.length < 2 },
      deleteMaterial
    ])

    const handleSelectAll = () => {
      const stringifyArr = materialList.value.map(item => JSON.stringify(item))
      const duplicateArr = addedMaterialList.value.concat(stringifyArr)
      store.commit('assets/SET_addedMaterialList', [...new Set(duplicateArr)])
    }

    const getMaterialList = async (targetPage = 1) => await store.dispatch('assets/getMaterialList', { targetPage })

    const onMouseEnter = (e) => {
      /**
       * Choose to set the state in the dataset instead of setting it in class
       * is because DynamicScroller will re-overwrite class when hovered on.
       */
      document
        .querySelectorAll('[data-last-hover="true"]')
        .forEach(element => {
          element.dataset.lastHover = false
        })
      e.target.parentElement.dataset.lastHover = true
    }

    const resize = () => {
      currentItemSize.value = document.querySelector('.vue-recycle-scroller__item-view').clientHeight
    }

    return {
      materialList,
      isGrid,
      pagination,
      handleSelectAll,
      optionSort,
      optionMultiSelect,
      goToMaterialUpload,
      onMouseEnter,
      currentItemSize,
      resize,
      getMaterialList,
      SEARCH_TYPE
    }
  }
}
</script>
