import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import searchApi from '@/apis/search'
import type { MaterialDescription } from '@frontier/platform-web-sdk'
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
}

interface Description {
  default: MaterialDescription[]
  custom: MaterialDescription[]
}

export interface FilterOption {
  descriptionList?: {
    woven: Description
    knit: Description
    leather: Description
    nonWoven?: Description
    trim?: Description
    others?: Description
  }
  contentList?: {
    displayName: string
    value: string
  }[]
  patternList?: {
    key: string
    list: {
      value: string
      img: string
    }[]
  }[]
  colorList?: {
    hex: string
    value: string
  }[]
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
  finishList?: {
    displayName: string
    value: string
  }[]
  countryList: {
    name: string
    countryCode: string
  }[]
}

export const useFilterStore = defineStore('filter', () => {
  const ogBaseSearchApi = useOgBaseApiWrapper(searchApi)
  const store = useStore()
  const countryList = store.getters['code/countryList'] as Country[]
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
    countryList: countryList.map(({ name, countryCode }) => ({
      name,
      countryCode,
    })),
  })
  const getInternalFilterOption = async () => {
    const { data } = await ogBaseSearchApi('getInternalSearchFilterOptions')
    filterOption.value = Object.assign(filterOption.value, data.result)
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
    hasU3M: null,
    // for assets and workspace
    withOutEcoImpactor: null,
    // for assets
    status: null,
    // for Inner External
    countryList: [],
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
