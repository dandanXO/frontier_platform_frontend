<style lang="scss">
.vue-recycle-scroller__item-view {
  &[data-last-hover='true'] {
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
      h5(class="text-h5 font-bold text-grey-900") {{ $t('EE0001') }}
        span(class="text-caption text-grey-600 pl-1")
          span (
          i18n-t(keypath="RR0068" tag="span" scope="global")
            template(#number) {{ pagination.totalCount }}
          span )
    template(#header-right)
      grid-or-row(v-model:displayMode="displayMode" class="justify-self-end")
      f-button(size="sm" prependIcon="add" @click="goToMaterialUpload") {{ $t('UU0020') }}
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
          row-item(
            :key="item.materialId"
            :material="item"
            v-model:selectedList="selectedMaterialList"
            @mouseenter="onMouseEnter"
            data-cy="assets"
          )
          div(
            v-if="index !== materialList.length - 1"
            class="border-b border-grey-250 mx-7.5 my-5"
          )
        div(
          v-show="displayMode === DISPLAY_NODE.GRID"
          class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5"
        )
          grid-item-material(
            v-for="(material, index) in materialList"
            :key="material.materialId"
            :material="material"
            v-model:selectedValue="selectedMaterialList"
            isSelectable
            :selectValue="material"
            :optionList="optionList(material)"
            @click:option="$event.func(material)"
            @click.stop="goToAssetMaterialDetail(material)"
            :stickerAddFromLocationList="[`${material.materialId}`]"
          )
      div(v-else class="flex flex-col justify-center items-center")
        div(
          class="border border-grey-250 rounded-md border-dashed p-2 mt-40 cursor-pointer"
          @click="goToMaterialUpload"
        )
          f-svg-icon(iconName="add" size="24" class="text-grey-900")
        p(class="text-body2 text-grey-900 pt-3") {{ $t('EE0079') }}
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import RowItem from '@/components/assets/RowItem.vue'
import GridItemMaterial from '@/components/common/gridItem/GridItemMaterial.vue'
import GridOrRow from '@/components/common/GridOrRow.vue'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useNavigation from '@/composables/useNavigation'
import useAssets from '@/composables/useAssets'
import { SEARCH_TYPE, DISPLAY_NODE, useConstants } from '@/utils/constants'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useRoute, useRouter } from 'vue-router'
// https://github.com/Akryum/vue-virtual-scroller/tree/next/packages/vue-virtual-scroller
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const store = useStore()
const { goToMaterialUpload, goToAssetMaterialDetail } = useNavigation()

const selectedMaterialList = ref([])
const displayMode = ref(DISPLAY_NODE.LIST)
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
        tooltip: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
      {
        ...WATER_DEPLETION_RESULTS,
        disabled: !made2flowPlanStatus.value.ACTIVATE,
        tooltip: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
      {
        ...LAND_USE_RESULTS,
        disabled: !made2flowPlanStatus.value.ACTIVATE,
        tooltip: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
    ],
    keywordSearch: [RELEVANCE],
  }
})

const {
  editMaterial,
  create3DMaterial,
  printCard,
  downloadU3M,
  cloneTo,
  addToWorkspace,
  exportExcel,
  printQRCode,
  mergeCard,
  deleteMaterial,
} = useAssets()

const optionList = (material) => {
  const getValueByMaterial = (value, material) => {
    if (typeof value === 'function') return value(material)
    return value
  }

  return [
    [editMaterial],
    [cloneTo, addToWorkspace],
    [create3DMaterial, downloadU3M, exportExcel],
    [printQRCode, printCard],
    [deleteMaterial],
  ].map((block) =>
    block.map((option) => ({
      id: option.id,
      name: getValueByMaterial(option.name, material),
      func: () => option.func(material),
      disabled: getValueByMaterial(option.disabled, material) || false,
    }))
  )
}

const optionMultiSelect = computed(() => [
  cloneTo,
  addToWorkspace,
  printCard,
  printQRCode,
  downloadU3M,
  exportExcel,
  mergeCard,
  deleteMaterial,
])

const getMaterialList = async (targetPage = 1, query) => {
  await router.push({
    name: route.name,
    query,
  })
  await store.dispatch('assets/getMaterialList', { targetPage })
}

const onMouseEnter = (e) => {
  /**
   * Choose to set the state in the dataset instead of setting it in class
   * is because DynamicScroller will re-overwrite class when hovered on.
   */
  document.querySelectorAll('[data-last-hover="true"]').forEach((element) => {
    element.dataset.lastHover = false
  })
  e.target.parentElement.dataset.lastHover = true
}

const currentItemSize = ref(379)
const resize = () => {
  /**
   * @Todo figure out what happen in Safari
   */
  if (document.querySelector('.vue-recycle-scroller__item-view')) {
    currentItemSize.value = document?.querySelector(
      '.vue-recycle-scroller__item-view'
    )?.clientHeight
  } else {
    currentItemSize.value = 379
  }
}
</script>
