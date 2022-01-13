import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { RECEIVED_SHARE_ACTION_TYPE } from '@/utils/constants.js'

export default function useReceivedShare () {
  const { t } = useI18n()
  const store = useStore()

  const checkPermission = async (type) => {
    try {
      store.dispatch('helper/openModalLoading')
      await store.dispatch('user/getUser')
      const isAllow = await store.dispatch('share/checkShareReceivedPermission', { type })
      if (!isAllow) {
        store.dispatch('helper/openModalConfirm', {
          title: t('GG0014'),
          content: t('GG0015'),
          primaryText: t('UU0031')
        })
      }
      return isAllow
    } catch (error) {
      store.dispatch('helper/closeModalLoading')
    }
  }

  const saveReceivedShare = async () => {
    await checkPermission(RECEIVED_SHARE_ACTION_TYPE.SAVE) && store.dispatch('helper/openModal', {
      component: 'modal-received-share-choose-storage',
      properties: {
        title: t('GG0005'),
        actionHandler: ({ orgId, groupId }) => store.dispatch('share/saveShareReceived', { orgId, groupId })
      }
    })
  }

  const cloneReceivedShare = async (workspaceNodeIdList) => {
    await checkPermission(RECEIVED_SHARE_ACTION_TYPE.CLONE) && store.dispatch('helper/openModal', {
      component: 'modal-received-share-choose-storage',
      properties: {
        title: t('GG0019'),
        actionHandler: ({ orgId, groupId }) => store.dispatch('share/cloneShareReceived', { orgId, groupId, workspaceNodeIdList })
      }
    })
  }

  const multipleCloneReceivedShare = async (workspaceNodeKeyList) => {
    const workspaceNodeIdList = workspaceNodeKeyList.map(nodeKey => nodeKey.split('-')[1])
    await checkPermission(RECEIVED_SHARE_ACTION_TYPE.CLONE) && store.dispatch('helper/openModal', {
      component: 'modal-received-share-choose-storage',
      properties: {
        title: t('GG0019'),
        actionHandler: ({ orgId, groupId }) => store.dispatch('share/cloneShareReceived', { orgId, groupId, workspaceNodeIdList })
      }
    })
  }

  return {
    saveReceivedShare,
    cloneReceivedShare,
    multipleCloneReceivedShare
  }
}
