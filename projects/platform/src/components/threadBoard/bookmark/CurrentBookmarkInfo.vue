<template lang="pug">
div(v-if="currentBookmarkInfo != null" class="absolute left-0")
  f-tooltip-standard(placement="bottom-start")
    template(#slot:tooltip-trigger)
      div(class="flex flex-row items-center gap-2")
        f-svg-icon(
          v-if="currentBookmarkInfo.activeBookmarkType === BookmarkType.FOLDER"
          :iconName="currentBookmarkInfo.isAllThread ? 'all' : 'org_folder'"
          size="28"
          class="text-primary-400"
        )
        f-avatar(
          v-else
          :imageUrl="currentBookmarkInfo.orgLogo"
          type="org"
          size="md"
        )
        span(class="font-bold text-body1 text-grey-900") {{ currentBookmarkInfo.title }}
        span(class="text-body2 text-grey-600") ({{ $t('RR0068', { number: threadQty }) }})
    template(#slot:tooltip-content)
      p(class="font-bold") {{ currentBookmarkInfo.title }}
      p {{ currentBookmarkInfo.tooltipContent }}
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { BookmarkType } from '@frontier/platform-web-sdk'
import useThreadBoardStore from '@/stores/threadBoard'

const threadBoardStore = useThreadBoardStore()
const { threadQty, currentBookmarkInfo } = storeToRefs(threadBoardStore)
</script>

<style scoped></style>
