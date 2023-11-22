<template lang="pug">
div(class="relative")
  div(v-if="currentX < 0" :class="classLinerBg" class="left-0 bg-gradient-to-r")
    div(
      class="h-8 w-8 flex justify-center items-center bg-grey-0 rounded-full cursor-pointer absolute left-0 transform -translate-x-1/2"
      @click="forward"
    )
      f-svg-icon(iconName="keyboard_arrow_left" size="24" class="text-grey-600")
  div(v-if="remainingWidth > 0" :class="classLinerBg" class="right-0 bg-gradient-to-l")
    div(
      class="h-8 w-8 flex justify-center items-center bg-grey-0 rounded-full cursor-pointer absolute right-0 transform translate-x-1/2"
      @click="backward"
    )
      f-svg-icon(iconName="keyboard_arrow_right" size="24" class="text-grey-600")
  div(class="overflow-hidden")
    div(ref="refSlider" class="transition-all duration-500" :style="translateX")
      slot(ref="test")
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    heightLinerBg?: string // tailwindcss class,
    scrollPerItem?: number
  }>(),
  {
    heightLinerBg: 'h-full',
  }
)

const classLinerBg = computed(() => {
  return [
    'absolute',
    'z-1',
    'top-0',
    'w-12',
    props.heightLinerBg,
    'flex',
    'justify-center',
    'items-center',
    'from-grey-0',
    'to-transparent',
  ]
})

const refSlider = ref<HTMLDivElement>()
const test = ref()
const currentX = ref(0)
const remainingWidth = ref(0)
const movement = ref(0)

const translateX = computed(() => {
  return `transform: translateX(${currentX.value}px)`
})

const forward = () => {
  if (currentX.value >= 0) {
    return
  }

  currentX.value += movement.value
  remainingWidth.value += movement.value
}

const backward = () => {
  if (remainingWidth.value < 0) {
    return
  }

  currentX.value -= movement.value
  remainingWidth.value -= movement.value
}

onMounted(() => {
  if (refSlider.value) {
    const totalWidth = refSlider.value.scrollWidth
    const sliderWidth = refSlider.value.clientWidth
    remainingWidth.value = totalWidth - sliderWidth

    if (!props.scrollPerItem || refSlider.value.children.length === 0) {
      movement.value = sliderWidth
    } else {
      movement.value =
        refSlider.value.children[0].children[0].clientWidth *
          props.scrollPerItem +
        8 * (props.scrollPerItem - 1)
    }
  }
})
</script>
