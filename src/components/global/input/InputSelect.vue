<template lang="pug">
input-container(:required="required" ref="refContainer")
  popper(
    placement="bottom-start"
    @expand="expand"
    @collapse="collapse"
    :class="[{ 'pointer-events-none': disabled }]"
  )
    template(#trigger="{ isExpand }")
      div(
        class="px-4 border rounded flex items-center"
        :class="[isExpand ? 'border-primary' : 'border-black-400', size === 'lg' ? 'h-11' : 'h-9'], { 'bg-black-200': disabled }"
      )
        div(v-if="prependIcon !== ''" class="pr-1")
          slot(name="prependIcon")
        p(
          class="flex-grow text-body2"
          :class="[{ 'text-black-600': disabled }, { 'text-primary': !disabled && currentIndex !== -1 }, { 'text-black-400': !disabled && currentIndex === -1 }]"
        ) {{ currentIndex === -1 ? placeholder : options[currentIndex][keyOptionDisplay] }}
        div(v-if="appendIcon !== ''" class="pl-1")
          slot(name="appendIcon")
            svg-icon(
              iconName="arrow-down"
              size="20"
              class="transform"
              :class="[isExpand ? '-rotate-90 text-black-500' : 'rotate-90 text-black-650']"
            )
    template(#content="{ collapsePopper }")
      list(class="border border-primary-middle" :style="{ width: contentWidth + 'px' }")
        div(v-if="searchBox" class="pt-1.5 pb-1")
          input-text(v-model:textValue="searchInput" size="sm" prependIcon="search" class="px-3.5")
          div(class="mx-2 border-b border-black-400 pt-2")
        overlay-scrollbar-container(v-if="searchedOptionList.length > 0" :style="{ 'max-height': 36 * maxLength + 'px' }")
          list-item(
            v-for="(option, index) in searchedOptionList"
            :class="[index === currentIndex ? 'bg-black-200' : '']"
            @click="select(option); collapsePopper()"
          )
            p(class="text-black-600") {{ option[keyOptionDisplay] }}
        div(v-if="canAddNewOption && !isOptionExist")
          list-item(v-if="searchInput !== ''" @click="addNewOption") {{ searchInput }}
        p(v-if="!canAddNewOption && searchedOptionList.length === 0" class="h-9 pl-7.5 text-primary text-body2 flex items-center") No search result
</template>

<script>
export default {
  name: 'InputSelect'
}
</script>

<script setup>
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import { nextTick } from 'vue'

const emit = defineEmits(['expand', 'collapse', 'select', 'update:selectValue', 'addNewOption'])
const props = defineProps({
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
})

const refContainer = ref(null)
const contentWidth = ref(340)
const searchInput = ref('')

const expand = () => {
  contentWidth.value = refContainer.value.$el.getBoundingClientRect().width
  emit('expand')
}

const collapse = () => {
  searchInput.value = ''
  emit('collapse')
}

const select = (option) => {
  innerSelectValue.value = option[props.keyOptionValue]
  emit('select', option[props.keyOptionValue])
}

const innerSelectValue = computed({
  get: () => props.selectValue,
  set: (v) => emit('update:selectValue', v)
})

const currentIndex = computed(() => {
  return innerSelectValue.value !== undefined
    ? props.options.findIndex(option => option[props.keyOptionValue] === innerSelectValue.value)
    : -1
})

const searchedOptionList = computed(() => props.options.filter(option => option[props.keyOptionDisplay].toLocaleLowerCase().includes(searchInput.value.toLocaleLowerCase())))

const isOptionExist = computed(() => props.options.some(option => option[props.keyOptionDisplay] === searchInput.value))

const addNewOption = async () => {
  // create new option first, then after component update selecting the option
  emit('addNewOption', searchInput.value)
  await nextTick()
  emit('select', props.options[props.options.length - 1][props.keyOptionValue])
}
</script>
