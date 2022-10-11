<template lang="pug">
div(class="px-7.5 pt-7.5 w-full h-full relative")
  p(class="text-body1 font-bold text-grey-900 mb-12.5") {{ $t("OO0004") }}
  f-tabs(
    :tabList="tabList"
    :key="$route.params.tab"
    :initValue="$route.params.tab"
    @switch="toggleTab($event.path)"
  )
    template(#default="{ currentTab }")
      div(class="relative w-full flex justify-center")
        plan(v-if="currentTab === 'plan'")
        value-added-service(v-else-if="currentTab === 'value-added-service'")
        payment-detail(v-else-if="currentTab === 'payment'")
        billing-history(v-else-if="currentTab === 'history'")
  notify-bar-inactive(v-if="planStatus.INACTIVE || planStatus.TRANSITION" class="fixed bottom-0 left-0 ml-60")
</template>

<script setup>
import { computed, reactive, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
const Plan = defineAsyncComponent(() => import('@/components/billings/Plan.vue'))
const ValueAddedService = defineAsyncComponent(() => import('@/components/billings/ValueAddedService.vue'))
const PaymentDetail = defineAsyncComponent(() => import('@/components/billings/PaymentDetail.vue'))
const BillingHistory = defineAsyncComponent(() => import('@/components/billings/BillingHistory.vue'))
const NotifyBarInactive = defineAsyncComponent(() => import('@/components/billings/NotifyBarInactive.vue'))

defineProps({
  tab: {
    type: String,
    required: true
  }
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()
const planStatus = computed(() => store.getters['polling/planStatus'])
const orgUserRole = computed(() => store.getters['organization/orgUser/orgUserRole'])

const tabList = reactive([
  {
    name: t('OO0009'),
    path: 'plan'
  },
  {
    name: t('VV0001'),
    path: 'value-added-service'
  }
])

if (orgUserRole.value.OWNER || orgUserRole.value.ADMIN) {
  tabList.push(
    {
      name: t('OO0010'),
      path: 'payment'
    },
    {
      name: t('OO0011'),
      path: 'history'
    }
  )
}

const toggleTab = (tab) => {
  router.push({ name: route.name, params: { tab } })
}
</script>
