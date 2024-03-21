import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { NOTIFY_TYPE } from '@frontier/constants'

export default function usePlan() {
  const { t } = useI18n()
  const store = useStore()
  const notify = useNotifyStore()

  const cancelDesignerPlan = () => {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('RR0358'),
      contentText: t('RR0357'),
      primaryBtnText: t('UU0149'),
      primaryBtnHandler: async () => {
        const expireDate = await store.dispatch(
          'organization/unsubscribeDesignerPlan'
        )
        notify.showNotifySnackbar({
          messageText: t('OO0175', { ExpireDate: expireDate }),
        })
      },
      secondaryBtnText: t('UU0150'),
    })
  }

  return {
    cancelDesignerPlan,
  }
}
