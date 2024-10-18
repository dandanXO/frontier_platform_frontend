<template lang="pug">
div(class="px-6 pt-6.5 h-full flex flex-col") 
  div(class="h-11 flex justify-between items-center")
    div(class="text-h6 font-bold text-grey-900 pl-1.5") {{ $t('BB0138') }}
    dropdown-og-menu(@select="goToDashboard({ ogKey: $event })")
  div(
    ref="refContainer"
    :style="{ width: containerWidth + PADDING_X_FOR_SHADOW + 'px' }"
    class="my-5"
    :class="{ 'mx-auto': containerWidth === 1140 }"
  )
    div(
      v-if="isLoading"
      class="w-full flex justify-center items-center"
      data-cy="loading-indicator"
    )
      f-svg-icon(iconName="loading" size="92" class="text-primary-400")
    template(v-else)
      div(:style="{ padding: `0 ${PADDING_X_FOR_SHADOW / 2}px` }")
        f-infobar(:messageText="$t('BB0115')")
      div(
        :style="{ width: containerWidth + 'px', padding: `0 ${PADDING_X_FOR_SHADOW / 2}px` }"
        class="flex flex-col gap-y-5 mt-5 overflow-x-auto overflow-y-hidden hide-scrollbar"
        :class="{ '!w-287.5': containerWidth === 1140 }"
      )
        div(class="w-285 h-40 pt-5 pb-9 border border-grey-100 rounded shadow-4")
          p(class="text-body1 font-bold text-grey-900 pl-5 pb-6") {{ $t('RR0246') }}
          div(class="flex items-center justify-center gap-x-15")
            div(
              v-for="item in createCountsItemList"
              :key="item.name"
              class="flex items-center gap-x-5"
            )
              f-svg-icon(:iconName="item.icon" size="64" class="text-grey-600")
              div
                p(class="text-body2 text-grey-600") {{ item.name }}
                p(class="flex items-end")
                  span(class="text-h1 font-bold text-primary-400") {{ item.amount }}
                  span(
                    v-if="item.isOverflow"
                    class="text-h4 font-bold text-primary-400"
                  ) +
                  span(class="text-caption/1.6 text-grey-600 pl-1") {{ item.unit }}
        div(class="w-285 flex items-center gap-x-5")
          div(
            class="min-w-91.5 h-80 bg-grey-0 py-5 border border-grey-100 rounded shadow-4"
          )
            v-chart(class="w-full h-69.5" :option="textureOption")
          div(
            class="min-w-188.5 h-80 bg-grey-0 py-5 border border-grey-100 rounded shadow-4 relative"
          )
            div(class="absolute z-1 right-5 top-5 flex items-center gap-x-4")
              f-button-label(
                :active="keywordDate === KEYWORD_DATE.LAST_MONTH"
                @click="keywordDate = KEYWORD_DATE.LAST_MONTH"
              ) {{ t('BB0126') }}
              f-button-label(
                :active="keywordDate === KEYWORD_DATE.LAST_3_MONTH"
                @click="keywordDate = KEYWORD_DATE.LAST_3_MONTH"
              ) {{ t('BB0127') }}
            v-chart(class="w-full h-69.5" :option="keywordOption")
        div(
          class="w-285 h-80 bg-grey-0 pt-4 border border-grey-100 rounded shadow-4 mb-2.5"
        )
          div(class="px-5 flex items-center justify-between")
            p(class="text-body1 font-bold text-grey-900") {{ t('BB0130') }}
            div(class="flex items-center gap-x-4")
              div(class="flex items-center gap-x-4")
                div(
                  v-for="(type, key) in ecoTypeList"
                  :key="key"
                  class="flex items-center gap-x-2"
                )
                  f-svg-icon(:iconName="type.icon" size="24" class="text-grey-900")
                  f-button-label(
                    :active="ecoType === key"
                    @click="ecoType = key"
                  ) {{ type.name }} ({{ type.unit }})
              div(class="w-px h-[15px] bg-grey-400")
              f-tooltip-standard(
                :tooltipMessage="$t('BB0137')"
                :disabledTooltip="hasSubscribedMade2flow"
              )
                template(#slot:tooltip-trigger)
                  f-input-switch(
                    iconSize="30"
                    :label="t('BB0134')"
                    v-model:inputValue="isShowAssetsStatus"
                    :disabled="!hasSubscribedMade2flow"
                  )
          v-chart(class="w-full" :option="ecoOption")
</template>

<script setup lang="ts">
import { use, graphic } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, ScatterChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useDashboardStore } from '@/stores/dashboard'
import { storeToRefs } from 'pinia'
import colors from '@frontier/tailwindcss/colors'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import DropdownOgMenu from '@/components/common/DropdownOgMenu.vue'

