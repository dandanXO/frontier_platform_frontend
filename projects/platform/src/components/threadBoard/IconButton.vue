<template lang="pug">
div(class="rounded text-grey-600 hover:bg-grey-150 cursor-pointer")
  f-svg-icon(:iconName="iconName" :size="size")
</template>

<script setup lang="ts">
defineProps<{
  iconName: string
  size: string
  active?: boolean
}>()
</script>

<style scoped></style>
