<template lang="pug">
div
  //- Header
  div(class="pt-10 pb-15 flex items-center justify-between")
    //- BreadCrumb
    global-breadcrumb-list(
      :breadcrumbList="locationList"
      @click:item="$event.goTo()"
      fontSize="text-h6"
    )
    //- Action Group
    div(class="flex items-center gap-x-4")
      digital-thread-entrance(
        :material="material"
        :drawerOpenFromLocationList="locationList.map((l) => l.name)"
      )
      f-tooltip-standard(:tooltipMessage="printA4Swatch.name()")
        template(#slot:tooltip-trigger)
          f-svg-icon(
            v-if="printA4Swatch.icon"
            :iconName="printA4Swatch.icon()"
            class="text-grey-600 hover:text-primary-400 cursor-pointer"
            size="24"
            @click="printA4Swatch.func(material)"
          )
      f-popper(class="cursor-pointer" placement="left-start")
        template(#trigger)
          f-tooltip-standard(
            :tooltipMessage="$t('RR0260')"
            boundaryReference="search-table-header"
            data-cy="material-detail-internal-moreOptions"
          )
            template(#slot:tooltip-trigger)
              div(
                class="w-7.5 h-7.5 hover:bg-primary-400/10 hover:text-primary-400 flex justify-center items-center rounded-full"
              )
                f-svg-icon(iconName="more_horiz" size="24")
        template(#content="{ collapsePopper }")
          f-contextual-menu(
            :menuTree="menuTree"
            @click:menu="collapsePopper"
            data-cy="f-contextual-menu"
          )
      f-tooltip-standard(
        :tooltipMessage="$t('RR0380')"
        :disabledTooltip="editable"
      )
        template(#slot:tooltip-trigger)
          f-button(
            :disabled="!editable"
            prependIcon="create"
            size="md"
            @click="editMaterial.func(material)"
          ) {{ $t('RR0054') }}
  //- Upper Content
  material-detail-upper-content(
    :material="material"
    :platformLocationType="PLATFORM_LOCATION_TYPE.INTERNAL"
  )
  //- Lower Content
  f-tabs(:tabList="tabList" keyField="id" class="pt-16")
    template(#default="{ currentTab }")
      div(class="pt-10 grid gap-y-10")
        template(v-if="currentTab === TAB.GENERAL")
          div(class="grid gap-y-5")
            div(class="text-body2 text-grey-900 grid grid-cols-11")
              p(class="col-span-3") {{ $t('RR0084') }}
              div(class="col-span-8 grid gap-y-2") 
                p(v-if="material.faceSide?.frontierNo") {{ material.faceSide?.frontierNo }}
                p(v-if="material.backSide?.frontierNo") {{ material.backSide?.frontierNo }}
            div(class="text-body2 text-grey-900 grid grid-cols-11")
              p(class="col-span-3") {{ $t('RR0310') }}
              p(v-if="material.metaData.updateDate" class="col-span-8") {{ toStandardFormat(material.metaData.updateDate) }}
          div(v-if="material.internalInfo" class="rounded-md bg-grey-50 p-7.5")
            h6(class="text-h6 font-bold text-grey-600") {{ $t('RR0289') }}
            div(class="pt-7.5 grid gap-y-8")
              div(class="grid gap-y-3")
                div(class="text-body2 text-grey-900 grid grid-cols-11")
                  p(class="col-span-3") {{ $t('RR0188') }}
                  div(class="col-span-8 flex items-center gap-x-3")
                    f-avatar(
                      :imageUrl="material.internalInfo.metaData.createdByInfo.avatar"
                      type="user"
                      :labelColor="material.internalInfo.metaData.createdByInfo.unitLabelColor"
                      size="sm"
                      :hasBorder="false"
                    )
                    div
                      p(class="text-body2 text-grey-900 pb-1") {{ material.internalInfo.metaData.createdByInfo.userName }}
                      p(class="text-caption text-grey-600") {{ material.internalInfo.metaData.createdByInfo.unitName }}・{{ toStandardFormat(material.internalInfo.metaData.createdByInfo.date) }}
                div(
                  v-if="material.internalInfo.metaData.lastModifiedByInfo"
                  class="text-body2 text-grey-900 grid grid-cols-11"
                )
                  p(class="col-span-3") {{ $t('RR0310') }}
                  div(class="col-span-8 flex items-center gap-x-3")
                    f-avatar(
                      :imageUrl="material.internalInfo.metaData.lastModifiedByInfo.avatar"
                      type="user"
                      :labelColor="material.internalInfo.metaData.lastModifiedByInfo.unitLabelColor"
                      size="sm"
                      :hasBorder="false"
                    )
                    div
                      p(class="text-body2 text-grey-900 pb-1") {{ material.internalInfo.metaData.lastModifiedByInfo.userName }}
                      p(class="text-caption text-grey-600") {{ material.internalInfo.metaData.lastModifiedByInfo.unitName }}・{{ toStandardFormat(material.internalInfo.metaData.lastModifiedByInfo.date) }}
              template(v-if="material.internalInfo.metaData.copiedFromInfo")
                div(class="w-full h-px bg-grey-150")
                div(class="grid gap-y-3")
                  div(class="text-body2 text-grey-900 grid grid-cols-11")
                    p(class="col-span-3") {{ $t('MI0118') }}
                    div(class="col-span-8 flex items-center gap-x-3")
                      f-avatar(
                        :imageUrl="material.internalInfo.metaData.copiedFromInfo.orgLogo"
                        type="user"
                        size="sm"
                        :hasBorder="false"
                      )
                      p
                        span(class="text-body2 text-grey-900") {{ material.internalInfo.metaData.copiedFromInfo.orgName }}・
                        span(class="text-caption text-grey-600") {{ toStandardFormat(material.internalInfo.metaData.copiedFromInfo.date) }}
                  div(class="text-body2 text-grey-900 grid grid-cols-11")
                    p(class="col-span-3") {{ $t('MI0119') }}
                    p(class="col-span-8") {{ material.internalInfo.metaData.copiedFromInfo.copiedFromItemNo }}
        template(v-if="currentTab === TAB.TAGS")
          //- External
          div(class="grid gap-y-7")
            div
              div(class="flex items-center gap-x-1 pb-3")
                p(class="text-body2 font-bold text-grey-900") {{ $t('MI0132') }}
              div(class="flex flex-wrap gap-x-2 gap-y-3")
                f-tag(v-for="tag in material.tagInfo.tagList" lg :key="tag") {{ tag }}
            div
              p(class="pb-3 text-body2 font-bold text-grey-900") {{ $t('EE0129') }}
              div(class="flex flex-wrap gap-x-2 gap-y-3")
                f-tag(
                  v-for="tag in material.tagInfo.certificationTagList"
                  :key="tag.certificateId"
                ) {{ tag.name }}
          //- Internal
          div(class="rounded-md bg-grey-50 p-7.5")
            h6(class="text-h6 font-bold text-grey-600") {{ $t('RR0289') }}
            div(class="pt-7.5")
              p(class="pb-3 text-body2 font-bold text-grey-900") {{ $t('RR0028') }}
              div(class="flex flex-wrap gap-x-2 gap-y-3")
                f-tag(v-for="tag in material.internalInfo?.tagList" :key="tag") {{ tag }}
            div(class="pt-15")
              p(class="pb-3 text-body2 font-bold text-grey-900") {{ $t('RR0029') }}
              p(class="text-body2 text-grey-900 leading-1.6") {{ material.internalInfo?.remark }}
        template(v-else-if="currentTab === TAB.PRICING")
          //- External
          div(class="grid gap-y-5")
            div(
              v-for="(property, key) in materialInfoForDisplay.priceInfo(material.priceInfo)"
              :key="key"
              class="text-body2 text-grey-900 grid grid-cols-11"
            )
              p(class="col-span-3") {{ property.name }}
              p(class="col-span-8") {{ property.value }}
          //- Internal
          div(class="rounded-md bg-grey-50 p-7.5")
            h6(class="text-h6 font-bold text-grey-600") {{ $t('RR0289') }}
            div(class="pt-7.5")
              div(class="grid gap-y-5")
                div(
                  v-for="(property, key) in materialInfoForDisplay.priceInfo(material.internalInfo?.priceInfo ?? null)"
                  :key="key"
                  class="text-body2 text-grey-900 grid grid-cols-11"
                )
                  p(class="col-span-3") {{ property.name }}
                  p(class="col-span-8") {{ property.value }}
        template(v-else-if="currentTab === TAB.INVENTORY")
          div(class="text-body2 text-grey-900 grid grid-cols-12")
            p(class="col-span-4") {{ t('RR0034') }}
            p(class="col-span-8") {{ material.inventoryTotalQtyInYard }} {{ material.inventoryUnit }}
          div(class="rounded-md bg-grey-50 p-7.5")
            h6(class="text-h6 font-bold text-grey-600") {{ $t('RR0289') }}
            div(class="grid gap-y-15 pt-7.5")
              //- Native Code
              div(class="text-body2 text-grey-900 grid grid-cols-12")
                p(class="col-span-4") {{ t('RR0030') }}
                p(class="col-span-8") {{ material.internalInfo?.nativeCode }}
              //- Sample Card Remaining
              div(class="grid gap-y-5")
                p(class="text-body2 font-bold text-grey-900") {{ $t('RR0031') }}
                material-detail-inventory-table(
                  :headerList="sampleCardsRemaining.headerList"
                  :itemList="sampleCardsRemaining.itemList"
                  classGridCols="grid-cols-4"
                )
              //-Hanger Remaining
              div(class="grid gap-y-5")
                p(class="text-body2 font-bold text-grey-900") {{ $t('RR0033') }}
                material-detail-inventory-table(
                  :headerList="hangersRemaining.headerList"
                  :itemList="hangersRemaining.itemList"
                  classGridCols="grid-cols-4"
                )
              //-Yardage Remaining & Location
              div(class="grid gap-y-5")
                p(class="text-body2 font-bold text-grey-900") {{ $t('RR0296') }}
                material-detail-inventory-table(
                  :headerList="yardageRemaining.headerList"
                  :itemList="yardageRemaining.itemList"
                  classGridCols="grid-cols-7"
                )
        template(v-else-if="currentTab === TAB.ATTACHMENT")
          div(class="pt-7.5 flex flex-wrap gap-5")
            material-file-card(
              v-for="(attachment, index) in multimediaList"
              :key="attachment.fileId"
              :thumbnailUrl="attachment.thumbnailUrl"
              :originalUrl="attachment.originalUrl"
              :extension="attachment.extension"
              :displayFileName="attachment.displayFileName"
              :menuTree="getMultimediaMenuTree(attachment.fileId)"
              @click="openAttachmentExternalViewMode(index)"
            )
          div(class="rounded-md bg-grey-50 p-7.5")
            h6(class="text-h6 font-bold text-grey-600") {{ $t('RR0289') }}
            div(class="pt-7.5 flex flex-wrap gap-5")
              material-file-card(
                v-for="(attachment, index) in material.internalInfo?.attachmentList"
                :key="attachment.fileId"
                :thumbnailUrl="attachment.thumbnailUrl"
                :originalUrl="attachment.originalUrl"
                :extension="attachment.extension"
                :displayFileName="attachment.displayFileName"
                :menuTree="getAttachmentMenuTree(attachment.fileId)"
                @click="openAttachmentViewMode(index)"
              )
        template(v-else-if="currentTab === TAB.INDICATOR")
          div(class="-mt-10")
            div(
              v-if="!hasScannedImage || !material.metaData.isComplete || material.tagInfo.certificationTagList.length === 0"
              class="h-15 bg-grey-50 flex items-center mt-6 pl-4 gap-x-8"
            )
              div(class="flex items-center")
                f-svg-icon(iconName="info_outline" size="20" class="text-grey-600")
                p(
                  v-if="!hasScannedImage || !material.metaData.isComplete"
                  class="pl-3 text-grey-600 text-caption leading-1.6"
                ) {{ $t('EE0126') }}
                p(
                  v-else-if="material.tagInfo.certificationTagList.length === 0"
                  class="pl-3 text-grey-600 text-caption leading-1.6"
                ) {{ $t('EE0128') }}
              div(
                class="flex items-center cursor-pointer"
                @click="editMaterial.func(material)"
              )
                p(class="pr-1.5 text-cyan-400 text-caption leading-1.6") {{ $t('EE0127') }}
                f-svg-icon(iconName="arrow_forward" size="16" class="text-cyan-400")
            material-detail-environmental-indicator(class="mt-3" :material="material")
        template(v-else-if="currentTab === TAB.STARTRUST")
          div(class="w-[920px] flex flex-col gap-10 items-start justify-start")
            //- call-to-action-card(
            //-   :title="$t('RR0459')"
            //-   :description="$t('RR0460')"
            //-   :explainText="$t('RR0453')"
            //-   :actionText="$t('UU0064')"
            //-   @explain="() => {}"
            //-   @action="() => {}"
            //- )

            //- Show if isActive
            call-to-action-card(
              v-if="!isActive"
              :title="$t('RR0459')"
              :description="$t('RR0460')"
              :explainText="$t('RR0453')"
              :actionText="$t('UU0064')"
              @explain="onShowGuide"
              @action="onUpgrade"
            )

            //- show if isActive but no data in StarTrust
            carbon-footprint-summary-card(
              v-if="isActive && !isCarbonFootprintData"
              :title="$t('RR0461')"
              :description="$t('RR0457')"
              :explainText="$t('RR0453')"
              :actionText="$t('RR0054')"
              @explain="onShowGuide"
              @action="redirectToStarTrust"
            )

            //- show if isActive and processing
            carbon-footprint-summary-card(
              v-if="isActive && isProcessingCarbonFootprintData"
              :title="$t('RR0461')"
              :description="$t('RR0458')"
              :explainText="$t('RR0453')"
              :actionText="$t('RR0054')"
              @explain="onShowGuide"
              @action="redirectToStarTrust"
              :data="carbonFootprintPendingData"
            )

            //- show if isActive and data is completed
            carbon-footprint-summary-card(
              v-if="isActive && isCarbonFootprintData"
              :title="$t('RR0461')"
              :description="$t('RR0066') + '•' + formattedDate"
              :explainText="$t('RR0453')"
              :actionText="$t('RR0054')"
              @explain="onShowGuide"
              @action="redirectToStarTrust"
              :data="carbonFootprintData"
            )
            //- Temporarily hidden pending sales strategy decision
            //- quota-exceeded-alert(
            //-   v-if="maxQuota > 0 && quotaUsed >= maxQuota"
            //-   :title="$t('RR0462')"
            //-   :description="$t('RR0463', { quota: maxQuota - quotaUsed, maxQuota: maxQuota })"
            //-   :actionText="$t('UU0078')"
            //-   @action="() => {}"
            //- )

            //- Temporarily hidden Carbon Footprint Chart until further notice
            //- div(class="flex justify-start")
            //-   v-chart(class="chart-container flex justify-start" :option="chartOption")
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'
import MaterialDetailUpperContent from '@/components/common/material/detail/internal/MaterialDetailUpperContent.vue'
import MaterialDetailInventoryTable from '@/components/common/material/detail/internal/MaterialDetailInventoryTable.vue'
import MaterialDetailEnvironmentalIndicator from '@/components/common/material/detail/MaterialDetailEnvironmentalIndicator.vue'
import MaterialFileCard from '@/components/common/material/file/MaterialFileCard.vue'
import useAssets from '@/composables/useAssets'
import {
  GetAssetsMaterialCarbonFootprint200ResponseAllOfResultFootprintDataStatusIdEnum,
  type Material,
  type MaterialInternalInventoryInfoSampleCardsRemainingListInner,
  type MaterialInternalInventoryInfoYardageRemainingInfoListInner,
} from '@frontier/platform-web-sdk'
import type { MenuTree } from '@frontier/ui-component'
import {
  PLATFORM_LOCATION_TYPE,
  useConstants,
  VALUE_ADDED_SERVICE_STATUS,
} from '@/utils/constants'
import useMaterial from '@/composables/material/useMaterial'
import { toStandardFormat } from '@frontier/lib'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import useAttachmentUpdate from '@/composables/material/useAttachmentUpdate'
import useMultimediaUpdate from '@/composables/material/useMultimediaUpdate'
import CallToActionCard from './carbonFootprintCalculator/CallToActionCard.vue'
import CarbonFootprintSummaryCard from './carbonFootprintCalculator/CarbonFootprintSummaryCard.vue'
import QuotaExceededAlert from './carbonFootprintCalculator/QuotaExceededAlert.vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import useNavigation from '@/composables/useNavigation'
import assetsApi from '@/apis/assets'

const props = defineProps<{
  material: Material
  locationList: {
    name: string
    goTo: () => void
  }[]
}>()

const { t } = useI18n()
const store = useStore()
const route = useRoute()

const {
  editMaterial,
  downloadU3m,
  cloneTo,
  addToWorkspace,
  createU3m,
  // exportExcel,
  printLabel,
  printA4Swatch,
  deleteMaterial,
} = useAssets()

const { attachmentViewModeList, hasScannedImage } = useMaterial(
  ref(props.material)
)

const attachmentUpdateService = useAttachmentUpdate(ref(props.material))
const multimediaUpdateService = useMultimediaUpdate(
  ref(props.material),
  () => {}
)

const { getAttachmentMenuTree } = attachmentUpdateService
const { getMultimediaMenuTree, multimediaList } = multimediaUpdateService

const openAttachmentViewMode = (index: number) => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: index,
        fileList: attachmentViewModeList,
      },
    },
  })
}

const multimediaViewModeFileList = computed(() =>
  multimediaList.value.map((m) => ({
    id: m.fileId,
    originalUrl: m.originalUrl,
    displayUrl: m.originalUrl,
    thumbnailUrl: m.thumbnailUrl,
    displayName: m.displayFileName,
    extension: m.extension,
  }))
)

const openAttachmentExternalViewMode = (index: number) => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: index,
        fileList: multimediaViewModeFileList,
      },
    },
  })
}

