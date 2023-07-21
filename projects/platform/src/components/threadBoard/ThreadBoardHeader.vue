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
    f-popper(placement="bottom-start")
      template(#trigger)
        div(
          class="relative w-11 h-8 flex items-center justify-center rounded-tl rounded-tr text-grey-0 cursor-pointer hover:bg-primary-700"
        )
          span(class="absolute left-0 top-1.5 w-px h-6 bg-primary-700")
          f-svg-icon(iconName="add" size="20")
      template(#content="{ collapsePopper }")
        f-contextual-menu(
          :menuTree="menuTree(collapsePopper)"
          @click:menu="collapsePopper"
        )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import type { MenuTree } from '@frontier/ui-component/src/FContextualMenu/types'
import useThreadBoardStore from '@/stores/threadBoard'
import useCurrentUnit from '@/composables/useCurrentUnit'
import BookmarkTab from '@/components/threadBoard/bookmark/BookmarkTab.vue'

const { unit } = useCurrentUnit()
const threadBoardStore = useThreadBoardStore()
const store = useStore()
const { t } = useI18n()

const { moveBookmark } = threadBoardStore
const { bookmarkList, bookmarkFilter, contactOrgList } =
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

const isDraggingBookmark = ref(false)

const menuTree = (collapsePopper: () => void): MenuTree => ({
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
