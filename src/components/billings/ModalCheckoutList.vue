<template lang="pug">
modal-behavior(
  :header="$t('OO0057')"
  :primaryBtnText="$t('UU0077')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="payHandler"
  @click:secondary="closeModal"
)
  div(class="w-139")
    div(class="w-full h-101.5 border border-black-400 rounded px-7.5 pt-5 pb-3")
      overlay-scrollbar-container(class="h-60 -mx-6 px-6")
        div(class="grid gap-y-3 py-5")
          div(v-for="item in checkoutItemList")
            div(class="text-black-700 text-body2 flex justify-between")
              p {{ item.title }}
              p {{ item.price }}
            p(v-if="item.periodDate" class="text-black-600 text-caption pt-1.5") {{ item.periodDate }}
      p(class="text-body2 font-bold text-brand text-right pt-3 mb-3 border-t border-black-400 border-dashed") {{ `${$t('OO0034')}: ${$t('RR0044')} ${totalPrice}` }}
      div(class="h-16 bg-black-200 flex gap-x-12.5 items-center justify-center")
        p(class="text-body1 text-primary") **** **** **** {{ cardInfo.lastFour }}
        p(class="text-body2 text-black-700") {{ $t('OO0054') }} {{ cardInfo.expiredDate }}
    i18n-t(keypath="OO0038" tag="p" class="pt-2 text-center text-black-700 text-caption leading-1.6" scope="global")
      template(#newline)
        br
      template(#OO0116)
        span(class="text-assist-blue cursor-pointer" @click="openModalTermsOfSubscription") {{ $t('OO0116') }}
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

const props = defineProps({
  checkoutItemList: {
    type: Array,
    required: true
  },
  totalPrice: {
    type: String,
    required: true
  },
  payHandler: {
    type: Function,
    required: true
  }
})

const store = useStore()

const cardInfo = computed(() => store.getters['organization/paymentDetail'].cardInfo)

const closeModal = () => store.dispatch('helper/closeModal')

const openModalTermsOfSubscription = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-terms-of-subscription'
  })
}
</script>
