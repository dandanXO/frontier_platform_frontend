<template lang="pug">
div(class="mb-5")
  div(class="w-full flex justify-center items-center overflow-hidden")
    div(class="relative w-full aspect-ratio bg-black-0 flex justify-center items-center")
      slot(name="imageCropArea" :innerScaleSize="scaleSize" :innerShowScale="showScale")
  input-range(
    v-if="showScale"
    v-model:range="scaleSize"
    :min="1"
    :max="21"
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
    }
  },
  emits: ['update:rotateDeg', 'update:scaleRatio', 'update:options'],
  setup (props, { emit }) {
    /**
     * scaleSize 是以某單位為準放大(目前是公分)，用於 InputRange
     * scaleRatio 是實際放大倍率，最後要在 CroppedImage 組成 transform: scale(scaleRatio)
     */
    const scaleSize = ref(4)
    const width2Cm = computed(() => props.config.image?.width * (2.54 / props.config.dpi))
    const height2Cm = computed(() => props.config.image?.height * (2.54 / props.config.dpi))

    const mainRuler = width2Cm.value > height2Cm.value ? height2Cm.value : width2Cm.value
    emit('update:scaleRatio', mainRuler / scaleSize.value)

    const innerRotateDeg = computed({
      get () {
        return props.config.rotateDeg
      },
      set (val) {
        emit('update:rotateDeg', val)
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

    const onBlur = () => {
      if (innerRotateDeg.value.toString().length === 0) {
        innerRotateDeg.value = 0
      }
    }

    const plus = () => {
      innerRotateDeg.value = innerRotateDeg.value + 0.1
      if (innerRotateDeg.value >= 360) {
        innerRotateDeg.value = 0
      }
      innerRotateDeg.value = parseFloat(innerRotateDeg.value.toFixed(2))
    }

    const minus = () => {
      innerRotateDeg.value -= 0.1
      if (innerRotateDeg.value <= 0) {
        innerRotateDeg.value = 360
      }
      innerRotateDeg.value = parseFloat(innerRotateDeg.value.toFixed(2))
    }

    watch(
      () => scaleSize.value,
      () => {
        emit('update:scaleRatio', mainRuler / scaleSize.value)
      })

    return {
      scaleSize,
      plus,
      minus,
      onBlur,
      formattedRotateDeg
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