const menuTree = computed<MenuTree>(() => {
  const optionList = [
    [editMaterial],
    [cloneTo, addToWorkspace],
    // [createU3m, downloadU3m, exportExcel],
    [createU3m, downloadU3m],
    [printLabel, printA4Swatch],
    [deleteMaterial],
  ]
  // & symbol is used as an intersection type operator to combine multiple types into one that includes all properties from the constituent types.
  const material: Material & { routerBackNodeId?: number } = props.material
  material.routerBackNodeId = Number(route.query.preLayerNodeId) || undefined
  return {
    blockList: optionList.map((block) => ({
      menuList: block.map((option) => ({
        title: option.name(props.material),
        clickHandler: () => option.func(material),
        disabled: option.disabled ? option.disabled(props.material) : false,
        testId: option.testId,
      })),
    })),
  }
})

const TAB = {
  GENERAL: 0,
  TAGS: 1,
  PRICING: 2,
  INVENTORY: 3,
  ATTACHMENT: 4,
  INDICATOR: 5,
  STARTRUST: 6,
}
const tabList = computed(() => [
  {
    name: t('MI0117'),
    id: TAB.GENERAL,
  },
  {
    name: t('RR0133'),
    id: TAB.TAGS,
  },
  {
    name: t('RR0134'),
    id: TAB.PRICING,
  },
  {
    name: t('RR0135'),
    id: TAB.INVENTORY,
  },
  {
    name: t('RR0298'),
    id: TAB.ATTACHMENT,
  },
  {
    name: t('RR0219'),
    id: TAB.INDICATOR,
    icon: 'subscribe',
  },
  {
    name: 'Carbon footprint calculator',
    id: TAB.STARTRUST,
    new: true,
  },
])

