<template lang="pug">
div(class="flex items-center text-grey-400 cursor-pointer")
  div(
    class="flex flex-row items-center gap-x-1 py-0.5 px-1.5 border rounded-l bg-grey-700"
    :class="[cropMode === CROP_MODE.SQUARE ? `${activeClass}` : 'border-grey-400 ']"
    @click="$emit('update:cropMode', CROP_MODE.SQUARE)"
  )
    f-svg-icon(iconName="crop" size="24")
    span(class="text-body2 font-bold") {{ $t('EE0150') }}
  div(
    class="flex flex-row items-center gap-x-1 py-0.5 px-1.5 border rounded-r bg-grey-700"
    :class="[cropMode === CROP_MODE.PERSPECTIVE ? `${activeClass}` : 'border-grey-400']"
    @click="$emit('update:cropMode', CROP_MODE.PERSPECTIVE)"
  )
    f-svg-icon(iconName="crop_skew" size="24")
    span(class="text-body2 font-bold") {{ $t('EE0151') }}
</template>

<script lang="ts" setup>
import { CROP_MODE } from '@/utils/constants'

defineProps<{ cropMode: CROP_MODE }>()

defineEmits(['update:cropMode'])

const activeClass = 'border-primary-400 text-primary-400'
</script>
