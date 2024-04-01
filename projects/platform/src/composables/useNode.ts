import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useShareToMe from './useShareToMe'
import type {
  ShareNodeCollection,
  WorkspaceNodeCollection,
} from '@frontier/platform-web-sdk'
import type { PropsModalCollectionDetail } from '@/components/common/collection/ModalCollectionDetail.vue'
import useCurrentUnit from './useCurrentUnit'

export default function useNode(
  key: 'workspace' | 'shareToMe' | 'metaFabric',
  nodeId?: string,
  sharingId?: string
) {
  const { shareToMeCloneByNodeList, shareToMeDeleteByNodeList } = useShareToMe()
  const store = useStore()
  const { t } = useI18n()
  const { ogNodeId } = useCurrentUnit()

  const shareNodeCollection = ref<ShareNodeCollection>()
  const workspaceNodeCollection = ref<WorkspaceNodeCollection>()

  const nodeProperty = {
    workspace: {
      name: t('FF0001'),
      collection: workspaceNodeCollection,
    },
    shareToMe: {
      name: t('RR0010'),
      collection: shareNodeCollection,
    },
    metaFabric: {
      name: t('RR0360'),
      collection: shareNodeCollection,
    },
  }
  const nodeCollection = nodeProperty[key].collection
  const nodeList = computed(() => nodeCollection.value?.childNodeList ?? [])
  const locationList = computed(() => {
    const root = {
      name: nodeProperty[key].name,
      nodeId: key === 'workspace' ? ogNodeId.value : -1,
    }
    return nodeCollection.value && nodeCollection.value.nodeMeta
      ? [root, ...nodeCollection.value.nodeMeta.locationList]
      : [root]
  })
  const isFirstLayer = computed(() => locationList.value.length === 1)

  const currentSharingId = ref<number | null>(
    sharingId ? Number(sharingId) : null
  )
  const currentNodeId = ref<number | null>(nodeId ? Number(nodeId) : null)
  const setSharingIdAndNodeKey = (nodeId: number, targetSharingId?: number) => {
    if (nodeId === -1 && !targetSharingId) {
      currentSharingId.value = null
      currentNodeId.value = null
      return
    }

    currentNodeId.value = nodeId
    if (targetSharingId) {
      currentSharingId.value = targetSharingId
    }
  }
  const selectedNodeList = ref([])

  const optionMultiSelect = computed(() => {
    return isFirstLayer.value
      ? [shareToMeDeleteByNodeList]
      : [shareToMeCloneByNodeList]
  })

  const optionNode = computed(() => {
    const optionList = [[shareToMeCloneByNodeList]]
    if (isFirstLayer.value) {
      optionList[0].push(shareToMeDeleteByNodeList)
    }
    return optionList
  })

  const isFirstTime = ref(true)
  const haveMsgAndFirstRead = computed(
    () => !!shareNodeCollection.value?.shareInfo.message && isFirstTime.value
  )

  const openModalCollectionDetail = () => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-collection-detail',
      properties: {
        nodeMeta: shareNodeCollection.value?.nodeMeta,
        collection: shareNodeCollection.value?.collection,
        canEdit: false,
      } as PropsModalCollectionDetail,
    })
  }

  const openModalShareMessage = () => {
    isFirstTime.value = false
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-share-message',
      properties: {
        message: shareNodeCollection.value?.shareInfo.message,
      },
    })
  }

  return {
    currentSharingId,
    currentNodeId,
    setSharingIdAndNodeKey,
    shareNodeCollection,
    workspaceNodeCollection,
    locationList,
    isFirstLayer,
    nodeList,
    optionMultiSelect,
    optionNode,
    selectedNodeList,
    isFirstTime,
    haveMsgAndFirstRead,
    openModalCollectionDetail,
    openModalShareMessage,
  }
}
