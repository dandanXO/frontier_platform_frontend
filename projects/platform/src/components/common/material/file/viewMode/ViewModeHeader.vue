<template lang="pug">
div(
  class="shrink-0 w-full h-27.5 bg-grey-900 px-3 md:px-10 flex items-center justify-between border-b border-grey-700 gap-x-10"
)
  div(class="flex items-center gap-x-1 md:gap-x-4")
    f-svg-icon(iconName="visibility" size="24" class="text-grey-50")
    p(class="text-grey-50 text-caption md:text-body1 font-bold") {{ $t('RR0301') }}
  div(class="relative flex flex-1 min-w-0 justify-center")
    div(ref="refCarousel" class="flex overflow-x-scroll hide-scrollbar gap-x-2")
      template(v-for="(file, index) in fileList" :key="`file-${index}`")
        file-thumbnail(
          class="shrink-0 w-19.5 h-19.5"
          :thumbnailUrl="file.thumbnailUrl"
          :originalUrl="file.originalUrl"
          :extension="file.extension"
          :class="[currentIndex === index ? 'border-4 border-primary-400' : 'border !border-grey-700']"
          @click="emits('changeIndex', index)"
        )
    div(
      v-show="canScrollLeft"
      class="absolute top-1/2 transform -translate-y-1/2 bottom-0 left-0 w-16 h-20 bg-gradient-to-r from-grey-900 to-transparent cursor-pointer flex items-center justify-center"
      @click="scrollLeft"
    )
      f-svg-icon(
        iconName="keyboard_arrow_left"
        size="24"
        class="absolute md:left-5 top-7 text-grey-250 hover:text-primary-400"
      )
    div(
      v-show="canScrollRight"
      class="absolute top-1/2 transform -translate-y-1/2 bottom-0 right-0 w-16 h-20 bg-gradient-to-l from-grey-900 to-transparent cursor-pointer flex items-center justify-center"
      @click="scrollRight"
    )
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="24"
        class="text-grey-250 hover:text-primary-400"
      )
  f-button(size="md" @click="emits('close')") {{ $t('UU0112') }}
</template>

<script setup lang="ts">
import type { MaterialViewModeFile } from '@/types'
import { onMounted, onUnmounted, ref } from 'vue'
import FileThumbnail from '@/components/common/material/file/FileThumbnail.vue'
import { KEYBOARD_EVENT_KEYS } from '@frontier/constants'

const props = defineProps<{
  currentIndex: number
  fileList: MaterialViewModeFile[]
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'changeIndex', index: number): void
}>()
const refCarousel = ref<HTMLDivElement>()
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const checkCanScroll = () => {
  if (!refCarousel.value) {
    return
  }
  canScrollLeft.value = refCarousel.value.scrollLeft > 0
  canScrollRight.value =
    Math.round(refCarousel.value.scrollLeft + refCarousel.value.clientWidth) <
    refCarousel.value.scrollWidth
}

const observer = new ResizeObserver(checkCanScroll)

const scrollLeft = () => {
  if (!refCarousel.value) {
    return
  }
  refCarousel.value.scrollTo({
    left: refCarousel.value.scrollLeft - refCarousel.value.clientWidth,
    top: 0,
    behavior: 'smooth',
  })
}

const scrollRight = () => {
  if (!refCarousel.value) {
    return
  }
  refCarousel.value.scrollTo({
    left: refCarousel.value.scrollLeft + refCarousel.value.clientWidth,
    top: 0,
    behavior: 'smooth',
  })
}

const keyboardListener = (e: KeyboardEvent) => {
  const key = e.key as KEYBOARD_EVENT_KEYS
  const totalImages = props.fileList.length

  const determinedIndex = {
    [KEYBOARD_EVENT_KEYS.ARROW_LEFT]: props.currentIndex - 1 + totalImages,
    [KEYBOARD_EVENT_KEYS.ARROW_RIGHT]: props.currentIndex + 1,
  }

  if (key === KEYBOARD_EVENT_KEYS.ESC) {
    emits('close')
    return
  }

  determinedIndex[key] &&
    emits('changeIndex', determinedIndex[key] % totalImages)
}

onMounted(() => {
  if (!refCarousel.value) {
    return
  }
  checkCanScroll()
  refCarousel.value.addEventListener('scroll', checkCanScroll)
  document.addEventListener('keydown', keyboardListener)
  observer.observe(refCarousel.value, { box: 'content-box' })
})

onUnmounted(() => {
  if (!refCarousel.value) {
    return
  }
  refCarousel.value.removeEventListener('scroll', checkCanScroll)
  document.removeEventListener('keydown', keyboardListener)
  observer.unobserve(refCarousel.value)
})
</script>
