<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center flex-shrink-0 mb-4">
      <div class="mr-1 text-xl font-bold leading-8 text-grey-900">
        {{ titleText }}
      </div>
      <f-svg-icon
        iconName="question"
        size="16"
        class="text-grey-400 cursor-help"
        :tooltip-message="tooltipMessage"
        tooltipType="bubble"
      />
      <div class="flex-1"></div>
      <!-- Add Tabs -->
      <f-tabs
        v-if="props.havePublicAndPrivate"
        :tabList="publicAndPrivateTabs"
        :initValue="currentPublicAndPrivateTab"
        :type="FTabsType.SEGMENTED"
        keyField="id"
        @switch="currentPublicAndPrivateTab = $event.id"
        tabListContainerStyle="w-auto"
        tabItemContainerStyle="px-2 py-1"
        class="mr-2"
      />
      <f-tabs
        :tabList="viewTabs"
        :initValue="currentViewTab"
        :type="FTabsType.SEGMENTED"
        keyField="id"
        @switch="currentViewTab = $event.id"
        tabListContainerStyle="w-auto"
        tabItemContainerStyle="px-2 py-1"
      />
    </div>
    <div class="flex-grow min-h-0">
      <div
        v-if="!props.chartData"
        class="w-full h-full bg-grey-50-v1 rounded-[4px] flex items-center justify-center min-h-[120px]"
      >
        <div
          class="text-base font-normal leading-6 text-center text-grey-600-v1"
        >
          {{ $t('RR0507') }}
        </div>
      </div>
      <v-chart
        v-else
        :key="chartKey"
        :theme="props.theme"
        class="h-full w-full min-h-[216px]"
        :option="chartOptions"
        :update-options="{ notMerge: true }"
        autoresize
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import FSvgIcon from '@frontier/ui-component/src/FSvgIcon/FSvgIcon.vue'
import FTabs, {
  TYPE as FTabsType,
} from '@frontier/ui-component/src/FTabs/FTabs.vue'
import { useI18n } from 'vue-i18n'
import { useDashboardStore } from '@/stores/dashboard'
import { storeToRefs } from 'pinia'
import * as echarts from 'echarts'
import macaronsTheme from './eCahrtThemeMacarons.json'
import romaTheme from './eCahrtThemeRoma.json'

// register echart theme
echarts.registerTheme('macarons', macaronsTheme)
echarts.registerTheme('roma', romaTheme)

const { t } = useI18n()

// Define the structure of the props
interface SeriesItem {
  name: string
  data: number[]
  color: string
}

interface ChartData {
  categories: string[]
  series: SeriesItem[]
}

interface Props {
  titleText?: string
  chartData?: ChartData | null
  tooltipMessage?: string
  theme?: string
  havePublicAndPrivate?: boolean
}

// Define props with default values
const props = withDefaults(defineProps<Props>(), {
  titleText: 'Default Chart Title',
  chartData: null,
  tooltipMessage: '',
  havePublicAndPrivate: false,
})

// Register ECharts components
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

defineOptions({
  name: 'DashboardStackedChart',
})
const chartKey = ref(0)
const dashboardStore = useDashboardStore()
const switchMaterialTypeOfCountryList =
  dashboardStore.switchMaterialTypeOfCountryList
// Add view tabs
const currentViewTab = ref<'percentage' | 'count'>('percentage')
const currentPublicAndPrivateTab = ref<'public' | 'private'>('private')
const viewTabs = computed(() => [
  { id: 'percentage', name: '%', icon: '' },
  { id: 'count', name: '#', icon: '' },
])
const publicAndPrivateTabs = computed(() => [
  { id: 'public', name: '', icon: 'public_earth' },
  { id: 'private', name: '', icon: 'private_earth' },
])

