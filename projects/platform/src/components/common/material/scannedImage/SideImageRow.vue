<template lang="pug">
div(class="flex-1 flex flex-col items-center pt-5 pb-10 rounded bg-grey-50")
  span(class="text-body2 text-grey-900 font-bold") {{ title }}
  div(class="mt-3 w-30 h-30")
    img(
      v-if="originalThumbnailUrl"
      class="w-full h-full rounded"
      :src="originalThumbnailUrl"
    )
    div(
      v-else
      class="rounded w-full h-full border border-grey-250 bg-grey-100 flex items-center justify-center text-h4 font-bold text-grey-250"
    ) {{ $t('RR0103') }}
  div(v-if="newImagePreviewUrl")
    div(class="flex flex-row gap-x-3")
      span(class="") Replaced By
      f-svg-icon(
        class="text-grey-600 cursor-pointer"
        iconName="delete"
        size="24"
        @click="emits('delete')"
      )
    div(class="mt-3 w-30 h-30")
      img(class="w-full h-full rounded" :src="newImagePreviewUrl")
  div(v-if="!newImagePreviewUrl" class="flex flex-col gap-y-1")
    f-button(
      class="mt-16"
      type="primary"
      size="sm"
      prependIcon="add"
      @click="emits('upload')"
    ) {{ $t('Replace Scanned Image') }}
    div(class="text-caption2 text-grey-600 leading-1.3")
      p Supported file formats: jpg, jpeg, png
      p Maximum file size: 100 MB (per file)
      p Minimum image size: 800 x 800 px
      p Minimum Resolution: 600 DPI
</template>

<script setup lang="ts">
defineProps<{
  title: string
  originalThumbnailUrl?: string | null
  newImagePreviewUrl: string | null
}>()

const emits = defineEmits<{
  (e: 'upload'): void
  (e: 'delete'): void
}>()
</script>

<style scoped></style>
