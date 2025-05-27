<template>
  <form novalidate>
    <MaterialSection
      :tabType="CustomFieldTabType.SPECIFICATION"
      :title="$t('RR0130')"
      v-model:fieldList="customFieldList.specificationList"
      :updateCustomFieldList="updateCustomFieldList"
    />
    <MaterialSection
      :tabType="CustomFieldTabType.FABRIC_DETAIL"
      :title="$t('RR0364')"
      v-model:fieldList="customFieldList.fabricDetailList"
      :updateCustomFieldList="updateCustomFieldList"
    />
    <MaterialSection
      :tabType="CustomFieldTabType.TAG"
      :title="$t('RR0133')"
      v-model:fieldList="customFieldList.tagList"
      :updateCustomFieldList="updateCustomFieldList"
    />
    <MaterialSection
      :tabType="CustomFieldTabType.PRICING"
      :title="$t('RR0134')"
      v-model:fieldList="customFieldList.pricingList"
      :updateCustomFieldList="updateCustomFieldList"
    />
    <MaterialSection
      :tabType="CustomFieldTabType.INVENTORY"
      :title="$t('RR0135')"
      v-model:fieldList="customFieldList.inventoryList"
      :updateCustomFieldList="updateCustomFieldList"
    />
  </form>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import MaterialSection from './MaterialSection.vue'
import customFieldApi from '@/apis/customField'
import { CustomFieldTabType } from '@frontier/platform-web-sdk'

const store = useStore()
const organization = computed(() => store.getters['organization/organization'])
const customFieldList = ref({
  fabricDetailList: [],
  inventoryList: [],
  pricingList: [],
  specificationList: [],
  tagList: [],
})

const updateCustomFieldList = (newValue: any) => {
  customFieldList.value = newValue
}

onMounted(() => {
  customFieldApi
    .getCustomFieldList({
      orgId: organization.value.orgId,
    })
    .then((res: any) => {
      customFieldList.value = res.data.result
    })
})
</script>
