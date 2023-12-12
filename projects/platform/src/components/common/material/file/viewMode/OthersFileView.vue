<template lang="pug">
div(
  v-if="extension === Extension.ZIP"
  class="flex justify-center items-center w-full h-ful"
)
  f-svg-icon(iconName="file_zip" size="200" class="text-grey-400")
f-svg-icon(v-else iconName="file" size="50" class="text-grey-400")
</template>

<script setup lang="ts">
import { Extension } from '@frontier/platform-web-sdk'

defineProps<{
  extension: Extension
}>()
</script>

<style scoped></style>
