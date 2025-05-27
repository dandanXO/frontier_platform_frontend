<template>
  <div :class="[stringLength <= maxLength ? '' : 'text-red-500-v1']">
    {{ stringLength }}/{{ maxLength }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  maxLength: {
    type: Number,
    default: 80,
  },
})

const stringLength = computed(() => {
  return props.text.length
})
</script>

<style></style>
