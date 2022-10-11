<template lang="pug">
div(class="flex items-center text-grey-600 cursor-pointer")
  div(
    class="flex flex-row items-center gap-x-1 py-1 px-1.5 border-grey-500 border rounded-l bg-grey-700"
    :class="[displayMode === DISPLAY_MODE.MODEL ? `${activeClass}` : '']"
    @click="$emit('update:displayMode', DISPLAY_MODE.MODEL)"
  )
    f-svg-icon(iconName="3d_view" size="24")
    span(class="text-body2 font-bold") {{ $t('UU0122') }}
  div(
    class="flex flex-row items-center gap-x-1 py-1 px-1.5 border-grey-500 border rounded-r bg-grey-700"
    :class="[displayMode === DISPLAY_MODE.TEXTURE ? `${activeClass}` : '']"
    @click="$emit('update:displayMode', DISPLAY_MODE.TEXTURE)"
  )
    f-svg-icon(iconName="2d_view" size="24")
    span(class="text-body2 font-bold") {{ $t('UU0123') }}
</template>

<script lang="ts" setup>
import { DISPLAY_MODE } from '../constants/index.js'

defineProps({
  displayMode: {
    type: Number,
    default: DISPLAY_MODE.MODEL,
  },
})

defineEmits(['update:displayMode'])

const activeClass = 'bg-primary-0 border-primary-400 text-primary-400'
</script>
