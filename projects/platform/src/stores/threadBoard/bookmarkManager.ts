import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { defineStore, storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { clone } from 'ramda'
import useThreadBoardStore from '@/stores/threadBoard'
import {
  BookmarkType,
  type FolderBookmark,
  type OrgBookmark,
  type OrgBookmarkAllOfOrg,
  type SaveThreadBoardBookmarkListRequest,
} from '@frontier/platform-web-sdk'
import { NOTIFY_TYPE } from '@frontier/constants'
import useCurrentUnit from '@/composables/useCurrentUnit'
import threadBoardApi from '@/apis/threadBoard'
import { processBookmarkByType } from '@/utils/bookmark'
import type {
  BookmarkManagerBookmarkId,
  BookmarkManagerFolderBookmark,
  BookmarkManagerOrgBookmark,
} from '@/types'
import { isCaseInsensitiveMatch } from '@/utils/string'
import type { MenuBlock, MenuItem, MenuTree } from '@frontier/ui-component'
import { useNotifyStore } from '@/stores/notify'
import useNameEditor from '@/composables/useNameEditor'

const useBookmarkManagerStore = defineStore(
  'threadBoard/bookmarkManager',
  () => {
    const { t } = useI18n()
    const { unit } = useCurrentUnit()
    const store = useStore()
    const notify = useNotifyStore()
    const threadBoardStore = useThreadBoardStore()

    const { bookmarkList, contactOrgList } = storeToRefs(threadBoardStore)
    const { setBookmarkFilter, getAllThreadBookmarkId } = threadBoardStore

    const searchText = ref<string | null>('')
    const bookmarkManagerBookmarkList = ref<
      (BookmarkManagerOrgBookmark | BookmarkManagerFolderBookmark)[] | null
    >(null)
    const currentBookmarkId = ref<BookmarkManagerBookmarkId | null>(null)
    const hoveringBookmarkId = ref<
      BookmarkManagerBookmarkId | 'bookmarkBar' | null
    >(null)
    const editingNameBookmarkId = ref<BookmarkManagerBookmarkId | null>(null)

    const baseReq = computed(() => ({
      orgId: unit.value.orgId,
      ogType: unit.value.ogType,
      ogId: unit.value.ogId,
    }))

    const isDirty = computed(() => {
      if (!bookmarkList.value || !bookmarkBarBookmarkList.value) {
        return false
      }

      return (
        JSON.stringify(bookmarkList.value) !==
        JSON.stringify(bookmarkBarBookmarkList.value)
      )
    })

    const isBookmarkBarActive = computed(() => currentBookmarkId.value == null)

    const currentBookmark = computed(() => {
      if (
        currentBookmarkId.value == null ||
        !bookmarkManagerBookmarkList.value
      ) {
        return null
      }

      const bookmark = bookmarkManagerBookmarkList.value.find(
        (b) => b.bookmarkId === currentBookmarkId.value
      )

      if (!bookmark) {
        throw new Error('current bookmark not found')
      }

      if (bookmark.bookmarkType !== BookmarkType.FOLDER) {
        throw new Error('current bookmark is not a folder')
      }

      return bookmark as FolderBookmark
    })

    const isAllThreadBookmarkActive = computed(() => {
      if (!currentBookmark.value) {
        return false
      }

      return processBookmarkByType(currentBookmark.value, {
        allThreads: () => true,
        [BookmarkType.FOLDER]: () => false,
        [BookmarkType.ORG]: () => false,
      })
    })

    const bookmarkManagerTitleInfo = computed(() => {
      const info = {
        title: t('TT0232'),
        icon: null as string | null,
        showMoreIcon: false,
      }

      if (!currentBookmark.value) {
        return info
      }

      processBookmarkByType(currentBookmark.value, {
        allThreads: (allThreadBookmark) => {
          info.title = allThreadBookmark.folderName
          info.icon = 'all'
          info.showMoreIcon = false
        },
        [BookmarkType.FOLDER]: (folderBookmark) => {
          info.title = folderBookmark.folderName
          info.icon = 'org_folder'
          info.showMoreIcon = true
        },
        [BookmarkType.ORG]: () => {
          info.title = ''
          info.icon = null
          info.showMoreIcon = false
        },
      })

      return info
    })

    const folderBookmarkList = computed(() => {
      if (!bookmarkManagerBookmarkList.value) {
        return []
      }

      return bookmarkManagerBookmarkList.value.filter(
        (b) => b.bookmarkType === BookmarkType.FOLDER
      ) as FolderBookmark[]
    })

    const bookmarkBarBookmarkList = computed({
      get: () => {
        if (!bookmarkManagerBookmarkList.value) {
          return []
        }

        return bookmarkManagerBookmarkList.value.filter((bookmark) =>
          processBookmarkByType(bookmark, {
            [BookmarkType.FOLDER]: (folderBookmark) => {
              return isCaseInsensitiveMatch(
                folderBookmark.folderName,
                searchText.value || ''
              )
            },
            [BookmarkType.ORG]: (orgBookmark) => {
              return isCaseInsensitiveMatch(
                orgBookmark.org.orgName,
                searchText.value || ''
              )
            },
          })
        )
      },
      set: (list) => {
        if (searchText.value) {
          throw new Error('cannot move bookmark when search enable')
        }
        bookmarkManagerBookmarkList.value = list
      },
    })

    const currentBookmarkOrgList = computed({
      get: () => {
        if (
          !currentBookmark.value ||
          currentBookmark.value.bookmarkType !== BookmarkType.FOLDER
        ) {
          return []
        }

        return (currentBookmark.value as FolderBookmark).orgList.filter((org) =>
          isCaseInsensitiveMatch(org.orgName, searchText.value || '')
        )
      },
      set: (list) => {
        if (searchText.value) {
          throw new Error('cannot move bookmark when search enable')
        }

        if (!currentBookmark.value) {
          throw new Error('currentBookmark undefined')
        }

        currentBookmark.value.orgList = list
      },
    })

    const addMenuSelectedOrgId = computed({
      get: () => {
        if (isBookmarkBarActive.value) {
          const orgBookmarkList = bookmarkBarBookmarkList.value.filter(
            (bookmark) => bookmark.bookmarkType === BookmarkType.ORG
          ) as OrgBookmark[]
          const orgIdList = orgBookmarkList.map(
            (orgBookmark) => orgBookmark.org.orgId
          )
          return orgIdList
        }

        return currentBookmarkOrgList.value.map((org) => org.orgId)
      },
      set: (selectedOrgIdList: number[]) => {
        const getOrgById = (orgId: number) => {
          if (!contactOrgList.value) {
            throw new Error('contactOrgList undefined')
          }
          const org = contactOrgList.value.find((org) => org.orgId === orgId)
          if (!org) {
            throw new Error('org undefined')
          }
          return org
        }

        if (currentBookmark.value) {
          currentBookmark.value.orgList = selectedOrgIdList.map(getOrgById)
          return
        }

        const processNewSelectedOrgId = () => {
          selectedOrgIdList.forEach((orgId) => {
            if (!bookmarkManagerBookmarkList.value) {
              throw new Error('bookmarkManagerBookmarkList undefined')
            }

            if (addMenuSelectedOrgId.value.includes(orgId)) {
              return
            }

            const newOrg = getOrgById(orgId)
            if (!newOrg) {
              throw new Error('newOrg undefined')
            }
            const newOrgBookmark: BookmarkManagerOrgBookmark = {
              bookmarkId: uuidv4(),
              bookmarkType: BookmarkType.ORG,
              org: getOrgById(orgId),
            }
            bookmarkManagerBookmarkList.value.push(newOrgBookmark)
          })
        }
        const processRemovedOrgId = () => {
          addMenuSelectedOrgId.value.forEach((orgId) => {
            if (!bookmarkManagerBookmarkList.value) {
              throw new Error('bookmarkManagerBookmarkList undefined')
            }

            if (selectedOrgIdList.includes(orgId)) {
              return
            }
            bookmarkManagerBookmarkList.value =
              bookmarkManagerBookmarkList.value.filter((bookmark) => {
                if (bookmark.bookmarkType === BookmarkType.FOLDER) {
                  return true
                }

                if (bookmark.bookmarkType !== BookmarkType.ORG) {
                  const orgBookmark = bookmark as OrgBookmark
                  return orgBookmark.org.orgId !== orgId
                }
              })
          })
        }
        processRemovedOrgId()
        processNewSelectedOrgId()
      },
    })

    const addBookmarkMenuTree = computed<MenuTree>(() => {
      const getMenuList = (): MenuItem[] => {
        if (!contactOrgList.value) {
          return []
        }

        return contactOrgList.value.map((org) => ({
          title: org.orgName,
          thumbnail: org.logo,
          selectValue: org.orgId,
        }))
      }

      const menuBlock: MenuBlock = {
        blockTitle: t('TT0221'),
        menuList: getMenuList(),
      }

      return {
        searchEnable: true,
        blockList: [menuBlock],
      }
    })

    const setCurrentBookmarkId = (
      bookmarkId: BookmarkManagerBookmarkId | null
    ) => {
      currentBookmarkId.value = bookmarkId
    }

    const setHoveringBookmarkId = (
      bookmarkId: BookmarkManagerBookmarkId | null
    ) => {
      hoveringBookmarkId.value = bookmarkId
    }

    const createFolder = () => {
      if (!bookmarkManagerBookmarkList.value) {
        throw new Error('bookmarkManagerBookmarkList undefined')
      }

      const newFolderBookmark: BookmarkManagerFolderBookmark = {
        bookmarkId: uuidv4(),
        bookmarkType: BookmarkType.FOLDER,
        isAllThread: false,
        folderName: t('TT0220'),
        orgList: [],
      }

      bookmarkManagerBookmarkList.value.push(newFolderBookmark)
      currentBookmarkId.value = newFolderBookmark.bookmarkId
    }

    const moveFolderOrgItemToBookmarkBar = (
      sourceFolderBookmarkId: BookmarkManagerBookmarkId,
      org: OrgBookmarkAllOfOrg
    ) => {
      const copySuccess = copyOrgToBookmarkBar(org)
      if (copySuccess) {
        removeFolderBookmarkOrgItem(sourceFolderBookmarkId, org.orgId)
      }
    }

    const moveFolderOrgItemToFolderBookmark = (
      sourceFolderBookmarkId: BookmarkManagerBookmarkId,
      org: OrgBookmarkAllOfOrg,
      destinationFolderBookmarkId: BookmarkManagerBookmarkId
    ) => {
      const copySuccess = copyOrgToFolderBookmark(
        org,
        destinationFolderBookmarkId
      )
      if (copySuccess) {
        removeFolderBookmarkOrgItem(sourceFolderBookmarkId, org.orgId)
      }
    }

    const moveOrgBookmarkToFolderBookmark = (
      orgBookmark: BookmarkManagerOrgBookmark,
      destinationFolderBookmarkId: BookmarkManagerBookmarkId
    ) => {
      const copySuccess = copyOrgToFolderBookmark(
        orgBookmark.org,
        destinationFolderBookmarkId
      )
      if (copySuccess) {
        removeBookmark(orgBookmark.bookmarkId)
      }
    }

    const copyOrgToBookmarkBar = (org: OrgBookmarkAllOfOrg): boolean => {
      if (!bookmarkManagerBookmarkList.value) {
        throw new Error('bookmarkManagerBookmarkList undefined')
      }

      const isOrgDuplicated = () => {
        if (!bookmarkManagerBookmarkList.value) {
          throw new Error('bookmarkManagerBookmarkList undefined')
        }

        return bookmarkManagerBookmarkList.value.some((bookmark) => {
          return processBookmarkByType(bookmark, {
            [BookmarkType.FOLDER]: () => false,
            [BookmarkType.ORG]: (orgBookmark) =>
              orgBookmark.org.orgId === org.orgId,
          })
        })
      }

      if (isOrgDuplicated()) {
        notify.showNotifySnackbar({
          isShowSnackbar: true,
          notifyType: NOTIFY_TYPE.WARNING,
          messageText: t('TT0240'),
        })
        return false
      }

      const newOrgBookmark: BookmarkManagerOrgBookmark = {
        bookmarkId: uuidv4(),
        bookmarkType: BookmarkType.ORG,
        org,
      }

      bookmarkManagerBookmarkList.value.push(newOrgBookmark)
      return true
    }

    const copyOrgToFolderBookmark = (
      org: OrgBookmarkAllOfOrg,
      folderBookmarkId: BookmarkManagerBookmarkId
    ): boolean => {
      if (!bookmarkManagerBookmarkList.value) {
        throw new Error('bookmarkManagerBookmarkList undefined')
      }

      const targetBookmark = bookmarkManagerBookmarkList.value.find(
        (bookmark) => bookmark.bookmarkId === folderBookmarkId
      )
      if (!targetBookmark) {
        throw new Error('targetBookmark undefined')
      }
      if (targetBookmark.bookmarkType !== BookmarkType.FOLDER) {
        throw new Error('targetBookmark is not a folder')
      }

      const targetFolderBookmark = targetBookmark as FolderBookmark
      const isOrgDuplicated = () => {
        if (!bookmarkManagerBookmarkList.value) {
          throw new Error('bookmarkManagerBookmarkList undefined')
        }
        return targetFolderBookmark.orgList.some((o) => o.orgId === org.orgId)
      }
      if (isOrgDuplicated()) {
        notify.showNotifySnackbar({
          isShowSnackbar: true,
          notifyType: NOTIFY_TYPE.WARNING,
          messageText: t('TT0240'),
        })
        return false
      }

      targetFolderBookmark.orgList.push(org)
      return true
    }

    const {
      isEditingName: isEditingCurrentFolderBookmarkName,
      currentName: currentFolderBookmarkEditingName,
      isNameValid: isCurrentFolderBookmarkEditingNameValid,
      startEdit: startRenameCurrentFolderBookmark,
      doneEdit: currentFolderBookmarkDoneEdit,
    } = useNameEditor(computed(() => bookmarkManagerTitleInfo.value.title))

    const confirmRenameCurrentFolderBookmark = () => {
      if (!currentBookmark.value) {
        throw new Error('currentBookmark undefined')
      }

      if (currentBookmark.value.bookmarkType !== BookmarkType.FOLDER) {
        throw new Error('currentBookmark is not a folder')
      }

      const currentFolderBookmark = currentBookmark.value as FolderBookmark
      currentFolderBookmark.folderName = currentFolderBookmarkEditingName.value
      currentFolderBookmarkDoneEdit()
    }

    const cancelRenameCurrentFolderBookmark = () => {
      currentFolderBookmarkDoneEdit()
    }

    const {
      isEditingName: isEditingFolderBookmarkName,
      currentName: folderBookmarkEditingName,
      isNameValid: isFolderBookmarkEditingNameValid,
      startEdit: startEditFolderBookmarkName,
      doneEdit: folderBookmarkDoneEdit,
    } = useNameEditor(
      computed(() => {
        if (!bookmarkManagerBookmarkList.value) {
          throw new Error('bookmarkManagerBookmarkList undefined')
        }

        const bookmark = bookmarkManagerBookmarkList.value.find(
          (bookmark) => bookmark.bookmarkId === editingNameBookmarkId.value
        )

        if (!bookmark) {
          return ''
        }
        if (bookmark.bookmarkType !== BookmarkType.FOLDER) {
          throw new Error('bookmark is not a folder')
        }

        return (bookmark as FolderBookmark).folderName
      })
    )

    const startRenameFolderBookmark = (
      bookmarkId: BookmarkManagerBookmarkId
    ) => {
      editingNameBookmarkId.value = bookmarkId
      startEditFolderBookmarkName()
    }

    const confirmRenameFolderBookmark = () => {
      if (!bookmarkManagerBookmarkList.value) {
        throw new Error('bookmarkManagerBookmarkList undefined')
      }

      bookmarkManagerBookmarkList.value = bookmarkManagerBookmarkList.value.map(
        (bookmark) => {
          if (bookmark.bookmarkId === editingNameBookmarkId.value) {
            return { ...bookmark, folderName: folderBookmarkEditingName.value }
          }
          return bookmark
        }
      )

      editingNameBookmarkId.value = null
      folderBookmarkDoneEdit()
    }

    const cancelRenameFolderBookmark = () => {
      editingNameBookmarkId.value = null
      folderBookmarkDoneEdit()
    }

    const removeBookmark = (targetBookmarkId: BookmarkManagerBookmarkId) => {
      if (!bookmarkManagerBookmarkList.value) {
        throw new Error('bookmarkManagerBookmarkList undefined')
      }

      if (currentBookmarkId.value === targetBookmarkId) {
        currentBookmarkId.value = null
      }

      bookmarkManagerBookmarkList.value =
        bookmarkManagerBookmarkList.value.filter(
          (bookmark) => bookmark.bookmarkId !== targetBookmarkId
        )
    }

    const removeFolderBookmarkOrgItem = (
      folderBookmarkId: BookmarkManagerBookmarkId,
      orgId: number
    ) => {
      if (!bookmarkManagerBookmarkList.value) {
        throw new Error('bookmarkManagerBookmarkList undefined')
      }

      bookmarkManagerBookmarkList.value = bookmarkManagerBookmarkList.value.map(
        (bookmark) => {
          if (bookmark.bookmarkId === folderBookmarkId) {
            if (bookmark.bookmarkType !== BookmarkType.FOLDER) {
              throw new Error('bookmark is not a folder')
            }

            const targetFolderBookmark = bookmark as FolderBookmark
            targetFolderBookmark.orgList = targetFolderBookmark.orgList.filter(
              (org) => org.orgId !== orgId
            )

            return targetFolderBookmark
          }
          return bookmark
        }
      )
    }

    const cleanup = () => {
      currentBookmarkId.value = null
      hoveringBookmarkId.value = null
      editingNameBookmarkId.value = null
      bookmarkManagerBookmarkList.value = null
      searchText.value = ''
    }

    const saveBookmarkManager = async () => {
      if (!bookmarkManagerBookmarkList.value) {
        throw new Error('bookmarkManagerBookmarkList undefined')
      }

      const bookmarkList = bookmarkManagerBookmarkList.value.map((bookmark) => {
        const bookmarkId =
          typeof bookmark.bookmarkId === 'string' ? null : bookmark.bookmarkId
        const bookmarkType = bookmark.bookmarkType
        if (bookmark.bookmarkType === BookmarkType.FOLDER) {
          const folderBookmark = bookmark as FolderBookmark
          return {
            bookmarkId,
            bookmarkType,
            folderName: folderBookmark.folderName,
            orgIdList: folderBookmark.orgList.map((org) => org.orgId),
          }
        } else {
          const orgBookmark = bookmark as OrgBookmark
          return {
            bookmarkId,
            bookmarkType,
            orgId: orgBookmark.org.orgId,
          }
        }
      })

      const req: SaveThreadBoardBookmarkListRequest = {
        ...baseReq.value,
        bookmarkList,
      }
      await threadBoardApi.saveThreadBoardBookmarkList(req)
      threadBoardStore.fetchBookmarkList()

      if (!currentBookmark.value) {
        setBookmarkFilter({
          bookmarkId: getAllThreadBookmarkId(),
          orgId: null,
        })
      }

      bookmarkManagerBookmarkList.value = null
      store.dispatch('helper/closeModalBehavior')
      cleanup()
    }

    const openBookmarkManager = () => {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-bookmark-manager',
      })
      bookmarkManagerBookmarkList.value = clone(bookmarkList.value)
    }

    const closeBookmarkManager = () => {
      if (isDirty.value) {
        store.dispatch('helper/pushModalConfirm', {
          type: NOTIFY_TYPE.WARNING,
          header: t('TT0235'),
          contentText: t('TT0236'),
          primaryBtnText: t('UU0128'),
          primaryBtnHandler: () => {
            store.dispatch('helper/closeModalBehavior')
            cleanup()
          },
          textBtnText: t('UU0002'),
        })
      } else {
        store.dispatch('helper/closeModalBehavior')
        cleanup()
      }
    }

    watch(currentBookmark, () => {
      cancelRenameCurrentFolderBookmark()
      cancelRenameFolderBookmark()
    })

    return {
      isDirty,
      isEditingCurrentFolderBookmarkName,
      isEditingFolderBookmarkName,
      isCurrentFolderBookmarkEditingNameValid,
      isFolderBookmarkEditingNameValid,
      bookmarkManagerBookmarkList,
      folderBookmarkList,
      bookmarkBarBookmarkList,
      currentBookmarkOrgList,
      contactOrgList,
      currentBookmark,
      isBookmarkBarActive,
      isAllThreadBookmarkActive,
      searchText,
      bookmarkManagerTitleInfo,
      currentBookmarkId,
      hoveringBookmarkId,
      editingNameBookmarkId,
      addMenuSelectedOrgId,
      addBookmarkMenuTree,
      setCurrentBookmarkId,
      setHoveringBookmarkId,
      startRenameFolderBookmark,
      confirmRenameFolderBookmark,
      cancelRenameFolderBookmark,
      moveFolderOrgItemToBookmarkBar,
      moveFolderOrgItemToFolderBookmark,
      moveOrgBookmarkToFolderBookmark,
      copyOrgToBookmarkBar,
      copyOrgToFolderBookmark,
      removeBookmark,
      removeFolderBookmarkOrgItem,
      currentFolderBookmarkEditingName,
      folderBookmarkEditingName,
      createFolder,
      startRenameCurrentFolderBookmark,
      confirmRenameCurrentFolderBookmark,
      cancelRenameCurrentFolderBookmark,
      openBookmarkManager,
      closeBookmarkManager,
      saveBookmarkManager,
    }
  }
)

export default useBookmarkManagerStore
