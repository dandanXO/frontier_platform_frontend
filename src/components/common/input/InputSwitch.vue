<template lang="pug">
label(class="flex items-center")
  svg-icon(v-if="inputValue" iconName="toggle_on" :size="size" class="text-brand")
  svg-icon(v-else iconName="toggle_off" :size="size" class="text-black-700")
  input(
    type="checkbox"
    class="hidden"
    :checked="inputValue"
    @input="check"
  )
  div(v-if="name !== ''" class="pl-1 text-body2 text-primary") {{ name }}
</template>

<script>
export default {
  name: 'InputSwitch',
  props: {
    inputValue: {
      type: Boolean,
      required: true
    },
    name: {
      type: [String, Number],
      default: ''
    },
    size: {
      type: String,
      default: '30'
    }
  },
  emits: ['update:inputValue'],
  setup (_, { emit }) {
    const check = (e) => {
      emit('update:inputValue', e.target.checked)
    }
    return {
      check
    }
  }
}
</script>
