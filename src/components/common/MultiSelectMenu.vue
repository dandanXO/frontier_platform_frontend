<template lang="pug">
div(class="fixed z-100 bottom-20.5 inset-x-0 ml-60")
  div(v-if="innerSelectedList.length > 0" class="m-auto w-fit px-15 py-7.5 bg-black-0 rounded-full menu-shadow text-body2 text-primary flex justify-center items-center")
    svg-icon(iconName="cancel" size="24" class="text-black-400 mr-4 cursor-pointer" @click="clearList")
    i18n-t(keypath="RR0073" tag="div" class="mr-7.5")
      template(#number) {{innerSelectedList.length}}
    div(class="flex flex-wrap gap-y-5 divide-x w-fit max-w-127")
      template(v-for="option in options")
        slot(:option="option")
          div(
            class="whitespace-nowrap px-5"
            :class="[option.disabled ? 'text-black-500': 'cursor-pointer hover:text-brand']"
            @click="handleClick(option)"
          ) {{option.name}}
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'MultiSelectMenu',
  props: {
    options: {
      type: Array,
      required: true
    },
    selectedList: {
      type: Array,
      required: true
    }
  },
  emits: ['update:selectedList'],
  setup (props, { emit }) {
    const innerSelectedList = computed({
      get: () => props.selectedList,
      set: (v) => emit('update:selectedList', v)
    })

    const clearList = () => emit('update:selectedList', [])
    const handleClick = (option) => option.func && !option.disabled && option.func(innerSelectedList.value)

    return {
      innerSelectedList,
      clearList,
      handleClick
    }
  }
}
</script>
