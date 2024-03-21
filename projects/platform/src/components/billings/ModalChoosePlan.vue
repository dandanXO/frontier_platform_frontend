<template lang="pug">
fullscreen-header
  template(#left)
    h5(class="text-h5 text-grey-900 font-bold") {{ $t('OO0066') }}
  template(#right)
    btn-group(
      :primaryText="$t('UU0026')"
      @click:primary="closeModal"
      :secondaryButton="false"
    )
  template(#content)
    div(class="w-full h-full text-center pt-23")
      h2(class="font-bold text-h2 text-grey-900 mb-7.5") {{ $t('OO0066') }}
      h6(class="font-normal text-h6 text-grey-600 mb-16.5") {{ $t('OO0067') }}
      div(class="w-fit h-80.5 grid grid-cols-2 gap-14.5 mx-auto")
        div(class="w-64.5 border border-grey-150 rounded overflow-hidden flex flex-col")
          div(class="h-1.5 bg-grey-150")
          div(
            class="flex-grow h-auto pt-9 pb-7.5 flex flex-col justify-between items-center"
          )
            h4(class="text-h4 text-grey-900 text-normal mb-4") {{ $t('OO0174') }}
            //- h4(class="text-h4 text-grey-900 text-normal mb-4") {{ $t('RR0159') }}
            p(class="text-body2 text-grey-600 mb-12.5") {{ $t('OO0069') }}
            div(class="flex flex-col w-fit")
              //- p(class="text-caption text-grey-600 self-start mb-2") {{ $t('OO0072') }}
              h3(class="text-h3 font-medium text-grey-900 mb-3") {{ $t('OO0174') }}
              //- h3(class="text-h3 font-medium text-grey-900 mb-3") {{ $t('RR0044') }} ${{ pricing.basic.planPrice }}
              //- p(class="text-caption text-grey-900 self-center") {{ $t('OO0073') }}
            f-button(size="md" disabled class="w-50 mt-7") {{ planType.BASIC ? $t('UU0081') : $t('UU0080') }}
        //- div(class="border border-grey-150 rounded overflow-hidden flex flex-col")
        //-   div(class="h-1.5 bg-primary-400")
        //-   div(class="flex-grow h-auto pt-9 pb-7.5 flex flex-col items-center")
        //-     h4(class="text-h4 text-grey-900 text-normal mb-4") {{ $t('RR0160') }}
        //-     p(class="text-body2 text-grey-600 mb-12.5") {{ $t('OO0070') }}
        //-     div(class="flex flex-col w-fit")
        //-       p(class="text-caption text-grey-600 self-start mb-2") {{ $t('OO0072') }}
        //-       h3(class="text-h3 font-medium text-grey-900 mb-3") {{ $t('RR0044') }} ${{ pricing.pro.planPrice }}
        //-       p(class="text-caption text-grey-900 self-center") {{ $t('OO0073') }}
        //-     f-button(size="md" :disabled="planType.PRO" class="w-50 mt-7" @click="upgradePlan") {{ planType.PRO ? $t('UU0081') : $t('UU0079') }}
        div(class="w-64.5 border border-grey-150 rounded overflow-hidden flex flex-col")
          div(class="h-1.5 bg-cyan-400")
          div(
            class="flex-grow h-auto pt-9 pb-7.5 flex flex-col justify-between items-center"
          )
            h4(class="text-h4 text-grey-900 text-normal mb-4") {{ $t('RR0161') }}
            p(class="text-body2 text-grey-600 mb-7.5") {{ $t('OO0071') }}
            f-button-label(active)
              span(class="text-body2") {{ $t('OO0074') }}
            h3(class="text-h3 text-medium text-grey-900 mt-4") {{ $t('OO0075') }}
            f-button(size="md" class="w-50 mt-13" @click="openModalUpgradeEnterprise") {{ $t('UU0078') }}
      p(
        class="mt-25 text-cyan-400 text-body2 cursor-pointer"
        @click="openModalPlanIntroduction"
      ) {{ $t('OO0068') }}
</template>

<script setup>
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
import { useStore } from 'vuex'
import { h, computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import usePlanOld from '@/composables/usePlanOld.js'
import { NOTIFY_TYPE } from '@/utils/constants'

const { t } = useI18n()
const store = useStore()
const { checkHaveBindPayment } = usePlanOld()

const pricing = computed(() => store.getters['organization/pricing'])
const plan = computed(() => store.getters['polling/plan'])
const planType = computed(() => store.getters['polling/planType'])

const closeModal = () => store.dispatch('helper/closeModal')
const upgradePlan = async () => {
  if (!checkHaveBindPayment()) {
    return
  }

  const { estimateCharging, periodDate } = await store.dispatch(
    'organization/getChargingOfUpgradePlan'
  )
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-checkout-list',
    properties: {
      header: t('OO0047'),
      isChargeNow: false,
      checkoutItemList: [
        {
          title: t('RR0160'),
          price: `$${estimateCharging}`,
          periodDate,
        },
      ],
      payHandler: async () => {
        store.dispatch('helper/pushModalLoading')
        await store.dispatch('organization/upgradePlan')
        store.dispatch('helper/closeModalLoading')

        store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.SUCCESS,
          header: t('OO0165'),
          primaryBtnText: t('UU0031'),
          contentComponent: shallowRef({
            render: () => {
              return h('div', { class: 'text-body2 leading-1.6' }, [
                h('p', {}, t('OO0052', { date: plan.value.renewDate })),
                h('p', {}, t('OO0080')),
              ])
            },
          }),
        })
      },
    },
  })
}
const openModalPlanIntroduction = () => {
  store.dispatch('helper/pushModal', {
    component: 'modal-plan-introduction',
  })
}
const openModalUpgradeEnterprise = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-upgrade-enterprise',
  })
}
</script>
