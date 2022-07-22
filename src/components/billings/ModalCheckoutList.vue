<template lang="pug">
modal-behavior(
  :header="isChargeNow ? $t('OO0057') : header"
  :primaryBtnText="isChargeNow ? $t('UU0077') : $t('UU0001')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="payHandler"
  @click:secondary="closeModal"
)
  template(#note)
    div(class="flex items-center")
      svg-icon(iconName="info_outline" size="14" class="mr-1.5 text-black-600")
      i18n-t(keypath="OO0167" tag="p" class="text-start text-black-600 text-caption leading-1.6" scope="global")
        template(#newline)
          br
        template(#OO0116)
          span(class="text-assist-blue cursor-pointer" @click="openModalTermsOfSubscription") {{ $t('OO0116') }}
  div(class="w-117")
    i18n-t(v-if="isChargeNow" keypath="OO0166" tag="p" class="text-center text-primary text-caption leading-1.6 pb-3.5" scope="global")
      template(#newline)
        br
    div(v-else class="text-center text-caption  leading-1.6 pb-3.5")
      p(class="") {{ $t('OO0172') }}
      i18n-t(scope="global" keypath="OO0052" tag="p" class="text-primary font-bold")
        template(#date)
          span(class="text-brand") {{ renewDate }}
    div(class="border border-black-400 rounded px-7.5 pb-4")
      overlay-scrollbar-container(class="max-h-60.5 -mx-6 px-6")
        div(class="grid gap-y-4 py-5")
          div(v-for="item in checkoutItemList")
            div(class="text-black-700 text-body2 flex justify-between")
              p {{ item.title }}
              p {{ item.price }}
            p(v-if="item.periodDate" class="text-black-600 text-caption pt-1.5") {{ item.periodDate }}
      div(class="w-full h-px bg-black-400 mb-2.5")
      p(v-if="isChargeNow" class="text-body2 font-bold text-brand text-right mb-4.5") {{ `${$t('OO0034')}: ${$t('RR0044')} ${totalPrice}` }}
      div(class="h-16 bg-black-200 flex gap-x-12.5 items-center justify-center")
        p(class="text-body1 text-primary") **** **** **** {{ cardInfo.lastFour }}
        p(class="text-body2 text-black-700") {{ $t('OO0054') }} {{ cardInfo.expiredDate }}
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

defineProps({
  header: {
    type: String,
    required: false
  },
  isChargeNow: {
    type: Boolean,
    default: true
  },
  checkoutItemList: {
    type: Array,
    required: true
  },
  totalPrice: {
    type: String,
    required: false
  },
  payHandler: {
    type: Function,
    required: true
  }
})

const store = useStore()

const cardInfo = computed(() => store.getters['organization/paymentDetail'].cardInfo)
const renewDate = computed(() => store.getters['polling/plan'].renewDate)

const closeModal = () => store.dispatch('helper/closeModal')

const openModalTermsOfSubscription = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-terms-of-subscription'
  })
}
</script>
