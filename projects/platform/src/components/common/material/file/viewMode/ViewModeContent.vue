<template lang="pug">
div(
  class="flex-grow flex-shrink min-h-0 relative px-5 pt-11.5 pb-15 flex flex-col items-center justify-center"
)
  div(
    ref="refContainer"
    class="flex-grow flex-shrink min-h-0 overflow-hidden w-full pb-5 flex items-center justify-center"
  )
    div(
      ref="refMainContent"
      class="w-full h-full flex flex-col items-stretch justify-center"
    )
      div(class="w-full h-full flex items-center justify-center")
        pdf-view(
          v-if="fileType.pdf.includes(file.extension)"
          :key="file.originalUrl"
          :src="file.originalUrl"
        )
        image-view(
          v-else-if="fileType.image.includes(file.extension)"
          :src="file.originalUrl"
        )
        video-view(
          v-else-if="fileType.video.includes(file.extension)"
          :src="file.originalUrl"
          controls
        )
        others-file-view(
          v-else-if="fileType.others.includes(file.extension)"
          :extension="file.extension"
        )
  div(class="w-full flex gap-x-4 items-center justify-center")
    p(class="text-grey-100 text-h4") {{ file.displayName }}
    div(v-if="getMenuTree == null && file.originalUrl")
      f-svg-icon(
        class="text-grey-100 cursor-pointer"
        iconName="download"
        iconSize="24"
        @click="downloadDataURLFile(file.originalUrl, file.displayName)"
      )
    f-popper(
      v-else-if="!['cover', 'faceSide', 'faceSideRuler', 'backSide', 'backSideRuler', 'digitalDrape'].includes(file.id)"
      class="cursor-pointer"
      placement="right-start"
      @click.stop
    )
      template(#trigger)
        f-tooltip-standard(:tooltipMessage="$t('RR0260')")
          template(#slot:tooltip-trigger)
            f-svg-icon(
              iconName="more_horiz"
              size="24"
              class="text-grey-100 hover:text-primary-400"
            )
      template(#content="{ collapsePopper }")
        f-contextual-menu(
          :theme="THEME.DARK"
          :menuTree="getMenuTree(file.id, THEME.DARK)"
          @click:menu="collapsePopper"
        )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { downloadDataURLFile } from '@frontier/lib'
import { THEME } from '@frontier/constants'
import PdfView from '@/components/common/material/file/viewMode/PdfView.vue'
import ImageView from '@/components/common/material/file/viewMode/ImageView.vue'
import VideoView from '@/components/common/material/file/viewMode/VideoView.vue'
import OthersFileView from '@/components/common/material/file/viewMode/OthersFileView.vue'
import type { MenuTree } from '@frontier/ui-component'
import type { MaterialViewModeFile } from '@/types'
import { Extension } from '@frontier/platform-web-sdk'

defineProps<{
  index: number
  file: MaterialViewModeFile
  getMenuTree?: ((id: number | string, theme: THEME) => MenuTree) | null
}>()

const { PNG, JPEG, JPG, GIF, MOV, MP4, ZIP, PDF, YDT, SCCH } = Extension

const fileType = {
  image: [PNG, JPEG, JPG, GIF],
  video: [MOV, MP4],
  pdf: [PDF],
  others: [YDT, SCCH, ZIP],
}

const refContainer = ref<HTMLElement>()
const refMainContent = ref<HTMLElement>()

useResizeObserver(refContainer, (entries) => {
  if (!refMainContent.value) {
    return
  }

  const entry = entries[0]
  const { width, height } = entry.contentRect
  const length = Math.min(width, height)

  refMainContent.value.style.width = `${length}px`
  refMainContent.value.style.height = `${length}px`
})
</script>

<style scoped></style>
