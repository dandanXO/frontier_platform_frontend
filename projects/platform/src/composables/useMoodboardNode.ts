import type { Ref } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import {
  NOTIFY_TYPE,
  PROGRESS_TAB,
  CREATE_EDIT,
  NATIVE_EXTENSION,
} from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import type {
  Moodboard,
  MoodboardNodeCollection,
  MoodboardNodeChild,
  Material,
  Collection,
} from '@frontier/platform-web-sdk'
import { NodeType, MaterialU3mStatus } from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'
import type { PropsModalCloneTo } from '@/components/common/ModalCloneTo.vue'
import { useMoodboardStore } from '@/stores/moodboard'
import type { PropsModalU3mDownload } from '@/components/common/material/u3m/ModalU3mDownload.vue'
import type { PropsModalMoodboardCollectionDetail } from '@/components/moodboard/ModalMoodboardCollectionDetail.vue'
import type { PropsModalCreateOrEditMoodboardCollection } from '@/components/moodboard/ModalCreateOrEditMoodboardCollection.vue'
import type { PropsModalMoodboardMaterialDetail } from '@/components/moodboard/ModalMoodboardMaterialDetail.vue'
import { downloadBase64File } from '@frontier/lib'

enum MOODBOARD_FUNCTION {
  CLONE = 1,
  DOWNLOAD_U3M = 2,
  EXPORT = 3,
  DELETE = 4,
  EDIT = 5,
}

type MoodboardFunctionOption = FunctionOption<
  MoodboardNodeChild,
  MOODBOARD_FUNCTION
>

