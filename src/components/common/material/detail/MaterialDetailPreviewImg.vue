<style lang="scss" scoped>
.magnifier {
  background: no-repeat #fff;
  width: 280px;
  height: 280px;
  box-shadow: 0 5px 10px -2px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  position: absolute;
  border: 2px solid #efefef;
  z-index: 300;
  border-radius: 100%;
  display: block;
  opacity: 1;
  transition: opacity 0.2s;
}
</style>

<template lang="pug">
div
  div(class="aspect-square relative" ref="refContainer")
    div(v-if="!!imageList[currentDisplayIndex].src" class="w-full h-full")
      img(ref="refSourceImage" class="w-full h-full" :src="imageList[currentDisplayIndex].src")
      div(class="absolute w-8 h-8 rounded-md bg-black-0 bottom-6 left-5 flex items-center justify-center cursor-pointer" @click="openMagnifyMode")
        svg-icon(iconName="search" size="28" class="text-black-700")
    div(v-else class="rounded w-full h-full border border-black-400 bg-black-200 flex items-center justify-center text-h4 font-bold text-black-400") {{ $t("RR0103") }}
  div(class="flex pt-3 pb-4")
    p(v-for="text in imageList[currentDisplayIndex].text" class="text-caption text-center font-bold") {{ text }}
  div(ref="refImageList" class="grid grid-flow-col gap-x-2 justify-start")
    div(v-for="(image, index) in imageList" @click="currentDisplayIndex = index")
      div(class="w-19.5 h-19.5 rounded overflow-hidden border-black-400 bg-black-200" :class="[currentDisplayIndex === index ? 'border-4' : 'border']")
        template(v-if="!!image.src")
          img(class="w-full h-full" :src="image.src")
  div(v-if="isOpenMagnifierMode" class="fixed w-screen h-screen z-footer bg-black-900/60 left-0 top-0")
    div(class="relative w-full h-full")
      img(ref="refMagnifierSourceImage" class="absolute" :src="imageList[currentDisplayIndex].src" @mouseleave="isOpenMagnifier = false" @mousemove.stop="isOpenMagnifier ? moveMagnifier($event) : openMagnifier($event)")
      div(ref="refMagnifierCloseBtn" class="absolute w-8 h-8 rounded-md bg-black-0 bottom-6 left-5 flex items-center justify-center cursor-pointer" @click="closeMagnifyMode")
        svg-icon(iconName="close" size="28" class="text-black-700")
      div(ref="refMagnifierImageList" class="absolute grid grid-flow-col gap-x-2 justify-start")
        div(v-for="(image, index) in imageList" @click="currentDisplayIndex = index")
          div(class="w-19.5 h-19.5 rounded overflow-hidden border-black-400 bg-black-200" :class="[currentDisplayIndex === index ? 'border-4' : 'border']")
            template(v-if="!!image.src")
              img(class="w-full h-full" :src="image.src")
      div(v-show="isOpenMagnifier" ref="refMagnifierGlass" class="magnifier")
</template>

<script setup>
import useMaterial from '@/composables/useMaterial'
import { ref, nextTick } from 'vue'

const props = defineProps({
  material: {
    type: Object,
    required: true
  }
})

const { imageList, defaultCoverImgIndex } = useMaterial(props.material)
const currentDisplayIndex = ref(defaultCoverImgIndex.value)

const isOpenMagnifierMode = ref(false)
const isOpenMagnifier = ref(false)
const refContainer = ref()
const refSourceImage = ref()
const refImageList = ref()
const refMagnifierSourceImage = ref()
const refMagnifierCloseBtn = ref()
const refMagnifierImageList = ref()
const refMagnifierGlass = ref()

const openMagnifyMode = async () => {
  isOpenMagnifierMode.value = true
  await nextTick()

  {
    const { left, top, width, height } = refSourceImage.value.getBoundingClientRect()
    refMagnifierSourceImage.value.style.left = left + 'px'
    refMagnifierSourceImage.value.style.top = top + 'px'
    refMagnifierSourceImage.value.width = width
    refMagnifierSourceImage.value.height = height

    refMagnifierCloseBtn.value.style.top = top + 'px'
    refMagnifierCloseBtn.value.style.left = left + width + 10 + 'px'
  }

  {
    const { left, top } = refImageList.value.getBoundingClientRect()
    refMagnifierImageList.value.style.left = left + 'px'
    refMagnifierImageList.value.style.top = top + 'px'
  }
}

const closeMagnifyMode = () => {
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
  refMagnifierGlass.value.style.left = left + x - glassHalfWidth + "px"
  refMagnifierGlass.value.style.top = top + y - glassHalfHeight + "px"
}
</script>
