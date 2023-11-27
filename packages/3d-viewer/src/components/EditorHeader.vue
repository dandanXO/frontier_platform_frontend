<template lang="pug">
div(
  class="w-screen h-20 shrink-0 border-b border-grey-800 bg-grey-900 flex items-center justify-between desktop:px-10 px-4"
)
  div(v-if="isDesktop" class="flex items-center gap-x-2 text-grey-100 shrink-0")
    f-svg-icon(iconName="3D_viewer" size="24")
    p(class="text-body1 font-bold") {{ $t('EE0029') }}
  div(
    class="flex flex-row tablet:gap-x-10 gap-x-5 tablet:pr-10 pr-5"
    :class="{ ' flex-1 min-w-0': !isDesktop }"
  )
    f-input-tap(
      :theme="THEME.DARK"
      :optionList="displayModeOptionList"
      :inputValue="displayMode"
      @update:inputValue="(v) => handleDisplayModeChange(v)"
    )
    div(class="relative min-w-0 items-center")
      div(ref="carousel" class="relative flex flex-row overflow-x-scroll hide-scrollbar")
        template(v-if="displayMode === DISPLAY_MODE.MODEL")
          div(
            v-for="(model, index) in models"
            :key="model.name"
            class="mx-1 h-[42px] w-[42px] hover:opacity-70 border border-grey-700 rounded shrink-0 cursor-pointer"
            :class="{ '!border-primary-400': currentModel.name === model.name }"
            @click="emit('modelClick', index)"
          )
            img(:src="model.coverImg" class="rounded")
        template(v-else)
          div(class="flex flex-row shirk gap-x-2 items-center")
            f-label(
              :theme="THEME.DARK"
              @click="emit('textureClick', TEXTURE_TYPE.BASE)"
              :active="textureType === TEXTURE_TYPE.BASE"
            ) base
            f-label(
              :theme="THEME.DARK"
              @click="emit('textureClick', TEXTURE_TYPE.NORMAL)"
              :active="textureType === TEXTURE_TYPE.NORMAL"
            ) normal
            f-label(
              :theme="THEME.DARK"
              @click="emit('textureClick', TEXTURE_TYPE.ROUGHNESS)"
              :active="textureType === TEXTURE_TYPE.ROUGHNESS"
            ) roughness
            f-label(
              :theme="THEME.DARK"
              @click="emit('textureClick', TEXTURE_TYPE.DISPLACEMENT)"
              :active="textureType === TEXTURE_TYPE.DISPLACEMENT"
            ) displacement
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
  f-svg-icon(
    v-if="isMobile"
    iconName="clear"
    size="24"
    class="text-grey-100 hover:text-primary-400"
    @click="emit('close')"
  )
  f-button(v-else :theme="THEME.DARK" size="md" @click="emit('close')") {{ $t('UU0112') }}
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { DISPLAY_MODE, TEXTURE_TYPE, THEME } from '../constants'
import type { Model } from '../constants/models'
import { useBreakpoints } from '@frontier/lib'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  displayMode: number
  models: Model[]
  currentModel: Model
  textureType: number
}>()

const { isMobile, isDesktop } = useBreakpoints()

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

const displayModeOptionList = computed(() => [
  {
    label: isMobile.value ? null : t('UU0122'),
    selectValue: DISPLAY_MODE.MODEL,
    icon: '3D_material',
  },
  {
    label: isMobile.value ? null : t('UU0123'),
    selectValue: DISPLAY_MODE.TEXTURE,
    icon: '2D_layer',
  },
])

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
