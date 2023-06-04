<template lang="pug">
div(
  class="w-8 h-8 rounded text-grey-600 hover:bg-grey-150 active:bg-grey-200 flex items-center justify-center cursor-pointer"
  :class="{ 'bg-grey-150': active }"
)
  f-svg-icon(:iconName="iconName" size="24")
</template>

<script setup lang="ts">
defineProps<{
  iconName: string
  active?: boolean
}>()
</script>

<style scoped></style>
