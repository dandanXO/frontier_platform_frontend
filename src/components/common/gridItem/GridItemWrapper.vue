<template lang="pug">
div(@mouseenter="isHover = true" @mouseleave="isHover = false" class="relative")
  div(class="w-full aspect-square relative")
    div(v-if="isSelectable && (!selectOnHover || isHover || haveSelectedMoreThanOne)" class="absolute z-10 top-0 left-0 w-full h-11")
      div(class="bg-linear w-full h-full rounded-t-md")
      input-checkbox(
        v-if="isMultiSelect"
        v-model:inputValue="innerSelectedValue"
        :value="JSON.stringify(selectValue)"
        size="24"
        id="input-checkbox"
        class="absolute top-3 left-3"
        iconColor="text-black-0"
        uncheckColor="text-black-0"
        @click.stop
      )
      input-radio(
        v-else
        v-model:inputValue="innerSelectedValue"
        :value="JSON.stringify(selectValue)"
        size="20"
        id="input-radio"
        class="absolute top-3 left-3"
        checkColor="text-black-0"
        uncheckColor="text-black-0"
        @click.stop
      )
    div(v-if="isHover" class="absolute z-10 top-3 right-3")
      slot(name="hover-corner-top-right")
    div(v-if="isHover" class="absolute z-10 bottom-3 left-3")
      slot(name="hover-corner-bottom-right")
    tooltip(
      v-if="isHover && optionList.length > 0 && !haveSelectedMoreThanOne"
      class="absolute z-10 bottom-3 right-3 cursor-pointer"
      placement="right-start"
      :showArrow="false"
      :manual="true"
      :offset="[0, 8]"
      @click.stop
    )
      template(#trigger)
        svg-icon(iconName="more_vert" size="20" class="text-black-0 hover:text-black-200" )
      template(#content)
        list(class="w-55")
          template(v-for="(block, index) in optionList")
            list-item(v-for="option in block" :disabled="!!option.disabled" @click.stop="$emit('click:option', option)") {{ option.name }}
            div(v-if="index !== optionList.length - 1" class="mx-2 my-1 h-px bg-black-400")
    slot(name="content")
    div(v-if="isHover" class="absolute inset-0 w-full h-full bg-black-900/70 rounded-md flex justify-center items-center")
      slot(name="hover-content")
  div(class="text-caption font-bold mt-2 flex items-center justify-between text-primary")
    p(class="line-clamp-1 !break-all")
      slot(name="title" :isHover="isHover")
    slot(name="title-right-icon")
  slot(name="caption")
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isSelectable: {
    type: Boolean,
    default: false
  },
  selectOnHover: { // false 時不用 hover 就可以選取
    type: Boolean,
    default: true
  },
  isMultiSelect: {
    type: Boolean,
    default: true
  },
  selectedValue: { // 用於綁定在 input-checkbox 或 input radio 儲存 selectValue 的變數
    type: [Array, String],
    default: []
  },
  selectValue: { // 選取時要儲存的值
    validator: v => true
  },
  optionList: {
    type: Array,
    default: () => [] // [[{ name: '', func: () => { }, disabled: false }]]
  }
})
const emit = defineEmits(['update:selectedValue', 'click:option'])

const isHover = ref(false)

const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v)
})

const haveSelectedMoreThanOne = computed(() => props.isSelectable && props.selectedValue.length > 0)
</script>