const sampleCardsRemaining = computed(() => {
  return {
    headerList: [
      {
        prop: 'source',
        label: 'Source',
      },
      {
        prop: 'qtyInPcs',
        label: 'Quantity',
      },
      {
        prop: 'shelf',
        label: 'Shelf',
      },
      {
        prop: 'location',
        label: 'Location',
      },
    ],
    itemList:
      props.material.internalInfo?.inventoryInfo.sampleCardsRemainingList?.map(
        (inventory) => inventoryToItem(inventory)
      ) ?? [],
  }
})
const hangersRemaining = computed(() => {
  return {
    headerList: [
      {
        prop: 'source',
        label: 'Source',
      },
      {
        prop: 'qtyInPcs',
        label: 'Quantity',
      },
      {
        prop: 'shelf',
        label: 'Shelf',
      },
      {
        prop: 'location',
        label: 'Location',
      },
    ],
    itemList:
      props.material.internalInfo?.inventoryInfo.hangersRemainingList?.map(
        (inventory) => inventoryToItem(inventory)
      ) ?? [],
  }
})

const yardageRemaining = computed(() => {
  const unit =
    props.material.internalInfo?.inventoryInfo.yardageRemainingInfo?.unit
  return {
    headerList: [
      {
        prop: 'productionNo',
        label: 'Production#',
      },
      {
        prop: 'source',
        label: 'Source',
      },
      {
        prop: 'roll',
        label: 'Roll#',
      },
      {
        prop: 'lot',
        label: 'Lot#',
      },
      {
        prop: 'qty',
        label: 'Quantity',
      },
      {
        prop: 'shelf',
        label: 'Shelf',
      },
      {
        prop: 'location',
        label: 'Location',
      },
    ],
    itemList:
      props.material.internalInfo?.inventoryInfo.yardageRemainingInfo?.list?.map(
        (inventory) => ({
          productionNo: inventory.productionNo,
          source: inventory.source,
          roll: inventory.roll,
          lot: inventory.lot,
          qty: inventory.qty ? `${inventory.qty} ${unit}` : '',
          shelf: shelfTrimString(inventory),
          location: inventory.location,
        })
      ) ?? [],
  }
})

