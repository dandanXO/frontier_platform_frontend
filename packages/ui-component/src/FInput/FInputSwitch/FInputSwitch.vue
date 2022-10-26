<template lang="pug">
label(class="flex items-center")
  f-svg-icon(
    v-if="inputValue"
    iconName="toggle_on"
    :size="iconSize"
    class="text-primary-400"
  )
  f-svg-icon(v-else iconName="toggle_off" :size="iconSize" class="text-grey-600")
  input(type="checkbox" class="hidden" :checked="inputValue" @input="check")
  div(v-if="label !== ''" class="pl-1 text-body2 text-grey-900") {{ label }}
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
