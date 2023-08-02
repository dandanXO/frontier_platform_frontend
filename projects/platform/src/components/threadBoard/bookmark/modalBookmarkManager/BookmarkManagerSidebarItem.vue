<template lang="pug">
div(
  class="w-full h-10 pl-5 pr-2 flex items-center justify-between text-body2 rounded"
  :class="{ 'bg-grey-150': active, 'bg-primary-50 outline outline-primary-300 outline-1 -outline-offset-1 ': hovering, 'hover:bg-grey-150 cursor-pointer': bookmark.bookmarkType === BookmarkType.FOLDER }"
)
  div(
    class="flex-1 flex items-center gap-x-2 text-grey-600 min-w-0"
    :class="{ 'font-bold': active, 'text-primary-400': hovering }"
  )
    div(
      v-if="bookmarkInfo.svgIcon"
      class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-grey-600"
    )
      f-svg-icon(:iconName="bookmarkInfo.svgIcon" size="20")
    f-avatar(
      v-if="bookmarkInfo.orgLogo"
      class="flex-shrink-0"
      :imageUrl="bookmarkInfo.orgLogo"
      type="org"
      size="md"
    )
    span(class="flex-1 whitespace-nowrap text-ellipsis overflow-hidden") {{ bookmarkInfo.text }}
  div(
    v-if="bookmarkInfo.orgCount"
    class="w-6 h-6 flex-shrink-0 flex items-center justify-center"
    :class="hovering ? 'text-primary-400' : 'text-grey-400'"
  ) {{ bookmarkInfo.orgCount }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BookmarkType } from '@frontier/platform-web-sdk'
import { processBookmarkByType } from '@/utils/bookmark'
import type {
  BookmarkManagerFolderBookmark,
  BookmarkManagerOrgBookmark,
} from '@/types'

const props = defineProps<{
  bookmark: BookmarkManagerOrgBookmark | BookmarkManagerFolderBookmark
  active: boolean
  hovering: boolean
}>()

const bookmarkInfo = computed(() =>
  processBookmarkByType<{
    text: string
    svgIcon: string | null
    orgLogo: string | null
    orgCount: number | null
  }>(props.bookmark, {
    allThreads: (allThreadBookmark) => ({
      text: allThreadBookmark.folderName,
      orgLogo: null,
      svgIcon: 'all',
      orgCount: allThreadBookmark.orgList.length,
    }),
    [BookmarkType.FOLDER]: (folderBookmark) => ({
      text: folderBookmark.folderName,
      svgIcon: 'org_folder',
      orgLogo: null,
      orgCount: folderBookmark.orgList.length,
    }),
    [BookmarkType.ORG]: (orgBookmark) => ({
      text: orgBookmark.org.orgName,
      svgIcon: null,
      orgLogo: orgBookmark.org.logo,
      orgCount: null,
    }),
  })
)
</script>

<style scoped></style>