// Use the EChartsOption type for chartOptions
const chartOptions = ref<EChartsOption>({
  tooltip: {
    trigger: 'item',
    formatter: (params: any) => {
      // params: { dataIndex, value, color }
      const idx = params.dataIndex as number
      const seriesArr = props.chartData?.series || []
      const total = seriesArr.reduce((sum, s) => sum + (s.data[idx] || 0), 0)
      const count = params.value as number
      const percent = total > 0 ? Math.round((count / total) * 100) + '%' : '0%'
      const color = (params.color as string) || 'transparent'
      const markerRect = `<span style="display:inline-block;width:12px;height:8px;background-color:${color};"></span>`
      const header = `<div style="display:inline-flex; align-items:center; justify-content:center; gap:8px">${markerRect}<span>${params.seriesName}</span></div>`
      return `<div style="display:flex; flex-direction:column; align-items:center; text-align:center">${header}<span>${percent}</span><span>${count} pieces</span></div>`
    },
  },
  legend: {
    icon: 'rect',
    bottom: 0,
    left: 'center',
    orient: 'horizontal',
    textStyle: {
      fontSize: 12,
      fontWeight: 400,
      color: '#717272',
    },
  },
  grid: {
    left: '6px',
    right: '0',
    top: 0,
    bottom: 24,
    containLabel: true,
  },
  barCategoryGap: '99px',
  barGap: '99px',
  xAxis: {
    show: false,
    type: 'value',
    max: currentViewTab.value === 'percentage' ? 100 : undefined,
    boundaryGap: [0, 0.01],
  },
  yAxis: {
    type: 'category',
    inverse: true,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    axisLabel: {
      fontSize: 12,
      fontWeight: 400,
      color: '#717272',
    },
    data: [],
  },
  series: [],
})

watch(
  () => [props.chartData, currentPublicAndPrivateTab.value] as const,
  ([newData, viewTab]) => {
    switchMaterialTypeOfCountryList(viewTab)
    chartKey.value++
  }
)

