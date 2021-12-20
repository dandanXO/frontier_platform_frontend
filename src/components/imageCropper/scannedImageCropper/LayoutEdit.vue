<template lang="pug">
div(v-if="innerImage !== null" class="mb-5")
  div(class="w-full flex justify-center items-center overflow-hidden")
    div(class="relative w-full aspect-ratio bg-black-0 flex justify-center items-center")
      slot(
        name="imageCropArea"
        :cropRectSize="cropRectSize"
        :image="innerImage"
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
import { ref, onMounted, computed } from 'vue'

export default {
  name: 'LayoutEdit',
  components: { ImageCropArea },
  props: {
    image: {
      type: String
    },
    showScale: {
      type: Boolean,
      default: true
    },
    scaleSizeDoubleSide: {
      type: Number
    },
    cropRectSize: {
      type: Number,
      default: 176
    }
  },
  setup (props) {
    const rotationAngle = ref(0)
    const innerScale = ref(4)
    const innerImage = ref(null)

    const width2Cm = computed(() => innerImage.value?.width * (2.54 / 300))
    const getMaxRatio = computed(() => Math.min(10, Math.floor(width2Cm.value * 10) / 10))

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

    const croppedScaleRatio = computed(() => width2Cm.value / scaleSize.value)

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

    const getImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          const { width, height, src } = img
          resolve({ width, height, src })
        }

        img.src = url
      })
    }

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

    onMounted(async () => {
      innerImage.value = await getImage(props.image)
    })

    return {
      croppedScaleRatio,
      rotationAngle,
      plus,
      minus,
      onBlur,
      scaleSize,
      formattedRotateDeg,
      getMaxRatio,
      innerImage
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
