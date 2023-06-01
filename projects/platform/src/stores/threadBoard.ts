import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { defineStore } from 'pinia'
import debounce from 'debounce'
import {
  ThreadBoardQuerySortByEnum,
  type ThreadBoardQuery,
  type WorkflowStage,
  type GetThreadBoardRequest,
  type ThreadBoardQueryFilter,
  type DigitalThreadBase,
  FeatureType,
} from '@frontier/platform-web-sdk'
import threadBoardApi from '@/apis/threadBoard'
import stickerApi from '@/apis/sticker.js'
import useCurrentUnit from '@/composables/useCurrentUnit'
import useGotoMaterialDetail from '@/composables/useGotoMaterialDetail'

const defaultFilter = (): ThreadBoardQueryFilter => ({
  createdBy: {
    createdByMe: false,
    createdByInternalUnit: false,
    createdByExternalUnit: false,
  },
  stickerType: {
    internal: false,
    external: false,
  },
  participantUserIdList: [],
  createStartDate: null,
  createEndDate: null,
})

const useThreadBoardStore = defineStore('threadBoard', () => {
  const { t } = useI18n()
  const { unit, organization } = useCurrentUnit()
  const gotoMaterialDetail = useGotoMaterialDetail()
  const store = useStore()

  const isActive = ref(false)
  const activeThreadSideId = ref<number | null>(null)
  const workflowStageList = ref<WorkflowStage[]>()
  const loading = ref(true)
  const isDefaultWorkflowStageExpanded = ref(true)
  const threadBoardQuery = reactive<ThreadBoardQuery>({
    search: '',
    onlyShowUnread: false,
    sortBy: ThreadBoardQuerySortByEnum.CUSTOM,
    filter: defaultFilter(),
  })
  const searchText = ref<string>('')

  const canClearFilterAndSearch = computed(() =>
    [threadBoardQuery.onlyShowUnread, threadBoardQuery.search?.length].some(
      (b) => b
    )
  )

  const threadQty = computed(() => {
    if (!workflowStageList.value) return 0
    return workflowStageList.value.reduce((sum, current) => {
      return sum + current.digitalThreadList.length
    }, 0)
  })

  const defaultWorkflowStage = computed(() => {
    if (!workflowStageList.value) {
      return null
    }
    const result = workflowStageList.value.find((w) => w.isDefault)
    if (!result) {
      throw new Error('default workflowStage undefined')
    }
    return { ...result, workflowStageName: t('TT0135') }
  })

  const draggableWorkflowStageList = computed({
    get: () => {
      if (!workflowStageList.value) return []
      return workflowStageList.value
        .filter((w) => !w.isDefault)
        .filter((w) => !w.isHidden)
    },
    set: () => {
      // TODO: handle workflow stage move
    },
  })

  const defaultWorkflowStageThreadList = computed({
    get: () => defaultWorkflowStage.value?.digitalThreadList || [],
    set: (v: DigitalThreadBase[]) => {
      // TODO: handle thread move
    },
  })

  const baseReq = computed(() => ({
    orgId: unit.value.orgId,
    ogType: unit.value.ogType,
    ogId: unit.value.ogId,
  }))

  const setLoading = (v: boolean) => (loading.value = v)

  const expandDefaultWorkflowStage = () => {
    if (isDefaultWorkflowStageExpanded.value === true) return
    isDefaultWorkflowStageExpanded.value = true
  }

  const collapseDefaultWorkflowStage = () => {
    if (isDefaultWorkflowStageExpanded.value === false) return
    isDefaultWorkflowStageExpanded.value = false
  }

  const getThreadBoard = async () => {
    const threadBoardReq: GetThreadBoardRequest = {
      ...baseReq.value,
      threadBoardQuery: threadBoardQuery,
    }
    const res = await threadBoardApi.getThreadBoard(threadBoardReq)
    workflowStageList.value = res.data.result!.threadBoard.workflowStageList
  }

  const openMaterialDetail = async (
    thread: DigitalThreadBase,
    openInNew: boolean
  ) => {
    const { data } = await stickerApi.getDigitalThreadMaterial({
      orgId: organization.value.orgId,
      materialId: thread.materialId,
    })

    const { material } = data.result
    gotoMaterialDetail(material, thread, openInNew)
  }

  const openStickerDrawerByThread = (thread: DigitalThreadBase) => {
    activeThreadSideId.value = thread.digitalThreadSideId
    const openStickerDrawer = () => {
      return store.dispatch('sticker/openStickerDrawer', {
        materialId: thread.materialId,
        digitalThreadSideId: thread.digitalThreadSideId,
        drawerOpenFromLocationList: [],
        drawerOpenFromLocationType: FeatureType.THREAD_BOARD,
      })
    }

    openStickerDrawer()
  }

  const isThreadCardActive = (thread: DigitalThreadBase) => {
    return thread.digitalThreadSideId === activeThreadSideId.value
  }

  const deactivateThreadCard = () => {
    activeThreadSideId.value = null
  }

  const getQuery = async () => {
    const res = await threadBoardApi.getThreadBoardQuery(baseReq.value)
    Object.assign(threadBoardQuery, res.data.result!.threadBoardQuery)
  }

  const updateQuery = (v: Partial<ThreadBoardQuery>) => {
    Object.assign(threadBoardQuery, v)
  }

  const updateThreadBoardQueryText = debounce(
    (search: string | null) => updateQuery({ search }),
    500
  )

  const updateSearchText = (v: string | null) => {
    searchText.value = v == null ? '' : v
    updateThreadBoardQueryText(searchText.value)
  }

  const clearAllQuery = async () => {
    threadBoardQuery.onlyShowUnread = false
    threadBoardQuery.search = null
    threadBoardQuery.filter = defaultFilter()
  }

  const init = async () => {
    isActive.value = true
    getQuery()
  }

  watch(threadBoardQuery, async () => {
    setLoading(true)
    try {
      searchText.value =
        threadBoardQuery.search == null ? '' : threadBoardQuery.search
      await getThreadBoard()
      const updateQueryReq = { ...baseReq.value, threadBoardQuery }
      threadBoardApi.saveThreadBoardQuery(updateQueryReq)
    } catch {
      console.error('RR')
    } finally {
      setLoading(false)
    }
  })

  return {
    loading,
    isDefaultWorkflowStageExpanded,
    workflowStageList,
    threadBoardQuery,
    threadQty,
    canClearFilterAndSearch,
    searchText,
    defaultWorkflowStage,
    defaultWorkflowStageThreadList,
    draggableWorkflowStageList,
    init,
    updateQuery,
    updateSearchText,
    clearAllQuery,
    getThreadBoard,
    expandDefaultWorkflowStage,
    collapseDefaultWorkflowStage,
    openMaterialDetail,
    openStickerDrawerByThread,
    isThreadCardActive,
    deactivateThreadCard,
  }
})

export default useThreadBoardStore