// Watch for changes in props and update options
watch(
  () => [props.chartData, currentViewTab.value] as const,
  ([newData, viewTab]) => {
    if (newData) {
      // 1. Prepare series: Sort by total items
      const seriesWithTotals = newData.series.map((s) => ({
        ...s, // Includes name, data, color from original SeriesItem
        totalItems: s.data.reduce((acc, val) => acc + (val || 0), 0),
      }))
      seriesWithTotals.sort((a, b) => b.totalItems - a.totalItems)

      let finalProcessedSeries: SeriesItem[] = []
      let legendNames: string[] = []
      // seriesForTooltipCalculation holds the raw data for series that will be displayed,
      // including "Others" if it's formed.
      let seriesForTooltipCalculation: SeriesItem[] = []

      if (seriesWithTotals.length <= 8) {
        // If 8 or fewer series, display all of them with their original names
        finalProcessedSeries = [...seriesWithTotals]
        legendNames = seriesWithTotals.map((s) => s.name)
        seriesForTooltipCalculation = [...seriesWithTotals] // Tooltip uses original data for all displayed series
      } else {
        // More than 8 series, so display top 7 + aggregate the rest into "Others"
        const top7Series = seriesWithTotals.slice(0, 7)
        const remainingSeries = seriesWithTotals.slice(7)

        finalProcessedSeries = [...top7Series]
        legendNames = top7Series.map((s) => s.name)
        seriesForTooltipCalculation = [...top7Series] // Start with top 7 for tooltip

        // Aggregate "Others"
        const numCategories = newData.categories.length
        const aggregatedOthersData = new Array(numCategories).fill(0)
        remainingSeries.forEach((series) => {
          series.data.forEach((value, index) => {
            aggregatedOthersData[index] += value || 0
          })
        })

        finalProcessedSeries.push({
          name: `Others (${seriesWithTotals.length - 7} more)`,
          data: aggregatedOthersData,
          color: '#A9A9A9', // DarkGray for Others
        })
        legendNames.push(`Others (${seriesWithTotals.length - 7} more)`)

        seriesForTooltipCalculation.push({
          // Add aggregated "Others" to tooltip series
          name: `Others (${seriesWithTotals.length - 7} more)`,
          data: aggregatedOthersData,
          color: '#A9A9A9',
        })
      }

      // 2. Update legend
      if (
        chartOptions.value.legend &&
        typeof chartOptions.value.legend === 'object' &&
        !Array.isArray(chartOptions.value.legend)
      ) {
        chartOptions.value.legend.data = [...legendNames]
      }

      // 3. Update yAxis categories
      if (
        chartOptions.value.yAxis &&
        typeof chartOptions.value.yAxis === 'object' &&
        !Array.isArray(chartOptions.value.yAxis) &&
        chartOptions.value.yAxis.type === 'category'
      ) {
        ;(chartOptions.value.yAxis as { data?: string[] }).data =
          newData.categories
      }

      // 4. Update xAxis max value
      if (
        chartOptions.value.xAxis &&
        typeof chartOptions.value.xAxis === 'object' &&
        !Array.isArray(chartOptions.value.xAxis)
      ) {
        chartOptions.value.xAxis.max =
          viewTab === 'percentage' ? 100 : undefined
      }

      // 5. Update tooltip formatter
      if (
        chartOptions.value.tooltip &&
        typeof chartOptions.value.tooltip === 'object'
      ) {
        ;(chartOptions.value.tooltip as any).formatter = (params: any) => {
          const idx = params.dataIndex as number
          const chartValue = params.value as number // Value from chart (can be % or count)
          const color = (params.color as string) || 'transparent'
          const markerRect = `<span style="display:inline-block;width:12px;height:8px;background-color:${color};"></span>`
          const header = `<div style="display:inline-flex; align-items:center; justify-content:center; gap:8px">${markerRect}<span>${params.seriesName}</span></div>`

          // Find the original data point for piece count
          const originalSeriesPoint =
            seriesForTooltipCalculation.find(
              (s) => s.name === params.seriesName
            )?.data[idx] || 0

          // Calculate total for this category across all series for percentage display
          const categoryTotal = seriesForTooltipCalculation.reduce(
            (sum, s) => sum + (s.data[idx] || 0),
            0
          )

          if (viewTab === 'percentage') {
            // chartValue is already the percentage
            const displayPercent = chartValue.toFixed(2)
            return `<div style="display:flex; flex-direction:column; align-items:center; text-align:center">${header}<span>${displayPercent}%</span><span>${originalSeriesPoint} pieces</span></div>`
          } else {
            // 'count' view
            // chartValue is the count
            const percent =
              categoryTotal > 0
                ? ((originalSeriesPoint / categoryTotal) * 100).toFixed(2) + '%'
                : '0%'
            return `<div style="display:flex; flex-direction:column; align-items:center; text-align:center">${header}<span>${percent}</span><span>${originalSeriesPoint} pieces</span></div>`
          }
        }
      }

      // 6. Update series with transformed data for chart display
      chartOptions.value.series = finalProcessedSeries.map((item) => {
        let dataForDisplay: number[]
        if (viewTab === 'percentage') {
          dataForDisplay = item.data.map((value, index) => {
            const categoryTotalForAllSeries = finalProcessedSeries.reduce(
              (sum, s) => sum + (s.data[index] || 0),
              0
            )
            return categoryTotalForAllSeries > 0
              ? (value / categoryTotalForAllSeries) * 100
              : 0
          })
        } else {
          dataForDisplay = item.data
        }

        return {
          name: item.name,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data: dataForDisplay,
          barWidth: 32,
          color: item.color, // Use the color from SeriesItem (original or 'Others' color)
        }
      })
    } else {
      // Clear data if newData is null
      if (
        chartOptions.value.legend &&
        typeof chartOptions.value.legend === 'object' &&
        !Array.isArray(chartOptions.value.legend)
      ) {
        chartOptions.value.legend.data = []
      }
      if (
        chartOptions.value.yAxis &&
        typeof chartOptions.value.yAxis === 'object' &&
        !Array.isArray(chartOptions.value.yAxis) &&
        chartOptions.value.yAxis.type === 'category'
      ) {
        ;(chartOptions.value.yAxis as { data?: string[] }).data = []
      }
      chartOptions.value.series = []
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
