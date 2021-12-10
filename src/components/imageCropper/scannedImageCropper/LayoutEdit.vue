<template lang="pug">
div(class="mb-5")
  div(class="w-full flex justify-center items-center overflow-hidden")
    div(class="relative w-70 h-70 bg-black-0 flex justify-center items-center")
      slot(
        name="imageCropArea"
        :cropRectSize="176"
        :image="image"
        :rotationAngle="rotationAngle"
        :croppedScaleRatio="croppedScaleRatio"
        :scaleSize="scaleSize"
      )
  input-range(
    v-if="showScale"
    v-model:range="scaleSize"
    :min="1"
    :max="getMaxRatio"
    :height="2"
    :width="166"
    :startAtCenter="true"
    :interval="0.1"
    class="mt-4"
    direction="rtl"
  )
    template(#min-end)
      svg-icon(iconName="zoom_out" size="20" class="ml-auto")
    template(#max-end)
      svg-icon(iconName="zoom_in" size="20" class="mr-auto")
  div(class="mt-5 w-37 flex justify-between items-center m-auto")
    span(class="text-primary text-body2") {{$t("EE0049")}}
    div(class="w-20 flex justify-between items-center border border-primary rounded")
      input(type="number" class="w-full text-primary text-body2 pl-2.5" min="0" max="360" v-model.number="formattedRotateDeg" @blur="onBlur")
      div(class="bg-primary w-fit")
        div(class="cursor-pointer pt-1.5 px-1.5 pb-0.5 text-black-0" @click="plus")
          svg-icon(iconName="chevron-up" size="8")
        div(class="cursor-pointer pb-1.5 px-1.5 pt-0.5 text-black-0" @click="minus")
          svg-icon(iconName="chevron-down" size="8")
</template>

<script>
import ImageCropArea from '@/components/imageCropper/scannedImageCropper/ImageCropArea'
import { ref, reactive, computed } from 'vue'

export default {
  name: 'LayoutEdit',
  components: { ImageCropArea },
  props: {
    image: {
      type: Object
    },
    showScale: {
      type: Boolean,
      default: true
    },
    scaleSizeDoubleSide: {
      type: Number
    }
  },
  setup (props) {
    const rotationAngle = ref(0)
    const innerScale = ref(4)
    const image = reactive(props.image)
    const { width } = image
    const dpi = 300
    const cmPerPixel = 2.54 / dpi
    const width2Cm = width * cmPerPixel

    const getMaxRatio = computed(() => Math.min(10, Math.floor(width2Cm * 10) / 10))

    const scaleSize = computed({
      get: () => {
        if (props.showScale) {
          return innerScale.value
        } else {
          return props.scaleSizeDoubleSide
        }
      },
      set: (v) => {
        if (props.showScale) {
          innerScale.value = v
        }
      }
    })

    const croppedScaleRatio = computed(() => width2Cm / scaleSize.value)

    const formattedRotateDeg = computed({
      get () {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        rotationAngle.value = parseFloat(rotationAngle.value.toFixed(2))
        return rotationAngle.value
      },
      set (val) {
        if (val.toString().length === 0) {
          return
        }
        rotationAngle.value = val % 360
      }
    })

    const onBlur = () => {
      if (rotationAngle.value.toString().length === 0) {
        rotationAngle.value = 0
      }
    }

    const plus = () => {
      rotationAngle.value = rotationAngle.value + 0.1
      if (rotationAngle.value >= 360) {
        rotationAngle.value = 0
      }
      rotationAngle.value = parseFloat(rotationAngle.value.toFixed(2))
    }

    const minus = () => {
      rotationAngle.value -= 0.1
      if (rotationAngle.value <= 0) {
        rotationAngle.value = 360
      }
      rotationAngle.value = parseFloat(rotationAngle.value.toFixed(2))
    }

    return {
      croppedScaleRatio,
      rotationAngle,
      plus,
      minus,
      onBlur,
      scaleSize,
      formattedRotateDeg,
      getMaxRatio
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
