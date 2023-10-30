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
      v-if="[PNG, JPEG, JPG, PDF].includes(attachment.extension)"
      :src="attachment.url"
      class="w-full h-full object-contain"
    )
    div(
      v-else-if="[GIF, MOV, MP4].includes(attachment.extension)"
      class="relative flex justify-center items-center w-full h-full"
    )
      video(class="w-full h-full object-contain")
        source(:src="attachment.url" type="video/mp4")
      div(
        class="absolute w-16 h-16 rounded-full bg-grey-900/70 flex justify-center items-center"
      )
        f-svg-icon(iconName="play_arrow" size="40" class="text-grey-0")
    div(
      v-else-if="attachment.extension === ZIP"
      class="flex justify-center items-center w-full h-full bg-grey-250"
    )
      f-svg-icon(iconName="file_zip" size="40" class="text-grey-0")
    f-svg-icon(v-else iconName="file" size="50" class="text-grey-0")
  div(class="px-0.5 w-full h-6 flex items-center justify-between")
    div(class="flex flex-row items-center text-grey-900 text-caption")
      div(class="line-clamp-1") {{ attachment.displayFileNameExcludeExtension }}
      div .
      div {{ attachment.extension }}
    f-popper(
      v-if="!props.isReadOnly"
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
  div(class="absolute right-0 bottom-8")
    slot
</template>

<script setup lang="ts">
import { EXTENSION } from '@frontier/constants'
import type { MenuTree } from '@frontier/ui-component'
import type { Attachment } from '@/composables/material/useAttachmentSelect'

const { PNG, JPEG, JPG, GIF, MOV, MP4, ZIP, PDF } = EXTENSION

const props = withDefaults(
  defineProps<{
    attachment: Attachment
    isReadOnly: boolean
    menuTree: MenuTree
  }>(),
  { isReadOnly: false }
)

const emits = defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped></style>
