<template lang="pug">
div(class="flex items-center bg-grey-50 w-fit px-3.5 h-8.5 rounded")
  div(class="w-3 h-3 rounded-sm mr-2.5" :class="[label.color]")
  p(class="text-body2 text-grey-900") {{ label.text }}
</template>

<script setup>
import { UPLOAD_PROGRESS } from '@/utils/constants'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  status: {
    type: Number,
    required: true
  }
})

const { t } = useI18n()

const label = computed(() => {
  let text
  let color
  switch (props.status) {
    case UPLOAD_PROGRESS.IN_QUEUE:
      text = t('PP0004')
      color = 'bg-cyan-300'
      break
    case UPLOAD_PROGRESS.PROCESSING:
      text = t('PP0005')
      color = 'bg-yellow-400'
      break
    case UPLOAD_PROGRESS.UNSUCCESSFUL:
      text = t('PP0007')
      color = 'bg-red-400'
      break
    case UPLOAD_PROGRESS.COMPLETE:
      text = t('PP0006')
      color = 'bg-primary-400'
      break
    case UPLOAD_PROGRESS.CANCELED:
      text = t('UU0099')
      color = 'bg-grey-600'
      break
    default:
      text = t('PP0004')
      color = 'bg-cyan-300'
  }

  return { text, color }
})
</script>
