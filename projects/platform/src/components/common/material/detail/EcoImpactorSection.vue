<template lang="pug">
div(class="-mt-5")
  div(
    v-if="!hasScannedImage || !material.metaData.isComplete || material.tagInfo.certificationTagList.length === 0"
    class="h-15 bg-grey-50 flex items-center mt-6 pl-4 gap-x-8"
  )
    div(class="flex items-center")
      f-svg-icon(iconName="info_outline" size="20" class="text-grey-600")
      p(
        v-if="!hasScannedImage || !material.metaData.isComplete"
        class="pl-3 text-grey-600 text-caption leading-1.6"
      ) {{ $t('EE0126') }}
      p(
        v-else-if="material.tagInfo.certificationTagList.length === 0"
        class="pl-3 text-grey-600 text-caption leading-1.6"
      ) {{ $t('EE0128') }}
    div(class="flex items-center cursor-pointer" @click="editMaterial.func(material)")
      p(class="pr-1.5 text-cyan-400 text-caption leading-1.6") {{ $t('EE0127') }}
      f-svg-icon(iconName="arrow_forward" size="16" class="text-cyan-400")
  material-detail-environmental-indicator(class="mt-3" :material="material")
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { type Material } from '@frontier/platform-web-sdk'
import useMaterial from '@/composables/material/useMaterial'
import useAssets from '@/composables/useAssets'
import MaterialDetailEnvironmentalIndicator from './MaterialDetailEnvironmentalIndicator.vue'

const props = defineProps<{ material: Material }>()
const { editMaterial } = useAssets()
const { hasScannedImage } = useMaterial(ref(props.material))
</script>
