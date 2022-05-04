<template lang="pug">
div(
  v-if="isShowBufferNotifyBar"
  class="w-full h-14 flex justify-between items-center pl-12.5 pr-7.5"
  :class="[{ 'bg-warn-middle': planType.BASIC || planType.PRO }, { 'bg-brand': planType.ENT }]"
)
  div(class="flex items-center text-black-0")
    svg-icon(iconName="warning_amber_round" size="24")
    h6(v-if="planType.BASIC || planType.PRO" class="text-h6 ml-3")
      template(v-if="orgUserRole.OWNER || orgUserRole.ADMIN") {{ $t('OO0139') }}
      template(v-else) {{ $t('OO0149') }}
    div(v-if="planType.ENT" class="flex items-center text-h6 ml-3")
      h6 {{ $t('OO0147', { date: bufferDeactivatedDate }) }}
      i18n-t(keypath="OO0148" tag="h6" class="pl-1")
        template(#RR0139)
          span(class="font-bold") {{ $t('RR0139') }}
  div(class="flex items-center")
    chip(v-if="planType.BASIC || planType.PRO" size="lg" :text="$t('UU0066')" @click="openModalPaymentLastMonthFail" class="mr-4")
    svg-icon(iconName="clear" size="24" class="text-black-0 cursor-pointer" @click="isShowBufferNotifyBar = false")
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from '@vue/runtime-core'
import { FUNC_ID } from '@/utils/constants.js'

export default {
  name: 'NotifyBarBuffer',
  setup () {
    const store = useStore()

    const isShowBufferNotifyBar = ref(true)
    const orgUserRole = computed(() => store.getters['user/orgUser/orgUserRole'])
    const planType = computed(() => store.getters['polling/planType'])
    const planStatus = computed(() => store.getters['polling/planStatus'])
    const bufferDeactivatedDate = computed(() => store.getters['polling/plan'].bufferDeactivatedDate)

    const openModalPaymentLastMonthFail = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-payment-last-month-fail'
      })
    }

    return {
      planStatus,
      bufferDeactivatedDate,
      isShowBufferNotifyBar,
      FUNC_ID,
      planType,
      orgUserRole,
      openModalPaymentLastMonthFail
    }
  }
}
</script>