export default function useMoodboardNode(
  moodboard: Ref<Moodboard>,
  moodboardNodeCollection: Ref<MoodboardNodeCollection | undefined>
) {
  const toNode = (n: MoodboardNodeChild | MoodboardNodeChild[]) =>
    Array.isArray(n) ? n[0] : n
  const toNodeList = (n: MoodboardNodeChild | MoodboardNodeChild[]) =>
    Array.isArray(n) ? n : [n]

  const store = useStore()
  const notify = useNotifyStore()
  const { t } = useI18n()
  const { ogBaseMoodboardApi } = useMoodboardStore()
  const { goToProgress } = useNavigation()

  const { moodboardId, moodboardType } = moodboard.value

  const cloneMoodboardNode: MoodboardFunctionOption = {
    id: MOODBOARD_FUNCTION.CLONE,
    icon: () => 'content_copy',
    name: () => t('UU0015'),
    func: (n) => {
      const nodeList = toNodeList(n)
      const msg = nodeList.some(
        (node) => node.nodeMeta.nodeType === NodeType.COLLECTION
      )
        ? t('II0009')
        : t('II0008')
      const nodeIdList = nodeList.map((node) => node.nodeMeta.nodeId)
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-clone-to',
        properties: {
          checkHandler: async () => {
            const res = await ogBaseMoodboardApi(
              'checkCloneMoodboardOfferNode',
              {
                nodeIdList,
              }
            )
            return res.data.result.estimatedQuota
          },
          cloneHandler: async (targetOgList, optional) => {
            await ogBaseMoodboardApi('cloneMoodboardNode', {
              nodeIdList,
              targetOgList,
              optional,
            })
            notify.showNotifySnackbar({ messageText: msg })
          },
        } as PropsModalCloneTo,
      })
    },
  }

  const downloadU3m: MoodboardFunctionOption = {
    id: MOODBOARD_FUNCTION.DOWNLOAD_U3M,
    icon: () => '3D_material',
    name: () => t('RR0059'),
    disabled: (n) =>
      toNodeList(n).every((node) => {
        const { u3m, customU3m } = node.nodeProperty as Material
        return (
          u3m.status !== MaterialU3mStatus.COMPLETED &&
          customU3m.status !== MaterialU3mStatus.COMPLETED
        )
      }),
    func: (n) => {
      const nodeList = toNodeList(n)
      const materialU3mList = nodeList.map(({ nodeProperty }) => {
        const { materialId, itemNo, u3m, customU3m } = nodeProperty as Material
        return {
          materialId,
          itemNo,
          u3m,
          customU3m,
        }
      })
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-u3m-download',
        properties: { materialU3mList } as PropsModalU3mDownload,
      })
    },
  }

  const exportMoodboardNode: MoodboardFunctionOption = {
    id: MOODBOARD_FUNCTION.EXPORT,
    name: () => t('RR0060'),
    func: async (n) => {
      const nodeIdList = toNodeList(n).map((node) => node.nodeMeta.nodeId)
      if (nodeIdList.length >= 100) {
        await ogBaseMoodboardApi('massExportMoodboardOfferPicked', {
          moodboardId,
          nodeIdList,
        })
        store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.SUCCESS,
          header: t('PP0030'),
          contentText: t('PP0031'),
          primaryBtnText: t('UU0031'),
          secondaryBtnText: t('UU0090'),
          secondaryBtnHandler: () => {
            goToProgress({}, PROGRESS_TAB.EXCEL)
            store.dispatch('helper/closeModalBehavior')
          },
        })
      } else {
        store.dispatch('helper/openModalLoading')
        const { data } = await ogBaseMoodboardApi(
          'exportMoodboardOfferPicked',
          {
            moodboardId,
            nodeIdList,
          }
        )
        const { extension, file, fileName } = data.result
        downloadBase64File(file, extension as NATIVE_EXTENSION, fileName)
        store.dispatch('helper/closeModalLoading')
      }
    },
  }

  const deleteMoodboardNode: MoodboardFunctionOption = {
    id: MOODBOARD_FUNCTION.DELETE,
    name: () => t('UU0013'),
    func: async (n) => {
      const nodeList = toNodeList(n)
      const isContainCollection = nodeList.some(
        (node) => node.nodeMeta.nodeType === NodeType.COLLECTION
      )
      const nodeIdList = nodeList.map((node) => node.nodeMeta.nodeId)
      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.WARNING,
        header: isContainCollection ? t('QQ0072') : t('QQ0065'),
        contentText: isContainCollection ? t('QQ0073') : t('QQ0066'),
        primaryBtnText: t('UU0091'),
        primaryBtnHandler: async () => {
          await ogBaseMoodboardApi('deleteMoodboardOfferNode', {
            nodeIdList,
          })
          store.dispatch('helper/reloadInnerApp')
        },
        secondaryBtnText: t('UU0002'),
      })
    },
  }

  const editMoodboardNodeCollection: MoodboardFunctionOption = {
    id: MOODBOARD_FUNCTION.EDIT,
    name: () => t('UU0027'),
    func: (n) => {
      const node = toNode(n)
      openModalCreateOrEditMoodboardCollection(
        CREATE_EDIT.EDIT,
        node.nodeMeta.nodeId,
        moodboardNodeCollection.value!.collection
      )
    },
  }

  const openModalCreateOrEditMoodboardCollection = (
    mode: CREATE_EDIT,
    nodeId: number,
    collection?: Collection
  ) => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-create-or-edit-moodboard-collection',
      properties: {
        mode,
        nodeId,
        collection,
      } as PropsModalCreateOrEditMoodboardCollection,
    })
  }

  const togglePick = (
    node: MoodboardNodeChild,
    willRemove: boolean,
    willRecovery: boolean
  ) => {
    if (!moodboardNodeCollection.value) {
      return
    }

    if (node.moodboardInfo.isPicked) {
      ogBaseMoodboardApi('unpickMoodboardOfferNode', {
        nodeId: node.nodeMeta.nodeId,
      })
      if (willRemove) {
        const index = moodboardNodeCollection.value.childNodeList.findIndex(
          (cNode) => cNode.nodeMeta.nodeId === node.nodeMeta.nodeId
        )
        moodboardNodeCollection.value.childNodeList.splice(index, 1)
      }
    } else {
      ogBaseMoodboardApi('pickMoodboardOfferNode', {
        nodeId: node.nodeMeta.nodeId,
      })
      if (willRecovery) {
        moodboardNodeCollection.value.childNodeList.push(node)
      }
    }
    node.moodboardInfo.isPicked = !node.moodboardInfo.isPicked
  }

  const openModalMoodboardMaterialDetail = (
    node: MoodboardNodeChild,
    willRemove = false,
    willRecovery = false
  ) => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-moodboard-material-detail',
      properties: {
        node,
        moodboardType,
        pickHandler: togglePick.bind(null, node, willRemove, willRecovery),
      } as PropsModalMoodboardMaterialDetail,
    })
  }

  const openModalMoodboardCollectionDetail = (canEdit = true) => {
    moodboardNodeCollection.value &&
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-moodboard-collection-detail',
        properties: {
          nodeId: moodboardNodeCollection.value.nodeMeta.nodeId,
          collection: moodboardNodeCollection.value.collection,
          canEdit,
        } as PropsModalMoodboardCollectionDetail,
      })
  }

  return {
    cloneMoodboardNode,
    exportMoodboardNode,
    downloadU3m,
    deleteMoodboardNode,
    togglePick,
    editMoodboardNodeCollection,
    openModalCreateOrEditMoodboardCollection,
    openModalMoodboardCollectionDetail,
    openModalMoodboardMaterialDetail,
  }
}
