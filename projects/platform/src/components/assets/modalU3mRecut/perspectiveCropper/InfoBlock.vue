<template lang="pug">
div(class="flex flex-row items-center gap-1 text-grey-100 text-body2 font-bold")
  f-svg-icon(size="20" :iconName="iconName")
  span {{ text }}
</template>

<script setup lang="ts">
defineProps<{
  iconName: string
  text: string
}>()
</script>

<style scoped></style>
