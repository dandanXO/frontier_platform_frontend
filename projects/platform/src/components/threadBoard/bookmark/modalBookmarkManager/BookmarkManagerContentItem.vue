<template lang="pug">
div(
  class="group w-full h-12 pr-4 rounded flex items-center cursor-pointer hover:bg-grey-100"
)
  div(class="w-5 h-5 invisible group-hover:visible")
    f-svg-icon(
      v-if="draggable"
      class="text-grey-250"
      iconName="drag_indicator"
      size="20"
    )
  div(class="flex-1 flex items-center gap-x-2")
    div(v-if="props.svgIcon" class="w-8 h-8 flex items-center justify-center")
      f-svg-icon(class="text-grey-400" :iconName="props.svgIcon" size="20")
    f-avatar(
      v-if="props.orgLogo"
      :imageUrl="props.orgLogo"
      type="org"
      size="md"
    )
    div(v-if="isEditingName" class="flex gap-2")
      f-input-text(
        class="w-75"
        size="md"
        :placeholder="$t('TT0238')"
        v-model:textValue="folderBookmarkEditingName"
      )
      div(class="flex flex-row gap-2 items-center")
        f-svg-icon(
          class="cursor-pointer"
          :class="isFolderBookmarkEditingNameValid ? 'text-primary-400' : 'text-grey-400'"
          iconName="done"
          size="24"
          @click="() => { isFolderBookmarkEditingNameValid && confirmRenameFolderBookmark(); }"
        )
        f-svg-icon(
          class="cursor-pointer"
          iconName="clear"
          size="24"
          @click="cancelRenameFolderBookmark"
        )
    p(
      v-else
      class="text-body2 text-grey-800"
      :class="{ 'hover:text-primary-400 hover:underline': props.bookmarkType === BookmarkType.FOLDER }"
      @click="emits('click:text')"
    ) {{ props.text }}
  f-popper(placement="left" @click.stop)
    template(#trigger)
      div(
        class="w-7.5 h-7.5 text-grey-600 hover:bg-primary-400/10 hover:text-primary-400 flex justify-center items-center rounded-full"
      )
        f-svg-icon(iconName="more_horiz" size="24")
    template(#content="{ collapsePopper }")
      f-contextual-menu(
        :menuTree="props.menuTree"
        @click:menu="collapsePopper"
      )
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onKeyStroke } from '@vueuse/core'
import { BookmarkType } from '@frontier/platform-web-sdk'
import type { MenuTree } from '@frontier/ui-component/src/FContextualMenu/types'
import useBookmarkManagerStore from '@/stores/bookmarkManager'

const props = defineProps<{
  bookmarkType: BookmarkType
  draggable: boolean
  isEditingName: boolean
  text: string
  svgIcon: string | null
  orgLogo: string | null
  menuTree: MenuTree
}>()

const emits = defineEmits<{
  (e: 'click:text'): void
}>()

const bookmarkManagerStore = useBookmarkManagerStore()
const { confirmRenameFolderBookmark, cancelRenameFolderBookmark } =
  bookmarkManagerStore

const { folderBookmarkEditingName, isFolderBookmarkEditingNameValid } =
  storeToRefs(bookmarkManagerStore)

onKeyStroke('Enter', () => {
  if (props.isEditingName && isFolderBookmarkEditingNameValid.value) {
    confirmRenameFolderBookmark()
  }
})
</script>
