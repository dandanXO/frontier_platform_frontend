<template lang="pug">
div(
  ref="refTrigger"
  class="relative flex flex-row items-center gap-2 min-w-16 max-w-60 h-9 rounded-tl-md rounded-tr-md px-3 text-body2 cursor-pointer"
  :class="containerClasses"
  aria-describedby="popper"
  @mouseenter="handleMouseEnter"
  @mouseleave="handleMouseLeave"
  @click="handleBookmarkTabClick"
)
  f-svg-icon(
    v-if="props.bookmark.bookmarkType === BookmarkType.FOLDER"
    :class="{ 'text-primary-400': active }"
    :iconName="iconName"
    size="16"
  )
  div(class="flex-1 overflow-hidden whitespace-nowrap text-ellipsis leading-1.6")
    template(v-if="bookmark.bookmarkType === BookmarkType.FOLDER") {{ folderBookmark.folderName }}
    template(v-if="bookmark.bookmarkType === BookmarkType.ORG") {{ orgBookmark.org.orgName }}
  f-popper(
    placement="bottom-start"
    :offset="[0, 8]"
    @click.stop
    @expand="isActionMenuExpand = true"
    @collapse="isActionMenuExpand = false"
  )
    template(#trigger)
      div(
        class="w-4 h-7 rounded flex items-center justify-center"
        :class="actionMenuTriggerClasses"
      )
        f-svg-icon(iconName="keyboard_arrow_down" size="16")
    template(#content="{ collapsePopper }")
      f-contextual-menu(
        :menuTree="actionMenuTree"
        @click:menu="collapsePopper"
      )
  teleport(v-if="isOrgMenuExpand" to="body")
    div(ref="refPopper" class="z-popper pt-2 bg-transparent")
      f-contextual-menu(
        v-if="props.bookmark.bookmarkType === BookmarkType.FOLDER"
        ref="refContextualMenu"
        :menuTree="childMenuTree"
        @click:menu="collapseOrgMenuPopper"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      )
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { createPopper } from '@popperjs/core'
import {
  BookmarkType,
  type FolderBookmark,
  type GetThreadBoardRequestBookmarkFilter,
  type OrgBookmark,
} from '@frontier/platform-web-sdk'
import type {
  MenuBlock,
  MenuItem,
  MenuTree,
} from '@frontier/ui-component/src/FContextualMenu/types'
import useThreadBoardStore from '@/stores/threadBoard'

const props = defineProps<{
  active: boolean
  dragging: boolean
  bookmark: OrgBookmark | FolderBookmark
}>()

const emit = defineEmits<{
  (e: 'select', bookmarkFilter: GetThreadBoardRequestBookmarkFilter): void
}>()

const threadBoardStore = useThreadBoardStore()
const { t } = useI18n()

const isOrgMenuExpand = ref(false)
const isActionMenuExpand = ref(false)
const refTrigger = ref<HTMLElement | null>(null)
const refPopper = ref<HTMLElement | null>(null)
const refContextualMenu = ref<HTMLElement | null>(null)
const isHover = ref(false)

watch(
  () => props.dragging,
  () => {
    if (props.dragging) {
      collapseOrgMenuPopper()
    } else {
      if (isHover.value && isOrgMenuExpand) {
        expandOrgMenuPopper()
      }
    }
  }
)

const expandOrgMenuPopper = async () => {
  if (!refTrigger.value) {
    return
  }

  if (isOrgMenuExpand.value) {
    return
  }

  isOrgMenuExpand.value = true

  await nextTick()

  createPopper(refTrigger.value, refPopper.value, {
    placement: 'bottom-start',
  })
}

const collapseOrgMenuPopper = () => {
  isOrgMenuExpand.value = false
}

const iconName = computed(() => {
  if (props.bookmark.bookmarkType !== BookmarkType.FOLDER) {
    return ''
  }

  return (props.bookmark as FolderBookmark).isAllThread ? 'all' : 'org_folder'
})

const folderBookmark = computed(() => props.bookmark as FolderBookmark)
const orgBookmark = computed(() => props.bookmark as OrgBookmark)

const containerClasses = computed(() => {
  const classes = []

  if (props.active) {
    classes.push('active bg-grey-0 text-grey-900 hover:!bg-grey-150')
    if (isActionMenuExpand.value) {
      classes.push('bg-grey-150')
    }
  } else {
    classes.push(
      'inactive text-grey-150 hover:text-grey-0 hover:bg-primary-700 '
    )
    if (isActionMenuExpand.value) {
      classes.push('bg-primary-700')
    }
  }

  return classes
})

const actionMenuTriggerClasses = computed(() => {
  const classes = []

  if (props.active) {
    classes.push('hover:bg-grey-200')
    if (isActionMenuExpand.value) {
      classes.push('bg-grey-200')
    }
  } else {
    classes.push('hover:bg-primary-800 hover:bg-opacity-60')
    if (isActionMenuExpand.value) {
      classes.push('bg-primary-800 bg-opacity-60')
    }
  }

  return classes
})

const childMenuTree = computed<MenuTree | null>(() => {
  if (props.bookmark.bookmarkType !== BookmarkType.FOLDER) {
    return null
  }

  const folderBookmark = props.bookmark as FolderBookmark

  return {
    width: 'w-85',
    scrollAreaMaxHeight: 'max-h-157.5',
    blockList: [
      {
        blockTitle: (() => {
          if (folderBookmark.isAllThread) {
            return t('TT0212')
          }

          return `${folderBookmark.folderName} - ${t('TT0211')}`
        })(),
        menuList: folderBookmark.orgList.map((org) => {
          return {
            title: org.orgName,
            thumbnail: org.logo,
            selectValue: org.orgId,
            hasNotify: org.isUnread,
            clickHandler: () => {
              emit('select', {
                bookmarkId: props.bookmark.bookmarkId,
                orgId: org.orgId,
              })
            },
          }
        }),
      },
    ],
  }
})

const actionMenuTree = computed<MenuTree>(() => {
  const blockList: MenuBlock[] = []

  const removeClickHandler = () =>
    threadBoardStore.removeBookmark(props.bookmark.bookmarkId)

  switch (props.bookmark.bookmarkType) {
    case BookmarkType.FOLDER: {
      const folderBookmark = props.bookmark as FolderBookmark
      if (!folderBookmark.isAllThread) {
        const menuList: MenuItem[] = []
        menuList.push({
          title: t('TT0223'),
          clickHandler: removeClickHandler,
        })
        blockList.push({ menuList })
      }
      break
    }
    case BookmarkType.ORG: {
      const menuList: MenuItem[] = []
      menuList.push({
        title: t('TT0216'),
        clickHandler: removeClickHandler,
      })
      blockList.push({ menuList })
      break
    }
    default: {
      throw new Error('Invalid bookmark type')
    }
  }

  return { width: 'w-60', blockList }
})

const handleBookmarkTabClick = () => {
  emit('select', { bookmarkId: props.bookmark.bookmarkId, orgId: null })
}

const handleMouseEnter = () => {
  isHover.value = true
  if (props.dragging) {
    return
  }

  if (props.bookmark.bookmarkType === BookmarkType.FOLDER) {
    expandOrgMenuPopper()
  }
}

const handleMouseLeave = (e: MouseEvent) => {
  isHover.value = false

  if (!refContextualMenu.value || !refTrigger.value) {
    return
  }

  if (props.bookmark.bookmarkType !== BookmarkType.FOLDER) {
    return
  }

  if (
    refPopper.value?.contains(e.relatedTarget as Node) ||
    refTrigger.value.contains(e.relatedTarget as Node)
  ) {
    return
  }

  collapseOrgMenuPopper()
}
</script>

<style scoped></style>
