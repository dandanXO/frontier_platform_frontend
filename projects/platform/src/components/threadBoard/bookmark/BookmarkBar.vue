<template lang="pug">
div(class="relative flex flex-row items-center pl-7.5 overflow-hidden")
  div(
    ref="refBookmarkBarContainer"
    class="w-full h-full flex flex-row items-center relative"
  )
    draggable(
      v-if="bookmarkList"
      ref="refBookmarkList"
      class="absolute left-0 top-0 flex flex-row items-center invisible"
      v-model="bookmarkList"
      v-bind="bookmarkDragOptions"
      @change="handleBookmarkListChange"
      @start="handleBookmarkDragStart"
      @end="handleBookmarkDragEnd"
    )
      template(#item="{ element }")
        div(:ref="(el) => el && bookmarkListRefs.push(el)")
          bookmark-tab(
            :class="{ 'draggable-bookmark': !element.isAllThread }"
            :bookmark="element"
            :active="bookmarkFilter?.bookmarkId === element.bookmarkId"
            :dragging="isDraggingBookmark"
            @select="threadBoardStore.setBookmarkFilter"
          )
    draggable(
      v-if="bookmarkList"
      class="h-full flex flex-row items-center"
      v-model="bookmarkList"
      v-bind="bookmarkDragOptions"
      @change="handleBookmarkListChange"
      @start="handleBookmarkDragStart"
      @end="handleBookmarkDragEnd"
    )
      template(#item="{ element, index }")
        bookmark-tab(
          :class="{ 'draggable-bookmark': !element.isAllThread, hidden: haveCollapsedBookmarkList && index >= startToCollapseIndex }"
          :bookmark="element"
          :active="bookmarkFilter?.bookmarkId === element.bookmarkId"
          :dragging="isDraggingBookmark"
          @select="threadBoardStore.setBookmarkFilter"
        )
    div(
      v-if="haveCollapsedBookmarkList"
      class="w-11 h-9 flex flex-row items-center justify-center rounded-tl rounded-tr"
      :class="{ 'bg-grey-0 ': isCurrentBookmarkInCollapsedMenu }"
    )
      f-tooltip-standard(
        placement="bottom-start"
        :disabledTooltip="!isCurrentBookmarkInCollapsedMenu"
      )
        template(#slot:tooltip-trigger) 
          f-popper(placement="bottom-start")
            template(#trigger)
              div(
                class="w-6 h-6 flex items-center justify-center rounded cursor-pointer"
                :class="isCurrentBookmarkInCollapsedMenu ? 'text-grey-900' : 'text-grey-0 hover:bg-primary-700'"
              )
                f-svg-icon(iconName="double_arrow_right" size="20")
            template(#content="{ collapsePopper }")
              f-contextual-menu(
                :menuTree="collapsedBookmarkListMenuTree"
                @click:menu="collapsePopper"
              )
        template(v-if="currentBookmarkInfo" #slot:tooltip-content)
          p(class="font-bold") {{ currentBookmarkInfo.title }}
          p {{ currentBookmarkInfo.tooltipContent }}
    f-popper(placement="bottom-start")
      template(#trigger)
        div(
          class="relative w-11 h-9 flex items-center justify-center rounded-tl rounded-tr text-grey-0 cursor-pointer hover:bg-primary-700"
        )
          span(class="absolute left-0 top-1.5 w-px h-6 bg-primary-700")
          f-svg-icon(iconName="add" size="20")
      template(#content="{ collapsePopper }")
        f-contextual-menu(
          :menuTree="addBookmarkMenuTree(collapsePopper)"
          @click:menu="collapsePopper"
        )
</template>

<script setup lang="ts">
import { computed, onBeforeUpdate, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useElementBounding } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import type {
  MenuItem,
  MenuTree,
} from '@frontier/ui-component/src/FContextualMenu/types'
import {
  BookmarkType,
  type FolderBookmark,
  type OrgBookmark,
} from '@frontier/platform-web-sdk'
import useThreadBoardStore from '@/stores/threadBoard'
import BookmarkTab from '@/components/threadBoard/bookmark/BookmarkTab.vue'

const threadBoardStore = useThreadBoardStore()
const store = useStore()
const { t } = useI18n()

const { moveBookmark } = threadBoardStore
const { bookmarkList, bookmarkFilter, contactOrgList, currentBookmarkInfo } =
  storeToRefs(threadBoardStore)

const bookmarkDragOptions = {
  itemKey: 'bookmarkId',
  forceFallback: true,
  scrollSensitivity: 40,
  scrollSpeed: 7,
  animation: 250,
  group: 'bookmark',
  draggable: '.draggable-bookmark',
  disabled: false,
  dragClass: 'vue-draggable-bookmark-drag',
  ghostClass: 'vue-draggable-bookmark-ghost',
}

const refBookmarkBarContainer = ref<HTMLElement | null>(null)
const refBookmarkList = ref<HTMLElement | null>(null)
const bookmarkListRefs = ref<HTMLElement[]>([])

const isDraggingBookmark = ref(false)

const bookmarkContainerBounding = useElementBounding(refBookmarkBarContainer)
const bookmarkListBounding = useElementBounding(refBookmarkList)

const startToCollapseIndex = ref(0)
const haveCollapsedBookmarkList = ref(false)

onBeforeUpdate(() => {
  bookmarkListRefs.value = []
})

const calculateCollapsedBookmarkIndex = () => {
  haveCollapsedBookmarkList.value = false
  startToCollapseIndex.value = 0
  let totalWidth = 0

  for (let i = 0; i < bookmarkListRefs.value.length; i++) {
    totalWidth += bookmarkListRefs.value[i].clientWidth
    startToCollapseIndex.value = i

    if (totalWidth > bookmarkContainerBounding.width.value - 88) {
      haveCollapsedBookmarkList.value = true
      break
    }
  }
}

watch(bookmarkContainerBounding.width, calculateCollapsedBookmarkIndex)
watch(bookmarkListBounding.width, calculateCollapsedBookmarkIndex)

const collapsedMenuBookmarkList = computed(() => {
  if (!bookmarkList.value || !haveCollapsedBookmarkList.value) {
    return []
  }
  return bookmarkList.value.slice(startToCollapseIndex.value)
})

const isCurrentBookmarkInCollapsedMenu = computed(() => {
  if (!bookmarkFilter.value) {
    return false
  }

  return collapsedMenuBookmarkList.value
    .map((b) => b.bookmarkId)
    .includes(bookmarkFilter.value.bookmarkId)
})

const collapsedBookmarkListMenuTree = computed<MenuTree>(() => {
  const menuList: MenuItem[] = collapsedMenuBookmarkList.value.map(
    (bookmark) => {
      if (bookmark.bookmarkType === BookmarkType.FOLDER) {
        const folderBookmark = bookmark as FolderBookmark
        return {
          title: folderBookmark.folderName,
          icon: 'org_folder',
          clickHandler: () => {
            threadBoardStore.setBookmarkFilter({
              bookmarkId: folderBookmark.bookmarkId,
              orgId: null,
            })
          },
          blockList: [
            {
              menuList: folderBookmark.orgList.map((org) => {
                return {
                  title: org.orgName,
                  thumbnail: org.logo,
                  clickHandler: () => {
                    threadBoardStore.setBookmarkFilter({
                      bookmarkId: folderBookmark.bookmarkId,
                      orgId: org.orgId,
                    })
                  },
                }
              }),
            },
          ],
        }
      }

      const orgBookmark = bookmark as OrgBookmark
      return {
        title: orgBookmark.org.orgName,
        thumbnail: orgBookmark.org.logo,
        clickHandler: () => {
          threadBoardStore.setBookmarkFilter({
            bookmarkId: orgBookmark.bookmarkId,
            orgId: null,
          })
        },
      }
    }
  )

  return { blockList: [{ menuList }] }
})

const addBookmarkMenuTree = (collapsePopper: () => void): MenuTree => ({
  rootTitle: t('TT0213'),
  searchEnable: true,
  blockList: [
    {
      blockTitle: t('TT0214'),
      menuList:
        contactOrgList.value?.map((org) => {
          return {
            title: org.orgName,
            thumbnail: org.logo,
            clickHandler: () => {
              threadBoardStore.addOrgBookmark(org.orgId)
            },
          }
        }) || [],
    },
  ],
  button: {
    position: 'bottom',
    icon: 'create',
    text: t('TT0215'),
    clickHandler: () => {
      collapsePopper()
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-create-or-edit-bookmark-folder',
      })
    },
  },
})

const handleBookmarkListChange = (e: any) => {
  const { element, newIndex } = e.moved
  moveBookmark(element.bookmarkId, newIndex)
}

const handleBookmarkDragStart = () => {
  isDraggingBookmark.value = true
}

const handleBookmarkDragEnd = () => {
  isDraggingBookmark.value = false
}
</script>

<style>
.vue-draggable-bookmark-drag {
  @apply !opacity-90;
}

.vue-draggable-bookmark-drag.active {
  @apply bg-grey-150;
}

.vue-draggable-bookmark-drag.inactive {
  @apply bg-primary-700;
}

.vue-draggable-bookmark-ghost.active {
  @apply bg-grey-150;
}

.vue-draggable-bookmark-ghost.inactive {
  @apply bg-primary-700;
}
</style>
