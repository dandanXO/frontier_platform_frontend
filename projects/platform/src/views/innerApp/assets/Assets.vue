<template lang="pug">
search-table(
  :searchType="SEARCH_TYPE.ASSETS"
  :searchCallback="getMaterialList"
  :optionSort="optionSort"
  :optionMultiSelect="optionMultiSelect"
  :itemList="materialList"
  v-model:selectedItemList="selectedMaterialList"
)
  template(#header-left)
    h5(class="text-h5 font-bold text-grey-900") {{ $t('EE0001') }}
      span(class="text-caption text-grey-600 pl-1")
        span (
        i18n-t(keypath="RR0068" tag="span" scope="global")
          template(#number) {{ pagination.totalCount }}
        span )
  template(#header-right)
    f-input-tap(
      :optionList="displayModeOptionList"
      v-model:inputValue="displayMode"
    )
    f-button(size="sm" prependIcon="add" @click="goToMaterialUpload") {{ $t('UU0020') }}
  template(#default)
    template(v-if="materialList.length > 0")
      recycle-scroller(
        v-show="displayMode === ASSET_LIST_DISPLAY_MODE.LIST"
        :items="materialList"
        :itemSize="currentItemSize"
        key-field="materialId"
        pageMode
        v-slot="{ item, index }"
        @resize="resize"
        :buffer="currentItemSize * 3"
      )
        row-item(
          :key="item.materialId"
          :material="tempMaterial"
          v-model:selectedList="selectedMaterialList"
          data-cy="assets"
        )
        div(
          v-if="index !== materialList.length - 1"
          class="border-b border-grey-250 mx-7.5 my-5"
        )
      div(
        v-show="displayMode === ASSET_LIST_DISPLAY_MODE.GRID"
        class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5"
      )
        grid-item(
          v-for="material in materialList"
          :key="material.materialId"
          :material="tempMaterial"
          v-model:selectedValue="selectedMaterialList"
          :optionList="optionList"
          @click.stop="goToAssetMaterialDetail(material)"
        )
    div(v-else class="flex h-full justify-center items-center")
      div(class="flex flex-col justify-center items-center")
        div(
          class="border border-grey-250 rounded-md border-dashed p-2 cursor-pointer"
          @click="goToMaterialUpload"
        )
          f-svg-icon(iconName="add" size="24" class="text-grey-900")
        p(class="text-body2 text-grey-900 pt-3") {{ $t('EE0079') }}
</template>

<script setup lang="ts">
import SearchTable from '@/components/common/SearchTable.vue'
import RowItem from '@/components/assets/RowItem.vue'
import GridItem from '@/components/assets/GridItem.vue'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useNavigation from '@/composables/useNavigation'
import useAssets from '@/composables/useAssets'
import {
  SEARCH_TYPE,
  ASSET_LIST_DISPLAY_MODE,
  useConstants,
} from '@/utils/constants'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useRoute, useRouter } from 'vue-router'
// https://github.com/Akryum/vue-virtual-scroller/tree/next/packages/vue-virtual-scroller
import { useI18n } from 'vue-i18n'
import { useAssetsStore } from '@/stores/assets'
import { storeToRefs } from 'pinia'

const assetsStore = useAssetsStore()
const { material: tempMaterial } = storeToRefs(assetsStore)

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const store = useStore()
const { goToMaterialUpload, goToAssetMaterialDetail } = useNavigation()

const selectedMaterialList = ref([])
const displayMode = ref<ASSET_LIST_DISPLAY_MODE>(ASSET_LIST_DISPLAY_MODE.LIST)
const materialList = computed(() => store.getters['assets/materialList'])
const pagination = computed(() => store.getters['helper/search/pagination'])
const optionSort = computed(() => {
  const { SORT_BY } = useConstants()
  const {
    CREATE_DATE,
    LAST_UPDATE,
    MATERIAL_NO_A_Z,
    GHG_RESULTS,
    WATER_DEPLETION_RESULTS,
    LAND_USE_RESULTS,
    RELEVANCE,
  } = SORT_BY.value
  const made2flowPlanStatus = computed(
    () => store.getters['polling/valueAddedService'].made2flow.planStatus
  )
  return {
    base: [
      CREATE_DATE,
      LAST_UPDATE,
      MATERIAL_NO_A_Z,
      {
        ...GHG_RESULTS,
        disabled: !made2flowPlanStatus.value.ACTIVATE,
        tooltipMessage: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
      {
        ...WATER_DEPLETION_RESULTS,
        disabled: !made2flowPlanStatus.value.ACTIVATE,
        tooltipMessage: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
      {
        ...LAND_USE_RESULTS,
        disabled: !made2flowPlanStatus.value.ACTIVATE,
        tooltipMessage: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
    ],
    keywordSearch: [RELEVANCE],
  }
})

const {
  editMaterial,
  createU3m,
  printA4Swatch,
  downloadU3m,
  cloneTo,
  addToWorkspace,
  exportExcel,
  printQRCode,
  mergeMaterial,
  deleteMaterial,
} = useAssets()

const optionList = computed(() => [
  [editMaterial],
  [cloneTo, addToWorkspace],
  [createU3m, downloadU3m, exportExcel],
  [printQRCode, printA4Swatch],
  [deleteMaterial],
])

const optionMultiSelect = computed(() => [
  cloneTo,
  addToWorkspace,
  printA4Swatch,
  printQRCode,
  downloadU3m,
  exportExcel,
  mergeMaterial,
  deleteMaterial,
])

const getMaterialList = async (targetPage = 1, query) => {
  router.push({
    name: route.name,
    query,
  })
  await store.dispatch('assets/getMaterialList', { targetPage })
  // await  assetsStore.getAssetsMaterialList(targetPage)
}

const displayModeOptionList = [
  {
    selectValue: ASSET_LIST_DISPLAY_MODE.GRID,
    icon: 'apps',
  },
  {
    selectValue: ASSET_LIST_DISPLAY_MODE.LIST,
    icon: 'format_list_bulleted',
  },
]

const currentItemSize = ref(379)
const resize = () => {
  /**
   * @Todo figure out what happen in Safari
   */
  if (document.querySelector('.vue-recycle-scroller__item-view')) {
    currentItemSize.value =
      document?.querySelector('.vue-recycle-scroller__item-view')
        ?.clientHeight ?? 379
  } else {
    currentItemSize.value = 379
  }
}
</script>
