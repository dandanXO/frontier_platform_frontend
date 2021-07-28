<template lang="pug">
dropdown(
  v-model:value="inputValue"
  :options="options"
  :keyOptionValue="keyOptionValue"
  @expand="$emit('expand')"
  @collapse="$emit('collapse')"
)
  template(#displayItem="{ isExpand, currentIndex, option }")
    div(
      class="h-11 pl-4 pr-3"
      :class="[ isExpand ? 'border-primary-middle border-t border-l border-r rounded-t' : 'border-black-400 border rounded']"
    )
      div(
        class="h-full flex items-center"
        :class="[ isExpand ? 'border-b' : '']"
      )
        span(
          class="flex-grow"
          :class="[ currentIndex === -1 ? 'text-black-400 text-body2' : 'text-primary text-body1']"
        ) {{currentIndex === -1 ? placeholder: option[keyOptionDisplay]}}
        svg-icon(
          iconName="arrow-down"
          :color=" isExpand ? 'black-500' : 'black-650'"
          class="transform"
          :class="[ isExpand ? '-rotate-90' :'rotate-90']"
        )
  template(#dropdownList="{ select, currentIndex }")
    div(
      class="absolute top-full w-full overflow-y-auto pt-1.5 pb-3.5 px-2 bg-black-0 border-l border-r border-b rounded-b border-primary-middle"
      :class="[classMaxHeight]"
    )
      div(
        v-for="(option, index) in options"
        class="h-8.5 pl-2 flex items-center"
        :class="[ index === currentIndex ? 'bg-black-200 rounded' : '']"
        @click="select($event, option)"
      )
        span(class="text-body2 text-black-600") {{option[keyOptionDisplay]}}
</template>

<script>
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
export default {
  name: 'InputSelect',
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    keyOptionDisplay: {
      type: String,
      required: true
    },
    keyOptionValue: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 6
    }
  },
  setup (props, { emit }) {
    /**
     * 8.5: each option height
     * 5: padding top(1.5) + padding bottom(3.5)
     * 1: padding bottom(3.5) - option gap(2.5)
     */
    const classMaxHeight = ref(`max-h-${8.5 * props.maxLength - 1 + 5}`)

    const inputValue = computed({
      get: () => props.value,
      set: (v) => emit('update:value', v)
    })

    return {
      classMaxHeight,
      inputValue
    }
  }
}
</script>
