<template lang="pug">
f-tabs(:tabList="tabList" :key="$route.params.tab" class="pt-16")
  template(#default="{ currentTab }")
    div(class="relative w-full flex justify-center pt-3")
      plan-value-c-f-calculator(
        v-if="currentTab === VALUE_ADDED_SERVICE_ID.STARTRUST"
      )
      item(v-else :service="getCurrentService(currentTab)")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

import type { AddonsService } from '@/types'
import Item from './PlanValueAddedServiceItem.vue'
import PlanValueCFCalculator from './PlanValueCFCalculator.vue'
import valueAddedServiceList from './valueAddedServiceList'
import { VALUE_ADDED_SERVICE_ID } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import {
  ValueAddedServiceStarTrustStatusIdEnum,
  type ValueAddedService,
} from '@frontier/platform-web-sdk'

const store = useStore()
const { t } = useI18n()
const valueAddedServices: ValueAddedService =
  store.getters['polling/valueAddedService']
const subscribedServiceList = computed<AddonsService[]>(() => {
  const list = []
  for (const serviceName in valueAddedServices) {
    for (const service of valueAddedServiceList()) {
      if (service.id === serviceName) {
        list.push({
          ...service,
          ...store.getters['polling/valueAddedService'][serviceName],
        })
      }
    }
  }
  list.sort((a, b) => b.subscribeDate - a.subscribeDate)

  return list
})

const getCurrentService = (id: string) =>
  subscribedServiceList.value.find(({ id: serviceId }) => serviceId === id)!

const tabList = computed(() => {
  const tabs = subscribedServiceList.value.map(({ projectName, id }) => ({
    name: projectName,
    path: id,
  }))

  if (
    valueAddedServices.starTrust?.status.id ===
    ValueAddedServiceStarTrustStatusIdEnum.Active
  ) {
    tabs.push({
      name: t('VV0073'),
      path: VALUE_ADDED_SERVICE_ID.STARTRUST,
    })
  }

  return tabs
})
</script>
