<template lang="pug">
div(class="relative w-6 h-full bg-grey-900 border border-grey-800")
  toggle-expand-button(:expanded="false" @click="emits('toggleExpand')")
</template>

<script setup lang="ts">
import ToggleExpandButton from './ToggleExpandButton.vue'

const emits = defineEmits<{
  (e: 'toggleExpand'): void
}>()
</script>

<style scoped></style>
