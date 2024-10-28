<template lang="pug">
div(class="flex py-3 justify-between text-grey-700-v1 items-center")
  p(class="text-sm") {{ label }}
  p(class="text-base") {{ displayValue }}
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: any
}>()

const displayValue = computed(() => {
  if (props.value === 'pending') {
    return '-'
  }
  const numberOfDecimals = 2
  const parsedValue = parseFloat(props.value).toFixed(numberOfDecimals)
  return !isNaN(Number(parsedValue)) ? parsedValue : 'N/A'
})
</script>
