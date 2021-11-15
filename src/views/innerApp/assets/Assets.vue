<template lang="pug">
material-table(@selectAll="handleSelectAll" :optionSort="optionSort" :optionMultiSelect="optionMultiSelect")
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
      dynamic-scroller(
        v-show="!isGrid"
        :items="materialList"
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
            div(v-if='index !== materialList.length - 1' class='border-b mx-7.5 my-5.5')
      div(v-show="isGrid" class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5")
        grid-item(v-for='material in materialList' :key="material.materialId" :material='material')
    div(v-else class="flex flex-col justify-center items-center")
      div(class="border border-black-400 rounded-md border-dashed p-2 mt-40 cursor-pointer" @click="goToMaterialUpload")
        svg-icon(iconName="add" size="24" class="text-primary")
      p(class="text-body2 text-primary pt-3") {{$t('EE0079')}}
</template>

<script>
import MaterialTable from '@/components/layout/MaterialTable'
import RowItem from '@/components/assets/material/list/RowItem'
import GridItem from '@/components/assets/material/list/GridItem'
import GridOrRow from '@/components/assets/material/list/GridOrRow'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useNavigation from '@/composables/useNavigation'
import useAssets from '@/composables/useAssets'
import { SORT_BY } from '@/utils/constants.js'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
// https://github.com/Akryum/vue-virtual-scroller/tree/next/packages/vue-virtual-scroller

export default {
  name: 'Assets',
  components: {
    MaterialTable,
    DynamicScroller,
    DynamicScrollerItem,
    RowItem,
    GridItem,
    GridOrRow
  },
  setup () {
    const store = useStore()
    const { goToMaterialUpload } = useNavigation()
    const isGrid = ref(false)
    const { printCard, downloadU3M, cloneTo, addToWorkspace, exportExcel, printQRCode, mergeCard, deleteMaterial } = useAssets()

    const optionMultiSelect = [
      cloneTo,
      addToWorkspace,
      printCard,
      printQRCode,
      downloadU3M,
      exportExcel,
      mergeCard,
      deleteMaterial
    ]

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

    const addedMaterialList = computed(() => store.getters['assets/addedMaterialList'])
    const handleSelectAll = () => {
      const stringifyArr = materialList.value.map(item => JSON.stringify(item))
      const duplicateArr = addedMaterialList.value.concat(stringifyArr)
      store.commit('assets/SET_addedMaterialList', [...new Set(duplicateArr)])
    }

    return {
      materialList,
      isGrid,
      pagination,
      handleSelectAll,
      optionSort,
      optionMultiSelect,
      goToMaterialUpload
    }
  }
}
</script>
