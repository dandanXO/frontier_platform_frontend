<style lang="scss" scoped>
.magnifier {
  background: no-repeat #fff;
  width: 300px;
  height: 300px;
  box-shadow: 0 5px 10px -2px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  position: absolute;
  border: 4px solid #efefef;
  z-index: 300;
  border-radius: 100%;
  display: block;
  opacity: 1;
  transition: opacity 0.2s;
}
</style>

<template lang="pug">
div
  div(class="aspect-square relative")
    div(v-if="!!imageList[currentDisplayIndex].src" class="w-full h-full")
      img(class="w-full h-full" :src="imageList[currentDisplayIndex].src")
      div(class="absolute w-8 h-8 rounded-md bg-black-0 bottom-6 left-5 flex items-center justify-center cursor-pointer" @click="openMagnifyMode")
        f-svg-icon(iconName="search" size="28" class="text-black-700")
    div(v-else class="rounded w-full h-full border border-black-400 bg-black-200 flex items-center justify-center text-h4 font-bold text-black-400") {{ $t("RR0103") }}
  div(class="flex pt-3 pb-4")
    p(v-for="text in imageList[currentDisplayIndex].text" class="text-caption text-center font-bold") {{ text }}
  div(class="grid grid-flow-col gap-x-2 justify-start")
    template(v-for="(image, index) in imageList")
      div(
        class="w-19.5 h-19.5 rounded overflow-hidden border-black-400 bg-black-200"
        :class="[currentDisplayIndex === index ? 'border-4' : 'border']"
        @click="currentDisplayIndex = index"
      )
        img(v-if="!!image.src" class="w-full h-full" :src="image.src")
  div(v-if="isOpenMagnifierMode" class="fixed w-screen h-screen z-popper bg-black-900/90 left-0 top-0 flex flex-col")
    div(class="shrink-0 w-full h-27.5 bg-black-900 px-10 flex items-center justify-between")
      div(class="flex items-center")
        f-svg-icon(iconName="zoom_in" size="24" class="text-black-50")
        p(class="text-black-50 text-body1 font-bold pl-4") {{ $t("EE0132") }}
      div(class="grid grid-flow-col gap-x-2")
        template(v-for="(image, index) in imageList")
          div(
            v-if="!(props.material.coverMode === COVER_MODE.SUP && index === defaultCoverImgIndex)"
            class="w-19.5 h-19.5 rounded overflow-hidden border-black-400 bg-black-200"
            :class="[currentDisplayIndex === index ? 'border-4' : 'border']"
            @click="currentDisplayIndex = index"
          )
            img(v-if="!!image.src" class="w-full h-full" :src="image.src")
      f-button(size="md" @click="closeMagnifyMode") Exit
    div(class="flex-grow h-full relative flex items-center justify-center")
      div(class="p-10" @mouseleave="isOpenMagnifier = false" @mousemove.stop="moveMagnifier($event)")
        img(ref="refMagnifierSourceImage" class="rounded overflow-hidden" :src="imageList[currentDisplayIndex].src" @mousemove="!isOpenMagnifier && openMagnifier($event)")
        div(v-show="isOpenMagnifier" ref="refMagnifierGlass" class="magnifier")
</template>

<script setup>
import useMaterial from '@/composables/useMaterial'
import { ref, computed, nextTick } from 'vue'
import { COVER_MODE } from '@/utils/constants.js'

const props = defineProps({
  material: {
    type: Object,
    required: true
  }
})

const { imageList, defaultCoverImgIndex } = useMaterial(props.material)
const currentDisplayIndex = ref(defaultCoverImgIndex.value)
const hideMagnifier = computed(() => props.material.coverMode === COVER_MODE.SUP && currentDisplayIndex.value === defaultCoverImgIndex.value)

const isOpenMagnifierMode = ref(false)
const isOpenMagnifier = ref(false)
const refMagnifierSourceImage = ref()
const refMagnifierGlass = ref()
const HEADER_HEIGHT = 110

const openMagnifyMode = async () => {
  isOpenMagnifierMode.value = true
  disableScroll()

  await nextTick()

  refMagnifierSourceImage.value.width = (window.innerHeight - HEADER_HEIGHT) * 0.8
  refMagnifierSourceImage.value.height = (window.innerHeight - HEADER_HEIGHT) * 0.8
}

const closeMagnifyMode = () => {
  enableScroll()
  isOpenMagnifierMode.value = false
}

const openMagnifier = (e) => {
  isOpenMagnifier.value = true

  refMagnifierGlass.value.style.backgroundImage = `url(${imageList.value[currentDisplayIndex.value].src})`
  const imgWidth = refMagnifierSourceImage.value.width
  const imgHeight = refMagnifierSourceImage.value.height
  refMagnifierGlass.value.style.backgroundSize = (imgWidth * 3.5) + "px " + (imgHeight * 3.5) + "px"
  moveMagnifier(e)
}

// https://daily-dev-tips.com/posts/vanilla-javascript-image-magnify/
// https://www.w3schools.com/howto/howto_js_image_magnifier_glass.asp
const moveMagnifier = (e) => {
  const { left, top } = refMagnifierSourceImage.value.getBoundingClientRect()
  const x = e.pageX - left
  const y = e.pageY - top
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
  refMagnifierGlass.value.style.backgroundPositionX = xperc - 9 + "%"
  // Set the background of the magnified image vertical
  refMagnifierGlass.value.style.backgroundPositionY = yperc - 9 + "%"

  // Move the magnifying glass with the mouse movement.
  const leftMaxBoundary = window.innerWidth - glassHalfWidth * 2
  const leftMintBoundary = 0
  const tempLeft = left + x - glassHalfWidth
  const newLeft = tempLeft < 0
    ? leftMintBoundary
    : tempLeft > leftMaxBoundary
      ? leftMaxBoundary
      : tempLeft
  refMagnifierGlass.value.style.left = newLeft + "px"

  const topMinBoundary = -HEADER_HEIGHT
  const topMaxBoundary = window.innerHeight - HEADER_HEIGHT - glassHalfHeight * 2
  const tempTop = top + y - glassHalfHeight - 150 // 150 is magic correction value
  const newTop = tempTop < topMinBoundary
    ? topMinBoundary
    : tempTop > topMaxBoundary
      ? topMaxBoundary
      : tempTop
  refMagnifierGlass.value.style.top = newTop + "px"
}


// Not sure why the content of the background can be scrolling in the embed iframe,
// therefore, disabled scroll functionality when is on magnify mode
// https://www.geeksforgeeks.org/how-to-disable-scrolling-temporarily-using-javascript/
const disableScroll = () => {
  // Get the current page scroll position
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

  // if any scroll is attempted, set this to the previous value
  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop)
  }
}

const enableScroll = () => {
  window.onscroll = function () { }
}
</script>