const shelfTrimString = (
  inventory:
    | MaterialInternalInventoryInfoYardageRemainingInfoListInner
    | MaterialInternalInventoryInfoSampleCardsRemainingListInner
) => `${inventory.shelf1 ?? ''} ${inventory.shelf2 ?? ''}`.trim()

const inventoryToItem = (
  inventory: MaterialInternalInventoryInfoSampleCardsRemainingListInner
) => {
  return {
    source: inventory.source,
    qtyInPcs: inventory.qtyInPcs ? `${inventory.qtyInPcs} ${t('RR0307')}` : '',
    shelf: shelfTrimString(inventory),
    location: inventory.location,
  }
}

const editable = computed(() => {
  if (!props.material.metaData.isProcessingComplete) {
    return false
  }
  return true
})

const carbonFootprintPendingData = computed(() => {
  return {
    rawMaterial: 'pending',
    process: 'pending',
    distribution: 'pending',
    usage: 'pending',
    disposal: 'pending',
    total: 'pending',
  }
})

const formattedDate = computed(() => {
  const date = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  const time = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())

  return `${date} at ${time}`
})

use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const chartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    orient: 'vertical',
    right: '24px',
    bottom: '56px',
    itemWidth: 24,
    itemHeight: 12,
    itemGap: 12,
    data: [
      {
        name: 'Disposal',
      },
      {
        name: 'Usage',
      },
      {
        name: 'Distribution',
      },
      {
        name: 'Production',
      },
      {
        name: 'Raw Material',
      },
    ],
  },
  grid: {
    left: '24px',
    right: 24 + 112 + 12, // Adjust right margin to make space for the legend
    bottom: '10%', // Adjust bottom margin to make space for the legend
    containLabel: true,
  },
  xAxis: {
    type: 'category', // Categories on the x-axis for vertical bars
    data: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ], // 12 months
  },
  yAxis: {
    type: 'value', // Values on the y-axis for vertical bars
  },
  series: [
    {
      name: 'Raw Material',
      type: 'bar',
      stack: 'total',
      emphasis: {
        focus: 'series',
      },
      data: [
        820, 832, 901, 934, 1290, 1330, 1320, 1280, 1300, 1350, 1380, 1400,
      ],
    },
    {
      name: 'Production',
      type: 'bar',
      stack: 'total',
      emphasis: {
        focus: 'series',
      },
      data: [150, 212, 201, 154, 190, 330, 410, 320, 340, 360, 380, 400],
    },
    {
      name: 'Distribution',
      type: 'bar',
      stack: 'total',
      emphasis: {
        focus: 'series',
      },
      data: [220, 182, 191, 234, 290, 330, 310, 300, 320, 340, 360, 380],
    },
    {
      name: 'Usage',
      type: 'bar',
      stack: 'total',
      emphasis: {
        focus: 'series',
      },
      data: [120, 132, 101, 134, 90, 230, 210, 190, 200, 210, 230, 250],
    },
    {
      name: 'Disposal',
      type: 'bar',
      stack: 'total',
      emphasis: {
        focus: 'series',
      },
      data: [320, 302, 301, 334, 390, 330, 320, 290, 310, 330, 350, 380],
    },
  ],
})

