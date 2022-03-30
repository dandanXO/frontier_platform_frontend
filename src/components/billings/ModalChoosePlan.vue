<template lang="pug">
fullscreen-header
  template(#left)
    h5(class="text-h5 text-primary font-bold") {{ $t('OO0066') }}
  template(#right)
    btn-group(
      :primaryText="$t('UU0026')"
      @click:primary="closeModal"
      :secondaryButton="false"
    )
  template(#content)
    div(class="w-full h-full text-center pt-23")
      h2(class="font-bold text-h2 text-primary mb-7.5") {{ $t('OO0066') }}
      h6(class="font-normal text-h6 text-black-700 mb-16.5") {{ $t('OO0067') }}
      div(class="w-222.5 h-80.5 grid grid-cols-3 gap-x-14.5 mx-auto")
        div(class="border border-primary-middle rounded card-shadow overflow-hidden flex flex-col")
          div(class="h-1.5 bg-primary-middle")
          div(class="flex-grow h-auto pt-9 pb-7.5 flex flex-col items-center")
            h4(class="text-h4 text-primary text-normal mb-4") {{ $t('RR0159') }}
            p(class="text-body2 text-black-600 mb-12.5") {{ $t('OO0069') }}
            div(class="flex flex-col w-fit")
              p(class="text-caption text-black-700 self-start mb-2") {{ $t('OO0072') }}
              h3(class="text-h3 font-medium text-primary mb-3") {{ $t('RR0044') }} ${{ pricing.basic.planPrice }}
              p(class="text-caption text-primary self-center") {{ $t('OO0073') }}
            btn(size="md" disabled class="w-50 mt-7") {{ planType.BASIC ? $t('UU0081') : $t('UU0080') }}
        div(class="border border-primary-middle rounded card-shadow overflow-hidden flex flex-col")
          div(class="h-1.5 bg-brand")
          div(class="flex-grow h-auto pt-9 pb-7.5 flex flex-col items-center")
            h4(class="text-h4 text-primary text-normal mb-4") {{ $t('RR0160') }}
            p(class="text-body2 text-black-600 mb-12.5") {{ $t('OO0070') }}
            div(class="flex flex-col w-fit")
              p(class="text-caption text-black-700 self-start mb-2") {{ $t('OO0072') }}
              h3(class="text-h3 font-medium text-primary mb-3") {{ $t('RR0044') }} ${{ pricing.pro.planPrice }}
              p(class="text-caption text-primary self-center") {{ $t('OO0073') }}
            btn(size="md" :disabled="planType.PRO" class="w-50 mt-7" @click="upgradePlan") {{ planType.PRO ? $t('UU0081') : $t('UU0079') }}
        div(class="border border-primary-middle rounded card-shadow overflow-hidden flex flex-col")
          div(class="h-1.5 bg-assist-blue")
          div(class="flex-grow h-auto pt-9 pb-7.5 flex flex-col items-center")
            h4(class="text-h4 text-primary text-normal mb-4") {{ $t('RR0161') }}
            p(class="text-body2 text-black-600 mb-7.5") {{ $t('OO0071') }}
            btn-functional(active)
              span(class="text-body2") {{ $t('OO0074') }}
            h3(class="text-h3 text-medium text-primary mt-4") {{ $t('OO0075') }}
            btn(size="md" class="w-50 mt-13" @click="openModalUpgradeEnterprise") {{ $t('UU0078') }}
      p(class="mt-25 text-assist-blue text-body2 cursor-pointer" @click="openModalPlanIntroduction") {{ $t('OO0068') }}
</template>

<script>
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import usePlan from '@/composables/usePlan.js'

export default {
  name: 'ModalChoosePlan',
  components: {
    FullscreenHeader
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const { checkHaveBindPayment } = usePlan()

    const pricing = computed(() => store.getters['organization/pricing'])
    const plan = computed(() => store.getters['organization/plan'])
    const planType = computed(() => store.getters['organization/planType'])

    const closeModal = () => store.dispatch('helper/closeModal')
    const upgradePlan = async () => {
      if (!checkHaveBindPayment()) {
        return
      }

      store.dispatch('helper/pushModalLoading')
      const { success, message } = await store.dispatch('organization/upgradePlan')
      store.dispatch('helper/closeModalLoading')

      if (success) {
        store.dispatch('helper/openModal', {
          component: 'modal-payment-success',
          properties: {
            title: t('OO0050'),
            content: t('OO0080'),
            nextPayInfo: t('OO0052', { date: plan.value.renewDate })
          }
        })
      } else {
        store.dispatch('helper/openModalConfirm', {
          type: 3,
          header: message.title,
          content: message.content,
          primaryBtnText: t('UU0031')
        })
      }
    }
    const openModalPlanIntroduction = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-plan-introduction'
      })
    }
    const openModalUpgradeEnterprise = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-upgrade-enterprise'
      })
    }

    return {
      pricing,
      closeModal,
      upgradePlan,
      planType,
      openModalPlanIntroduction,
      openModalUpgradeEnterprise
    }
  }
}
</script>
