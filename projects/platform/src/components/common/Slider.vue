<template lang="pug">
div(class="relative")
  div(class="overflow-hidden")
    div(ref="refSlider" class="transition-all duration-500 flex" :style="translateX")
      slot

  div(
    class="flex justify-between items-center mt-4 gap-4 w-full"
    v-if="showPagination && totalPages > 1"
  )
    f-button(
      type="secondary"
      size="md"
      @click="prev"
      :disabled="currentX >= 0"
      class="!min-w-0 !p-2 !h-[2.625rem]"
    )
      f-svg-icon(iconName="chevron_left" size="24")

    div(class="flex gap-2 items-center bg-green-50-v1 p-2 rounded")
      div(
        v-for="page in totalPages"
        :key="page"
        class="h-2 w-2 rounded-full transition-colors"
        :class="currentPage === page - 1 ? 'bg-brand-solid' : 'bg-green-100-v1'"
      )

    f-button(
      type="secondary"
      size="md"
      class="!min-w-0 !p-2 !h-[2.625rem]"
      @click="next"
      :disabled="currentPage >= totalPages - 1"
    )
      f-svg-icon(iconName="chevron_right" size="24")
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, onUnmounted } from 'vue'

withDefaults(
  defineProps<{
    showPagination?: boolean
  }>(),
  {
    scrollPerItem: 1,
    showPagination: true,
  }
)

const refSlider = ref<HTMLDivElement>()
const currentX = ref(0)
const remainingWidth = ref(0)
const movement = ref(0)
const visibleWidth = ref(0)
const totalContentWidth = ref(0)

// Calculate total pages based on item count
const totalPages = computed(() => {
  return movement.value
    ? Math.ceil(totalContentWidth.value / visibleWidth.value)
    : 0
})

// Current "page" based on position
const currentPage = computed(() => {
  if (visibleWidth.value === 0) {
    return 0
  }
  const offset = Math.abs(currentX.value)
  return Math.floor(offset / movement.value)
})

const translateX = computed(() => {
  return `transform: translateX(${currentX.value}px)`
})

const prev = () => {
  if (currentX.value >= 0) {
    return
  }

  const newPosition = currentX.value + movement.value
  // Don't move beyond start position (0)
  currentX.value = Math.min(0, newPosition)
  calculateRemainingWidth()
}

const next = () => {
  if (currentPage.value >= totalPages.value - 1) {
    return
  }

  const newPosition = currentX.value - movement.value
  currentX.value = newPosition
  calculateRemainingWidth()
}

const calculateTotalWidth = () => {
  if (!refSlider.value) {
    return 0
  }
  return refSlider.value.scrollWidth
}

const calculateVisibleWidth = () => {
  if (!refSlider.value) {
    return 0
  }
  return refSlider.value.clientWidth
}

const calculateRemainingWidth = () => {
  if (!refSlider.value) {
    return
  }

  totalContentWidth.value = calculateTotalWidth()
  visibleWidth.value = calculateVisibleWidth()
  const maxScroll = totalContentWidth.value - visibleWidth.value

  // Calculate how much content is still off-screen to the right
  remainingWidth.value = maxScroll + currentX.value
}

const calculateMovementSize = () => {
  if (!refSlider.value) {
    return 0
  }

  // Calculate movement based on visible width and items per page
  return Math.min(visibleWidth.value, remainingWidth.value)
}

const recalculateSlider = async () => {
  await nextTick()

  if (!refSlider.value) {
    return
  }

  // Calculate how much to move per click
  visibleWidth.value = calculateVisibleWidth()
  movement.value = calculateMovementSize()

  // Calculate how much content is off-screen
  calculateRemainingWidth()

  // Reset position to beginning
  currentX.value = 0
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  recalculateSlider()

  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      recalculateSlider()
    })

    if (refSlider.value) {
      resizeObserver.observe(refSlider.value)
    }
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>
