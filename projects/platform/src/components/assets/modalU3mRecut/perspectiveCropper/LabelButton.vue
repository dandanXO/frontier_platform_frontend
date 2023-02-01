<template lang="pug">
div(:class="classes" @click.stop="handleClick")
  slot
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  active?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
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
    'h-6',
    'px-2.5',
    'py-[5px]',
    'text-body2',
    'text-grey-100',
    'hover:bg-grey-300',
  ]

  if (props.active) {
    baseClass.push('!bg-primary-0', '!border-primary-400', '!text-primary-400')
  }

  if (props.disabled) {
    baseClass.push('!text-grey-500 !cursor-default !bg-grey-700')
  }

  return baseClass
})

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>
