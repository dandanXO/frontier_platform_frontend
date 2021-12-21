import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { SOURCE_ASSET_LOCATION } from '@/utils/constants.js'
import useNavigation from '@/composables/useNavigation.js'

export default function useWorkspace () {
  const { t } = useI18n()
  const store = useStore()
  const {
    goToOrgAssetMaterialEdit,
    goToGroupAssetMaterialEdit
  } = useNavigation()

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
    func: (node) => {
      const workspaceNodeId = node.workspaceNodeId
      store.dispatch('helper/openModal', {
        component: 'modal-create-or-edit-collection',
        properties: {
          mode: 2,
          workspaceNodeId
        }
      })
    }
  }

  const editMaterial = {
    id: FUNCTION_ID.EDIT_MATERIAL,
    name: t('RR0054'),
    func: (node) => {
      const { sourceAssetLocation } = node
      if (sourceAssetLocation === SOURCE_ASSET_LOCATION.ORG) {
        goToOrgAssetMaterialEdit(node.materialId)
      } else {
        goToGroupAssetMaterialEdit(node.materialId)
      }
    }
  }

  const duplicateNode = {
    id: FUNCTION_ID.DUPLICATE_NODE,
    name: t('RR0076'),
    func: (node) => {
      const workspaceNodeId = node.workspaceNodeId
      store.dispatch('helper/openModal', {
        component: 'modal-workspace-node-list',
        properties: {
          modalTitle: t('FF0043'),
          canCrossLocation: routeLocation.value === 'org',
          actionText: t('UU0062'),
          actionCallback: async (selectedNodeKeyList) => {
            const result = await new Promise((resolve) => {
              store.dispatch('helper/pushModalConfirm', {
                title: t('FF0040'),
                content: t('FF0048'),
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
                targetWorkspaceNodeList: selectedNodeKeyList.map(nodeKey => {
                  const [location, id] = nodeKey.split('-')
                  return { id, location }
                })
              })
              store.dispatch('helper/closeModalLoading')
              store.dispatch('helper/reloadInnerApp')
              store.commit('helper/PUSH_message', t('FF0047'))
            }
          }
        }
      })
    }
  }

  const moveNode = {
    id: FUNCTION_ID.MOVE_NODE,
    name: t('RR0077'),
    func: (node) => {
      const workspaceNodeId = node.workspaceNodeId
      store.dispatch('helper/openModal', {
        component: 'modal-workspace-node-list',
        properties: {
          modalTitle: t('FF0036'),
          canCrossLocation: false,
          isMultiSelect: false,
          actionText: t('UU0061'),
          actionCallback: async (selectedNodeKey) => {
            const result = await new Promise((resolve) => {
              store.dispatch('helper/pushModalConfirm', {
                title: t('FF0040'),
                content: t('FF0041'),
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
              const { name: collectionName } = await store.dispatch('workspace/getCollection', { workspaceNodeId: targetWorkspaceNodeId })
              store.dispatch('helper/closeModalLoading')
              store.dispatch('helper/reloadInnerApp')
              store.commit('helper/PUSH_message', t('FF0042', { collectionName }))
            }
          }
        }
      })
    }
  }

  const deleteNodeList = async (workspaceNodeIdList, title, content) => {
    const result = await new Promise((resolve) => {
      store.dispatch('helper/pushModalConfirm', {
        title,
        content,
        primaryText: t('UU0002'),
        primaryHandler: resolve.bind(undefined, 'cancel'),
        secondaryText: t('UU0001'),
        secondaryHandler: resolve.bind(undefined, 'confirm')
      })
    })
    if (result === 'confirm') {
      store.dispatch('helper/openModalLoading')
      await store.dispatch('workspace/deleteNode', { workspaceNodeIdList })
      store.dispatch('helper/closeModalLoading')
      store.dispatch('helper/reloadInnerApp')
    }
  }

  const deleteCollection = {
    id: FUNCTION_ID.DELETE_NODE,
    name: t('RR0063'),
    func: (node) => {
      const workspaceNodeId = node.workspaceNodeId
      deleteNodeList([workspaceNodeId], t('FF0044'), t('FF0045'))
    }
  }

  const deleteMaterial = {
    id: FUNCTION_ID.DELETE_NODE,
    name: t('RR0063'),
    func: (node) => {
      const workspaceNodeId = node.workspaceNodeId
      deleteNodeList([workspaceNodeId], t('FF0046'), t('FF0045'))
    }
  }

  const deleteMultipleNode = {
    id: FUNCTION_ID.DELETE_NODE,
    name: t('RR0063'),
    func: (workspaceNodeKeyList) => {
      const workspaceNodeIdList = workspaceNodeKeyList.map(key => (key.split('-')[1]))
      deleteNodeList(workspaceNodeIdList, t('FF0004'), t('FF0005'))
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
    shareNode,
    deleteMultipleNode,
    deleteCollection,
    deleteMaterial
  }
}
