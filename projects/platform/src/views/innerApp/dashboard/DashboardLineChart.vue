<template>
  <div class="h-full w-full">
    <div
      v-if="!hasLineData"
      class="w-full h-full bg-grey-50-v1 rounded-[4px] flex items-center justify-center"
    >
      <div class="text-grey-600-v1 text-center text-base leading-6 font-normal">
        {{ $t('RR0507') }}
      </div>
    </div>
    <v-chart
      v-else
      class="h-full w-full"
      :option="lineChartOptions"
      autoresize
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import * as echarts from 'echarts/core' // Import echarts core for gradient
import type { EChartsOption } from 'echarts'

// Register ECharts components
use([CanvasRenderer, LineChart, TooltipComponent, GridComponent])

defineOptions({
  name: 'DashboardLineChart',
})

// Define the structure for chartData prop
interface LineChartData {
  xAxis: string[]
  data: number[]
  seriesName?: string // Optional name for the series/legend
  unit?: string // Optional unit for the data points
}

interface Props {
  chartData: LineChartData | null // Accept the specific data structure
}

// Define props
const props = defineProps<Props>()
const hasLineData = computed(
  () => Array.isArray(props.chartData?.data) && props.chartData.data.length > 0
)

// Computed property for ECharts options based on props
const lineChartOptions = computed<EChartsOption>(() => {
  const seriesName = props.chartData?.seriesName || 'Data'
  const xAxisData = props.chartData?.xAxis || []
  const seriesData = props.chartData?.data || []
  const unit = props.chartData?.unit || ''

  // --- Axis Calculation Logic ---
  const dataMax = seriesData.length > 0 ? Math.max(...seriesData) : 50 // Default max if no data
  const dataMin = seriesData.length > 0 ? Math.min(...seriesData) : 0
  const delta = dataMax - dataMin

  let interval: number
  let axisMin: number
  let axisMax: number

  if (delta <= 0) {
    // Handle empty data, single point, or all same points
    interval = 10 // Use a default interval
    const dataValue =
      seriesData.length > 0 ? seriesData[0] : (dataMax + dataMin) / 2 // Use midpoint for default range [0, 50] -> 25
    axisMin = Math.floor(dataValue / interval) * interval
    axisMax = Math.ceil(dataValue / interval) * interval
    // Ensure there is a range if min/max calculation yields the same value
    if (axisMin === axisMax) {
      axisMin = axisMin - interval / 2
      axisMax = axisMax + interval / 2
    }
    // Handle case where default data is [0,0] -> min=0, max=0 -> delta=0, interval=10, dataValue=0, axisMin=0, axisMax=0 -> axisMin=-5, axisMax=5
  } else {
    // Calculate interval to be roughly 1/3rd of the data range, rounded up
    interval = Math.ceil(delta / 3)

    // Calculate axis min/max, rounding to the nearest interval step
    axisMin = Math.floor(dataMin / interval) * interval
    axisMax = Math.ceil(dataMax / interval) * interval

    // Ensure axisMax is strictly greater than axisMin
    if (axisMax <= axisMin) {
      // This might happen with very small deltas or floating point inaccuracies
      axisMax = axisMin + interval // Ensure at least one interval step difference
    }
  }

  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '10',
      right: '10',
      top: '10',
      bottom: '10',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      show: false, // Keep X-axis hidden
    },
    yAxis: {
      type: 'value',
      min: axisMin,
      max: axisMax,
      interval: interval, // Use the calculated interval
      splitLine: { show: false },
      axisLabel: {
        color: '#A0A0A0',
        inside: false,
        margin: 5,
        formatter: (value: number) => `${value} ${unit}`,
      },
    },
    series: [
      {
        name: seriesName,
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: seriesData,
        lineStyle: {
          color: '#008080', // Teal color
          width: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(0, 128, 128, 0.4)', // Lighter Teal at the top
            },
            {
              offset: 1,
              color: 'rgba(210, 230, 230, 0.1)', // Fading at the bottom
            },
          ]),
        },
        emphasis: {
          focus: 'series',
          lineStyle: {
            width: 3,
          },
        },
      },
    ],
  }
})
</script>

<style scoped>
/* Ensure chart fills container */
.echarts {
  width: 100%;
  height: 100%;
}
</style>
