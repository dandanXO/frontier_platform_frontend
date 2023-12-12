<template lang="pug">
div(class="relative flex justify-center items-center w-full h-full cursor-pointer")
  video(ref="refVideo" class="w-full h-full object-contain" :controls="controls" loop)
    source(:src="src + '#t=0.001'" type="video/mp4")
  div(
    v-if="selfControl && !isPlaying"
    class="absolute w-10 h-10 rounded-full bg-grey-900/70 flex justify-center items-center cursor-pointer"
  )
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
  }>(),
  {
    controls: false,
    selfControl: false,
    canPlay: true,
  }
)

const refVideo = ref<HTMLVideoElement>()
const isPlaying = ref(false)

const togglePlayPause = () => {
  if (refVideo.value == null || !props.canPlay) {
    return
  }

  if (isPlaying.value) {
    refVideo.value.pause()
  } else {
    refVideo.value.play()
  }
  isPlaying.value = !isPlaying.value
}

defineExpose({
  togglePlayPause,
  isPlaying,
})
</script>
