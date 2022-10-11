<template lang="pug">
div(class="mt-25 w-125 grid gap-y-4")
  div(class="w-full h-35")
    template(v-if="noBindingPayment")
      div(class="w-full h-full border border-grey-200 border-dashed rounded flex items-center pl-10 cursor-pointer" @click="openModalSetupCard")
        div(class="flex items-center text-grey-200")
          f-svg-icon(iconName="add" size="24")
          p(class="font-bold text-body2 pl-2") {{ $t('OO0012') }} 
    template(v-else)
      div(class="w-full h-full border border-grey-200 rounded pl-10 pt-6 pr-6 flex justify-between items-start")
        div(class="grid gap-y-4.5 text-body2 text-grey-900")
          p(class="font-bold text-body1") **** **** **** {{ cardInfo.lastFour }}
          p(class="text-body2") {{ $t('OO0054') }} {{ cardInfo.expiredDate }}
          p(class="text-body2") {{ $t('OO0055') }} {{ cardInfo.cardHolderName }}
        f-button-label(size="sm" @click="openModalSetupCard") {{ $t('OO0021') }}
  div(class="w-full h-53.5 border border-grey-200 rounded pl-10 pt-6 pr-6 flex justify-between items-start")
    div
      p(class="font-bold text-body1 text-grey-900 pb-5") {{ $t('OO0013') }}
      div(class="grid gap-y-3 text-body2 text-grey-900")
        template(v-for="item in billingInfoItemList")
          p(v-if="item") {{ item }}
    f-button-label(size="sm" @click="openModalEditBillingInfo") {{ $t('RR0054') }}
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
export default {
  name: 'PaymentDetail',
  setup () {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
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

    const stripe = Stripe(import.meta.env.VITE_APP_STRIPE_KEY)
    const { setup_intent_client_secret: setupIntentClientSecret } = route.query
    !!setupIntentClientSecret && stripe.retrieveSetupIntent(setupIntentClientSecret).then(({ setupIntent }) => {
      router.push({ name: route.name }) // remove query string
      switch (setupIntent.status) {
        case 'succeeded': {
          store.dispatch('helper/openModalConfirm', {
            type: 2,
            header: t('OO0017'),
            contentText: t('OO0018'),
            primaryBtnText: t('UU0031')
          })
          break
        }

        case 'processing': {
          // Processing payment details. We'll update you when processing is complete.
          break
        }

        case 'requires_payment_method': {
          // Failed to process payment details. Please try another payment method.
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          break
        }
      }
    })

    const openModalEditBillingInfo = () => {
      store.dispatch('helper/openModalBehavior', {
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

    const openModalSetupCard = () => {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-setup-card',
        properties: {}
      })
    }

    return {
      cardInfo,
      noBindingPayment,
      billingInfoItemList,
      openModalEditBillingInfo,
      openModalSetupCard
    }
  }
}
</script>
