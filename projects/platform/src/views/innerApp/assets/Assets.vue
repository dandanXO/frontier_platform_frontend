<template lang="pug">
search-table(
  :searchType="SEARCH_TYPE.ASSETS"
  :searchCallback="getMaterialList"
  :optionSort="optionSort"
  :optionMultiSelect="optionMultiSelect"
  :itemList="materialList"
  v-model:selectedItemList="selectedMaterialList"
)
  template(#header-left="{ totalCount }")
    h5(class="text-h5 font-bold text-grey-900") {{ $t('RR0008') }}
      span(class="text-caption text-grey-600 pl-1")
        span (
        i18n-t(keypath="RR0068" tag="span" scope="global")
          template(#number) {{ totalCount }}
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
          :material="item"
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
          :material="material"
          v-model:selectedValue="selectedMaterialList"
          :optionList="optionList"
          @click.stop="goToAssetMaterialDetail({}, material.materialId)"
        )
    div(v-else class="flex h-full justify-center items-center")
      div(class="flex flex-col justify-center items-center")
        div(
          class="border border-grey-250 rounded-md border-dashed p-2 cursor-pointer"
          @click="goToMaterialUpload()"
        )
          f-svg-icon(iconName="add" size="24" class="text-grey-900")
        p(class="text-body2 text-grey-900 pt-3") {{ $t('EE0079') }}
</template>

<script setup lang="ts">
import SearchTable, {
  type RouteQuery,
  type SearchPayload,
  type SortOption,
} from '@/components/common/SearchTable.vue'
import RowItem from '@/components/assets/RowItem.vue'
import GridItem from '@/components/assets/GridItem.vue'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useNavigation from '@/composables/useNavigation'
import useAssets from '@/composables/useAssets'
import { SEARCH_TYPE, ASSET_LIST_DISPLAY_MODE } from '@/utils/constants'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useRoute, useRouter } from 'vue-router'
// https://github.com/Akryum/vue-virtual-scroller/tree/next/packages/vue-virtual-scroller
import { useI18n } from 'vue-i18n'
import { useAssetsStore } from '@/stores/assets'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
import type { AssetsFilter, Material } from '@frontier/platform-web-sdk'

const assetsStore = useAssetsStore()
const searchStore = useSearchStore()
const { materialList } = storeToRefs(assetsStore)

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const store = useStore()
const { goToMaterialUpload, goToAssetMaterialDetail } = useNavigation()

const selectedMaterialList = ref<Material[]>([])
const displayMode = ref<ASSET_LIST_DISPLAY_MODE>(ASSET_LIST_DISPLAY_MODE.LIST)
const optionSort = computed(() => {
  const {
    CREATE_DATE,
    LAST_UPDATE,
    ITEM_NO_A_Z,
    GHG_LOW_TO_HIGH,
    WATER_LOW_TO_HIGH,
    LAND_LOW_TO_HIGH,
    RELEVANCE,
  } = searchStore.sortOption
  const made2flowPlanStatus = computed(
    () => store.getters['polling/valueAddedService'].made2flow.planStatus
  )
  return {
    base: [
      CREATE_DATE,
      LAST_UPDATE,
      ITEM_NO_A_Z,
      {
        ...GHG_LOW_TO_HIGH,
        disabled: !made2flowPlanStatus.value.ACTIVATE,
        tooltipMessage: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
      {
        ...WATER_LOW_TO_HIGH,
        disabled: !made2flowPlanStatus.value.ACTIVATE,
        tooltipMessage: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
      {
        ...LAND_LOW_TO_HIGH,
        disabled: !made2flowPlanStatus.value.ACTIVATE,
        tooltipMessage: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
    ] as SortOption[],
    keywordSearch: [RELEVANCE] as SortOption[],
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
  printLabel,
  mergeMaterial,
  deleteMaterial,
} = useAssets()

const optionList = computed(() => [
  [editMaterial],
  [cloneTo, addToWorkspace],
  [createU3m, downloadU3m, exportExcel],
  [printLabel, printA4Swatch],
  [deleteMaterial],
])

const optionMultiSelect = computed(() => [
  cloneTo,
  addToWorkspace,
  printA4Swatch,
  printLabel,
  downloadU3m,
  exportExcel,
  mergeMaterial,
  deleteMaterial,
])

const getMaterialList = async (
  payload: SearchPayload<AssetsFilter>,
  query: RouteQuery
) => {
  router.push({
    name: route.name,
    query,
  })
  await assetsStore.getAssetsMaterialList(payload)
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
