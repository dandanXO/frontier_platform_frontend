<template lang="pug">
div(class="w-25 relative cursor-pointer" @click="emits('click')")
  div(
    class="group aspect-square relative w-25 h-25 rounded overflow-hidden border border-grey-300 hover:border-4 hover:border-grey-250"
  )
    div(class="group-hover:visible invisible z-1 absolute inset-0 bg-grey-900/40")
    f-svg-icon(
      iconName="open_in_full"
      size="20"
      class="group-hover:visible invisible z-2 absolute top-2 left-2 text-grey-0 cursor-pointer"
    )
    img(
      v-if="[PNG, JPEG, JPG, PDF].includes(extension)"
      :src="thumbnailUrl"
      class="w-full h-full object-contain"
    )
    div(
      v-else-if="[GIF, MOV, MP4].includes(extension)"
      class="relative flex justify-center items-center w-full h-full"
    )
      video(class="w-full h-full object-contain")
        source(:src="thumbnailUrl" type="video/mp4")
      div(
        class="absolute w-16 h-16 rounded-full bg-grey-900/70 flex justify-center items-center"
      )
        f-svg-icon(iconName="play_arrow" size="40" class="text-grey-0")
    div(
      v-else-if="extension === ZIP"
      class="flex justify-center items-center w-full h-full bg-grey-250"
    )
      f-svg-icon(iconName="file_zip" size="40" class="text-grey-0")
    f-svg-icon(v-else iconName="file" size="50" class="text-grey-0")
  div(class="px-0.5 w-full h-6 flex items-center justify-between")
    div(class="flex flex-row items-center text-grey-900 text-caption")
      div(class="line-clamp-1") {{ displayFileNameExcludeExtension }}
      div .
      div {{ extension }}
    f-popper(
      v-if="menuTree != null"
      class="cursor-pointer"
      placement="right-start"
      @click.stop
    )
      template(#trigger)
        f-tooltip-standard(:tooltipMessage="$t('RR0260')")
          template(#slot:tooltip-trigger)
            f-svg-icon(iconName="more_horiz" size="24" class="hover:text-primary-400")
      template(#content="{ collapsePopper }")
        f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
  div(class="absolute right-0 bottom-6")
    slot
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EXTENSION } from '@frontier/constants'
import { getFileExtension, getFileNameExcludeExtension } from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'

const { PNG, JPEG, JPG, GIF, MOV, MP4, ZIP, PDF } = EXTENSION

const props = defineProps<{
  thumbnailUrl: string
  displayFileName: string
  menuTree?: MenuTree
}>()

const emits = defineEmits<{
  (e: 'click'): void
}>()

const extension = computed(() => getFileExtension(props.displayFileName))

const displayFileNameExcludeExtension = computed(() =>
  getFileNameExcludeExtension(props.displayFileName)
)
</script>

<style scoped></style>
