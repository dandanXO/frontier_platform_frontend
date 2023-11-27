import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useNavigation from '@/composables/useNavigation'
import { NOTIFY_TYPE } from '@/utils/constants'
import { useOuterStore } from '@/stores/outer'
import type { FunctionOption } from '@/types'
import {
  type NodeChild,
  OgType,
  type Organization,
} from '@frontier/platform-web-sdk'
import { storeToRefs } from 'pinia'
import type { PropsModalCloneTo } from '@/components/common/ModalCloneTo.vue'
import generalApi from '@/apis/general'
import { computed } from 'vue'
import type { PropsModalChooseSavePlace } from '@/components/common/ModalChooseSavePlace.vue'

enum RECEIVED_SHARE_FUNCTION {
  CLONE = 0,
}

type ReceivedShareFunctionOption = FunctionOption<
  NodeChild,
  RECEIVED_SHARE_FUNCTION
>

export default function useReceivedShare() {
  const toNodeList = (n: NodeChild | NodeChild[]) =>
    Array.isArray(n) ? n : [n]

  const { t } = useI18n()
  const store = useStore()
  const { goToLobby } = useNavigation()
  const outerStore = useOuterStore()
  const { ogBaseReceivedShareApi } = outerStore
  const { shareInfo } = storeToRefs(outerStore)

  const organizationList = computed(
    () => store.getters['user/organizationList'] as Organization[]
  )

  const openNewTabAndGoToAssets = (
    ogNo: string,
    ogType: OgType,
    ogId: number
  ) => {
    window.open(
      `${window.location.origin}/${ogNo}/${ogType}-${ogId}/assets`,
      '_blank'
    )
  }

  const saveReceivedShare = async () => {
    if (!shareInfo.value) {
      throw 'shareInfo is not exist'
    }

    const { isCanSave, sharingKey } = shareInfo.value

    if (isCanSave && organizationList.value.length >= 1) {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-choose-save-place',
        properties: {
          title: t('RR0213'),
          actionHandler: async (targetOrgId, targetOgType, targetOgId) => {
            store.dispatch('helper/pushModalLoading')
            await ogBaseReceivedShareApi('saveReceivedShare', {
              sharingKey,
              targetOrgId,
              targetOgType,
              targetOgId,
            })
            store.dispatch('helper/closeModalLoading')

            const org = organizationList.value.find(
              (org) => org.orgId === targetOrgId
            )!
            openNewTabAndGoToAssets(org.orgNo, targetOgType, targetOgId)
            store.dispatch('helper/clearModalPipeline')
          },
        } as PropsModalChooseSavePlace,
      })
    } else if (isCanSave && organizationList.value.length === 0) {
      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.ALERT,
        header: t('GG0010'),
        contentText: t('GG0033'),
        primaryBtnText: t('UU0072'),
        primaryBtnHandler: goToLobby,
        secondaryBtnText: t('UU0002'),
      })
    } else {
      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.WARNING,
        header: t('RR0214'),
        contentText: t('GG0015'),
        primaryBtnText: t('UU0031'),
      })
    }
  }

  const receivedShareClone = async (nodeIdList: number[]) => {
    if (!shareInfo.value) {
      throw 'shareInfo is not exist'
    }

    const { isCanClone, sharingKey } = shareInfo.value

    if (isCanClone && organizationList.value.length >= 1) {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-clone-to',
        properties: {
          crossOrg: true,
          checkHandler: async (orgId) => {
            const res = await generalApi.cloneCheckByNode({
              orgId,
              nodeIdList,
            })
            return res.data.result.estimatedQuota
          },
          cloneHandler: async (targetOgList, optional, orgId) => {
            await ogBaseReceivedShareApi('cloneReceivedShareNode', {
              sharingKey,
              nodeIdList,
              targetOgList,
              optional,
            })
            const org = organizationList.value.find(
              (org) => org.orgId === orgId
            )!
            openNewTabAndGoToAssets(org.orgNo, OgType.ORG, orgId)
          },
        } as PropsModalCloneTo,
      })
    } else if (isCanClone && organizationList.value.length === 0) {
      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.ALERT,
        header: t('GG0017'),
        contentText: t('GG0034'),
        primaryBtnText: t('UU0072'),
        primaryBtnHandler: goToLobby,
        secondaryBtnText: t('UU0002'),
      })
    } else {
      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.WARNING,
        header: t('GG0016'),
        contentText: t('GG0020'),
        primaryBtnText: t('UU0031'),
      })
    }
  }

  const receivedShareCloneByNodeList: ReceivedShareFunctionOption = {
    id: RECEIVED_SHARE_FUNCTION.CLONE,
    name: () => t('RR0167'),
    func: (n) => {
      const nodeList = toNodeList(n)
      const nodeIdList = nodeList.map((node) => node.nodeMeta.nodeId)
      receivedShareClone(nodeIdList)
    },
  }

  return {
    saveReceivedShare,
    receivedShareCloneByNodeList,
    receivedShareClone,
  }
}
