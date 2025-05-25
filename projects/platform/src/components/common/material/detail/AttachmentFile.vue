<template lang="pug">
div(
  class="relative flex flex-col items-center gap-2 cursor-pointer p-2 border border-primary-border rounded-lg w-[7.438rem]"
  @click="emits('click')"
)
  div(class="px-0.5 w-full h-6 flex items-center gap-1 justify-between")
    div(class="flex flex-row items-center text-primary-inverse text-caption")
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
            f-button(type="secondary" size="sm" isIcon)
              f-svg-icon(iconName="more" size="16")
      template(#content="{ collapsePopper }")
        f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
  div(
    class="group aspect-square relative w-[5.438rem] h-[5.438rem] rounded overflow-hidden hover:border-4 hover:border-grey-250"
  )
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
