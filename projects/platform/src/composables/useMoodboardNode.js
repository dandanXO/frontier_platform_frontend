import { ref } from 'vue'
import { useStore } from 'vuex'
import { NODE_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'

/**
 * @param {ComputedRef} moodboard
 * @param {ComputedRef} moodboardOfferNodeCollection
 * @returns
 */
export default function useMoodboardNode(
  moodboard,
  moodboardOfferNodeCollection
) {
  const store = useStore()
  const { t } = useI18n()

  const { moodboardId, moodboardType } = moodboard.value

  const selectedNodeList = ref([])

  const selectAll = () => {
    const stringifyNodeList =
      moodboardOfferNodeCollection.value.childNodeList.map((node) =>
        JSON.stringify(node)
      )
    const stringifySelectedNodeList = selectedNodeList.value.map((node) =>
      JSON.stringify(node)
    )
    selectedNodeList.value = [
      ...new Set(stringifySelectedNodeList.concat(stringifyNodeList)),
    ].map((node) => JSON.parse(node))
  }

  const cloneMoodboardNode = (nodeList) => {
    const isContainCollection = nodeList.some(
      (node) => node.nodeType === NODE_TYPE.COLLECTION
    )
    const msg = isContainCollection ? t('II0009') : t('II0008')
    const nodeIdList = nodeList.map(({ nodeId }) => nodeId)
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-clone-to',
      properties: {
        checkHandler: async () => {
          return store.dispatch('moodboard/cloneCheckMoodboardNode', {
            nodeIdList,
          })
        },
        cloneHandler: async (targetLocationList, optional) => {
          await store.dispatch('moodboard/cloneMoodboardNode', {
            nodeIdList,
            targetLocationList,
            optional,
          })
          store.dispatch('helper/pushFlashMessage', msg)
        },
      },
    })
  }

  const exportMoodboardNode = async (nodeList) => {
    const nodeIdList = nodeList.map(({ nodeId }) => nodeId)
    if (nodeIdList.length >= 100) {
      await store.dispatch('moodboard/massExportMoodboardNode', {
        moodboardId,
        nodeIdList,
      })
      store.dispatch('helper/openModalConfirm', {
        type: 2,
        header: t('PP0030'),
        contentText: t('PP0031'),
        primaryBtnText: t('UU0031'),
        secondaryBtnText: t('UU0090'),
        secondaryBtnHandler: () => {
          goToProgress('excel')
          store.dispatch('helper/closeModalBehavior')
        },
      })
    } else {
      store.dispatch('helper/openModalLoading')
      await store.dispatch('moodboard/exportMoodboardNode', {
        moodboardId,
        nodeIdList,
      })
      store.dispatch('helper/closeModalLoading')
    }
  }

  const deleteMoodboardNode = (nodeList) => {
    const isContainCollection = nodeList.some(
      (node) => node.nodeType === NODE_TYPE.COLLECTION
    )
    const nodeIdList = nodeList.map(({ nodeId }) => nodeId)
    store.dispatch('helper/openModalConfirm', {
      type: 1,
      header: isContainCollection ? t('QQ0072') : t('QQ0065'),
      contentText: isContainCollection ? t('QQ0073') : t('QQ0066'),
      primaryBtnText: t('UU0091'),
      primaryBtnHandler: async () => {
        await store.dispatch('moodboard/deleteMoodboardNode', { nodeIdList })
        store.dispatch('helper/reloadInnerApp')
      },
      secondaryBtnText: t('UU0002'),
    })
  }

  const openModalU3mSelectFileFormat = (nodeList) => {
    const materialList = nodeList.map(({ properties }) => properties)
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-u3m-select-file-format',
      properties: { materialList },
    })
  }

  const openModalMoodboardMaterialDetail = (
    nodeMaterial,
    willRemove = false,
    willRecovery = false
  ) => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-moodboard-material-detail',
      properties: {
        nodeMaterial,
        moodboardType,
        pickHandler: togglePick.bind(
          null,
          nodeMaterial,
          willRemove,
          willRecovery
        ),
      },
    })
  }

  const togglePick = (node, willRemove, willRecovery) => {
    if (node.isPicked) {
      store.dispatch('moodboard/unpickMoodboardNode', { nodeId: node.nodeId })
      if (willRemove) {
        const index =
          moodboardOfferNodeCollection.value.childNodeList.findIndex(
            (cNode) => cNode.nodeId === node.nodeId
          )
        moodboardOfferNodeCollection.value.childNodeList.splice(index, 1)
      }
    } else {
      store.dispatch('moodboard/pickMoodboardNode', { nodeId: node.nodeId })
      if (willRecovery) {
        moodboardOfferNodeCollection.value.childNodeList.push(node)
      }
    }
    node.isPicked = !node.isPicked
  }

  const openModalMoodboardCollectionDetail = (canEdit = true) => {
    const {
      nodeId,
      description,
      trendBoardFileName,
      trendBoardUrl,
      trendBoardCoverImg,
    } = moodboardOfferNodeCollection.value
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-moodboard-collection-detail',
      properties: {
        nodeId,
        description,
        trendBoardFileName,
        trendBoardUrl,
        trendBoardCoverImg,
        canEdit,
      },
    })
  }

  return {
    selectedNodeList,
    selectAll,
    cloneMoodboardNode,
    exportMoodboardNode,
    deleteMoodboardNode,
    openModalU3mSelectFileFormat,
    openModalMoodboardMaterialDetail,
    togglePick,
    openModalMoodboardCollectionDetail,
  }
}
