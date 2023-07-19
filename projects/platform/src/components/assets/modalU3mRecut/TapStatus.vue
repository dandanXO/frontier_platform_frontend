<template lang="pug">
div(class="flex items-center cursor-pointer")
  div(
    class="rounded-l"
    :class="getClasses(CROP_MODE.SQUARE)"
    @click="$emit('update:cropMode', CROP_MODE.SQUARE)"
  )
    f-svg-icon(iconName="crop" size="24")
    span(class="text-body2 font-bold") {{ $t('EE0150') }}
  div(
    class="rounded-r"
    :class="getClasses(CROP_MODE.PERSPECTIVE)"
    @click="$emit('update:cropMode', CROP_MODE.PERSPECTIVE)"
  )
    f-svg-icon(iconName="crop_skew" size="24")
    span(class="text-body2 font-bold") {{ $t('EE0151') }}
</template>

<script lang="ts" setup>
import { CROP_MODE } from '@/utils/constants'

const props = defineProps<{ cropMode: CROP_MODE }>()

defineEmits(['update:cropMode'])

const getClasses = (cropMode: CROP_MODE) => {
  const classes = [
    'flex',
    'flex-row',
    'items-center',
    'gap-x-1',
    'py-0.5',
    'px-1.5',
    'border',
  ]
  props.cropMode === cropMode
    ? classes.push('border-primary-400', 'text-primary-400', 'bg-primary-900')
    : classes.push('border-grey-600', 'text-grey-250', 'bg-grey-800')

  return classes
}
</script>
