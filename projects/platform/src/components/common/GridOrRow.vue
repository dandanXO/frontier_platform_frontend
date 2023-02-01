<template lang="pug">
div(class="flex text-grey-600 cursor-pointer")
  div(
    class="py-1 px-1.5 border-grey-200 border-t-2 border-b-2 border-l-2 rounded-l"
    :class="[displayMode === DISPLAY_NODE.GRID ? `${activeClass} border-r-2` : '']"
    @click="$emit('update:displayMode', DISPLAY_NODE.GRID)"
  )
    f-svg-icon(iconName="apps" size="24")
  div(
    class="py-1 px-1.5 border-grey-200 border-t-2 border-b-2 border-r-2 rounded-r"
    :class="[displayMode === DISPLAY_NODE.LIST ? `${activeClass} border-l-2` : '']"
    @click="$emit('update:displayMode', DISPLAY_NODE.LIST)"
  )
    f-svg-icon(iconName="format_list_bulleted" size="24")
</template>

<script setup>
import { DISPLAY_NODE } from '@/utils/constants'

defineProps({
  displayMode: {
    type: Number,
    default: DISPLAY_NODE.LIST,
  },
})

defineEmits(['update:displayMode'])

const activeClass = 'text-primary-400 border-primary-400 bg-primary-0'
</script>
