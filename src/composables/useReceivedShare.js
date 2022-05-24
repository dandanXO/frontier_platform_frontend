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
          title: t('RR0213'),
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
        header: t('RR0214'),
        content: t('GG0015'),
        primaryBtnText: t('UU0031')
      })
    }
  }

  const receivedShareCloneByNodeKey = (nodeKey) => {
    receivedShareClone([nodeKey])
  }

  const receivedShareCloneByNodeList = (nodeList) => {
    const nodeKeyList = nodeList.map(({ nodeKey }) => nodeKey)
    receivedShareClone(nodeKeyList)
  }

  const receivedShareClone = async (nodeKeyList) => {
    store.dispatch('helper/openModalLoading')
    await store.dispatch('user/getUser')

    const { isCanClone } = store.getters['receivedShare/share']
    const organizationList = store.getters['user/organizationList']

    if (isCanClone && organizationList.length >= 1) {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-clone-to',
        properties: {
          crossOrg: true,
          checkHandler: async (orgId) => {
            return store.dispatch('receivedShare/cloneCheckShareReceived', { orgId, nodeKeyList })
          },
          cloneHandler: async (targetLocationList, optional, orgId) => {
            await store.dispatch('receivedShare/cloneShareReceived', { orgId, nodeKeyList, targetLocationList, optional })
            const orgNo = store.getters['user/organizationList'].find(org => org.orgId === orgId).orgNo
            window.open(`${window.location.origin}/${orgNo}/assets`, '_blank')
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

  return {
    saveReceivedShare,
    receivedShareCloneByNodeKey,
    receivedShareCloneByNodeList
  }
}
