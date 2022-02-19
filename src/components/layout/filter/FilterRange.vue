<template lang="pug">
div
  div(class="flex justify-between pb-5")
    div(class="flex items-center gap-x-2")
      p(class="text-body2 text-primary font-bold") {{label}}
      btn-functional(size="sm" @click="reset") {{$t('UU0040')}}
    div
      slot(name="right")
  input-range(
    class="double-handles"
    ref="inputRange"
    v-model:start="innerRange"
    :options="options"
    :nonMaxLimit="true"
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
    const inputRange = ref(null)
    const innerRange = computed({
      get: () => props.range,
      set: (v) => {
        if (props.min === v[0] && props.max === v[1] - 1) {
          emit('update:range', [null, null])
        } else {
          emit('update:range', v)
        }
      }
    })

    const options = {
      start: innerRange.value,
      range: {
        min: props.min,
        max: props.max,
      }
    }

    const reset = () => {
      inputRange.value.reset()
    }

    return {
      innerRange,
      inputRange,
      reset,
      options
    }
  }
}
</script>
