<template lang="pug">
div(class="flex flex-col gap-5")
  f-tabs(
    v-if="!!inventorySections.length"
    :tabList="tabList"
    keyField="id"
    :type="TAB_TYPE.LINE"
    @switch="switchTab"
    tabItemContainerStyle="flex-1 justify-center items-center"
    tabListContainerStyle=""
  )
  div(class="flex flex-col gap-1 text-sm" v-if="currentTabId === TAB_ID.PUBLIC")
    p(class="text-secondary-text font-bold") {{ $t('RR0034') }}
    p(class="text-primary-inverse") {{ material.inventoryTotalQtyInYard }} {{ material.inventoryUnit }}
  div(class="rounded-md flex flex-col gap-4" v-if="currentTabId === TAB_ID.PRIVATE")
    //- Native Code
    div(class="flex flex-col gap-1 text-sm" v-if="material.internalInfo?.nativeCode")
      p(class="text-secondary-text font-bold") {{ $t('RR0030') }}
      p(class="text-primary-inverse") {{ material.internalInfo?.nativeCode }}
    div(v-for="section in inventorySections" :key="section.key" class="grid gap-4")
      div(class="flex flex-row gap-2 text-primary-inverse")
        f-svg-icon(size="24" :iconName="section.icon")
        p(class="text-sm font-bold text-primary-inverse") {{ $t(section.labelKey) }}
      material-detail-inventory-table(
        :headerList="section.headerList"
        :itemList="section.itemList"
        :classGridCols="section.classGridCols"
      )
</template>

<script setup lang="ts">
import MaterialDetailInventoryTable from './internal/MaterialDetailInventoryTable.vue'
import { TYPE as TAB_TYPE } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import useInventorySection, {
  TAB_ID,
} from '@/composables/material/useInventorySection'
import { type Material } from '@frontier/platform-web-sdk'

const props = defineProps<{ material: Material }>()
const { inventorySections, switchTab, tabList, currentTabId } =
  useInventorySection(props.material)
</script>
