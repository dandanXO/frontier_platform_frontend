<template lang="pug">
div(class="absolute left-0")
  f-tooltip-standard(placement="bottom-start")
    template(#slot:tooltip-trigger)
      div(v-if="target != null" class="flex flex-row items-center gap-2")
        f-svg-icon(
          v-if="activeBookmarkType === BookmarkType.FOLDER"
          :iconName="isAllThread ? 'all' : 'org_folder'"
          size="28"
          class="text-primary-400"
        )
        f-avatar(v-else :imageUrl="bookmarkInfo.orgLogo" type="org" size="md")
        span(class="font-bold text-body1 text-grey-900") {{ bookmarkInfo.title }}
        span(class="text-body2 text-grey-600") ({{ $t('RR0068', { number: threadQty }) }})
    template(#slot:tooltip-content)
      p(class="font-bold") {{ bookmarkInfo.title }}
      p {{ bookmarkInfo.tooltipContent }}
</template>

<script setup lang="ts">
import {
  BookmarkType,
  type FolderBookmark,
  type GetThreadBoardRequestBookmarkFilter,
  type OrgBookmark,
} from '@frontier/platform-web-sdk'
import { computed } from 'vue'

const props = defineProps<{
  threadQty: number
  bookmarkFilter: GetThreadBoardRequestBookmarkFilter
  bookmarkList: (FolderBookmark | OrgBookmark)[]
}>()

const target = computed(() => {
  const target = props.bookmarkList.find(
    (b) => b.bookmarkId === props.bookmarkFilter.bookmarkId
  )
  if (!target) {
    throw new Error('Bookmark not found')
  }
  return target
})

const isAllThread = computed(() => {
  if (target.value.bookmarkType === BookmarkType.FOLDER) {
    const folderBookmark = target.value as FolderBookmark
    return folderBookmark.isAllThread
  }
  return false
})

const bookmarkInfo = computed(() => {
  switch (target.value.bookmarkType) {
    case BookmarkType.FOLDER: {
      const folderBookmark = target.value as FolderBookmark

      const getTitle = () => {
        if (!props.bookmarkFilter.orgId) {
          return folderBookmark.folderName
        }
        const result = folderBookmark.orgList.find(
          (o) => o.orgId === props.bookmarkFilter.orgId
        )
        if (!result) {
          throw new Error('Bookmark not found')
        }
        return result.orgName
      }

      const getTooltipContent = () => folderBookmark.folderName
      const getOrgLogo = () => {
        if (!props.bookmarkFilter.orgId) {
          return ''
        }
        const result = folderBookmark.orgList.find(
          (o) => o.orgId === props.bookmarkFilter.orgId
        )
        if (!result) {
          throw new Error('bookmark not found')
        }
        return result.logo
      }

      return {
        title: getTitle(),
        tooltipContent: getTooltipContent(),
        orgLogo: getOrgLogo(),
      }
    }
    case BookmarkType.ORG: {
      const orgBookmark = target.value as OrgBookmark

      const getTitle = () => orgBookmark.org.orgName
      const getTooltipContent = () => orgBookmark.org.orgName
      const getOrgLogo = () => orgBookmark.org.logo

      return {
        title: getTitle(),
        tooltipContent: getTooltipContent(),
        orgLog: getOrgLogo(),
      }
    }
    default:
      throw new Error('Invalid bookmark type')
  }
})

const activeBookmarkType = computed(() => {
  if (target.value.bookmarkType === BookmarkType.ORG) {
    return BookmarkType.ORG
  }
  return props.bookmarkFilter.orgId ? BookmarkType.ORG : BookmarkType.FOLDER
})
</script>

<style scoped></style>
