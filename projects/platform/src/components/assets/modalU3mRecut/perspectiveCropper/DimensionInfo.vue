<template lang="pug">
info-block(:iconName="iconName" :text="text")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoBlock from '@/components/assets/modalU3mRecut/perspectiveCropper/InfoBlock.vue'
import { toDP1 } from '@/utils/cropper'
import type { Dimension } from '@/utils/perspectiveCropper'

const props = defineProps<{
  iconName: string
  cropText: string
  dimension: Dimension
}>()

const { t } = useI18n()

const text = computed(() => {
  const { cropText, dimension } = props
  const widthInCm = toDP1(dimension.cm.width)
  const heightInCm = toDP1(dimension.cm.height)
  return `${cropText} W ${widthInCm} x H ${heightInCm} ${t('EE0099')}`
})
</script>
