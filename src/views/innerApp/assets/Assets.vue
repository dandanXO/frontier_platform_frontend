<style lang="scss">
.vue-recycle-scroller__item-view {
  &[data-last-hover="true"] {
    z-index: 99;
  }
}
</style>

<template lang="pug">
div(class="w-full h-full")
  search-table(
    :searchType="SEARCH_TYPE.ASSETS"
    :searchCallback="getMaterialList"
    :optionSort="optionSort"
    :optionMultiSelect="optionMultiSelect"
    :itemList="materialList"
    v-model:selectedItemList="selectedMaterialList"
  )
    template(#header-left)
      h5(class="text-h5 font-bold text-primary") {{ $t("EE0001") }}
        span(class="text-caption text-black-700 pl-1")
          span (
          i18n-t(keypath="RR0068" tag="span")
            template(#number) {{ pagination.totalCount }}
          span )
    template(#header-right)
      grid-or-row(v-model:displayMode="displayMode" class="justify-self-end")
      btn(size="sm" prependIcon="add" @click="goToMaterialUpload") {{ $t("UU0020") }}
    template(#default)
      template(v-if="materialList.length > 0")
        recycle-scroller(
          v-show="displayMode === DISPLAY_NODE.LIST"
          :items="materialList"
          :itemSize="currentItemSize"
          key-field="materialId"
          pageMode
          v-slot="{ item, index }"
          @resize="resize"
          :buffer="currentItemSize * 3"
        )
          row-item(:key="item.materialId" :material="item" v-model:selectedList="selectedMaterialList" @mouseenter="onMouseEnter")
          div(v-if="index !== materialList.length - 1" class="border-b mx-7.5 my-5")
        div(v-show="displayMode === DISPLAY_NODE.GRID" class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5")
          grid-item(v-for="material in materialList" :key="material.materialId" :material="material" v-model:selectedList="selectedMaterialList")
      div(v-else class="flex flex-col justify-center items-center")
        div(class="border border-black-400 rounded-md border-dashed p-2 mt-40 cursor-pointer" @click="goToMaterialUpload")
          svg-icon(iconName="add" size="24" class="text-primary")
        p(class="text-body2 text-primary pt-3") {{ $t("EE0079") }}
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import RowItem from '@/components/assets/RowItem.vue'
import GridItem from '@/components/assets/GridItem.vue'
import GridOrRow from '@/components/common/GridOrRow.vue'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useNavigation from '@/composables/useNavigation'
import useAssets from '@/composables/useAssets'
import { SORT_BY, SEARCH_TYPE, DISPLAY_NODE } from '@/utils/constants.js'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useRoute, useRouter } from 'vue-router'
// https://github.com/Akryum/vue-virtual-scroller/tree/next/packages/vue-virtual-scroller

const router = useRouter()
const route = useRoute()
const store = useStore()
const { goToMaterialUpload } = useNavigation()
const currentItemSize = ref(379)
const { printCard, downloadU3M, cloneTo, addToWorkspace, exportExcel, printQRCode, mergeCard, deleteMaterial } = useAssets()

const selectedMaterialList = ref([])
const displayMode = ref(DISPLAY_NODE.LIST)
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
  { ...mergeCard, disabled: selectedMaterialList.value.length < 2 },
  deleteMaterial
])

const getMaterialList = async (targetPage = 1, query) => {
  await router.push({
    name: route.name,
    query
  })
  await store.dispatch('assets/getMaterialList', { targetPage })
}

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
  /**
   * @Todo figure out what happen in Safari
   */
  if (document.querySelector('.vue-recycle-scroller__item-view')) {
    currentItemSize.value = document?.querySelector('.vue-recycle-scroller__item-view')?.clientHeight
  } else {
    currentItemSize.value = 379
  }
}
</script>
