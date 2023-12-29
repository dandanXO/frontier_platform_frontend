<template lang="pug">
div(class="flex-1 h-full flex flex-col")
  div(class="w-full h-16 border-b border-grey-150 px-5 flex justify-between items-center")
    div(class="flex items-center gap-x-2")
      div(
        v-if="bookmarkManagerTitleInfo.icon"
        class="w-8 h-8 flex items-center justify-center border rounded-full border-grey-150"
      )
        f-svg-icon(
          :iconName="bookmarkManagerTitleInfo.icon"
          class="text-grey-600 cursor-pointer"
        )
      div(v-if="isEditingCurrentFolderBookmarkName" class="px-2.5 py-4 flex gap-2")
        f-input-text(
          class="w-75"
          :placeholder="$t('TT0238')"
          v-model:textValue="currentFolderBookmarkEditingName"
        )
        div(class="flex flex-row gap-2 items-center")
          f-svg-icon(
            class="cursor-pointer"
            :class="isCurrentFolderBookmarkEditingNameValid ? 'text-primary-400' : 'text-grey-400'"
            iconName="done"
            size="24"
            @click="() => { isCurrentFolderBookmarkEditingNameValid && confirmRenameCurrentFolderBookmark(); }"
          )
          f-svg-icon(
            class="cursor-pointer"
            iconName="clear"
            size="24"
            @click="cancelRenameCurrentFolderBookmark"
          )
      p(v-else class="text-body1 font-bold text-grey-800") {{ bookmarkManagerTitleInfo.title }}
    div(class="flex items-center gap-x-4")
      f-popper(
        v-if="bookmarkManagerTitleInfo.showMoreIcon"
        placement="bottom-end"
      )
        template(#trigger)
          f-svg-icon(iconName="more_horiz" class="text-grey-600 cursor-pointer")
        template(#content="{ collapsePopper }")
          f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
      f-svg-icon(
        iconName="clear"
        class="text-grey-600 cursor-pointer"
        @click="closeBookmarkManager"
      )
  f-scrollbar-container(class="flex-1")
    div(class="w-full h-8 mt-3 mb-2 px-5 flex items-center justify-between")
      f-input-text(
        size="md"
        :placeholder="$t('RR0053')"
        prependIcon="search"
        v-model:textValue="searchText"
      )
      div(class="flex items-center gap-x-2")
        f-button(
          v-if="isBookmarkBarActive"
          type="secondary"
          size="sm"
          @click="createFolder"
        ) {{ $t('TT0233') }}
        f-popper(v-if="!isAllThreadBookmarkActive" placement="bottom")
          template(#trigger)
            f-button(type="primary" size="sm" prependIcon="add") {{ $t('TT0234') }}
          template(#content)
            f-contextual-menu(
              v-model:inputSelectValue="addMenuSelectedOrgId"
              :menuTree="addBookmarkMenuTree"
              :selectMode="CONTEXTUAL_MENU_MODE.MULTIPLE"
            )
    div(class="w-full flex-1 min-h-0 px-5 pb-2")
      div(class="w-full border border-grey-150 rounded-md p-2")
        div(class="flex flex-col gap-y-1.5")
          template(v-if="isBookmarkBarActive")
            template(v-if="bookmarkBarBookmarkList.length === 0")
              div(class="flex items-center justify-center h-12")
                span(class="text-body2 text-grey-400") {{ isSearching ? $t('RR0105') : $t('TT0239') }}
            draggable(
              v-else
              v-model="bookmarkBarBookmarkList"
              v-bind="bookmarkDragOptions"
            )
              template(#item="{ element: bookmark }")
                bookmark-manager-content-item(
                  :key="bookmark.bookmarkId"
                  :class="{ 'draggable-bookmark': isBookmarkDraggable(bookmark) }"
                  v-bind="getBookmarkProps(bookmark)"
                  @click:text="bookmark.bookmarkType === BookmarkType.FOLDER && setCurrentBookmarkId(bookmark.bookmarkId)"
                )
          template(v-else)
            template(v-if="currentBookmarkOrgList.length === 0")
              div(class="flex items-center justify-center h-12")
                span(class="text-body2 text-grey-400") {{ isSearching ? $t('RR0105') : $t('TT0239') }}
            draggable(
              v-else
              v-model="currentBookmarkOrgList"
              v-bind="bookmarkDragOptions"
            )
              template(#item="{ element: org, index }")
                bookmark-manager-content-item(
                  :key="index"
                  :class="{ 'draggable-bookmark': isOrgItemDraggable }"
                  v-bind="getOrgProps(org)"
                )
  div(class="w-full h-16 border-t border-grey-150 pr-5 flex items-center justify-end")
    f-button(
      type="primary"
      size="md"
      :prependIcon="isDirty ? 'done' : undefined"
      :disabled="!isDirty"
      @click="saveBookmarkManager"
    ) {{ $t('UU0018') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { onKeyStroke } from '@vueuse/core'
import Draggable from 'vuedraggable'
import {
  BookmarkType,
  type FolderBookmarkAllOfOrgList,
} from '@frontier/platform-web-sdk'
import type { MenuItem, MenuTree } from '@frontier/ui-component'
import { CONTEXTUAL_MENU_MODE } from '@frontier/constants'
import useBookmarkManagerStore from '@/stores/threadBoard/bookmarkManager'
import BookmarkManagerContentItem from '@/components/threadBoard/bookmark/modalBookmarkManager/BookmarkManagerContentItem.vue'
import { processBookmarkByType } from '@/utils/bookmark'
import type {
  BookmarkManagerFolderBookmark,
  BookmarkManagerOrgBookmark,
} from '@/types'

const bookmarkManagerStore = useBookmarkManagerStore()
const { t } = useI18n()

const bookmarkDragOptions = {
  itemKey: 'bookmarkId',
  forceFallback: true,
  scrollSensitivity: 40,
  scrollSpeed: 7,
  animation: 250,
  group: 'bookmark-item',
  draggable: '.draggable-bookmark',
  disabled: false,
  dragClass: 'vue-draggable-bookmark-drag',
  ghostClass: 'vue-draggable-bookmark-ghost',
}

const {
  setCurrentBookmarkId,
  setHoveringBookmarkId,
  copyOrgToFolderBookmark,
  copyOrgToBookmarkBar,
  moveFolderOrgItemToBookmarkBar,
  moveFolderOrgItemToFolderBookmark,
  moveOrgBookmarkToFolderBookmark,
  removeBookmark,
  removeFolderBookmarkOrgItem,
  createFolder,
  startRenameFolderBookmark,
  startRenameCurrentFolderBookmark,
  confirmRenameCurrentFolderBookmark,
  cancelRenameCurrentFolderBookmark,
  closeBookmarkManager,
  saveBookmarkManager,
} = bookmarkManagerStore

const {
  isDirty,
  isAllThreadBookmarkActive,
  isCurrentFolderBookmarkEditingNameValid,
  isEditingCurrentFolderBookmarkName,
  currentFolderBookmarkEditingName,
  isEditingFolderBookmarkName,
  folderBookmarkList,
  bookmarkBarBookmarkList,
  currentBookmarkOrgList,
  currentBookmarkId,
  currentBookmark,
  editingNameBookmarkId,
  addMenuSelectedOrgId,
  addBookmarkMenuTree,
  isBookmarkBarActive,
  searchText,
  bookmarkManagerTitleInfo,
} = storeToRefs(bookmarkManagerStore)

const isSearching = computed(() => {
  if (searchText.value == null) {
    return false
  }

  return searchText.value.length > 0
})

const isOrgItemDraggable = computed(() => !isSearching.value)

const isBookmarkDraggable = (
  bookmark: BookmarkManagerFolderBookmark | BookmarkManagerOrgBookmark
) => {
  if (searchText.value || isEditingFolderBookmarkName.value) {
    return false
  }

  return processBookmarkByType(bookmark, {
    allThreads: () => false,
    [BookmarkType.FOLDER]: () => true,
    [BookmarkType.ORG]: () => true,
  })
}

const getOrgProps = (org: FolderBookmarkAllOfOrgList) => {
  const menuList: MenuItem[] = []
  menuList.push({
    title: t('RR0056'),
    blockList: [
      {
        menuList: [
          {
            title: t('TT0232'),
            clickHandler: () => {
              copyOrgToBookmarkBar(org)
              setHoveringBookmarkId(null)
            },
            mouseEnterHandler: () => {
              setHoveringBookmarkId('bookmarkBar')
            },
            mouseLeaveHandler: () => {
              setHoveringBookmarkId(null)
            },
          },
          ...folderBookmarkList.value
            .filter((b) => !b.isAllThread)
            .filter((b) => b.bookmarkId !== currentBookmarkId.value)
            .map((folderBookmark) => ({
              title: folderBookmark.folderName,
              icon: 'org_folder',
              clickHandler: () => {
                copyOrgToFolderBookmark(org, folderBookmark.bookmarkId)
                setHoveringBookmarkId(null)
              },
              mouseEnterHandler: () => {
                setHoveringBookmarkId(folderBookmark.bookmarkId)
              },
              mouseLeaveHandler: () => {
                setHoveringBookmarkId(null)
              },
            })),
        ],
      },
    ],
  })

  if (!isAllThreadBookmarkActive.value) {
    menuList.push({
      title: t('RR0279'),
      blockList: [
        {
          menuList: [
            {
              title: t('TT0232'),
              clickHandler: () => {
                setHoveringBookmarkId(null)

                if (!currentBookmarkId.value) {
                  throw new Error('currentBookmarkId is not defined')
                }

                moveFolderOrgItemToBookmarkBar(currentBookmarkId.value, org)
              },
              mouseEnterHandler: () => {
                setHoveringBookmarkId('bookmarkBar')
              },
              mouseLeaveHandler: () => {
                setHoveringBookmarkId(null)
              },
            },
            ...folderBookmarkList.value
              .filter((b) => !b.isAllThread)
              .filter((b) => b.bookmarkId !== currentBookmarkId.value)
              .map((folderBookmark) => ({
                title: folderBookmark.folderName,
                icon: 'org_folder',
                clickHandler: () => {
                  setHoveringBookmarkId(null)

                  if (!currentBookmarkId.value) {
                    throw new Error('currentBookmarkId is not defined')
                  }

                  moveFolderOrgItemToFolderBookmark(
                    currentBookmarkId.value,
                    org,
                    folderBookmark.bookmarkId
                  )
                },
                mouseEnterHandler: () => {
                  setHoveringBookmarkId(folderBookmark.bookmarkId)
                },
                mouseLeaveHandler: () => {
                  setHoveringBookmarkId(null)
                },
              })),
          ],
        },
      ],
    })
    menuList.push({
      title: t('RR0280'),
      clickHandler: () => {
        if (!currentBookmarkId.value) {
          throw new Error('currentBookmarkId is not defined')
        }
        removeFolderBookmarkOrgItem(currentBookmarkId.value, org.orgId)
      },
    })
  }

  const menuTree: MenuTree = { blockList: [{ menuList }] }

  return {
    bookmarkType: BookmarkType.ORG,
    draggable: isOrgItemDraggable.value,
    isEditingName: false,
    text: org.orgName,
    svgIcon: null,
    orgLogo: org.logo,
    menuTree,
  }
}

const getBookmarkMenuTree = (
  bookmark: BookmarkManagerOrgBookmark | BookmarkManagerFolderBookmark,
  isCurrentBookmark: boolean
): MenuTree => {
  const menuList: MenuItem[] = []

  processBookmarkByType(bookmark, {
    [BookmarkType.FOLDER]: (folderBookmark) => {
      if (!folderBookmark.isAllThread) {
        menuList.push({
          title: t('RR0302'),
          clickHandler: () => {
            if (isCurrentBookmark) {
              startRenameCurrentFolderBookmark()
            } else {
              startRenameFolderBookmark(bookmark.bookmarkId)
            }
          },
        })
        menuList.push({
          title: t('RR0280'),
          clickHandler: () => {
            removeBookmark(folderBookmark.bookmarkId)
          },
        })
      }
    },
    [BookmarkType.ORG]: (orgBookmark) => {
      menuList.push({
        title: t('RR0056'),
        blockList: [
          {
            menuList: folderBookmarkList.value
              .filter((b) => !b.isAllThread)
              .map((folderBookmark) => ({
                title: folderBookmark.folderName,
                icon: 'org_folder',
                clickHandler: () => {
                  copyOrgToFolderBookmark(
                    orgBookmark.org,
                    folderBookmark.bookmarkId
                  )
                  setHoveringBookmarkId(null)
                },
                mouseEnterHandler: () => {
                  setHoveringBookmarkId(folderBookmark.bookmarkId)
                },
                mouseLeaveHandler: () => {
                  setHoveringBookmarkId(null)
                },
              })),
          },
        ],
      })
      menuList.push({
        title: t('RR0279'),
        blockList: [
          {
            menuList: folderBookmarkList.value
              .filter((b) => !b.isAllThread)
              .map((folderBookmark) => ({
                title: folderBookmark.folderName,
                icon: 'org_folder',
                clickHandler: () => {
                  moveOrgBookmarkToFolderBookmark(
                    orgBookmark,
                    folderBookmark.bookmarkId
                  )
                  setHoveringBookmarkId(null)
                },
                mouseEnterHandler: () => {
                  setHoveringBookmarkId(folderBookmark.bookmarkId)
                },
                mouseLeaveHandler: () => {
                  setHoveringBookmarkId(null)
                },
              })),
          },
        ],
      })
      menuList.push({
        title: t('RR0280'),
        clickHandler: () => {
          removeBookmark(orgBookmark.bookmarkId)
        },
      })
    },
  })

  return { blockList: [{ menuList }] }
}

const getBookmarkProps = (
  bookmark: BookmarkManagerOrgBookmark | BookmarkManagerFolderBookmark
) => {
  const basicInfo = processBookmarkByType<{
    text: string
    svgIcon: string | null
    orgLogo: string | null
  }>(bookmark, {
    allThreads: (allThreadBookmark) => ({
      text: allThreadBookmark.folderName,
      orgLogo: null,
      svgIcon: 'all',
    }),
    [BookmarkType.FOLDER]: (folderBookmark) => ({
      text: folderBookmark.folderName,
      svgIcon: 'org_folder',
      orgLogo: null,
    }),
    [BookmarkType.ORG]: (orgBookmark) => ({
      text: orgBookmark.org.orgName,
      svgIcon: null,
      orgLogo: orgBookmark.org.logo,
    }),
  })

  return {
    ...basicInfo,
    bookmarkType: bookmark.bookmarkType,
    draggable: isBookmarkDraggable(bookmark),
    isEditingName: editingNameBookmarkId.value === bookmark.bookmarkId,
    menuTree: getBookmarkMenuTree(bookmark, false),
  }
}

const menuTree = computed<MenuTree>(() => {
  if (!currentBookmark.value) {
    return { blockList: [] }
  }
  return getBookmarkMenuTree(currentBookmark.value, true)
})

onKeyStroke('Enter', () => {
  if (isCurrentFolderBookmarkEditingNameValid.value) {
    confirmRenameCurrentFolderBookmark()
  }
})
</script>

<style scoped></style>
