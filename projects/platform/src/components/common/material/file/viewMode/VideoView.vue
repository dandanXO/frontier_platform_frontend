<template lang="pug">
div(class="relative flex justify-center items-center w-full h-full cursor-pointer")
  video(
    ref="refVideo"
    :autoplay="autoplay"
    class="w-full h-full object-contain"
    :controls="controls"
    loop
  )
    source(:src="src + '#t=0.001'" type="video/mp4")
    f-svg-icon(iconName="play_arrow" size="24" class="text-grey-0")
</template>
<!-- //- https://muffinman.io/blog/hack-for-ios-safari-to-display-html-video-thumbnail/ -->

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    controls?: boolean
    selfControl?: boolean
    canPlay?: boolean
    autoplay?: boolean
  }>(),
  {
    controls: false,
    selfControl: false,
    canPlay: true,
    autoplay: false,
  }
)

const refVideo = ref<HTMLVideoElement>()
</script>
