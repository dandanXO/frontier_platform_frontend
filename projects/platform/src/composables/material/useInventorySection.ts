import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import {
  type Material,
  type MaterialInternalInventoryInfoSampleCardsRemainingListInner,
  type MaterialInternalInventoryInfoYardageRemainingInfoListInner,
} from '@frontier/platform-web-sdk'
import { FUNC_ID, PERMISSION_MAP } from '@/utils/constants'
import { type TabItem as Tab } from '@frontier/ui-component/src/FTabs/FTabs.vue'

export enum TAB_ID {
  PUBLIC = 0,
  PRIVATE = 1,
}

interface InventorySection {
  key: string
  labelKey: string
  icon: string
  headerList: {
    prop: string
    label: string
  }[]
  itemList: {
    source: string | null
    qtyInPcs?: string
    shelf: string
    location: string | null
  }[]
  classGridCols: string
}
const material = ref<Material>()

const useInventorySection = () => {
  const { t } = useI18n()
  const store = useStore()

  const roleId = computed(
    () => store.getters['organization/orgUser/orgUser'].roleID
  )
  const permissionList = PERMISSION_MAP[roleId.value]
  const setMaterial = (value: Material) => {
    material.value = value
  }

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
      qtyInPcs: inventory.qtyInPcs
        ? `${inventory.qtyInPcs} ${t('RR0307')}`
        : '',
      shelf: shelfTrimString(inventory),
      location: inventory.location,
    }
  }

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
        material.value?.internalInfo?.inventoryInfo.sampleCardsRemainingList?.map(
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
        material.value?.internalInfo?.inventoryInfo.hangersRemainingList?.map(
          (inventory) => inventoryToItem(inventory)
        ) ?? [],
    }
  })

  const yardageRemaining = computed(() => {
    const unit =
      material.value?.internalInfo?.inventoryInfo.yardageRemainingInfo?.unit
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
        material.value?.internalInfo?.inventoryInfo.yardageRemainingInfo?.list?.map(
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

  const inventorySections = computed<InventorySection[]>(() =>
    [
      {
        key: 'sampleCardsRemaining',
        labelKey: 'RR0031',
        icon: 'table_view',
        headerList: sampleCardsRemaining.value.headerList,
        itemList: sampleCardsRemaining.value.itemList,
        classGridCols: 'grid-cols-4',
      },
      {
        key: 'hangersRemaining',
        labelKey: 'RR0033',
        icon: 'table_view',
        headerList: hangersRemaining.value.headerList,
        itemList: hangersRemaining.value.itemList,
        classGridCols: 'grid-cols-4',
      },
      {
        key: 'yardageRemaining',
        labelKey: 'RR0296',
        icon: 'table_view',
        headerList: yardageRemaining.value.headerList,
        itemList: yardageRemaining.value.itemList,
        classGridCols: 'grid-cols-7',
      },
    ].filter((section) => section.itemList.length > 0)
  )

  const tabList = computed<Tab[]>(() => {
    const list = []

    if (inventorySections.value.length) {
      list.push({
        id: TAB_ID.PUBLIC,
        name: t('FF0030'),
      })
    }
    if (permissionList.includes(FUNC_ID.ASSET_VIEW_INTTERNAL)) {
      list.push({
        id: TAB_ID.PRIVATE,
        name: t('FF0031'),
      })
    }
    return list
  })

  const currentTabId = ref<TAB_ID>(tabList.value[0]?.id)

  watch(tabList, (tabs) => (currentTabId.value = tabs[0].id))

  const switchTab = (tab: Tab) => {
    currentTabId.value = tab.id
  }

  return {
    inventorySections,
    switchTab,
    tabList,
    currentTabId,
    setMaterial,
  }
}

export default useInventorySection
