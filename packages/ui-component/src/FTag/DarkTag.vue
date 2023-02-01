<template lang="pug">
div(:class="classes")
  slot
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  active?: boolean
}>()

const classes = computed(() => {
  const baseClass = [
    'w-fit',
    'flex',
    'items-center',
    'rounded-full',
    'whitespace-nowrap',
    'cursor-pointer',
    'box-border',
    'bg-grey-700',
    'border',
    'border-grey-500',
    'h-8.5',
    'px-5',
    'py-2.5',
    'font-bold',
    'text-body2',
    'text-grey-100',
    'hover:bg-grey-300',
    'hover:border-grey-300',
  ]

  if (props.active)
    baseClass.push('!bg-primary-0', '!border-primary-400', '!text-primary-400')

  return baseClass
})
</script>
