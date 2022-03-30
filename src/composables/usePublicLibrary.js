import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { TARGET_LOCATION, NODE_TYPE } from '@/utils/constants.js'

export default function usePublicLibrary () {
  const { t } = useI18n()
  const store = useStore()

  const cloneNode = {
    id: 'clone',
    name: t('UU0034'),
    func: (v) => {
      const nodeList = Array.isArray(v) ? v : [v]
      const isCanClone = nodeList.every(node => node.publish.isCanClone)

      if (!isCanClone) {
        return store.dispatch('helper/openModalConfirm', {
          type: 1,
          header: t('II0013'),
          content: t('II0014'),
          primaryBtnText: t('UU0031')
        })
      }
      const organization = store.getters['organization/organization']
      const locationList = []

      locationList.push({
        id: organization.orgId,
        name: organization.orgName,
        location: TARGET_LOCATION.ORG
      })

      organization.groupList.forEach(group => {
        locationList.push({
          id: group.groupId,
          name: group.groupName,
          location: TARGET_LOCATION.GROUP
        })
      })

      store.dispatch('helper/openModal', {
        component: 'modal-clone-to',
        properties: {
          locationList,
          cloneHandler: async (targetLocationList) => {
            const workspaceNodeList = nodeList.map(({ workspaceNodeId, workspaceNodeLocation }) => {
              return {
                id: Number(workspaceNodeId),
                location: Number(workspaceNodeLocation)
              }
            })

            store.dispatch('helper/openModalLoading')
            await store.dispatch('publicLibrary/cloneNode', {
              workspaceNodeList,
              targetLocationList
            })
            store.dispatch('helper/closeModalLoading')

            const isContainCollection = nodeList.some(node => node.nodeType === NODE_TYPE.COLLECTION)
            const message = isContainCollection ? t('II0009') : t('II0008')
            store.commit('helper/PUSH_message', message)
          }
        }
      })
    }
  }

  const shareNode = {
    id: 'share',
    name: t('RR0079'),
    func: (node) => {
      store.dispatch('helper/openModal', {
        component: 'modal-public-library-share',
        properties: {
          workspaceNodeId: Number(node.workspaceNodeId),
          workspaceNodeLocation: Number(node.workspaceNodeLocation)
        }
      })
    }
  }

  return {
    cloneNode,
    shareNode
  }
}
