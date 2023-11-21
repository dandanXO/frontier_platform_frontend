<template lang="pug">
div(class="flex gap-x-4")
  div(:style="styleHeight" class="overflow-hidden w-16 flex-shrink-0 relative")
    div(
      v-if="currentY < 0"
      class="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-grey-0 to-transparent z-1"
    )
    div(
      v-if="remainingHeight > 0"
      class="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-grey-0 to-transparent z-1"
    )
    div(
      ref="refSlider"
      class="w-16 grid gap-y-2 content-start transition-all duration-500"
      :style="styleTranslateY"
      @wheel.prevent="wheelHandler"
    )
      div(
        v-for="(image, index) in displayImageList"
        :key="image.imgName"
        class="w-16 h-16 rounded box-border overflow-hidden border-grey-250 bg-grey-100"
        :class="[currentIndex === index ? 'border-4 border-primary-400' : 'border']"
        @click="currentIndex = index"
      )
        img(
          v-if="!!image.thumbnailUrl"
          :src="image.thumbnailUrl"
          class="w-full h-full"
          v-default-img
        )
        div(v-else class="w-full h-full flex items-center justify-center")
          p(class="text-caption/1.3 text-grey-250") {{ $t('RR0103') }}
  div(ref="refImage" class="flex-grow relative aspect-square")
    img(
      class="w-full h-full overflow-hidden rounded object-cover"
      :class="{ 'border border-grey-250': !displayImageList[currentIndex].displayUrl }"
      :src="displayImageList[currentIndex].displayUrl || undefined"
      :key="currentIndex"
      v-default-img
    )
    button(
      v-if="!!displayImageList[currentIndex].displayUrl"
      class="absolute w-10 h-10 rounded-full bg-grey-0/80 bottom-5 left-5 flex items-center justify-center cursor-pointer"
      @click="openModalFileViewer"
    )
      f-svg-icon(iconName="search" size="24" class="text-grey-900")
    div(class="absolute bottom-5 right-5 flex items-center gap-x-2")
      button(
        @click="backward"
        class="w-10 h-10 rounded-full bg-grey-0/80 flex items-center justify-center cursor-pointer"
      )
        f-svg-icon(iconName="keyboard_arrow_left" size="24" class="text-grey-900")
      button(
        @click="forward"
        class="w-10 h-10 rounded-full bg-grey-0/80 flex items-center justify-center cursor-pointer"
      )
        f-svg-icon(iconName="keyboard_arrow_right" size="24" class="text-grey-900")
</template>

<script setup lang="ts">
import type { Material } from '@frontier/platform-web-sdk'
import { ref, computed, onMounted } from 'vue'
import useMaterial from '@/composables/material/useMaterial'

const props = defineProps<{
  material: Material
}>()

const { displayImageList } = useMaterial(ref(props.material))
const currentIndex = ref(0)

const refSlider = ref<HTMLDivElement | null>(null)
const remainingHeight = ref(0)
const refImage = ref<HTMLDivElement | null>(null)
const imageHeight = computed(
  () => refImage.value?.getBoundingClientRect().height ?? 507
)
const styleHeight = computed(() => `height: ${imageHeight.value}px`)
const currentY = ref(0)
const styleTranslateY = computed(
  () => `transform:  translateY(${currentY.value}px)`
)

const ELEMENT_HEIGHT_AND_GAP = 64 + 8
const maxElement = computed(() => {
  return Math.floor(imageHeight.value / ELEMENT_HEIGHT_AND_GAP)
})

const forward = () => {
  if (currentIndex.value === displayImageList.value.length - 1) {
    return
  }
  currentIndex.value++

  if (currentIndex.value >= maxElement.value && remainingHeight.value > 0) {
    currentY.value -= ELEMENT_HEIGHT_AND_GAP
    remainingHeight.value -= ELEMENT_HEIGHT_AND_GAP
  }
}

const backward = () => {
  if (currentIndex.value === 0) {
    return
  }
  currentIndex.value--

  if (currentIndex.value < displayImageList.value.length - maxElement.value) {
    currentY.value = Math.min(0, currentY.value + ELEMENT_HEIGHT_AND_GAP)
    remainingHeight.value += ELEMENT_HEIGHT_AND_GAP
  }
}

let scrollDistance = 0
const wheelHandler = (e: WheelEvent) => {
  const deltaY = e.deltaY

  scrollDistance += Math.abs(deltaY)

  if (scrollDistance < 150) {
    return
  }

  if (deltaY > 0) {
    forward()
  } else {
    backward()
  }
  scrollDistance = 0
}

onMounted(() => {
  if (refSlider.value) {
    remainingHeight.value = refSlider.value.scrollHeight - imageHeight.value
  }
})

const openModalFileViewer = () => {}
</script>
