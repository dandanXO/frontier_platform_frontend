<template lang="pug">
f-badge(type="neutral" size="medium" class="flex flex-row items-center")
  p(class="text-body2 text-grey-900") {{ label.text }}
  f-svg-icon(
    v-if="[U3M_STATUS.IN_QUEUE, U3M_STATUS.PROCESSING].includes(status)"
    iconName="loading"
    size="16"
    class="text-primary-400"
  )
</template>

<script setup lang="ts">
import { U3M_STATUS } from '@/utils/constants'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  status: U3M_STATUS
}>()

const { t } = useI18n()

const label = computed(() => {
  let text
  let color
  switch (props.status) {
    case U3M_STATUS.UNQUALIFIED:
    case U3M_STATUS.INITIAL:
      text = t('EE0019')
      color = null
      break
    case U3M_STATUS.IN_QUEUE:
      text = t('PP0004')
      color = 'bg-cyan-300'
      break
    case U3M_STATUS.PROCESSING:
      text = t('PP0005')
      color = 'bg-yellow-400'
      break
    case U3M_STATUS.UNSUCCESSFUL:
      text = t('PP0007')
      color = 'bg-red-400'
      break
    case U3M_STATUS.COMPLETED:
      text = t('PP0006')
      color = 'bg-primary-400'
      break
    default:
      text = t('EE0019')
      color = null
  }

  return { text, color }
})
</script>
