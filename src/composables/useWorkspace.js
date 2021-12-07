import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { inject, computed } from 'vue'

export default function useWorkspace () {
  const { t } = useI18n()
  const store = useStore()
  const reloadRootRoute = inject('reloadRootRoute')

  const routeLocation = computed(() => store.getters['helper/routeLocation'])

  const FUNCTION_ID = {
    EDIT_COLLECTION: 0,
    EDIT_MATERIAL: 1,
    DUPLICATE_NODE: 2,
    MOVE_NODE: 3,
    DELETE_NODE: 4,
    SHARE_NODE: 5
  }

  const editCollection = {
    id: FUNCTION_ID.EDIT_COLLECTION,
    name: t('RR0054'),
    func: () => {
      console.log('here')
    }
  }

  const editMaterial = {
    id: FUNCTION_ID.EDIT_MATERIAL,
    name: t('RR0054'),
    func: () => {
      console.log('here')
    }
  }

  const duplicateNode = {
    id: FUNCTION_ID.DUPLICATE_NODE,
    name: t('RR0076'),
    func: (workspaceNodeId) => {
      store.dispatch('helper/openModal', {
        component: 'modal-workspace-node-list',
        properties: {
          modalTitle: t('FF.duplicate.workspace'),
          canCrossLocation: routeLocation.value === 'org',
          actionText: t('FF.duplicate.to'),
          actionCallback: async (selectedNodeKeyList) => {
            const result = await new Promise((resolve) => {
              store.dispatch('helper/pushModalConfirm', {
                title: t('FF.permision.change'),
                content: t('FF.The permissions of the collection will be changed to be consistent with the permissions of the collection being placed'),
                primaryText: t('UU0001'),
                primaryHandler: resolve.bind(undefined, 'confirm'),
                secondaryText: t('UU0002'),
                secondaryHandler: resolve.bind(undefined, 'cancel')
              })
            })
            if (result === 'confirm') {
              store.dispatch('helper/openModalLoading')
              await store.dispatch('workspace/duplicateNode', {
                workspaceNodeId,
                targetWorkspaceNodeIdList: selectedNodeKeyList.map(nodeKey => {
                  const [type, id] = nodeKey.split('-')
                  return { id, type }
                })
              })
              store.dispatch('helper/closeModalLoading')
              reloadRootRoute()
            }
          }
        }
      })
    }
  }

  const moveNode = {
    id: FUNCTION_ID.MOVE_NODE,
    name: t('RR0077'),
    func: (workspaceNodeId) => {
      store.dispatch('helper/openModal', {
        component: 'modal-workspace-node-list',
        properties: {
          modalTitle: t('FF.move.workspace'),
          canCrossLocation: false,
          isMultiSelect: false,
          actionText: t('FF.move.to'),
          actionCallback: async (selectedNodeKey) => {
            const result = await new Promise((resolve) => {
              store.dispatch('helper/pushModalConfirm', {
                title: t('FF.permision.change'),
                content: t('FF.The permissions of the collection will be changed to be consistent with the permissions of the collection being placed'),
                primaryText: t('UU0001'),
                primaryHandler: resolve.bind(undefined, 'confirm'),
                secondaryText: t('UU0002'),
                secondaryHandler: resolve.bind(undefined, 'cancel')
              })
            })
            if (result === 'confirm') {
              store.dispatch('helper/openModalLoading')
              const targetWorkspaceNodeId = selectedNodeKey.split('-')[1]
              await store.dispatch('workspace/moveNode', {
                workspaceNodeId,
                targetWorkspaceNodeId
              })
              store.dispatch('helper/closeModalLoading')
              reloadRootRoute()
            }
          }
        }
      })
    }
  }

  const deleteNode = {
    id: FUNCTION_ID.DELETE_NODE,
    name: t('RR0063'),
    func: (v) => {
      const workspaceNodeIdList = Array.isArray(v) ? v : [v]
      console.log('here', workspaceNodeIdList)
    }
  }

  const shareNode = {
    id: FUNCTION_ID.SHARE_NODE,
    name: t('RR0079'),
    func: () => {
      console.log('here')
    }
  }

  return {
    editCollection,
    editMaterial,
    duplicateNode,
    moveNode,
    deleteNode,
    shareNode
  }
}
