<template lang="pug">
info-block(:iconName="iconName" :text="text")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoBlock from '@/components/assets/modalU3mRecut/perspectiveCropper/InfoBlock.vue'
import type { Dimension } from '@/utils/perspectiveCropper'

const props = defineProps<{
  iconName: string
  cropText: string
  dimension: Dimension
}>()

const { t } = useI18n()

const text = computed(() => {
  return `${props.cropText} W ${props.dimension.cm.width} x H ${
    props.dimension.cm.height
  } ${t('EE0099')}`
})
</script>
