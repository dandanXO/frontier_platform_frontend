import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { SOURCE_ASSET_LOCATION, NODE_LOCATION } from '@/utils/constants.js'
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
      store.dispatch('helper/openModalBehavior', {
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
      const { materialId, sourceAssetLocation } = node.properties
      if (sourceAssetLocation === SOURCE_ASSET_LOCATION.ORG) {
        goToOrgAssetMaterialEdit(materialId)
      } else {
        goToGroupAssetMaterialEdit(materialId)
      }
    }
  }

  const duplicateNode = {
    id: FUNCTION_ID.DUPLICATE_NODE,
    name: t('RR0076'),
    func: (node) => {
      const workspaceNodeId = node.workspaceNodeId
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-workspace-node-list',
        properties: {
          modalTitle: t('FF0043'),
          actionText: t('UU0062'),
          actionCallback: async (nodeList) => {
            const result = await new Promise((resolve) => {
              store.dispatch('helper/pushModalConfirm', {
                type: 1,
                header: t('FF0040'),
                contentText: t('FF0048'),
                primaryBtnText: t('UU0001'),
                primaryBtnHandler: resolve.bind(undefined, 'confirm'),
                secondaryBtnText: t('UU0002'),
                secondaryBtnHandler: resolve.bind(undefined, 'cancel')
              })
            })
            if (result === 'confirm') {
              store.dispatch('helper/openModalLoading')
              await store.dispatch('workspace/duplicateNode', {
                workspaceNodeId,
                targetWorkspaceNodeList: nodeList.map(({ nodeKey }) => {
                  const [location, id] = nodeKey.split('-')
                  return { id, location }
                })
              })
              store.dispatch('helper/closeModalLoading')
              store.dispatch('helper/reloadInnerApp')
              store.dispatch('helper/pushFlashMessage', t('FF0047'))
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
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-workspace-node-list',
        properties: {
          modalTitle: t('FF0036'),
          canCrossLocation: false,
          isMultiSelect: false,
          canSelectSelf: false,
          selfNodeKey: `${routeLocation.value === 'org' ? NODE_LOCATION.ORG : NODE_LOCATION.GROUP}-${workspaceNodeId}`,
          actionText: t('UU0061'),
          actionCallback: async (node) => {
            const result = await new Promise((resolve) => {
              store.dispatch('helper/pushModalConfirm', {
                type: 1,
                header: t('FF0040'),
                contentText: t('FF0041'),
                primaryBtnText: t('UU0001'),
                primaryBtnHandler: resolve.bind(undefined, 'confirm'),
                secondaryBtnText: t('UU0002'),
                secondaryBtnHandler: resolve.bind(undefined, 'cancel')
              })
            })
            if (result === 'confirm') {
              store.dispatch('helper/openModalLoading')
              const targetWorkspaceNodeId = node.nodeKey.split('-')[1]
              await store.dispatch('workspace/moveNode', {
                workspaceNodeId,
                targetWorkspaceNodeId
              })
              const { name: collectionName } = await store.dispatch('workspace/getCollection', { workspaceNodeId: targetWorkspaceNodeId })
              store.dispatch('helper/closeModalLoading')
              store.dispatch('helper/reloadInnerApp')
              store.dispatch('helper/pushFlashMessage', t('FF0042', { collectionName }))
            }
          }
        }
      })
    }
  }

  const deleteNodeList = async (workspaceNodeIdList, header, contentText) => {
    const result = await new Promise((resolve) => {
      store.dispatch('helper/pushModalConfirm', {
        type: 1,
        header,
        contentText,
        primaryBtnText: t('UU0001'),
        primaryBtnHandler: resolve.bind(undefined, 'confirm'),
        secondaryBtnText: t('UU0002'),
        secondaryBtnHandler: resolve.bind(undefined, 'cancel')
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
    func: (nodeList) => {
      const workspaceNodeIdList = nodeList.map(node => node.workspaceNodeId)
      deleteNodeList(workspaceNodeIdList, t('FF0004'), t('FF0005'))
    }
  }

  const shareNode = {
    id: FUNCTION_ID.SHARE_NODE,
    name: t('RR0079'),
    func: (node) => {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-share',
        properties: {
          nodeKey: node.nodeKey,
          workspaceNodeId: node.workspaceNodeId,
          nodeType: node.nodeType
        }
      })
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
