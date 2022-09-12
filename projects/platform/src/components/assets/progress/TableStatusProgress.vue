<template lang="pug">
div(class="flex")
  div(class="relative flex items-center")
    div(class="grid grid-cols-3 gap-1.5")
      f-tooltip
        template(#trigger)
          div(class="h-3 w-24 rounded-l"  :class="[status === UPLOAD_PROGRESS.PROCESSING ? 'bg-brand/80' : status === UPLOAD_PROGRESS.IN_QUEUE || status === UPLOAD_PROGRESS.COMPLETE ? 'bg-brand' : 'bg-black-400']")
        template(#content)
          p {{ $t('PP0004') }}
      f-tooltip
        template(#trigger)
          div(class="h-3 w-24"  :class="[status === UPLOAD_PROGRESS.PROCESSING || status === UPLOAD_PROGRESS.COMPLETE ? 'bg-brand' : 'bg-black-400']")
        template(#content)
          p {{ $t('PP0005') }}
      f-tooltip
        template(#trigger)
          div(class="h-3 w-24 rounded-r"  :class="[status === UPLOAD_PROGRESS.COMPLETE ? 'bg-brand' : 'bg-black-400']")
        template(#content)
          p {{ $t('PP0006') }}
    div(class="absolute top-5.5 leading-1.6 text-caption")
      slot
  f-svg-icon(v-show="status === UPLOAD_PROGRESS.COMPLETE" iconName="done" size="20" class="w-5 text-brand flex-shrink-0 ml-1.5")
</template>

<script setup>
import { UPLOAD_PROGRESS } from '@/utils/constants'

defineProps({
  status: {
    type: Number,
    required: true
  }
})
</script>
