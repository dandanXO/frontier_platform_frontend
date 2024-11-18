import { useStore } from 'vuex'
import { computed, shallowRef, h } from 'vue'
import useNavigation from '@/composables/useNavigation'
import { useI18n, Translation } from 'vue-i18n'
import { NOTIFY_TYPE } from '@/utils/constants'

export default function usePlanOld() {
  const store = useStore()
  const { t } = useI18n()
  const { goToPaymentDetail } = useNavigation()

  const noBindingPayment = computed(
    () => store.getters['organization/noBindingPayment']
  )
  const plan = computed(() => store.getters['polling/plan'])
  const planType = computed(() => store.getters['polling/planType'])
  const planStatus = computed(() => store.getters['polling/planStatus'])

  const closeModal = () => store.dispatch('helper/closeModal')

  const checkHaveBindPayment = () => {
    if (!noBindingPayment.value) {
      return true
    }

    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('OO0012'),
      contentText: t('OO0079'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: goToPaymentDetail,
      secondaryBtnText: t('UU0002'),
    })
    return false
  }

  const checkCanInvitedPeople = () => {
    if (planType.value.BASIC) {
      // store.dispatch('helper/openModalConfirm', {
      //   type: 0,
      //   header: t('OO0099'),
      //   contentText: t('OO0100'),
      //   primaryBtnText: t('UU0021'),
      //   afterPrimaryBtnHandler: openModalChoosePlan,
      //   secondaryBtnText: t('UU0002')
      // })
      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.WARNING,
        header: t('OO0109'),
        contentText: t('OO0110'),
        primaryBtnText: t('UU0031'),
      })
      return false
    } else {
      // all plan must check member quota
      const memberQuota = store.getters['polling/plan'].quota.member
      if (memberQuota.max === 0) {
        store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.WARNING,
          header: t('OO0109'),
          contentText: t('OO0110'),
          primaryBtnText: t('UU0031'),
        })
        return false
      } else if (memberQuota.max === memberQuota.used) {
        store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.WARNING,
          header: t('OO0133'),
          contentText: t('WW0085'),
          primaryBtnText: t('UU0031'),
        })
        return false
      }
    }
    return true
  }

  const openModalChoosePlan = () => {
    store.dispatch('helper/openModal', {
      component: 'modal-choose-plan',
    })
  }

  const openModalManageMaterialQuota = () => {
    !planType.value.ENT &&
      planStatus.value.ACTIVE &&
      checkHaveBindPayment() &&
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-manage-material-quota',
      })
  }

  const openModalPurchaseU3mQuota = () => {
    !planType.value.ENT &&
      planStatus.value.ACTIVE &&
      checkHaveBindPayment() &&
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-purchase-u3m-quota',
      })
  }

  const deactivateOrg = () => {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('OO0007'),
      secondaryBtnText: t('UU0083'),
      afterSecondaryBtnHandler: async () => {
        store.dispatch('helper/openModalLoading')
        const {
          result: { totalPrice, checkoutItemList },
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
              const { success } = await store.dispatch(
                'organization/deactivateOrg'
              )
              store.dispatch('helper/closeModalLoading')

              if (success) {
                store.dispatch('helper/openModalConfirm', {
                  type: NOTIFY_TYPE.SUCCESS,
                  header: t('OO0039'),
                  contentComponent: shallowRef({
                    render: () => {
                      return h(
                        'div',
                        { class: 'text-body2 leading-1.6 text-grey-600' },
                        [
                          h(
                            'p',
                            {},
                            `${t('OO0058')} ${plan.value.deactivatedDate}`
                          ),
                          h(
                            Translation,
                            { keypath: 'OO0126', tag: 'p', scope: 'global' },
                            {
                              OO0127: () =>
                                h(
                                  'span',
                                  { class: 'text-cyan-400' },
                                  t('OO0127')
                                ),
                            }
                          ),
                        ]
                      )
                    },
                  }),
                  primaryBtnText: t('UU0031'),
                })
              } else {
                openModalPaymentFail()
              }
            },
          },
        })
      },
      textBtnText: t('UU0002'),
      contentComponent: shallowRef({
        render: () => {
          return h(
            Translation,
            {
              keypath: 'OO0121',
              tag: 'p',
              scope: 'global',
              class: 'text-grey-600 text-body2 leading-1.6',
            },
            { newline: () => h('br') }
          )
        },
      }),
    })
  }

  const openModalPaymentFail = () => {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.ALERT,
      header: t('OO0041'),
      contentText: t('OO0042'),
      secondaryButtonText: t('UU0076'),
      secondaryHandler: () => {
        closeModal()
        goToPaymentDetail()
      },
      textBtnText: t('UU0026'),
      textHandler: closeModal,
    })
  }

  const activateOrg = async () => {
    store.dispatch('helper/openModalLoading')
    await store.dispatch('organization/activateOrg')
    store.dispatch('helper/closeModalLoading')
  }

  const payLastMonthUnbilledInfo = async () => {
    store.dispatch('helper/openModalLoading')
    const {
      result: { totalPrice, checkoutItemList },
    } = await store.dispatch('organization/getLastMonthUnbilledInfo')
    store.dispatch('helper/closeModalLoading')

    store.dispatch('helper/openModalBehavior', {
      component: 'modal-checkout-list',
      properties: {
        checkoutItemList,
        totalPrice,
        payHandler: async () => {
          store.dispatch('helper/openModalLoading')
          const { success } = await store.dispatch(
            'organization/payLastMonthUnbilledInfo'
          )
          store.dispatch('helper/closeModalLoading')

          if (success) {
            store.dispatch('helper/openModalConfirm', {
              type: NOTIFY_TYPE.SUCCESS,
              header: t('OO0039'),
              contentText: t('OO0145'),
              primaryBtnText: t('UU0031'),
            })
          } else {
            openModalPaymentFail()
          }
        },
      },
    })
  }

  return {
    checkHaveBindPayment,
    openModalChoosePlan,
    openModalManageMaterialQuota,
    openModalPurchaseU3mQuota,
    deactivateOrg,
    activateOrg,
    openModalPaymentFail,
    checkCanInvitedPeople,
    payLastMonthUnbilledInfo,
  }
}
