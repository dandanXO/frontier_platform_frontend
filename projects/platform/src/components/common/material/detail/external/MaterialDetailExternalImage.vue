<style lang="scss" scoped>
.rwd-left-cover {
  @apply absolute top-0 from-grey-0 to-transparent z-1 left-0 pointer-events-none;
  @apply tablet:w-full w-10;
  @apply tablet:h-10 h-full;
  @apply tablet:bg-gradient-to-b bg-gradient-to-r;
}
.rwd-right-cover {
  @apply absolute bottom-0 from-grey-0 to-transparent z-1 pointer-events-none;
  @apply tablet:left-0 right-0;
  @apply tablet:w-full w-10;
  @apply tablet:h-10 h-full;
  @apply tablet:bg-gradient-to-t bg-gradient-to-l;
}
</style>

<template lang="pug">
div(class="flex flex-col-reverse tablet:flex-row gap-4")
  div(:style="style" class="overflow-hidden w-16 flex-shrink-0 relative")
    div(v-if="currentTranslate < 0" class="rwd-left-cover")
    div(v-if="remainingDistance > 0" class="rwd-right-cover")
    div(
      ref="refSlider"
      class="tablet:w-16 tablet:h-auto h-16 grid gap-2 tablet:grid-flow-row grid-flow-col justify-start content-start transition-all duration-500"
      :style="styleTranslateY"
      @wheel.prevent="wheelHandler"
      @touchstart.prevent="touchstartHandler"
      @touchmove.prevent="touchmoveHandler"
      @touchend.prevent="touchendHandler"
    )
      file-thumbnail(
        v-for="(image, index) in publicFileList"
        :key="image.displayNameShort"
        class="w-16 h-16 hover:border-2 hover:border-primary-300"
        :thumbnailUrl="image.thumbnailUrl"
        :originalUrl="image.originalUrl"
        :extension="image.extension"
        :class="{ 'border-2 border-primary-300': currentIndex === index }"
        @click="currentIndex = index"
        @touchend.prevent="!isTouchMoving && (currentIndex = index)"
      )
  div(ref="refImage" class="flex-grow relative aspect-square")
    file-display(
      class="w-full h-full"
      :key="currentIndex"
      :displayUrl="publicFileList[currentIndex].displayUrl"
      :originalUrl="publicFileList[currentIndex].originalUrl"
      :extension="publicFileList[currentIndex].extension"
    )
    template(v-if="!isMobile")
      button(
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
import { useBreakpoints } from '@frontier/lib'
import FileThumbnail from '@/components/common/material/file/FileThumbnail.vue'
import FileDisplay from '@/components/common/material/file/FileDisplay.vue'
import { useStore } from 'vuex'

const props = defineProps<{
  material: Material
}>()

const store = useStore()
const { isMobile } = useBreakpoints()
const { publicFileList } = useMaterial(ref(props.material))
const currentIndex = ref(0)

const refSlider = ref<HTMLDivElement | null>(null)
const remainingDistance = ref(0)
const refImage = ref<HTMLDivElement | null>(null)
const imageWidth = computed(
  () => refImage.value?.getBoundingClientRect().width ?? 507
)
const style = computed(() =>
  isMobile.value
    ? `width: ${imageWidth.value}px`
    : `height: ${imageWidth.value}px`
)
const currentTranslate = ref(0)
const styleTranslateY = computed(() =>
  isMobile.value
    ? `transform:  translateX(${currentTranslate.value}px)`
    : `transform:  translateY(${currentTranslate.value}px)`
)

const ELEMENT_HEIGHT_AND_GAP = 64 + 8
const maxElement = computed(() => {
  return Math.floor(imageWidth.value / ELEMENT_HEIGHT_AND_GAP)
})

const forward = () => {
  if (currentIndex.value === publicFileList.value.length - 1) {
    return
  }
  currentIndex.value++

  if (currentIndex.value >= maxElement.value && remainingDistance.value > 0) {
    currentTranslate.value -= ELEMENT_HEIGHT_AND_GAP
    remainingDistance.value -= ELEMENT_HEIGHT_AND_GAP
  }
}

const backward = () => {
  if (currentIndex.value === 0) {
    return
  }
  currentIndex.value--

  if (currentIndex.value < publicFileList.value.length - maxElement.value) {
    currentTranslate.value = Math.min(
      0,
      currentTranslate.value + ELEMENT_HEIGHT_AND_GAP
    )
    remainingDistance.value += ELEMENT_HEIGHT_AND_GAP
  }
}

let scrollDistance = 0
const wheelHandler = (e: WheelEvent) => {
  const delta = isMobile.value ? e.deltaX : e.deltaY

  scrollDistance += Math.abs(delta)

  if (scrollDistance < 120) {
    return
  }

  if (delta > 0) {
    forward()
  } else {
    backward()
  }
  scrollDistance = 0
}

const startX = ref(0)
const offsetX = ref(0)
const isTouchMoving = ref(false)
const touchstartHandler = (e: TouchEvent) => {
  startX.value = e.touches[0].pageX
}
const touchmoveHandler = (e: TouchEvent) => {
  isTouchMoving.value = true
  const maxMovingDistance =
    (refSlider.value?.scrollWidth ?? 0) - imageWidth.value
  offsetX.value = e.touches[0].pageX - startX.value

  scrollDistance += Math.abs(offsetX.value / 2)

  if (scrollDistance < 80) {
    return
  }

  if (offsetX.value > 0) {
    currentTranslate.value = Math.min(
      0,
      currentTranslate.value + scrollDistance
    )
    remainingDistance.value = Math.min(
      maxMovingDistance,
      remainingDistance.value + scrollDistance
    )
  } else {
    currentTranslate.value = Math.max(
      currentTranslate.value - scrollDistance,
      -maxMovingDistance
    )
    remainingDistance.value = Math.max(
      remainingDistance.value - scrollDistance,
      0
    )
  }

  scrollDistance = 0
}
const touchendHandler = () => {
  isTouchMoving.value = false
  offsetX.value = 0
}

onMounted(() => {
  if (refSlider.value) {
    remainingDistance.value = isMobile.value
      ? refSlider.value.scrollWidth - imageWidth.value
      : refSlider.value.scrollHeight - imageWidth.value
  }
})

const openModalFileViewer = () => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: currentIndex,
        fileList: publicFileList,
      },
    },
  })
}
</script>
