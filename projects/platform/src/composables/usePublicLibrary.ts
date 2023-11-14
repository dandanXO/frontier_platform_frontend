import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { NOTIFY_TYPE } from '@/utils/constants'
import type { FunctionOption } from '@/types'
import { type NodeChild, NodeType } from '@frontier/platform-web-sdk'
import type { PropsModalCloneTo } from '@/components/common/ModalCloneTo.vue'
import generalApi from '@/apis/general'
import { usePublicLibraryStore } from '@/stores/publicLibrary'

enum PUBLIC_LIBRARY_FUNCTION {
  CLONE = 0,
  SHARE = 1,
}

type PublicLibraryFunctionOption = FunctionOption<
  NodeChild,
  PUBLIC_LIBRARY_FUNCTION
>

export default function usePublicLibrary() {
  const toNode = (n: NodeChild | NodeChild[]) => (Array.isArray(n) ? n[0] : n)
  const toNodeList = (n: NodeChild | NodeChild[]) =>
    Array.isArray(n) ? n : [n]

  const { t } = useI18n()
  const store = useStore()
  const notify = useNotifyStore()
  const { ogBasePublicLibraryApi } = usePublicLibraryStore()

  const publicLibraryClone = (
    nodeIdList: number[],
    isCanClone: boolean,
    msg: string
  ) => {
    if (!isCanClone) {
      return store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.WARNING,
        header: t('II0013'),
        contentText: t('II0014'),
        primaryBtnText: t('UU0031'),
      })
    }

    store.dispatch('helper/openModalBehavior', {
      component: 'modal-clone-to',
      properties: {
        checkHandler: async (orgId) => {
          const res = await generalApi.cloneCheckByNode({
            orgId,
            nodeIdList,
          })
          return res.data.result.estimatedQuota
        },
        cloneHandler: async (targetOgList, optional) => {
          await ogBasePublicLibraryApi('clonePublicLibraryNode', {
            nodeIdList,
            targetOgList,
            optional,
          })
          notify.showNotifySnackbar({ messageText: msg })
        },
      } as PropsModalCloneTo,
    })
  }

  const publicLibraryCloneByNodeList: PublicLibraryFunctionOption = {
    id: PUBLIC_LIBRARY_FUNCTION.CLONE,
    name: () => t('RR0167'),
    func: (n) => {
      const nodeList = toNodeList(n)
      const nodeIdList = nodeList.map((node) => node.nodeMeta.nodeId)
      const isCanClone = nodeList.every((node) => node.nodeMeta.isCanClone)
      const msg = nodeList.some(
        (node) => node.nodeMeta.nodeType === NodeType.COLLECTION
      )
        ? t('II0009')
        : t('II0008')
      publicLibraryClone(nodeIdList, isCanClone, msg)
    },
  }

  const publicLibraryShare: PublicLibraryFunctionOption = {
    id: PUBLIC_LIBRARY_FUNCTION.SHARE,
    name: () => t('RR0079'),
    func: (n) => {
      const node = toNode(n)
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-public-library-share',
        properties: {
          nodeKey: node.nodeMeta.nodeId,
          isCanShared: node.nodeMeta.isCanShared,
        },
      })
    },
  }

  return {
    publicLibraryClone,
    publicLibraryCloneByNodeList,
    publicLibraryShare,
  }
}
