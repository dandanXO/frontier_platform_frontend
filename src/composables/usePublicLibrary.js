import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { TARGET_LOCATION } from '@/utils/constants.js'

export default function usePublicLibrary () {
  const { t } = useI18n()
  const store = useStore()

  const FUNCTION_ID = {
    CLONE_NODE: 1,
    SHARE_NODE: 2
  }

  const cloneNode = {
    id: FUNCTION_ID.CLONE_NODE,
    name: t('UU0034'),
    func: (v) => {
      const workspaceNodeKeyList = Array.isArray(v) ? v : [v]
      const workspaceNodeList = workspaceNodeKeyList.map(key => {
        const [location, id] = key.split('-')
        return {
          id,
          location
        }
      })
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
            store.dispatch('helper/openModalLoading')
            await store.dispatch('publicLibrary/cloneNode', { workspaceNodeList, targetLocationList })
            store.dispatch('helper/closeModalLoading')
          }
        }
      })
    }
  }

  const shareNode = {
    id: FUNCTION_ID.SHARE_NODE,
    name: t('RR0079'),
    func: (workspaceNodeId) => {
    }
  }

  return {
    cloneNode,
    shareNode
  }
}
