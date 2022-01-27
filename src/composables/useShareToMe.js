import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { TARGET_LOCATION } from '@/utils/constants.js'

export default function useShareToMe () {
  const { t } = useI18n()
  const store = useStore()

  const cloneNode = {
    id: 'clone',
    name: t('RR0056'),
    func: (v, isCanClone) => {
      if (!isCanClone) {
        return store.dispatch('helper/openModalConfirm', {
          title: t('GG0016'),
          content: t('GG0020'),
          primaryText: t('UU0031')
        })
      }

      const workspaceNodeKeyList = Array.isArray(v) ? v : [v]
      const workspaceNodeList = workspaceNodeKeyList.map(key => {
        const [location, id] = key.split('-')
        return {
          id: Number(id),
          location: Number(location)
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
            await store.dispatch('shareToMe/cloneShareToMe', {
              workspaceNodeList,
              targetLocationList
            })
            store.dispatch('helper/closeModalLoading')
          }
        }
      })
    }
  }

  const deleteNode = {
    id: 'delete',
    name: t('RR0063'),
    func: () => { }
  }

  return {
    cloneNode,
    deleteNode
  }
}
