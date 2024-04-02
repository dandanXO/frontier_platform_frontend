import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { NOTIFY_TYPE } from '@/utils/constants'
import type { FunctionOption } from '@/types'
import { type ShareNodeChild, NodeType } from '@frontier/platform-web-sdk'
import { useShareWithMeStore } from '@/stores/shareWithMe'
import type { PropsModalCloneTo } from '@/components/common/ModalCloneTo.vue'
import generalApi from '@/apis/general'

export enum SHARE_WITH_ME_FUNCTION {
  CLONE = 0,
  DELETE = 1,
}

type ShareWithMeFunctionOption = FunctionOption<
  ShareNodeChild,
  SHARE_WITH_ME_FUNCTION
>

export default function useShareWithMe() {
  const toNodeList = (n: ShareNodeChild | ShareNodeChild[]) =>
    Array.isArray(n) ? n : [n]

  const { ogBaseShareWithMeApi } = useShareWithMeStore()
  const { t } = useI18n()
  const store = useStore()
  const notify = useNotifyStore()

  const shareWithMeClone = (
    sharingId: number,
    nodeIdList: number[],
    isCanClone: boolean,
    msg: string
  ) => {
    if (!isCanClone) {
      return store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.WARNING,
        header: t('GG0016'),
        contentText: t('GG0020'),
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
          await ogBaseShareWithMeApi('cloneShareToMeNode', {
            sharingId,
            nodeIdList,
            targetOgList,
            optional,
          })
          notify.showNotifySnackbar({ messageText: msg })
        },
      } as PropsModalCloneTo,
    })
  }

  const shareWithMeCloneByNodeList: ShareWithMeFunctionOption = {
    id: SHARE_WITH_ME_FUNCTION.CLONE,
    name: () => t('RR0167'),
    func: (n) => {
      const nodeList = toNodeList(n)
      /**
       * 多選 clone 其 sharing id 一定相同 (來自於同一個父層)。
       * 如為單選 clone，但因為將其轉成 Array 型態，故 nodeList[0] 的 sharingId 就是其 sharingId。
       */
      const sharingId = nodeList[0].shareInfo.sharingId
      const nodeIdList = nodeList.map((node) => node.nodeMeta.nodeId)
      const isCanClone = nodeList.every((node) => node.shareInfo.isCanClone)
      const msg = nodeList.some(
        (node) => node.nodeMeta.nodeType === NodeType.COLLECTION
      )
        ? t('II0009')
        : t('II0008')
      shareWithMeClone(sharingId, nodeIdList, isCanClone, msg)
    },
  }

  const shareWithMeDeleteByNodeList: ShareWithMeFunctionOption = {
    id: SHARE_WITH_ME_FUNCTION.DELETE,
    name: () => t('RR0063'),
    func: (n) => {
      const nodeList = toNodeList(n)
      const nodeIdList = nodeList.map((node) => node.nodeMeta.nodeId)
      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.WARNING,
        header: t('HH0004'),
        contentText: t('HH0005'),
        primaryBtnText: t('UU0001'),
        primaryBtnHandler: async () => {
          store.dispatch('helper/openModalLoading')
          await ogBaseShareWithMeApi('deleteShareToMeNode', {
            nodeIdList,
          })
          store.dispatch('helper/closeModalLoading')
          store.dispatch('helper/reloadInnerApp')
        },
        secondaryBtnText: t('UU0002'),
      })
    },
  }

  return {
    shareWithMeClone,
    shareWithMeCloneByNodeList,
    shareWithMeDeleteByNodeList,
  }
}
