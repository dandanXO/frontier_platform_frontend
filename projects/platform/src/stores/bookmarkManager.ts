import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { defineStore, storeToRefs } from 'pinia'
import { clone } from 'ramda'
import useThreadBoardStore from './threadBoard'
import {
  BookmarkType,
  type FolderBookmark,
  type OrgBookmark,
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

const useBookmarkManagerStore = defineStore(
  'threadBoard/bookmarkManager',
  () => {
    const { t } = useI18n()
    const { unit } = useCurrentUnit()
    const store = useStore()
    const threadBoardStore = useThreadBoardStore()

    const { bookmarkList, contactOrgList } = storeToRefs(threadBoardStore)

    const searchText = ref<string | null>('')
    const bookmarkManagerBookmarkList = ref<
      (BookmarkManagerOrgBookmark | BookmarkManagerFolderBookmark)[] | null
    >(null)
    const currentBookmarkId = ref<BookmarkManagerBookmarkId | null>(null)
    const hoveringBookmarkId = ref<
      BookmarkManagerBookmarkId | 'bookmarkBar' | null
    >(null)

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
      threadBoardStore.getBookmarkList()
      bookmarkManagerBookmarkList.value = null
      store.dispatch('helper/closeModalBehavior')
    }

    const cleanup = () => {
      currentBookmarkId.value = null
      hoveringBookmarkId.value = null
      bookmarkManagerBookmarkList.value = null
      searchText.value = ''
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

    return {
      isDirty,
      bookmarkManagerBookmarkList,
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
      setCurrentBookmarkId,
      setHoveringBookmarkId,
      openBookmarkManager,
      closeBookmarkManager,
      saveBookmarkManager,
    }
  }
)

export default useBookmarkManagerStore
