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
    :version="VERSION.V2"
  )
  template(v-if="currentTab === TAB_ID.PUBLIC")
    div(class="grid grid-cols-2 gap-4" v-if="withPublicPrices")
      div(
        v-for="(property, key) in publicPrices"
        :key="key"
        class="flex flex-col gap-1 p-2 text-sm"
      )
        p(class="font-bold text-secondary-text") {{ property.name }}
        p(:class="property.value ? 'text-primary-inverse' : 'text-disabled'") {{ property.value || $t('RR0561') }}
    div(class="flex flex-row items-center justify-center gap-2 p-2" v-else)
      p(class="text-sm text-center primary-inverse") {{ $t('RR0561') }}
      f-button(
        type="secondary"
        size="sm"
        :version="VERSION.V2"
        @click="handleEdit(material)"
      ) {{ $t('RR0054') }}
  template(v-if="currentTab === TAB_ID.PRIVATE")
    div(class="grid grid-cols-2 gap-4" v-if="withPrivatePrices")
      div(
        v-for="(property, key) in privatePrices"
        :key="key"
        class="flex flex-col gap-1 p-2 text-sm"
      )
        p(class="font-bold text-secondary-text") {{ property.name }}
        p(:class="property.value ? 'text-primary-inverse' : 'text-disabled'") {{ property.value || $t('RR0561') }}
    div(class="flex flex-row items-center justify-center gap-2 p-2" v-else)
      p(class="text-sm text-center primary-inverse") {{ $t('RR0561') }}
      f-button(
        type="secondary"
        size="sm"
        :version="VERSION.V2"
        @click="editMaterial.func(material)"
      ) {{ $t('RR0054') }}
  custom-fields-section(
    v-if="(props.material.customFieldList?.pricingList?.length ?? 0) > 0"
    :customFields="customFieldList.pricingList"
    :materialCustomFields="props.material.customFieldList?.pricingList"
  )
</template>

<script setup lang="ts">
import type { Material } from '@frontier/platform-web-sdk'
import { TYPE as TAB_TYPE } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import usePriceSection from '@/composables/material/usePriceSection'
import { useCustomFieldStore } from '@/stores/customField'
import { storeToRefs } from 'pinia'
import CustomFieldsSection from './CustomFieldsSection.vue'
import { VERSION } from '@frontier/constants'
import useAssets from '@/composables/useAssets'

enum TAB_ID {
  PUBLIC = 0,
  PRIVATE = 1,
}

const props = defineProps<{
  material: Material
  handleEdit: (material: Material) => void
}>()
const {
  currentTab,
  privatePrices,
  publicPrices,
  switchTab,
  tabList,
  isInternalUser,
  withPrivatePrices,
  withPublicPrices,
} = usePriceSection()

const { editMaterial } = useAssets()

const customFieldStore = useCustomFieldStore()
const { customFieldList } = storeToRefs(customFieldStore)
</script>
