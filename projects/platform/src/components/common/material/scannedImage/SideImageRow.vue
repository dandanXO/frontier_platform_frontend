<template lang="pug">
div(class="flex-1 flex flex-col items-center pt-5 pb-10 rounded bg-grey-50")
  span(class="text-body2 text-grey-900 font-bold") {{ title }}
  div(class="mt-3 w-30 h-30")
    img(
      v-if="originalThumbnailUrl"
      class="w-full h-full rounded object-contain"
      :src="originalThumbnailUrl"
    )
    div(
      v-else
      class="rounded w-full h-full border border-grey-250 bg-grey-100 flex items-center justify-center text-h4 font-bold text-grey-250"
    ) {{ $t('RR0103') }}
  div(v-if="newImagePreviewUrl")
    div(class="flex flex-row gap-x-3")
      span {{ $t('MI0090') }}
      f-svg-icon(
        class="text-grey-600 cursor-pointer"
        iconName="delete"
        size="24"
        @click="emits('delete')"
      )
    div(class="mt-3 w-30 h-30")
      img(class="w-full h-full rounded object-contain" :src="newImagePreviewUrl")
  div(v-if="!newImagePreviewUrl" class="flex flex-col gap-y-1")
    f-button(
      class="mt-16"
      type="primary"
      size="sm"
      prependIcon="add"
      @click="emits('upload')"
    ) {{ $t('UU0136') }}
    div(class="text-caption2 text-grey-600 leading-1.3")
      p {{ $t('RR0243') }} jpg, jpeg, png
      p {{ $t('RR0145') }} 100 MB (per file)
      p {{ $t('RR0244') }} 800 x 800 px
      p {{ $t('DD0075') }}
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
