<template lang="pug">
div
  div(class="w-full flex justify-center items-center overflow-hidden")
    div(class="relative w-full aspect-ratio flex justify-center items-center" style="background-color: #F1F2F5")
      slot(name="imageCropArea" :innerScaleSize="scaleSize" :innerShowScale="showScale")
  div(v-if="showScale" class="mt-2.5")
    div(class="text-primary text-body2 flex justify-between items-center mb-1")
      div {{$t('EE0098')}}
      div(class="w-15 flex justify-center items-center")
        input(
          v-model.number="formattedScaleValue"
          type="number"
          class="w-full text-right py-1 pr-6 border border-black-500 rounded"
          :step="useCentimeter ? 0.1 : 1"
          :min="scaleRange[0]"
          :max="scaleRange[1]"
          @change="handleScaleChange"
        )
        span(class="inline-block -ml-6 w-5 text-left") {{scaleUnit}}
    input-range(
      v-model:range="formattedScaleValue"
      :setting="scaleSetting"
      :circleDot="true"
    )
  div(class="mt-2.5")
    div(class="text-primary text-body2 flex justify-between items-center mb-1")
      div {{$t("EE0049")}}
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
      v-model:range="formattedRotateDeg"
      :setting="rotateSetting"
      :circleDot="true"
    )
</template>

<script>
import { ref, computed, watch } from 'vue'
import ImageCropArea from '@/components/cropper/ImageCropArea'

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
    scaleRange: {
      type: Array,
      default: () => {
        return [100, 800]
      }
    }
  },
  emits: ['update:rotateDeg', 'update:scaleRatio', 'update:options'],
  setup (props, { emit }) {
    const useCentimeter = props.scaleUnit === 'cm'
    const commonSetting = {
      height: 2,
      interval: useCentimeter ? 0.1 : 1,
      tooltip: 'none',
      dotSize: 12,
      process: false,
      hideLabel: true
    }

    const scaleSetting = {
      ...commonSetting,
      min: props.scaleRange[0],
      max: props.scaleRange[1]
    }

    const rotateSetting = {
      ...commonSetting,
      min: 0,
      max: 360
    }

    /**
     * scaleValue 是用於畫面表現的值
     * scaleSize 是以某單位為準放大，用於 InputRange，目前有公分跟百分比
     * scaleRatio 是實際放大倍率，最後要在 CroppedImage 組成 transform: scale(scaleRatio)
     */
    const scaleValue = ref(props.scaleRange[0])
    const scaleSize = computed(() => useCentimeter ? scaleValue.value : scaleValue.value / 100)

    /**
     * [width2Cm, height2Cm, mainRuler] only use when 'dpi' isn't undefined, useCentimeter is true.
     */
    const width2Cm = computed(() => props.config.image?.width * (2.54 / props.config.dpi))
    const height2Cm = computed(() => props.config.image?.height * (2.54 / props.config.dpi))
    const mainRuler = width2Cm.value > height2Cm.value ? height2Cm.value : width2Cm.value

    emit('update:scaleRatio', useCentimeter ? (mainRuler / scaleSize.value) : scaleSize.value)

    const innerRotateDeg = computed({
      get () {
        return props.config.rotateDeg
      },
      set (val) {
        emit('update:rotateDeg', val)
      }
    })

    const formattedScaleValue = computed({
      get () {
        return scaleValue.value
      },
      set (val) {
        if (val > props.scaleRange[1] || val < props.scaleRange[0]) {
          return
        }
        scaleValue.value = val
      }
    })

    const formattedRotateDeg = computed({
      get () {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        innerRotateDeg.value = parseFloat(innerRotateDeg.value.toFixed(2))
        return innerRotateDeg.value
      },
      set (val) {
        if (val.toString().length === 0) {
          return
        }
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
    }

    if (useCentimeter) {
      scaleValue.value = 4
      emit('update:scaleRatio', width2Cm.value / scaleSize.value)
    } else {
      emit('update:scaleRatio', scaleSize.value)
    }

    watch(
      () => scaleSize.value,
      () => {
        emit('update:scaleRatio', useCentimeter ? (mainRuler / scaleSize.value) : scaleSize.value)
      })

    return {
      useCentimeter,
      scaleSetting,
      rotateSetting,
      scaleSize,
      formattedScaleValue,
      formattedRotateDeg,
      handleRotateChange,
      handleScaleChange
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
