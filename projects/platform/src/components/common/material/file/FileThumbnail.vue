<template lang="pug">
div(
  class="aspect-square relative rounded overflow-hidden"
  :class="{ 'border border-grey-250': !!thumbnailUrl || !!originalUrl }"
)
  template(v-if="[PNG, JPEG, JPG, PDF, GIF].includes(extension)")
    img(
      v-if="thumbnailUrl"
      :src="thumbnailUrl"
      class="w-full h-full object-contain"
      v-default-img
    )
    div(v-else class="w-full h-full flex items-center justify-center bg-grey-100")
      p(class="text-caption/1.3 text-grey-250") {{ $t('RR0103') }}
  template(v-else-if="[MOV, MP4].includes(extension)")
    video-view(
      v-if="originalUrl"
      :src="originalUrl"
      selfControl
      :canPlay="false"
    )
  div(
    v-else-if="extension === ZIP"
    class="flex justify-center items-center w-full h-full bg-grey-250"
  )
    f-svg-icon(iconName="file_zip" size="40" class="text-grey-0")
  f-svg-icon(v-else iconName="file" size="50" class="text-grey-0")
</template>

<script setup lang="ts">
import { Extension } from '@frontier/platform-web-sdk'
import VideoView from '@/components/common/material/file/viewMode/VideoView.vue'

const { PNG, JPEG, JPG, GIF, MOV, MP4, ZIP, PDF } = Extension

export interface PropsFileThumbnail {
  thumbnailUrl: string | null
  originalUrl: string | null
  extension: Extension
}

defineProps<PropsFileThumbnail>()
</script>
