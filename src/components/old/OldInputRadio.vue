<template lang="pug">
label(class="flex items-center" :for="value")
  svg-icon(v-if="inputValue === value" iconName="selected" size="24")
  div(v-else class="w-6 h-6 flex justify-center items-center")
    div(class="w-4 h-4 border border-black-400 rounded-full")
  input(type="radio"
    class="hidden"
    v-model="inputValue"
    :name="name"
    :id="value"
    :value="value"
    @input="check"
  )
  div(class="text-body2 text-primary") {{label}}
</template>

<script>
export default {
  name: 'OldInputRadio',
  props: {
    inputValue: {
      type: [String, Number],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: [String, Number]
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
