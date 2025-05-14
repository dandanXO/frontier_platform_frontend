<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center mb-4 flex-shrink-0">
      <div class="text-grey-900 text-xl font-bold leading-8 mr-1">
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
          class="text-grey-600-v1 text-center text-base leading-6 font-normal"
        >
          {{ $t('RR0507') }}
        </div>
      </div>
      <v-chart
        v-else
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
}

// Define props with default values
const props = withDefaults(defineProps<Props>(), {
  titleText: 'Default Chart Title',
  chartData: null,
  tooltipMessage: '',
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

// Add view tabs
const currentViewTab = ref<'percentage' | 'count'>('percentage')
const viewTabs = computed(() => [
  { id: 'percentage', name: '%', icon: '' },
  { id: 'count', name: '#', icon: '' },
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

// Watch for changes in props and update options
watch(
  () => [props.chartData, currentViewTab.value] as const,
  ([newData, viewTab]) => {
    // Update based on newData
    if (newData) {
      // Update legend, ensuring it's a single object
      if (
        chartOptions.value.legend &&
        typeof chartOptions.value.legend === 'object' &&
        !Array.isArray(chartOptions.value.legend)
      ) {
        chartOptions.value.legend.data = newData.series.map(
          (item: SeriesItem) => item.name
        )
      }
      // Update yAxis, ensuring it's a single object and category type
      if (
        chartOptions.value.yAxis &&
        typeof chartOptions.value.yAxis === 'object' &&
        !Array.isArray(chartOptions.value.yAxis) &&
        chartOptions.value.yAxis.type === 'category'
      ) {
        ;(chartOptions.value.yAxis as { data?: string[] }).data =
          newData.categories
      }

      // Update xAxis max value based on view type
      if (
        chartOptions.value.xAxis &&
        typeof chartOptions.value.xAxis === 'object' &&
        !Array.isArray(chartOptions.value.xAxis)
      ) {
        chartOptions.value.xAxis.max =
          viewTab === 'percentage' ? 100 : undefined
      }

      // Update tooltip formatter based on view type
      if (
        chartOptions.value.tooltip &&
        typeof chartOptions.value.tooltip === 'object'
      ) {
        ;(chartOptions.value.tooltip as any).formatter = (params: any) => {
          const idx = params.dataIndex as number
          const seriesArr = newData.series
          const total = seriesArr.reduce(
            (sum, s) => sum + (s.data[idx] || 0),
            0
          )
          const count = params.value as number
          const percent =
            total > 0 ? Math.round((count / total) * 100) + '%' : '0%'
          const color = (params.color as string) || 'transparent'
          const markerRect = `<span style="display:inline-block;width:12px;height:8px;background-color:${color};"></span>`
          const header = `<div style="display:inline-flex; align-items:center; justify-content:center; gap:8px">${markerRect}<span>${params.seriesName}</span></div>`

          if (viewTab === 'percentage') {
            const pieceCount =
              seriesArr.find((s) => s.name === params.seriesName)?.data[idx] ||
              0
            const displayPercent = (count as number).toFixed(2)
            return `<div style="display:flex; flex-direction:column; align-items:center; text-align:center">${header}<span>${displayPercent}%</span><span>${pieceCount} pieces</span></div>`
          } else {
            return `<div style="display:flex; flex-direction:column; align-items:center; text-align:center">${header}<span>${percent}</span><span>${count} pieces</span></div>`
          }
        }
      }

      // Update series with transformed data based on view type
      chartOptions.value.series = newData.series.map((item: SeriesItem) => {
        const data =
          viewTab === 'percentage'
            ? item.data.map((value, index) => {
                const total = newData.series.reduce(
                  (sum, s) => sum + (s.data[index] || 0),
                  0
                )
                return total > 0 ? (value / total) * 100 : 0
              })
            : item.data

        return {
          name: item.name,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data,
          barWidth: 32,
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
