<template lang="pug">
div(class="w-133.5 px-8")
  div(class="w-full border border-black-400 rounded px-7.5 pt-8 pb-5")
    p(class="text-body1 font-bold text-primary text-left pb-4 mb-5 border-b border-black-400") {{ $t('OO0032') }}
    div(class="grid grid-cols-2 gap-x-8")
      div(class="border border-black-400 rounded flex flex-col items-center pt-7.5 px-7 pb-5")
        circle-progress-bar(:size="80" :current="plan.quota.u3m.used" :max="plan.quota.u3m.max")
          div(class="text-caption font-normal text-primary text-center")
            p {{ ((plan.quota.u3m.used / plan.quota.u3m.max) * 100).toFixed(0) }}%
            p {{ $t('OO0005') }}
        p(class="text-body2 text-primary pt-5 pb-1.5") {{ $t('OO0033') }}:
        p(class="text-body2 text-primary pb-3") {{ plan.quota.u3m.used }}/{{ plan.quota.u3m.max }} {{ $t('OO0006') }}
        label(class="bg-brand opacity-70 w-full h-5.5 flex items-center justify-center rounded text-body2 text-black-0") {{ planName }}
      div(class="flex flex-col")
        p(class="text-body2 text-primary pt-2.5 pb-5") {{ $t('OO0032') }}:
        div(class="flex")
          div(class="w-30 h-12 border  rounded flex items-center justify-center text-body1 text-primary border-black-400") {{ previewAmount }}
          div(class="cursor-pointer")
            svg-icon(iconName="keyboard_arrow_up" size="24" @click="add")
            svg-icon(iconName="keyboard_arrow_down" size="24" :class="{ 'text-primary-middle': setQty === 0 }" @click="reduce")
        p(class="text-body2 text-primary pt-0.5") {{ `${pricing.u3mUnit}${$t('OO0035')} / ${$t('RR0044')} $${pricing.u3mPrice}` }}
    p(class="text-body1 font-bold text-primary text-right pt-3 mt-7.5 border-t border-black-400") {{ `${$t('OO0034')}: ${$t('RR0044')} $${totalPrice}` }}
  btn-group(
    class="h-25"
    :primaryButtonDisabled="setQty === 0"
    :primaryText="$t('UU0021')"
    @click:primary="openModalCheckoutList"
    @click:secondary="closeModal"
  )
</template>

<script>
import { ref, computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import { PLAN_TYPE } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import usePlan from '@/composables/usePlan.js'

export default {
  name: 'ModalPurchaseU3mQuota',
  setup () {
    const store = useStore()
    const { t } = useI18n()
    const { openModalPaymentFail } = usePlan()

    const plan = computed(() => store.getters['organization/plan'])
    const planName = computed(() => store.getters['organization/planName'])
    const pricing = computed(() => {
      return store.getters['organization/planType'].BASIC
        ? store.getters['organization/pricing'].basic
        : store.getters['organization/pricing'].pro
    })
    const setQty = ref(0)
    const previewAmount = computed(() => setQty.value * pricing.value.u3mUnit)
    const totalPrice = computed(() => setQty.value * pricing.value.u3mPrice)

    const add = () => {
      setQty.value++
    }

    const reduce = () => {
      setQty.value > 0 && setQty.value--
    }

    const openModalCheckoutList = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-checkout-list',
        properties: {
          checkoutItemList: [
            {
              title: t('OO0036', { number: previewAmount.value }),
              price: `$${totalPrice.value}`
            }
          ],
          totalPrice: `$${totalPrice.value}`,
          payHandler: async () => {
            store.dispatch('helper/openModalLoading')
            const { success } = await store.dispatch('organization/purchaseU3m', { setQty: setQty.value })
            store.dispatch('helper/closeModalLoading')

            if (success) {
              store.dispatch('helper/openModal', {
                component: 'modal-payment-success',
                properties: {
                  title: t('OO0039'),
                  content: t('OO0040'),
                  buttonText: t('UU0026')
                }
              })
            } else {
              openModalPaymentFail()
            }
          }
        }
      })
    }

    const closeModal = () => store.dispatch('helper/closeModal')

    return {
      plan,
      planName,
      pricing,
      add,
      reduce,
      previewAmount,
      totalPrice,
      setQty,
      closeModal,
      openModalCheckoutList
    }
  }
}
</script>
