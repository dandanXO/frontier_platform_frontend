import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useNavigation from '@/composables/useNavigation.js'

export default function useReceivedShare () {
  const { t } = useI18n()
  const store = useStore()
  const { goToLobby } = useNavigation()

  const saveReceivedShare = async () => {
    try {
      store.dispatch('helper/openModalLoading')
      await store.dispatch('user/getUser')

      const { isCanSave } = store.getters['receivedShare/share']
      const organizationList = store.getters['user/organizationList']

      if (isCanSave && organizationList.length >= 1) {
        store.dispatch('helper/openModal', {
          component: 'modal-received-share-choose-storage',
          properties: {
            title: t('GG0005'),
            actionHandler: ({ orgId, groupId }) => store.dispatch('receivedShare/saveShareReceived', { orgId, groupId })
          }
        })
      } else if (isCanSave && organizationList.length === 0) {
        store.dispatch('helper/openModalConfirm', {
          title: t('GG0010'),
          content: t('GG0033'),
          primaryText: t('UU0072'),
          primaryHandler: goToLobby
        })
      } else {
        store.dispatch('helper/openModalConfirm', {
          title: t('GG0014'),
          content: t('GG0015'),
          primaryText: t('UU0031')
        })
      }
    } catch (error) {
      store.dispatch('helper/closeModalLoading')
    }
  }

  const cloneReceivedShare = async (workspaceNodeIdList) => {
    store.dispatch('helper/openModalLoading')
    await store.dispatch('user/getUser')

    const { isCanClone } = store.getters['receivedShare/share']
    const organizationList = store.getters['user/organizationList']

    if (isCanClone && organizationList.length >= 1) {
      store.dispatch('helper/openModal', {
        component: 'modal-received-share-choose-storage',
        properties: {
          title: t('GG0019'),
          actionHandler: async ({ orgId, groupId }) => {
            store.dispatch('helper/pushModalLoading')
            await store.dispatch('share/cloneShareReceived', { orgId, groupId, workspaceNodeIdList })
            store.dispatch('helper/closeModalLoading')

            const orgNo = store.getters['user/organizationList'].find(org => org.orgId === orgId).orgNo
            let prefixUrl
            if (groupId) {
              prefixUrl = `${orgNo}/${groupId}`
            } else {
              prefixUrl = `${orgNo}`
            }
            window.open(`${window.location.origin}/${prefixUrl}/assets`, '_blank')
          }
        }
      })
    } else if (isCanClone && organizationList.length === 0) {
      store.dispatch('helper/openModalConfirm', {
        title: t('GG0017'),
        content: t('GG0034'),
        primaryText: t('UU0072'),
        primaryHandler: goToLobby
      })
    } else {
      store.dispatch('helper/openModalConfirm', {
        title: t('GG0016'),
        content: t('GG0020'),
        primaryText: t('UU0031')
      })
    }
  }

  const multipleCloneReceivedShare = async (workspaceNodeKeyList) => {
    const workspaceNodeIdList = workspaceNodeKeyList.map(nodeKey => nodeKey.split('-')[1])
    cloneReceivedShare(workspaceNodeIdList)
  }

  return {
    saveReceivedShare,
    cloneReceivedShare,
    multipleCloneReceivedShare
  }
}
