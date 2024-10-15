<template lang="pug">
f-tabs(:tabList="tabList" :key="$route.params.tab" class="pt-16")
  template(#default="{ currentTab }")
    div(class="relative w-full flex justify-center pt-3")
      plan-value-c-f-calculator(
        v-if="currentTab === 'carbon-footprint-calculator'"
      )
      item(v-else :service="subscribedServiceList[currentTab]")
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import type { AddonsService } from '@/types'
import Item from './PlanValueAddedServiceItem.vue'
import PlanValueCFCalculator from './PlanValueCFCalculator.vue'
import valueAddedServiceList from './valueAddedServiceList'

const store = useStore()
const { t } = useI18n()

const subscribedServiceList = computed<AddonsService[]>(() => {
  const list = []
  for (const serviceName in store.getters['polling/valueAddedService']) {
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

const tabList = reactive([
  ...subscribedServiceList.value.map((service, path) => ({
    name: service.projectName,
    path,
  })),
  {
    name: t('VV0073'),
    path: 'carbon-footprint-calculator',
  },
])
</script>
