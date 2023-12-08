<template lang="pug">
div(
  v-if="extension === EXTENSION.ZIP"
  class="flex justify-center items-center w-full h-full bg-grey-250"
)
  f-svg-icon(iconName="file_zip" size="40" class="text-grey-0")
f-svg-icon(v-else iconName="file" size="50" class="text-grey-0")
</template>

<script setup lang="ts">
import { EXTENSION } from '@frontier/constants'

defineProps<{
  extension: EXTENSION
}>()
</script>

<style scoped></style>
