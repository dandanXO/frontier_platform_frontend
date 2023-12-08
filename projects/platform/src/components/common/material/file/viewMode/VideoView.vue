<template lang="pug">
div(class="relative flex justify-center items-center w-full h-full")
  video(class="w-full h-full object-contain" controls)
    source(:src="src" type="video/mp4")
</template>

<script setup lang="ts">
defineProps<{
  src: string
}>()
</script>

<style lang="scss" scoped></style>
