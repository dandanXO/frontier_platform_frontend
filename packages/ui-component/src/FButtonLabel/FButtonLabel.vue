<template lang="pug">
button(
  class="rounded-xl flex items-center"
  :class="[btnSize, btnType, active ? activeClass : '']"
)
  slot
</template>

<script lang="ts">
export default {
  name: 'FButtonLabel',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SIZE, THEME } from '../constants'

const props = withDefaults(
  defineProps<{
    theme?: `${THEME}`
    size?: `${SIZE.LG}` | `${SIZE.SM}`
    active?: boolean
  }>(),
  {
    size: SIZE.SM,
    theme: THEME.LIGHT,
    active: false,
  }
)
const btnSize = computed(() => {
  switch (props.size) {
    case SIZE.LG:
      return ['text-body2', 'h-6', 'px-2.5']
    case SIZE.SM:
      return ['text-caption', 'h-5', 'px-2']
    default:
      return []
  }
})

const btnType = computed(() => {
  if (props.theme === THEME.LIGHT) {
    return [
      'bg-grey-100',
      'text-grey-900',
      'enabled:hover:bg-primary-50',
      'enabled:hover:text-primary-400',
      'disabled:text-grey-250',
    ]
  } else if (props.theme === THEME.DARK) {
    return [
      'bg-grey-700',
      'text-grey-100',
      'hover:text-primary-300',
      'hover:bg-primary-700',
      'disabled:bg-grey-700',
      'disabled:text-grey-900',
    ]
  } else {
    throw new Error('invalid theme, only accept "light" or "dark"')
  }
})

const activeClass = computed(() => {
  if (props.theme === THEME.LIGHT) {
    return 'bg-primary-50 !text-primary-400'
  } else if (props.theme === THEME.DARK) {
    return 'bg-primary-700 !text-primary-300'
  } else {
    throw new Error('invalid theme, only accept "light" or "dark"')
  }
})
</script>
