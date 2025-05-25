<template lang="pug">
div(class="!gap-4")
  f-tabs(
    v-if="isInternalUser"
    :tabList="tabList"
    keyField="id"
    :type="TAB_TYPE.LINE"
    @switch="switchTab"
    tabItemContainerStyle="flex-1 justify-center items-center"
    tabListContainerStyle=""
  )
  template(v-if="currentTab === TAB_ID.PUBLIC")
    div(class="grid grid-cols-2 gap-4" v-if="withPublicPrices")
      div(
        v-for="(property, key) in publicPrices"
        :key="key"
        class="flex flex-col gap-1 text-sm p-2"
      )
        p(class="text-secondary-text font-bold") {{ property.name }}
        p(:class="property.value ? 'text-primary-inverse' : 'text-disabled'") {{ property.value || $t('RR0561') }}
    div(class="flex flex-col p-2" v-else)
      p(class="text-sm primary-inverse text-center") {{ $t('RR0561') }}
  template(v-if="currentTab === TAB_ID.PRIVATE")
    div(class="grid grid-cols-2 gap-4" v-if="withPrivatePrices")
      div(
        v-for="(property, key) in privatePrices"
        :key="key"
        class="flex flex-col gap-1 text-sm p-2"
      )
        p(class="text-secondary-text font-bold") {{ property.name }}
        p(:class="property.value ? 'text-primary-inverse' : 'text-disabled'") {{ property.value || $t('RR0561') }}
    div(class="flex flex-col p-2" v-else)
      p(class="text-sm primary-inverse text-center") {{ $t('RR0561') }}
</template>

<script setup lang="ts">
import { type Material } from '@frontier/platform-web-sdk'
import { TYPE as TAB_TYPE } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import usePriceSection from '@/composables/material/usePriceSection'

enum TAB_ID {
  PUBLIC = 0,
  PRIVATE = 1,
}

const props = defineProps<{ material: Material }>()
const {
  currentTab,
  privatePrices,
  publicPrices,
  switchTab,
  tabList,
  isInternalUser,
  withPrivatePrices,
  withPublicPrices,
} = usePriceSection(props.material)
</script>
