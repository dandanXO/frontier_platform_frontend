<template lang="pug">
div(
  class="flex items-center gap-x-1 cursor-pointer text-grey-300"
  :class="{ '!text-grey-600': isHoverSticker && !isHoverSelf && !isActive, '!text-primary-400': isHoverSelf || isActive }"
  @mouseenter="isHoverSelf = true"
  @mouseleave="isHoverSelf = false"
)
  f-svg-icon(
    :iconName="iconName"
    size="20"
    :key="isActive"
    :tooltip="isActive ? activeTooltip : inactiveTooltip"
  )
  span(
    v-if="amount !== -1 && (isHoverSticker || amount > 0 || isActive)"
    class="text-body2 relative"
  ) {{ amount }}
    span(
      v-if="hasUnread"
      class="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-primary-400"
    )
</template>

<script setup>
import { ref } from 'vue'
defineProps({
  iconName: {
    type: String,
    required: true,
  },
  isHoverSticker: {
    type: Boolean,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  amount: {
    type: Number,
    default: -1, // 沒有數值
  },
  activeTooltip: {
    type: String,
    required: true,
  },
  inactiveTooltip: {
    type: String,
    required: true,
  },
  hasUnread: {
    type: Boolean,
    default: false,
  },
})

const isHoverSelf = ref(false)
</script>
