<template lang="pug">
div(class="px-1")
  vue-slider(v-model="innerRange" v-bind="options")
    template(#dot)
      div(class='w-2 h-5 bg-brand transform -translate-y-1')
    template(#tooltip="{ value }")
      div(class='text-black-700 text-body2 mt-1')
        template(v-if='value === fakeMaxValue') {{max}}+
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
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    range: {
      type: Array
    }
  },
  emits: ['update:range'],
  setup (props, { emit }) {
    const fakeMaxValue = props.max + 1

    const options = {
      dotSize: 8,
      height: 4,
      min: props.min,
      max: fakeMaxValue,
      tooltip: 'always',
      tooltipPlacement: 'bottom',
      processStyle: {
        'background-color': '#21b1866e'
      },
      railStyle: {
        'background-color': '#e0e0e0'
      }
    }

    const innerRange = computed({
      get: () => {
        const inputMin = props.range[0] === null ? props.min : props.range[0]
        const inputMax = props.range[1] === null ? fakeMaxValue : props.range[1]
        return [inputMin, inputMax]
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
      reset
    }
  }
}
</script>
