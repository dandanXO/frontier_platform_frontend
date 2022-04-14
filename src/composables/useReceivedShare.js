import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useNavigation from '@/composables/useNavigation.js'

export default function useReceivedShare () {
  const { t } = useI18n()
  const store = useStore()
  const { goToLobby } = useNavigation()

  const saveReceivedShare = async () => {
    store.dispatch('helper/openModalLoading')
    await store.dispatch('user/getUser')

    const { isCanSave } = store.getters['receivedShare/share']
    const organizationList = store.getters['user/organizationList']

    if (isCanSave && organizationList.length >= 1) {
      store.dispatch('helper/openModal', {
        component: 'modal-received-share-choose-storage',
        properties: {
          title: t('GG0005'),
          actionHandler: async ({ orgId, groupId }) => {
            store.dispatch('helper/pushModalLoading')
            await store.dispatch('receivedShare/saveShareReceived', { orgId, groupId })
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
    } else if (isCanSave && organizationList.length === 0) {
      store.dispatch('helper/openModalConfirm', {
        type: 3,
        header: t('GG0010'),
        content: t('GG0033'),
        primaryBtnText: t('UU0072'),
        primaryBtnHandler: goToLobby,
        secondaryBtnText: t('UU0002')
      })
    } else {
      store.dispatch('helper/openModalConfirm', {
        type: 1,
        header: t('GG0014'),
        content: t('GG0015'),
        primaryBtnText: t('UU0031')
      })
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
            await store.dispatch('receivedShare/cloneShareReceived', { orgId, groupId, workspaceNodeIdList })
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
        type: 3,
        header: t('GG0017'),
        content: t('GG0034'),
        primaryBtnText: t('UU0072'),
        primaryBtnHandler: goToLobby,
        secondaryBtnText: t('UU0002')
      })
    } else {
      store.dispatch('helper/openModalConfirm', {
        type: 1,
        header: t('GG0016'),
        content: t('GG0020'),
        primaryBtnText: t('UU0031')
      })
    }
  }

  const multipleCloneReceivedShare = async (nodeList) => {
    const workspaceNodeIdList = nodeList.map(({ workspaceNodeId }) => workspaceNodeId)
    cloneReceivedShare(workspaceNodeIdList)
  }

  return {
    saveReceivedShare,
    cloneReceivedShare,
    multipleCloneReceivedShare
  }
}
