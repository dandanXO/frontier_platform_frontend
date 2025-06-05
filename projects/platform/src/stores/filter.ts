import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import searchApi from '@/apis/search'
import type {
  MaterialCertification,
  MaterialOptions,
  MaterialOptionsSeasonList,
  LengthUnit,
  WeightUnit,
  CurrencyCode,
  MaterialQuantityUnit,
  AssetsFilterStatusEnum,
  Country,
} from '@frontier/platform-web-sdk'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { isEqual } from '@frontier/lib'
import { useStore } from 'vuex'
import { useAssetsStore } from '@/stores/assets'
import { clone as ramdaClone } from 'ramda'

export interface FilterState {
  materialTypeList: number[]
  descriptionList: number[]
  contentList: {
    name: string
    percentage: number
  }[]
  pattern: string | null
  color: string | null
  width: {
    cuttable: {
      min: number
      max: number
      isInfinity: boolean
    }
    full: {
      min: number
      max: number
      isInfinity: boolean
    }
    unitList: LengthUnit[]
  }
  weight: {
    min: number
    max: number
    isInfinity: boolean
    unitList: WeightUnit[]
  }
  densityAndYarn: {
    woven: {
      warpDensity: string | null
      weftDensity: string | null
      warpYarnSize: string | null
      weftYarnSize: string | null
    }
    knit: {
      knitYarnSize: string | null
    }
  }
  finishList: string[]
  inventory: {
    min: number
    max: number
    isInfinity: boolean
    unitList: MaterialQuantityUnit[]
  }
  price: {
    min: number
    max: number
    isInfinity: boolean
    currencyList: CurrencyCode[]
    unitList: MaterialQuantityUnit[]
  }
  hasU3M: boolean | null
  // for assets and workspace
  withOutEcoImpactor: boolean | null
  // for assets
  status: AssetsFilterStatusEnum | null
  countryList: string[]
  seasonList: string[]
  yearList: number[]
}

type NullableMaterialOptions = {
  [K in keyof MaterialOptions]?: MaterialOptions[K]
}

interface FilterOption extends NullableMaterialOptions {
  width: {
    min: number
    max: number
  }
  weight: {
    min: number
    max: number
  }
  inventory: {
    min: number
    max: number
  }
  price: {
    min: number
    max: number
  }
  countryList: Country[]
  certificateList?: MaterialCertification[]
  seasonList?: MaterialOptionsSeasonList
  yearList?: number[]
}