// StarTrust Carbon Footprint Calculator
const valueAddedService = computed(
  () => store.getters['polling/valueAddedService']
)
const {
  maxQuota = 0,
  quotaUsed = 0,
  status,
} = valueAddedService.value.starTrust || {}

const isActive = computed(
  () => status.id === VALUE_ADDED_SERVICE_STATUS.ACTIVATE
)

const orgId = computed<number>(() => store.getters['organization/orgId'])
const { ogId, ogType } = useNavigation()
const materialId = props.material.materialId
const itemNo = props.material.itemNo
const starTrustUrl = 'https://sustainability.frontier.cool/14067'
const startTrustToken = ref('')
const isCarbonFootprintData = ref(false)
const isProcessingCarbonFootprintData = ref(false)
const distribution = ref(0)
const total = ref(0)
const process = ref(0)
const rawMaterial = ref(0)
const NUMBER_OF_DECIMAL_PLACES = 2
const parseAndFormatNumber = (value: string) => {
  return Number(parseFloat(value).toFixed(NUMBER_OF_DECIMAL_PLACES))
}

onMounted(async () => {
  try {
    const response = await assetsApi.getAssetsMaterialCarbonFootprint({
      materialId: materialId,
      ogType: ogType.value,
      ogId: ogId.value,
      orgId: orgId.value,
    })

    const { data } = response

    const { stToken } = data.result
    const {
      status,
      co2DistributionStage,
      co2ProcessStage,
      co2RawMaterialStage,
    } = data.result.footprintData

    startTrustToken.value = stToken ?? ''
    isCarbonFootprintData.value =
      status.id ===
        GetAssetsMaterialCarbonFootprint200ResponseAllOfResultFootprintDataStatusIdEnum.Complete ??
      false
    isProcessingCarbonFootprintData.value =
      status.id ===
        GetAssetsMaterialCarbonFootprint200ResponseAllOfResultFootprintDataStatusIdEnum.InProgress ??
      false
    distribution.value = parseAndFormatNumber(co2DistributionStage) ?? 0
    process.value = parseAndFormatNumber(co2ProcessStage) ?? 0
    rawMaterial.value = parseAndFormatNumber(co2RawMaterialStage) ?? 0
    total.value = distribution.value + process.value + rawMaterial.value
  } catch (error) {
    console.error('API call failed:', error)
  }
})

