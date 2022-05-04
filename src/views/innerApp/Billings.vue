<template lang="pug">
div(class="px-7.5 pt-7.5 w-full h-full relative")
  p(class="text-body1 font-bold text-primary mb-12.5") {{ $t("OO0004") }}
  div(class="border-b border-black-400 flex justify-between")
    div(class="flex gap-x-5")
      div(v-for="tab in tabList" class="cursor-pointer" @click="toggleTab(tab.path)")
        p(class="pb-2 text-body1" :class="[tab.path === currentTab ? 'border-b-4 border-brand text-primary font-bold' : 'text-black-600']" ) {{ tab.name }}
  div(class="relative w-full flex justify-center")
    plan(v-if="currentTab === 'plan'")
    payment-detail(v-else-if="currentTab === 'payment'")
    billing-history(v-else-if="currentTab === 'history'")
  notify-bar-inactive(v-if="planStatus.INACTIVE || planStatus.TRANSITION" class="absolute bottom-0 left-0")
</template>

<script>
import { ref, computed, reactive, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Billings',
  components: {
    Plan: defineAsyncComponent(() => import('@/components/billings/Plan.vue')),
    PaymentDetail: defineAsyncComponent(() => import('@/components/billings/PaymentDetail.vue')),
    BillingHistory: defineAsyncComponent(() => import('@/components/billings/BillingHistory.vue')),
    NotifyBarInactive: defineAsyncComponent(() => import('@/components/billings/NotifyBarInactive.vue'))
  },
  props: {
    tab: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const isLoading = ref(false)
    const isShowInactiveHint = ref(true)
    const planStatus = computed(() => store.getters['polling/planStatus'])
    const currentTab = computed(() => props.tab)
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

    return {
      currentTab,
      tabList,
      toggleTab,
      isLoading,
      planStatus,
      isShowInactiveHint
    }
  }
}
</script>
