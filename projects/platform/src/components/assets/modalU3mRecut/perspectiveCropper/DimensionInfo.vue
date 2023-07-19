<template lang="pug">
div(class="flex flex-row items-center gap-2")
  info-name(:iconName="iconName" :text="text")
  span(class="text-body2 text-grey-250") {{ dimensionText }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoName from '@/components/assets/modalU3mRecut/perspectiveCropper/InfoName.vue'
import { toDP1 } from '@/utils/cropper'
import type { Dimension } from '@/types'

const props = defineProps<{
  iconName: string
  text: string
  dimension: Dimension
}>()

const { t } = useI18n()

const dimensionText = computed(() => {
  const { dimension } = props
  const widthInCm = toDP1(dimension.cm.width)
  const heightInCm = toDP1(dimension.cm.height)
  return `W ${widthInCm} x H ${heightInCm} ${t('EE0099')}`
})
</script>
