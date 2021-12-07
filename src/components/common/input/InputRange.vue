<template lang="pug">
div(class="px-1")
  div(v-if="startAtCenter" class="grid grid-cols-12 gap-1 justify-center items-center")
    div(class="col-span-2")
      slot(name="min-end" :min="min")
    vue-slider(v-model="innerRange" v-bind="optionForCentered" class="col-span-8" :disabled="disabled")
      template(#dot)
        div(class="w-3 h-3 bg-brand rounded-full")
      template(#tooltip="{ value }")
        div(class="text-black-700 text-body2 mt-1") {{ value }}
    div(class="col-span-2")
      slot(name="max-end" :max="max")
  vue-slider(v-else v-model="innerRange" v-bind="optionForNormal")
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
      type: [Number, Array]
    },
    direction: {
      type: String,
      default: 'ltr',
      validator: (v) => {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(v) !== -1
      }
    },
    startAtCenter: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:range'],
  setup (props, { emit }) {
    const fakeMaxValue = props.max + 1

    const common = {
      contained: true,
      tooltipPlacement: 'bottom',
      direction: props.direction,
      processStyle: {
        'background-color': '#21b1866e'
      },
      railStyle: {
        'background-color': '#e0e0e0'
      }
    }

    const optionForNormal = {
      ...common,
      tooltip: 'always',
      dotSize: 8,
      height: 4,
      min: props.min,
      max: fakeMaxValue
    }

    const optionForCentered = {
      ...common,
      tooltip: 'none',
      dotSize: 12,
      height: 2,
      min: props.min,
      max: props.max,
      process: false,
      hideLabel: true,
      marks: {
        0: {
          style: {
            width: '2px',
            height: '10px',
            display: 'block',
            borderRadius: '2px',
            backgroundColor: '#e0e0e0',
            transform: 'translate(0, -4px)'
          }
        }
      }
    }

    const innerRange = computed({
      get: () => {
        if (props.startAtCenter) {
          return props.range
        } else {
          const inputMin = props.range[0] === null ? props.min : props.range[0]
          const inputMax = props.range[1] === null ? fakeMaxValue : props.range[1]
          return [inputMin, inputMax]
        }
      },
      set: (v) => emit('update:range', v)
    })

    const reset = () => {
      emit('update:range', [null, null])
    }

    return {
      optionForNormal,
      optionForCentered,
      innerRange,
      fakeMaxValue,
      reset
    }
  }
}
</script>
