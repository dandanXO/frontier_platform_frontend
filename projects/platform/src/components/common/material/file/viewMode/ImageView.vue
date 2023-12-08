<template lang="pug">
div(
  class="w-full h-full"
  @mouseleave.prevent="isOpenMagnifier = false"
  @touchend.prevent="isOpenMagnifier = false"
  @mousemove.stop.prevent="moveMagnifier($event)"
  @touchmove.stop.prevent="moveMagnifier($event)"
)
  img(
    ref="refMagnifierSourceImage"
    class="w-full h-full rounded-2xl overflow-hidden object-contain"
    :src="src"
    @mousemove.prevent="!isOpenMagnifier && openMagnifier($event)"
    @touchmove.prevent="!isOpenMagnifier && openMagnifier($event)"
  )
  div(v-show="isOpenMagnifier" ref="refMagnifierGlass" class="magnifier")
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'

const props = defineProps<{
  src: string
}>()

// const hideMagnifier = computed(
//   () =>
//     props.material.coverMode === COVER_MODE.SUP &&
//     currentDisplayIndex.value === defaultCoverImgIndex.value
// )

const isOpenMagnifier = ref(false)
const refMagnifierSourceImage = ref()
const refMagnifierGlass = ref()
const HEADER_HEIGHT = 110

// const openMagnifyMode = async () => {
//   // isOpenMagnifierMode.value = true
//   disableScroll()

//   await nextTick()

//   refMagnifierSourceImage.value.width =
//     (window.innerHeight - HEADER_HEIGHT) * 0.8
//   refMagnifierSourceImage.value.height =
//     (window.innerHeight - HEADER_HEIGHT) * 0.8
// }

// const closeMagnifyMode = () => {
//   enableScroll()
//   isOpenMagnifierMode.value = false
// }

const openMagnifier = (e) => {
  isOpenMagnifier.value = true

  refMagnifierGlass.value.style.backgroundImage = `url(${props.src})`
  const imgWidth = refMagnifierSourceImage.value.width
  const imgHeight = refMagnifierSourceImage.value.height
  refMagnifierGlass.value.style.backgroundSize =
    imgWidth * 3.5 + 'px ' + imgHeight * 3.5 + 'px'
  moveMagnifier(e)
}

// https://daily-dev-tips.com/posts/vanilla-javascript-image-magnify/
// https://www.w3schools.com/howto/howto_js_image_magnifier_glass.asp
const moveMagnifier = (e) => {
  const { left, top } = refMagnifierSourceImage.value.getBoundingClientRect()
  let x, y
  if (e.targetTouches) {
    const { pageX, pageY } = e.targetTouches[0]
    x = pageX - left
    y = pageY - top
  } else {
    x = e.pageX - left
    y = e.pageY - top
  }
  const imgWidth = refMagnifierSourceImage.value.width
  const imgHeight = refMagnifierSourceImage.value.height
  const glassHalfWidth = refMagnifierGlass.value.offsetWidth / 2
  const glassHalfHeight = refMagnifierGlass.value.offsetHeight / 2

  let xperc = (x / imgWidth) * 100
  let yperc = (y / imgHeight) * 100

  // Add some margin for right edge
  if (x > 0.01 * imgWidth) {
    xperc += 0.15 * xperc
  }

  // Add some margin for bottom edge
  if (y >= 0.01 * imgHeight) {
    yperc += 0.15 * yperc
  }

  // Set the background of the magnified image horizontal
  refMagnifierGlass.value.style.backgroundPositionX = xperc - 9 + '%'
  // Set the background of the magnified image vertical
  refMagnifierGlass.value.style.backgroundPositionY = yperc - 9 + '%'

  // Move the magnifying glass with the mouse movement.
  const leftMaxBoundary = window.innerWidth - glassHalfWidth * 2
  const leftMintBoundary = 0
  const tempLeft = left + x - glassHalfWidth
  const newLeft =
    tempLeft < 0
      ? leftMintBoundary
      : tempLeft > leftMaxBoundary
      ? leftMaxBoundary
      : tempLeft
  refMagnifierGlass.value.style.left = newLeft + 'px'

  const topMinBoundary = -HEADER_HEIGHT
  const topMaxBoundary =
    window.innerHeight - HEADER_HEIGHT - glassHalfHeight * 2
  const tempTop = top + y - glassHalfHeight - 150 // 150 is magic correction value
  const newTop =
    tempTop < topMinBoundary
      ? topMinBoundary
      : tempTop > topMaxBoundary
      ? topMaxBoundary
      : tempTop
  refMagnifierGlass.value.style.top = newTop + 'px'
}

// Not sure why the content of the background can be scrolling in the embed iframe,
// therefore, disabled scroll functionality when is on magnify mode
// https://www.geeksforgeeks.org/how-to-disable-scrolling-temporarily-using-javascript/
// const disableScroll = () => {
//   // Get the current page scroll position
//   const scrollTop = window.pageYOffset || document.documentElement.scrollTop
//   const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

//   // if any scroll is attempted, set this to the previous value
//   window.onscroll = function () {
//     window.scrollTo(scrollLeft, scrollTop)
//   }
// }

// const enableScroll = () => {
//   window.onscroll = function () {}
// }
</script>

<style lang="scss" scoped>
.magnifier {
  pointer-events: none;
  position: absolute;
  border: 4px solid;
  z-index: 300;
  border-radius: 100%;
  display: block;
  opacity: 1;
  transition: opacity 0.2s;
  @apply border-grey-250 w-35 md:w-75 h-35 md:h-75 bg-grey-900 bg-no-repeat;
}
</style>
