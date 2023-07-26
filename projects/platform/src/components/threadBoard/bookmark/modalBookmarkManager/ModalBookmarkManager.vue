<template lang="pug">
div(
  class="fixed top-0 left-0 w-screen h-screen bg-grey-900/40 z-100 flex items-center justify-center"
  @click="bookmarkManagerStore.closeBookmarkManager"
)
  div(class="w-210 h-150 bg-grey-0 rounded relative flex overflow-hidden" @click.stop)
    bookmark-manager-sidebar
    bookmark-manager-content
</template>

<script lang="ts" setup>
import useBookmarkManagerStore from '@/stores/bookmarkManager'
import BookmarkManagerSidebar from '@/components/threadBoard/bookmark/modalBookmarkManager/BookmarkManagerSidebar.vue'
import BookmarkManagerContent from '@/components/threadBoard/bookmark/modalBookmarkManager/BookmarkManagerContent.vue'

const bookmarkManagerStore = useBookmarkManagerStore()
</script>
