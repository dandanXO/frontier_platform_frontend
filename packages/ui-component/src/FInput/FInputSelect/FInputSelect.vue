<template lang="pug">
f-input-container(:required="required" :label="label" ref="refContainer")
  f-popper(
    placement="bottom-start"
    @expand="expand"
    @collapse="collapse"
    :class="[{ 'pointer-events-none': disabled }]"
    data-cy="input-select"
  )
    template(#trigger="{ isExpand }")
      div(
        class="px-4 border rounded flex items-center"
        :class="[isExpand ? 'border-grey-900' : 'border-grey-200', size === 'lg' ? 'h-11' : 'h-9'], { 'bg-grey-100': disabled }"
      )
        div(v-if="prependIcon || slots['slot:prependIcon']" class="pr-1")
          f-svg-icon(
            v-if="prependIcon"
            size="20"
            :iconName="prependIcon"
          )
          slot(v-else name="slot:prependIcon")
        p(
          class="flex-grow text-body2"
          :class="[{ 'text-grey-600': disabled }, { 'text-grey-900': !disabled && currentIndex !== -1 }, { 'text-grey-200': !disabled && currentIndex === -1 }]"
        ) {{ currentIndex === -1 ? placeholder : optionList[currentIndex][keyOptionDisplay] }}
        div(class="pl-1")
          slot(v-if="slots['slot:appendIcon']" name="slot:appendIcon")
          f-svg-icon(
            v-else
            iconName="keyboard_arrow_right"
            size="20"
            class="transform"
            :class="[isExpand ? '-rotate-90 text-grey-200' : 'rotate-90 text-grey-600']"
          )
    template(#content="{ collapsePopper }")
      f-list(class="border border-grey-150" :style="{ width: contentWidth + 'px' }")
        div(v-if="searchBox" class="pt-1.5 pb-1")
          f-input-text(v-model:textValue="searchInput" size="sm" prependIcon="search" class="px-3.5")
          div(class="mx-2 border-b border-grey-200 pt-2")
        f-scrollbar-container(v-if="searchedOptionList.length > 0" :style="{ 'max-height': 36 * maxLength + 'px' }")
          f-list-item(
            v-for="(option, index) in searchedOptionList"
            :class="[index === currentIndex ? 'bg-grey-100' : '']"
            @click="select(option); collapsePopper() "
            data-cy="list-item"
          )
            p(class="text-grey-600") {{ option[keyOptionDisplay] }}
        div(v-if="canAddNewOption && !isOptionExist")
          f-list-item(v-if="searchInput !== ''" @click="addNewOption(); collapsePopper()" data-cy="list-item") {{ searchInput }}
        p(v-if="!canAddNewOption && searchedOptionList.length === 0" class="h-9 pl-7.5 text-grey-900 text-body2 flex items-center") No search result
</template>

<script>
export default {
  name: 'FInputSelect'
}
</script>

<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { nextTick, useSlots } from 'vue'

const emit = defineEmits(['expand', 'collapse', 'select', 'update:selectValue', 'addNewOption'])
const props = defineProps({
  /**
   * v-model:selectValue
   */
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
  /**
   * ```
   * [
   *   {
   *     [keyOptionDisplay]: String,
   *     [keyOptionValue]: String,
   *   }
   * ]
   * ```
   */
  optionList: {
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
  /**
   * inherit from `FInputContainer.vue`
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * inherit from `FInputContainer.vue`
   *
   * only work when `label` has been setted
   */
  required: {
    type: Boolean,
    default: false
  },
  /**
   *  Only work when `searchBox` is true and when `canAddNewOption` is true, the `addNewOption` event must also be handled
   */
  canAddNewOption: {
    type: Boolean,
    default: false
  }
})

const slots = useSlots()

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
    ? props.optionList.findIndex(option => option[props.keyOptionValue] === innerSelectValue.value)
    : -1
})

const searchedOptionList = computed(() => props.optionList.filter(option => option[props.keyOptionDisplay].toLocaleLowerCase().includes(searchInput.value.toLocaleLowerCase())))

const isOptionExist = computed(() => props.optionList.some(option => option[props.keyOptionDisplay] === searchInput.value))

const addNewOption = async () => {
  // create new option first, then after component update selecting the option
  emit('addNewOption', searchInput.value)
  await nextTick()
  select(props.optionList[props.optionList.length - 1])
}
</script>
