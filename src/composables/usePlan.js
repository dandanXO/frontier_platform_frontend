import { useStore } from "vuex"
import { computed } from '@vue/runtime-core'
import useNavigation from '@/composables/useNavigation.js'
import { useI18n } from "vue-i18n"

export default function usePlan () {
  const store = useStore()
  const { t } = useI18n()
  const { goToPaymentDetail } = useNavigation()

  const noBindingPayment = computed(() => store.getters['organization/noBindingPayment'])
  const planType = computed(() => store.getters['organization/planType'])
  const planStatus = computed(() => store.getters['organization/planStatus'])

  const closeModal = () => store.dispatch('helper/closeModal')

  const checkHaveBindPayment = () => {
    if (!noBindingPayment.value) {
      return true
    }

    store.dispatch('helper/openModalConfirm', {
      title: t('OO0012'),
      content: t('OO0079'),
      primaryText: t('UU0001'),
      primaryHandler: goToPaymentDetail,
      secondaryText: t('UU0002')
    })
    return false
  }

  const checkCanInvitedPeople = () => {
    if (planType.value.BASIC) {
      store.dispatch('helper/openModalConfirm', {
        title: t('OO0099'),
        content: t('OO0100'),
        primaryText: t('UU0021'),
        afterPrimaryHandler: openModalChoosePlan,
        secondaryText: t('UU0002')
      })
      return false
    } else if (planType.value.ENT) {
      const memberQuota = store.getters['organization/plan'].quota.member
      if (memberQuota.max === 0) {
        store.dispatch('helper/openModalConfirm', {
          title: t('OO0109'),
          content: t('OO0110'),
          primaryText: t('UU0031')
        })
        return false
      } else if (memberQuota.max === memberQuota.used) {
        store.dispatch('helper/openModalConfirm', {
          title: t('OO0133'),
          content: t('WW0086'),
          primaryText: t('UU0031')
        })
        return false
      }
    }
    return true
  }

  const openModalChoosePlan = () => {
    store.dispatch('helper/openModal', {
      component: 'modal-choose-plan'
    })
  }

  const openModalManageMaterialQuota = () => {
    !planType.value.ENT && planStatus.value.ACTIVE && checkHaveBindPayment() && store.dispatch('helper/openModal', {
      component: 'modal-manage-material-quota'
    })
  }

  const openModalPurchaseU3mQuota = () => {
    !planType.value.ENT && planStatus.value.ACTIVE && checkHaveBindPayment() && store.dispatch('helper/openModal', {
      component: 'modal-purchase-u3m-quota'
    })
  }

  const openModalDeactivate = () => {
    store.dispatch('helper/openModal', {
      component: 'modal-deactivate'
    })
  }

  const openModalPaymentFail = () => {
    store.dispatch('helper/openModal', {
      component: 'modal-payment-fail',
      properties: {
        title: t('OO0041'),
        content: t('OO0042'),
        primaryButtonText: t('UU0076'),
        primaryHandler: () => {
          closeModal()
          goToPaymentDetail()
        },
        secondaryButtonText: t('UU0026'),
        secondaryHandler: closeModal
      }
    })
  }

  const activateOrg = async () => {
    store.dispatch('helper/openModalLoading')
    await store.dispatch('organization/activateOrg')
    store.dispatch('helper/closeModalLoading')
  }

  return {
    checkHaveBindPayment,
    openModalChoosePlan,
    openModalManageMaterialQuota,
    openModalPurchaseU3mQuota,
    openModalDeactivate,
    activateOrg,
    openModalPaymentFail,
    checkCanInvitedPeople
  }
}
