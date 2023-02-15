<template lang="pug">
div(
  class="border rounded border-red-600 bg-red-900 px-4 py-3 flex flex-row items-center justify-center gap-x-4"
)
  f-svg-icon(iconName="info_outline" size="16" class="text-red-400")
  span(class="text-bold text-caption text-grey-100 leading-1.6")
    slot
</template>

<script setup lang="ts"></script>

<style scoped></style>
