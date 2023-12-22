<template lang="pug">
div(class="flex justify-center items-center w-full h-ful")
  f-svg-icon(
    v-if="extension === ZIP"
    iconName="file_zip"
    size="200"
    class="text-grey-400"
  )
  img(v-else-if="extension === YDT" class="w-50 h-50" src="@/assets/images/YDT.png")
  img(v-else-if="extension === SCCH" class="w-50 h-50" src="@/assets/images/SCCH.png")
  f-svg-icon(v-else iconName="file" size="200" class="text-grey-400")
</template>

<script setup lang="ts">
import { Extension } from '@frontier/platform-web-sdk'

defineProps<{
  extension: Extension
}>()

const { ZIP, YDT, SCCH } = Extension
</script>

<style scoped></style>
