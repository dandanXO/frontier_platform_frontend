<template lang="pug">
div(class="px-1")
  div(
    v-if="startAtCenter"
    class="grid gap-1 justify-center items-center"
    :class="[isVertical ? 'grid-rows-12' : 'grid-cols-12']"
  )
    div(class="m-auto" :class="[isVertical ? 'row-span-2' : 'col-span-2']")
      slot(name="min-end" :min="min")
    vue-slider(
      v-model="innerRange"
      v-bind="optionForCentered"
      class="m-auto"
      :class="[isVertical ? 'row-span-8' : 'col-span-8']"
      :disabled="disabled"
    )
      template(#dot)
        div(class="w-3 h-3 bg-brand rounded-full")
      template(#tooltip="{ value }")
        div(class="text-black-700 text-body2 mt-1") {{ value }}
    div(class="m-auto" :class="[isVertical ? 'row-span-2' : 'col-span-2']")
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
    },
    width: {
      type: [Number, String],
      default: 'auto'
    },
    height: {
      type: [Number, String],
      default: 4
    },
    interval: {
      type: Number,
      default: 1
    }
  },
  emits: ['update:range'],
  setup (props, { emit }) {
    const fakeMaxValue = props.max + 1
    const isVertical = computed(() => ['ttb', 'btt'].includes(props.direction))

    const common = {
      contained: true,
      tooltipPlacement: 'bottom',
      direction: props.direction,
      width: props.width,
      height: props.height,
      interval: props.interval,
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
      min: props.min,
      max: fakeMaxValue
    }

    const optionForCentered = {
      ...common,
      tooltip: 'none',
      dotSize: 12,
      min: props.min,
      max: props.max,
      process: false,
      hideLabel: true,
      marks: val => val === Math.floor(((props.min + props.max) / 2) * 10) / 10 ? ({
        style: {
          width: isVertical.value ? '10px' : '2px',
          height: isVertical.value ? '2px' : '10px',
          display: 'block',
          borderRadius: '2px',
          backgroundColor: '#e0e0e0',
          transform: isVertical.value ? 'translate(-4px, 0)' : 'translate(0, -4px)'
        }
      }) : false
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
      isVertical,
      reset
    }
  }
}
</script>
