<template lang="pug">
div(class="w-100 px-8 text-center")
  h6(class="text-h6 font-bold text-primary mb-4") {{ $t('OO0142') }}
  p(class="text-body2 leading-1.6 text-primary mb-5") {{ $t('OO0143', { date: bufferDeactivatedDate }) }}
  i18n-t(v-if="orgUserRole.OWNER || orgUserRole.ADMIN" keypath="OO0144" tag="p" class="text-body2 leading-1.6 text-primary")
    template(#RR0139)
      span(class="text-assist-blue") {{ $t('RR0139') }}
  p(v-else class="text-body2 leading-1.6 text-primary") {{ $t('OO0150') }}
  btn-group(
    class="h-25"
    :primaryText="orgUserRole.OWNER || orgUserRole.ADMIN ? $t('UU0082') : $t('UU0026')"
    :secondaryButton="false"
    @click:primary="orgUserRole.OWNER || orgUserRole.ADMIN ? payLastMonthUnbilledInfo() : closeModal()"
  )
</template>

<script>
import { useStore } from "vuex"
import { computed } from '@vue/runtime-core'
import usePlan from "@/composables/usePlan"

export default {
  name: 'ModalPaymentLastMonthFail',
  setup () {
    const store = useStore()
    const { payLastMonthUnbilledInfo } = usePlan()

    const orgUserRole = computed(() => store.getters['user/orgUser/orgUserRole'])
    const bufferDeactivatedDate = computed(() => store.getters['polling/plan'].bufferDeactivatedDate)


    const closeModal = () => store.dispatch('helper/closeModal')

    return {
      orgUserRole,
      bufferDeactivatedDate,
      closeModal,
      payLastMonthUnbilledInfo
    }
  }
}
</script>
