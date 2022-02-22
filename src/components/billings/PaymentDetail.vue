<template lang="pug">
div(class="mt-25 w-125 grid gap-y-4")
  div(class="w-full h-35")
    template(v-if="noBindingPayment")
      div(class="w-full h-full border border-black-500 border-dashed rounded flex items-center pl-10 cursor-pointer" @click="")
        div(class="flex items-center text-black-500")
          svg-icon(iconName="add" size="24")
          p(class="font-bold text-body2 pl-2") {{$t('OO0012')}} 
  div(class="w-full h-53.5 border border-black-500 rounded pl-10 pt-6 pr-6")
    div(class="flex justify-between items-start")
      div
        p(class="font-bold text-body1 text-primary pb-5") {{$t('OO0013')}}
        div(class="grid gap-y-3 text-body2 text-primary")
          template(v-for="item in billingInfoItemList")
            p(v-if="item") {{item}}
      btn-functional(size="sm" @click="openModalEditBillingInfo") {{$t('RR0054')}}
</template>

<script>
import { computed, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
  name: 'PaymentDetail',
  setup () {
    const store = useStore()

    const paymentDetail = computed(() => store.getters['organization/paymentDetail'])
    const cardInfo = computed(() => paymentDetail.value.cardInfo)
    const noBindingPayment = computed(() => store.getters['organization/noBindingPayment'])
    const billingInfoItemList = computed(() => {
      const countryList = store.getters['code/countryList']
      const { recipient, email, countryCode, zipCode, city, address } = paymentDetail.value.billingInfo
      const nation = countryList.find(country => country.countryCode === countryCode).name
      const thirdRow = `${zipCode ? zipCode + ', ' : ''}${city ? city + ', ' : ''}${nation}`
      return [
        recipient,
        email,
        thirdRow,
        address
      ]
    })

    const openModalEditBillingInfo = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-edit-billing-info',
        properties: {
          billingInfo: paymentDetail.value.billingInfo,
          actionHandler: async (billingInfo) => {
            store.dispatch('helper/openModalLoading')
            await store.dispatch('organization/updateBillingInfo', billingInfo)
            store.dispatch('helper/closeModalLoading')
            store.dispatch('helper/closeModal')
          }
        }
      })
    }

    return {
      cardInfo,
      noBindingPayment,
      billingInfoItemList,
      openModalEditBillingInfo
    }
  }
}
</script>
