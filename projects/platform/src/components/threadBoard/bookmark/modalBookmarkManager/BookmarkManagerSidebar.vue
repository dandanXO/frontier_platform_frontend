<template lang="pug">
div(class="flex flex-col w-65 h-full bg-grey-50 border-r border-grey-150")
  div(class="pl-5 h-16 flex items-center")
    p(class="text-body2 font-bold text-grey-750") {{ $t('TT0231') }}
  p(class="mb-2 pl-5 text-caption text-grey-400") {{ $t('RR0246') }}
  div(class="flex-1 min-h-0 flex flex-col gap-y-2 pb-2")
    f-scrollbar-container(class="h-full px-3")
      div(class="flex flex-col gap-y-2")
        div(class="flex flex-col gap-y-1")
          div(
            v-if="bookmarkManagerBookmarkList"
            class="w-full h-10 pl-1 pr-2 flex items-center justify-between hover:bg-grey-150 text-body2 rounded cursor-pointer"
            :class="{ 'bg-grey-150': isBookmarkBarActive, 'bg-primary-50 outline outline-primary-300 outline-1 -outline-offset-1': isHoveringBookmarkBar }"
            @click="setCurrentBookmarkId(null)"
          )
            div(
              class="flex items-center gap-x-3.5 text-grey-600"
              :class="{ 'font-bold': isBookmarkBarActive, 'text-primary-400': isHoveringBookmarkBar }"
            )
              f-svg-icon(
                class="text-grey-600"
                :iconName="isSidebarExpand ? 'keyboard_arrow_down' : 'keyboard_arrow_right'"
                size="20"
                @click.stop="toggleSidebar"
              )
              span {{ $t('TT0232') }}
            span(
              :class="isHoveringBookmarkBar ? 'text-primary-400' : 'text-grey-400'"
            ) {{ bookmarkManagerBookmarkList.length }}
          template(v-if="isSidebarExpand")
            bookmark-manager-sidebar-item(
              v-for="bookmark in bookmarkManagerBookmarkList"
              :key="bookmark.bookmarkId"
              :bookmark="bookmark"
              :active="bookmark.bookmarkId === currentBookmarkId"
              :hovering="bookmark.bookmarkId === hoveringBookmarkId"
              @click="bookmark.bookmarkType === BookmarkType.FOLDER && setCurrentBookmarkId(bookmark.bookmarkId)"
            )
        div(
          class="w-59 h-6 bg-grey-0 rounded border border-dashed border-grey-250 flex items-center justify-center cursor-pointer"
        )
          f-svg-icon(class="text-grey-600" iconName="add" size="16")
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { BookmarkType } from '@frontier/platform-web-sdk'
import useBookmarkManagerStore from '@/stores/bookmarkManager'
import BookmarkManagerSidebarItem from '@/components/threadBoard/bookmark/modalBookmarkManager/BookmarkManagerSidebarItem.vue'

const bookmarkManagerStore = useBookmarkManagerStore()
const { setCurrentBookmarkId } = bookmarkManagerStore
const {
  bookmarkManagerBookmarkList,
  currentBookmarkId,
  hoveringBookmarkId,
  isBookmarkBarActive,
} = storeToRefs(bookmarkManagerStore)

const isSidebarExpand = ref(true)

const isHoveringBookmarkBar = computed(
  () => hoveringBookmarkId.value === 'bookmarkBar'
)

const toggleSidebar = () => {
  isSidebarExpand.value = !isSidebarExpand.value
}
</script>

<style scoped></style>
