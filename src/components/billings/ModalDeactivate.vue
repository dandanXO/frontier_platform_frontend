<template lang="pug">
modal-behavior(
  :header="$t('OO0056')"
  :primaryBtnText="$t('UU0002')"
  :secondaryBtnText="$t('UU0001')"
  @click:primary="closeModal"
  @click:secondary="confirmToDeactivate"
)
  div(class="w-84 text-body2 leading-1.6 grid gap-y-2")
    p(class="text-primary") {{ $t('OO0121') }}
    p(class="text-primary") {{ $t('OO0122') }}
    p(class="text-black-700")
      span(v-for="func in functionList") ·{{ func }}
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import usePlan from '@/composables/usePlan.js'

const { t } = useI18n()
const store = useStore()
const { openModalPaymentFail } = usePlan()

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
  const {
    result: { totalPrice, checkoutItemList }
  } = await store.dispatch('organization/getUnbilledInfo')
  store.dispatch('helper/closeModalLoading')

  if (checkoutItemList.length === 0) {
    store.dispatch('helper/openModalLoading')
    await store.dispatch('organization/deactivateOrg')
    store.dispatch('helper/closeModalLoading')
    return
  }

  store.dispatch('helper/openModalBehavior', {
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
          openModalPaymentFail()
        }
      }
    }
  })
}
</script>