const { t } = useI18n()
const store = useStore()
const { goToDashboard } = useNavigation()

const dashboard = useDashboardStore()
const {
  createCounts,
  textureCounts,
  fabricKeywordCounts,
  ecoImpactorInformation,
} = storeToRefs(dashboard)

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const isLoading = ref(false)

const containerWidth = ref(0)
const refContainer = ref<HTMLElement>()
const PADDING_X_FOR_SHADOW = 10
const MAX_WIDTH = 1140

onMounted(async () => {
  const leftDis = refContainer.value!.getBoundingClientRect().left
  const getWidth = () => document.body.clientWidth - leftDis - 36 // 36 is padding-right
  containerWidth.value = getWidth() > MAX_WIDTH ? MAX_WIDTH : getWidth()
  window.addEventListener('resize', () => {
    containerWidth.value = getWidth() > MAX_WIDTH ? MAX_WIDTH : getWidth()
  })

  isLoading.value = true
  await dashboard.getDashboard()
  isLoading.value = false
})

const createCountsItemList = computed(() => {
  const isOverflow = (amount: number | undefined) => {
    if (!amount) {
      return false
    }

    return amount > 9999
  }
  const getAmount = (amount: number | undefined) => {
    if (!amount) {
      return 0
    }

    return isOverflow(amount) ? 9999 : amount
  }

  return [
    {
      name: t('BB0117'),
      icon: 'swatch_fabric',
      amount: getAmount(createCounts.value?.yourAssetCounts),
      isOverflow: isOverflow(createCounts.value?.yourAssetCounts),
      unit: t('BB0121'),
    },
    {
      name: t('BB0118'),
      icon: 'view_in_ar',
      amount: getAmount(createCounts.value?.threeDimensionAssetCounts),
      isOverflow: isOverflow(createCounts.value?.threeDimensionAssetCounts),
      unit: t('BB0121'),
    },
    {
      name: t('BB0119'),
      icon: 'folder_outline',
      amount: getAmount(createCounts.value?.collectionCounts),
      isOverflow: isOverflow(createCounts.value?.collectionCounts),
      unit: t('BB0122'),
    },
    {
      name: t('BB0120'),
      icon: 'folder_outline_share',
      amount: getAmount(createCounts.value?.sharedCollectionCounts),
      isOverflow: isOverflow(createCounts.value?.sharedCollectionCounts),
      unit: t('BB0123'),
    },
  ]
})

const getBarChartBaseOption = (
  titleText: string,
  legendData: string[],
  xAxisData: string[],
  xAxisLabelWidth: number,
  xAxisLabelOverflow: string
) => ({
  title: {
    text: titleText,
    left: 12,
    textStyle: {
      fontWeight: 700,
      fontSize: 16,
      color: colors.grey[900],
      fontFamily: 'Noto Sans TC',
    },
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    data: legendData,
    itemWidth: 10,
    itemHeight: 10,
    bottom: 0,
    left: 12,
  },
  grid: {
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: xAxisData,
    splitLine: {
      lineStyle: {
        color: colors.grey[150],
      },
    },
    axisLabel: {
      width: xAxisLabelWidth,
      interval: 0,
      overflow: xAxisLabelOverflow,
      fontSize: 12,
      color: colors.grey[600],
      margin: 12,
    },
    axisLine: {
      lineStyle: {
        color: colors.grey[150],
      },
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        color: colors.grey[150],
      },
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: colors.grey[150],
      },
    },
    axisLabel: {
      fontSize: 10,
      color: colors.grey[600],
    },
  },
})

const isPublicLibraryRestricted = computed(
  () =>
    store.getters['permission/isLittleKingRule'] ||
    store.getters['permission/isFabriSelectAccount']
)
const textureOption = computed(() => {
  if (!textureCounts.value) {
    return
  }

  const restrictedData = Object.assign(
    getBarChartBaseOption(
      t('BB0124'),
      [],
      textureCounts.value.map((data) =>
        data.name === 'NonWoven' ? 'Non Woven' : data.name
      ),
      54,
      'break'
    ),
    {
      series: [
        {
          name: t('BB0128'),
          type: 'bar',
          data: textureCounts.value.map((data) => data.internal),
          barWidth: 8,
          barGap: 0.4,
          color: colors.primary[400],
          itemStyle: {
            opacity: 0.7,
          },
        },
      ],
    }
  )

  const normalData = Object.assign(
    getBarChartBaseOption(
      t('BB0124'),
      [t('BB0128'), t('BB0129')],
      textureCounts.value.map((data) =>
        data.name === 'NonWoven' ? 'Non Woven' : data.name
      ),
      54,
      'break'
    ),
    {
      series: [
        {
          name: t('BB0128'),
          type: 'bar',
          data: textureCounts.value.map((data) => data.internal),
          barWidth: 8,
          barGap: 0.4,
          color: colors.primary[400],
          itemStyle: {
            opacity: 0.7,
          },
        },
        {
          name: t('BB0129'),
          type: 'bar',
          data: textureCounts.value.map((data) => data.all),
          barWidth: 8,
          barGap: 0.4,
          color: colors.primary[600],
          itemStyle: {
            opacity: 0.7,
          },
        },
      ],
    }
  )

  return isPublicLibraryRestricted.value ? restrictedData : normalData
})

