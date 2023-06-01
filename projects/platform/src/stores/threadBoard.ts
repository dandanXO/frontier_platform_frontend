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
  const { unit, organization, orgUser } = useCurrentUnit()
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
  const mostParticipantId = ref<number>()
  const participantFilterIdList = ref<number[]>([])

  const filterCount = computed(() => {
    return [
      Object.values(threadBoardQuery.filter.createdBy).some((b) => b),
      threadBoardQuery.filter.participantUserIdList.length > 0,
      Object.values(threadBoardQuery.filter.stickerType).some((b) => b),
      Object.values([
        threadBoardQuery.filter.createStartDate,
        threadBoardQuery.filter.createEndDate,
      ]).some((b) => b),
    ].filter((b) => b).length
  })

  const isFilterDirty = computed(() => filterCount.value > 0)

  const canClearFilterAndSearch = computed(() =>
    [
      threadBoardQuery.onlyShowUnread,
      threadBoardQuery.search?.length,
      isFilterDirty.value,
    ].some((b) => b)
  )

  const createdByMenu = computed(() => [
    {
      id: 1,
      name: t('TT0048', { userName: orgUser.value.displayName }),
      checked: threadBoardQuery.filter.createdBy.createdByMe,
      handleInput: (v: boolean) => {
        threadBoardQuery.filter.createdBy.createdByMe = v
      },
    },
    {
      id: 2,
      name: t('TT0049', { orgName: organization.value.orgName }),
      checked: threadBoardQuery.filter.createdBy.createdByInternalUnit,
      handleInput: (v: boolean) => {
        threadBoardQuery.filter.createdBy.createdByInternalUnit = v
      },
    },
    {
      id: 3,
      name: t('TT0050'),
      checked: threadBoardQuery.filter.createdBy.createdByExternalUnit,
      handleInput: (v: boolean) => {
        threadBoardQuery.filter.createdBy.createdByExternalUnit = v
      },
    },
  ])

  const stickerTypeMenu = computed(() => [
    {
      id: 1,
      name: 'Internal',
      checked: threadBoardQuery.filter.stickerType.internal,
      handleInput: (v: boolean) => {
        threadBoardQuery.filter.stickerType.internal = v
      },
    },
    {
      id: 2,
      name: 'External',
      checked: threadBoardQuery.filter.stickerType.external,
      handleInput: (v: boolean) => {
        threadBoardQuery.filter.stickerType.external = v
      },
    },
  ])

  const dateCreatedInput = computed(() => ({
    start: {
      value: threadBoardQuery.filter.createStartDate || '',
      handleInput: (v: string) => {
        threadBoardQuery.filter.createStartDate = v
      },
    },
    end: {
      value: threadBoardQuery.filter.createEndDate || '',
      handleInput: (v: string) => {
        threadBoardQuery.filter.createEndDate = v
      },
    },
  }))

  const memberListMenu = computed(() => {
    return unit.value.activeMemberList.map((m) => {
      const checked = threadBoardQuery.filter.participantUserIdList.includes(
        m.userId
      )
      const isCurrentUser = orgUser.value.userId === m.userId
      return {
        id: m.userId,
        name: isCurrentUser
          ? t('TT0048', { userName: orgUser.value.displayName })
          : m.displayName,
        avatar: m.avatar,
        checked,
        handleInput: () => {
          if (
            threadBoardQuery.filter.participantUserIdList.includes(m.userId)
          ) {
            threadBoardQuery.filter.participantUserIdList =
              threadBoardQuery.filter.participantUserIdList.filter(
                (pId) => pId !== m.userId
              )
          } else {
            threadBoardQuery.filter.participantUserIdList.push(m.userId)
            if (
              !participantFilterItemList.value
                .map((item) => item.id)
                .includes(m.userId)
            ) {
              participantFilterIdList.value.push(m.userId)
            }
          }
        },
      }
    })
  })

  const participantFilterItemList = computed(() => {
    const getMenuItemById = (id: number) => {
      const item = memberListMenu.value.find((m) => m.id === id)
      if (!item) throw new Error('user not exist')
      return item
    }

    const list = [getMenuItemById(orgUser.value.userId)]
    if (mostParticipantId.value) {
      list.push(getMenuItemById(mostParticipantId.value))
    }
    return [...list, ...participantFilterIdList.value.map(getMenuItemById)]
  })

  const participantMenu = computed(() => {
    return memberListMenu.value.filter((item) => {
      return !participantFilterItemList.value.map((i) => i.id).includes(item.id)
    })
  })

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
    participantFilterIdList.value =
      threadBoardQuery.filter.participantUserIdList.filter(
        (pid) => pid !== orgUser.value.userId
      )
  }

  const updateQuery = (v: Partial<ThreadBoardQuery>) => {
    Object.assign(threadBoardQuery, v)
    participantFilterIdList.value =
      threadBoardQuery.filter.participantUserIdList.filter(
        (pid) => pid !== orgUser.value.userId
      )
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
    participantFilterIdList.value = []
  }

  const clearCreatedByFilter = async () => {
    threadBoardQuery.filter.createdBy.createdByMe = false
    threadBoardQuery.filter.createdBy.createdByInternalUnit = false
    threadBoardQuery.filter.createdBy.createdByExternalUnit = false
  }

  const clearParticipantsFilter = async () => {
    threadBoardQuery.filter.participantUserIdList = []
    participantFilterIdList.value = []
  }

  const clearStickerTypeFilter = async () => {
    threadBoardQuery.filter.stickerType.internal = false
    threadBoardQuery.filter.stickerType.external = false
  }

  const clearDateCreatedFilter = async () => {
    threadBoardQuery.filter.createStartDate = null
    threadBoardQuery.filter.createEndDate = null
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
    filterCount,
    isFilterDirty,
    createdByMenu,
    participantFilterItemList,
    participantMenu,
    memberListMenu,
    stickerTypeMenu,
    dateCreatedInput,
    defaultWorkflowStage,
    defaultWorkflowStageThreadList,
    draggableWorkflowStageList,
    init,
    updateQuery,
    updateSearchText,
    clearAllQuery,
    clearCreatedByFilter,
    clearParticipantsFilter,
    clearStickerTypeFilter,
    clearDateCreatedFilter,
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
