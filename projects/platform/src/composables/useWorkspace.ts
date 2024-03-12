import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { NOTIFY_TYPE, CREATE_EDIT } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'
import type {
  Collection,
  MainMaterial,
  NodeChild,
  NodeMeta,
} from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'
import type { PropsModalCreateOrEditCollection } from '@/components/workspace/ModalCreateOrEditCollection.vue'
import type { PropsModalWorkspaceNodeList } from '@/components/workspace/ModalWorkspaceNodeList.vue'
import type { PropsModalShare } from '@/components/workspace/ModalShare.vue'
import { useWorkspaceStore } from '@/stores/workspace'

enum WORKSPACE_FUNCTION {
  EDIT_COLLECTION = 0,
  EDIT_MATERIAL = 1,
  DUPLICATE_NODE = 2,
  MOVE_NODE = 3,
  DELETE_NODE = 4,
  SHARE_NODE = 5,
}

type WorkspaceFunctionOption = FunctionOption<NodeChild, WORKSPACE_FUNCTION>

export default function useWorkspace() {
  const toNode = (n: NodeChild | NodeChild[]) => (Array.isArray(n) ? n[0] : n)
  const toNodeList = (n: NodeChild | NodeChild[]) =>
    Array.isArray(n) ? n : [n]

  const { t } = useI18n()
  const store = useStore()
  const notify = useNotifyStore()
  const { ogBaseWorkspaceApi } = useWorkspaceStore()
  const { goToAssetMaterialEdit } = useNavigation()

  const openModalCreateOrEditCollection = (
    mode: CREATE_EDIT,
    nodeMeta: NodeMeta,
    collection: Collection
  ) => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-create-or-edit-collection',
      properties: {
        mode,
        nodeMeta,
        collection,
      } as PropsModalCreateOrEditCollection,
    })
  }

  const editNodeCollection: WorkspaceFunctionOption = {
    id: WORKSPACE_FUNCTION.EDIT_COLLECTION,
    name: () => t('RR0054'),
    func: (n) => {
      const node = toNode(n)
      openModalCreateOrEditCollection(
        CREATE_EDIT.EDIT,
        node.nodeMeta,
        node.nodeProperty as Collection
      )
    },
  }

  const editNodeMaterial: WorkspaceFunctionOption = {
    id: WORKSPACE_FUNCTION.EDIT_MATERIAL,
    name: () => t('RR0054'),
    func: (n) => {
      const node = toNode(n)
      const { materialId, metaData } = node.nodeProperty as MainMaterial
      goToAssetMaterialEdit(materialId, metaData.materialOwnerOGType)
    },
  }

  const duplicateNode: WorkspaceFunctionOption = {
    id: WORKSPACE_FUNCTION.DUPLICATE_NODE,
    name: () => t('RR0076'),
    func: (n) => {
      const node = toNode(n)
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-workspace-node-list',
        properties: {
          modalTitle: t('FF0043'),
          actionText: t('UU0062'),
          actionCallback: async (nodeIdList) => {
            const result = await new Promise((resolve) => {
              store.dispatch('helper/pushModalConfirm', {
                type: NOTIFY_TYPE.WARNING,
                header: t('FF0040'),
                contentText: t('FF0048'),
                primaryBtnText: t('UU0001'),
                primaryBtnHandler: resolve.bind(undefined, 'confirm'),
                secondaryBtnText: t('UU0002'),
                secondaryBtnHandler: resolve.bind(undefined, 'cancel'),
              })
            })
            if (result === 'confirm') {
              store.dispatch('helper/openModalLoading')
              await ogBaseWorkspaceApi('duplicateWorkspaceNode', {
                nodeId: node.nodeMeta.nodeId,
                targetNodeIdList: nodeIdList,
              })
              store.dispatch('helper/closeModalLoading')
              store.dispatch('helper/reloadInnerApp')
              notify.showNotifySnackbar({ messageText: t('FF0047') })
            }
          },
        } as PropsModalWorkspaceNodeList,
      })
    },
  }

  const moveNode: WorkspaceFunctionOption = {
    id: WORKSPACE_FUNCTION.MOVE_NODE,
    name: () => t('RR0077'),
    func: (n) => {
      const node = toNode(n)
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-workspace-node-list',
        properties: {
          modalTitle: t('FF0036'),
          canCrossLocation: false,
          isMultiSelect: false,
          canSelectSelf: false,
          selfNodeId: node.nodeMeta.nodeId,
          actionText: t('UU0061'),
          actionCallback: async (nodeIdList) => {
            const result = await new Promise((resolve) => {
              store.dispatch('helper/pushModalConfirm', {
                type: NOTIFY_TYPE.WARNING,
                header: t('FF0040'),
                contentText: t('FF0041'),
                primaryBtnText: t('UU0001'),
                primaryBtnHandler: resolve.bind(undefined, 'confirm'),
                secondaryBtnText: t('UU0002'),
                secondaryBtnHandler: resolve.bind(undefined, 'cancel'),
              })
            })
            if (result === 'confirm') {
              store.dispatch('helper/openModalLoading')

              await ogBaseWorkspaceApi('moveWorkspaceNode', {
                nodeId: node.nodeMeta.nodeId,
                targetNodeId: nodeIdList[0],
              })
              const {
                data: { result },
              } = await ogBaseWorkspaceApi('getWorkspaceList', {
                nodeId: nodeIdList[0],
                filter: null,
                search: null,
                pagination: {
                  perPageCount: 40,
                  targetPage: 1,
                  isShowMatch: false,
                  sort: 4,
                },
              })
              store.dispatch('helper/closeModalLoading')
              store.dispatch('helper/reloadInnerApp')
              notify.showNotifySnackbar({
                messageText: t('FF0042', {
                  collectionName:
                    result.workspaceNodeCollection.collection.name,
                }),
              })
            }
          },
        } as PropsModalWorkspaceNodeList,
      })
    },
  }

  const deleteNodeList = async (
    nodeIdList: number[],
    header: string,
    contentText: string
  ) => {
    const result = await new Promise((resolve) => {
      store.dispatch('helper/pushModalConfirm', {
        type: NOTIFY_TYPE.WARNING,
        header,
        contentText,
        primaryBtnText: t('UU0001'),
        primaryBtnHandler: resolve.bind(undefined, 'confirm'),
        secondaryBtnText: t('UU0002'),
        secondaryBtnHandler: resolve.bind(undefined, 'cancel'),
      })
    })
    if (result === 'confirm') {
      store.dispatch('helper/openModalLoading')
      await ogBaseWorkspaceApi('deleteWorkspaceNode', {
        nodeIdList,
      })
      store.dispatch('helper/closeModalLoading')
      store.dispatch('helper/reloadInnerApp')
    }
  }

  const deleteCollection: WorkspaceFunctionOption = {
    id: WORKSPACE_FUNCTION.DELETE_NODE,
    name: () => t('RR0063'),
    func: (n) => {
      const node = toNode(n)
      deleteNodeList([node.nodeMeta.nodeId], t('FF0044'), t('FF0045'))
    },
  }

  const deleteMaterial: WorkspaceFunctionOption = {
    id: WORKSPACE_FUNCTION.DELETE_NODE,
    name: () => t('RR0063'),
    func: (n) => {
      const node = toNode(n)
      deleteNodeList([node.nodeMeta.nodeId], t('FF0046'), t('FF0045'))
    },
  }

  const deleteMultipleNode: WorkspaceFunctionOption = {
    id: WORKSPACE_FUNCTION.DELETE_NODE,
    name: () => t('RR0063'),
    func: (n) => {
      const nodeIdList = toNodeList(n).map((node) => node.nodeMeta.nodeId)
      deleteNodeList(nodeIdList, t('FF0004'), t('FF0005'))
    },
  }

  const shareNode: WorkspaceFunctionOption = {
    id: WORKSPACE_FUNCTION.SHARE_NODE,
    name: () => t('RR0079'),
    func: (n) => {
      const node = toNode(n)
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-share',
        properties: {
          node,
        } as PropsModalShare,
      })
    },
  }

  return {
    editNodeCollection,
    editNodeMaterial,
    duplicateNode,
    moveNode,
    shareNode,
    deleteMultipleNode,
    deleteCollection,
    deleteMaterial,
    openModalCreateOrEditCollection,
  }
}
