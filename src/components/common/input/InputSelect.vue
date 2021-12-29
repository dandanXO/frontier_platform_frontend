<template lang="pug">
input-container(:required="required")
  dropdown(
    v-model:value="innerSelectValue"
    :options="options"
    :keyOptionValue="keyOptionValue"
    :class="[{ 'pointer-events-none': disabled }]"
    @expand="$emit('expand'), searchInput = ''"
    @collapse="$emit('collapse')"
  )
    template(#displayItem="{ isExpand, currentIndex, option }")
      div(
        class="px-4 border rounded flex items-center"
        :class="[isExpand ? 'border-primary' : 'border-black-400', size === 'lg' ? 'h-11' : 'h-9'], { 'bg-black-200': disabled, }"
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
        div(v-if="searchBox" class="pt-1.5 pb-1")
          input-text(v-model:textValue="searchInput" size="sm" prependIcon="search" class="px-3.5")
          div(class="mx-2 border-b border-black-400 pt-2")
        overlay-scrollbar-container(v-if="searchedOptions.length > 0" :class="[classMaxHeight]")
          list-item(
            v-for="(option, index) in searchedOptions"
            :class="[ index === currentIndex ? 'bg-black-200' : '']"
            @click="select($event, option), $emit('select', option[keyOptionValue])"
          )
            p(class="text-black-600") {{option[keyOptionDisplay]}}
        div(v-if="canAddNewOption && !isOptionExist")
          list-item(v-if="searchInput !== ''" @click="addNewOption") {{searchInput}}
        p(v-if="!canAddNewOption && searchedOptions.length === 0" class="h-9 pl-7.5 text-primary text-body2 flex items-center") No search result
</template>

<script>
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import { nextTick } from 'vue'

export default {
  name: 'InputSelect',
  props: {
    selectValue: {
      required: true,
      validator: () => true
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
    required: {
      type: Boolean,
      default: false
    },
    canAddNewOption: {
      type: Boolean,
      default: false
    }
  },
  emits: ['expand', 'collapse', 'select', 'update:selectValue', 'addNewOption'],
  setup (props, { emit }) {
    const classMaxHeight = ref(`max-h-${9 * props.maxLength}`) // 9: each option height
    const searchInput = ref('')
    const searchedOptions = computed(() => props.options.filter(option => option[props.keyOptionDisplay].toLocaleLowerCase().includes(searchInput.value.toLocaleLowerCase())))

    const innerSelectValue = computed({
      get: () => props.selectValue,
      set: (v) => emit('update:selectValue', v)
    })

    const isOptionExist = computed(() => props.options.some(option => option[props.keyOptionDisplay] === searchInput.value))

    const addNewOption = async () => {
      // create new option first, then after component update selecting the option
      emit('addNewOption', searchInput.value)
      await nextTick()
      emit('select', props.options[props.options.length - 1][props.keyOptionValue])
    }

    return {
      classMaxHeight,
      innerSelectValue,
      searchInput,
      searchedOptions,
      isOptionExist,
      addNewOption
    }
  }
}
</script>
