<template lang="pug">
div(class="flex")
  div(class="relative flex items-center")
    div(class="grid grid-cols-3 gap-1.5")
      f-tooltip-standard(:tooltipMessage="$t('PP0004')")
        template(#slot:tooltip-trigger)
          div(
            class="h-3 w-24 rounded-l"
            :class="[status === UPLOAD_PROGRESS.PROCESSING ? 'bg-primary-400/80' : status === UPLOAD_PROGRESS.IN_QUEUE || status === UPLOAD_PROGRESS.COMPLETE ? 'bg-primary-400' : 'bg-grey-250']"
          )
      f-tooltip-standard(:tooltipMessage="$t('PP0005')")
        template(#slot:tooltip-trigger)
          div(
            class="h-3 w-24"
            :class="[status === UPLOAD_PROGRESS.PROCESSING || status === UPLOAD_PROGRESS.COMPLETE ? 'bg-primary-400' : 'bg-grey-250']"
          )
      f-tooltip-standard(:tooltipMessage="$t('PP0006')")
        template(#slot:tooltip-trigger)
          div(
            class="h-3 w-24 rounded-r"
            :class="[status === UPLOAD_PROGRESS.COMPLETE ? 'bg-primary-400' : 'bg-grey-250']"
          )
    div(class="absolute top-5.5 leading-1.6 text-caption")
      slot
  f-svg-icon(
    v-show="status === UPLOAD_PROGRESS.COMPLETE"
    iconName="done"
    size="20"
    class="w-5 text-primary-400 flex-shrink-0 ml-1.5"
  )
</template>

<script setup>
import { UPLOAD_PROGRESS } from '@/utils/constants'

defineProps({
  status: {
    type: Number,
    required: true,
  },
})
</script>
