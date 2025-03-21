import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import axios, { type CancelTokenSource } from 'axios'
import { useRoute, useRouter } from 'vue-router'
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
import { useFilterStore } from '../filter'

export interface SortOption {
  text: string
  value: PaginationReqSortEnum
  disabled?: boolean
  tooltipMessage?: string
}

export interface SearchPayload<FilterType> {
  pagination: PaginationReq
  search: Search | null
  filter: FilterType | null
}

export interface RouteQuery {
  currentPage: number
  sort: PaginationReqSortEnum
  isShowMatch?: boolean
  keyword?: string
  tagList?: string
  filter?: string
}

export const useAssetsLibraryStore = defineStore('assetsLibraryStore', () => {
  let cancelTokenSourceMaterial: CancelTokenSource | null = null
  let cancelTokenSourceSlim: CancelTokenSource | null = null
  const route = useRoute()
  const router = useRouter()
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
  const filterStore = useFilterStore()
  const { keyword, sort, isShowMatch, selectedTagList } =
    storeToRefs(searchStore)
  const store = useStore()
  const { filterState, isFilterDirty, filterDirty } = storeToRefs(filterStore)
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
  const isKeywordDirty = ref(false)
  const inSearch = ref(false)
  const defaultSort = computed(() => sortOptions.value.base[0].value)
  const isSearching = ref(true)

  const searchDirty = computed(() => {
    return isKeywordDirty.value || isFilterDirty.value
  })

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

  const updateUrlWithSearchParams = (query: RouteQuery): boolean => {
    const queryParams = new URLSearchParams()
    queryParams.set('displayMode', displayMode.value.toString())

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.set(key, value.toString())
      }
    })

    // Compare with current route query
    const currentQuery = new URLSearchParams(
      route.query as Record<string, string>
    )
    if (queryParams.toString() === currentQuery.toString()) {
      return false
    }

    // Use router.replace to update the URL without triggering a full navigation
    router.replace({
      query: Object.fromEntries(queryParams),
      hash: route.hash,
    })
    return true
  }

  const getMaterialList = async (
    payload: SearchPayload<AssetsFilter>,
    query: RouteQuery
  ) => {
    // Reset slim and full material list when starting a new search to avoid showing stale data
    slimMaterialList.value = []
    materialList.value = []

    isLoading.value = true
    isSlimMaterialsLoading.value = true

    const requestInfo = {
      fullMaterialCanceled: false,
      slimMaterialCanceled: false,
    }

    // Update URL and check if it was actually changed
    const updated = updateUrlWithSearchParams(query)
    if (updated) {
      isLoading.value = false
      isSlimMaterialsLoading.value = false
      isSearching.value = false

      return
    }

    await Promise.allSettled([
      getAssetsMaterialList(payload as SearchPayload<AssetsFilter>).catch(
        (error: any) => {
          if (error?.name === 'CanceledError') {
            requestInfo.fullMaterialCanceled = true
          }
          throw error
        }
      ),
      getAssetsMaterialSlimList(payload as SearchPayload<AssetsFilter>)
        .then((response) => {
          if (!requestInfo.slimMaterialCanceled) {
            isSlimMaterialsLoading.value = false
            isSearching.value = false
          }
          return response
        })
        .catch((error: any) => {
          if (error?.name === 'CanceledError') {
            requestInfo.slimMaterialCanceled = true
          }
          throw error
        }),
    ])

    if (!requestInfo.fullMaterialCanceled) {
      isLoading.value = false
      isSearching.value = false
    }
  }

  const search = async (targetPage = 1) => {
    try {
      isSearching.value = true

      selectedMaterialList.value = []
      if (sortOptions.value.keywordSearch.length > 0) {
        if (!isKeywordDirty.value && !!keyword.value) {
          searchStore.setSort(sortOptions.value.keywordSearch[0].value)
        } else if (isKeywordDirty.value && !keyword.value) {
          searchStore.setSort(defaultSort.value)
        }
      }

      isKeywordDirty.value = !!keyword.value

      inSearch.value = searchDirty.value

      const { densityAndYarn } = filterState.value
      const woven = filterDirty.value.densityAndYarn
        ? densityAndYarn.knit.knitYarnSize === null
          ? densityAndYarn.woven
          : null
        : null
      const knit =
        woven === null && filterDirty.value.densityAndYarn
          ? {
              knitYarnSize: densityAndYarn.knit.knitYarnSize as string,
            }
          : null
      await getMaterialList(
        {
          pagination: {
            sort: sort.value,
            isShowMatch: isShowMatch.value,
            targetPage,
            perPageCount: 40,
          },
          search: (() => {
            return !keyword.value && selectedTagList.value.length === 0
              ? null
              : {
                  keyword: keyword.value,
                  tagList: selectedTagList.value,
                }
          })(),
          filter: (() => {
            if (!isFilterDirty.value) {
              return null
            }

            return {
              ...Object.keys(filterState.value).reduce((acc, key) => {
                const property = key as keyof typeof filterState.value

                if (property === 'status') {
                  return acc
                }

                return {
                  ...acc,
                  [property]: filterDirty.value[property]
                    ? filterState.value[property]
                    : null,
                }
              }, {}),
              densityAndYarn: woven || knit ? { woven, knit } : null,
            } as AssetsFilter
          })(),
        },
        {
          currentPage: targetPage,
          sort: sort.value,
          isShowMatch: isShowMatch.value ? isShowMatch.value : undefined,
          keyword: keyword.value ?? undefined,
          tagList:
            selectedTagList.value.length > 0
              ? encodeURI(JSON.stringify(selectedTagList.value))
              : undefined,
          filter: (() => {
            if (!isFilterDirty.value) {
              return undefined
            }
            return encodeURI(
              JSON.stringify(
                Object.keys(filterState.value).reduce((acc, key) => {
                  const property = key as keyof typeof filterState.value

                  return filterDirty.value[property]
                    ? {
                        ...acc,
                        [property]: filterState.value[property],
                      }
                    : acc
                }, {})
              )
            )
          })(),
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      isSearching.value = false
    }
  }

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
    search,
    isKeywordDirty,
    isSearching,
    inSearch,
  }
})
