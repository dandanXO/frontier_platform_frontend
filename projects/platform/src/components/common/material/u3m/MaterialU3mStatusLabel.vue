<template lang="pug">
div(
  :class="label.containerClass"
  class="rounded-sm border px-1 py-0 flex max-w-48 justify-center items-center text-xs font-normal"
)
  p(:class="label.textClass") {{ label.text }}
  f-svg-icon(
    v-if="[U3M_STATUS.IN_QUEUE, U3M_STATUS.PROCESSING].includes(status)"
    iconName="loading"
    size="16"
    :class="label.iconClass"
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
  let containerClass
  let textClass
  let iconClass

  switch (props.status) {
    case U3M_STATUS.UNQUALIFIED:
    case U3M_STATUS.INITIAL:
      text = t('EE0019')
      containerClass = 'border-grey-200-v1 bg-grey-50-v1'
      textClass = 'text-grey-900-v1'
      iconClass = 'text-grey-900-v1'
      break
    case U3M_STATUS.IN_QUEUE:
      text = t('PP0004')
      containerClass = 'border-cyan-200-v1 bg-cyan-50-v1'
      textClass = 'text-cyan-500-v1'
      iconClass = 'text-cyan-500-v1'
      break
    case U3M_STATUS.PROCESSING:
      text = t('PP0005')
      containerClass = 'border-cyan-200-v1 bg-cyan-50-v1'
      textClass = 'text-cyan-500-v1'
      iconClass = 'text-cyan-500-v1'
      break
    case U3M_STATUS.UNSUCCESSFUL:
      text = t('PP0007')
      containerClass = 'border-red-200-v1 bg-red-50-v1'
      textClass = 'text-red-500-v1'
      iconClass = 'text-red-500-v1'
      break
    case U3M_STATUS.COMPLETED:
      text = t('PP0006')
      containerClass = 'border-green-200-v1 bg-green-50-v1'
      textClass = 'text-green-500-v1'
      iconClass = 'text-green-500-v1'
      break
    // Note: If you need to handle a "canceled" status, you can add it here:
    // case 'CANCELED': // or whatever the actual enum value would be
    //   text = t('UU0099') // "Canceled" translation key
    //   containerClass = 'border-yellow-200-v1 bg-yellow-50-v1'
    //   textClass = 'text-yellow-500-v1'
    //   iconClass = 'text-yellow-500-v1'
    //   break
    default:
      text = t('EE0019')
      containerClass = 'border-grey-200-v1 bg-grey-50-v1'
      textClass = 'text-grey-900-v1'
      iconClass = 'text-grey-900-v1'
  }

  return { text, containerClass, textClass, iconClass }
})
</script>
