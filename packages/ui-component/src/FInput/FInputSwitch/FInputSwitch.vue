<template lang="pug">
label(class="flex items-center")
  f-svg-icon(
    v-if="inputValue"
    iconName="toggle_on"
    :size="iconSize"
    :class="[disabled ? 'text-grey-250' : 'text-primary-400', { 'cursor-pointer': !disabled }]"
  )
  f-svg-icon(
    v-else
    iconName="toggle_off"
    :size="iconSize"
    :class="[disabled ? 'text-grey-250' : 'text-grey-600', { 'cursor-pointer': !disabled }]"
  )
  input(
    type="checkbox"
    class="hidden"
    :checked="inputValue"
    @input="check"
    :disabled="disabled"
  )
  div(
    v-if="label !== ''"
    class="pl-1 text-body2 whitespace-nowrap"
    :class="[disabled ? 'text-grey-250' : 'text-grey-900 cursor-pointer']"
  ) {{ label }}
</template>

<script>
export default {
  name: 'FInputSwitch',
  props: {
    /**
     * v-model:inputValue
     */
    inputValue: {
      type: Boolean,
      required: true,
    },
    label: {
      type: [String, Number],
      default: '',
    },
    iconSize: {
      type: String,
      default: '30',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:inputValue'],
  setup(_, { emit }) {
    const check = (e) => {
      emit('update:inputValue', e.target.checked)
    }
    return {
      check,
    }
  },
}
</script>
