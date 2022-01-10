<template lang="pug">
vue-slider(v-model="innerRange" v-bind="options")
  template(#dot)
    div(v-if="circleDot" class="w-3 h-3 bg-brand rounded-full")
    div(v-else class='w-2 h-5 bg-brand transform -translate-y-1')
  template(#tooltip="{ value }")
    div(class='text-black-700 text-body2 mt-1')
      template(v-if='value === fakeMaxValue && nonMaxLimit') {{setting.max}}+
      template(v-else) {{ value }}
</template>

<script>
import { computed } from '@vue/runtime-core'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
// https://nightcatsama.github.io/vue-slider-component/#/

export default {
  name: 'InputRange',
  components: { VueSlider },
  props: {
    range: {
      type: [Number, Array],
      required: true
    },
    setting: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    nonMaxLimit: {
      type: Boolean,
      default: false
    },
    circleDot: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:range'],
  setup (props, { emit }) {
    const common = {
      tooltip: 'always',
      dotSize: 8,
      min: 1,
      max: 100,
      tooltipPlacement: 'bottom',
      direction: 'ltr',
      width: '100%',
      height: 4,
      interval: 1,
      processStyle: {
        'background-color': '#21b1866e'
      },
      railStyle: {
        'background-color': '#e0e0e0'
      }
    }

    const fakeMaxValue = props.setting.max + 1

    const options = computed(() => {
      return {
        ...common,
        ...props.setting,
        max: props.nonMaxLimit ? fakeMaxValue : props.setting.max
      }
    })

    const isVertical = computed(() => ['ttb', 'btt'].includes(options.value.direction))

    const innerRange = computed({
      get: () => {
        if (props.nonMaxLimit) {
          const inputMin = props.range[0] === null ? options.value.min : props.range[0]
          const inputMax = props.range[1] === null ? fakeMaxValue : props.range[1]
          return [inputMin, inputMax]
        } else {
          return props.range
        }
      },
      set: (v) => emit('update:range', v)
    })

    const reset = () => {
      emit('update:range', [null, null])
    }

    return {
      options,
      innerRange,
      fakeMaxValue,
      isVertical,
      reset
    }
  }
}
</script>
