<template lang="pug">
modal-loading(v-if="isLoading")
div(v-show="!isLoading" class="w-107 px-8")
  h6(class="text-primary font-bold text-h6 pb-7.5 text-center") {{ $t('OO0014') }}
  form
    div(id="stripe-container")
    input-text(
      class="mt-4"
      v-model:textValue="cardHolderName"
      :label="$t('OO0015')"
      :placeholder="$t('OO0016')"
    )
  btn-group(
    class="h-25"
    :primaryText="$t('UU0018')"
    :primaryButtonDisabled="!availableToSetup"
    @click:primary="setupCard"
    :secondaryButton="false"
  )
</template>
<script>
import { computed, onMounted, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import ModalLoading from '@/components/common/modal/ModalLoading.vue'

export default {
  name: 'ModalSetupCard',
  components: {
    ModalLoading
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const stripe = Stripe(import.meta.env.VITE_APP_STRIPE_KEY)
    const cardHolderName = ref('')
    const clientSecret = ref('')
    const elements = ref(null)
    const paymentElement = ref(null)
    const isFilledAllCardFields = ref(false)
    const isLoading = ref(true)
    const availableToSetup = computed(() => isFilledAllCardFields.value && !!cardHolderName.value)

    const setupCard = () => {
      store.dispatch('helper/pushModalConfirm', {
        type: 0,
        header: t('OO0049'),
        content: t('OO0048'),
        primaryBtnText: t('UU0031'),
        afterPrimaryBtnHandler: async () => {
          store.dispatch('helper/pushModalLoading')
          await store.dispatch('organization/setCardHolderName', { clientSecret: clientSecret.value, cardHolderName: cardHolderName.value })
          const orgNo = store.getters['organization/orgNo']
          const { error } = await stripe.confirmSetup({
            elements: elements.value,
            confirmParams: {
              return_url: `${window.location.origin}/${orgNo}/billings/payment`
            }
          })
          store.dispatch('helper/closeModalLoading')

          if (error) {
            store.dispatch('helper/pushModalConfirm', {
              type: 3,
              header: t('OO0019'),
              content: t('OO0020'),
              primaryBtnText: t('UU0031'),
              primaryBtnHandler: () => store.dispatch('helper/clearModalPipeline'),
              secondaryBtnText: t('UU0076')
            })
          }
        },
        secondaryBtnText: t('UU0002')
      })
    }

    onMounted(async () => {
      clientSecret.value = await store.dispatch('organization/getStripeClientSecret')
      const locale = store.getters['user/user'].locale
      const options = { // https://stripe.com/docs/js/elements_object/create
        clientSecret: clientSecret.value,
        locale, // https://stripe.com/docs/js/appendix/supported_locales
        appearance: {  // https://stripe.com/docs/stripe-js/appearance-api
          theme: 'stripe',
          rules: {
            '.Label': {
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#444444'
            },
            '.Input': {
              borderColor: '#dcdcdc'
            },
            '.Input:focus': {
              boxShadow: 'none',
              borderColor: '#919191'
            }
          }
        }
      }

      elements.value = stripe.elements(options)
      paymentElement.value = elements.value.create('payment')
      paymentElement.value.mount('#stripe-container')

      paymentElement.value.on('ready', () => isLoading.value = false)

      paymentElement.value.on('change', ({ complete }) => isFilledAllCardFields.value = complete)
    })

    return {
      cardHolderName,
      availableToSetup,
      setupCard,
      isLoading
    }
  }
}
</script>
