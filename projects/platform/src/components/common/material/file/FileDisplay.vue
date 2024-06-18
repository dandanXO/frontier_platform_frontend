<template lang="pug">
div(
  class="aspect-square relative rounded overflow-hidden"
  :class="{ 'border border-grey-250': !!displayUrl || !!originalUrl }"
)
  template(
    v-if="[...IMAGE_FILE_ACCEPT_TYPE, PDF, GIF].includes(extension?.toLowerCase())"
  )
    img(
      v-if="displayUrl"
      :src="displayUrl"
      class="w-full h-full object-contain"
      v-default-img
    )
    div(v-else class="w-full h-full flex items-center justify-center bg-grey-100")
      p(class="text-h4 font-bold text-grey-250") {{ $t('RR0103') }}
  template(
    v-else-if="VIDEO_FILE_ACCEPT_TYPE.includes(extension?.toLowerCase())"
  )
    video-view(v-if="originalUrl" :src="originalUrl" selfControl autoplay)
  div(
    v-else-if="extension === ZIP"
    class="flex justify-center items-center w-full h-full bg-grey-250"
  )
    f-svg-icon(iconName="file_zip" size="80" class="text-grey-0")
  f-svg-icon(v-else iconName="file" size="50" class="text-grey-0")
</template>

<script setup lang="ts">
import VideoView from '@/components/common/material/file/viewMode/VideoView.vue'
import { Extension } from '@frontier/platform-web-sdk'

const { GIF, MOV, MP4, ZIP, PDF } = Extension

import {
  IMAGE_FILE_ACCEPT_TYPE,
  VIDEO_FILE_ACCEPT_TYPE,
} from '@/utils/constants'

export interface PropsFileThumbnail {
  displayUrl: string | null
  originalUrl: string | null
  extension: Extension
}

defineProps<PropsFileThumbnail>()
</script>
