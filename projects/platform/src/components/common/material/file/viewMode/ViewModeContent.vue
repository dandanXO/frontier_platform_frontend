<template lang="pug">
div(class="flex-grow relative flex flex-col items-center justify-center")
  div(class="w-160 h-160 flex items-center")
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
    )
    others-file-view(
      v-else-if="fileType.others.includes(file.extension)"
      :extension="file.extension"
    )
  div(class="h-26 w-full flex gap-x-4 items-center justify-center")
    p(class="text-grey-100 text-h4") {{ file.displayName }}
    div(v-if="getMenuTree == null")
      f-svg-icon(
        class="text-grey-100 cursor-pointer"
        iconName="download"
        iconSize="24"
        @click="downloadDataURLFile(file.originalUrl, file.displayName)"
      )
    f-popper(
      v-else-if="!['cover', 'faceSide', 'faceSideRuler', 'backSide', 'backSideRuler'].includes(file.id)"
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
import { downloadDataURLFile } from '@frontier/lib'
import { EXTENSION, THEME } from '@frontier/constants'
import PdfView from '@/components/common/material/file/viewMode/PdfView.vue'
import ImageView from '@/components/common/material/file/viewMode/ImageView.vue'
import VideoView from '@/components/common/material/file/viewMode/VideoView.vue'
import OthersFileView from '@/components/common/material/file/viewMode/OthersFileView.vue'
import type { MenuTree } from '@frontier/ui-component'
import type { MaterialViewModeFile } from '@/types'

defineProps<{
  index: number
  file: MaterialViewModeFile
  getMenuTree?: ((id: number | string, theme: THEME) => MenuTree) | null
}>()

const { PNG, JPEG, JPG, GIF, MOV, MP4, ZIP, PDF } = EXTENSION

const fileType = {
  image: [PNG, JPEG, JPG],
  video: [GIF, MOV, MP4],
  pdf: [PDF],
  others: [ZIP],
}
</script>

<style scoped></style>
