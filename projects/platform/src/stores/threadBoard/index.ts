import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { defineStore } from 'pinia'
import axios from 'axios'
import debounce from 'debounce'
import { clone } from 'ramda'
import {
  ThreadBoardQuerySortByEnum,
  FeatureType,
  BookmarkType,
  type ThreadBoardQuery,
  type WorkflowStage,
  type ThreadBoardQueryFilter,
  type DigitalThreadBase,
  type CheckCanDeleteWorkflowStageRequest,
  type RenameWorkflowStageRequest,
  type GetThreadBoardRequestBookmarkFilter,
  type OrgBookmark,
  type FolderBookmark,
  type Organization,
  type OrgUser,
} from '@frontier/platform-web-sdk'
import threadBoardApi from '@/apis/threadBoard'
import stickerApi from '@/apis/sticker.js'
import { useNotifyStore } from '@/stores/notify'
import useCurrentUnit from '@/composables/useCurrentUnit'
import useGotoMaterialDetail from '@/composables/useGotoMaterialDetail'
import usePermission from '@/composables/usePermission'
import useNavigation from '@/composables/useNavigation'
import { FUNC_ID, NOTIFY_TYPE } from '@/utils/constants'
import { getBoldInterpolationMessageComponent } from '@/utils/render'
import type {
  WorkflowStageRenamePayload,
  WorkflowStageMoveAllThreadsPayload,
  CreatingGhostWorkflowStage,
} from '@/types'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

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
  const store = useStore()
  const notify = useNotifyStore()
  const ogBaseThreadBoardApi = useOgBaseApiWrapper(threadBoardApi)
  const { ogActiveMemberList } = useCurrentUnit()
  const gotoMaterialDetail = useGotoMaterialDetail()
  const { gotoThreadBoard } = useNavigation()
  const organization = computed<Organization>(
    () => store.getters['organization/organization']
  )
  const orgUser = computed<OrgUser>(
    () => store.getters['organization/orgUser/orgUser']
  )
  const orgId = computed<number>(
    () => store.getters['organization/orgId'] as number
  )
  const permissionList = usePermission()

  const fetchThreadBoardAbortController = ref<AbortController | null>(null)
  const isActive = ref(false)
  const isFirstThreadBoardFetch = ref(true)
  const activeThreadSideId = ref<number | null>(null)

  const contactOrgList = ref<
    { orgId: number; orgName: string; logo: string }[] | null
  >(null)
  const bookmarkList = ref<(OrgBookmark | FolderBookmark)[] | null>(null)
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
  const bookmarkFilter = ref<GetThreadBoardRequestBookmarkFilter | null>(null)
  const threadBoardQuery = reactive<ThreadBoardQuery>(defaultThreadBoardQuery())
  const searchText = ref<string>('')
  const mostParticipantId = ref<number>()
  const participantFilterIdList = ref<number[]>([])

  let onFetchSuccess: (() => void) | null = null

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
      avatar: orgUser.value.avatar,
      checked: threadBoardQuery.filter.createdBy.createdByMe,
      handleInput: (v: boolean) => {
        threadBoardQuery.filter.createdBy.createdByMe = v
      },
    },
    {
      id: 2,
      name: t('TT0049', { orgName: organization.value.orgName }),
      avatar: null,
      checked: threadBoardQuery.filter.createdBy.createdByInternalUnit,
      handleInput: (v: boolean) => {
        threadBoardQuery.filter.createdBy.createdByInternalUnit = v
      },
    },
    {
      id: 3,
      name: t('TT0050'),
      avatar: null,
      checked: threadBoardQuery.filter.createdBy.createdByExternalUnit,
      handleInput: (v: boolean) => {
        threadBoardQuery.filter.createdBy.createdByExternalUnit = v
      },
    },
  ])

  const stickerTypeMenu = computed(() => [
    {
      id: 'internal',
      name: t('TT0010'),
      checked: threadBoardQuery.filter.stickerType.internal,
      handleInput: (v: boolean) => {
        threadBoardQuery.filter.stickerType.internal = v
      },
    },
    {
      id: 'external',
      name: t('TT0009'),
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
    return ogActiveMemberList.value.map((m) => {
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

  const currentBookmark = computed(() => {
    if (!bookmarkList.value || !bookmarkFilter.value) {
      return null
    }

    const bookmarkFilterBookmarkId = bookmarkFilter.value.bookmarkId
    const target = bookmarkList.value.find(
      (b) => b.bookmarkId === bookmarkFilterBookmarkId
    )
    if (!target) {
      return null
    }
    return target
  })

  const currentBookmarkInfo = computed(() => {
    if (!currentBookmark.value || !bookmarkFilter.value) {
      return null
    }

    const bookmarkFilterValue = bookmarkFilter.value

    switch (currentBookmark.value.bookmarkType) {
      case BookmarkType.FOLDER: {
        const folderBookmark = currentBookmark.value as FolderBookmark

        const getTitle = () => {
          if (!bookmarkFilterValue.orgId) {
            return folderBookmark.folderName
          }
          const result = folderBookmark.orgList.find(
            (o) => o.orgId === bookmarkFilterValue.orgId
          )
          if (!result) {
            return null
          }
          return result.orgName
        }

        const getTooltipContent = () => folderBookmark.folderName
        const getOrgLogo = () => {
          if (!bookmarkFilterValue.orgId) {
            return ''
          }
          const result = folderBookmark.orgList.find(
            (o) => o.orgId === bookmarkFilterValue.orgId
          )
          if (!result) {
            return null
          }
          return result.logo
        }

        return {
          title: getTitle(),
          tooltipContent: getTooltipContent(),
          orgLogo: getOrgLogo(),
          activeBookmarkType: bookmarkFilterValue.orgId
            ? BookmarkType.ORG
            : BookmarkType.FOLDER,
          isAllThread: folderBookmark.isAllThread,
        }
      }
      case BookmarkType.ORG: {
        const orgBookmark = currentBookmark.value as OrgBookmark

        const getTitle = () => orgBookmark.org.orgName
        const getTooltipContent = () => orgBookmark.org.orgName
        const getOrgLogo = () => orgBookmark.org.logo

        return {
          title: getTitle(),
          tooltipContent: getTooltipContent(),
          orgLog: getOrgLogo(),
          activeBookmarkType: BookmarkType.ORG,
          isAllThread: false,
        }
      }
      default:
        throw new Error('Invalid bookmark type')
    }
  })

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

  const fetchThreadBoard = async (showLoading = false) => {
    if (!bookmarkFilter.value) {
      throw new Error('bookmarkFilter undefined')
    }

    if (showLoading) {
      setLoading(true)
    }

    if (fetchThreadBoardAbortController.value) {
      fetchThreadBoardAbortController.value.abort()
      fetchThreadBoardAbortController.value = null
    }

    fetchThreadBoardAbortController.value = new AbortController()
    try {
      const res = await ogBaseThreadBoardApi(
        'getThreadBoard',
        {
          threadBoardQuery,
          bookmarkFilter: bookmarkFilter.value,
        },
        {
          signal: fetchThreadBoardAbortController.value.signal,
        }
      )
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
      await ogBaseThreadBoardApi('createWorkflowStage', {
        workflowStageName: creatingWorkflowStageName.value || '',
        digitalThreadSideIdList: creatingWorkflowStageThreadList.value.map(
          (t) => t.digitalThreadSideId
        ),
      })
      await fetchThreadBoard()
      notify.showNotifySnackbar({
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
    if (targetIndex < 0) {
      throw new Error('rename target not exist')
    }
    workflowStageList.value[targetIndex].workflowStageName = v.workflowStageName

    const req: RenameWorkflowStageRequest = {
      orgId: orgId.value,
      workflowStageId: v.workflowStageId,
      workflowStageName: v.workflowStageName,
    }
    await threadBoardApi.renameWorkflowStage(req)
    fetchThreadBoard()

    notify.showNotifySnackbar({
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
    fetchThreadBoard()
  }

  const isThreadCardActive = (thread: DigitalThreadBase) => {
    return thread.digitalThreadSideId === activeThreadSideId.value
  }

  const gotoThreadCard = async (digitalThreadSideId: number) => {
    if (isActive.value) {
      activeThreadSideId.value = null
      await nextTick()
      activeThreadSideId.value = digitalThreadSideId
      return
    }

    onFetchSuccess = () => {
      if (digitalThreadSideIdList.value.includes(digitalThreadSideId)) {
        onFetchSuccess = null
        activeThreadSideId.value = digitalThreadSideId
        return
      }

      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.INFO,
        header: t('TT0139'),
        contentText: t('TT0241'),
        secondaryBtnText: t('UU0135'),
        secondaryBtnHandler: clearAllQuery,
        textBtnText: t('UU0002'),
        textBtnHandler: () => {
          activeThreadSideId.value = digitalThreadSideId
          onFetchSuccess = null
        },
      })
    }

    await gotoThreadBoard()
  }

  const deactivateThreadCard = () => {
    activeThreadSideId.value = null
  }

  const getContactOrgList = async () => {
    const res = await ogBaseThreadBoardApi('getContactOrgList')
    contactOrgList.value = res.data.result!.orgList!
  }

  const fetchBookmarkList = async () => {
    const res = await ogBaseThreadBoardApi('getThreadBoardBookmarkList')
    bookmarkList.value = res.data.result!.bookmarkList!
  }

  const setBookmarkFilter = async (
    filter: GetThreadBoardRequestBookmarkFilter
  ) => {
    bookmarkFilter.value = filter
  }

  const fetchThreadBoardQuery = async () => {
    if (!bookmarkFilter.value?.bookmarkId) {
      throw new Error('bookmarkId undefined')
    }

    const res = await ogBaseThreadBoardApi('getThreadBoardQuery', {
      bookmarkId: bookmarkFilter.value.bookmarkId,
    })
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
    await ogBaseThreadBoardApi('readAllUnreadDigitalThread', {
      digitalThreadSideIdList: unreadDigitalThreadSideIdList.value,
    })
    threadBoardQuery.onlyShowUnread = false
    fetchThreadBoard()
  }

  const moveWorkflowStageList = async (
    workflowStageId: number,
    oldIndex: number,
    newIndex: number
  ) => {
    await ogBaseThreadBoardApi('moveWorkflowStage', {
      workflowStageId,
      targetWorkflowStageId:
        draggableWorkflowStageList.value[
          newIndex === 0 ? newIndex + 1 : newIndex - 1
        ].workflowStageId,
      isMoveToBeforeTarget: newIndex === 0,
    })
    fetchThreadBoard()
    notify.showNotifySnackbar({
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

    await ogBaseThreadBoardApi('moveWorkflowStageDigitalThread', {
      digitalThreadSideId,
      targetWorkflowStageId: toWorkflowStageId,
      customOrderPayload,
    })
    fetchThreadBoard()

    if (fromWorkflowStageId === toWorkflowStageId) {
      return
    }

    const fromWorkflowStage = getWorkflowStageNameById(fromWorkflowStageId)
    const toWorkflowStage = getWorkflowStageNameById(toWorkflowStageId)
    if (!fromWorkflowStage) {
      throw new Error('fromWorkflowStage undefined')
    }
    if (!toWorkflowStage) {
      throw new Error('toWorkflowStage undefined')
    }

    notify.showNotifySnackbar({
      messageComponent: getBoldInterpolationMessageComponent('WW0133', {
        lastStage: fromWorkflowStage.workflowStageName,
        newStage: toWorkflowStage.workflowStageName,
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

    await ogBaseThreadBoardApi('moveWorkflowStageAllDigitalThread', {
      workflowStageId: v.sourceWorkflowStageId,
      targetWorkflowStageId: v.targetWorkflowStageId,
    })
    fetchThreadBoard()
    notify.showNotifySnackbar({
      messageComponent: getBoldInterpolationMessageComponent('WW0134', {
        lastStage: sourceName,
        newStage: targetName,
      }),
    })
  }

  const deleteWorkflowStage = async (id: number) => {
    const req: CheckCanDeleteWorkflowStageRequest = {
      orgId: orgId.value,
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

      const workflowStageName = workflowStageList.value?.find(
        (w) => w.workflowStageId === id
      )?.workflowStageName

      if (!workflowStageName) {
        throw new Error('workflowStageName undefined')
      }

      switch (code) {
        case 'ERR0036': {
          store.dispatch('helper/openModalBehavior', {
            component: 'modal-workflow-stage-delete-error-list',
            properties: {
              title: message.title,
              workflowStageName,
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
        fetchThreadBoard()
        notify.showNotifySnackbar({
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

    if (hiddenWorkflowStageList.value.length === 0) {
      isHiddenWorkflowListExpanded.value = false
    }

    await ogBaseThreadBoardApi('showWorkflowStage', {
      workflowStageId: id,
    })
    fetchThreadBoard()
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

    await ogBaseThreadBoardApi('hideWorkflowStage', {
      workflowStageId: id,
    })
    fetchThreadBoard()
  }

  const addOrgBookmark = async (orgId: number) => {
    await ogBaseThreadBoardApi('addOrgBookmark', {
      bookmarkOrgId: orgId,
    })
    fetchBookmarkList()
  }

  const addFolderBookmark = async (folderName: string, orgIdList: number[]) => {
    await ogBaseThreadBoardApi('addFolderBookmark', {
      folderName,
      orgIdList,
    })
    fetchBookmarkList()
  }

  const updateFolderBookmark = async (
    bookmarkId: number,
    folderName: string,
    orgIdList: number[]
  ) => {
    await ogBaseThreadBoardApi('updateFolderBookmark', {
      bookmarkId,
      folderName,
      orgIdList,
    })
    fetchBookmarkList()
  }

  const moveBookmark = async (bookmarkId: number, newIndex: number) => {
    if (!bookmarkList.value) {
      throw new Error('bookmarkList undefined')
    }

    await ogBaseThreadBoardApi('moveBookmark', {
      bookmarkId,
      targetBookmarkId:
        bookmarkList.value[newIndex === 0 ? newIndex + 1 : newIndex - 1]
          .bookmarkId,
      isMoveToBeforeTarget: newIndex === 0,
    })
    fetchBookmarkList()
  }

  const removeBookmark = async (bookmarkId: number) => {
    if (!bookmarkList.value) {
      throw new Error('bookmarkList undefined')
    }

    if (
      bookmarkFilter.value &&
      bookmarkFilter.value.bookmarkId === bookmarkId
    ) {
      const index = bookmarkList.value.findIndex(
        (b) => b.bookmarkId === bookmarkId
      )
      if (index < 0) {
        throw new Error('bookmark not found')
      }

      const nextBookmarkIndex =
        index === bookmarkList.value.length - 1 ? index - 1 : index + 1
      bookmarkFilter.value.bookmarkId =
        bookmarkList.value[nextBookmarkIndex].bookmarkId
    }

    bookmarkList.value = bookmarkList.value.filter(
      (b) => b.bookmarkId !== bookmarkId
    )
    await ogBaseThreadBoardApi('removeBookmark', {
      bookmarkId,
    })
    fetchBookmarkList()
  }

  const getAllThreadBookmarkId = () => {
    if (!bookmarkList.value) {
      throw new Error('bookmarkList undefined')
    }

    let allThreadBookmarkId = null
    for (const bookmark of bookmarkList.value) {
      if (bookmark.bookmarkType === BookmarkType.FOLDER) {
        const folderBookmark = bookmark as FolderBookmark
        if (folderBookmark.isAllThread) {
          allThreadBookmarkId = folderBookmark.bookmarkId
          break
        }
      }
    }

    if (!allThreadBookmarkId) {
      throw new Error('allThreadBookmarkId undefined')
    }
    return allThreadBookmarkId
  }

  const init = async () => {
    isActive.value = true
    await Promise.all([fetchBookmarkList(), getContactOrgList()])

    bookmarkFilter.value = {
      bookmarkId: getAllThreadBookmarkId(),
      orgId: null,
    }
  }

  const cleanUp = async () => {
    if (fetchThreadBoardAbortController.value) {
      fetchThreadBoardAbortController.value.abort()
      fetchThreadBoardAbortController.value = null
    }

    isActive.value = false
    isFirstThreadBoardFetch.value = true
    activeThreadSideId.value = null
    contactOrgList.value = null
    bookmarkList.value = null
    rawWorkflowStageList.value = undefined
    workflowStageList.value = undefined
    isCreatingWorkflowStage.value = false
    creatingWorkflowStageName.value = null
    creatingWorkflowStageThreadList.value = []
    creatingGhostWorkflowStage.value = null
    loading.value = false
    isDefaultWorkflowStageExpanded.value = true
    isHiddenWorkflowListExpanded.value = false
    bookmarkFilter.value = null
    Object.assign(threadBoardQuery, defaultThreadBoardQuery())
    searchText.value = ''
    mostParticipantId.value = undefined
    participantFilterIdList.value = []
    onFetchSuccess = null
  }

  watch(bookmarkFilter, async () => {
    await fetchThreadBoardQuery()
  })

  watch(threadBoardQuery, async () => {
    try {
      if (!bookmarkFilter.value) {
        throw new Error('bookmarkFilter undefined')
      }

      searchText.value =
        threadBoardQuery.search == null ? '' : threadBoardQuery.search
      await fetchThreadBoard(true)

      ogBaseThreadBoardApi('saveThreadBoardQuery', {
        threadBoardQuery,
        bookmarkId: bookmarkFilter.value.bookmarkId,
      })

      onFetchSuccess?.()
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
    bookmarkList,
    bookmarkFilter,
    currentBookmarkInfo,
    contactOrgList,
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
    getAllThreadBookmarkId,
    setBookmarkFilter,
    updateQuery,
    updateSearchText,
    clearAllQuery,
    clearCreatedByFilter,
    clearParticipantsFilter,
    clearStickerTypeFilter,
    clearDateCreatedFilter,
    markAsAllRead,
    fetchThreadBoard,
    fetchBookmarkList,
    expandDefaultWorkflowStage,
    collapseDefaultWorkflowStage,
    expandHiddenWorkflowStageList,
    collapseHiddenWorkflowStage,
    openMaterialDetail,
    openStickerDrawerByThread,
    isThreadCardActive,
    gotoThreadCard,
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
    addOrgBookmark,
    addFolderBookmark,
    updateFolderBookmark,
    moveBookmark,
    removeBookmark,
  }
})

export default useThreadBoardStore
