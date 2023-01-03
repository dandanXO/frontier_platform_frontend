<style lang="scss">
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>

<template lang="pug">
div(class="relative")
  input(
    v-model.number="innerValue"
    type="number"
    class="w-full p-2 text-grey-900 text-body2 border border-grey-200 rounded outline-none disabled:bg-grey-100 disabled:text-grey-200 disabled:border-grey-50"
    :step="step"
    :min="min"
    :max="max"
    :disabled="disabled"
    @change="handleChange"
  )
  div(
    class="absolute top-0 left-0.5 text-body2 p-2 h-full flex items-center pointer-events-none"
    :class="[disabled ? 'text-grey-200' : 'text-grey-900']"
  )
    div(class="invisible") {{ innerValue }}
    div {{ unit }}
  div(class="absolute top-0 right-1 h-full flex items-center")
    div(class="grid grid-rows-2 h-7 gap-0.5")
      div(
        class="w-4 h-3.5 bg-grey-150 flex justify-center items-center cursor-pointer"
        style="border-radius: 3px 3px 0 0"
        @click="plus"
      )
        f-svg-icon(
          iconName="keyboard_arrow_up"
          size="14"
          :class="[disabled ? 'text-grey-200' : 'text-grey-800']"
        )
      div(
        class="w-4 h-3.5 bg-grey-150 flex justify-center items-center cursor-pointer"
        style="border-radius: 0 0 3px 3px"
        @click="minus"
      )
        f-svg-icon(
          iconName="keyboard_arrow_down"
          size="14"
          :class="[disabled ? 'text-grey-200' : 'text-grey-800']"
        )
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'FInputNumber',
  props: {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
    },
    step: {
      type: Number,
      required: true,
      default: 1,
    },
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value', 'change'],
  setup(props, { emit }) {
    const innerValue = computed({
      get: () => props.value,
      set: (v) => {
        emit('update:value', v)
      },
    })

    const plus = () => {
      emit(
        'change',
        Number(Number.parseFloat(innerValue.value + props.step).toFixed(2))
      )
    }

    const minus = () => {
      emit(
        'change',
        Number(Number.parseFloat(innerValue.value - props.step).toFixed(2))
      )
    }

    const handleChange = (e) => {
      emit('change', Number(e.target.value))
    }

    return {
      innerValue,
      plus,
      minus,
      handleChange,
    }
  },
}
</script>
