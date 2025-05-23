<template>
  <div class="flex flex-col h-screen overflow-x-hidden overflow-y-auto">
    <!-- refContainer now wraps the main content and inherits parent styles -->
    <div
      v-if="dashboardPagePermission"
      ref="refContainer"
      class="px-8 pt-8 pb-16 flex flex-col gap-y-8 w-[1146px] mx-auto flex-grow"
    >
      <!-- Header section -->
      <div class="flex items-center flex-shrink-0 gap-2">
        <DropdownOgMenuV2
          :selectValue="`${ogType}-${ogId}`"
          @update:selectValue="clickDropDownOgMenu"
        ></DropdownOgMenuV2>

        <div class="text-h2/1.5 font-bold text-grey-950 text-center">
          {{ $t('BB0138') }}
        </div>
        <div class="flex-1"></div>
      </div>

      <!-- Overview -->
      <div
        class="text-h4/1.6 font-bold text-primary text-center rounded-2xl bg-grey-50-v1 p-6 gap-4 flex flex-col"
      >
        <div class="flex items-center self-stretch justify-between">
          <div
            class="font-sans text-xl font-bold leading-8 text-center text-grey-900-v1"
          >
            Overview
          </div>
          <!-- Filter Button -->
          <f-button
            type="secondary"
            prependIcon="union_2"
            size="md"
            class="flex min-w-[96px] max-w-[512px] py-1 px-3 justify-center items-center gap-1 hover:bg-grey-50-v1 border-green-200-v1"
            @click="isOpenFilterPanel = !isOpenFilterPanel"
          >
            <span
              class="font-bold leading-6 text-center text-body2 text-green-500-v1"
            >
              {{ $t('RR0085') }}
            </span>
          </f-button>
          <!-- Download Report Button -->
          <!-- <f-button
            type="primary"
            prependIcon="download"
            size="md"
            class="text-white bg-green-500 h-11 hover:text-white"
            @click="openFilterModal = true"
            >{{ $t('BB0116') }}</f-button
          > -->
        </div>

        <!-- Filter Panel -->
        <div v-if="isOpenFilterPanel" class="flex-shrink-0">
          <div>
            <!-- <div class="flex items-end pb-4">
                <p class="text-body1 text-grey-900">{{ $t('RR0085') }}</p>
              </div> -->
            <div
              class="flex flex-wrap items-center justify-end gap-x-2 gap-y-2"
            >
              <filter-material-type
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-material-description
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-content
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-pattern
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-color
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-width
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-weight
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-yarn-density
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-finish
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-inventory
                :searchType="searchType"
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-price
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-has-u3m
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-eco
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-asset-status
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <filter-country
                v-if="searchType === SEARCH_TYPE.INNER_EXTERNAL"
                @search="handleSearch"
                class="font-normal rounded-lg bg-grey-0"
              />
              <!-- <filter-season @search="handleSearch" /> -->
              <!-- <filter-year @search="handleSearch" /> -->
              <!-- <filter-certification
                  @search="handleSearch"
                  class="rounded-lg bg-grey-0"
                /> -->
              <p
                class="pl-3 font-normal cursor-pointer text-caption text-grey-600"
                @click="resetFilterHandler"
              >
                {{ $t('UU0041') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="flex flex-col flex-shrink-0 gap-y-4">
          <div class="grid grid-cols-3 gap-4">
            <StatCard
              :title="$t('RR0493')"
              :value="createCounts?.yourAssetCounts || 0"
              icon-name="texture"
              class="w-full"
            />
            <StatCard
              :title="$t('RR0494')"
              :value="createCounts?.threeDimensionAssetCounts || 0"
              icon-name="view-in-ar"
              class="w-full"
            />
            <StatCard
              :title="$t('BB0119')"
              :value="createCounts?.collectionCounts || 0"
              icon-name="collections-bookmark"
              class="w-full"
            />
            <!-- <StatCard
              :title="$t('RR0495')"
              :value="createCounts?.countryCounts || 0"
              icon-name="public"
              class="w-full"
            /> -->
          </div>
          <!-- <div class="flex gap-4">
              <StatCard
                :title="$t('BB0119')"
                :value="createCounts?.collectionCounts || 0"
                icon-name="collections-bookmark"
                class="flex-1"
              />
              <StatCard
                title="i18n-Country of Origin"
                value="56000"
                icon-name="public"
                class="flex-1"
              />
              <StatCard
                title="i18n-Assets"
                value="99999999"
                icon-name="images"
                class="flex-1"
              />
            </div> -->
        </div>

        <!-- Stacked Bar Charts -->
        <!-- Solution 1: Using inline style -->
        <div
          class="flex justify-between flex-shrink-0 gap-x-4"
          :style="{
            height: `${6 * 65}px`,
          }"
        >
          <div
            class="w-full h-auto bg-white p-6 border border-[#DEDEDE] rounded-2xl"
          >
            <DashboardStackedChart
              v-if="!dashboardIsLoading"
              theme="macarons"
              :title-text="$t('RR0496')"
              :chart-data="materialContentCategoryList"
              :tooltip-message="$t('RR0497')"
            />
            <div
              class="flex flex-col justify-around h-full align-arund"
              v-if="dashboardIsLoading"
            >
              <SkeletonBase class="w-full h-8 mb-1" />
              <SkeletonBase class="w-full h-8 mb-1" />
              <SkeletonBase class="w-full h-8 mb-1" />
              <SkeletonBase class="w-full h-8 mb-1" />
              <SkeletonBase class="w-full h-8 mb-1" />
              <SkeletonBase class="w-full h-8 mb-1" />
            </div>
          </div>
          <div class="w-full bg-white p-6 border border-[#DEDEDE] rounded-2xl">
            <DashboardStackedChart
              v-if="!dashboardIsLoading"
              theme="roma"
              :title-text="$t('RR0498')"
              :chart-data="materialTypeOfCountryList"
              :tooltip-message="$t('RR0499')"
              :havePublicAndPrivate="true"
            />
            <div
              class="flex flex-col justify-around h-full align-arund"
              v-if="dashboardIsLoading"
            >
              <SkeletonBase class="w-full h-8 mb-1" />
              <SkeletonBase class="w-full h-8 mb-1" />
              <SkeletonBase class="w-full h-8 mb-1" />
              <SkeletonBase class="w-full h-8 mb-1" />
              <SkeletonBase class="w-full h-8 mb-1" />
              <SkeletonBase class="w-full h-8 mb-1" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col flex-shrink-0 gap-y-4">
        <!-- Trending Now -->
        <div
          class="w-full bg-white p-6 border border-[#DEDEDE] rounded-2xl flex flex-col"
        >
          <div class="flex items-center justify-between flex-shrink-0 mb-4">
            <div class="flex items-center">
              <div class="mr-1 text-xl font-bold leading-8 text-grey-900">
                {{ $t('RR0500') }}z
              </div>
              <f-svg-icon
                iconName="question"
                size="16"
                class="text-grey-700-v1 cursor-help"
                :tooltipMessage="$t('RR0501')"
                tooltipType="bubble"
              />
            </div>

            <!-- Tabs -->
            <f-tabs
              :tabList="timePeriodTabs"
              :initValue="currentTimePeriodTab"
              :type="FTabsType.SEGMENTED"
              keyField="id"
              @switch="currentTimePeriodTab = $event.id"
              tabListContainerStyle="w-auto"
              tabItemContainerStyle="px-2 py-1"
            />
          </div>
          <!-- Show skeletons when loading -->
          <template v-if="isLoading || dashboardIsLoading">
            <div class="w-full">
              <SkeletonBase class="w-full mb-2 h-30" />
            </div>
          </template>
          <template v-else>
            <div
              v-if="processedTableItems.length === 0"
              class="w-full h-full bg-grey-50-v1 rounded-[4px] flex items-center justify-center min-h-[120px]"
            >
              <div
                class="text-base font-normal leading-6 text-center text-grey-600-v1"
              >
                {{ $t('RR0502') }}
              </div>
            </div>
            <f-table
              v-else
              :headers="tableHeaders"
              :items="processedTableItems"
              :show-header="true"
              :empty-text="$t('RR0503')"
              :fit-container="true"
              v-model:currentSort="currentSort"
              @sort="handleSort"
            >
              <template #default="{ item, prop }">
                <span>{{ item[prop] }}</span>
              </template>
            </f-table>
          </template>
        </div>

        <!-- Eco Impactor -->
        <div
          class="w-full min-h-[216px] bg-white p-6 border border-[#DEDEDE] rounded-2xl flex flex-col flex-shrink-0"
        >
          <div class="flex items-center justify-between flex-shrink-0 mb-4">
            <div class="mr-1 text-xl font-bold leading-8 text-grey-900-v1">
              {{ $t('M2F031') }}
            </div>
            <!-- Tabs -->
            <f-tabs
              :tabList="trendingTabs"
              :initValue="currentTrendingTab"
              :type="FTabsType.SEGMENTED"
              keyField="id"
              @switch="currentTrendingTab = $event.id"
              tabListContainerStyle="w-auto"
              tabItemContainerStyle="px-2 py-1"
            />
          </div>
          <!-- Show skeleton when loading -->
          <template v-if="isLoading || dashboardIsLoading">
            <div class="flex items-center justify-center flex-grow">
              <SkeletonBase class="w-full mb-2 h-30" />
            </div>
          </template>
          <!-- Show chart when not loading -->
          <template v-else>
            <div
              class="flex-grow"
              :class="hasEcoData ? 'min-h-[200px]' : 'min-h-[120px]'"
            >
              <DashboardLineChart :chart-data="currentEcoImpactorData" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Permission Denied Message: Shown outside when permission denied -->
    <div v-else class="flex items-center justify-center h-full">
      {{ $t('PP0038') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard'
import useNavigation from '@/composables/useNavigation'
import DropdownOgMenuV2 from '@/components/common/DropdownOgMenuV2.vue'
import { FUNC_ID, PERMISSION_MAP, SEARCH_TYPE } from '@/utils/constants'

// Import FTabs and its TYPE enum
import FTabs, {
  TYPE as FTabsType,
} from '@frontier/ui-component/src/FTabs/FTabs.vue'

// Import filter components
import FilterMaterialType from '@/components/common/filter/FilterMaterialType.vue'
import FilterContent from '@/components/common/filter/FilterContent.vue'
import FilterWeight from '@/components/common/filter/FilterWeight.vue'
import FilterFinish from '@/components/common/filter/FilterFinish.vue'
import FilterPrice from '@/components/common/filter/FilterPrice.vue'
import FilterCountry from '@/components/common/filter/FilterCountry.vue'
import SkeletonBase from '@/components/common/SkeletonBase.vue'
import FilterSeason from '@/components/common/filter/FilterSeason.vue'
import FilterYear from '@/components/common/filter/FilterYear.vue'
import FilterCertification from '@/components/common/filter/FilterCertification.vue'
import StatCard from '@/components/common/StatCard.vue'
import FilterMaterialDescription from '@/components/common/filter/FilterMaterialDescription.vue'
import FilterColor from '@/components/common/filter/FilterColor.vue'
import FilterWidth from '@/components/common/filter/FilterWidth.vue'
import FilterYarnDensity from '@/components/common/filter/FilterYarnDensity.vue'
import FilterInventory from '@/components/common/filter/FilterInventory.vue'
import FilterHasU3m from '@/components/common/filter/FilterHasU3m.vue'
import FilterEco from '@/components/common/filter/FilterEco.vue'
import FilterAssetStatus from '@/components/common/filter/FilterAssetStatus.vue'
import FilterPattern from '@/components/common/filter/FilterPattern.vue'

// Import filter store if needed for reset or other actions
import { type FilterState, useFilterStore } from '@/stores/filter'
import { useI18n } from 'vue-i18n'

// Import the chart components
import DashboardStackedChart from './dashboard/DashboardStackedChart.vue'
import DashboardLineChart from './dashboard/DashboardLineChart.vue'
// import materialTypeData from './dashboard/materialTypeDummyData.json'
// import countryOfOriginData from './dashboard/countryOfOriginDummyData.json'

defineOptions({
  name: 'DashboardView',
})

const store = useStore()
const { t } = useI18n()
const { goToDashboard, ogType, ogId } = useNavigation()
const dashboard = useDashboardStore()

// Destructure the state properties using storeToRefs
const {
  materialContentCategoryList,
  createCounts,
  materialTypeOfCountryList,
  fabricKeywordCounts,
  ecoImpactorInformation,
} = storeToRefs(dashboard)
const dashboardIsLoading = ref(false)
const isLoading = ref(false)
const refContainer = ref<HTMLElement>()
// Retain the existing openFilterModal if needed for Download Report
const openFilterModal = ref(false)

// New refs and constants for the filter panel
const isOpenFilterPanel = ref(false)
const searchType = SEARCH_TYPE.INNER_EXTERNAL // Set according to your use case

// Time Period Tabs
const currentTimePeriodTab = ref('last_month')
const timePeriodTabs = computed(() => [
  { id: 'last_month', name: t('BB0126'), icon: '' }, // Using plain text for now, replace with i18n keys
  { id: 'last_3_months', name: t('BB0127'), icon: '' },
])

// Trending Now Tabs
const currentTrendingTab = ref<'ghg' | 'water' | 'land'>('ghg') // Default to GHG
const trendingTabs = computed(() => [
  { id: 'ghg', name: t('BB0131'), icon: '' },
  { id: 'water', name: t('BB0132'), icon: '' },
  { id: 'land', name: t('BB0133'), icon: '' },
])

const filterStore = useFilterStore()
const { isFilterDirty, filterState, filterDirty } = storeToRefs(filterStore)

// --- Current Sort State ---
const currentSort = ref('volume_desc') // Default sort
// --- End Current Sort State ---

const resetFilterHandler = async () => {
  if (filterStore.resetFilterState) {
    filterStore.resetFilterState()
  }
  dashboardIsLoading.value = true
  try {
    await dashboard.getDashboard()
    await dashboard.getDashboardSummary()
  } catch (error) {
    // Error is already logged by the store.
    // console.warn("Dashboard summary failed to load in resetFilterHandler:", error);
  } finally {
    dashboardIsLoading.value = false
  }
}

const clickDropDownOgMenu = (event: string) => {
  // reset all data to 0
  createCounts.value.yourAssetCounts = 0
  createCounts.value.threeDimensionAssetCounts = 0
  createCounts.value.collectionCounts = 0
  createCounts.value.countryCounts = 0
  goToDashboard({ ogKey: event })
}

const handleSearch = async () => {
  // Implement search logic or filter update actions here
  let _filter: any = null // Changed type to any for flexibility

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

  if (!isFilterDirty.value) {
    _filter = null
  }

  _filter = {
    ...Object.keys(filterState.value).reduce((acc, key) => {
      const property = key as keyof typeof filterState.value
      return {
        ...acc,
        [property]: filterDirty.value[property]
          ? filterState.value[property]
          : null,
      }
    }, {}),
    densityAndYarn: woven || knit ? { woven, knit } : null,
  }

  // Rename countryList to priceCountryOriginList for the dashboard summary request
  if (_filter && Object.prototype.hasOwnProperty.call(_filter, 'countryList')) {
    _filter.priceCountryOriginList = _filter.countryList
    delete _filter.countryList
  }

  dashboardIsLoading.value = true
  try {
    await dashboard.getDashboard(filterStore.filterState)
    await dashboard.getDashboardSummary(_filter)
  } catch (error) {
    // Error is already logged by the store.
    // console.warn("Dashboard summary failed to load in handleSearch:", error);
  } finally {
    dashboardIsLoading.value = false
  }
}

const roleId = store.getters['organization/orgUser/orgUser'].roleID
const permissionList = PERMISSION_MAP[roleId]
const dashboardPagePermission = ref(
  permissionList.includes(FUNC_ID.DASHBOARD_PAGE)
)

const tableHeaders = ref([
  {
    prop: 'keyword',
    label: t('RR0504'),
    colSpan: 'col-span-6',
    align: 'text-center', // Changed align for keywords
    customClass: 'font-bold leading-4',
    textColor: 'text-grey-900-v1',
  },
  {
    prop: 'searchVolume',
    label: t('RR0505'),
    colSpan: 'col-span-6',
    align: 'text-center',
    sortBy: ['volume_desc', 'volume_asc'], // Keep this order for correct icon rotation
    customClass: 'leading-4',
  },
])

// --- Computed property for table items based on selected tab and sort ---
const processedTableItems = computed(() => {
  // Ensure fabricKeywordCounts and its properties exist
  if (!fabricKeywordCounts.value) {
    return []
  }

  const sourceData =
    currentTimePeriodTab.value === 'last_3_months'
      ? fabricKeywordCounts.value.last3Month?.data
      : fabricKeywordCounts.value.lastMonth?.data

  if (!sourceData) {
    return []
  }

  // Map data to the required format { keyword, searchVolume }
  let mappedItems = sourceData.map((item) => ({
    keyword: item.name || '', // Handle potential missing name
    searchVolume: Array.isArray(item.value)
      ? item.value.reduce((sum, count) => sum + (count || 0), 0) // Sum values, handle potential nulls
      : 0, // Default if value is not an array
  }))

  // Sort the items based on currentSort
  const sortKey = currentSort.value
  if (sortKey) {
    const sortField = 'searchVolume'
    // Determine sort order: 1 for asc, -1 for desc
    const sortOrder = sortKey === tableHeaders.value[1]?.sortBy?.[1] ? 1 : -1

    mappedItems.sort((a, b) => {
      // Handle potential non-numeric values if necessary, though searchVolume should be numeric
      const valA = a[sortField]
      const valB = b[sortField]
      return (valA - valB) * sortOrder
    })
  }

  return mappedItems
})
// --- End computed property ---

// --- Update Sorting Handler ---
const handleSort = () => {
  // No need to manually sort here anymore.
  // v-model:currentSort updates the state.
  // The computed property `processedTableItems` reacts to `currentSort` changes.
  console.log('Sort changed to:', currentSort.value)
  // You could trigger an API call here if sorting was server-side.
}
// --- End Update Sorting Handler ---

// --- NEW Computed property to format data for DashboardLineChart ---
const currentEcoImpactorData = computed(() => {
  // Return null if there's no data for the current tab
  if (!ecoImpactorInformation.value?.internal?.[currentTrendingTab.value]) {
    return null
  }
  const dataSetArray =
    ecoImpactorInformation.value?.internal?.[currentTrendingTab.value] || []

  let xAxisData: string[] = []
  let seriesData: number[] = []

  if (Array.isArray(dataSetArray) && dataSetArray.length > 0) {
    xAxisData = dataSetArray.map((item) => item?.name || '')
    seriesData = dataSetArray.map((item) => Number(item?.value || 0))
  }

  // Generate index labels if names are empty
  if (xAxisData.every((name) => name === '')) {
    xAxisData = Array.from({ length: seriesData.length }, (_, i) => `${i + 1}`)
  }

  // Find the name for the series from the tabs definition
  const seriesName =
    trendingTabs.value.find((tab) => tab.id === currentTrendingTab.value)
      ?.name || t('RR0506')

  const unit =
    currentTrendingTab.value === 'ghg'
      ? 'kg'
      : currentTrendingTab.value === 'land'
      ? '㎡'
      : 'L'

  return {
    xAxis: xAxisData,
    data: seriesData,
    seriesName: seriesName, // Pass the name to the component
    unit,
  }
})

// Computed boolean for whether eco impactor data exists
const hasEcoData = computed(
  () =>
    Array.isArray(currentEcoImpactorData.value?.data) &&
    currentEcoImpactorData.value.data.length > 0
)
// --- End new computed property ---

onMounted(async () => {
  isLoading.value = true
  dashboardIsLoading.value = true
  // Fetch dashboard data (ensure ecoImpactorInformation is fetched)
  try {
    await dashboard.getDashboard()
    await dashboard.getDashboardSummary()
  } catch (error) {
    // Error is already logged by the store.
    // console.warn("Dashboard summary failed to load in onMounted:", error);
  } finally {
    isLoading.value = false
    dashboardIsLoading.value = false
  }
})
</script>

<style>
/* Optional: Ensure chart container has explicit height if parent doesn't guarantee it */
.echarts {
  width: 100%;
  height: 100%;
}
</style>
