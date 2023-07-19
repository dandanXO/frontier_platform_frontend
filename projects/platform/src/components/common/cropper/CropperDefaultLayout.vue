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

<script setup>
import { ref, computed, watch } from 'vue'
import { THEME } from '@/utils/constants'

const props = defineProps({
  theme: {
    type: String,
    default: THEME.LIGHT,
  },
  config: {
    type: Object,
    required: true,
  },
  showScale: {
    type: Boolean,
    default: true,
  },
  scaleUnit: {
    type: String,
    default: '%',
  },
  scaleInputStep: {
    type: Number,
    default: 1,
  },
  scaleRange: {
    type: Array,
    default: () => {
      return [100, 800]
    },
  },
  scaleStart: {
    type: Number,
  },
  scaleInitial: {
    type: Number,
  },
  rotateStart: {
    type: Number,
  },
})

const emit = defineEmits([
  'update:rotateDeg',
  'update:scaleRatio',
  'update:options',
])

const refScale = ref(null)
const refRotateDeg = ref(null)
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
    if (val > props.scaleRange[1] || val < props.scaleRange[0]) return
    scaleValue.value = val
  },
})

const formattedRotateDeg = computed({
  get: () => parseFloat(innerRotateDeg.value.toFixed(2)),
  set: (val) => {
    if (val.length === 0) return
    innerRotateDeg.value = val
  },
})

const resetRotate = () => {
  refRotateDeg.value.reset()
}

const resetScale = () => {
  refScale.value.reset()
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
