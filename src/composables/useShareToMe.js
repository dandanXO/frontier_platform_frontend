import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { TARGET_LOCATION, NODE_TYPE } from '@/utils/constants.js'

export default function useShareToMe () {
  const { t } = useI18n()
  const store = useStore()

  const cloneNode = {
    id: 'clone',
    name: t('RR0056'),
    func: (v) => {
      const nodeList = Array.isArray(v) ? v : [v]
      const isCanClone = nodeList.every(node => node.share.isCanClone)

      if (!isCanClone) {
        return store.dispatch('helper/openModalConfirm', {
          title: t('GG0016'),
          content: t('GG0020'),
          primaryText: t('UU0031')
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
            await store.dispatch('shareToMe/cloneShareToMe', {
              workspaceNodeList,
              targetLocationList
            })
            store.dispatch('helper/closeModalLoading')

            const isContainCollection = nodeList.some(node => node.nodeType === NODE_TYPE.COLLECTION)
            const message = isContainCollection ? t('HH0011') : t('HH0012')
            store.commit('helper/PUSH_message', message)
          }
        }
      })
    }
  }

  const deleteNode = {
    id: 'delete',
    name: t('RR0063'),
    func: (v) => {
      const nodeList = Array.isArray(v) ? v : [v]
      const workspaceNodeList = nodeList.map(({ workspaceNodeId, workspaceNodeLocation }) => {
        return {
          id: Number(workspaceNodeId),
          location: Number(workspaceNodeLocation)
        }
      })
      store.dispatch('helper/openModalConfirm', {
        title: t('HH0004'),
        content: t('HH0005'),
        primaryText: t('UU0002'),
        secondaryText: t('UU0001'),
        secondaryHandler: async () => {
          store.dispatch('helper/openModalLoading')
          await store.dispatch('shareToMe/deleteShareToMe', { workspaceNodeList })
          store.dispatch('helper/closeModalLoading')
        }
      })
    }
  }

  return {
    cloneNode,
    deleteNode
  }
}
