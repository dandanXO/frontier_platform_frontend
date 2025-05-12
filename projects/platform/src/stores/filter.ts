import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import searchApi from '@/apis/search'
import type {
  CodeCountryGet200ResponseResultCode,
  MaterialCertification,
  MaterialOptions,
} from '@frontier/platform-web-sdk'
import type {
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
import { useAssetsStore } from './assets'

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
  certificateList: number[]
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
  countryList: {
    name: CodeCountryGet200ResponseResultCode['countryList'][number]['name']
    countryCode: CodeCountryGet200ResponseResultCode['countryList'][number]['countryCode']
    count: number
    emoji: CodeCountryGet200ResponseResultCode['countryList'][number]['emoji']
  }[]
  certificateList?: MaterialCertification[]
}

export const useFilterStore = defineStore('filter', () => {
  const ogBaseSearchApi = useOgBaseApiWrapper(searchApi)
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
  })

  watch(
    () => store.getters['code/countryList'],
    (newCountryList) => {
      filterOption.value.countryList = newCountryList
    },
    { immediate: true } // Run immediately on mount
  )

  const getInternalFilterOption = async () => {
    const { data } = await ogBaseSearchApi('getInternalSearchFilterOptions')
    const materialOptions = await getMaterialOptions()

    filterOption.value = Object.assign(filterOption.value, data.result)
    filterOption.value.certificateList = materialOptions?.certificateList
  }
  const getExternalFilterOption = async () => {
    const { data } = await ogBaseSearchApi('getExternalSearchFilterOptions')
    filterOption.value = Object.assign(filterOption.value, data.result)
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
    countryList: [],
    certificateList: [],
    hasU3M: null,
    // for assets and workspace
    withOutEcoImpactor: null,
    // for assets
    status: null,
  })
  const filterState = ref<FilterState>(getInitFilterState())
  const setFilterState = (filter: FilterState) => (filterState.value = filter)
  const setFilterStateByProperty = <T extends keyof FilterState>(
    property: T,
    val: FilterState[T]
  ) => (filterState.value[property] = JSON.parse(JSON.stringify(val)))
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
