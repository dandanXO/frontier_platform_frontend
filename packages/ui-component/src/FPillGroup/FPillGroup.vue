<template lang="pug">
div(class="flex items-center rounded border border-primary-border overflow-hidden")
  template(v-for="(option, index) in optionList" :key="option.text")
    f-pill(
      @click="$emit('update:inputValue', option.selectValue)"
      :active="selectedIndex === index"
      class="rounded-none border-none"
      :size="size"
      :disabled="disabled"
    )
      f-svg-icon(v-if="option.icon" :iconName="getIcon(option)" size="24")
      span(v-if="option.label" class="text-body2 font-bold") {{ option.label }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SIZE } from '@frontier/constants'
interface Option {
  label?: string | null
  selectValue: any
  icon?: string
  selectedIcon?: string
}

const props = withDefaults(
  defineProps<{
    optionList: Option[]
    inputValue: Option['selectValue']
    size?: SIZE
    disabled?: boolean
  }>(),
  {}
)

defineEmits<{
  (e: 'update:inputValue', v: Option['selectValue']): void
}>()

const selectedIndex = computed(() =>
  props.optionList.findIndex(
    (option) => option.selectValue === props.inputValue
  )
)

const getIcon = (option: Option) => {
  const selectedIcon = option.selectedIcon ? option.selectedIcon : option.icon
  return props.inputValue === option.selectValue ? selectedIcon! : option.icon!
}
</script>

<script lang="ts">
export default {
  name: 'FPillGroup',
}
</script>
