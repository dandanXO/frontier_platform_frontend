<template lang="pug">
div(class="flex text-black-700 cursor-pointer")
  div(
    class="py-1 px-1.5 border-black-400 border-t-2 border-b-2 border-l-2 rounded-l"
    :class="[displayMode === DISPLAY_NODE.GRID ? `${activeClass} border-r-2` : '']"
    @click="$emit('update:displayMode', DISPLAY_NODE.GRID)"
  )
    f-svg-icon(iconName="apps" size="24")
  div(
    class="py-1 px-1.5 border-black-400 border-t-2 border-b-2 border-r-2 rounded-r"
    :class="[displayMode === DISPLAY_NODE.LIST ? `${activeClass} border-l-2` : '']"
    @click="$emit('update:displayMode', DISPLAY_NODE.LIST)"
  )
    f-svg-icon(iconName="format_list_bulleted" size="24")
</template>

<script setup>
import { DISPLAY_NODE } from '@/utils/constants.js'

defineProps({
  displayMode: {
    type: Number,
    default: DISPLAY_NODE.LIST
  }
})

defineEmits(['update:displayMode'])

const activeClass = 'text-brand border-brand bg-brand-light'
</script>
