<template lang="pug">
div(
  class="flex-shrink-0"
  :style="{ background: 'linear-gradient(180deg, #0F7F73 0%, #0A6665 207.69%)' }"
)
  div(class="h-13 px-7.5 flex flex-row gap-4 items-center")
    p(class="font-bold text-h6 text-grey-0") {{ $t('TT0132') }}
    div(
      class="flex flex-row gap-2 items-center px-2 h-6"
      :style="{ background: '#0A6665', 'box-shadow': 'inset 0px 1px 3px rgba(0, 0, 0, 0.25)', 'border-radius': '21px' }"
    )
      div(class="w-3 h-3 rounded-sm" :style="{ background: unit.labelColor }")
      span(class="text-body2 text-grey-100") {{ unit.ogName }}
    f-tooltip-standard(
      :tooltipMessage="$t('TT0173')"
      boundaryReference="search-table-header"
    )
      template(#slot:tooltip-trigger)
        div(
          class="w-6 h-6 rounded hover:bg-primary-700 flex justify-center items-center cursor-pointer"
          @click="$store.dispatch('helper/pushModal', { component: 'modal-thread-board-feature-reminder' })"
        )
          f-svg-icon(iconName="question" size="16" class="text-grey-50")
  div(class="flex flex-row items-center pl-7.5")
    draggable(
      v-if="bookmarkList"
      class="flex flex-row items-center"
      v-model="bookmarkList"
      v-bind="bookmarkDragOptions"
      @change="handleBookmarkListChange"
      @start="handleBookmarkDragStart"
      @end="handleBookmarkDragEnd"
    )
      template(#item="{ element }")
        bookmark-tab(
          :class="{ 'draggable-bookmark': !element.isAllThread }"
          :bookmark="element"
          :active="bookmarkFilter?.bookmarkId === element.bookmarkId"
          :dragging="isDraggingBookmark"
          @select="threadBoardStore.setBookmarkFilter"
        )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import useThreadBoardStore from '@/stores/threadBoard'
import useCurrentUnit from '@/composables/useCurrentUnit'
import BookmarkTab from '@/components/threadBoard/bookmark/BookmarkTab.vue'

const { unit } = useCurrentUnit()
const threadBoardStore = useThreadBoardStore()

const { moveBookmark } = threadBoardStore
const { bookmarkList, bookmarkFilter } = storeToRefs(threadBoardStore)

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

const isDraggingBookmark = ref(false)

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