export const useFilterStore = defineStore('filter', () => {
  const ogBaseSearchApi = useOgBaseApiWrapper(searchApi)
  const { ogBaseAssetsApi } = useAssetsStore()
  const store = useStore()
  const { getMaterialOptions } = useAssetsStore()

  const filterOption = ref<FilterOption>({
    width: {
      min: 0,
      max: 200,
    },
    weight: {
      min: 0,
      max: 600,
    },
    inventory: {
      min: 0,
      max: 10000,
    },
    price: {
      min: 0,
      max: 10000,
    },
    countryList: [] as Country[],
    certificateList: [],
    seasonList: {
      default: [],
      custom: [],
    },
    yearList: [],
  })

  watch(
    () => store.getters['code/countryList'],
    (newCountryList) => {
      filterOption.value.countryList = newCountryList
    },
    { immediate: true } // Run immediately on mount
  )

  const getInternalFilterOption = async (routePath: string) => {
    const { data } = await ogBaseSearchApi('getInternalSearchFilterOptions')
    const materialOptions = await getMaterialOptions()

    filterOption.value = Object.assign(filterOption.value, data.result)
    filterOption.value.certificateList = materialOptions?.certificateList
    if (
      routePath.includes('public-library') ||
      routePath.includes('workspace') ||
      routePath.includes('meta-fabric') ||
      routePath.includes('share-with-me')
    ) {
      filterOption.value.countryList = store.getters['code/countryList']
    }

    try {
      const { data: materialOptionsData } = await ogBaseAssetsApi(
        'getMaterialOptions'
      )
      if (materialOptionsData.result?.seasonList) {
        filterOption.value.seasonList = materialOptionsData.result.seasonList
        // TODO: populate yearList when backend adds year field
        filterOption.value.yearList = []
      }
      if (materialOptionsData.result?.certificateList) {
        filterOption.value.certificateList =
          materialOptionsData.result.certificateList
      }
    } catch (error) {
      console.error('Failed to fetch material options for filter:', error)
      filterOption.value.yearList = filterOption.value.yearList || []
    }
  }
  const getExternalFilterOption = async () => {
    const { data: searchOptionsData } = await ogBaseSearchApi(
      'getExternalSearchFilterOptions'
    )
    filterOption.value = Object.assign(
      filterOption.value,
      searchOptionsData.result
    )

    // try {
    //   const { data: materialOptionsData } = await ogBaseAssetsApi(
    //     'getMaterialOptions'
    //   )
    //   if (materialOptionsData.result?.seasonList) {
    //     filterOption.value.seasonList = materialOptionsData.result.seasonList
    //     // TODO: populate yearList when backend adds year field
    //     filterOption.value.yearList = []
    //   }
    //   if (materialOptionsData.result?.certificateList) {
    //     filterOption.value.certificateList =
    //       materialOptionsData.result.certificateList
    //   }
    // } catch (error) {
    //   console.error('Failed to fetch material options for filter:', error)
    //   filterOption.value.yearList = filterOption.value.yearList || []
    // }
  }
  const getInitFilterState: () => FilterState = () => ({
    materialTypeList: [],
    descriptionList: [],
    contentList: [],
    pattern: null,
    color: null,
    width: {
      cuttable: {
        min: 0,
        max: 201,
        isInfinity: true,
      },
      full: {
        min: 0,
        max: 201,
        isInfinity: true,
      },
      unitList: [],
    },
    weight: {
      min: 0,
      max: 601,
      isInfinity: true,
      unitList: [],
    },
    densityAndYarn: {
      woven: {
        warpDensity: null,
        weftDensity: null,
        warpYarnSize: null,
        weftYarnSize: null,
      },
      knit: {
        knitYarnSize: null,
      },
    },
    finishList: [],
    inventory: {
      min: 0,
      max: 10001,
      isInfinity: true,
      unitList: [],
    },
    price: {
      min: 0,
      max: 10001,
      isInfinity: false,
      currencyList: [],
      unitList: [],
    },
    certificateList: [],
    hasU3M: null,
    // for assets and workspace
    withOutEcoImpactor: null,
    // for assets
    status: null,
    // for Inner External
    countryList: [],
    // Initialize seasonList
    seasonList: [],
    yearList: [],
  })

  const filterState = ref<FilterState>(getInitFilterState())
  const setFilterState = (filter: FilterState) => (filterState.value = filter)
  const setFilterStateByProperty = <T extends keyof FilterState>(
    property: T,
    val: FilterState[T]
  ) => (filterState.value[property] = ramdaClone(val))
  const setFilterStateByQueryString = (queryString: string) => {
    const query = JSON.parse(decodeURI(queryString))
    filterState.value = Object.assign(
      getInitFilterState(),
      Object.keys(query).reduce((acc, key) => {
        const property = key as keyof FilterState

        return query[property]
          ? {
              ...acc,
              [property]: query[property],
            }
          : acc
      }, {})
    )
  }
  const resetFilterState = () => setFilterState(getInitFilterState())
  const filterDirty = computed(() => {
    const defaultState = getInitFilterState()
    // compare each property of filterState with defaultState
    // if it is different, then return true
    return {
      ...(Object.keys(filterState.value).reduce((acc, key) => {
        const property = key as keyof FilterState
        return {
          ...acc,
          [property]: !isEqual(
            filterState.value[property],
            defaultState[property]
          ),
        }
      }, {}) as {
        [key in keyof FilterState]: boolean
      }),
    }
  })
  const isFilterDirty = computed(() =>
    Object.keys(filterDirty.value).some(
      (key) => filterDirty.value[key as keyof FilterState]
    )
  )

  return {
    filterState,
    setFilterState,
    resetFilterState,
    filterOption,
    getInternalFilterOption,
    getExternalFilterOption,
    setFilterStateByProperty,
    filterDirty,
    isFilterDirty,
    setFilterStateByQueryString,
  }
})
