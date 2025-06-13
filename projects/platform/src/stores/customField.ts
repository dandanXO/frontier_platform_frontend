import customFieldApi from '@/apis/customField'
import { type CustomFieldList } from '@frontier/platform-web-sdk'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const customFieldList = ref<CustomFieldList>({
  fabricDetailList: [],
  inventoryList: [],
  pricingList: [],
  specificationList: [],
  tagList: [],
})

export const useCustomFieldStore = defineStore('customField', () => {
  const store = useStore()
  const orgId = computed(() => store.getters['organization/orgId'])

  const getCustomFieldList = async () => {
    try {
      const res = await customFieldApi.getCustomFieldList({
        orgId: orgId.value,
      })
      customFieldList.value = res.data.result
    } catch (error) {
      console.error('Failed to fetch latest custom field list', error)
    }

    return customFieldList.value
  }

  return {
    customFieldList,
    getCustomFieldList,
  }
})
