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
        :drawerOpenFromLocationList="drawerOpenFromLocationList"
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
          )
            template(#slot:tooltip-trigger)
              div(
                class="w-7.5 h-7.5 hover:bg-primary-400/10 hover:text-primary-400 flex justify-center items-center rounded-full"
              )
                f-svg-icon(iconName="more_horiz" size="24")
        template(#content="{ collapsePopper }")
          f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
      f-button(
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
              p(class="col-span-3") Frontier No
              div(class="col-span-8 grid gap-y-2") 
                p(v-if="material.faceSide?.frontierNo") {{ material.faceSide?.frontierNo }}
                p(v-if="material.backSide?.frontierNo") {{ material.backSide?.frontierNo }}
            div(class="text-body2 text-grey-900 grid grid-cols-11")
              p(class="col-span-3") Last Modified
              p(v-if="material.metaData.updateDate" class="col-span-8") {{ toStandardFormat(material.metaData.updateDate) }}
          div(v-if="material.internalInfo" class="rounded-md bg-grey-50 p-7.5")
            h6(class="text-h6 font-bold text-grey-600") {{ $t('RR0289') }}
            div(class="pt-7.5 grid gap-y-8")
              div(class="grid gap-y-3")
                div(class="text-body2 text-grey-900 grid grid-cols-11")
                  p(class="col-span-3") Created By
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
                  p(class="col-span-3") Last Modified By
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
                    p(class="col-span-3") Copied From
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
                    p(class="col-span-3") Material reference
                    p(class="col-span-8") {{ material.internalInfo.metaData.copiedFromInfo.copiedFromItemNo }}
        template(v-if="currentTab === TAB.TAGS")
          //- External
          div(class="grid gap-y-7")
            div
              div(class="flex items-center gap-x-1 pb-3")
                p(class="text-body2 font-bold text-grey-900") Keyword Tags
                f-tooltip-standard(
                  :tooltipMessage="'AI determines the Material structure and automatically generates a light green tags.'"
                )
                  template(#slot:tooltip-trigger)
                    f-svg-icon(iconName="info_outline" size="14")
              div(class="flex flex-wrap gap-x-2 gap-y-3")
                f-tag(v-for="tag in material.tagInfo.tagList" lg :key="tag") {{ tag }}
                div(
                  v-for="tag in material.tagInfo.aiTagList"
                  class="px-3.5 py-2.5 rounded bg-primary-50 text-body2 text-grey-900"
                  :key="tag"
                ) {{ tag }}
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
              v-for="(property, key) in getPriceInfo(material.priceInfo)"
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
                  v-for="(property, key) in getPriceInfo(material.internalInfo?.priceInfo ?? null)"
                  :key="key"
                  class="text-body2 text-grey-900 grid grid-cols-11"
                )
                  p(class="col-span-3") {{ property.name }}
                  p(class="col-span-8") {{ property.value }}
        template(v-else-if="currentTab === TAB.INVENTORY")
          div(class="text-body2 text-grey-900 grid grid-cols-12")
            p(class="col-span-4") {{ t('RR0034') }}
            p(class="col-span-8") {{ material.inventoryTotalQtyInYard }} Y
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
                p(class="text-body2 font-bold text-grey-900") Yardage Remaining & Location
                material-detail-inventory-table(
                  :headerList="yardageRemaining.headerList"
                  :itemList="yardageRemaining.itemList"
                  classGridCols="grid-cols-7"
                )
        template(v-else-if="currentTab === TAB.ATTACHMENT")
          div(class="rounded-md bg-grey-50 p-7.5")
            h6(class="text-h6 font-bold text-grey-600") {{ $t('RR0289') }}
            div(class="pt-7.5 flex flex-wrap gap-5")
              material-file-item(
                v-for="(attachment, index) in material.internalInfo?.attachmentList"
                :key="`attachment-${index}`"
                :file="attachment"
                isReadOnly
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
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'
import MaterialDetailUpperContent from '@/components/common/material/detail/internal/MaterialDetailUpperContent.vue'
import MaterialDetailInventoryTable from '@/components/common/material/detail/internal/MaterialDetailInventoryTable.vue'
import MaterialDetailEnvironmentalIndicator from '@/components/common/material/detail/MaterialDetailEnvironmentalIndicator.vue'
import MaterialFileItem from '@/components/common/material/file/MaterialFileItem.vue'
import useStickerLocationList from '@/composables/useStickerLocationList'
import useAssets from '@/composables/useAssets'
import type { Material } from '@frontier/platform-web-sdk'
import type { MenuTree } from '@frontier/ui-component'
import { PLATFORM_LOCATION_TYPE } from '@/utils/constants'
import useMaterial from '@/composables/material/useMaterial'
import { toStandardFormat } from '@frontier/lib'

const props = defineProps<{
  material: Material
  locationList: {
    name: string
    goTo: () => void
  }[]
}>()

const { t } = useI18n()

const drawerOpenFromLocationList = useStickerLocationList(
  props.locationList.map((b) => b.name)
)

const {
  editMaterial,
  downloadU3m,
  cloneTo,
  addToWorkspace,
  createU3m,
  exportExcel,
  printQRCode,
  printA4Swatch,
  deleteMaterial,
} = useAssets()

const menuTree = computed<MenuTree>(() => {
  const optionList = [
    [editMaterial],
    [cloneTo, addToWorkspace],
    [createU3m, downloadU3m, exportExcel],
    [printQRCode, printA4Swatch],
    [deleteMaterial],
  ]

  return {
    blockList: optionList.map((block) => ({
      menuList: block.map((option) => ({
        title: option.name(props.material),
        clickHandler: () => option.func(props.material),
        disabled: option.disabled ? option.disabled(props.material) : false,
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
}
const tabList = computed(() => [
  {
    name: 'General Information',
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
    name: t('RR0136'),
    id: TAB.ATTACHMENT,
    disabled: props.material.internalInfo?.attachmentList?.length === 0,
  },
  {
    name: t('RR0219'),
    id: TAB.INDICATOR,
    icon: 'subscribe',
  },
])

const { getPriceInfo, hasScannedImage } = useMaterial(ref(props.material))

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
        (inventory) => ({
          source: inventory.source,
          qtyInPcs: inventory.qtyInPcs,
          shelf: `${inventory.shelf1} ${inventory.shelf2}`,
          location: inventory.location,
        })
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
        (inventory) => ({
          source: inventory.source,
          qtyInPcs: inventory.qtyInPcs,
          shelf: `${inventory.shelf1} ${inventory.shelf2}`,
          location: inventory.location,
        })
      ) ?? [],
  }
})

const yardageRemaining = computed(() => {
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
          qty: inventory.qty,
          shelf: `${inventory.shelf1} ${inventory.shelf2}`,
          location: inventory.location,
        })
      ) ?? [],
  }
})
</script>
