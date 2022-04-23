import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { NODE_TYPE } from '@/utils/constants.js'

export default function useShareToMe () {
  const { t } = useI18n()
  const store = useStore()

  const shareToMeCloneByMaterial = (nodeKey, isCanClone) => {
    shareToMeClone([nodeKey], isCanClone, t('II0008'))
  }

  const shareToMeCloneByCollection = (nodeKey, isCanClone) => {
    shareToMeClone([nodeKey], isCanClone, t('II0009'))
  }

  const shareToMeCloneByNode = (node) => {
    shareToMeCloneByNodeList([node])
  }

  const shareToMeCloneByNodeList = (nodeList) => {
    const nodeKeyList = nodeList.map(({ nodeKey }) => nodeKey)
    const isCanClone = nodeList.every(node => node.share.isCanClone)
    const isContainCollection = nodeList.some(node => node.nodeType === NODE_TYPE.COLLECTION)
    const msg = isContainCollection ? t('II0009') : t('II0008')
    shareToMeClone(nodeKeyList, isCanClone, msg)
  }

  const shareToMeClone = (nodeKeyList, isCanClone, msg) => {
    if (!isCanClone) {
      return store.dispatch('helper/openModalConfirm', {
        type: 1,
        header: t('GG0016'),
        content: t('GG0020'),
        primaryBtnText: t('UU0031')
      })
    }

    store.dispatch('helper/openModal', {
      component: 'modal-clone-to',
      properties: {
        checkHandler: async () => {
          return store.dispatch('shareToMe/cloneCheckShareToMe', { nodeKeyList })
        },
        cloneHandler: async (targetLocationList, optional) => {
          await store.dispatch('shareToMe/cloneShareToMe', { nodeKeyList, targetLocationList, optional })
          store.commit('helper/PUSH_message', msg)
        }
      }
    })
  }

  const shareToMeDeleteByNode = (node) => {
    shareToMeDeleteByNodeList([node])
  }

  const shareToMeDeleteByNodeList = (nodeList) => {
    const nodeKeyList = nodeList.map(({ nodeKey }) => nodeKey)
    store.dispatch('helper/openModalConfirm', {
      header: t('HH0004'),
      content: t('HH0005'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: async () => {
        store.dispatch('helper/openModalLoading')
        await store.dispatch('shareToMe/deleteShareToMe', { nodeKeyList })
        store.dispatch('helper/closeModalLoading')
        store.dispatch('helper/reloadInnerApp')
      },
      secondaryBtnText: t('UU0002')
    })
  }

  return {
    shareToMeCloneByMaterial,
    shareToMeCloneByCollection,
    shareToMeCloneByNode,
    shareToMeCloneByNodeList,
    shareToMeDeleteByNode,
    shareToMeDeleteByNodeList
  }
}
