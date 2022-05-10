<template lang="pug">
div(class="px-7.5 pt-7.5 w-full h-full relative")
  p(class="text-body1 font-bold text-primary mb-12.5") {{ $t("OO0004") }}
  tabs(:tabList="tabList" @switch="toggleTab($event.path)")
    template(#default="{ currentTab }")
      div(class="relative w-full flex justify-center")
        plan(v-if="currentTab === 'plan'")
        payment-detail(v-else-if="currentTab === 'payment'")
        billing-history(v-else-if="currentTab === 'history'")
  notify-bar-inactive(v-if="planStatus.INACTIVE || planStatus.TRANSITION" class="absolute bottom-0 left-0")
</template>

<script setup>
import { computed, reactive, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
const Plan = defineAsyncComponent(() => import('@/components/billings/Plan.vue'))
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
const tabList = reactive([
  {
    name: t('OO0009'),
    path: 'plan'
  },
  {
    name: t('OO0010'),
    path: 'payment'
  },
  {
    name: t('OO0011'),
    path: 'history'
  }
])

const toggleTab = (tab) => {
  router.push({ name: route.name, params: { tab } })
}

</script>
