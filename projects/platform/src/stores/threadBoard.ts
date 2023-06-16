import { computed, reactive, ref, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { defineStore } from 'pinia'
import axios from 'axios'
import debounce from 'debounce'
import { clone } from 'ramda'
import {
  ThreadBoardQuerySortByEnum,
  type ThreadBoardQuery,
  type WorkflowStage,
  type GetThreadBoardRequest,
  type ThreadBoardQueryFilter,
  type DigitalThreadBase,
  FeatureType,
  type MoveWorkflowStageRequest,
  type HideWorkflowStageRequest,
  type CheckCanDeleteWorkflowStageRequest,
  type ReadAllUnreadDigitalThreadRequest,
  type CreateWorkflowStageRequest,
  type RenameWorkflowStageRequest,
  type MoveWorkflowStageAllDigitalThreadRequest,
  type MoveWorkflowStageDigitalThreadRequest,
  OgType,
} from '@frontier/platform-web-sdk'
import threadBoardApi from '@/apis/threadBoard'
import stickerApi from '@/apis/sticker.js'
import { useNotifyStore } from '@/stores/notify'
import useCurrentUnit from '@/composables/useCurrentUnit'
import useGotoMaterialDetail from '@/composables/useGotoMaterialDetail'
import usePermission from '@/composables/usePermission'
import { FUNC_ID, NOTIFY_TYPE } from '@/utils/constants'
import type {
  WorkflowStageRenamePayload,
  WorkflowStageMoveAllThreadsPayload,
  CreatingGhostWorkflowStage,
} from '@/types'

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

const defaultThreadBoardQuery = (): ThreadBoardQuery => ({
  search: '',
  onlyShowUnread: false,
  sortBy: ThreadBoardQuerySortByEnum.CUSTOM,
  filter: defaultFilter(),
})

const useThreadBoardStore = defineStore('threadBoard', () => {
  const { t } = useI18n()
  const { unit, organization, orgUser } = useCurrentUnit()
  const notify = useNotifyStore()
  const gotoMaterialDetail = useGotoMaterialDetail()
  const store = useStore()
  const permissionList = usePermission()

  const fetchThreadBoardAbortController = ref<AbortController | null>(null)
  const isActive = ref(false)
  const isFirstThreadBoardFetch = ref(true)
  const activeThreadSideId = ref<number | null>(null)
  const rawWorkflowStageList = ref<WorkflowStage[]>()
  const workflowStageList = ref<WorkflowStage[]>()

  const isCreatingWorkflowStage = ref(false)
  const creatingWorkflowStageName = ref<string | null>(null)
  const creatingWorkflowStageThreadList = ref<DigitalThreadBase[]>([])
  const creatingGhostWorkflowStage = ref<CreatingGhostWorkflowStage | null>(
    null
  )

  const loading = ref(true)
  const isDefaultWorkflowStageExpanded = ref(true)
  const isHiddenWorkflowListExpanded = ref(false)
  const threadBoardQuery = reactive<ThreadBoardQuery>(defaultThreadBoardQuery())
  const searchText = ref<string>('')
  const mostParticipantId = ref<number>()
  const participantFilterIdList = ref<number[]>([])

  const haveCreateWorkflowStagePermission = computed(() =>
    permissionList.value.includes(FUNC_ID.CREATE_WORKFLOW_STAGE)
  )

  const haveEditWorkflowStagePermission = computed(() =>
    permissionList.value.includes(FUNC_ID.EDIT_WORKFLOW_STAGE)
  )

  const haveMoveWorkflowStagePermission = computed(() =>
    permissionList.value.includes(FUNC_ID.MOVE_WORKFLOW_STAGE)
  )

  const haveHideShowWorkflowStagePermission = computed(() =>
    permissionList.value.includes(FUNC_ID.HIDE_SHOW_WORKFLOW_STAGE)
  )

  const haveDeleteWorkflowStagePermission = computed(() =>
    permissionList.value.includes(FUNC_ID.DELETE_WORKFLOW_STAGE)
  )

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
      threadBoardQuery.search && threadBoardQuery.search.length > 0,
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

  const digitalThreadList = computed(() => {
    if (!workflowStageList.value) return []
    return workflowStageList.value.flatMap(
      (workflowStage) => workflowStage.digitalThreadList
    )
  })

  const digitalThreadSideIdList = computed(() => {
    return digitalThreadList.value.map((t) => t.digitalThreadSideId)
  })

  const unreadDigitalThreadSideIdList = computed(() => {
    if (!workflowStageList.value) return []
    return digitalThreadList.value
      .filter((t) => t.unreadStickerQty > 0)
      .map((digitalThread) => digitalThread.digitalThreadSideId)
  })

  const threadQty = computed(() => {
    if (!workflowStageList.value) return 0
    return workflowStageList.value.reduce((sum, workflowStage) => {
      return sum + workflowStage.digitalThreadList.length
    }, 0)
  })

  const unreadThreadQty = computed(
    () => unreadDigitalThreadSideIdList.value.length
  )

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
    set: (newDraggableWorkflowStage: WorkflowStage[]) => {
      let newList = [...newDraggableWorkflowStage]
      if (defaultWorkflowStage.value) {
        newList = [defaultWorkflowStage.value, ...newList]
      }
      newList = [...newList, ...hiddenWorkflowStageList.value]
      workflowStageList.value = newList
    },
  })

  const defaultWorkflowStageThreadList = computed({
    get: () => defaultWorkflowStage.value?.digitalThreadList || [],
    set: (v: DigitalThreadBase[]) => {
      if (!workflowStageList.value) {
        return
      }

      const targetIndex = workflowStageList.value.findIndex((w) => w.isDefault)
      if (targetIndex < 0) {
        return
      }

      workflowStageList.value[targetIndex].digitalThreadList = v
    },
  })

  const hiddenWorkflowStageList = computed(() => {
    if (!workflowStageList.value) return []
    return workflowStageList.value.filter((w) => w.isHidden)
  })

  const workflowStageMenu = computed(() => {
    if (!defaultWorkflowStage.value) {
      throw new Error('default workflow stage undefined')
    }

    return [
      defaultWorkflowStage.value,
      ...draggableWorkflowStageList.value,
    ].map((w) => ({
      id: w.workflowStageId,
      name: w.workflowStageName,
      isDefault: w.isDefault,
    }))
  })

  const baseReq = computed(() => ({
    orgId: unit.value.orgId,
    ogType: unit.value.ogType,
    ogId: unit.value.ogId,
  }))

  const setLoading = (v: boolean) => (loading.value = v)

  const getWorkflowStageById = (id: number) => {
    if (!workflowStageList.value) {
      return
    }

    return workflowStageList.value.find((w) => w.workflowStageId === id)
  }

  const getWorkflowStageNameById = (id: number) => {
    const result = getWorkflowStageById(id)
    if (!result) {
      return
    }
    if (result.isDefault) {
      return { ...result, workflowStageName: t('TT0135') }
    }
    return result
  }

  const workflowStageSortCompare = (
    a: DigitalThreadBase,
    b: DigitalThreadBase
  ) =>
    threadBoardQuery.sortBy === ThreadBoardQuerySortByEnum.OLDEST_TO_NEWEST
      ? a.createDate - b.createDate
      : b.createDate - a.createDate

  const sortCreatingWorkflowStage = () => {
    if (threadBoardQuery.sortBy !== ThreadBoardQuerySortByEnum.CUSTOM) {
      creatingWorkflowStageThreadList.value =
        creatingWorkflowStageThreadList.value.sort(workflowStageSortCompare)
    }
  }

  const sortWorkflowStageById = (workflowStageId: number) => {
    if (threadBoardQuery.sortBy === ThreadBoardQuerySortByEnum.CUSTOM) {
      return
    }

    const targetWorkflowStage = getWorkflowStageById(workflowStageId)
    if (!targetWorkflowStage) {
      throw new Error('targetWorkflowStage undefined')
    }

    targetWorkflowStage.digitalThreadList =
      targetWorkflowStage.digitalThreadList.sort(workflowStageSortCompare)
  }

  const promptSwitchToSortByCustom = () => {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('TT0171'),
      contentText: t('TT0172'),
      primaryBtnText: t('UU0134'),
      secondaryBtnText: t('UU0002'),
      primaryBtnHandler: () => {
        threadBoardQuery.sortBy = ThreadBoardQuerySortByEnum.CUSTOM
      },
    })
  }

  const expandDefaultWorkflowStage = () => {
    isDefaultWorkflowStageExpanded.value = true
  }

  const collapseDefaultWorkflowStage = () => {
    isDefaultWorkflowStageExpanded.value = false
  }

  const expandHiddenWorkflowStageList = () => {
    if (hiddenWorkflowStageList.value.length > 0) {
      isHiddenWorkflowListExpanded.value = true
    }
  }

  const collapseHiddenWorkflowStage = () => {
    isHiddenWorkflowListExpanded.value = false
  }

  const getThreadBoard = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true)
    }

    if (fetchThreadBoardAbortController.value) {
      fetchThreadBoardAbortController.value.abort()
      fetchThreadBoardAbortController.value = null
    }

    const threadBoardReq: GetThreadBoardRequest = {
      ...baseReq.value,
      threadBoardQuery: threadBoardQuery,
    }

    fetchThreadBoardAbortController.value = new AbortController()
    try {
      const res = await threadBoardApi.getThreadBoard(threadBoardReq, {
        signal: fetchThreadBoardAbortController.value.signal,
      })
      rawWorkflowStageList.value =
        res.data.result!.threadBoard.workflowStageList
      workflowStageList.value = clone(rawWorkflowStageList.value).map(
        (workflowStage) => {
          workflowStage.digitalThreadList =
            workflowStage.digitalThreadList.filter((thread) => {
              return !creatingWorkflowStageThreadList.value
                .map((t) => t.digitalThreadSideId)
                .includes(thread.digitalThreadSideId)
            })
          return workflowStage
        }
      )
      setLoading(false)
      fetchThreadBoardAbortController.value = null
    } catch (e) {
      if (!axios.isCancel(e)) {
        fetchThreadBoardAbortController.value = null
        setLoading(false)
      }
    }
  }

  const cancelCreateWorkflowStage = () => {
    if (creatingWorkflowStageThreadList.value.length > 0) {
      workflowStageList.value = clone(rawWorkflowStageList.value)
    }

    isCreatingWorkflowStage.value = false
    creatingWorkflowStageName.value = null
    creatingWorkflowStageThreadList.value = []
  }

  const createWorkflowStage = async () => {
    if (!workflowStageList.value) {
      throw new Error('workflowStageList undefined')
    }

    const req: CreateWorkflowStageRequest = {
      ...baseReq.value,
      workflowStageName: creatingWorkflowStageName.value || '',
      digitalThreadSideIdList: creatingWorkflowStageThreadList.value.map(
        (t) => t.digitalThreadSideId
      ),
    }

    creatingGhostWorkflowStage.value = {
      workflowStageId: 'creatingWorkflowStage',
      workflowStageName: creatingWorkflowStageName.value || '',
      canDelete: false,
      canHide: false,
      isDefault: false,
      isHidden: false,
      digitalThreadList: creatingWorkflowStageThreadList.value,
    }

    isCreatingWorkflowStage.value = false
    creatingWorkflowStageName.value = null
    creatingWorkflowStageThreadList.value = []

    setLoading(true)
    try {
      await threadBoardApi.createWorkflowStage(req)
      await getThreadBoard()
      notify.showNotifySnackbar({
        isShowSnackbar: true,
        messageText: t('WW0129'),
      })
    } finally {
      creatingGhostWorkflowStage.value = null
      setLoading(false)
    }
  }

  const renameWorkflowStage = async (v: WorkflowStageRenamePayload) => {
    if (!workflowStageList.value) {
      throw new Error('workflowStageList undefined')
    }

    const targetIndex = workflowStageList.value.findIndex(
      (w) => w.workflowStageId === v.workflowStageId
    )
    if (targetIndex < 0) throw new Error('rename target not exist')
    workflowStageList.value[targetIndex].workflowStageName = v.workflowStageName

    const req: RenameWorkflowStageRequest = {
      orgId: baseReq.value.orgId,
      workflowStageId: v.workflowStageId,
      workflowStageName: v.workflowStageName,
    }
    await threadBoardApi.renameWorkflowStage(req)
    getThreadBoard()

    notify.showNotifySnackbar({
      isShowSnackbar: true,
      messageText: t('WW0130'),
    })
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

  const openStickerDrawerByThread = async (thread: DigitalThreadBase) => {
    activeThreadSideId.value = thread.digitalThreadSideId
    const openStickerDrawer = () => {
      return store.dispatch('sticker/openStickerDrawer', {
        digitalThreadSideId: thread.digitalThreadSideId,
        drawerOpenFromLocationList: [],
        drawerOpenFromLocationType: FeatureType.THREAD_BOARD,
      })
    }

    await openStickerDrawer()

    // should update digital thread read count after user open sticker drawer
    getThreadBoard()
  }

  const isThreadCardActive = (thread: DigitalThreadBase) => {
    return thread.digitalThreadSideId === activeThreadSideId.value
  }

  const activateThreadCard = async (digitalThreadSideId: number) => {
    activeThreadSideId.value = null
    await nextTick()
    activeThreadSideId.value = digitalThreadSideId
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

  const markAsAllRead = async () => {
    const req: ReadAllUnreadDigitalThreadRequest = {
      ...baseReq.value,
      digitalThreadSideIdList: unreadDigitalThreadSideIdList.value,
    }
    await threadBoardApi.readAllUnreadDigitalThread(req)
    threadBoardQuery.onlyShowUnread = false
    getThreadBoard()
  }

  const moveWorkflowStageList = async (
    workflowStageId: number,
    oldIndex: number,
    newIndex: number
  ) => {
    const req: MoveWorkflowStageRequest = {
      ...baseReq.value,
      workflowStageId,
      targetWorkflowStageId:
        draggableWorkflowStageList.value[
          newIndex === 0 ? newIndex + 1 : newIndex - 1
        ].workflowStageId,
      isMoveToBeforeTarget: newIndex === 0,
    }
    await threadBoardApi.moveWorkflowStage(req)
    getThreadBoard()
    notify.showNotifySnackbar({
      isShowSnackbar: true,
      messageText: t('WW0131'),
    })
  }

  const moveWorkflowStageDigitalThread = async (
    digitalThreadSideId: number,
    fromWorkflowStageId: number,
    toWorkflowStageId: number,
    targetDigitalThreadSideId: number | undefined,
    isMoveToBeforeTarget: boolean
  ) => {
    if (threadBoardQuery.sortBy !== ThreadBoardQuerySortByEnum.CUSTOM) {
      sortWorkflowStageById(toWorkflowStageId)

      if (fromWorkflowStageId === toWorkflowStageId) {
        return promptSwitchToSortByCustom()
      }
    }

    const customOrderPayload =
      threadBoardQuery.sortBy === ThreadBoardQuerySortByEnum.CUSTOM &&
      targetDigitalThreadSideId
        ? {
            targetDigitalThreadSideId,
            isMoveToBeforeTarget,
          }
        : null
    const req: MoveWorkflowStageDigitalThreadRequest = {
      ...baseReq.value,
      digitalThreadSideId,
      targetWorkflowStageId: toWorkflowStageId,
      customOrderPayload,
    }
    await threadBoardApi.moveWorkflowStageDigitalThread(req)
    getThreadBoard()

    if (fromWorkflowStageId === toWorkflowStageId) {
      return
    }

    const fromWorkflowStage = getWorkflowStageNameById(fromWorkflowStageId)
    const toWorkflowStage = getWorkflowStageNameById(toWorkflowStageId)

    notify.showNotifySnackbar({
      isShowSnackbar: true,
      messageText: t('WW0133', {
        lastStage: fromWorkflowStage?.workflowStageName,
        newStage: toWorkflowStage?.workflowStageName,
      }),
    })
  }

  const moveWorkflowStageAllThreads = async (
    v: WorkflowStageMoveAllThreadsPayload
  ) => {
    if (!workflowStageList.value) {
      throw new Error('workflowStageList undefined')
    }

    const sourceIndex = workflowStageList.value.findIndex(
      (w) => w.workflowStageId === v.sourceWorkflowStageId
    )
    if (sourceIndex < 0) {
      throw new Error('source workflow stage not exist')
    }

    const targetIndex = workflowStageList.value.findIndex(
      (w) => w.workflowStageId === v.targetWorkflowStageId
    )
    if (targetIndex < 0) {
      throw new Error('target workflow stage not exist')
    }

    workflowStageList.value[targetIndex].digitalThreadList = [
      ...workflowStageList.value[sourceIndex].digitalThreadList,
      ...workflowStageList.value[targetIndex].digitalThreadList,
    ]

    if (threadBoardQuery.sortBy !== ThreadBoardQuerySortByEnum.CUSTOM) {
      workflowStageList.value[targetIndex].digitalThreadList.sort(
        workflowStageSortCompare
      )
    }

    workflowStageList.value[sourceIndex].digitalThreadList = []
    if (workflowStageList.value[sourceIndex].isDefault) {
      workflowStageList.value[sourceIndex].canHide = true
      workflowStageList.value[sourceIndex].canDelete = true
    }

    const getWorkStageNameByIndex = (index: number) => {
      if (!workflowStageList.value) {
        throw new Error('workflowStageList undefined')
      }

      const workflowStage = workflowStageList.value[index]
      if (workflowStage.isDefault) {
        return t('TT0135')
      }

      return workflowStage.workflowStageName
    }

    const sourceName = getWorkStageNameByIndex(sourceIndex)
    const targetName = getWorkStageNameByIndex(targetIndex)
    const req: MoveWorkflowStageAllDigitalThreadRequest = {
      ...baseReq.value,
      workflowStageId: v.sourceWorkflowStageId,
      targetWorkflowStageId: v.targetWorkflowStageId,
    }
    await threadBoardApi.moveWorkflowStageAllDigitalThread(req)
    getThreadBoard()
    notify.showNotifySnackbar({
      isShowSnackbar: true,
      messageText: t('WW0134', { lastStage: sourceName, newStage: targetName }),
    })
  }

  const deleteWorkflowStage = async (id: number) => {
    const req: CheckCanDeleteWorkflowStageRequest = {
      orgId: baseReq.value.orgId,
      workflowStageId: id,
    }
    try {
      await threadBoardApi.checkCanDeleteWorkflowStage(req)
    } catch (error) {
      const { code, message, result } = error as {
        code: string
        message: {
          type: number
          title: string
          content: string
        }
        result: {
          errorList: {
            ogName: string
            labelColor: string
          }[]
        }
      }

      switch (code) {
        case 'ERR0036': {
          store.dispatch('helper/openModalBehavior', {
            component: 'modal-workflow-stage-delete-error-list',
            properties: {
              title: message.title,
              content: message.content,
              errorList: result.errorList,
            },
          })
          return
        }
        default:
          throw error
      }
    }

    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('TT0150'),
      contentText: t('TT0154'),
      primaryBtnText: t('UU0013'),
      primaryBtnHandler: async () => {
        store.dispatch('helper/closeModalConfirm')

        if (!workflowStageList.value) {
          throw new Error('workflowStageList undefined')
        }

        workflowStageList.value = workflowStageList.value.filter(
          (w) => w.workflowStageId !== id
        )
        await threadBoardApi.deleteWorkflowStage(req)
        getThreadBoard()
        notify.showNotifySnackbar({
          isShowSnackbar: true,
          messageText: t('WW0132'),
        })
      },
      secondaryBtnText: t('UU0002'),
    })
  }

  const showWorkflowStage = async (id: number) => {
    if (!workflowStageList.value) {
      throw new Error('workflowStageList undefined')
    }

    const targetIndex = workflowStageList.value.findIndex(
      (w) => w.workflowStageId === id
    )
    if (targetIndex < 0) {
      throw new Error('target workflow stage not exist')
    }

    workflowStageList.value[targetIndex].isHidden = false
    const req: HideWorkflowStageRequest = {
      ...baseReq.value,
      workflowStageId: id,
    }

    if (hiddenWorkflowStageList.value.length === 0) {
      isHiddenWorkflowListExpanded.value = false
    }

    await threadBoardApi.showWorkflowStage(req)
    getThreadBoard()
  }

  const hideWorkflowStage = async (id: number) => {
    if (!workflowStageList.value) {
      throw new Error('workflowStageList undefined')
    }

    const targetIndex = workflowStageList.value.findIndex(
      (w) => w.workflowStageId === id
    )
    if (targetIndex < 0) {
      throw new Error('target workflow stage not exist')
    }

    workflowStageList.value[targetIndex].isHidden = true
    const req: HideWorkflowStageRequest = {
      ...baseReq.value,
      workflowStageId: id,
    }

    await threadBoardApi.hideWorkflowStage(req)
    getThreadBoard()
  }

  const init = async () => {
    isActive.value = true
    getQuery()
  }

  const cleanUp = async () => {
    isActive.value = false
    activeThreadSideId.value = null
    workflowStageList.value = undefined
    isDefaultWorkflowStageExpanded.value = true
    isHiddenWorkflowListExpanded.value = false
    isFirstThreadBoardFetch.value = true
  }

  watch(threadBoardQuery, async () => {
    try {
      searchText.value =
        threadBoardQuery.search == null ? '' : threadBoardQuery.search
      await getThreadBoard(true)
      const updateQueryReq = { ...baseReq.value, threadBoardQuery }
      threadBoardApi.saveThreadBoardQuery(updateQueryReq)

      if (activeThreadSideId.value && isFirstThreadBoardFetch.value) {
        if (!digitalThreadSideIdList.value.includes(activeThreadSideId.value)) {
          store.dispatch('helper/openModalConfirm', {
            type: NOTIFY_TYPE.INFO,
            header: t('TT0139'),
            contentText: t('TT0140'),
            primaryBtnText: t('UU0132'),
            primaryBtnHandler: clearAllQuery,
            secondaryBtnText: t('UU0133'),
          })
        }
      }

      isFirstThreadBoardFetch.value = false
    } catch {
      console.error('RR')
    }
  })

  watch(
    () => threadBoardQuery.sortBy,
    () => {
      sortCreatingWorkflowStage()
    }
  )

  return {
    isActive,
    loading,
    haveCreateWorkflowStagePermission,
    haveEditWorkflowStagePermission,
    haveMoveWorkflowStagePermission,
    haveHideShowWorkflowStagePermission,
    haveDeleteWorkflowStagePermission,
    activeThreadSideId,
    isDefaultWorkflowStageExpanded,
    isHiddenWorkflowListExpanded,
    workflowStageList,
    threadBoardQuery,
    threadQty,
    unreadThreadQty,
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
    workflowStageMenu,
    defaultWorkflowStage,
    defaultWorkflowStageThreadList,
    draggableWorkflowStageList,
    hiddenWorkflowStageList,
    isCreatingWorkflowStage,
    creatingWorkflowStageName,
    creatingWorkflowStageThreadList,
    creatingGhostWorkflowStage,
    sortCreatingWorkflowStage,
    init,
    cleanUp,
    updateQuery,
    updateSearchText,
    clearAllQuery,
    clearCreatedByFilter,
    clearParticipantsFilter,
    clearStickerTypeFilter,
    clearDateCreatedFilter,
    markAsAllRead,
    getThreadBoard,
    expandDefaultWorkflowStage,
    collapseDefaultWorkflowStage,
    expandHiddenWorkflowStageList,
    collapseHiddenWorkflowStage,
    openMaterialDetail,
    openStickerDrawerByThread,
    isThreadCardActive,
    activateThreadCard,
    deactivateThreadCard,
    cancelCreateWorkflowStage,
    createWorkflowStage,
    renameWorkflowStage,
    moveWorkflowStageList,
    moveWorkflowStageDigitalThread,
    moveWorkflowStageAllThreads,
    deleteWorkflowStage,
    showWorkflowStage,
    hideWorkflowStage,
  }
})

export default useThreadBoardStore
