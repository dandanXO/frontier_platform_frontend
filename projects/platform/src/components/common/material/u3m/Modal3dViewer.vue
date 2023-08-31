<template lang="pug">
model-editor(
  :dpi="u3m.dpi"
  :u3mPath="u3m.u3mSpecUrl"
  :baseImgUrl="u3m.baseImgUrl"
  :normalImgUrl="u3m.normalImgUrl"
  :roughImgUrl="u3m.roughImgUrl"
  :dispImgUrl="u3m.dispImgUrl"
  @close="$store.dispatch('helper/closeModalBehavior')"
)
</template>

<script setup lang="ts">
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'
import useLogSender from '@/composables/useLogSender'

const props = defineProps<{
  materialId: number
  u3m: Required<MaterialCustomU3m | MaterialU3m>
}>()

const logSender = useLogSender()

logSender.createViewerLog(props.materialId)
</script>
