<template>
  <form novalidate>
    <MaterialSection
      :tabType="CustomFieldTabType.SPECIFICATION"
      :title="t('MI0005')"
      v-model:fieldList="customFieldList.specificationList"
      :updateCustomFieldList="updateCustomFieldList"
    />
    <!-- <MaterialSection
      :tabType="CustomFieldTabType.FABRIC_DETAIL"
      :title="$t('RR0364')"
      v-model:fieldList="customFieldList.fabricDetailList"
      :updateCustomFieldList="updateCustomFieldList"
    /> -->
    <!-- <MaterialSection
      :tabType="CustomFieldTabType.TAG"
      :title="$t('RR0133')"
      v-model:fieldList="customFieldList.tagList"
      :updateCustomFieldList="updateCustomFieldList"
    /> -->
    <MaterialSection
      :tabType="CustomFieldTabType.PRICING"
      :title="t('RR0134')"
      v-model:fieldList="customFieldList.pricingList"
      :updateCustomFieldList="updateCustomFieldList"
    />
    <!-- <MaterialSection
      :tabType="CustomFieldTabType.INVENTORY"
      :title="$t('RR0135')"
      v-model:fieldList="customFieldList.inventoryList"
      :updateCustomFieldList="updateCustomFieldList"
    /> -->
  </form>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import MaterialSection from './MaterialSection.vue'
import customFieldApi from '@/apis/customField'
import { CustomFieldTabType } from '@frontier/platform-web-sdk'
import { useNotifyStore } from '../../../stores/notify'
import { useI18n } from 'vue-i18n'
import { NOTIFY_TYPE, SIZE, VERSION } from '@frontier/constants'
import { FUNC_ID, PERMISSION_MAP } from '@/utils/constants'

const store = useStore()
const notify = useNotifyStore()
const { t } = useI18n()
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

const rolePermission = computed(() => {
  const roleId = store.getters['organization/orgUser/orgUser'].roleID
  const permissionList = PERMISSION_MAP[roleId]
  return permissionList.includes(FUNC_ID.CUSTOM_FIELD_EDIT)
})

onMounted(() => {
  customFieldApi
    .getCustomFieldList({
      orgId: organization.value.orgId,
    })
    .then((res: any) => {
      customFieldList.value = res.data.result
    })
  if (!rolePermission.value) {
    notify.showNotifySnackbar({
      title: t('RR0585'),
      messageText: t('RR0586'),
      version: VERSION.V2,
      hasCloseButton: true,
      delay: 5000,
      notifyType: NOTIFY_TYPE.WARNING,
      size: SIZE.MD,
    })
  }
})
</script>
