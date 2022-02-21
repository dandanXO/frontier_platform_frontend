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
div(ref="slider" )
</template>

<script>
import { ref, computed, onMounted } from '@vue/runtime-core'
import noUiSlider from 'nouislider'
import 'nouislider/dist/nouislider.css'
// https://refreshless.com/nouislider/

export default {
  name: 'InputRange',
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          start: [0, 100],
          connect: true,
          range: {
            min: 0,
            max: 100,
          },
          tooltips: true,
          step: 1,
          format: {
            from: (value) => value,
            to: (value) => Number.parseFloat(value).toFixed(0)
          },
          orientation: 'horizontal'
        }
      }
    },
    nonMaxLimit: {
      type: Boolean,
      default: false
    },
    oneHandle: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:start'],
  setup (props, { emit }) {
    const slider = ref(null)
    const common = {
      connect: true,
      tooltips: [
        {
          from: (v) => v,
          to: (v) => customFormatter(v)
        }, {
          from: (v) => v,
          to: (v) => customFormatter(v)
        }
      ],
      step: 1,
      format: {
        from: (v) => v,
        to: (v) => Number.parseFloat(v).toFixed(0) // By default, noUiSlider will format output with 2 decimals.
      }
    }

    const customFormatter = (v) => {
      if (v <= props.options.range.max) {
        return Number.parseFloat(v).toFixed(0)
      } else {
        // e.g. When max is 200, 201 -> 200+
        return `${props.options.range.max}+`
      }
    }

    // In order to show 'plus' marks when nonMaxLimit is true.
    const fakeMaxValue = props.options.range.max + 1
    const innerStart = computed(() => {
      if (props.nonMaxLimit) {
        const inputMin = props.options.start[0] === null ? props.options.range.min : props.options.start[0]
        const inputMax = props.options.start[1] === null ? fakeMaxValue : props.options.start[1]
        return [inputMin, inputMax]
      } else {
        return props.options.start
      }
    })

    const reset = () => {
      emit('update:start', [null, null])
    }

    onMounted(() => {
      noUiSlider.create(slider.value, {
        ...common,
        ...props.options,
        start: innerStart.value,
        range: {
          min: props.options.range.min,
          max: props.nonMaxLimit ? fakeMaxValue : props.options.range.max
        }
      })

      slider.value.noUiSlider.on('update', (v) => {
        emit('update:start', v)
      })
    })

    return {
      reset,
      slider
    }
  }
}
</script>
