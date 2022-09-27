<template lang="pug">
component(v-if="isDetailPage" :is="valueAddedServiceDetailPage")
div(v-else class="w-full pt-3")
  div(class="w-195 mx-auto mt-8")
    div(class="mb-12")
      div(class="text-body1 font-bold leading-1.6 text-grey-900 pb-5") {{ $t("VV0002") }}
      div(class="flex border border-black-400 rounded h-62 cursor-pointer hover:bg-black-200" @click="goTo(recommendService.id)")
        div(class="w-63 flex-none pb-5 px-4.5 flex flex-col h-full justify-between")
          div
            div(class="flex items-center py-2 h-11.5")
              img(:src="recommendService.logo" class="scale-50 origin-left")
            div(class="text-body1 text-grey-900 leading-1.6 font-bold") {{ recommendService.projectName }}
            i18n-t(keypath="VV0004" tag="div" class="text-caption leading-1.6 text-grey-600")
              template(#providerName) {{ recommendService.providerName }}
            div(class="text-caption text-grey-900 leading-1.3 pt-4") {{ recommendService.description }}
          div(class="flex items-center text-body2")
            template(v-if="valueAddedService[recommendService.id].status === VALUE_ADDED_SERVICE_STATUS.ACTIVATE")
              f-svg-icon(iconName="check_circle_outline" size="20" class="text-primary-400")
              span(class="pl-1 text-primary-400") {{ $t("VV0054") }}
            template(v-else)
              span(class="text-grey-900") {{ $t("VV0006") }}
        div(class="w-132 flex-none bg-cover rounded-r" :style="{ backgroundImage: `url(${recommendService.bannerImage})` }")
    div(v-if="valueAddedServiceList.length > 1")
      div(class="text-body1 text-grey-900 font-bold leading-1.6 pb-1") {{ $t("VV0007") }}
      p(class="text-body2 text-grey-900 pb-7.5") {{ $t("VV0008") }}
      div(class="grid")
        template(v-for="service in valueAddedServiceList")
          div(v-if="!service.bannerImage" class="max-w-63 min-h-62 flex flex-col rounded px-4.5 pb-5 justify-between border border-black-400 cursor-pointer hover:bg-black-200" @click="goTo(service.id)")
            div
              div(class="flex items-start py-2 h-11.5")
                img(:src="service.logo" class="scale-50 origin-left")
              div(class="text-body1 text-grey-900 leading-1.6 font-bold") {{ service.projectName }}
              i18n-t(keypath="VV0004" tag="div" class="text-caption leading-1.6 text-grey-600")
                template(#providerName) {{ service.providerName }}
              div(class="text-caption text-grey-900 leading-1.3 pt-4") {{ service.description }}
            div(class="flex items-center text-body2")
              template(v-if="valueAddedService[service.id].status === VALUE_ADDED_SERVICE_STATUS.ACTIVATE")
                f-svg-icon(iconName="check_circle_outline" size="20" class="text-primary-400")
                span(class="pl-1 text-primary-400") {{ $t("VV0054") }}
              template(v-else)
                span(class="text-grey-900") {{ $t("VV0006") }}
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { VALUE_ADDED_SERVICE_ID, VALUE_ADDED_SERVICE_STATUS } from '@/utils/constants'
import ValueAddedServiceMade2flow from '@/components/billings/ValueAddedServiceMade2flow.vue'
import valueAddedServiceList from '@/components/billings/valueAddedServiceList.js'

const route = useRoute()
const router = useRouter()
const store = useStore()

const valueAddedService = computed(() => store.getters['polling/valueAddedService'])
const valueAddedServiceDetailPage = computed(() => {
  const service = route.query.service
  if (service === VALUE_ADDED_SERVICE_ID.MADE2FLOW) {
    return ValueAddedServiceMade2flow
  } else {
    return null
  }
})

const recommendService = computed(() => valueAddedServiceList.find(service => !!service.bannerImage))
const isDetailPage = computed(() => !!route.query.service)

const goTo = (pageId) => {
	router.push({ name: 'Billings', params: { tab: 'value-added-service' }, query: { service: pageId }})
}
</script>
