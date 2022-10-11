<template lang="pug">
modal-behavior(
  :header="$t('OO0032')"
  :primaryBtnText="$t('UU0021')"
  :primaryBtnDisabled="setQty === 0"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="openModalCheckoutList"
  @click:secondary="closeModal"
)
  div(class="w-117.5")
    div(class="w-full border border-grey-200 rounded px-7.5 pt-8 pb-5")
      div(class="grid grid-cols-2 gap-x-8")
        div(class="border border-grey-200 rounded flex flex-col items-center pt-7.5 px-7 pb-5")
          f-circle-progress-bar(:size="80" :current="plan.quota.u3m.used" :max="plan.quota.u3m.max")
            div(class="text-caption font-normal text-grey-900 text-center")
              p {{ ((plan.quota.u3m.used / plan.quota.u3m.max) * 100).toFixed(0) }}%
              p {{ $t('OO0005') }}
          p(class="text-body2 text-grey-900 pt-5 pb-1.5") {{ $t('OO0033') }}:
          p(class="text-body2 text-grey-900 pb-3") {{ plan.quota.u3m.used }}/{{ plan.quota.u3m.max }} {{ $t('OO0006') }}
          label(class="bg-primary-400 opacity-70 w-full h-5.5 flex items-center justify-center rounded text-body2 text-grey-0") {{ planName }}
        div(class="flex flex-col")
          p(class="text-body2 text-grey-900 pt-2.5 pb-5") {{ $t('OO0032') }}:
          div(class="flex")
            div(class="w-30 h-12 border  rounded flex items-center justify-center text-body1 text-grey-900 border-grey-200") {{ previewAmount }}
            div(class="cursor-pointer")
              f-svg-icon(iconName="keyboard_arrow_up" size="24" @click="add")
              f-svg-icon(iconName="keyboard_arrow_down" size="24" :class="{ 'text-grey-150': setQty === 0 }" @click="reduce")
          p(class="text-body2 text-grey-900 pt-0.5") {{ `${pricing.u3mUnit}${$t('OO0035')} / ${$t('RR0044')} $${pricing.u3mPrice}` }}
      p(class="text-body1 font-bold text-grey-900 text-right pt-3 mt-7.5 border-t border-grey-200") {{ `${$t('OO0034')}: ${$t('RR0044')} $${totalPrice}` }}
</template>

<script setup>
import { ref, computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import usePlan from '@/composables/usePlan.js'

const store = useStore()
const { t } = useI18n()
const { openModalPaymentFail } = usePlan()

const plan = computed(() => store.getters['polling/plan'])
const planName = computed(() => store.getters['polling/planName'])
const pricing = computed(() => {
  return store.getters['polling/planType'].BASIC ? store.getters['organization/pricing'].basic : store.getters['organization/pricing'].pro
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
  store.dispatch('helper/openModalBehavior', {
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
          store.dispatch('helper/openModalConfirm', {
            type: 2,
            header: t('OO0039'),
            contentText: t('OO0040'),
            primaryBtnText: t('UU0026')
          })
        } else {
          openModalPaymentFail()
        }
      }
    }
  })
}

const closeModal = () => store.dispatch('helper/closeModal')
</script>
