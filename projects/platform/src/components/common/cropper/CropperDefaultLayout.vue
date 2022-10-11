<template lang="pug">
div
  div(class="w-full flex justify-center items-center overflow-hidden")
    div(class="relative w-full aspect-square flex justify-center items-center bg-[#F1F2F5]")
      slot(name="imageCropArea" :innerScaleSize="scaleValue" :innerShowScale="showScale")
  div(class="mt-2.5")
    div(class="text-grey-900 text-body2 flex justify-between items-center mb-1")
      div {{ $t("EE0049") }}
      div(class="w-15 flex justify-center items-center")
        input(
          v-model.number="formattedRotateDeg"
          type="number"
          class="w-full text-right py-1 pr-3 border border-grey-200 rounded"
          :step="rotateSetting.step"
          :min="rotateSetting.min"
          :max="rotateSetting.max"
          @change="handleRotateChange"
        )
        span(class="inline-block -ml-3 w-3 text-left") °
    f-input-range(
      ref="refRotateDeg"
      v-model:range="formattedRotateDeg"
      v-bind="rotateSetting"
    )
  div(v-if="showScale" class="mt-2.5")
    div(class="text-grey-900 text-body2 flex justify-between items-center mb-1")
      div {{ $t("EE0098") }}
      div(class="w-15 flex justify-center items-center")
        input(
          v-model.number="formattedScaleValue"
          type="number"
          class="w-full text-right py-1 pr-6 border border-grey-200 rounded"
          :step="scaleInputStep"
          :min="scaleRange[0]"
          :max="scaleRange[1]"
          @change="handleScaleChange"
        )
        span(class="inline-block -ml-6 w-5 text-left") {{ scaleUnit }}
    f-input-range(
      ref="refScale"
      v-model:range="formattedScaleValue"
      v-bind="scaleSetting"
    )
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  showScale: {
    type: Boolean,
    default: true
  },
  scaleUnit: {
    type: String,
    default: '%'
  },
  scaleInputStep: {
    type: Number,
    default: 1
  },
  scaleRange: {
    type: Array,
    default: () => {
      return [100, 800]
    }
  },
  scaleStart: {
    type: Number
  }
})

const emit = defineEmits(['update:rotateDeg', 'update:scaleRatio', 'update:options'])

const refScale = ref(null)
const refRotateDeg = ref(null)
const scaleSetting = {
  step: props.scaleInputStep,
  tooltips: false,
  min: props.scaleRange[0],
  max: props.scaleRange[1]
}
const rotateSetting = {
  step: 0.1,
  tooltips: false,
  min: -180,
  max: 180
}
const scaleValue = ref(props.scaleStart || props.scaleRange[0])

const innerRotateDeg = computed({
  get: () => props.config.rotateDeg,
  set: (val) => emit('update:rotateDeg', val)
})

const formattedScaleValue = computed({
  get: () => scaleValue.value,
  set: (val) => {
    if (val > props.scaleRange[1] || val < props.scaleRange[0]) return
    scaleValue.value = val
  }
})

const formattedRotateDeg = computed({
  get: () => parseFloat(innerRotateDeg.value.toFixed(2)),
  set: (val) => {
    if (val.length === 0) return
    innerRotateDeg.value = val
  }
})

const handleScaleChange = (e) => {
  let scale = Number(e.target.value)
  if (scale > props.scaleRange[1]) {
    scale = props.scaleRange[1]
    scaleValue.value = props.scaleRange[1]
  } else if (scale < props.scaleRange[0]) {
    scale = props.scaleRange[0]
    scaleValue.value = props.scaleRange[0]
  }
  refScale.value.setValue(scale)
}

const handleRotateChange = (e) => {
  let rotate = Number(e.target.value)
  if (rotate > rotateSetting.max) {
    rotate = rotateSetting.max
  } else if (rotate < rotateSetting.min) {
    rotate = rotateSetting.min
  }
  innerRotateDeg.value = rotate
  refRotateDeg.value.setValue(rotate)
}

watch(
  () => scaleValue.value,
  () => {
    emit('update:scaleRatio', scaleValue.value)
  },
  {
    immediate: true
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
input[type="number"] {
  -moz-appearance: textfield;

  &:focus {
    outline: 0;
  }
}
</style>
