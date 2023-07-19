<template lang="pug">
div(:class="classes")
  slot
</template>

<script lang="ts">
export default {
  name: 'FLabel',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { THEME, SIZE } from '../constants'

const props = withDefaults(
  defineProps<{
    theme?: `${THEME}`
    size?: `${SIZE.LG}` | `${SIZE.SM}`
    active?: boolean
  }>(),
  {
    theme: THEME.LIGHT,
    size: SIZE.LG,
    active: false,
  }
)

const classes = computed(() => {
  const baseClass = [
    'w-fit',
    'flex',
    'items-center',
    'rounded-full',
    'whitespace-nowrap',
    'cursor-pointer',
    'box-border',
    'font-bold',
  ]

  switch (props.size) {
    case SIZE.LG:
      baseClass.push('text-body2', 'h-8.5', 'px-5', 'py-2.5', 'border')
      if (props.theme === THEME.LIGHT) {
        baseClass.push(
          'bg-grey-50',
          'text-grey-900',
          'hover:bg-grey-900',
          'hover:text-grey-0',
          'border-grey-250'
        )
        if (props.active) {
          baseClass.push('!bg-grey-900', '!text-grey-0')
        }
      } else {
        baseClass.push(
          'bg-grey-700',
          'text-grey-100',
          'border-grey-600',
          'hover:bg-grey-800',
          'hover:text-grey-0',
          'hover:border-grey-700'
        )
        if (props.active) {
          baseClass.push('!bg-primary-700', '!text-primary-300', '!border-none')
        }
      }
      break
    case SIZE.SM:
      baseClass.push('text-caption', 'h-6', 'px-2.5', 'py-1')
      if (props.theme === THEME.LIGHT) {
        baseClass.push('bg-grey-100', 'text-grey-600', 'hover:bg-grey-150')
        if (props.active) {
          baseClass.push('!bg-grey-150')
        }
      }
      {
        baseClass.push(
          'bg-grey-700',
          'text-grey-100',
          'hover:bg-grey-800',
          'hover:text-grey-0'
        )
      }
      break
  }

  return baseClass
})
</script>
