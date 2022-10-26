<template lang="pug">
div
  div(class="w-full flex justify-center items-center overflow-hidden")
    div(
      class="relative w-full aspect-square flex justify-center items-center bg-[#F1F2F5]"
    )
      slot(
        name="imageCropArea"
        :innerScaleSize="scaleValue"
        :innerShowScale="showScale"
      )
  div(class="mt-4")
    div(class="flex items-center")
      p(class="text-grey-900 text-body2 mr-2") {{ $t('EE0049') }}
      f-button-label(size="sm" :disabled="!rotateDirty" @click="resetRotate") {{ $t('RR0255') }}
    div(class="flex items-center justify-between")
      f-input-range(
        ref="refRotateDeg"
        v-model:range="formattedRotateDeg"
        v-bind="rotateSetting"
        class="w-full mr-3.5"
      )
      div(class="w-19.5 flex-shrink-0")
        f-input-number(
          v-model:value="formattedRotateDeg"
          :step="rotateSetting.step"
          :min="rotateSetting.min"
          :max="rotateSetting.max"
          unit="°"
          @change="handleRotateChange"
        )
  div(v-if="showScale" class="mt-3")
    div(class="flex items-center")
      p(class="text-grey-900 text-body2 mr-2") {{ $t('EE0098') }}
      f-svg-icon(iconName="open_in_full" size="16" class="mr-2")
      f-button-label(size="sm" :disabled="!scaleDirty" @click="resetScale") {{ $t('RR0255') }}
    div(class="flex items-center justify-between")
      f-input-range(
        ref="refScale"
        v-model:range="formattedScaleValue"
        v-bind="scaleSetting"
        class="w-full mr-3.5"
      )
      div(class="w-19.5 flex-shrink-0")
        f-input-number(
          v-model:value="formattedScaleValue"
          :step="scaleInputStep"
          :min="scaleRange[0]"
          :max="scaleRange[1]"
          :unit="scaleUnit"
          @change="handleScaleChange"
        )
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
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
}
const rotateSetting = {
  step: 0.1,
  tooltips: false,
  min: -180,
  max: 180,
}
const scaleValue = ref(props.scaleStart || props.scaleRange[0])

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

const rotateDirty = computed(() => innerRotateDeg.value !== 0)
const scaleDirty = computed(() =>
  props.scaleStart
    ? scaleValue.value !== props.scaleStart
    : scaleValue.value !== scaleSetting.min
)

const handleScaleChange = (scale) => {
  if (scale > props.scaleRange[1]) {
    scale = props.scaleRange[1]
    scaleValue.value = props.scaleRange[1]
  } else if (scale < props.scaleRange[0]) {
    scale = props.scaleRange[0]
    scaleValue.value = props.scaleRange[0]
  }
  refScale.value.setValue(scale)
}

const handleRotateChange = (rotate) => {
  if (rotate > rotateSetting.max) {
    rotate = rotateSetting.max
  } else if (rotate < rotateSetting.min) {
    rotate = rotateSetting.min
  }
  innerRotateDeg.value = rotate
  refRotateDeg.value.setValue(rotate)
}

const resetRotate = () => {
  refRotateDeg.value.setValue(0)
}

const resetScale = () => {
  refScale.value.setValue(props.scaleStart || props.scaleRange[0])
}

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

<style lang="scss" scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;

  &:focus {
    outline: 0;
  }
}
</style>
