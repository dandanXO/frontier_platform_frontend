<template lang="pug">
div
  div(class="w-full flex justify-center items-center overflow-hidden")
    div(class="relative w-full aspect-square flex justify-center items-center bg-[#F1F2F5]")
      slot(name="imageCropArea" :innerScaleSize="scaleValue" :innerShowScale="showScale")
  div(class="mt-2.5")
    div(class="text-primary text-body2 flex justify-between items-center mb-1")
      div {{ $t("EE0049") }}
      div(class="w-15 flex justify-center items-center")
        input(
          v-model.number="formattedRotateDeg"
          type="number"
          class="w-full text-right py-1 pr-3 border border-black-500 rounded"
          step="0.1"
          min="0"
          max="360"
          @change="handleRotateChange"
        )
        span(class="inline-block -ml-3 w-3 text-left") °
    input-range(
      ref="refRotateDeg"
      v-model:range="formattedRotateDeg"
      v-bind="rotateSetting"
    )
  div(v-if="showScale" class="mt-2.5")
    div(class="text-primary text-body2 flex justify-between items-center mb-1")
      div {{ $t("EE0098") }}
      div(class="w-15 flex justify-center items-center")
        input(
          v-model.number="formattedScaleValue"
          type="number"
          class="w-full text-right py-1 pr-6 border border-black-500 rounded"
          :step="scaleInputStep"
          :min="scaleRange[0]"
          :max="scaleRange[1]"
          @change="handleScaleChange"
        )
        span(class="inline-block -ml-6 w-5 text-left") {{ scaleUnit }}
    input-range(
      ref="refScale"
      v-model:range="formattedScaleValue"
      v-bind="scaleSetting"
    )
</template>

<script>
import { ref, computed, watch } from 'vue'
import ImageCropArea from '@/components/cropper/ImageCropArea.vue'

export default {
  name: 'CropperDefaultLayout',
  components: { ImageCropArea },
  props: {
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
  },
  emits: ['update:rotateDeg', 'update:scaleRatio', 'update:options'],
  setup (props, { emit }) {
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
      min: 0,
      max: 360
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
        innerRotateDeg.value = val % 360
      }
    })

    const handleScaleChange = (e) => {
      if (e.target.value > props.scaleRange[1]) {
        e.target.value = props.scaleRange[1]
        scaleValue.value = props.scaleRange[1]
      } else if (e.target.value < props.scaleRange[0]) {
        e.target.value = props.scaleRange[0]
        scaleValue.value = props.scaleRange[0]
      }
      refScale.value.setValue(Number(e.target.value))
    }

    const handleRotateChange = (e) => {
      const min = 0
      const max = 360
      if (e.target.value > max) {
        e.target.value = max
        innerRotateDeg.value = max
      } else if (e.target.value < min) {
        e.target.value = min
        innerRotateDeg.value = min
      }
      refRotateDeg.value.setValue(Number(e.target.value))
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

    return {
      scaleSetting,
      rotateSetting,
      scaleValue,
      formattedScaleValue,
      formattedRotateDeg,
      handleRotateChange,
      handleScaleChange,
      refScale,
      refRotateDeg
    }
  }
}
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
