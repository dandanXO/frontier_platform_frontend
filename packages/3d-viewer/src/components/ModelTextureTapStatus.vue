<template lang="pug">
div(class="flex items-center text-grey-600 cursor-pointer")
  div(
    class="rounded-l"
    :class="getClasses(DISPLAY_MODE.MODEL)"
    @click="$emit('update:displayMode', DISPLAY_MODE.MODEL)"
  )
    f-svg-icon(iconName="3D_material" size="24")
    span(class="text-body2 font-bold") {{ $t('UU0122') }}
  div(
    class="rounded-r"
    :class="getClasses(DISPLAY_MODE.TEXTURE)"
    @click="$emit('update:displayMode', DISPLAY_MODE.TEXTURE)"
  )
    f-svg-icon(iconName="2D_layer" size="24")
    span(class="text-body2 font-bold") {{ $t('UU0123') }}
</template>

<script lang="ts" setup>
import { DISPLAY_MODE } from '../constants/index.js'

const props = defineProps({
  displayMode: {
    type: Number,
    default: DISPLAY_MODE.MODEL,
  },
})

defineEmits(['update:displayMode'])

const getClasses = (displayMode: DISPLAY_MODE) => {
  const classes = [
    'flex',
    'flex-row',
    'items-center',
    'gap-x-1',
    'py-0.5',
    'px-1.5',
    'border',
  ]
  props.displayMode === displayMode
    ? classes.push('border-primary-400', 'text-primary-400', 'bg-primary-900')
    : classes.push('border-grey-600', 'text-grey-250', 'bg-grey-800')

  return classes
}
</script>
