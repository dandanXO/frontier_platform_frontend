<style lang="scss" scoped>
.prev {
  background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 91.41%);
}

.next {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #ffffff 91.41%);
}
</style>

<template lang="pug">
div(class="relative overflow-hidden")
  div(v-if="currentX < 0" class="z-1 prev absolute left-0 w-16 flex justify-center")
    div(
      class="h-8.5 w-8.5 flex justify-center items-center bg-grey-0 rounded-full cursor-pointer"
      @click="forward"
    )
      f-svg-icon(iconName="keyboard_arrow_left" size="24" class="text-grey-600")
  div(v-if="widthLeft > 0" class="z-1 next absolute right-0 w-16 flex justify-center")
    div(
      class="h-8.5 w-8.5 flex justify-center items-center bg-grey-0 rounded-full cursor-pointer"
      @click="backward"
    )
      f-svg-icon(iconName="keyboard_arrow_right" size="24" class="text-grey-600")
  div(ref="slider" class="transition-all duration-500" :style="translateX")
    slot
</template>

<script>
import { computed, ref, watchEffect } from 'vue'

export default {
  name: 'Slider',
  setup() {
    const slider = ref(null)
    const currentX = ref(0)
    const contentTotalWidth = ref(0)
    const sliderWidth = ref(0)
    const widthLeft = ref(0)

    const translateX = computed(() => {
      return `transform: translateX(${currentX.value}px)`
    })

    const forward = () => {
      if (currentX.value >= 0) return

      if (currentX.value + sliderWidth.value / 2 > 0) {
        currentX.value = 0
        widthLeft.value = contentTotalWidth.value - sliderWidth.value
      } else {
        currentX.value += sliderWidth.value / 2
        widthLeft.value += sliderWidth.value / 2
      }
    }

    const backward = () => {
      if (widthLeft.value < 0) return

      if (widthLeft.value < sliderWidth.value / 2) {
        currentX.value = contentTotalWidth.value * -1 + sliderWidth.value - 30
        widthLeft.value = 0
      } else {
        currentX.value += (sliderWidth.value / 2) * -1
        widthLeft.value -= sliderWidth.value / 2
      }
    }

    watchEffect(
      () => {
        if (slider.value) {
          contentTotalWidth.value = slider.value.scrollWidth
          sliderWidth.value = slider.value.clientWidth
          widthLeft.value = contentTotalWidth.value - sliderWidth.value
        }
      },
      {
        flush: 'post',
      }
    )

    return {
      slider,
      translateX,
      forward,
      backward,
      currentX,
      widthLeft,
    }
  },
}
</script>
