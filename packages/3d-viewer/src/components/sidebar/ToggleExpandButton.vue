<template lang="pug">
div(class="absolute top-0 right-[-16px] w-8 h-[108px] text-grey-150 cursor-pointer")
  div(
    class="flex items-center justify-center w-8 h-[108px] bg-grey-900 border rounded-[20px] border-grey-800"
  )
    div(class="absolute h-full w-[15px] left-0 top-0 bg-grey-900")
  f-svg-icon(
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    size="20"
    :iconName="expanded ? 'keyboard_arrow_left' : 'keyboard_arrow_right'"
  )
</template>

<script setup lang="ts">
defineProps<{
  expanded: boolean
}>()
</script>

<style scoped></style>
