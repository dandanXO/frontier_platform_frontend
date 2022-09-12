<template lang="pug">
div
  div(class="flex justify-between pb-5")
    div(class="flex items-center gap-x-2")
      p(class="text-body2 text-primary font-bold") {{ label }}
      f-button-label(size="sm" @click="reset") {{ $t('UU0040') }}
    div
      slot(name="right")
  f-input-range(
    class="double-handles"
    ref="refInputRange"
    v-model:range="innerRange"
    v-bind="options"
  )
</template>

<script>
import { computed, ref } from '@vue/runtime-core'
export default {
  name: 'FilterRange',
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 200
    },
    range: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      default: ''
    }
  },
  emits: ['update:range'],
  setup (props, { emit }) {
    const fakeMaxValue = props.max + 1
    const refInputRange = ref(null)
    const innerRange = computed({
      get: () => {
        const inputMin = props.range[0] === null ? props.min : props.range[0]
        const inputMax = props.range[1] === null ? fakeMaxValue : props.range[1]
        return [inputMin, inputMax]
      },
      set: ([min, max]) => {
        if (props.min === Number(min) && props.max === Number(max) - 1) {
          emit('update:range', [null, null])
        } else {
          emit('update:range', [min, max])
        }
      }
    })

    const customFormatter = (v) => {
      if (v <= props.max) {
        return Number.parseFloat(v).toFixed(0)
      } else {
        // e.g. When max is 200, 201 -> 200+
        return `${props.max}+`
      }
    }

    const options = {
      tooltips: [
        {
          from: (v) => v,
          to: (v) => customFormatter(v)
        }, {
          from: (v) => v,
          to: (v) => customFormatter(v)
        }
      ],
      min: props.min,
      max: fakeMaxValue
    }

    const reset = () => {
      refInputRange.value.setValue([props.min, fakeMaxValue])
    }

    return {
      innerRange,
      refInputRange,
      reset,
      options
    }
  }
}
</script>