const carbonFootprintData = computed(() => {
  return {
    rawMaterial: rawMaterial.value,
    process: process.value,
    distribution: distribution.value,
    total: total.value,
    usage: NaN,
    disposal: NaN,
  }
})

const redirectUrl = computed(() => {
  return `${starTrustUrl}/re?token=${startTrustToken.value}&orgId=${ogType.value}-${orgId.value}&materialId=${materialId}&itemNo=${itemNo}`
})

const redirectToStarTrust = () => {
  window.open(redirectUrl.value, '_blank')
}

const router = useRouter()
const onShowGuide = () => {
  router.push({
    name: 'Billings', // Assuming 'Billings' is the name of the route for the billing page
    params: { tab: 'value-added-service' }, // Specify the tab you want to navigate to
    query: { scroll_to: 'cfc-guide' }, // Add any additional query parameters if needed
  })
}

const { FEEDBACK_CATEGORY } = useConstants()
const onUpgrade = () => {
  const properties = isActive.value
    ? undefined
    : {
        title: t('UU0064'),
        category: FEEDBACK_CATEGORY.value.PAYMENT.value,
      }
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
    properties,
  })
}
</script>

<style scoped>
.chart-container {
  width: 685px;
  height: 544px; /* Adjust the height as needed */
  margin: 0 auto; /* Center the chart horizontally */
  border-radius: 12px;
  @apply border border-grey-200-v1;
}
</style>
