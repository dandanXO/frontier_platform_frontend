<template lang="pug">
div
  div(class="w-full flex justify-center items-center overflow-hidden")
    div(
      class="relative w-full aspect-square flex justify-center items-center"
      :class="theme === THEME.LIGHT ? 'bg-[#F1F2F5]' : 'bg-grey-900'"
    )
      slot(
        name="imageCropArea"
        :innerScaleSize="scaleValue"
        :innerShowScale="showScale"
      )
  f-input-slider(
    class="mt-4"
    ref="refRotateDeg"
    v-model:range="formattedRotateDeg"
    v-bind="rotateSetting"
    :theme="theme"
    withInput
    inputUnit="°"
    :label="$t('EE0049')"
    labelIcon="rotate"
  )
  f-input-slider(
    v-if="showScale"
    class="mt-3"
    ref="refScale"
    v-model:range="formattedScaleValue"
    v-bind="scaleSetting"
    :theme="theme"
    withInput
    :inputUnit="scaleUnit"
    :label="$t('EE0098')"
    labelIcon="open_in_full"
  )
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { THEME } from '@/utils/constants'
import type { CropperConfig } from '@/types'
import type { FInputSlider } from '@frontier/ui-component'

const props = withDefaults(
  defineProps<{
    theme?: string
    showScale?: boolean
    scaleUnit?: string
    scaleInputStep?: number
    scaleRange?: number[]
    scaleStart?: number
    scaleInitial?: number
    rotateStart: number
    config: CropperConfig
  }>(),
  {
    theme: THEME.LIGHT,
    showScale: true,
    scaleUnit: '%',
    scaleInputStep: 1,
    scaleRange: () => {
      return [100, 800]
    },
  }
)

const emit = defineEmits<{
  'update:rotateDeg': [val: number]
  'update:scaleRatio': [val: number]
  'update:options': [val: CropperConfig]
}>()

const refScale = ref<InstanceType<typeof FInputSlider> | null>(null)
const refRotateDeg = ref<InstanceType<typeof FInputSlider> | null>(null)
const scaleSetting = {
  step: props.scaleInputStep,
  tooltips: false,
  min: props.scaleRange[0],
  max: props.scaleRange[1],
  defaultRange: props.scaleStart || props.scaleRange[0],
}
const rotateSetting = {
  step: 0.1,
  tooltips: false,
  min: -180,
  max: 180,
  defaultRange: props.rotateStart || 0,
}
const scaleValue = ref(
  props.scaleInitial || props.scaleStart || props.scaleRange[0]
)

const innerRotateDeg = computed({
  get: () => props.config.rotateDeg,
  set: (val) => emit('update:rotateDeg', val),
})

const formattedScaleValue = computed({
  get: () => scaleValue.value,
  set: (val) => {
    if (val > props.scaleRange[1] || val < props.scaleRange[0]) {
      return
    }
    scaleValue.value = val
  },
})

const formattedRotateDeg = computed({
  get: () => parseFloat(innerRotateDeg.value.toFixed(2)),
  set: (val) => {
    if (val.length === 0) {
      return
    }
    innerRotateDeg.value = val
  },
})

const resetRotate = () => {
  refRotateDeg.value?.reset()
}

const resetScale = () => {
  refScale.value?.reset()
}

defineExpose({ resetRotate, resetScale })

watch(
  () => scaleValue.value,
  () => {
    emit('update:scaleRatio', scaleValue.value)
  },
  {
    immediate: true,
  }
)
</script>