enum KEYWORD_DATE {
  LAST_MONTH = 'lastMonth',
  LAST_3_MONTH = 'last3Month',
}
const keywordDate = ref<KEYWORD_DATE>(KEYWORD_DATE.LAST_MONTH)
const keywordOption = computed(() => {
  if (!fabricKeywordCounts.value) {
    return
  }

  const keywordColorList = [
    colors.primary[400],
    colors.cyan[400],
    colors.yellow[400],
    colors.red[300],
    colors.pink[400],
    colors.brown[400],
    colors.forestgreen[400],
    colors.peacock[400],
    colors.blue[400],
    colors.purple[400],
  ]
  return Object.assign(
    getBarChartBaseOption(
      t('BB0125'),
      fabricKeywordCounts.value[keywordDate.value].data.map(
        (data) => data.name
      ),
      fabricKeywordCounts.value[keywordDate.value].date,
      148,
      'none'
    ),
    {
      series: fabricKeywordCounts.value[keywordDate.value].data.map(
        (data, index) => ({
          name: data.name,
          type: 'bar',
          data: data.value,
          barWidth: 8,
          barGap: 0.4,
          color: keywordColorList[index],
          itemStyle: {
            opacity: 0.7,
          },
        })
      ),
    }
  )
})

const hasSubscribedMade2flow = computed(
  () => store.getters['polling/valueAddedService'].made2flow.planStatus.ACTIVATE
)
enum ECO_TYPE {
  GHG = 'ghg',
  WATER = 'water',
  LAND = 'land',
}
const ecoType = ref<ECO_TYPE>(ECO_TYPE.GHG)
const ecoTypeList = computed(() => ({
  [ECO_TYPE.GHG]: {
    name: t('BB0131'),
    icon: 'co2',
    unit: t('RR0276'),
  },
  [ECO_TYPE.WATER]: {
    name: t('BB0132'),
    icon: 'water',
    unit: t('RR0216'),
  },
  [ECO_TYPE.LAND]: {
    name: t('BB0133'),
    icon: 'land',
    unit: t('RR0218'),
  },
}))
const isShowAssetsStatus = ref(false)
const ecoOption = computed(() => {
  if (!ecoImpactorInformation.value) {
    return
  }

  return {
    title: {
      text: ecoTypeList.value[ecoType.value].name,
      top: 16,
      left: 64,
      textStyle: {
        fontSize: 14,
        fontWeight: 400,
        color: colors.grey[900],
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `
            ${params.data[0]}
            <br/>
            <p class="flex items-center justify-between">
              ${params.marker}
              <span class="font-bold">${params.data[1]}</span>
            </p>
          `
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ecoImpactorInformation.value.all[ecoType.value].map(
        (data) => data.name
      ),
      name: t('BB0136', {
        number:
          ecoImpactorInformation.value.internal?.[ecoType.value].length || 0,
      }),
      nameGap: 12,
      nameLocation: 'middle',
      nameTextStyle: {
        fontSize: 12,
        color: colors.grey[600],
      },
      axisLabel: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: colors.grey[150],
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: colors.grey[150],
        },
      },
      axisLabel: {
        color: colors.grey[600],
      },
    },
    series: [
      {
        type: 'scatter',
        z: 3, //  the default of line chart is 2, so set 3 to be larger than 2
        data:
          ecoImpactorInformation.value.internal?.[ecoType.value].map((data) => [
            data.name,
            data.value,
          ]) || [],
        symbol: isShowAssetsStatus.value ? 'circle' : 'none',
        symbolSize: 8,
        itemStyle: {
          color: colors.cyan[400],
          opacity: 0.8,
        },
      },
      {
        type: 'line',
        data: ecoImpactorInformation.value.all[ecoType.value].map(
          (data) => data.value
        ),
        lineStyle: {
          color: colors.primary[500],
        },
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(33, 177, 132, 0.7)',
            },
            {
              offset: 1,
              color: 'rgba(33, 177, 133, 0.07)',
            },
          ]),
        },
        smooth: true,
      },
    ],
  }
})
</script>
