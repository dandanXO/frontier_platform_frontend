<template lang="pug">
div(
  class="aspect-square relative rounded overflow-hidden flex items-center justify-center"
  :class="{ 'border border-grey-250': !!thumbnailUrl || !!originalUrl }"
)
  template(v-if="[PNG, JPEG, JPG, PDF, GIF].includes(extension)")
    img(
      v-if="thumbnailUrl && showImage"
      :src="thumbnailUrl"
      @error="imageOnerror($event)"
      class="w-full h-full object-contain"
      v-default-img
    )
    div(v-else class="w-full h-full flex items-center justify-center bg-grey-100")
      p(v-if="!loading" class="text-caption/1.3 text-grey-250") {{ $t('RR0103') }}
      f-svg-icon(v-else iconName="loading" size="24" class="text-primary-500, min-h-6")
  template(v-else-if="[MOV, MP4].includes(extension)")
    video-view(
      v-if="originalUrl"
      :src="originalUrl"
      :canPlay="false"
      :autoplay="false"
    )
  img(v-else-if="extension === YDT" src="@/assets/images/YDT.png")
  img(v-else-if="extension === SCCH" src="@/assets/images/SCCH.png")
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
import { ref } from 'vue'
const { PNG, JPEG, JPG, GIF, MOV, MP4, ZIP, PDF, YDT, SCCH } = Extension

export interface PropsFileThumbnail {
  thumbnailUrl: string | null
  originalUrl: string | null
  extension: Extension
  loading?: boolean
}
const showImage = ref(true)
const imageOnerror = () => {
  showImage.value = false
}

defineProps<PropsFileThumbnail>()
</script>
