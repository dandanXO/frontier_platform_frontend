<template lang="pug">
div(class="w-100 px-8")
  h6(class="text-h6 font-bold text-primary text-center pb-4") {{$t('OO0056')}}
  div(class="text-body2  line-height-1.6 grid gap-y-2")
    p(class="text-primary") {{$t('OO0121')}}
    p(class="text-primary") {{$t('OO0122')}}
    p(class="text-black-700")
      span(v-for="func in functionList") ·{{func}}
  btn-group(
    class="h-25"
    :primaryText="$t('UU0002')"
    @click:primary="closeModal"
    :secondaryText="$t('UU0001')"
    @click:secondary="confirmToDeactivate"
  )
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useNavigation from '@/composables/useNavigation.js'

export default {
  name: 'ModalDeactivate',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const { goToPaymentDetail } = useNavigation()

    const functionList = [
      t('OO0123'),
      t('RR0060'),
      t('RR0063'),
      t('OO0124'),
      t('RR0062'),
      t('OO0125')
    ]

    const closeModal = () => store.dispatch('helper/closeModal')

    const confirmToDeactivate = async () => {
      store.dispatch('helper/openModalLoading')
      const { result: { totalPrice, checkoutItemList } } = await store.dispatch('organization/getUnbilledInfo')
      store.dispatch('helper/closeModalLoading')

      if (checkoutItemList.length === 0) {
        store.dispatch('helper/openModalLoading')
        await store.dispatch('organization/deactivateOrg')
        store.dispatch('helper/closeModalLoading')
        return
      }

      store.dispatch('helper/openModal', {
        component: 'modal-checkout-list',
        properties: {
          checkoutItemList,
          totalPrice,
          payHandler: async () => {
            store.dispatch('helper/openModalLoading')
            const { success } = await store.dispatch('organization/deactivateOrg')
            store.dispatch('helper/closeModalLoading')

            if (success) {
              store.dispatch('helper/openModal', {
                component: 'modal-deactivate-success'
              })
            } else {
              store.dispatch('helper/openModal', {
                component: 'modal-payment-fail',
                properties: {
                  title: t('OO0041'),
                  content: t('OO0042'),
                  primaryButtonText: t('UU0076'),
                  primaryHandler: () => {
                    store.dispatch('helper/closeModal')
                    goToPaymentDetail()
                  },
                  secondaryButtonText: t('UU0026'),
                  secondaryHandler: closeModal
                }
              })
            }
          }
        }
      })
    }

    return {
      functionList,
      confirmToDeactivate,
      closeModal
    }
  }
}
</script>
