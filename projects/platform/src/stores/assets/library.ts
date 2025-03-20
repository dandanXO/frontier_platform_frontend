import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios, { type CancelTokenSource } from 'axios'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import type {
  Material,
  PaginationReq,
  Search,
  AssetsFilter,
  PaginationReqSortEnum,
} from '@frontier/platform-web-sdk'
import assetsApi from '@/apis/assets'
import { useSearchStore } from '@/stores/search'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import assignCarbonEmissionValue from '@/utils/material/assignCarbonEmissionValue'
import {
  ASSET_LIST_DISPLAY_MODE,
  FUNC_ID,
  PERMISSION_MAP,
} from '@/utils/constants'
import useAssets from '@/composables/useAssets'

export interface SortOption {
  text: string
  value: PaginationReqSortEnum
  disabled?: boolean
  tooltipMessage?: string
}

export const useAssetsLibraryStore = defineStore('assetsLibraryStore', () => {
  let cancelTokenSourceMaterial: CancelTokenSource | null = null
  let cancelTokenSourceSlim: CancelTokenSource | null = null
  const route = useRoute()
  const { t } = useI18n()
  const {
    printA4Swatch,
    downloadU3m,
    cloneTo,
    addToWorkspace,
    printLabel,
    mergeMaterial,
    exportExcel,
    deleteMaterial,
    startSpreadSheetUpdate,
  } = useAssets()
  const searchStore = useSearchStore()
  const store = useStore()
  const roleId = store.getters['organization/orgUser/orgUser'].roleID
  const permissionList = PERMISSION_MAP[roleId]

  const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

  const displayMode = ref<ASSET_LIST_DISPLAY_MODE>(
    Number(route.query.displayMode) === ASSET_LIST_DISPLAY_MODE.LIST
      ? ASSET_LIST_DISPLAY_MODE.LIST
      : ASSET_LIST_DISPLAY_MODE.GRID
  )
  const selectedMaterialList = ref<Material[]>([])
  const materialList = ref<Material[]>([])
  const slimMaterialList = ref<Material[]>([])
  const isLoading = ref(false)
  const isSlimMaterialsLoading = ref(false)

  const displayModeOptions = computed(() => {
    return [
      {
        selectValue: ASSET_LIST_DISPLAY_MODE.GRID,
        icon: 'apps',
      },
      {
        selectValue: ASSET_LIST_DISPLAY_MODE.LIST,
        icon: 'format_list_bulleted',
      },
    ]
  })

  const getAssetsMaterialList = async (payload: {
    pagination: PaginationReq
    search: Search | null
    filter: AssetsFilter | null
  }) => {
    if (cancelTokenSourceMaterial) {
      cancelTokenSourceMaterial.cancel('Operation canceled due to new request')
    }
    cancelTokenSourceMaterial = axios.CancelToken.source()
    const { data } = await ogBaseAssetsApi('getAssetMaterialList', payload, {
      cancelToken: cancelTokenSourceMaterial.token,
    })

    materialList.value = data.result.materialList.map((item) => {
      return assignCarbonEmissionValue(item)
    })
    searchStore.setPaginationRes(data.result.pagination)
  }

  const getAssetsMaterialSlimList = async (payload: {
    pagination: PaginationReq
    search: Search | null
    filter: AssetsFilter | null
  }) => {
    if (cancelTokenSourceSlim) {
      cancelTokenSourceSlim.cancel('Operation canceled due to new request')
    }
    cancelTokenSourceSlim = axios.CancelToken.source()
    const { data } = await ogBaseAssetsApi(
      'getAssetMaterialSlimList',
      payload,
      {
        cancelToken: cancelTokenSourceSlim.token,
      }
    )

    slimMaterialList.value = data.result.materialList
    searchStore.setPaginationRes(data.result.pagination)
  }

  const parseSlimMaterial = (material: any): Material => ({
    ...material,
    weightDisplaySetting: material.weightDisplaySetting || {
      isShowWeightGsm: false,
    },
    u3m: material.u3m || { status: -1 },
    customU3m: material.customU3m || { status: -1 },
    sideType: material.sideType || 1,
    faceSide: {
      descriptionList: material.faceSide?.descriptionList || [],
      constructionCustomPropertyList:
        material.faceSide?.constructionCustomPropertyList || [],
      contentList: material.faceSide?.contentList || [],
      finishList: material.faceSide?.finishList || [],
    },
    tagInfo: {
      tagList: material.tagInfo?.tagList || [],
    },
    digitalThreadInfo: {
      threadQty: material.digitalThreadInfo?.threadQty || 0,
      hasUnreadThread: material.digitalThreadInfo?.hasUnreadThread || false,
    },
  })

  const displayedMaterialList = computed(() => {
    const isAnyLoading = isLoading.value || isSlimMaterialsLoading.value

    if (!isAnyLoading) {
      return materialList.value
    }
    if (slimMaterialList.value.length > 0) {
      return slimMaterialList.value.map(parseSlimMaterial)
    }
    return materialList.value.length > 0 ? materialList.value : []
  })

  const sortOptions = computed(() => {
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
    const isM2fActive = made2flowPlanStatus.value.ACTIVATE
    const m2fTooltip = !isM2fActive ? t('VV0047') : ''

    return {
      base: [
        CREATE_DATE,
        LAST_UPDATE,
        ITEM_NO_A_Z,
        {
          ...GHG_LOW_TO_HIGH,
          disabled: !isM2fActive,
          tooltipMessage: m2fTooltip,
        },
        {
          ...WATER_LOW_TO_HIGH,
          disabled: !isM2fActive,
          tooltipMessage: m2fTooltip,
        },
        {
          ...LAND_LOW_TO_HIGH,
          disabled: !isM2fActive,
          tooltipMessage: m2fTooltip,
        },
      ] as SortOption[],
      keywordSearch: [RELEVANCE] as SortOption[],
    }
  })

  const multiSelectOptions = computed(() => {
    const options = [printA4Swatch, printLabel, downloadU3m, exportExcel]

    const permissionOptionsMap = {
      [FUNC_ID.ASSET_COPY]: () => options.unshift(cloneTo),
      [FUNC_ID.ASSET_MERGE]: () => options.push(mergeMaterial),
      [FUNC_ID.ASSET_ADD_TO_WORK_SPACE]: () => options.push(addToWorkspace),
      [FUNC_ID.ASSET_SPREADSHEET]: () => options.push(startSpreadSheetUpdate),
      [FUNC_ID.ASSET_DELETE]: () => options.push(deleteMaterial),
    }

    permissionList.forEach((permission) => {
      if (permissionOptionsMap[permission]) {
        permissionOptionsMap[permission]()
      }
    })

    return options
  })

  return {
    displayMode,
    materialList,
    slimMaterialList,
    displayedMaterialList,
    selectedMaterialList,
    displayModeOptions,
    sortOptions,
    multiSelectOptions,
    isLoading,
    isSlimMaterialsLoading,
    getAssetsMaterialList,
    getAssetsMaterialSlimList,
  }
})
