<style lang="scss">
.noUi-target {
  position: relative;
  border: none;
  box-shadow: none;
  background-color: #e9e9e9;
}

.noUi-connect {
  background-color: #21b185;
}

// handle base css
.noUi-handle {
  background-color: var(--noUi-handle-bg-color);
  border: 1px solid var(--noUi-horizontal-color);
  border-radius: 50%;
  box-shadow: 0px 0.6px 1px rgba(0, 0, 0, 0.1),
    0px 2px 4px rgba(103, 103, 103, 0.11);

  &:active {
    background-color: var(--noUi-handle-bg-active-color);
  }
}

// horizontal type
.noUi-horizontal {
  background-color: var(--noUi-horizontal-color);
  height: 4px;
  padding: 0 9px;

  .noUi-handle {
    width: 18px;
    height: 18px;
    top: -8px;
    right: -9px;
  }

  .noUi-connects {
    left: -9px;
  }
}

// vertical type
.noUi-vertical {
  width: 4px;
  padding: 9px 0;

  .noUi-handle {
    width: 18px;
    height: 18px;
    right: -7px;
    bottom: -9px;
  }

  .noUi-connects {
    bottom: -9px;
  }
}

// tooltip
.noUi-handle {
  &:hover,
  &:active {
    .noUi-tooltip {
      display: block;
    }
  }

  .noUi-tooltip {
    display: none;
    border: none;
    border-radius: 4px;
    bottom: 150% !important;
    padding: 6px 8px;
    color: #f9f9f9;
    background-color: rgb(34 34 34 / 0.8);
    font-family: 'Noto Sans TC';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
  }
}

.noUi-handle::before,
.noUi-handle::after {
  display: none;
}

.noUi-vertical .noUi-origin {
  bottom: 0;
}

// disabled status
[disabled] {
  .noUi-connect {
    background-color: #a8a8a8;
  }

  .noUi-handle {
    background-color: #e9e9e9;

    &:active {
      background-color: #e9e9e9;
    }
  }
}
</style>

<template lang="pug">
div(
  class="relative flex items-center justify-center"
  :class="[orientation === 'vertical' ? 'w-4.5' : 'h-4.5']"
  :style="cssProps"
)
  div(
    ref="refSlider"
    :class="[orientation === 'horizontal' ? 'w-full' : 'h-full']"
  )
  template(v-if="orientation === 'horizontal'")
    div(
      v-show="isDragging"
      class="absolute h-1 left-0 right-0"
      style="bottom: 1px; margin: 0 9px"
    )
      div(class="absolute w-1 h-1 bg-grey-300 rounded-full" :style="absoluteLeft")
      div(
        v-if="initPosition && initPosition.length > 1"
        class="absolute w-1 h-1 bg-grey-300 rounded-full"
        :style="absoluteRight"
      )
  template(v-else="orientation === 'vertical'")
    div(
      v-show="isDragging"
      class="absolute w-1 top-0 bottom-0"
      style="right: 1px; margin: 9px 0"
    )
      div(class="absolute w-1 h-1 bg-grey-300 rounded-full" :style="absoluteBottom")
      div(
        v-if="initPosition && initPosition.length > 1"
        class="absolute w-1 h-1 bg-grey-300 rounded-full"
        :style="absoluteTop"
      )
</template>

<script>
import { ref, computed, onMounted, toRefs } from 'vue'
import noUiSlider from 'nouislider'
import 'nouislider/dist/nouislider.css'
// https://refreshless.com/nouislider/

export default {
  name: 'FInputRange',
  props: {
    /**
     * Number -> One Way
     *
     * Array -> Two Way
     */
    theme: {
      type: String,
      default: 'light',
    },
    range: {
      type: [Number, Array],
      required: true,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 200,
    },
    step: {
      type: Number,
      default: 1,
    },
    /**
     * set `false`, `true` or `formatter` to apply to the each handle.
     * or pass an array to set individually.
     * `array[formatter or true or false, ...]`
     *
     *
     *
     *
     */
    tooltips: {
      type: [Boolean, Array],
      default: false,
    },
    orientation: {
      type: String,
      validator: (v) => ['horizontal', 'vertical'].includes(v),
      default: 'horizontal',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:range'],
  setup(props, { emit }) {
    const refSlider = ref(null)
    const { min, max, range } = toRefs(props)
    const initPosition = ref(null)
    const isDragging = ref(false)

    const setValue = (v) => {
      refSlider.value.noUiSlider.set(v)
    }

    const absoluteLeft = computed(() => {
      if (Array.isArray(initPosition.value)) {
        return { left: `calc(${initPosition.value[0]}% - 2px)` }
      } else {
        return { left: '-2px' }
      }
    })

    const absoluteRight = computed(() => {
      if (Array.isArray(initPosition.value)) {
        return { right: `calc(${initPosition.value[0]}% - 2px)` }
      } else {
        return { right: '-2px' }
      }
    })

    const absoluteTop = computed(() => {
      if (Array.isArray(initPosition.value)) {
        return { top: `calc(${initPosition.value[0]}% - 2px)` }
      } else {
        return { top: '-2px' }
      }
    })

    const absoluteBottom = computed(() => {
      if (Array.isArray(initPosition.value)) {
        return { bottom: `calc(${initPosition.value[0]}% - 2px)` }
      } else {
        return { bottom: '-2px' }
      }
    })

    onMounted(() => {
      noUiSlider.create(refSlider.value, {
        connect: typeof range.value === 'number' ? 'lower' : true,
        tooltips: props.tooltips,
        step: props.step,
        orientation: props.orientation,
        direction: props.orientation === 'vertical' ? 'rtl' : 'ltr',
        start: range.value,
        range: {
          min: min.value,
          max: max.value,
        },
      })

      if (props.disabled) {
        refSlider.value.setAttribute('disabled', true)

        // two handles
        const origins = refSlider.value.querySelectorAll('.noUi-origin')
        origins[0].setAttribute('disabled', true)
      }

      refSlider.value.noUiSlider.on('start', () => {
        isDragging.value = true
      })

      refSlider.value.noUiSlider.on(
        'update',
        (v, handle, unencoded, tap, positions, noUiSlider) => {
          let values = refSlider.value.noUiSlider.get()

          if (initPosition.value === null) {
            initPosition.value = positions
          }

          if (Array.isArray(values)) {
            values = values.map((v) => Number(v))
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
        }
      )

      refSlider.value.noUiSlider.on('end', () => {
        isDragging.value = false
      })
    })

    return {
      refSlider,
      setValue,
      absoluteLeft,
      absoluteRight,
      absoluteTop,
      absoluteBottom,
      isDragging,
      initPosition,
    }
  },
  computed: {
    cssProps() {
      if (this.theme === 'light') {
        return {
          '--noUi-handle-bg-color': '#ffffff',
          '--noUi-handle-bg-active-color': '#f4f4f4',
          '--noUi-horizontal-color': 'e9e9e9',
        }
      } else {
        return {
          '--noUi-handle-bg-color': '#262626',
          '--noUi-handle-bg-active-color': '#3C3C3C',
          '--noUi-horizontal-color': '#676767',
        }
      }
    },
  },
}
</script>
