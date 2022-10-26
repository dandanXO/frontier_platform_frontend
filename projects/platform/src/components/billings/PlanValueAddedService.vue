<template lang="pug">
div(class="mt-11 mb-16.5")
  p(class="text-gray-900 text-body1 border-b border-grey-200 py-5") {{ $t("VV0009") }}
  template(v-for="service in subscribedServiceList")
    f-expansion-panel(v-if="service.id === VALUE_ADDED_SERVICE_ID.MADE2FLOW" class="border-b border-grey-200")
      template(#trigger="{ isExpand }")
        div(class="h-15 flex items-center justify-between")
          h5(class="text-h5 text-grey-900 font-bold") {{ service.projectName }}
          f-svg-icon(
            iconName="keyboard_arrow_right"
            size="24"
            class="transform text-grey-900"
            :class="[isExpand ? '-rotate-90' : 'rotate-90']"
          )
      template(#content)
        div(class="h-38 border border-grey-200 rounded flex justify-between px-7.5 mb-3" :class="[!service.planStatus.INVALID ? 'cursor-pointer hover:bg-grey-50' : '']" @click="goTo(service.id, MADE2FLOW_TAG_LIST.INTRODUCTION.id)")
          div(class="flex flex-col justify-between pb-5")
            div
              div(class="flex items-center h-11.5 my-2")
                img(:src="service.logo" class="scale-50 origin-left")
              div(class="text-body1 text-grey-900 font-bold pb-2" :class="{ 'text-grey-200': service.planStatus.INVALID }") {{ service.projectName }}｜{{ service.planName }}
              i18n-t(keypath="VV0004" scope="global" tag="div" class="text-caption text-grey-600" :class="{ 'text-grey-200': service.planStatus.INVALID }")
                template(#providerName) {{ service.providerName }}
            div(class="text-caption" :class="{ 'text-grey-200': service.planStatus.INVALID }")
              span(v-if="!service.planStatus.INVALID") {{ STATUS_NAME[service.status] }}・
              span {{ $t("VV0017") }} {{ service.renewDate }}
          div(class="flex items-center")
            f-button(v-if="!service.planStatus.INVALID" size="lg" type="primary" @click.stop="goTo(service.id, MADE2FLOW_TAG_LIST.PLAN_AND_PRICE.id)") {{ service.planStatus.ACTIVATE ? $t("UU0117") : $t("UU0064")}}
        div(class="h-37 border border-grey-200 rounded mb-2 flex justify-between")
          div(class="pt-8 pb-6 pl-7 flex justify-between")
            div
              div(class="flex items-center mb-2 text-grey-900" :class="{ 'text-grey-200': service.planStatus.INVALID }")
                p(class="text-body1 font-bold mr-1.5") {{ $t("M2F036") }}
                f-tooltip(placement="top")
                  template(#trigger)
                    f-svg-icon(iconName="info_outline" size="16")
                  template(#content)
                    p(class="text-caption text-grey-50 leading-1.3 max-w-72") {{ $t("VV0072") }}
              p(class="text-caption text-grey-600 mb-4" :class="{ 'text-grey-200': service.planStatus.INVALID }") {{ $t('M2F037') }}
              p(class="text-body1 font-bold text-primary-400 leading-1.6" :class="{ 'text-grey-200': service.planStatus.INVALID }") {{ service.completeQty }} / {{ service.totalQty }} 
                span(class="text-caption font-normal pl-1 text-grey-900" :class="{ 'text-grey-200': service.planStatus.INVALID }") {{ $t('M2F038') }}
            f-circle-progress-bar(
              class="self-end"
              :size="60"
              :current="service.completeQty"
              :max="service.totalQty"
              primaryColor="stroke-primary-400"
            )
              f-svg-icon(iconName="done" size="24" :class="{ 'text-grey-200': service.planStatus.INVALID }")
          div(class="h-full w-129" :style="{ backgroundImage: `url(${ Made2FlowData })` }")
        div(class="mb-3.5 bg-grey-50 rounded flex items-center text-grey-600 h-10 px-4" :class="{ 'text-grey-200': service.planStatus.INVALID }")
          f-svg-icon(iconName="info_outline" size="16")
          i18n-t(keypath="M2F039" scope="global" tag="div" class="text-caption pl-3")
            template(#number) {{ service.unFilledCertificationQty }}
        div(v-if="!service.planStatus.INVALID" class="flex justify-end mb-5")
          p(class="text-cyan-400 text-right cursor-pointer" @click="goTo(service.id, MADE2FLOW_TAG_LIST.APPOINTMENT.id)") {{ $t("UU0078") }}
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import valueAddedServiceList from '@/components/billings/valueAddedServiceList.js'
import { VALUE_ADDED_SERVICE_ID, VALUE_ADDED_SERVICE_STATUS, useConstants } from '@/utils/constants'
import Made2FlowData from '@/assets/images/Made2Flow_data.png'

const store = useStore()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { MADE2FLOW_TAG_LIST } = useConstants()
const { ACTIVATE, EXPIRED, CANCELED, INVALID } = VALUE_ADDED_SERVICE_STATUS
const STATUS_NAME = {
  [ACTIVATE]: t('VV0013'),
  [EXPIRED]: t('VV0014'),
  [CANCELED]: t('VV0015'),
  [INVALID]: t('VV0016'),
}

const subscribedServiceList = computed(() => {
  const list = []
  for (const serviceName in store.getters['polling/valueAddedService']) {
    for (const service of valueAddedServiceList()) {
      if (service.id === serviceName) {
        list.push({
          ...service,
          ...store.getters['polling/valueAddedService'][serviceName]
        })
      }
    }
  }
  list.sort((a, b) => b.subscribeDate - a.subscribeDate)

  return list
})

const goTo = (service, tagId) => {
  router.push({ name: route.name, params: { tab: 'value-added-service' }, query: { service, tagId } })
}
</script>
