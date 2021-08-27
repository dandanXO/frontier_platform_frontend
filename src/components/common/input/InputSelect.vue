<template lang="pug">
div
  slot(name="label")
    div(v-if="label !== ''" class="flex pb-2 text-body2 font-bold")
      i(v-if="required" class="text-warn") *
      p(class="text-primary") {{label}}
  dropdown(
    v-model:value="inputValue"
    :options="options"
    :keyOptionValue="keyOptionValue"
    :class="[{ 'pointer-events-none': disabled }]"
    @expand="$emit('expand'), searchInput = ''"
    @collapse="$emit('collapse')"
  )
    template(#displayItem="{ isExpand, currentIndex, option }")
      div(
        class="px-4 border-black-400 border rounded flex items-center"
        :class="[size === 'lg' ? 'h-11' : 'h-9'], { 'bg-primary-thin': disabled }"
      )
        div(v-if="prependIcon !== ''" class="pr-1")
          slot(name="prependIcon")
        p(
          class="flex-grow text-body2"
          :class="[{ 'text-black-600': disabled }, { 'text-primary': !disabled && currentIndex !== -1 }, { 'text-black-400': !disabled && currentIndex === -1 }]"
        ) {{currentIndex === -1 ? placeholder: option[keyOptionDisplay]}}
        div(v-if="appendIcon !== ''" class="pl-1")
          slot(name="appendIcon")
            svg-icon(
              iconName="arrow-down"
              size="20"
              class="transform"
              :class="[ isExpand ? '-rotate-90 text-black-500' :'rotate-90 text-black-650']"
            )
    template(#dropdownList="{ select, currentIndex }")
      div(class="absolute top-full w-full transform translate-y-2 py-2 bg-black-0 border rounded border-primary-middle card-shadow")
        div(v-if="searchBox" class="pt-1.5 pb-1" @click.stop)
          input-text(v-model:value="searchInput" size="sm" prependIcon="search" class="px-3.5")
          div(class="mx-2 border-b border-black-400 pt-2")
        overlay-scrollbar-container(v-if="searchedOptions.length > 0" :class="[classMaxHeight]")
          div(
            v-for="(option, index) in searchedOptions"
            class="h-9 pl-3 flex items-center"
            :class="[ index === currentIndex ? 'bg-black-200 rounded' : '']"
            @click="select($event, option), $emit('select', option[keyOptionValue])"
          )
            p(class="text-body2 text-black-600") {{option[keyOptionDisplay]}}
        p(v-else class="h-9 pl-7.5 text-primary text-body2 flex items-center") No search result
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
    size: {
      type: String,
      default: 'lg'
    },
    searchBox: {
      type: Boolean,
      default: false
    },
    prependIcon: {
      type: String,
      default: ''
    },
    appendIcon: {
      type: String,
      default: 'arrow-down'
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
      default: 8
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const classMaxHeight = ref(`max-h-${9 * props.maxLength}`) // 9: each option height
    const searchInput = ref('')
    const searchedOptions = computed(() => props.options.filter(option => option[props.keyOptionDisplay].includes(searchInput.value)))

    const inputValue = computed({
      get: () => props.value,
      set: (v) => emit('update:value', v)
    })

    return {
      classMaxHeight,
      inputValue,
      searchInput,
      searchedOptions
    }
  }
}
</script>
