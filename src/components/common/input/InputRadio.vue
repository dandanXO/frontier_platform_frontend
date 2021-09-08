<template lang="pug">
label(class="flex items-center" :for="value")
  svg-icon(v-if="inputValue === value" iconName="radio_button_checked" :size="size" class="text-brand")
  svg-icon(v-else iconName="radio_button_unchecked" :size="size" class="text-black-400")
  input(type="radio"
    class="hidden"
    v-model="inputValue"
    :id="value"
    :value="value"
    @input="check"
  )
  div(v-if="label !== ''" class="pl-1 text-body2 text-primary") {{label}}
</template>

<script>
export default {
  name: 'InputRadio',
  props: {
    inputValue: {
      type: [String, Number],
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: [String, Number],
      default: ''
    },
    size: {
      type: String,
      default: '24'
    }
  },
  setup (_, { emit }) {
    const check = (e) => {
      emit('update:inputValue', e.target.value)
    }
    return {
      check
    }
  }
}
</script>
