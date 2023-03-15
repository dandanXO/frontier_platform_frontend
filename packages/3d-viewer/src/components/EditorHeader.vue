<template lang="pug">
div(
  class="w-screen h-20 shrink-0 border-b border-grey-800 bg-grey-900 flex items-center justify-between"
  :class="largerThenLg ? 'px-10' : 'px-5'"
)
  div(v-if="largerThenLg" class="flex items-center gap-x-2 text-grey-100")
    f-svg-icon(iconName="3D_viewer" size="24")
    p(class="text-body1 font-bold") {{ $t('EE0029') }}
  div(class="flex flex-row gap-x-10" :class="{ 'flex-1 min-w-0': !largerThenLg }")
    model-texture-tap-status(
      :displayMode="displayMode"
      @update:displayMode="handleDisplayModeChange"
    )
    div(class="relative mx-auto min-w-0 items-center" :class="{ 'pr-10': largerThenMd }")
      div(ref="carousel" class="relative flex flex-row overflow-x-scroll hide-scrollbar")
        template(v-if="displayMode === DISPLAY_MODE.MODEL")
          div(
            v-for="(model, index) in MODELS"
            :key="model.name"
            class="mx-1 h-[42px] w-[42px] hover:opacity-70 border border-grey-700 rounded shrink-0 cursor-pointer"
            :class="{ '!border-primary-400': currentModel.name === model.name }"
            @click="emit('modelClick', index)"
          )
            img(:src="model.coverImg" class="rounded")
        template(v-else)
          div(class="flex flex-row shirk gap-x-2 items-center")
            dark-tag(
              @click="emit('textureClick', TEXTURE_TYPE.BASE)"
              :active="textureType === TEXTURE_TYPE.BASE"
            ) base
            dark-tag(
              @click="emit('textureClick', TEXTURE_TYPE.NORMAL)"
              :active="textureType === TEXTURE_TYPE.NORMAL"
            ) normal
            dark-tag(
              @click="emit('textureClick', TEXTURE_TYPE.ROUGHNESS)"
              :active="textureType === TEXTURE_TYPE.ROUGHNESS"
            ) roughness
            dark-tag(
              @click="emit('textureClick', TEXTURE_TYPE.DISPLACEMENT)"
              :active="textureType === TEXTURE_TYPE.DISPLACEMENT"
            ) displacement
      div(
        v-show="canScrollLeft"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 w-[50px] h-20 cursor-pointer"
        :style="{ background: 'linear-gradient(90deg, #262626 0%, rgba(38, 38, 38, 0) 100%)' }"
        @click="scrollLeft"
      )
        f-svg-icon(
          iconName="keyboard_arrow_left"
          size="24"
          class="absolute left-5 top-7 text-grey-150"
        )
      div(
        v-show="canScrollRight"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 w-[100px] h-20 cursor-pointer"
        :style="{ background: 'linear-gradient(270deg, #262626 0%, rgba(38, 38, 38, 0) 100%)' }"
        @click="scrollRight"
      )
        f-svg-icon(
          iconName="keyboard_arrow_right"
          size="24"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 text-grey-150"
        )
  f-button(v-if="largerThenMd" theme="dark" size="md" @click="emit('close')") {{ $t('UU0112') }}
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import DarkTag from '@frontier/ui-component/src/FTag/DarkTag.vue'
import ModelTextureTapStatus from './ModelTextureTapStatus.vue'
import { DISPLAY_MODE, TEXTURE_TYPE } from '../constants'
import MODELS from '../constants/models'
import useBreakpoints from '../composables/useBreakpoints'
import type { Model } from '../constants/models'

defineProps<{
  displayMode: number
  currentModel: Model
  textureType: number
}>()

const { largerThenMd, largerThenLg } = useBreakpoints()

const modelItemSize = 42
const modelItemsPerScroll = 3
const gap = 4
const scrollLength =
  modelItemSize * modelItemsPerScroll + gap * (modelItemsPerScroll - 1)
const carousel = ref<HTMLDivElement>()
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const checkCanScroll = () => {
  if (!carousel.value) {
    return
  }
  canScrollLeft.value = carousel.value.scrollLeft > 0
  canScrollRight.value =
    carousel.value.scrollLeft + carousel.value.clientWidth <
    carousel.value.scrollWidth
}

const observer = new ResizeObserver(checkCanScroll)

const scrollToInitial = () => {
  if (!carousel.value) {
    return
  }
  carousel.value.scrollTo({ left: 0, top: 0 })
}

const scrollLeft = () => {
  if (!carousel.value) {
    return
  }
  carousel.value.scrollTo({
    left: carousel.value.scrollLeft - scrollLength,
    top: 0,
    behavior: 'smooth',
  })
}

const scrollRight = () => {
  if (!carousel.value) {
    return
  }
  carousel.value.scrollTo({
    left: carousel.value.scrollLeft + scrollLength,
    top: 0,
    behavior: 'smooth',
  })
}

const handleDisplayModeChange = (v: number) => {
  scrollToInitial()
  emit('displayModeChange', v)
}

onMounted(() => {
  if (!carousel.value) {
    return
  }
  checkCanScroll()
  carousel.value.addEventListener('scroll', checkCanScroll)
  observer.observe(carousel.value, { box: 'content-box' })
})

onUnmounted(() => {
  if (!carousel.value) {
    return
  }
  carousel.value.removeEventListener('scroll', checkCanScroll)
  observer.unobserve(carousel.value)
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'displayModeChange', displayMode: number): void
  (e: 'modelClick', modelIndex: number): void
  (e: 'textureClick', textureType: number): void
}>()
</script>
