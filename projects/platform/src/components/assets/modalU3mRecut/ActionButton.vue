<template lang="pug">
div(
  class="flex flex-col flex-1 justify-center align-middle p-2 gap-1 rounded"
  :class="containerClass"
  :onClick="onClick"
)
  f-svg-icon(v-if="iconName" :iconName="iconName" size="24" class="self-center")
  p(class="text-sm text-center") {{ title }}
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  disabled?: boolean
  active?: boolean
  onClick?: VoidFunction
  title: string
  iconName?: string
}
const props = defineProps<Props>()

const containerClass = computed(() => {
  const result = []

  switch (true) {
    case props.active:
      result.push('bg-brand-solid text-primary-inverse')
      break
    case props.disabled:
      result.push(
        'bg-tertiary border border-disabled text-disabled cursor-not-allowed'
      )
      break
    default:
      result.push(
        'bg-primary cursor-pointer border border-secondary-border text-primary-inverse'
      )
      break
  }

  return result
})
</script>
