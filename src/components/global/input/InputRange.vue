<style lang="scss">
.noUi-target {
  position: relative;
  height: 2px;
  border: none;
  box-shadow: none;
  background-color: #e0e0e0;

  &.noUi-horizontal {
    margin: 9px 0;
  }
}

.noUi-connect {
  background-color: #21b1866e;
}

.noUi-vertical {
  height: 240px;
  width: 2px;
}

.noUi-handle,
.noUi-vertical .noUi-handle,
.noUi-horizontal .noUi-handle {
  border: none;
  background-color: #21b185;
  box-shadow: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  right: -5px;
  top: -5px;
}

.noUi-handle::before,
.noUi-handle::after {
  display: none;
}

.noUi-tooltip {
  border: none;
  border-radius: 0;
  bottom: -25px !important;
  padding: 0;
  color: #757575;
  font-weight: bold;
  font-size: 14px;
  background: none;
}

.noUi-vertical .noUi-origin {
  top: 0;
}

// double-handles need to add manually outside, e.g. component: FilterRange
.double-handles {
  &.noUi-target {
    height: 4px;
  }

  .noUi-handle {
    border-radius: 0;
    width: 8px;
    height: 20px;
    right: -4px;
    top: -8px;
  }
}
</style>

<template lang="pug">
div(ref="refSlider")
</template>

<script>
import { ref, onMounted, toRefs } from '@vue/runtime-core'
import noUiSlider from 'nouislider'
import 'nouislider/dist/nouislider.css'
// https://refreshless.com/nouislider/

export default {
  name: 'InputRange',
  props: {
    range: {
      type: [Number, Array],
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 200
    },
    step: {
      type: Number,
      default: 1
    },
    tooltips: {
      type: [Boolean, Array],
      default: false
    },
    orientation: {
      type: String,
      validator: (v) => ['horizontal', 'vertical'].includes(v)
    }
  },
  emits: ['update:range'],
  setup (props, { emit }) {
    const refSlider = ref(null)
    const { min, max, range } = toRefs(props)

    const setValue = (v) => {
      refSlider.value.noUiSlider.set(v)
    }

    onMounted(() => {
      noUiSlider.create(refSlider.value, {
        connect: true,
        format: {
          from: (v) => v,
          to: (v) => Number.parseFloat(v).toFixed(0) // By default, noUiSlider will format output with 2 decimals.
        },
        tooltips: props.tooltips,
        step: props.step,
        orientation: props.orientation,
        start: range.value,
        range: {
          min: min.value,
          max: max.value
        }
      })

      refSlider.value.noUiSlider.on('update', () => {
        let values = refSlider.value.noUiSlider.get()

        if (Array.isArray(values)) {
          values = values.map(v => Number(v))
        } else {
          values = Number(values)
        }

        if (props.step === 1) {
          emit('update:range', values)
        } else {
          // Use .get(true) to get the slider values without formatting applied
          const valuesWithoutFormat = refSlider.value.noUiSlider.get(true)
          emit('update:range', valuesWithoutFormat)
        }
      })
    })

    return {
      refSlider,
      setValue
    }
  }
}
</script>
