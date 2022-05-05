import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { NODE_TYPE } from '@/utils/constants.js'

export default function usePublicLibrary () {
  const { t } = useI18n()
  const store = useStore()

  const publicCloneByMaterial = (nodeKey, isCanClone) => {
    publicClone([nodeKey], isCanClone, t('II0008'))
  }

  const publicCloneByCollection = (nodeKey, isCanClone) => {
    publicClone([nodeKey], isCanClone, t('II0009'))
  }

  const publicCloneByNode = (node) => {
    publicCloneByNodeList([node])
  }

  const publicCloneByNodeList = (nodeList) => {
    const nodeKeyList = nodeList.map(({ nodeKey }) => nodeKey)
    const isCanClone = nodeList.every(node => node.publish.isCanClone)
    const isContainCollection = nodeList.some(node => node.nodeType === NODE_TYPE.COLLECTION)
    const msg = isContainCollection ? t('II0009') : t('II0008')
    publicClone(nodeKeyList, isCanClone, msg)
  }

  const publicClone = (nodeKeyList, isCanClone, msg) => {
    if (!isCanClone) {
      return store.dispatch('helper/openModalConfirm', {
        type: 1,
        header: t('II0013'),
        content: t('II0014'),
        primaryBtnText: t('UU0031')
      })
    }

    store.dispatch('helper/openModalBehavior', {
      component: 'modal-clone-to',
      properties: {
        checkHandler: async () => {
          return store.dispatch('publicLibrary/cloneCheck', { nodeKeyList })
        },
        cloneHandler: async (targetLocationList, optional) => {
          await store.dispatch('publicLibrary/cloneNode', { nodeKeyList, targetLocationList, optional })
          store.commit('helper/PUSH_message', msg)
        }
      }
    })
  }

  const optionShareNode = {
    id: 'share',
    name: t('RR0079'),
    func: (node) => {
      store.dispatch('helper/openModal', {
        component: 'modal-public-library-share',
        properties: {
          nodeKey: node.nodeKey,
          isCanShared: node.isCanShared
        }
      })
    }
  }

  return {
    publicCloneByMaterial,
    publicCloneByCollection,
    publicCloneByNode,
    publicCloneByNodeList,
    optionShareNode
  }
}
