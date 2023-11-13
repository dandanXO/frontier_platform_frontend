<template lang="pug">
div(class="flex items-center")
  template(v-for="(option, index) in optionList" :key="option.text")
    div(
      :class="[getClasses(index, option.selectValue), { 'rounded-l': index === 0, 'rounded-r': index === optionList.length - 1 }]"
      @click="$emit('update:inputValue', option.selectValue)"
    )
      f-svg-icon(v-if="option.icon" :iconName="getIcon(option)" size="24")
      span(v-if="option.label" class="text-body2 font-bold") {{ option.label }}
</template>

<script setup lang="ts">
import { THEME } from '@frontier/constants'
import { computed } from 'vue'

interface Option {
  label?: string
  selectValue: string | number
  icon?: string
  selectedIcon?: string
}

const props = withDefaults(
  defineProps<{
    theme?: `${THEME}`
    optionList: Option[]
    inputValue: Option['selectValue']
  }>(),
  {
    theme: THEME.LIGHT,
  }
)

defineEmits<{
  (e: 'update:inputValue', v: Option['selectValue']): void
}>()

const selectedIndex = computed(() =>
  props.optionList.findIndex(
    (option) => option.selectValue === props.inputValue
  )
)

const getClasses = (index: number, selectValue: Option['selectValue']) => {
  const classes = [
    'flex',
    'flex-row',
    'items-center',
    'gap-x-1',
    'py-0.5',
    'px-1.5',
    'border-y',
    'min-h-7.5',
    'cursor-pointer',
  ]

  if (index === 0) {
    classes.push('border-x')
  } else {
    classes.push('border-r')
  }

  if (index === selectedIndex.value) {
    classes.push('border-x')
  }

  if (
    selectedIndex.value + 1 === index &&
    index !== props.optionList.length - 1
  ) {
    classes.push('!border-l-0')
  } else if (selectedIndex.value - 1 === index) {
    classes.push('!border-r-0')
  }

  if (props.theme === THEME.LIGHT) {
    props.inputValue === selectValue
      ? classes.push('border-primary-400', 'text-primary-400', 'bg-primary-50')
      : classes.push('border-grey-250', 'text-grey-600', 'bg-grey-0')
  } else {
    props.inputValue === selectValue
      ? classes.push('border-primary-400', 'text-primary-400', 'bg-primary-900')
      : classes.push('border-grey-600', 'text-grey-250', 'bg-grey-800')
  }

  return classes
}

const getIcon = (option: Option) => {
  const selectedIcon = option.selectedIcon ? option.selectedIcon : option.icon
  return props.inputValue === option.selectValue ? selectedIcon : option.icon
}
</script>

<script lang="ts">
export default {
  name: 'FInputTap',
}
</script>
