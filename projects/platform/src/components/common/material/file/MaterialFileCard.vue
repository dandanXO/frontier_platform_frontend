<template lang="pug">
div(
  class="w-[103px] h-[127px] border border-grey-200-v1 rounded-lg p-2 focus-within:ring-2 focus-within:ring-cyan-200-v1 outline-none"
)
  div(
    class="w-full h-full relative cursor-pointer gap-2 flex flex-col"
    @click="emits('click')"
  )
    div(class="w-full h-6 flex items-center justify-between gap-1")
      div(class="flex flex-row items-center text-grey-900 text-caption")
        div(class="line-clamp-1") {{ displayFileNameExcludeExtension }}
        div .
        div {{ extension }}
      f-popper(
        v-if="menuTree != null"
        class="cursor-pointer p-1 border border-grey-200-v1 rounded flex justify-center items-center"
        placement="bottom-end"
        @click.stop
      )
        template(#trigger)
          f-tooltip-standard(:tooltipMessage="$t('RR0260')")
            template(#slot:tooltip-trigger)
              f-svg-icon(iconName="more" size="16" class="hover:text-primary-400")
        template(#content="{ collapsePopper }")
          f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
    div(class="w-full h-[86px] group aspect-square relative rounded overflow-hidden")
      div(class="group-hover:visible invisible z-1 absolute inset-0 bg-grey-900/40")
      f-svg-icon(
        iconName="open_in_full"
        size="20"
        class="group-hover:visible invisible z-2 absolute top-2 left-2 text-grey-0 cursor-pointer"
      )
      file-thumbnail(
        class="w-full h-full"
        :thumbnailUrl="thumbnailUrl"
        :originalUrl="originalUrl"
        :extension="extension"
      )
  div(class="absolute left-0 bottom-6" data-cy="star-button")
    slot
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getFileNameExcludeExtension } from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'
import FileThumbnail from '@/components/common/material/file/FileThumbnail.vue'
import type { Extension } from '@frontier/platform-web-sdk'

export interface PropsMaterialFileCard {
  thumbnailUrl: string | null
  originalUrl: string | null
  extension: Extension
  displayFileName: string
  menuTree?: MenuTree
}

const props = defineProps<PropsMaterialFileCard>()

const emits = defineEmits<{
  (e: 'click'): void
}>()

const displayFileNameExcludeExtension = computed(() =>
  getFileNameExcludeExtension(props.displayFileName)
)
</script>

<style scoped></style>
