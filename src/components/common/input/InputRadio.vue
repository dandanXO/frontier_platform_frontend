<template lang="pug">
label(class="flex items-center" :for="value")
  svg-icon(v-if="inputValue === value" iconName="radio_button_checked" :size="size" :class="[checkColor]")
  svg-icon(v-else iconName="radio_button_unchecked" :size="size" :class="[uncheckColor]")
  input(type="radio"
    class="hidden"
    v-model="inputValue"
    :id="value"
    :value="value"
    @input="check"
  )
  div(v-if="name !== ''" class="pl-1 text-body2 text-primary") {{ name }}
</template>

<script>
export default {
  name: 'InputRadio',
  props: {
    inputValue: {
      type: [String, Number, Boolean],
      required: true
    },
    value: {
      type: [String, Number, Boolean],
      required: true
    },
    name: {
      type: [String, Number],
      default: ''
    },
    size: {
      type: String,
      default: '24'
    },
    checkColor: {
      type: String,
      default: 'text-brand'
    },
    uncheckColor: {
      type: String,
      default: 'text-black-400'
    }
  },
  emits: ['update:inputValue'],
  setup (props, { emit }) {
    const check = (e) => {
      let value = e.target.value
      if (typeof props.value === 'number') {
        value = Number(value)
      }
      if (typeof props.value === 'boolean') {
        value = value === 'true'
      }
      emit('update:inputValue', value)
    }
    return {
      check
    }
  }
}
</script>
